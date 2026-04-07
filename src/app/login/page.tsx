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
    if (result.success) router.push('/products');
    else setError(result.error || 'שגיאה בהתחברות');
  };

  return (
    <div className="min-h-[75vh] flex items-center justify-center py-16 px-5">
      <div className="w-full max-w-[400px]">
        <div className="text-center mb-10">
          <h1 className="font-heading text-[32px] text-text">התחברות</h1>
          <div className="w-8 h-[1px] bg-accent mx-auto mt-3 mb-4" />
          <p className="text-[14px] text-text-muted">התחבר/י לחשבונך לצפייה במחירים</p>
        </div>

        <form onSubmit={handleSubmit}>
          {error && (
            <div className="mb-5 p-3 bg-red-50 text-red-600 text-[13px] text-center">
              {error}
            </div>
          )}

          <div className="mb-5">
            <label className="block text-[13px] text-text-muted mb-2 tracking-wide">שם משתמש</label>
            <input
              type="text"
              value={username}
              onChange={e => setUsername(e.target.value)}
              className="w-full px-4 py-3 border border-border text-[14px] focus:border-accent outline-none transition-colors"
              required
            />
          </div>

          <div className="mb-7">
            <label className="block text-[13px] text-text-muted mb-2 tracking-wide">סיסמה</label>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              className="w-full px-4 py-3 border border-border text-[14px] focus:border-accent outline-none transition-colors"
              required
            />
          </div>

          <button type="submit" disabled={loading} className="btn-primary w-full text-center disabled:opacity-50">
            {loading ? 'מתחבר...' : 'התחבר'}
          </button>

          <p className="text-center mt-7 text-[13px] text-text-muted">
            אין לך חשבון?{' '}
            <Link href="/register" className="text-accent hover:underline">הירשם/י כאן</Link>
          </p>
        </form>
      </div>
    </div>
  );
}
