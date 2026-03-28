import React from 'react';

export default function Pagination({ pagination, onPageChange }) {
  const { page, totalPages } = pagination;
  if (totalPages <= 1) return null;

  const pages = [];
  for (let i = 1; i <= totalPages; i++) {
    if (i === 1 || i === totalPages || (i >= page - 1 && i <= page + 1)) {
      pages.push(i);
    } else if (pages[pages.length - 1] !== '...') {
      pages.push('...');
    }
  }

  return (
    <div className="flex items-center justify-center gap-2 mt-12">
      <button
        onClick={() => onPageChange(page - 1)}
        disabled={page === 1}
        className="px-4 py-2 rounded-lg border border-ipl-border text-gray-400 hover:border-ipl-orange hover:text-ipl-orange disabled:opacity-30 disabled:cursor-not-allowed transition-all font-heading font-semibold text-sm tracking-wider"
      >
        ← PREV
      </button>

      {pages.map((p, i) =>
        p === '...' ? (
          <span key={`ellipsis-${i}`} className="text-gray-600 px-1">…</span>
        ) : (
          <button
            key={p}
            onClick={() => onPageChange(p)}
            className={`w-10 h-10 rounded-lg font-heading font-bold text-sm transition-all ${
              p === page
                ? 'bg-ipl-orange text-black shadow-lg shadow-orange-500/30'
                : 'border border-ipl-border text-gray-400 hover:border-ipl-orange hover:text-ipl-orange'
            }`}
          >
            {p}
          </button>
        )
      )}

      <button
        onClick={() => onPageChange(page + 1)}
        disabled={page === totalPages}
        className="px-4 py-2 rounded-lg border border-ipl-border text-gray-400 hover:border-ipl-orange hover:text-ipl-orange disabled:opacity-30 disabled:cursor-not-allowed transition-all font-heading font-semibold text-sm tracking-wider"
      >
        NEXT →
      </button>
    </div>
  );
}
