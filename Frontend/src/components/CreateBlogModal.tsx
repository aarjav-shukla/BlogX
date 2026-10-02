import React, { useState } from 'react';
import { X, Send, AlertCircle, CheckCircle, LogIn, UserPlus, FileText } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { api, isAuthenticated, getUserEmail } from '../config/api';

interface CreateBlogModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const CreateBlogModal: React.FC<CreateBlogModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
}) => {
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState('NEWS');
  const [loading, setLoading] = useState(false);
  const [statusMsg, setStatusMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  if (!isOpen) return null;

  const isUserLoggedIn = isAuthenticated();
  const userEmail = getUserEmail();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isUserLoggedIn) {
      setStatusMsg({
        type: 'error',
        text: 'Authentication required. Please sign in to publish your article.',
      });
      return;
    }

    if (!title.trim() || !content.trim()) {
      setStatusMsg({ type: 'error', text: 'Please fill in both title and content.' });
      return;
    }

    if (title.trim().length > 200) {
      setStatusMsg({ type: 'error', text: 'Title must be 200 characters or fewer.' });
      return;
    }

    setLoading(true);
    setStatusMsg(null);

    try {
      // Automatic Authorization header added by axios interceptor in api.ts
      const response = await api.post('/api/v1/blog', { title: title.trim(), content: content.trim() });

      if (response.data?.id) {
        setStatusMsg({ type: 'success', text: `Dispatch published successfully! Post ID: ${response.data.id}` });
        setTitle('');
        setContent('');
        setTimeout(() => {
          onSuccess();
          onClose();
        }, 1200);
      } else {
        setStatusMsg({ type: 'error', text: 'Server responded, but failed to return post ID.' });
      }
    } catch (err: any) {
      console.error('Create blog error:', err);
      const errMsg = err.response?.data?.message || err.response?.data?.error || err.message || 'Failed to submit post to backend.';
      
      if (err.response?.status === 401 || err.response?.status === 403) {
        setStatusMsg({
          type: 'error',
          text: `Authorization Failed (${err.response?.status}): ${errMsg}. Please log in again.`,
        });
      } else {
        setStatusMsg({
          type: 'error',
          text: `Backend error: ${errMsg}`,
        });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-950/80 backdrop-blur-sm flex justify-center items-center p-4">
      <div 
        className="bg-newspaper text-stone-900 dark:text-stone-100 w-full max-w-2xl border-2 border-stone-900 dark:border-stone-200 shadow-2xl relative p-6 md:p-8"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="flex justify-between items-center border-b-2 border-stone-900 dark:border-stone-200 pb-4 mb-6">
          <div>
            <span className="text-[10px] font-mono tracking-widest text-amber-700 dark:text-amber-400 uppercase font-bold flex items-center gap-1.5">
              <FileText className="w-3.5 h-3.5" />
              DISPATCH AUTHORING STUDIO
            </span>
            <h2 className="text-2xl font-black font-playfair uppercase text-stone-900 dark:text-stone-100">
              COMPOSE NEW ARTICLE
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 hover:bg-stone-200 dark:hover:bg-stone-800 rounded transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Status Messages */}
        {statusMsg && (
          <div className={`p-3 text-xs font-mono mb-4 border flex items-center gap-2 ${
            statusMsg.type === 'success' 
              ? 'bg-emerald-100 text-emerald-900 border-emerald-400 dark:bg-emerald-950 dark:text-emerald-200' 
              : 'bg-red-100 text-red-900 border-red-400 dark:bg-red-950 dark:text-red-200'
          }`}>
            {statusMsg.type === 'success' ? <CheckCircle className="w-4 h-4 shrink-0" /> : <AlertCircle className="w-4 h-4 shrink-0" />}
            <span>{statusMsg.text}</span>
          </div>
        )}

        {!isUserLoggedIn ? (
          <div className="py-8 px-4 text-center border-2 border-dashed border-stone-300 dark:border-stone-700 bg-stone-100 dark:bg-stone-900/50">
            <AlertCircle className="w-10 h-10 mx-auto text-amber-600 dark:text-amber-400 mb-3" />
            <h3 className="text-lg font-bold font-playfair uppercase mb-1">Authorization Required</h3>
            <p className="text-xs text-stone-600 dark:text-stone-400 font-sans max-w-md mx-auto mb-6 leading-relaxed">
              You are currently browsing as a guest. To write and publish articles to the live API, please sign in or register an author account.
            </p>
            <div className="flex justify-center gap-4">
              <button
                onClick={() => { onClose(); navigate('/signin'); }}
                className="px-5 py-2.5 bg-stone-900 hover:bg-stone-800 text-white dark:bg-stone-100 dark:hover:bg-white dark:text-stone-900 text-xs font-mono font-bold uppercase tracking-wider flex items-center gap-2 transition cursor-pointer shadow-sm"
              >
                <LogIn className="w-4 h-4" />
                <span>Sign In</span>
              </button>
              <button
                onClick={() => { onClose(); navigate('/signup'); }}
                className="px-5 py-2.5 border-2 border-stone-900 dark:border-stone-100 hover:bg-stone-200 dark:hover:bg-stone-800 text-stone-900 dark:text-stone-100 text-xs font-mono font-bold uppercase tracking-wider flex items-center gap-2 transition cursor-pointer"
              >
                <UserPlus className="w-4 h-4" />
                <span>Register Account</span>
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4 font-sans text-xs">
            {/* Active Author info bar */}
            <div className="bg-stone-200 dark:bg-stone-800/60 p-2.5 border border-stone-300 dark:border-stone-700 flex justify-between items-center text-xs font-mono">
              <span className="text-stone-600 dark:text-stone-400">AUTHENTICATED AUTHOR:</span>
              <span className="font-bold text-stone-900 dark:text-stone-100">{userEmail}</span>
            </div>

            <div>
              <label className="block font-mono uppercase tracking-wider text-stone-600 dark:text-stone-400 mb-1">
                Category / Section:
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full bg-white dark:bg-stone-900 border border-stone-300 dark:border-stone-700 p-2 text-xs font-sans outline-none focus:border-stone-900 uppercase"
              >
                <option value="NEWS">NEWS</option>
                <option value="SCIENCE">SCIENCE</option>
                <option value="ART">ART</option>
                <option value="BELIEF">BELIEF</option>
                <option value="CULTURE">CULTURE</option>
                <option value="ESSAYS">ESSAYS</option>
              </select>
            </div>

            <div>
              <label className="block font-mono uppercase tracking-wider text-stone-600 dark:text-stone-400 mb-1">
                Article Headline / Title:
              </label>
              <input
                type="text"
                required
                maxLength={200}
                placeholder="Enter a compelling editorial title..."
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full bg-white dark:bg-stone-900 border border-stone-300 dark:border-stone-700 p-2.5 text-sm font-serif font-bold outline-none focus:border-stone-900 dark:focus:border-stone-100"
              />
            </div>

            <div>
              <label className="block font-mono uppercase tracking-wider text-stone-600 dark:text-stone-400 mb-1">
                Article Body Content:
              </label>
              <textarea
                required
                rows={6}
                placeholder="Write your article essay or dispatch here..."
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className="w-full bg-white dark:bg-stone-900 border border-stone-300 dark:border-stone-700 p-2.5 text-xs font-newsreader outline-none focus:border-stone-900 dark:focus:border-stone-100 leading-relaxed"
              />
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t border-stone-300 dark:border-stone-700">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 bg-stone-200 dark:bg-stone-800 text-stone-800 dark:text-stone-200 font-mono text-xs uppercase tracking-wider cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-5 py-2 bg-stone-900 text-white dark:bg-stone-100 dark:text-stone-900 font-mono text-xs uppercase tracking-wider font-bold flex items-center gap-2 hover:bg-stone-800 cursor-pointer disabled:opacity-50"
              >
                <Send className="w-3.5 h-3.5" />
                <span>{loading ? 'Publishing...' : 'Publish to API'}</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

