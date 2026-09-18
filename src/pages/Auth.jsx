import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldCheck, AlertTriangle } from 'lucide-react';

export default function Auth() {
  const navigate = useNavigate();
  const [id, setId] = useState('tpoaits');
  const [pass, setPass] = useState('tpo123');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    if (id.trim().toLowerCase() === 'tpoaits' && pass === 'tpo123') {
      setLoading(false);
      navigate('/tpo-dashboard');
      return;
    }
    setError('Incorrect TPO credentials — use tpoaits / tpo123');
    setLoading(false);
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center px-6">
      <div className="bg-white/90 backdrop-blur-md rounded-3xl shadow-2xl shadow-blue-900/10 p-10 w-full max-w-md border border-slate-200/60">
        <div className="flex items-center gap-3 mb-6">
          <ShieldCheck size={36} className="text-blue-600" />
          <div>
            <h2 className="text-2xl font-extrabold text-slate-900 leading-tight">TPO Officer Sign In</h2>
            <p className="text-xs text-slate-500 font-medium">CampusBridge — National Placement Gateway</p>
          </div>
        </div>
        <p className="text-xs text-slate-400 mb-4 font-medium">Secure verification portal. Only authorized TPO officers may access the dispatch queue.</p>
        <form onSubmit={handleSubmit} className="space-y-3">
          <div>
            <label className="text-xs font-bold text-slate-500 mb-1 block">TPO ID</label>
            <input type="text" value={id} onChange={e => setId(e.target.value)} placeholder="tpoaits" className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20" />
          </div>
          <div>
            <label className="text-xs font-bold text-slate-500 mb-1 block">Password</label>
            <input type="password" value={pass} onChange={e => setPass(e.target.value)} placeholder="tpo123" className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20" />
          </div>
          {error && <div className="flex items-center gap-2 text-xs text-rose-600 font-bold"><AlertTriangle size={14}/> {error}</div>}
          <button disabled={loading} type="submit" className="w-full py-3 rounded-full bg-blue-600 text-white font-extrabold hover:bg-blue-700 transition disabled:opacity-50">{loading ? 'Verifying…' : 'Sign In'}</button>
        </form>
        <p className="text-[11px] text-slate-400 text-center mt-4">TPO Login: tpoaits / tpo123 · CampusBridge National Gateway</p>
      </div>
    </main>
  );
}
