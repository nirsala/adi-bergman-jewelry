'use client';

import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import Link from 'next/link';

export default function RegisterPage() {
  const { register } = useAuth();
  const [form, setForm] = useState({ username: '', password: '', name: '', email: '', phone: '' });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const result = await register(form);
    setLoading(false);

    if (result.success) {
      setSuccess(true);
    } else {
      setError(result.error || 'שגיאה בהרשמה');
    }
  };

  if (success) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center py-12 px-4">
        <div className="w-full max-w-md text-center">
          <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100">
            <div className="text-5xl mb-4">✅</div>
            <h2 className="font-heading text-2xl font-bold text-charcoal mb-3">ההרשמה בוצעה בהצלחה!</h2>
            <p className="text-gray-600 mb-6">
              חשבונך ממתין לאישור מנהל. לאחר האישור תוכל להתחבר ולראות מחירים.
            </p>
            <Link
              href="/login"
              className="inline-block px-6 py-3 bg-gold text-charcoal font-semibold rounded-lg hover:bg-gold-light transition-all"
            >
              למסך ההתחברות
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[80vh] flex items-center justify-center py-12 px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="font-heading text-3xl font-bold text-charcoal">הרשמה</h1>
          <div className="w-12 h-0.5 bg-gold mx-auto mt-3 mb-4" />
          <p className="text-gray-500">צור חשבון חדש לצפייה במחירי סיטונאות</p>
        </div>

        <form onSubmit={handleSubmit} className="bg-white p-8 rounded-xl shadow-sm border border-gray-100">
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded text-red-700 text-sm">
              {error}
            </div>
          )}

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">שם מלא *</label>
            <input
              type="text"
              value={form.name}
              onChange={e => setForm({ ...form, name: e.target.value })}
              className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-gold/50 focus:border-gold outline-none transition-all"
              placeholder="השם המלא שלך"
              required
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">שם משתמש *</label>
            <input
              type="text"
              value={form.username}
              onChange={e => setForm({ ...form, username: e.target.value })}
              className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-gold/50 focus:border-gold outline-none transition-all"
              placeholder="בחר שם משתמש"
              required
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">סיסמה *</label>
            <input
              type="password"
              value={form.password}
              onChange={e => setForm({ ...form, password: e.target.value })}
              className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-gold/50 focus:border-gold outline-none transition-all"
              placeholder="לפחות 4 תווים"
              required
              minLength={4}
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">אימייל</label>
            <input
              type="email"
              value={form.email}
              onChange={e => setForm({ ...form, email: e.target.value })}
              className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-gold/50 focus:border-gold outline-none transition-all"
              placeholder="your@email.com"
            />
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">טלפון</label>
            <input
              type="tel"
              value={form.phone}
              onChange={e => setForm({ ...form, phone: e.target.value })}
              className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-gold/50 focus:border-gold outline-none transition-all"
              placeholder="050-0000000"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-gold text-charcoal font-semibold rounded-lg hover:bg-gold-light transition-all disabled:opacity-50"
          >
            {loading ? 'נרשם...' : 'הירשם'}
          </button>

          <p className="text-center mt-6 text-sm text-gray-500">
            כבר יש לך חשבון?{' '}
            <Link href="/login" className="text-gold-dark font-medium hover:underline">
              התחבר כאן
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}
