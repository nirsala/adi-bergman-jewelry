'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface CartItem {
  productId: string;
  nameHe: string;
  image: string;
  basePrice: number;
  unitPrice: number;
  quantity: number;
  lineTotal: number;
}

interface CustomerCart {
  cartId: string;
  status: string;
  updatedAt: string;
  customer: { id: string; name: string; email: string; phone: string; discountPercent: number };
  items: CartItem[];
  itemCount: number;
  total: number;
}

export default function AdminCartsPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [carts, setCarts] = useState<CustomerCart[]>([]);
  const [loadingData, setLoadingData] = useState(true);
  const [filter, setFilter] = useState<string>('');
  const [expandedCart, setExpandedCart] = useState<string | null>(null);

  useEffect(() => {
    if (!loading && (!user || user.role !== 'admin')) router.push('/login');
  }, [user, loading, router]);

  useEffect(() => {
    if (user?.role === 'admin') {
      const url = filter ? `/api/admin/carts?status=${filter}` : '/api/admin/carts';
      fetch(url)
        .then(r => r.json())
        .then(data => { setCarts(data.carts || []); setLoadingData(false); })
        .catch(() => setLoadingData(false));
    }
  }, [user, filter]);

  if (loading || !user || user.role !== 'admin') {
    return <div className="min-h-[75vh] flex items-center justify-center"><div className="text-accent">טוען...</div></div>;
  }

  const statusLabels: Record<string, { text: string; className: string }> = {
    active: { text: 'פעילה', className: 'bg-blue-100 text-blue-700' },
    submitted: { text: 'הזמנה נשלחה', className: 'bg-green-100 text-green-700' },
  };

  return (
    <div className="min-h-[75vh] py-12">
      <div className="max-w-[1100px] mx-auto px-5 md:px-10">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="font-heading text-[28px] text-text">עגלות לקוחות</h1>
            <p className="text-[14px] text-text-muted mt-1">מעקב אחרי עגלות והזמנות סיטונאיות</p>
          </div>
          <Link href="/admin" className="text-accent text-[13px] hover:underline">← חזרה ללוח בקרה</Link>
        </div>

        {/* Filter Tabs */}
        <div className="flex gap-2 mb-8">
          {[
            { value: '', label: 'הכל' },
            { value: 'active', label: 'פעילות' },
            { value: 'submitted', label: 'הזמנות שנשלחו' },
          ].map(tab => (
            <button
              key={tab.value}
              onClick={() => { setFilter(tab.value); setLoadingData(true); }}
              className={`px-4 py-2 text-[13px] tracking-wide transition-all ${
                filter === tab.value ? 'bg-accent-light text-text' : 'bg-white border border-border text-text-muted hover:text-text'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {loadingData ? (
          <div className="text-center py-16 text-text-muted">טוען...</div>
        ) : carts.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-4xl mb-4 opacity-30">🛒</div>
            <p className="text-text-muted">אין עגלות {filter === 'submitted' ? 'שנשלחו' : filter === 'active' ? 'פעילות' : ''}</p>
          </div>
        ) : (
          <div className="space-y-4">
            {carts.map(cart => (
              <div key={cart.cartId} className="border border-border bg-white">
                {/* Cart Header */}
                <button
                  onClick={() => setExpandedCart(expandedCart === cart.cartId ? null : cart.cartId)}
                  className="w-full px-5 py-4 flex items-center justify-between text-right hover:bg-[#faf9f7] transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <div>
                      <div className="text-[15px] font-medium text-text">{cart.customer.name}</div>
                      <div className="text-[12px] text-text-muted">{cart.customer.email} {cart.customer.phone && `| ${cart.customer.phone}`}</div>
                    </div>
                    {cart.customer.discountPercent > 0 && (
                      <span className="text-[11px] px-2 py-0.5 bg-accent-light text-accent rounded">{cart.customer.discountPercent}%</span>
                    )}
                  </div>
                  <div className="flex items-center gap-5">
                    <span className={`text-[11px] px-2 py-1 rounded ${statusLabels[cart.status]?.className || ''}`}>
                      {statusLabels[cart.status]?.text || cart.status}
                    </span>
                    <div className="text-left">
                      <div className="text-[14px] font-medium text-text" dir="ltr">₪{cart.total.toLocaleString()}</div>
                      <div className="text-[11px] text-text-muted">{cart.itemCount} פריטים</div>
                    </div>
                    <svg className={`w-4 h-4 text-text-muted transition-transform ${expandedCart === cart.cartId ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </button>

                {/* Cart Items */}
                {expandedCart === cart.cartId && (
                  <div className="border-t border-border px-5 py-3">
                    <table className="w-full text-[13px]">
                      <thead>
                        <tr className="text-text-muted">
                          <th className="text-right py-2">מוצר</th>
                          <th className="text-center py-2">מחיר בסיס</th>
                          <th className="text-center py-2">מחיר ללקוח</th>
                          <th className="text-center py-2">כמות</th>
                          <th className="text-center py-2">סה״כ</th>
                        </tr>
                      </thead>
                      <tbody>
                        {cart.items.map(item => (
                          <tr key={item.productId} className="border-t border-border/50">
                            <td className="py-2 flex items-center gap-2">
                              {item.image && !item.image.includes('placeholder') ? (
                                <img src={item.image} alt="" className="w-8 h-8 object-cover" />
                              ) : null}
                              {item.nameHe}
                            </td>
                            <td className="text-center text-text-muted" dir="ltr">₪{item.basePrice.toLocaleString()}</td>
                            <td className="text-center" dir="ltr">₪{item.unitPrice.toLocaleString()}</td>
                            <td className="text-center">{item.quantity}</td>
                            <td className="text-center font-medium" dir="ltr">₪{item.lineTotal.toLocaleString()}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                    <div className="text-[11px] text-text-muted mt-2 pt-2 border-t border-border/50">
                      עודכן: {new Date(cart.updatedAt).toLocaleDateString('he-IL')} {new Date(cart.updatedAt).toLocaleTimeString('he-IL', { hour: '2-digit', minute: '2-digit' })}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
