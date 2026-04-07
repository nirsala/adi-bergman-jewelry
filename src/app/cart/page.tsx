'use client';

import { useAuth } from '@/contexts/AuthContext';
import { useCart } from '@/contexts/CartContext';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Link from 'next/link';

export default function CartPage() {
  const { user, loading: authLoading } = useAuth();
  const { cart, loading, updateQuantity, removeFromCart, clearCart, submitCart } = useCart();
  const router = useRouter();
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    if (!authLoading && (!user || user.role !== 'customer' || user.status !== 'approved')) {
      router.push('/login');
    }
  }, [user, authLoading, router]);

  if (authLoading || !user) {
    return <div className="min-h-[75vh] flex items-center justify-center"><div className="text-accent">טוען...</div></div>;
  }

  if (submitted) {
    return (
      <div className="min-h-[75vh] flex items-center justify-center py-16 px-5">
        <div className="text-center max-w-md">
          <div className="text-5xl mb-5">✅</div>
          <h1 className="font-heading text-[28px] text-text mb-4">ההזמנה נשלחה בהצלחה!</h1>
          <p className="text-[14px] text-text-muted mb-8 leading-[1.7]">
            ההזמנה שלך נשלחה לבדיקת המנהל. ניצור איתך קשר בהקדם.
          </p>
          <Link href="/products" className="btn-primary">המשך לקולקציה</Link>
        </div>
      </div>
    );
  }

  const handleSubmit = async () => {
    if (!confirm('לשלוח את ההזמנה?')) return;
    const success = await submitCart();
    if (success) setSubmitted(true);
  };

  return (
    <div className="min-h-[75vh] py-12 md:py-16">
      <div className="max-w-[900px] mx-auto px-5 md:px-10">
        <h1 className="font-heading text-[32px] text-text text-center mb-2">העגלה שלי</h1>
        <div className="w-8 h-[1px] bg-accent mx-auto mb-10" />

        {cart.items.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-4xl mb-4 opacity-40">🛒</div>
            <p className="text-text-muted text-[15px] mb-6">העגלה ריקה</p>
            <Link href="/products" className="btn-primary">לקולקציה</Link>
          </div>
        ) : (
          <>
            {/* Cart Items */}
            <div className="border border-border">
              {/* Header */}
              <div className="hidden md:grid grid-cols-12 gap-4 px-5 py-3 bg-[#f5f0ec] text-[12px] text-text-muted tracking-wide uppercase">
                <div className="col-span-5">מוצר</div>
                <div className="col-span-2 text-center">מחיר יחידה</div>
                <div className="col-span-2 text-center">כמות</div>
                <div className="col-span-2 text-center">סה״כ</div>
                <div className="col-span-1"></div>
              </div>

              {/* Items */}
              {cart.items.map(item => (
                <div key={item.productId} className="grid grid-cols-12 gap-4 px-5 py-4 border-t border-border items-center">
                  {/* Product */}
                  <div className="col-span-12 md:col-span-5 flex items-center gap-4">
                    <div className="w-16 h-16 bg-[#f5f0ec] flex-shrink-0 flex items-center justify-center overflow-hidden">
                      {item.image && !item.image.includes('placeholder') ? (
                        <img src={item.image} alt={item.nameHe} className="w-full h-full object-cover" />
                      ) : (
                        <span className="text-2xl opacity-30">💎</span>
                      )}
                    </div>
                    <div>
                      <Link href={`/products/${item.productId}`} className="text-[14px] font-medium text-text hover:text-accent transition-colors">
                        {item.nameHe}
                      </Link>
                      {user.discountPercent > 0 && (
                        <p className="text-[11px] text-accent mt-0.5">{user.discountPercent}% הנחה</p>
                      )}
                    </div>
                  </div>

                  {/* Unit Price */}
                  <div className="col-span-4 md:col-span-2 text-center text-[14px] text-text" dir="ltr">
                    ₪{item.unitPrice.toLocaleString()}
                  </div>

                  {/* Quantity */}
                  <div className="col-span-4 md:col-span-2 flex items-center justify-center gap-2">
                    <button
                      onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                      disabled={loading}
                      className="w-7 h-7 border border-border text-text hover:bg-[#f5f0ec] transition-colors text-[14px] disabled:opacity-50"
                    >−</button>
                    <span className="w-8 text-center text-[14px]">{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                      disabled={loading}
                      className="w-7 h-7 border border-border text-text hover:bg-[#f5f0ec] transition-colors text-[14px] disabled:opacity-50"
                    >+</button>
                  </div>

                  {/* Line Total */}
                  <div className="col-span-3 md:col-span-2 text-center text-[14px] font-medium text-text" dir="ltr">
                    ₪{item.lineTotal.toLocaleString()}
                  </div>

                  {/* Remove */}
                  <div className="col-span-1 text-center">
                    <button
                      onClick={() => removeFromCart(item.productId)}
                      disabled={loading}
                      className="text-text-muted hover:text-red-500 transition-colors"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Min Order Warning */}
            {cart.total < 1000 && (
              <div className="mt-4 p-3 bg-amber-50 border border-amber-200 text-[13px] text-amber-700 text-center">
                סכום הזמנה מינימלי: ₪1,000 | סכום נוכחי: ₪{cart.total.toLocaleString()} — חסרים עוד ₪{(1000 - cart.total).toLocaleString()}
              </div>
            )}

            {/* Cart Summary */}
            <div className="mt-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <button
                onClick={clearCart}
                disabled={loading}
                className="text-[13px] text-text-muted hover:text-red-500 transition-colors"
              >
                נקה עגלה
              </button>

              <div className="text-left md:text-right">
                <div className="text-[13px] text-text-muted mb-1">{cart.itemCount} פריטים</div>
                <div className="text-[24px] font-heading text-text" dir="ltr">₪{cart.total.toLocaleString()}</div>
              </div>
            </div>

            {/* Submit */}
            <div className="mt-8 text-center">
              <button
                onClick={handleSubmit}
                disabled={loading}
                className="btn-primary px-16 disabled:opacity-50"
              >
                {loading ? 'שולח...' : 'שלח הזמנה'}
              </button>
              <p className="text-[12px] text-text-muted mt-3">
                לאחר השליחה, המנהל יבדוק את ההזמנה וייצור איתך קשר
              </p>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
