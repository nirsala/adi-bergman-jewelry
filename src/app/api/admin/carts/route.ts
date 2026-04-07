import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';
import { getCarts, getUsers, getProducts } from '@/lib/db';

export async function GET(request: NextRequest) {
  const user = await getCurrentUser();
  if (!user || user.role !== 'admin') {
    return NextResponse.json({ error: 'אין הרשאה' }, { status: 403 });
  }

  const { searchParams } = new URL(request.url);
  const statusFilter = searchParams.get('status');

  let carts = getCarts();
  if (statusFilter) {
    carts = carts.filter(c => c.status === statusFilter);
  }

  const users = getUsers();
  const products = getProducts();

  const enriched = carts.map(cart => {
    const cartUser = users.find(u => u.id === cart.userId);
    if (!cartUser) return null;

    const discount = cartUser.discountPercent || 0;
    const items = cart.items.map(item => {
      const product = products.find(p => p.id === item.productId);
      if (!product) return null;
      const unitPrice = product.basePrice * (1 - discount / 100);
      return {
        productId: item.productId,
        nameHe: product.nameHe,
        image: product.images.find(img => !img.includes('placeholder')) || '',
        basePrice: product.basePrice,
        unitPrice: Math.round(unitPrice),
        quantity: item.quantity,
        lineTotal: Math.round(unitPrice * item.quantity),
      };
    }).filter(Boolean);

    return {
      cartId: cart.id,
      status: cart.status,
      updatedAt: cart.updatedAt,
      customer: {
        id: cartUser.id,
        name: cartUser.name,
        email: cartUser.email,
        phone: cartUser.phone,
        discountPercent: cartUser.discountPercent,
      },
      items,
      itemCount: items.reduce((sum, i) => sum + (i?.quantity || 0), 0),
      total: items.reduce((sum, i) => sum + (i?.lineTotal || 0), 0),
    };
  }).filter(Boolean);

  return NextResponse.json({ carts: enriched });
}
