import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import toast from 'react-hot-toast';

const NAV = [
  { to: '/admin', label: 'Dashboard', icon: '📊', exact: true },
  { to: '/admin/create', label: 'New Article', icon: '✏️' },
];

export default function AdminSidebar() {
  const { admin, logout } = useAuth();
  const { toggleTheme, isDark } = useTheme();
  const { pathname } = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    toast.success('Logged out successfully');
    navigate('/');
  };

  return (
    <aside className="w-64 flex-shrink-0 flex flex-col"
      style={{ background: 'var(--bg-card)', borderRight: '1px solid var(--border)' }}>

      {/* Logo */}
      <div className="p-6" style={{ borderBottom: '1px solid var(--border)' }}>
        <Link to="/" className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg flex items-center justify-center"
            style={{ background: 'linear-gradient(135deg, var(--gold), var(--orange))' }}>
            <span className="text-black font-display text-sm">IPL</span>
          </div>
          <div>
            <p className="font-display text-lg tracking-wider leading-none" style={{ color: 'var(--text)' }}>
              <span className="gradient-text">CRICKET</span>BUZZ
            </p>
            <p className="text-xs mt-0.5" style={{ color: 'var(--text-sub)' }}>Admin Panel</p>
          </div>
        </Link>
      </div>

      {/* Nav */}
      <nav className="flex-1 p-4 space-y-1">
        {NAV.map(({ to, label, icon, exact }) => {
          const active = exact ? pathname === to : pathname.startsWith(to);
          return (
            <Link key={to} to={to}
              className="flex items-center gap-3 px-4 py-3 rounded-lg font-heading font-semibold text-sm tracking-wide transition-all"
              style={active
                ? { background: 'var(--orange)', color: '#000' }
                : { color: 'var(--text-muted)' }}
              onMouseEnter={e => { if (!active) { e.currentTarget.style.background = 'var(--bg-input)'; e.currentTarget.style.color = 'var(--text)'; } }}
              onMouseLeave={e => { if (!active) { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'var(--text-muted)'; } }}
            >
              <span className="text-base">{icon}</span>
              {label}
            </Link>
          );
        })}
      </nav>

      {/* Bottom */}
      <div className="p-4 space-y-2" style={{ borderTop: '1px solid var(--border)' }}>
        {/* Theme toggle */}
        <button onClick={toggleTheme}
          className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg font-heading font-semibold text-sm tracking-wider transition-all"
          style={{ border: '1px solid var(--border)', color: 'var(--text-muted)', background: 'var(--bg-input)' }}>
          {isDark ? '☀️ Light Mode' : '🌙 Dark Mode'}
        </button>

        {/* User info */}
        <div className="flex items-center gap-3 px-3 py-2.5 rounded-lg" style={{ background: 'var(--bg-input)' }}>
          <div className="w-8 h-8 rounded-full flex items-center justify-center text-black font-bold text-sm"
            style={{ background: 'linear-gradient(135deg, var(--gold), var(--orange))' }}>
            {admin?.username?.charAt(0).toUpperCase()}
          </div>
          <div>
            <p className="text-sm font-semibold capitalize" style={{ color: 'var(--text)' }}>{admin?.username}</p>
            <p className="text-xs" style={{ color: 'var(--text-sub)' }}>Administrator</p>
          </div>
        </div>

        {/* Logout */}
        <button onClick={handleLogout}
          className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg font-heading font-semibold text-sm tracking-wider transition-all"
          style={{ border: '1px solid var(--border)', color: 'var(--text-muted)' }}
          onMouseEnter={e => { e.currentTarget.style.borderColor = '#EF4444'; e.currentTarget.style.color = '#EF4444'; }}
          onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.color = 'var(--text-muted)'; }}>
          🚪 Logout
        </button>
      </div>
    </aside>
  );
}
