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
    <section className="py-16 md:py-24 bg-white">
      <div className="max-w-[1200px] mx-auto px-5 md:px-10">
        <div className="text-center mb-12">
          <h2 className="font-heading text-[28px] md:text-[36px] text-text mb-3">Best Sellers</h2>
          <div className="w-8 h-[1px] bg-accent mx-auto" />
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-x-5 gap-y-10 stagger-children">
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
