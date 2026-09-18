import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import OpportunitiesPage from './pages/Opportunities';
import Auth from './pages/Auth';
import Dashboard from './pages/Dashboard';
import Scanner from './pages/Scanner';
import Academy from './pages/Academy';
import TpoLogin from './pages/TpoLogin';
import TpoDashboard from './pages/TpoDashboard';
import Readiness from './pages/Readiness';
import Applications from './pages/Applications';
import ProtectedRoute from './components/ProtectedRoute';

export default function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen w-full overflow-x-hidden bg-slate-50">
        <Navbar />
        <Routes>
        <Route path="/auth" element={<Auth />} />
        <Route path="/" element={<Dashboard />} />
        <Route path="/scanner" element={<Scanner />} />
        <Route path="/academy" element={<Academy />} />
        <Route path="/tpo-login" element={<TpoLogin />} />
        <Route path="/opportunities" element={<OpportunitiesPage />} />
        <Route path="/tpo-dashboard" element={<ProtectedRoute><TpoDashboard /></ProtectedRoute>} />
        <Route path="/applications" element={<Applications />} />
        <Route path="/readiness" element={<Readiness />} />
      </Routes>
      </div>
    </BrowserRouter>
  );
}
