import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import Scanner from './pages/Scanner';
import Academy from './pages/Academy';
import TpoLogin from './pages/TpoLogin';
import TpoDashboard from './pages/TpoDashboard';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/scanner" element={<Scanner />} />
        <Route path="/academy" element={<Academy />} />
        <Route path="/tpo-login" element={<TpoLogin />} />
        <Route path="/tpo-dashboard" element={<TpoDashboard />} />
      </Routes>
    </BrowserRouter>
  );
}
