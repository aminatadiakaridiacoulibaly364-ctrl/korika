'use client';
// Paramètres boutique : nom, logo, WhatsApp, devise, bannières, zones de livraison, mot de passe.
import { useEffect, useState } from 'react';


// Thème par défaut du site : ce que voient les visiteurs tant qu'ils n'ont rien personnalisé.
const PALETTES: Record<string, Record<string, string>> = {
  'Rose (par défaut)': { creme: '#FBEDE8', carte: '#FFFAF8', encre: '#2A1A22', nuit: '#2A1A22', or: '#D56B7F', orClair: '#E08798', orFonce: '#B84E63' },
  'Clair': { creme: '#FBFAF8', carte: '#FFFFFF', encre: '#26232B', nuit: '#2A1A22', or: '#C76E80', orClair: '#DC8B9A', orFonce: '#A94F60' },
  'Sombre': { creme: '#141018', carte: '#221A24', encre: '#F3E8EF', nuit: '#2A1F2E', or: '#E39CAD', orClair: '#EFB6C4', orFonce: '#C97F93' },
  'Beige & Or': { creme: '#F7F1E4', carte: '#FFFBF3', encre: '#33281A', nuit: '#3A2E1F', or: '#B8912F', orClair: '#D4AE52', orFonce: '#8F6E1E' },
  'Bleu nuit': { creme: '#EEF2F8', carte: '#FFFFFF', encre: '#16233D', nuit: '#16233D', or: '#4A6FB5', orClair: '#6E8FC9', orFonce: '#35528C' },
  'Vert sauge': { creme: '#F1F5F0', carte: '#FFFFFF', encre: '#233226', nuit: '#2C3B2E', or: '#6E8F6B', orClair: '#8FAD8C', orFonce: '#547050' }
};

const POLICES = ['Playfair Display', 'Cormorant Garamond', 'Marcellus', 'DM Serif Display', 'Lora', 'Montserrat', 'Poppins', 'DM Sans', 'Jost'];

const CHAMPS: Array<[string, string]> = [
  ['creme', 'Fond principal'], ['carte', 'Cartes'], ['encre', 'Texte'], ['nuit', 'Surfaces sombres'], ['or', 'Accent'], ['orClair', 'Accent clair'], ['orFonce', 'Accent foncé']
];

export default function Parametres() {
  const [s, setS] = useState<any>(null);
  const [banners, setBanners] = useState('');
  const [zones, setZones] = useState('');
  const [msg, setMsg] = useState('');
  const [pw, setPw] = useState({ current: '', next: '' });
  const [theme, setTheme] = useState<Record<string, string>>({});
  const defautFonts: Record<string, string> = { fontTitre: 'Playfair Display', fontCorps: 'Inter' };
  const [pwMsg, setPwMsg] = useState('');
  const f = 'w-full rounded-xl border border-gray-200 px-3 py-2 text-sm';

  useEffect(() => {
    fetch('/api/settings').then(r => r.json()).then((d: any) => {
      setS(d); setBanners(JSON.stringify(JSON.parse(d.heroBanners || '[]'), null, 1)); setZones(JSON.stringify(JSON.parse(d.deliveryZones || '[]'), null, 1));
      try { setTheme(JSON.parse(d.theme || '{}')); } catch {}
    });
  }, []);
  if (!s) return <p className="text-gray-400">Chargement...</p>;

  const save = async (e: React.FormEvent) => {
    e.preventDefault(); setMsg('');
    try { JSON.parse(banners); JSON.parse(zones); } catch { return setMsg('Les bannières et zones doivent être du JSON valide.'); }
    const res = await fetch('/api/settings', { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ ...s, heroBanners: JSON.parse(banners), deliveryZones: JSON.parse(zones), theme }) });
    setMsg(res.ok ? 'Paramètres enregistrés.' : 'Erreur.');
  };
  const changePw = async (e: React.FormEvent) => {
    e.preventDefault(); setPwMsg('');
    const res = await fetch('/api/admin/password', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(pw) });
    const d = await res.json(); setPwMsg(res.ok ? 'Mot de passe changé.' : d.error);
  };

  return (
    <div className="space-y-10">
      <div>
        <h1 className="font-titre text-3xl">Paramètres</h1>
        <form onSubmit={save} className="mt-6 grid gap-3 rounded-2xl bg-carte p-5 shadow-sm md:grid-cols-2">
          <label className="text-sm">Nom de la boutique
            <input value={s.storeName || ''} onChange={e => setS({ ...s, storeName: e.target.value })} className={f} /></label>
          <label className="text-sm">Logo (URL de l'image)
            <input value={s.logoUrl || ''} onChange={e => setS({ ...s, logoUrl: e.target.value })} className={f} /></label>
          <label className="text-sm">Numéro WhatsApp (avec indicatif, sans + ni espaces)
            <input value={s.whatsappNumber || ''} onChange={e => setS({ ...s, whatsappNumber: e.target.value })} placeholder="2250700000000" className={f} /></label>
          <label className="text-sm">E-mail de contact
            <input value={s.contactEmail || ''} onChange={e => setS({ ...s, contactEmail: e.target.value })} placeholder="contact@korika.com" className={f} /></label>
          <label className="text-sm">Adresse de retrait en boutique
            <input value={s.pickupAddress || ''} onChange={e => setS({ ...s, pickupAddress: e.target.value })} placeholder="1 rue de Valmy, Sebenikoro, Bamako" className={f} /></label>
          <label className="text-sm">Devise
            <input value={s.currency || ''} onChange={e => setS({ ...s, currency: e.target.value })} className={f} /></label>
          <label className="text-sm md:col-span-2">Bannières de la page d'accueil (JSON : tableau de {`{ title, subtitle, image }`})
            <textarea value={banners} onChange={e => setBanners(e.target.value)} rows={6} className={f + ' font-mono text-xs'} /></label>
          <label className="text-sm md:col-span-2">Frais de livraison par zone (JSON : tableau de {`{ zone, fee }`})
            <textarea value={zones} onChange={e => setZones(e.target.value)} rows={5} className={f + ' font-mono text-xs'} /></label>
          <div className="md:col-span-2"><button className="btn-or">Enregistrer</button></div>
          {msg && <p className="md:col-span-2 text-sm text-green-700">{msg}</p>}
        </form>
      </div>
      <div>
        <h2 className="font-titre text-2xl">Changer mon mot de passe</h2>
        <form onSubmit={changePw} className="mt-4 grid max-w-md gap-3">
          <input required type="password" value={pw.current} onChange={e => setPw({ ...pw, current: e.target.value })} placeholder="Mot de passe actuel" className={f} />
          <input required type="password" value={pw.next} onChange={e => setPw({ ...pw, next: e.target.value })} placeholder="Nouveau mot de passe (10 caractères min.)" className={f} />
          <button className="btn-or">Changer</button>
          {pwMsg && <p className="text-sm text-green-700">{pwMsg}</p>}
        </form>
      </div>
    </div>
  );
}
