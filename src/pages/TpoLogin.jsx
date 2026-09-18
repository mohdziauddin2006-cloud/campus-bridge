import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldCheck, ArrowRight, AlertCircle } from 'lucide-react';

export default function TpoLogin() {
  const navigate = useNavigate();
  const [id, setId] = useState('');
  const [pass, setPass] = useState('');
  const [error, setError] = useState('');

  const submit = () => {
    setError('');
    if (!id.trim() || !pass.trim()) {
      setError('Please enter both email and password.');
      return;
    }
    if (id.trim().toLowerCase() === 'tpoaits' && pass.trim() === 'tpo123') {
      localStorage.setItem('tpo_auth', 'true');
      navigate('/tpo-dashboard');
    } else {
      setError('Invalid credentials. Use tpoaits / tpo123.');
    }
  };

  useEffect(() => {
    if (localStorage.getItem('tpo_auth') === 'true') navigate('/tpo-dashboard');
  }, [navigate]);

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-900 to-blue-950 flex items-center justify-center px-6">
      <div className="bg-white rounded-3xl shadow-2xl p-10 w-full max-w-md border border-slate-200">
        <div className="flex items-center gap-3 mb-6">
          <ShieldCheck size={32} className="text-blue-600" />
          <h2 className="text-2xl font-extrabold text-slate-900">TPO Admin Gateway</h2>
        </div>
        {error && (
          <div className="mb-4 p-3 bg-rose-50 border border-rose-200 rounded-xl flex items-center gap-2 text-rose-700 text-sm font-semibold">
            <AlertCircle size={16} /> {error}
          </div>
        )}
        <input
          type="email"
          placeholder="Institutional Email (tpoaits)"
          value={id}
          onChange={e => setId(e.target.value)}
          className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 mb-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20"
        />
        <input
          type="password"
          placeholder="Password (tpo123)"
          value={pass}
          onChange={e => setPass(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && submit()}
          className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 mb-4 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20"
        />
        <button
          onClick={submit}
          className="w-full py-3.5 rounded-full bg-blue-600 text-white font-extrabold shadow-lg hover:bg-blue-700 transition flex items-center justify-center gap-2"
        >
          Sign In <ArrowRight size={18} />
        </button>
      </div>
    </main>
  );
}
