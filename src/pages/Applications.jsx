import { useState, useEffect } from 'react';
import { Clock, CheckCircle2, AlertTriangle, Briefcase, ChevronRight, RotateCcw } from 'lucide-react';

const STAGES = [
  { key: 'applied', label: 'Applied', desc: 'Submission received' },
  { key: 'screened', label: 'Resume Screened', desc: 'ATS / HR review complete' },
  { key: 'oa', label: 'Technical OA', desc: 'Online assessment done' },
  { key: 'interview', label: 'Interview', desc: 'Panel / manager round' },
  { key: 'offer', label: 'Offer / Feedback', desc: 'Final decision' },
];

export default function Applications() {
  const [apps, setApps] = useState([]);

  useEffect(() => {
    const raw = JSON.parse(localStorage.getItem('studentApplications') || '[]');
    setApps(raw.length ? raw : [
      { id: 1, role: 'Full-Stack React Engineer', company: 'TechNova Labs', stage: 'interview', feedback: 'Positive panel feedback — offer expected within 48h.', score: 88, createdAt: new Date(Date.now()-86400000*3).toISOString() },
      { id: 2, role: 'DevOps / AWS Associate', company: 'CloudScale', stage: 'oa', feedback: null, score: 72, createdAt: new Date(Date.now()-86400000*5).toISOString() },
    ]);
  }, []);

  const save = (a) => { localStorage.setItem('studentApplications', JSON.stringify(a)); setApps(a); };

  const simulateNext = (id) => {
    const idx = STAGES.findIndex(s => s.key === apps.find(x=>x.id===id)?.stage);
    if (idx === -1 || idx >= STAGES.length - 1) return;
    const n = apps.map(x => x.id === id ? { ...x, stage: STAGES[idx+1].key, feedback: idx+1 === STAGES.length-1 ? 'Congratulations! Offer extended. Welcome to the team.' : null } : x);
    save(n);
  };

  const stageIndex = (s) => STAGES.findIndex(st => st.key === s);

  return (
    <main className="bg-slate-50 min-h-screen pb-20 pt-6 px-6 lg:px-10 max-w-6xl mx-auto">
      <div className="flex items-center gap-3 mb-2"><Briefcase className="text-blue-600" size={28}/><h1 className="text-3xl font-extrabold text-slate-900">My Applications</h1></div>
      <p className="text-slate-500 mb-8">Live pipeline tracker — interactive demo for judges. Click <span className="font-extrabold text-blue-600">Simulate Next Round</span> to progress.</p>

      {apps.map(app => (
        <div key={app.id} className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <div><h3 className="text-xl font-extrabold text-slate-900">{app.role}</h3><p className="text-sm text-slate-500 font-medium">{app.company}</p></div>
            <div className="text-right"><div className="text-2xl font-extrabold text-blue-600">{app.score}%</div><div className="text-xs text-slate-400">Match Score</div></div>
          </div>

          {/* 5-stage pipeline */}
          <div className="flex items-center gap-2 mb-4">
            {STAGES.map((st, i) => {
              const idx = stageIndex(app.stage);
              const active = i <= idx;
              return (
                <div key={st.key} className="flex-1 relative">
                  <div className={`h-10 rounded-xl flex items-center justify-center text-xs font-extrabold shadow-sm transition ${active ? 'bg-blue-600 text-white shadow-blue-600/20' : 'bg-slate-100 text-slate-400 border border-slate-200'}`}>
                    {i+1}. {st.label}
                  </div>
                  {i < STAGES.length-1 && (
                    <ChevronRight className="absolute top-1/2 -translate-y-1/2 -right-3 text-slate-300" size={14} />
                  )}
                </div>
              );
            })}
          </div>

          <div className="flex items-center justify-between"><div className="text-xs text-slate-400">Applied {new Date(app.createdAt).toLocaleDateString()}</div>
            <button onClick={() => simulateNext(app.id)} className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-blue-600 text-white text-sm font-extrabold shadow-lg shadow-blue-600/20 hover:bg-blue-700 transition"><RotateCcw size={14}/> Simulate Next Round</button>
          </div>

          {app.feedback && <div className="mt-3 p-3 bg-emerald-50 border border-emerald-100 rounded-xl text-sm text-emerald-800 font-medium flex gap-2"><CheckCircle2 size={16} className="text-emerald-600 shrink-0"/> {app.feedback}</div>}
        </div>
      ))}
    </main>
  );
}
