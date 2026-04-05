const express = require('express');
const { body, validationResult } = require('express-validator');
const Blog = require('../models/Blog');
const authMiddleware = require('../middleware/auth');

const router = express.Router();

// GET /api/blogs — Public, with pagination & tag filter
router.get('/', async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 9;
    const tag = req.query.tag || '';
    const search = req.query.search || '';

    const query = { published: true };
    if (tag) query.tags = { $in: [tag] };
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { content: { $regex: search, $options: 'i' } },
        { author: { $regex: search, $options: 'i' } },
      ];
    }

    const total = await Blog.countDocuments(query);
    const blogs = await Blog.find(query)
      .select('-content')
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit);

    res.json({
      success: true,
      data: blogs,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
        hasMore: page * limit < total,
      },
    });
  } catch (err) {
    next(err);
  }
});

// GET /api/blogs/admin — Admin, all blogs
router.get('/admin/all', authMiddleware, async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    const total = await Blog.countDocuments();
    const blogs = await Blog.find()
      .select('-content')
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit);

    res.json({
      success: true,
      data: blogs,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (err) {
    next(err);
  }
});

// GET /api/blogs/:slug — Public
router.get('/:slug', async (req, res, next) => {
  try {
    const blog = await Blog.findOneAndUpdate(
      { slug: req.params.slug },
      { $inc: { views: 1 } },
      { new: true }
    );

    if (!blog) {
      return res.status(404).json({
        success: false,
        message: 'Blog not found',
      });
    }

    res.json({ success: true, data: blog });
  } catch (err) {
    next(err);
  }
});

// POST /api/blogs — Admin only
router.post(
  '/',
  authMiddleware,
  [
    body('title').trim().notEmpty().withMessage('Title is required'),
    body('content').notEmpty().withMessage('Content is required'),
    body('author').trim().notEmpty().withMessage('Author is required'),
  ],
  async (req, res, next) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ success: false, errors: errors.array() });
      }

      const { title, content, author, tags, excerpt, coverImage, published } = req.body;

      const blog = new Blog({
        title,
        content,
        author,
        tags: tags || [],
        // Only use provided excerpt if it's plain text; otherwise let the
        // pre('save') hook strip HTML from content and generate it
        excerpt: excerpt && !excerpt.includes('<') ? excerpt : undefined,
        coverImage,
        published: published !== undefined ? published : true,
      });

      await blog.save();
      res.status(201).json({ success: true, message: 'Blog created successfully', data: blog });
    } catch (err) {
      next(err);
    }
  }
);

// PUT /api/blogs/:id — Admin only
router.put(
  '/:id',
  authMiddleware,
  [
    body('title').optional().trim().notEmpty().withMessage('Title cannot be empty'),
    body('content').optional().notEmpty().withMessage('Content cannot be empty'),
    body('author').optional().trim().notEmpty().withMessage('Author cannot be empty'),
  ],
  async (req, res, next) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ success: false, errors: errors.array() });
      }

      const blog = await Blog.findById(req.params.id);
      if (!blog) {
        return res.status(404).json({ success: false, message: 'Blog not found' });
      }

      const fields = ['title', 'content', 'author', 'tags', 'excerpt', 'coverImage', 'published'];
      fields.forEach((field) => {
        if (req.body[field] !== undefined) blog[field] = req.body[field];
      });

      // If excerpt is empty or contains raw HTML tags, clear it so
      // the pre('save') hook regenerates a clean plain-text excerpt
      if (!blog.excerpt || blog.excerpt.includes('<')) {
        blog.excerpt = undefined;
      }

      await blog.save();
      res.json({ success: true, message: 'Blog updated successfully', data: blog });
    } catch (err) {
      next(err);
    }
  }
);

// DELETE /api/blogs/:id — Admin only
router.delete('/:id', authMiddleware, async (req, res, next) => {
  try {
    const blog = await Blog.findByIdAndDelete(req.params.id);
    if (!blog) {
      return res.status(404).json({ success: false, message: 'Blog not found' });
    }
    res.json({ success: true, message: 'Blog deleted successfully' });
  } catch (err) {
    next(err);
  }
});

router.post('/crew-completed', async (req, res) => {
  const data = req.body;

  const { kickoff_id, result } = data;

  try {
    if (!kickoff_id || !result) {
      console.error('Invalid webhook payload:', data);
      return res.status(400).json({ success: false, message: 'Invalid payload' });
    }

    const { id, title, content } = result || {};

    if (!id || !title || !content) {
      console.error('Missing expected result fields:', result);
      return res.status(400).json({ success: false, message: 'Missing result fields' });
    }

    const newBlog = new Blog({
      title,
      content,
      author: 'CrewAI',
      tags: ['automated'],
      excerpt: content.substring(0, 150) + '...',
      coverImage: '',
      published: false,
    });

    await newBlog.save();

    res.status(200).json({ success: true, message: 'Blog created successfully', data: newBlog });
  } catch (error) {
    console.error('Error processing CrewAI webhook:', error);
    next(error);
  }
});

module.exports = router;
