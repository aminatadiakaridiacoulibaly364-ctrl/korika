'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import ProductCard from '@/components/ProductCard';
import { useCart } from '@/lib/cart';

export default function ProductDetail({ product: p, related }: { product: any; related: any[] }) {
  const images = JSON.parse(p.images || '[]');
  const sizes = JSON.parse(p.sizes || '[]');
  const colors = JSON.parse(p.colors || '[]');
  const { add } = useCart();
  const router = useRouter();
  const [img, setImg] = useState(0);
  const [size, setSize] = useState(sizes[0] || '');
  const [color, setColor] = useState(colors[0] || '');
  const [qty, setQty] = useState(1);
  const price = p.promoPrice && p.promoPrice < p.price ? p.promoPrice : p.price;

  const addToCart = () => {
    if (!size || !color) return alert('Choisissez la taille et la couleur.');
    if (qty > p.stock) return alert('Stock insuffisant.');
    add({ productId: p.id, name: p.name, slug: p.slug, image: images[0], size, color, quantity: qty, unitPrice: price });
    router.push('/panier');
  };

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <div className="grid gap-8 md:grid-cols-2">
        <div>
          <div className="aspect-[3/4] overflow-hidden rounded-2xl bg-creme">
            {images[img] && <img src={images[img]} alt={p.name} className="h-full w-full object-cover" />}
          </div>
          <div className="mt-3 flex gap-2">
            {images.map((u: string, i: number) => (
              <button key={i} onClick={() => setImg(i)} className={`h-20 w-16 overflow-hidden rounded-lg border-2 ${i === img ? 'border-or' : 'border-transparent'}`}>
                <img src={u} alt="" className="h-full w-full object-cover" />
              </button>
            ))}
          </div>
        </div>
        <div>
          <p className="text-sm text-gray-500">{p.category?.name}</p>
          <h1 className="font-titre text-3xl">{p.name}</h1>
          <p className="mt-3 text-2xl font-semibold">
            {price.toLocaleString('fr-FR')} FCFA
            {p.promoPrice && p.promoPrice < p.price && <span className="ml-3 text-base text-gray-400 line-through">{p.price.toLocaleString('fr-FR')} FCFA</span>}
          </p>
          <p className="mt-1 text-sm text-gray-500">{p.stock > 0 ? `${p.stock} en stock` : 'Épuisé'}</p>
          <p className="mt-4 whitespace-pre-line text-gray-700">{p.description}</p>
          <div className="mt-6 space-y-4">
            <div>
              <p className="mb-1 text-sm font-medium">Taille</p>
              <div className="flex gap-2">{sizes.map(s => (
                <button key={s} onClick={() => setSize(s)} className={`rounded-full border px-4 py-2 text-sm ${size === s ? 'border-or bg-or/10 font-semibold' : 'border-gray-200'}`}>{s}</button>
              ))}</div>
            </div>
            <div>
              <p className="mb-1 text-sm font-medium">Couleur</p>
              <div className="flex flex-wrap gap-2">{colors.map(c => (
                <button key={c} onClick={() => setColor(c)} className={`rounded-full border px-4 py-2 text-sm ${color === c ? 'border-or bg-or/10 font-semibold' : 'border-gray-200'}`}>{c}</button>
              ))}</div>
            </div>
            <div>
              <p className="mb-1 text-sm font-medium">Quantité</p>
              <div className="flex w-32 items-center justify-between rounded-full border border-gray-200 px-2 py-1">
                <button onClick={() => setQty(Math.max(1, qty - 1))} className="px-2 text-lg">−</button>
                <span>{qty}</span>
                <button onClick={() => setQty(qty + 1)} className="px-2 text-lg">+</button>
              </div>
            </div>
          </div>
          <button onClick={addToCart} disabled={p.stock === 0} className="btn-or mt-6 w-full disabled:opacity-40">
            Ajouter au panier
          </button>
        </div>
      </div>
      {related.length > 0 && (
        <section className="mt-16">
          <h2 className="font-titre text-2xl">Vous aimerez aussi</h2>
          <div className="mt-6 grid grid-cols-2 gap-4 md:grid-cols-4">
            {related.map(r => <ProductCard key={r.id} p={r} />)}
          </div>
        </section>
      )}
    </div>
  );
}
