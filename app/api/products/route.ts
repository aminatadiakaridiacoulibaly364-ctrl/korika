// GET : catalogue public (produits visibles). POST : ajout admin.
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { requireAdmin } from '@/lib/auth';

export async function GET() {
  const products = await prisma.product.findMany({ where: { visible: true }, include: { category: true }, orderBy: { createdAt: 'desc' } });
  return NextResponse.json(products);
}
export async function POST(req: Request) {
  const admin = await requireAdmin();
  if (!admin) return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
  const b = await req.json();
  const slug = b.slug || b.name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
  const p = await prisma.product.create({ data: {
    name: b.name, slug, description: b.description || '', price: Number(b.price), promoPrice: b.promoPrice ? Number(b.promoPrice) : null,
    images: JSON.stringify(b.images || []), sizes: JSON.stringify(b.sizes || []), colors: JSON.stringify(b.colors || []),
    stock: Number(b.stock || 0), featured: !!b.featured, bestseller: !!b.bestseller, isNew: b.isNew !== false,
    visible: b.visible !== false, categoryId: b.categoryId
  }});
  return NextResponse.json(p);
}
