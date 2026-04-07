import { NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';
import { getUserById } from '@/lib/db';

export async function GET() {
  const payload = await getCurrentUser();
  if (!payload) {
    return NextResponse.json({ error: 'לא מחובר' }, { status: 401 });
  }

  // Get fresh user data from DB (status/discount might have changed)
  const user = getUserById(payload.id);
  if (!user) {
    return NextResponse.json({ error: 'משתמש לא נמצא' }, { status: 404 });
  }

  return NextResponse.json({
    user: {
      id: user.id,
      username: user.username,
      name: user.name,
      role: user.role,
      status: user.status,
      discountPercent: user.discountPercent,
    },
  });
}
