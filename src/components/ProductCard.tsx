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

const placeholderImages: Record<string, string> = {
  rings: '💍', necklaces: '📿', earrings: '✨', bracelets: '⌚',
};

export default function ProductCard({ product }: { product: Product }) {
  const { user } = useAuth();

  const getPrice = () => {
    if (!user) return null;
    if (user.status === 'pending') return 'pending';
    if (user.status === 'approved') {
      const discount = user.discountPercent || 0;
      return product.basePrice * (1 - discount / 100);
    }
    if (user.role === 'admin') return product.basePrice;
    return null;
  };

  const price = getPrice();
  const realImage = product.images?.find(img => img && !img.includes('placeholder'));

  return (
    <Link href={`/products/${product.id}`} className="group block">
      <div className="overflow-hidden">
        {/* Image */}
        <div className="relative aspect-square bg-[#f5f0ec] flex items-center justify-center overflow-hidden">
          {realImage ? (
            <img
              src={realImage}
              alt={product.nameHe}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
            />
          ) : (
            <span className="text-6xl opacity-30 group-hover:scale-105 transition-transform duration-700 ease-out">
              {placeholderImages[product.category] || '💎'}
            </span>
          )}
          {!product.inStock && (
            <span className="absolute top-3 right-3 text-[11px] px-3 py-1 bg-white/80 text-text-muted tracking-wide uppercase">
              אזל
            </span>
          )}
        </div>

        {/* Content */}
        <div className="pt-4 pb-2 text-center">
          <h3 className="text-[14px] font-medium text-text group-hover:text-accent transition-colors leading-snug">
            {product.nameHe}
          </h3>

          {/* Price */}
          <div className="mt-2" dir="ltr">
            {price === null ? (
              <span className="text-[13px] text-text-muted">התחבר/י לצפייה במחיר</span>
            ) : price === 'pending' ? (
              <span className="text-[13px] text-accent">ממתין לאישור</span>
            ) : (
              <div className="flex items-center justify-center gap-2">
                <span className="text-[15px] text-text">&#8362;{(price as number).toLocaleString()}</span>
                {user && user.discountPercent > 0 && (
                  <span className="text-[13px] text-text-muted line-through">&#8362;{product.basePrice.toLocaleString()}</span>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}
