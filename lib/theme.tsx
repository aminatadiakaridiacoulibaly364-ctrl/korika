'use client';
// Personnalisation pour les visiteurs : thème (couleurs), polices, taille du texte.
// Appliqué instantanément par variables CSS et mémorisé dans le navigateur (localStorage).
import React, { createContext, useContext, useEffect, useState } from 'react';

export const PALETTES: Record<string, { label: string; c: Record<string, string> }> = {
  rose:         { label: 'Rose',       c: { creme: '#FBEDE8', carte: '#FFFAF8', encre: '#2A1A22', nuit: '#2A1A22', or: '#D56B7F', orClair: '#E08798', orFonce: '#B84E63' } },
  clair:        { label: 'Clair',      c: { creme: '#FBFAF8', carte: '#FFFFFF', encre: '#26232B', nuit: '#2A1A22', or: '#C76E80', orClair: '#DC8B9A', orFonce: '#A94F60' } },
  sombre:       { label: 'Sombre',     c: { creme: '#141018', carte: '#221A24', encre: '#F3E8EF', nuit: '#2A1F2E', or: '#E39CAD', orClair: '#EFB6C4', orFonce: '#C97F93' } },
  'beige-or':   { label: 'Beige & Or', c: { creme: '#F7F1E4', carte: '#FFFBF3', encre: '#33281A', nuit: '#3A2E1F', or: '#B8912F', orClair: '#D4AE52', orFonce: '#8F6E1E' } },
  'bleu-nuit':  { label: 'Bleu nuit',  c: { creme: '#EEF2F8', carte: '#FFFFFF', encre: '#16233D', nuit: '#16233D', or: '#4A6FB5', orClair: '#6E8FC9', orFonce: '#35528C' } },
  'vert-sauge': { label: 'Vert sauge', c: { creme: '#F1F5F0', carte: '#FFFFFF', encre: '#233226', nuit: '#2C3B2E', or: '#6E8F6B', orClair: '#8FAD8C', orFonce: '#547050' } }
};

export const POLICES = ['Playfair Display', 'Cormorant Garamond', 'Lora', 'Poppins', 'Montserrat', 'DM Sans', 'Inter'];
export const TAILLES = [
  { v: 0, label: 'A-', px: '87.5%' }, { v: 1, label: 'A', px: '100%' },
  { v: 2, label: 'A+', px: '112.5%' }, { v: 3, label: 'A++', px: '125%' }
];

type Prefs = { palette: string; fontTitre: string; fontCorps: string; texte: number };
const CLE = 'korika-prefs';

function appliquer(p: Prefs) {
  const c = (PALETTES[p.palette] || PALETTES.rose).c;
  const r = document.documentElement.style;
  for (const [k, v] of Object.entries(c)) r.setProperty(`--c-${k}`, v);
  r.setProperty('--font-titre', `'${p.fontTitre}'`);
  r.setProperty('--font-corps', `'${p.fontCorps}'`);
  r.setProperty('--texte-echelle', TAILLES.find(t => t.v === p.texte)?.px || '100%');
  if (p.palette === 'sombre') document.documentElement.setAttribute('data-mode', 'sombre');
  else document.documentElement.removeAttribute('data-mode');
}

const Ctx = createContext<{ prefs: Prefs; set: (m: Partial<Prefs>) => void; reset: () => void }>({
  prefs: { palette: 'rose', fontTitre: 'Playfair Display', fontCorps: 'Inter', texte: 1 },
  set: () => {}, reset: () => {}
});

export function ThemeProvider({ defaut, children }: { defaut?: Partial<Prefs>; children: React.ReactNode }) {
  const [prefs, setPrefs] = useState<Prefs>({
    palette: 'rose', fontTitre: defaut?.fontTitre || 'Playfair Display',
    fontCorps: defaut?.fontCorps || 'Inter', texte: 1
  });
  useEffect(() => {
    try {
      const brut = localStorage.getItem(CLE);
      if (brut) { const p = JSON.parse(brut); appliquer(p); setPrefs(p); }
    } catch {}
  }, []);
  const set = (m: Partial<Prefs>) => setPrefs(prev => {
    const n = { ...prev, ...m };
    appliquer(n);
    try { localStorage.setItem(CLE, JSON.stringify(n)); } catch {}
    return n;
  });
  // Réinitialiser : on efface les préférences et on recharge pour retrouver le thème par défaut de la boutique.
  const reset = () => { try { localStorage.removeItem(CLE); } catch {}; location.reload(); };
  return <Ctx.Provider value={{ prefs, set, reset }}>{children}</Ctx.Provider>;
}
export const useTheme = () => useContext(Ctx);

// Petit panneau ouvert depuis l'icône palette de l'en-tête.
export function ThemePanel({ onClose }: { onClose: () => void }) {
  const { prefs, set, reset } = useTheme();
  const f = 'w-full rounded-xl border border-black/10 bg-white/60 px-3 py-2 text-sm';
  return (
    <div className="absolute right-0 top-12 z-50 w-72 rounded-3xl border border-black/5 bg-carte p-4 text-sm shadow-xl fade-in">
      <p className="mb-2 font-semibold">Thème</p>
      <div className="grid grid-cols-3 gap-2">
        {Object.entries(PALETTES).map(([id, p]) => (
          <button key={id} onClick={() => set({ palette: id })}
            className={`rounded-2xl border p-2 text-center text-xs transition ${prefs.palette === id ? 'border-or bg-or/10' : 'border-black/10 hover:border-or/50'}`}>
            <span className="mx-auto mb-1 block h-6 w-full rounded-full border border-black/5"
              style={{ background: `linear-gradient(135deg, ${p.c.creme} 60%, ${p.c.or} 60%)` }} />
            {p.label}
          </button>
        ))}
      </div>
      <p className="mb-2 mt-4 font-semibold">Polices</p>
      <select className={f} value={prefs.fontTitre} onChange={e => set({ fontTitre: e.target.value })}>
        {POLICES.map(p => <option key={p} value={p} style={{ fontFamily: `'${p}'` }}>Titres : {p}</option>)}
      </select>
      <select className={`${f} mt-2`} value={prefs.fontCorps} onChange={e => set({ fontCorps: e.target.value })}>
        {POLICES.map(p => <option key={p} value={p} style={{ fontFamily: `'${p}'` }}>Texte : {p}</option>)}
      </select>
      <p className="mt-2 rounded-2xl bg-or/10 p-3 text-center font-titre text-lg" style={{ fontFamily: `'${prefs.fontTitre}'` }}>
        Une allure qui vous ressemble.
      </p>
      <p className="mb-2 mt-4 font-semibold">Taille du texte</p>
      <div className="flex gap-2">
        {TAILLES.map(t => (
          <button key={t.v} onClick={() => set({ texte: t.v })}
            className={`flex-1 rounded-xl border py-2 ${prefs.texte === t.v ? 'border-or bg-or/10 font-bold' : 'border-black/10'}`}>
            {t.label}
          </button>
        ))}
      </div>
      <button onClick={reset} className="mt-4 w-full rounded-full border border-black/10 py-2 text-xs hover:bg-or/10">
        Réinitialiser au thème de la boutique
      </button>
    </div>
  );
}
