// Page produit : galerie, variantes, quantité, stock, ajout au panier.
import { prisma } from '@/lib/db';
import ProductDetail from './ProductDetail';

export default async function Page({ params }: { params: { slug: string } }) {
  const p = await prisma.product.findUnique({ where: { slug: params.slug }, include: { category: true } });
  if (!p || !p.visible) return <p className="py-20 text-center text-gray-500">Article introuvable.</p>;
  const related = await prisma.product.findMany({ where: { categoryId: p.categoryId, visible: true, NOT: { id: p.id } }, take: 4 });
  return <ProductDetail product={JSON.parse(JSON.stringify(p))} related={JSON.parse(JSON.stringify(related))} />;
}
