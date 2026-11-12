'use client';
// Connexion admin unique. Aucune inscription publique : le compte est créé par le seed.
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function AdminLogin() {
  const router = useRouter();
  const [mode, setMode] = useState<'login'|'forgot'|'reset'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [token, setToken] = useState('');
  const [msg, setMsg] = useState('');
  const [busy, setBusy] = useState(false);
  const f = 'w-full rounded-xl border border-gray-200 px-4 py-3';

  const submit = async (e: React.FormEvent) => {
    e.preventDefault(); setBusy(true); setMsg('');
    const url = mode === 'login' ? '/api/auth/login' : mode === 'forgot' ? '/api/auth/forgot' : '/api/auth/reset';
    const body = mode === 'login' ? { email, password } : mode === 'forgot' ? { email } : { token, password };
    const res = await fetch(url, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
    const data = await res.json(); setBusy(false);
    if (!res.ok) return setMsg(data.error || 'Erreur.');
    if (mode === 'login') { router.push('/admin'); router.refresh(); return; }
    if (mode === 'forgot') { setMsg('Jeton généré (valable 1 h) : ' + data.token + ' . Collez-le ci-dessous avec votre nouveau mot de passe.'); setMode('reset'); }
    else { setMsg('Mot de passe réinitialisé. Vous pouvez vous connecter.'); setMode('login'); }
  };

  return (
    <div className="mx-auto max-w-sm px-4 py-20">
      <h1 className="text-center font-titre text-3xl text-or">KORIKA ADMIN</h1>
      <form onSubmit={submit} className="mt-8 space-y-4">
        {mode !== 'reset' && <input type="email" required value={email} onChange={e => setEmail(e.target.value)} placeholder="Email admin" className={f} />}
        {mode === 'reset' && <input required value={token} onChange={e => setToken(e.target.value)} placeholder="Jeton de réinitialisation" className={f} />}
        {mode !== 'forgot' && <input type="password" required value={password} onChange={e => setPassword(e.target.value)} placeholder="Mot de passe" className={f} />}
        <button disabled={busy} className="btn-or w-full">{busy ? '...' : mode === 'login' ? 'Se connecter' : 'Continuer'}</button>
      </form>
      {msg && <p className="mt-4 break-all text-center text-sm text-gray-600">{msg}</p>}
      <p className="mt-6 text-center text-sm">
        <button onClick={() => setMode(mode === 'login' ? 'forgot' : 'login')} className="text-or-fonce hover:underline">
          {mode === 'login' ? 'Mot de passe oublié ?' : 'Retour à la connexion'}
        </button>
      </p>
    </div>
  );
}
