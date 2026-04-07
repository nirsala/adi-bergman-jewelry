'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';

interface Product {
  id: string;
  name: string;
  nameHe: string;
  description: string;
  descriptionHe: string;
  category: string;
  basePrice?: number;
  images: string[];
  inStock: boolean;
}

const categoryNames: Record<string, string> = {
  rings: 'טבעות', necklaces: 'שרשראות', earrings: 'עגילים', bracelets: 'צמידים',
};
const placeholderImages: Record<string, string> = {
  rings: '💍', necklaces: '📿', earrings: '✨', bracelets: '⌚',
};

export default function ProductDetailPage() {
  const params = useParams();
  const { user } = useAuth();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/products/${params.id}`)
      .then(res => res.json())
      .then(data => { setProduct(data.product); setLoading(false); })
      .catch(() => setLoading(false));
  }, [params.id]);

  if (loading) return <div className="min-h-[75vh] flex items-center justify-center"><div className="text-accent text-[15px]">טוען...</div></div>;

  if (!product) return (
    <div className="min-h-[75vh] flex items-center justify-center">
      <div className="text-center">
        <h2 className="font-heading text-[24px] text-text mb-4">מוצר לא נמצא</h2>
        <Link href="/products" className="text-accent text-[14px] hover:underline">חזרה לקולקציה</Link>
      </div>
    </div>
  );

  const getPrice = () => {
    if (!user) return null;
    if (user.status === 'pending') return 'pending';
    if (user.status === 'approved' && product.basePrice) return product.basePrice * (1 - (user.discountPercent || 0) / 100);
    if (user.role === 'admin' && product.basePrice) return product.basePrice;
    return null;
  };
  const price = getPrice();

  return (
    <div className="min-h-[75vh] py-10 md:py-16">
      <div className="max-w-[1100px] mx-auto px-5 md:px-10">
        {/* Breadcrumb */}
        <nav className="mb-8 text-[12px] text-text-muted tracking-wide">
          <Link href="/" className="hover:text-accent">דף הבית</Link>
          <span className="mx-2">/</span>
          <Link href="/products" className="hover:text-accent">Shop</Link>
          <span className="mx-2">/</span>
          <Link href={`/products?category=${product.category}`} className="hover:text-accent">{categoryNames[product.category]}</Link>
          <span className="mx-2">/</span>
          <span className="text-text">{product.nameHe}</span>
        </nav>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-16">
          {/* Image */}
          <div>
            <div className="aspect-square bg-[#f5f0ec] flex items-center justify-center">
              <span className="text-8xl opacity-25">{placeholderImages[product.category] || '💎'}</span>
            </div>
            <div className="grid grid-cols-4 gap-2 mt-3">
              {[1, 2, 3, 4].map(i => (
                <div key={i} className="aspect-square bg-[#f5f0ec] flex items-center justify-center cursor-pointer hover:opacity-70 transition-opacity">
                  <span className="text-xl opacity-25">{placeholderImages[product.category] || '💎'}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Info */}
          <div className="flex flex-col">
            <h1 className="font-heading text-[28px] md:text-[34px] text-text mb-1">{product.nameHe}</h1>
            <p className="text-[14px] text-text-muted mb-6">{product.name}</p>

            {/* Price */}
            <div className="py-5 border-y border-border mb-6">
              {price === null ? (
                <div>
                  <p className="text-[14px] text-text-muted">התחבר/י לצפייה במחיר</p>
                  <p className="text-[12px] text-text-muted/60 mt-1">רק לקוחות מאושרים יכולים לראות מחירים</p>
                </div>
              ) : price === 'pending' ? (
                <div>
                  <p className="text-[14px] text-accent">ממתין לאישור מנהל</p>
                  <p className="text-[12px] text-text-muted/60 mt-1">המחירים יוצגו לאחר אישור חשבונך</p>
                </div>
              ) : (
                <div className="flex items-baseline gap-3" dir="ltr">
                  <span className="text-[28px] font-heading text-text">&#8362;{(price as number).toLocaleString()}</span>
                  {user && user.discountPercent > 0 && product.basePrice && (
                    <>
                      <span className="text-[16px] text-text-muted line-through">&#8362;{product.basePrice.toLocaleString()}</span>
                      <span className="text-[13px] text-accent">{user.discountPercent}% הנחה</span>
                    </>
                  )}
                </div>
              )}
            </div>

            {/* Description */}
            <p className="text-[14px] text-text-light leading-[1.8] mb-2">{product.descriptionHe}</p>
            <p className="text-[13px] text-text-muted leading-[1.7] mb-6">{product.description}</p>

            {/* Stock */}
            <div className="flex items-center gap-2 mb-8 text-[13px]">
              {product.inStock ? (
                <><div className="w-2 h-2 rounded-full bg-green-500" /><span className="text-text-muted">במלאי</span></>
              ) : (
                <><div className="w-2 h-2 rounded-full bg-red-400" /><span className="text-text-muted">אזל מהמלאי</span></>
              )}
            </div>

            {/* CTA */}
            <a
              href="https://wa.me/972500000000"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary text-center"
            >
              שלח/י הודעה בוואטסאפ
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
