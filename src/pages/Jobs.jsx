import { useState } from 'react';
import { Building2, MapPin, Briefcase, DollarSign, CheckCircle2, ArrowRight } from 'lucide-react';

const jobsData = [
  { title: 'Python Backend Developer', company: 'TCS', location: 'Hyderabad', type: 'Full-time', skills: ['Python', 'SQLite', 'REST APIs'], salary: '8-14 LPA', desc: 'Build scalable backend APIs for enterprise clients. Work with Python, SQLite, and cloud-native architectures.' },
  { title: 'Physical Design Engineer', company: 'Intel', location: 'Bangalore', type: 'Full-time', skills: ['VLSI', 'SystemVerilog', 'Physical Design'], salary: '18-35 LPA', desc: 'Lead physical design and timing closure for advanced silicon nodes. Deep digital logic and EDA tooling.' },
  { title: 'Embedded Firmware Engineer', company: 'Texas Instruments', location: 'Bangalore', type: 'Full-time', skills: ['C', 'RTOS', 'Microcontrollers'], salary: '14-28 LPA', desc: 'Develop embedded firmware for sensor interfaces, motor control, and IoT modules.' },
];

export default function Jobs() {
  const [selected, setSelected] = useState(jobsData[0]);
  return (
    <main className="bg-slate-50 min-h-screen pb-20 pt-6 px-6 lg:px-10 max-w-6xl mx-auto">
      <h1 className="text-3xl font-extrabold text-slate-900 mb-2">Job Opportunities</h1>
      <p className="text-slate-500 mb-8">LinkedIn-style feed of verified industry openings.</p>
      <div className="grid lg:grid-cols-12 gap-8">
        <div className="lg:col-span-5 space-y-4">
          {jobsData.map(j => (
            <button key={j.title} onClick={() => setSelected(j)} className={`w-full text-left rounded-2xl border p-5 transition shadow-sm ${selected.title === j.title ? 'bg-blue-50 border-blue-200 shadow-md' : 'bg-white border-slate-200 hover:shadow-md hover:border-blue-200'}`}>
              <h3 className="font-extrabold text-slate-900">{j.title}</h3>
              <p className="text-xs text-slate-500 font-medium">{j.company} · {j.location}</p>
              <div className="flex gap-2 mt-3 flex-wrap">{j.skills.map(s => <span key={s} className="text-[10px] font-bold bg-blue-50 text-blue-700 px-2 py-0.5 rounded-full">{s}</span>)}</div>
            </button>
          ))}
        </div>
        <div className="lg:col-span-7 bg-white rounded-3xl border border-slate-200 shadow-sm p-8 sticky top-24 h-fit">
          <h2 className="text-2xl font-extrabold text-slate-900 mb-1">{selected.title}</h2>
          <p className="text-sm text-slate-500 mb-4">{selected.company} · {selected.location} · {selected.type}</p>
          <h3 className="font-bold text-slate-800 mb-2">About the Role</h3>
          <p className="text-sm text-slate-600 mb-6">{selected.desc}</p>
          <h3 className="font-bold text-slate-800 mb-2">Required Skills</h3>
          <div className="flex flex-wrap gap-2 mb-4">{selected.skills.map(s => <span key={s} className="text-xs font-bold bg-emerald-50 text-emerald-700 px-2.5 py-1 rounded-full border border-emerald-200">{s}</span>)}</div>
          <h3 className="font-bold text-slate-800 mb-2">Stipend / CTC</h3>
          <p className="text-sm text-slate-600 mb-6">{selected.salary}</p>
          <button onClick={() => { const pending = JSON.parse(localStorage.getItem('pending_applications') || '[]'); pending.push({ job: selected.title, company: selected.company, timestamp: new Date().toISOString() }); localStorage.setItem('pending_applications', JSON.stringify(pending)); alert('Application saved! Check Pending Apps in TPO Dashboard.'); }} className="w-full py-4 rounded-full bg-blue-600 text-white font-extrabold shadow-lg shadow-blue-600/20 hover:bg-blue-700 transition flex items-center justify-center gap-2"><ArrowRight size={18}/> Apply Now</button>
        </div>
      </div>
    </main>
  );
}
