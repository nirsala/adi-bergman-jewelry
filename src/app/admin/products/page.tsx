'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface Product {
  id: string;
  name: string;
  nameHe: string;
  category: string;
  basePrice: number;
  inStock: boolean;
  featured: boolean;
}

const categoryNames: Record<string, string> = {
  rings: 'טבעות',
  necklaces: 'שרשראות',
  earrings: 'עגילים',
  bracelets: 'צמידים',
};

export default function AdminProductsPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>([]);
  const [loadingData, setLoadingData] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editProduct, setEditProduct] = useState<Product | null>(null);
  const [form, setForm] = useState({
    name: '', nameHe: '', description: '', descriptionHe: '',
    category: 'rings', basePrice: '', inStock: true, featured: false,
  });

  useEffect(() => {
    if (!loading && (!user || user.role !== 'admin')) {
      router.push('/login');
    }
  }, [user, loading, router]);

  const fetchProducts = () => {
    fetch('/api/admin/products')
      .then(r => r.json())
      .then(data => {
        setProducts(data.products || []);
        setLoadingData(false);
      });
  };

  useEffect(() => {
    if (user?.role === 'admin') fetchProducts();
  }, [user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const body = {
      ...form,
      basePrice: Number(form.basePrice),
      ...(editProduct ? { id: editProduct.id } : {}),
    };

    await fetch('/api/admin/products', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });

    setShowForm(false);
    setEditProduct(null);
    setForm({ name: '', nameHe: '', description: '', descriptionHe: '', category: 'rings', basePrice: '', inStock: true, featured: false });
    fetchProducts();
  };

  const handleDelete = async (id: string) => {
    if (!confirm('האם למחוק מוצר זה?')) return;
    await fetch(`/api/admin/products/${id}`, { method: 'DELETE' });
    fetchProducts();
  };

  const startEdit = (product: Product) => {
    setEditProduct(product);
    setForm({
      name: product.name,
      nameHe: product.nameHe,
      description: '',
      descriptionHe: '',
      category: product.category,
      basePrice: String(product.basePrice),
      inStock: product.inStock,
      featured: product.featured,
    });
    setShowForm(true);
  };

  if (loading || !user || user.role !== 'admin') {
    return <div className="min-h-[80vh] flex items-center justify-center"><div className="text-gold">טוען...</div></div>;
  }

  return (
    <div className="min-h-[80vh] py-12">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="font-heading text-3xl font-bold text-charcoal">ניהול מוצרים</h1>
            <p className="text-gray-500 mt-1">הוסף, ערוך ומחק מוצרים</p>
          </div>
          <div className="flex gap-4">
            <Link href="/admin" className="text-gold hover:text-gold-dark transition-colors">
              ← חזרה ללוח בקרה
            </Link>
            <button
              onClick={() => { setShowForm(!showForm); setEditProduct(null); setForm({ name: '', nameHe: '', description: '', descriptionHe: '', category: 'rings', basePrice: '', inStock: true, featured: false }); }}
              className="px-5 py-2 bg-gold text-charcoal font-medium rounded-lg hover:bg-gold-light transition-colors"
            >
              {showForm ? 'ביטול' : '+ מוצר חדש'}
            </button>
          </div>
        </div>

        {/* Add/Edit Form */}
        {showForm && (
          <form onSubmit={handleSubmit} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 mb-8">
            <h3 className="font-heading text-lg font-bold mb-4">{editProduct ? 'עריכת מוצר' : 'מוצר חדש'}</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">שם באנגלית</label>
                <input
                  type="text"
                  value={form.name}
                  onChange={e => setForm({ ...form, name: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-gold/50 focus:border-gold outline-none"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">שם בעברית</label>
                <input
                  type="text"
                  value={form.nameHe}
                  onChange={e => setForm({ ...form, nameHe: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-gold/50 focus:border-gold outline-none"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">תיאור באנגלית</label>
                <textarea
                  value={form.description}
                  onChange={e => setForm({ ...form, description: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-gold/50 focus:border-gold outline-none"
                  rows={2}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">תיאור בעברית</label>
                <textarea
                  value={form.descriptionHe}
                  onChange={e => setForm({ ...form, descriptionHe: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-gold/50 focus:border-gold outline-none"
                  rows={2}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">קטגוריה</label>
                <select
                  value={form.category}
                  onChange={e => setForm({ ...form, category: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-gold/50 focus:border-gold outline-none"
                >
                  <option value="rings">טבעות</option>
                  <option value="necklaces">שרשראות</option>
                  <option value="earrings">עגילים</option>
                  <option value="bracelets">צמידים</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">מחיר בסיס (₪)</label>
                <input
                  type="number"
                  value={form.basePrice}
                  onChange={e => setForm({ ...form, basePrice: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-gold/50 focus:border-gold outline-none"
                  required
                  min="0"
                />
              </div>
              <div className="flex items-center gap-6">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={form.inStock}
                    onChange={e => setForm({ ...form, inStock: e.target.checked })}
                    className="w-4 h-4 accent-gold"
                  />
                  <span className="text-sm text-gray-700">במלאי</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={form.featured}
                    onChange={e => setForm({ ...form, featured: e.target.checked })}
                    className="w-4 h-4 accent-gold"
                  />
                  <span className="text-sm text-gray-700">מוצר מומלץ</span>
                </label>
              </div>
            </div>
            <button
              type="submit"
              className="mt-4 px-6 py-2 bg-gold text-charcoal font-medium rounded-lg hover:bg-gold-light transition-colors"
            >
              {editProduct ? 'עדכן מוצר' : 'הוסף מוצר'}
            </button>
          </form>
        )}

        {/* Products Table */}
        {loadingData ? (
          <div className="text-center py-20 text-gray-400">טוען...</div>
        ) : (
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-right">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-4 text-sm font-medium text-gray-500">שם</th>
                    <th className="px-6 py-4 text-sm font-medium text-gray-500">קטגוריה</th>
                    <th className="px-6 py-4 text-sm font-medium text-gray-500">מחיר בסיס</th>
                    <th className="px-6 py-4 text-sm font-medium text-gray-500">מלאי</th>
                    <th className="px-6 py-4 text-sm font-medium text-gray-500">מומלץ</th>
                    <th className="px-6 py-4 text-sm font-medium text-gray-500">פעולות</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {products.map(product => (
                    <tr key={product.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="font-medium text-charcoal">{product.nameHe}</div>
                        <div className="text-xs text-gray-400">{product.name}</div>
                      </td>
                      <td className="px-6 py-4 text-gray-500">{categoryNames[product.category]}</td>
                      <td className="px-6 py-4 font-medium text-gold-dark">₪{product.basePrice.toLocaleString()}</td>
                      <td className="px-6 py-4">
                        {product.inStock ? (
                          <span className="text-green-600">✓</span>
                        ) : (
                          <span className="text-red-600">✗</span>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        {product.featured ? (
                          <span className="text-gold">★</span>
                        ) : (
                          <span className="text-gray-300">☆</span>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex gap-2">
                          <button
                            onClick={() => startEdit(product)}
                            className="px-3 py-1 bg-blue-100 text-blue-700 text-xs rounded hover:bg-blue-200 transition-colors"
                          >
                            ערוך
                          </button>
                          <button
                            onClick={() => handleDelete(product.id)}
                            className="px-3 py-1 bg-red-100 text-red-700 text-xs rounded hover:bg-red-200 transition-colors"
                          >
                            מחק
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
