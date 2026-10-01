import React from 'react';
import type { Blog } from '../types/blog';
import { ArrowUpRight, Clock, User } from 'lucide-react';

interface FyrreLayoutProps {
  blogs: Blog[];
  onSelectBlog: (blog: Blog) => void;
  selectedCategory: string;
  setSelectedCategory: (cat: string) => void;
  categories: string[];
}

export const FyrreLayout: React.FC<FyrreLayoutProps> = ({
  blogs,
  onSelectBlog,
  selectedCategory,
  setSelectedCategory,
  categories,
}) => {
  const filteredBlogs = selectedCategory === 'ALL'
    ? blogs
    : blogs.filter(b => b.category?.toUpperCase() === selectedCategory.toUpperCase());

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Category Pills Header (Matching Fyrre Image 2) */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 pb-6 border-b border-stone-300 dark:border-stone-800">
        <div>
          <span className="text-xs font-mono tracking-widest text-stone-500 uppercase block mb-1">CATEGORIES</span>
          <h2 className="text-3xl font-bold font-syne uppercase text-stone-900 dark:text-stone-100">
            {selectedCategory === 'ALL' ? 'ALL DISPATCHES' : selectedCategory}
          </h2>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-1.5 text-xs font-sans tracking-wider uppercase rounded-full border transition cursor-pointer ${
                selectedCategory === cat
                  ? 'bg-stone-900 text-stone-100 border-stone-900 dark:bg-stone-100 dark:text-stone-900 dark:border-stone-100 font-bold'
                  : 'bg-transparent text-stone-700 dark:text-stone-300 border-stone-300 dark:border-stone-700 hover:border-stone-900 dark:hover:border-stone-100'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* 3-Column Magazine Card Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-8">
        {filteredBlogs.map((blog) => (
          <article
            key={blog.id}
            onClick={() => onSelectBlog(blog)}
            className="group cursor-pointer border border-stone-300 dark:border-stone-800 bg-white dark:bg-stone-900/80 p-5 flex flex-col justify-between hover:border-stone-900 dark:hover:border-stone-100 transition-all duration-300 hover:shadow-lg"
          >
            <div>
              {/* Top metadata strip */}
              <div className="flex justify-between items-center text-[11px] font-mono text-stone-500 mb-4 pb-2 border-b border-stone-200 dark:border-stone-800">
                <span>{blog.date || '16 MARCH 2026'}</span>
                <span className="px-2 py-0.5 border border-stone-300 dark:border-stone-700 rounded-full uppercase text-[10px] tracking-wider text-stone-700 dark:text-stone-300">
                  {blog.category || 'ART'}
                </span>
              </div>

              {/* Monochrome artistic image container */}
              {blog.imageUrl && (
                <div className="overflow-hidden border border-stone-200 dark:border-stone-800 mb-4 h-64 bg-stone-900">
                  <img
                    src={blog.imageUrl}
                    alt={blog.title}
                    className="w-full h-full object-cover editorial-img group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
              )}

              {/* Title & Dek / Content snippet */}
              <h3 className="text-2xl font-bold font-syne leading-snug text-stone-900 dark:text-stone-100 group-hover:underline decoration-1 underline-offset-4">
                {blog.title}
              </h3>

              <p className="text-xs font-sans text-stone-600 dark:text-stone-400 mt-3 line-clamp-3 leading-relaxed">
                {blog.dek || blog.content}
              </p>
            </div>

            {/* Bottom Meta Bar (Text: Author | Duration: 5 Min) */}
            <div className="mt-6 pt-3 border-t border-stone-200 dark:border-stone-800 flex items-center justify-between text-xs font-sans text-stone-500">
              <div className="flex items-center gap-4">
                <span className="flex items-center gap-1 font-semibold text-stone-900 dark:text-stone-200">
                  <User className="w-3.5 h-3.5 text-stone-400" />
                  <span className="truncate max-w-[120px]">{blog.author?.name || 'JAKOB GRONBERG'}</span>
                </span>
                <span className="flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-stone-400" />
                  <span>{blog.readTime || '5 MIN'}</span>
                </span>
              </div>

              <div className="w-7 h-7 rounded-full border border-stone-300 dark:border-stone-700 flex items-center justify-center group-hover:bg-stone-900 group-hover:text-white dark:group-hover:bg-stone-100 dark:group-hover:text-stone-900 transition">
                <ArrowUpRight className="w-4 h-4" />
              </div>
            </div>
          </article>
        ))}
      </div>

      {filteredBlogs.length === 0 && (
        <div className="text-center py-16 border border-dashed border-stone-400 dark:border-stone-700 my-8">
          <p className="text-stone-500 font-sans uppercase tracking-widest text-sm">No dispatches found in this category.</p>
          <button 
            onClick={() => setSelectedCategory('ALL')}
            className="mt-4 px-4 py-2 bg-stone-900 text-stone-100 dark:bg-stone-100 dark:text-stone-900 text-xs font-bold uppercase tracking-wider cursor-pointer"
          >
            Reset Filters
          </button>
        </div>
      )}
    </div>
  );
};
