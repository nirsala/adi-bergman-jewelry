import { NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';
import { getProducts, getUsers, getCarts } from '@/lib/db';

export async function GET() {
  const user = await getCurrentUser();
  if (!user || user.role !== 'admin') {
    return NextResponse.json({ error: 'אין הרשאה' }, { status: 403 });
  }

  const products = getProducts();
  const users = getUsers();
  const carts = getCarts();

  const customers = users.filter(u => u.role === 'customer');
  const activeCarts = carts.filter(c => c.status === 'active' && c.items.length > 0);
  const submittedCarts = carts.filter(c => c.status === 'submitted');

  // Build activity feed
  type Activity = { type: string; description: string; timestamp: string };
  const activities: Activity[] = [];

  customers.forEach(c => {
    activities.push({
      type: 'customer_registered',
      description: `לקוח חדש נרשם: ${c.name}`,
      timestamp: c.createdAt,
    });
  });

  products.forEach(p => {
    activities.push({
      type: 'product_added',
      description: `מוצר נוסף: ${p.nameHe}`,
      timestamp: p.createdAt,
    });
  });

  carts.forEach(cart => {
    const cartUser = users.find(u => u.id === cart.userId);
    if (cart.status === 'submitted') {
      activities.push({
        type: 'cart_submitted',
        description: `הזמנה נשלחה: ${cartUser?.name || 'לקוח'}`,
        timestamp: cart.updatedAt,
      });
    } else if (cart.items.length > 0) {
      activities.push({
        type: 'cart_updated',
        description: `עגלה עודכנה: ${cartUser?.name || 'לקוח'}`,
        timestamp: cart.updatedAt,
      });
    }
  });

  activities.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

  return NextResponse.json({
    totalProducts: products.length,
    inStockProducts: products.filter(p => p.inStock).length,
    totalCustomers: customers.length,
    pendingApprovals: customers.filter(c => c.status === 'pending').length,
    activeCarts: activeCarts.length,
    submittedCarts: submittedCarts.length,
    recentActivity: activities.slice(0, 10),
  });
}
