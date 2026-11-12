'use client';
// Checkout : formulaire client, choix livraison, création de la commande puis ouverture WhatsApp.
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useCart } from '@/lib/cart';

export default function Commande() {
  const { items, total, clear } = useCart();
  const router = useRouter();
  const [zones, setZones] = useState<{ zone: string; fee: number }[]>([]);
  const [paymentMethods, setPaymentMethods] = useState<string[]>([]);
  const [form, setForm] = useState({
    fullName: '', phone: '', city: '', district: '', address: '',
    deliveryMode: '', paymentMethod: 'Paiement à la livraison', notes: ''
  });
  const [email, setEmail] = useState('');
  const [sending, setSending] = useState(false);

  useEffect(() => {
    fetch('/api/settings/public').then(r => r.json()).then(s => {
      setZones(JSON.parse(s.deliveryZones || '[]'));
      setPaymentMethods(s.paymentMethods || ['Paiement à la livraison', 'Mobile Money', 'Virement']);
    });
  }, []);
  useEffect(() => { if (form.city && !form.deliveryMode) setForm(f => ({ ...f, deliveryMode: zones[0]?.zone || '' })); }, [zones, form.city]);

  const fee = zones.find(z => z.zone === form.deliveryMode)?.fee || 0;

  if (!items.length) return <p className="py-24 text-center text-gray-500">Votre panier est vide.</p>;

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSending(true);
    const res = await fetch('/api/orders', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...form, email, items, deliveryFee: fee, total: total + fee })
    });
    const data = await res.json();
    setSending(false);
    if (!res.ok) return alert(data.error || 'Erreur lors de la commande.');
    clear();
    // Le site enregistre la commande PUIS ouvre WhatsApp avec le message pré-rempli.
    window.location.href = data.whatsappUrl;
    setTimeout(() => router.push(`/confirmation/${data.orderId}`), 800);
  };

  const field = "w-full rounded-xl border border-gray-200 px-4 py-3";
  return (
    <div className="mx-auto max-w-2xl px-4 py-8">
      <h1 className="font-titre text-3xl">Finaliser la commande</h1>
      <form onSubmit={submit} className="mt-6 space-y-4">
        <input required value={form.fullName} onChange={e => setForm({ ...form, fullName: e.target.value })} placeholder="Nom complet" className={field} />
        <input required type="tel" value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} placeholder="Numéro de téléphone" className={field} />
        <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="Email (facultatif, pour suivre vos commandes)" className={field} />
        <div className="grid grid-cols-2 gap-4">
          <input required value={form.city} onChange={e => setForm({ ...form, city: e.target.value })} placeholder="Ville" className={field} />
          <input required value={form.district} onChange={e => setForm({ ...form, district: e.target.value })} placeholder="Quartier" className={field} />
        </div>
        <input required value={form.address} onChange={e => setForm({ ...form, address: e.target.value })} placeholder="Adresse de livraison (rue, repère...)" className={field} />
        <select required value={form.deliveryMode} onChange={e => setForm({ ...form, deliveryMode: e.target.value })} className={field}>
          <option value="">Mode de livraison</option>
          {zones.map(z => <option key={z.zone} value={z.zone}>{z.zone} ({z.fee.toLocaleString('fr-FR')} FCFA)</option>)}
        </select>
        <select value={form.paymentMethod} onChange={e => setForm({ ...form, paymentMethod: e.target.value })} className={field}>
          {paymentMethods.map(m => <option key={m}>{m}</option>)}
        </select>
        <textarea value={form.notes} onChange={e => setForm({ ...form, notes: e.target.value })} placeholder="Notes (facultatif)" className={field} rows={2} />
        <div className="rounded-2xl bg-carte p-4 shadow-sm text-sm">
          <p className="flex justify-between"><span>Sous-total</span><span>{total.toLocaleString('fr-FR')} FCFA</span></p>
          <p className="flex justify-between"><span>Livraison</span><span>{fee.toLocaleString('fr-FR')} FCFA</span></p>
          <p className="mt-2 flex justify-between border-t pt-2 text-base font-semibold"><span>Total</span><span>{(total + fee).toLocaleString('fr-FR')} FCFA</span></p>
        </div>
        <button disabled={sending} className="btn-or w-full disabled:opacity-50">
          {sending ? 'Envoi...' : 'Valider et envoyer sur WhatsApp'}
        </button>
      </form>
    </div>
  );
}
