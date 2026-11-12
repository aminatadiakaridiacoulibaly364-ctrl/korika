import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getSession, CLIENT_COOKIE, ADMIN_COOKIE } from '@/lib/auth';

export async function GET() {
  const c = await getSession(CLIENT_COOKIE);
  if (c?.clientId) {
    const client = await prisma.client.findUnique({ where: { id: String(c.clientId) }, include: { orders: { include: { items: true }, orderBy: { createdAt: 'desc' } } } });
    if (client) return NextResponse.json({ client: { email: client.email, phone: client.phone, addresses: JSON.parse(client.addresses), orders: client.orders } });
  }
  return NextResponse.json({ client: null });
}
