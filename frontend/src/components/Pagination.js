import React from 'react';

export default function Pagination({ pagination, onPageChange }) {
  const { page, totalPages } = pagination;
  if (totalPages <= 1) return null;

  const pages = [];
  for (let i = 1; i <= totalPages; i++) {
    if (i === 1 || i === totalPages || (i >= page - 1 && i <= page + 1)) pages.push(i);
    else if (pages[pages.length - 1] !== '...') pages.push('...');
  }

  const btnBase = { border: '1px solid var(--border)', color: 'var(--text-muted)', background: 'var(--bg-card)', transition: 'all 0.2s' };

  return (
    <div className="flex items-center justify-center gap-2 mt-12">
      <button onClick={() => onPageChange(page - 1)} disabled={page === 1}
        className="px-4 py-2 rounded-lg font-heading font-semibold text-sm tracking-wider disabled:opacity-30 disabled:cursor-not-allowed"
        style={btnBase}
        onMouseEnter={e => { if (page > 1) { e.target.style.borderColor = 'var(--orange)'; e.target.style.color = 'var(--orange)'; } }}
        onMouseLeave={e => { e.target.style.borderColor = 'var(--border)'; e.target.style.color = 'var(--text-muted)'; }}>
        ← PREV
      </button>

      {pages.map((p, i) => p === '...' ? (
        <span key={`e${i}`} style={{ color: 'var(--text-sub)' }}>…</span>
      ) : (
        <button key={p} onClick={() => onPageChange(p)}
          className="w-10 h-10 rounded-lg font-heading font-bold text-sm transition-all"
          style={p === page
            ? { background: 'var(--orange)', color: '#fff', border: '1px solid var(--orange)', boxShadow: '0 4px 12px color-mix(in srgb, var(--orange) 30%, transparent)' }
            : btnBase}
          onMouseEnter={e => { if (p !== page) { e.target.style.borderColor = 'var(--orange)'; e.target.style.color = 'var(--orange)'; } }}
          onMouseLeave={e => { if (p !== page) { e.target.style.borderColor = 'var(--border)'; e.target.style.color = 'var(--text-muted)'; } }}>
          {p}
        </button>
      ))}

      <button onClick={() => onPageChange(page + 1)} disabled={page === totalPages}
        className="px-4 py-2 rounded-lg font-heading font-semibold text-sm tracking-wider disabled:opacity-30 disabled:cursor-not-allowed"
        style={btnBase}
        onMouseEnter={e => { if (page < totalPages) { e.target.style.borderColor = 'var(--orange)'; e.target.style.color = 'var(--orange)'; } }}
        onMouseLeave={e => { e.target.style.borderColor = 'var(--border)'; e.target.style.color = 'var(--text-muted)'; }}>
        NEXT →
      </button>
    </div>
  );
}
