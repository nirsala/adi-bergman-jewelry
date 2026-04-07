import type { Metadata } from "next";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { AuthProvider } from "@/contexts/AuthContext";
import JsonLd from "@/components/JsonLd";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://adibergman.com';

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: 'עדי ברגמן | תכשיטי מויסנייט מעוצבים בעבודת יד',
    template: '%s | עדי ברגמן תכשיטים',
  },
  description: 'תכשיטי מויסנייט יוקרתיים בעיצוב ישראלי מקורי. טבעות אירוסין, שרשראות, עגילים וצמידים בזהב 14K עם תעודת GRA. משלוח חינם לכל הארץ.',
  keywords: [
    'תכשיטי מויסנייט',
    'טבעת מויסנייט',
    'טבעת אירוסין מויסנייט',
    'שרשרת מויסנייט',
    'עגילי מויסנייט',
    'צמיד מויסנייט',
    'תכשיטי זהב 14K',
    'מויסנייט ישראל',
    'עדי ברגמן תכשיטים',
    'Adi Bergman Jewelry',
    'moissanite jewelry israel',
    'תכשיטים בעבודת יד',
    'תכשיטי יוקרה',
    'אלטרנטיבה ליהלום',
    'תכשיטים אתיים',
    'מויסנייט GRA',
  ],
  authors: [{ name: 'Adi Bergman', url: SITE_URL }],
  creator: 'Adi Bergman',
  publisher: 'Adi Bergman Moissanite Jewelry',
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    type: 'website',
    locale: 'he_IL',
    url: SITE_URL,
    siteName: 'Adi Bergman Moissanite Jewelry',
    title: 'עדי ברגמן | תכשיטי מויסנייט מעוצבים בעבודת יד',
    description: 'תכשיטי מויסנייט יוקרתיים בעיצוב ישראלי מקורי. טבעות, שרשראות, עגילים וצמידים בזהב 14K.',
    images: [
      {
        url: '/images/hero-model.jpg',
        width: 1200,
        height: 630,
        alt: 'עדי ברגמן - תכשיטי מויסנייט מעוצבים',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'עדי ברגמן | תכשיטי מויסנייט מעוצבים',
    description: 'תכשיטי מויסנייט יוקרתיים בעיצוב ישראלי מקורי',
    images: ['/images/hero-model.jpg'],
  },
  alternates: {
    canonical: SITE_URL,
    languages: {
      'he-IL': SITE_URL,
    },
  },
  verification: {
    // google: 'your-google-verification-code',
  },
  other: {
    'format-detection': 'telephone=no',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="he" dir="rtl">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,500;0,600;0,700;1,400&family=Heebo:wght@300;400;500;600&display=swap" rel="stylesheet" />
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <meta name="theme-color" content="#e6907f" />
      </head>
      <body className="min-h-screen flex flex-col bg-white text-text font-body">
        <JsonLd />
        <AuthProvider>
          <Header />
          <main className="flex-1">{children}</main>
          <Footer />
        </AuthProvider>
      </body>
    </html>
  );
}
