import { NextRequest, NextResponse } from 'next/server';
import { getUserByUsername, addUser } from '@/lib/db';
import { hashPassword } from '@/lib/auth';
import { v4 as uuidv4 } from 'uuid';

export async function POST(request: NextRequest) {
  const { username, password, name, email, phone } = await request.json();

  if (!username || !password || !name) {
    return NextResponse.json({ error: 'נדרש שם משתמש, סיסמה ושם מלא' }, { status: 400 });
  }

  if (password.length < 4) {
    return NextResponse.json({ error: 'הסיסמה חייבת להכיל לפחות 4 תווים' }, { status: 400 });
  }

  const existing = getUserByUsername(username);
  if (existing) {
    return NextResponse.json({ error: 'שם המשתמש כבר תפוס' }, { status: 409 });
  }

  const newUser = {
    id: uuidv4(),
    username,
    password: hashPassword(password),
    name,
    email: email || '',
    phone: phone || '',
    role: 'customer' as const,
    status: 'pending' as const,
    discountPercent: 0,
    customerGroup: 'new' as const,
    createdAt: new Date().toISOString(),
  };

  addUser(newUser);

  return NextResponse.json({
    message: 'ההרשמה בוצעה בהצלחה! חשבונך ממתין לאישור מנהל.',
    user: { id: newUser.id, username: newUser.username, name: newUser.name, status: newUser.status },
  }, { status: 201 });
}
