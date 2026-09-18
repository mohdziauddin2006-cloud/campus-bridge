import { useState } from 'react';
import { Building2, MapPin, Briefcase, ArrowRight } from 'lucide-react';

const jobsData = [
  // SSC / 10th Pass
  { title: 'Data Entry Operator', company: 'RailTel Corp', location: 'New Delhi', type: 'Contract', skills: ['MS Office', 'Data Entry', 'Basic Excel'], salary: '2.5 - 4.5 LPA', desc: 'Accurate data entry for digital records, form validation, and basic spreadsheet maintenance across national rail infrastructure databases.' },
  { title: 'Workshop Assistant', company: 'ITI Kanpur', location: 'Kanpur', type: 'Full-time', skills: ['Hand Tools', 'Carpentry', 'Safety Compliance'], salary: '2.0 - 3.5 LPA', desc: 'Assist in mechanical workshop setup, maintain tooling inventory, and support basic fabrication tasks under certified technicians.' },
  // Diploma / ITI
  { title: 'Junior Mechanic', company: 'Bharat Heavy Electricals', location: 'Haridwar', type: 'Full-time', skills: ['AutoCAD', 'Welding', 'Mechanical Fitting'], salary: '3.5 - 6 LPA', desc: 'Assist senior mechanics in assembly, repair, and quality inspection of mechanical systems on industrial equipment.' },
  { title: 'Junior Draftsman', company: 'L&T Construction', location: 'Mumbai', type: 'Full-time', skills: ['AutoCAD', '2D Drafting', 'Dimensioning'], salary: '4 - 7 LPA', desc: 'Prepare 2D technical drawings for civil and structural projects. Convert engineer notes into production-ready drafts.' },
  { title: 'Telecom Technician', company: 'BSNL Circle', location: 'Chennai', type: 'Full-time', skills: ['Fiber Optics', 'Router Config', 'Troubleshooting'], salary: '4 - 7 LPA', desc: 'Install, maintain, and troubleshoot telecom infrastructure including copper lines, fiber optics, and router configurations.' },
  // B.Sc / B.Com
  { title: 'Financial Analyst', company: 'Kotak Securities', location: 'Mumbai', type: 'Full-time', skills: ['Tally', 'Excel', 'Financial Modeling'], salary: '5 - 9 LPA', desc: 'Analyze balance sheets, prepare investor reports, model revenue projections, and assist senior analysts with portfolio tracking.' },
  { title: 'Lab Technician', company: 'Dr. Reddy Labs', location: 'Hyderabad', type: 'Full-time', skills: ['Laboratory Protocols', 'Sample Prep', 'Data Logging'], salary: '3.5 - 6 LPA', desc: 'Prepare chemical and biological samples, log experimental data, maintain calibration records, and assist research scientists.' },
  // B.Tech (All Branches)
  { title: 'Python Backend Developer', company: 'TCS', location: 'Hyderabad', type: 'Full-time', skills: ['Python', 'SQLite', 'REST APIs'], salary: '8-14 LPA', desc: 'Build scalable backend APIs for enterprise clients. Work with Python, SQLite, and cloud-native architectures.' },
  { title: 'Physical Design Engineer', company: 'Intel', location: 'Bangalore', type: 'Full-time', skills: ['VLSI', 'SystemVerilog', 'Physical Design'], salary: '18-35 LPA', desc: 'Lead physical design and timing closure for advanced silicon nodes. Deep digital logic and EDA tooling.' },
  { title: 'VLSI Engineer', company: 'Qualcomm', location: 'Hyderabad', type: 'Full-time', skills: ['Verilog', 'SystemVerilog', 'FPGA'], salary: '15-30 LPA', desc: 'Design and verify digital circuits for mobile chipsets. Work with SystemVerilog, synthesis, and timing analysis.' },
  { title: 'Civil Site Engineer', company: 'Shapoorji Pallonji', location: 'Pune', type: 'Full-time', skills: ['AutoCAD', 'Surveying', 'Concrete Technology'], salary: '6-11 LPA', desc: 'Supervise construction site activities, manage material logistics, ensure structural compliance, and coordinate with survey teams.' },
  { title: 'Mechanical CAD Designer', company: 'Mahindra & Mahindra', location: 'Ahmedabad', type: 'Full-time', skills: ['AutoCAD', 'SolidWorks', 'Sheet Metal'], salary: '7-12 LPA', desc: 'Produce 3D CAD models and assembly drawings for mechanical components and vehicle subsystems using SolidWorks.' },
  // M.Tech / PhD
  { title: 'AI Research Scientist', company: 'IIT Research Lab', location: 'Bangalore', type: 'Full-time', skills: ['Machine Learning', 'NumPy', 'MATLAB', 'Python'], salary: '25-45 LPA', desc: 'Lead research in deep learning architectures, publish peer-reviewed papers, and build production-grade AI systems.' },
  { title: 'Quantum Computing Engineer', company: 'Tata Research Institute', location: 'Pune', type: 'Full-time', skills: ['Quantum Mechanics', 'Qiskit', 'Python', 'Linear Algebra'], salary: '20-40 LPA', desc: 'Develop algorithms for quantum error correction and optimize circuit depth for NISQ devices using Qiskit.' },
  { title: 'Senior Materials Scientist', company: 'ISRO Satellite Center', location: 'Bangalore', type: 'Full-time', skills: ['Materials Science', 'MATLAB', 'Thermal Analysis', 'Nanotech'], salary: '18-35 LPA', desc: 'Characterize aerospace-grade composites, run thermal and stress simulations, and advise on material selection for satellite structures.' },
];

export default function Jobs() {
  const [selected, setSelected] = useState(jobsData[0]);
  return (
    <main className="bg-slate-50 min-h-screen pb-20 pt-6 px-6 lg:px-10 max-w-6xl mx-auto">
      <h1 className="text-3xl font-extrabold text-slate-900 mb-2">Job Opportunities</h1>
      <p className="text-slate-500 mb-8">LinkedIn-style feed of verified industry openings — SSC to PhD.</p>
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
