import { NextRequest, NextResponse } from 'next/server';
import { getProductById } from '@/lib/db';
import { getCurrentUser } from '@/lib/auth';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const product = getProductById(id);

  if (!product) {
    return NextResponse.json({ error: 'מוצר לא נמצא' }, { status: 404 });
  }

  const user = await getCurrentUser();

  return NextResponse.json({
    product: {
      ...product,
      basePrice: user && (user.status === 'approved' || user.role === 'admin') ? product.basePrice : undefined,
    },
  });
}
