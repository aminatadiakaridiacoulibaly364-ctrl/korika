// Réglages publics pour le checkout (zones de livraison, devise). Pas de données sensibles.
// force-dynamic : la lecture en base se fait à chaque requête, jamais pendant le build
// (sinon Vercel échoue faute de DATABASE_URL au moment de la compilation).
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export const dynamic = 'force-dynamic';
export async function GET() {
  const s = await prisma.settings.findUnique({ where: { id: 'main' } });
  return NextResponse.json({
    storeName: s?.storeName, currency: s?.currency,
    deliveryZones: s?.deliveryZones || '[]', whatsappNumber: s?.whatsappNumber
  });
}
