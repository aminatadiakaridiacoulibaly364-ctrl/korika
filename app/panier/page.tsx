'use client';
// Panier : modifier quantités, supprimer, total en temps réel.
import Link from 'next/link';
import { useCart } from '@/lib/cart';

export default function Panier() {
  const { items, update, remove, total } = useCart();
  if (!items.length) return (
    <div className="py-24 text-center">
      <p className="font-titre text-2xl">Votre panier est vide</p>
      <Link href="/catalogue" className="btn-or mt-6 inline-block">Découvrir la boutique</Link>
    </div>
  );
  return (
    <div className="mx-auto max-w-3xl px-4 py-8">
      <h1 className="font-titre text-3xl">Panier</h1>
      <div className="mt-6 space-y-4">
        {items.map((it, i) => (
          <div key={i} className="card flex items-center gap-4 p-3">
            <img src={it.image} alt={it.name} className="h-20 w-16 rounded-lg object-cover" />
            <div className="flex-1">
              <p className="font-medium">{it.name}</p>
              <p className="text-sm text-gray-500">{it.size} · {it.color}</p>
              <div className="mt-2 flex items-center gap-3">
                <div className="flex items-center justify-between rounded-full border border-gray-200 px-2 py-1">
                  <button onClick={() => update(i, it.quantity - 1)} className="px-2">−</button>
                  <span className="w-6 text-center">{it.quantity}</span>
                  <button onClick={() => update(i, it.quantity + 1)} className="px-2">+</button>
                </div>
                <button onClick={() => remove(i)} className="text-sm text-red-500 hover:underline">Supprimer</button>
              </div>
            </div>
            <p className="font-semibold">{(it.unitPrice * it.quantity).toLocaleString('fr-FR')} FCFA</p>
          </div>
        ))}
      </div>
      <div className="mt-8 flex items-center justify-between rounded-2xl bg-carte p-5 shadow-sm">
        <p className="text-lg">Total : <span className="font-titre text-2xl">{total.toLocaleString('fr-FR')} FCFA</span></p>
        <Link href="/commande" className="btn-or">Commander</Link>
      </div>
    </div>
  );
}
