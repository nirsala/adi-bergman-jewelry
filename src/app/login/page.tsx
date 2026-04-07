'use client';

import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function LoginPage() {
  const { login } = useAuth();
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const result = await login(username, password);
    setLoading(false);

    if (result.success) {
      router.push('/products');
    } else {
      setError(result.error || 'שגיאה בהתחברות');
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center py-12 px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="font-heading text-3xl font-bold text-charcoal">התחברות</h1>
          <div className="w-12 h-0.5 bg-gold mx-auto mt-3 mb-4" />
          <p className="text-gray-500">התחבר לחשבונך לצפייה במחירים</p>
        </div>

        <form onSubmit={handleSubmit} className="bg-white p-8 rounded-xl shadow-sm border border-gray-100">
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded text-red-700 text-sm">
              {error}
            </div>
          )}

          <div className="mb-5">
            <label className="block text-sm font-medium text-gray-700 mb-2">שם משתמש</label>
            <input
              type="text"
              value={username}
              onChange={e => setUsername(e.target.value)}
              className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-gold/50 focus:border-gold outline-none transition-all"
              placeholder="הכנס שם משתמש"
              required
            />
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">סיסמה</label>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-gold/50 focus:border-gold outline-none transition-all"
              placeholder="הכנס סיסמה"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-gold text-charcoal font-semibold rounded-lg hover:bg-gold-light transition-all disabled:opacity-50"
          >
            {loading ? 'מתחבר...' : 'התחבר'}
          </button>

          <p className="text-center mt-6 text-sm text-gray-500">
            אין לך חשבון?{' '}
            <Link href="/register" className="text-gold-dark font-medium hover:underline">
              הירשם כאן
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}
