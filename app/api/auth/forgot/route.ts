// Mot de passe oublié : un jeton est généré (affiché ici car pas d'email configuré) ; collez-le pour réinitialiser.
import { NextResponse } from 'next/server';
import crypto from 'crypto';
import { prisma } from '@/lib/db';

export async function POST(req: Request) {
  const { email } = await req.json();
  const admin = await prisma.admin.findUnique({ where: { email: String(email).toLowerCase() } });
  // Réponse identique que le compte existe ou non (pas de fuite d'information).
  if (!admin) return NextResponse.json({ ok: true });
  const token = crypto.randomBytes(24).toString('hex');
  await prisma.admin.update({ where: { id: admin.id }, data: { resetToken: token, resetExpires: new Date(Date.now() + 3600_000) } });
  // En production, branchez ici l'envoi de l'email (Resend, Postmark...) et n'exposez jamais le jeton.
  return NextResponse.json({ ok: true, token });
}
