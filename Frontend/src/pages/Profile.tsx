import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  getToken,
  removeToken,
  getUserEmail,
  getAuthUserId,
  isAuthenticated,
  api,
} from '../config/api';
import { Masthead } from '../components/Masthead';
import { CreateBlogModal } from '../components/CreateBlogModal';
import type { Blog } from '../types/blog';
import { readTime, deck } from '../utils/text';

export const Profile: React.FC = () => {
  const navigate = useNavigate();
  const loggedIn = isAuthenticated();
  const token = getToken();
  const email = getUserEmail();
  const ownId = getAuthUserId();

  // Archive of the contributor's own stories, keyed by who+which-fetch so a
  // refresh simply moves the key and the view falls back to loading.
  const [archive, setArchive] = useState<{
    key: string;
    blogs: Blog[];
    offline: boolean;
  } | null>(null);
  const [reload, setReload] = useState(0);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  useEffect(() => {
    if (!loggedIn) return;
    const key = `${ownId}:${reload}`;
    let cancelled = false;

    api
      .get('/api/v1/blog/bulk', {
        headers: { Authorization: token! },
      })
      .then((response) => {
        if (cancelled) return;
        const list: Blog[] = Array.isArray(response.data?.blogs)
          ? response.data.blogs
          : [];
        setArchive({
          key,
          offline: false,
          blogs: list.filter((b) => ownId && b.authorId === ownId),
        });
      })
      .catch(() => {
        if (cancelled) return;
        setArchive({ key, offline: true, blogs: [] });
      });

    return () => {
      cancelled = true;
    };
  }, [loggedIn, ownId, reload, token]);

  const archiveKey = `${ownId}:${reload}`;
  const fetching = loggedIn && (archive === null || archive.key !== archiveKey);
  const offline = !fetching && (archive?.offline ?? false);
  const stories = !fetching ? (archive?.blogs ?? []) : [];

  const handleLogout = () => {
    removeToken();
    navigate('/');
  };

  return (
    <div className="min-h-screen flex flex-col surface-paper">
      <Masthead />

      <main className="flex-1 flex justify-center px-4 py-14">
        <div className="w-full max-w-2xl">
          <div className="border-2 border-ink bg-paper-2 shadow-[8px_8px_0_0_rgba(27,23,16,0.35)]">
            <div className="border-b-2 border-rule px-8 pt-8 pb-5 text-center">
              <span className="label-caps text-faded text-sm">
                the medium — press office
              </span>
              <h1 className="font-headline text-3xl font-bold mt-2">
                Contributor pass
              </h1>
            </div>

            <div className="px-8 py-8">
              {!loggedIn ? (
                <div className="text-center">
                  <p className="label-caps text-faded">notice to readers</p>
                  <h2 className="font-headline text-2xl font-bold mt-2 mb-3">
                    No pass in your pocket
                  </h2>
                  <p className="font-body text-faded mb-7">
                    You are not signed in. Show your pass to write and publish
                    stories in this paper.
                  </p>
                  <div className="flex flex-wrap justify-center gap-4">
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
                <div className="space-y-8">
                  {/* identity */}
                  <dl className="border border-rule divide-y divide-hair bg-paper">
                    <div className="flex justify-between items-center gap-4 px-5 py-3.5">
                      <dt className="label-caps text-sm text-faded shrink-0">
                        contributor
                      </dt>
                      <dd className="font-body text-base text-right break-all">
                        {email}
                      </dd>
                    </div>
                    <div className="flex justify-between items-center gap-4 px-5 py-3.5">
                      <dt className="label-caps text-sm text-faded shrink-0">
                        standing
                      </dt>
                      <dd className="font-body text-base text-forest text-right">
                        In good standing
                      </dd>
                    </div>
                    <div className="flex justify-between items-center gap-4 px-5 py-3.5">
                      <dt className="label-caps text-sm text-faded shrink-0">
                        stories filed
                      </dt>
                      <dd className="font-body text-base text-right">
                        {fetching ? '…' : offline ? '—' : stories.length}
                      </dd>
                    </div>
                  </dl>

                  {/* own stories, straight from the archive */}
                  <div>
                    <div className="flex items-baseline justify-between border-b-2 border-rule pb-2 mb-4">
                      <p className="label-caps">your stories</p>
                      <button
                        onClick={() => setReload((n) => n + 1)}
                        className="label-caps cursor-pointer text-faded hover:text-ink transition-colors text-sm"
                      >
                        refresh
                      </button>
                    </div>

                    {offline && (
                      <div className="border border-oxblood/60 bg-oxblood/5 px-4 py-3 text-sm text-oxblood font-body">
                        The presses are unreachable, so your desk is empty for
                        the moment.
                      </div>
                    )}

                    {fetching && (
                      <div className="space-y-3" aria-hidden="true">
                        <div className="h-5 w-10/12 skeleton-line" />
                        <div className="h-5 w-8/12 skeleton-line" />
                        <div className="h-5 w-9/12 skeleton-line" />
                      </div>
                    )}

                    {!fetching && !offline && stories.length === 0 && (
                      <div className="border border-rule bg-paper px-6 py-8 text-center">
                        <p className="font-body italic text-faded mb-4">
                          Nothing under your byline yet.
                        </p>
                        <button
                          onClick={() => setIsCreateModalOpen(true)}
                          className="label-caps cursor-pointer bg-ink px-5 py-2.5 text-paper transition-opacity hover:opacity-85"
                        >
                          write your first story
                        </button>
                      </div>
                    )}

                    {!fetching && !offline && stories.length > 0 && (
                      <div>
                        {stories.map((blog) => (
                          <article
                            key={blog.id}
                            className="border-b border-hair py-3"
                          >
                            <Link to={`/blog/${blog.id}`} className="group block">
                              <p className="mb-1 text-xs text-faded">
                                <span className="label-caps">
                                  report no. {blog.id}
                                </span>
                                <span className="mx-1.5">·</span>
                                {readTime(blog.content)}
                              </p>
                              <h3 className="font-headline text-xl font-bold leading-snug group-hover:underline decoration-hair decoration-2 underline-offset-4">
                                {blog.title}
                              </h3>
                              <p className="mt-1 font-body text-sm text-faded leading-relaxed">
                                {deck(blog.content, 96)}
                              </p>
                            </Link>
                          </article>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* token reference */}
                  <div>
                    <p className="label-caps text-sm text-faded mb-2">
                      your press pass (kept privately in this browser)
                    </p>
                    <div className="border border-rule bg-paper px-4 py-3 font-mono text-[11.5px] leading-relaxed text-faded break-all max-h-32 overflow-auto">
                      {token}
                    </div>
                    <p className="font-body italic text-sm text-faded mt-2">
                      This pass is attached to every story you file. Clearing
                      the browser storage forfeits it — sign in to get a new
                      one.
                    </p>
                  </div>

                  <div className="flex flex-wrap gap-4 pt-2 border-t border-hair">
                    <Link
                      to="/"
                      className="label-caps border border-ink px-5 py-2.5 text-ink transition-colors hover:bg-ink hover:text-paper"
                    >
                      back to the front page
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="label-caps cursor-pointer border border-oxblood px-5 py-2.5 text-oxblood transition-colors hover:bg-oxblood hover:text-paper"
                    >
                      surrender your pass
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      <CreateBlogModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSuccess={() => setReload((n) => n + 1)}
      />
    </div>
  );
};

export default Profile;
