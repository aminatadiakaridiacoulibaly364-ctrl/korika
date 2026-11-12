-- Schéma KORIKA FASHION pour Supabase (Postgres) avec Row Level Security.
-- Exécutez ce script dans le SQL Editor de Supabase, puis mettez
-- DATABASE_URL=postgresql://... dans Vercel et passez provider "postgresql" dans prisma/schema.prisma.

create table if not exists "Admin" (
  id text primary key, email text unique not null, "passwordHash" text not null,
  "resetToken" text, "resetExpires" timestamptz, "createdAt" timestamptz default now());
create table if not exists "Category" (
  id text primary key, name text unique not null, slug text unique not null, image text);
create table if not exists "Product" (
  id text primary key, name text not null, slug text unique not null, description text,
  price double precision not null, "promoPrice" double precision, images text, sizes text, colors text,
  stock int default 0, featured boolean default false, bestseller boolean default false,
  "isNew" boolean default true, visible boolean default true,
  "categoryId" text references "Category"(id), "createdAt" timestamptz default now());
create table if not exists "Client" (
  id text primary key, email text unique not null, phone text, "passwordHash" text not null,
  addresses text default '[]', "createdAt" timestamptz default now());
create table if not exists "Order" (
  id text primary key, reference text unique not null, status text default 'en_attente',
  "fullName" text, phone text, city text, district text, address text,
  "deliveryMode" text, "deliveryFee" double precision default 0, "paymentMethod" text,
  notes text, total double precision, "clientId" text references "Client"(id),
  "createdAt" timestamptz default now());
create table if not exists "OrderItem" (
  id text primary key, "orderId" text references "Order"(id), "productId" text references "Product"(id),
  name text, size text, color text, quantity int, "unitPrice" double precision);
create table if not exists "Settings" (
  id text primary key default 'main', "storeName" text default 'KORIKA FASHION', "logoUrl" text,
  "whatsappNumber" text, currency text default 'FCFA', "heroBanners" text default '[]',
  "deliveryZones" text default '[]');

-- Row Level Security : le site accède à la base avec la clé de service ( côté serveur Next.js),
-- donc les tables restent fermées au public.
alter table "Admin" enable row level security;
alter table "Category" enable row level security;
alter table "Product" enable row level security;
alter table "Client" enable row level security;
alter table "Order" enable row level security;
alter table "OrderItem" enable row level security;
alter table "Settings" enable row level security;
-- Aucune policy publique : seule la clé de service (server-side) écrit et lit.
