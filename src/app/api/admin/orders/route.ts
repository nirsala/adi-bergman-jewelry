import { NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';
import { getOrders, getUsers } from '@/lib/db';

export async function GET() {
  const user = await getCurrentUser();
  if (!user || user.role !== 'admin') {
    return NextResponse.json({ error: 'אין הרשאה' }, { status: 403 });
  }

  const orders = getOrders().sort((a, b) =>
    new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
  const users = getUsers();

  const enriched = orders.map(order => {
    const customer = users.find(u => u.id === order.userId);
    return {
      ...order,
      customerName: customer?.name || 'לא ידוע',
      customerEmail: customer?.email || '',
      customerPhone: customer?.phone || '',
      customerGroup: customer?.customerGroup || 'new',
    };
  });

  return NextResponse.json({ orders: enriched });
}
