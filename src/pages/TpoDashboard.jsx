import { useState } from 'react';
import { Download, Filter, BarChart3 } from 'lucide-react';

export default function TpoDashboard() {
  const [filterDept, setFilterDept] = useState('All');

  const gaps = [
    { dept: 'CSE', score: 82, missing: 'Kubernetes, GraphQL', readiness: 'High' },
    { dept: 'ECE', score: 68, missing: 'Microservices, AWS Arch', readiness: 'Medium' },
    { dept: 'MECH', score: 54, missing: 'Python, Data Analysis', readiness: 'Low' },
    { dept: 'CIVIL', score: 47, missing: 'Cloud Fundamentals', readiness: 'Critical' },
  ];

  const downloadReport = () => {
    const text = `AITS NAAC Criterion 1 & 2 Report — Batch 2026\n\nDepartment Readiness:\n` + gaps.map(g=>`${g.dept}: ${g.score}% · ${g.missing}`).join('\n') + `\n\nInstitutional Skill Gaps — localStorage key: institutionalSkillGaps`;
    const blob = new Blob([text], {type:'text/plain'});
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a'); a.href = url; a.download = 'naac_sih26044_criterion_report.txt'; a.click(); URL.revokeObjectURL(url);
  };

  return (
    <main className="bg-slate-50 min-h-screen pb-20 pt-6 px-6 lg:px-10 max-w-6xl mx-auto">
      <button onClick={() => window.history.back()} className="text-sm text-blue-600 font-bold mb-4">← Back to Portal</button>
      <h1 className="text-3xl font-extrabold text-slate-900 mb-2">TPO Admin Analytics</h1>
      <p className="text-slate-500 mb-6">Institutional Skill Gap Heatmap · Batch 2026 · AITS SIH26044</p>

      <div className="flex items-center gap-3 mb-6">
        <select value={filterDept} onChange={e=>setFilterDept(e.target.value)} className="px-3 py-2 rounded-lg border border-slate-200 bg-white text-sm font-semibold"><option>All</option><option>CSE</option><option>ECE</option><option>MECH</option><option>CIVIL</option></select>
        <button onClick={downloadReport} className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-blue-600 text-white font-extrabold shadow-lg shadow-blue-600/20 hover:bg-blue-700 transition"><Download size={18}/> Export NAAC Report</button>
      </div>

      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden mb-10">
        <table className="w-full text-sm">
          <thead className="bg-slate-900 text-white"><tr><th className="text-left px-5 py-3 font-medium">Dept</th><th className="text-left px-5 py-3 font-medium">Readiness</th><th className="text-left px-5 py-3 font-medium">Critical Gaps</th><th className="text-left px-5 py-3 font-medium">Status</th></tr></thead>
          <tbody>
            {gaps.filter(g=>filterDept==='All'||g.dept===filterDept).map(g => (
              <tr key={g.dept} className="border-b border-slate-100 hover:bg-blue-50/40"><td className="px-5 py-3 font-bold">{g.dept}</td><td className="px-5 py-3"><div className="w-24 h-2 bg-slate-200 rounded-full overflow-hidden"><div className="h-full bg-gradient-to-r from-blue-500 to-blue-400" style={{width:`${g.score}%`}} /></div><div className="text-xs text-slate-500 font-medium mt-1">{g.score}%</div></td><td className="px-5 py-3 text-slate-600">{g.missing}</td><td className="px-5 py-3"><span className={`text-xs font-bold px-2 py-0.5 rounded-full border ${g.readiness==='Critical'?'bg-rose-50 text-rose-700 border-rose-200':g.readiness==='Low'?'bg-amber-50 text-amber-700 border-amber-200':'bg-emerald-50 text-emerald-700 border-emerald-200'}`}>{g.readiness}</span></td></tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="bg-gradient-to-r from-blue-950 to-slate-900 rounded-3xl p-8 text-white shadow-2xl">
        <h3 className="text-xl font-extrabold mb-2">Reverse Talent Matchmaking</h3>
        <p className="text-blue-200 text-sm mb-4">Mock recruiter queries against student competency database.</p>
        <div className="flex flex-wrap gap-2">
          {['Full-Stack React', 'DevOps / AWS', 'AI / NLP', 'VLSI Design'].map(tag => <span key={tag} className="px-3 py-1 rounded-full bg-white/10 border border-white/10 text-sm font-semibold">{tag}</span>)}
        </div>
      </div>
    </main>
  );
}
