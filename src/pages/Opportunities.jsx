import { useState } from 'react';
import { ShieldCheck, Globe, Clock, CheckCircle2, Send, Filter, Search, Building, MapPin, Briefcase } from 'lucide-react';

const opportunities = [
  { role: "Frontend Engineer Intern", company: "CampusBridge Technologies", location: "Bengaluru", mode: "Remote / Online", stipend: "₹45,000 / month", tags: ["React","Tailwind","Vite"], link: "#" },
  { role: "Full-Stack Fresher", company: "Global Recruiters Pvt Ltd", location: "Hyderabad", mode: "Hybrid", ctc: "₹12 LPA", tags: ["Node","MongoDB","AWS"], link: "#" },
  { role: "DevOps Intern", company: "CloudScale Systems", location: "Pune", mode: "On-site / Offline", stipend: "₹35,000 / month", tags: ["Docker","K8s","CI/CD"], link: "#" },
  { role: "AI / NLP Engineer", company: "NeuralNet Corp", location: "Delhi-NCR", mode: "Remote / Online", ctc: "₹18 LPA", tags: ["Python","PyTorch","NLP"], link: "#" },
  { role: "Embedded Systems Intern", company: "TechForge Labs", location: "Chennai", mode: "On-site / Offline", stipend: "₹28,000 / month", tags: ["C","Embedded","RTOS"], link: "#" },
  { role: "Mobile Developer (React Native)", company: "AppWorks", location: "Mumbai", mode: "Hybrid", ctc: "₹10 LPA", tags: ["React Native","TypeScript","Firebase"], link: "#" },
];

export default function OpportunitiesPage() {
  const [search, setSearch] = useState('');
  const [modeFilter, setModeFilter] = useState('All');
  const [cityFilter, setCityFilter] = useState('All Cities');
  const [typeFilter, setTypeFilter] = useState('All');

  const filtered = opportunities.filter(o => {
    const s = o.role.toLowerCase().includes(search.toLowerCase()) || o.company.toLowerCase().includes(search.toLowerCase());
    const m = modeFilter === 'All' || o.mode === modeFilter;
    const c = cityFilter === 'All Cities' || o.location === cityFilter;
    const t = typeFilter === 'All' || (o.stipend ? 'Internship' : 'Full-Time Fresher').includes(typeFilter) || (typeFilter === 'All');
    return s && m && c && (typeFilter === 'All' ? true : (typeFilter === 'Internship' ? !!o.stipend : !!o.ctc));
  });

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 px-6 lg:px-12 pt-8 pb-20">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-extrabold text-slate-900 mb-1">National Opportunities Feed</h1>
        <p className="text-slate-500 mb-8">Real-time corporate openings · Filter by mode, city, and role type</p>

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
            {["All Cities","Bengaluru","Hyderabad","Pune","Delhi-NCR","Chennai","Mumbai"].map(city => (
              <button key={city} onClick={() => setCityFilter(city)} className={`text-xs font-bold px-3 py-1.5 rounded-full border transition ${cityFilter === city ? 'bg-blue-600 text-white border-blue-600' : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'}`}>{city}</button>
            ))}
          </div>
          <div className="flex gap-2">
            {["All","Internship","Full-Time Fresher"].map(type => (
              <button key={type} onClick={() => setTypeFilter(type)} className={`text-xs font-bold px-3 py-1.5 rounded-full border transition ${typeFilter === type ? 'bg-emerald-600 text-white border-emerald-600' : 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100'}`}>{type}</button>
            ))}
          </div>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((o, i) => (
            <div key={i} className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 hover:shadow-lg transition">
              <div className="flex items-center gap-2 mb-3">
                <span className={`text-xs font-extrabold px-2.5 py-0.5 rounded-full ${o.mode === 'Remote / Online' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : o.mode === 'On-site / Offline' ? 'bg-sky-50 text-sky-700 border border-sky-200' : 'bg-amber-50 text-amber-700 border border-amber-200'}`}>{o.mode}</span>
                <span className="text-xs text-slate-400 font-medium flex items-center gap-1"><MapPin size={10}/> {o.location}</span>
              </div>
              <h3 className="text-lg font-extrabold text-slate-900 mb-1">{o.role}</h3>
              <p className="text-sm text-slate-500 font-medium mb-3">{o.company}</p>
              <div className="text-xs text-slate-400 mb-3">{o.stipend || o.ctc}</div>
              <div className="flex flex-wrap gap-2 mb-4">
                {o.tags.map(t => <span key={t} className="px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 text-[11px] font-bold border border-blue-100">{t}</span>)}
              </div>
              <div className="flex gap-2">
                <a href={o.link} className="flex-1 text-center py-2 rounded-full bg-blue-600 text-white text-sm font-extrabold hover:bg-blue-700 transition shadow-md shadow-blue-600/20">Apply</a>
                <button className="flex-1 py-2 rounded-full bg-slate-900 text-white text-sm font-extrabold hover:bg-slate-800 transition shadow-lg shadow-slate-900/20">Submit to TPO for Endorsement</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
