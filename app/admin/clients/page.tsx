'use client';
// Liste des clients avec historique de commandes.
import { useEffect, useState } from 'react';

export default function Clients() {
  const [list, setList] = useState<any[]>([]);
  useEffect(() => { fetch('/api/clients').then(r => r.json()).then(setList); }, []);
  return (
    <div>
      <h1 className="font-titre text-3xl">Clients</h1>
      <div className="mt-6 space-y-3">
        {list.map((c: any) => (
          <details key={c.id} className="rounded-2xl bg-carte p-4 shadow-sm">
            <summary className="cursor-pointer font-medium">{c.email} : {c.ordersCount} commande(s) : {c.totalSpent.toLocaleString('fr-FR')} FCFA</summary>
            <ul className="mt-3 space-y-1 text-sm text-gray-600">
              {c.orders.map((o: any) => <li key={o.reference}>{o.reference} : {new Date(o.createdAt).toLocaleDateString('fr-FR')} : {o.total.toLocaleString('fr-FR')} FCFA : {o.status}</li>)}
              {!c.orders.length && <li>Aucune commande enregistrée.</li>}
            </ul>
          </details>
        ))}
        {!list.length && <p className="text-gray-500">Aucun client inscrit (les commandes en invité n'apparaissent pas ici).</p>}
      </div>
    </div>
  );
}
