import { useState, useEffect, useMemo } from 'react';
import { CheckCircle, Clock, Award, Briefcase, ShieldCheck, BookOpen, Zap, ChevronRight, Lock, Eye, Users, TrendingUp, Sparkles, X, Linkedin } from 'lucide-react';

/* =============================================================
   DESIGN TOKENS — Editorial Cream / Burgundy / Charcoal
   ============================================================= */
const BG = '#FDFBF7';
const BURGUNDY = '#800020';
const CHARCOAL = '#1A1A1A';
const GOLD = '#B8860B';

/* =============================================================
   LOCALSTORAGE KEY
   ============================================================= */
const STORAGE_KEY = 'sih_data';

function getApps() {
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY)) || []; }
  catch { return []; }
}
function saveApps(apps) { localStorage.setItem(STORAGE_KEY, JSON.stringify(apps)); }

/* =============================================================
   DATA: INTERNSHIPS
   ============================================================= */
const JOBS = [
  { id: 1, title: 'VLSI Verification Engineer', company: 'SiliconCore', skills: ['Verilog', 'SystemVerilog', 'UVM'], tag: 'VLSI', desc: 'Pre-silicon verification, testbench architecture.' },
  { id: 2, title: 'Junior NLP Engineer', company: 'Meridian AI', skills: ['Python', 'PyTorch', 'NLP'], tag: 'AI/ML', desc: 'Transformer fine-tuning, sentiment pipelines.' },
  { id: 3, title: 'DevOps Automation Intern', company: 'ShieldNet', skills: ['AWS', 'Docker', 'CI/CD'], tag: 'DevOps', desc: 'Infrastructure-as-code, pipeline optimization.' },
  { id: 4, title: 'Full-Stack React Intern', company: 'Nebula UI', skills: ['React', 'Node.js', 'PostgreSQL'], tag: 'Full-Stack', desc: 'Component libraries, API integration.' },
];

/* =============================================================
   INDUSTRY READINESS DATA
   ============================================================= */
const INDUSTRIES = {
  'Full-Stack': {
    required: ['React', 'Node.js', 'PostgreSQL', 'JavaScript', 'CSS', 'API Design', 'Git'],
    label: 'Full-Stack Web'
  },
  'AI/ML': {
    required: ['Python', 'PyTorch', 'NLP', 'Pandas', 'NumPy', 'Scikit-learn', 'Data Visualization'],
    label: 'AI / Machine Learning'
  },
  'VLSI': {
    required: ['Verilog', 'SystemVerilog', 'UVM', 'Digital Design', 'Synthesis', 'STA'],
    label: 'VLSI / Semiconductor'
  },
};

/* =============================================================
   SMALL UTILS
   ============================================================= */
function uid() { return Math.random().toString(36).slice(2) + Date.now().toString(36); }

/* =============================================================
   APP COMPONENT
   ============================================================= */
export default function App() {
  const [page, setPage] = useState('portal');
  const [toast, setToast] = useState(null);

  const showToast = (msg) => { setToast(msg); setTimeout(() => setToast(null), 3000); };

  /* Load apps once */
  useEffect(() => { saveApps(getApps()); }, []);

  /* =============================================================
     PORTAL PAGE — Student Journey A: Explore Internships
     ============================================================= */
  function PortalPage({ onApply }) {
    return (
      <div>
        <header className="mb-14">
          <h1 className="font-editorial text-6xl md:text-7xl font-bold text-[#1A1A1A] leading-[1.05] mb-4">Explore Internships.<br/><span className="italic font-medium text-[#800020]">Bridge talent to industry.</span></h1>
          <p className="text-[#1A1A1A]/70 text-lg max-w-2xl leading-relaxed">Browse verified roles across VLSI, AI/ML, DevOps and Full-Stack. Apply formally — no instant submissions.</p>
        </header>

        <section className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {JOBS.map(j => (
            <article key={j.id} className="card-editorial flex flex-col">
              <div className="flex items-start justify-between mb-3">
                <span className="text-xs font-bold uppercase tracking-widest text-[#800020] bg-[#800020]/10 px-2.5 py-1 rounded-full">{j.tag}</span>
                <Briefcase size={18} className="text-[#1A1A1A]/30" />
              </div>
              <h3 className="font-editorial text-2xl font-bold text-[#1A1A1A] mb-1 leading-snug">{j.title}</h3>
              <p className="text-sm text-[#1A1A1A]/60 mb-3">{j.company}</p>
              <p className="text-[#1A1A1A]/80 text-sm leading-relaxed mb-4 flex-grow">{j.desc}</p>
              <div className="flex flex-wrap gap-2 mb-6">
                {j.skills.map(s => <span key={s} className="text-xs border border-[#EAE6DC] px-2 py-0.5 rounded-md text-[#1A1A1A]/70">{s}</span>)}
              </div>
              <button onClick={() => onApply(j)} className="btn-editorial w-full text-center">Apply Now</button>
            </article>
          ))}
        </section>
      </div>
    );
  }

  /* =============================================================
     APPLY MODAL — Strict multi-field form
     ============================================================= */
  const [applyJob, setApplyJob] = useState(null);
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', cgpa: '', backlogs: '' });

  function openApplyModal(job) {
    setApplyJob(job);
    setFormData({ name: '', email: '', phone: '', cgpa: '', backlogs: '' });
  }

  function closeModal() { setApplyJob(null); }

  function submitApplication() {
    if (!formData.name || !formData.email || !formData.phone || formData.cgpa === '' || formData.backlogs === '') {
      showToast('Please fill all fields'); return;
    }
    const apps = getApps();
    apps.push({
      id: uid(),
      jobTitle: applyJob.title,
      studentName: formData.name,
      email: formData.email,
      contact: formData.phone,
      cgpa: parseFloat(formData.cgpa),
      backlogs: parseInt(formData.backlogs),
      skills: applyJob.skills,
      status: 'Applied',
      submittedAt: new Date().toISOString()
    });
    saveApps(apps);
    closeModal();
    showToast('Application submitted successfully');
  }

  /* Modal overlay — always available when applyJob set */
  const ApplyModal = () => (
    <div className={`fixed inset-0 z-[70] flex items-center justify-center bg-[#1A1A1A]/50 backdrop-blur-sm transition-opacity ${applyJob ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}>
      <div className={`bg-[#FDFBF7] rounded-3xl p-8 md:p-10 max-w-md w-full mx-4 shadow-2xl border border-[#EAE6DC] transition-transform duration-300 ${applyJob ? 'scale-100' : 'scale-95'}`} style={{ fontFamily: "'Inter', sans-serif" }}>
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="font-editorial text-2xl font-bold text-[#1A1A1A]">Apply to <span className="text-[#800020]">{applyJob?.title}</span></h2>
            <p className="text-sm text-[#1A1A1A]/60">{applyJob?.company}</p>
          </div>
          <button onClick={closeModal} className="text-[#1A1A1A]/40 hover:text-[#800020] transition"><X size={22} /></button>
        </div>
        <form onSubmit={e => { e.preventDefault(); submitApplication(); }} className="flex flex-col gap-4">
          <input required placeholder="Full Name" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} className="input-editorial" />
          <input required type="email" placeholder="Email Address" value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })} className="input-editorial" />
          <input required placeholder="Phone / Contact" value={formData.phone} onChange={e => setFormData({ ...formData, phone: e.target.value })} className="input-editorial" />
          <div className="flex gap-4">
            <input required type="number" step="0.01" placeholder="CGPA (e.g. 8.5)" value={formData.cgpa} onChange={e => setFormData({ ...formData, cgpa: e.target.value })} className="input-editorial flex-1" />
            <input required type="number" placeholder="Active Backlogs" value={formData.backlogs} onChange={e => setFormData({ ...formData, backlogs: e.target.value })} className="input-editorial flex-1" />
          </div>
          <button type="submit" className="btn-editorial w-full mt-2">Submit Application</button>
        </form>
      </div>
    </div>
  );

  /* =============================================================
     MY APPLICATIONS — Read-Only Timeline
     ============================================================= */
  function MyApplicationsPage() {
    const apps = getApps();
    const timeline = ['Applied', 'Under Review', 'Interview', 'Decision'];
    return (
      <div>
        <header className="mb-10"><h1 className="font-editorial text-5xl font-bold text-[#1A1A1A] mb-3">My Applications</h1><p className="text-[#1A1A1A]/60">Read-only view of your submitted profiles.</p></header>
        {apps.length === 0 ? (
          <div className="card-editorial text-center py-16"><h3 className="font-editorial text-xl text-[#1A1A1A] mb-2">No applications yet</h3><p className="text-sm text-[#1A1A1A]/60">Return to the portal to apply.</p></div>
        ) : (
          <div className="flex flex-col gap-10">
            {apps.map(app => (
              <article key={app.id} className="card-editorial relative pl-16">
                <div className="timeline-line" />
                <div className="absolute left-0 top-0 w-12 h-12 rounded-full bg-[#800020] text-white flex items-center justify-center shadow-lg font-editorial font-bold text-lg">{timeline.indexOf(app.status) + 1}</div>
                <div className="flex flex-wrap items-center gap-3 mb-2">
                  <h3 className="font-editorial text-xl font-bold text-[#1A1A1A]">{app.jobTitle}</h3>
                  <span className="text-xs font-bold uppercase tracking-widest text-[#800020] bg-[#800020]/10 px-2.5 py-1 rounded-full">{app.status}</span>
                </div>
                <p className="text-sm text-[#1A1A1A]/70 mb-3">{app.studentName} — {app.email} — CGPA {app.cgpa}</p>
                <div className="flex gap-2 mb-4">
                  {timeline.map((t, i) => (
                    <span key={t} className={`text-xs px-2 py-0.5 rounded-md border transition-colors ${t === app.status ? 'bg-[#800020] text-white border-[#800020]' : 'bg-[#FDFBF7] text-[#1A1A1A]/40 border-[#EAE6DC]'}`}>{t}</span>
                  ))}
                </div>
                <p className="text-xs text-[#1A1A1A]/40">Submitted: {new Date(app.submittedAt).toLocaleDateString()}</p>
              </article>
            ))}
          </div>
        )}
      </div>
    );
  }

  /* =============================================================
     INDUSTRY READINESS — Skills Assessment (New Page)
     ============================================================= */
  function ReadinessPage() {
    const [industry, setIndustry] = useState('Full-Stack');
    const [typedSkills, setTypedSkills] = useState('');
    const [result, setResult] = useState(null);

    function calculate() {
      const target = INDUSTRIES[industry].required;
      const currentRaw = typedSkills.split(',').map(s => s.trim().toLowerCase()).filter(Boolean);
      const missing = target.filter(req => !currentRaw.some(c => c.includes(req.toLowerCase()) || req.toLowerCase().includes(c)));
      // Better comparison: exact match or close
      const current = typedSkills.split(/[;,]+/).map(s => s.trim()).filter(Boolean);
      const found = target.filter(req => current.some(c => c.toLowerCase() === req.toLowerCase() || c.toLowerCase().includes(req.toLowerCase()) || req.toLowerCase().includes(c.toLowerCase())));
      const missingExact = target.filter(req => !found.includes(req));
      const pct = Math.round((found.length / target.length) * 100);
      setResult({ pct, missing: missingExact, found, target, industryLabel: INDUSTRIES[industry].label });
    }

    return (
      <div>
        <header className="mb-10"><h1 className="font-editorial text-5xl font-bold text-[#1A1A1A] mb-3">Industry Readiness</h1><p className="text-[#1A1A1A]/60">Compare your skills against a target industry's hard requirements.</p></header>

        <section className="grid lg:grid-cols-2 gap-8 mb-10">
          <div className="card-editorial">
            <h2 className="font-editorial text-xl font-bold mb-4">Target Industry</h2>
            <div className="flex flex-wrap gap-2">
              {Object.entries(INDUSTRIES).map(([key, val]) => (
                <button key={key} onClick={() => { setIndustry(key); setResult(null); }} className={`px-4 py-2 rounded-full text-sm font-medium border transition ${industry === key ? 'bg-[#800020] text-[#FDFBF7] border-[#800020]' : 'bg-[#FDFBF7] text-[#1A1A1A] border-[#EAE6DC] hover:border-[#800020]'}`}>{val.label}</button>
              ))}
            </div>
            <div className="mt-4 p-3 bg-[#FDFBF7] border border-[#EAE6DC] rounded-lg text-sm text-[#1A1A1A]/80">
              Required: {INDUSTRIES[industry].required.join(', ')}
            </div>
          </div>
          <div className="card-editorial">
            <h2 className="font-editorial text-xl font-bold mb-4">Your Skills</h2>
            <textarea rows={3} placeholder="Type your skills (e.g., React, Python, Verilog, NLP)" value={typedSkills} onChange={e => setTypedSkills(e.target.value)} className="input-editorial w-full resize-none mb-3" />
            <button onClick={calculate} className="btn-editorial">Calculate Readiness</button>
          </div>
        </section>

        {result && (
          <section className="card-editorial animate-in fade-in slide-in-from-bottom-3 duration-500">
            <div className="flex items-center gap-4 mb-4">
              <h2 className="font-editorial text-2xl font-bold">{result.industryLabel} Readiness</h2>
              <span className={`text-3xl font-editorial font-bold ${result.pct >= 70 ? 'text-[#10b981]' : result.pct >= 40 ? 'text-[#B8860B]' : 'text-[#800020]'}`}>{result.pct}%</span>
            </div>
            <div className="w-full h-3 bg-[#EAE6DC] rounded-full overflow-hidden mb-6"><div className="h-full bg-gradient-to-r from-[#800020] to-[#10b981] rounded-full" style={{ width: `${result.pct}%` }} /></div>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-bold text-sm uppercase tracking-wider text-[#1A1A1A]/50 mb-2">Matched Skills</h3>
                {result.found.length === 0 ? <p className="text-sm text-[#1A1A1A]/40">None matched.</p> : <ul className="flex flex-wrap gap-2">{result.found.map(s => <li key={s} className="text-sm bg-[#10b981]/10 text-[#1A1A1A] px-2 py-1 rounded-md">{s}</li>)}</ul>}
              </div>
              <div>
                <h3 className="font-bold text-sm uppercase tracking-wider text-[#1A1A1A]/50 mb-2">Missing Skills</h3>
                {result.missing.length === 0 ? <p className="text-sm text-[#10b981]">All requirements met.</p> : <ul className="flex flex-wrap gap-2">{result.missing.map(s => <li key={s} className="text-sm bg-[#800020]/10 text-[#800020] px-2 py-1 rounded-md font-medium">{s}</li>)}</ul>}
              </div>
            </div>
          </section>
        )}
      </div>
    );
  }

  /* =============================================================
     TPO ADMIN — Secure Auth + Dashboard
     ============================================================= */
  function TPOPage() {
    const [authed, setAuthed] = useState(false);
    const [loginId, setLoginId] = useState('');
    const [loginPass, setLoginPass] = useState('');

    const handleLogin = () => {
      if (loginId === 'admin' && loginPass === 'sih2026') { setAuthed(true); }
      else { showToast('Invalid credentials'); setLoginPass(''); }
    };

    if (!authed) {
      return (
        <div className="max-w-md mx-auto mt-20">
          <div className="card-editorial text-center">
            <ShieldCheck size={48} className="mx-auto mb-4 text-[#800020]" />
            <h2 className="font-editorial text-3xl font-bold mb-2">TPO Administration</h2>
            <p className="text-sm text-[#1A1A1A]/60 mb-6">Secure access required for placement records.</p>
            <input placeholder="Admin ID" value={loginId} onChange={e => setLoginId(e.target.value)} className="input-editorial w-full mb-3 text-center" />
            <input type="password" placeholder="Password" value={loginPass} onChange={e => setLoginPass(e.target.value)} onKeyDown={e => e.key === 'Enter' && handleLogin()} className="input-editorial w-full mb-4 text-center" />
            <button onClick={handleLogin} className="btn-editorial w-full">Sign In</button>
            <p className="text-[10px] text-[#1A1A1A]/30 mt-4">Hardcoded: admin / sih2026</p>
          </div>
        </div>
      );
    }

    const apps = getApps();
    const statusOptions = ['Applied', 'Under Review', 'Interview', 'Decision'];

    const changeStatus = (id, newStatus) => {
      const apps = getApps();
      const idx = apps.findIndex(a => a.id === id);
      if (idx !== -1) { apps[idx].status = newStatus; saveApps(apps); showToast('Status updated'); }
      // Force re-render by reading from storage (state not needed since getApps reads fresh)
      window.location.reload();
    };

    return (
      <div>
        <header className="mb-10 border-b border-[#EAE6DC] pb-6">
          <h1 className="font-editorial text-4xl font-bold text-[#1A1A1A] mb-1">Annamacharya Institute Of Technology And Sciences - TPO Placement Portal</h1>
          <p className="text-sm text-[#1A1A1A]/50">Authorized administrator view · localStorage sync active</p>
        </header>

        <section className="grid md:grid-cols-3 gap-6 mb-10">
          <div className="card-editorial"><h3 className="font-editorial text-xl font-bold mb-1">{apps.length}</h3><p className="text-xs uppercase tracking-widest text-[#1A1A1A]/40">Total Applications</p></div>
          <div className="card-editorial"><h3 className="font-editorial text-xl font-bold mb-1">{apps.filter(a => a.status === 'Applied').length}</h3><p className="text-xs uppercase tracking-widest text-[#1A1A1A]/40">Awaiting Review</p></div>
          <div className="card-editorial"><h3 className="font-editorial text-xl font-bold mb-1">{new Set(apps.map(a => a.jobTitle)).size}</h3><p className="text-xs uppercase tracking-widest text-[#1A1A1A]/40">Active Roles</p></div>
        </section>

        <section>
          <h2 className="font-editorial text-2xl font-bold mb-6">Application Registry</h2>
          <div className="overflow-x-auto rounded-2xl border border-[#EAE6DC] bg-[#FDFBF7] shadow-[8px_8px_0_#d8d4c8,2px_2px_0_#d8d4c8]">
            <table className="w-full text-sm" style={{ fontFamily: "'Inter', sans-serif" }}>
              <thead className="bg-[#1A1A1A] text-[#FDFBF7]">
                <tr>
                  <th className="text-left px-4 py-3 font-medium">Student</th>
                  <th className="text-left px-4 py-3 font-medium">Role</th>
                  <th className="text-left px-4 py-3 font-medium">Email</th>
                  <th className="text-left px-4 py-3 font-medium">CGPA</th>
                  <th className="text-left px-4 py-3 font-medium">Status</th>
                  <th className="text-left px-4 py-3 font-medium">Action</th>
                </tr>
              </thead>
              <tbody>
                {apps.map(app => (
                  <tr key={app.id} className="border-b border-[#EAE6DC] hover:bg-[#800020]/[0.03] transition">
                    <td className="px-4 py-3 font-medium text-[#1A1A1A]">{app.studentName}</td>
                    <td className="px-4 py-3">{app.jobTitle}</td>
                    <td className="px-4 py-3 text-[#1A1A1A]/70">{app.email}</td>
                    <td className="px-4 py-3">{app.cgpa}</td>
                    <td className="px-4 py-3"><span className="text-xs font-bold uppercase px-2 py-0.5 rounded-full bg-[#800020]/10 text-[#800020]">{app.status}</span></td>
                    <td className="px-4 py-3">
                      <div className="flex gap-2">
                        {statusOptions.map(st => (
                          <button key={st} onClick={() => changeStatus(app.id, st)} disabled={app.status === st} className={`text-xs px-2 py-1 rounded-md border transition ${app.status === st ? 'bg-[#1A1A1A] text-[#FDFBF7] border-[#1A1A1A]' : 'bg-[#FDFBF7] text-[#1A1A1A] border-[#EAE6DC] hover:border-[#800020] hover:text-[#800020]'}`}>{st}</button>
                        ))}
                      </div>
                    </td>
                  </tr>
                ))}
                {apps.length === 0 && <tr><td colSpan={6} className="px-4 py-8 text-center text-[#1A1A1A]/40">No applications recorded.</td></tr>}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    );
  }

  /* =============================================================
     FINAL RENDER — single source of truth with page routing + modal
     ============================================================= */
  return (
    <div>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,700;1,600&family=Inter:wght@300;400;500;600&display=swap'); .font-editorial { font-family: 'Playfair Display', Georgia, serif; } .nav-label { font-family: 'Inter', sans-serif; font-size: 0.85rem; letter-spacing: 0.02em; text-transform: uppercase; font-weight: 500; } .btn-editorial { background: #800020; color: #FDFBF7; padding: 0.65rem 1.4rem; border-radius: 9999px; font-family: 'Inter', sans-serif; font-weight: 600; letter-spacing: 0.03em; font-size: 0.8rem; transition: all 0.25s ease; box-shadow: 6px 6px 0 #3a0a1a, 2px 2px 0 #3a0a1a; border: none; cursor: pointer; } .btn-editorial:hover { transform: translate(-2px,-2px); box-shadow: 10px 10px 0 #3a0a1a, 4px 4px 0 #3a0a1a; background: #6a001b; } .card-editorial { background: #FDFBF7; border: 1px solid #EAE6DC; border-radius: 16px; padding: 1.6rem; box-shadow: 8px 8px 0 #d8d4c8, 2px 2px 0 #d8d4c8; transition: all 0.3s ease; } .card-editorial:hover { transform: translate(-3px,-3px); box-shadow: 12px 12px 0 #d8d4c8, 4px 4px 0 #d8d4c8; } .input-editorial { background: #fff; border: 1.5px solid #EAE6DC; border-radius: 10px; padding: 0.65rem 0.9rem; font-family: 'Inter', sans-serif; font-size: 0.9rem; color: #1A1A1A; outline: none; transition: border-color 0.2s; } .input-editorial:focus { border-color: #800020; box-shadow: inset 2px 2px 6px rgba(128,0,32,0.08); } .timeline-line { position: absolute; left: 24px; top: 48px; bottom: -8px; width: 2px; background: linear-gradient(to bottom, #800020 60%, #EAE6DC 60%); }`}</style>
      <nav className="sticky top-0 z-50 bg-[#FDFBF7]/95 backdrop-blur-sm border-b border-[#EAE6DC]" style={{ fontFamily: "'Inter', sans-serif" }}>
        <div className="max-w-7xl mx-auto px-6 md:px-10 h-16 flex items-center justify-between">
          <button onClick={() => setPage('portal')} className="font-editorial text-2xl font-bold text-[#1A1A1A] tracking-tight hover:text-[#800020] transition-colors">Campus Bridge</button>
          <div className="flex gap-8 items-center">
            <button onClick={() => setPage('portal')} className="nav-label text-[#1A1A1A] hover:text-[#800020] transition-colors">Student Portal</button>
            <button onClick={() => setPage('applications')} className="nav-label text-[#1A1A1A] hover:text-[#800020] transition-colors">My Applications</button>
            <button onClick={() => setPage('readiness')} className="nav-label text-[#1A1A1A] hover:text-[#800020] transition-colors">Industry Readiness</button>
            <button onClick={() => setPage('tpo')} className="nav-label text-[#1A1A1A] hover:text-[#800020] transition-colors">TPO Admin</button>
          </div>
        </div>
      </nav>
      {toast && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-[60] bg-[#1A1A1A] text-[#FDFBF7] px-6 py-3 rounded-full shadow-2xl font-[Inter] text-sm font-medium flex items-center gap-2 animate-in fade-in slide-in-from-top-2 duration-300"><CheckCircle size={18} className="text-[#10b981]" /> {toast}</div>
      )}
      <main className="max-w-7xl mx-auto px-6 md:px-10 py-10">
        {page === 'portal' && <PortalPage onApply={(job) => openApplyModal(job)} />}
        {page === 'applications' && <MyApplicationsPage />}
        {page === 'readiness' && <ReadinessPage />}
        {page === 'tpo' && <TPOPage />}
      </main>
      <ApplyModal />
    </div>
  );
}

/* Note: The above structure intentionally embeds sub-components inside App for single-file
   compliance (src/App.jsx only) while preserving full dual-persona architecture. The ApplyModal
   is rendered globally via applyJob state; applications update localStorage which reads
   instantly on My Applications page reload. */
