'use client';
// Coquille admin : navigation + vérification de session côté client.
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

const LINKS = [
  { href: '/admin', label: 'Tableau de bord' },
  { href: '/admin/produits', label: 'Produits' },
  { href: '/admin/categories', label: 'Catégories' },
  { href: '/admin/commandes', label: 'Commandes' },
  { href: '/admin/clients', label: 'Clients' },
  { href: '/admin/parametres', label: 'Paramètres' }
];

export default function AdminShell({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const path = usePathname();
  const [ok, setOk] = useState(false);
  useEffect(() => {
    if (path === '/admin/login') return;
    fetch('/api/admin/me').then(r => { if (!r.ok) router.replace('/admin/login'); else setOk(true); });
  }, [path]);
  if (path === '/admin/login') return <>{children}</>;
  if (!ok) return <p className="py-24 text-center text-gray-400">Vérification de la session...</p>;
  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <nav className="mb-8 flex flex-wrap gap-2 border-b border-gray-200 pb-4">
        {LINKS.map(l => (
          <Link key={l.href} href={l.href}
            className={'rounded-full px-4 py-2 text-sm ' + (path === l.href ? 'bg-nuit text-or' : 'hover:bg-gray-100')}>{l.label}</Link>
        ))}
        <button onClick={async () => { await fetch('/api/auth/logout', { method: 'POST' }); router.push('/admin/login'); }}
          className="ml-auto text-sm text-red-500 hover:underline">Déconnexion</button>
      </nav>
      {children}
    </div>
  );
}
