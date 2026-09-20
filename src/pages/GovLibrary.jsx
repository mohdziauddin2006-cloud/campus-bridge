import { ExternalLink, BookOpen, GraduationCap, Monitor, Landmark, Cpu, Globe, Award, FlaskConical } from 'lucide-react';

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
  return (
    <main className="bg-slate-50 min-h-screen pb-20 pt-6 px-6 lg:px-10 max-w-6xl mx-auto">
      <h1 className="text-4xl font-extrabold text-slate-950 mb-3">Free Library</h1>
      <p className="text-slate-600 text-sm font-medium mb-10">Verified national portals and global open-learning hubs.</p>

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
            </a>
          ))}
        </div>
      </section>
    </main>
  );
}
