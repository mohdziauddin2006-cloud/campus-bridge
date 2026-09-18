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
        <Link to="/tpo-dashboard" className="hover:text-blue-600 transition whitespace-nowrap">TPO Portal</Link>
      </div>

      <Link to="/tpo-login" className="hidden md:inline-block text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 px-4 xl:px-5 py-2.5 rounded-full transition shadow-md shadow-blue-600/20 whitespace-nowrap shrink-0">TPO Officer Sign In</Link>

      {/* Mobile drawer */}
      {open && (
        <div className="md:hidden fixed top-16 left-0 right-0 bottom-0 bg-white/98 backdrop-blur border-b border-slate-200 shadow-xl px-6 py-4 flex flex-col gap-3 z-50 overflow-y-auto">
          <Link to="/" onClick={() => setOpen(false)} className="text-sm font-semibold text-slate-700 hover:text-blue-600 py-2">Student Hub</Link>
          <Link to="/scanner" onClick={() => setOpen(false)} className="text-sm font-semibold text-slate-700 hover:text-blue-600 py-2">ATS Scanner</Link>
          <Link to="/academy" onClick={() => setOpen(false)} className="text-sm font-semibold text-slate-700 hover:text-blue-600 py-2">Video Academy</Link>
          <Link to="/readiness" onClick={() => setOpen(false)} className="text-sm font-semibold text-slate-700 hover:text-blue-600 py-2">Industry Readiness</Link>
          <Link to="/tpo-dashboard" onClick={() => setOpen(false)} className="text-sm font-semibold text-slate-700 hover:text-blue-600 py-2">TPO Portal</Link>
          <Link to="/tpo-login" onClick={() => setOpen(false)} className="text-sm font-bold text-white bg-blue-600 px-5 py-2.5 rounded-full text-center mt-2">TPO Officer Sign In</Link>
        </div>
      )}
    </nav>
  );
}
