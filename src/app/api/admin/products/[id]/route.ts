import { NextRequest, NextResponse } from 'next/server';
import { deleteProduct } from '@/lib/db';
import { getCurrentUser } from '@/lib/auth';

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const user = await getCurrentUser();
  if (!user || user.role !== 'admin') {
    return NextResponse.json({ error: 'אין הרשאה' }, { status: 403 });
  }

  const { id } = await params;
  const deleted = deleteProduct(id);
  if (!deleted) {
    return NextResponse.json({ error: 'מוצר לא נמצא' }, { status: 404 });
  }

  return NextResponse.json({ success: true });
}
