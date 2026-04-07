import { NextRequest, NextResponse } from 'next/server';
import { updateUser } from '@/lib/db';
import { getCurrentUser } from '@/lib/auth';

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const user = await getCurrentUser();
  if (!user || user.role !== 'admin') {
    return NextResponse.json({ error: 'אין הרשאה' }, { status: 403 });
  }

  const { id } = await params;
  const updates = await request.json();

  const allowedUpdates: Record<string, unknown> = {};
  if (updates.status !== undefined) allowedUpdates.status = updates.status;
  if (updates.discountPercent !== undefined) allowedUpdates.discountPercent = Number(updates.discountPercent);
  if (updates.customerGroup !== undefined) allowedUpdates.customerGroup = updates.customerGroup;

  const updated = updateUser(id, allowedUpdates);
  if (!updated) {
    return NextResponse.json({ error: 'משתמש לא נמצא' }, { status: 404 });
  }

  return NextResponse.json({
    user: {
      id: updated.id,
      username: updated.username,
      name: updated.name,
      email: updated.email,
      phone: updated.phone,
      role: updated.role,
      status: updated.status,
      discountPercent: updated.discountPercent,
      customerGroup: updated.customerGroup || 'new',
    },
  });
}
