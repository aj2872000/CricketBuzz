import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { format } from 'date-fns';
import 'react-quill/dist/quill.snow.css';
import api from '../utils/api';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { BlogDetailSkeleton } from '../components/Skeleton';

export default function BlogDetailPage() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const fetchBlog = async () => {
      setLoading(true); setError('');
      try {
        const { data } = await api.get(`/blogs/${slug}`);
        setBlog(data.data);
      } catch (err) {
        setError(err.response?.status === 404 ? 'not_found' : 'server_error');
      } finally { setLoading(false); }
    };
    fetchBlog();
    window.scrollTo(0, 0);
  }, [slug]);

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (!loading && error === 'not_found') return (
    <div className="min-h-screen flex flex-col items-center justify-center text-center px-4" style={{ background: 'var(--bg)' }}>
      <div className="text-8xl mb-6">🏏</div>
      <h1 className="font-display text-6xl mb-4" style={{ color: 'var(--text)' }}>404</h1>
      <p className="mb-8 text-lg" style={{ color: 'var(--text-muted)' }}>This article was bowled out. It doesn't exist.</p>
      <Link to="/" className="px-6 py-3 font-heading font-bold rounded-lg text-white" style={{ background: 'var(--orange)' }}>
        Back to Home
      </Link>
    </div>
  );

  return (
    <>
      {blog && (
        <Helmet>
          <title>{blog.title} — CricketBuzz</title>
          <meta name="description" content={blog.excerpt} />
          <meta property="og:title" content={blog.title} />
          <meta property="og:description" content={blog.excerpt} />
          {blog.coverImage && <meta property="og:image" content={blog.coverImage} />}
          <meta property="og:type" content="article" />
          <link rel="canonical" href={`${window.location.origin}/blog/${blog.slug}`} />
        </Helmet>
      )}

      <div className="min-h-screen" style={{ background: 'var(--bg)' }}>
        <Navbar />
        <main className="pt-24 pb-16">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
            {loading ? <BlogDetailSkeleton /> : error ? (
              <div className="text-center py-20">
                <p className="mb-4" style={{ color: 'var(--text-muted)' }}>Something went wrong loading this article.</p>
                <button onClick={() => navigate('/')} className="px-6 py-2 font-heading font-bold rounded-lg text-white" style={{ background: 'var(--orange)' }}>
                  Go Home
                </button>
              </div>
            ) : (
              <article className="animate-fade-in">
                {/* Breadcrumb */}
                <nav className="flex items-center gap-2 text-sm mb-8" style={{ color: 'var(--text-sub)' }}>
                  <Link to="/" className="transition-colors" style={{ color: 'var(--text-sub)' }}
                    onMouseEnter={e => e.target.style.color = 'var(--orange)'}
                    onMouseLeave={e => e.target.style.color = 'var(--text-sub)'}>Home</Link>
                  <span>›</span>
                  <span className="truncate max-w-xs" style={{ color: 'var(--text-muted)' }}>{blog.title}</span>
                </nav>

                {/* Tags */}
                {blog.tags?.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-5">
                    {blog.tags.map(tag => (
                      <Link key={tag} to={`/?tag=${tag}`}
                        className="text-xs font-heading font-semibold tracking-widest uppercase px-3 py-1 rounded-full transition-all"
                        style={{ background: 'color-mix(in srgb, var(--orange) 10%, transparent)', color: 'var(--orange)', border: '1px solid color-mix(in srgb, var(--orange) 22%, transparent)' }}>
                        {tag}
                      </Link>
                    ))}
                  </div>
                )}

                {/* Title */}
                <h1 className="font-heading font-bold text-4xl sm:text-5xl mb-5 leading-tight" style={{ color: 'var(--text)' }}>
                  {blog.title}
                </h1>

                {/* Meta */}
                <div className="flex flex-wrap items-center gap-x-5 gap-y-2 mb-8 pb-6" style={{ borderBottom: '1px solid var(--border)' }}>
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full flex items-center justify-center text-black font-bold text-sm"
                      style={{ background: 'linear-gradient(135deg, var(--gold), var(--orange))' }}>
                      {blog.author?.charAt(0).toUpperCase()}
                    </div>
                    <p className="text-sm font-semibold" style={{ color: 'var(--text)' }}>{blog.author}</p>
                  </div>
                  <div className="flex items-center gap-4 text-sm" style={{ color: 'var(--text-sub)' }}>
                    <span>📅 {format(new Date(blog.createdAt), 'MMMM d, yyyy')}</span>
                    {blog.updatedAt !== blog.createdAt && (
                      <span>✏️ Updated {format(new Date(blog.updatedAt), 'MMM d, yyyy')}</span>
                    )}
                    <span>👁 {blog.views} views</span>
                  </div>
                </div>

                {/* Cover Image */}
                {blog.coverImage && (
                  <div className="mb-8 rounded-xl overflow-hidden">
                    <img src={blog.coverImage} alt={blog.title} className="w-full object-cover max-h-96" />
                  </div>
                )}

                {/* Content */}
                <div className="blog-content ql-snow" style={{ border: 'none' }}>
                  <div className="ql-editor" style={{ padding: 0 }} dangerouslySetInnerHTML={{ __html: blog.content }} />
                </div>

                {/* Bottom nav */}
                <div className="mt-12 pt-6 flex items-center justify-between" style={{ borderTop: '1px solid var(--border)' }}>
                  <Link to="/"
                    className="flex items-center gap-2 font-heading font-semibold text-sm tracking-wider uppercase transition-colors"
                    style={{ color: 'var(--text-muted)' }}
                    onMouseEnter={e => e.currentTarget.style.color = 'var(--orange)'}
                    onMouseLeave={e => e.currentTarget.style.color = 'var(--text-muted)'}>
                    ← All Articles
                  </Link>
                  <button onClick={handleShare}
                    className="flex items-center gap-2 font-heading font-semibold text-sm tracking-wider uppercase transition-colors"
                    style={{ color: copied ? '#10B981' : 'var(--text-muted)' }}>
                    {copied ? '✅ Copied!' : 'Share 🔗'}
                  </button>
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
