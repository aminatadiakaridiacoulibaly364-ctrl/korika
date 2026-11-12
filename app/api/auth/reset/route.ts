import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { hashPassword } from '@/lib/auth';

export async function POST(req: Request) {
  const { token, password } = await req.json();
  const admin = await prisma.admin.findFirst({ where: { resetToken: token, resetExpires: { gt: new Date() } } });
  if (!admin) return NextResponse.json({ error: 'Jeton invalide ou expiré.' }, { status: 400 });
  await prisma.admin.update({ where: { id: admin.id }, data: { passwordHash: hashPassword(password), resetToken: null, resetExpires: null } });
  return NextResponse.json({ ok: true });
}
