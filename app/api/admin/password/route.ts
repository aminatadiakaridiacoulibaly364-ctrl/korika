// Changement de mot de passe admin (depuis /admin -> Paramètres).
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { checkPassword, hashPassword, requireAdmin } from '@/lib/auth';

export async function POST(req: Request) {
  const admin = await requireAdmin();
  if (!admin) return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
  const { current, next } = await req.json();
  const row = await prisma.admin.findUnique({ where: { id: String(admin.adminId) } });
  if (!row || !checkPassword(current, row.passwordHash)) {
    return NextResponse.json({ error: 'Mot de passe actuel incorrect.' }, { status: 401 });
  }
  if (!next || next.length < 10) return NextResponse.json({ error: 'Le nouveau mot de passe doit faire au moins 10 caractères.' }, { status: 400 });
  await prisma.admin.update({ where: { id: row.id }, data: { passwordHash: hashPassword(next) } });
  return NextResponse.json({ ok: true });
}
