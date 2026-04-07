import { NextRequest, NextResponse } from 'next/server';
import { getUserByUsername } from '@/lib/db';
import { comparePassword, signToken } from '@/lib/auth';
import { ensureAdminUser } from '@/lib/seed';

export async function POST(request: NextRequest) {
  ensureAdminUser();

  const { username, password } = await request.json();

  if (!username || !password) {
    return NextResponse.json({ error: 'נדרש שם משתמש וסיסמה' }, { status: 400 });
  }

  const user = getUserByUsername(username);
  if (!user) {
    return NextResponse.json({ error: 'שם משתמש או סיסמה שגויים' }, { status: 401 });
  }

  if (!comparePassword(password, user.password)) {
    return NextResponse.json({ error: 'שם משתמש או סיסמה שגויים' }, { status: 401 });
  }

  const token = signToken({
    id: user.id,
    username: user.username,
    role: user.role,
    status: user.status,
    discountPercent: user.discountPercent,
  });

  const response = NextResponse.json({
    user: {
      id: user.id,
      username: user.username,
      name: user.name,
      role: user.role,
      status: user.status,
      discountPercent: user.discountPercent,
    },
  });

  response.cookies.set('token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 7, // 7 days
    path: '/',
  });

  return response;
}

export async function DELETE() {
  const response = NextResponse.json({ success: true });
  response.cookies.set('token', '', { maxAge: 0, path: '/' });
  return response;
}
