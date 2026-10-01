import React, { useState } from 'react';
import type { Blog, Columnist, PodcastEpisode } from '../types/blog';
import { Play, Pause, Volume2, Quote, ArrowRight } from 'lucide-react';

interface GazetteLayoutProps {
  blogs: Blog[];
  columnist: Columnist;
  podcast: PodcastEpisode;
  onSelectBlog: (blog: Blog) => void;
  selectedCategory: string;
  setSelectedCategory: (cat: string) => void;
  categories: string[];
}

export const GazetteLayout: React.FC<GazetteLayoutProps> = ({
  blogs,
  columnist,
  podcast,
  onSelectBlog,
  selectedCategory,
  setSelectedCategory,
  categories,
}) => {
  const [isPlayingPodcast, setIsPlayingPodcast] = useState(false);

  const filteredBlogs = selectedCategory === 'ALL'
    ? blogs
    : blogs.filter(b => b.category?.toUpperCase() === selectedCategory.toUpperCase());

  const heroArticle = filteredBlogs.find(b => b.isFeatured) || filteredBlogs[0] || blogs[0];
  const secondaryArticles = filteredBlogs.filter(b => b.id !== heroArticle?.id);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Category Selection Tabs */}
      <div className="flex flex-wrap items-center justify-center gap-2 mb-8 pb-4 border-b border-stone-300 dark:border-stone-700 text-xs font-semibold uppercase tracking-wider">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-3 py-1 transition cursor-pointer ${
              selectedCategory === cat
                ? 'bg-stone-900 text-stone-100 dark:bg-stone-100 dark:text-stone-900 font-bold'
                : 'hover:bg-stone-200 dark:hover:bg-stone-800 text-stone-700 dark:text-stone-300'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Main 3-Column Newspaper Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 divide-y lg:divide-y-0 lg:divide-x divide-stone-300 dark:divide-stone-700">
        
        {/* LEFT COLUMN: Lead Feature & Secondary News (Span 7) */}
        <div className="lg:col-span-7 pr-0 lg:pr-8 flex flex-col gap-8">
          
          {/* Section Heading Tag */}
          <div className="flex items-center justify-between border-b-2 border-stone-900 dark:border-stone-100 pb-1">
            <h2 className="text-xl font-bold font-oswald tracking-widest uppercase text-stone-900 dark:text-stone-100">
              {selectedCategory === 'ALL' ? 'FRONT PAGE NEWS' : selectedCategory}
            </h2>
            <span className="text-xs font-mono text-stone-500">SECTION A</span>
          </div>

          {/* Lead Hero Article Box */}
          {heroArticle && (
            <article 
              onClick={() => onSelectBlog(heroArticle)}
              className="group cursor-pointer flex flex-col gap-4 border-b border-stone-300 dark:border-stone-700 pb-8"
            >
              {heroArticle.imageUrl && (
                <div className="overflow-hidden border border-stone-400 dark:border-stone-700 bg-stone-900">
                  <img
                    src={heroArticle.imageUrl}
                    alt={heroArticle.title}
                    className="w-full h-80 sm:h-96 object-cover editorial-img group-hover:scale-105 transition-transform duration-700"
                  />
                </div>
              )}
              
              <div className="flex items-center gap-3 text-xs font-sans text-stone-500 uppercase tracking-widest">
                <span className="bg-stone-900 text-white dark:bg-stone-100 dark:text-stone-900 px-2 py-0.5 font-bold">
                  {heroArticle.category || 'FEATURED'}
                </span>
                <span>•</span>
                <span>{heroArticle.date || 'TODAY'}</span>
                <span>•</span>
                <span>{heroArticle.readTime || '6 MIN READ'}</span>
              </div>

              <h3 className="text-3xl sm:text-4xl font-bold font-playfair leading-tight text-stone-900 dark:text-stone-100 group-hover:underline decoration-stone-500 decoration-1 underline-offset-4">
                {heroArticle.title}
              </h3>

              {heroArticle.dek && (
                <p className="text-stone-600 dark:text-stone-300 font-newsreader italic text-lg leading-relaxed">
                  "{heroArticle.dek}"
                </p>
              )}

              <div className="flex items-center justify-between pt-2 border-t border-stone-200 dark:border-stone-800 text-xs font-sans">
                <span className="font-semibold tracking-wider text-stone-900 dark:text-stone-200">
                  BY {heroArticle.author?.name || 'EDITORIAL BOARD'}
                </span>
                <span className="flex items-center gap-1 text-stone-500 group-hover:text-stone-900 dark:group-hover:text-stone-100 font-bold uppercase tracking-wider">
                  Read Dispatch <ArrowRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </article>
          )}

          {/* Secondary News Stream Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {secondaryArticles.slice(0, 4).map((blog) => (
              <article
                key={blog.id}
                onClick={() => onSelectBlog(blog)}
                className="group cursor-pointer flex flex-col justify-between border border-stone-300 dark:border-stone-800 p-4 bg-stone-50/50 dark:bg-stone-900/40 hover:border-stone-900 dark:hover:border-stone-100 transition"
              >
                <div>
                  {blog.imageUrl && (
                    <div className="overflow-hidden border border-stone-300 dark:border-stone-700 mb-3 h-40">
                      <img
                        src={blog.imageUrl}
                        alt={blog.title}
                        className="w-full h-full object-cover editorial-img group-hover:scale-105 transition duration-500"
                      />
                    </div>
                  )}
                  <span className="text-[10px] font-bold tracking-widest text-amber-700 dark:text-amber-400 uppercase">
                    {blog.category || 'ARTICLE'}
                  </span>
                  <h4 className="text-lg font-bold font-playfair leading-snug mt-1 text-stone-900 dark:text-stone-100 group-hover:underline">
                    {blog.title}
                  </h4>
                  <p className="text-xs text-stone-600 dark:text-stone-400 font-newsreader line-clamp-3 mt-2">
                    {blog.content}
                  </p>
                </div>
                
                <div className="mt-4 pt-2 border-t border-stone-200 dark:border-stone-800 flex justify-between items-center text-[11px] font-sans text-stone-500">
                  <span>BY {blog.author?.name || 'STAFF'}</span>
                  <span>{blog.readTime || '5 MIN'}</span>
                </div>
              </article>
            ))}
          </div>
        </div>

        {/* RIGHT COLUMN: Columnist Spotlight, Stats, Podcast & Quote Callouts (Span 5) */}
        <div className="lg:col-span-5 pl-0 lg:pl-8 pt-8 lg:pt-0 flex flex-col gap-8">
          
          {/* 1. FEATURED COLUMNIST Spotlight Box (Matching Tablet Image 1) */}
          <div className="border-2 border-stone-800 dark:border-stone-200 p-5 bg-stone-100/80 dark:bg-stone-900/60 relative">
            <div className="absolute -top-3 left-4 bg-red-800 text-stone-100 text-[10px] font-bold tracking-widest px-2.5 py-0.5 uppercase">
              FEATURED COLUMNIST
            </div>
            
            <div className="flex items-center gap-4 mt-2">
              <img
                src={columnist.avatar}
                alt={columnist.name}
                className="w-16 h-16 rounded-full border-2 border-stone-800 object-cover grayscale"
              />
              <div>
                <h4 className="text-lg font-bold font-playfair text-stone-900 dark:text-stone-100">
                  {columnist.name}
                </h4>
                <p className="text-xs text-stone-500 font-sans tracking-wide">
                  {columnist.role}
                </p>
              </div>
            </div>

            <p className="text-xs font-newsreader italic text-stone-600 dark:text-stone-300 mt-3 border-t border-stone-300 dark:border-stone-700 pt-2 leading-relaxed">
              "{columnist.bio}"
            </p>
          </div>

          {/* 2. "LISTEN TO THE DISPATCH" Podcast Player Widget (Matching Reference 1) */}
          <div className="bg-stone-900 text-stone-100 p-5 border border-stone-800 shadow-lg">
            <div className="flex items-center justify-between text-xs font-mono tracking-widest text-amber-400 border-b border-stone-800 pb-2 mb-3">
              <span className="flex items-center gap-2">
                <Volume2 className="w-4 h-4 animate-pulse" /> LISTEN TO TABLET
              </span>
              <span>EPISODE 196</span>
            </div>

            <h5 className="font-playfair font-bold text-base text-stone-100">
              {podcast.title}
            </h5>
            <p className="text-xs font-newsreader italic text-stone-400 mt-1 line-clamp-2">
              {podcast.subtitle}
            </p>

            <div className="mt-4 flex items-center justify-between bg-stone-800 p-3 rounded">
              <button
                onClick={() => setIsPlayingPodcast(!isPlayingPodcast)}
                className="w-10 h-10 rounded-full bg-amber-500 hover:bg-amber-400 text-stone-950 flex items-center justify-center transition cursor-pointer shadow"
              >
                {isPlayingPodcast ? <Pause className="w-5 h-5 fill-current" /> : <Play className="w-5 h-5 fill-current ml-0.5" />}
              </button>

              <div className="flex-1 mx-3">
                <div className="h-1.5 bg-stone-700 rounded-full overflow-hidden">
                  <div
                    className={`h-full bg-amber-400 transition-all ${isPlayingPodcast ? 'w-2/3 animate-pulse' : 'w-1/4'}`}
                  ></div>
                </div>
                <div className="flex justify-between text-[10px] font-mono text-stone-400 mt-1">
                  <span>{isPlayingPodcast ? '14:20' : '00:00'}</span>
                  <span>{podcast.duration}</span>
                </div>
              </div>
            </div>
          </div>

          {/* 3. IN NUMBERS & STAT CALLOUT Box (Matching Reference 1) */}
          <div className="border border-stone-400 dark:border-stone-700 p-6 text-center bg-stone-200/50 dark:bg-stone-900/30">
            <span className="text-xs font-mono tracking-widest text-stone-500 uppercase">DATABASE RECORDS</span>
            <div className="text-5xl font-black font-syne text-stone-900 dark:text-stone-100 my-2">
              {blogs.length.toLocaleString()}
            </div>
            <p className="text-xs font-newsreader text-stone-600 dark:text-stone-400 uppercase tracking-wider">
              Total Published Dispatches & Essays
            </p>
          </div>

          {/* 4. LOST WISDOM QUOTE CALLOUT (Matching Reference 1) */}
          <div className="border-l-4 border-stone-800 dark:border-stone-200 pl-4 py-2 my-2">
            <Quote className="w-5 h-5 text-stone-400 mb-1" />
            <p className="text-sm font-newsreader italic text-stone-800 dark:text-stone-200 leading-relaxed">
              "For centuries the therapeutic effects of sunlight were lost to modern medicine until an accidental discovery made by an English nurse in 1908."
            </p>
            <span className="text-[11px] font-mono text-stone-500 uppercase tracking-widest mt-2 block">
              — NORMAN DODGE • THE BRAIN'S WAY OF HEALING
            </span>
          </div>

          {/* 5. Remaining Secondary Stories List */}
          <div className="flex flex-col divide-y divide-stone-300 dark:divide-stone-700 border-t border-b border-stone-300 dark:border-stone-700 py-2">
            <h4 className="text-xs font-bold tracking-widest uppercase text-stone-500 py-2">
              MORE FROM THE DISPATCH
            </h4>
            {secondaryArticles.slice(4).map((blog) => (
              <div
                key={blog.id}
                onClick={() => onSelectBlog(blog)}
                className="py-3 group cursor-pointer"
              >
                <span className="text-[10px] font-mono text-stone-400 uppercase">{blog.category}</span>
                <h5 className="font-playfair text-base font-bold text-stone-900 dark:text-stone-100 group-hover:underline">
                  {blog.title}
                </h5>
                <span className="text-[11px] font-sans text-stone-500">BY {blog.author?.name || 'ANONYMOUS'}</span>
              </div>
            ))}
          </div>

        </div>

      </div>
    </div>
  );
};
