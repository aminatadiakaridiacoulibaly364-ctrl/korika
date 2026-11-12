import { NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/auth';
export async function GET() {
  const admin = await requireAdmin();
  if (!admin) return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
  return NextResponse.json({ ok: true, email: admin.email });
}
