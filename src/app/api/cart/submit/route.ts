import { NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';
import { submitCart, getUserById } from '@/lib/db';

export async function POST() {
  const userPayload = await getCurrentUser();
  if (!userPayload) return NextResponse.json({ error: 'לא מחובר' }, { status: 401 });

  const user = getUserById(userPayload.id);
  if (!user || user.role !== 'customer' || user.status !== 'approved') {
    return NextResponse.json({ error: 'אין הרשאה' }, { status: 403 });
  }

  const cart = submitCart(user.id);
  if (!cart) {
    return NextResponse.json({ error: 'אין עגלה פעילה' }, { status: 404 });
  }

  return NextResponse.json({ success: true, cart });
}
