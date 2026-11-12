'use client';
// Gestion des commandes : liste, filtres, statut, contact WhatsApp client.
import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';

const STATUTS = ['en_attente', 'confirmee', 'en_livraison', 'livree', 'annulee'];
const LIBELLES: Record<string, string> = { en_attente: 'En attente', confirmee: 'Confirmée', en_livraison: 'En livraison', livrée: 'Livrée', livree: 'Livrée', annulee: 'Annulée' };

export default function Commandes() {
  const sp = useSearchParams();
  const [list, setList] = useState<any[]>([]);
  const [q, setQ] = useState(sp.get('q') || '');
  const [statut, setStatut] = useState('');
  const [open, setOpen] = useState<any>(null);
  const load = () => fetch('/api/admin/orders').then(r => r.json()).then(setList);
  useEffect(() => { load(); }, []);

  const setStatus = async (id: string, s: string) => { await fetch('/api/orders/' + id, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ status: s }) }); load(); };
  const waContact = (o: any) => window.open('https://wa.me/' + (o.phone || '').replace(/\D/g, '') + '?text=' + encodeURIComponent('Bonjour ' + o.fullName + ', au sujet de votre commande ' + o.reference + ' chez KORIKA COLLECTION...'), '_blank');

  const shown = list.filter((o: any) => (!q || (o.reference + o.fullName + o.phone).toLowerCase().includes(q.toLowerCase())) && (!statut || o.status === statut));
  return (
    <div>
      <h1 className="font-titre text-3xl">Commandes</h1>
      <div className="mt-4 flex flex-wrap gap-2">
        <input value={q} onChange={e => setQ(e.target.value)} placeholder="Rechercher (n°, nom, téléphone)" className="rounded-full border border-gray-200 px-4 py-2 text-sm md:w-72" />
        <select value={statut} onChange={e => setStatut(e.target.value)} className="rounded-full border border-gray-200 px-3 py-2 text-sm">
          <option value="">Tous les statuts</option>{STATUTS.map(s => <option key={s} value={s}>{LIBELLES[s]}</option>)}
        </select>
      </div>
      <div className="mt-6 space-y-3">
        {shown.map((o: any) => (
          <div key={o.id} className="rounded-2xl bg-carte p-4 shadow-sm">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div>
                <p className="font-semibold">{o.reference} : {o.fullName}</p>
                <p className="text-sm text-gray-500">{new Date(o.createdAt).toLocaleString('fr-FR')} : {o.phone} : {o.city}, {o.district}</p>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <span className="font-semibold">{o.total.toLocaleString('fr-FR')} FCFA</span>
                <select value={o.status} onChange={e => setStatus(o.id, e.target.value)} className="rounded-full border border-gray-200 px-3 py-1 text-sm">
                  {STATUTS.map(s => <option key={s} value={s}>{LIBELLES[s]}</option>)}
                </select>
                <button onClick={() => waContact(o)} className="rounded-full bg-[#25D366] px-3 py-1 text-xs font-semibold text-white">WhatsApp client</button>
                <button onClick={() => setOpen(o)} className="text-sm text-or-fonce hover:underline">Détails</button>
              </div>
            </div>
          </div>
        ))}
        {!shown.length && <p className="text-gray-500">Aucune commande.</p>}
      </div>
      {open && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-black/50 p-4" onClick={() => setOpen(null)}>
          <div className="max-h-[80vh] w-full max-w-lg overflow-auto rounded-2xl bg-carte p-6" onClick={e => e.stopPropagation()}>
            <h2 className="font-titre text-2xl">{open.reference}</h2>
            <p className="mt-2 text-sm">{open.fullName} : {open.phone} : {open.address}, {open.district}, {open.city}</p>
            <p className="text-sm">Livraison : {open.deliveryMode} ({open.deliveryFee.toLocaleString('fr-FR')} FCFA) : Paiement : {open.paymentMethod}</p>
            {open.notes && <p className="mt-1 text-sm italic">Notes : {open.notes}</p>}
            <div className="mt-4 border-t pt-3 text-sm">
              {open.items.map((i: any) => (
                <p key={i.id} className="flex justify-between py-1"><span>{i.name} ({i.size}, {i.color}) x{i.quantity}</span><span>{(i.unitPrice * i.quantity).toLocaleString('fr-FR')} FCFA</span></p>
              ))}
              <p className="mt-2 flex justify-between border-t pt-2 font-semibold"><span>Total</span><span>{open.total.toLocaleString('fr-FR')} FCFA</span></p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
