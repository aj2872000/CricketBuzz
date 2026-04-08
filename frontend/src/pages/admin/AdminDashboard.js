import React, { useState, useEffect, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { format } from 'date-fns';
import api from '../../utils/api';
import AdminSidebar from '../../components/AdminSidebar';
import toast from 'react-hot-toast';

export default function AdminDashboard() {
  const [blogs, setBlogs] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, totalPages: 1, total: 0 });
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState(null);
  const [page, setPage] = useState(1);
  const navigate = useNavigate();

  const fetchBlogs = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await api.get('/blogs/admin/all', { params: { page, limit: 10 } });
      setBlogs(data.data);
      setPagination(data.pagination);
    } catch { toast.error('Failed to load articles'); }
    finally { setLoading(false); }
  }, [page]);

  useEffect(() => { fetchBlogs(); }, [fetchBlogs]);

  const handleDelete = async (id, title) => {
    if (!window.confirm(`Delete "${title}"? This cannot be undone.`)) return;
    setDeletingId(id);
    try {
      await api.delete(`/blogs/${id}`);
      toast.success('Article deleted');
      fetchBlogs();
    } catch { toast.error('Failed to delete'); }
    finally { setDeletingId(null); }
  };

  const handleTogglePublish = async (blog) => {
    try {
      await api.put(`/blogs/${blog._id}`, { published: !blog.published });
      toast.success(blog.published ? 'Set to draft' : 'Published!');
      fetchBlogs();
    } catch { toast.error('Failed to update status'); }
  };

  const draftCount = blogs.filter(b => !b.published).length;
  const stats = [
    { label: 'Total Articles', value: pagination.total, icon: '📝', color: 'var(--orange)' },
    { label: 'Pending Review', value: draftCount, icon: '⏳', color: '#EAB308' },
    { label: 'Total Pages', value: pagination.totalPages, icon: '📚', color: '#10B981' },
  ];

  return (
    <>
      <Helmet><title>Dashboard — CricketBuzz Admin</title></Helmet>
      <div className="min-h-screen flex" style={{ background: 'var(--bg)' }}>
        <AdminSidebar />

        <div className="flex-1 overflow-auto">
          {/* Header */}
          <div className="px-8 py-5 flex items-center justify-between"
            style={{ background: 'var(--bg-card)', borderBottom: '1px solid var(--border)' }}>
            <div>
              <h1 className="font-heading font-bold text-2xl" style={{ color: 'var(--text)' }}>Dashboard</h1>
              <p className="text-sm mt-0.5" style={{ color: 'var(--text-sub)' }}>Manage your IPL articles</p>
            </div>
            <Link to="/admin/create"
              className="flex items-center gap-2 px-5 py-2.5 font-heading font-bold text-sm tracking-wider rounded-lg text-white transition-opacity hover:opacity-90"
              style={{ background: 'linear-gradient(135deg, var(--orange), var(--gold))' }}>
              ✏️ New Article
            </Link>
          </div>

          <div className="p-8">
            {/* Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
              {stats.map(s => (
                <div key={s.label} className="rounded-xl p-5" style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-heading font-semibold tracking-wider uppercase" style={{ color: 'var(--text-sub)' }}>{s.label}</span>
                    <div className="w-9 h-9 rounded-lg flex items-center justify-center text-lg"
                      style={{ background: `color-mix(in srgb, ${s.color} 15%, transparent)` }}>
                      {s.icon}
                    </div>
                  </div>
                  <p className="font-display text-4xl" style={{ color: 'var(--text)' }}>
                    {loading ? '—' : s.value}
                  </p>
                </div>
              ))}
            </div>

            {/* Draft review notice */}
            {!loading && draftCount > 0 && (
              <div className="mb-4 px-4 py-3 rounded-lg flex items-center gap-3"
                style={{ background: 'color-mix(in srgb, #EAB308 10%, transparent)', border: '1px solid color-mix(in srgb, #EAB308 25%, transparent)' }}>
                <span>⏳</span>
                <p className="text-sm" style={{ color: '#CA8A04' }}>
                  <strong>{draftCount}</strong> article{draftCount !== 1 ? 's' : ''} pending review. Click the status dot to publish.
                </p>
              </div>
            )}

            {/* Table */}
            <div className="rounded-xl overflow-hidden" style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}>
              <div className="px-6 py-4 flex items-center justify-between" style={{ borderBottom: '1px solid var(--border)' }}>
                <h2 className="font-heading font-bold text-lg" style={{ color: 'var(--text)' }}>All Articles</h2>
                {!loading && <span className="text-sm" style={{ color: 'var(--text-sub)' }}>{pagination.total} total</span>}
              </div>

              {loading ? (
                <div className="p-8 space-y-3">
                  {[...Array(5)].map((_, i) => <div key={i} className="skeleton h-14 rounded-lg" />)}
                </div>
              ) : blogs.length === 0 ? (
                <div className="text-center py-16">
                  <div className="text-5xl mb-4">📝</div>
                  <p className="mb-4" style={{ color: 'var(--text-muted)' }}>No articles yet</p>
                  <Link to="/admin/create" className="px-5 py-2.5 font-heading font-bold text-sm rounded-lg text-white" style={{ background: 'var(--orange)' }}>
                    Create your first article
                  </Link>
                </div>
              ) : (
                <div style={{ divideColor: 'var(--border)' }}>
                  {blogs.map(blog => (
                    <div key={blog._id} className="px-6 py-4 flex items-center gap-4 group transition-colors"
                      style={{ borderBottom: '1px solid var(--border)' }}
                      onMouseEnter={e => e.currentTarget.style.background = 'var(--bg-input)'}
                      onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>

                      {/* Publish toggle dot */}
                      <button onClick={() => handleTogglePublish(blog)}
                        title={blog.published ? 'Click to unpublish' : 'Click to publish'}
                        className="w-3 h-3 rounded-full flex-shrink-0 transition-transform hover:scale-125"
                        style={{ background: blog.published ? '#10B981' : '#EAB308', cursor: 'pointer' }} />

                      {/* Info */}
                      <div className="flex-1 min-w-0">
                        <Link to={`/blog/${blog.slug}`} target="_blank" rel="noreferrer"
                          className="font-semibold text-sm truncate block transition-colors"
                          style={{ color: 'var(--text)' }}
                          onMouseEnter={e => e.target.style.color = 'var(--orange)'}
                          onMouseLeave={e => e.target.style.color = 'var(--text)'}>
                          {blog.title}
                        </Link>
                        <div className="flex items-center gap-3 mt-0.5 flex-wrap">
                          <span className="text-xs" style={{ color: 'var(--text-sub)' }}>{blog.author}</span>
                          <span style={{ color: 'var(--border)' }}>·</span>
                          <span className="text-xs" style={{ color: 'var(--text-sub)' }}>{format(new Date(blog.createdAt), 'MMM d, yyyy')}</span>
                          <span style={{ color: 'var(--border)' }}>·</span>
                          <span className="text-xs" style={{ color: 'var(--text-sub)' }}>{blog.views} views</span>
                          {!blog.published && (
                            <span className="text-xs px-1.5 py-0.5 rounded font-heading font-semibold"
                              style={{ background: 'color-mix(in srgb, #EAB308 15%, transparent)', color: '#CA8A04' }}>
                              DRAFT
                            </span>
                          )}
                          {blog.tags?.slice(0, 2).map(tag => (
                            <span key={tag} className="text-xs px-1.5 py-0.5 rounded font-heading"
                              style={{ background: 'color-mix(in srgb, var(--orange) 10%, transparent)', color: 'var(--orange)' }}>
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Link to={`/preview/${blog.slug}`} target="_blank"
                          className="px-3 py-1.5 rounded-lg text-xs font-heading font-semibold transition-all"
                          style={{ background: 'var(--bg-input)', color: 'var(--text-muted)', border: '1px solid var(--border)' }}>
                          Preview
                        </Link>
                        <button onClick={() => navigate(`/admin/edit/${blog._id}`)}
                          className="px-3 py-1.5 rounded-lg text-xs font-heading font-semibold transition-all"
                          style={{ background: 'var(--bg-input)', color: 'var(--text-muted)', border: '1px solid var(--border)' }}
                          onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--orange)'; e.currentTarget.style.color = 'var(--orange)'; }}
                          onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.color = 'var(--text-muted)'; }}>
                          Edit
                        </button>
                        <button onClick={() => handleDelete(blog._id, blog.title)} disabled={deletingId === blog._id}
                          className="px-3 py-1.5 rounded-lg text-xs font-heading font-semibold transition-all disabled:opacity-50"
                          style={{ background: 'var(--bg-input)', color: 'var(--text-muted)', border: '1px solid var(--border)' }}
                          onMouseEnter={e => { e.currentTarget.style.borderColor = '#EF4444'; e.currentTarget.style.color = '#EF4444'; }}
                          onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.color = 'var(--text-muted)'; }}>
                          {deletingId === blog._id ? '…' : 'Delete'}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Pagination */}
              {!loading && pagination.totalPages > 1 && (
                <div className="px-6 py-4 flex items-center justify-between" style={{ borderTop: '1px solid var(--border)' }}>
                  <span className="text-sm" style={{ color: 'var(--text-sub)' }}>Page {pagination.page} of {pagination.totalPages}</span>
                  <div className="flex gap-2">
                    {[{ label: '← Prev', fn: () => setPage(p => p - 1), dis: page === 1 },
                      { label: 'Next →', fn: () => setPage(p => p + 1), dis: page === pagination.totalPages }].map(btn => (
                      <button key={btn.label} onClick={btn.fn} disabled={btn.dis}
                        className="px-3 py-1.5 rounded-lg text-sm font-heading disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                        style={{ border: '1px solid var(--border)', color: 'var(--text-muted)' }}>
                        {btn.label}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
