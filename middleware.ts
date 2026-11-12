// Protège /admin : sans session admin valide, redirection vers la page de connexion.
import { NextRequest, NextResponse } from 'next/server';
import { jwtVerify } from 'jose';

const secret = new TextEncoder().encode(process.env.JWT_SECRET || 'dev-secret-change-me');

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  if (pathname === '/admin/login') return NextResponse.next();
  const token = req.cookies.get('korika_admin')?.value;
  try {
    if (token) await jwtVerify(token, secret);
    else throw new Error('no token');
    return NextResponse.next();
  } catch {
    const url = req.nextUrl.clone();
    url.pathname = '/admin/login';
    return NextResponse.redirect(url);
  }
}
export const config = { matcher: ['/admin/:path*'] };
