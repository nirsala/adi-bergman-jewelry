import HeroVideo from '@/components/HeroVideo';
import FeaturedProducts from '@/components/FeaturedProducts';
import Link from 'next/link';

export default function HomePage() {
  return (
    <>
      <HeroVideo />

      {/* Featured Products */}
      <FeaturedProducts />

      {/* About Section */}
      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="font-heading text-4xl font-bold text-charcoal mb-6">
                אודות <span className="text-gold">עדי ברגמן</span>
              </h2>
              <div className="w-16 h-0.5 bg-gold mb-6" />
              <p className="text-gray-600 leading-relaxed mb-4 text-lg">
                עדי ברגמן מתמחה בעיצוב תכשיטי מויסנייט יוקרתיים, המשלבים מלאכת יד מדויקת עם חומרים איכותיים.
              </p>
              <p className="text-gray-600 leading-relaxed mb-6">
                כל תכשיט מעוצב בקפידה כדי להעניק ברק ויופי שמתחרים ביהלומים הטובים ביותר.
                מויסנייט הוא אבן חן מדהימה בעלת מדד שבירה גבוה מיהלום, המעניקה זוהר וניצוצות ברמה שאין שני לה.
              </p>
              <div className="grid grid-cols-3 gap-4 mt-8">
                <div className="text-center p-4 bg-cream rounded-lg">
                  <div className="text-2xl font-heading font-bold text-gold">100%</div>
                  <div className="text-sm text-gray-500 mt-1">אתי ובר-קיימא</div>
                </div>
                <div className="text-center p-4 bg-cream rounded-lg">
                  <div className="text-2xl font-heading font-bold text-gold">14K+</div>
                  <div className="text-sm text-gray-500 mt-1">זהב אמיתי</div>
                </div>
                <div className="text-center p-4 bg-cream rounded-lg">
                  <div className="text-2xl font-heading font-bold text-gold">GRA</div>
                  <div className="text-sm text-gray-500 mt-1">תעודת מקוריות</div>
                </div>
              </div>
            </div>
            <div className="relative">
              <div className="aspect-square bg-gradient-to-br from-gold/10 via-rose-light/30 to-gold/10 rounded-2xl flex items-center justify-center">
                <div className="text-center">
                  <div className="text-8xl mb-4">💎</div>
                  <p className="text-gray-400 text-sm">תמונת הסטודיו של עדי</p>
                </div>
              </div>
              <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-gold/10 rounded-full" />
              <div className="absolute -top-4 -left-4 w-16 h-16 bg-rose-light/30 rounded-full" />
            </div>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-20 bg-cream">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="font-heading text-4xl font-bold text-charcoal mb-4">הקולקציות שלנו</h2>
            <div className="w-16 h-0.5 bg-gold mx-auto" />
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { name: 'טבעות', slug: 'rings', emoji: '💍' },
              { name: 'שרשראות', slug: 'necklaces', emoji: '📿' },
              { name: 'עגילים', slug: 'earrings', emoji: '✨' },
              { name: 'צמידים', slug: 'bracelets', emoji: '⌚' },
            ].map((cat) => (
              <Link
                key={cat.slug}
                href={`/products?category=${cat.slug}`}
                className="group relative bg-white rounded-xl p-8 text-center shadow-sm hover:shadow-lg transition-all duration-300 border border-gray-100"
              >
                <div className="text-5xl mb-4 group-hover:scale-110 transition-transform duration-300">{cat.emoji}</div>
                <h3 className="font-heading text-xl font-semibold text-charcoal group-hover:text-gold-dark transition-colors">
                  {cat.name}
                </h3>
                <div className="w-8 h-0.5 bg-gold mx-auto mt-3 opacity-0 group-hover:opacity-100 transition-opacity" />
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-charcoal text-white">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="font-heading text-4xl font-bold mb-4">
            מעוניינים ב<span className="text-gold">מחירי סיטונאות</span>?
          </h2>
          <p className="text-gray-300 mb-8 text-lg">
            הירשמו כלקוח עסקי וקבלו גישה למחירים מיוחדים בהתאמה אישית
          </p>
          <div className="flex gap-4 justify-center">
            <Link
              href="/register"
              className="px-8 py-3 bg-gold text-charcoal font-semibold rounded-sm hover:bg-gold-light transition-all text-lg"
            >
              הרשמה כלקוח
            </Link>
            <Link
              href="/products"
              className="px-8 py-3 border-2 border-gold text-gold font-semibold rounded-sm hover:bg-gold/10 transition-all text-lg"
            >
              צפייה בקולקציה
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
