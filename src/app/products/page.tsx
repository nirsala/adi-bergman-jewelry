'use client';

import { useEffect, useState, useMemo } from 'react';
import { useSearchParams } from 'next/navigation';
import ProductCard from '@/components/ProductCard';
import { Suspense } from 'react';

interface Product {
  id: string;
  name: string;
  nameHe: string;
  category: string;
  basePrice: number;
  images: string[];
  inStock: boolean;
}

const categories = [
  { slug: '', name: 'הכל' },
  { slug: 'rings', name: 'טבעות' },
  { slug: 'necklaces', name: 'שרשראות' },
  { slug: 'earrings', name: 'עגילים' },
  { slug: 'bracelets', name: 'צמידים' },
];

const sortOptions = [
  { value: 'default', label: 'מומלץ' },
  { value: 'price-asc', label: 'מחיר: נמוך לגבוה' },
  { value: 'price-desc', label: 'מחיר: גבוה לנמוך' },
  { value: 'newest', label: 'חדש ביותר' },
  { value: 'name', label: 'שם (א-ת)' },
];

function ProductsContent() {
  const searchParams = useSearchParams();
  const categoryParam = searchParams.get('category') || '';
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [activeCategory, setActiveCategory] = useState(categoryParam);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('default');

  useEffect(() => { setActiveCategory(categoryParam); }, [categoryParam]);

  useEffect(() => {
    setLoading(true);
    fetch('/api/products')
      .then(res => res.json())
      .then(data => { setAllProducts(data.products || []); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  const filtered = useMemo(() => {
    let result = [...allProducts];

    // Category filter
    if (activeCategory) {
      result = result.filter(p => p.category === activeCategory);
    }

    // Search
    if (searchQuery.trim()) {
      const q = searchQuery.trim().toLowerCase();
      result = result.filter(p =>
        p.nameHe.includes(searchQuery.trim()) ||
        p.name.toLowerCase().includes(q)
      );
    }

    // Sort
    switch (sortBy) {
      case 'price-asc':
        result.sort((a, b) => (a.basePrice || 0) - (b.basePrice || 0));
        break;
      case 'price-desc':
        result.sort((a, b) => (b.basePrice || 0) - (a.basePrice || 0));
        break;
      case 'newest':
        result.sort((a, b) => b.id.localeCompare(a.id));
        break;
      case 'name':
        result.sort((a, b) => a.nameHe.localeCompare(b.nameHe, 'he'));
        break;
    }

    return result;
  }, [allProducts, activeCategory, searchQuery, sortBy]);

  return (
    <div className="min-h-[75vh] py-12 md:py-16">
      <div className="max-w-[1200px] mx-auto px-5 md:px-10">
        <div className="text-center mb-10">
          <h1 className="font-heading text-[32px] md:text-[40px] text-text">Shop</h1>
          <div className="w-8 h-[1px] bg-accent mx-auto mt-3" />
        </div>

        {/* Category Filters */}
        <div className="flex flex-wrap gap-2 justify-center mb-6">
          {categories.map(cat => (
            <button
              key={cat.slug}
              onClick={() => setActiveCategory(cat.slug)}
              className={`px-5 py-2 text-[13px] tracking-[0.05em] uppercase transition-all ${
                activeCategory === cat.slug
                  ? 'bg-accent-light text-text'
                  : 'bg-transparent text-text-muted hover:text-text border border-border'
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>

        {/* Search + Sort */}
        <div className="flex flex-wrap gap-3 justify-between items-center mb-8">
          <input
            type="text"
            placeholder="חיפוש מוצר..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="px-4 py-2 border border-border text-[13px] focus:border-accent outline-none w-64"
          />
          <div className="flex items-center gap-3">
            <span className="text-[12px] text-text-muted">{filtered.length} מוצרים</span>
            <select
              value={sortBy}
              onChange={e => setSortBy(e.target.value)}
              className="px-3 py-2 border border-border text-[13px] focus:border-accent outline-none"
            >
              {sortOptions.map(opt => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Grid */}
        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-x-5 gap-y-10">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="aspect-square bg-[#f5f0ec]" />
                <div className="pt-4 space-y-2 flex flex-col items-center">
                  <div className="h-4 bg-[#f0ebe6] rounded w-3/4" />
                  <div className="h-3 bg-[#f0ebe6] rounded w-1/3" />
                </div>
              </div>
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20 text-text-muted">
            <p className="text-[15px]">{searchQuery ? 'לא נמצאו תוצאות' : 'אין מוצרים בקטגוריה זו'}</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-x-5 gap-y-10 stagger-children">
            {filtered.map(product => (
              <div key={product.id} className="animate-fade-in-up opacity-0">
                <ProductCard product={product} />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default function ProductsPage() {
  return (
    <Suspense fallback={<div className="min-h-[75vh] flex items-center justify-center"><div className="text-accent text-[15px]">טוען...</div></div>}>
      <ProductsContent />
    </Suspense>
  );
}
