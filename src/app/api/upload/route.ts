import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';
import { getProductById, updateProduct } from '@/lib/db';
import fs from 'fs';
import path from 'path';

const UPLOAD_DIR = path.join(process.cwd(), 'public', 'images', 'products');

export async function POST(request: NextRequest) {
  const user = await getCurrentUser();
  if (!user || user.role !== 'admin') {
    return NextResponse.json({ error: 'אין הרשאה' }, { status: 403 });
  }

  const formData = await request.formData();
  const productId = formData.get('productId') as string;
  if (!productId) {
    return NextResponse.json({ error: 'חסר מזהה מוצר' }, { status: 400 });
  }

  const product = getProductById(productId);
  if (!product) {
    return NextResponse.json({ error: 'מוצר לא נמצא' }, { status: 404 });
  }

  fs.mkdirSync(UPLOAD_DIR, { recursive: true });

  const files = formData.getAll('files') as File[];
  if (files.length === 0) {
    return NextResponse.json({ error: 'לא נבחרו קבצים' }, { status: 400 });
  }

  const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
  const maxSize = 5 * 1024 * 1024; // 5MB

  const newPaths: string[] = [];

  for (let i = 0; i < files.length; i++) {
    const file = files[i];
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json({ error: `סוג קובץ לא נתמך: ${file.type}` }, { status: 400 });
    }
    if (file.size > maxSize) {
      return NextResponse.json({ error: 'קובץ גדול מדי (מקסימום 5MB)' }, { status: 400 });
    }

    const ext = file.type.split('/')[1] === 'jpeg' ? 'jpg' : file.type.split('/')[1];
    const filename = `${productId}-${Date.now()}-${i}.${ext}`;
    const filePath = path.join(UPLOAD_DIR, filename);

    const bytes = await file.arrayBuffer();
    fs.writeFileSync(filePath, Buffer.from(bytes));

    newPaths.push(`/images/products/${filename}`);
  }

  const updatedImages = [...(product.images || []).filter(img => !img.includes('placeholder')), ...newPaths];
  updateProduct(productId, { images: updatedImages });

  return NextResponse.json({ images: updatedImages });
}
