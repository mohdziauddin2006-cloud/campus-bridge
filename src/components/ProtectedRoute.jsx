import { useAuth } from '../context/AuthContext';
import { Navigate } from 'react-router-dom';

export default function ProtectedRoute({ children, role = null }) {
  const { user, role: userRole, loading } = useAuth();
  if (loading) return <div className="min-h-screen flex items-center justify-center"><div className="w-10 h-10 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin" /></div>;
  if (!user) return <Navigate to="/auth" replace />;
  if (role && userRole !== role) return <Navigate to="/" replace />;
  return children;
}
