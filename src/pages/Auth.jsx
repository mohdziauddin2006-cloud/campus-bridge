import { useState } from 'react';
import { ShieldCheck, GraduationCap, Building2 } from 'lucide-react';
import { supabase } from '../lib/supabase';

export default function Auth({ onAuth }) {
  const [mode, setMode] = useState('student');
  const [id, setId] = useState('');
  const [pass, setPass] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const studentEmail = id.trim() ? `${id.trim()}@campus.bridge` : '';
  const isStudent = mode === 'student';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const email = isStudent ? studentEmail : id.trim();
      if (!email || !pass) { setError('Fill both fields'); setLoading(false); return; }
      const { error: authErr } = await supabase.auth.signInWithPassword({ email, password: pass });
      if (authErr) { setError(authErr.message || 'Login failed'); setLoading(false); return; }
      await onAuth?.({ mode, email });
    } catch (ex) { setError('Unexpected error'); }
    setLoading(false);
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-[#1b1e23] to-[#2a2d38] flex items-center justify-center px-6">
      <div className="bg-[#23262b] rounded-3xl shadow-2xl p-10 w-full max-w-md border border-[#32353d]">
        <div className="flex items-center gap-3 mb-2">
          <ShieldCheck size={36} className="text-emerald-400" />
          <div>
            <h2 className="text-2xl font-extrabold text-[#e2e8f0] leading-tight">Campus Bridge Auth</h2>
            <p className="text-xs text-[#8892b0] font-medium">SIH26044 · Publishable-key only</p>
          </div>
        </div>

        <div className="flex gap-2 mb-6">
          <button onClick={() => setMode('student')} className={`flex-1 py-2 rounded-xl text-sm font-bold transition ${mode==='student'?'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30':'bg-[#1b1e23] text-[#8892b0] border border-[#32353d]'}`}><GraduationCap size={16} className="inline mr-1"/> Student</button>
          <button onClick={() => setMode('tpo')} className={`flex-1 py-2 rounded-xl text-sm font-bold transition ${mode==='tpo'?'bg-blue-500/20 text-blue-300 border border-blue-500/30':'bg-[#1b1e23] text-[#8892b0] border border-[#32353d]'}`}><Building2 size={16} className="inline mr-1"/> TPO</button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3 mb-4">
          <div>
            <label className="text-xs font-bold text-[#8892b0] mb-1 block">{isStudent ? 'Hall Ticket Number' : 'Institutional Email'}</label>
            <input type="text" value={id} onChange={e=>setId(e.target.value)} placeholder={isStudent ? 'e.g. 21BRS1234' : 'tpo@college.ac.in'} className="w-full px-4 py-3 rounded-xl bg-[#1b1e23] border border-[#32353d] text-[#e2e8f0] text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/30" />
          </div>
          <div>
            <label className="text-xs font-bold text-[#8892b0] mb-1 block">Password</label>
            <input type="password" value={pass} onChange={e=>setPass(e.target.value)} placeholder="Password" className="w-full px-4 py-3 rounded-xl bg-[#1b1e23] border border-[#32353d] text-[#e2e8f0] text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/30" />
          </div>
          {isStudent && (
            <div className="text-[11px] text-[#8892b0]">Internally formatted as: <strong className="text-emerald-300">{id.trim() ? `${id.trim()}@campus.bridge` : '—'}</strong></div>
          )}
          {error && <div className="text-xs text-rose-400 font-bold">{error}</div>}
          <button disabled={loading} type="submit" className="w-full py-3 rounded-full bg-emerald-500 text-[#1b1e23] font-extrabold shadow-lg shadow-emerald-500/20 hover:bg-emerald-400 transition disabled:opacity-50">{loading ? 'Signing in…' : 'Sign In'}</button>
        </form>
        <p className="text-[11px] text-[#5a6077] text-center">Publishable key only • No service_role</p>
      </div>
    </main>
  );
}
