import React, { useState } from 'react';
import type { Blog } from '../types/blog';
import { X, Clock, Share2, Type, ArrowLeft } from 'lucide-react';

interface ArticleModalProps {
  blog: Blog | null;
  onClose: () => void;
}

export const ArticleModal: React.FC<ArticleModalProps> = ({ blog, onClose }) => {
  const [fontSize, setFontSize] = useState<'sm' | 'base' | 'lg' | 'xl'>('lg');
  const [useSerifFont, setUseSerifFont] = useState(true);
  const [copied, setCopied] = useState(false);

  if (!blog) return null;

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const getFontSizeClass = () => {
    switch (fontSize) {
      case 'sm': return 'text-base';
      case 'base': return 'text-lg';
      case 'lg': return 'text-xl';
      case 'xl': return 'text-2xl';
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-950/80 backdrop-blur-sm flex justify-center p-2 sm:p-4 md:p-6 animate-fadeIn">
      <div 
        className="bg-newspaper text-stone-900 dark:text-stone-100 w-full max-w-4xl min-h-[90vh] border-2 border-stone-900 dark:border-stone-200 shadow-2xl relative flex flex-col justify-between my-auto overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Sticky Header */}
        <div className="sticky top-0 bg-stone-100/90 dark:bg-stone-900/90 backdrop-blur border-b border-stone-300 dark:border-stone-700 px-6 py-3 flex items-center justify-between z-20">
          <button
            onClick={onClose}
            className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-stone-700 dark:text-stone-300 hover:text-stone-950 dark:hover:text-white cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Gazette</span>
          </button>

          {/* Reader controls */}
          <div className="flex items-center gap-3">
            <div className="flex items-center border border-stone-300 dark:border-stone-700 rounded p-1 text-xs">
              <Type className="w-3.5 h-3.5 mr-1 text-stone-500" />
              <button
                onClick={() => setUseSerifFont(!useSerifFont)}
                className="px-1.5 py-0.5 font-serif hover:bg-stone-200 dark:hover:bg-stone-800 cursor-pointer"
                title="Toggle Serif / Sans Font"
              >
                {useSerifFont ? 'Serif' : 'Sans'}
              </button>
              <span className="text-stone-300 dark:text-stone-700 mx-1">|</span>
              <button
                onClick={() => setFontSize(fontSize === 'sm' ? 'base' : fontSize === 'base' ? 'lg' : fontSize === 'lg' ? 'xl' : 'sm')}
                className="px-1.5 py-0.5 hover:bg-stone-200 dark:hover:bg-stone-800 cursor-pointer font-bold"
                title="Change font size"
              >
                A+
              </button>
            </div>

            <button
              onClick={handleShare}
              className="p-1.5 hover:bg-stone-200 dark:hover:bg-stone-800 rounded transition cursor-pointer text-xs flex items-center gap-1"
              title="Share article link"
            >
              <Share2 className="w-4 h-4" />
              <span className="hidden sm:inline">{copied ? 'Copied!' : 'Share'}</span>
            </button>

            <button
              onClick={onClose}
              className="p-1.5 hover:bg-stone-200 dark:hover:bg-stone-800 rounded transition cursor-pointer text-stone-600 dark:text-stone-400 hover:text-stone-900"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Main Article Body */}
        <div className="px-6 md:px-16 py-10 max-w-3xl mx-auto w-full">
          
          {/* Category Pill & Date */}
          <div className="flex items-center gap-3 text-xs font-mono text-stone-500 uppercase tracking-widest mb-4">
            <span className="bg-stone-900 text-stone-100 dark:bg-stone-100 dark:text-stone-900 px-2.5 py-0.5 font-bold">
              {blog.category || 'EDITORIAL'}
            </span>
            <span>•</span>
            <span>{blog.date || 'OCTOBER 2026'}</span>
            <span>•</span>
            <span className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5" />
              {blog.readTime || '6 MIN READ'}
            </span>
          </div>

          {/* Main Headline */}
          <h1 className="text-3xl md:text-5xl font-extrabold font-playfair leading-tight text-stone-900 dark:text-stone-100 mb-6">
            {blog.title}
          </h1>

          {/* Dek / Subtitle */}
          {blog.dek && (
            <p className="text-xl md:text-2xl font-newsreader italic text-stone-600 dark:text-stone-300 leading-relaxed mb-8 border-l-2 border-stone-800 dark:border-stone-200 pl-4">
              "{blog.dek}"
            </p>
          )}

          {/* Author Header Bar */}
          <div className="flex items-center gap-4 py-4 border-t border-b border-stone-300 dark:border-stone-700 mb-8">
            <img
              src={blog.author?.avatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80"}
              alt={blog.author?.name || "Author"}
              className="w-12 h-12 rounded-full border border-stone-400 object-cover grayscale"
            />
            <div>
              <div className="font-bold text-sm font-sans tracking-wide text-stone-900 dark:text-stone-100 uppercase">
                BY {blog.author?.name || 'EDITORIAL BOARD'}
              </div>
              <div className="text-xs text-stone-500 font-sans">
                {blog.author?.role || 'Staff Writer & Editorial Fellow'}
              </div>
            </div>
          </div>

          {/* Main Cover Image */}
          {blog.imageUrl && (
            <div className="mb-10 border border-stone-400 dark:border-stone-700 bg-stone-900">
              <img
                src={blog.imageUrl}
                alt={blog.title}
                className="w-full max-h-[450px] object-cover editorial-img"
              />
              <div className="p-2 bg-stone-100 dark:bg-stone-900 text-[11px] font-mono text-stone-500 border-t border-stone-300 dark:border-stone-800">
                ARCHIVAL PHOTOGRAPHY • DISPATCH ISSUE #{blog.id}
              </div>
            </div>
          )}

          {/* Full Text Content with Drop-Cap Styling */}
          <div 
            className={`prose dark:prose-invert max-w-none ${getFontSizeClass()} ${
              useSerifFont ? 'font-newsreader' : 'font-sans'
            } leading-relaxed text-stone-800 dark:text-stone-200 space-y-6`}
          >
            <p className="first-letter:float-left first-letter:text-6xl first-letter:font-bold first-letter:font-playfair first-letter:mr-3 first-letter:text-stone-900 dark:first-letter:text-stone-100 first-letter:leading-none">
              {blog.content}
            </p>

            <blockquote className="border-l-4 border-stone-900 dark:border-stone-100 pl-6 py-2 my-8 italic font-playfair text-2xl text-stone-900 dark:text-stone-100">
              "To preserve memory through eras of light and noise requires an unwavering commitment to truth, craftsmanship, and civic courage."
            </blockquote>

            <p>
              In our contemporary era, the sheer velocity of digital transmission often threatens to overshadow depth, nuance, and structural reflection. As writers and editors, our task remains unchanged: to curate ideas that endure beyond the ephemeral news cycle.
            </p>
          </div>

          {/* Footer signature */}
          <div className="mt-12 pt-6 border-t-2 border-double-thick flex justify-between items-center text-xs font-mono text-stone-500 uppercase">
            <span>END OF DISPATCH</span>
            <span>PUBLISHED IN THE GAZETTE</span>
          </div>

        </div>
      </div>
    </div>
  );
};
