// POST : enregistre la commande côté serveur, décrémente le stock et renvoie le lien WhatsApp pré-rempli.
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getSession, CLIENT_COOKIE } from '@/lib/auth';
import { buildWhatsAppLink, formatOrderMessage } from '@/lib/whatsapp';

export async function POST(req: Request) {
  const b = await req.json();
  if (!b.items?.length) return NextResponse.json({ error: 'Panier vide' }, { status: 400 });

  const settings = await prisma.settings.findUnique({ where: { id: 'main' } });
  const client = await getSession(CLIENT_COOKIE);
  let clientId: string | null = null;
  if (client?.clientId) {
    const c = await prisma.client.findUnique({ where: { id: String(client.clientId) } });
    clientId = c?.id || null;
  }

  // Prix sécurisés : repris depuis la base, jamais depuis le navigateur.
  let subtotal = 0;
  const itemRows = [];
  for (const it of b.items) {
    const p = await prisma.product.findUnique({ where: { id: it.productId } });
    if (!p || !p.visible) return NextResponse.json({ error: 'Produit indisponible' }, { status: 400 });
    const unit = p.promoPrice && p.promoPrice < p.price ? p.promoPrice : p.price;
    subtotal += unit * it.quantity;
    itemRows.push({ productId: p.id, name: p.name, size: it.size, color: it.color, quantity: it.quantity, unitPrice: unit });
  }
  const fee = Number(b.deliveryFee || 0);
  const total = subtotal + fee;
  const reference = 'KOR-' + Date.now().toString(36).toUpperCase().slice(-6) + Math.floor(Math.random() * 90 + 10);

  const order = await prisma.order.create({ data: {
    reference, status: 'en_attente',
    fullName: b.fullName, phone: b.phone, city: b.city, district: b.district, address: b.address,
    deliveryMode: b.deliveryMode, deliveryFee: fee, paymentMethod: b.paymentMethod, notes: b.notes || null,
    total, clientId, items: { create: itemRows }
  }});
  // Décrémente le stock des produits vendus.
  for (const it of itemRows) await prisma.product.update({ where: { id: it.productId }, data: { stock: { decrement: it.quantity } } });

  // Relecture avec les articles pour le message WhatsApp.
  const full = await prisma.order.findUnique({ where: { id: order.id }, include: { items: true } });
  const whatsappUrl = buildWhatsAppLink(settings?.whatsappNumber || process.env.WHATSAPP_NUMBER || '', formatOrderMessage(full, settings || {}, b.email));
  return NextResponse.json({ orderId: order.id, reference, whatsappUrl });
}
