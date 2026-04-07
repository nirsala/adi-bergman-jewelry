'use client';

import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';

interface Product {
  id: string;
  name: string;
  nameHe: string;
  category: string;
  basePrice: number;
  images: string[];
  inStock: boolean;
}

const categoryColors: Record<string, string> = {
  rings: 'bg-rose-light text-rose-800',
  necklaces: 'bg-amber-50 text-amber-800',
  earrings: 'bg-blue-50 text-blue-800',
  bracelets: 'bg-emerald-50 text-emerald-800',
};

const categoryNames: Record<string, string> = {
  rings: 'טבעות',
  necklaces: 'שרשראות',
  earrings: 'עגילים',
  bracelets: 'צמידים',
};

const placeholderImages: Record<string, string> = {
  rings: '💍',
  necklaces: '📿',
  earrings: '✨',
  bracelets: '⌚',
};

export default function ProductCard({ product }: { product: Product }) {
  const { user } = useAuth();

  const getPrice = () => {
    if (!user) return null;
    if (user.status === 'pending') return 'pending';
    if (user.status === 'approved') {
      const discount = user.discountPercent || 0;
      const finalPrice = product.basePrice * (1 - discount / 100);
      return finalPrice;
    }
    if (user.role === 'admin') return product.basePrice;
    return null;
  };

  const price = getPrice();

  return (
    <Link href={`/products/${product.id}`} className="group block">
      <div className="bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-xl transition-all duration-500 border border-gray-100">
        {/* Image Placeholder */}
        <div className="relative aspect-square bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center overflow-hidden">
          <span className="text-7xl opacity-40 group-hover:scale-110 transition-transform duration-500">
            {placeholderImages[product.category] || '💎'}
          </span>
          {/* Hover overlay */}
          <div className="absolute inset-0 bg-charcoal/0 group-hover:bg-charcoal/10 transition-all duration-500" />
          {/* Category badge */}
          <span className={`absolute top-3 right-3 text-xs px-3 py-1 rounded-full font-medium ${categoryColors[product.category] || 'bg-gray-100 text-gray-800'}`}>
            {categoryNames[product.category] || product.category}
          </span>
          {!product.inStock && (
            <span className="absolute top-3 left-3 text-xs px-3 py-1 rounded-full bg-red-100 text-red-700 font-medium">
              אזל מהמלאי
            </span>
          )}
        </div>

        {/* Content */}
        <div className="p-5">
          <h3 className="font-heading text-lg font-semibold text-charcoal group-hover:text-gold-dark transition-colors mb-1">
            {product.nameHe}
          </h3>
          <p className="text-sm text-gray-400 mb-3">{product.name}</p>

          {/* Price */}
          <div className="mt-3 pt-3 border-t border-gray-100">
            {price === null ? (
              <div className="flex items-center gap-2">
                <svg className="w-4 h-4 text-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
                <span className="text-sm text-gray-500">התחבר לצפייה במחירים</span>
              </div>
            ) : price === 'pending' ? (
              <div className="flex items-center gap-2">
                <svg className="w-4 h-4 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="text-sm text-amber-600">ממתין לאישור מנהל</span>
              </div>
            ) : (
              <div className="flex items-center justify-between">
                <span className="text-xl font-bold text-gold-dark">₪{(price as number).toLocaleString()}</span>
                {user && user.discountPercent > 0 && (
                  <span className="text-xs text-gray-400 line-through">₪{product.basePrice.toLocaleString()}</span>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}
