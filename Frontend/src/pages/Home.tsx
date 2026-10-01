import React, { useState, useEffect } from 'react';
import { Navbar } from '../components/Navbar';
import { GazetteLayout } from '../components/GazetteLayout';
import { FyrreLayout } from '../components/FyrreLayout';
import { ArticleModal } from '../components/ArticleModal';
import { CreateBlogModal } from '../components/CreateBlogModal';
import type { Blog } from '../types/blog';
import { MOCK_BLOGS, MOCK_COLUMNIST, MOCK_PODCAST, FEATURED_CATEGORIES } from '../data/mockBlogs';
import { api, getAuthHeader } from '../config/api';
import { ArrowUp } from 'lucide-react';

export const Home: React.FC = () => {
  const [viewMode, setViewMode] = useState<'gazette' | 'fyrre'>('gazette');
  const [darkMode, setDarkMode] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  
  const [blogs, setBlogs] = useState<Blog[]>(MOCK_BLOGS);
  const [selectedBlog, setSelectedBlog] = useState<Blog | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  
  const [isConnectedToBackend, setIsConnectedToBackend] = useState(false);

  // Sync dark class on documentElement
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  // Fetch blogs from backend API
  const fetchBlogsFromBackend = async () => {
    try {
      const response = await api.get('/api/v1/blog/bulk', {
        headers: getAuthHeader(),
      });

      if (response.data && Array.isArray(response.data.blogs)) {
        setIsConnectedToBackend(true);
        const fetchedBlogs: Blog[] = response.data.blogs.map((b: any, idx: number) => ({
          id: b.id,
          title: b.title,
          content: b.content,
          authorId: b.authorId,
          author: {
            name: b.author?.name || `Author #${b.authorId || idx + 1}`,
            avatar: `https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80`,
          },
          category: idx % 3 === 0 ? 'NEWS' : idx % 3 === 1 ? 'ART' : 'SCIENCE',
          date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
          readTime: `${Math.max(3, Math.ceil(b.content.length / 300))} MIN READ`,
          imageUrl: MOCK_BLOGS[idx % MOCK_BLOGS.length]?.imageUrl,
          dek: b.content.slice(0, 140) + '...',
        }));

        if (fetchedBlogs.length > 0) {
          // Merge live backend blogs with mock blogs so the grid is visually rich
          setBlogs([...fetchedBlogs, ...MOCK_BLOGS]);
        } else {
          setBlogs(MOCK_BLOGS);
        }
      } else {
        setIsConnectedToBackend(false);
        setBlogs(MOCK_BLOGS);
      }
    } catch (err) {
      console.warn('Backend API connection check (http://localhost:8787):', err);
      setIsConnectedToBackend(false);
      setBlogs(MOCK_BLOGS);
    }
  };

  useEffect(() => {
    fetchBlogsFromBackend();
  }, []);

  // Filter blogs based on search query
  const searchedBlogs = blogs.filter((b) => {
    const matchesSearch = searchQuery.trim() === '' || 
      b.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.author?.name?.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSearch;
  });

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-newspaper text-stone-900 dark:text-stone-100 transition-colors font-sans selection:bg-stone-900 selection:text-white dark:selection:bg-stone-100 dark:selection:text-stone-900">
      
      {/* Top Navigation & Masthead */}
      <Navbar
        viewMode={viewMode}
        setViewMode={setViewMode}
        darkMode={darkMode}
        setDarkMode={setDarkMode}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        onOpenCreateModal={() => setIsCreateModalOpen(true)}
        isConnectedToBackend={isConnectedToBackend}
        onRefreshBackend={fetchBlogsFromBackend}
        totalArticlesCount={blogs.length}
      />

      {/* Main Layout Content depending on active mode */}
      <main className="pb-16">
        {viewMode === 'gazette' ? (
          <GazetteLayout
            blogs={searchedBlogs}
            columnist={MOCK_COLUMNIST}
            podcast={MOCK_PODCAST}
            onSelectBlog={(blog) => setSelectedBlog(blog)}
            selectedCategory={selectedCategory}
            setSelectedCategory={setSelectedCategory}
            categories={FEATURED_CATEGORIES}
          />
        ) : (
          <FyrreLayout
            blogs={searchedBlogs}
            onSelectBlog={(blog) => setSelectedBlog(blog)}
            selectedCategory={selectedCategory}
            setSelectedCategory={setSelectedCategory}
            categories={FEATURED_CATEGORIES}
          />
        )}
      </main>

      {/* Editorial Footer */}
      <footer className="border-t-4 border-double-thick bg-stone-100 dark:bg-stone-950 py-12 px-4 transition-colors">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
          <div>
            <h3 className="font-cinzel text-2xl font-black tracking-wider text-stone-900 dark:text-stone-100 uppercase">
              THE MEDIUM GAZETTE
            </h3>
            <p className="text-xs font-newsreader italic text-stone-500 mt-1">
              Independent Journalism & Monochromatic Literary Review
            </p>
          </div>

          <div className="flex items-center gap-6 text-xs font-mono text-stone-600 dark:text-stone-400 uppercase tracking-widest">
            <span>NEW YORK</span>
            <span>•</span>
            <span>PARIS</span>
            <span>•</span>
            <span>LONDON</span>
            <span>•</span>
            <span>TOKYO</span>
          </div>

          <button
            onClick={scrollToTop}
            className="flex items-center gap-2 px-3 py-2 border border-stone-800 dark:border-stone-200 text-xs font-mono uppercase tracking-wider hover:bg-stone-900 hover:text-white dark:hover:bg-stone-100 dark:hover:text-stone-900 transition cursor-pointer"
          >
            <span>Top of Page</span>
            <ArrowUp className="w-3.5 h-3.5" />
          </button>
        </div>
      </footer>

      {/* Article Full View Drawer Modal */}
      {selectedBlog && (
        <ArticleModal
          blog={selectedBlog}
          onClose={() => setSelectedBlog(null)}
        />
      )}

      {/* Compose Blog Post Modal */}
      <CreateBlogModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSuccess={fetchBlogsFromBackend}
      />
    </div>
  );
};
