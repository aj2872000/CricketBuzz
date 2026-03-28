# 🏏 CricketBuzz — IPL Blog Website

A full-stack IPL blogging platform with a public-facing website and a protected admin panel.

Built with **React + Tailwind CSS** on the frontend and **Node.js + Express + MongoDB** on the backend.

---

## ✨ Features

### Public Website
- 🏠 Homepage with paginated blog listing
- 🔍 Search by keyword and filter by IPL team tags
- 📖 Full blog detail page with SEO-friendly `/blog/:slug` URLs
- 📱 Fully responsive dark-themed design
- ⚡ Loading skeletons and smooth animations

### Admin Panel (`/admin`)
- 🔐 JWT-based login (single admin account)
- 📊 Dashboard with stats and blog management table
- ✍️ Rich-text blog editor with toolbar (Bold, Italic, Headings, Lists, Blockquote)
- 🏷️ Tag selection with IPL team presets + custom tags
- 🖼️ Cover image URL with preview
- 💾 Auto-generate slug from title
- 🟢 Publish / Draft toggle
- ✏️ Edit existing blogs
- 🗑️ Delete with confirmation

---

## 🗂️ Folder Structure

```
ipl-blog/
├── package.json                  # Root scripts (concurrently)
│
├── backend/
│   ├── server.js                 # Express app entry point
│   ├── package.json
│   ├── .env.example
│   ├── seed.js                   # DB seeder with sample posts
│   ├── models/
│   │   └── Blog.js               # Mongoose Blog schema
│   ├── routes/
│   │   ├── auth.js               # POST /api/auth/login, GET /api/auth/verify
│   │   └── blogs.js              # CRUD blog routes
│   └── middleware/
│       ├── auth.js               # JWT verification middleware
│       └── errorHandler.js       # Global error handler
│
└── frontend/
    ├── package.json
    ├── tailwind.config.js
    ├── .env.example
    └── src/
        ├── index.js
        ├── index.css             # Global styles + Tailwind + Google Fonts
        ├── App.js                # Router + protected routes
        ├── context/
        │   └── AuthContext.js    # Auth state management
        ├── utils/
        │   └── api.js            # Axios instance with interceptors
        ├── components/
        │   ├── Navbar.js
        │   ├── Footer.js
        │   ├── BlogCard.js
        │   ├── Skeleton.js       # Loading skeletons
        │   ├── Pagination.js
        │   └── AdminSidebar.js
        └── pages/
            ├── HomePage.js
            ├── BlogDetailPage.js
            └── admin/
                ├── AdminLogin.js
                ├── AdminDashboard.js
                └── BlogEditor.js  # Create + Edit
```

---

## 🚀 Quick Setup

### Prerequisites
- Node.js v18+
- MongoDB (local or [MongoDB Atlas](https://cloud.mongodb.com))

### 1. Clone & Install

```bash
git clone <repo-url>
cd ipl-blog

# Install all dependencies
npm run install:all
```

### 2. Backend Environment

```bash
cd backend
cp .env.example .env
```

Edit `backend/.env`:

```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/ipl-blog
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
ADMIN_USERNAME=admin
ADMIN_PASSWORD=admin@IPL2024
NODE_ENV=development
```

### 3. Frontend Environment

```bash
cd frontend
cp .env.example .env
```

`frontend/.env`:
```env
REACT_APP_API_URL=http://localhost:5000/api
```

> **Note:** In development, the frontend `package.json` has `"proxy": "http://localhost:5000"`, so you can optionally leave `REACT_APP_API_URL` unset.

### 4. Seed Sample Data (Optional)

```bash
cd backend
node seed.js
```

This creates 6 sample IPL blog posts to get you started.

### 5. Run the App

**From the root directory:**
```bash
npm run dev
```

This starts both backend (port 5000) and frontend (port 3000) concurrently.

**Or run separately:**
```bash
# Terminal 1 — Backend
npm run dev:backend

# Terminal 2 — Frontend
npm run dev:frontend
```

### 6. Open in Browser

| URL | Description |
|-----|-------------|
| http://localhost:3000 | Public blog website |
| http://localhost:3000/admin/login | Admin login |
| http://localhost:3000/admin | Admin dashboard |
| http://localhost:5000/api/health | Backend health check |

**Default admin credentials:**
- Username: `admin`
- Password: `admin@IPL2024`

---

## 📡 API Reference

### Auth
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/api/auth/login` | ❌ | Admin login → returns JWT |
| GET | `/api/auth/verify` | ✅ | Verify JWT token |

### Blogs
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/api/blogs` | ❌ | List blogs (paginated, filterable) |
| GET | `/api/blogs/admin/all` | ✅ | List all blogs for admin |
| GET | `/api/blogs/:slug` | ❌ | Get single blog by slug |
| POST | `/api/blogs` | ✅ | Create new blog |
| PUT | `/api/blogs/:id` | ✅ | Update blog |
| DELETE | `/api/blogs/:id` | ✅ | Delete blog |

#### Query Parameters for `GET /api/blogs`
- `page` — page number (default: 1)
- `limit` — items per page (default: 9)
- `tag` — filter by tag (e.g., `?tag=CSK`)
- `search` — full-text search in title, content, author

---

## 🔒 Security Notes

1. **Change `JWT_SECRET`** to a long random string in production
2. **Change `ADMIN_PASSWORD`** to a strong password
3. Set `NODE_ENV=production` in production
4. Use HTTPS in production
5. Consider rate-limiting the `/api/auth/login` endpoint

---

## 🏗️ Production Build

```bash
# Build frontend
cd frontend && npm run build

# Serve the build with Express (add to server.js):
# app.use(express.static(path.join(__dirname, '../frontend/build')));
# app.get('*', (req, res) => res.sendFile(path.join(__dirname, '../frontend/build/index.html')));
```

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18, React Router v6, Tailwind CSS |
| HTTP Client | Axios |
| SEO | react-helmet-async |
| Notifications | react-hot-toast |
| Backend | Node.js, Express 4 |
| Database | MongoDB, Mongoose |
| Auth | JWT (jsonwebtoken), bcryptjs |
| Validation | express-validator |
| Slug | slugify |
| Fonts | Bebas Neue, Barlow Condensed, DM Sans |
