'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { useCart } from '@/contexts/CartContext';

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

function ProductJsonLd({ product }: { product: Product }) {
  const SITE_URL = 'https://adibergman.com';
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.nameHe,
    description: product.descriptionHe,
    image: product.images[0] ? `${SITE_URL}${product.images[0]}` : `${SITE_URL}/images/hero-model.jpg`,
    brand: { '@type': 'Brand', name: 'Adi Bergman' },
    category: categoryNames[product.category] || product.category,
    material: 'מויסנייט, זהב 14K',
    url: `${SITE_URL}/products/${product.id}`,
    offers: {
      '@type': 'Offer',
      availability: product.inStock ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock',
      priceCurrency: 'ILS',
      seller: { '@type': 'Organization', name: 'Adi Bergman Moissanite Jewelry' },
    },
  };
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />;
}

export default function ProductDetailPage() {
  const params = useParams();
  const { user } = useAuth();
  const { addToCart, loading: cartLoading } = useCart();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);
  const [qty, setQty] = useState(1);
  const [addedMsg, setAddedMsg] = useState(false);

  useEffect(() => {
    fetch(`/api/products/${params.id}`)
      .then(res => res.json())
      .then(data => { setProduct(data.product); setLoading(false); })
      .catch(() => setLoading(false));
  }, [params.id]);

  useEffect(() => {
    if (product) document.title = `${product.nameHe} | עדי ברגמן תכשיטים`;
  }, [product]);

  if (loading) return <div className="min-h-[75vh] flex items-center justify-center"><div className="text-accent text-[15px]">טוען...</div></div>;
  if (!product) return (
    <div className="min-h-[75vh] flex items-center justify-center">
      <div className="text-center">
        <h1 className="font-heading text-[24px] text-text mb-4">מוצר לא נמצא</h1>
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
  const realImages = product.images?.filter(img => img && !img.includes('placeholder')) || [];
  const showCart = user && user.role === 'customer' && user.status === 'approved';

  const handleAddToCart = async () => {
    await addToCart(product.id, qty);
    setAddedMsg(true);
    setTimeout(() => setAddedMsg(false), 2500);
  };

  return (
    <>
      <ProductJsonLd product={product} />
      <article className="min-h-[75vh] py-10 md:py-16">
        <div className="max-w-[1100px] mx-auto px-5 md:px-10">
          {/* Breadcrumb */}
          <nav aria-label="breadcrumb" className="mb-8 text-[12px] text-text-muted tracking-wide">
            <Link href="/" className="hover:text-accent">דף הבית</Link>
            <span className="mx-2">/</span>
            <Link href="/products" className="hover:text-accent">Shop</Link>
            <span className="mx-2">/</span>
            <Link href={`/products?category=${product.category}`} className="hover:text-accent">{categoryNames[product.category]}</Link>
            <span className="mx-2">/</span>
            <span className="text-text">{product.nameHe}</span>
          </nav>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-16">
            {/* Image Gallery */}
            <div>
              <div className="aspect-square bg-[#f5f0ec] flex items-center justify-center overflow-hidden">
                {realImages.length > 0 ? (
                  <img src={realImages[selectedImage] || realImages[0]} alt={product.nameHe} className="w-full h-full object-cover" />
                ) : (
                  <span className="text-8xl opacity-25">{placeholderImages[product.category] || '💎'}</span>
                )}
              </div>
              {(realImages.length > 1 || realImages.length === 0) && (
                <div className="grid grid-cols-4 gap-2 mt-3">
                  {realImages.length > 1 ? realImages.map((img, i) => (
                    <button
                      key={i}
                      onClick={() => setSelectedImage(i)}
                      className={`aspect-square overflow-hidden border-2 transition-colors ${selectedImage === i ? 'border-accent' : 'border-transparent hover:border-border'}`}
                    >
                      <img src={img} alt="" className="w-full h-full object-cover" />
                    </button>
                  )) : [1, 2, 3, 4].map(i => (
                    <div key={i} className="aspect-square bg-[#f5f0ec] flex items-center justify-center">
                      <span className="text-xl opacity-25">{placeholderImages[product.category] || '💎'}</span>
                    </div>
                  ))}
                </div>
              )}
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
                    <span className="text-[28px] font-heading text-text">&#8362;{Math.round(price as number).toLocaleString()}</span>
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
              <div className="flex items-center gap-2 mb-6 text-[13px]">
                {product.inStock ? (
                  <><div className="w-2 h-2 rounded-full bg-green-500" /><span className="text-text-muted">במלאי</span></>
                ) : (
                  <><div className="w-2 h-2 rounded-full bg-red-400" /><span className="text-text-muted">אזל מהמלאי</span></>
                )}
              </div>

              {/* Add to Cart */}
              {showCart && product.inStock && (
                <div className="mb-6 flex items-center gap-3">
                  <div className="flex items-center border border-border">
                    <button onClick={() => setQty(Math.max(1, qty - 1))} className="w-9 h-10 text-text hover:bg-[#f5f0ec] transition-colors">−</button>
                    <span className="w-10 text-center text-[14px]">{qty}</span>
                    <button onClick={() => setQty(qty + 1)} className="w-9 h-10 text-text hover:bg-[#f5f0ec] transition-colors">+</button>
                  </div>
                  <button
                    onClick={handleAddToCart}
                    disabled={cartLoading}
                    className="btn-primary flex-1 text-center disabled:opacity-50"
                  >
                    {cartLoading ? 'מוסיף...' : 'הוסף לעגלה'}
                  </button>
                </div>
              )}

              {addedMsg && (
                <div className="mb-4 p-3 bg-green-50 text-green-700 text-[13px] text-center animate-fade-in">
                  המוצר נוסף לעגלה!
                </div>
              )}

              {/* WhatsApp CTA */}
              <a
                href="https://wa.me/972500000000"
                target="_blank"
                rel="noopener noreferrer"
                className="btn-outline text-center"
              >
                שלח/י הודעה בוואטסאפ
              </a>
            </div>
          </div>
        </div>
      </article>
    </>
  );
}
