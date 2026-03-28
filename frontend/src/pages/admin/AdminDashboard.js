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
    } catch {
      toast.error('Failed to load articles');
    } finally {
      setLoading(false);
    }
  }, [page]);

  useEffect(() => { fetchBlogs(); }, [fetchBlogs]);

  const handleDelete = async (id, title) => {
    if (!window.confirm(`Delete "${title}"? This cannot be undone.`)) return;
    setDeletingId(id);
    try {
      await api.delete(`/blogs/${id}`);
      toast.success('Article deleted');
      fetchBlogs();
    } catch {
      toast.error('Failed to delete article');
    } finally {
      setDeletingId(null);
    }
  };

  const stats = [
    { label: 'Total Articles', value: pagination.total, icon: '📝', color: 'from-ipl-orange to-amber-500' },
    { label: 'This Page', value: blogs.length, icon: '📄', color: 'from-blue-500 to-blue-600' },
    { label: 'Total Pages', value: pagination.totalPages, icon: '📚', color: 'from-emerald-500 to-emerald-600' },
  ];

  return (
    <>
      <Helmet><title>Dashboard — CricketBuzz Admin</title></Helmet>

      <div className="min-h-screen bg-ipl-dark flex">
        <AdminSidebar />

        <div className="flex-1 overflow-auto">
          {/* Header */}
          <div className="bg-ipl-card border-b border-ipl-border px-8 py-5 flex items-center justify-between">
            <div>
              <h1 className="font-heading font-bold text-2xl text-white">Dashboard</h1>
              <p className="text-gray-500 text-sm mt-0.5">Manage your IPL articles</p>
            </div>
            <Link
              to="/admin/create"
              className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-ipl-orange to-amber-500 text-black font-heading font-bold text-sm tracking-wider rounded-lg hover:opacity-90 transition-opacity shadow-lg shadow-orange-500/20"
            >
              ✏️ New Article
            </Link>
          </div>

          <div className="p-8">
            {/* Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
              {stats.map((s) => (
                <div key={s.label} className="bg-ipl-card border border-ipl-border rounded-xl p-5">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-gray-500 text-sm font-heading font-semibold tracking-wider uppercase">{s.label}</span>
                    <div className={`w-9 h-9 rounded-lg bg-gradient-to-br ${s.color} flex items-center justify-center text-lg`}>
                      {s.icon}
                    </div>
                  </div>
                  <p className="font-display text-4xl text-white">{loading ? '—' : s.value}</p>
                </div>
              ))}
            </div>

            {/* Table */}
            <div className="bg-ipl-card border border-ipl-border rounded-xl overflow-hidden">
              <div className="px-6 py-4 border-b border-ipl-border flex items-center justify-between">
                <h2 className="font-heading font-bold text-lg text-white">All Articles</h2>
                {!loading && (
                  <span className="text-gray-500 text-sm">{pagination.total} total</span>
                )}
              </div>

              {loading ? (
                <div className="p-8 space-y-3">
                  {[...Array(5)].map((_, i) => (
                    <div key={i} className="skeleton h-14 rounded-lg" />
                  ))}
                </div>
              ) : blogs.length === 0 ? (
                <div className="text-center py-16">
                  <div className="text-5xl mb-4">📝</div>
                  <p className="text-gray-400 mb-4">No articles yet</p>
                  <Link to="/admin/create" className="px-5 py-2.5 bg-ipl-orange text-black font-heading font-bold text-sm rounded-lg">
                    Create your first article
                  </Link>
                </div>
              ) : (
                <div className="divide-y divide-ipl-border">
                  {blogs.map((blog) => (
                    <div key={blog._id} className="px-6 py-4 flex items-center gap-4 hover:bg-ipl-dark/40 transition-colors group">
                      {/* Status dot */}
                      <div className={`w-2 h-2 rounded-full flex-shrink-0 ${blog.published ? 'bg-emerald-500' : 'bg-gray-500'}`} />

                      {/* Info */}
                      <div className="flex-1 min-w-0">
                        <Link
                          to={`/blog/${blog.slug}`}
                          target="_blank"
                          rel="noreferrer"
                          className="font-semibold text-white hover:text-ipl-orange transition-colors truncate block text-sm"
                        >
                          {blog.title}
                        </Link>
                        <div className="flex items-center gap-3 mt-0.5">
                          <span className="text-gray-500 text-xs">{blog.author}</span>
                          <span className="text-gray-600 text-xs">·</span>
                          <span className="text-gray-500 text-xs">{format(new Date(blog.createdAt), 'MMM d, yyyy')}</span>
                          <span className="text-gray-600 text-xs">·</span>
                          <span className="text-gray-500 text-xs">{blog.views} views</span>
                          {blog.tags?.slice(0, 2).map(tag => (
                            <span key={tag} className="text-xs px-1.5 py-0.5 bg-ipl-orange/10 text-ipl-orange rounded font-heading">{tag}</span>
                          ))}
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={() => navigate(`/admin/edit/${blog._id}`)}
                          className="px-3 py-1.5 bg-ipl-border hover:bg-ipl-orange/20 hover:text-ipl-orange text-gray-400 rounded-lg text-xs font-heading font-semibold transition-all"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(blog._id, blog.title)}
                          disabled={deletingId === blog._id}
                          className="px-3 py-1.5 bg-ipl-border hover:bg-red-500/20 hover:text-red-400 text-gray-400 rounded-lg text-xs font-heading font-semibold transition-all disabled:opacity-50"
                        >
                          {deletingId === blog._id ? '…' : 'Delete'}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Pagination */}
              {!loading && pagination.totalPages > 1 && (
                <div className="px-6 py-4 border-t border-ipl-border flex items-center justify-between">
                  <span className="text-gray-500 text-sm">
                    Page {pagination.page} of {pagination.totalPages}
                  </span>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setPage(p => p - 1)}
                      disabled={page === 1}
                      className="px-3 py-1.5 border border-ipl-border rounded-lg text-gray-400 hover:border-ipl-orange hover:text-ipl-orange disabled:opacity-30 disabled:cursor-not-allowed text-sm font-heading transition-all"
                    >
                      ← Prev
                    </button>
                    <button
                      onClick={() => setPage(p => p + 1)}
                      disabled={page === pagination.totalPages}
                      className="px-3 py-1.5 border border-ipl-border rounded-lg text-gray-400 hover:border-ipl-orange hover:text-ipl-orange disabled:opacity-30 disabled:cursor-not-allowed text-sm font-heading transition-all"
                    >
                      Next →
                    </button>
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
