// Tableau de bord : ventes du jour / semaine / mois, top produits, alertes stock.
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { requireAdmin } from '@/lib/auth';

export async function GET() {
  const admin = await requireAdmin();
  if (!admin) return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
  const now = new Date();
  const startDay = new Date(now); startDay.setHours(0, 0, 0, 0);
  const startWeek = new Date(startDay); startWeek.setDate(startDay.getDate() - 7);
  const startMonth = new Date(startDay); startMonth.setDate(startDay.getDate() - 30);

  const [recent, ordersDay, ordersWeek, ordersMonth, allItems, lowStock] = await Promise.all([
    prisma.order.findMany({ orderBy: { createdAt: 'desc' }, take: 8, include: { items: true } }),
    prisma.order.aggregate({ where: { createdAt: { gte: startDay }, status: { not: 'annulee' } }, _sum: { total: true }, _count: true }),
    prisma.order.aggregate({ where: { createdAt: { gte: startWeek }, status: { not: 'annulee' } }, _sum: { total: true }, _count: true }),
    prisma.order.aggregate({ where: { createdAt: { gte: startMonth }, status: { not: 'annulee' } }, _sum: { total: true }, _count: true }),
    prisma.orderItem.findMany({ where: { order: { status: { not: 'annulee' } } } }),
    prisma.product.findMany({ where: { stock: { lte: 5 } }, select: { name: true, stock: true } })
  ]);

  const top = Object.entries(allItems.reduce((acc: Record<string, number>, i) => {
    acc[i.name] = (acc[i.name] || 0) + i.quantity; return acc;
  }, {})).sort((a: any, b: any) => b[1] - a[1]).slice(0, 5).map(([name, qty]) => ({ name, qty }));

  return NextResponse.json({
    ordersDay: ordersDay._count, caDay: ordersDay._sum.total || 0,
    ordersWeek: ordersWeek._count, caWeek: ordersWeek._sum.total || 0,
    ordersMonth: ordersMonth._count, caMonth: ordersMonth._sum.total || 0,
    top, recent, lowStock
  });
}
