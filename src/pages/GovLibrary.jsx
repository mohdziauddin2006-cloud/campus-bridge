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
    <main className="bg-slate-50 min-h-screen pb-20 pt-6 px-6 lg:px-10">
      <h1 className="text-4xl font-extrabold text-slate-950 mb-2">Government Resource Library</h1>
      <p className="text-slate-700 text-sm font-medium mb-10">Open, free, and authoritative Indian education portals.</p>

      <div className="grid md:grid-cols-3 gap-6">
        {resources.map(r => (
          <a
            key={r.title}
            href={r.url}
            target="_blank"
            rel="noopener noreferrer"
            className="block bg-white rounded-2xl p-6 border border-slate-200 shadow-sm hover:shadow-md hover:-translate-y-1 transition"
          >
            <div className="flex items-center gap-3 mb-3">
              <r.icon className="text-emerald-600" size={28} />
              <h2 className="text-xl font-extrabold text-slate-950">{r.title}</h2>
            </div>
            <p className="text-slate-700 text-sm font-medium mb-3">{r.desc}</p>
            <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-600">Visit <ExternalLink size={12} /></span>
          </a>
        ))}
      </div>

      <h2 className="text-xl font-extrabold text-slate-950 mb-4 mt-12">Open Source PDF Library</h2>
      <div className="grid md:grid-cols-2 gap-4 mb-10">
        {[
          { title: 'VLSI Design & SystemVerilog Architecture.pdf', desc: 'Advanced digital design, SystemVerilog, and physical design fundamentals.' },
          { title: 'Intel 8086 & 8051 Microcontrollers Guide.pdf', desc: 'Microprocessor architecture, assembly programming, and embedded systems.' },
          { title: 'Python Data Engineering & Systems.pdf', desc: 'Python for data pipelines, automation, and cloud-native architectures.' },
          { title: 'AICTE Model Engineering Curriculum.pdf', desc: 'National engineering core curriculum and accreditation framework.' },
        ].map(p => (
          <div key={p.title} className="bg-white rounded-2xl border border-slate-200 p-5 hover:shadow-sm transition">
            <h4 className="font-extrabold text-slate-950 mb-2">{p.title}</h4>
            <p className="text-xs text-slate-700 font-medium mb-3">{p.desc}</p>
            <a
              href="https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf"
              download="Engineering_Resource.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="px-3 py-1.5 bg-blue-600 text-white rounded-lg text-xs font-medium hover:bg-blue-700 inline-block transition"
            >
              Download PDF
            </a>
          </div>
        ))}
      </div>
    </main>
  );
}
