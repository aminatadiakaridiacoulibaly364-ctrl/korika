// Inscription client (optionnelle : la commande en invité reste possible).
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { checkPassword, createSession, CLIENT_COOKIE, hashPassword } from '@/lib/auth';

export async function POST(req: Request) {
  const { email, phone, password, mode } = await req.json();
  const key = String(email || '').toLowerCase();
  let client = await prisma.client.findUnique({ where: { email: key } });
  if (mode === 'login') {
    if (!client || !checkPassword(password, client.passwordHash)) {
      return NextResponse.json({ error: 'Email ou mot de passe incorrect.' }, { status: 401 });
    }
  } else {
    if (client) return NextResponse.json({ error: 'Un compte existe déjà avec cet email.' }, { status: 400 });
    if (!password || password.length < 8) return NextResponse.json({ error: 'Mot de passe : 8 caractères minimum.' }, { status: 400 });
    client = await prisma.client.create({ data: { email: key, phone: phone || '', passwordHash: hashPassword(password) } });
  }
  await createSession({ clientId: client.id }, CLIENT_COOKIE);
  return NextResponse.json({ ok: true, email: client.email });
}
