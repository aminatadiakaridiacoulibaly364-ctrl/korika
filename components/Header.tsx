'use client';
import Link from 'next/link';
import { useState } from 'react';
import { useCart } from '@/lib/cart';
import { ThemePanel } from '@/lib/theme';

export default function Header({ storeName, logoUrl }: { storeName: string; logoUrl?: string }) {
  const { count } = useCart();
  const [open, setOpen] = useState(false);
  const [panel, setPanel] = useState(false);
  const nav = [
    { href: '/', label: 'Accueil' }, { href: '/catalogue', label: 'Boutique' },
    { href: '/catalogue?tri=nouveautes', label: 'Nouveautés' }, { href: '/mon-compte', label: 'Mon compte' }
  ];
  return (
    <header className="sticky top-0 z-40 border-b border-black/5 bg-carte/90 backdrop-blur">
      <div className="relative mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        <button aria-label="Menu" className="md:hidden" onClick={() => setOpen(!open)}>
          <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 6h16M4 12h16M4 18h16" /></svg>
        </button>
        <Link href="/" className="flex items-center gap-2">
          {logoUrl && <img src={logoUrl} alt="logo" className="h-8 w-8 rounded-full" />}
          <span className="font-titre text-xl tracking-wide text-encre">{storeName}</span>
        </Link>
        {/* Menu centré (maquette) */}
        <nav className="absolute left-1/2 hidden -translate-x-1/2 gap-6 text-sm md:flex">
          {nav.map(n => <Link key={n.href} href={n.href} className="hover:text-or-fonce">{n.label}</Link>)}
        </nav>
        <div className="flex items-center gap-3">
          {/* Personnaliser : thème, polices, taille du texte */}
          <div className="relative">
            <button aria-label="Personnaliser" onClick={() => setPanel(!panel)} className="rounded-full p-1 hover:bg-or/10">
              <svg width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="9" /><circle cx="9" cy="9.5" r="1" fill="currentColor" />
                <circle cx="14" cy="8.5" r="1" fill="currentColor" /><circle cx="15" cy="13" r="1" fill="currentColor" />
                <path d="M12 21a9 9 0 0 0 9-9" strokeWidth="2.5" stroke="var(--c-or)" />
              </svg>
            </button>
            {panel && <ThemePanel onClose={() => setPanel(false)} />}
          </div>
          <Link href="/panier" className="relative" aria-label="Panier">
            <svg width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2"><path d="M6 6h15l-1.5 9h-12L5 3H2" /><circle cx="9" cy="20" r="1.5" /><circle cx="18" cy="20" r="1.5" /></svg>
            {count > 0 && <span className="absolute -right-2 -top-2 rounded-full bg-or px-1.5 text-xs font-bold text-white">{count}</span>}
          </Link>
        </div>
      </div>
      {open && (
        <nav className="border-t border-black/5 px-4 pb-4 md:hidden">
          {nav.map(n => <Link key={n.href} href={n.href} onClick={() => setOpen(false)} className="block py-2 text-sm hover:text-or-fonce">{n.label}</Link>)}
        </nav>
      )}
    </header>
  );
}
