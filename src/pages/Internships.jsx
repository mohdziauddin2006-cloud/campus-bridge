import { useState } from 'react';
import { Building2, MapPin, Clock, Star, ArrowRight, CheckCircle2, X, Sparkles } from 'lucide-react';
import { generateTpoCandidateSummary } from '../services/aiService';


const ApplyModal = ({ open, onClose, role }) => {
  if (!open) return null;
  const [form, setForm] = useState({ fullName: '', email: '', college: 'Annamacharya Institute of Technology and Sciences', qualification: '', hallTicket: '', skills: '' });
  const [ok, setOk] = useState(false);
  const [isAligning, setIsAligning] = useState(false);
  const [alignedNote, setAlignedNote] = useState('');
  const handleAlign = async () => {
    setIsAligning(true);
    try {
      const res = await generateTpoCandidateSummary({ studentName: form.fullName, role: role?.title || 'Role', branch: form.qualification || 'B.Tech', skills: form.skills, company: role?.company || 'N/A' });
      const keywords = res.verdict ? res.verdict.split(' ').slice(0,3) : [];
      const optimized = (form.skills ? form.skills.split(',').map(s=>s.trim()).join(', ') + ', ' : '') + keywords.join(', ');
      setForm(prev => ({...prev, skills: optimized}));
      setAlignedNote(res.verdict || 'Tailored pitch: Strong alignment with the role requirements. Ready to contribute with optimized skill keywords.');
    } catch (e) {}
    setIsAligning(false);
  };
  const handle = (e) => { e.preventDefault(); const pending = JSON.parse(localStorage.getItem('pending_applications') || '[]'); pending.push({ id: 'app-' + Date.now(), studentName: 'Mohd Zia Uddin', degree: 'B.Tech', branch: 'ECE', cgpa: '8.4', college: 'AITS Hyderabad', atsScore: '91%', role: role?.title || '', company: role?.company || '', status: 'Submitted', submittedAt: new Date().toLocaleDateString(), fullName: form.fullName, email: form.email, skills: form.skills, notes: alignedNote || '' }); localStorage.setItem('pending_applications', JSON.stringify(pending)); window.dispatchEvent(new Event('storage')); setOk(true); setTimeout(() => { setOk(false); onClose(); }, 2200); };
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-md px-4" onClick={onClose}>
      <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 max-w-lg w-full p-8 relative" onClick={e => e.stopPropagation()}>
        <button onClick={onClose} className="absolute top-4 right-4 text-slate-400 hover:text-slate-700 p-1 rounded-full hover:bg-slate-100 transition">×</button>
        <h2 className="text-2xl font-extrabold text-slate-900 mb-1">Apply — {role?.title}</h2>
        <p className="text-sm text-slate-500 mb-6">{role?.company} · {role?.location}</p>
        {ok ? <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-700 font-bold flex items-center gap-2">✓ Application saved to TPO Queue</div>
         : <form onSubmit={handle} className="space-y-3">
            {[ 'fullName', 'email', 'college', 'qualification', 'hallTicket', 'skills' ].map(k => {
              const labels = { fullName: 'Full Name', email: 'Email', college: 'College / University', qualification: 'Qualification / Degree', hallTicket: 'Hall Ticket / Roll No.', skills: 'Core Skills (comma-separated)' };
              const placeholders = { fullName: 'Mohd Zia Uddin', email: 'zia@college.edu', college: 'Annamacharya Institute of Technology and Sciences', qualification: 'B.Tech ECE', hallTicket: '21EECE1234', skills: 'Python, VLSI, SystemVerilog' };
              return (
                <div key={k}><label className="block text-xs font-extrabold uppercase tracking-widest text-slate-500 mb-1">{labels[k]}</label>
                  {k === 'skills' && (
                    <button type="button" onClick={handleAlign} disabled={isAligning} className="mb-1.5 inline-flex items-center gap-1.5 text-xs font-extrabold bg-violet-50 text-violet-700 border border-violet-200 hover:bg-violet-100 rounded-full px-2.5 py-1 transition disabled:opacity-50"><Sparkles size={12}/> ✦ AI Auto-Align Skills & Pitch</button>
                  )}
                  <input required type={k==='email'?'email':'text'} value={form[k]} onChange={e => setForm({ ...form, [k]: e.target.value })} placeholder={placeholders[k]} className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition" />
                  {k === 'skills' && alignedNote && <p className="text-xs text-violet-700 font-medium mt-1">{alignedNote}</p>}
                  {k === 'skills' && isAligning && <div className="flex items-center gap-2 text-xs text-violet-600 font-medium mt-1"><span className="w-3 h-3 border-2 border-violet-600 border-t-transparent rounded-full animate-spin" /> Generating optimized keywords & pitch…</div>}
                </div>
              );
            })}
            <button type="submit" className="w-full py-3 rounded-full bg-blue-600 text-white font-extrabold shadow-lg shadow-blue-600/20 hover:bg-blue-700 transition">Submit Application</button>
          </form>}
      </div>
    </div>
  );
};

const internData = [
  // All levels covered
  { title: 'Data Entry Intern', company: 'RailTel Corp', location: 'New Delhi', type: 'Internship (3 months)', skills: ['MS Office', 'Data Entry', 'Excel'], stipend: '₹15,000 / month', desc: 'Support digital record migration for national rail infrastructure. Basic MS Office skills required.' },
  { title: 'Workshop Intern', company: 'ITI Kanpur', location: 'Kanpur', type: 'Internship (2 months)', skills: ['Hand Tools', 'Carpentry'], stipend: '₹12,000 / month', desc: 'Assist certified mechanics in workshop maintenance and basic fabrication tasks.' },
  { title: 'Junior Draftsman Intern', company: 'L&T Construction', location: 'Mumbai', type: 'Internship (6 months)', skills: ['AutoCAD', '2D Drafting'], stipend: '₹22,000 / month', desc: 'Produce 2D drafts under engineer supervision. Learn CAD drafting for real construction projects.' },
  { title: 'Telecom Intern', company: 'BSNL Circle', location: 'Chennai', type: 'Internship (6 months)', skills: ['Fiber Optics', 'Router Config'], stipend: '₹18,000 / month', desc: 'Field and lab work on telecom installation. Exposure to fiber optics and router configuration.' },
  { title: 'Hardware Integration Intern', company: 'Qualcomm', location: 'Hyderabad', type: 'Internship (6 months)', skills: ['Embedded C', 'Intel 8086/8051', 'PCB Design'], stipend: '₹45,000 / month', desc: 'Integrate RF front-end modules with microcontroller subsystems. Hands-on with embedded C.' },
  { title: 'AI / ML Intern', company: 'Remote Startup', location: 'Remote', type: 'Internship (3 months)', skills: ['LLMs', 'Python', 'Streamlit'], stipend: '₹35,000 / month', desc: 'Build interactive dashboards for LLM outputs using Python and Streamlit.' },
  { title: 'FPGA Prototyping Intern', company: 'AMD', location: 'Bangalore', type: 'Internship (4 months)', skills: ['Verilog', 'FPGA', 'Digital Design'], stipend: '₹40,000 / month', desc: 'Prototype digital blocks in Verilog for FPGA validation under senior FPGA engineers.' },
  { title: 'Lab Analysis Intern', company: 'Dr. Reddy Labs', location: 'Hyderabad', type: 'Internship (6 months)', skills: ['Laboratory Protocols', 'Sample Prep'], stipend: '₹20,000 / month', desc: 'Prepare chemical samples, log experimental data, and assist research scientists.' },
];

export default function Internships() {
  const [selected, setSelected] = useState(internData[0]);
  const [isApplyModalOpen, setIsApplyModalOpen] = useState(false);
  return (
    <main className="bg-slate-50 min-h-screen pb-20 pt-6 px-6 lg:px-10 max-w-6xl mx-auto">
      <h1 className="text-3xl font-extrabold text-slate-900 mb-2">Internships</h1>
      <p className="text-slate-500 mb-8">LinkedIn-style feed of verified internships — SSC to PhD.</p>
      <div className="grid lg:grid-cols-12 gap-8">
        <div className="lg:col-span-5 space-y-4">
          {internData.map(i => (
            <button key={i.title} onClick={() => setSelected(i)} className={`w-full text-left rounded-2xl border p-5 transition shadow-sm ${selected.title === i.title ? 'bg-blue-50 border-blue-200 shadow-md' : 'bg-white border-slate-200 hover:shadow-md hover:border-blue-200'}`}>
              <h3 className="font-extrabold text-slate-900">{i.title}</h3>
              <p className="text-xs text-slate-500 font-medium">{i.company} · {i.location}</p>
              <div className="flex gap-2 mt-3 flex-wrap">{i.skills.map(s => <span key={s} className="text-[10px] font-bold bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded-full">{s}</span>)}</div>
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
          <h3 className="font-bold text-slate-800 mb-2">Stipend</h3>
          <p className="text-sm text-slate-600 mb-6">{selected.stipend}</p>
          <button onClick={() => setIsApplyModalOpen(true)} className="w-full py-4 rounded-full bg-blue-600 text-white font-extrabold shadow-lg shadow-blue-600/20 hover:bg-blue-700 transition flex items-center justify-center gap-2"><ArrowRight size={18}/> Apply Now</button>
          <ApplyModal open={isApplyModalOpen} onClose={() => setIsApplyModalOpen(false)} role={selected} />
        </div>
      </div>
    </main>
  );
}
