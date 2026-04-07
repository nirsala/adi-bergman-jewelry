'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface OrderItem {
  productId: string;
  nameHe: string;
  quantity: number;
  unitPrice: number;
  lineTotal: number;
}

interface Order {
  id: string;
  items: OrderItem[];
  total: number;
  status: string;
  createdAt: string;
}

const statusLabels: Record<string, { text: string; className: string }> = {
  pending: { text: 'ממתין לטיפול', className: 'bg-amber-100 text-amber-700' },
  processing: { text: 'בטיפול', className: 'bg-blue-100 text-blue-700' },
  shipped: { text: 'נשלח', className: 'bg-purple-100 text-purple-700' },
  completed: { text: 'הושלם', className: 'bg-green-100 text-green-700' },
  cancelled: { text: 'בוטל', className: 'bg-red-100 text-red-700' },
};

export default function OrdersPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedOrder, setExpandedOrder] = useState<string | null>(null);
  const [reordering, setReordering] = useState<string | null>(null);

  useEffect(() => {
    if (!authLoading && !user) router.push('/login');
  }, [user, authLoading, router]);

  useEffect(() => {
    if (user) {
      fetch('/api/orders').then(r => r.json()).then(data => {
        setOrders(data.orders || []);
        setLoading(false);
      }).catch(() => setLoading(false));
    }
  }, [user]);

  const handleReorder = async (orderId: string) => {
    setReordering(orderId);
    const res = await fetch('/api/orders', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ orderId }),
    });
    if (res.ok) {
      router.push('/cart');
    }
    setReordering(null);
  };

  if (authLoading || !user) return <div className="min-h-[75vh] flex items-center justify-center"><div className="text-accent">טוען...</div></div>;

  return (
    <div className="min-h-[75vh] py-12 md:py-16">
      <div className="max-w-[900px] mx-auto px-5 md:px-10">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="font-heading text-[28px] text-text">ההזמנות שלי</h1>
            <p className="text-[13px] text-text-muted mt-1">{orders.length} הזמנות</p>
          </div>
          <Link href="/account" className="text-accent text-[13px] hover:underline">← חזרה לחשבון</Link>
        </div>

        {loading ? (
          <div className="text-center py-16 text-text-muted">טוען...</div>
        ) : orders.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-4xl mb-4 opacity-30">📦</div>
            <p className="text-text-muted text-[14px] mb-6">עדיין אין הזמנות</p>
            <Link href="/products" className="btn-primary">לקולקציה</Link>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map(order => (
              <div key={order.id} className="border border-border bg-white">
                <button
                  onClick={() => setExpandedOrder(expandedOrder === order.id ? null : order.id)}
                  className="w-full px-5 py-4 flex items-center justify-between text-right hover:bg-[#faf9f7] transition-colors"
                >
                  <div>
                    <div className="text-[14px] font-medium text-text">
                      הזמנה #{order.id.slice(0, 8)}
                    </div>
                    <div className="text-[12px] text-text-muted mt-0.5">
                      {new Date(order.createdAt).toLocaleDateString('he-IL')}
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className={`text-[11px] px-2 py-1 rounded ${statusLabels[order.status]?.className || 'bg-gray-100 text-gray-600'}`}>
                      {statusLabels[order.status]?.text || order.status}
                    </span>
                    <span className="text-[15px] font-medium text-text" dir="ltr">₪{order.total.toLocaleString()}</span>
                    <svg className={`w-4 h-4 text-text-muted transition-transform ${expandedOrder === order.id ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </button>

                {expandedOrder === order.id && (
                  <div className="border-t border-border px-5 py-4">
                    <table className="w-full text-[13px] mb-4">
                      <thead>
                        <tr className="text-text-muted">
                          <th className="text-right py-2">מוצר</th>
                          <th className="text-center py-2">כמות</th>
                          <th className="text-center py-2">מחיר יחידה</th>
                          <th className="text-center py-2">סה״כ</th>
                        </tr>
                      </thead>
                      <tbody>
                        {order.items.map((item, i) => (
                          <tr key={i} className="border-t border-border/50">
                            <td className="py-2">{item.nameHe}</td>
                            <td className="text-center">{item.quantity}</td>
                            <td className="text-center" dir="ltr">₪{item.unitPrice.toLocaleString()}</td>
                            <td className="text-center font-medium" dir="ltr">₪{item.lineTotal.toLocaleString()}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                    <div className="flex justify-between items-center pt-3 border-t border-border/50">
                      <button
                        onClick={() => handleReorder(order.id)}
                        disabled={reordering === order.id}
                        className="text-[13px] text-accent hover:underline disabled:opacity-50"
                      >
                        {reordering === order.id ? 'מעתיק...' : 'הזמן שוב'}
                      </button>
                      <div className="text-[15px] font-medium" dir="ltr">סה״כ: ₪{order.total.toLocaleString()}</div>
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
