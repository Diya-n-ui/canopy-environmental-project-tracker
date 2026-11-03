import { createContext, useContext, useEffect, useState } from 'react';
import api from '../api';

const AuthContext = createContext(null);
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('canopy_token');
    if (!token) { setLoading(false); return; }
    api.get('/auth/me').then(({ data }) => setUser(data.user))
      .catch(() => localStorage.removeItem('canopy_token'))
      .finally(() => setLoading(false));
  }, []);

  async function login(email, password) {
    const { data } = await api.post('/auth/login', { email, password });
    localStorage.setItem('canopy_token', data.token);
    setUser(data.user);
  }
  function logout() {
    localStorage.removeItem('canopy_token');
    setUser(null);
  }
  return <AuthContext.Provider value={{ user, loading, login, logout }}>{children}</AuthContext.Provider>;
}
export const useAuth = () => useContext(AuthContext);
