import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import api from '../../utils/api';
import AdminSidebar from '../../components/AdminSidebar';
import toast from 'react-hot-toast';

const IPL_TAGS = [
  'CSK', 'MI', 'RCB', 'KKR', 'SRH', 'DC', 'PBKS', 'RR', 'LSG', 'GT',
  'Match Report', 'Analysis', 'Transfer News', 'Opinion', 'Stats', 'Fantasy',
];

const QUILL_MODULES = {
  toolbar: [
    [{ header: [2, 3, 4, false] }],
    ['bold', 'italic', 'underline', 'strike'],
    [{ list: 'ordered' }, { list: 'bullet' }],
    ['blockquote', 'code-block'],
    ['link'],
    ['clean'],
  ],
};

const QUILL_FORMATS = [
  'header', 'bold', 'italic', 'underline', 'strike',
  'list', 'bullet', 'blockquote', 'code-block', 'link',
];

function slugify(str) {
  return str
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
}

export default function BlogEditor() {
  const { id } = useParams();
  const isEdit = Boolean(id);
  const navigate = useNavigate();

  const [form, setForm] = useState({
    title: '',
    slug: '',
    author: '',
    excerpt: '',
    coverImage: '',
    tags: [],
    published: true,
  });
  const [content, setContent] = useState('');
  const [slugManual, setSlugManual] = useState(false);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(isEdit);
  const [tagInput, setTagInput] = useState('');

  // Fetch blog for edit mode
  useEffect(() => {
    if (!isEdit) return;
    const fetchBlog = async () => {
      try {
        const res = await api.get('/blogs/admin/all', { params: { page: 1, limit: 200 } });
        const found = res.data.data.find((b) => b._id === id);
        if (found) {
          const full = await api.get(`/blogs/${found.slug}`);
          const blog = full.data.data;
          setForm({
            title: blog.title,
            slug: blog.slug,
            author: blog.author,
            excerpt: blog.excerpt || '',
            coverImage: blog.coverImage || '',
            tags: blog.tags || [],
            published: blog.published,
          });
          setContent(blog.content || '');
          setSlugManual(true);
        }
      } catch {
        toast.error('Failed to load article');
      } finally {
        setFetching(false);
      }
    };
    fetchBlog();
  }, [id, isEdit]);

  // Auto-generate slug from title
  useEffect(() => {
    if (!slugManual && form.title) {
      setForm((f) => ({ ...f, slug: slugify(f.title) }));
    }
  }, [form.title, slugManual]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  };

  const handleSlugChange = (e) => {
    setSlugManual(true);
    setForm((f) => ({ ...f, slug: slugify(e.target.value) }));
  };

  const handleTagToggle = (tag) => {
    setForm((f) => ({
      ...f,
      tags: f.tags.includes(tag)
        ? f.tags.filter((t) => t !== tag)
        : [...f.tags, tag],
    }));
  };

  const handleTagInputAdd = (e) => {
    if ((e.key === 'Enter' || e.key === ',') && tagInput.trim()) {
      e.preventDefault();
      const newTag = tagInput.trim();
      if (!form.tags.includes(newTag)) {
        setForm((f) => ({ ...f, tags: [...f.tags, newTag] }));
      }
      setTagInput('');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title.trim()) return toast.error('Title is required');
    if (!content || content === '<p><br></p>') return toast.error('Content is required');
    if (!form.author.trim()) return toast.error('Author is required');

    setLoading(true);
    try {
      const payload = { ...form, content };
      if (isEdit) {
        await api.put(`/blogs/${id}`, payload);
        toast.success('Article updated!');
      } else {
        await api.post('/blogs', payload);
        toast.success('Article published!');
      }
      navigate('/admin');
    } catch (err) {
      const msg =
        err.response?.data?.message ||
        err.response?.data?.errors?.[0]?.msg ||
        'Failed to save';
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return (
      <div className="min-h-screen bg-ipl-dark flex">
        <AdminSidebar />
        <div className="flex-1 flex items-center justify-center">
          <div className="w-8 h-8 border-2 border-ipl-orange border-t-transparent rounded-full animate-spin" />
        </div>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>{isEdit ? 'Edit Article' : 'New Article'} — CricketBuzz Admin</title>
      </Helmet>

      <div className="min-h-screen bg-ipl-dark flex">
        <AdminSidebar />

        <div className="flex-1 overflow-auto">
          {/* Header */}
          <div className="bg-ipl-card border-b border-ipl-border px-8 py-5 flex items-center justify-between sticky top-0 z-10">
            <div>
              <h1 className="font-heading font-bold text-2xl text-white">
                {isEdit ? 'Edit Article' : 'New Article'}
              </h1>
              <p className="text-gray-500 text-sm mt-0.5">
                {isEdit ? 'Update your article details' : 'Create a new IPL article'}
              </p>
            </div>
            <Link
              to="/admin"
              className="text-gray-400 hover:text-white transition-colors font-heading font-semibold text-sm tracking-wider"
            >
              ← Dashboard
            </Link>
          </div>

          <form onSubmit={handleSubmit} className="p-8 max-w-5xl">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

              {/* ── Main column ── */}
              <div className="lg:col-span-2 space-y-5">

                {/* Title */}
                <div>
                  <label className="block text-xs font-heading font-semibold tracking-widest uppercase text-gray-400 mb-2">
                    Title *
                  </label>
                  <input
                    name="title"
                    value={form.title}
                    onChange={handleChange}
                    placeholder="e.g. CSK vs MI: Battle of Titans Preview"
                    required
                    className="w-full bg-ipl-card border border-ipl-border rounded-lg px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-ipl-orange focus:ring-1 focus:ring-ipl-orange/30 transition-all font-body text-lg"
                  />
                </div>

                {/* Slug */}
                <div>
                  <label className="block text-xs font-heading font-semibold tracking-widest uppercase text-gray-400 mb-2">
                    Slug (URL)
                  </label>
                  <div className="flex items-center">
                    <span className="bg-ipl-dark border border-r-0 border-ipl-border rounded-l-lg px-3 py-3 text-gray-500 text-sm font-body">
                      /blog/
                    </span>
                    <input
                      value={form.slug}
                      onChange={handleSlugChange}
                      placeholder="auto-generated-from-title"
                      className="flex-1 bg-ipl-card border border-ipl-border rounded-r-lg px-4 py-3 text-ipl-orange placeholder-gray-600 focus:outline-none focus:border-ipl-orange transition-all font-body text-sm"
                    />
                  </div>
                </div>

                {/* Quill Rich Text Editor */}
                <div>
                  <label className="block text-xs font-heading font-semibold tracking-widest uppercase text-gray-400 mb-2">
                    Content *
                  </label>
                  <ReactQuill
                    theme="snow"
                    value={content}
                    onChange={setContent}
                    modules={QUILL_MODULES}
                    formats={QUILL_FORMATS}
                    placeholder="Write your article here — use the toolbar for headings, bold, lists, quotes..."
                  />
                  <p className="text-gray-600 text-xs mt-1.5 font-body">
                    Use the toolbar to format — H2/H3 headings, bold, lists, blockquotes, links.
                  </p>
                </div>

                {/* Excerpt */}
                <div>
                  <label className="block text-xs font-heading font-semibold tracking-widest uppercase text-gray-400 mb-2">
                    Excerpt{' '}
                    <span className="text-gray-600 normal-case tracking-normal font-normal">
                      (auto-generated if blank)
                    </span>
                  </label>
                  <textarea
                    name="excerpt"
                    value={form.excerpt}
                    onChange={handleChange}
                    placeholder="Short summary shown on the listing page..."
                    rows={3}
                    className="w-full bg-ipl-card border border-ipl-border rounded-lg px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-ipl-orange transition-all font-body text-sm resize-none"
                  />
                </div>
              </div>

              {/* ── Sidebar column ── */}
              <div className="space-y-5">

                {/* Publish toggle */}
                <div className="bg-ipl-card border border-ipl-border rounded-xl p-5">
                  <h3 className="font-heading font-bold text-sm text-white mb-4 tracking-wider uppercase">
                    Publish
                  </h3>
                  <div
                    className="flex items-center justify-between cursor-pointer mb-3"
                    onClick={() => setForm((f) => ({ ...f, published: !f.published }))}
                  >
                    <span className="text-sm text-gray-400">Status</span>
                    <div className="relative w-11 h-6">
                      <div
                        className={`w-11 h-6 rounded-full transition-colors ${
                          form.published ? 'bg-ipl-orange' : 'bg-ipl-border'
                        }`}
                      />
                      <div
                        className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform ${
                          form.published ? 'translate-x-6' : 'translate-x-1'
                        }`}
                      />
                    </div>
                  </div>
                  <p className={`text-xs font-heading font-semibold ${form.published ? 'text-emerald-400' : 'text-gray-500'}`}>
                    {form.published ? '● Published' : '○ Draft'}
                  </p>
                </div>

                {/* Author */}
                <div>
                  <label className="block text-xs font-heading font-semibold tracking-widest uppercase text-gray-400 mb-2">
                    Author *
                  </label>
                  <input
                    name="author"
                    value={form.author}
                    onChange={handleChange}
                    placeholder="Rohit Sharma"
                    required
                    className="w-full bg-ipl-card border border-ipl-border rounded-lg px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-ipl-orange transition-all font-body text-sm"
                  />
                </div>

                {/* Cover Image */}
                <div>
                  <label className="block text-xs font-heading font-semibold tracking-widest uppercase text-gray-400 mb-2">
                    Cover Image URL
                  </label>
                  <input
                    name="coverImage"
                    value={form.coverImage}
                    onChange={handleChange}
                    placeholder="https://..."
                    className="w-full bg-ipl-card border border-ipl-border rounded-lg px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-ipl-orange transition-all font-body text-sm"
                  />
                  {form.coverImage && (
                    <img
                      src={form.coverImage}
                      alt="cover preview"
                      className="mt-2 rounded-lg w-full h-28 object-cover border border-ipl-border"
                    />
                  )}
                </div>

                {/* Tags */}
                <div>
                  <label className="block text-xs font-heading font-semibold tracking-widest uppercase text-gray-400 mb-2">
                    Tags
                  </label>
                  <div className="flex flex-wrap gap-1.5 mb-3">
                    {IPL_TAGS.map((tag) => (
                      <button
                        key={tag}
                        type="button"
                        onClick={() => handleTagToggle(tag)}
                        className={`px-2.5 py-1 rounded text-xs font-heading font-semibold transition-all ${
                          form.tags.includes(tag)
                            ? 'bg-ipl-orange text-black'
                            : 'bg-ipl-dark border border-ipl-border text-gray-400 hover:border-ipl-orange/40 hover:text-ipl-orange'
                        }`}
                      >
                        {tag}
                      </button>
                    ))}
                  </div>
                  <input
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    onKeyDown={handleTagInputAdd}
                    placeholder="Custom tag — press Enter to add"
                    className="w-full bg-ipl-card border border-ipl-border rounded-lg px-3 py-2 text-white placeholder-gray-600 focus:outline-none focus:border-ipl-orange transition-all font-body text-xs"
                  />
                  {form.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-2">
                      {form.tags.map((tag) => (
                        <span
                          key={tag}
                          className="flex items-center gap-1 px-2 py-0.5 bg-ipl-orange/20 text-ipl-orange rounded text-xs font-heading"
                        >
                          {tag}
                          <button
                            type="button"
                            onClick={() => handleTagToggle(tag)}
                            className="hover:text-white leading-none"
                          >
                            ×
                          </button>
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                {/* Submit */}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 bg-gradient-to-r from-ipl-orange to-amber-500 text-black font-heading font-bold text-sm tracking-widest uppercase rounded-lg hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg shadow-orange-500/20"
                >
                  {loading ? (
                    <span className="flex items-center justify-center gap-2">
                      <span className="w-4 h-4 border-2 border-black/40 border-t-black rounded-full animate-spin" />
                      Saving…
                    </span>
                  ) : isEdit ? '💾 Update Article' : '🚀 Publish Article'}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
