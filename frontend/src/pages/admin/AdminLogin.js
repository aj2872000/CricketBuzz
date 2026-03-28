import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';

export default function AdminLogin() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);
  const { login, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) navigate('/admin');
  }, [isAuthenticated, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!username.trim() || !password) return;

    setLoading(true);
    try {
      await login(username.trim(), password);
      toast.success('Welcome back, Admin!');
      navigate('/admin');
    } catch (err) {
      const msg = err.response?.data?.message || 'Invalid credentials';
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Helmet>
        <title>Admin Login — CricketBuzz</title>
      </Helmet>

      <div className="min-h-screen bg-ipl-dark flex flex-col items-center justify-center px-4 relative overflow-hidden">
        {/* Background blobs */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-ipl-orange/5 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-ipl-gold/5 rounded-full blur-3xl pointer-events-none" />

        {/* Back link */}
        <Link
          to="/"
          className="absolute top-6 left-6 flex items-center gap-2 text-gray-500 hover:text-ipl-orange transition-colors text-sm font-heading font-semibold tracking-wider uppercase"
        >
          ← Home
        </Link>

        <div className="w-full max-w-md animate-slide-up">
          {/* Logo */}
          <div className="text-center mb-8">
            <div className="inline-flex w-16 h-16 bg-gradient-to-br from-ipl-gold to-ipl-orange rounded-2xl items-center justify-center mb-4 shadow-xl shadow-orange-500/30">
              <span className="text-black font-display text-2xl">IPL</span>
            </div>
            <h1 className="font-display text-4xl tracking-wider text-white">
              ADMIN <span className="gradient-text">PANEL</span>
            </h1>
            <p className="text-gray-500 text-sm mt-2 font-body">Sign in to manage your blog</p>
          </div>

          {/* Card */}
          <div className="bg-ipl-card border border-ipl-border rounded-2xl p-8 shadow-2xl">
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-xs font-heading font-semibold tracking-widest uppercase text-gray-400 mb-2">
                  Username
                </label>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="admin"
                  required
                  autoComplete="username"
                  className="w-full bg-ipl-dark border border-ipl-border rounded-lg px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-ipl-orange focus:ring-1 focus:ring-ipl-orange/30 transition-all font-body"
                />
              </div>

              <div>
                <label className="block text-xs font-heading font-semibold tracking-widest uppercase text-gray-400 mb-2">
                  Password
                </label>
                <div className="relative">
                  <input
                    type={showPass ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    required
                    autoComplete="current-password"
                    className="w-full bg-ipl-dark border border-ipl-border rounded-lg px-4 py-3 pr-12 text-white placeholder-gray-600 focus:outline-none focus:border-ipl-orange focus:ring-1 focus:ring-ipl-orange/30 transition-all font-body"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPass(!showPass)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300 transition-colors text-lg"
                  >
                    {showPass ? '🙈' : '👁'}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading || !username || !password}
                className="w-full py-3 bg-gradient-to-r from-ipl-orange to-amber-500 text-black font-heading font-bold text-sm tracking-widest uppercase rounded-lg hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg shadow-orange-500/25 mt-2"
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <span className="w-4 h-4 border-2 border-black/40 border-t-black rounded-full animate-spin" />
                    Signing in…
                  </span>
                ) : (
                  'Sign In'
                )}
              </button>
            </form>
          </div>

          <p className="text-center text-gray-600 text-xs mt-6 font-body">
            CricketBuzz Admin · Authorized Access Only
          </p>
        </div>
      </div>
    </>
  );
}
