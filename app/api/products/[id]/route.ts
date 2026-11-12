// PUT : modification admin. DELETE : suppression admin.
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { requireAdmin } from '@/lib/auth';

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  const admin = await requireAdmin();
  if (!admin) return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
  const b = await req.json();
  const data: any = {};
  for (const k of ['name', 'description', 'categoryId']) if (b[k] !== undefined) data[k] = b[k];
  if (b.price !== undefined) data.price = Number(b.price);
  if (b.promoPrice !== undefined) data.promoPrice = b.promoPrice ? Number(b.promoPrice) : null;
  if (b.stock !== undefined) data.stock = Number(b.stock);
  if (b.images) data.images = JSON.stringify(b.images);
  if (b.sizes) data.sizes = JSON.stringify(b.sizes);
  if (b.colors) data.colors = JSON.stringify(b.colors);
  for (const k of ['featured', 'bestseller', 'isNew', 'visible']) if (b[k] !== undefined) data[k] = !!b[k];
  const p = await prisma.product.update({ where: { id: params.id }, data });
  return NextResponse.json(p);
}
export async function DELETE(_req: Request, { params }: { params: { id: string } }) {
  const admin = await requireAdmin();
  if (!admin) return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
  await prisma.product.delete({ where: { id: params.id } });
  return NextResponse.json({ ok: true });
}
