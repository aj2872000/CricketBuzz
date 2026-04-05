const mongoose = require('mongoose');
const slugify = require('slugify');

const blogSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Title is required'],
      trim: true,
      maxlength: [200, 'Title cannot exceed 200 characters'],
    },
    slug: {
      type: String,
      unique: true,
      lowercase: true,
      trim: true,
    },
    content: {
      type: String,
      required: [true, 'Content is required'],
    },
    excerpt: {
      type: String,
      maxlength: [500, 'Excerpt cannot exceed 500 characters'],
    },
    author: {
      type: String,
      required: [true, 'Author is required'],
      trim: true,
    },
    tags: {
      type: [String],
      default: [],
    },
    coverImage: {
      type: String,
      default: '',
    },
    published: {
      type: Boolean,
      default: true,
    },
    views: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

// Strip HTML tags and decode entities to get plain text
function htmlToPlainText(html) {
  return html
    .replace(/<[^>]+>/g, ' ')   // remove all HTML tags
    .replace(/&nbsp;/g, ' ')    // decode HTML entities
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/\s+/g, ' ')       // collapse whitespace
    .trim();
}

// Auto-generate slug and excerpt before saving
blogSchema.pre('save', async function (next) {
  // Slug generation
  if (this.isModified('title') || this.isNew) {
    let baseSlug = slugify(this.title, {
      lower: true,
      strict: true,
      trim: true,
    });

    let slug = baseSlug;
    let counter = 1;
    while (true) {
      const existing = await mongoose.model('Blog').findOne({
        slug,
        _id: { $ne: this._id },
      });
      if (!existing) break;
      slug = `${baseSlug}-${counter++}`;
    }
    this.slug = slug;
  }

  // Excerpt generation — always strip HTML, never store raw tags
  if (this.content && (this.isModified('content') || !this.excerpt)) {
    if (!this.excerpt || this.excerpt.includes('<')) {
      const plain = htmlToPlainText(this.content);
      this.excerpt = plain.substring(0, 200) + (plain.length > 200 ? '...' : '');
    }
  }

  next();
});

// Index for faster queries
blogSchema.index({ slug: 1 });
blogSchema.index({ createdAt: -1 });
blogSchema.index({ tags: 1 });

module.exports = mongoose.model('Blog', blogSchema);
