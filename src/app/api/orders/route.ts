import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';
import { getOrdersByUserId, getUserById, getCartByUserId, upsertCart } from '@/lib/db';

export async function GET() {
  const userPayload = await getCurrentUser();
  if (!userPayload) return NextResponse.json({ error: 'לא מחובר' }, { status: 401 });

  const orders = getOrdersByUserId(userPayload.id);
  return NextResponse.json({ orders });
}

// Reorder — copy order items back into cart
export async function POST(request: NextRequest) {
  const userPayload = await getCurrentUser();
  if (!userPayload) return NextResponse.json({ error: 'לא מחובר' }, { status: 401 });

  const user = getUserById(userPayload.id);
  if (!user || user.status !== 'approved') {
    return NextResponse.json({ error: 'אין הרשאה' }, { status: 403 });
  }

  const { orderId } = await request.json();
  const orders = getOrdersByUserId(user.id);
  const order = orders.find(o => o.id === orderId);
  if (!order) return NextResponse.json({ error: 'הזמנה לא נמצאה' }, { status: 404 });

  // Merge with existing cart
  const existingCart = getCartByUserId(user.id);
  const existingItems = existingCart?.items || [];

  const mergedItems = [...existingItems];
  for (const item of order.items) {
    const existing = mergedItems.find(i => i.productId === item.productId);
    if (existing) {
      existing.quantity += item.quantity;
    } else {
      mergedItems.push({ productId: item.productId, quantity: item.quantity });
    }
  }

  upsertCart(user.id, mergedItems);
  return NextResponse.json({ success: true });
}
