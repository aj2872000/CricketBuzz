import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { format } from 'date-fns';
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

  useEffect(() => {
    const fetchBlog = async () => {
      setLoading(true);
      setError('');
      try {
        const { data } = await api.get(`/blogs/${slug}`);
        setBlog(data.data);
      } catch (err) {
        if (err.response?.status === 404) {
          setError('not_found');
        } else {
          setError('server_error');
        }
      } finally {
        setLoading(false);
      }
    };
    fetchBlog();
    window.scrollTo(0, 0);
  }, [slug]);

  if (!loading && error === 'not_found') {
    return (
      <div className="min-h-screen bg-ipl-dark flex flex-col items-center justify-center text-center px-4">
        <div className="text-8xl mb-6">🏏</div>
        <h1 className="font-display text-6xl text-white mb-4">404</h1>
        <p className="text-gray-400 mb-8 text-lg">This article was bowled out. It doesn't exist.</p>
        <Link to="/" className="px-6 py-3 bg-ipl-orange text-black font-heading font-bold rounded-lg hover:bg-amber-500 transition-colors">
          Back to Home
        </Link>
      </div>
    );
  }

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

      <div className="min-h-screen bg-ipl-dark">
        <Navbar />

        <main className="pt-24 pb-16">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
            {loading ? (
              <BlogDetailSkeleton />
            ) : error ? (
              <div className="text-center py-20">
                <p className="text-gray-400 mb-4">Something went wrong loading this article.</p>
                <button onClick={() => navigate('/')} className="px-6 py-2 bg-ipl-orange text-black font-heading font-bold rounded-lg">
                  Go Home
                </button>
              </div>
            ) : (
              <article className="animate-fade-in">
                {/* Breadcrumb */}
                <nav className="flex items-center gap-2 text-sm text-gray-500 mb-8">
                  <Link to="/" className="hover:text-ipl-orange transition-colors">Home</Link>
                  <span>›</span>
                  <span className="text-gray-400 truncate max-w-xs">{blog.title}</span>
                </nav>

                {/* Tags */}
                {blog.tags?.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-5">
                    {blog.tags.map((tag) => (
                      <Link
                        key={tag}
                        to={`/?tag=${tag}`}
                        className="text-xs font-heading font-semibold tracking-widest uppercase px-3 py-1 rounded-full bg-ipl-orange/10 text-ipl-orange border border-ipl-orange/20 hover:bg-ipl-orange/20 transition-colors"
                      >
                        {tag}
                      </Link>
                    ))}
                  </div>
                )}

                {/* Title */}
                <h1 className="font-heading font-bold text-4xl sm:text-5xl text-white mb-5 leading-tight">
                  {blog.title}
                </h1>

                {/* Meta */}
                <div className="flex flex-wrap items-center gap-x-5 gap-y-2 mb-8 pb-8 border-b border-ipl-border">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-ipl-gold to-ipl-orange flex items-center justify-center text-black font-bold text-sm">
                      {blog.author?.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <p className="text-white text-sm font-semibold">{blog.author}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 text-gray-500 text-sm">
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
                    <img
                      src={blog.coverImage}
                      alt={blog.title}
                      className="w-full object-cover max-h-96"
                    />
                  </div>
                )}

                {/* Content */}
                <div
                  className="blog-content"
                  dangerouslySetInnerHTML={{ __html: blog.content }}
                />

                {/* Bottom nav */}
                <div className="mt-12 pt-8 border-t border-ipl-border flex items-center justify-between">
                  <Link
                    to="/"
                    className="flex items-center gap-2 text-gray-400 hover:text-ipl-orange transition-colors font-heading font-semibold text-sm tracking-wider uppercase"
                  >
                    ← All Articles
                  </Link>
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(window.location.href);
                    }}
                    className="flex items-center gap-2 text-gray-400 hover:text-ipl-orange transition-colors font-heading font-semibold text-sm tracking-wider uppercase"
                  >
                    Share 🔗
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
