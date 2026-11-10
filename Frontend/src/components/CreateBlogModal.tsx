import React, { useState } from 'react';
import { X, AlertCircle } from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';
import { api, isAuthenticated, getUserEmail } from '../config/api';
import { readApiError } from '../utils/errors';

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
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const authed = isAuthenticated();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!authed) {
      setErrorMsg('Authentication required. Sign in to publish your story.');
      return;
    }

    if (!title.trim() || !content.trim()) {
      setErrorMsg('A story needs both a headline and a body.');
      return;
    }

    if (title.trim().length > 200) {
      setErrorMsg('Headlines run 200 characters at most on this paper.');
      return;
    }

    setLoading(true);
    setErrorMsg(null);

    try {
      const response = await api.post('/api/v1/blog', {
        title: title.trim(),
        content: content.trim(),
      });

      if (response.data?.id) {
        onSuccess();
        onClose();
        // Take the contributor straight to their story on the record page.
        navigate(`/blog/${response.data.id}`);
      } else {
        setErrorMsg('The presses accepted the story but returned no record number. Reload the front page to check.');
      }
    } catch (err) {
      const status = (err as { response?: { status?: number } } | undefined)
        ?.response?.status;

      if (status === 401 || status === 403) {
        setErrorMsg(`Your authorization lapsed (${status}). Sign in again, then retry.`);
      } else {
        setErrorMsg(
          readApiError(err, 'Failed to submit the story to the backend.')
        );
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 overflow-y-auto bg-ink/60 flex justify-center p-4 sm:p-6"
      onClick={onClose}
    >
      <div
        className="surface-panel w-full max-w-2xl h-fit border-2 border-ink shadow-[8px_8px_0_0_rgba(27,23,16,0.35)] relative my-auto"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
      >
        {/* letterhead */}
        <div className="flex justify-between items-start border-b-2 border-rule pb-4 mb-6">
          <div>
            <span className="label-caps text-faded text-sm">
              the medium — contributor sheet
            </span>
            <h2 className="font-headline text-3xl font-bold mt-1">
              Write a story
            </h2>
          </div>
          <button
            onClick={onClose}
            aria-label="Close"
            className="p-1.5 cursor-pointer text-faded hover:text-ink transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {errorMsg && (
          <div className="mb-5 flex items-start gap-2 border border-oxblood/60 bg-oxblood/5 px-4 py-3 text-sm text-oxblood">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
            <span>{errorMsg}</span>
          </div>
        )}

        {!authed ? (
          <div className="border border-rule bg-paper px-6 py-10 text-center">
            <p className="label-caps text-faded">notice to writers</p>
            <h3 className="font-headline text-2xl font-bold mt-2 mb-3">
              Sign in to publish
            </h3>
            <p className="font-body text-faded mb-6 max-w-sm mx-auto">
              Only registered contributors can print stories in this paper.
              Registration takes under a minute.
            </p>
            <div className="flex justify-center gap-4">
              <Link
                to="/signin"
                className="label-caps bg-ink px-5 py-2.5 text-paper transition-opacity hover:opacity-85"
              >
                sign in
              </Link>
              <Link
                to="/signup"
                className="label-caps border border-ink px-5 py-2.5 text-ink transition-colors hover:bg-ink hover:text-paper"
              >
                become a contributor
              </Link>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            <p className="text-sm font-body italic text-faded">
              Filing as{' '}
              <span className="text-ink not-italic">{getUserEmail()}</span>
            </p>

            <div>
              <label htmlFor="story-title" className="label-caps text-sm text-faded">
                headline
              </label>
              <input
                id="story-title"
                type="text"
                required
                maxLength={200}
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Write it sharp — it runs at the top of the page"
                className="mt-2 w-full bg-transparent border-b-2 border-hair py-2.5 font-headline text-2xl font-semibold text-ink placeholder:text-faded/60 placeholder:italic placeholder:text-base placeholder:font-body placeholder:font-normal focus:border-ink transition-colors"
              />
            </div>

            <div>
              <label htmlFor="story-body" className="label-caps text-sm text-faded">
                the story
              </label>
              <textarea
                id="story-body"
                required
                rows={9}
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Begin at the beginning, and go on till you come to the end"
                className="mt-2 w-full bg-transparent border-y-2 border-hair py-3 font-body text-[1.08rem] leading-relaxed text-ink placeholder:text-faded/60 placeholder:italic focus:border-ink transition-colors resize-y"
              />
            </div>

            <div className="flex justify-end gap-3 pt-2 border-t border-hair">
              <button
                type="button"
                onClick={onClose}
                className="label-caps cursor-pointer border border-ink px-5 py-2.5 text-ink transition-colors hover:bg-paper-2"
              >
                discard
              </button>
              <button
                type="submit"
                disabled={loading}
                className="label-caps cursor-pointer bg-ink px-5 py-2.5 text-paper transition-opacity hover:opacity-85 disabled:opacity-50"
              >
                {loading ? 'setting type…' : 'send to print'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
