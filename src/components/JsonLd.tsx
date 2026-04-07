export default function JsonLd() {
  const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://adibergman.com';

  const organizationSchema = {
    '@context': 'https://schema.org',
    '@type': 'JewelryStore',
    name: 'Adi Bergman Moissanite Jewelry',
    alternateName: 'עדי ברגמן תכשיטי מויסנייט',
    url: SITE_URL,
    logo: `${SITE_URL}/images/logo-black.png`,
    image: `${SITE_URL}/images/hero-model.jpg`,
    description: 'תכשיטי מויסנייט יוקרתיים בעיצוב ישראלי מקורי. טבעות אירוסין, שרשראות, עגילים וצמידים בזהב 14K עם תעודת GRA.',
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'תל אביב',
      addressCountry: 'IL',
    },
    contactPoint: {
      '@type': 'ContactPoint',
      telephone: '+972-50-0000000',
      contactType: 'customer service',
      availableLanguage: ['Hebrew', 'English'],
    },
    sameAs: [],
    priceRange: '₪₪₪',
    openingHours: 'Su-Th 09:00-18:00',
    founder: {
      '@type': 'Person',
      name: 'Adi Bergman',
      alternateName: 'עדי ברגמן',
      jobTitle: 'מעצבת תכשיטים',
    },
    knowsAbout: [
      'Moissanite Jewelry',
      'תכשיטי מויסנייט',
      'Gold Jewelry',
      'תכשיטי זהב',
      'Engagement Rings',
      'טבעות אירוסין',
    ],
  };

  const websiteSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'Adi Bergman Moissanite Jewelry',
    alternateName: 'עדי ברגמן תכשיטים',
    url: SITE_URL,
    inLanguage: 'he-IL',
    potentialAction: {
      '@type': 'SearchAction',
      target: `${SITE_URL}/products?q={search_term_string}`,
      'query-input': 'required name=search_term_string',
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
      />
    </>
  );
}
