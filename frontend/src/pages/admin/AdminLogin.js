import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import toast from 'react-hot-toast';

export default function AdminLogin() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);
  const { login, isAuthenticated } = useAuth();
  const { toggleTheme, isDark } = useTheme();
  const navigate = useNavigate();

  useEffect(() => { if (isAuthenticated) navigate('/admin'); }, [isAuthenticated, navigate]);

  const handleSubmit = async e => {
    e.preventDefault();
    if (!username.trim() || !password) return;
    setLoading(true);
    try {
      await login(username.trim(), password);
      toast.success('Welcome back, Admin!');
      navigate('/admin');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Invalid credentials');
    } finally { setLoading(false); }
  };

  const inputStyle = {
    background: 'var(--bg-input)',
    border: '1px solid var(--border)',
    color: 'var(--text)',
    width: '100%',
    borderRadius: '8px',
    padding: '12px 16px',
    fontSize: '14px',
    outline: 'none',
    transition: 'border-color 0.2s',
  };

  return (
    <>
      <Helmet><title>Admin Login — CricketBuzz</title></Helmet>

      <div className="min-h-screen flex flex-col items-center justify-center px-4 relative overflow-hidden"
        style={{ background: 'var(--bg)' }}>

        {/* BG blobs */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full blur-3xl pointer-events-none"
          style={{ background: 'color-mix(in srgb, var(--orange) 5%, transparent)' }} />
        <div className="absolute bottom-1/4 right-1/4 w-64 h-64 rounded-full blur-3xl pointer-events-none"
          style={{ background: 'color-mix(in srgb, var(--gold) 5%, transparent)' }} />

        {/* Top bar */}
        <div className="absolute top-4 left-4 right-4 flex items-center justify-between">
          <Link to="/" className="font-heading font-semibold text-sm tracking-wider uppercase transition-colors"
            style={{ color: 'var(--text-sub)' }}
            onMouseEnter={e => e.target.style.color = 'var(--orange)'}
            onMouseLeave={e => e.target.style.color = 'var(--text-sub)'}>
            ← Home
          </Link>
          <button onClick={toggleTheme}
            className="w-9 h-9 rounded-lg flex items-center justify-center transition-all"
            style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', color: 'var(--text-muted)' }}>
            {isDark ? '☀️' : '🌙'}
          </button>
        </div>

        <div className="w-full max-w-md animate-slide-up">
          {/* Logo */}
          <div className="text-center mb-8">
            <div className="inline-flex w-16 h-16 rounded-2xl items-center justify-center mb-4 shadow-xl"
              style={{ background: 'linear-gradient(135deg, var(--gold), var(--orange))' }}>
              <span className="text-black font-display text-2xl">IPL</span>
            </div>
            <h1 className="font-display text-4xl tracking-wider" style={{ color: 'var(--text)' }}>
              ADMIN <span className="gradient-text">PANEL</span>
            </h1>
            <p className="text-sm mt-2" style={{ color: 'var(--text-sub)' }}>Sign in to manage your blog</p>
          </div>

          {/* Card */}
          <div className="p-8 rounded-2xl shadow-2xl" style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}>
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-xs font-heading font-semibold tracking-widest uppercase mb-2"
                  style={{ color: 'var(--text-sub)' }}>Username</label>
                <input type="text" value={username} onChange={e => setUsername(e.target.value)}
                  placeholder="admin" required autoComplete="username"
                  style={inputStyle}
                  onFocus={e => e.target.style.borderColor = 'var(--orange)'}
                  onBlur={e => e.target.style.borderColor = 'var(--border)'}
                />
              </div>

              <div>
                <label className="block text-xs font-heading font-semibold tracking-widest uppercase mb-2"
                  style={{ color: 'var(--text-sub)' }}>Password</label>
                <div className="relative">
                  <input type={showPass ? 'text' : 'password'} value={password}
                    onChange={e => setPassword(e.target.value)}
                    placeholder="••••••••" required autoComplete="current-password"
                    style={{ ...inputStyle, paddingRight: '48px' }}
                    onFocus={e => e.target.style.borderColor = 'var(--orange)'}
                    onBlur={e => e.target.style.borderColor = 'var(--border)'}
                  />
                  <button type="button" onClick={() => setShowPass(!showPass)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-lg"
                    style={{ color: 'var(--text-sub)' }}>
                    {showPass ? '🙈' : '👁'}
                  </button>
                </div>
              </div>

              <button type="submit" disabled={loading || !username || !password}
                className="w-full py-3 font-heading font-bold text-sm tracking-widest uppercase rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                style={{ background: 'linear-gradient(135deg, var(--orange), var(--gold))', color: '#000', boxShadow: '0 4px 15px color-mix(in srgb, var(--orange) 25%, transparent)' }}>
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <span className="w-4 h-4 border-2 border-black/40 border-t-black rounded-full animate-spin" />
                    Signing in…
                  </span>
                ) : 'Sign In'}
              </button>
            </form>
          </div>

          <p className="text-center text-xs mt-6" style={{ color: 'var(--text-sub)' }}>
            CricketBuzz Admin · Authorized Access Only
          </p>
        </div>
      </div>
    </>
  );
}
