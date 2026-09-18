import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X } from 'lucide-react';

export default function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-50 bg-white/95 backdrop-blur border-b border-slate-200 px-4 sm:px-6 lg:px-10 h-16 flex items-center justify-between shadow-sm">
      <Link to="/" className="flex items-center gap-2 font-extrabold text-lg tracking-tight text-slate-900 shrink-0 min-w-0">
        <span className="text-blue-600 shrink-0">CampusBridge</span>
        <span className="text-xs font-medium text-slate-400 bg-slate-100 rounded-full px-2.5 py-0.5 hidden sm:inline-block truncate max-w-[140px] md:max-w-none">National University Placement</span>
      </Link>

      {/* Mobile hamburger */}
      <button onClick={() => setOpen(!open)} className="md:hidden p-2 rounded-xl hover:bg-slate-100 text-slate-800 shrink-0" aria-label="Toggle menu" aria-expanded={open}>
        {open ? <X size={22} /> : <Menu size={22} />}
      </button>

      {/* Desktop links */}
      <div className="hidden md:flex items-center gap-4 xl:gap-8 text-sm font-semibold text-slate-700">
        <Link to="/" className="hover:text-blue-600 transition whitespace-nowrap">Student Hub</Link>
        <Link to="/scanner" className="hover:text-blue-600 transition whitespace-nowrap">ATS Scanner</Link>
        <Link to="/academy" className="hover:text-blue-600 transition whitespace-nowrap">Video Academy</Link>
        <Link to="/readiness" className="hover:text-blue-600 transition whitespace-nowrap">Industry Readiness</Link>
        <Link to="/jobs" className="hover:text-blue-600 transition whitespace-nowrap">Jobs</Link>
        <Link to="/internships" className="hover:text-blue-600 transition whitespace-nowrap">Internships</Link>
        <Link to="/tpo-dashboard" className="hover:text-blue-600 transition whitespace-nowrap">TPO Portal</Link>
      </div>


      {/* Mobile drawer */}
      {open && (
        <div className="md:hidden absolute top-16 left-0 w-full bg-white border-b border-slate-200 shadow-xl z-50 flex flex-col p-4 space-y-4">
          <Link to="/" onClick={() => setOpen(false)} className="text-slate-800 text-lg font-medium py-1 hover:text-blue-600 transition">Student Hub</Link>
          <Link to="/scanner" onClick={() => setOpen(false)} className="text-slate-800 text-lg font-medium py-1 hover:text-blue-600 transition">ATS Scanner</Link>
          <Link to="/academy" onClick={() => setOpen(false)} className="text-slate-800 text-lg font-medium py-1 hover:text-blue-600 transition">Video Academy</Link>
          <Link to="/readiness" onClick={() => setOpen(false)} className="text-slate-800 text-lg font-medium py-1 hover:text-blue-600 transition">Industry Readiness</Link>
          <Link to="/jobs" className="hover:text-blue-600 transition whitespace-nowrap">Jobs</Link>
        <Link to="/internships" className="hover:text-blue-600 transition whitespace-nowrap">Internships</Link>
        <Link to="/jobs" onClick={() => setOpen(false)} className="text-slate-800 text-lg font-medium py-1 hover:text-blue-600 transition">Jobs</Link>
          <Link to="/internships" onClick={() => setOpen(false)} className="text-slate-800 text-lg font-medium py-1 hover:text-blue-600 transition">Internships</Link>
          <Link to="/gov-library" onClick={() => setOpen(false)} className="text-slate-800 text-lg font-medium py-1 hover:text-blue-600 transition">Gov Library</Link>
        <Link to="/tpo-dashboard" onClick={() => setOpen(false)} className="text-slate-800 text-lg font-medium py-1 hover:text-blue-600 transition">TPO Portal</Link>
        </div>
      )}
    </nav>
  );
}
