'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';

export default function Header() {
  const { user, logout } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <>
      {/* Announcement Bar */}
      <div className="bg-accent-light text-center py-2.5 text-sm tracking-wide text-text">
        Adi Bergman — תכשיטי מויסנייט בעיצוב אישי
      </div>

      {/* Main Header */}
      <header className="bg-white sticky top-0 z-50" style={{ boxShadow: '0 0 1px rgba(0,0,0,0.2)' }}>
        <div className="max-w-[1400px] mx-auto px-5 md:px-10">
          <div className="flex items-center justify-between h-[70px]">
            {/* Right: Navigation */}
            <nav className="hidden md:flex items-center gap-7">
              <Link href="/products" className="text-[13px] tracking-[0.05em] uppercase text-text hover:text-accent transition-colors">Shop</Link>
              <Link href="/products?category=rings" className="text-[13px] tracking-[0.05em] uppercase text-text hover:text-accent transition-colors">טבעות</Link>
              <Link href="/products?category=necklaces" className="text-[13px] tracking-[0.05em] uppercase text-text hover:text-accent transition-colors">שרשראות</Link>
              <Link href="/products?category=earrings" className="text-[13px] tracking-[0.05em] uppercase text-text hover:text-accent transition-colors">עגילים</Link>
              <Link href="/products?category=bracelets" className="text-[13px] tracking-[0.05em] uppercase text-text hover:text-accent transition-colors">צמידים</Link>
            </nav>

            {/* Center: Logo */}
            <Link href="/" className="absolute left-1/2 -translate-x-1/2">
              <Image
                src="/images/logo-black.png"
                alt="Adi Bergman Moissanite Jewelry"
                width={170}
                height={70}
                className="h-[45px] md:h-[55px] w-auto object-contain"
                priority
              />
            </Link>

            {/* Left: Icons */}
            <div className="hidden md:flex items-center gap-5">
              {user ? (
                <>
                  {user.role === 'admin' && (
                    <Link href="/admin" className="text-[13px] tracking-[0.05em] uppercase text-accent hover:text-accent/70 transition-colors">
                      ניהול
                    </Link>
                  )}
                  <Link href="/account" title={user.name}>
                    <svg className="w-5 h-5 text-text" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </Link>
                  <button onClick={logout} className="text-[12px] text-text-muted hover:text-accent transition-colors">
                    התנתק
                  </button>
                </>
              ) : (
                <>
                  <Link href="/login" title="התחברות">
                    <svg className="w-5 h-5 text-text" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </Link>
                </>
              )}
            </div>

            {/* Mobile Menu Button */}
            <button onClick={() => setMenuOpen(!menuOpen)} className="md:hidden text-text p-2">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {menuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>

          {/* Mobile Menu */}
          {menuOpen && (
            <div className="md:hidden pb-6 border-t border-border animate-fade-in">
              <nav className="flex flex-col gap-4 pt-5 text-center">
                <Link href="/products" onClick={() => setMenuOpen(false)} className="text-[13px] tracking-[0.05em] uppercase hover:text-accent">Shop</Link>
                <Link href="/products?category=rings" onClick={() => setMenuOpen(false)} className="text-[13px] tracking-[0.05em] uppercase hover:text-accent">טבעות</Link>
                <Link href="/products?category=necklaces" onClick={() => setMenuOpen(false)} className="text-[13px] tracking-[0.05em] uppercase hover:text-accent">שרשראות</Link>
                <Link href="/products?category=earrings" onClick={() => setMenuOpen(false)} className="text-[13px] tracking-[0.05em] uppercase hover:text-accent">עגילים</Link>
                <Link href="/products?category=bracelets" onClick={() => setMenuOpen(false)} className="text-[13px] tracking-[0.05em] uppercase hover:text-accent">צמידים</Link>
                <div className="border-t border-border pt-4 mt-2 flex flex-col gap-3">
                  {user ? (
                    <>
                      {user.role === 'admin' && <Link href="/admin" onClick={() => setMenuOpen(false)} className="text-accent text-sm">ניהול</Link>}
                      <Link href="/account" onClick={() => setMenuOpen(false)} className="text-sm">{user.name}</Link>
                      <button onClick={() => { logout(); setMenuOpen(false); }} className="text-text-muted text-sm">התנתק</button>
                    </>
                  ) : (
                    <>
                      <Link href="/login" onClick={() => setMenuOpen(false)} className="text-sm">התחברות</Link>
                      <Link href="/register" onClick={() => setMenuOpen(false)} className="text-sm text-accent">הרשמה</Link>
                    </>
                  )}
                </div>
              </nav>
            </div>
          )}
        </div>
      </header>
    </>
  );
}
