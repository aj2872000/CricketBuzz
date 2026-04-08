import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { format } from 'date-fns';
import 'react-quill/dist/quill.snow.css';
import api from '../utils/api';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { BlogDetailSkeleton } from '../components/Skeleton';

export default function PreviewPage() {
  const { slug } = useParams();
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetch = async () => {
      try {
        // Use admin endpoint to fetch even unpublished drafts
        const res = await api.get('/blogs/admin/all', { params: { page: 1, limit: 200 } });
        const found = res.data.data.find(b => b.slug === slug);
        if (found) {
          const full = await api.get(`/blogs/preview/${slug}`);
          setBlog(full.data.data);
        } else {
          setError('not_found');
        }
      } catch {
        setError('error');
      } finally {
        setLoading(false);
      }
    };
    fetch();
    window.scrollTo(0, 0);
  }, [slug]);

  return (
    <>
      <Helmet><title>Preview — CricketBuzz</title></Helmet>
      <div className="min-h-screen" style={{ background: 'var(--bg)' }}>
        {/* Preview banner */}
        <div className="preview-banner">
          🔍 Draft Preview — This article is pending review and not yet publicly visible
        </div>
        <Navbar />
        <main className="pt-20 pb-16">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
            {loading ? <BlogDetailSkeleton /> : error ? (
              <div className="text-center py-20">
                <div className="text-5xl mb-4">🏏</div>
                <p className="mb-4" style={{ color: 'var(--text-muted)' }}>Article not found or unavailable.</p>
                <Link to="/" className="px-5 py-2.5 rounded-lg font-heading font-bold text-sm text-white" style={{ background: 'var(--orange)' }}>Back to Home</Link>
              </div>
            ) : (
              <article className="animate-fade-in">
                {/* Draft badge */}
                <div className="mb-6 inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-heading font-semibold"
                  style={{ background: 'color-mix(in srgb, #EAB308 15%, transparent)', color: '#CA8A04', border: '1px solid color-mix(in srgb, #EAB308 30%, transparent)' }}>
                  ⏳ Pending Review
                </div>

                {blog.tags?.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-4">
                    {blog.tags.map(tag => (
                      <span key={tag} className="text-xs font-heading font-semibold tracking-widest uppercase px-3 py-1 rounded-full"
                        style={{ background: 'color-mix(in srgb, var(--orange) 12%, transparent)', color: 'var(--orange)', border: '1px solid color-mix(in srgb, var(--orange) 25%, transparent)' }}>
                        {tag}
                      </span>
                    ))}
                  </div>
                )}

                <h1 className="font-heading font-bold text-4xl sm:text-5xl mb-5 leading-tight" style={{ color: 'var(--text)' }}>
                  {blog.title}
                </h1>

                <div className="flex flex-wrap items-center gap-x-5 gap-y-2 mb-8 pb-6" style={{ borderBottom: '1px solid var(--border)' }}>
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full flex items-center justify-center text-black font-bold text-sm"
                      style={{ background: 'linear-gradient(135deg, var(--gold), var(--orange))' }}>
                      {blog.author?.charAt(0).toUpperCase()}
                    </div>
                    <p className="text-sm font-semibold" style={{ color: 'var(--text)' }}>{blog.author}</p>
                  </div>
                  <span className="text-sm" style={{ color: 'var(--text-sub)' }}>
                    📅 {format(new Date(blog.createdAt), 'MMMM d, yyyy')}
                  </span>
                </div>

                {blog.coverImage && (
                  <div className="mb-8 rounded-xl overflow-hidden">
                    <img src={blog.coverImage} alt={blog.title} className="w-full object-cover max-h-96" />
                  </div>
                )}

                <div className="blog-content ql-snow" style={{ border: 'none' }}>
                  <div className="ql-editor" style={{ padding: 0 }} dangerouslySetInnerHTML={{ __html: blog.content }} />
                </div>

                <div className="mt-10 pt-6 flex gap-3" style={{ borderTop: '1px solid var(--border)' }}>
                  <Link to="/" className="font-heading font-semibold text-sm tracking-wider uppercase transition-colors" style={{ color: 'var(--text-muted)' }}>
                    ← Home
                  </Link>
                </div>
              </article>
            )}
          </div>
        </main>
        <Footer />
      </div>
    </>
  );
}
