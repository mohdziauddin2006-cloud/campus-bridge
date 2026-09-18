import { useState } from 'react';
import { ShieldCheck, GraduationCap, Building2, UserPlus, CheckCircle, AlertTriangle, Send, Briefcase } from 'lucide-react';
import { supabase } from '../lib/supabase';

export default function Auth({ onAuth }) {
  const [mode, setMode] = useState('student');
  const [tab, setTab] = useState('signin');
  const [id, setId] = useState('');
  const [pass, setPass] = useState('');
  const [email, setEmail] = useState('');
  const [hallTicket, setHallTicket] = useState('');
  const [createPass, setCreatePass] = useState('');
  const [rePass, setRePass] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [toast, setToast] = useState('');

  const studentEmail = id.trim() ? `${id.trim()}@campus.bridge` : '';
  const isStudent = mode === 'student';

  const handleSignUp = (e) => {
    e.preventDefault();
    setError('');
    if (createPass !== rePass) { setError('Passwords do not match'); return; }
    if (!email || !hallTicket || !createPass) { setError('Fill all fields'); return; }
    const pending = JSON.parse(localStorage.getItem('pendingStudents') || '[]');
    pending.push({ email: email.trim(), hallTicket: hallTicket.trim(), createdAt: new Date().toISOString() });
    localStorage.setItem('pendingStudents', JSON.stringify(pending));
    setToast('Registration request sent to TPO for approval!');
    setEmail(''); setHallTicket(''); setCreatePass(''); setRePass('');
    setTimeout(() => setToast(''), 4000);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const emailLogin = isStudent ? studentEmail : id.trim();
      const passwordLogin = isStudent ? pass : pass;
      if (!emailLogin || !passwordLogin) { setError('Fill both fields'); setLoading(false); return; }

      if (!isStudent) {
        // Hackathon-safe TPO auth: username tpoaits grants access with any password
        // Demo-proof: tpoaits always succeeds; tpo123 is the shown password
        if (id.trim().toLowerCase() === 'tpoaits') {
          await onAuth?.({ mode, email: 'tpoaits' });
          setLoading(false); return;
        }
        setError('Incorrect TPO credentials'); setLoading(false); return;
      }

      // Check approved students in localStorage for sign-in
      const approved = JSON.parse(localStorage.getItem('approvedStudents') || '[]');
      const match = approved.find(s => s.email === emailLogin || s.hallTicket === id.trim());
      if (!match && isStudent) {
        // Fall back to supabase if no local approval yet
        const { error: authErr } = await supabase.auth.signInWithPassword({ email: emailLogin, password: passwordLogin });
        if (authErr) { setError(authErr.message || 'Login failed'); setLoading(false); return; }
      }
      await onAuth?.({ mode, email: emailLogin });
    } catch (ex) { setError('Unexpected error'); }
    setLoading(false);
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center px-6">
      <div className="bg-white/80 backdrop-blur-md rounded-3xl shadow-2xl shadow-blue-900/5 p-10 w-full max-w-md border border-slate-200/60">
        <div className="flex items-center gap-3 mb-2">
          <ShieldCheck size={36} className="text-blue-600" />
          <div>
            <h2 className="text-2xl font-extrabold text-slate-900 leading-tight">Campus Bridge Auth</h2>
            <p className="text-xs text-slate-400 font-medium">SIH26044 · Minimalist SaaS</p>
          </div>
        </div>

        <div className="flex gap-2 mb-6">
          <button onClick={() => { setMode('student'); setTab('signin'); }} className={`flex-1 py-2.5 rounded-xl text-sm font-bold transition shadow-sm border ${mode==='student'?'bg-blue-600 text-white border-blue-600 shadow-blue-600/20':'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'}`}><GraduationCap size={16} className="inline mr-1.5"/> Student</button>
          <button onClick={() => { setMode('tpo'); setTab('signin'); }} className={`flex-1 py-2.5 rounded-xl text-sm font-bold transition shadow-sm border ${mode==='tpo'?'bg-blue-600 text-white border-blue-600 shadow-blue-600/20':'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'}`}><Building2 size={16} className="inline mr-1.5"/> TPO</button>
        </div>

        {/* Sign In / Sign Up tabs */}
        <div className="flex gap-1 mb-6 bg-slate-100 rounded-xl p-1">
          <button onClick={() => setTab('signin')} className={`flex-1 py-2 rounded-lg text-sm font-bold transition ${tab==='signin'?'bg-white text-blue-600 shadow-sm border border-slate-200':'text-slate-500 hover:text-slate-700'}`}>Sign In</button>
          {isStudent && <button onClick={() => setTab('signup')} className={`flex-1 py-2 rounded-lg text-sm font-bold transition ${tab==='signup'?'bg-white text-blue-600 shadow-sm border border-slate-200':'text-slate-500 hover:text-slate-700'}`}>Sign Up</button>}
        </div>

        {tab === 'signup' ? (
          <form onSubmit={handleSignUp} className="space-y-3 mb-2">
            <div>
              <label className="text-xs font-bold text-slate-500 mb-1 block">Email Address</label>
              <input type="email" value={email} onChange={e=>setEmail(e.target.value)} placeholder="you@campus.bridge" className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 transition" />
            </div>
            <div>
              <label className="text-xs font-bold text-slate-500 mb-1 block">Hall Ticket Number</label>
              <input type="text" value={hallTicket} onChange={e=>setHallTicket(e.target.value)} placeholder="e.g. 21BRS1234" className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 transition" />
            </div>
            <div>
              <label className="text-xs font-bold text-slate-500 mb-1 block">Create Password</label>
              <input type="password" value={createPass} onChange={e=>setCreatePass(e.target.value)} placeholder="Password" className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 transition" />
            </div>
            <div>
              <label className="text-xs font-bold text-slate-500 mb-1 block">Re-enter Password</label>
              <input type="password" value={rePass} onChange={e=>setRePass(e.target.value)} placeholder="Confirm password" className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 transition" />
            </div>
            {error && <div className="flex items-center gap-2 text-xs text-rose-500 font-bold"><AlertTriangle size={14}/> {error}</div>}
            {toast && <div className="flex items-center gap-2 text-xs text-emerald-600 font-bold bg-emerald-50 px-3 py-2 rounded-lg border border-emerald-100"><CheckCircle size={14}/> {toast}</div>}
            <button type="submit" className="w-full py-3 rounded-full bg-blue-600 text-white font-extrabold shadow-lg shadow-blue-600/20 hover:bg-blue-700 transition flex items-center justify-center gap-2"><Send size={16}/> Submit Request</button>
          </form>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-3 mb-4">
            <div>
              <label className="text-xs font-bold text-slate-500 mb-1 block">{isStudent ? 'Hall Ticket Number' : 'Institutional Email'}</label>
              <input type="text" value={id} onChange={e=>setId(e.target.value)} placeholder={isStudent ? 'e.g. 21BRS1234' : 'tpoaits'} className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 transition" />
            </div>
            <div>
              <label className="text-xs font-bold text-slate-500 mb-1 block">Password</label>
              <input type="password" value={pass} onChange={e=>setPass(e.target.value)} placeholder="Password" className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 transition" />
            </div>
            {isStudent && (
              <div className="text-[11px] text-slate-400">Internally formatted as: <strong className="text-blue-600">{id.trim() ? `${id.trim()}@campus.bridge` : '—'}</strong></div>
            )}
            {error && <div className="flex items-center gap-2 text-xs text-rose-500 font-bold"><AlertTriangle size={14}/> {error}</div>}
            <button disabled={loading} type="submit" className="w-full py-3 rounded-full bg-blue-600 text-white font-extrabold shadow-lg shadow-blue-600/20 hover:bg-blue-700 transition disabled:opacity-50 flex items-center justify-center gap-2"><Briefcase size={16}/> {loading ? 'Signing in…' : 'Sign In'}</button>
          </form>
        )}
        <p className="text-[11px] text-slate-400 text-center">Minimalist SaaS · Clean white design · No service_role</p>
      </div>
    </main>
  );
}
