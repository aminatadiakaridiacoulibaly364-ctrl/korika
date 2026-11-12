'use client';
// Gestion des catégories et collections.
import { useEffect, useState } from 'react';

export default function Categories() {
  const [list, setList] = useState<any[]>([]);
  const [name, setName] = useState('');
  const [image, setImage] = useState('');
  const [msg, setMsg] = useState('');
  const load = () => fetch('/api/categories').then(r => r.json()).then(setList);
  useEffect(() => { load(); }, []);

  const add = async (e: React.FormEvent) => {
    e.preventDefault(); setMsg('');
    const res = await fetch('/api/categories', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ name, image }) });
    if (!res.ok) return setMsg('Erreur (le nom existe peut-être déjà).');
    setName(''); setImage(''); load();
  };
  const del = async (id: string) => {
    const res = await fetch('/api/categories', { method: 'DELETE', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id }) });
    const d = await res.json(); setMsg(d.error || 'Catégorie supprimée.'); load();
  };
  return (
    <div>
      <h1 className="font-titre text-3xl">Catégories & collections</h1>
      <form onSubmit={add} className="mt-6 flex flex-wrap gap-3">
        <input required value={name} onChange={e => setName(e.target.value)} placeholder="Nom (ex : Robes)" className="rounded-xl border border-gray-200 px-3 py-2 text-sm" />
        <input value={image} onChange={e => setImage(e.target.value)} placeholder="URL de l'image (optionnel)" className="flex-1 rounded-xl border border-gray-200 px-3 py-2 text-sm" />
        <button className="btn-or">Ajouter</button>
      </form>
      {msg && <p className="mt-2 text-sm text-gray-600">{msg}</p>}
      <ul className="mt-6 space-y-2">
        {list.map((c: any) => (
          <li key={c.id} className="flex items-center justify-between rounded-xl bg-carte px-4 py-3 shadow-sm">
            <span>{c.name} <span className="text-sm text-gray-400">({c._count.products} produits)</span></span>
            <button onClick={() => del(c.id)} className="text-sm text-red-500 hover:underline">Supprimer</button>
          </li>
        ))}
      </ul>
    </div>
  );
}
