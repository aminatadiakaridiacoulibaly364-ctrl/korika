// Catalogue : filtres (catégorie, taille, couleur, prix), tri, recherche. Client component.
'use client';
import { useEffect, useState } from 'react';
import ProductCard from '@/components/ProductCard';

export default function Catalogue() {
  const [products, setProducts] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [q, setQ] = useState('');
  const [cat, setCat] = useState('');
  const [size, setSize] = useState('');
  const [color, setColor] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [tri, setTri] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const sp = new URLSearchParams(window.location.search);
    if (sp.get('categorie')) setCat(sp.get('categorie')!);
    if (sp.get('tri')) setTri(sp.get('tri')!);
  }, []);

  useEffect(() => {
    Promise.all([
      fetch('/api/products').then(r => r.json()),
      fetch('/api/categories').then(r => r.json())
    ]).then(([ps, cs]) => { setProducts(ps); setCategories(cs); setLoading(false); });
  }, []);

  const sizes = ['S', 'M', 'L', 'XL'];
  const colors = Array.from(new Set(products.flatMap((p: any) => JSON.parse(p.colors || '[]'))));
  const shown = products
    .filter(p => !q || p.name.toLowerCase().includes(q.toLowerCase()) || p.description.toLowerCase().includes(q.toLowerCase()))
    .filter(p => !cat || p.category?.slug === cat)
    .filter(p => !size || JSON.parse(p.sizes || '[]').includes(size))
    .filter(p => !color || JSON.parse(p.colors || '[]').includes(color))
    .filter(p => !maxPrice || (p.promoPrice || p.price) <= Number(maxPrice))
    .sort((a: any, b: any) =>
      tri === 'prix_asc' ? a.price - b.price :
      tri === 'prix_desc' ? b.price - a.price :
      tri === 'nouveautes' ? new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime() : 0);

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <h1 className="font-titre text-3xl">Boutique</h1>
      <div className="mt-4 flex flex-wrap gap-2">
        <input value={q} onChange={e => setQ(e.target.value)} placeholder="Rechercher un article..."
          className="w-full rounded-full border border-gray-200 px-4 py-2 md:w-72" />
        <select value={cat} onChange={e => setCat(e.target.value)} className="rounded-full border border-gray-200 px-3 py-2 text-sm">
          <option value="">Toutes catégories</option>
          {categories.map(c => <option key={c.id} value={c.slug}>{c.name}</option>)}
        </select>
        <select value={size} onChange={e => setSize(e.target.value)} className="rounded-full border border-gray-200 px-3 py-2 text-sm">
          <option value="">Taille</option>{sizes.map(s => <option key={s}>{s}</option>)}
        </select>
        <select value={color} onChange={e => setColor(e.target.value)} className="rounded-full border border-gray-200 px-3 py-2 text-sm">
          <option value="">Couleur</option>{colors.map(c => <option key={c}>{c}</option>)}
        </select>
        <input value={maxPrice} onChange={e => setMaxPrice(e.target.value)} type="number" placeholder="Prix max"
          className="w-28 rounded-full border border-gray-200 px-3 py-2 text-sm" />
        <select value={tri} onChange={e => setTri(e.target.value)} className="rounded-full border border-gray-200 px-3 py-2 text-sm">
          <option value="">Trier</option>
          <option value="nouveautes">Nouveautés</option>
          <option value="prix_asc">Prix croissant</option>
          <option value="prix_desc">Prix décroissant</option>
        </select>
      </div>
      {loading ? <p className="mt-10 text-center text-gray-400">Chargement...</p> : shown.length ? (
        <div className="mt-8 grid grid-cols-2 gap-4 md:grid-cols-4">
          {shown.map(p => <ProductCard key={p.id} p={p} />)}
        </div>
      ) : <p className="mt-10 text-center text-gray-500">Aucun article ne correspond à votre recherche.</p>}
    </div>
  );
}
