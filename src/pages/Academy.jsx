import { useState } from 'react';
import { Play, CheckCircle, Clock, ArrowRight } from 'lucide-react';

const categories = ['All','C/C++','Java','Python','Web/JS','VLSI & Hardware','Core DSA','Cloud'];

const videos = [
  { id: 'ZzaPdXTrSb8', title: 'C++ Advanced Patterns', desc: 'STL, memory optimization, modern C++20', cat: 'C/C++' },
  { id: 'grEKMHGYyns', title: 'Java OOP & Spring Boot', desc: 'Enterprise patterns, dependency injection', cat: 'Java' },
  { id: '_uQrJ0TkZlc', title: 'Python for Data Engineering', desc: 'Pandas, NumPy, pipeline automation', cat: 'Python' },
  { id: 'PkZNo7MFNFg', title: 'Web / Modern JS Ecosystem', desc: 'ES2024, modular architecture, APIs', cat: 'Web/JS' },
  { id: 'l9B_JzR_Fuo', title: 'VLSI Design & FPGA Basics', desc: 'Verilog, synthesis, timing analysis', cat: 'VLSI & Hardware' },
  { id: '8hly31xKli0', title: 'Core DSA & Technical Coding', desc: 'Algorithmic engineering for interviews', cat: 'Core DSA' },
  { id: 'k1RI5locZE4', title: 'Cloud / DevOps (AWS / Docker)', desc: 'Containers, Kubernetes, infra automation', cat: 'Cloud' },
];

export default function Academy() {
  const [activeId, setActiveId] = useState('ZzaPdXTrSb8');
  const [completed, setCompleted] = useState(new Set());
  const [filterCat, setFilterCat] = useState('All');

  const filtered = filterCat === 'All' ? videos : videos.filter(v => v.cat === filterCat);
  const activeVideo = videos.find(v => v.id === activeId) || videos[0];

  return (
    <main className="bg-slate-50 min-h-screen pb-20 pt-6 px-6 lg:px-10 max-w-6xl mx-auto">
      <h1 className="text-3xl font-extrabold text-slate-900 mb-2">Video Academy</h1>
      <p className="text-slate-500 mb-6">In-app embedded curriculum — multi-language, verified sources.</p>

      {/* Category tabs */}
      <div className="flex flex-wrap gap-2 mb-8">
        {categories.map(c => (
          <button key={c} onClick={() => { setFilterCat(c); setActiveId((videos.find(v => v.cat === c) || videos[0]).id); }} className={`px-3 py-1.5 rounded-full text-sm font-bold transition border ${filterCat === c ? 'bg-blue-600 text-white border-blue-600 shadow-md' : 'bg-white text-slate-700 border-slate-200 hover:border-blue-300'}`}>{c}</button>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        <div className="space-y-3">
          <h3 className="text-xs font-extrabold uppercase tracking-widest text-slate-400 mb-3">Curated Learning Paths</h3>
          {filtered.map(v => (
            <button key={v.id} onClick={() => setActiveId(v.id)} className={`w-full text-left rounded-2xl border p-4 transition shadow-sm ${activeId === v.id ? 'bg-blue-50 border-blue-200 shadow-md' : 'bg-white border-slate-200 hover:shadow-md hover:border-blue-200'}`}>
              <h4 className="font-extrabold text-slate-900">{v.title}</h4>
              <p className="text-xs text-slate-500">{v.desc}</p>
              <span className="text-[10px] font-bold text-slate-400 uppercase">{v.cat}</span>
            </button>
          ))}
        </div>
        <div className="lg:col-span-2 bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="aspect-video bg-black relative">
            <iframe src={`https://www.youtube-nocookie.com/embed/${activeVideo.id}`} title={activeVideo.title || 'Video'} className="w-full h-full" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen />
          </div>
          <div className="p-8">
            <h3 className="text-2xl font-extrabold text-slate-900 mb-2">{activeVideo.title}</h3>
            <div className="flex items-center gap-4 text-sm text-slate-500 mb-6"><span className="inline-flex items-center gap-1"><Clock size={14} /> ~25 min</span><span className="inline-flex items-center gap-1"><CheckCircle size={14} /> Zero redirect</span></div>
            <h4 className="font-bold mb-2 text-slate-900">Key Takeaways</h4>
            <ul className="space-y-2 text-sm text-slate-600 mb-6">
              {['Understand core concepts through guided instruction.', 'Apply patterns in real-world engineering problems.', 'Complete the module checklist to progress.'].map((t, i) => (
                <li key={i} className="flex items-start gap-2"><ArrowRight size={14} className="mt-1 text-blue-600 shrink-0" /><span>{t}</span></li>
              ))}
            </ul>
            <button onClick={() => setCompleted(new Set([...completed, activeVideo.id]))} className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-blue-600 text-white font-bold hover:bg-blue-700 transition shadow-lg shadow-blue-600/20">{completed.has(activeVideo.id) ? 'Completed' : 'Mark Module Complete'}</button>
          </div>
        </div>
      </div>
    </main>
  );
}
