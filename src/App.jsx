import { useState, useEffect } from 'react';
import {
  CheckCircle, Clock, Award, Briefcase, ShieldCheck, BookOpen,
  Zap, ChevronRight, Lock, Eye, Users, TrendingUp, Sparkles, X,
  Menu
} from 'lucide-react';

const STORAGE_KEY = 'sih_data';
function getApps() { try { return JSON.parse(localStorage.getItem(STORAGE_KEY)) || []; } catch { return []; } }
function saveApps(a) { localStorage.setItem(STORAGE_KEY, JSON.stringify(a)); }
function uid() { return Math.random().toString(36).slice(2) + Date.now().toString(36); }

const JOBS = [
  { id: 1, title: 'VLSI Verification Engineer', company: 'SiliconCore', skills: ['Verilog','SystemVerilog','UVM'], tag: 'VLSI', desc: 'Pre-silicon verification, testbench architecture.' },
  { id: 2, title: 'Junior NLP Engineer', company: 'Meridian AI', skills: ['Python','PyTorch','NLP'], tag: 'AI/ML', desc: 'Transformer fine-tuning, sentiment pipelines.' },
  { id: 3, title: 'DevOps Automation Intern', company: 'ShieldNet', skills: ['AWS','Docker','CI/CD'], tag: 'DevOps', desc: 'Infrastructure-as-code, pipeline optimization.' },
  { id: 4, title: 'Full-Stack React Intern', company: 'Nebula UI', skills: ['React','Node.js','PostgreSQL'], tag: 'Full-Stack', desc: 'Component libraries, API integration.' },
];

const INDUSTRIES = {
  'Full-Stack': { required: ['React','Node.js','PostgreSQL','JavaScript','CSS','API Design','Git'], label: 'Full-Stack Web' },
  'AI/ML': { required: ['Python','PyTorch','NLP','Pandas','NumPy','Scikit-learn','Data Visualization'], label: 'AI / Machine Learning' },
  'VLSI': { required: ['Verilog','SystemVerilog','UVM','Digital Design','Synthesis','STA'], label: 'VLSI / Semiconductor' },
  'DevOps': { required: ['AWS','Docker','CI/CD','Kubernetes','Terraform','Linux','Monitoring'], label: 'DevOps & Cloud' },
};

const courseCatalog = {
  'Full-Stack': [
    { id: 'fs1', title: 'Modern React & TypeScript Patterns', embedUrl: 'https://www.youtube.com/embed/t2CEgPsws3U', tag: 'Frontend', domain: 'Full-Stack', skills: ['React','JavaScript','CSS'] },
    { id: 'fs2', title: 'Node.js & API Design Masterclass', embedUrl: 'https://www.youtube.com/embed/KhuapsarqA4', tag: 'Backend', domain: 'Full-Stack', skills: ['Node.js','API Design'] },
  ],
  'AI/ML': [
    { id: 'ai1', title: 'Deep Learning with PyTorch', embedUrl: 'https://www.youtube.com/embed/k9RXKDirI44', tag: 'ML Core', domain: 'AI/ML', skills: ['PyTorch','Python'] },
    { id: 'ai2', title: 'NLP & Transformer Architectures', embedUrl: 'https://www.youtube.com/embed/f03zGPOhwk0', tag: 'NLP', domain: 'AI/ML', skills: ['NLP','Python'] },
    { id: 'ai3', title: 'Neural Networks from Scratch', embedUrl: 'https://www.youtube.com/embed/ilG7C8Otfbg', tag: 'Deep Learning', domain: 'AI/ML', skills: ['PyTorch','NumPy'] },
  ],
  'VLSI': [
    { id: 'vl1', title: 'Verilog & SystemVerilog Fundamentals', embedUrl: 'https://www.youtube.com/embed/8B1M-cY9Oeg', tag: 'Digital Design', domain: 'VLSI', skills: ['Verilog','SystemVerilog','Digital Design'] },
    { id: 'vl2', title: 'UVM Verification Methodology', embedUrl: 'https://www.youtube.com/embed/MT2tW8zGZAk', tag: 'Verification', domain: 'VLSI', skills: ['UVM'] },
    { id: 'vl3', title: 'Static Timing Analysis (STA)', embedUrl: 'https://www.youtube.com/embed/p9NuPj4lL3Q', tag: 'Timing', domain: 'VLSI', skills: ['STA'] },
  ],
  'DevOps': [
    { id: 'do1', title: 'Docker & Kubernetes for Engineers', embedUrl: 'https://www.youtube.com/embed/3c-iBn73d8c', tag: 'Containers', domain: 'DevOps', skills: ['Docker','Kubernetes'] },
    { id: 'do2', title: 'CI/CD Pipelines & Infra as Code', embedUrl: 'https://www.youtube.com/embed/wxHH2mX6T9k', tag: 'Automation', domain: 'DevOps', skills: ['CI/CD','Terraform'] },
    { id: 'do3', title: 'AWS Cloud Architecture Essentials', embedUrl: 'https://www.youtube.com/embed/jZoeqFcQ9Hw', tag: 'Cloud', domain: 'DevOps', skills: ['AWS','Linux'] },
  ],
};

export default function App() {
  const [page, setPage] = useState('portal');
  const [toast, setToast] = useState(null);
  const [mobileOpen, setMobileOpen] = useState(false);

  const showToast = (msg) => { setToast(msg); setTimeout(() => setToast(null), 3000); };
  useEffect(() => { saveApps(getApps()); }, []);

  /* ---------- APPLY MODAL ---------- */
  const [applyJob, setApplyJob] = useState(null);
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', cgpa: '', backlogs: '' });

  const openApply = (j) => { setApplyJob(j); setFormData({ name: '', email: '', phone: '', cgpa: '', backlogs: '' }); };
  const closeModal = () => setApplyJob(null);

  const submitApp = () => {
    if (!formData.name || !formData.email || !formData.phone || formData.cgpa === '' || formData.backlogs === '') {
      showToast('Please fill all fields'); return;
    }
    const apps = getApps();
    apps.push({
      id: uid(), jobTitle: applyJob.title, studentName: formData.name,
      email: formData.email, contact: formData.phone,
      cgpa: parseFloat(formData.cgpa), backlogs: parseInt(formData.backlogs),
      skills: applyJob.skills, status: 'Applied', submittedAt: new Date().toISOString()
    });
    saveApps(apps); closeModal(); showToast('Application submitted successfully');
  };

  /* ---------- PAGES ---------- */
  function PortalPage({ onApply }) {
    return (
      <div>
        <header className="mb-14">
          <h1 className="hero-display text-[#1A1A1A] mb-4">Explore Internships.<br/><span className="italic font-medium text-[#800020]">Bridge talent to industry.</span></h1>
          <p className="text-[#1A1A1A]/70 text-lg max-w-2xl leading-relaxed">Browse verified roles across VLSI, AI/ML, DevOps and Full-Stack. Apply formally — no instant submissions.</p>
        </header>
        <section className="card-grid">
          {JOBS.map(j => (
            <article key={j.id} className="card-editorial flex flex-col">
              <div className="flex items-start justify-between mb-3">
                <span className="text-xs font-bold uppercase tracking-widest text-[#800020] bg-[#800020]/10 px-2.5 py-1 rounded-full">{j.tag}</span>
                <Briefcase size={18} className="text-[#1A1A1A]/30" />
              </div>
              <h3 className="font-display text-2xl font-bold text-[#1A1A1A] mb-1 leading-snug">{j.title}</h3>
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

  function MyApplicationsPage() {
    const apps = getApps();
    const timeline = ['Applied','Under Review','Interview','Decision'];

    return (
      <div>
        <header className="mb-10"><h1 className="font-display text-5xl font-bold text-[#1A1A1A] mb-3">My Applications</h1><p className="text-[#1A1A1A]/60">Read-only view of your submitted profiles.</p></header>
        {apps.length === 0 ? (
          <div className="card-editorial text-center py-16"><h3 className="font-display text-xl text-[#1A1A1A] mb-2">No applications yet</h3><p className="text-sm text-[#1A1A1A]/60">Return to the portal to apply.</p></div>
        ) : (
          <div className="flex flex-col gap-10">
            {apps.map(app => (
              <article key={app.id} className="card-editorial relative pl-16 md:pl-16">
                <div className="absolute left-0 top-0 w-12 h-12 rounded-full bg-[#800020] text-white flex items-center justify-center shadow-lg font-display font-bold text-lg">{timeline.indexOf(app.status)+1}</div>
                <div className="flex flex-wrap items-center gap-3 mb-2">
                  <h3 className="font-display text-xl font-bold text-[#1A1A1A]">{app.jobTitle}</h3>
                  <span className="text-xs font-bold uppercase tracking-widest text-[#800020] bg-[#800020]/10 px-2.5 py-1 rounded-full">{app.status}</span>
                </div>
                <p className="text-sm text-[#1A1A1A]/70 mb-3">{app.studentName} — {app.email} — CGPA {app.cgpa}</p>
                <div className="flex gap-2 mb-4 flex-wrap">
                  {timeline.map(t => (
                    <span key={t} className={`text-xs px-2 py-0.5 rounded-md border transition-colors ${t===app.status ? 'bg-[#800020] text-white border-[#800020]' : 'bg-[#FDFBF7] text-[#1A1A1A]/40 border-[#EAE6DC]'}`}>{t}</span>
                  ))}
                </div>
                <p className="text-xs text-[#1A1A1A]/40">Submitted: {new Date(app.submittedAt).toLocaleDateString()}</p>
                <div className="absolute left-6 top-14 bottom-[-8px] w-[2px] bg-gradient-to-b from-[#800020] to-[#EAE6DC]" />
              </article>
            ))}
          </div>
        )}
      </div>
    );
  }

  function ReadinessPage() {
    const [industry, setIndustry] = useState('Full-Stack');
    const [typedSkills, setTypedSkills] = useState('');
    const [result, setResult] = useState(null);
    const [activeVideo, setActiveVideo] = useState(null);
    const currentActive = activeVideo;
    useEffect(() => {
      const missing = result ? result.missing : [];
      const lowerMissing = missing.map(s => s.toLowerCase());
      const allVideos = Object.values(courseCatalog).flat();
      const filtered = allVideos.filter(v => {
        if (v.domain !== industry) return false;
        if (!missing.length) return true;
        return v.skills.some(sk => lowerMissing.some(m => sk.toLowerCase().includes(m) || m.includes(sk.toLowerCase())));
      });
      const display = filtered.length ? filtered : (courseCatalog[industry] || []);
      setActiveVideo(display[0] || (courseCatalog[industry] ? courseCatalog[industry][0] : null));
    }, [industry, result]);

    const displayVideos = result ? (() => {
      const missing = result.missing || [];
      const lowerMissing = missing.map(s => s.toLowerCase());
      const allVideos = Object.values(courseCatalog).flat();
      const filtered = allVideos.filter(v => {
        if (v.domain !== industry) return false;
        if (!missing.length) return true;
        return v.skills.some(sk => lowerMissing.some(m => sk.toLowerCase().includes(m) || m.includes(sk.toLowerCase())));
      });
      return filtered.length ? filtered : (courseCatalog[industry] || []);
    })() : (courseCatalog[industry] || []);

    const calculate = () => {
      const target = INDUSTRIES[industry].required;
      const current = typedSkills.split(/[;,]+/).map(s => s.trim()).filter(Boolean);
      const found = target.filter(req => current.some(c => c.toLowerCase() === req.toLowerCase() || c.toLowerCase().includes(req.toLowerCase()) || req.toLowerCase().includes(c.toLowerCase())));
      const missing = target.filter(req => !found.includes(req));
      const pct = Math.round((found.length / target.length) * 100);
      setResult({ pct, missing, found, target, industryLabel: INDUSTRIES[industry].label });
    };

    return (
      <div>
        <header className="mb-10"><h1 className="font-display text-5xl font-bold text-[#1A1A1A] mb-3">Industry Readiness</h1><p className="text-[#1A1A1A]/60">Compare your skills against a target industry's hard requirements.</p></header>
        <section className="grid lg:grid-cols-2 gap-8 mb-10">
          <div className="card-editorial">
            <h2 className="font-display text-xl font-bold mb-4">Target Industry</h2>
            <div className="flex flex-wrap gap-2">
              {Object.entries(INDUSTRIES).map(([k,v]) => (
                <button key={k} onClick={() => { setIndustry(k); setResult(null); }} className={`px-4 py-2 rounded-full text-sm font-medium border transition ${industry===k ? 'bg-[#800020] text-[#FDFBF7] border-[#800020]' : 'bg-[#FDFBF7] text-[#1A1A1A] border-[#EAE6DC] hover:border-[#800020]'}`}>{v.label}</button>
              ))}
            </div>
            <div className="mt-4 p-3 bg-[#FDFBF7] border border-[#EAE6DC] rounded-lg text-sm text-[#1A1A1A]/80">Required: {INDUSTRIES[industry].required.join(', ')}</div>
          </div>
          <div className="card-editorial">
            <h2 className="font-display text-xl font-bold mb-4">Your Skills</h2>
            <textarea rows={3} placeholder="Type your skills (e.g., React, Python, Verilog, NLP)" value={typedSkills} onChange={e=>setTypedSkills(e.target.value)} className="input-editorial w-full resize-none mb-3" />
            <button onClick={calculate} className="btn-editorial">Calculate Readiness</button>
          </div>
        </section>

        {result && (
          <section className="card-editorial mb-10">
            <div className="flex items-center gap-4 mb-4">
              <h2 className="font-display text-2xl font-bold">{result.industryLabel} Readiness</h2>
              <span className={`text-3xl font-display font-bold ${result.pct>=70?'text-[#10b981]':result.pct>=40?'text-[#B8860B]':'text-[#800020]'}`}>{result.pct}%</span>
            </div>
            <div className="w-full h-3 bg-[#EAE6DC] rounded-full overflow-hidden mb-6"><div className="h-full bg-gradient-to-r from-[#800020] to-[#10b981] rounded-full" style={{width:`${result.pct}%`}} /></div>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-bold text-sm uppercase tracking-wider text-[#1A1A1A]/50 mb-2">Matched Skills</h3>
                {result.found.length===0 ? <p className="text-sm text-[#1A1A1A]/40">None matched.</p> : <ul className="flex flex-wrap gap-2">{result.found.map(s=><li key={s} className="text-sm bg-[#10b981]/10 text-[#1A1A1A] px-2 py-1 rounded-md">{s}</li>)}</ul>}
              </div>
              <div>
                <h3 className="font-bold text-sm uppercase tracking-wider text-[#1A1A1A]/50 mb-2">Missing Skills</h3>
                {result.missing.length===0 ? <p className="text-sm text-[#10b981]">All requirements met.</p> : <ul className="flex flex-wrap gap-2">{result.missing.map(s=><li key={s} className="text-sm bg-[#800020]/10 text-[#800020] px-2 py-1 rounded-md font-medium">{s}</li>)}</ul>}
              </div>
            </div>
          </section>
        )}

        {/* Video Platform */}
        <section className="mt-10">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-1 h-8 bg-[#800020] rounded-full" />
            <h2 className="font-display text-3xl font-bold text-[#1A1A1A]">Recommended Masterclasses</h2>
            <span className="text-xs font-bold uppercase tracking-widest text-[#800020] bg-[#800020]/10 px-3 py-1 rounded-full">{industry}</span>
          </div>
          <div className="card-editorial mb-8" style={{ border: '2px solid #1A1A1A', boxShadow: '10px 10px 0 #d8d4c8, 4px 4px 0 #d8d4c8' }}>
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-display text-xl font-bold text-[#1A1A1A]">{currentActive ? currentActive.title : 'Select a Masterclass'}</h3>
              <span className="text-xs font-bold uppercase text-[#800020] bg-[#800020]/10 px-2 py-0.5 rounded-full">{currentActive ? currentActive.tag : 'Waiting'}</span>
            </div>
            <div className="video-wrap">
              <iframe src={currentActive ? currentActive.embedUrl : 'https://www.youtube.com/embed/t2CEgPsws3U?rel=0'} title="Masterclass Video" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen />
            </div>
          </div>
          <div className="grid md:grid-cols-2 gap-6">
            {displayVideos.map((vid, idx) => (
              <button key={vid.id} onClick={() => setActiveVideo(vid)} className={`card-editorial text-left transition-all duration-300 hover:-translate-y-1 ${(currentActive?.id === vid.id || activeVideo?.id === vid.id) ? 'ring-2 ring-[#800020] bg-[#FDFBF7]' : ''}`} style={{ borderColor: (currentActive?.id === vid.id || activeVideo?.id === vid.id) ? '#800020' : '#EAE6DC' }}>
                <div className="flex gap-5">
                  <div className="w-24 h-16 shrink-0 rounded-lg overflow-hidden shadow-md" style={{ background: '#800020' }}>
                    <div className="w-full h-full flex items-center justify-center text-white/90 font-display font-bold text-xs">▶</div>
                  </div>
                  <div className="min-w-0">
                    <h4 className="font-display text-lg font-bold text-[#1A1A1A] leading-snug mb-1 truncate">{vid.title}</h4>
                    <span className="text-xs font-bold uppercase tracking-widest text-[#800020]">{vid.tag}</span>
                    <div className="text-[10px] text-[#1A1A1A]/40 mt-2">Free Embeddable Class · YouTube</div>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </section>
      </div>
    );
  }

  /* ---------- TPO ADMIN ---------- */
  function TPOPage() {
    const [authed, setAuthed] = useState(false);
    const [loginId, setLoginId] = useState('');
    const [loginPass, setLoginPass] = useState('');

    const handleLogin = () => { if (loginId === 'admin' && loginPass === 'sih2026') setAuthed(true); else { showToast('Invalid credentials'); setLoginPass(''); } };

    if (!authed) {
      return (
        <div className="max-w-md mx-auto mt-20">
          <div className="card-editorial text-center">
            <ShieldCheck size={48} className="mx-auto mb-4 text-[#800020]" />
            <h2 className="font-display text-3xl font-bold mb-2">TPO Administration</h2>
            <p className="text-sm text-[#1A1A1A]/60 mb-6">Secure access required for placement records.</p>
            <input placeholder="Admin ID" value={loginId} onChange={e=>setLoginId(e.target.value)} className="input-editorial w-full mb-3 text-center" />
            <input type="password" placeholder="Password" value={loginPass} onChange={e=>setLoginPass(e.target.value)} onKeyDown={e=>e.key==='Enter'&&handleLogin()} className="input-editorial w-full mb-4 text-center" />
            <button onClick={handleLogin} className="btn-editorial w-full">Sign In</button>
            <p className="text-[10px] text-[#1A1A1A]/30 mt-4">Hardcoded: admin / sih2026</p>
          </div>
        </div>
      );
    }

    const apps = getApps();
    const statusOptions = ['Applied','Under Review','Interview','Decision'];

    const changeStatus = (id, newStatus) => {
      const list = getApps();
      const idx = list.findIndex(a => a.id === id);
      if (idx !== -1) { list[idx].status = newStatus; saveApps(list); showToast('Status updated'); }
      // Sync student view via storage (no reload needed if they navigate)
    };

    return (
      <div>
        <header className="mb-10 border-b border-[#EAE6DC] pb-6">
          <h1 className="font-display text-4xl font-bold text-[#1A1A1A] mb-1">Annamacharya Institute Of Technology And Sciences - TPO Placement Portal</h1>
          <p className="text-sm text-[#1A1A1A]/50">Authorized administrator view · localStorage sync active</p>
        </header>

        <section className="grid md:grid-cols-3 gap-6 mb-10">
          <div className="card-editorial"><h3 className="font-display text-xl font-bold mb-1">{apps.length}</h3><p className="text-xs uppercase tracking-widest text-[#1A1A1A]/40">Total Applications</p></div>
          <div className="card-editorial"><h3 className="font-display text-xl font-bold mb-1">{apps.filter(a=>a.status==='Applied').length}</h3><p className="text-xs uppercase tracking-widest text-[#1A1A1A]/40">Awaiting Review</p></div>
          <div className="card-editorial"><h3 className="font-display text-xl font-bold mb-1">{new Set(apps.map(a=>a.jobTitle)).size}</h3><p className="text-xs uppercase tracking-widest text-[#1A1A1A]/40">Active Roles</p></div>
        </section>

        <section>
          <h2 className="font-display text-2xl font-bold mb-6">Application Registry</h2>
          <div className="overflow-x-auto rounded-2xl border border-[#EAE6DC] bg-[#FDFBF7] shadow-[8px_8px_0_#d8d4c8,2px_2px_0_#d8d4c8]">
            <table className="w-full text-sm" style={{fontFamily:"'Inter',sans-serif"}}>
              <thead className="bg-[#1A1A1A] text-[#FDFBF7]">
                <tr><th className="text-left px-4 py-3 font-medium">Student</th><th className="text-left px-4 py-3 font-medium">Role</th><th className="text-left px-4 py-3 font-medium">Email</th><th className="text-left px-4 py-3 font-medium">CGPA</th><th className="text-left px-4 py-3 font-medium">Status</th><th className="text-left px-4 py-3 font-medium">Action</th></tr>
              </thead>
              <tbody>
                {apps.map(app => (
                  <tr key={app.id} className="border-b border-[#EAE6DC] hover:bg-[#800020]/[0.03] transition">
                    <td className="px-4 py-3 font-medium text-[#1A1A1A]">{app.studentName}</td>
                    <td className="px-4 py-3">{app.jobTitle}</td>
                    <td className="px-4 py-3 text-[#1A1A1A]/70">{app.email}</td>
                    <td className="px-4 py-3">{app.cgpa}</td>
                    <td className="px-4 py-3"><span className="text-xs font-bold uppercase px-2 py-0.5 rounded-full bg-[#800020]/10 text-[#800020]">{app.status}</span></td>
                    <td className="px-4 py-3"><div className="flex gap-2">{statusOptions.map(st => (<button key={st} onClick={() => changeStatus(app.id, st)} disabled={app.status===st} className={`text-xs px-2 py-1 rounded-md border transition ${app.status===st ? 'bg-[#1A1A1A] text-[#FDFBF7] border-[#1A1A1A]' : 'bg-[#FDFBF7] text-[#1A1A1A] border-[#EAE6DC] hover:border-[#800020] hover:text-[#800020]'}`}>{st}</button>))}</div></td>
                  </tr>
                ))}
                {apps.length===0 && <tr><td colSpan={6} className="px-4 py-8 text-center text-[#1A1A1A]/40">No applications recorded.</td></tr>}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    );
  }

  /* ---------- RENDER ---------- */
  return (
    <div>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,700;1,600&family=Inter:wght@300;400;500;600&display=swap'); .font-display { font-family: 'Playfair Display', Georgia, serif; } .nav-label { font-family: 'Inter', sans-serif; font-size: 0.85rem; letter-spacing: 0.02em; text-transform: uppercase; font-weight: 500; }`}</style>
      <nav className="sticky top-0 z-50 bg-[#FDFBF7]/95 backdrop-blur-sm border-b border-[#EAE6DC]" style={{fontFamily:"'Inter',sans-serif"}}>
        <div className="max-w-7xl mx-auto px-6 md:px-10 h-auto nav-row flex items-center justify-between py-3">
          <button onClick={()=>setPage('portal')} className="font-display text-2xl font-bold text-[#1A1A1A] tracking-tight hover:text-[#800020] transition-colors">Campus Bridge</button>
          <button onClick={()=>setMobileOpen(!mobileOpen)} className="md:hidden text-[#1A1A1A]" aria-label="Menu"><Menu size={24} /></button>
          <div className={`md:flex gap-8 items-center ${mobileOpen ? 'flex flex-col gap-3 mt-3 md:mt-0 w-full md:w-auto' : 'hidden'}`}>
            <button onClick={()=>{setPage('portal'); setMobileOpen(false);}} className="nav-label text-[#1A1A1A] hover:text-[#800020] transition-colors">Student Portal</button>
            <button onClick={()=>{setPage('applications'); setMobileOpen(false);}} className="nav-label text-[#1A1A1A] hover:text-[#800020] transition-colors">My Applications</button>
            <button onClick={()=>{setPage('readiness'); setMobileOpen(false);}} className="nav-label text-[#1A1A1A] hover:text-[#800020] transition-colors">Industry Readiness</button>
            <button onClick={()=>{setPage('tpo'); setMobileOpen(false);}} className="nav-label text-[#1A1A1A] hover:text-[#800020] transition-colors">TPO Admin</button>
          </div>
        </div>
      </nav>

      {toast && <div className="fixed top-20 left-1/2 -translate-x-1/2 z-[60] bg-[#1A1A1A] text-[#FDFBF7] px-6 py-3 rounded-full shadow-2xl font-[Inter] text-sm font-medium flex items-center gap-2 animate-toast-in"><CheckCircle size={18} className="text-[#10b981]" /> {toast}</div>}

      <main className="max-w-7xl mx-auto px-6 md:px-10 py-10">
        {page==='portal' && <PortalPage onApply={openApply} />}
        {page==='applications' && <MyApplicationsPage />}
        {page==='readiness' && <ReadinessPage />}
        {page==='tpo' && <TPOPage />}
      </main>

      {/* Modal */}
      <div className={`modal-back ${applyJob ? '' : 'hidden'}`} onClick={closeModal}>
        <div className="modal-panel" onClick={e => e.stopPropagation()}>
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="font-display text-2xl font-bold text-[#1A1A1A]">Apply to <span className="text-[#800020]">{applyJob?.title}</span></h2>
              <p className="text-sm text-[#1A1A1A]/60">{applyJob?.company}</p>
            </div>
            <button onClick={closeModal} className="text-[#1A1A1A]/40 hover:text-[#800020] transition"><X size={22} /></button>
          </div>
          <form onSubmit={e => { e.preventDefault(); submitApp(); }} className="flex flex-col gap-4">
            <input required placeholder="Full Name" value={formData.name} onChange={e=>setFormData({...formData,name:e.target.value})} className="input-editorial" />
            <input required type="email" placeholder="Email Address" value={formData.email} onChange={e=>setFormData({...formData,email:e.target.value})} className="input-editorial" />
            <input required placeholder="Phone / Contact" value={formData.phone} onChange={e=>setFormData({...formData,phone:e.target.value})} className="input-editorial" />
            <div className="flex gap-4">
              <input required type="number" step="0.01" placeholder="CGPA (e.g. 8.5)" value={formData.cgpa} onChange={e=>setFormData({...formData,cgpa:e.target.value})} className="input-editorial flex-1" />
              <input required type="number" placeholder="Active Backlogs" value={formData.backlogs} onChange={e=>setFormData({...formData,backlogs:e.target.value})} className="input-editorial flex-1" />
            </div>
            <button type="submit" className="btn-editorial w-full mt-2">Submit Application</button>
          </form>
        </div>
      </div>
    </div>
  );
}
