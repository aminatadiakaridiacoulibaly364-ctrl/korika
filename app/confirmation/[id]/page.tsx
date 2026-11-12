import { prisma } from '@/lib/db';
export default async function Page({ params }: { params: { id: string } }) {
  const order = await prisma.order.findUnique({ where: { id: params.id }, include: { items: true } });
  if (!order) return <p className="py-24 text-center text-gray-500">Commande introuvable.</p>;
  return (
    <div className="mx-auto max-w-2xl px-4 py-16 text-center">
      <div className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-green-100 text-3xl">✓</div>
      <h1 className="mt-6 font-titre text-3xl">Merci, {order.fullName.split(' ')[0]} !</h1>
      <p className="mt-2 text-gray-600">Votre commande <strong>{order.reference}</strong> est enregistrée.
        Si WhatsApp ne s'est pas ouvert, envoyez-nous votre confirmation pour finaliser.</p>
      <div className="mt-8 rounded-2xl bg-carte p-6 text-left shadow-sm">
        {order.items.map(i => (
          <p key={i.id} className="flex justify-between py-1 text-sm">
            <span>{i.name} ({i.size}, {i.color}) x{i.quantity}</span>
            <span>{(i.unitPrice * i.quantity).toLocaleString('fr-FR')} FCFA</span>
          </p>
        ))}
        <p className="flex justify-between py-1 text-sm"><span>Livraison ({order.deliveryMode})</span><span>{order.deliveryFee.toLocaleString('fr-FR')} FCFA</span></p>
        <p className="mt-2 flex justify-between border-t pt-2 font-semibold"><span>Total</span><span>{order.total.toLocaleString('fr-FR')} FCFA</span></p>
      </div>
      <a href="/" className="btn-or mt-8 inline-block">Retour à la boutique</a>
    </div>
  );
}
