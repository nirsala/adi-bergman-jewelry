import { NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';
import { getProducts, getUserById } from '@/lib/db';

export async function GET() {
  const userPayload = await getCurrentUser();
  if (!userPayload) return NextResponse.json({ error: 'לא מחובר' }, { status: 401 });

  const user = getUserById(userPayload.id);
  if (!user || user.status !== 'approved') {
    return NextResponse.json({ error: 'אין הרשאה' }, { status: 403 });
  }

  const products = getProducts().filter(p => p.inStock);
  const discount = user.discountPercent || 0;

  const catalog = products.map(p => ({
    nameHe: p.nameHe,
    name: p.name,
    category: p.category,
    basePrice: p.basePrice,
    yourPrice: Math.round(p.basePrice * (1 - discount / 100)),
    minOrderQty: p.minOrderQty || 1,
    inStock: p.inStock,
  }));

  // Return as downloadable CSV (simple, works everywhere)
  const categoryNames: Record<string, string> = {
    rings: 'טבעות', necklaces: 'שרשראות', earrings: 'עגילים', bracelets: 'צמידים',
  };

  const BOM = '\uFEFF'; // UTF-8 BOM for Excel Hebrew
  const header = 'שם המוצר,שם באנגלית,קטגוריה,מחיר מחירון,המחיר שלך,כמות מינימלית';
  const rows = catalog.map(p =>
    `"${p.nameHe}","${p.name}","${categoryNames[p.category] || p.category}",₪${p.basePrice},₪${p.yourPrice},${p.minOrderQty}`
  );
  const csv = BOM + header + '\n' + rows.join('\n');

  return new NextResponse(csv, {
    headers: {
      'Content-Type': 'text/csv; charset=utf-8',
      'Content-Disposition': `attachment; filename="adi-bergman-catalog-${user.name}.csv"`,
    },
  });
}
