// Liste des clients (admin), avec historique de commandes.
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { requireAdmin } from '@/lib/auth';
export async function GET() {
  const admin = await requireAdmin();
  if (!admin) return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
  const clients = await prisma.client.findMany({ include: { orders: { orderBy: { createdAt: 'desc' } } }, orderBy: { createdAt: 'desc' } });
  return NextResponse.json(clients.map(c => ({
    id: c.id, email: c.email, phone: c.phone, createdAt: c.createdAt,
    ordersCount: c.orders.length, totalSpent: c.orders.reduce((s, o) => s + o.total, 0),
    orders: c.orders.map(o => ({ reference: o.reference, total: o.total, status: o.status, createdAt: o.createdAt }))
  })));
}
