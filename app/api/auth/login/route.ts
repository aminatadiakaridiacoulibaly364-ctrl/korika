// Connexion admin avec limite de tentatives (5 échecs = 10 minutes de blocage).
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { checkPassword, createSession, ADMIN_COOKIE } from '@/lib/auth';

const tries = new Map<string, { count: number; until: number }>();

export async function POST(req: Request) {
  const { email, password } = await req.json();
  const key = String(email || '').toLowerCase();
  const t = tries.get(key);
  if (t && t.until > Date.now()) {
    return NextResponse.json({ error: `Trop de tentatives. Réessayez dans ${Math.ceil((t.until - Date.now()) / 60000)} min.` }, { status: 429 });
  }
  const admin = await prisma.admin.findUnique({ where: { email: key } });
  if (!admin || !checkPassword(password, admin.passwordHash)) {
    const c = (t?.count || 0) + 1;
    tries.set(key, { count: c, until: c >= 5 ? Date.now() + 10 * 60000 : 0 });
    return NextResponse.json({ error: 'Email ou mot de passe incorrect.' }, { status: 401 });
  }
  tries.delete(key);
  await createSession({ adminId: admin.id }, ADMIN_COOKIE);
  return NextResponse.json({ ok: true });
}
