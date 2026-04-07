import { NextRequest, NextResponse } from 'next/server';
import { getProducts, addProduct, updateProduct } from '@/lib/db';
import { getCurrentUser } from '@/lib/auth';
import { v4 as uuidv4 } from 'uuid';

export async function GET() {
  const user = await getCurrentUser();
  if (!user || user.role !== 'admin') {
    return NextResponse.json({ error: 'אין הרשאה' }, { status: 403 });
  }

  return NextResponse.json({ products: getProducts() });
}

export async function POST(request: NextRequest) {
  const user = await getCurrentUser();
  if (!user || user.role !== 'admin') {
    return NextResponse.json({ error: 'אין הרשאה' }, { status: 403 });
  }

  const body = await request.json();

  if (body.id) {
    // Update existing
    const updated = updateProduct(body.id, body);
    if (!updated) {
      return NextResponse.json({ error: 'מוצר לא נמצא' }, { status: 404 });
    }
    return NextResponse.json({ product: updated });
  }

  // Create new
  const newProduct = {
    id: uuidv4(),
    name: body.name || '',
    nameHe: body.nameHe || '',
    description: body.description || '',
    descriptionHe: body.descriptionHe || '',
    category: body.category || 'rings',
    basePrice: Number(body.basePrice) || 0,
    images: body.images || [],
    inStock: body.inStock !== false,
    featured: body.featured === true,
    minOrderQty: Number(body.minOrderQty) || 1,
    createdAt: new Date().toISOString(),
  };

  addProduct(newProduct);
  return NextResponse.json({ product: newProduct }, { status: 201 });
}
