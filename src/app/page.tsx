import HeroVideo from '@/components/HeroVideo';
import FeaturedProducts from '@/components/FeaturedProducts';
import Link from 'next/link';

const categories = [
  { name: 'טבעות', slug: 'rings', emoji: '💍' },
  { name: 'שרשראות', slug: 'necklaces', emoji: '📿' },
  { name: 'עגילים', slug: 'earrings', emoji: '✨' },
  { name: 'צמידים', slug: 'bracelets', emoji: '⌚' },
  { name: 'New', slug: '', emoji: '🌟' },
  { name: 'Best', slug: '', emoji: '❤️' },
];

export default function HomePage() {
  return (
    <>
      <HeroVideo />

      {/* Category Circles — She-Ra style */}
      <section className="py-10 bg-white border-b border-border">
        <div className="max-w-[900px] mx-auto px-5">
          <div className="flex justify-center gap-6 md:gap-10 overflow-x-auto">
            {categories.map((cat) => (
              <Link
                key={cat.name}
                href={cat.slug ? `/products?category=${cat.slug}` : '/products'}
                className="flex flex-col items-center gap-2 group flex-shrink-0"
              >
                <div className="w-[70px] h-[70px] md:w-[85px] md:h-[85px] rounded-full bg-[#f5f0ec] border-2 border-transparent group-hover:border-accent flex items-center justify-center transition-all duration-300">
                  <span className="text-2xl md:text-3xl opacity-50 group-hover:opacity-80 transition-opacity">{cat.emoji}</span>
                </div>
                <span className="text-[12px] text-text-muted group-hover:text-accent transition-colors tracking-wide">
                  {cat.name}
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <FeaturedProducts />

      {/* Full-width Image Banner */}
      <section className="relative h-[50vh] min-h-[350px] overflow-hidden">
        <img
          src="/images/model-store.jpg"
          alt="Adi Bergman Studio"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/30" />
        <div className="relative h-full flex items-center justify-center z-10">
          <div className="text-center px-5">
            <h2 className="font-heading text-[32px] md:text-[48px] text-white mb-4">מויסנייט — הברק האמיתי</h2>
            <p className="text-white/80 text-[15px] max-w-md mx-auto mb-8">
              אבן חן בעלת מדד שבירה גבוה מיהלום, המעניקה זוהר וניצוצות ברמה שאין שני לה
            </p>
            <Link href="/products" className="btn-primary">
              גלו את הקולקציה
            </Link>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="py-16 md:py-24 bg-white">
        <div className="max-w-[1000px] mx-auto px-5 md:px-10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-14 items-center">
            <div>
              <h2 className="font-heading text-[28px] md:text-[36px] text-text mb-5">
                אודות עדי ברגמן
              </h2>
              <div className="w-8 h-[1px] bg-accent mb-6" />
              <p className="text-text-light text-[15px] leading-[1.8] mb-4">
                עדי ברגמן מתמחה בעיצוב תכשיטי מויסנייט יוקרתיים, המשלבים מלאכת יד מדויקת עם חומרים איכותיים.
              </p>
              <p className="text-text-light text-[15px] leading-[1.8] mb-8">
                כל תכשיט מעוצב בקפידה כדי להעניק ברק ויופי שמתחרים ביהלומים הטובים ביותר.
              </p>
              <div className="flex gap-8">
                <div className="text-center">
                  <div className="font-heading text-[24px] text-accent">100%</div>
                  <div className="text-[12px] text-text-muted tracking-wide mt-1">אתי ובר-קיימא</div>
                </div>
                <div className="text-center">
                  <div className="font-heading text-[24px] text-accent">14K+</div>
                  <div className="text-[12px] text-text-muted tracking-wide mt-1">זהב אמיתי</div>
                </div>
                <div className="text-center">
                  <div className="font-heading text-[24px] text-accent">GRA</div>
                  <div className="text-[12px] text-text-muted tracking-wide mt-1">תעודת מקוריות</div>
                </div>
              </div>
            </div>
            <div className="relative aspect-[4/5] rounded-sm overflow-hidden">
              <img
                src="/images/model-necklace.jpg"
                alt="תכשיטי מויסנייט — עדי ברגמן"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Wholesale CTA */}
      <section className="py-16 md:py-20 bg-[#f5f0ec]">
        <div className="max-w-[600px] mx-auto px-5 text-center">
          <h2 className="font-heading text-[28px] md:text-[36px] text-text mb-4">
            מחירי סיטונאות
          </h2>
          <div className="w-8 h-[1px] bg-accent mx-auto mb-5" />
          <p className="text-text-light text-[15px] mb-8 leading-[1.8]">
            הירשמו כלקוח עסקי וקבלו גישה למחירים מיוחדים בהתאמה אישית
          </p>
          <div className="flex gap-4 justify-center">
            <Link href="/register" className="btn-primary">
              הרשמה כלקוח
            </Link>
            <Link href="/products" className="btn-outline">
              לקולקציה
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
