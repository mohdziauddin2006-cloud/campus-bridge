import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { TrendingUp, BookOpen, Users, Award, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const gapData = [
  { dept: 'CSE', score: 82, gap: 'Low' },
  { dept: 'ECE', score: 68, gap: 'Medium' },
  { dept: 'MECH', score: 54, gap: 'High' },
  { dept: 'CIVIL', score: 47, gap: 'Critical' },
  { dept: 'AI&DS', score: 91, gap: 'Low' },
];

const skills = [
  { name: 'Python / ML', level: 92, status: 'Strong' },
  { name: 'React / Frontend', level: 78, status: 'Growing' },
  { name: 'Cloud / AWS', level: 65, status: 'Developing' },
  { name: 'Embedded / IoT', level: 41, status: 'Gap' },
];

export default function Dashboard() {
  return (
    <main className="bg-slate-50 min-h-screen pb-20">
      {/* Hero header */}
      <section className="bg-gradient-to-br from-blue-950 via-blue-900 to-slate-950 text-white px-8 lg:px-14 pt-14 pb-10">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight mb-3">Academia-Industry Collaboration</h1>
          <p className="text-blue-200 text-lg md:text-xl font-medium">AITS Placement Intelligence · Skill Readiness & Institutional Gap Analytics · SIH26044</p>
        </div>
      </section>

      <div className="max-w-6xl mx-auto px-6 lg:px-10 -mt-6">
        {/* Metric cards */}
        <div className="grid md:grid-cols-4 gap-5 mb-14">
          {[
            { label: 'Industry Readiness Index', val: '82%', sub: 'CSE Avg · +12 pts vs batch median', icon: TrendingUp, color: 'text-emerald-600' },
            { label: 'Active Mapped Skills', val: '18,490', sub: 'Verified competency tags', icon: BookOpen, color: 'text-blue-600' },
            { label: 'Industry Hiring Partners', val: '142', sub: 'Active recruiter pipeline', icon: Users, color: 'text-amber-600' },
            { label: 'Projected NAAC Score Avg', val: 'A+', sub: 'Criterion 1 & 2 readiness', icon: Award, color: 'text-violet-600' },
          ].map(m => (
            <div key={m.label} className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 hover:shadow-md transition">
              <div className="flex items-center gap-2 mb-2"><m.icon size={18} className={m.color} /><span className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400">{m.label}</span></div>
              <div className="text-3xl font-extrabold text-slate-900 mb-1">{m.val}</div>
              <div className="text-xs text-slate-500 font-medium">{m.sub}</div>
            </div>
          ))}
        </div>

        {/* Chart + Skills side-by-side */}
        <div className="grid lg:grid-cols-3 gap-8 mb-14">
          <div className="lg:col-span-2 bg-white rounded-3xl border border-slate-200 shadow-sm p-8">
            <h2 className="font-extrabold text-xl mb-1">Department Skill Gap Intelligence</h2>
            <p className="text-sm text-slate-500 mb-6">Readiness score by department — Batch 2026 · AITS Skilling Hub</p>
            <div className="h-72"><ResponsiveContainer width="100%" height="100%"><BarChart data={gapData}><XAxis dataKey="dept" tick={{fontSize:12}} /><YAxis domain={[0,100]} tick={{fontSize:12}} /><Tooltip />{gapData.map((e,i)=> <Cell key={e.dept} fill={i===0?'#2563eb':i===1?'#38bdf8':i===2?'#f59e0b':i===3?'#f43f5e':'#10b981'} />)}<Bar dataKey="score" radius={[6,6,0,0]} /></BarChart></ResponsiveContainer></div>
          </div>
          <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-8">
            <h2 className="font-extrabold text-xl mb-4">Skill Diagnostic</h2>
            <div className="space-y-4">
              {skills.map(s => (
                <div key={s.name}><div className="flex justify-between text-sm font-bold mb-1"><span className="text-slate-800">{s.name}</span><span className={s.status==='Gap'?'text-rose-600':s.status==='Developing'?'text-amber-600':'text-emerald-600'}>{s.level}%</span></div>
                <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden"><div className="h-full rounded-full bg-gradient-to-r from-blue-500 to-blue-400" style={{width:`${s.level}%`}} /></div>
                <div className="text-[11px] font-medium text-slate-400 mt-0.5">{s.status}</div>
              </div>
            ))}
            </div>
          </div>
        </div>

        {/* Learning paths */}
        <div className="bg-gradient-to-br from-blue-950 to-slate-900 rounded-3xl p-8 md:p-10 text-white shadow-2xl shadow-blue-950/20 mb-16">
          <div className="flex items-end justify-between mb-6"><div><h2 className="text-2xl font-extrabold mb-1">Matched Learning Paths</h2><p className="text-blue-200 text-sm">Curated academy modules linked to your skill gap profile</p></div><Link to="/academy" className="inline-flex items-center gap-1 text-sm font-extrabold bg-blue-600 hover:bg-blue-500 px-4 py-2 rounded-full transition">Browse Academy <ArrowRight size={16}/></Link></div>
          <div className="grid md:grid-cols-4 gap-4">
            {[{t:'System Design',d:'Advanced architecture & scaling patterns',id:'m8Icp_Cid5o'},{t:'React & TS',d:'Modern component patterns',id:'bMknfKXIFA8'},{t:'Cloud / AWS',d:'Docker, Kubernetes, infra',id:'k1RI5locZE4'},{t:'Core DSA',d:'Algorithmic engineering',id:'RBSGKlAoi34'}].map(p => <Link key={p.t} to="/academy" className="bg-white/10 hover:bg-white/15 border border-white/10 rounded-2xl p-5 transition backdrop-blur"><h3 className="font-extrabold mb-1">{p.t}</h3><p className="text-sm text-blue-100">{p.d}</p><span className="inline-block mt-3 text-xs font-bold bg-blue-500/20 px-2 py-0.5 rounded-full">Embedded</span></Link>)}
          </div>
        </div>
      </div>
    </main>
  );
}
