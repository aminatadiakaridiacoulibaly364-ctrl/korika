'use client';
// Panier en localStorage, partagé entre toutes les pages.
import React, { createContext, useContext, useEffect, useState } from 'react';
export type CartItem = { productId: string; name: string; slug: string; image: string; size: string; color: string; quantity: number; unitPrice: number };
const CartCtx = createContext<any>(null);
export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  useEffect(() => { setItems(JSON.parse(localStorage.getItem('korika_cart') || '[]')); }, []);
  const save = (list: CartItem[]) => { setItems(list); localStorage.setItem('korika_cart', JSON.stringify(list)); };
  const add = (it: CartItem) => {
    const list = [...items];
    const found = list.find(x => x.productId === it.productId && x.size === it.size && x.color === it.color);
    if (found) found.quantity += it.quantity; else list.push(it);
    save(list);
  };
  const update = (i: number, quantity: number) => { const list = [...items]; list[i].quantity = Math.max(1, quantity); save(list); };
  const remove = (i: number) => { save(items.filter((_, x) => x !== i)); };
  const clear = () => save([]);
  const total = items.reduce((s, x) => s + x.unitPrice * x.quantity, 0);
  const count = items.reduce((s, x) => s + x.quantity, 0);
  return <CartCtx.Provider value={{ items, add, update, remove, clear, total, count }}>{children}</CartCtx.Provider>;
}
export const useCart = () => useContext(CartCtx);
