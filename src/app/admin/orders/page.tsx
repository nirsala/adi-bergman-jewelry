'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface Order {
  id: string;
  userId: string;
  items: { productId: string; nameHe: string; quantity: number; unitPrice: number; lineTotal: number }[];
  total: number;
  status: string;
  notes: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  customerGroup: string;
  createdAt: string;
}

const statusOptions = [
  { value: 'pending', label: 'ממתין לטיפול' },
  { value: 'processing', label: 'בטיפול' },
  { value: 'shipped', label: 'נשלח' },
  { value: 'completed', label: 'הושלם' },
  { value: 'cancelled', label: 'בוטל' },
];

const statusColors: Record<string, string> = {
  pending: 'bg-amber-100 text-amber-700',
  processing: 'bg-blue-100 text-blue-700',
  shipped: 'bg-purple-100 text-purple-700',
  completed: 'bg-green-100 text-green-700',
  cancelled: 'bg-red-100 text-red-700',
};

const groupLabels: Record<string, string> = { new: 'חדש', regular: 'רגיל', vip: 'VIP' };

export default function AdminOrdersPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loadingData, setLoadingData] = useState(true);
  const [expandedOrder, setExpandedOrder] = useState<string | null>(null);

  useEffect(() => {
    if (!loading && (!user || user.role !== 'admin')) router.push('/login');
  }, [user, loading, router]);

  const fetchOrders = () => {
    fetch('/api/admin/orders').then(r => r.json()).then(data => {
      setOrders(data.orders || []);
      setLoadingData(false);
    });
  };

  useEffect(() => { if (user?.role === 'admin') fetchOrders(); }, [user]);

  const updateStatus = async (orderId: string, status: string) => {
    await fetch(`/api/admin/orders/${orderId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    });
    fetchOrders();
  };

  if (loading || !user || user.role !== 'admin') {
    return <div className="min-h-[75vh] flex items-center justify-center"><div className="text-accent">טוען...</div></div>;
  }

  return (
    <div className="min-h-[75vh] py-12">
      <div className="max-w-[1100px] mx-auto px-5 md:px-10">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="font-heading text-[28px] text-text">ניהול הזמנות</h1>
            <p className="text-[14px] text-text-muted mt-1">{orders.length} הזמנות</p>
          </div>
          <Link href="/admin" className="text-accent text-[13px] hover:underline">← חזרה ללוח בקרה</Link>
        </div>

        {loadingData ? (
          <div className="text-center py-16 text-text-muted">טוען...</div>
        ) : orders.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-4xl mb-4 opacity-30">📦</div>
            <p className="text-text-muted">אין הזמנות עדיין</p>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map(order => (
              <div key={order.id} className="border border-border bg-white">
                <button
                  onClick={() => setExpandedOrder(expandedOrder === order.id ? null : order.id)}
                  className="w-full px-5 py-4 flex items-center justify-between text-right hover:bg-[#faf9f7] transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <div>
                      <div className="text-[14px] font-medium text-text">{order.customerName}</div>
                      <div className="text-[12px] text-text-muted">
                        {new Date(order.createdAt).toLocaleDateString('he-IL')} | {order.customerEmail}
                        {order.customerGroup !== 'new' && <span className="mr-2 text-accent">({groupLabels[order.customerGroup]})</span>}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className={`text-[11px] px-2 py-1 rounded ${statusColors[order.status] || 'bg-gray-100'}`}>
                      {statusOptions.find(s => s.value === order.status)?.label || order.status}
                    </span>
                    <span className="text-[15px] font-medium text-text" dir="ltr">₪{order.total.toLocaleString()}</span>
                    <svg className={`w-4 h-4 text-text-muted transition-transform ${expandedOrder === order.id ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </button>

                {expandedOrder === order.id && (
                  <div className="border-t border-border px-5 py-4">
                    {/* Items table */}
                    <table className="w-full text-[13px] mb-4">
                      <thead>
                        <tr className="text-text-muted">
                          <th className="text-right py-2">מוצר</th>
                          <th className="text-center py-2">כמות</th>
                          <th className="text-center py-2">מחיר</th>
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

                    {/* Status + Phone + WhatsApp */}
                    <div className="flex flex-wrap gap-4 items-center pt-3 border-t border-border/50">
                      <div className="flex items-center gap-2">
                        <span className="text-[12px] text-text-muted">סטטוס:</span>
                        <select
                          value={order.status}
                          onChange={e => updateStatus(order.id, e.target.value)}
                          className="text-[12px] px-2 py-1 border border-border focus:border-accent outline-none"
                        >
                          {statusOptions.map(s => (
                            <option key={s.value} value={s.value}>{s.label}</option>
                          ))}
                        </select>
                      </div>
                      {order.customerPhone && (
                        <a
                          href={`https://wa.me/972${order.customerPhone.replace(/^0/, '').replace(/-/g, '')}?text=${encodeURIComponent(`שלום ${order.customerName}, לגבי הזמנה #${order.id.slice(0, 8)}...`)}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-[12px] text-green-600 hover:underline"
                        >
                          שלח WhatsApp
                        </a>
                      )}
                      <span className="text-[13px] font-medium mr-auto" dir="ltr">סה״כ: ₪{order.total.toLocaleString()}</span>
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
