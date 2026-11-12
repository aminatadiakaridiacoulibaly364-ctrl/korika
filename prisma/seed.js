// Seed : compte admin unique + catégories + produits de démo + réglages.
// Lancement : npm run db:seed  (le mot de passe admin vient de .env)
require('dotenv').config();
const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const db = new PrismaClient();

const IMG = (id) => `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=800&q=70`;
const cats = [
  { name: 'Robes', slug: 'robes' }, { name: 'Tissus & Ensembles', slug: 'ensembles' },
  { name: 'Accessoires', slug: 'accessoires' }, { name: 'Vestes', slug: 'vestes' }
];
const products = [
  { name: 'Robe Wax Dorée', slug: 'robe-wax-doree', cat: 'robes', price: 25000, promo: 22000, featured: true, bestseller: true, isNew: true, stock: 12, images: [IMG('1595777457553-a5be54346bc7'), IMG('1539008835657-c9eaf7b6768f')], desc: 'Robe en wax premium, coupe fluide, finitions dorées à la main. Idéale pour cérémonies et soirées.' },
  { name: 'Ensemble Bazin Chic', slug: 'ensemble-bazin-chic', cat: 'ensembles', price: 32000, promo: null, featured: true, bestseller: true, isNew: true, stock: 8, images: [IMG('1596462502278-27bfdc403348')], desc: 'Ensemble bazin riche brodé, haut + bas. Élégance intemporelle.' },
  { name: 'Veste Kente Moderne', slug: 'veste-kente-moderne', cat: 'vestes', price: 28000, promo: null, featured: true, bestseller: false, isNew: true, stock: 5, images: [IMG('1591047139829-d91aecb6caea')], desc: 'Veste structurée aux motifs kente, doublure satin.' },
  { name: 'Sac à Main Nuit d\'Or', slug: 'sac-nuit-or', cat: 'accessoires', price: 15000, promo: 12500, featured: false, bestseller: true, isNew: false, stock: 20, images: [IMG('1548036328-c9fa89d128fa')], desc: 'Sac structuré cuir grainé, fermoir doré.' },
  { name: 'Robe Cocktail Cème', slug: 'robe-cocktail-creme', cat: 'robes', price: 21000, promo: null, featured: false, bestseller: false, isNew: true, stock: 10, images: [IMG('1539008835657-c9eaf7b6768f')], desc: 'Robe cocktail cintrée, crêpe doux, dos travaillé.' }
];

(async () => {
  await db.orderItem.deleteMany(); await db.order.deleteMany(); await db.product.deleteMany();
  await db.category.deleteMany(); await db.client.deleteMany(); await db.admin.deleteMany();
  await db.settings.deleteMany();

  await db.admin.create({ data: {
    email: process.env.ADMIN_EMAIL || 'admin@korika.com',
    passwordHash: bcrypt.hashSync(process.env.ADMIN_PASSWORD || 'ChangeMe123', 10)
  }});

  const catMap = {};
  for (const c of cats) catMap[c.slug] = await db.category.create({ data: c });

  for (const p of products) await db.product.create({ data: {
    name: p.name, slug: p.slug, description: p.desc, price: p.price, promoPrice: p.promo,
    images: JSON.stringify(p.images), sizes: JSON.stringify(['S', 'M', 'L', 'XL']),
    colors: JSON.stringify(['Noir', 'Doré', 'Cème']), stock: p.stock,
    featured: p.featured, bestseller: p.bestseller, isNew: p.isNew, visible: true,
    categoryId: catMap[p.cat].id
  }});

  await db.settings.create({ data: {
    storeName: 'KORIKA COLLECTION',
    whatsappNumber: process.env.WHATSAPP_NUMBER || '2250700000000',
    currency: 'FCFA',
    heroBanners: JSON.stringify([
      { title: 'Collection Signature', subtitle: 'L\'élégance africaine, réinventée', image: IMG('1483985988355-763728e1935b') },
      { title: 'Nouveautés du mois', subtitle: 'Des pièces uniques, en quantité limitée', image: IMG('1469334031218-e382a71b716b') }
    ]),
    deliveryZones: JSON.stringify([
      { zone: 'Abidjan centre', fee: 1000 }, { zone: 'Abidjan périphérie', fee: 2000 },
      { zone: 'Intérieur du pays', fee: 4000 }, { zone: 'Retrait en boutique', fee: 0 }
    ])
  }});
  console.log('Seed OK : admin, 4 catégories, 5 produits, réglages.');
  await db.$disconnect();
})();
