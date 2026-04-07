'use client';

import Link from 'next/link';
import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';

export default function Header() {
  const { user, logout } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="bg-charcoal text-white sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gold flex items-center justify-center text-charcoal font-bold text-lg font-heading">
              AB
            </div>
            <div>
              <div className="text-lg font-heading font-semibold tracking-wide text-gold">Adi Bergman</div>
              <div className="text-xs text-gray-400 -mt-1">Moissanite Jewelry</div>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            <Link href="/" className="text-sm hover:text-gold transition-colors">דף הבית</Link>
            <Link href="/products" className="text-sm hover:text-gold transition-colors">קולקציה</Link>
            <Link href="/products?category=rings" className="text-sm hover:text-gold transition-colors">טבעות</Link>
            <Link href="/products?category=necklaces" className="text-sm hover:text-gold transition-colors">שרשראות</Link>
            <Link href="/products?category=earrings" className="text-sm hover:text-gold transition-colors">עגילים</Link>
            <Link href="/products?category=bracelets" className="text-sm hover:text-gold transition-colors">צמידים</Link>
          </nav>

          {/* Auth Buttons */}
          <div className="hidden md:flex items-center gap-4">
            {user ? (
              <>
                {user.role === 'admin' && (
                  <Link href="/admin" className="text-sm text-gold hover:text-gold-light transition-colors">
                    ניהול
                  </Link>
                )}
                <Link href="/account" className="text-sm hover:text-gold transition-colors">
                  שלום, {user.name}
                </Link>
                <button
                  onClick={logout}
                  className="text-sm px-4 py-2 border border-gold/30 rounded hover:bg-gold/10 transition-colors"
                >
                  התנתק
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  className="text-sm px-5 py-2 bg-gold text-charcoal rounded font-medium hover:bg-gold-light transition-colors"
                >
                  התחברות
                </Link>
                <Link
                  href="/register"
                  className="text-sm px-5 py-2 border border-gold/30 rounded hover:bg-gold/10 transition-colors"
                >
                  הרשמה
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="md:hidden text-white p-2"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {menuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile Menu */}
        {menuOpen && (
          <div className="md:hidden pb-4 border-t border-gray-700">
            <nav className="flex flex-col gap-3 pt-4">
              <Link href="/" onClick={() => setMenuOpen(false)} className="hover:text-gold transition-colors">דף הבית</Link>
              <Link href="/products" onClick={() => setMenuOpen(false)} className="hover:text-gold transition-colors">קולקציה</Link>
              <Link href="/products?category=rings" onClick={() => setMenuOpen(false)} className="hover:text-gold transition-colors">טבעות</Link>
              <Link href="/products?category=necklaces" onClick={() => setMenuOpen(false)} className="hover:text-gold transition-colors">שרשראות</Link>
              <Link href="/products?category=earrings" onClick={() => setMenuOpen(false)} className="hover:text-gold transition-colors">עגילים</Link>
              <Link href="/products?category=bracelets" onClick={() => setMenuOpen(false)} className="hover:text-gold transition-colors">צמידים</Link>
              <div className="border-t border-gray-700 pt-3 mt-2 flex flex-col gap-2">
                {user ? (
                  <>
                    {user.role === 'admin' && (
                      <Link href="/admin" onClick={() => setMenuOpen(false)} className="text-gold">ניהול</Link>
                    )}
                    <Link href="/account" onClick={() => setMenuOpen(false)}>שלום, {user.name}</Link>
                    <button onClick={() => { logout(); setMenuOpen(false); }} className="text-right text-gray-400">התנתק</button>
                  </>
                ) : (
                  <>
                    <Link href="/login" onClick={() => setMenuOpen(false)} className="text-gold">התחברות</Link>
                    <Link href="/register" onClick={() => setMenuOpen(false)}>הרשמה</Link>
                  </>
                )}
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}
