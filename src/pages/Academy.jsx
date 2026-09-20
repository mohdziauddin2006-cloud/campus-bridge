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
  const [tab, setActiveTab] = useState('concept');
  const [showAnswer, setShowAnswer] = useState(false);

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

  const filtered = (videos || []).filter ? (filterCat === 'All' ? videos : videos.filter(v => v.category === filterCat)) : [];
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
      <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 mb-3">Video Academy</h1>
      <p className="text-slate-700 text-base mb-8 font-light">Verified, embeddable public courses — no restricted IDs.</p>

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
          <h3 className="text-[11px] font-bold uppercase tracking-[0.15em] text-slate-700 mb-4">Curated Learning Paths</h3>
          {filtered.map(v => (
            <button
              key={v.videoId}
              onClick={() => {
                setSelectedId(v.videoId);
                setActiveVideo(v);
              }}
              className={`w-full text-left rounded-2xl border p-4 transition shadow-sm ${
                selectedId === v.videoId
                  ? 'bg-blue-50 border-blue-400 shadow-md'
                  : 'bg-white border-slate-200 hover:border-blue-300 hover:shadow-md'
              }`}
            >
              <h4 className="font-extrabold text-slate-900">{v.title}</h4>
              <p className="text-xs text-slate-700">{v.description}</p>
              <span className="text-[10px] font-bold text-slate-700 uppercase">{v.category}</span>
            </button>
          ))}
        </div>

        {/* Video Player */}
        <div className="lg:col-span-2 bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="aspect-video bg-black">
            <iframe
              key={activeVideo.videoId}
              src={`https://www.youtube.com/embed/${activeVideo.videoId}`}
              title="YouTube video player"
              className="w-full h-full rounded-2xl"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
          <div className="p-8">
            <h3 className="text-2xl font-extrabold text-slate-900 mb-2">{activeVideo.title}</h3>
            <div className="flex items-center gap-4 text-sm text-slate-700 text-base mb-8 font-medium">
              <span className="inline-flex items-center gap-1">
                <Clock size={14} /> ~25 min
              </span>
              <span className="inline-flex items-center gap-1">
                <CheckCircle size={14} /> Verifiable public source
              </span>
            </div>
            <h4 className="font-bold text-slate-900 mb-2">Key Takeaways</h4>
            <ul className="space-y-2 text-sm text-slate-800 mb-6">
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

    
      {/* AI Concept Explainer */}
      <div className="bg-white border border-slate-200 shadow-sm rounded-3xl p-8 mb-10">
        <h3 className="text-xl font-extrabold text-slate-900 mb-4">✦ Gemini AI Academy Copilot</h3>
        <div className="flex gap-2 mb-4">
          <button onClick={() => setActiveTab('concept')} className={`px-3 py-1.5 rounded-full text-xs font-bold border ${tab==='concept'?'bg-blue-600 text-white border-blue-600':'bg-slate-50 text-slate-700 border-slate-200'}`}>Concept Breakdown</button>
          <button onClick={() => setActiveTab('interview')} className={`px-3 py-1.5 rounded-full text-xs font-bold border ${tab==='interview'?'bg-blue-600 text-white border-blue-600':'bg-slate-50 text-slate-700 border-slate-200'}`}>Interview Prep</button>
          <button onClick={() => setActiveTab('ask')} className={`px-3 py-1.5 rounded-full text-xs font-bold border ${tab==='ask'?'bg-blue-600 text-white border-blue-600':'bg-slate-50 text-slate-700 border-slate-200'}`}>Ask AI Tutor</button>
        </div>
        <div className="text-sm text-slate-700 font-medium">
          {tab==='concept' && <div><p className="mb-2">Key Takeaways for <b>{(activeVideo||{title:'Lesson'}).title||'Lesson'}</b>:</p><ul className="list-disc pl-5 space-y-1"><li>Core architecture and design pattern</li><li>Syntax and implementation details</li><li>Real-world industrial relevance</li></ul></div>}
          {tab==='interview' && <div><p className="mb-1 font-bold">Interview Question:</p><p>How would you explain {(activeVideo||{title:'this concept'}).title||'this concept'} in a production system?</p><button className="mt-2 px-3 py-1 rounded-full bg-blue-600 text-white text-xs font-bold" onClick={() => setShowAnswer(!showAnswer)}>Reveal Model Answer</button>{showAnswer && <p className="mt-2 text-xs text-slate-500">Answer: It provides structured, scalable behavior with clear separation of concerns.</p>}</div>}
          {tab==='ask' && <div><p>Ask anything about the current lecture.</p></div>}
        </div>
      </div>
</main>

  );
}

