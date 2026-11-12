'use client';
// Tableau de bord : ventes, commandes récentes, top produits, alertes de stock.
import { useEffect, useState } from 'react';

export default function Dashboard() {
  const [s, setS] = useState<any>(null);
  useEffect(() => { fetch('/api/admin/stats').then(r => r.json()).then(setS); }, []);
  if (!s || s.error) return <p className="text-gray-400">Chargement...</p>;
  const money = (n: number) => n.toLocaleString('fr-FR') + ' FCFA';
  const statut: Record<string, string> = { en_attente: 'En attente', confirmee: 'Confirmée', en_livraison: 'En livraison', livree: 'Livrée', annulee: 'Annulée' };
  return (
    <div>
      <h1 className="font-titre text-3xl">Tableau de bord</h1>
      <div className="mt-6 grid gap-4 md:grid-cols-3">
        {[
          { t: "Aujourd'hui", o: s.ordersDay, c: s.caDay },
          { t: '7 derniers jours', o: s.ordersWeek, c: s.caWeek },
          { t: '30 derniers jours', o: s.ordersMonth, c: s.caMonth }
        ].map((x, i) => (
          <div key={i} className="card p-5">
            <p className="text-sm text-gray-500">{x.t}</p>
            <p className="mt-1 font-titre text-2xl">{money(x.c)}</p>
            <p className="text-sm text-gray-500">{x.o} commandes</p>
          </div>
        ))}
      </div>
      {s.lowStock.length > 0 && (
        <div className="mt-6 rounded-2xl bg-red-50 p-4 text-sm text-red-700">
          <strong>Alerte stock faible :</strong> {s.lowStock.map((p: any) => p.name + ' (' + p.stock + ')').join(', ')}
        </div>
      )}
      <div className="mt-8 grid gap-8 md:grid-cols-2">
        <div>
          <h2 className="font-titre text-xl">Produits les plus vendus</h2>
          <ul className="mt-4 space-y-2 text-sm">
            {s.top.map((t: any, i: number) => <li key={i} className="flex justify-between rounded-lg bg-carte px-4 py-2 shadow-sm"><span>{t.name}</span><span className="font-semibold">{t.qty} vendus</span></li>)}
          </ul>
        </div>
        <div>
          <h2 className="font-titre text-xl">Commandes récentes</h2>
          <ul className="mt-4 space-y-2 text-sm">
            {s.recent.map((o: any) => (
              <li key={o.id} className="rounded-lg bg-carte px-4 py-2 shadow-sm">
                <a href={'/admin/commandes?q=' + o.reference} className="flex justify-between hover:text-or-fonce">
                  <span>{o.reference} : {o.fullName}</span>
                  <span>{money(o.total)} : {statut[o.status] || o.status}</span>
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
