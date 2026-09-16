import { useState } from 'react';
import { CheckCircle, Clock, Award, ChevronRight, GraduationCap, Briefcase } from 'lucide-react';

const CHECK = 'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?q=80&w=800&auto=format&fit=crop';
const TIMELINE = 'https://images.unsplash.com/photo-1497215728101-856f4ea42174?q=80&w=800&auto=format&fit=crop';

export default function App() {
  const [page, setPage] = useState('portal');

  return (
    <div className="min-h-screen bg-[#FDFBF7] text-[#1A1A1A] font-[Inter] selection:bg-[#800020]/10">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-[#FDFBF7]/95 backdrop-blur-sm border-b border-[#EAE6DC]">
        <div className="max-w-7xl mx-auto px-6 md:px-10 h-16 flex items-center justify-between">
          <button onClick={() => setPage('portal')} className="font-[Playfair_Display] text-xl font-bold text-[#1A1A1A] tracking-tight hover:text-[#800020] transition-colors">
            Campus Bridge
          </button>
          <div className="flex gap-8">
            <button onClick={() => setPage('portal')} className="nav-label text-[#1A1A1A] hover:text-[#800020] transition-colors">Student Portal</button>
            <button onClick={() => setPage('applications')} className="nav-label text-[#1A1A1A] hover:text-[#800020] transition-colors">My Applications</button>
            <button onClick={() => setPage('tpo')} className="nav-label text-[#1A1A1A] hover:text-[#800020] transition-colors">TPO Admin</button>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-6 md:px-10">
        {page === 'portal' && <StudentPortal />}
        {page === 'applications' && <MyApplications />}
        {page === 'tpo' && <TPOAdmin />}
      </main>
    </div>
  );
}

/* ═══════════════════════════════════════════
   1) STUDENT PORTAL
   ═══════════════════════════════════════════ */
function StudentPortal() {
  return (
    <>
      {/* HERO */}
      <section className="pt-24 pb-16 md:pt-36 md:pb-28">
        <div className="max-w-5xl">
          <h1 className="hero-display text-[clamp(80px,12vw,120px)] font-black text-[#1A1A1A] leading-[0.88] mb-8 tracking-[-0.04em]">
            The New<br />Standard in<br />Placement.
          </h1>
          <p className="body-text max-w-xl text-lg md:text-xl text-[#3a3a3a] leading-relaxed mb-10">
            A curated bridge between academia and industry. Explore internships, match skills, and apply with precision.
          </p>
          <div className="flex gap-4">
            <button className="btn-pill">Explore Internships</button>
            <button className="btn-pill bg-[#1A1A1A] hover:bg-[#333]">Skill Matcher</button>
          </div>
        </div>
      </section>

      {/* CHECKERBOARD: Explore Internships */}
      <section className="py-16 md:py-24">
        <div className="flex items-baseline gap-4 mb-12">
          <h2 className="section-display text-[clamp(48px,5vw,72px)] font-black text-[#1A1A1A] tracking-[-0.03em]">Explore Internships</h2>
          <span className="nav-label text-[#800020]">CURATED OPENINGS</span>
        </div>

        <div className="grid md:grid-cols-2 gap-0 border border-[#1A1A1A]/10">
          {/* Image block */}
          <div className="checker-square relative h-[520px] md:h-[600px] bg-[#1A1A1A]">
            <img src={CHECK} alt="Team meeting" className="checker-img" />
          </div>
          {/* Text block */}
          <div className="checker-square bg-[#FDFBF7] p-10 md:p-14 flex flex-col justify-between border-t md:border-t-0 md:border-l border-[#1A1A1A]/10">
            <div>
              <h3 className="font-[Playfair_Display] text-3xl md:text-4xl font-bold text-[#1A1A1A] mb-4">Tech, Design, Research</h3>
              <p className="body-text text-base mb-6">Browse verified openings from top-tier companies across VLSI, Software, AI/ML, Embedded, and DevOps.</p>
              <ul className="space-y-3 text-[#3a3a3a] font-medium">
                {['VLSI Verification Engineer — SiliconCore', 'Junior NLP Engineer — Meridian AI', 'DevOps Automation — ShieldNet'].map(i => (
                  <li key={i} className="flex items-center gap-3"><CheckCircle size={16} className="text-[#800020] shrink-0" /> <span className="font-[Inter] text-sm">{i}</span></li>
                ))}
              </ul>
            </div>
            <button className="btn-pill mt-8 w-max">Browse All Openings</button>
          </div>
        </div>
      </section>

      {/* CHECKERBOARD REVERSE: Skill Matcher */}
      <section className="py-16 md:py-24">
        <div className="flex items-baseline gap-4 mb-12">
          <h2 className="section-display text-[clamp(48px,5vw,72px)] font-black text-[#1A1A1A] tracking-[-0.03em]">Skill Matcher</h2>
          <span className="nav-label text-[#800020]">COMPETENCY ANALYSIS</span>
        </div>

        <div className="grid md:grid-cols-2 gap-0 border border-[#1A1A1A]/10">
          {/* Text block first */}
          <div className="checker-square bg-[#800020] text-[#FDFBF7] p-10 md:p-14 flex flex-col justify-between order-2 md:order-1">
            <div>
              <h3 className="font-[Playfair_Display] text-3xl md:text-4xl font-bold mb-4">Where Do You Stand?</h3>
              <p className="text-[#FDFBF7]/90 text-base leading-relaxed mb-6">Upload your resume or describe your skills. Our matcher maps competencies against live internship requirements.</p>
              <div className="flex gap-2 flex-wrap">
                {['React','Verilog','Python','AWS','C'].map(tag => (
                  <span key={tag} className="px-3 py-1 text-xs font-bold uppercase tracking-widest border border-[#FDFBF7]/30">{tag}</span>
                ))}
              </div>
            </div>
            <button className="btn-pill mt-8 w-max bg-[#FDFBF7] text-[#800020] hover:bg-[#EAE6DC]">Start Matching</button>
          </div>
          {/* Image block second */}
          <div className="checker-square relative h-[520px] md:h-[600px] bg-[#1A1A1A] order-1 md:order-2">
            <img src="https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=800&auto=format&fit=crop" alt="Workspace" className="checker-img" />
          </div>
        </div>
      </section>
    </>
  );
}

/* ═══════════════════════════════════════════
   2) MY APPLICATIONS
   ═══════════════════════════════════════════ */
function MyApplications() {
  return (
    <>
      <header className="pt-24 pb-8">
        <h1 className="hero-display text-[clamp(60px,8vw,95px)] font-black text-[#1A1A1A] leading-[0.92] tracking-[-0.04em] mb-4">My Applications</h1>
        <p className="nav-label text-[#800020]">TRACK YOUR PROGRESS</p>
      </header>

      {/* Timeline */}
      <section className="py-12 md:py-20">
        <div className="grid md:grid-cols-2 gap-12 md:gap-20 items-start">
          {/* Timeline graphic */}
          <div className="relative h-[600px] md:h-[720px] bg-[#1A1A1A] overflow-hidden">
            <img src={TIMELINE} alt="Office" className="checker-img opacity-60" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#1A1A1A] via-transparent to-[#1A1A1A]/20" />
            <div className="absolute top-8 left-8 right-8">
              <h3 className="font-[Playfair_Display] text-3xl md:text-5xl text-[#FDFBF7] leading-tight mb-2">Timeline</h3>
              <p className="body-text text-[#FDFBF7]/80 text-sm">Applied → Interviewing → Offered</p>
            </div>
          </div>

          {/* Timeline steps */}
          <div className="flex flex-col gap-10">
            {[
              { title: 'Applied', desc: 'Your application is submitted and under initial review by the hiring team.', icon: Clock, color: '#800020' },
              { title: 'Interviewing', desc: 'You have been shortlisted. Prepare for technical and behavioral rounds.', icon: Briefcase, color: '#A03040' },
              { title: 'Offered', desc: 'Congratulations. Review terms and confirm acceptance to secure your position.', icon: Award, color: '#10b981' },
            ].map((step, i) => (
              <div key={step.title} className="group relative pl-10 border-l-2 border-[#1A1A1A]/10 hover:border-[#800020] transition-colors">
                <div className="absolute -left-[9px] top-0 w-4 h-4 rounded-full bg-[#FDFBF7] border-2 border-[#1A1A1A] group-hover:border-[#800020] transition-colors" />
                <h4 className="font-[Playfair_Display] text-2xl md:text-3xl font-bold mb-2">{step.title}</h4>
                <p className="body-text text-sm md:text-base mb-4">{step.desc}</p>
                <span className="nav-label text-xs text-[#800020]">STEP {i + 1}</span>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}

/* ═══════════════════════════════════════════
   3) TPO ADMIN DASHBOARD
   ═══════════════════════════════════════════ */
function TPOAdmin() {
  return (
    <>
      <header className="pt-24 pb-8">
        <h1 className="hero-display text-[clamp(60px,8vw,95px)] font-black text-[#1A1A1A] leading-[0.92] tracking-[-0.04em] mb-4">TPO Dashboard</h1>
        <p className="nav-label text-[#800020]">PLACEMENT OFFICER VIEW</p>
      </header>

      {/* Metrics */}
      <section className="py-12 md:py-16">
        <div className="grid md:grid-cols-3 gap-0 border-t border-b border-[#1A1A1A]/10">
          {[
            { label: 'Total Placements', val: '312', sub: '+24 this month' },
            { label: 'Active Internships', val: '48', sub: '6 new postings' },
            { label: 'Avg. Stipend', val: '₹26,400', sub: 'Across all domains' },
          ].map(m => (
            <div key={m.label} className="p-8 md:p-10 border-r border-[#1A1A1A]/10 last:border-r-0">
              <h4 className="nav-label text-[#1A1A1A] mb-3">{m.label}</h4>
              <div className="font-[Playfair_Display] text-4xl md:text-6xl font-black text-[#800020] mb-2">{m.val}</div>
              <p className="body-text text-sm">{m.sub}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Approval table */}
      <section className="py-12 md:py-16">
        <h2 className="section-display text-[clamp(36px,4vw,60px)] font-black text-[#1A1A1A] mb-8">Applicant Approvals</h2>
        <div className="overflow-x-auto border border-[#1A1A1A]/10">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#1A1A1A] text-[#FDFBF7]">
                <th className="nav-label px-6 py-4 font-semibold">Name</th>
                <th className="nav-label px-6 py-4 font-semibold">Role</th>
                <th className="nav-label px-6 py-4 font-semibold">Status</th>
                <th className="nav-label px-6 py-4 font-semibold">Action</th>
              </tr>
            </thead>
            <tbody>
              {[
                { name: 'Arjun Mehta', role: 'VLSI Verification Engineer', status: 'Under Review' },
                { name: 'Priya Nair', role: 'Junior React Developer', status: 'Interviewing' },
                { name: 'Daniel Roy', role: 'DevOps Automation Intern', status: 'Offered' },
                { name: 'Shreya Iyer', role: 'Junior NLP Engineer', status: 'Applied' },
              ].map(r => (
                <tr key={r.name} className="border-b border-[#1A1A1A]/10 hover:bg-[#FDFBF7]/50 transition-colors">
                  <td className="px-6 py-4 font-medium">{r.name}</td>
                  <td className="px-6 py-4 text-[#555] text-sm">{r.role}</td>
                  <td className="px-6 py-4 text-sm font-semibold text-[#800020]">{r.status}</td>
                  <td className="px-6 py-4"><button className="btn-pill text-xs px-4 py-2">Review</button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </>
  );
}
