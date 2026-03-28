import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../utils/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [admin, setAdmin] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('ipl_admin_token');
    const user = localStorage.getItem('ipl_admin_user');
    if (token && user) {
      setAdmin(JSON.parse(user));
      // Verify token is still valid
      api.get('/auth/verify').catch(() => {
        localStorage.removeItem('ipl_admin_token');
        localStorage.removeItem('ipl_admin_user');
        setAdmin(null);
      });
    }
    setLoading(false);
  }, []);

  const login = async (username, password) => {
    const { data } = await api.post('/auth/login', { username, password });
    localStorage.setItem('ipl_admin_token', data.token);
    localStorage.setItem('ipl_admin_user', JSON.stringify(data.admin));
    setAdmin(data.admin);
    return data;
  };

  const logout = () => {
    localStorage.removeItem('ipl_admin_token');
    localStorage.removeItem('ipl_admin_user');
    setAdmin(null);
  };

  return (
    <AuthContext.Provider value={{ admin, login, logout, loading, isAuthenticated: !!admin }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};
