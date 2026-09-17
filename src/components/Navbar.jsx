import { Link } from 'react-router-dom';

export default function Navbar() {
  return (
    <nav className="sticky top-0 z-50 bg-white/95 backdrop-blur border-b border-slate-200 px-6 lg:px-10 h-16 flex items-center justify-between shadow-sm">
      <Link to="/" className="flex items-center gap-2 font-extrabold text-lg tracking-tight text-slate-900">
        <span className="text-blue-600">AITS</span>
        <span className="text-xs font-medium text-slate-400 bg-slate-100 rounded-full px-2.5 py-0.5">CampusBridge SIH26044</span>
      </Link>
      <div className="hidden md:flex items-center gap-8 text-sm font-semibold text-slate-700">
        <Link to="/" className="hover:text-blue-600 transition">Student Hub</Link>
        <Link to="/scanner" className="hover:text-blue-600 transition">ATS Scanner</Link>
        <Link to="/academy" className="hover:text-blue-600 transition">Video Academy</Link>
        <Link to="/tpo-dashboard" className="hover:text-blue-600 transition">TPO Portal</Link>
      </div>
      <Link to="/tpo-login" className="text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 px-5 py-2.5 rounded-full transition shadow-md shadow-blue-600/20">TPO Officer Sign In</Link>
    </nav>
  );
}
