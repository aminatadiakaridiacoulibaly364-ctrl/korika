'use client';
// Gestion des produits : ajout, modification, suppression, visibilité, stock.
// Photos : bouton « Ajouter des photos » qui ouvre la galerie de l'appareil, upload + miniatures.
import { useEffect, useRef, useState } from 'react';

const empty = { id: '', name: '', description: '', price: '', promoPrice: '', stock: 0, categoryId: '', images: [] as string[], sizes: 'S,M,L,XL', colors: 'Noir,Doré,Crème', featured: false, bestseller: false, visible: true };

export default function Produits() {
  const [list, setList] = useState<any[]>([]);
  const [cats, setCats] = useState<any[]>([]);
  const [form, setForm] = useState<any>(empty);
  const [editing, setEditing] = useState(false);
  const [msg, setMsg] = useState('');
  const [uploading, setUploading] = useState(false);
  const fileInput = useRef<HTMLInputElement>(null);
  const f = 'w-full rounded-xl border border-gray-200 px-3 py-2 text-sm';

  const load = () => {
    fetch('/api/admin/all-products').then(r => r.json()).then(setList);
    fetch('/api/categories').then(r => r.json()).then(setCats);
  };
  useEffect(load, []);

  // Ouvre la galerie de l'appareil (téléphone ou ordinateur) et envoie les images choisies.
  const pickPhotos = () => fileInput.current?.click();
  const onFiles = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files?.length) return;
    setUploading(true); setMsg('');
    const fd = new FormData();
    Array.from(files).forEach(file => fd.append('files', file));
    const res = await fetch('/api/upload', { method: 'POST', body: fd });
    const data = await res.json();
    setUploading(false);
    e.target.value = ''; // permet de re-choisir la même photo ensuite
    if (!res.ok) return setMsg(data.error || 'Erreur pendant l\'envoi des photos.');
    setForm((prev: any) => ({ ...prev, images: [...prev.images, ...data.urls] }));
  };
  const removeImage = (i: number) => setForm((prev: any) => ({ ...prev, images: prev.images.filter((_: string, x: number) => x !== i) }));

  const save = async (e: React.FormEvent) => {
    e.preventDefault(); setMsg('');
    const body = { ...form, price: Number(form.price), promoPrice: form.promoPrice ? Number(form.promoPrice) : null, stock: Number(form.stock) };
    const res = await fetch(editing ? '/api/products/' + form.id : '/api/products', { method: editing ? 'PUT' : 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
    if (!res.ok) return setMsg('Erreur lors de l\'enregistrement.');
    setForm(empty); setEditing(false); setMsg(editing ? 'Produit modifié.' : 'Produit ajouté.'); load();
  };
  const del = async (id: string) => { if (!confirm('Supprimer ce produit ?')) return; await fetch('/api/products/' + id, { method: 'DELETE' }); load(); };
  const toggle = async (p: any) => { await fetch('/api/products/' + p.id, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ visible: !p.visible }) }); load(); };

  return (
    <div>
      <h1 className="font-titre text-3xl">Produits</h1>
      {msg && <p className="mt-2 text-sm text-green-700">{msg}</p>}
      <form onSubmit={save} className="mt-6 grid gap-3 rounded-2xl bg-carte p-5 shadow-sm md:grid-cols-2">
        <h2 className="md:col-span-2 font-semibold">{editing ? 'Modifier le produit' : 'Nouveau produit'}</h2>
        <input required value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="Nom du produit" className={f} />
        <select required value={form.categoryId} onChange={e => setForm({ ...form, categoryId: e.target.value })} className={f}>
          <option value="">Catégorie</option>{cats.map((c: any) => <option key={c.id} value={c.id}>{c.name}</option>)}
        </select>
        <textarea value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} placeholder="Description" className={f + ' md:col-span-2'} rows={2} />
        <input required type="number" value={form.price} onChange={e => setForm({ ...form, price: e.target.value })} placeholder="Prix (FCFA)" className={f} />
        <input type="number" value={form.promoPrice} onChange={e => setForm({ ...form, promoPrice: e.target.value })} placeholder="Prix promo (optionnel)" className={f} />
        <input type="number" value={form.stock} onChange={e => setForm({ ...form, stock: e.target.value })} placeholder="Stock" className={f} />
        <input value={form.sizes} onChange={e => setForm({ ...form, sizes: e.target.value })} placeholder="Tailles (S,M,L)" className={f} />
        <input value={form.colors} onChange={e => setForm({ ...form, colors: e.target.value })} placeholder="Couleurs (Noir,Doré)" className={f} />

        {/* Photos : clic -> galerie de l'appareil, puis miniatures avec bouton retirer */}
        <div className="md:col-span-2">
          <p className="mb-1 text-sm font-medium">Photos</p>
          <label className="inline-block cursor-pointer rounded-full border-2 border-dashed border-or px-5 py-3 text-sm font-semibold text-or-fonce hover:bg-or/10">
            <input type="file" accept="image/*" multiple className="absolute h-0 w-0 opacity-0" onChange={onFiles} />
            {uploading ? 'Envoi en cours...' : '+ Ajouter des photos'}
          </label>
          {form.images.length > 0 && (
            <div className="mt-3 flex flex-wrap gap-2">
              {form.images.map((u: string, i: number) => (
                <div key={i} className="relative">
                  <img src={u} alt="" className="h-20 w-16 rounded-lg object-cover" />
                  <button type="button" onClick={() => removeImage(i)} aria-label="Retirer"
                    className="absolute -right-1.5 -top-1.5 grid h-5 w-5 place-items-center rounded-full bg-red-500 text-xs text-white">×</button>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="flex flex-wrap items-center gap-4 text-sm md:col-span-2">
          <label className="flex gap-2"><input type="checkbox" checked={form.featured} onChange={e => setForm({ ...form, featured: e.target.checked })} /> En vedette</label>
          <label className="flex gap-2"><input type="checkbox" checked={form.bestseller} onChange={e => setForm({ ...form, bestseller: e.target.checked })} /> Meilleure vente</label>
          <label className="flex gap-2"><input type="checkbox" checked={form.visible} onChange={e => setForm({ ...form, visible: e.target.checked })} /> Visible</label>
        </div>
        <div className="flex gap-3 md:col-span-2">
          <button className="btn-or">{editing ? 'Enregistrer' : 'Ajouter le produit'}</button>
          {editing && <button type="button" onClick={() => { setEditing(false); setForm(empty); }} className="rounded-full border px-4">Annuler</button>}
        </div>
      </form>
      <div className="mt-8 space-y-3">
        {list.map((p: any) => (
          <div key={p.id} className="flex items-center gap-4 rounded-2xl bg-carte p-3 shadow-sm">
            {JSON.parse(p.images || '[]')[0] && <img src={JSON.parse(p.images)[0]} alt="" className="h-16 w-12 rounded-lg object-cover" />}
            <div className="flex-1">
              <p className="font-medium">{p.name} {!p.visible && <span className="text-xs text-red-500">(masqué)</span>}</p>
              <p className="text-sm text-gray-500">{p.price.toLocaleString('fr-FR')} FCFA : stock {p.stock} : {p.category?.name}</p>
            </div>
            <button onClick={() => { setEditing(true); setForm({ ...p, images: JSON.parse(p.images || '[]'), sizes: JSON.parse(p.sizes || '[]').join(','), colors: JSON.parse(p.colors || '[]').join(','), promoPrice: p.promoPrice || '' }); window.scrollTo(0, 0); }} className="text-sm text-or-fonce hover:underline">Modifier</button>
            <button onClick={() => toggle(p)} className="text-sm hover:underline">{p.visible ? 'Masquer' : 'Afficher'}</button>
            <button onClick={() => del(p.id)} className="text-sm text-red-500 hover:underline">Supprimer</button>
          </div>
        ))}
      </div>
    </div>
  );
}
