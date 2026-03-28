import React, { useState, useEffect, useCallback } from 'react';
import { Helmet } from 'react-helmet-async';
import { useSearchParams } from 'react-router-dom';
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

  const currentPage = parseInt(searchParams.get('page') || '1');
  const currentTag = searchParams.get('tag') || '';
  const currentSearch = searchParams.get('search') || '';
  const [searchInput, setSearchInput] = useState(currentSearch);

  const fetchBlogs = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const params = { page: currentPage, limit: 9 };
      if (currentTag) params.tag = currentTag;
      if (currentSearch) params.search = currentSearch;
      const { data } = await api.get('/blogs', { params });
      setBlogs(data.data);
      setPagination(data.pagination);
    } catch (err) {
      setError('Failed to load articles. Please try again.');
    } finally {
      setLoading(false);
    }
  }, [currentPage, currentTag, currentSearch]);

  useEffect(() => { fetchBlogs(); }, [fetchBlogs]);

  const handlePageChange = (page) => {
    setSearchParams((prev) => { prev.set('page', page); return prev; });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleTagClick = (tag) => {
    setSearchParams({ tag: tag === currentTag ? '' : tag, page: '1' });
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setSearchParams({ search: searchInput, page: '1' });
  };

  return (
    <>
      <Helmet>
        <title>CricketBuzz — IPL News, Analysis & Match Reports</title>
        <meta name="description" content="Your ultimate destination for IPL cricket news, match analysis, player insights, and team updates. Stay ahead with CricketBuzz." />
        <meta property="og:title" content="CricketBuzz — IPL News & Analysis" />
        <meta property="og:description" content="Latest IPL cricket news, match reports, and expert analysis." />
      </Helmet>

      <div className="min-h-screen bg-ipl-dark">
        <Navbar />

        {/* Hero */}
        <section className="relative pt-28 pb-16 overflow-hidden">
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-10 left-1/4 w-96 h-96 bg-ipl-orange/5 rounded-full blur-3xl" />
            <div className="absolute bottom-0 right-1/4 w-64 h-64 bg-ipl-gold/5 rounded-full blur-3xl" />
          </div>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
            <div className="max-w-2xl">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-ipl-orange/10 border border-ipl-orange/20 mb-5">
                <span className="w-1.5 h-1.5 rounded-full bg-ipl-orange animate-pulse" />
                <span className="text-ipl-orange text-xs font-heading font-semibold tracking-widest uppercase">Live Season Coverage</span>
              </div>
              <h1 className="font-display text-6xl sm:text-8xl text-white mb-4 leading-none tracking-wide">
                <span className="gradient-text">CRICKET</span>
                <br />
                <span className="text-white">BUZZ</span>
              </h1>
              <p className="text-gray-400 text-lg font-body leading-relaxed max-w-lg">
                Deep dives, match reports, player analyses, and everything IPL. Written by fans, for fans.
              </p>
            </div>
          </div>
        </section>

        {/* Search + Filters */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-10">
          <form onSubmit={handleSearch} className="flex gap-3 mb-6">
            <input
              type="text"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder="Search articles..."
              className="flex-1 bg-ipl-card border border-ipl-border rounded-lg px-4 py-2.5 text-white placeholder-gray-500 focus:outline-none focus:border-ipl-orange transition-colors font-body text-sm"
            />
            <button
              type="submit"
              className="px-6 py-2.5 bg-ipl-orange text-black font-heading font-bold text-sm tracking-wider rounded-lg hover:bg-amber-500 transition-colors"
            >
              SEARCH
            </button>
            {(currentSearch || currentTag) && (
              <button
                type="button"
                onClick={() => { setSearchInput(''); setSearchParams({}); }}
                className="px-4 py-2.5 border border-ipl-border text-gray-400 hover:text-white rounded-lg transition-colors text-sm"
              >
                Clear
              </button>
            )}
          </form>

          {/* Team tags */}
          <div className="flex flex-wrap gap-2">
            {IPL_TEAMS.map((team) => (
              <button
                key={team}
                onClick={() => handleTagClick(team)}
                className={`px-3 py-1 rounded-md font-heading font-semibold text-xs tracking-widest uppercase transition-all ${
                  currentTag === team
                    ? 'bg-ipl-orange text-black shadow-md shadow-orange-500/30'
                    : 'bg-ipl-card border border-ipl-border text-gray-400 hover:border-ipl-orange/50 hover:text-ipl-orange'
                }`}
              >
                {team}
              </button>
            ))}
          </div>
        </section>

        {/* Blog Grid */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
          {/* Stats bar */}
          {!loading && !error && (
            <div className="flex items-center justify-between mb-6">
              <p className="text-gray-500 text-sm">
                {currentSearch || currentTag
                  ? `${pagination.total} result${pagination.total !== 1 ? 's' : ''} found`
                  : `${pagination.total} article${pagination.total !== 1 ? 's' : ''} published`}
              </p>
              {pagination.totalPages > 1 && (
                <p className="text-gray-500 text-sm">Page {pagination.page} of {pagination.totalPages}</p>
              )}
            </div>
          )}

          {error && (
            <div className="text-center py-20">
              <div className="text-4xl mb-4">🏏</div>
              <p className="text-gray-400 mb-4">{error}</p>
              <button
                onClick={fetchBlogs}
                className="px-6 py-2 bg-ipl-orange text-black font-heading font-bold rounded-lg hover:bg-amber-500 transition-colors"
              >
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
                  <h3 className="font-heading text-2xl text-white mb-2">No Articles Found</h3>
                  <p className="text-gray-500">Try a different search or filter.</p>
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
