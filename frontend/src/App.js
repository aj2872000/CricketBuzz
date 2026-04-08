import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';

// Public pages
import HomePage       from './pages/HomePage';
import BlogDetailPage from './pages/BlogDetailPage';
import WriteArticlePage from './pages/WriteArticlePage';
import PreviewPage    from './pages/PreviewPage';

// Admin pages
import AdminLogin     from './pages/admin/AdminLogin';
import AdminDashboard from './pages/admin/AdminDashboard';
import BlogEditor     from './pages/admin/BlogEditor';

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  if (loading) return (
    <div className="min-h-screen flex items-center justify-center" style={{ background: 'var(--bg)' }}>
      <div className="w-8 h-8 border-2 border-t-transparent rounded-full animate-spin"
        style={{ borderColor: 'var(--orange)', borderTopColor: 'transparent' }} />
    </div>
  );
  return isAuthenticated ? children : <Navigate to="/admin/login" replace />;
};

function AppRoutes() {
  return (
    <Routes>
      {/* Public */}
      <Route path="/"               element={<HomePage />} />
      <Route path="/blog/:slug"     element={<BlogDetailPage />} />
      <Route path="/write"          element={<WriteArticlePage />} />
      <Route path="/preview/:slug"  element={<PreviewPage />} />

      {/* Admin — secret URL, no link from public site */}
      <Route path="/admin/login"    element={<AdminLogin />} />
      <Route path="/admin"          element={<ProtectedRoute><AdminDashboard /></ProtectedRoute>} />
      <Route path="/admin/create"   element={<ProtectedRoute><BlogEditor /></ProtectedRoute>} />
      <Route path="/admin/edit/:id" element={<ProtectedRoute><BlogEditor /></ProtectedRoute>} />

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </BrowserRouter>
  );
}
