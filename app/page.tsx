// Page d'accueil : bannières, collections, nouveautés, meilleures ventes, avis.
import Link from 'next/link';
import ProductCard from '@/components/ProductCard';
import { prisma } from '@/lib/db';

const AVIS = [
  { nom: 'Aïcha K.', texte: 'Ma robe est arrivée en 2 jours, la qualité est incroyable. Je recommande à 100 %.' },
  { nom: 'Fatou D.', texte: 'Le service WhatsApp est très réactif. L\'ensemble bazin est sublime en vrai.' },
  { nom: 'Mariam T.', texte: 'Livraison soignée et tailles fidèles. C\'est ma boutique préférée maintenant.' }
];

export default async function Home() {
  const [settings, featured, newest, bestsellers, categories] = await Promise.all([
    prisma.settings.findUnique({ where: { id: 'main' } }),
    prisma.product.findMany({ where: { visible: true, featured: true }, take: 4, include: { category: true } }),
    prisma.product.findMany({ where: { visible: true, isNew: true }, orderBy: { createdAt: 'desc' }, take: 4 }),
    prisma.product.findMany({ where: { visible: true, bestseller: true }, take: 4 }),
    prisma.category.findMany({ include: { _count: { select: { products: true } } } })
  ]);
  const banners = JSON.parse(settings?.heroBanners || '[]');
  const cur = settings?.currency || 'FCFA';
  return (
    <div>
      {/* Héro en 2 colonnes : texte à gauche, photo encadrée à droite (maquette) */}
      <section className="mx-auto grid max-w-6xl items-center gap-10 px-4 pb-12 pt-10 md:grid-cols-2 md:pb-20 md:pt-16">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.25em] text-or-fonce">
            {banners[0]?.overline || 'Prêt-à-porter contemporain'}
          </p>
          <h1 className="mt-4 font-titre text-4xl md:text-5xl">{banners[0]?.title || 'Une allure qui vous ressemble.'}</h1>
          <p className="mt-4 max-w-md text-lg text-encre/70">
            {banners[0]?.subtitle || 'KORIKA COLLECTION imagine un vestiaire exprès : des pièces faciles à porter, choisies pour accompagner tous vos rythmes.'}
          </p>
          <Link href="/catalogue" className="btn-or mt-8 inline-block">Voir la boutique</Link>
        </div>
        <div className="relative">
          {(() => {
            const img = banners[0]?.image || (() => { try { return JSON.parse(featured[0]?.images || '[]')[0]; } catch { return null; } })();
            return (
              <>
                <div className="absolute -right-3 -top-3 h-full w-full rounded-[2rem] bg-or/70" aria-hidden />
                <div className="relative aspect-[4/5] overflow-hidden rounded-[2rem] bg-or/10">
                  {img && <img src={img} alt="Nouvelle collection" className="h-full w-full object-cover" />}
                </div>
                {featured[0] && (
                  <Link href={`/produit/${featured[0].slug}`}
                    className="absolute -left-2 bottom-6 rounded-2xl bg-carte p-4 shadow-lg transition hover:shadow-xl md:-left-6">
                    <p className="text-[10px] font-bold uppercase tracking-widest text-or-fonce">La pièce du moment</p>
                    <p className="mt-1 font-titre text-lg leading-tight">{featured[0].name}</p>
                  </Link>
                )}
              </>
            );
          })()}
        </div>
      </section>

      {/* Bandeau de réassurance */}
      <section className="bg-nuit py-4 text-creme">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-center gap-x-10 gap-y-2 px-4 text-sm font-medium">
          <span>Livraison rapide</span>
          <span>Commande simple via WhatsApp</span>
          <span>Paiement à la livraison / Mobile Money</span>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-12">
        <h2 className="font-titre text-3xl">Nos collections</h2>
        <div className="mt-6 grid grid-cols-2 gap-4 md:grid-cols-4">
          {categories.map(c => (
            <Link key={c.id} href={`/catalogue?categorie=${c.slug}`} className="card relative overflow-hidden">
              <div className="aspect-square bg-creme">
                {c.image && <img src={c.image} alt={c.name} className="h-full w-full object-cover" />}
              </div>
              <p className="absolute bottom-0 left-0 right-0 bg-nuit/70 p-3 text-center font-medium text-creme">
                {c.name} <span className="text-xs text-creme/60">({c._count.products})</span>
              </p>
            </Link>
          ))}
        </div>
      </section>

      <Section titre="En vedette" produits={featured} cur={cur} />
      <Section titre="Nouveautés" produits={newest} cur={cur} />
      <Section titre="Meilleures ventes" produits={bestsellers} cur={cur} />

      <section className="bg-nuit py-14 text-creme">
        <div className="mx-auto max-w-6xl px-4">
          <h2 className="font-titre text-3xl text-or">Elles nous adorent</h2>
          <div className="mt-8 grid gap-6 md:grid-cols-3">
            {AVIS.map((a, i) => (
              <div key={i} className="rounded-3xl bg-white/5 p-6">
                <p className="text-or">★★★★★</p>
                <p className="mt-3 text-sm text-creme/85">« {a.texte} »</p>
                <p className="mt-3 text-xs font-semibold text-creme/60">{a.nom}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

function Section({ titre, produits, cur }: { titre: string; produits: any[]; cur: string }) {
  if (!produits.length) return null;
  return (
    <section className="mx-auto max-w-6xl px-4 py-12">
      <div className="flex items-baseline justify-between">
        <h2 className="font-titre text-3xl">{titre}</h2>
        <Link href="/catalogue" className="text-sm text-or-fonce hover:underline">Tout voir</Link>
      </div>
      <div className="mt-6 grid grid-cols-2 gap-4 md:grid-cols-4">
        {produits.map(p => <ProductCard key={p.id} p={p} currency={cur} />)}
      </div>
    </section>
  );
}
