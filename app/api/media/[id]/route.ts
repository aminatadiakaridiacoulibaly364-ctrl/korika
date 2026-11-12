// Sert une photo stockée en base (public : les images du catalogue sont visibles par tous).
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function GET(_req: Request, { params }: { params: { id: string } }) {
  const media = await prisma.media.findUnique({ where: { id: params.id } });
  if (!media) return NextResponse.json({ error: 'Image introuvable' }, { status: 404 });
  const bytes = Buffer.from(media.data, 'base64');
  return new NextResponse(new Uint8Array(bytes), {
    headers: { 'Content-Type': media.mime, 'Cache-Control': 'public, max-age=31536000, immutable' }
  });
}
