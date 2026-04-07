import { NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';
import { submitCart, getUserById, getProducts, getCartByUserId, addOrder, MIN_ORDER_TOTAL } from '@/lib/db';
import { v4 as uuidv4 } from 'uuid';

export async function POST() {
  const userPayload = await getCurrentUser();
  if (!userPayload) return NextResponse.json({ error: 'לא מחובר' }, { status: 401 });

  const user = getUserById(userPayload.id);
  if (!user || user.role !== 'customer' || user.status !== 'approved') {
    return NextResponse.json({ error: 'אין הרשאה' }, { status: 403 });
  }

  const cart = getCartByUserId(user.id);
  if (!cart || cart.items.length === 0) {
    return NextResponse.json({ error: 'העגלה ריקה' }, { status: 400 });
  }

  const products = getProducts();
  const discount = user.discountPercent || 0;

  // Validate MOQ per product
  for (const item of cart.items) {
    const product = products.find(p => p.id === item.productId);
    if (!product) continue;
    const moq = product.minOrderQty || 1;
    if (item.quantity < moq) {
      return NextResponse.json({
        error: `${product.nameHe}: כמות מינימלית להזמנה ${moq} יחידות`,
      }, { status: 400 });
    }
  }

  // Build order items
  const orderItems = cart.items.map(item => {
    const product = products.find(p => p.id === item.productId);
    if (!product) return null;
    const unitPrice = Math.round(product.basePrice * (1 - discount / 100));
    return {
      productId: item.productId,
      nameHe: product.nameHe,
      quantity: item.quantity,
      unitPrice,
      lineTotal: unitPrice * item.quantity,
    };
  }).filter(Boolean) as { productId: string; nameHe: string; quantity: number; unitPrice: number; lineTotal: number }[];

  const total = orderItems.reduce((sum, i) => sum + i.lineTotal, 0);

  // Validate minimum order total
  if (total < MIN_ORDER_TOTAL) {
    return NextResponse.json({
      error: `סכום הזמנה מינימלי ₪${MIN_ORDER_TOTAL.toLocaleString()}. סכום נוכחי: ₪${total.toLocaleString()}`,
    }, { status: 400 });
  }

  // Create order
  const order = {
    id: uuidv4(),
    userId: user.id,
    items: orderItems,
    total,
    status: 'pending' as const,
    notes: '',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  addOrder(order);
  submitCart(user.id);

  return NextResponse.json({ success: true, orderId: order.id, total });
}
