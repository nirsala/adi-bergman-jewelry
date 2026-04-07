'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import Head from 'next/head';
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

  const breadcrumb = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'דף הבית', item: SITE_URL },
      { '@type': 'ListItem', position: 2, name: 'קולקציה', item: `${SITE_URL}/products` },
      { '@type': 'ListItem', position: 3, name: categoryNames[product.category], item: `${SITE_URL}/products?category=${product.category}` },
      { '@type': 'ListItem', position: 4, name: product.nameHe, item: `${SITE_URL}/products/${product.id}` },
    ],
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }} />
    </>
  );
}

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

  useEffect(() => {
    if (product) {
      document.title = `${product.nameHe} | עדי ברגמן תכשיטים`;
      const metaDesc = document.querySelector('meta[name="description"]');
      if (metaDesc) metaDesc.setAttribute('content', `${product.descriptionHe} | עדי ברגמן - תכשיטי מויסנייט מעוצבים`);
    }
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

  return (
    <>
      <ProductJsonLd product={product} />

      <article className="min-h-[75vh] py-10 md:py-16" itemScope itemType="https://schema.org/Product">
        <div className="max-w-[1100px] mx-auto px-5 md:px-10">
          {/* Breadcrumb */}
          <nav aria-label="breadcrumb" className="mb-8 text-[12px] text-text-muted tracking-wide">
            <ol className="flex flex-wrap gap-1" itemScope itemType="https://schema.org/BreadcrumbList">
              <li itemProp="itemListElement" itemScope itemType="https://schema.org/ListItem">
                <Link href="/" itemProp="item" className="hover:text-accent"><span itemProp="name">דף הבית</span></Link>
                <meta itemProp="position" content="1" />
                <span className="mx-2">/</span>
              </li>
              <li itemProp="itemListElement" itemScope itemType="https://schema.org/ListItem">
                <Link href="/products" itemProp="item" className="hover:text-accent"><span itemProp="name">Shop</span></Link>
                <meta itemProp="position" content="2" />
                <span className="mx-2">/</span>
              </li>
              <li itemProp="itemListElement" itemScope itemType="https://schema.org/ListItem">
                <Link href={`/products?category=${product.category}`} itemProp="item" className="hover:text-accent"><span itemProp="name">{categoryNames[product.category]}</span></Link>
                <meta itemProp="position" content="3" />
                <span className="mx-2">/</span>
              </li>
              <li itemProp="itemListElement" itemScope itemType="https://schema.org/ListItem">
                <span itemProp="name" className="text-text">{product.nameHe}</span>
                <meta itemProp="position" content="4" />
              </li>
            </ol>
          </nav>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-16">
            {/* Image */}
            <div>
              <div className="aspect-square bg-[#f5f0ec] flex items-center justify-center" itemProp="image">
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
              <h1 className="font-heading text-[28px] md:text-[34px] text-text mb-1" itemProp="name">{product.nameHe}</h1>
              <p className="text-[14px] text-text-muted mb-6">{product.name}</p>
              <meta itemProp="brand" content="Adi Bergman" />
              <meta itemProp="material" content="מויסנייט, זהב 14K" />

              {/* Price */}
              <div className="py-5 border-y border-border mb-6" itemProp="offers" itemScope itemType="https://schema.org/Offer">
                <meta itemProp="priceCurrency" content="ILS" />
                <link itemProp="availability" href={product.inStock ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock'} />
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
                    <span className="text-[28px] font-heading text-text" itemProp="price" content={String(price)}>&#8362;{(price as number).toLocaleString()}</span>
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
              <div itemProp="description">
                <p className="text-[14px] text-text-light leading-[1.8] mb-2">{product.descriptionHe}</p>
                <p className="text-[13px] text-text-muted leading-[1.7] mb-6">{product.description}</p>
              </div>

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
      </article>
    </>
  );
}
