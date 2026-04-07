import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';
import { updateOrder } from '@/lib/db';

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const user = await getCurrentUser();
  if (!user || user.role !== 'admin') {
    return NextResponse.json({ error: 'אין הרשאה' }, { status: 403 });
  }

  const { id } = await params;
  const { status, notes } = await request.json();

  const updates: Record<string, unknown> = {};
  if (status) updates.status = status;
  if (notes !== undefined) updates.notes = notes;

  const updated = updateOrder(id, updates);
  if (!updated) return NextResponse.json({ error: 'הזמנה לא נמצאה' }, { status: 404 });

  return NextResponse.json({ order: updated });
}
