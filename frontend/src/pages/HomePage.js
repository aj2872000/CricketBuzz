import React, { useState, useEffect, useCallback } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link, useSearchParams } from 'react-router-dom';
import api from '../utils/api';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import BlogCard from '../components/BlogCard';
import Pagination from '../components/Pagination';
import { BlogCardSkeleton } from '../components/Skeleton';

const IPL_TEAMS = ['CSK', 'MI', 'RCB', 'KKR', 'SRH', 'DC', 'PBKS', 'RR', 'LSG', 'GT'];

export default function HomePage() {
  const [blogs, setBlogs] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, totalPages: 1, total: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchParams, setSearchParams] = useSearchParams();

  const currentPage   = parseInt(searchParams.get('page')   || '1');
  const currentTag    = searchParams.get('tag')    || '';
  const currentSearch = searchParams.get('search') || '';
  const [searchInput, setSearchInput] = useState(currentSearch);

  const fetchBlogs = useCallback(async () => {
    setLoading(true); setError('');
    try {
      const params = { page: currentPage, limit: 9 };
      if (currentTag)    params.tag    = currentTag;
      if (currentSearch) params.search = currentSearch;
      const { data } = await api.get('/blogs', { params });
      setBlogs(data.data);
      setPagination(data.pagination);
    } catch {
      setError('Failed to load articles. Please try again.');
    } finally { setLoading(false); }
  }, [currentPage, currentTag, currentSearch]);

  useEffect(() => { fetchBlogs(); }, [fetchBlogs]);

  const handlePageChange = page => {
    setSearchParams(prev => { prev.set('page', page); return prev; });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
  const handleTagClick = tag => setSearchParams({ tag: tag === currentTag ? '' : tag, page: '1' });
  const handleSearch   = e  => { e.preventDefault(); setSearchParams({ search: searchInput, page: '1' }); };

  return (
    <>
      <Helmet>
        <title>CricketBuzz — IPL News, Analysis & Match Reports</title>
        <meta name="description" content="Your ultimate destination for IPL cricket news, match analysis, player insights, and team updates." />
      </Helmet>

      <div className="min-h-screen" style={{ background: 'var(--bg)' }}>
        <Navbar />

        {/* Hero */}
        <section className="relative pt-28 pb-16 overflow-hidden">
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-10 left-1/4 w-96 h-96 rounded-full blur-3xl"
              style={{ background: 'color-mix(in srgb, var(--orange) 6%, transparent)' }} />
            <div className="absolute bottom-0 right-1/4 w-64 h-64 rounded-full blur-3xl"
              style={{ background: 'color-mix(in srgb, var(--gold) 6%, transparent)' }} />
          </div>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
            <div className="max-w-2xl">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full mb-5"
                style={{ background: 'color-mix(in srgb, var(--orange) 10%, transparent)', border: '1px solid color-mix(in srgb, var(--orange) 25%, transparent)' }}>
                <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: 'var(--orange)' }} />
                <span className="text-xs font-heading font-semibold tracking-widest uppercase" style={{ color: 'var(--orange)' }}>
                  Live Season Coverage
                </span>
              </div>
              <h1 className="font-display text-6xl sm:text-8xl mb-4 leading-none tracking-wide" style={{ color: 'var(--text)' }}>
                <span className="gradient-text">CRICKET</span>
                <br />
                <span>BUZZ</span>
              </h1>
              <p className="text-lg font-body leading-relaxed max-w-lg" style={{ color: 'var(--text-muted)' }}>
                Deep dives, match reports, player analyses, and everything IPL. Written by fans, for fans.
              </p>
              <div className="mt-6 flex gap-3">
                <Link to="/write"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg font-heading font-bold text-sm tracking-wider text-white transition-opacity hover:opacity-90"
                  style={{ background: 'linear-gradient(135deg, var(--orange), var(--gold))' }}>
                  ✍️ Write an Article
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Search + Filters */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-10">
          <form onSubmit={handleSearch} className="flex gap-3 mb-6">
            <input type="text" value={searchInput} onChange={e => setSearchInput(e.target.value)}
              placeholder="Search articles..."
              className="flex-1 rounded-lg px-4 py-2.5 text-sm focus:outline-none transition-all"
              style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', color: 'var(--text)' }}
              onFocus={e => e.target.style.borderColor = 'var(--orange)'}
              onBlur={e => e.target.style.borderColor = 'var(--border)'}
            />
            <button type="submit"
              className="px-6 py-2.5 font-heading font-bold text-sm tracking-wider rounded-lg text-white transition-opacity hover:opacity-90"
              style={{ background: 'var(--orange)' }}>
              SEARCH
            </button>
            {(currentSearch || currentTag) && (
              <button type="button" onClick={() => { setSearchInput(''); setSearchParams({}); }}
                className="px-4 py-2.5 rounded-lg text-sm transition-all"
                style={{ border: '1px solid var(--border)', color: 'var(--text-muted)' }}>
                Clear
              </button>
            )}
          </form>

          {/* Team tag filters */}
          <div className="flex flex-wrap gap-2">
            {IPL_TEAMS.map(team => (
              <button key={team} onClick={() => handleTagClick(team)}
                className="px-3 py-1 rounded-md font-heading font-semibold text-xs tracking-widest uppercase transition-all"
                style={currentTag === team
                  ? { background: 'var(--orange)', color: '#fff', boxShadow: '0 2px 8px color-mix(in srgb, var(--orange) 30%, transparent)' }
                  : { background: 'var(--bg-card)', border: '1px solid var(--border)', color: 'var(--text-muted)' }}
                onMouseEnter={e => { if (currentTag !== team) { e.currentTarget.style.borderColor = 'var(--orange)'; e.currentTarget.style.color = 'var(--orange)'; } }}
                onMouseLeave={e => { if (currentTag !== team) { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.color = 'var(--text-muted)'; } }}>
                {team}
              </button>
            ))}
          </div>
        </section>

        {/* Blog Grid */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
          {!loading && !error && (
            <div className="flex items-center justify-between mb-6">
              <p className="text-sm" style={{ color: 'var(--text-sub)' }}>
                {currentSearch || currentTag
                  ? `${pagination.total} result${pagination.total !== 1 ? 's' : ''} found`
                  : `${pagination.total} article${pagination.total !== 1 ? 's' : ''} published`}
              </p>
              {pagination.totalPages > 1 && (
                <p className="text-sm" style={{ color: 'var(--text-sub)' }}>
                  Page {pagination.page} of {pagination.totalPages}
                </p>
              )}
            </div>
          )}

          {error && (
            <div className="text-center py-20">
              <div className="text-4xl mb-4">🏏</div>
              <p className="mb-4" style={{ color: 'var(--text-muted)' }}>{error}</p>
              <button onClick={fetchBlogs}
                className="px-6 py-2 font-heading font-bold rounded-lg text-white"
                style={{ background: 'var(--orange)' }}>
                Retry
              </button>
            </div>
          )}

          {!error && (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {loading
                  ? [...Array(9)].map((_, i) => <BlogCardSkeleton key={i} />)
                  : blogs.map((blog, i) => <BlogCard key={blog._id} blog={blog} index={i} />)}
              </div>

              {!loading && blogs.length === 0 && (
                <div className="text-center py-24">
                  <div className="text-6xl mb-4">🏏</div>
                  <h3 className="font-heading text-2xl mb-2" style={{ color: 'var(--text)' }}>No Articles Found</h3>
                  <p style={{ color: 'var(--text-sub)' }}>Try a different search or filter.</p>
                </div>
              )}

              {!loading && <Pagination pagination={pagination} onPageChange={handlePageChange} />}
            </>
          )}
        </main>

        <Footer />
      </div>
    </>
  );
}
