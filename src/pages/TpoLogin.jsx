import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldCheck, ArrowRight } from 'lucide-react';

export default function TpoLogin() {
  const [id, setId] = useState('');
  const [pass, setPass] = useState('');
  const [ok, setOk] = useState(false);
  const navigate = useNavigate();

  const submit = () => {
    if (id.trim().toLowerCase() === 'tpoaits') setOk(true);
  };

  if (ok) return (
    <main className="max-w-md mx-auto pt-20 px-6">
      <h2 className="text-2xl font-extrabold text-slate-900">Access granted — redirecting to TPO Dashboard...</h2>
      <button onClick={() => navigate('/tpo-dashboard')} className="inline-flex items-center gap-2 mt-4 px-6 py-3 rounded-full bg-blue-600 text-white font-bold hover:bg-blue-700 transition shadow-lg shadow-blue-600/20">
        Open Dashboard <ArrowRight size={16}/>
      </button>
    </main>
  );

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-900 to-blue-950 flex items-center justify-center px-6">
      <div className="bg-white rounded-3xl shadow-2xl p-10 w-full max-w-md border border-slate-200">
        <div className="flex items-center gap-3 mb-6"><ShieldCheck size={36} className="text-blue-600" /><div><h2 className="text-2xl font-extrabold text-slate-900 leading-tight">TPO Admin Gateway</h2><p className="text-xs text-slate-400 font-medium">CampusBridge Placement Intelligence Hub · National Gateway</p></div></div>
        <div className="space-y-3 mb-6"><input type="email" placeholder="Institutional Email" value={id} onChange={e=>setId(e.target.value)} className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 focus:outline-none focus:ring-2 focus:ring-blue-500/20 text-slate-900" /><input type="password" placeholder="Password" value={pass} onChange={e=>setPass(e.target.value)} onKeyDown={e=>e.key==='Enter'&&submit()} className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 focus:outline-none focus:ring-2 focus:ring-blue-500/20 text-slate-900" /></div>
        <button onClick={submit} className="w-full py-3.5 rounded-full bg-blue-600 text-white font-extrabold shadow-lg shadow-blue-600/20 hover:bg-blue-700 transition">Sign In</button>
        <p className="text-[11px] text-slate-400 mt-4 text-center">TPO Login: tpoaits / tpo123</p>
      </div>
    </main>
  );
}
