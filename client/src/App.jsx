import { Navigate, Route, Routes } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import Layout from './components/Layout';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Projects from './pages/Projects';

function Protected({ children }) {
  const { user, loading } = useAuth();
  if (loading) return <div className="app-loading"><div className="spinner" /> Preparing Canopy…</div>;
  return user ? children : <Navigate to="/login" replace />;
}
export default function App() {
  const { user } = useAuth();
  return <Routes>
    <Route path="/login" element={user ? <Navigate to="/" replace /> : <Login />} />
    <Route path="/" element={<Protected><Layout /></Protected>}>
      <Route index element={<Dashboard />} />
      <Route path="projects" element={<Projects />} />
    </Route>
    <Route path="*" element={<Navigate to="/" replace />} />
  </Routes>;
}
