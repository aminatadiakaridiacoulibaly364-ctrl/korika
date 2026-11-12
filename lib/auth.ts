// Authentification admin + clients : mots de passe hashés (bcrypt), sessions JWT en cookie httpOnly.
import { SignJWT, jwtVerify } from 'jose';
import { cookies } from 'next/headers';
import bcrypt from 'bcryptjs';
import { prisma } from './db';

const secret = new TextEncoder().encode(process.env.JWT_SECRET || 'dev-secret-change-me');
export const ADMIN_COOKIE = 'korika_admin';
export const CLIENT_COOKIE = 'korika_client';

export async function createSession(payload: Record<string, unknown>, cookieName: string, days = 7) {
  const token = await new SignJWT(payload).setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt().setExpirationTime(`${days}d`).sign(secret);
  (await cookies()).set(cookieName, token, {
    httpOnly: true, sameSite: 'lax', secure: process.env.NODE_ENV === 'production',
    maxAge: days * 24 * 3600, path: '/'
  });
}
export async function getSession(cookieName: string) {
  try {
    const token = (await cookies()).get(cookieName)?.value;
    if (!token) return null;
    const { payload } = await jwtVerify(token, secret);
    return payload;
  } catch { return null; }
}
export async function destroySession(cookieName: string) {
  (await cookies()).delete(cookieName);
}
export async function requireAdmin() {
  const s = await getSession(ADMIN_COOKIE);
  if (!s?.adminId) return null;
  return s;
}
export function hashPassword(p: string) { return bcrypt.hashSync(p, 10); }
export function checkPassword(p: string, hash: string) { return bcrypt.compareSync(p, hash); }
