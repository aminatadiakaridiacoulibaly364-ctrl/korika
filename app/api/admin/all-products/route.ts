import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { requireAdmin } from '@/lib/auth';
export async function GET() {
  const admin = await requireAdmin();
  if (!admin) return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
  return NextResponse.json(await prisma.product.findMany({ include: { category: true }, orderBy: { createdAt: 'desc' } }));
}
