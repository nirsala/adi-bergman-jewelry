'use client';

import { useEffect, useState } from 'react';
import ProductCard from './ProductCard';

interface Product {
  id: string;
  name: string;
  nameHe: string;
  category: string;
  basePrice: number;
  images: string[];
  inStock: boolean;
  featured: boolean;
}

export default function FeaturedProducts() {
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    fetch('/api/products?featured=true')
      .then(res => res.json())
      .then(data => setProducts(data.products || []))
      .catch(() => {});
  }, []);

  if (products.length === 0) return null;

  return (
    <section className="py-20 bg-cream">
      <div className="max-w-6xl mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="font-heading text-4xl font-bold text-charcoal mb-4">פריטים נבחרים</h2>
          <div className="w-16 h-0.5 bg-gold mx-auto mb-4" />
          <p className="text-gray-500">התכשיטים הפופולריים ביותר שלנו</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 stagger-children">
          {products.slice(0, 4).map(product => (
            <div key={product.id} className="animate-fade-in-up opacity-0">
              <ProductCard product={product} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
