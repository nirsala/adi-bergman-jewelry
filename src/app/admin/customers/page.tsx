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
  createdAt: string;
}

export default function AdminCustomersPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loadingData, setLoadingData] = useState(true);

  useEffect(() => {
    if (!loading && (!user || user.role !== 'admin')) {
      router.push('/login');
    }
  }, [user, loading, router]);

  const fetchCustomers = () => {
    fetch('/api/admin/users')
      .then(r => r.json())
      .then(data => {
        setCustomers((data.users || []).filter((u: Customer) => u.role === 'customer'));
        setLoadingData(false);
      });
  };

  useEffect(() => {
    if (user?.role === 'admin') fetchCustomers();
  }, [user]);

  const updateCustomer = async (id: string, updates: Record<string, unknown>) => {
    await fetch(`/api/admin/users/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updates),
    });
    fetchCustomers();
  };

  if (loading || !user || user.role !== 'admin') {
    return <div className="min-h-[80vh] flex items-center justify-center"><div className="text-gold">טוען...</div></div>;
  }

  const statusLabels: Record<string, { text: string; className: string }> = {
    pending: { text: 'ממתין', className: 'bg-amber-100 text-amber-700' },
    approved: { text: 'מאושר', className: 'bg-green-100 text-green-700' },
    rejected: { text: 'נדחה', className: 'bg-red-100 text-red-700' },
  };

  return (
    <div className="min-h-[80vh] py-12">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="font-heading text-3xl font-bold text-charcoal">ניהול לקוחות</h1>
            <p className="text-gray-500 mt-1">אשר לקוחות והגדר הנחות אישיות</p>
          </div>
          <Link href="/admin" className="text-gold hover:text-gold-dark transition-colors">
            ← חזרה ללוח בקרה
          </Link>
        </div>

        {loadingData ? (
          <div className="text-center py-20 text-gray-400">טוען...</div>
        ) : customers.length === 0 ? (
          <div className="text-center py-20 text-gray-400">
            <div className="text-5xl mb-4">👥</div>
            <p>אין לקוחות רשומים עדיין</p>
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-right">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-4 text-sm font-medium text-gray-500">שם</th>
                    <th className="px-6 py-4 text-sm font-medium text-gray-500">שם משתמש</th>
                    <th className="px-6 py-4 text-sm font-medium text-gray-500">אימייל</th>
                    <th className="px-6 py-4 text-sm font-medium text-gray-500">טלפון</th>
                    <th className="px-6 py-4 text-sm font-medium text-gray-500">סטטוס</th>
                    <th className="px-6 py-4 text-sm font-medium text-gray-500">הנחה %</th>
                    <th className="px-6 py-4 text-sm font-medium text-gray-500">פעולות</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {customers.map(customer => (
                    <tr key={customer.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 font-medium text-charcoal">{customer.name}</td>
                      <td className="px-6 py-4 text-gray-500">{customer.username}</td>
                      <td className="px-6 py-4 text-gray-500">{customer.email || '-'}</td>
                      <td className="px-6 py-4 text-gray-500">{customer.phone || '-'}</td>
                      <td className="px-6 py-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${statusLabels[customer.status]?.className || 'bg-gray-100 text-gray-600'}`}>
                          {statusLabels[customer.status]?.text || customer.status}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <input
                          type="number"
                          min="0"
                          max="100"
                          value={customer.discountPercent}
                          onChange={e => updateCustomer(customer.id, { discountPercent: Number(e.target.value) })}
                          className="w-20 px-2 py-1 border border-gray-200 rounded text-center focus:ring-2 focus:ring-gold/50 focus:border-gold outline-none"
                        />
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex gap-2">
                          {customer.status === 'pending' && (
                            <>
                              <button
                                onClick={() => updateCustomer(customer.id, { status: 'approved' })}
                                className="px-3 py-1 bg-green-600 text-white text-xs rounded hover:bg-green-700 transition-colors"
                              >
                                אשר
                              </button>
                              <button
                                onClick={() => updateCustomer(customer.id, { status: 'rejected' })}
                                className="px-3 py-1 bg-red-600 text-white text-xs rounded hover:bg-red-700 transition-colors"
                              >
                                דחה
                              </button>
                            </>
                          )}
                          {customer.status === 'approved' && (
                            <button
                              onClick={() => updateCustomer(customer.id, { status: 'rejected' })}
                              className="px-3 py-1 bg-red-100 text-red-700 text-xs rounded hover:bg-red-200 transition-colors"
                            >
                              חסום
                            </button>
                          )}
                          {customer.status === 'rejected' && (
                            <button
                              onClick={() => updateCustomer(customer.id, { status: 'approved' })}
                              className="px-3 py-1 bg-green-100 text-green-700 text-xs rounded hover:bg-green-200 transition-colors"
                            >
                              אשר מחדש
                            </button>
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
