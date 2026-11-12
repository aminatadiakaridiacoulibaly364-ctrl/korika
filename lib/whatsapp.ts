// Construit le lien wa.me avec le message de commande pré-rempli.
export function buildWhatsAppLink(number: string, message: string) {
  const digits = (number || '').replace(/\D/g, '');
  return `https://wa.me/${digits}?text=${encodeURIComponent(message)}`;
}
export function formatOrderMessage(order: any, settings: any, clientEmail?: string) {
  const cur = settings.currency || 'FCFA';
  const lines = order.items.map((i: any) =>
    `- ${i.name} (taille ${i.size}, couleur ${i.color}) x${i.quantity} : ${i.unitPrice.toLocaleString('fr-FR')} ${cur}`).join('\n');
  return [
    `Bonjour ${settings.storeName || 'KORIKA COLLECTION'}, je viens de passer une commande sur votre site.`,
    ``,
    `Commande n° ${order.reference}`,
    `Date : ${new Date(order.createdAt).toLocaleString('fr-FR')}`,
    ``,
    `Nom : ${order.fullName}`,
    `Téléphone : ${order.phone}`,
    `Adresse : ${order.address}, ${order.district}, ${order.city}`,
    `Email : ${clientEmail || '-'}`,
    ``,
    `Produits :`,
    lines,
    ``,
    `Frais de livraison : ${order.deliveryFee.toLocaleString('fr-FR')} ${cur}`,
    `TOTAL À PAYER : ${order.total.toLocaleString('fr-FR')} ${cur}`,
    `Mode de livraison : ${order.deliveryMode}`,
    `Paiement : ${order.paymentMethod === 'paiement_livraison' ? 'Paiement à la livraison' : order.paymentMethod}`,
    order.notes ? `Notes : ${order.notes}` : ``
  ].filter(Boolean).join('\n');
}
