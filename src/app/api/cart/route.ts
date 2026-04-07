import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';
import { getCartByUserId, upsertCart, clearCart, getProducts, getUserById } from '@/lib/db';

export async function GET() {
  const userPayload = await getCurrentUser();
  if (!userPayload) return NextResponse.json({ error: 'לא מחובר' }, { status: 401 });

  const user = getUserById(userPayload.id);
  if (!user || user.role !== 'customer' || user.status !== 'approved') {
    return NextResponse.json({ error: 'אין הרשאה' }, { status: 403 });
  }

  const cart = getCartByUserId(user.id);
  if (!cart || cart.items.length === 0) {
    return NextResponse.json({ cart: { items: [], total: 0, itemCount: 0 } });
  }

  const products = getProducts();
  const discount = user.discountPercent || 0;

  const enrichedItems = cart.items.map(item => {
    const product = products.find(p => p.id === item.productId);
    if (!product) return null;
    const unitPrice = product.basePrice * (1 - discount / 100);
    return {
      productId: item.productId,
      name: product.name,
      nameHe: product.nameHe,
      image: product.images.find(img => !img.includes('placeholder')) || product.images[0] || '',
      category: product.category,
      basePrice: product.basePrice,
      unitPrice: Math.round(unitPrice),
      quantity: item.quantity,
      lineTotal: Math.round(unitPrice * item.quantity),
    };
  }).filter(Boolean);

  const total = enrichedItems.reduce((sum, item) => sum + (item?.lineTotal || 0), 0);

  return NextResponse.json({
    cart: {
      id: cart.id,
      items: enrichedItems,
      total,
      itemCount: enrichedItems.reduce((sum, item) => sum + (item?.quantity || 0), 0),
      status: cart.status,
      updatedAt: cart.updatedAt,
    },
  });
}

export async function POST(request: NextRequest) {
  const userPayload = await getCurrentUser();
  if (!userPayload) return NextResponse.json({ error: 'לא מחובר' }, { status: 401 });

  const user = getUserById(userPayload.id);
  if (!user || user.role !== 'customer' || user.status !== 'approved') {
    return NextResponse.json({ error: 'אין הרשאה' }, { status: 403 });
  }

  const { items } = await request.json();
  if (!Array.isArray(items)) {
    return NextResponse.json({ error: 'פורמט לא תקין' }, { status: 400 });
  }

  // Validate items
  const products = getProducts();
  for (const item of items) {
    if (!item.productId || !item.quantity || item.quantity < 1) {
      return NextResponse.json({ error: 'פריט לא תקין' }, { status: 400 });
    }
    if (!products.find(p => p.id === item.productId)) {
      return NextResponse.json({ error: `מוצר ${item.productId} לא נמצא` }, { status: 404 });
    }
  }

  const cart = upsertCart(user.id, items);
  return NextResponse.json({ success: true, cartId: cart.id });
}

export async function DELETE() {
  const userPayload = await getCurrentUser();
  if (!userPayload) return NextResponse.json({ error: 'לא מחובר' }, { status: 401 });

  clearCart(userPayload.id);
  return NextResponse.json({ success: true });
}
