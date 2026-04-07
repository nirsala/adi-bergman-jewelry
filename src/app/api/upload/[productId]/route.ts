import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';
import { getProductById, updateProduct } from '@/lib/db';
import fs from 'fs';
import path from 'path';

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ productId: string }> }
) {
  const user = await getCurrentUser();
  if (!user || user.role !== 'admin') {
    return NextResponse.json({ error: 'אין הרשאה' }, { status: 403 });
  }

  const { productId } = await params;
  const { imagePath } = await request.json();

  const product = getProductById(productId);
  if (!product) {
    return NextResponse.json({ error: 'מוצר לא נמצא' }, { status: 404 });
  }

  // Delete file from disk
  try {
    const fullPath = path.join(process.cwd(), 'public', imagePath);
    if (fs.existsSync(fullPath)) {
      fs.unlinkSync(fullPath);
    }
  } catch { /* file may not exist */ }

  // Remove from product images array
  const updatedImages = product.images.filter(img => img !== imagePath);
  updateProduct(productId, { images: updatedImages });

  return NextResponse.json({ images: updatedImages });
}
