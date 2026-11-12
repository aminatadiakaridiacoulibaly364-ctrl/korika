// GET : détail admin. PUT : changement de statut admin.
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { requireAdmin } from '@/lib/auth';

export async function GET(_req: Request, { params }: { params: { id: string } }) {
  const admin = await requireAdmin();
  if (!admin) return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
  return NextResponse.json(await prisma.order.findUnique({ where: { id: params.id }, include: { items: true, client: true } }));
}
export async function PUT(req: Request, { params }: { params: { id: string } }) {
  const admin = await requireAdmin();
  if (!admin) return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
  const { status } = await req.json();
  const o = await prisma.order.update({ where: { id: params.id }, data: { status } });
  return NextResponse.json(o);
}
