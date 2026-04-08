import React from 'react';
import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer style={{ borderTop: '1px solid var(--border)', background: 'var(--bg-card)', marginTop: '5rem' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <Link to="/" className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center"
              style={{ background: 'linear-gradient(135deg, var(--gold), var(--orange))' }}>
              <span className="text-black font-display text-xs">IPL</span>
            </div>
            <span className="font-display text-xl tracking-wider" style={{ color: 'var(--text)' }}>
              <span className="gradient-text">CRICKET</span><span className="ml-1">BUZZ</span>
            </span>
          </Link>
          <p className="text-sm" style={{ color: 'var(--text-sub)' }}>
            © {new Date().getFullYear()} CricketBuzz. Your ultimate IPL destination.
          </p>
          <div className="flex gap-4 text-sm" style={{ color: 'var(--text-sub)' }}>
            <Link to="/" className="transition-colors hover:text-[var(--orange)]" style={{ color: 'var(--text-sub)' }}>Home</Link>
            <span>·</span>
            <Link to="/write" className="transition-colors hover:text-[var(--orange)]" style={{ color: 'var(--text-sub)' }}>Write</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
