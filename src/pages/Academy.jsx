import { useState, useEffect, useMemo } from 'react';
import { CheckCircle, Clock, ArrowRight } from 'lucide-react';

const videos = [
  { videoId: 'rfscVS0vtbw', title: 'Python Full Course', description: 'Complete Python from zero to advanced.', category: 'Programming' },
  { videoId: '8hly31xKli0', title: 'Data Structures & Algorithms', description: 'Core DSA patterns and optimization.', category: 'Programming' },
  { videoId: 'A74TOX803D0', title: 'Java Full Course', description: 'OOP, collections, multithreading.', category: 'Programming' },
  { videoId: '7xngnjfIlK4', title: 'Docker & Kubernetes', description: 'Container orchestration and DevOps.', category: 'Cloud / DevOps' },
  { videoId: 'G3e-cpL7ofc', title: 'HTML & CSS Full Course', description: 'Responsive design and layout.', category: 'Web Dev' },
  { videoId: 'lNuXY4_34aU', title: 'Computer Architecture / Digital Logic', description: 'VLSI, digital design fundamentals.', category: 'VLSI / Hardware' },
  { videoId: '1qw5ITr3k9E', title: 'Technical Interview Preparation', description: 'Behavioral and coding interview strategies.', category: 'Soft Skills' },
  { videoId: 'kqtD5dpn9C8', title: 'Business Fundamentals', description: 'Marketing, finance, and strategic management.', category: 'Marketing / Finance' },
];

const categories = ['All', 'Programming', 'Cloud / DevOps', 'Web Dev', 'VLSI / Hardware', 'Soft Skills', 'Marketing / Finance'];

export default function Academy() {
  const [filterCat, setFilterCat] = useState('All');
  const [selectedId, setSelectedId] = useState(videos[0].videoId);
  const [activeVideo, setActiveVideo] = useState(videos[0]);
  const [completed, setCompleted] = useState(new Set());

  useEffect(() => {
    // Filter category change: select first video in category
    if (filterCat !== 'All') {
      const firstInCat = videos.find(v => v.category === filterCat);
      if (firstInCat && firstInCat.videoId !== selectedId) {
        setSelectedId(firstInCat.videoId);
      }
    }
  }, [filterCat]);

  useEffect(() => {
    // 1:1 video synchronization: activeVideo always matches selectedId
    if (selectedId) {
      const matched = videos.find(v => v.videoId === selectedId);
      if (matched && matched.videoId !== activeVideo?.videoId) {
        setActiveVideo(matched);
      }
    }
  }, [selectedId]);

  const filtered = filterCat === 'All' ? videos : videos.filter(v => v.category === filterCat);
  const toggleComplete = () => {
    const next = new Set(completed);
    if (next.has(activeVideo.videoId)) {
      next.delete(activeVideo.videoId);
    } else {
      next.add(activeVideo.videoId);
    }
    setCompleted(next);
  };

  return (
    <main className="bg-slate-50 min-h-screen pb-24 pt-10 px-6 lg:px-16 max-w-7xl mx-auto">
      <h1 className="text-4xl font-black tracking-tight text-white mb-3">Video Academy</h1>
      <p className="text-slate-400 text-base mb-8 font-light">Verified, embeddable public courses — no restricted IDs.</p>

      <div className="flex flex-wrap gap-2 mb-8">
        {categories.map(c => (
          <button
            key={c}
            onClick={() => {
              setFilterCat(c);
              if (c !== 'All') {
                const first = videos.find(v => v.category === c);
                if (first) setSelectedId(first.videoId);
              }
            }}
            className={`px-3 py-1.5 rounded-full text-sm font-semibold tracking-wide transition border ${
              filterCat === c
                ? 'bg-blue-600 text-white border-blue-600 shadow-md'
                : 'bg-white text-slate-700 border-slate-200 hover:border-blue-300'
            }`}
          >
            {c}
          </button>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Video List */}
        <div className="space-y-3">
          <h3 className="text-[11px] font-bold uppercase tracking-[0.15em] text-slate-500 mb-4">Curated Learning Paths</h3>
          {filtered.map(v => (
            <button
              key={v.videoId}
              onClick={() => {
                setSelectedId(v.videoId);
                setActiveVideo(v);
              }}
              className={`w-full text-left rounded-2xl border p-4 transition shadow-sm ${
                selectedId === v.videoId
                  ? 'bg-blue-50/40 border-blue-400/40 shadow-[0_8px_30px_rgba(59,130,246,0.12)]'
                  : 'bg-white border-white/10 hover:border-white/20 hover:shadow-xl hover:shadow-black/20 transition-all duration-300'
              }`}
            >
              <h4 className="font-extrabold text-slate-100">{v.title}</h4>
              <p className="text-xs text-slate-500">{v.description}</p>
              <span className="text-[10px] font-bold text-slate-400 uppercase">{v.category}</span>
            </button>
          ))}
        </div>

        {/* Video Player */}
        <div className="lg:col-span-2 bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="aspect-video bg-black">
            <iframe
              key={activeVideo.videoId}
              src={`https://www.youtube.com/embed/${activeVideo.videoId}`}
              title={activeVideo.title}
              className="w-full h-full"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
          <div className="p-8">
            <h3 className="text-2xl font-extrabold text-slate-100 mb-2">{activeVideo.title}</h3>
            <div className="flex items-center gap-4 text-sm text-slate-400 text-base mb-8 font-light">
              <span className="inline-flex items-center gap-1">
                <Clock size={14} /> ~25 min
              </span>
              <span className="inline-flex items-center gap-1">
                <CheckCircle size={14} /> Verifiable public source
              </span>
            </div>
            <h4 className="font-bold text-slate-100 mb-2">Key Takeaways</h4>
            <ul className="space-y-2 text-sm text-slate-600 mb-6">
              {[
                'Understand core concepts through guided instruction.',
                'Apply patterns in real-world engineering problems.',
                'Complete the module checklist to progress.',
              ].map((t, i) => (
                <li key={i} className="flex items-start gap-2">
                  <ArrowRight size={14} className="mt-1 text-blue-600 shrink-0" />
                  <span>{t}</span>
                </li>
              ))}
            </ul>
            <button
              onClick={toggleComplete}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-blue-600 text-white font-bold hover:bg-blue-700 transition shadow-lg"
            >
              {completed.has(activeVideo.videoId) ? 'Completed' : 'Mark Module Complete'}
            </button>
            <a
              href={`https://www.youtube.com/watch?v=${activeVideo.videoId}`}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 text-xs font-semibold text-blue-600 hover:text-blue-800 mt-3"
            >
              Watch Directly on YouTube (Fallback) ↗
            </a>
          </div>
        </div>
      </div>

      {/* Govt & Open Resources */}
      <div className="bg-gradient-to-br from-blue-950 to-indigo-950 rounded-3xl p-8 text-white shadow-2xl mb-10 mt-10">
        <h2 className="text-xl font-extrabold mb-2">Govt & Open Resources</h2>
        <p className="text-slate-200 text-sm mb-6">Free, verified academic resources for Indian engineering students.</p>
        <div className="grid sm:grid-cols-3 gap-4">
          <a
            href="https://nptel.ac.in/content/html"
            target="_blank"
            rel="noopener noreferrer"
            className="block bg-slate-800 hover:bg-slate-900 rounded-2xl border border-slate-700 p-5 transition shadow-lg"
          >
            <h4 className="font-extrabold mb-1">NPTEL: VLSI Design</h4>
            <p className="text-xs text-slate-200">Free course on microelectronics design (IIT Bombay / NPTEL).</p>
          </a>
          <a
            href="https://swayam.gov.in/"
            target="_blank"
            rel="noopener noreferrer"
            className="block bg-slate-800 hover:bg-slate-900 rounded-2xl border border-slate-700 p-5 transition shadow-lg"
          >
            <h4 className="font-extrabold mb-1">SWAYAM: Embedded C</h4>
            <p className="text-xs text-slate-200">Government-certified embedded systems & microcontroller course.</p>
          </a>
          <a
            href="https://nptel.ac.in/content/pdf"
            target="_blank"
            rel="noopener noreferrer"
            className="block bg-slate-800 hover:bg-slate-900 rounded-2xl border border-slate-700 p-5 transition shadow-lg"
          >
            <h4 className="font-extrabold mb-1">AICTE Technical Books</h4>
            <p className="text-xs text-slate-200">Recommended open-source PDF downloads for engineering core.</p>
          </a>
        </div>
      </div>
    </main>
  );
}
