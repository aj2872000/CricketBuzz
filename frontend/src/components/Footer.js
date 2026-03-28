import React from 'react';
import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="border-t border-ipl-border bg-ipl-card mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <Link to="/" className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gradient-to-br from-ipl-gold to-ipl-orange rounded-lg flex items-center justify-center">
              <span className="text-black font-display text-xs font-bold">IPL</span>
            </div>
            <span className="font-display text-xl tracking-wider">
              <span className="gradient-text">CRICKET</span>
              <span className="text-white ml-1">BUZZ</span>
            </span>
          </Link>
          <p className="text-gray-500 text-sm font-body">
            © {new Date().getFullYear()} CricketBuzz. Your ultimate IPL destination.
          </p>
          <div className="flex gap-4 text-sm text-gray-500">
            <Link to="/" className="hover:text-ipl-orange transition-colors">Home</Link>
            <span>·</span>
            <Link to="/admin" className="hover:text-ipl-orange transition-colors">Admin</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
