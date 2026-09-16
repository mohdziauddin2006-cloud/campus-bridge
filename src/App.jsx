import { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import {
  GraduationCap, Users, Building2, TrendingUp, Download, BarChart3,
  Lightbulb, CheckCircle2, ArrowRight, Sparkles, Shield, Zap, BookOpen
} from 'lucide-react';

const tabs = ['TPO Admin Analytics', 'Student Skill Diagnostic', 'Recruiter Matching'];

/* ─────────── Mock Data ─────────── */
const metricCards = [
  { title: 'Active Internships', value: '3,842', sub: '+14% vs last year', icon: GraduationCap, accent: 'text-emerald-400' },
  { title: 'Mapped Skills', value: '18,490', sub: '+22% vs last year', icon: Lightbulb, accent: 'text-amber-400' },
  { title: 'Industry Partners', value: '142', sub: '+8 new this quarter', icon: Building2, accent: 'text-sky-400' },
  { title: 'NAAC Score Avg.', value: 'A+', sub: 'Top 3% nationally', icon: Shield, accent: 'text-violet-400' },
];

const gapData = [
  { dept: 'CS', gap: 18, filled: 82 },
  { dept: 'ECE', gap: 24, filled: 76 },
  { dept: 'Mech', gap: 31, filled: 69 },
  { dept: 'CIVIL', gap: 27, filled: 73 },
  { dept: 'EE', gap: 14, filled: 86 },
  { dept: 'Bio', gap: 21, filled: 79 },
];

const studentSkills = [
  { label: 'Python / Data Science', pct: 92, color: 'bg-emerald-400' },
  { label: 'React / Frontend', pct: 88, color: 'bg-sky-400' },
  { label: 'Cloud (AWS/GCP)', pct: 65, color: 'bg-violet-400' },
  { label: 'System Design', pct: 72, color: 'bg-amber-400' },
  { label: 'UI/UX Principles', pct: 58, color: 'bg-rose-400' },
];

const jobs = [
  { title: 'Frontend Engineer (React)', company: 'Orbit Labs', match: 96, tags: ['React','TypeScript','Tailwind'], salary: '₹ 28–42 LPA' },
  { title: 'Data Analyst — AI', company: 'Meridian AI', match: 91, tags: ['Python','SQL','ML'], salary: '₹ 18–30 LPA' },
  { title: 'Backend Intern (Go)', company: 'Vertex Systems', match: 83, tags: ['Go','Postgres','gRPC'], salary: '₹ 12–18 LPA' },
];

export default function App() {
  const [tab, setTab] = useState(0);

  return (
    <div className="min-h-screen bg-[#020617] text-slate-50 font-sans selection:bg-emerald-500/30">
      {/* Background subtle radial glow */}
      <div className="fixed top-[-10%] left-[-10%] w-[60vw] h-[60vw] rounded-full bg-emerald-500/10 blur-[120px] pointer-events-none z-0" />
      <div className="fixed bottom-[-10%] right-[-10%] w-[60vw] h-[60vw] rounded-full bg-violet-500/10 blur-[120px] pointer-events-none z-0" />

      {/* Top Navigation */}
      <nav className="sticky top-0 z-50 backdrop-blur-xl bg-slate-950/70 border-b border-white/5">
        <div className="max-w-7xl mx-auto px-6 lg:px-10 h-20 flex items-center justify-between gap-6">
          <a href="#" className="flex items-center gap-3 group shrink-0">
            <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-emerald-500/20 to-violet-500/20 border border-white/10 flex items-center justify-center shadow-lg shadow-emerald-500/10 group-hover:shadow-emerald-500/20 transition">
              <SpellIcon />
            </div>
            <div className="leading-none">
              <div className="text-sm font-extrabold tracking-tight text-slate-50">SIH26044</div>
              <div className="text-[10px] font-medium text-slate-500 tracking-wide mt-0.5">Academia · Industry</div>
            </div>
          </a>

          <div className="flex items-center gap-1 p-1 rounded-full bg-white/[0.03] border border-white/[0.06] backdrop-blur-md shadow-inner shadow-black/10">
            {tabs.map((t, i) => (
              <button
                key={t}
                onClick={() => setTab(i)}
                className={`px-4 py-2 text-sm font-medium rounded-full transition-all duration-300 ${
                  tab === i
                    ? 'bg-gradient-to-r from-emerald-500/20 to-violet-500/20 text-emerald-300 shadow-lg shadow-emerald-500/10 border border-white/10'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-white/[0.04]'
                }`}
              >
                {t}
              </button>
            ))}
          </div>
        </div>
      </nav>

      <main className="relative z-10 max-w-7xl mx-auto px-6 lg:px-10 py-12 space-y-14">
        {/* Header */}
        <header className="animate-fade-up">
          <div className="flex items-center gap-3 mb-3">
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold tracking-wider uppercase bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">SIH 2026 — Problem Statement</span>
            <span className="text-[11px] text-slate-500 font-mono">v1.0.0</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-extrabold leading-[1.05] tracking-tight bg-gradient-to-br from-slate-50 via-slate-200 to-slate-400 bg-clip-text text-transparent">
            Academia–Industry Collaboration<br />
            <span className="text-emerald-400">Skill Mapping & Internships</span>
          </h1>
          <p className="mt-5 text-lg text-slate-400 max-w-2xl leading-relaxed">
            A unified platform bridging training institution diagnostics with recruiter matchmaking, driven by real-time dashboards, NAAC-aligned reporting, and predictive gap analysis.
          </p>
        </header>

        {/* ───── Tab 0: TPO Admin Analytics (default) ───── */}
        {tab === 0 && (
          <section className="space-y-10 animate-fade-up">
            {/* Metrics */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {metricCards.map((m, i) => (
                <div key={m.title} className="relative overflow-hidden rounded-2xl bg-gradient-to-b from-slate-900 to-[#080f1c] border border-white/[0.06] shadow-xl shadow-black/40 p-7 group hover:-translate-y-1 transition duration-300">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-white/[0.03] to-transparent rounded-full -translate-y-1/2 translate-x-1/3" />
                  <div className="flex items-start justify-between mb-6">
                    <div className={`h-11 w-11 rounded-xl bg-gradient-to-br from-slate-800 to-slate-900 border border-white/[0.08] flex items-center justify-center shadow-inner shadow-black/20 ${m.accent}`}>
                      <m.icon size={20} strokeWidth={2} />
                    </div>
                    <TrendBadge />
                  </div>
                  <div className="text-3xl font-extrabold tracking-tight text-slate-50 mb-1">{m.value}</div>
                  <div className="text-sm font-medium text-slate-300 mb-1">{m.title}</div>
                  <div className="text-xs text-slate-500 font-mono">{m.sub}</div>
                </div>
              ))}
            </div>

            {/* Chart + Download */}
            <div className="grid lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 rounded-3xl bg-gradient-to-b from-slate-900 to-[#080f1c] border border-white/[0.06] shadow-2xl shadow-black/40 p-7 md:p-8">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h2 className="text-xl font-bold tracking-tight text-slate-50">Skill Gaps by Department</h2>
                    <p className="text-sm text-slate-500 mt-1">Percentage of unmet industry-required competencies (2025–26 academic cycle)</p>
                  </div>
                  <div className="h-9 w-9 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center border border-emerald-500/20 shadow-inner shadow-emerald-500/5">
                    <BarChart3 size={18} />
                  </div>
                </div>
                <div className="h-72">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={gapData} barSize={26} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
                      <XAxis dataKey="dept" tick={{ fill: '#94a3b8', fontSize: 12, fontWeight: 600 }} axisLine={{ stroke: '#334155' }} tickLine={false} />
                      <YAxis tick={{ fill: '#94a3b8', fontSize: 12 }} axisLine={false} tickLine={false} domain={[0, 100]} />
                      <Tooltip
                        cursor={{ fill: '#33415533', radius: 8 }}
                        contentStyle={{
                          background: '#0f172a', border: '1px solid #334155', borderRadius: 12,
                          color: '#f8fafc', fontSize: 13, boxShadow: '0 10px 30px rgba(0,0,0,0.6)',
                        }}
                        labelStyle={{ color: '#34d399', fontWeight: 700 }}
                      />
                      <Bar dataKey="gap" name="Gap %" fill="#34d399" radius={[6, 6, 0, 0]} />
                      <Bar dataKey="filled" name="Filled %" fill="#8b5cf6" radius={[6, 6, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
                <div className="flex items-center gap-6 mt-4 text-xs font-medium text-slate-400">
                  <div className="flex items-center gap-2"><span className="w-3 h-3 rounded-sm bg-emerald-400" /> Gap %</div>
                  <div className="flex items-center gap-2"><span className="w-3 h-3 rounded-sm bg-violet-500" /> Filled %</div>
                </div>
              </div>

              <div className="rounded-3xl bg-gradient-to-b from-slate-900 to-[#080f1c] border border-white/[0.06] shadow-2xl shadow-black/40 p-7 md:p-8 flex flex-col justify-between gap-6">
                <div>
                  <h2 className="text-xl font-bold tracking-tight text-slate-50 mb-2">NAAC Report — 2025</h2>
                  <p className="text-sm text-slate-400 leading-relaxed">Generate a comprehensive institutional accreditation report aligned with NAAC grading criteria: curriculum delivery, faculty competence, research output, and student success.</p>
                  <div className="mt-6 space-y-3">
                    {['Curriculum Mapping', 'Faculty Skill Index', 'Research Portfolio', 'Student Placement'].map((item) => (
                      <div key={item} className="flex items-center gap-3 text-sm text-slate-300"><CheckCircle2 size={16} className="text-emerald-400 shrink-0" /> <span>{item}</span></div>
                    ))}
                  </div>
                </div>
                <button className="w-full py-3.5 rounded-xl bg-gradient-to-r from-emerald-600 to-violet-600 text-white font-bold shadow-lg shadow-emerald-600/20 hover:brightness-110 active:scale-[0.98] transition flex items-center justify-center gap-2.5">
                  <Download size={18} /> Download NAAC Report
                </button>
              </div>
            </div>
          </section>
        )}

        {/* ───── Tab 1: Student Skill Diagnostic ───── */}
        {tab === 1 && (
          <section className="space-y-10 animate-fade-up">
            <div className="grid lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 rounded-3xl bg-gradient-to-b from-slate-900 to-[#080f1c] border border-white/[0.06] shadow-2xl shadow-black/40 p-8 md:p-10">
                <div className="flex items-center gap-3 mb-8">
                  <div className="h-12 w-12 rounded-2xl bg-gradient-to-br from-violet-500/20 to-sky-500/20 border border-violet-400/20 flex items-center justify-center shadow-lg shadow-violet-500/10">
                    <BookOpen size={22} className="text-violet-300" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-extrabold tracking-tight">Skill Diagnostic Report</h2>
                    <p className="text-slate-400 text-sm">Aarav Mehta — B.Tech, Computer Science — Batch 2026</p>
                  </div>
                </div>

                <div className="space-y-7">
                  {studentSkills.map((s) => (
                    <div key={s.label}>
                      <div className="flex items-center justify-between mb-2.5 text-sm font-semibold text-slate-200">
                        <span>{s.label}</span>
                        <span className="font-mono text-xs text-slate-500">{s.pct}%</span>
                      </div>
                      <div className="h-3 w-full rounded-full bg-slate-800 overflow-hidden ring-1 ring-white/5">
                        <div className={`h-full rounded-full ${s.color} shadow-[0_0_12px_rgba(255,255,255,0.15)] transition-all duration-1000`} style={{ width: `${s.pct}%` }} />
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-8 p-5 rounded-2xl bg-emerald-500/[0.07] border border-emerald-400/20 text-emerald-200 text-sm leading-relaxed">
                  <strong className="text-emerald-300">Recommendation:</strong> You are within the top 12% of peers for data science and frontend capabilities. Prioritize cloud architecture and system design to close the remaining 28% gap and unlock senior-track internships at tier-1 product firms.
                </div>
              </div>

              <div className="space-y-6">
                <div className="rounded-3xl bg-gradient-to-b from-slate-900 to-[#080f1c] border border-white/[0.06] p-7 shadow-xl shadow-black/30">
                  <h3 className="font-bold text-lg mb-4">Matched Learning Paths</h3>
                  <div className="space-y-3">
                    {[
                      { title: 'Advanced System Design', score: 92, tag: 'Recommended' },
                      { title: 'Cloud Native Architecture', score: 78, tag: 'Next Step' },
                      { title: 'UI/UX Foundations', score: 58, tag: 'Beginner' },
                    ].map((lp) => (
                      <a key={lp.title} href="#" className="block p-4 rounded-xl bg-slate-850 border border-white/[0.06] hover:bg-slate-800 hover:border-emerald-400/30 transition group">
                        <div className="flex items-center justify-between mb-1.5">
                          <span className="font-semibold text-sm group-hover:text-emerald-300 transition">{lp.title}</span>
                          <span className="text-xs font-mono text-emerald-400">{lp.score}% match</span>
                        </div>
                        <span className="text-xs font-medium text-slate-500 bg-white/[0.05] px-2 py-0.5 rounded-md">{lp.tag}</span>
                      </a>
                    ))}
                  </div>
                </div>

                <div className="rounded-3xl bg-gradient-to-b from-slate-900 to-[#080f1c] border border-white/[0.06] p-7 shadow-xl shadow-black/30">
                  <h3 className="font-bold text-lg mb-4">Institutional Benchmark</h3>
                  <div className="space-y-4">
                    {[
                      { label: 'Peer Avg. Skill Index', val: 71 },
                      { label: 'Department Best', val: 89 },
                      { label: 'National Top 10%', val: 94 },
                      { label: 'Your Score', val: 76, highlight: true },
                    ].map((b) => (
                      <div key={b.label}>
                        <div className="flex justify-between text-sm mb-1"><span className="text-slate-300">{b.label}</span><span className={`${b.highlight ? 'text-emerald-400 font-bold' : 'text-slate-400 font-mono'}`}>{b.val}</span></div>
                        <div className="h-2 w-full rounded-full bg-slate-800 overflow-hidden"><div className={`h-full rounded-full ${b.highlight ? 'bg-emerald-400 shadow-[0_0_6px_rgba(52,211,153,0.5)]' : 'bg-violet-500'} w-[${b.val}%]`} /></div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* ───── Tab 2: Recruiter Matching ───── */}
        {tab === 2 && (
          <section className="space-y-10 animate-fade-up">
            <div className="flex items-center gap-4 mb-2">
              <h2 className="text-3xl font-extrabold tracking-tight text-slate-50">Recruiter Matching</h2>
              <span className="text-xs font-mono text-slate-500 bg-white/[0.05] px-2.5 py-1 rounded-full border border-white/10">AI-scored by skill overlap</span>
            </div>

            <div className="grid lg:grid-cols-3 gap-6">
              {jobs.map((job) => (
                <article key={job.title} className="group rounded-3xl bg-gradient-to-b from-slate-900 to-[#080f1c] border border-white/[0.06] shadow-2xl shadow-black/40 overflow-hidden hover:-translate-y-1 transition duration-300 flex flex-col">
                  <div className="relative h-40 overflow-hidden">
                    <img src={`https://picsum.photos/seed/${job.company.replace(/[^a-z]/gi, '')}/600/300`} alt={job.company} className="w-full h-full object-cover scale-110 group-hover:scale-105 transition duration-700 opacity-60 group-hover:opacity-75" />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#080f1c] via-[#080f1c]/30 to-transparent" />
                    <div className="absolute bottom-3 left-4 right-4 flex items-end justify-between">
                      <div>
                        <div className="text-xl font-extrabold text-white leading-tight drop-shadow-lg">{job.company}</div>
                        <div className="text-xs text-slate-300 font-medium mt-0.5">{job.title}</div>
                      </div>
                      <div className="h-12 w-12 rounded-2xl bg-emerald-500 text-white flex items-center justify-center text-xl font-extrabold shadow-lg shadow-emerald-500/30 ring-2 ring-white/10">{job.match}</div>
                    </div>
                  </div>
                  <div className="p-7 flex-1 flex flex-col gap-5">
                    <div className="flex flex-wrap gap-2">
                      {job.tags.map((t) => (
                        <span key={t} className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-slate-850 text-slate-300 border border-white/[0.08] shadow-inner shadow-black/20">{t}</span>
                      ))}
                    </div>
                    <div className="flex items-center justify-between text-sm text-slate-300"><span>Expected CTC</span><span className="font-mono text-slate-50 font-bold">{job.salary}</span></div>
                    <div className="h-px bg-white/[0.06]" />
                    <a href="#" className="mt-auto inline-flex items-center gap-2.5 text-emerald-300 font-bold hover:text-emerald-200 transition group-hover:translate-x-1 duration-300">
                      View Match Details <ArrowRight size={16} />
                    </a>
                  </div>
                </article>
              ))}
            </div>

            <div className="rounded-3xl bg-gradient-to-b from-slate-900 to-[#080f1c] border border-white/[0.06] shadow-2xl shadow-black/40 p-8 md:p-10 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
              <div>
                <h3 className="text-2xl font-bold text-slate-50 mb-2">Want to unlock full recruiter access?</h3>
                <p className="text-slate-400 text-sm leading-relaxed">Verified TPO accounts can invite up to 50 industry partners per semester, run custom skill-mapping campaigns, and export placement analytics in NAAC-compliant formats.</p>
              </div>
              <a href="#" className="shrink-0 inline-flex items-center gap-3 px-8 py-4 rounded-2xl bg-gradient-to-r from-violet-600 to-sky-600 text-white font-extrabold shadow-xl shadow-violet-600/20 hover:brightness-110 active:scale-[0.98] transition">Request Access <ArrowRight size={18} /></a>
            </div>
          </section>
        )}
      </main>

      {/* Footer */}
      <footer className="relative z-10 border-t border-white/[0.06] bg-slate-950/60 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-6 lg:px-10 py-8 flex flex-col md:flex-row items-center justify-between gap-3 text-xs text-slate-500 font-medium">
          <span>SIH26044 — Skill Mapping & Internships</span>
          <span className="font-mono">2026 · Built for Academia-Industry Collaboration</span>
        </div>
      </footer>
    </div>
  );
}

function SpellIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-emerald-400">
      <path d="M12 2L2 7l10 5 10-5-10-5z" />
      <path d="M2 17l10 5 10-5" />
      <path d="M2 12l10 5 10-5" />
    </svg>
  );
}

function TrendBadge() {
  return (
    <span className="inline-flex items-center gap-1.5 text-[11px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-1 rounded-full border border-emerald-500/20 shadow-inner shadow-emerald-500/5">
      <TrendingUp size={12} /> +16%
    </span>
  );
}
