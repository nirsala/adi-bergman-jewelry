'use client';

import { useEffect, useState } from 'react';
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

function ProductsContent() {
  const searchParams = useSearchParams();
  const categoryParam = searchParams.get('category') || '';
  const [products, setProducts] = useState<Product[]>([]);
  const [activeCategory, setActiveCategory] = useState(categoryParam);
  const [loading, setLoading] = useState(true);

  useEffect(() => { setActiveCategory(categoryParam); }, [categoryParam]);

  useEffect(() => {
    setLoading(true);
    const url = activeCategory ? `/api/products?category=${activeCategory}` : '/api/products';
    fetch(url)
      .then(res => res.json())
      .then(data => { setProducts(data.products || []); setLoading(false); })
      .catch(() => setLoading(false));
  }, [activeCategory]);

  return (
    <div className="min-h-[75vh] py-12 md:py-16">
      <div className="max-w-[1200px] mx-auto px-5 md:px-10">
        <div className="text-center mb-10">
          <h1 className="font-heading text-[32px] md:text-[40px] text-text">Shop</h1>
          <div className="w-8 h-[1px] bg-accent mx-auto mt-3" />
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-2 justify-center mb-10">
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
        ) : products.length === 0 ? (
          <div className="text-center py-20 text-text-muted">
            <p className="text-[15px]">אין מוצרים בקטגוריה זו</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-x-5 gap-y-10 stagger-children">
            {products.map(product => (
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
