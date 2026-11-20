import { createContext, useContext, useState } from 'react';
import api from '../api';

const AuthContext = createContext(null);
export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try { return JSON.parse(localStorage.getItem('arena_user')); } catch { return null; }
  });
  const [loading, setLoading] = useState(false);
  const save = (data) => {
    localStorage.setItem('arena_token', data.token);
    localStorage.setItem('arena_user', JSON.stringify(data.user));
    setUser(data.user);
  };
  const login = async (credentials) => { setLoading(true); try { const { data } = await api.post('/auth/login', credentials); save(data); return data; } finally { setLoading(false); } };
  const register = async (details) => { setLoading(true); try { const { data } = await api.post('/auth/register', details); save(data); return data; } finally { setLoading(false); } };
  const logout = () => { localStorage.removeItem('arena_token'); localStorage.removeItem('arena_user'); setUser(null); };
  return <AuthContext.Provider value={{ user, login, register, logout, loading }}>{children}</AuthContext.Provider>;
}
export const useAuth = () => useContext(AuthContext);
