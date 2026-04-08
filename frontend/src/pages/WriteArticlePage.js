import React from 'react';
import { Helmet } from 'react-helmet-async';
import Navbar from '../components/Navbar';
import { BlogEditorForm } from './admin/BlogEditor';

export default function WriteArticlePage() {
  return (
    <>
      <Helmet>
        <title>Write an Article — CricketBuzz</title>
        <meta name="description" content="Share your IPL cricket insights with the CricketBuzz community." />
      </Helmet>
      <div className="min-h-screen flex flex-col" style={{ background: 'var(--bg)' }}>
        <Navbar />
        <div className="flex-1 pt-16">
          <BlogEditorForm isAdmin={false} />
        </div>
      </div>
    </>
  );
}
