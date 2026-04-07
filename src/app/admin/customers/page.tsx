'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface Customer {
  id: string;
  username: string;
  name: string;
  email: string;
  phone: string;
  role: string;
  status: string;
  discountPercent: number;
  customerGroup?: string;
  createdAt: string;
}

const groupLabels: Record<string, string> = { new: 'חדש', regular: 'רגיל', vip: 'VIP' };
const groupDefaults: Record<string, number> = { new: 0, regular: 10, vip: 20 };

export default function AdminCustomersPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loadingData, setLoadingData] = useState(true);

  useEffect(() => {
    if (!loading && (!user || user.role !== 'admin')) router.push('/login');
  }, [user, loading, router]);

  const fetchCustomers = () => {
    fetch('/api/admin/users').then(r => r.json()).then(data => {
      setCustomers((data.users || []).filter((u: Customer) => u.role === 'customer'));
      setLoadingData(false);
    });
  };

  useEffect(() => { if (user?.role === 'admin') fetchCustomers(); }, [user]);

  const updateCustomer = async (id: string, updates: Record<string, unknown>) => {
    await fetch(`/api/admin/users/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updates),
    });
    fetchCustomers();
  };

  const setGroup = async (id: string, group: string) => {
    const defaultDiscount = groupDefaults[group] || 0;
    await updateCustomer(id, { customerGroup: group, discountPercent: defaultDiscount });
  };

  if (loading || !user || user.role !== 'admin') {
    return <div className="min-h-[75vh] flex items-center justify-center"><div className="text-accent">טוען...</div></div>;
  }

  const statusLabels: Record<string, { text: string; className: string }> = {
    pending: { text: 'ממתין', className: 'bg-amber-100 text-amber-700' },
    approved: { text: 'מאושר', className: 'bg-green-100 text-green-700' },
    rejected: { text: 'נדחה', className: 'bg-red-100 text-red-700' },
  };

  return (
    <div className="min-h-[75vh] py-12">
      <div className="max-w-[1100px] mx-auto px-5 md:px-10">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="font-heading text-[28px] text-text">ניהול לקוחות</h1>
            <p className="text-[14px] text-text-muted mt-1">אשר לקוחות, הגדר קבוצות והנחות</p>
          </div>
          <Link href="/admin" className="text-accent text-[13px] hover:underline">← חזרה ללוח בקרה</Link>
        </div>

        {loadingData ? (
          <div className="text-center py-16 text-text-muted">טוען...</div>
        ) : customers.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-4xl mb-4 opacity-30">👥</div>
            <p className="text-text-muted">אין לקוחות רשומים עדיין</p>
          </div>
        ) : (
          <div className="border border-border bg-white overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-right text-[13px]">
                <thead className="bg-[#f5f0ec] border-b border-border">
                  <tr>
                    <th className="px-4 py-3 text-text-muted tracking-wide">שם</th>
                    <th className="px-4 py-3 text-text-muted tracking-wide">אימייל / טלפון</th>
                    <th className="px-4 py-3 text-text-muted tracking-wide">סטטוס</th>
                    <th className="px-4 py-3 text-text-muted tracking-wide">קבוצה</th>
                    <th className="px-4 py-3 text-text-muted tracking-wide">הנחה %</th>
                    <th className="px-4 py-3 text-text-muted tracking-wide">פעולות</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/50">
                  {customers.map(customer => (
                    <tr key={customer.id} className="hover:bg-[#faf9f7] transition-colors">
                      <td className="px-4 py-3">
                        <div className="font-medium text-text">{customer.name}</div>
                        <div className="text-[11px] text-text-muted">@{customer.username}</div>
                      </td>
                      <td className="px-4 py-3 text-text-muted">
                        <div>{customer.email || '-'}</div>
                        <div>{customer.phone || ''}</div>
                      </td>
                      <td className="px-4 py-3">
                        <span className={`text-[11px] px-2 py-1 rounded ${statusLabels[customer.status]?.className || 'bg-gray-100'}`}>
                          {statusLabels[customer.status]?.text || customer.status}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <select
                          value={customer.customerGroup || 'new'}
                          onChange={e => setGroup(customer.id, e.target.value)}
                          className="text-[12px] px-2 py-1 border border-border focus:border-accent outline-none"
                        >
                          <option value="new">חדש (0%)</option>
                          <option value="regular">רגיל (10%)</option>
                          <option value="vip">VIP (20%)</option>
                        </select>
                      </td>
                      <td className="px-4 py-3">
                        <input
                          type="number"
                          min="0" max="100"
                          value={customer.discountPercent}
                          onChange={e => updateCustomer(customer.id, { discountPercent: Number(e.target.value) })}
                          className="w-16 px-2 py-1 border border-border text-center text-[12px] focus:border-accent outline-none"
                        />
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex gap-2">
                          {customer.status === 'pending' && (
                            <>
                              <button onClick={() => updateCustomer(customer.id, { status: 'approved' })} className="px-2 py-1 text-[11px] bg-green-100 text-green-700 hover:bg-green-200 transition-colors">אשר</button>
                              <button onClick={() => updateCustomer(customer.id, { status: 'rejected' })} className="px-2 py-1 text-[11px] bg-red-50 text-red-500 hover:bg-red-100 transition-colors">דחה</button>
                            </>
                          )}
                          {customer.status === 'approved' && (
                            <button onClick={() => updateCustomer(customer.id, { status: 'rejected' })} className="px-2 py-1 text-[11px] bg-red-50 text-red-500 hover:bg-red-100 transition-colors">חסום</button>
                          )}
                          {customer.status === 'rejected' && (
                            <button onClick={() => updateCustomer(customer.id, { status: 'approved' })} className="px-2 py-1 text-[11px] bg-green-100 text-green-700 hover:bg-green-200 transition-colors">אשר מחדש</button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
