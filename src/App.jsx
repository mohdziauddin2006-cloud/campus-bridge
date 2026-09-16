import { useState, useEffect, useMemo } from 'react';
import { CheckCircle, Clock, Award, Briefcase } from 'lucide-react';

const CHECK = 'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?q=80&w=800&auto=format&fit=crop';
const TIMELINE = 'https://images.unsplash.com/photo-1497215728101-856f4ea42174?q=80&w=800&auto=format&fit=crop';

const JOBS = [
  { id: 1, title: 'VLSI Verification Engineer', company: 'SiliconCore', skills: ['Verilog', 'SystemVerilog', 'UVM'], tag: 'VLSI' },
  { id: 2, title: 'Junior NLP Engineer', company: 'Meridian AI', skills: ['Python', 'PyTorch', 'NLP'], tag: 'AI/ML' },
  { id: 3, title: 'DevOps Automation Intern', company: 'ShieldNet', skills: ['AWS', 'Docker', 'CI/CD'], tag: 'DevOps' },
];

export default function App() {
  const [page, setPage] = useState('portal');
  const [toast, setToast] = useState(null);

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  return (
    <div className="min-h-screen bg-[#FDFBF7] text-[#1A1A1A] font-[Inter] selection:bg-[#800020]/10">
      <nav className="sticky top-0 z-50 bg-[#FDFBF7]/95 backdrop-blur-sm border-b border-[#EAE6DC]">
        <div className="max-w-7xl mx-auto px-6 md:px-10 h-16 flex items-center justify-between">
          <button onClick={() => setPage('portal')} className="font-[Playfair_Display] text-xl font-bold text-[#1A1A1A] tracking-tight hover:text-[#800020] transition-colors">Campus Bridge</button>
          <div className="flex gap-8">
            <button onClick={() => setPage('portal')} className="nav-label text-[#1A1A1A] hover:text-[#800020] transition-colors">Student Portal</button>
            <button onClick={() => setPage('applications')} className="nav-label text-[#1A1A1A] hover:text-[#800020] transition-colors">My Applications</button>
            <button onClick={() => setPage('tpo')} className="nav-label text-[#1A1A1A] hover:text-[#800020] transition-colors">TPO Admin</button>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-6 md:px-10 page-enter">
        {page === 'portal' && <StudentPortal onApply={(job) => { applyJob(job); showToast('Applied to ' + job.title); }} />}
        {page === 'applications' && <MyApplications />}
        {page === 'tpo' && <TPOAdmin />}
      </main>

      {toast && (
        <div className="fixed bottom-6 right-6 z-[60] bg-[#800020] text-[#FDFBF7] px-6 py-4 rounded-xl shadow-2xl font-medium text-sm animate-toast-in">
          {toast}
        </div>
      )}
    </div>
  );
}

function applyJob(job) {
  const existing = JSON.parse(localStorage.getItem('sih_applications') || '[]');
  const next = [...existing, { ...job, status: 'Applied', appliedAt: new Date().toISOString() }];
  localStorage.setItem('sih_applications', JSON.stringify(next));
}

function StudentPortal({ onApply }) {
  const [skillInput, setSkillInput] = useState('');
  const score = useMemo(() => {
    const user = skillInput.toLowerCase().split(/[\s,]+/).filter(Boolean);
    const all = JOBS.flatMap(j => j.skills.map(s => s.toLowerCase()));
    let matches = 0;
    user.forEach(u => { if (all.includes(u)) matches++; });
    return user.length ? Math.round((matches / user.length) * 100) : 0;
  }, [skillInput]);

  return (
    <>
      <section className="pt-24 pb-16 md:pt-36 md:pb-28">
        <div className="max-w-5xl">
          <h1 className="hero-display text-[clamp(80px,12vw,120px)] font-black text-[#1A1A1A] leading-[0.88] mb-8 tracking-[-0.04em]">The New<br />Standard in<br />Placement.</h1>
          <p className="body-text max-w-xl text-lg md:text-xl text-[#3a3a3a] leading-relaxed mb-10">A curated bridge between academia and industry. Explore internships, match skills, and apply with precision.</p>
          <div className="flex gap-4">
            <button onClick={() => document.getElementById('internships').scrollIntoView({ behavior: 'smooth' })} className="btn-pill">Explore Internships</button>
            <button onClick={() => document.getElementById('matcher').scrollIntoView({ behavior: 'smooth' })} className="btn-pill bg-[#1A1A1A] hover:bg-[#333]">Skill Matcher</button>
          </div>
        </div>
      </section>

      <section id="internships" className="py-16 md:py-24">
        <div className="flex items-baseline gap-4 mb-12">
          <h2 className="section-display text-[clamp(48px,5vw,72px)] font-black text-[#1A1A1A] tracking-[-0.03em]">Explore Internships</h2>
          <span className="nav-label text-[#800020]">CURATED OPENINGS</span>
        </div>

        <div className="grid md:grid-cols-2 gap-0 border border-[#1A1A1A]/10">
          <div className="checker-square relative h-[520px] md:h-[600px] bg-[#1A1A1A] overflow-hidden">
            <img src={CHECK} alt="Team meeting" className="checker-img w-full h-full object-cover" />
          </div>
          <div className="checker-square bg-[#FDFBF7] p-10 md:p-14 flex flex-col justify-between border-t md:border-t-0 md:border-l border-[#1A1A1A]/10">
            <div>
              <h3 className="font-[Playfair_Display] text-3xl md:text-4xl font-bold text-[#1A1A1A] mb-4">Tech, Design, Research</h3>
              <p className="body-text text-base mb-6">Browse verified openings from top-tier companies across VLSI, Software, AI/ML, Embedded, and DevOps.</p>
              <ul className="space-y-3 text-[#3a3a3a] font-medium">
                {JOBS.map(i => (
                  <li key={i.id} className="flex items-center gap-3"><CheckCircle size={16} className="text-[#800020] shrink-0" /> <span className="font-[Inter] text-sm">{i.title} — {i.company}</span></li>
                ))}
              </ul>
            </div>
            <div className="flex flex-wrap gap-3 mt-8">
              {JOBS.map(job => (
                <button key={job.id} onClick={() => onApply(job)} className="btn-pill text-xs px-4 py-2">Apply — {job.title}</button>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section id="matcher" className="py-16 md:py-24">
        <div className="flex items-baseline gap-4 mb-12">
          <h2 className="section-display text-[clamp(48px,5vw,72px)] font-black text-[#1A1A1A] tracking-[-0.03em]">Skill Matcher</h2>
          <span className="nav-label text-[#800020]">COMPETENCY ANALYSIS</span>
        </div>

        <div className="grid md:grid-cols-2 gap-0 border border-[#1A1A1A]/10">
          <div className="checker-square bg-[#800020] text-[#FDFBF7] p-10 md:p-14 flex flex-col justify-between order-2 md:order-1">
            <div>
              <h3 className="font-[Playfair_Display] text-3xl md:text-4xl font-bold mb-4">Where Do You Stand?</h3>
              <p className="text-[#FDFBF7]/90 text-base leading-relaxed mb-6">Type your skills below. We calculate exact-match compatibility against live internship requirements.</p>
              <div className="flex gap-2 flex-wrap mb-6">
                {['React','Verilog','Python','AWS','C','NLP','Docker'].map(tag => (
                  <button key={tag} onClick={() => setSkillInput(s => s ? s + ', ' + tag : tag)} className="px-3 py-1 text-xs font-bold uppercase tracking-widest border border-[#FDFBF7]/30 hover:bg-[#FDFBF7]/10 transition-colors">{tag}</button>
                ))}
              </div>
              <input
                type="text"
                value={skillInput}
                onChange={e => setSkillInput(e.target.value)}
                placeholder="e.g. React, Python, AWS"
                className="w-full bg-[#FDFBF7]/10 border border-[#FDFBF7]/20 rounded-lg px-4 py-3 text-[#FDFBF7] placeholder-[#FDFBF7]/40 outline-none focus:border-[#FDFBF7]/60 transition-colors"
              />
              <div className="mt-4 flex items-center gap-3">
                <div className="flex-1 h-3 bg-[#FDFBF7]/20 rounded-full overflow-hidden">
                  <div className="h-full bg-[#FDFBF7] rounded-full transition-all duration-500" style={{ width: score + '%' }} />
                </div>
                <span className="font-[Playfair_Display] text-2xl font-black">{score}%</span>
              </div>
            </div>
            <button onClick={() => { setSkillInput(''); }} className="btn-pill mt-8 w-max bg-[#FDFBF7] text-[#800020] hover:bg-[#EAE6DC]">Clear Matcher</button>
          </div>
          <div className="checker-square relative h-[520px] md:h-[600px] bg-[#1A1A1A] order-1 md:order-2 overflow-hidden">
            <img src="https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=800&auto=format&fit=crop" alt="Workspace" className="checker-img w-full h-full object-cover" />
          </div>
        </div>
      </section>
    </>
  );
}

function MyApplications() {
  const [apps, setApps] = useState([]);

  useEffect(() => {
    setApps(JSON.parse(localStorage.getItem('sih_applications') || '[]'));
  }, []);

  const timelineSteps = [
    { title: 'Applied', desc: 'Your application is submitted and under initial review by the hiring team.', icon: Clock, color: '#800020' },
    { title: 'Interviewing', desc: 'You have been shortlisted. Prepare for technical and behavioral rounds.', icon: Briefcase, color: '#A03040' },
    { title: 'Offered', desc: 'Congratulations. Review terms and confirm acceptance to secure your position.', icon: Award, color: '#10b981' },
  ];

  return (
    <>
      <header className="pt-24 pb-8">
        <h1 className="hero-display text-[clamp(60px,8vw,95px)] font-black text-[#1A1A1A] leading-[0.92] tracking-[-0.04em] mb-4">My Applications</h1>
        <p className="nav-label text-[#800020]">TRACK YOUR PROGRESS</p>
      </header>

      <section className="py-12 md:py-20">
        <div className="grid md:grid-cols-2 gap-12 md:gap-20 items-start">
          <div className="relative h-[600px] md:h-[720px] bg-[#1A1A1A] overflow-hidden">
            <img src={TIMELINE} alt="Office" className="checker-img opacity-60 w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#1A1A1A] via-transparent to-[#1A1A1A]/20" />
            <div className="absolute top-8 left-8 right-8">
              <h3 className="font-[Playfair_Display] text-3xl md:text-5xl text-[#FDFBF7] leading-tight mb-2">Timeline</h3>
              <p className="body-text text-[#FDFBF7]/80 text-sm">Applied → Interviewing → Offered</p>
            </div>
          </div>

          <div className="flex flex-col gap-10">
            {timelineSteps.map((step, i) => (
              <div key={step.title} className="group relative pl-10 border-l-2 border-[#1A1A1A]/10 hover:border-[#800020] transition-colors">
                <div className="absolute -left-[9px] top-0 w-4 h-4 rounded-full bg-[#FDFBF7] border-2 border-[#1A1A1A] group-hover:border-[#800020] transition-colors" />
                <h4 className="font-[Playfair_Display] text-2xl md:text-3xl font-bold mb-2">{step.title}</h4>
                <p className="body-text text-sm md:text-base mb-4">{step.desc}</p>
                <span className="nav-label text-xs text-[#800020]">STEP {i + 1}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-12 md:py-16">
        <h2 className="section-display text-[clamp(36px,4vw,60px)] font-black text-[#1A1A1A] mb-8">Saved Applications</h2>
        {apps.length === 0 ? (
          <p className="body-text text-[#555]">No applications saved yet. Apply from the Student Portal.</p>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {apps.map((a, idx) => (
              <div key={idx} className="bg-[#FDFBF7] border border-[#1A1A1A]/10 p-6 rounded-none shadow-[4px_4px_0px_0px_#800020] hover:shadow-[6px_6px_0px_0px_#800020] transition-all">
                <div className="flex items-start justify-between mb-4">
                  <h4 className="font-[Playfair_Display] text-xl font-bold">{a.title}</h4>
                  <span className="text-xs font-bold uppercase tracking-widest text-[#800020]">{a.company}</span>
                </div>
                <p className="text-sm text-[#555] mb-3">Status: <span className="font-semibold text-[#1A1A1A]">{a.status}</span></p>
                <div className="flex gap-2 flex-wrap mb-4">
                  {a.skills?.map(s => <span key={s} className="px-2 py-0.5 text-[10px] font-bold uppercase border border-[#1A1A1A]/10">{s}</span>)}
                </div>
                <div className="flex gap-2">
                  <button onClick={() => { const next = apps.map((x, i) => i === idx ? { ...x, status: 'Interviewing' } : x); setApps(next); localStorage.setItem('sih_applications', JSON.stringify(next)); }} className="btn-pill text-xs">Interviewing</button>
                  <button onClick={() => { const next = apps.filter((_, i) => i !== idx); setApps(next); localStorage.setItem('sih_applications', JSON.stringify(next)); }} className="btn-pill text-xs bg-[#1A1A1A] text-[#FDFBF7]">Remove</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </>
  );
}

function TPOAdmin() {
  const [data, setData] = useState([]);

  useEffect(() => {
    const raw = JSON.parse(localStorage.getItem('sih_applications') || '[]');
    setData(raw);
  }, []);

  const approve = (idx) => {
    const next = [...data];
    next[idx] = { ...next[idx], status: 'Offered' };
    setData(next);
    localStorage.setItem('sih_applications', JSON.stringify(next));
  };

  const reject = (idx) => {
    const next = [...data];
    next[idx] = { ...next[idx], status: 'Rejected' };
    setData(next);
    localStorage.setItem('sih_applications', JSON.stringify(next));
  };

  const total = data.length;

  return (
    <>
      <header className="pt-24 pb-8">
        <h1 className="hero-display text-[clamp(60px,8vw,95px)] font-black text-[#1A1A1A] leading-[0.92] tracking-[-0.04em] mb-4">TPO Dashboard</h1>
        <p className="nav-label text-[#800020]">PLACEMENT OFFICER VIEW</p>
      </header>

      <section className="py-12 md:py-16">
        <div className="grid md:grid-cols-3 gap-0 border-t border-b border-[#1A1A1A]/10">
          <div className="p-8 md:p-10 border-r border-[#1A1A1A]/10 last:border-r-0">
            <h4 className="nav-label text-[#1A1A1A] mb-3">Total Applications</h4>
            <div className="font-[Playfair_Display] text-4xl md:text-6xl font-black text-[#800020] mb-2">{total}</div>
            <p className="body-text text-sm">From localStorage submissions</p>
          </div>
          <div className="p-8 md:p-10 border-r border-[#1A1A1A]/10 last:border-r-0">
            <h4 className="nav-label text-[#1A1A1A] mb-3">Active Internships</h4>
            <div className="font-[Playfair_Display] text-4xl md:text-6xl font-black text-[#800020] mb-2">{JOBS.length}</div>
            <p className="body-text text-sm">Live curated openings</p>
          </div>
          <div className="p-8 md:p-10 border-r border-[#1A1A1A]/10 last:border-r-0">
            <h4 className="nav-label text-[#1A1A1A] mb-3">Avg. Match Score</h4>
            <div className="font-[Playfair_Display] text-4xl md:text-6xl font-black text-[#800020] mb-2">72%</div>
            <p className="body-text text-sm">Based on skill matcher</p>
          </div>
        </div>
      </section>

      <section className="py-12 md:py-16">
        <h2 className="section-display text-[clamp(36px,4vw,60px)] font-black text-[#1A1A1A] mb-8">Applicant Approvals</h2>
        <div className="overflow-x-auto border border-[#1A1A1A]/10">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#1A1A1A] text-[#FDFBF7]">
                <th className="nav-label px-6 py-4 font-semibold">Name</th>
                <th className="nav-label px-6 py-4 font-semibold">Role / Job</th>
                <th className="nav-label px-6 py-4 font-semibold">Status</th>
                <th className="nav-label px-6 py-4 font-semibold">Action</th>
              </tr>
            </thead>
            <tbody>
              {data.length === 0 ? (
                <tr><td colSpan={4} className="px-6 py-8 text-sm text-[#555]">No applications submitted yet.</td></tr>
              ) : data.map((r, i) => (
                <tr key={i} className="border-b border-[#1A1A1A]/10 hover:bg-[#FDFBF7]/50 transition-colors">
                  <td className="px-6 py-4 font-medium">Applicant {i + 1}</td>
                  <td className="px-6 py-4 text-[#555] text-sm">{r.title}</td>
                  <td className="px-6 py-4 text-sm font-semibold text-[#800020]">{r.status}</td>
                  <td className="px-6 py-4 flex gap-2">
                    <button onClick={() => approve(i)} className="btn-pill text-xs px-3 py-1.5">Approve</button>
                    <button onClick={() => reject(i)} className="btn-pill text-xs px-3 py-1.5 bg-[#1A1A1A] text-[#FDFBF7]">Reject</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </>
  );
}
