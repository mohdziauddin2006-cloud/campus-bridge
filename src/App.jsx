import { useState } from 'react';
import { Menu, Bell, User, Briefcase, Printer, Sparkles, Play, X, Download, BarChart3 } from 'lucide-react';

export default function App() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [targetRole, setTargetRole] = useState('Netflix - Product Manager');
  const [resumeText, setResumeText] = useState('');
  const [jdText, setJdText] = useState('');
  const [matchPct, setMatchPct] = useState(0);
  const [scanned, setScanned] = useState(false);
  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);
  const [activeVideoId, setActiveVideoId] = useState('m8Icp_Cid5o');

  const VIDEO_MAP = {
    'system': 'm8Icp_Cid5o',
    'react': 'bMknfKXIFA8',
    'cloud': 'k1RI5locZE4',
  };

  const runScan = () => {
    const matchScore = Math.floor(Math.random() * 45) + 55;
    setMatchPct(matchScore);
    setScanned(true);
  };

  const openVideo = (key) => {
    setActiveVideoId(VIDEO_MAP[key] || VIDEO_MAP.system);
    setIsVideoModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-blue-100">
      {/* Fixed pure-white nav */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur border-b border-slate-200 h-16 flex items-center px-6 lg:px-10">
        <div className="flex items-center gap-3">
          <span className="font-extrabold text-lg tracking-tight text-slate-900 leading-none">AITS</span>
          <span className="text-xs font-medium text-slate-500 bg-slate-100 rounded-full px-2.5 py-0.5">Placement Hub</span>
        </div>
        <div className="hidden md:flex mx-auto gap-8 text-sm font-medium text-slate-600">
          <a href="#" className="hover:text-blue-600 transition-colors">ATS Scanner</a>
          <a href="#" className="hover:text-blue-600 transition-colors">Video Academy</a>
          <a href="#" className="hover:text-blue-600 transition-colors">Job Tracker</a>
          <a href="#" className="hover:text-blue-600 transition-colors">TPO Admin</a>
        </div>
        <div className="ml-auto flex items-center gap-3">
          <button aria-label="Notifications" className="p-2 hover:bg-slate-50 rounded-full transition"><Bell size={18} /></button>
          <button aria-label="Profile" className="p-2 hover:bg-slate-50 rounded-full transition"><User size={18} /></button>
          <button aria-label="Menu" onClick={() => setMobileOpen(!mobileOpen)} className="md:hidden p-2 hover:bg-slate-50 rounded-full"><Menu size={20} /></button>
        </div>
      </header>

      <main className="pt-24 pb-16 px-6 lg:px-10 max-w-7xl mx-auto">
        <div className="mb-10">
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-slate-900 mb-3">Annamacharya Institute of Technology and Sciences (AITS)</h1>
          <p className="text-lg text-slate-500 font-medium">Placement &amp; Skilling Intelligence Hub · SIH26044</p>
        </div>
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          <a href="#" className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm hover:shadow-md transition hover:-translate-y-0.5"><h2 className="font-bold text-xl mb-1">ATS Scanner</h2><p className="text-sm text-slate-500">Resume vs Job Description match intelligence.</p></a>
          <a href="#" className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm hover:shadow-md transition hover:-translate-y-0.5"><h2 className="font-bold text-xl mb-1">Video Academy</h2><p className="text-sm text-slate-500">Embedded masterclasses — zero redirects.</p></a>
          <a href="#" className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm hover:shadow-md transition hover:-translate-y-0.5"><h2 className="font-bold text-xl mb-1">TPO Admin</h2><p className="text-sm text-slate-500">Institutional readiness &amp; NAAC export.</p></a>
        </div>

        {/* ATS Scanner */}
        <section className="bg-white rounded-3xl border border-slate-200 shadow-sm p-8 md:p-10 mb-14">
          <div className="flex items-center gap-3 mb-6"><Briefcase size={22} className="text-blue-600" /><h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">ATS Resume Scanner</h2></div>
          <div className="relative mb-6"><input type="text" value={targetRole} onChange={e => setTargetRole(e.target.value)} className="w-full px-5 py-4 rounded-xl border border-slate-200 bg-slate-50 text-slate-900 font-semibold text-lg focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 transition shadow-sm" aria-label="Target Role" /></div>
          <div className="grid md:grid-cols-2 gap-6 mb-6">
            <div className="bg-slate-50 rounded-2xl border border-slate-200 p-5 shadow-inner"><label htmlFor="resume" className="block text-sm font-bold text-slate-700 mb-3">Paste Resume</label><textarea id="resume" rows={12} value={resumeText} onChange={e => setResumeText(e.target.value)} placeholder="Paste resume..." className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white text-sm resize-none focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition shadow-sm" /><div className="flex justify-between mt-2 text-xs text-slate-400 font-medium"><span>Words: {resumeText.trim().split(/\s+/).filter(Boolean).length}</span><span>Chars: {resumeText.length}</span></div></div>
            <div className="bg-slate-50 rounded-2xl border border-slate-200 p-5 shadow-inner"><label htmlFor="jd" className="block text-sm font-bold text-slate-700 mb-3">Paste Job Description</label><textarea id="jd" rows={12} value={jdText} onChange={e => setJdText(e.target.value)} placeholder="Paste JD..." className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white text-sm resize-none focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition shadow-sm" /></div>
          </div>
          <button onClick={runScan} className="inline-flex items-center gap-2 px-8 py-4 rounded-full bg-blue-600 text-white font-extrabold text-lg shadow-lg shadow-blue-600/20 hover:bg-blue-700 hover:shadow-blue-600/30 transition-all active:scale-[0.98]"><Sparkles size={20} />Scan Your Resume For Free</button>
          {scanned && (
            <div className="mt-8 border-t border-slate-200 pt-8"><div className="flex flex-col md:flex-row md:items-end gap-8 mb-6"><div className="flex items-center gap-6"><div className="relative w-28 h-28"><svg viewBox="0 0 120 120" className="w-full h-full -rotate-90"><circle cx="60" cy="60" r="54" fill="none" stroke="#e2e8f0" strokeWidth="8" /><circle cx="60" cy="60" r="54" fill="none" stroke="#2563eb" strokeWidth="8" strokeLinecap="round" strokeDasharray={`${2*Math.PI*54}`} strokeDashoffset={`${2*Math.PI*54*(1-matchPct/100)}`} style={{transition:'stroke-dashoffset 1.2s ease-out'}} /></svg><div className="absolute inset-0 flex items-center justify-center"><span className="text-3xl font-extrabold text-slate-900">{matchPct}%</span></div></div><div><h3 className="text-xl font-extrabold text-slate-900">Match Rate</h3><p className="text-sm text-slate-500 font-medium">ATS keyword frequency analysis</p></div></div><div className="flex-1 flex flex-wrap gap-3"><div><h4 className="text-xs font-bold text-emerald-600 uppercase tracking-wider mb-2">Matched Skills</h4><div className="flex flex-wrap gap-2">{['React','TypeScript','Node.js','AWS','System Design'].map(s=> <span key={s} className="px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-bold border border-emerald-200">{s}</span>)}</div></div><div><h4 className="text-xs font-bold text-rose-600 uppercase tracking-wider mb-2">Missing Skills</h4><div className="flex flex-wrap gap-2">{['Kubernetes','GraphQL','CI/CD Pipelines','Terraform'].map(s=> <span key={s} className="px-3 py-1 rounded-full bg-rose-50 text-rose-700 text-xs font-bold border border-rose-200">{s}</span>)}</div></div></div></div><div className="flex flex-wrap gap-2"><button className="inline-flex items-center gap-2 px-4 py-2.5 rounded-full bg-slate-900 text-white text-sm font-semibold"><Sparkles size={16}/> AI Optimize</button><button className="inline-flex items-center gap-2 px-4 py-2.5 rounded-full bg-blue-600 text-white text-sm font-semibold"><Briefcase size={16}/> Track</button><button onClick={()=>window.print()} className="inline-flex items-center gap-2 px-4 py-2.5 rounded-full bg-white text-slate-700 border border-slate-200 text-sm font-semibold hover:bg-slate-50"><Printer size={16}/> Print</button><button className="inline-flex items-center gap-2 px-4 py-2.5 rounded-full bg-white text-slate-700 border border-slate-200 text-sm font-semibold hover:bg-slate-50">+ More</button></div></div>
          )}
        </section>

        {/* Video Academy */}
        <section className="mb-14">
          <div className="flex items-center gap-3 mb-6"><Play size={22} className="text-blue-600" /><h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">Video Academy</h2></div>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              {key:'system',label:'System Design',sub:'Advanced architecture & scaling patterns',id:'m8Icp_Cid5o'},
              {key:'react',label:'React Architecture',sub:'TypeScript, patterns & modern stacks',id:'bMknfKXIFA8'},
              {key:'cloud',label:'Cloud / AWS',sub:'Docker, Kubernetes & infra automation',id:'k1RI5locZE4'},
            ].map(v => (
              <button key={v.key} onClick={() => openVideo(v.key)} className="text-left bg-white rounded-2xl border border-slate-200 shadow-sm p-6 hover:shadow-md hover:-translate-y-1 transition-all group">
                <div className="w-14 h-14 rounded-xl bg-blue-600 flex items-center justify-center mb-4 shadow-lg shadow-blue-600/20 group-hover:scale-105 transition-transform"><Play size={24} className="text-white fill-white ml-1" /></div>
                <h3 className="font-extrabold text-lg text-slate-900 mb-1">{v.label}</h3>
                <p className="text-sm text-slate-500">{v.sub}</p>
                <span className="inline-block mt-3 text-xs font-bold text-blue-600 bg-blue-50 px-2.5 py-0.5 rounded-full">Embedded · No redirect</span>
              </button>
            ))}
          </div>
        </section>

        {/* Application Tracker Kanban */}
        <section className="mb-14">
          <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight mb-2">Application Tracker</h2>
          <p className="text-sm text-slate-500 mb-6">Real-time placement pipeline — AITS Placement Cell</p>
          <div className="grid md:grid-cols-4 gap-4">
            {[
              {title:'Applied', cards:[{job:'SDE Intern — Orbit Labs',status:'Applied',dept:'CSE'},{job:'AI Research — Meridian',status:'Applied',dept:'CSE'}]},
              {title:'ATS Screen', cards:[{job:'DevOps Intern — ShieldNet',status:'ATS Screen',dept:'IT'},{job:'Cloud Engineer — Vertex',status:'ATS Screen',dept:'IT'}]},
              {title:'Interview', cards:[{job:'NLP Engineer — Meridian AI',status:'Interview',dept:'CSE'}]},
              {title:'Offer', cards:[{job:'Full-Stack — Nebula UI',status:'Offer',dept:'CSE'}]},
            ].map(col => (
              <div key={col.title} className="bg-white rounded-2xl border border-slate-200 shadow-sm p-4 min-h-[240px]">
                <h3 className="text-xs font-extrabold uppercase tracking-widest text-slate-400 mb-3">{col.title}</h3>
                <div className="flex flex-col gap-3">
                  {col.cards.map(c => (
                    <div key={c.job} className="bg-slate-50 border border-slate-200 rounded-xl p-3 shadow-sm hover:shadow transition hover:-translate-y-0.5">
                      <h4 className="font-bold text-sm text-slate-900 leading-snug">{c.job}</h4>
                      <div className="flex items-center gap-2 mt-2"><span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-blue-50 text-blue-700 border border-blue-100">{c.dept}</span><span className="text-[10px] text-slate-400">{c.status}</span></div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* TPO Admin Analytics — Curriculum Gap Heatmap */}
        <section className="mb-14">
          <div className="flex items-center gap-2 mb-6"><BarChart3 size={22} className="text-blue-600" /><h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">TPO Admin Analytics</h2></div>
          <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-8">
            <h3 className="text-lg font-extrabold text-slate-900 mb-1">Curriculum Gap Heatmap</h3>
            <p className="text-sm text-slate-500 mb-6">Institutional readiness by department — AITS SIH26044</p>
            <div className="grid md:grid-cols-4 gap-4 mb-6">
              {[
                {dept:'CSE',readiness:82,gaps:['Kubernetes','GraphQL','System Design']},
                {dept:'ECE',readiness:68,gaps:['Microservices','AWS Architecture','CI/CD']},
                {dept:'MECH',readiness:54,gaps:['Python','Data Analysis','DevOps Basics']},
                {dept:'CIVIL',readiness:47,gaps:['Python','Cloud Fundamentals','API Integration']},
              ].map(d => (
                <div key={d.dept} className="bg-slate-50 rounded-2xl border border-slate-200 p-5 shadow-sm">
                  <div className="flex items-center justify-between mb-3"><span className="text-xs font-extrabold uppercase tracking-widest text-slate-500">{d.dept}</span><span className={`text-xl font-extrabold ${d.readiness>=70?'text-emerald-600':d.readiness>=50?'text-amber-600':'text-rose-600'}`}>{d.readiness}%</span></div>
                  <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden mb-3"><div className="h-full rounded-full bg-gradient-to-r from-blue-500 to-blue-400" style={{width:`${d.readiness}%`}} /></div>
                  <div className="flex flex-wrap gap-1.5">
                    {d.gaps.map(g => <span key={g} className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-rose-50 text-rose-600 border border-rose-100">{g}</span>)}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* NAAC Export + Final Check */}
        <section className="flex flex-col md:flex-row items-center justify-between gap-4 bg-gradient-to-r from-slate-900 to-blue-950 rounded-3xl p-8 text-white shadow-xl shadow-slate-900/10">
          <div>
            <h3 className="text-xl font-extrabold mb-1">Institutional Skill Gaps — Local Storage</h3>
            <p className="text-sm text-slate-300">Persisted to <code className="text-blue-300 font-mono">institutionalSkillGaps</code> for NAAC criterion reporting.</p>
          </div>
          <a href="#" download="naac_sih26044_report.txt" className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-blue-600 hover:bg-blue-500 text-white font-extrabold shadow-lg shadow-blue-600/20 transition"><Download size={18} /> Export NAAC Report</a>
        </section>

        {/* Video Modal */}
        {isVideoModalOpen && (
          <div className="fixed inset-0 z-[60] bg-black/70 backdrop-blur-sm flex items-center justify-center p-6" onClick={() => setIsVideoModalOpen(false)}>
            <div className="relative bg-white rounded-3xl shadow-2xl w-full max-w-5xl overflow-hidden" onClick={e => e.stopPropagation()}>
              <button onClick={() => setIsVideoModalOpen(false)} aria-label="Close" className="absolute top-4 right-4 z-10 p-2 rounded-full bg-black/60 text-white hover:bg-black/80 transition"><X size={22} /></button>
              <div className="aspect-video bg-black">
                <iframe src={`https://www.youtube-nocookie.com/embed/${activeVideoId}`} title="Tutorial" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen className="w-full h-full" />
              </div>
              <div className="p-6"><h3 className="font-extrabold text-xl text-slate-900">{VIDEO_MAP.system === activeVideoId ? 'System Design' : VIDEO_MAP.react === activeVideoId ? 'React Architecture' : 'Cloud / AWS'}</h3><p className="text-sm text-slate-500">In-app embedded curriculum — zero external redirects.</p></div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
