// Réglages boutique : lecture + écriture admin uniquement.
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { requireAdmin } from '@/lib/auth';

export async function GET() {
  const admin = await requireAdmin();
  if (!admin) return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
  return NextResponse.json(await prisma.settings.findUnique({ where: { id: 'main' } }));
}
export async function PUT(req: Request) {
  const admin = await requireAdmin();
  if (!admin) return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
  const b = await req.json();
  const data: any = {};
  for (const k of ['storeName', 'logoUrl', 'whatsappNumber', 'currency', 'contactEmail', 'pickupAddress']) if (b[k] !== undefined) data[k] = b[k];
  if (b.heroBanners) data.heroBanners = JSON.stringify(b.heroBanners);
  if (b.deliveryZones) data.deliveryZones = JSON.stringify(b.deliveryZones);
  if (b.theme) data.theme = JSON.stringify(b.theme);
  const s = await prisma.settings.upsert({ where: { id: 'main' }, create: { id: 'main', ...data }, update: data });
  return NextResponse.json(s);
}
