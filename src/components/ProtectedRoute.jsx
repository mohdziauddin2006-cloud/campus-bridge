import { Navigate } from 'react-router-dom';

export default function ProtectedRoute({ children }) {
  const auth = localStorage.getItem('tpo_auth');
  if (auth !== 'true') {
    return <Navigate to="/tpo-login" replace />;
  }
  return children;
}
