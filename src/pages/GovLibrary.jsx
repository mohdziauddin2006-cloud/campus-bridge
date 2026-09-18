import { ExternalLink, BookOpen, GraduationCap, Monitor, Landmark, Cpu } from 'lucide-react';

const resources = [
  { title: 'NDLI', desc: 'National Digital Library of India — 14M+ books, journals, videos.', url: 'https://ndl.iitkgp.ac.in', icon: BookOpen },
  { title: 'SWAYAM', desc: 'Free Govt Certifications — MOOCs from MHRD.', url: 'https://swayam.gov.in', icon: GraduationCap },
  { title: 'NPTEL', desc: 'IIT Video Lectures — 1,000+ engineering courses.', url: 'https://nptel.ac.in', icon: Monitor },
  { title: 'e-PG Pathshala', desc: 'UG/PG course material from HRD ministry.', url: 'https://epgpathshala.ac.in', icon: Landmark },
  { title: 'AICTE Books', desc: 'Free technical textbooks for diploma & degree.', url: 'https://www.aicte-india.org', icon: Cpu },
  { title: 'Skill India', desc: 'Digital training in AI, IoT, manufacturing.', url: 'https://skillindia.gov.in', icon: GraduationCap },
];

export default function GovLibrary() {
  return (
    <main className="bg-[#1b1e23] min-h-screen pb-20 pt-6 px-6 lg:px-10 text-[#e2e8f0]">
      <h1 className="text-4xl font-extrabold mb-2">Government Resource Library</h1>
      <p className="text-slate-400 mb-10">Open, free, and authoritative Indian education portals.</p>
      <div className="grid md:grid-cols-3 gap-6">
        {resources.map(r => (
          <a key={r.title} href={r.url} target="_blank" rel="noopener noreferrer" className="bg-[#26282f] rounded-2xl p-6 border border-slate-700 hover:border-emerald-500 transition shadow-lg shadow-black/20 hover:-translate-y-1">
            <div className="flex items-center gap-3 mb-3"><r.icon className="text-emerald-400" size={28} /><h2 className="text-xl font-extrabold">{r.title}</h2></div>
            <p className="text-slate-300 text-sm mb-3">{r.desc}</p>
            <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-300">Visit <ExternalLink size={12}/></span>
          </a>
        ))}
      </div>
    </main>
  );
}
