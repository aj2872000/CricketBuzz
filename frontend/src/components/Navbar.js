import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const { theme, toggleTheme, isDark } = useTheme();
  const location = useLocation();

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handler);
    return () => window.removeEventListener('scroll', handler);
  }, []);

  const navBg = scrolled
    ? isDark
      ? 'bg-[#0A0A0F]/95 backdrop-blur-md border-b shadow-lg shadow-black/20'
      : 'bg-white/95 backdrop-blur-md border-b shadow-lg shadow-black/10'
    : 'bg-transparent';

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${navBg}`}
      style={{ borderColor: 'var(--border)' }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">

          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-9 h-9 bg-gradient-to-br from-[var(--gold)] to-[var(--orange)] rounded-lg flex items-center justify-center shadow-lg transition-shadow group-hover:shadow-orange-400/40">
              <span className="text-black font-display text-sm leading-none">IPL</span>
            </div>
            <span className="font-display text-2xl tracking-wider hidden sm:block" style={{ color: 'var(--text)' }}>
              <span className="gradient-text">CRICKET</span>
              <span className="ml-1">BUZZ</span>
            </span>
          </Link>

          {/* Right side */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Home link */}
            <Link
              to="/"
              className="font-heading font-semibold text-sm tracking-widest uppercase transition-colors hidden sm:block"
              style={{ color: location.pathname === '/' ? 'var(--orange)' : 'var(--text-muted)' }}
            >
              Home
            </Link>

            {/* Write Article — public */}
            <Link
              to="/write"
              className="font-heading font-semibold text-sm tracking-widest uppercase px-4 py-2 rounded-lg transition-all"
              style={{
                background: 'var(--orange)',
                color: '#fff',
              }}
            >
              ✍️ <span className="hidden sm:inline">Write</span>
            </Link>

            {/* Theme toggle */}
            <button
              onClick={toggleTheme}
              aria-label="Toggle theme"
              className="w-9 h-9 rounded-lg flex items-center justify-center transition-all"
              style={{
                background: 'var(--bg-input)',
                border: '1px solid var(--border)',
                color: 'var(--text-muted)',
              }}
            >
              {isDark ? '☀️' : '🌙'}
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}
