import { useState } from 'react';
import { Sparkles, TrendingUp, Zap, ArrowRight, BadgeCheck, AlertCircle } from 'lucide-react';
import { degrees, skills } from '../data/taxonomy';
import { getTopRecommendations } from '../lib/suggestionEngine';

export default function AIRecommendationPanel({ studentSkills = ['React', 'TypeScript'], studentBranch = 'B.Tech CSE', studentDegree = 'B.Tech' }) {
  const [branchInput, setBranchInput] = useState(studentBranch);
  const [degreeInput, setDegreeInput] = useState(studentDegree);
  const [skillsInput, setSkillsInput] = useState(Array.isArray(studentSkills) ? studentSkills.join(', ') : String(studentSkills));
  const [recs, setRecs] = useState(null);
  const [show, setShow] = useState(false);

  const handleRun = () => {
    const parsedSkills = skillsInput.split(/[,;]\s*/).map(s => s.trim()).filter(Boolean);
    const results = getTopRecommendations(parsedSkills, branchInput, degreeInput, 3);
    setRecs(results);
    setShow(true);
  };

  return (
    <section className="bg-gradient-to-br from-blue-950 via-slate-900 to-slate-950 rounded-3xl shadow-2xl border border-slate-800/50 p-8 md:p-10 mb-10">
      <div className="flex items-center gap-3 mb-2">
        <div className="w-10 h-10 rounded-2xl bg-emerald-500/20 flex items-center justify-center"><Zap size={22} className="text-emerald-400" /></div>
        <div><h2 className="text-2xl font-extrabold text-white tracking-tight">AI Suggestion Engine</h2><p className="text-slate-400 text-sm">Dynamic keyword-matching against live job database · 20+ real openings</p></div>
      </div>

      <div className="grid md:grid-cols-3 gap-4 mb-6 mt-6">
        <div>
          <label className="text-xs font-extrabold uppercase tracking-widest text-slate-500 mb-1.5 block">Degree / Qualification</label>
          <select value={degreeInput} onChange={e => setDegreeInput(e.target.value)} className="w-full px-3 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/30">
            {degrees.map(d => <option key={d} value={d}>{d}</option>)}
          </select>
        </div>
        <div>
          <label className="text-xs font-extrabold uppercase tracking-widest text-slate-500 mb-1.5 block">Branch / Specialization (any global)</label>
          <input type="text" value={branchInput} onChange={e => setBranchInput(e.target.value)} placeholder="e.g., B.Tech ECE, MBA Finance, B.Sc Nursing" className="w-full px-3 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/30" />
        </div>
        <div>
          <label className="text-xs font-extrabold uppercase tracking-widest text-slate-500 mb-1.5 block">Your Skills (comma-separated, 100+ available)</label>
          <input type="text" value={skillsInput} onChange={e => setSkillsInput(e.target.value)} placeholder="React, Python, VLSI, Data Analysis..." className="w-full px-3 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/30" />
        </div>
      </div>

      <button onClick={handleRun} className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-emerald-600 text-white font-extrabold shadow-lg shadow-emerald-600/20 hover:bg-emerald-500 transition">
        <Sparkles size={18} /> Run AI Match Algorithm
      </button>

      {show && recs && (
        <div className="mt-8">
          <div className="flex items-center gap-2 mb-5"><TrendingUp size={20} className="text-emerald-400" /><h3 className="text-lg font-extrabold text-white">Top 3 Highly Recommended</h3></div>
          <div className="grid md:grid-cols-3 gap-5">
            {recs.map((r, idx) => (
              <div key={r.id} className="relative bg-slate-800/60 rounded-3xl border border-slate-700/60 p-6 hover:border-emerald-500/40 transition shadow-lg">
                <div className="absolute -top-3 -left-3 bg-emerald-500 text-slate-950 text-xs font-extrabold px-3 py-0.5 rounded-full shadow-lg">#{idx + 1} Recommended</div>
                <div className="flex items-center justify-between mb-3">
                  <span className={`text-xs font-extrabold px-2 py-0.5 rounded-full ${r.workMode === 'Remote / Online' ? 'bg-emerald-500/20 text-emerald-300' : r.workMode === 'Hybrid' ? 'bg-amber-500/20 text-amber-300' : 'bg-sky-500/20 text-sky-300'}`}>{r.workMode}</span>
                  <span className="text-xs font-bold text-emerald-300">{r.score}% match</span>
                </div>
                <h4 className="text-xl font-extrabold text-white mb-1">{r.role}</h4>
                <p className="text-slate-400 text-sm font-medium mb-2">{r.company} · {r.location}</p>
                <div className="text-xs text-emerald-300 font-bold mb-3">{r.ctc || r.stipend}</div>
                <p className="text-sm text-slate-300 leading-relaxed mb-4">{r.description}</p>
                <div className="flex flex-wrap gap-1.5 mb-3">
                  {r.tags.map(t => <span key={t} className="px-2 py-0.5 rounded-full bg-slate-700 text-slate-300 text-[10px] font-bold border border-slate-600">{t}</span>)}
                </div>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-lg p-2"><div className="font-bold text-emerald-300">Matched</div><div className="text-slate-300">{r.matched.length}</div></div>
                  <div className="bg-rose-500/10 border border-rose-500/20 rounded-lg p-2"><div className="font-bold text-rose-300">Missing</div><div className="text-slate-300">{r.missing.length}</div></div>
                </div>
                <a href="#" className="mt-4 inline-flex items-center gap-1 text-sm font-bold text-emerald-300 hover:text-emerald-200 transition">Apply on portal <ArrowRight size={14}/></a>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="mt-8 pt-6 border-t border-slate-800/50 flex flex-wrap gap-4 text-xs text-slate-400 font-medium">
        <span className="flex items-center gap-1"><BadgeCheck size={14} className="text-emerald-400" /> 20+ genuine listings (real company names)</span>
        <span>·</span>
        <span>100+ technical & soft skills taxonomy</span>
        <span>·</span>
        <span>Global degrees (B.Tech to Ph.D., Nursing, Law, MBA)</span>
      </div>
    </section>
  );
}
