import React, { useState } from 'react';
import { LayoutGrid, Newspaper, Search, PlusCircle, Sun, Moon, Radio, RefreshCw, CheckCircle2 } from 'lucide-react';

interface NavbarProps {
  viewMode: 'gazette' | 'fyrre';
  setViewMode: (mode: 'gazette' | 'fyrre') => void;
  darkMode: boolean;
  setDarkMode: (val: boolean) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  onOpenCreateModal: () => void;
  isConnectedToBackend: boolean;
  onRefreshBackend: () => void;
  totalArticlesCount: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  viewMode,
  setViewMode,
  darkMode,
  setDarkMode,
  searchQuery,
  setSearchQuery,
  onOpenCreateModal,
  isConnectedToBackend,
  onRefreshBackend,
  totalArticlesCount
}) => {
  const [showSearchInput, setShowSearchInput] = useState(false);

  const currentDate = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  }).toUpperCase();

  return (
    <header className="border-b-2 border-stone-800 dark:border-stone-200 transition-colors">
      {/* Top Edition & Ticker Bar */}
      <div className="bg-stone-900 text-stone-200 text-xs py-1.5 px-4 flex flex-wrap justify-between items-center tracking-widest font-sans border-b border-stone-700">
        <div className="flex items-center gap-3">
          <span className="inline-flex items-center gap-1.5 text-amber-400 font-medium">
            <Radio className="w-3.5 h-3.5 animate-pulse" /> LIVE DISPATCH
          </span>
          <span className="hidden sm:inline text-stone-400">•</span>
          <span className="hidden sm:inline font-mono">{currentDate}</span>
          <span className="hidden md:inline text-stone-400">•</span>
          <span className="hidden md:inline text-stone-400">VOL. CXXVI NO. 402</span>
        </div>

        <div className="flex items-center gap-3 text-stone-300">
          {/* API Backend status indicator */}
          <button 
            onClick={onRefreshBackend}
            title="Click to re-check backend connection (http://localhost:8787)"
            className="flex items-center gap-1.5 px-2 py-0.5 rounded bg-stone-800 hover:bg-stone-700 transition cursor-pointer text-[11px]"
          >
            {isConnectedToBackend ? (
              <>
                <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                <span className="text-emerald-300 font-medium">API Active ({totalArticlesCount})</span>
              </>
            ) : (
              <>
                <span className="w-2 h-2 rounded-full bg-amber-500 animate-ping"></span>
                <span className="text-amber-300">Demo Data (Backend Offline)</span>
              </>
            )}
            <RefreshCw className="w-3 h-3 text-stone-400 ml-1 hover:rotate-180 transition-transform duration-500" />
          </button>

          {/* Theme Switcher */}
          <button
            onClick={() => setDarkMode(!darkMode)}
            className="p-1 hover:text-amber-400 transition"
            title="Toggle Light Newspaper / Dark Obsidian mode"
          >
            {darkMode ? <Sun className="w-3.5 h-3.5" /> : <Moon className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>

      {/* Main Editorial Masthead */}
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="flex flex-col md:flex-row justify-between items-center border-b-2 border-stone-800 dark:border-stone-300 pb-6 gap-4">
          
          {/* Left Metadata info */}
          <div className="hidden lg:flex flex-col text-left font-serif text-xs text-stone-600 dark:text-stone-400 border-l-2 border-stone-800 dark:border-stone-300 pl-3">
            <span className="font-bold tracking-widest uppercase">The Daily Medium</span>
            <span>Founded MMXIV</span>
            <span>Edition: International</span>
          </div>

          {/* Main Masthead Header Title */}
          <div className="text-center">
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-black font-cinzel tracking-tight uppercase text-stone-900 dark:text-stone-100 drop-shadow-sm">
              {viewMode === 'gazette' ? 'THE GAZETTE' : 'FYRRE MAGAZINE'}
            </h1>
            <p className="text-xs md:text-sm font-newsreader italic text-stone-600 dark:text-stone-400 mt-1 tracking-widest uppercase">
              {viewMode === 'gazette' 
                ? 'A Journal of Culture, Science, Arts & Contemporary Thought' 
                : 'Monochrome Art, Culture & Independent Literary Journalism'}
            </p>
          </div>

          {/* Right Action buttons */}
          <div className="flex items-center gap-2">
            <button
              onClick={onOpenCreateModal}
              className="flex items-center gap-1.5 bg-stone-900 hover:bg-stone-800 dark:bg-stone-100 dark:hover:bg-white text-stone-100 dark:text-stone-900 px-3.5 py-2 text-xs font-semibold uppercase tracking-wider transition border border-stone-800 shadow-sm cursor-pointer"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Write Post</span>
            </button>
          </div>
        </div>

        {/* View Mode & Filter Navigation Bar */}
        <div className="flex flex-wrap justify-between items-center pt-4 pb-2 text-xs uppercase tracking-widest font-sans font-semibold border-b border-stone-400 dark:border-stone-700 gap-4">
          
          {/* Layout Toggle Buttons inspired by user reference images */}
          <div className="flex items-center gap-1 bg-stone-200 dark:bg-stone-800 p-1 rounded-sm border border-stone-400 dark:border-stone-700">
            <button
              onClick={() => setViewMode('gazette')}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs transition cursor-pointer ${
                viewMode === 'gazette'
                  ? 'bg-stone-900 text-white dark:bg-stone-100 dark:text-stone-900 font-bold shadow-sm'
                  : 'text-stone-700 dark:text-stone-300 hover:text-stone-900'
              }`}
              title="Switch to Newspaper Layout (Reference 1)"
            >
              <Newspaper className="w-3.5 h-3.5" />
              <span>Gazette Newspaper</span>
            </button>
            <button
              onClick={() => setViewMode('fyrre')}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs transition cursor-pointer ${
                viewMode === 'fyrre'
                  ? 'bg-stone-900 text-white dark:bg-stone-100 dark:text-stone-900 font-bold shadow-sm'
                  : 'text-stone-700 dark:text-stone-300 hover:text-stone-900'
              }`}
              title="Switch to Fyrre Grid Layout (Reference 2)"
            >
              <LayoutGrid className="w-3.5 h-3.5" />
              <span>Fyrre Magazine</span>
            </button>
          </div>

          {/* Search bar toggle */}
          <div className="relative flex items-center">
            {showSearchInput ? (
              <div className="flex items-center border border-stone-800 dark:border-stone-200 bg-white dark:bg-stone-900 px-2 py-1">
                <Search className="w-3.5 h-3.5 text-stone-500 mr-2" />
                <input
                  type="text"
                  placeholder="Search articles..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  autoFocus
                  className="bg-transparent text-xs text-stone-900 dark:text-stone-100 outline-none w-44 font-sans uppercase placeholder:lowercase"
                />
                <button
                  onClick={() => { setShowSearchInput(false); setSearchQuery(''); }}
                  className="text-stone-400 hover:text-stone-700 ml-1 text-xs"
                >
                  ✕
                </button>
              </div>
            ) : (
              <button
                onClick={() => setShowSearchInput(true)}
                className="flex items-center gap-1.5 px-3 py-1.5 text-stone-800 dark:text-stone-200 hover:underline cursor-pointer"
              >
                <Search className="w-3.5 h-3.5" />
                <span>Search Archives</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
