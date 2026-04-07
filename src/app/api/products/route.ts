import { NextRequest, NextResponse } from 'next/server';
import { getProducts } from '@/lib/db';
import { getCurrentUser } from '@/lib/auth';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const category = searchParams.get('category');
  const featured = searchParams.get('featured');

  let products = getProducts();

  if (category) {
    products = products.filter(p => p.category === category);
  }

  if (featured === 'true') {
    products = products.filter(p => p.featured);
  }

  // Get current user to determine price visibility
  const user = await getCurrentUser();

  const result = products.map(p => ({
    id: p.id,
    name: p.name,
    nameHe: p.nameHe,
    description: p.description,
    descriptionHe: p.descriptionHe,
    category: p.category,
    images: p.images,
    inStock: p.inStock,
    featured: p.featured,
    // Only include price for approved users or admin
    basePrice: user && (user.status === 'approved' || user.role === 'admin') ? p.basePrice : undefined,
  }));

  return NextResponse.json({ products: result });
}
