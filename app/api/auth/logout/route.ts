import { NextResponse } from 'next/server';
import { destroySession, ADMIN_COOKIE, CLIENT_COOKIE } from '@/lib/auth';
export async function POST() {
  await destroySession(ADMIN_COOKIE);
  await destroySession(CLIENT_COOKIE);
  return NextResponse.json({ ok: true });
}
