// Layout racine : thème par défaut (admin), panier partagé, en-tête et pied de page globaux.
import type { Metadata } from 'next';
import './globals.css';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import WhatsAppButton from '@/components/WhatsAppButton';
import { CartProvider } from '@/lib/cart';
import { ThemeProvider } from '@/lib/theme';
import { prisma } from '@/lib/db';

export const dynamic = 'force-dynamic'; // le thème par défaut est lu en base à chaque requête

export const metadata: Metadata = {
  title: 'KORIKA COLLECTION | Boutique de mode en ligne',
  description: 'Mode élégante et inspirée : robes, ensembles, accessoires. Commandez en ligne, livraison rapide.',
  openGraph: { title: 'KORIKA COLLECTION', description: 'Mode élégante et inspirée, livrée chez vous.' }
};

// Thème par défaut de la boutique (maquette) : l'admin peut le changer dans Paramètres,
// et chaque visiteur peut ensuite personnaliser à sa guise (panneau palette).
const defauts: Record<string, string> = {
  creme: '#FBEDE8', carte: '#FFFAF8', encre: '#2A1A22', nuit: '#2A1A22',
  or: '#D56B7F', orClair: '#E08798', orFonce: '#B84E63',
  fontTitre: 'Playfair Display', fontCorps: 'Inter'
};

// Polices proposées aux visiteurs : chargées une fois pour toutes pour un changement instantané.
const TOUTES_POLICES = ['Playfair Display', 'Cormorant Garamond', 'Lora', 'Poppins', 'Montserrat', 'DM Sans', 'Inter'];
const fontsUrl = `https://fonts.googleapis.com/css2?${TOUTES_POLICES.map(f => `family=${f.replace(/ /g, '+')}:wght@300;400;500;600;700`).join('&')}&display=swap`;

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const settings = await prisma.settings.findUnique({ where: { id: 'main' } }).catch(() => null);
  const storeName = settings?.storeName || 'KORIKA COLLECTION';
  let theme: Record<string, string> = {};
  try { theme = JSON.parse(settings?.theme || '{}'); } catch {}
  const merged = { ...defauts, ...theme };
  const vars: Record<string, string> = {};
  for (const [k, v] of Object.entries(merged)) if (v) {
    vars[k === 'fontTitre' || k === 'fontCorps' ? `--font-${k === 'fontTitre' ? 'titre' : 'corps'}` : `--c-${k}`] =
      k === 'fontTitre' || k === 'fontCorps' ? `'${v}'` : v;
  }
  return (
    <html lang="fr" style={vars as React.CSSProperties}>
      <head><link rel="stylesheet" href={fontsUrl} /></head>
      <body>
        <ThemeProvider defaut={theme}>
          <CartProvider>
            <Header storeName={storeName} logoUrl={settings?.logoUrl || undefined} />
            <main className="min-h-[70vh]">{children}</main>
            <Footer storeName={storeName} whatsapp={settings?.whatsappNumber} contactEmail={settings?.contactEmail} pickupAddress={settings?.pickupAddress} />
            <WhatsAppButton number={settings?.whatsappNumber || ''} />
          </CartProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
