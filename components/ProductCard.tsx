'use client';
import Link from 'next/link';
import React from 'react';

export default function ProductCard({ p, currency = 'FCFA' }: { p: any; currency?: string }) {
  const images = JSON.parse(p.images || '[]');
  const price = p.promoPrice && p.promoPrice < p.price ? p.promoPrice : p.price;
  return (
    <Link href={`/produit/${p.slug}`} className="card fade-in block overflow-hidden">
      <div className="relative aspect-[3/4] w-full overflow-hidden bg-creme">
        {images[0] && <img src={images[0]} alt={p.name} className="h-full w-full object-cover transition duration-500 hover:scale-105" />}
        {p.promoPrice && p.promoPrice < p.price && (
          <span className="absolute left-3 top-3 rounded-full bg-or px-3 py-1 text-xs font-bold text-nuit">Promo</span>
        )}
        {p.stock === 0 && <span className="absolute inset-0 grid place-items-center bg-black/50 font-semibold text-white">Épuisé</span>}
      </div>
      <div className="p-3">
        <p className="truncate font-medium">{p.name}</p>
        <p className="mt-1 text-sm">
          <span className="font-semibold">{price.toLocaleString('fr-FR')} {currency}</span>
          {p.promoPrice && p.promoPrice < p.price && <span className="ml-2 text-gray-400 line-through">{p.price.toLocaleString('fr-FR')} {currency}</span>}
        </p>
      </div>
    </Link>
  );
}
