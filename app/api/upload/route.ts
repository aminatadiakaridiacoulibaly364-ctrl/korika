// Upload de photos depuis l'admin : enregistre les fichiers en base et renvoie leurs URLs.
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { requireAdmin } from '@/lib/auth';

const MAX_OCTETS = 6 * 1024 * 1024; // 6 Mo par image

export async function POST(req: Request) {
  const admin = await requireAdmin();
  if (!admin) return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });

  const form = await req.formData();
  const files = form.getAll('files') as File[];
  if (!files.length) return NextResponse.json({ error: 'Aucun fichier reçu.' }, { status: 400 });

  const urls: string[] = [];
  for (const file of files) {
    if (!file.type.startsWith('image/')) continue;
    if (file.size > MAX_OCTETS) return NextResponse.json({ error: `"${file.name}" dépasse 6 Mo.` }, { status: 400 });
    const buffer = Buffer.from(await file.arrayBuffer());
    const media = await prisma.media.create({ data: { mime: file.type, data: buffer.toString('base64') } });
    urls.push(`/api/media/${media.id}`);
  }
  if (!urls.length) return NextResponse.json({ error: 'Aucune image valide trouvée.' }, { status: 400 });
  return NextResponse.json({ urls });
}
