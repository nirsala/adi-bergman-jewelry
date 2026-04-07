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
    if (result.success) setSuccess(true);
    else setError(result.error || 'שגיאה בהרשמה');
  };

  if (success) {
    return (
      <div className="min-h-[75vh] flex items-center justify-center py-16 px-5">
        <div className="w-full max-w-[400px] text-center">
          <h2 className="font-heading text-[28px] text-text mb-4">ההרשמה בוצעה בהצלחה!</h2>
          <div className="w-8 h-[1px] bg-accent mx-auto mb-5" />
          <p className="text-[14px] text-text-muted mb-8 leading-[1.7]">
            חשבונך ממתין לאישור מנהל. לאחר האישור תוכל/י להתחבר ולראות מחירים.
          </p>
          <Link href="/login" className="btn-primary">
            למסך ההתחברות
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[75vh] flex items-center justify-center py-16 px-5">
      <div className="w-full max-w-[400px]">
        <div className="text-center mb-10">
          <h1 className="font-heading text-[32px] text-text">הרשמה</h1>
          <div className="w-8 h-[1px] bg-accent mx-auto mt-3 mb-4" />
          <p className="text-[14px] text-text-muted">צור/י חשבון חדש לצפייה במחירי סיטונאות</p>
        </div>

        <form onSubmit={handleSubmit}>
          {error && (
            <div className="mb-5 p-3 bg-red-50 text-red-600 text-[13px] text-center">{error}</div>
          )}

          {[
            { key: 'name', label: 'שם מלא *', type: 'text', required: true },
            { key: 'username', label: 'שם משתמש *', type: 'text', required: true },
            { key: 'password', label: 'סיסמה *', type: 'password', required: true },
            { key: 'email', label: 'אימייל', type: 'email', required: false },
            { key: 'phone', label: 'טלפון', type: 'tel', required: false },
          ].map(field => (
            <div key={field.key} className="mb-4">
              <label className="block text-[13px] text-text-muted mb-2 tracking-wide">{field.label}</label>
              <input
                type={field.type}
                value={form[field.key as keyof typeof form]}
                onChange={e => setForm({ ...form, [field.key]: e.target.value })}
                className="w-full px-4 py-3 border border-border text-[14px] focus:border-accent outline-none transition-colors"
                required={field.required}
                minLength={field.key === 'password' ? 4 : undefined}
              />
            </div>
          ))}

          <button type="submit" disabled={loading} className="btn-primary w-full text-center mt-3 disabled:opacity-50">
            {loading ? 'נרשם...' : 'הירשם/י'}
          </button>

          <p className="text-center mt-7 text-[13px] text-text-muted">
            כבר יש לך חשבון?{' '}
            <Link href="/login" className="text-accent hover:underline">התחבר/י כאן</Link>
          </p>
        </form>
      </div>
    </div>
  );
}
