import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { requireAdmin } from '@/lib/auth';

export async function GET() {
  return NextResponse.json(await prisma.category.findMany({ include: { _count: { select: { products: true } } } }));
}
export async function POST(req: Request) {
  const admin = await requireAdmin();
  if (!admin) return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
  const b = await req.json();
  const c = await prisma.category.create({ data: { name: b.name, slug: b.slug || b.name.toLowerCase().replace(/[^a-z0-9]+/g, '-'), image: b.image } });
  return NextResponse.json(c);
}
export async function DELETE(req: Request) {
  const admin = await requireAdmin();
  if (!admin) return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
  const { id } = await req.json();
  const count = await prisma.product.count({ where: { categoryId: id } });
  if (count) return NextResponse.json({ error: `Supprimez d'abord les ${count} produits de cette catégorie.` }, { status: 400 });
  await prisma.category.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
