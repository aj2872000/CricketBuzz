import React from 'react';
import { Link } from 'react-router-dom';
import { format } from 'date-fns';

export default function BlogCard({ blog, index = 0 }) {
  const colors = ['#FF6B00', '#F4C430', '#003D7D', '#10B981', '#8B5CF6'];
  const accentColor = colors[index % colors.length];

  return (
    <Link
      to={`/blog/${blog.slug}`}
      className="group block bg-ipl-card border border-ipl-border rounded-xl overflow-hidden hover:border-ipl-orange/40 transition-all duration-300 hover:shadow-lg hover:shadow-orange-500/10 hover:-translate-y-1"
    >
      {/* Cover image or gradient placeholder */}
      <div className="relative h-44 overflow-hidden">
        {blog.coverImage ? (
          <img
            src={blog.coverImage}
            alt={blog.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div
            className="w-full h-full flex items-end p-4"
            style={{ background: `linear-gradient(135deg, #13131A 0%, ${accentColor}33 100%)` }}
          >
            <div
              className="w-12 h-1.5 rounded-full"
              style={{ background: accentColor }}
            />
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-ipl-card/80 to-transparent" />
      </div>

      <div className="p-5">
        {/* Tags */}
        {blog.tags?.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-3">
            {blog.tags.slice(0, 3).map((tag) => (
              <span
                key={tag}
                className="text-xs font-heading font-semibold tracking-widest uppercase px-2 py-0.5 rounded"
                style={{ background: `${accentColor}20`, color: accentColor }}
              >
                {tag}
              </span>
            ))}
          </div>
        )}

        {/* Title */}
        <h2 className="font-heading font-bold text-xl text-white mb-2 leading-tight group-hover:text-ipl-orange transition-colors line-clamp-2">
          {blog.title}
        </h2>

        {/* Excerpt */}
        <p className="text-gray-400 text-sm line-clamp-2 mb-4 leading-relaxed">
          {blog.excerpt}
        </p>

        {/* Footer */}
        <div className="flex items-center justify-between pt-3 border-t border-ipl-border">
          <div className="flex items-center gap-2">
            <div
              className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold text-black"
              style={{ background: accentColor }}
            >
              {blog.author?.charAt(0).toUpperCase()}
            </div>
            <span className="text-xs text-gray-400 font-medium">{blog.author}</span>
          </div>
          <span className="text-xs text-gray-500">
            {format(new Date(blog.createdAt), 'MMM d, yyyy')}
          </span>
        </div>
      </div>
    </Link>
  );
}
