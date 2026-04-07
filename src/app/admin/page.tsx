'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function AdminDashboard() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [stats, setStats] = useState({ totalUsers: 0, pendingUsers: 0, totalProducts: 0 });

  useEffect(() => {
    if (!loading && (!user || user.role !== 'admin')) {
      router.push('/login');
    }
  }, [user, loading, router]);

  useEffect(() => {
    if (user?.role === 'admin') {
      Promise.all([
        fetch('/api/admin/users').then(r => r.json()),
        fetch('/api/admin/products').then(r => r.json()),
      ]).then(([usersData, productsData]) => {
        const users = usersData.users || [];
        setStats({
          totalUsers: users.filter((u: { role: string }) => u.role === 'customer').length,
          pendingUsers: users.filter((u: { status: string }) => u.status === 'pending').length,
          totalProducts: (productsData.products || []).length,
        });
      });
    }
  }, [user]);

  if (loading || !user || user.role !== 'admin') {
    return <div className="min-h-[80vh] flex items-center justify-center"><div className="text-gold">טוען...</div></div>;
  }

  return (
    <div className="min-h-[80vh] py-12">
      <div className="max-w-6xl mx-auto px-4">
        <div className="mb-8">
          <h1 className="font-heading text-3xl font-bold text-charcoal">לוח בקרה</h1>
          <p className="text-gray-500 mt-2">שלום {user.name}, ברוך הבא לממשק הניהול</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <div className="text-3xl font-heading font-bold text-gold">{stats.totalUsers}</div>
            <div className="text-gray-500 mt-1">לקוחות רשומים</div>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <div className="text-3xl font-heading font-bold text-amber-500">{stats.pendingUsers}</div>
            <div className="text-gray-500 mt-1">ממתינים לאישור</div>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <div className="text-3xl font-heading font-bold text-gold">{stats.totalProducts}</div>
            <div className="text-gray-500 mt-1">מוצרים</div>
          </div>
        </div>

        {/* Quick Links */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Link
            href="/admin/customers"
            className="bg-white p-8 rounded-xl shadow-sm border border-gray-100 hover:shadow-md hover:border-gold/30 transition-all group"
          >
            <div className="text-4xl mb-4">👥</div>
            <h2 className="font-heading text-xl font-bold text-charcoal group-hover:text-gold-dark transition-colors">ניהול לקוחות</h2>
            <p className="text-gray-500 mt-2">אשר לקוחות חדשים, הגדר הנחות אישיות</p>
            {stats.pendingUsers > 0 && (
              <div className="mt-4 inline-block px-3 py-1 bg-amber-100 text-amber-700 rounded-full text-sm font-medium">
                {stats.pendingUsers} ממתינים לאישור
              </div>
            )}
          </Link>
          <Link
            href="/admin/products"
            className="bg-white p-8 rounded-xl shadow-sm border border-gray-100 hover:shadow-md hover:border-gold/30 transition-all group"
          >
            <div className="text-4xl mb-4">💎</div>
            <h2 className="font-heading text-xl font-bold text-charcoal group-hover:text-gold-dark transition-colors">ניהול מוצרים</h2>
            <p className="text-gray-500 mt-2">הוסף, ערוך או מחק מוצרים מהקטלוג</p>
          </Link>
        </div>
      </div>
    </div>
  );
}
