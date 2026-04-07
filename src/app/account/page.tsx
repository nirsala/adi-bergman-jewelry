'use client';

import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import Link from 'next/link';

export default function AccountPage() {
  const { user, loading, logout } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) router.push('/login');
  }, [user, loading, router]);

  if (loading || !user) return <div className="min-h-[75vh] flex items-center justify-center"><div className="text-accent text-[15px]">טוען...</div></div>;

  const statusLabels: Record<string, { text: string; color: string; desc: string }> = {
    pending: { text: 'ממתין לאישור', color: 'text-accent', desc: 'חשבונך ממתין לאישור מנהל. לאחר האישור תוכל/י לראות מחירים.' },
    approved: { text: 'מאושר', color: 'text-green-600', desc: 'חשבונך מאושר! תוכל/י לראות מחירי סיטונאות.' },
    rejected: { text: 'חשבון חסום', color: 'text-red-500', desc: 'חשבונך נחסם. צור/י קשר עם המנהל לבירורים.' },
  };
  const status = statusLabels[user.status] || statusLabels.pending;

  return (
    <div className="min-h-[75vh] py-12 md:py-16">
      <div className="max-w-[450px] mx-auto px-5">
        <h1 className="font-heading text-[32px] text-text text-center mb-10">החשבון שלי</h1>

        <div className="border border-border p-8">
          <div className="text-center mb-6 pb-6 border-b border-border">
            <div className="w-14 h-14 rounded-full bg-accent-light flex items-center justify-center mx-auto mb-3">
              <span className="font-heading text-[22px] text-accent">{user.name.charAt(0)}</span>
            </div>
            <h2 className="text-[18px] font-medium text-text">{user.name}</h2>
            <p className="text-[13px] text-text-muted">@{user.username}</p>
          </div>

          <div className="space-y-4 text-[14px]">
            <div className="flex justify-between items-center">
              <span className="text-text-muted">סטטוס</span>
              <span className={status.color}>{status.text}</span>
            </div>
            <div className="p-3 bg-[#f5f0ec] text-[13px] text-text-light leading-[1.6]">{status.desc}</div>
            {user.status === 'approved' && user.discountPercent > 0 && (
              <div className="flex justify-between items-center">
                <span className="text-text-muted">הנחה אישית</span>
                <span className="text-accent font-medium">{user.discountPercent}%</span>
              </div>
            )}
            <div className="flex justify-between items-center">
              <span className="text-text-muted">סוג חשבון</span>
              <span>{user.role === 'admin' ? 'מנהל' : 'לקוח'}</span>
            </div>
          </div>

          {/* Quick Links */}
          {user.status === 'approved' && (
            <div className="mt-6 pt-6 border-t border-border space-y-3">
              <Link href="/account/orders" className="flex items-center justify-between p-3 hover:bg-[#f5f0ec] transition-colors">
                <span className="text-[14px]">ההזמנות שלי</span>
                <span className="text-[13px] text-accent">→</span>
              </Link>
              <Link href="/cart" className="flex items-center justify-between p-3 hover:bg-[#f5f0ec] transition-colors">
                <span className="text-[14px]">העגלה שלי</span>
                <span className="text-[13px] text-accent">→</span>
              </Link>
              <a href="/api/catalog" className="flex items-center justify-between p-3 hover:bg-[#f5f0ec] transition-colors">
                <span className="text-[14px]">הורד קטלוג מחירים (CSV)</span>
                <span className="text-[13px] text-accent">↓</span>
              </a>
            </div>
          )}

          <button
            onClick={() => { logout(); router.push('/'); }}
            className="btn-outline w-full text-center mt-6"
          >
            התנתק
          </button>
        </div>
      </div>
    </div>
  );
}
