'use client';

import { useEffect, useState, useRef } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface Product {
  id: string;
  name: string;
  nameHe: string;
  description: string;
  descriptionHe: string;
  category: string;
  basePrice: number;
  images: string[];
  inStock: boolean;
  featured: boolean;
  minOrderQty: number;
}

const categoryNames: Record<string, string> = {
  rings: 'טבעות', necklaces: 'שרשראות', earrings: 'עגילים', bracelets: 'צמידים',
};

export default function AdminProductsPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [loadingData, setLoadingData] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editProduct, setEditProduct] = useState<Product | null>(null);
  const [pendingFiles, setPendingFiles] = useState<File[]>([]);
  const [existingImages, setExistingImages] = useState<string[]>([]);
  const [uploading, setUploading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState('');
  const [form, setForm] = useState({
    name: '', nameHe: '', description: '', descriptionHe: '',
    category: 'rings', basePrice: '', inStock: true, featured: false, minOrderQty: '1',
  });

  useEffect(() => {
    if (!loading && (!user || user.role !== 'admin')) router.push('/login');
  }, [user, loading, router]);

  const fetchProducts = () => {
    fetch('/api/admin/products')
      .then(r => r.json())
      .then(data => { setProducts(data.products || []); setLoadingData(false); });
  };

  useEffect(() => { if (user?.role === 'admin') fetchProducts(); }, [user]);

  const resetForm = () => {
    setForm({ name: '', nameHe: '', description: '', descriptionHe: '', category: 'rings', basePrice: '', inStock: true, featured: false, minOrderQty: '1' });
    setPendingFiles([]);
    setExistingImages([]);
    setEditProduct(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const body = {
      ...form,
      basePrice: Number(form.basePrice),
      minOrderQty: Number(form.minOrderQty) || 1,
      images: existingImages,
      ...(editProduct ? { id: editProduct.id } : {}),
    };

    const res = await fetch('/api/admin/products', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
    const data = await res.json();
    const productId = data.product?.id || editProduct?.id;

    // Upload pending images
    if (pendingFiles.length > 0 && productId) {
      setUploading(true);
      const formData = new FormData();
      formData.append('productId', productId);
      pendingFiles.forEach(f => formData.append('files', f));
      await fetch('/api/upload', { method: 'POST', body: formData });
      setUploading(false);
    }

    setShowForm(false);
    resetForm();
    fetchProducts();
  };

  const handleDelete = async (id: string) => {
    if (!confirm('האם למחוק מוצר זה?')) return;
    await fetch(`/api/admin/products/${id}`, { method: 'DELETE' });
    fetchProducts();
  };

  const handleDeleteImage = async (productId: string, imagePath: string) => {
    await fetch(`/api/upload/${productId}`, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ imagePath }),
    });
    setExistingImages(prev => prev.filter(img => img !== imagePath));
    fetchProducts();
  };

  const startEdit = (product: Product) => {
    setEditProduct(product);
    setForm({
      name: product.name,
      nameHe: product.nameHe,
      description: product.description || '',
      descriptionHe: product.descriptionHe || '',
      category: product.category,
      basePrice: String(product.basePrice),
      inStock: product.inStock,
      featured: product.featured,
      minOrderQty: String(product.minOrderQty || 1),
    });
    setExistingImages(product.images?.filter(img => !img.includes('placeholder')) || []);
    setPendingFiles([]);
    setShowForm(true);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setPendingFiles(prev => [...prev, ...Array.from(e.target.files!)]);
    }
  };

  const removePendingFile = (index: number) => {
    setPendingFiles(prev => prev.filter((_, i) => i !== index));
  };

  // Filter products
  const filtered = products.filter(p => {
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      if (!p.name.toLowerCase().includes(q) && !p.nameHe.includes(searchQuery)) return false;
    }
    if (filterCategory && p.category !== filterCategory) return false;
    return true;
  });

  if (loading || !user || user.role !== 'admin') {
    return <div className="min-h-[75vh] flex items-center justify-center"><div className="text-accent">טוען...</div></div>;
  }

  return (
    <div className="min-h-[75vh] py-12">
      <div className="max-w-[1100px] mx-auto px-5 md:px-10">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="font-heading text-[28px] text-text">ניהול מוצרים</h1>
            <p className="text-[14px] text-text-muted mt-1">הוסף, ערוך ומחק מוצרים</p>
          </div>
          <div className="flex gap-3">
            <Link href="/admin" className="text-accent text-[13px] hover:underline">← חזרה</Link>
            <button
              onClick={() => { setShowForm(!showForm); resetForm(); }}
              className="btn-primary text-[13px]"
            >
              {showForm ? 'ביטול' : '+ מוצר חדש'}
            </button>
          </div>
        </div>

        {/* Add/Edit Form */}
        {showForm && (
          <form onSubmit={handleSubmit} className="border border-border p-6 mb-8 bg-white">
            <h3 className="font-heading text-[18px] mb-5">{editProduct ? 'עריכת מוצר' : 'מוצר חדש'}</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-[12px] text-text-muted mb-1 tracking-wide">שם באנגלית</label>
                <input type="text" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })}
                  className="w-full px-3 py-2.5 border border-border text-[14px] focus:border-accent outline-none" required />
              </div>
              <div>
                <label className="block text-[12px] text-text-muted mb-1 tracking-wide">שם בעברית</label>
                <input type="text" value={form.nameHe} onChange={e => setForm({ ...form, nameHe: e.target.value })}
                  className="w-full px-3 py-2.5 border border-border text-[14px] focus:border-accent outline-none" required />
              </div>
              <div>
                <label className="block text-[12px] text-text-muted mb-1 tracking-wide">תיאור באנגלית</label>
                <textarea value={form.description} onChange={e => setForm({ ...form, description: e.target.value })}
                  className="w-full px-3 py-2.5 border border-border text-[14px] focus:border-accent outline-none" rows={2} />
              </div>
              <div>
                <label className="block text-[12px] text-text-muted mb-1 tracking-wide">תיאור בעברית</label>
                <textarea value={form.descriptionHe} onChange={e => setForm({ ...form, descriptionHe: e.target.value })}
                  className="w-full px-3 py-2.5 border border-border text-[14px] focus:border-accent outline-none" rows={2} />
              </div>
              <div>
                <label className="block text-[12px] text-text-muted mb-1 tracking-wide">קטגוריה</label>
                <select value={form.category} onChange={e => setForm({ ...form, category: e.target.value })}
                  className="w-full px-3 py-2.5 border border-border text-[14px] focus:border-accent outline-none">
                  <option value="rings">טבעות</option>
                  <option value="necklaces">שרשראות</option>
                  <option value="earrings">עגילים</option>
                  <option value="bracelets">צמידים</option>
                </select>
              </div>
              <div>
                <label className="block text-[12px] text-text-muted mb-1 tracking-wide">מחיר בסיס (₪)</label>
                <input type="number" value={form.basePrice} onChange={e => setForm({ ...form, basePrice: e.target.value })}
                  className="w-full px-3 py-2.5 border border-border text-[14px] focus:border-accent outline-none" required min="0" />
              </div>
              <div>
                <label className="block text-[12px] text-text-muted mb-1 tracking-wide">כמות מינימלית להזמנה (MOQ)</label>
                <input type="number" value={form.minOrderQty} onChange={e => setForm({ ...form, minOrderQty: e.target.value })}
                  className="w-full px-3 py-2.5 border border-border text-[14px] focus:border-accent outline-none" min="1" />
              </div>
              <div className="flex items-center gap-6">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" checked={form.inStock} onChange={e => setForm({ ...form, inStock: e.target.checked })} className="w-4 h-4 accent-accent" />
                  <span className="text-[13px]">במלאי</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" checked={form.featured} onChange={e => setForm({ ...form, featured: e.target.checked })} className="w-4 h-4 accent-accent" />
                  <span className="text-[13px]">מוצר מומלץ</span>
                </label>
              </div>
            </div>

            {/* Image Upload Section */}
            <div className="mt-5 pt-5 border-t border-border">
              <label className="block text-[12px] text-text-muted mb-3 tracking-wide">תמונות מוצר</label>

              {/* Existing Images */}
              {existingImages.length > 0 && (
                <div className="flex flex-wrap gap-3 mb-3">
                  {existingImages.map((img, i) => (
                    <div key={i} className="relative w-20 h-20 border border-border group">
                      <img src={img} alt="" className="w-full h-full object-cover" />
                      <button
                        type="button"
                        onClick={() => editProduct ? handleDeleteImage(editProduct.id, img) : setExistingImages(prev => prev.filter((_, idx) => idx !== i))}
                        className="absolute -top-2 -right-2 w-5 h-5 bg-red-500 text-white rounded-full text-[10px] opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"
                      >×</button>
                    </div>
                  ))}
                </div>
              )}

              {/* Pending Files */}
              {pendingFiles.length > 0 && (
                <div className="flex flex-wrap gap-3 mb-3">
                  {pendingFiles.map((file, i) => (
                    <div key={i} className="relative w-20 h-20 border border-accent/30 bg-accent-light/30 group">
                      <img src={URL.createObjectURL(file)} alt="" className="w-full h-full object-cover" />
                      <button
                        type="button"
                        onClick={() => removePendingFile(i)}
                        className="absolute -top-2 -right-2 w-5 h-5 bg-red-500 text-white rounded-full text-[10px] opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"
                      >×</button>
                      <span className="absolute bottom-0 left-0 right-0 bg-accent/80 text-white text-[9px] text-center">חדש</span>
                    </div>
                  ))}
                </div>
              )}

              <input
                ref={fileInputRef}
                type="file"
                multiple
                accept="image/jpeg,image/png,image/webp"
                onChange={handleFileSelect}
                className="hidden"
              />
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="px-4 py-2 border border-dashed border-border text-[13px] text-text-muted hover:border-accent hover:text-accent transition-colors"
              >
                + העלה תמונות
              </button>
            </div>

            <div className="mt-5 flex gap-3">
              <button type="submit" disabled={uploading} className="btn-primary text-[13px] disabled:opacity-50">
                {uploading ? 'מעלה תמונות...' : editProduct ? 'עדכן מוצר' : 'הוסף מוצר'}
              </button>
              <button type="button" onClick={() => { setShowForm(false); resetForm(); }} className="btn-outline text-[13px]">
                ביטול
              </button>
            </div>
          </form>
        )}

        {/* Search & Filter */}
        <div className="flex flex-wrap gap-3 mb-6">
          <input
            type="text"
            placeholder="חיפוש מוצר..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="px-4 py-2 border border-border text-[13px] focus:border-accent outline-none w-64"
          />
          <select
            value={filterCategory}
            onChange={e => setFilterCategory(e.target.value)}
            className="px-3 py-2 border border-border text-[13px] focus:border-accent outline-none"
          >
            <option value="">כל הקטגוריות</option>
            <option value="rings">טבעות</option>
            <option value="necklaces">שרשראות</option>
            <option value="earrings">עגילים</option>
            <option value="bracelets">צמידים</option>
          </select>
          <span className="text-[12px] text-text-muted self-center">{filtered.length} מוצרים</span>
        </div>

        {/* Products Table */}
        {loadingData ? (
          <div className="text-center py-16 text-text-muted">טוען...</div>
        ) : (
          <div className="border border-border bg-white overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-right text-[13px]">
                <thead className="bg-[#f5f0ec] border-b border-border">
                  <tr>
                    <th className="px-4 py-3 text-text-muted tracking-wide"></th>
                    <th className="px-4 py-3 text-text-muted tracking-wide">שם</th>
                    <th className="px-4 py-3 text-text-muted tracking-wide">קטגוריה</th>
                    <th className="px-4 py-3 text-text-muted tracking-wide">מחיר</th>
                    <th className="px-4 py-3 text-text-muted tracking-wide">מלאי</th>
                    <th className="px-4 py-3 text-text-muted tracking-wide">תמונות</th>
                    <th className="px-4 py-3 text-text-muted tracking-wide">פעולות</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/50">
                  {filtered.map(product => {
                    const realImages = product.images?.filter(img => !img.includes('placeholder')) || [];
                    return (
                      <tr key={product.id} className="hover:bg-[#faf9f7] transition-colors">
                        <td className="px-4 py-3 w-12">
                          {realImages.length > 0 ? (
                            <img src={realImages[0]} alt="" className="w-10 h-10 object-cover" />
                          ) : (
                            <div className="w-10 h-10 bg-[#f5f0ec] flex items-center justify-center text-sm opacity-40">💎</div>
                          )}
                        </td>
                        <td className="px-4 py-3">
                          <div className="font-medium text-text">{product.nameHe}</div>
                          <div className="text-[11px] text-text-muted">{product.name}</div>
                        </td>
                        <td className="px-4 py-3 text-text-muted">{categoryNames[product.category]}</td>
                        <td className="px-4 py-3 font-medium text-accent" dir="ltr">₪{product.basePrice.toLocaleString()}</td>
                        <td className="px-4 py-3">
                          <span className={product.inStock ? 'text-green-600' : 'text-red-400'}>{product.inStock ? '✓' : '✗'}</span>
                          {product.featured && <span className="text-accent mr-1">★</span>}
                        </td>
                        <td className="px-4 py-3 text-text-muted">{realImages.length}</td>
                        <td className="px-4 py-3">
                          <div className="flex gap-2">
                            <button onClick={() => startEdit(product)} className="px-2 py-1 text-[11px] bg-accent-light text-accent hover:bg-accent-hover transition-colors">ערוך</button>
                            <button onClick={() => handleDelete(product.id)} className="px-2 py-1 text-[11px] bg-red-50 text-red-500 hover:bg-red-100 transition-colors">מחק</button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
