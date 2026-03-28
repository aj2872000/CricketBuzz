import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handler);
    return () => window.removeEventListener('scroll', handler);
  }, []);

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      scrolled ? 'bg-ipl-dark/95 backdrop-blur-md border-b border-ipl-border shadow-lg shadow-black/20' : 'bg-transparent'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-9 h-9 bg-gradient-to-br from-ipl-gold to-ipl-orange rounded-lg flex items-center justify-center shadow-lg shadow-orange-500/25 group-hover:shadow-orange-500/50 transition-shadow">
              <span className="text-black font-display text-sm font-bold leading-none">IPL</span>
            </div>
            <span className="font-display text-2xl tracking-wider text-white hidden sm:block">
              <span className="gradient-text">CRICKET</span>
              <span className="text-white ml-1">BUZZ</span>
            </span>
          </Link>

          <div className="flex items-center gap-6">
            <Link
              to="/"
              className={`font-heading font-semibold text-sm tracking-widest uppercase transition-colors ${
                location.pathname === '/' ? 'text-ipl-orange' : 'text-gray-400 hover:text-white'
              }`}
            >
              Home
            </Link>
            <Link
              to="/admin/login"
              className="font-heading font-semibold text-sm tracking-widest uppercase px-4 py-2 border border-ipl-orange/40 text-ipl-orange hover:bg-ipl-orange hover:text-black transition-all rounded-md"
            >
              Admin
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}
