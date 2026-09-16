import { useState, useEffect, useMemo } from 'react';
import {
  Search, Filter, GraduationCap, Sparkles, CheckCircle2, Clock, MapPin,
  DollarSign, Send, X, Menu, ChevronRight, Zap, BookOpen, TrendingUp,
  Shield, BrainCircuit, Wrench, Server, Code2, Hash, Trophy, ArrowRight, Building2, Briefcase
} from 'lucide-react';

/* ═════════════════════ NEOMORPHIC TOKENS ═════════════════════ */
const BG2 = '#1b1e23';
const DARK2 = '#121418';
const LIGHT2 = '#24282e';
const CARD = '9px 9px 18px #121418, -9px -9px 18px #24282e';
const INSET = 'inset 4px 4px 8px #121418, inset -4px -4px 8px #24282e';
const BTN = '6px 6px 12px #121418, -6px -6px 12px #24282e';
const BTN_ACTIVE = 'inset 3px 3px 6px #121418, inset -3px -3px 6px #24282e';
const ACCENT = '#10b981';
const ROSE = '#ef4444';

/* ═════════════════════ STORAGE ═════════════════════ */
const LS_INTS = 'si_internships';
const LS_APPS = 'si_applications';

const REAL_INTS = [
  { id: 201, title: 'ASIC Design Intern', company: 'SiliconCore Labs', domain: 'VLSI', location: 'Bangalore', stipend: '₹ 22,000/mo', duration: '6 months', skills: ['Verilog','SystemVerilog','Synthesis','Physical Design'], desc: 'Work on custom silicon architectures using Verilog and SystemVerilog for ASIC tapeout.' },
  { id: 202, title: 'RTL Verification Engineer', company: 'NeuroForge AI', domain: 'VLSI', location: 'Hyderabad', stipend: '₹ 25,000/mo', duration: '6 months', skills: ['SystemVerilog','UVM','SVA','Formal Methods'], desc: 'Validate RTL designs with UVM testbenches and formal property checking.' },
  { id: 203, title: 'Full-Stack Developer', company: 'Orbit Labs', domain: 'Software', location: 'Mumbai', stipend: '₹ 28,000/mo', duration: '4 months', skills: ['React','Node.js','PostgreSQL','TypeScript','Tailwind'], desc: 'Build responsive product interfaces and REST APIs with modern stacks.' },
  { id: 204, title: 'Embedded Systems Intern', company: 'Vertex Systems', domain: 'Embedded', location: 'Pune', stipend: '₹ 18,000/mo', duration: '12 months', skills: ['ARM Cortex-M','FreeRTOS','C','Embedded C'], desc: 'Develop firmware for ARM Cortex-M based IoT and industrial controllers.' },
  { id: 205, title: 'AI/ML Research Intern', company: 'Meridian AI', domain: 'AI/ML', location: 'Delhi NCR', stipend: '₹ 30,000/mo', duration: '6 months', skills: ['Python','PyTorch','Transformer','NLP'], desc: 'Train large language models and evaluate on downstream benchmarks.' },
  { id: 206, title: 'Cloud DevOps Intern', company: 'ShieldNet', domain: 'DevOps', location: 'Remote', stipend: '₹ 20,000/mo', duration: '6 months', skills: ['AWS','Docker','Terraform','CI/CD'], desc: 'Build and maintain CI/CD pipelines, container clusters, and IaC templates.' },
];

function loadInt() {
  try { const r = localStorage.getItem(LS_INTS); if (r) return JSON.parse(r); } catch {}
  localStorage.setItem(LS_INTS, JSON.stringify(REAL_INTS));
  return REAL_INTS;
}
function saveInt(a) { try { localStorage.setItem(LS_INTS, JSON.stringify(a)); } catch {} }
function loadApp() { try { return JSON.parse(localStorage.getItem(LS_APPS) || '[]'); } catch { return []; } }
function saveApp(a) { try { localStorage.setItem(LS_APPS, JSON.stringify(a)); } catch {} }

/* ═════════════════════ TOAST ═════════════════════ */
function Toast({ msg, onClose }) {
  useEffect(() => { const t = setTimeout(onClose, 2800); return () => clearTimeout(t); }, [onClose]);
  return (
    <div className="fixed top-6 right-6 z-[70] px-5 py-3 rounded-2xl text-sm font-bold shadow-2xl flex items-center gap-2 animate-fade-up" style={{ background: BG2, boxShadow: CARD, border: '1px solid #24282e', color: '#e2e8f0' }}>
      <CheckCircle2 size={18} style={{ color: ACCENT }} /> {msg}
    </div>
  );
}

/* ═════════════════════ MAIN ═════════════════════ */
export default function App() {
  const [nav, setNav] = useState('Explore');
  const [toasts, setToasts] = useState([]);
  const [ints, setInts] = useState(() => loadInt());
  const [apps, setApps] = useState(() => loadApp());
  const [search, setSearch] = useState('');
  const [tag, setTag] = useState('All');
  const [applyOpen, setApplyOpen] = useState(false);
  const [applyInt, setApplyInt] = useState(null);
  const [applyForm, setApplyForm] = useState({ name:'', college:'', email:'', portfolio:'' });
  const [matchRole, setMatchRole] = useState('Full-Stack');
  const [resumeText, setResumeText] = useState('');
  const [parsing, setParsing] = useState(false);
  const [parsedSkills, setParsedSkills] = useState([]);
  const [mobileNav, setMobileNav] = useState(false);
  const [postForm, setPostForm] = useState({ title:'', company:'', domain:'', location:'', stipend:'', duration:'', skills:'' });

  useEffect(() => saveInt(ints), [ints]);
  useEffect(() => saveApp(apps), [apps]);

  const pushToast = (msg) => setToasts(t => [...t, { id: Date.now(), msg }]);
  const clearToast = (id) => setToasts(t => t.filter(x => x.id !== id));

  /* Filter */
  const filtered = useMemo(() => ints.filter(i => {
    const q = search.toLowerCase();
    const okS = !q || i.title.toLowerCase().includes(q) || i.company.toLowerCase().includes(q) || i.domain.toLowerCase().includes(q);
    const okT = tag === 'All' || (tag === 'VLSI' && i.domain === 'VLSI') || (tag === 'Software' && i.domain === 'Software') || (tag === 'AI/ML' && i.domain === 'AI/ML') || (tag === 'Embedded' && i.domain === 'Embedded') || (tag === 'DevOps' && i.domain === 'DevOps');
    return okS && okT;
  }), [ints, search, tag]);

  /* Apply */
  function openApply(i) { setApplyInt(i); setApplyForm({ name:'', college:'', email:'', portfolio:'' }); setApplyOpen(true); }
  function submitApply() {
    if (!applyForm.name.trim() || !applyForm.email.trim()) return;
    setApps(prev => [{ id: Date.now(), intId: applyInt.id, title: applyInt.title, company: applyInt.company, name: applyForm.name.trim(), college: applyForm.college.trim(), email: applyForm.email.trim(), portfolio: applyForm.portfolio.trim(), status: 'Under Review', date: new Date().toISOString() }, ...prev]);
    setApplyOpen(false); setApplyForm({ name:'', college:'', email:'', portfolio:'' });
    pushToast('Application Submitted Successfully');
  }

  /* Withdraw */
  function withdraw(id) { setApps(prev => prev.filter(a => a.id !== id)); pushToast('Application Withdrawn'); }

  /* Post */
  function submitPost() {
    if (!postForm.title.trim() || !postForm.company.trim() || !postForm.stipend.trim()) return;
    const newItem = { id: Date.now(), title: postForm.title.trim(), company: postForm.company.trim(), domain: postForm.domain || 'Software', location: postForm.location || 'Remote', stipend: postForm.stipend.trim(), duration: postForm.duration || '3 months', skills: postForm.skills.split(',').map(s=>s.trim()).filter(Boolean), desc: 'New opening posted.', created: new Date().toISOString() };
    setInts(prev => [newItem, ...prev]); setPostForm({ title:'', company:'', domain:'', location:'', stipend:'', duration:'', skills:'' }); setNav('Explore'); pushToast('New Internship Published');
  }

  /* Smart parse */
  function smartParse() {
    setParsing(true);
    setTimeout(() => {
      const text = resumeText.toLowerCase();
      const keywords = ['python', 'react', 'node.js', 'verilog', 'systemverilog', 'arm cortex', 'aws', 'docker', 'sql', 'pytorch', 'c', 'typescript', 'terraform', 'freeRTOS'];
      const found = keywords.filter(k => text.includes(k));
      setParsedSkills(found); setParsing(false); pushToast('Skills Extracted');
    }, 1000);
  }

  /* Skill matcher */
  const currentRole = ints.find(i => i.domain === matchRole) || ints[0];
  const userSkillsArr = parsedSkills.length ? parsedSkills : resumeText.toLowerCase().split(/[,+\s]+/).filter(Boolean);
  const reqSkills = currentRole.skills || [];
  const matched = reqSkills.filter(s => userSkillsArr.some(u => s.toLowerCase().includes(u) || u.includes(s.toLowerCase())));
  const missing = reqSkills.filter(s => !matched.includes(s));
  const score = Math.round((matched.length / Math.max(reqSkills.length, 1)) * 100);

  const navLabels = [
    { key: 'Explore', label: 'Explore Internships', icon: Search },
    { key: 'Match', label: 'Skill Matcher', icon: Sparkles },
    { key: 'Applications', label: 'My Apps', icon: Send },
    { key: 'Post', label: 'Employer Portal', icon: Building2 },
    { key: 'TPO', label: 'TPO Command', icon: Shield },
  ];

  const stats = {
    open: ints.length,
    apps: apps.length,
    match: score,
    avgReady: 68,
  };

  return (
    <div className="min-h-screen" style={{ background: BG2, color: '#e2e8f0', fontFamily: "'Inter', ui-sans-serif, system-ui, sans-serif" }}>
      {toasts.map(t => <Toast key={t.id} msg={t.msg} onClose={() => clearToast(t.id)} />)}

      {/* Header */}
      <header className="sticky top-0 z-40 px-6 lg:px-10 h-20 flex items-center justify-between gap-4" style={{ background: 'rgba(27,30,35,0.85)', backdropFilter: 'blur(16px)', borderBottom: '1px solid #24282e' }}>
        <button onClick={() => setNav('Explore')} className="flex items-center gap-3 group">
          <div className="h-10 w-10 rounded-2xl flex items-center justify-center transition group-hover:-translate-y-0.5" style={{ background: BG2, boxShadow: BTN, border: '1px solid #24282e' }}>
            <GraduationCap size={20} style={{ color: '#10b981' }} />
          </div>
          <div className="leading-none">
            <div className="text-sm font-extrabold tracking-tight">Campus Bridge</div>
            <div className="text-[10px] text-[#94a3b8] font-medium mt-0.5">SIH26044 · Academia-Industry</div>
          </div>
        </button>
        <button onClick={() => setMobileNav(!mobileNav)} className="lg:hidden p-2 rounded-xl" style={{ background: BG2, boxShadow: BTN }} aria-label="Menu"><Menu size={20} style={{ color: '#94a3b8' }} /></button>
      </header>

      <div className="max-w-7xl mx-auto px-6 lg:px-10 py-10 flex gap-6 lg:gap-10">
        {/* Sidebar */}
        <aside className={`lg:w-64 shrink-0 lg:sticky lg:top-28 lg:self-start ${mobileNav ? 'block absolute top-20 left-6 right-6 z-30 rounded-3xl p-4' : 'hidden lg:block'}`} style={{ background: BG2, boxShadow: CARD, border: '1px solid #24282e', borderRadius: '1.5rem' }}>
          <nav className="space-y-1">
            {navLabels.map(n => (
              <button key={n.key} onClick={() => { setNav(n.key); setMobileNav(false); }} className="w-full text-left px-4 py-3 rounded-xl text-sm font-bold transition flex items-center gap-3" style={nav === n.key ? { background: DARK2, boxShadow: INSET, color: '#10b981' } : { color: '#94a3b8' }}>
                <n.icon size={16} /> {n.label}
              </button>
            ))}
          </nav>
        </aside>

        {/* Main */}
        <main className="flex-1 min-w-0 space-y-8">

          {/* Stats */}
          <div className="grid sm:grid-cols-3 gap-4">
            {[
              { title: 'Active Openings', val: stats.open, sub: 'Live listings', icon: Briefcase, color: '#10b981' },
              { title: 'Applications Active', val: stats.apps, sub: 'Submitted', icon: Send, color: '#f59e0b' },
              { title: 'Batch Readiness', val: '68%', sub: 'Average index', icon: TrendingUp, color: '#10b981' },
            ].map(s => (
              <div key={s.title} className="rounded-[1.5rem] p-6 relative overflow-hidden" style={{ background: BG2, boxShadow: CARD }}>
                <div className="flex items-start justify-between mb-4">
                  <h3 className="text-xs font-bold text-[#94a3b8] uppercase tracking-wider">{s.title}</h3>
                  <div className="h-10 w-10 rounded-xl flex items-center justify-center" style={{ background: DARK2, boxShadow: INSET }}>
                    <s.icon size={18} style={{ color: s.color }} />
                  </div>
                </div>
                <div className="text-4xl font-extrabold tracking-tight" style={{ color: s.color }}>{s.val}</div>
                <div className="text-xs text-[#94a3b8] mt-1">{s.sub}</div>
              </div>
            ))}
          </div>

          {/* ─── View 1: Explore ─── */}
          {nav === 'Explore' && (
            <section className="space-y-6 animate-fade-up">
              <div className="flex flex-col sm:flex-row gap-3 items-center">
                <div className="relative flex-1 w-full">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2" size={18} style={{ color: '#64748b' }} />
                  <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search roles, companies, domains..." style={{ background: BG2, boxShadow: INSET, border: 'none', color: '#e2e8f0' }} className="w-full pl-11 pr-4 py-3.5 rounded-2xl text-sm outline-none placeholder:text-[#64748b]" />
                </div>
                <div className="flex gap-2 flex-wrap justify-center">
                  {['All','VLSI','Software','AI/ML','Embedded','DevOps'].map(t => (
                    <button key={t} onClick={() => setTag(t)} className="px-4 py-2 rounded-xl text-xs font-bold transition" style={tag === t ? { background: DARK2, boxShadow: INSET, color: '#10b981' } : { background: BG2, boxShadow: BTN, color: '#94a3b8' }} onMouseDown={e => { if(tag!==t){e.currentTarget.style.boxShadow=BTN_ACTIVE;}}} onMouseUp={e => { if(tag!==t){e.currentTarget.style.boxShadow=BTN;}}}>{t}</button>
                  ))}
                </div>
              </div>

              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
                {filtered.map(i => (
                  <article key={i.id} className="rounded-[1.5rem] p-6 relative overflow-hidden transition hover:-translate-y-1 duration-300" style={{ background: BG2, boxShadow: CARD, border: '1px solid #24282e' }}>
                    <div className="flex items-start justify-between mb-3">
                      <div className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-md" style={{ background: DARK2, color: '#10b981', boxShadow: INSET }}>{i.domain}</div>
                      <div className="text-xs font-mono font-bold" style={{ color: '#10b981' }}>{i.stipend}</div>
                    </div>
                    <h3 className="text-xl font-extrabold leading-tight mb-1" style={{ color: '#e2e8f0' }}>{i.title}</h3>
                    <div className="text-sm font-semibold mb-3" style={{ color: '#94a3b8' }}>{i.company} · {i.location}</div>
                    <p className="text-sm leading-relaxed mb-4" style={{ color: '#cbd5e1' }}>{i.desc}</p>
                    <div className="flex flex-wrap gap-2 mb-4">
                      {i.skills.map(s => <span key={s} className="text-[11px] font-medium px-2 py-0.5 rounded-md" style={{ background: DARK2, color: '#94a3b8', boxShadow: INSET }}>{s}</span>)}
                    </div>
                    <button onClick={() => openApply(i)} className="w-full py-3 rounded-2xl font-extrabold text-sm transition" style={{ background: BG2, boxShadow: BTN, color: '#e2e8f0' }} onMouseDown={e => e.currentTarget.style.boxShadow = BTN_ACTIVE} onMouseUp={e => e.currentTarget.style.boxShadow = BTN}>Quick Apply</button>
                  </article>
                ))}
                {filtered.length === 0 && <div className="col-span-full text-center py-10 text-[#94a3b8]">No results. Adjust filters.</div>}
              </div>
            </section>
          )}

          {/* ─── View 2: Skill Matcher ─── */}
          {nav === 'Match' && (
            <section className="space-y-6 animate-fade-up">
              <div className="rounded-[1.5rem] p-6" style={{ background: BG2, boxShadow: CARD, border: '1px solid #24282e' }}>
                <h2 className="text-xl font-extrabold mb-4">Smart Skill Matcher</h2>
                <div className="grid md:grid-cols-2 gap-4 mb-6">
                  <div>
                    <label className="text-xs font-bold text-[#94a3b8] block mb-2">Target Role</label>
                    <select value={matchRole} onChange={e => setMatchRole(e.target.value)} style={{ background: BG2, boxShadow: INSET, color: '#e2e8f0' }} className="w-full p-3 rounded-2xl text-sm outline-none border-none appearance-none cursor-pointer">
                      {['Full-Stack','VLSI','AI/ML','Embedded','DevOps'].map(r => <option key={r}>{r}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="text-xs font-bold text-[#94a3b8] block mb-2">Paste Resume / Syllabus</label>
                    <textarea rows={3} value={resumeText} onChange={e => setResumeText(e.target.value)} placeholder="Paste your skills, courses, projects..." style={{ background: BG2, boxShadow: INSET, color: '#e2e8f0', border: 'none', resize: 'vertical' }} className="w-full p-3 rounded-2xl text-sm outline-none placeholder:text-[#64748b]" />
                  </div>
                </div>
                <button onClick={smartParse} disabled={parsing} className="px-5 py-2.5 rounded-xl font-bold text-sm transition mb-6" style={{ background: BG2, boxShadow: BTN, color: '#e2e8f0' }} onMouseDown={e => e.currentTarget.style.boxShadow = BTN_ACTIVE} onMouseUp={e => e.currentTarget.style.boxShadow = BTN}>{parsing ? 'Parsing...' : 'Smart Parse Skills'}</button>

                {/* Circular progress */}
                <div className="flex items-center gap-8 mb-6">
                  <div className="relative w-36 h-36 shrink-0">
                    <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
                      <circle cx="50" cy="50" r="42" fill="none" stroke="#24282e" strokeWidth="8" />
                      <circle cx="50" cy="50" r="42" fill="none" stroke="#10b981" strokeWidth="8" strokeLinecap="round" strokeDasharray={`${(score/100)*264} 264`} />
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-3xl font-extrabold" style={{ color: '#10b981' }}>{score}%</span>
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-extrabold mb-1">{currentRole.title}</h3>
                    <div className="text-xs text-[#94a3b8] mb-3">{currentRole.company} · Required: {currentRole.skills.join(', ')}</div>
                    <div className="flex flex-wrap gap-2">
                      {currentRole.skills.map(s => (
                        <span key={s} className={`text-xs font-bold px-2 py-0.5 rounded-md ${matched.includes(s) ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'}`}>{s}</span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Two lists */}
                <div className="grid md:grid-cols-2 gap-4 mb-6">
                  <div className="rounded-2xl p-4" style={{ background: DARK2, boxShadow: INSET }}>
                    <div className="text-xs font-bold text-emerald-400 mb-2">Matched Competencies</div>
                    {matched.map(s => <div key={s} className="text-sm font-medium flex items-center gap-2"><CheckCircle2 size={14} style={{ color: '#10b981' }} /> {s}</div>)}
                    {!matched.length && <div className="text-xs text-[#94a3b8]">None yet</div>}
                  </div>
                  <div className="rounded-2xl p-4" style={{ background: DARK2, boxShadow: INSET }}>
                    <div className="text-xs font-bold text-rose-400 mb-2">Missing Prerequisites</div>
                    {missing.map(s => <div key={s} className="text-sm font-medium flex items-center gap-2"><X size={14} style={{ color: '#ef4444' }} /> {s}</div>)}
                    {!missing.length && <div className="text-xs text-emerald-400 font-bold">Fully matched!</div>}
                  </div>
                </div>

                {/* 14-Day Bridge Plan */}
                {missing.length > 0 && (
                  <div className="rounded-2xl p-5" style={{ background: DARK2, boxShadow: INSET }}>
                    <h3 className="font-extrabold mb-3 flex items-center gap-2"><BookOpen size={18} style={{ color: '#10b981' }} /> 14-Day Bridge Plan</h3>
                    <div className="space-y-3">
                      {missing.map((s, idx) => (
                        <div key={s} className="flex gap-3">
                          <div className="w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-extrabold shrink-0" style={{ background: '#10b981', color: '#1b1e23' }}>{idx + 1}</div>
                          <div>
                            <div className="font-bold text-sm">Master {s}</div>
                            <div className="text-xs text-[#94a3b8]">Day {idx * 2 + 1}–{idx * 2 + 3}: Prerequisite tutorials, practice projects, and peer reviews.</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </section>
          )}

          {/* ─── View 3: Applications ─── */}
          {nav === 'Applications' && (
            <section className="space-y-6 animate-fade-up">
              <h2 className="text-xl font-extrabold">My Applications</h2>
              <div className="rounded-[1.5rem] p-6" style={{ background: BG2, boxShadow: CARD, border: '1px solid #24282e' }}>
                {apps.length === 0 ? (
                  <p className="text-[#94a3b8]">No applications yet. Visit <button onClick={() => setNav('Explore')} className="text-[#10b981] underline font-bold">Explore</button>.</p>
                ) : (
                  <div className="space-y-3">
                    {apps.map(a => (
                      <div key={a.id} className="flex flex-col sm:flex-row sm:items-center gap-3 p-4 rounded-2xl" style={{ background: DARK2, boxShadow: INSET }}>
                        <div className="flex-1 min-w-0">
                          <div className="font-extrabold text-[#e2e8f0] text-sm">{a.title}</div>
                          <div className="text-xs text-[#94a3b8]">{a.company} · {a.name}</div>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className={`text-xs font-bold px-2.5 py-1 rounded-full border ${a.status === 'Shortlisted' ? 'bg-amber-500/10 text-amber-400 border-amber-500/20' : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'}`}>{a.status}</span>
                          <span className="text-xs text-[#94a3b8]">{new Date(a.date).toLocaleDateString()}</span>
                        </div>
                        <button onClick={() => withdraw(a.id)} className="px-3 py-1.5 rounded-xl text-xs font-bold transition" style={{ background: BG2, boxShadow: BTN, color: '#ef4444' }} onMouseDown={e => e.currentTarget.style.boxShadow = BTN_ACTIVE} onMouseUp={e => e.currentTarget.style.boxShadow = BTN}>Withdraw</button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </section>
          )}

          {/* ─── View 4: Employer Portal ─── */}
          {nav === 'Post' && (
            <section className="space-y-6 animate-fade-up">
              <h2 className="text-xl font-extrabold">Employer Portal — Post Opening</h2>
              <div className="rounded-[1.5rem] p-6" style={{ background: BG2, boxShadow: CARD, border: '1px solid #24282e' }}>
                <form onSubmit={e => { e.preventDefault(); submitPost(); }} className="grid md:grid-cols-2 gap-3">
                  {[
                    { k: 'title', l: 'Role Title', ph: 'e.g., ASIC Design Intern', r: true },
                    { k: 'company', l: 'Company Name', ph: 'e.g., SiliconCore Labs', r: true },
                    { k: 'domain', l: 'Domain', ph: 'VLSI / Software / AI', r: false },
                    { k: 'location', l: 'Location', ph: 'Bangalore / Remote', r: false },
                    { k: 'stipend', l: 'Stipend', ph: '₹ 22,000/mo', r: true },
                    { k: 'duration', l: 'Duration', ph: '6 months', r: false },
                  ].map(f => (
                    <div key={f.k}>
                      <label className="text-xs font-bold text-[#94a3b8] block mb-1">{f.l}</label>
                      <input required={f.r} value={postForm[f.k]} onChange={e => setPostForm({ ...postForm, [f.k]: e.target.value })} placeholder={f.ph} style={{ background: BG2, boxShadow: INSET, color: '#e2e8f0', border: 'none' }} className="w-full p-3 rounded-2xl text-sm outline-none placeholder:text-[#64748b]" />
                    </div>
                  ))}
                  <div className="md:col-span-2">
                    <label className="text-xs font-bold text-[#94a3b8] block mb-1">Required Skills</label>
                    <input value={postForm.skills} onChange={e => setPostForm({ ...postForm, skills: e.target.value })} placeholder="Verilog, SystemVerilog, UVM..." style={{ background: BG2, boxShadow: INSET, color: '#e2e8f0', border: 'none' }} className="w-full p-3 rounded-2xl text-sm outline-none placeholder:text-[#64748b] mb-3" />
                    <button type="submit" className="w-full py-3 rounded-2xl font-extrabold text-sm transition" style={{ background: BG2, boxShadow: BTN, color: '#e2e8f0' }} onMouseDown={e => e.currentTarget.style.boxShadow = BTN_ACTIVE} onMouseUp={e => e.currentTarget.style.boxShadow = BTN}>Publish Opening</button>
                  </div>
                </form>
              </div>
            </section>
          )}

          {/* ─── View 5: TPO Command Center ─── */}
          {nav === 'TPO' && (
            <section className="space-y-6 animate-fade-up">
              <h2 className="text-xl font-extrabold">TPO Command Center</h2>
              <div className="grid md:grid-cols-3 gap-5">
                <div className="rounded-[1.5rem] p-6" style={{ background: BG2, boxShadow: CARD }}>
                  <h3 className="text-xs font-bold text-[#94a3b8] mb-2">Average Batch Readiness</h3>
                  <div className="text-5xl font-extrabold tracking-tight" style={{ color: '#10b981' }}>68%</div>
                  <div className="mt-3 h-2.5 rounded-full overflow-hidden" style={{ background: DARK2, boxShadow: INSET }}>
                    <div className="h-full rounded-full" style={{ width: '68%', background: 'linear-gradient(90deg, #10b981, #34d399)' }} />
                  </div>
                </div>
                <div className="rounded-[1.5rem] p-6" style={{ background: BG2, boxShadow: CARD }}>
                  <h3 className="text-xs font-bold text-[#94a3b8] mb-2">Applications Active</h3>
                  <div className="text-5xl font-extrabold tracking-tight" style={{ color: '#10b981' }}>{apps.length}</div>
                  <div className="text-xs text-[#94a3b8] mt-2">Live submissions this cycle</div>
                </div>
                <div className="rounded-[1.5rem] p-6" style={{ background: BG2, boxShadow: CARD }}>
                  <h3 className="text-xs font-bold text-[#94a3b8] mb-2">Top Missing Skills</h3>
                  <div className="space-y-2">
                    {['SystemVerilog','Cloud Architectures','UVM'].map(s => (
                      <div key={s} className="flex items-center gap-3">
                        <div className="w-full h-2 rounded-full overflow-hidden" style={{ background: DARK2, boxShadow: INSET }}>
                          <div className="h-full rounded-full" style={{ width: `${Math.floor(Math.random()*30+55)}%`, background: '#ef4444' }} />
                        </div>
                        <span className="text-xs font-bold whitespace-nowrap">{s}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </section>
          )}

          {/* Apply Modal */}
          {applyOpen && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'rgba(27,30,35,0.7)' }} onClick={() => setApplyOpen(false)}>
              <div className="w-full max-w-md rounded-[1.5rem] p-6 relative" style={{ background: BG2, boxShadow: CARD, border: '1px solid #24282e' }} onClick={e => e.stopPropagation()}>
                <button onClick={() => setApplyOpen(false)} className="absolute top-3 right-3 p-2 rounded-xl transition" style={{ background: DARK2, boxShadow: BTN }} aria-label="Close"><X size={16} /></button>
                <h3 className="text-xl font-extrabold mb-1">Apply — {applyInt?.title}</h3>
                <p className="text-xs text-[#94a3b8] mb-5">{applyInt?.company} · {applyInt?.location}</p>
                <form onSubmit={e => { e.preventDefault(); submitApply(); }} className="space-y-3">
                  <input required placeholder="Full Name" value={applyForm.name} onChange={e => setApplyForm({ ...applyForm, name: e.target.value })} style={{ background: BG2, boxShadow: INSET, color: '#e2e8f0', border: 'none' }} className="w-full p-3 rounded-2xl text-sm outline-none placeholder:text-[#64748b]" />
                  <input required placeholder="College / University" value={applyForm.college} onChange={e => setApplyForm({ ...applyForm, college: e.target.value })} style={{ background: BG2, boxShadow: INSET, color: '#e2e8f0', border: 'none' }} className="w-full p-3 rounded-2xl text-sm outline-none placeholder:text-[#64748b]" />
                  <input required placeholder="Email" type="email" value={applyForm.email} onChange={e => setApplyForm({ ...applyForm, email: e.target.value })} style={{ background: BG2, boxShadow: INSET, color: '#e2e8f0', border: 'none' }} className="w-full p-3 rounded-2xl text-sm outline-none placeholder:text-[#64748b]" />
                  <input placeholder="Portfolio / GitHub" value={applyForm.portfolio} onChange={e => setApplyForm({ ...applyForm, portfolio: e.target.value })} style={{ background: BG2, boxShadow: INSET, color: '#e2e8f0', border: 'none' }} className="w-full p-3 rounded-2xl text-sm outline-none placeholder:text-[#64748b]" />
                  <button type="submit" className="w-full py-3 rounded-2xl font-extrabold text-sm transition" style={{ background: BG2, boxShadow: BTN, color: '#10b981' }} onMouseDown={e => e.currentTarget.style.boxShadow = BTN_ACTIVE} onMouseUp={e => e.currentTarget.style.boxShadow = BTN}>Submit Application</button>
                </form>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
