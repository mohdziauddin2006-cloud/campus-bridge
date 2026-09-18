import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';
import OpportunitiesPage from './pages/Opportunities';
import Auth from './pages/Auth';
import Dashboard from './pages/Dashboard';
import Scanner from './pages/Scanner';
import Academy from './pages/Academy';
import TpoLogin from './pages/TpoLogin';
import TpoDashboard from './pages/TpoDashboard';
import Readiness from './pages/Readiness';
import Applications from './pages/Applications';

export default function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/auth" element={<Auth onAuth={() => window.location.reload()} initialMode="tpo" />} />
        <Route path="/" element={<ProtectedRoute role="Student"><Dashboard /></ProtectedRoute>} />
        <Route path="/scanner" element={<ProtectedRoute role="Student"><Scanner /></ProtectedRoute>} />
        <Route path="/academy" element={<ProtectedRoute role="Student"><Academy /></ProtectedRoute>} />
        <Route path="/tpo-login" element={<TpoLogin />} />
        <Route path="/opportunities" element={<OpportunitiesPage />} />
        <Route path="/tpo-dashboard" element={<ProtectedRoute role="TPO"><TpoDashboard /></ProtectedRoute>} />
        
        <Route path="/applications" element={<ProtectedRoute role="Student"><Applications /></ProtectedRoute>} />
        <Route path="/readiness" element={<ProtectedRoute role="Student"><Readiness /></ProtectedRoute>} />
      </Routes>
    </BrowserRouter>
  );
}
