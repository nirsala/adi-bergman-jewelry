'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface Stats {
  totalProducts: number;
  inStockProducts: number;
  totalCustomers: number;
  pendingApprovals: number;
  activeCarts: number;
  submittedCarts: number;
  recentActivity: { type: string; description: string; timestamp: string }[];
}

export default function AdminDashboard() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [stats, setStats] = useState<Stats | null>(null);

  useEffect(() => {
    if (!loading && (!user || user.role !== 'admin')) router.push('/login');
  }, [user, loading, router]);

  useEffect(() => {
    if (user?.role === 'admin') {
      fetch('/api/admin/stats').then(r => r.json()).then(setStats);
    }
  }, [user]);

  if (loading || !user || user.role !== 'admin') {
    return <div className="min-h-[75vh] flex items-center justify-center"><div className="text-accent">טוען...</div></div>;
  }

  const activityIcons: Record<string, string> = {
    customer_registered: '👤',
    product_added: '💎',
    cart_updated: '🛒',
    cart_submitted: '📦',
  };

  const relativeTime = (timestamp: string) => {
    const diff = Date.now() - new Date(timestamp).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 60) return `לפני ${mins} דקות`;
    const hours = Math.floor(mins / 60);
    if (hours < 24) return `לפני ${hours} שעות`;
    const days = Math.floor(hours / 24);
    return `לפני ${days} ימים`;
  };

  return (
    <div className="min-h-[75vh] py-12">
      <div className="max-w-[1100px] mx-auto px-5 md:px-10">
        <div className="mb-10">
          <h1 className="font-heading text-[28px] text-text">לוח בקרה</h1>
          <p className="text-[14px] text-text-muted mt-1">שלום {user.name}, ברוך הבא לממשק הניהול</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
          <div className="border border-border p-5">
            <div className="font-heading text-[28px] text-accent">{stats?.totalProducts || 0}</div>
            <div className="text-[12px] text-text-muted tracking-wide mt-1">מוצרים</div>
            <div className="text-[11px] text-text-muted">{stats?.inStockProducts || 0} במלאי</div>
          </div>
          <div className="border border-border p-5">
            <div className="font-heading text-[28px] text-text">{stats?.totalCustomers || 0}</div>
            <div className="text-[12px] text-text-muted tracking-wide mt-1">לקוחות</div>
          </div>
          <div className={`border p-5 ${stats?.pendingApprovals ? 'border-amber-300 bg-amber-50/50' : 'border-border'}`}>
            <div className={`font-heading text-[28px] ${stats?.pendingApprovals ? 'text-amber-600' : 'text-text'}`}>{stats?.pendingApprovals || 0}</div>
            <div className="text-[12px] text-text-muted tracking-wide mt-1">ממתינים לאישור</div>
          </div>
          <div className="border border-border p-5">
            <div className="font-heading text-[28px] text-accent">{stats?.activeCarts || 0}</div>
            <div className="text-[12px] text-text-muted tracking-wide mt-1">עגלות פעילות</div>
            <div className="text-[11px] text-text-muted">{stats?.submittedCarts || 0} הזמנות</div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          {/* Quick Actions */}
          <div className="md:col-span-1 space-y-3">
            <h2 className="text-[13px] tracking-[0.1em] uppercase text-text-muted mb-4">פעולות מהירות</h2>
            <Link href="/admin/customers" className="flex items-center justify-between p-4 border border-border hover:border-accent/30 transition-colors group">
              <div className="flex items-center gap-3">
                <span className="text-lg">👥</span>
                <span className="text-[14px] text-text group-hover:text-accent transition-colors">ניהול לקוחות</span>
              </div>
              {(stats?.pendingApprovals || 0) > 0 && (
                <span className="text-[11px] px-2 py-0.5 bg-amber-100 text-amber-700 rounded">{stats?.pendingApprovals}</span>
              )}
            </Link>
            <Link href="/admin/products" className="flex items-center justify-between p-4 border border-border hover:border-accent/30 transition-colors group">
              <div className="flex items-center gap-3">
                <span className="text-lg">💎</span>
                <span className="text-[14px] text-text group-hover:text-accent transition-colors">ניהול מוצרים</span>
              </div>
              <span className="text-[11px] text-text-muted">{stats?.totalProducts}</span>
            </Link>
            <Link href="/admin/carts" className="flex items-center justify-between p-4 border border-border hover:border-accent/30 transition-colors group">
              <div className="flex items-center gap-3">
                <span className="text-lg">🛒</span>
                <span className="text-[14px] text-text group-hover:text-accent transition-colors">עגלות והזמנות</span>
              </div>
              {(stats?.activeCarts || 0) + (stats?.submittedCarts || 0) > 0 && (
                <span className="text-[11px] px-2 py-0.5 bg-accent-light text-accent rounded">
                  {(stats?.activeCarts || 0) + (stats?.submittedCarts || 0)}
                </span>
              )}
            </Link>
            <Link href="/admin/orders" className="flex items-center justify-between p-4 border border-border hover:border-accent/30 transition-colors group">
              <div className="flex items-center gap-3">
                <span className="text-lg">📦</span>
                <span className="text-[14px] text-text group-hover:text-accent transition-colors">ניהול הזמנות</span>
              </div>
              {(stats?.submittedCarts || 0) > 0 && (
                <span className="text-[11px] px-2 py-0.5 bg-green-100 text-green-700 rounded">
                  {stats?.submittedCarts}
                </span>
              )}
            </Link>
          </div>

          {/* Activity Feed */}
          <div className="md:col-span-2">
            <h2 className="text-[13px] tracking-[0.1em] uppercase text-text-muted mb-4">פעילות אחרונה</h2>
            <div className="border border-border divide-y divide-border">
              {stats?.recentActivity && stats.recentActivity.length > 0 ? (
                stats.recentActivity.map((activity, i) => (
                  <div key={i} className="flex items-center gap-3 px-4 py-3">
                    <span className="text-lg">{activityIcons[activity.type] || '📋'}</span>
                    <div className="flex-1">
                      <div className="text-[13px] text-text">{activity.description}</div>
                    </div>
                    <div className="text-[11px] text-text-muted whitespace-nowrap">{relativeTime(activity.timestamp)}</div>
                  </div>
                ))
              ) : (
                <div className="px-4 py-8 text-center text-text-muted text-[13px]">אין פעילות אחרונה</div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
