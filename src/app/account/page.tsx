'use client';

import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function AccountPage() {
  const { user, loading, logout } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  if (loading || !user) {
    return <div className="min-h-[80vh] flex items-center justify-center"><div className="text-gold">טוען...</div></div>;
  }

  const statusLabels: Record<string, { text: string; className: string; description: string }> = {
    pending: { text: 'ממתין לאישור', className: 'bg-amber-100 text-amber-700', description: 'חשבונך ממתין לאישור מנהל. לאחר האישור תוכל לראות מחירים.' },
    approved: { text: 'מאושר', className: 'bg-green-100 text-green-700', description: 'חשבונך מאושר! תוכל לראות מחירי סיטונאות.' },
    rejected: { text: 'חשבון חסום', className: 'bg-red-100 text-red-700', description: 'חשבונך נחסם. צור קשר עם המנהל לבירורים.' },
  };

  const status = statusLabels[user.status] || statusLabels.pending;

  return (
    <div className="min-h-[80vh] py-12">
      <div className="max-w-2xl mx-auto px-4">
        <h1 className="font-heading text-3xl font-bold text-charcoal mb-8">החשבון שלי</h1>

        <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center gap-4 mb-6 pb-6 border-b border-gray-100">
            <div className="w-16 h-16 rounded-full bg-gold/10 flex items-center justify-center">
              <span className="text-2xl font-heading font-bold text-gold">{user.name.charAt(0)}</span>
            </div>
            <div>
              <h2 className="text-xl font-bold text-charcoal">{user.name}</h2>
              <p className="text-gray-500">@{user.username}</p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex justify-between items-center py-3">
              <span className="text-gray-500">סטטוס חשבון</span>
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${status.className}`}>
                {status.text}
              </span>
            </div>

            <div className="p-4 bg-cream rounded-lg">
              <p className="text-sm text-gray-600">{status.description}</p>
            </div>

            {user.status === 'approved' && user.discountPercent > 0 && (
              <div className="flex justify-between items-center py-3">
                <span className="text-gray-500">הנחה אישית</span>
                <span className="text-lg font-bold text-gold">{user.discountPercent}%</span>
              </div>
            )}

            <div className="flex justify-between items-center py-3">
              <span className="text-gray-500">סוג חשבון</span>
              <span className="text-charcoal">{user.role === 'admin' ? 'מנהל' : 'לקוח'}</span>
            </div>
          </div>

          <button
            onClick={() => { logout(); router.push('/'); }}
            className="mt-8 w-full py-3 border border-red-200 text-red-600 rounded-lg hover:bg-red-50 transition-colors"
          >
            התנתק
          </button>
        </div>
      </div>
    </div>
  );
}
