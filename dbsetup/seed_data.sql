INSERT INTO "Category" (id, name, slug) VALUES
  ('cat_robes', 'Robes', 'robes'),
  ('cat_ensembles', 'Tissus & Ensembles', 'ensembles'),
  ('cat_accessoires', 'Accessoires', 'accessoires'),
  ('cat_vestes', 'Vestes', 'vestes')
ON CONFLICT (id) DO NOTHING;

INSERT INTO "Product" (id, name, slug, description, price, "promoPrice", images, sizes, colors, stock, featured, bestseller, "isNew", visible, "categoryId") VALUES
  ('prd_wax_doree', 'Robe Wax Dorée', 'robe-wax-doree', 'Robe en wax premium, coupe fluide, finitions dorées à la main. Idéale pour cérémonies et soirées.', 25000, 22000, '["https://images.unsplash.com/photo-1595777457553-a5be54346bc7?auto=format&fit=crop&w=800&q=70","https://images.unsplash.com/photo-1539008835657-c9eaf7b6768f?auto=format&fit=crop&w=800&q=70"]', '["S","M","L","XL"]', '["Noir","Doré","Cème"]', 12, true, true, true, true, 'cat_robes'),
  ('prd_bazin_chic', 'Ensemble Bazin Chic', 'ensemble-bazin-chic', 'Ensemble bazin riche brodé, haut + bas. Élégance intemporelle.', 32000, NULL, '["https://images.unsplash.com/photo-1596462502278-27bfdc403348?auto=format&fit=crop&w=800&q=70"]', '["S","M","L","XL"]', '["Noir","Doré","Cème"]', 8, true, true, true, true, 'cat_ensembles'),
  ('prd_kente', 'Veste Kente Moderne', 'veste-kente-moderne', 'Veste structurée aux motifs kente, doublure satin.', 28000, NULL, '["https://images.unsplash.com/photo-1591047139829-d91aecb6caea?auto=format&fit=crop&w=800&q=70"]', '["S","M","L","XL"]', '["Noir","Doré","Cème"]', 5, true, false, true, true, 'cat_vestes'),
  ('prd_sac_nuit', 'Sac à Main Nuit d''Or', 'sac-nuit-or', 'Sac structuré cuir grainé, fermoir doré.', 15000, 12500, '["https://images.unsplash.com/photo-1548036328-c9fa89d128fa?auto=format&fit=crop&w=800&q=70"]', '["S","M","L","XL"]', '["Noir","Doré","Cème"]', 20, false, true, false, true, 'cat_accessoires'),
  ('prd_cocktail_creme', 'Robe Cocktail Cème', 'robe-cocktail-creme', 'Robe cocktail cintrée, crêpe doux, dos travaillé.', 21000, NULL, '["https://images.unsplash.com/photo-1539008835657-c9eaf7b6768f?auto=format&fit=crop&w=800&q=70"]', '["S","M","L","XL"]', '["Noir","Doré","Cème"]', 10, false, false, true, true, 'cat_robes')
ON CONFLICT (id) DO NOTHING;

INSERT INTO "Settings" (id, "storeName", "whatsappNumber", currency, "heroBanners", "deliveryZones") VALUES
  ('main', 'KORIKA COLLECTION', NULL, 'FCFA',
   '[{"title":"Collection Signature","subtitle":"L''élégance africaine, réinventée","image":"https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=800&q=70"},{"title":"Nouveautés du mois","subtitle":"Des pièces uniques, en quantité limitée","image":"https://images.unsplash.com/photo-1469334031218-e382a71b716b?auto=format&fit=crop&w=800&q=70"}]',
   '[{"zone":"Abidjan centre","fee":1000},{"zone":"Abidjan périphérie","fee":2000},{"zone":"Intérieur du pays","fee":4000},{"zone":"Retrait en boutique","fee":0}]')
ON CONFLICT (id) DO NOTHING;
