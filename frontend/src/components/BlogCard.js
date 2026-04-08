import React from 'react';
import { Link } from 'react-router-dom';
import { format } from 'date-fns';

const ACCENTS = ['#FF6B00','#C9920A','#003D7D','#10B981','#8B5CF6','#EC4899'];

export default function BlogCard({ blog, index = 0 }) {
  const accent = ACCENTS[index % ACCENTS.length];
  return (
    <Link to={`/blog/${blog.slug}`}
      className="group block rounded-xl overflow-hidden transition-all duration-300 hover:-translate-y-1"
      style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', boxShadow: '0 2px 8px var(--shadow)' }}
      onMouseEnter={e => { e.currentTarget.style.borderColor = `${accent}55`; e.currentTarget.style.boxShadow = `0 8px 24px ${accent}18`; }}
      onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.boxShadow = '0 2px 8px var(--shadow)'; }}
    >
      {/* Cover / placeholder */}
      <div className="relative h-44 overflow-hidden">
        {blog.coverImage ? (
          <img src={blog.coverImage} alt={blog.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
        ) : (
          <div className="w-full h-full flex items-end p-4" style={{ background: `linear-gradient(135deg, var(--bg-input) 0%, ${accent}22 100%)` }}>
            <div className="w-12 h-1.5 rounded-full" style={{ background: accent }} />
          </div>
        )}
        <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, var(--bg-card)80, transparent)' }} />
      </div>

      <div className="p-5">
        {/* Tags */}
        {blog.tags?.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-3">
            {blog.tags.slice(0, 3).map(tag => (
              <span key={tag} className="text-xs font-heading font-semibold tracking-widest uppercase px-2 py-0.5 rounded"
                style={{ background: `${accent}18`, color: accent }}>
                {tag}
              </span>
            ))}
          </div>
        )}

        {/* Title */}
        <h2 className="font-heading font-bold text-xl mb-2 leading-tight line-clamp-2 transition-colors"
          style={{ color: 'var(--text)' }}
          onMouseEnter={e => e.currentTarget.style.color = accent}
          onMouseLeave={e => e.currentTarget.style.color = 'var(--text)'}>
          {blog.title}
        </h2>

        {/* Excerpt */}
        <p className="text-sm line-clamp-2 mb-4 leading-relaxed" style={{ color: 'var(--text-muted)' }}>
          {blog.excerpt}
        </p>

        {/* Footer */}
        <div className="flex items-center justify-between pt-3" style={{ borderTop: '1px solid var(--border)' }}>
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold text-black"
              style={{ background: accent }}>
              {blog.author?.charAt(0).toUpperCase()}
            </div>
            <span className="text-xs font-medium" style={{ color: 'var(--text-muted)' }}>{blog.author}</span>
          </div>
          <span className="text-xs" style={{ color: 'var(--text-sub)' }}>
            {format(new Date(blog.createdAt), 'MMM d, yyyy')}
          </span>
        </div>
      </div>
    </Link>
  );
}
