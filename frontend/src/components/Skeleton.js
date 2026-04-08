import React from 'react';

export function BlogCardSkeleton() {
  return (
    <div className="rounded-xl overflow-hidden" style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}>
      <div className="skeleton h-44 w-full" />
      <div className="p-5">
        <div className="flex gap-2 mb-3"><div className="skeleton h-5 w-16 rounded" /><div className="skeleton h-5 w-12 rounded" /></div>
        <div className="skeleton h-6 w-full mb-2 rounded" /><div className="skeleton h-6 w-3/4 mb-4 rounded" />
        <div className="skeleton h-4 w-full mb-1 rounded" /><div className="skeleton h-4 w-5/6 mb-4 rounded" />
        <div className="flex items-center justify-between pt-3" style={{ borderTop: '1px solid var(--border)' }}>
          <div className="skeleton h-4 w-24 rounded" /><div className="skeleton h-4 w-20 rounded" />
        </div>
      </div>
    </div>
  );
}

export function BlogDetailSkeleton() {
  return (
    <div className="max-w-3xl mx-auto animate-fade-in">
      <div className="skeleton h-8 w-32 rounded mb-8" />
      <div className="flex gap-2 mb-4"><div className="skeleton h-6 w-20 rounded" /><div className="skeleton h-6 w-16 rounded" /></div>
      <div className="skeleton h-12 w-full rounded mb-2" /><div className="skeleton h-12 w-4/5 rounded mb-6" />
      <div className="flex gap-4 mb-8"><div className="skeleton h-4 w-28 rounded" /><div className="skeleton h-4 w-24 rounded" /></div>
      <div className="skeleton h-72 w-full rounded-xl mb-8" />
      {[...Array(6)].map((_, i) => (<div key={i} className="skeleton h-4 rounded mb-3" style={{ width: `${75 + Math.random() * 25}%` }} />))}
    </div>
  );
}

export default BlogCardSkeleton;
