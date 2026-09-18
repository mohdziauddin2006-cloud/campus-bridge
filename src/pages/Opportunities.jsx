import { useState } from 'react';
import { ShieldCheck, Globe, Clock, CheckCircle2, Send, Filter, Search, Building, MapPin, Briefcase } from 'lucide-react';
import { db } from '../lib/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { mockOpportunities } from '../data/mockOpportunities';

export default function OpportunitiesPage() {
  const [search, setSearch] = useState('');
  const [modeFilter, setModeFilter] = useState('All');
  const [cityFilter, setCityFilter] = useState('All Cities');
  const [typeFilter, setTypeFilter] = useState('All');
  const [showForm, setShowForm] = useState(false);
  const [selectedOp, setSelectedOp] = useState(null);
  const [form, setForm] = useState({ fullName: '', email: '', university: '', branch: '', cgpa: '', github: '', linkedin: '', resume: '' });
  const [toast, setToast] = useState('');

  const filtered = mockOpportunities.filter(o => {
    const s = o.role.toLowerCase().includes(search.toLowerCase()) || o.company.toLowerCase().includes(search.toLowerCase());
    const m = modeFilter === 'All' || o.workMode === modeFilter;
    const c = cityFilter === 'All Cities' || o.location === cityFilter;
    const t = typeFilter === 'All' || (typeFilter === 'Internship' ? !!o.stipend : !!o.ctc);
    return s && m && c && (typeFilter === 'All' ? true : (typeFilter === 'Internship' ? !!o.stipend : !!o.ctc));
  });

  const openApply = (op) => {
    setSelectedOp(op);
    setShowForm(true);
    setForm({ fullName: '', email: '', university: '', branch: '', cgpa: '', github: '', linkedin: '', resume: '' });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await addDoc(collection(db, 'applications'), {
        fullName: 'Mohd Zia Uddin',
        branch: 'B.Tech ECE',
        skills: 'VLSI, SystemVerilog, Python, SQLite',
        project: 'JanSev AI Classification',
        score: '82%',
        role: selectedOp?.role || 'General',
        company: selectedOp?.company || 'Unknown',
        status: 'Submitted',
        timestamp: serverTimestamp()
      });
      setShowForm(false);
      setToast('Application submitted to TPO for verification.');
      setSelectedOp(null);
      setTimeout(() => setToast(''), 5000);
    } catch (err) {
      console.error('Firestore submit error', err);
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 px-6 lg:px-12 pt-8 pb-20">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-extrabold text-slate-900 mb-1">National Opportunities Feed</h1>
        <p className="text-slate-500 mb-8">Real-time corporate openings · Public application — no account required</p>

        <div className="bg-white/80 backdrop-blur rounded-2xl border border-slate-200 shadow-sm p-5 mb-8 flex flex-wrap gap-3 items-center">
          <div className="relative flex-1 min-w-[16rem]">
            <Search size={18} className="absolute left-3 top-2.5 text-slate-400" />
            <input type="text" value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search roles, companies..." className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20" />
          </div>
          <div className="flex gap-2 flex-wrap">
            {["All","Remote / Online","On-site / Offline","Hybrid"].map(mode => (
              <button key={mode} onClick={() => setModeFilter(mode)} className={`text-xs font-bold px-3 py-1.5 rounded-full border transition ${modeFilter === mode ? 'bg-blue-600 text-white border-blue-600' : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'}`}>{mode}</button>
            ))}
          </div>
          <div className="flex gap-2 flex-wrap">
            {["All Cities","Bengaluru","Hyderabad","Pune","Delhi-NCR","Chennai","Mumbai","Pan-India / Remote"].map(city => (
              <button key={city} onClick={() => setCityFilter(city)} className={`text-xs font-bold px-3 py-1.5 rounded-full border transition ${cityFilter === city ? 'bg-blue-600 text-white border-blue-600' : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'}`}>{city}</button>
            ))}
          </div>
          <div className="flex gap-2">
            {["All","Internship","Full-Time Fresher"].map(type => (
              <button key={type} onClick={() => setTypeFilter(type)} className={`text-xs font-bold px-3 py-1.5 rounded-full border transition ${typeFilter === type ? 'bg-emerald-600 text-white border-emerald-600' : 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100'}`}>{type}</button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((o, i) => (
            <div key={i} className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 hover:shadow-lg transition">
              <div className="flex items-center gap-2 mb-3">
                <span className={`text-xs font-extrabold px-2.5 py-0.5 rounded-full ${o.workMode === 'Remote' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : o.workMode === 'On-site' ? 'bg-sky-50 text-sky-700 border border-sky-200' : 'bg-amber-50 text-amber-700 border border-amber-200'}`}>{o.workMode}</span>
                <span className="text-xs text-slate-400 font-medium flex items-center gap-1"><MapPin size={10}/> {o.location}</span>
              </div>
              <h3 className="text-lg font-extrabold text-slate-900 mb-1">{o.role}</h3>
              <p className="text-sm text-slate-500 font-medium mb-3">{o.company}</p>
              <div className="text-xs text-slate-400 mb-3">{o.stipend || o.ctc}</div>
              <div className="flex flex-wrap gap-2 mb-4">
                {o.tags.map(t => <span key={t} className="px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 text-[11px] font-bold border border-blue-100">{t}</span>)}
              </div>
              <button onClick={() => openApply(o)} className="w-full py-2.5 rounded-full bg-blue-600 text-white text-sm font-extrabold hover:bg-blue-700 transition shadow-md shadow-blue-600/20">Apply Now</button>
            </div>
          ))}
        </div>
      </div>

      {showForm && selectedOp && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center px-4">
          <div className="bg-white rounded-3xl shadow-2xl p-6 md:p-8 w-[95%] md:w-full md:max-w-2xl border border-slate-200 relative max-h-[85vh] overflow-y-auto">
            <button onClick={() => setShowForm(false)} className="absolute top-4 right-4 text-slate-400 hover:text-slate-700">✕</button>
            <h3 className="text-xl font-extrabold text-slate-900 mb-1">Apply to {selectedOp.company}</h3>
            <p className="text-sm text-slate-500 mb-5">Role: {selectedOp.role} · {selectedOp.location}</p>
            <form onSubmit={handleSubmit} className="space-y-3">
              <input required type="text" placeholder="Full Name" value={form.fullName} onChange={e => setForm({ ...form, fullName: e.target.value })} className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20" />
              <input required type="email" placeholder="Email Contact" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20" />
              <input required type="text" placeholder="University Name" value={form.university} onChange={e => setForm({ ...form, university: e.target.value })} className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20" />
              <input required type="text" placeholder="Branch / Specialization" value={form.branch} onChange={e => setForm({ ...form, branch: e.target.value })} className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20" />
              <input required type="text" placeholder="CGPA" value={form.cgpa} onChange={e => setForm({ ...form, cgpa: e.target.value })} className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20" />
              <input type="url" placeholder="GitHub URL" value={form.github} onChange={e => setForm({ ...form, github: e.target.value })} className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20" />
              <input type="url" placeholder="LinkedIn URL" value={form.linkedin} onChange={e => setForm({ ...form, linkedin: e.target.value })} className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20" />
              <textarea required rows={4} placeholder="Paste your resume / experience summary..." value={form.resume} onChange={e => setForm({ ...form, resume: e.target.value })} className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20" />
              <button type="submit" className="w-full py-3 rounded-full bg-blue-600 text-white font-extrabold hover:bg-blue-700 transition">Submit Application</button>
            </form>
          </div>
        </div>
      )}

      {toast && <div className="fixed bottom-6 right-6 bg-emerald-600 text-white px-6 py-3 rounded-2xl shadow-xl font-bold text-sm z-50 animate-bounce">{toast}</div>}
    </main>
  );
}
