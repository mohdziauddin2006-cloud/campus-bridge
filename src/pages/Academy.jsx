import { useState, useEffect } from 'react';
import { Play, CheckCircle, Clock, ArrowRight } from 'lucide-react';
import { supabase } from '../lib/supabase';

export default function Academy() {
  const [videos, setVideos] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeId, setActiveId] = useState('');
  const [completed, setCompleted] = useState(new Set());
  const [filterCat, setFilterCat] = useState('All');

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      try {
        const { data: vidData } = await supabase.from('video_academy').select('*').order('youtube_id');
        const { data: catData } = await supabase.from('video_academy').select('category').not('category', 'is', null);
        if (vidData && vidData.length > 0) { setVideos(vidData); }
        if (catData && catData.length > 0) { const cats = ['All', ...new Set(catData.map(c => c.category))]; setCategories(cats); }
        if (vidData && vidData.length > 0) setActiveId(vidData[0].youtube_id);
      } catch (e) { console.error('supabase fetch', e); }
      // Expanded seed overlay (new categories + working public IDs)
      const expanded = [
        { youtube_id: 'hZnNUW1I9pA', title: 'Financial Statement Analysis', description: 'Balance sheet, cash flow, ratios', category: 'Finance & Accounting' },
        { youtube_id: 'JwHK0TShM3w', title: 'Accounting Principles for Startups', description: 'GAAP / IFRS basics for founders', category: 'Finance & Accounting' },
        { youtube_id: 'Fvsl-A59RKU', title: 'SEO Strategy 2026', description: 'Keyword mapping, backlinks, technical SEO', category: 'Marketing & SEO' },
        { youtube_id: 'OkyNq9XHLMU', title: 'Content Marketing & Funnel Design', description: 'Conversion-focused content systems', category: 'Marketing & SEO' },
        { youtube_id: 'tXbKzZAwgUo', title: 'CAD Design Basics (SolidWorks)', description: 'Parametric modeling for engineering', category: 'Mechanical & CAD' },
        { youtube_id: 'cO7AaxbM0Mc', title: 'Mechanical Drawing & GD&T', description: 'Tolerancing and assembly design', category: 'Mechanical & CAD' },
        { youtube_id: '8yV0ZzRQ6G8', title: 'Hospital Administration Overview', description: 'Operations, compliance, patient flow', category: 'Healthcare Admin' },
        { youtube_id: 'L3w1Z6iZqWk', title: 'Healthcare Data & HIPAA Basics', description: 'Privacy, interoperability, standards', category: 'Healthcare Admin' },
        { youtube_id: 'U-xYHFrPjO0', title: 'Interview Mastery', description: 'Behavioral questions & STAR method', category: 'Core Soft Skills' },
        { youtube_id: 'Dg01onyMrAk', title: 'Professional Communication', description: 'Emails, presentations, cross-functional dialogue', category: 'Core Soft Skills' },
      ];
      setVideos(prev => { const existing = new Map((prev || []).map(v => [v.youtube_id, v])); expanded.forEach(e => existing.set(e.youtube_id, e)); return Array.from(existing.values()); });
      setCategories(prev => { const merged = new Set([... (prev || []), ...expanded.map(e => e.category)]); return ['All', ...merged]; });
      setActiveId(prev => prev || (expanded[0]?.youtube_id || ''));
      setLoading(false);
    }
    fetchData();
  }, []);

  if (loading) return (
    <main className="bg-slate-50 min-h-screen pb-20 pt-6 px-6 lg:px-10 max-w-6xl mx-auto">
      <div className="flex items-center justify-center h-96"><div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" /></div>
    </main>
  );

  const filtered = filterCat === 'All' ? videos : videos.filter(v => v.category === filterCat);
  const activeVideo = videos.find(v => v.youtube_id === activeId) || videos[0];

  return (
    <main className="bg-slate-50 min-h-screen pb-20 pt-6 px-6 lg:px-10 max-w-6xl mx-auto">
      <h1 className="text-3xl font-extrabold text-slate-900 mb-2">Video Academy</h1>
      <p className="text-slate-500 mb-6">In-app embedded curriculum — multi-language, verified sources.</p>

      <div className="flex flex-wrap gap-2 mb-8">
        {categories.map(c => (
          <button key={c} onClick={() => { setFilterCat(c); setActiveId((videos.find(v => v.category === c) || videos[0])?.youtube_id || ''); }} className={`px-3 py-1.5 rounded-full text-sm font-bold transition border ${filterCat === c ? 'bg-blue-600 text-white border-blue-600 shadow-md' : 'bg-white text-slate-700 border-slate-200 hover:border-blue-300'}`}>{c}</button>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        <div className="space-y-3">
          <h3 className="text-xs font-extrabold uppercase tracking-widest text-slate-400 mb-3">Curated Learning Paths</h3>
          {filtered.map(v => (
            <button key={v.youtube_id} onClick={() => setActiveId(v.youtube_id)} className={`w-full text-left rounded-2xl border p-4 transition shadow-sm ${activeId === v.youtube_id ? 'bg-blue-50 border-blue-200 shadow-md' : 'bg-white border-slate-200 hover:shadow-md hover:border-blue-200'}`}>
              <h4 className="font-extrabold text-slate-900">{v.title}</h4>
              <p className="text-xs text-slate-500">{v.description}</p>
              <span className="text-[10px] font-bold text-slate-400 uppercase">{v.category}</span>
            </button>
          ))}
        </div>
        <div className="lg:col-span-2 bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="aspect-video bg-black relative">
            <iframe src={`https://www.youtube-nocookie.com/embed/${activeVideo?.youtube_id}`} title={activeVideo?.title || 'Video'} className="w-full h-full" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen />
          </div>
          <div className="p-8">
            <h3 className="text-2xl font-extrabold text-slate-900 mb-2">{activeVideo?.title}</h3>
            <div className="flex items-center gap-4 text-sm text-slate-500 mb-6"><span className="inline-flex items-center gap-1"><Clock size={14} /> ~25 min</span><span className="inline-flex items-center gap-1"><CheckCircle size={14} /> Zero redirect</span></div>
            <h4 className="font-bold mb-2 text-slate-900">Key Takeaways</h4>
            <ul className="space-y-2 text-sm text-slate-600 mb-6">
              {['Understand core concepts through guided instruction.', 'Apply patterns in real-world engineering problems.', 'Complete the module checklist to progress.'].map((t, i) => (
                <li key={i} className="flex items-start gap-2"><ArrowRight size={14} className="mt-1 text-blue-600 shrink-0" /><span>{t}</span></li>
              ))}
            </ul>
            <button onClick={() => setCompleted(new Set([...completed, activeVideo?.youtube_id]))} className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-blue-600 text-white font-bold hover:bg-blue-700 transition shadow-lg shadow-blue-600/20">{completed.has(activeVideo?.youtube_id) ? 'Completed' : 'Mark Module Complete'}</button>
          </div>
        </div>
      </div>
    </main>
  );
}
