import { NextResponse } from 'next/server';
import { getUsers } from '@/lib/db';
import { getCurrentUser } from '@/lib/auth';

export async function GET() {
  const user = await getCurrentUser();
  if (!user || user.role !== 'admin') {
    return NextResponse.json({ error: 'אין הרשאה' }, { status: 403 });
  }

  const users = getUsers().map(u => ({
    id: u.id,
    username: u.username,
    name: u.name,
    email: u.email,
    phone: u.phone,
    role: u.role,
    status: u.status,
    discountPercent: u.discountPercent,
    createdAt: u.createdAt,
  }));

  return NextResponse.json({ users });
}
