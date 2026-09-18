import { useState } from 'react';
import { AlertTriangle, CheckCircle2, Sparkles, Zap, ArrowRight } from 'lucide-react';

export default function MatchPredictor({ skills = ['React','TypeScript','Node','AWS'], jobSkills = ['React','System Design','Cloud Native'], onApply }) {
  const [open, setOpen] = useState(false);

  const studentSet = new Set(skills);
  const jobSet = new Set(jobSkills);
  const matched = [...studentSet].filter(s => jobSet.has(s));
  const missing = [...jobSet].filter(s => !studentSet.has(s));
  const score = Math.round((matched.length / jobSet.size) * 100);

  const belowThreshold = score < 75;

  return (
    <>
      <button onClick={() => setOpen(true)} className="w-full py-3 rounded-full bg-blue-600 text-white font-extrabold shadow-lg shadow-blue-600/20 hover:bg-blue-700 transition flex items-center justify-center gap-2"><Sparkles size={18}/> Apply Now · Predict Match</button>

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4" onClick={() => setOpen(false)}>
          <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 max-w-lg w-full p-8" onClick={e => e.stopPropagation()}>
            <div className="flex items-center gap-3 mb-4"><Sparkles size={28} className="text-blue-600"/><h2 className="text-xl font-extrabold text-slate-900">Pre-Application Match</h2></div>
            <div className="flex items-center gap-6 mb-6 p-4 bg-blue-50 rounded-2xl border border-blue-100">
              <div><div className="text-xs font-extrabold uppercase tracking-wider text-blue-600">Match Score</div><div className={`text-4xl font-extrabold ${belowThreshold ? 'text-amber-600' : 'text-emerald-600'}`}>{score}%</div></div>
              <div className="flex-1"><div className="h-3 bg-slate-200 rounded-full overflow-hidden"><div className="h-full rounded-full bg-blue-600 transition-all" style={{width:`${score}%`}} /></div></div>
            </div>

            <div className="grid grid-cols-2 gap-3 mb-4">
              <div><div className="text-xs font-bold text-emerald-600 mb-2">Strengths</div><div className="flex flex-wrap gap-1.5">{matched.map(s => <span key={s} className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-xs font-extrabold border border-emerald-200">{s}</span>)}</div></div>
              <div><div className="text-xs font-bold text-rose-600 mb-2">Gaps</div><div className="flex flex-wrap gap-1.5">{missing.map(s => <span key={s} className="px-2 py-0.5 rounded-full bg-rose-50 text-rose-700 text-xs font-extrabold border border-rose-200">{s}</span>)}</div></div>
            </div>

            {belowThreshold && (
              <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-sm text-amber-800 font-medium mb-4 flex gap-2"><AlertTriangle size={16} className="shrink-0 text-amber-600"/> Skill Gap Alert: You are missing key skills. Take the recommended crash course first or apply anyway?</div>
            )}

            <div className="flex gap-3">
              <button onClick={() => { setOpen(false); onApply?.(score); }} className="flex-1 py-3 rounded-full bg-blue-600 text-white font-extrabold shadow-lg shadow-blue-600/20 hover:bg-blue-700 transition">Apply Anyway</button>
              <button onClick={() => setOpen(false)} className="flex-1 py-3 rounded-full bg-slate-100 text-slate-700 font-extrabold hover:bg-slate-200 transition">Close</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
