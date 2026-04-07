'use client';

import Link from 'next/link';
import Image from 'next/image';

export default function HeroVideo() {
  return (
    <section className="relative h-[85vh] min-h-[500px] max-h-[800px] overflow-hidden bg-white">
      {/* Background Model Image */}
      <Image
        src="/images/hero-model.jpg"
        alt="Adi Bergman Moissanite Jewelry"
        fill
        className="object-cover object-top"
        priority
      />

      {/* Subtle dark overlay for contrast with gold logo */}
      <div className="absolute inset-0 bg-gradient-to-l from-black/40 via-black/15 to-transparent" />

      {/* Content */}
      <div className="relative h-full flex items-center" style={{ zIndex: 2 }}>
        <div className="max-w-[1400px] mx-auto px-5 md:px-10 w-full">
          <div className="max-w-md">
            <Image
              src="/images/logo-gold.png"
              alt="Adi Bergman"
              width={350}
              height={130}
              className="w-[220px] md:w-[300px] h-auto mb-6 drop-shadow-lg"
            />
            <p className="text-[15px] md:text-[17px] text-white/90 mb-8 leading-[1.7] drop-shadow-sm">
              יוקרה שאפשר להרגיש — ברק של יהלום, עיצוב ישראלי מקורי
            </p>
            <div className="flex gap-4">
              <Link href="/products" className="btn-primary">
                לקולקציה
              </Link>
              <Link href="/login" className="inline-block px-10 py-3 bg-transparent text-white font-body text-[14px] font-medium tracking-[0.05em] uppercase border border-white/70 hover:bg-white/10 transition-all">
                כניסת לקוחות
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
