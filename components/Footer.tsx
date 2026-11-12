import Link from 'next/link';
export default function Footer({ storeName, whatsapp }: { storeName: string; whatsapp?: string }) {
  return (
    <footer className="mt-16 bg-nuit text-creme">
      <div className="mx-auto grid max-w-6xl gap-8 px-4 py-10 md:grid-cols-3">
        <div>
          <p className="font-titre text-2xl text-or">{storeName}</p>
          <p className="mt-2 text-sm text-creme/70">Mode élégante et inspirée, livrée chez vous.</p>
        </div>
        <div className="text-sm">
          <p className="mb-2 font-semibold">Navigation</p>
          <Link href="/catalogue" className="block py-1 hover:text-or">Boutique</Link>
          <Link href="/mon-compte" className="block py-1 hover:text-or">Mon compte</Link>
          <Link href="/panier" className="block py-1 hover:text-or">Panier</Link>
        </div>
        <div className="text-sm">
          <p className="mb-2 font-semibold">Contact</p>
          {whatsapp && <p>WhatsApp : +{whatsapp}</p>}
          <div className="mt-3 flex gap-4 text-creme/70">
            <a href="https://instagram.com" target="_blank" rel="noreferrer" aria-label="Instagram">Instagram</a>
            <a href="https://facebook.com" target="_blank" rel="noreferrer" aria-label="Facebook">Facebook</a>
            <a href="https://tiktok.com" target="_blank" rel="noreferrer" aria-label="TikTok">TikTok</a>
          </div>
        </div>
      </div>
      <p className="border-t border-white/10 py-4 text-center text-xs text-creme/50">© {new Date().getFullYear()} {storeName}</p>
    </footer>
  );
}
