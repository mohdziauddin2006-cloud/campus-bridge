import { useState, useEffect, useMemo } from 'react';
import {
  Search, Filter, GraduationCap, Build, Users, Sparkles,
  CheckCircle2, Clock, MapPin, DollarSign, Send, X,
  BarChart3, TrendingUp, Shield, ArrowRight, Menu,
  Briefcase, ChevronDown
} from 'lucide-react';

/* ─────────── Design Tokens ─────────── */
const BG = '#1e2126';
const DARK = '#15171b';
const LIGHT = '#272b31';
const CARD_SHADOW = '8px 8px 16px #15171b, -8px -8px 16px #272b31';
const INSET_SHADOW = 'inset 4px 4px 8px #15171b, inset -4px -4px 8px #272b31';
const BTN_SHADOW = '5px 5px 10px #15171b, -5px -5px 10px #272b31';
const BTN_ACTIVE = 'inset 3px 3px 6px #15171b, inset -3px -3px 6px #272b31';
const ACCENT = '#10b981';

/* ─────────── LocalStorage ─────────── */
const LS_KEY = 'si_h_internships';
const APP_KEY = 'si_h_applications';

function seedData() {
  return [
    { id: 101, title: 'AI/ML Research Intern', company: 'NeuroForge AI', domain: 'AI/ML', location: 'Bangalore', stipend: '₹ 22,000/mo', duration: '6 months', skills: ['Python','PyTorch','NLP'], desc: 'Work on transformer-based language models and data pipelines.' },
    { id: 102, title: 'Full-Stack Engineer', company: 'Orbit Labs', domain: 'Full-Stack', location: 'Hyderabad', stipend: '₹ 28,000/mo', duration: '4 months', skills: ['React','Node.js','PostgreSQL'], desc: 'Build product-facing web applications from UI to DB.' },
    { id: 103, title: 'VLSI / Embedded Intern', company: 'SiliconCore', domain: 'Embedded', location: 'Pune', stipend: '₹ 18,000/mo', duration: '12 months', skills: ['Verilog','FPGA','C'], desc: 'Design digital circuits and embedded firmware.' },
    { id: 104, title: 'Data Analytics Intern', company: 'Meridian AI', domain: 'Data', location: 'Mumbai', stipend: '₹ 20,000/mo', duration: '6 months', skills: ['SQL','Python','Tableau'], desc: 'Analyze business data and build dashboards.' },
    { id: 105, title: 'Cloud DevOps Intern', company: 'Vertex Systems', domain: 'DevOps', location: 'Delhi NCR', stipend: '₹ 25,000/mo', duration: '6 months', skills: ['AWS','Docker','Terraform'], desc: 'Manage CI/CD pipelines and cloud infrastructure.' },
    { id: 106, title: 'Cybersecurity Analyst', company: 'ShieldNet', domain: 'Security', location: 'Remote', stipend: '₹ 15,000/mo', duration: '6 months', skills: ['Wireshark','Linux','SIEM'], desc: 'Monitor threats, analyze logs, and improve security posture.' },
  ];
}

function loadInternships() {
  try {
    const raw = localStorage.getItem(LS_KEY);
    if (raw) return JSON.parse(raw);
  } catch {}
  const s = seedData();
  localStorage.setItem(LS_KEY, JSON.stringify(s));
  return s;
}
function saveInternships(arr) { try { localStorage.setItem(LS_KEY, JSON.stringify(arr)); } catch {} }
function loadApps() { try { return JSON.parse(localStorage.getItem(APP_KEY) || '[]'); } catch { return []; } }
function saveApps(arr) { try { localStorage.setItem(APP_KEY, JSON.stringify(arr)); } catch {} }

/* ─────────── Component ─────────── */
export default function App() {
  const [nav, setNav] = useState('Explore');
  const [search, setSearch] = useState('');
  const [filterTag, setFilterTag] = useState('All');
  const [internships, setInternships] = useState(loadInternships);
  const [apps, setApps] = useState(loadApps);
  const [toast, setToast] = useState(null);
  const [applyOpen, setApplyOpen] = useState(false);
  const [applyItem, setApplyItem] = useState(null);
  const [form, setForm] = useState({ name: '', college: '', email: '', skills: '', link: '' });
  const [matchTarget, setMatchTarget] = useState('Full-Stack');
  const [userSkillsText, setUserSkillsText] = useState('');
  const [mobileNav, setMobileNav] = useState(false);
  const [postForm, setPostForm] = useState({ title: '', company: '', domain: '', location: '', stipend: '', duration: '', skills: '', desc: '' });

  useEffect(() => saveInternships(internships), [internships]);
  useEffect(() => saveApps(apps), [apps]);

  function toastMsg(msg) { setToast(msg); setTimeout(() => setToast(null), 2500); }

  /* Filter */
  const filtered = useMemo(() => {
    return internships.filter(i => {
      const q = search.toLowerCase();
      const okSearch = !q || i.title.toLowerCase().includes(q) || i.company.toLowerCase().includes(q) || i.domain.toLowerCase().includes(q);
      const okTag = filterTag === 'All' || (filterTag === 'Remote' && i.location === 'Remote') || (filterTag === 'On-Site' && i.location !== 'Remote') || (filterTag === 'Stipend > ₹15k' && parseInt(i.stipend.replace(/[^0-9]/g, '')) > 15000);
      return okSearch && okTag;
    });
  }, [internships, search, filterTag]);

  /* Apply */
  function openApply(i) { setApplyItem(i); setForm({ name: '', college: '', email: '', skills: '', link: '' }); setApplyOpen(true); }
  function submitApply() {
    if (!form.name.trim() || !form.email.trim()) return;
    const newApp = { id: Date.now(), internshipId: applyItem.id, title: applyItem.title, company: applyItem.company, name: form.name.trim(), college: form.college.trim(), email: form.email.trim(), skills: form.skills.trim(), link: form.link.trim(), status: 'Submitted', date: new Date().toISOString() };
    setApps(prev => [newApp, ...prev]);
    setApplyOpen(false); setForm({ name: '', college: '', email: '', skills: '', link: '' });
    toastMsg('Application Submitted Successfully');
  }

  /* Withdraw */
  function withdrawApp(id) { setApps(prev => prev.filter(a => a.id !== id)); toastMsg('Application Withdrawn'); }

  /* Post */
  function submitPost() {
    const s = postForm.stipend.replace(/[^0-9]/g, '');
    if (!postForm.title.trim() || !postForm.company.trim() || !postForm.stipend.trim()) return;
    const newItem = { id: Date.now(), title: postForm.title.trim(), company: postForm.company.trim(), domain: postForm.domain || 'Other', location: postForm.location || 'Remote', stipend: postForm.stipend.trim(), duration: postForm.duration || '3 months', skills: postForm.skills.split(',').map(x => x.trim()).filter(Boolean), desc: postForm.desc || '', created: new Date().toISOString() };
    setInternships(prev => [newItem, ...prev]);
    setPostForm({ title: '', company: '', domain: '', location: '', stipend: '', duration: '', skills: '', desc: '' });
    setNav('Explore'); toastMsg('New Internship Published');
  }

  /* Skill matcher calc */
  const matchData = useMemo(() => {
    const target = (internships.find(i => i.domain === matchTarget) || internships[0]);
    const user = userSkillsText.toLowerCase().split(/[,+\s]+/).map(s => s.trim()).filter(Boolean);
    const req = target.skills || [];
    const matched = req.filter(r => user.some(s => r.toLowerCase().includes(s) || s.includes(r.toLowerCase())));
    const missing = req.filter(r => !matched.includes(r));
    const score = Math.round((matched.length / Math.max(req.length, 1)) * 100);
    return { target, req, matched, missing, score, user };
  }, [internships, matchTarget, userSkillsText]);

  /* Nav config */
  const navItems = [
    { key: 'Explore', label: 'Explore Internships', desc: 'Search, filter, apply' },
    { key: 'Match', label: 'Skill Gap Matcher', desc: 'Compare skills to roles' },
    { key: 'Applications', label: 'My Applications', desc: 'Track your submissions' },
    { key: 'Post', label: 'Employer Portal', desc: 'Post new openings' },
  ];

  const stats = useMemo(() => {
    const totalApps = apps.length;
    const appliedIds = new Set(apps.map(a => a.internshipId));
    const totalOpen = internships.length;
    return { totalOpen, totalApps, matchIndex: matchData.score };
  }, [apps, internships, matchData.score]);

  return (
    <div className="min-h-screen bg-[#1e2126] text-[#e2e8f0] font-sans selection:accent-emerald-500">
      {/* Subtle radial glow */}
      <div className="fixed top-[-10%] left-[-10%] w-[60vw] h-[60vw] rounded-full bg-emerald-500/10 blur-[120px] pointer-events-none z-0" />
      <div className="fixed bottom-[-10%] right-[-10%] w-[60vw] h-[60vw] rounded-full bg-violet-500/10 blur-[120px] pointer-events-none z-0" />

      {/* Toast */}
      {toast && (
        <div className="fixed top-6 right-6 z-[60] px-5 py-3 rounded-2xl bg-gradient-to-r from-emerald-600 to-violet-600 text-white font-bold shadow-2xl shadow-emerald-900/30 flex items-center gap-2 animate-fade-up" style={{ animation: 'fadeUp 0.3s ease-out' }}>
          <CheckCircle2 size={18} /> {toast}
        </div>
      )}

      {/* Layout */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 py-8 flex gap-6">
        {/* Sidebar */}
        <aside className="hidden lg:block w-64 shrink-0 sticky top-8 h-fit">
          <div className="rounded-[1.25rem] p-6" style={{ background: BG, boxShadow: CARD_SHADOW }}>
            <div className="flex items-center gap-3 mb-6">
              <div className="h-10 w-10 rounded-xl flex items-center justify-center" style={{ boxShadow: BTN_SHADOW, background: DARK }}>
                <GraduationCap size={20} style={{ color: ACCENT }} />
              </div>
              <div>
                <div className="text-sm font-extrabold tracking-tight">SIH26044</div>
                <div className="text-[10px] text-[#94a3b8] font-medium">Academia · Industry</div>
              </div>
            </div>
            <nav className="space-y-1">
              {navItems.map(n => (
                <button key={n.key} onClick={() => setNav(n.key)} className={`w-full text-left px-3 py-2.5 rounded-xl text-sm font-medium transition flex items-center gap-2 ${nav === n.key ? 'text-[#10b981]' : 'text-[#94a3b8] hover:text-[#e2e8f0]'}`} style={nav === n.key ? { boxShadow: INSET_SHADOW, background: DARK } : {}}>
                  <span className={`w-1.5 h-1.5 rounded-full ${nav === n.key ? 'bg-emerald-400 shadow-[0_0_6px_#10b981]' : 'bg-[#334155]'}`} />
                  {n.label}
                </button>
              ))}
            </nav>
          </div>
        </aside>

        {/* Main */}
        <main className="flex-1 min-w-0">
          {/* Stats */}
          <div className="grid sm:grid-cols-3 gap-4 mb-8">
            {[
              { label: 'Active Openings', value: stats.totalOpen, icon: Briefcase, sub: 'Live listings' },
              { label: 'My Applications', value: stats.totalApps, icon: Send, sub: 'Submitted' },
              { label: 'Match Index', value: `${stats.matchIndex}%`, icon: TrendingUp, sub: 'Current target' },
            ].map(s => (
              <div key={s.label} className="rounded-[1.25rem] p-5 relative overflow-hidden" style={{ background: BG, boxShadow: CARD_SHADOW }}>
                <div className="flex items-start justify-between mb-3">
                  <h3 className="text-xs font-bold text-[#94a3b8] uppercase tracking-wider">{s.label}</h3>
                  <div className="h-8 w-8 rounded-xl flex items-center justify-center" style={{ boxShadow: INSET_SHADOW, background: DARK }}>
                    <s.icon size={16} style={{ color: ACCENT }} />
                  </div>
                </div>
                <div className="text-3xl font-extrabold text-[#e2e8f0] tracking-tight">{s.value}</div>
                <div className="text-xs text-[#94a3b8] mt-1">{s.sub}</div>
              </div>
            ))}
          </div>

          {/* Mobile nav tabs */}
          <div className="lg:hidden mb-6 flex gap-2 overflow-x-auto pb-2">
            {navItems.map(n => (
              <button key={n.key} onClick={() => setNav(n.key)} className={`px-4 py-2 rounded-xl text-sm font-bold whitespace-nowrap transition ${nav === n.key ? 'text-[#e2e8f0]' : 'text-[#94a3b8]'}`} style={nav === n.key ? { boxShadow: BTN_SHADOW, background: DARK } : { boxShadow: BTN_SHADOW, background: BG }}>{n.label}</button>
            ))}
          </div>

          {/* ─── View: Explore ─── */}
          {nav === 'Explore' && (
            <section className="space-y-6">
              <div className="flex flex-col sm:flex-row gap-3">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2" size={18} style={{ color: '#94a3b8' }} />
                  <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search roles, companies, domains..." style={{ background: BG, boxShadow: INSET_SHADOW }} className="w-full pl-10 pr-4 py-3 rounded-xl text-sm text-[#e2e8f0] placeholder:text-[#64748b] outline-none transition" />
                </div>
                <div className="flex gap-2 flex-wrap">
                  {['All','Remote','On-Site','Stipend > ₹15k'].map(tag => (
                    <button key={tag} onClick={() => setFilterTag(tag)} className={`px-3 py-2 rounded-xl text-xs font-bold transition ${filterTag === tag ? 'text-[#10b981]' : 'text-[#94a3b8]'}`} style={filterTag === tag ? { boxShadow: BTN_ACTIVE, background: DARK } : { boxShadow: BTN_SHADOW, background: BG }}>{tag}</button>
                  ))}
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-5">
                {filtered.map(i => (
                  <article key={i.id} className="rounded-[1.25rem] p-6 relative overflow-hidden transition hover:-translate-y-1 duration-300" style={{ background: BG, boxShadow: CARD_SHADOW }}>
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <div className="text-xs font-mono text-[#10b981] mb-0.5">{i.domain}</div>
                        <h3 className="text-xl font-extrabold leading-tight text-[#e2e8f0]">{i.title}</h3>
                      </div>
                      <div className="text-right">
                        <div className="text-lg font-extrabold text-[#e2e8f0]">{i.stipend}</div>
                        <div className="text-xs text-[#94a3b8]">{i.duration}</div>
                      </div>
                    </div>
                    <div className="text-sm font-semibold text-[#94a3b8] mb-3">{i.company}</div>
                    <p className="text-sm text-[#cbd5e1] leading-relaxed mb-4">{i.desc}</p>
                    <div className="flex flex-wrap gap-2 mb-4">
                      {i.skills.map(s => <span key={s} className="text-[11px] font-semibold px-2 py-0.5 rounded-md bg-[#15171b] text-[#94a3b8] border border-[#272b31]">{s}</span>)}
                    </div>
                    <div className="flex items-center gap-4 text-xs text-[#94a3b8] mb-5">
                      <span className="flex items-center gap-1"><MapPin size={12}/> {i.location}</span>
                      <span className="flex items-center gap-1"><Clock size={12}/> {i.duration}</span>
                    </div>
                    <button onClick={() => openApply(i)} className="w-full py-3 rounded-xl font-bold text-sm transition" style={{ background: BG, boxShadow: BTN_SHADOW, color: '#e2e8f0' }} onMouseDown={e => { e.currentTarget.style.boxShadow = BTN_ACTIVE; }} onMouseUp={e => { e.currentTarget.style.boxShadow = BTN_SHADOW; }}>
                      Apply Now
                    </button>
                  </article>
                ))}
                {filtered.length === 0 && <div className="col-span-full text-center text-[#94a3b8] py-10">No results found. Adjust filters or search.</div>}
              </div>
            </section>
          )}

          {/* ─── View: Skill Matcher ─── */}
          {nav === 'Match' && (
            <section className="space-y-6">
              <div className="rounded-[1.25rem] p-6" style={{ background: BG, boxShadow: CARD_SHADOW }}>
                <h2 className="text-xl font-extrabold mb-4">Skill Gap Matcher</h2>
                <div className="grid md:grid-cols-2 gap-4 mb-6">
                  <div>
                    <label className="text-xs font-bold text-[#94a3b8] block mb-2">Target Role</label>
                    <select value={matchTarget} onChange={e => setMatchTarget(e.target.value)} style={{ background: DARK, boxShadow: INSET_SHADOW }} className="w-full p-3 rounded-xl text-sm text-[#e2e8f0] outline-none border-none appearance-none cursor-pointer">
                      {internships.map(i => <option key={i.domain} value={i.domain}>{i.domain}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="text-xs font-bold text-[#94a3b8] block mb-2">Your Skills (comma separated)</label>
                    <input value={userSkillsText} onChange={e => setUserSkillsText(e.target.value)} placeholder="React, Python, SQL..." style={{ background: DARK, boxShadow: INSET_SHADOW }} className="w-full p-3 rounded-xl text-sm text-[#e2e8f0] outline-none border-none placeholder:text-[#64748b]" />
                  </div>
                </div>
                <div className="flex items-center gap-4 mb-4">
                  <button onClick={() => {}} className="px-5 py-2.5 rounded-xl font-bold text-sm transition" style={{ background: BG, boxShadow: BTN_SHADOW, color: '#e2e8f0' }} onMouseDown={e => e.currentTarget.style.boxShadow = BTN_ACTIVE} onMouseUp={e => e.currentTarget.style.boxShadow = BTN_SHADOW}>Calculate Match</button>
                  <div className="flex-1 h-3 rounded-full overflow-hidden" style={{ background: DARK, boxShadow: INSET_SHADOW }}>
                    <div className="h-full rounded-full transition-all duration-700" style={{ width: `${matchData.score}%`, background: 'linear-gradient(90deg, #10b981, #34d399)' }} />
                  </div>
                  <span className="text-2xl font-extrabold" style={{ color: ACCENT }}>{matchData.score}%</span>
                </div>
                <div className="grid md:grid-cols-3 gap-4">
                  <div className="rounded-xl p-4" style={{ background: DARK, boxShadow: INSET_SHADOW }}>
                    <div className="text-xs text-[#94a3b8] mb-2">Matched Skills</div>
                    <div className="flex flex-wrap gap-1.5">
                      {matchData.matched.length ? matchData.matched.map(s => <span key={s} className="text-xs font-bold px-2 py-0.5 rounded-md text-emerald-400 bg-emerald-500/10 border border-emerald-500/20">{s}</span>) : <span className="text-xs text-[#64748b]">None yet</span>}
                    </div>
                  </div>
                  <div className="rounded-xl p-4" style={{ background: DARK, boxShadow: INSET_SHADOW }}>
                    <div className="text-xs text-[#94a3b8] mb-2">Missing / To Learn</div>
                    <div className="flex flex-wrap gap-1.5">
                      {matchData.missing.length ? matchData.missing.map(s => <span key={s} className="text-xs font-bold px-2 py-0.5 rounded-md text-amber-400 bg-amber-500/10 border border-amber-500/20">{s}</span>) : <span className="text-xs text-[#64748b]">Great — nothing missing!</span>}
                    </div>
                  </div>
                  <div className="rounded-xl p-4" style={{ background: DARK, boxShadow: INSET_SHADOW }}>
                    <div className="text-xs text-[#94a3b8] mb-2">Preparation Checklist</div>
                    <ul className="text-xs text-[#e2e8f0] space-y-1 leading-relaxed">
                      {matchData.missing.map(s => <li key={s} className="flex items-center gap-2"><CheckCircle2 size={12} style={{ color: ACCENT }} /> Learn {s}</li>)}
                      {!matchData.missing.length && <li>You're fully matched! Focus on interviews.</li>}
                    </ul>
                  </div>
                </div>
              </div>
            </section>
          )}

          {/* ─── View: Applications ─── */}
          {nav === 'Applications' && (
            <section className="space-y-6">
              <h2 className="text-xl font-extrabold">My Applications</h2>
              <div className="rounded-[1.25rem] p-6" style={{ background: BG, boxShadow: CARD_SHADOW }}>
                {apps.length === 0 ? (
                  <p className="text-[#94a3b8]">No applications yet. Browse <button onClick={() => setNav('Explore')} className="text-[#10b981] underline font-bold">Explore Internships</button> to start.</p>
                ) : (
                  <div className="space-y-3">
                    {apps.map(a => (
                      <div key={a.id} className="flex flex-col sm:flex-row sm:items-center gap-3 p-4 rounded-xl" style={{ background: DARK, boxShadow: INSET_SHADOW }}>
                        <div className="flex-1 min-w-0">
                          <div className="font-bold text-[#e2e8f0]">{a.title}</div>
                          <div className="text-xs text-[#94a3b8]">{a.company} · {a.name}</div>
                        </div>
                        <div className="flex items-center gap-3 text-xs">
                          <span className="px-2 py-0.5 rounded-md font-bold bg-amber-500/10 text-amber-400 border border-amber-500/20">{a.status}</span>
                          <span className="text-[#94a3b8]">{new Date(a.date).toLocaleDateString()}</span>
                        </div>
                        <button onClick={() => withdrawApp(a.id)} className="px-3 py-1.5 rounded-lg text-xs font-bold text-rose-400 hover:text-rose-300 transition" style={{ boxShadow: BTN_SHADOW, background: DARK }} onMouseDown={e => e.currentTarget.style.boxShadow = BTN_ACTIVE} onMouseUp={e => e.currentTarget.style.boxShadow = BTN_SHADOW}>Withdraw</button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </section>
          )}

          {/* ─── View: Employer Portal ─── */}
          {nav === 'Post' && (
            <section className="space-y-6">
              <h2 className="text-xl font-extrabold">Employer Portal — Post Opening</h2>
              <div className="rounded-[1.25rem] p-6" style={{ background: BG, boxShadow: CARD_SHADOW }}>
                <form onSubmit={e => { e.preventDefault(); submitPost(); }} className="grid md:grid-cols-2 gap-3">
                  {[
                    { label: 'Role Title', key: 'title', placeholder: 'e.g., AI/ML Research Intern' },
                    { label: 'Company Name', key: 'company', placeholder: 'e.g., NeuroForge AI' },
                    { label: 'Domain', key: 'domain', placeholder: 'e.g., AI/ML' },
                    { label: 'Location', key: 'location', placeholder: 'e.g., Bangalore' },
                    { label: 'Stipend', key: 'stipend', placeholder: 'e.g., ₹ 22,000/mo' },
                    { label: 'Duration', key: 'duration', placeholder: 'e.g., 6 months' },
                  ].map(f => (
                    <div key={f.key}>
                      <label className="text-xs font-bold text-[#94a3b8] block mb-1">{f.label}</label>
                      <input required={f.key === 'title' || f.key === 'company' || f.key === 'stipend'} value={postForm[f.key]} onChange={e => setPostForm({ ...postForm, [f.key]: e.target.value })} placeholder={f.placeholder} style={{ background: DARK, boxShadow: INSET_SHADOW }} className="w-full p-3 rounded-xl text-sm text-[#e2e8f0] outline-none border-none placeholder:text-[#64748b]" />
                    </div>
                  ))}
                  <div className="md:col-span-2">
                    <label className="text-xs font-bold text-[#94a3b8] block mb-1">Required Skills (comma separated)</label>
                    <input value={postForm.skills} onChange={e => setPostForm({ ...postForm, skills: e.target.value })} placeholder="Python, PyTorch, NLP" style={{ background: DARK, boxShadow: INSET_SHADOW }} className="w-full p-3 rounded-xl text-sm text-[#e2e8f0] outline-none border-none placeholder:text-[#64748b] mb-3" />
                    <label className="text-xs font-bold text-[#94a3b8] block mb-1">Description</label>
                    <textarea rows={2} value={postForm.desc} onChange={e => setPostForm({ ...postForm, desc: e.target.value })} placeholder="What the intern will do..." style={{ background: DARK, boxShadow: INSET_SHADOW }} className="w-full p-3 rounded-xl text-sm text-[#e2e8f0] outline-none border-none placeholder:text-[#64748b] resize-y" />
                  </div>
                  <button type="submit" className="md:col-span-2 py-3 rounded-xl font-bold text-sm transition" style={{ background: BG, boxShadow: BTN_SHADOW, color: '#e2e8f0' }} onMouseDown={e => e.currentTarget.style.boxShadow = BTN_ACTIVE} onMouseUp={e => e.currentTarget.style.boxShadow = BTN_SHADOW}>Publish Opening</button>
                </form>
                <div className="mt-6 pt-6" style={{ borderTop: '1px solid #272b31' }}>
                  <h3 className="font-bold mb-3 text-sm">Your Published Openings</h3>
                  <div className="grid md:grid-cols-2 gap-3">
                    {internships.filter(i => i.created).map(i => (
                      <div key={i.id} className="p-4 rounded-xl" style={{ background: DARK, boxShadow: INSET_SHADOW }}>
                        <div className="font-bold text-sm">{i.title}</div>
                        <div className="text-xs text-[#94a3b8]">{i.company} · {i.domain}</div>
                      </div>
                    ))}
                    {internships.filter(i => i.created).length === 0 && <div className="text-xs text-[#94a3b8] col-span-2">No new openings yet.</div>}
                  </div>
                </div>
              </div>
            </section>
          )}

          {/* Apply Modal */}
          {applyOpen && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'rgba(21,23,27,0.7)' }} onClick={() => setApplyOpen(false)}>
              <div className="w-full max-w-md rounded-[1.25rem] p-6 relative" style={{ background: BG, boxShadow: CARD_SHADOW }} onClick={e => e.stopPropagation()}>
                <button onClick={() => setApplyOpen(false)} className="absolute top-3 right-3 p-2 rounded-xl transition" style={{ boxShadow: BTN_SHADOW, background: DARK }} aria-label="Close"><X size={16} /></button>
                <h3 className="text-xl font-extrabold mb-1">Apply to {applyItem?.title}</h3>
                <p className="text-xs text-[#94a3b8] mb-5">{applyItem?.company} · {applyItem?.location}</p>
                <form onSubmit={e => { e.preventDefault(); submitApply(); }} className="space-y-3">
                  <input required placeholder="Full Name" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} style={{ background: DARK, boxShadow: INSET_SHADOW }} className="w-full p-3 rounded-xl text-sm text-[#e2e8f0] outline-none border-none placeholder:text-[#64748b]" />
                  <input required placeholder="College / University" value={form.college} onChange={e => setForm({ ...form, college: e.target.value })} style={{ background: DARK, boxShadow: INSET_SHADOW }} className="w-full p-3 rounded-xl text-sm text-[#e2e8f0] outline-none border-none placeholder:text-[#64748b]" />
                  <input required placeholder="Email Address" type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} style={{ background: DARK, boxShadow: INSET_SHADOW }} className="w-full p-3 rounded-xl text-sm text-[#e2e8f0] outline-none border-none placeholder:text-[#64748b]" />
                  <input placeholder="Skills (comma separated)" value={form.skills} onChange={e => setForm({ ...form, skills: e.target.value })} style={{ background: DARK, boxShadow: INSET_SHADOW }} className="w-full p-3 rounded-xl text-sm text-[#e2e8f0] outline-none border-none placeholder:text-[#64748b]" />
                  <input placeholder="Portfolio / GitHub URL" value={form.link} onChange={e => setForm({ ...form, link: e.target.value })} style={{ background: DARK, boxShadow: INSET_SHADOW }} className="w-full p-3 rounded-xl text-sm text-[#e2e8f0] outline-none border-none placeholder:text-[#64748b]" />
                  <button type="submit" className="w-full py-3 rounded-xl font-bold text-sm transition" style={{ background: BG, boxShadow: BTN_SHADOW, color: '#e2e8f0' }} onMouseDown={e => e.currentTarget.style.boxShadow = BTN_ACTIVE} onMouseUp={e => e.currentTarget.style.boxShadow = BTN_SHADOW}>Submit Application</button>
                </form>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
