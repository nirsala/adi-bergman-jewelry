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

  useEffect(() => {
    setActiveCategory(categoryParam);
  }, [categoryParam]);

  useEffect(() => {
    setLoading(true);
    const url = activeCategory ? `/api/products?category=${activeCategory}` : '/api/products';
    fetch(url)
      .then(res => res.json())
      .then(data => {
        setProducts(data.products || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [activeCategory]);

  return (
    <div className="min-h-[80vh] py-12">
      <div className="max-w-6xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-10">
          <h1 className="font-heading text-4xl font-bold text-charcoal mb-4">הקולקציה</h1>
          <div className="w-16 h-0.5 bg-gold mx-auto mb-4" />
          <p className="text-gray-500">גלו את מגוון תכשיטי המויסנייט שלנו</p>
        </div>

        {/* Category Filters */}
        <div className="flex flex-wrap gap-3 justify-center mb-10">
          {categories.map(cat => (
            <button
              key={cat.slug}
              onClick={() => setActiveCategory(cat.slug)}
              className={`px-5 py-2 rounded-full text-sm font-medium transition-all ${
                activeCategory === cat.slug
                  ? 'bg-gold text-charcoal'
                  : 'bg-white text-gray-600 border border-gray-200 hover:border-gold hover:text-gold-dark'
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>

        {/* Products Grid */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="bg-white rounded-lg overflow-hidden shadow-sm animate-pulse">
                <div className="aspect-square bg-gray-200" />
                <div className="p-5 space-y-3">
                  <div className="h-5 bg-gray-200 rounded w-3/4" />
                  <div className="h-4 bg-gray-200 rounded w-1/2" />
                  <div className="h-6 bg-gray-200 rounded w-1/3" />
                </div>
              </div>
            ))}
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-20 text-gray-400">
            <div className="text-5xl mb-4">💎</div>
            <p>אין מוצרים בקטגוריה זו</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 stagger-children">
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
    <Suspense fallback={<div className="min-h-[80vh] flex items-center justify-center"><div className="text-gold text-xl">טוען...</div></div>}>
      <ProductsContent />
    </Suspense>
  );
}
