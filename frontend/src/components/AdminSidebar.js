import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const NAV = [
  { to: '/admin', label: 'Dashboard', icon: '📊', exact: true },
  { to: '/admin/create', label: 'New Article', icon: '✏️' },
];

export default function AdminSidebar() {
  const { admin, logout } = useAuth();
  const { pathname } = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    toast.success('Logged out successfully');
    navigate('/');
  };

  return (
    <aside className="w-64 flex-shrink-0 bg-ipl-card border-r border-ipl-border flex flex-col">
      {/* Logo */}
      <div className="p-6 border-b border-ipl-border">
        <Link to="/" className="flex items-center gap-3">
          <div className="w-9 h-9 bg-gradient-to-br from-ipl-gold to-ipl-orange rounded-lg flex items-center justify-center">
            <span className="text-black font-display text-sm">IPL</span>
          </div>
          <div>
            <p className="font-display text-lg text-white tracking-wider leading-none">
              <span className="gradient-text">CRICKET</span>BUZZ
            </p>
            <p className="text-xs text-gray-500 font-body mt-0.5">Admin Panel</p>
          </div>
        </Link>
      </div>

      {/* Nav */}
      <nav className="flex-1 p-4 space-y-1">
        {NAV.map(({ to, label, icon, exact }) => {
          const active = exact ? pathname === to : pathname.startsWith(to);
          return (
            <Link
              key={to}
              to={to}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg font-heading font-semibold text-sm tracking-wide transition-all ${
                active
                  ? 'bg-ipl-orange text-black shadow-lg shadow-orange-500/20'
                  : 'text-gray-400 hover:text-white hover:bg-ipl-border'
              }`}
            >
              <span className="text-base">{icon}</span>
              {label}
            </Link>
          );
        })}
      </nav>

      {/* User */}
      <div className="p-4 border-t border-ipl-border">
        <div className="flex items-center gap-3 px-3 py-2.5 rounded-lg bg-ipl-dark mb-3">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-ipl-gold to-ipl-orange flex items-center justify-center text-black font-bold text-sm">
            {admin?.username?.charAt(0).toUpperCase()}
          </div>
          <div>
            <p className="text-white text-sm font-semibold capitalize">{admin?.username}</p>
            <p className="text-gray-500 text-xs">Administrator</p>
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg border border-ipl-border text-gray-400 hover:text-ipl-orange hover:border-ipl-orange/40 transition-all font-heading font-semibold text-sm tracking-wider"
        >
          🚪 Logout
        </button>
      </div>
    </aside>
  );
}
