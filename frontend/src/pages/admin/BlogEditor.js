import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { format } from 'date-fns';
import api from '../../utils/api';
import AdminSidebar from '../../components/AdminSidebar';
import { useAuth } from '../../context/AuthContext';
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
  return str.toLowerCase().replace(/[^a-z0-9\s-]/g, '').trim().replace(/\s+/g, '-').replace(/-+/g, '-');
}

// Preview renders the blog exactly as it would appear on the public page
function ArticlePreview({ form, content }) {
  return (
    <div className="animate-fade-in">
      <div className="preview-banner">
        🔍 Draft Preview — This is how your article will look when published
      </div>
      <div style={{ background: 'var(--bg)', minHeight: '100vh', padding: '2rem 1rem' }}>
        <div style={{ maxWidth: '720px', margin: '0 auto' }}>
          {form.tags?.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-5">
              {form.tags.map(tag => (
                <span key={tag} className="text-xs font-heading font-semibold tracking-widest uppercase px-3 py-1 rounded-full"
                  style={{ background: 'color-mix(in srgb, var(--orange) 12%, transparent)', color: 'var(--orange)', border: '1px solid color-mix(in srgb, var(--orange) 25%, transparent)' }}>
                  {tag}
                </span>
              ))}
            </div>
          )}
          <h1 className="font-heading font-bold text-4xl sm:text-5xl mb-4 leading-tight" style={{ color: 'var(--text)' }}>
            {form.title || 'Untitled Article'}
          </h1>
          <div className="flex flex-wrap items-center gap-x-5 gap-y-2 mb-8 pb-6" style={{ borderBottom: '1px solid var(--border)' }}>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-sm"
                style={{ background: 'linear-gradient(135deg, var(--gold), var(--orange))' }}>
                {(form.author || '?').charAt(0).toUpperCase()}
              </div>
              <span className="text-sm font-semibold" style={{ color: 'var(--text)' }}>{form.author || 'Anonymous'}</span>
            </div>
            <span className="text-sm" style={{ color: 'var(--text-sub)' }}>
              📅 {format(new Date(), 'MMMM d, yyyy')}
            </span>
            <span className="text-xs font-heading font-semibold px-2 py-0.5 rounded" style={{ background: 'color-mix(in srgb, #EAB308 15%, transparent)', color: '#CA8A04' }}>
              DRAFT
            </span>
          </div>
          {form.coverImage && (
            <div className="mb-8 rounded-xl overflow-hidden">
              <img src={form.coverImage} alt={form.title} className="w-full object-cover max-h-96" />
            </div>
          )}
          <div className="blog-content ql-snow" style={{ border: 'none' }}>
            <div className="ql-editor" style={{ padding: 0 }} dangerouslySetInnerHTML={{ __html: content || '<p style="color:var(--text-sub)">No content yet...</p>' }} />
          </div>
        </div>
      </div>
    </div>
  );
}

// The shared editor form used by both admin and public routes
export function BlogEditorForm({ isAdmin = false, editId = null }) {
  const { id: routeId } = useParams();
  const id = editId || routeId;
  const isEdit = Boolean(id);
  const navigate = useNavigate();
  const [tab, setTab] = useState('write'); // 'write' | 'preview'

  const [form, setForm] = useState({
    title: '', slug: '', author: '', excerpt: '', coverImage: '', tags: [],
    published: isAdmin ? true : false, // public submissions always draft
  });
  const [content, setContent] = useState('');
  const [slugManual, setSlugManual] = useState(false);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(isEdit);
  const [tagInput, setTagInput] = useState('');
  const [savedSlug, setSavedSlug] = useState(null); // for post-save preview link

  useEffect(() => {
    if (!isEdit) return;
    const fetchBlog = async () => {
      try {
        const res = await api.get('/blogs/admin/all', { params: { page: 1, limit: 200 } });
        const found = res.data.data.find(b => b._id === id);
        if (found) {
          const full = await api.get(`/blogs/${found.slug}`);
          const blog = full.data.data;
          setForm({ title: blog.title, slug: blog.slug, author: blog.author, excerpt: blog.excerpt || '', coverImage: blog.coverImage || '', tags: blog.tags || [], published: blog.published });
          setContent(blog.content || '');
          setSlugManual(true);
        }
      } catch { toast.error('Failed to load article'); }
      finally { setFetching(false); }
    };
    fetchBlog();
  }, [id, isEdit]);

  useEffect(() => {
    if (!slugManual && form.title) setForm(f => ({ ...f, slug: slugify(f.title) }));
  }, [form.title, slugManual]);

  const handleChange = e => {
    const { name, value } = e.target;
    setForm(f => ({ ...f, [name]: value }));
  };

  const handleTagToggle = tag => {
    setForm(f => ({ ...f, tags: f.tags.includes(tag) ? f.tags.filter(t => t !== tag) : [...f.tags, tag] }));
  };

  const handleTagInputAdd = e => {
    if ((e.key === 'Enter' || e.key === ',') && tagInput.trim()) {
      e.preventDefault();
      const t = tagInput.trim();
      if (!form.tags.includes(t)) setForm(f => ({ ...f, tags: [...f.tags, t] }));
      setTagInput('');
    }
  };

  const handleSubmit = async e => {
    e.preventDefault();
    if (!form.title.trim()) return toast.error('Title is required');
    if (!content || content === '<p><br></p>') return toast.error('Content is required');
    if (!form.author.trim()) return toast.error('Author is required');
    setLoading(true);
    try {
      // Public submissions are always draft; admin can set published
      const payload = { ...form, content, published: isAdmin ? form.published : false };
      let slug;
      if (isEdit) {
        const { data } = await api.put(`/blogs/${id}`, payload);
        slug = data.data.slug;
        toast.success('Article updated!');
      } else {
        const { data } = await api.post('/blogs', payload);
        slug = data.data.slug;
        toast.success(isAdmin ? 'Article published!' : 'Article submitted for review! 🎉');
      }
      setSavedSlug(slug);
      if (isAdmin) navigate('/admin');
      // For public, stay on page to show preview option
    } catch (err) {
      toast.error(err.response?.data?.message || err.response?.data?.errors?.[0]?.msg || 'Failed to save');
    } finally { setLoading(false); }
  };

  if (fetching) return (
    <div className="flex-1 flex items-center justify-center" style={{ background: 'var(--bg)' }}>
      <div className="w-8 h-8 border-2 border-t-transparent rounded-full animate-spin" style={{ borderColor: 'var(--orange)', borderTopColor: 'transparent' }} />
    </div>
  );

  // After public submit — show success + preview option
  if (!isAdmin && savedSlug) return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 text-center animate-fade-in" style={{ background: 'var(--bg)' }}>
      <div className="text-6xl mb-4">🏏</div>
      <h2 className="font-display text-4xl mb-3 gradient-text">Submitted!</h2>
      <p className="mb-6 max-w-md" style={{ color: 'var(--text-muted)' }}>
        Your article is saved as a <strong>draft</strong> and is under review by our admins. Once approved it will go live.
      </p>
      <div className="flex gap-3 flex-wrap justify-center">
        <Link to={`/preview/${savedSlug}`}
          className="px-5 py-2.5 rounded-lg font-heading font-bold text-sm tracking-wider text-white transition-opacity hover:opacity-90"
          style={{ background: 'var(--orange)' }}>
          👁 Preview Your Article
        </Link>
        <Link to="/"
          className="px-5 py-2.5 rounded-lg font-heading font-bold text-sm tracking-wider transition-all"
          style={{ border: '1px solid var(--border)', color: 'var(--text-muted)' }}>
          ← Back to Home
        </Link>
        <button onClick={() => setSavedSlug(null)}
          className="px-5 py-2.5 rounded-lg font-heading font-bold text-sm tracking-wider transition-all"
          style={{ border: '1px solid var(--border)', color: 'var(--text-muted)' }}>
          ✍️ Write Another
        </button>
      </div>
    </div>
  );

  return (
    <div className="flex-1 overflow-auto" style={{ background: 'var(--bg)' }}>
      {/* Header */}
      <div className="sticky top-0 z-10 px-6 py-4 flex items-center justify-between"
        style={{ background: 'var(--bg-card)', borderBottom: '1px solid var(--border)' }}>
        <div>
          <h1 className="font-heading font-bold text-xl" style={{ color: 'var(--text)' }}>
            {isEdit ? 'Edit Article' : isAdmin ? 'New Article' : '✍️ Write an Article'}
          </h1>
          {!isAdmin && <p className="text-xs mt-0.5" style={{ color: 'var(--text-sub)' }}>Articles are reviewed before publishing</p>}
        </div>
        <div className="flex items-center gap-2">
          {/* Write / Preview tabs */}
          <div className="flex rounded-lg overflow-hidden" style={{ border: '1px solid var(--border)' }}>
            {['write', 'preview'].map(t => (
              <button key={t} onClick={() => setTab(t)}
                className="px-4 py-1.5 text-xs font-heading font-bold tracking-wider uppercase transition-all"
                style={{
                  background: tab === t ? 'var(--orange)' : 'var(--bg-input)',
                  color: tab === t ? '#fff' : 'var(--text-muted)',
                }}>
                {t === 'write' ? '✏️ Write' : '👁 Preview'}
              </button>
            ))}
          </div>
          <Link to={isAdmin ? '/admin' : '/'}
            className="text-sm font-heading font-semibold tracking-wider px-3 py-1.5 rounded-lg transition-all"
            style={{ color: 'var(--text-muted)', border: '1px solid var(--border)' }}>
            ← Back
          </Link>
        </div>
      </div>

      {tab === 'preview' ? (
        <ArticlePreview form={form} content={content} />
      ) : (
        <form onSubmit={handleSubmit} className="p-6 max-w-5xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">

            {/* ── Main ── */}
            <div className="lg:col-span-2 space-y-5">
              {/* Title */}
              <div>
                <label className="block text-xs font-heading font-semibold tracking-widest uppercase mb-1.5" style={{ color: 'var(--text-sub)' }}>Title *</label>
                <input name="title" value={form.title} onChange={handleChange} required
                  placeholder="e.g. CSK vs MI: Battle of Titans Preview"
                  className="w-full rounded-lg px-4 py-3 text-lg focus:outline-none transition-all"
                  style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', color: 'var(--text)' }}
                  onFocus={e => e.target.style.borderColor = 'var(--orange)'}
                  onBlur={e => e.target.style.borderColor = 'var(--border)'}
                />
              </div>

              {/* Slug */}
              <div>
                <label className="block text-xs font-heading font-semibold tracking-widest uppercase mb-1.5" style={{ color: 'var(--text-sub)' }}>URL Slug</label>
                <div className="flex items-center rounded-lg overflow-hidden" style={{ border: '1px solid var(--border)' }}>
                  <span className="px-3 py-3 text-sm" style={{ background: 'var(--bg-input)', color: 'var(--text-sub)', borderRight: '1px solid var(--border)' }}>/blog/</span>
                  <input value={form.slug} onChange={e => { setSlugManual(true); setForm(f => ({ ...f, slug: slugify(e.target.value) })); }}
                    placeholder="auto-generated" className="flex-1 px-4 py-3 text-sm focus:outline-none"
                    style={{ background: 'var(--bg-card)', color: 'var(--orange)' }} />
                </div>
              </div>

              {/* Content */}
              <div>
                <label className="block text-xs font-heading font-semibold tracking-widest uppercase mb-1.5" style={{ color: 'var(--text-sub)' }}>Content *</label>
                <ReactQuill theme="snow" value={content} onChange={setContent} modules={QUILL_MODULES} formats={QUILL_FORMATS}
                  placeholder="Write your article here — use the toolbar for headings, bold, lists..." />
              </div>

              {/* Excerpt */}
              <div>
                <label className="block text-xs font-heading font-semibold tracking-widest uppercase mb-1.5" style={{ color: 'var(--text-sub)' }}>
                  Excerpt <span className="normal-case tracking-normal font-normal" style={{ color: 'var(--text-sub)' }}>(auto-generated if blank)</span>
                </label>
                <textarea name="excerpt" value={form.excerpt} onChange={handleChange} rows={3}
                  placeholder="Short summary shown on listing page..."
                  className="w-full rounded-lg px-4 py-3 text-sm focus:outline-none resize-none transition-all"
                  style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', color: 'var(--text)' }}
                  onFocus={e => e.target.style.borderColor = 'var(--orange)'}
                  onBlur={e => e.target.style.borderColor = 'var(--border)'}
                />
              </div>
            </div>

            {/* ── Sidebar ── */}
            <div className="space-y-5">

              {/* Publish status — admin only */}
              {isAdmin && (
                <div className="rounded-xl p-5" style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}>
                  <h3 className="font-heading font-bold text-sm tracking-wider uppercase mb-4" style={{ color: 'var(--text)' }}>Publish</h3>
                  <div className="flex items-center justify-between cursor-pointer mb-2"
                    onClick={() => setForm(f => ({ ...f, published: !f.published }))}>
                    <span className="text-sm" style={{ color: 'var(--text-muted)' }}>Status</span>
                    <div className="relative w-11 h-6">
                      <div className="w-11 h-6 rounded-full transition-colors" style={{ background: form.published ? 'var(--orange)' : 'var(--border)' }} />
                      <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform ${form.published ? 'translate-x-6' : 'translate-x-1'}`} />
                    </div>
                  </div>
                  <p className="text-xs font-heading font-semibold" style={{ color: form.published ? '#10B981' : 'var(--text-sub)' }}>
                    {form.published ? '● Published' : '○ Draft'}
                  </p>
                </div>
              )}

              {/* Submission note for public users */}
              {!isAdmin && (
                <div className="rounded-xl p-4" style={{ background: 'color-mix(in srgb, var(--orange) 8%, var(--bg-card))', border: '1px solid color-mix(in srgb, var(--orange) 20%, transparent)' }}>
                  <p className="text-xs font-heading font-semibold tracking-wider uppercase mb-1" style={{ color: 'var(--orange)' }}>📋 Review Process</p>
                  <p className="text-xs leading-relaxed" style={{ color: 'var(--text-muted)' }}>
                    Your article will be saved as a <strong>draft</strong>. Our team reviews all submissions before publishing. You can preview it after submitting.
                  </p>
                </div>
              )}

              {/* Author */}
              <div>
                <label className="block text-xs font-heading font-semibold tracking-widest uppercase mb-1.5" style={{ color: 'var(--text-sub)' }}>Author *</label>
                <input name="author" value={form.author} onChange={handleChange} required placeholder="Your name"
                  className="w-full rounded-lg px-4 py-3 text-sm focus:outline-none transition-all"
                  style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', color: 'var(--text)' }}
                  onFocus={e => e.target.style.borderColor = 'var(--orange)'}
                  onBlur={e => e.target.style.borderColor = 'var(--border)'}
                />
              </div>

              {/* Cover Image */}
              <div>
                <label className="block text-xs font-heading font-semibold tracking-widest uppercase mb-1.5" style={{ color: 'var(--text-sub)' }}>Cover Image URL</label>
                <input name="coverImage" value={form.coverImage} onChange={handleChange} placeholder="https://..."
                  className="w-full rounded-lg px-4 py-3 text-sm focus:outline-none transition-all"
                  style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', color: 'var(--text)' }}
                  onFocus={e => e.target.style.borderColor = 'var(--orange)'}
                  onBlur={e => e.target.style.borderColor = 'var(--border)'}
                />
                {form.coverImage && <img src={form.coverImage} alt="preview" className="mt-2 rounded-lg w-full h-28 object-cover" style={{ border: '1px solid var(--border)' }} />}
              </div>

              {/* Tags */}
              <div>
                <label className="block text-xs font-heading font-semibold tracking-widest uppercase mb-1.5" style={{ color: 'var(--text-sub)' }}>Tags</label>
                <div className="flex flex-wrap gap-1.5 mb-2">
                  {IPL_TAGS.map(tag => (
                    <button key={tag} type="button" onClick={() => handleTagToggle(tag)}
                      className="px-2.5 py-1 rounded text-xs font-heading font-semibold transition-all"
                      style={{
                        background: form.tags.includes(tag) ? 'var(--orange)' : 'var(--bg-input)',
                        color: form.tags.includes(tag) ? '#000' : 'var(--text-muted)',
                        border: `1px solid ${form.tags.includes(tag) ? 'var(--orange)' : 'var(--border)'}`,
                      }}>
                      {tag}
                    </button>
                  ))}
                </div>
                <input value={tagInput} onChange={e => setTagInput(e.target.value)} onKeyDown={handleTagInputAdd}
                  placeholder="Custom tag — press Enter"
                  className="w-full rounded-lg px-3 py-2 text-xs focus:outline-none"
                  style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', color: 'var(--text)' }} />
                {form.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-2">
                    {form.tags.map(tag => (
                      <span key={tag} className="flex items-center gap-1 px-2 py-0.5 rounded text-xs font-heading"
                        style={{ background: 'color-mix(in srgb, var(--orange) 15%, transparent)', color: 'var(--orange)' }}>
                        {tag}
                        <button type="button" onClick={() => handleTagToggle(tag)} className="hover:opacity-70">×</button>
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Submit */}
              <button type="submit" disabled={loading}
                className="w-full py-3 font-heading font-bold text-sm tracking-widest uppercase rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                style={{ background: 'linear-gradient(135deg, var(--orange), var(--gold))', color: '#000', boxShadow: '0 4px 15px color-mix(in srgb, var(--orange) 30%, transparent)' }}>
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <span className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                    Saving…
                  </span>
                ) : isAdmin
                    ? (isEdit ? '💾 Update Article' : '🚀 Publish Article')
                    : '📤 Submit for Review'}
              </button>
            </div>
          </div>
        </form>
      )}
    </div>
  );
}

// Admin route: has sidebar, can publish
export default function BlogEditor() {
  return (
    <>
      <Helmet><title>Blog Editor — CricketBuzz Admin</title></Helmet>
      <div className="min-h-screen flex" style={{ background: 'var(--bg)' }}>
        <AdminSidebar />
        <BlogEditorForm isAdmin={true} />
      </div>
    </>
  );
}
