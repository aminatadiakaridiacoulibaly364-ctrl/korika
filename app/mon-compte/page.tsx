'use client';
// Espace client : connexion / inscription, historique des commandes. La commande en invité reste possible.
import { useEffect, useState } from 'react';

export default function MonCompte() {
  const [client, setClient] = useState<any>(null);
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [f, setF] = useState({ email: '', phone: '', password: '' });
  const [msg, setMsg] = useState('');
  const field = 'w-full rounded-xl border border-gray-200 px-4 py-3';

  useEffect(() => { fetch('/api/auth/me').then(r => r.json()).then(d => setClient(d.client)); }, []);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault(); setMsg('');
    const res = await fetch('/api/auth/register', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ ...f, mode }) });
    const d = await res.json();
    if (!res.ok) return setMsg(d.error || 'Erreur.');
    const me = await fetch('/api/auth/me').then(r => r.json()); setClient(me.client);
  };
  const logout = async () => { await fetch('/api/auth/logout', { method: 'POST' }); setClient(null); };

  if (client) return (
    <div className="mx-auto max-w-2xl px-4 py-8">
      <h1 className="font-titre text-3xl">Bonjour {client.email}</h1>
      <button onClick={logout} className="mt-2 text-sm text-red-500 hover:underline">Déconnexion</button>
      <h2 className="mt-8 font-titre text-xl">Mes commandes</h2>
      <div className="mt-4 space-y-3">
        {client.orders.map((o: any) => (
          <div key={o.id} className="rounded-2xl bg-carte p-4 shadow-sm">
            <p className="font-semibold">{o.reference} : {new Date(o.createdAt).toLocaleDateString('fr-FR')}</p>
            <p className="text-sm text-gray-500">Statut : {o.status} : {o.total.toLocaleString('fr-FR')} FCFA</p>
            <ul className="mt-2 text-sm text-gray-600">
              {o.items.map((i: any) => <li key={i.id}>{i.name} ({i.size}, {i.color}) x{i.quantity}</li>)}
            </ul>
          </div>
        ))}
        {!client.orders.length && <p className="text-gray-500">Aucune commande pour le moment.</p>}
      </div>
    </div>
  );

  return (
    <div className="mx-auto max-w-sm px-4 py-16">
      <h1 className="font-titre text-3xl">Mon compte</h1>
      <p className="mt-2 text-sm text-gray-500">Optionnel : vous pouvez aussi commander en invité.</p>
      <form onSubmit={submit} className="mt-6 space-y-3">
        <input required type="email" value={f.email} onChange={e => setF({ ...f, email: e.target.value })} placeholder="Email" className={field} />
        {mode === 'register' && <input value={f.phone} onChange={e => setF({ ...f, phone: e.target.value })} placeholder="Téléphone" className={field} />}
        <input required type="password" value={f.password} onChange={e => setF({ ...f, password: e.target.value })} placeholder="Mot de passe (8 caractères min.)" className={field} />
        <button className="btn-or w-full">{mode === 'login' ? 'Se connecter' : 'Créer mon compte'}</button>
      </form>
      {msg && <p className="mt-3 text-sm text-red-500">{msg}</p>}
      <p className="mt-6 text-center text-sm">
        <button onClick={() => setMode(mode === 'login' ? 'register' : 'login')} className="text-or-fonce hover:underline">
          {mode === 'login' ? 'Créer un compte' : 'Déjà un compte ? Se connecter'}
        </button>
      </p>
    </div>
  );
}
