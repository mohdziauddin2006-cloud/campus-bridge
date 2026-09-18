import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldCheck, ArrowRight } from 'lucide-react';

export default function TpoLogin() {
  const navigate = useNavigate();
  const [id, setId] = useState('');
  const [pass, setPass] = useState('');
  const submit = () => {
    if (id.trim().toLowerCase() === 'tpoaits') {
      localStorage.setItem('tpo_auth', 'true');
      navigate('/tpo-dashboard');
    }
  };
  useEffect(() => {
    if (localStorage.getItem('tpo_auth') === 'true') navigate('/tpo-dashboard');
  }, [navigate]);
  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-900 to-blue-950 flex items-center justify-center px-6">
      <div className="bg-white rounded-3xl shadow-2xl p-10 w-full max-w-md border border-slate-200">
        <h2 className="text-2xl font-extrabold text-slate-900 mb-4">TPO Admin Gateway</h2>
        <input type="email" placeholder="Institutional Email" value={id} onChange={e=>setId(e.target.value)} className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 mb-3" />
        <input type="password" placeholder="Password" value={pass} onChange={e=>setPass(e.target.value)} onKeyDown={e=>e.key==='Enter'&&submit()} className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 mb-4" />
        <button onClick={submit} className="w-full py-3.5 rounded-full bg-blue-600 text-white font-extrabold shadow-lg hover:bg-blue-700 transition">Sign In</button>
      </div>
    </main>
  );
}
