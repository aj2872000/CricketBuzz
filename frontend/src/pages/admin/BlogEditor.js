import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import api from '../../utils/api';
import AdminSidebar from '../../components/AdminSidebar';
import toast from 'react-hot-toast';

const IPL_TAGS = ['CSK', 'MI', 'RCB', 'KKR', 'SRH', 'DC', 'PBKS', 'RR', 'LSG', 'GT', 'Match Report', 'Analysis', 'Transfer News', 'Opinion', 'Stats', 'Fantasy'];

function slugify(str) {
  return str
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
}

// Simple rich-text toolbar
const TOOLBAR_ACTIONS = [
  { label: 'B', cmd: 'bold', title: 'Bold' },
  { label: 'I', cmd: 'italic', title: 'Italic' },
  { label: 'U', cmd: 'underline', title: 'Underline' },
  { label: 'H2', cmd: 'formatBlock', value: 'H2', title: 'Heading 2' },
  { label: 'H3', cmd: 'formatBlock', value: 'H3', title: 'Heading 3' },
  { label: '¶', cmd: 'formatBlock', value: 'P', title: 'Paragraph' },
  { label: '• List', cmd: 'insertUnorderedList', title: 'Bullet List' },
  { label: '1. List', cmd: 'insertOrderedList', title: 'Numbered List' },
  { label: '" Quote', cmd: 'formatBlock', value: 'BLOCKQUOTE', title: 'Blockquote' },
];

export default function BlogEditor() {
  const { id } = useParams();
  const isEdit = Boolean(id);
  const navigate = useNavigate();
  const editorRef = useRef(null);

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

  // Fetch blog for edit
  useEffect(() => {
    if (!isEdit) return;
    const fetchBlog = async () => {
      try {
        const { data } = await api.get(`/blogs/admin/all?limit=1`);
        // fetch by id via a different approach — get all and find, or use a direct endpoint
        // Actually, we need to fetch by ID — let's add an admin route. For now use a workaround:
        const res = await api.get(`/blogs/admin/all`, { params: { page: 1, limit: 200 } });
        const found = res.data.data.find(b => b._id === id);
        if (found) {
          // Fetch full content
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
          setContent(blog.content);
          setSlugManual(true);
          if (editorRef.current) editorRef.current.innerHTML = blog.content;
        }
      } catch {
        toast.error('Failed to load article');
      } finally {
        setFetching(false);
      }
    };
    fetchBlog();
  }, [id, isEdit]);

  // Auto-slug from title
  useEffect(() => {
    if (!slugManual && form.title) {
      setForm(f => ({ ...f, slug: slugify(f.title) }));
    }
  }, [form.title, slugManual]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm(f => ({ ...f, [name]: type === 'checkbox' ? checked : value }));
  };

  const handleSlugChange = (e) => {
    setSlugManual(true);
    setForm(f => ({ ...f, slug: slugify(e.target.value) }));
  };

  const handleTagToggle = (tag) => {
    setForm(f => ({
      ...f,
      tags: f.tags.includes(tag) ? f.tags.filter(t => t !== tag) : [...f.tags, tag],
    }));
  };

  const handleTagInputAdd = (e) => {
    if ((e.key === 'Enter' || e.key === ',') && tagInput.trim()) {
      e.preventDefault();
      const newTag = tagInput.trim();
      if (!form.tags.includes(newTag)) {
        setForm(f => ({ ...f, tags: [...f.tags, newTag] }));
      }
      setTagInput('');
    }
  };

  const execCmd = (cmd, value) => {
    document.execCommand(cmd, false, value);
    editorRef.current?.focus();
    setContent(editorRef.current?.innerHTML || '');
  };

  const handleEditorInput = () => {
    setContent(editorRef.current?.innerHTML || '');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title.trim()) return toast.error('Title is required');
    if (!content || content === '<br>') return toast.error('Content is required');
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
      const msg = err.response?.data?.message || err.response?.data?.errors?.[0]?.msg || 'Failed to save';
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
          <div className="bg-ipl-card border-b border-ipl-border px-8 py-5 flex items-center justify-between">
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

          <form onSubmit={handleSubmit} className="p-8 max-w-4xl">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Main fields */}
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
                    <span className="bg-ipl-dark border border-r-0 border-ipl-border rounded-l-lg px-3 py-3 text-gray-500 text-sm">/blog/</span>
                    <input
                      value={form.slug}
                      onChange={handleSlugChange}
                      placeholder="auto-generated-from-title"
                      className="flex-1 bg-ipl-card border border-ipl-border rounded-r-lg px-4 py-3 text-ipl-orange placeholder-gray-600 focus:outline-none focus:border-ipl-orange transition-all font-body text-sm"
                    />
                  </div>
                </div>

                {/* Content Editor */}
                <div>
                  <label className="block text-xs font-heading font-semibold tracking-widest uppercase text-gray-400 mb-2">
                    Content *
                  </label>
                  {/* Toolbar */}
                  <div className="bg-ipl-dark border border-b-0 border-ipl-border rounded-t-lg p-2 flex flex-wrap gap-1">
                    {TOOLBAR_ACTIONS.map(({ label, cmd, value, title }) => (
                      <button
                        key={label}
                        type="button"
                        title={title}
                        onMouseDown={(e) => { e.preventDefault(); execCmd(cmd, value); }}
                        className="px-2.5 py-1 rounded text-xs font-heading font-bold text-gray-300 hover:bg-ipl-border hover:text-ipl-orange transition-all border border-transparent hover:border-ipl-border"
                      >
                        {label}
                      </button>
                    ))}
                  </div>
                  <div
                    ref={editorRef}
                    contentEditable
                    suppressContentEditableWarning
                    onInput={handleEditorInput}
                    data-placeholder="Write your article here..."
                    className="min-h-[320px] bg-ipl-card border border-ipl-border rounded-b-lg p-4 text-gray-200 focus:outline-none focus:border-ipl-orange transition-all font-body text-sm leading-relaxed blog-content"
                    style={{ WebkitUserModify: 'read-write-plaintext-only' }}
                  />
                </div>

                {/* Excerpt */}
                <div>
                  <label className="block text-xs font-heading font-semibold tracking-widest uppercase text-gray-400 mb-2">
                    Excerpt <span className="text-gray-600 normal-case tracking-normal">(auto-generated if blank)</span>
                  </label>
                  <textarea
                    name="excerpt"
                    value={form.excerpt}
                    onChange={handleChange}
                    placeholder="Short summary shown on listing page..."
                    rows={3}
                    className="w-full bg-ipl-card border border-ipl-border rounded-lg px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-ipl-orange transition-all font-body text-sm resize-none"
                  />
                </div>
              </div>

              {/* Sidebar fields */}
              <div className="space-y-5">
                {/* Publish */}
                <div className="bg-ipl-card border border-ipl-border rounded-xl p-5">
                  <h3 className="font-heading font-bold text-sm text-white mb-4 tracking-wider uppercase">Publish</h3>
                  <label className="flex items-center justify-between cursor-pointer mb-4">
                    <span className="text-sm text-gray-400">Status</span>
                    <div className="relative">
                      <input
                        type="checkbox"
                        name="published"
                        checked={form.published}
                        onChange={handleChange}
                        className="sr-only"
                      />
                      <div
                        onClick={() => setForm(f => ({ ...f, published: !f.published }))}
                        className={`w-11 h-6 rounded-full transition-colors cursor-pointer ${form.published ? 'bg-ipl-orange' : 'bg-ipl-border'}`}
                      >
                        <div className={`w-4 h-4 bg-white rounded-full absolute top-1 transition-transform ${form.published ? 'translate-x-6' : 'translate-x-1'}`} />
                      </div>
                    </div>
                  </label>
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
                    <img src={form.coverImage} alt="cover preview" className="mt-2 rounded-lg w-full h-28 object-cover" />
                  )}
                </div>

                {/* Tags */}
                <div>
                  <label className="block text-xs font-heading font-semibold tracking-widest uppercase text-gray-400 mb-2">
                    Tags
                  </label>
                  <div className="flex flex-wrap gap-1.5 mb-3">
                    {IPL_TAGS.map(tag => (
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
                    placeholder="Custom tag, press Enter"
                    className="w-full bg-ipl-card border border-ipl-border rounded-lg px-3 py-2 text-white placeholder-gray-600 focus:outline-none focus:border-ipl-orange transition-all font-body text-xs"
                  />
                  {form.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-2">
                      {form.tags.map(tag => (
                        <span key={tag} className="flex items-center gap-1 px-2 py-0.5 bg-ipl-orange/20 text-ipl-orange rounded text-xs font-heading">
                          {tag}
                          <button type="button" onClick={() => handleTagToggle(tag)} className="hover:text-white">×</button>
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
