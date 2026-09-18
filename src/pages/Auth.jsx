import { useState } from 'react';
import { ShieldCheck, GraduationCap, Building2, UserPlus, CheckCircle, AlertTriangle, Send, Briefcase, Globe, Clock, Filter, Search, Building } from 'lucide-react';
import { supabase } from '../lib/supabase';

export default function Auth({ onAuth, initialMode = 'student' }) {
  const [mode, setMode] = useState(initialMode);
  const [tab, setTab] = useState('signin');
  const [id, setId] = useState('tpoaits');
  const [pass, setPass] = useState('tpo123');
  const [email, setEmail] = useState('');
  const [hallTicket, setHallTicket] = useState('');
  const [createPass, setCreatePass] = useState('');
  const [rePass, setRePass] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [toast, setToast] = useState('');
  const [step, setStep] = useState(1);
  const [college, setCollege] = useState('');
  const [hub, setHub] = useState('Pan-India');
  const [workMode, setWorkMode] = useState('All Modes');
  const [cgpa, setCgpa] = useState('');
  const [branch, setBranch] = useState('CSE');
  const [gradYear, setGradYear] = useState('2026');
  const [github, setGithub] = useState('');
  const [linkedin, setLinkedin] = useState('');
  const [portfolio, setPortfolio] = useState('');
  const [skills, setSkills] = useState('');
  const [resumeText, setResumeText] = useState('');

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
        if (id.trim().toLowerCase() === 'tpoaits') {
          await onAuth?.({ mode, email: 'tpoaits' });
          setLoading(false); return;
        }
        setError('Incorrect TPO credentials'); setLoading(false); return;
      }
      const approved = JSON.parse(localStorage.getItem('approvedStudents') || '[]');
      const match = approved.find(s => s.email === emailLogin || s.hallTicket === id.trim());
      if (!match && isStudent) {
        const { error: authErr } = await supabase.auth.signInWithPassword({ email: emailLogin, password: passwordLogin });
        if (authErr) { setError(authErr.message || 'Login failed'); setLoading(false); return; }
      }
      await onAuth?.({ mode, email: emailLogin });
    } catch (ex) { setError('Unexpected error'); }
    setLoading(false);
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center px-6">
      <div className="bg-white/90 backdrop-blur-md rounded-3xl shadow-2xl shadow-blue-900/10 p-10 w-full max-w-2xl border border-slate-200/60">
        <div className="flex items-center gap-3 mb-6">
          <ShieldCheck size={36} className="text-blue-600" />
          <div>
            <h2 className="text-2xl font-extrabold text-slate-900 leading-tight">CampusBridge — National University Placement & Corporate Gateway</h2>
            <p className="text-xs text-slate-500 font-medium">Universal institutional placement · Clean SaaS architecture</p>
          </div>
        </div>
        <div className="flex gap-2 mb-6">
          <button onClick={() => { setMode('student'); setTab('signin'); setStep(1); }} className={`flex-1 py-2.5 rounded-xl text-sm font-bold transition shadow-sm border ${mode==='student'?'bg-blue-600 text-white border-blue-600 shadow-blue-600/20':'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'}`}><GraduationCap size={16} className="inline mr-1.5"/> Student</button>
          <button onClick={() => { setMode('tpo'); setTab('signin'); }} className={`flex-1 py-2.5 rounded-xl text-sm font-bold transition shadow-sm border ${mode==='tpo'?'bg-blue-600 text-white border-blue-600 shadow-blue-600/20':'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'}`}><Building2 size={16} className="inline mr-1.5"/> TPO</button>
        </div>
        <div className="flex gap-1 mb-6 bg-slate-100 rounded-xl p-1">
          <button onClick={() => setTab('signin')} className={`flex-1 py-2 rounded-lg text-sm font-bold transition ${tab==='signin'?'bg-white text-blue-600 shadow-sm border border-slate-200':'text-slate-500 hover:text-slate-700'}`}>Sign In</button>
          {isStudent && <button onClick={() => { setTab('signup'); setStep(1); }} className={`flex-1 py-2 rounded-lg text-sm font-bold transition ${tab==='signup'?'bg-white text-blue-600 shadow-sm border border-slate-200':'text-slate-500 hover:text-slate-700'}`}>Sign Up</button>}
        </div>
        {tab === 'signup' && isStudent ? (
          <div className="space-y-5">
            <div className="text-xs font-bold text-blue-700 mb-2">Step {step} / 4 — Institutional Onboarding</div>
            {step === 1 && (
              <div className="space-y-3">
                <label className="text-xs font-bold text-slate-500 block">College / University</label>
                <input type="text" value={college} onChange={e=>setCollege(e.target.value)} placeholder="Type any Indian institution (e.g. IIT Delhi)" className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20" />
                <label className="text-xs font-bold text-slate-500 block">Target Career Hub</label>
                <select value={hub} onChange={e=>setHub(e.target.value)} className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20">
                  {["Pan-India","Bengaluru","Hyderabad","Pune","Delhi-NCR","Mumbai","Chennai"].map(h => <option key={h}>{h}</option>)}
                </select>
                <label className="text-xs font-bold text-slate-500 block">Preferred Work Mode</label>
                <select value={workMode} onChange={e=>setWorkMode(e.target.value)} className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20">
                  {["All Modes","Remote / Online","On-site / Offline","Hybrid"].map(w => <option key={w}>{w}</option>)}
                </select>
                <button onClick={() => setStep(2)} className="w-full py-3 rounded-full bg-blue-600 text-white font-extrabold hover:bg-blue-700 transition">Continue</button>
              </div>
            )}
            {step === 2 && (
              <div className="space-y-3">
                <label className="text-xs font-bold text-slate-500 block">CGPA</label>
                <input type="text" value={cgpa} onChange={e=>setCgpa(e.target.value)} placeholder="e.g. 8.5" className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-sm" />
                <label className="text-xs font-bold text-slate-500 block">Branch</label>
                <select value={branch} onChange={e=>setBranch(e.target.value)} className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-sm">
                  {["CSE","ECE","MECH","CIVIL","IT","Biotech","Chemical","Others"].map(b => <option key={b}>{b}</option>)}
                </select>
                <label className="text-xs font-bold text-slate-500 block">Graduation Year</label>
                <select value={gradYear} onChange={e=>setGradYear(e.target.value)} className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-sm">
                  {["2025","2026","2027","2028"].map(y => <option key={y}>{y}</option>)}
                </select>
                <button onClick={() => setStep(3)} className="w-full py-3 rounded-full bg-blue-600 text-white font-extrabold hover:bg-blue-700 transition">Continue</button>
              </div>
            )}
            {step === 3 && (
              <div className="space-y-3">
                <label className="text-xs font-bold text-slate-500 block">GitHub URL</label>
                <input type="url" value={github} onChange={e=>setGithub(e.target.value)} placeholder="https://github.com/username" className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-sm" />
                <label className="text-xs font-bold text-slate-500 block">LinkedIn URL</label>
                <input type="url" value={linkedin} onChange={e=>setLinkedin(e.target.value)} placeholder="https://linkedin.com/in/name" className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-sm" />
                <label className="text-xs font-bold text-slate-500 block">Portfolio URL</label>
                <input type="url" value={portfolio} onChange={e=>setPortfolio(e.target.value)} placeholder="https://portfolio.dev" className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-sm" />
                <button onClick={() => setStep(4)} className="w-full py-3 rounded-full bg-blue-600 text-white font-extrabold hover:bg-blue-700 transition">Continue</button>
              </div>
            )}
            {step === 4 && (
              <div className="space-y-3">
                <label className="text-xs font-bold text-slate-500 block">Technical Skills Tags</label>
                <input type="text" value={skills} onChange={e=>setSkills(e.target.value)} placeholder="React, Python, AWS, TypeScript" className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-sm" />
                <label className="text-xs font-bold text-slate-500 block">Full Resume (for ATS scoring)</label>
                <textarea rows={4} value={resumeText} onChange={e=>setResumeText(e.target.value)} placeholder="Paste full resume text for ATS analysis..." className="w-full p-3 rounded-xl bg-slate-50 border border-slate-200 text-sm" />
                <button onClick={() => { setTab('signin'); setStep(1); setToast('Profile registered — please sign in'); }} className="w-full py-3 rounded-full bg-blue-600 text-white font-extrabold hover:bg-blue-700 transition">Complete Profile & Sign In</button>
              </div>
            )}
          </div>
        ) : tab === 'signup' && !isStudent ? (
          <form onSubmit={handleSignUp} className="space-y-3">
            <input type="email" value={email} onChange={e=>setEmail(e.target.value)} placeholder="Institutional Email" className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-sm" />
            <input type="text" value={hallTicket} onChange={e=>setHallTicket(e.target.value)} placeholder="Institution Code" className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-sm" />
            <input type="password" value={createPass} onChange={e=>setCreatePass(e.target.value)} placeholder="Create Password" className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-sm" />
            <input type="password" value={rePass} onChange={e=>setRePass(e.target.value)} placeholder="Confirm Password" className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-sm" />
            {error && <div className="flex items-center gap-2 text-xs text-rose-600 font-bold"><AlertTriangle size={14}/> {error}</div>}
            <button type="submit" className="w-full py-3 rounded-full bg-blue-600 text-white font-extrabold hover:bg-blue-700 transition">Submit Request</button>
          </form>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-3">
            <div>
              <label className="text-xs font-bold text-slate-500 mb-1 block">{isStudent ? 'Hall Ticket / ID' : 'Institutional Email'}</label>
              <input type="text" value={id} onChange={e=>setId(e.target.value)} placeholder={isStudent ? 'e.g. 21BRS1234' : 'tpoaits'} className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20" />
            </div>
            <div>
              <label className="text-xs font-bold text-slate-500 mb-1 block">Password</label>
              <input type="password" value={pass} onChange={e=>setPass(e.target.value)} placeholder={isStudent ? 'Password' : 'tpo123'} className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20" />
            </div>
            {isStudent && (
              <div className="text-[11px] text-slate-400">Internally: <strong className="text-blue-600">{id.trim() ? `${id.trim()}@campus.bridge` : '—'}</strong></div>
            )}
            {error && <div className="flex items-center gap-2 text-xs text-rose-600 font-bold"><AlertTriangle size={14}/> {error}</div>}
            <button disabled={loading} type="submit" className="w-full py-3 rounded-full bg-blue-600 text-white font-extrabold hover:bg-blue-700 transition disabled:opacity-50">{loading ? 'Signing in…' : 'Sign In'}</button>
          </form>
        )}
        <p className="text-[11px] text-slate-400 text-center mt-4">CampusBridge — Universal Placement & Corporate Gateway · Glassmorphic SaaS Design</p>
      </div>
    </main>
  );
}
