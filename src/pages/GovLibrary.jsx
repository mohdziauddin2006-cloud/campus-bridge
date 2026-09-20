import { ExternalLink, BookOpen, GraduationCap, Monitor, Landmark, Cpu, Globe, Award, FlaskConical, Sparkles, Search } from 'lucide-react';
import { useState } from 'react';

const national = [
  { title: 'NPTEL', desc: 'IIT / IISc video lectures — 1,000+ engineering courses.', url: 'https://nptel.ac.in', icon: Monitor },
  { title: 'SWAYAM', desc: 'Government-certified online MOOCs (MHRD).', url: 'https://swayam.gov.in', icon: GraduationCap },
  { title: 'AICTE e-Kumbh', desc: 'Free technical textbooks & courseware.', url: 'https://www.aicte-india.org', icon: BookOpen },
  { title: 'Virtual Labs (vlab.co.in)', desc: 'Remote-access engineering labs & simulations.', url: 'https://vlab.co.in', icon: FlaskConical },
  { title: 'e-Yantra', desc: 'Robotics education (IIT Bombay).', url: 'https://www.e-yantra.org', icon: Cpu },
  { title: 'NDLI (National Digital Library)', desc: '14M+ books, journals, videos & theses.', url: 'https://ndl.iitkgp.ac.in', icon: BookOpen },
];

const globalOpen = [
  { title: 'MIT OpenCourseWare', desc: 'Full MIT course materials, lectures, notes.', url: 'https://ocw.mit.edu', icon: Monitor },
  { title: 'Harvard CS50', desc: 'Intro to Computer Science — free online.', url: 'https://cs50.harvard.edu', icon: Award },
  { title: 'freeCodeCamp', desc: 'Interactive coding tutorials & certifications.', url: 'https://www.freecodecamp.org', icon: GraduationCap },
  { title: 'MDN Web Docs', desc: 'Authoritative HTML/CSS/JS documentation.', url: 'https://developer.mozilla.org', icon: Globe },
  { title: 'OSS University', desc: 'Open Source Society University curriculum.', url: 'https://github.com/ossu/computer-science', icon: BookOpen },
  { title: 'Kaggle Learn', desc: 'Data science & ML micro-courses.', url: 'https://www.kaggle.com/learn', icon: Cpu },
];

export default function GovLibrary() {
  const [studyQuery, setStudyQuery] = useState('');
  const [studyRoute, setStudyRoute] = useState(null);

  const askStudy = () => {
    if (!studyQuery.trim()) return;
    setStudyRoute({ query: studyQuery, roadmap: `3-week study roadmap for ${studyQuery.trim()}: Week 1 core lectures, Week 2 practice exercises, Week 3 project-based assessment.` });
  };
  return (
    <main className="bg-slate-50 min-h-screen pb-20 pt-6 px-6 lg:px-10 max-w-6xl mx-auto">
      <h1 className="text-4xl font-extrabold text-slate-950 mb-3">Free Library</h1>
      <p className="text-slate-600 text-sm font-medium mb-10">Verified national portals and global open-learning hubs.</p>

      <div className="mb-8 bg-gradient-to-r from-violet-50 to-blue-50 rounded-2xl p-5 border border-violet-200 shadow-sm">
        <div className="flex items-center gap-2 mb-2">
          <Search size={18} className="text-violet-600" />
          <h3 className="font-extrabold text-violet-900">Ask AI Study Route</h3>
        </div>
        <div className="flex gap-2">
          <input
            value={studyQuery}
            onChange={e => setStudyQuery(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && askStudy()}
            placeholder="What should I study? (e.g. VLSI, Full-Stack)"
            className="flex-1 px-4 py-2.5 rounded-xl border border-violet-200 bg-white text-sm font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-violet-500/20"
          />
          <button onClick={askStudy} className="px-5 py-2.5 rounded-full bg-violet-600 text-white font-extrabold shadow hover:bg-violet-700 transition flex items-center gap-2"><Sparkles size={14}/> Ask AI</button>
        </div>
        {studyRoute && (
          <div className="mt-3 bg-white rounded-xl p-4 border border-violet-100 shadow-sm">
            <h4 className="font-extrabold text-violet-900 mb-1">Study Route for: {studyRoute.query}</h4>
            <p className="text-sm text-violet-950 font-medium">{studyRoute.roadmap}</p>
          </div>
        )}
      </div>

      <section className="mb-14">
        <h2 className="text-xl font-extrabold text-slate-900 mb-2">National Portals (India)</h2>
        <p className="text-sm text-slate-500 mb-6">Government-backed and institutional open-learning resources.</p>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
          {national.map(r => (
            <a key={r.title} href={r.url} target="_blank" rel="noopener noreferrer" className="group block bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition p-6">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-9 h-9 rounded-xl bg-blue-50 flex items-center justify-center shrink-0">
                  <r.icon size={18} className="text-blue-600" />
                </div>
                <h3 className="font-extrabold text-slate-900 leading-snug">{r.title}</h3>
              </div>
              <p className="text-sm text-slate-600 font-medium mb-4">{r.desc}</p>
              <span className="inline-flex items-center gap-1.5 text-xs font-extrabold text-blue-600 bg-blue-50 px-2.5 py-1 rounded-full">Visit <ExternalLink size={10} /></span>
              <button onClick={() => setStudyRoute({ query: r.title, roadmap: `3-week AI Study Route via ${r.title}: Week 1 foundational modules → Week 2 applied labs → Week 3 capstone assessment.` })} className="inline-flex items-center gap-1.5 text-xs font-extrabold text-violet-600 bg-violet-50 px-2.5 py-1 rounded-full border border-violet-200 hover:bg-violet-100 transition"><Sparkles size={10}/> AI Study Route</button>
            </a>
          ))}
        </div>
      </section>

      <section>
        <h2 className="text-xl font-extrabold text-slate-900 mb-2">Global Open Learning</h2>
        <p className="text-sm text-slate-500 mb-6">World-class free courses, documentation, and open-source education.</p>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
          {globalOpen.map(r => (
            <a key={r.title} href={r.url} target="_blank" rel="noopener noreferrer" className="group block bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition p-6">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-9 h-9 rounded-xl bg-emerald-50 flex items-center justify-center shrink-0">
                  <r.icon size={18} className="text-emerald-600" />
                </div>
                <h3 className="font-extrabold text-slate-900 leading-snug">{r.title}</h3>
              </div>
              <p className="text-sm text-slate-600 font-medium mb-4">{r.desc}</p>
              <span className="inline-flex items-center gap-1.5 text-xs font-extrabold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full">Visit <ExternalLink size={10} /></span>
              <button onClick={() => setStudyRoute({ query: r.title, roadmap: `3-week AI Study Route via ${r.title}: Week 1 foundational modules → Week 2 applied labs → Week 3 capstone assessment.` })} className="inline-flex items-center gap-1.5 text-xs font-extrabold text-violet-600 bg-violet-50 px-2.5 py-1 rounded-full border border-violet-200 hover:bg-violet-100 transition"><Sparkles size={10}/> AI Study Route</button>
            </a>
          ))}
        </div>
      </section>
    </main>
  );
}
