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

export default function ProductDetailPage() {
  const params = useParams();
  const { user } = useAuth();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/products/${params.id}`)
      .then(res => res.json())
      .then(data => {
        setProduct(data.product);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [params.id]);

  if (loading) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center">
        <div className="text-gold text-xl">טוען...</div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center">
        <div className="text-center">
          <div className="text-5xl mb-4">😕</div>
          <h2 className="font-heading text-2xl font-bold text-charcoal mb-4">מוצר לא נמצא</h2>
          <Link href="/products" className="text-gold hover:underline">חזרה לקולקציה</Link>
        </div>
      </div>
    );
  }

  const getPrice = () => {
    if (!user) return null;
    if (user.status === 'pending') return 'pending';
    if (user.status === 'approved' && product.basePrice) {
      const discount = user.discountPercent || 0;
      return product.basePrice * (1 - discount / 100);
    }
    if (user.role === 'admin' && product.basePrice) return product.basePrice;
    return null;
  };

  const price = getPrice();

  return (
    <div className="min-h-[80vh] py-12">
      <div className="max-w-6xl mx-auto px-4">
        {/* Breadcrumb */}
        <nav className="mb-8 text-sm text-gray-500">
          <Link href="/" className="hover:text-gold">דף הבית</Link>
          <span className="mx-2">/</span>
          <Link href="/products" className="hover:text-gold">קולקציה</Link>
          <span className="mx-2">/</span>
          <Link href={`/products?category=${product.category}`} className="hover:text-gold">
            {categoryNames[product.category]}
          </Link>
          <span className="mx-2">/</span>
          <span className="text-charcoal">{product.nameHe}</span>
        </nav>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {/* Image Gallery */}
          <div>
            <div className="aspect-square bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl flex items-center justify-center mb-4">
              <span className="text-9xl opacity-30">
                {placeholderImages[product.category] || '💎'}
              </span>
            </div>
            <div className="grid grid-cols-4 gap-2">
              {[1, 2, 3, 4].map(i => (
                <div key={i} className="aspect-square bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg flex items-center justify-center cursor-pointer hover:ring-2 hover:ring-gold transition-all">
                  <span className="text-2xl opacity-30">
                    {placeholderImages[product.category] || '💎'}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Product Info */}
          <div>
            <div className="inline-block px-3 py-1 bg-gold/10 text-gold-dark text-sm rounded-full mb-4">
              {categoryNames[product.category]}
            </div>

            <h1 className="font-heading text-3xl font-bold text-charcoal mb-2">{product.nameHe}</h1>
            <p className="text-gray-400 text-lg mb-6">{product.name}</p>

            {/* Price Section */}
            <div className="py-6 border-y border-gray-200 mb-6">
              {price === null ? (
                <div className="flex items-center gap-3">
                  <svg className="w-5 h-5 text-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                  <div>
                    <p className="text-gray-600 font-medium">התחבר לצפייה במחירים</p>
                    <p className="text-sm text-gray-400">רק לקוחות רשומים ומאושרים יכולים לראות מחירים</p>
                  </div>
                </div>
              ) : price === 'pending' ? (
                <div className="flex items-center gap-3">
                  <svg className="w-5 h-5 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <div>
                    <p className="text-amber-600 font-medium">ממתין לאישור מנהל</p>
                    <p className="text-sm text-gray-400">חשבונך בבדיקה, המחירים יוצגו לאחר האישור</p>
                  </div>
                </div>
              ) : (
                <div>
                  <div className="flex items-baseline gap-3">
                    <span className="text-4xl font-bold text-gold-dark">₪{(price as number).toLocaleString()}</span>
                    {user && user.discountPercent > 0 && product.basePrice && (
                      <>
                        <span className="text-xl text-gray-400 line-through">₪{product.basePrice.toLocaleString()}</span>
                        <span className="px-2 py-1 bg-green-100 text-green-700 text-sm rounded-full">
                          {user.discountPercent}% הנחה
                        </span>
                      </>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Description */}
            <div className="mb-8">
              <h3 className="font-heading text-lg font-semibold text-charcoal mb-3">תיאור</h3>
              <p className="text-gray-600 leading-relaxed">{product.descriptionHe}</p>
              <p className="text-gray-400 text-sm mt-2">{product.description}</p>
            </div>

            {/* Stock Status */}
            <div className="flex items-center gap-2 mb-6">
              {product.inStock ? (
                <>
                  <div className="w-3 h-3 rounded-full bg-green-500" />
                  <span className="text-green-700 text-sm">במלאי</span>
                </>
              ) : (
                <>
                  <div className="w-3 h-3 rounded-full bg-red-500" />
                  <span className="text-red-700 text-sm">אזל מהמלאי</span>
                </>
              )}
            </div>

            {/* Contact CTA */}
            <div className="bg-cream p-6 rounded-xl">
              <p className="text-charcoal font-medium mb-2">מעוניינים בתכשיט זה?</p>
              <p className="text-gray-500 text-sm mb-4">צרו קשר לבירור פרטים והזמנה</p>
              <a
                href="https://wa.me/972500000000"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                </svg>
                שלח הודעה בוואטסאפ
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
