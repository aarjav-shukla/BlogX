import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Masthead } from '../components/Masthead';
import { CreateBlogModal } from '../components/CreateBlogModal';
import { api, getAuthHeader, getAuthUserId } from '../config/api';
import type { Blog } from '../types/blog';
import { deck, readTime, byline } from '../utils/text';

type PaperState = 'ready' | 'offline' | 'empty';

interface Paper {
  blogs: Blog[];
  status: PaperState;
  errorMsg: string | null;
}

const StoryLabel: React.FC<{ blog: Blog }> = ({ blog }) => (
  <span className="label-caps text-faded">
    report no. {blog.id}
    <span className="mx-1.5">·</span>
    {readTime(blog.content)}
    <span className="mx-1.5">·</span>
    {byline(blog.authorId, getAuthUserId())}
  </span>
);

const Skeleton = () => (
  <div className="mx-auto w-full max-w-6xl px-4 sm:px-6 py-10" aria-hidden="true">
    <div className="grid gap-10 lg:grid-cols-12">
      <div className="lg:col-span-8 space-y-5">
        <div className="h-3 w-40 skeleton-line" />
        <div className="h-12 w-11/12 skeleton-line" />
        <div className="h-12 w-8/12 skeleton-line" />
        <div className="space-y-3 pt-4">
          <div className="h-4 w-full skeleton-line" />
          <div className="h-4 w-full skeleton-line" />
          <div className="h-4 w-9/12 skeleton-line" />
        </div>
      </div>
      <div className="lg:col-span-4 lg:border-l lg:border-hair lg:pl-8 space-y-6">
        {[0, 1, 2, 3].map((i) => (
          <div key={i} className="space-y-2 border-b border-hair pb-4">
            <div className="h-3 w-24 skeleton-line" />
            <div className="h-5 w-10/12 skeleton-line" />
          </div>
        ))}
      </div>
    </div>
  </div>
);

export const Home: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');

  // The only source of stories is the backend. Nothing is invented here:
  // if the presses are unreachable, the paper says so instead of printing filler.
  const [paper, setPaper] = useState<Paper | null>(null);
  const [reload, setReload] = useState(0);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  useEffect(() => {
    let cancelled = false;

    api
      .get('/api/v1/blog/bulk', { headers: getAuthHeader() })
      .then((response) => {
        if (cancelled) return;
        const list: Blog[] = Array.isArray(response.data?.blogs)
          ? response.data.blogs
          : [];
        setPaper({
          blogs: list,
          status: list.length === 0 ? 'empty' : 'ready',
          errorMsg: null,
        });
      })
      .catch(() => {
        if (cancelled) return;
        setPaper({
          blogs: [],
          status: 'offline',
          errorMsg:
            'The presses are unreachable right now. Check that the backend is running, then try again.',
        });
      });

    return () => {
      cancelled = true;
    };
  }, [reload]);

  const status: PaperState | 'loading' = paper?.status ?? 'loading';
  const blogs = paper?.blogs ?? [];
  const errorMsg = paper?.errorMsg ?? null;

  const refreshPaper = () => {
    setPaper(null);
    setReload((n) => n + 1);
  };

  const isSearching = searchQuery.trim() !== '';
  const q = searchQuery.trim().toLowerCase();
  const results = blogs.filter(
    (b) =>
      b.title.toLowerCase().includes(q) ||
      b.content.toLowerCase().includes(q)
  );

  const [lead, ...rest] = blogs;
  const secondary = rest.slice(0, 5);
  const columns = rest.slice(5);

  return (
    <div className="min-h-screen flex flex-col surface-paper">
      <Masthead
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        onWrite={() => setIsCreateModalOpen(true)}
      />

      <main className="flex-1 w-full">
        {status === 'loading' && <Skeleton />}

        {status === 'offline' && (
          <div className="mx-auto w-full max-w-6xl px-4 sm:px-6 py-20">
            <div className="mx-auto max-w-xl border border-rule bg-paper-2 px-8 py-10 text-center">
              <p className="label-caps text-faded">notice to readers</p>
              <h2 className="font-headline text-3xl font-bold mt-2 mb-3">
                The presses are down
              </h2>
              <p className="font-body text-faded mb-7">{errorMsg}</p>
              <button
                onClick={refreshPaper}
                className="label-caps cursor-pointer bg-ink px-5 py-2.5 text-paper transition-opacity hover:opacity-85"
              >
                try again
              </button>
            </div>
          </div>
        )}

        {status === 'empty' && (
          <div className="mx-auto w-full max-w-6xl px-4 sm:px-6 py-20">
            <div className="mx-auto max-w-xl border border-rule bg-paper-2 px-8 py-10 text-center">
              <p className="label-caps text-faded">notice to readers</p>
              <h2 className="font-headline text-3xl font-bold mt-2 mb-3">
                This edition is blank
              </h2>
              <p className="font-body text-faded mb-7">
                No stories have been published yet. The first line of this paper
                is still unwritten — it could be yours.
              </p>
              <button
                onClick={() => setIsCreateModalOpen(true)}
                className="label-caps cursor-pointer bg-ink px-5 py-2.5 text-paper transition-opacity hover:opacity-85"
              >
                write the first story
              </button>
            </div>
          </div>
        )}

        {status === 'ready' && (
          <div className="mx-auto w-full max-w-6xl px-4 sm:px-6 py-8 sm:py-10">
            {isSearching ? (
              <>
                <div className="border-b-2 border-rule pb-3 mb-8 flex items-baseline justify-between gap-4">
                  <p className="font-headline text-2xl font-semibold italic">
                    {results.length === 0
                      ? `Nothing in the paper matches “${searchQuery}”`
                      : `${results.length} ${
                          results.length === 1 ? 'story' : 'stories'
                        } matching “${searchQuery}”`}
                  </p>
                  <button
                    onClick={() => setSearchQuery('')}
                    className="label-caps cursor-pointer text-faded hover:text-ink transition-colors shrink-0"
                  >
                    clear
                  </button>
                </div>

                <div className="news-columns">
                  {results.map((blog) => (
                    <article
                      key={blog.id}
                      className="border-t border-ink pt-3 mb-8 inline-block w-full"
                    >
                      <p className="mb-1">
                        <StoryLabel blog={blog} />
                      </p>
                      <Link to={`/blog/${blog.id}`}>
                        <h3 className="font-headline text-2xl font-bold leading-snug hover:underline decoration-hair decoration-2 underline-offset-4">
                          {blog.title}
                        </h3>
                      </Link>
                      <p className="mt-2 text-[15px] leading-relaxed text-ink/90">
                        {deck(blog.content, 120)}
                      </p>
                    </article>
                  ))}
                  {results.length === 0 && (
                    <p className="font-body italic text-faded">
                      The archive holds only what has been written. Try a
                      different phrase, or write the missing piece yourself.
                    </p>
                  )}
                </div>
              </>
            ) : (
              <>
                {/* lead story */}
                <div className="grid gap-10 lg:grid-cols-12 lg:gap-12">
                  {lead && (
                    <article className="lg:col-span-8">
                      <p className="mb-3">
                        <StoryLabel blog={lead} />
                      </p>
                      <Link to={`/blog/${lead.id}`}>
                        <h2 className="font-headline font-bold text-[clamp(2.5rem,6vw,4.25rem)] leading-[1.02] tracking-tight text-balance hover:underline decoration-hair decoration-2 underline-offset-8">
                          {lead.title}
                        </h2>
                      </Link>
                      <p className="mt-5 font-body dropcap text-[1.2rem] leading-relaxed text-ink/95 text-pretty">
                        {deck(lead.content, 480)}
                      </p>
                      <Link
                        to={`/blog/${lead.id}`}
                        className="label-caps inline-block mt-5 text-ink underline decoration-hair decoration-2 underline-offset-4 hover:decoration-ink transition-colors"
                      >
                        continue reading
                      </Link>
                    </article>
                  )}

                  <aside className="lg:col-span-4 lg:border-l lg:border-hair lg:pl-10">
                    <p className="label-caps border-b-2 border-rule pb-2 mb-1">
                      latest dispatches
                    </p>
                    {secondary.map((blog) => (
                      <article key={blog.id} className="border-b border-hair py-3">
                        <Link to={`/blog/${blog.id}`} className="group block">
                          <p className="mb-1 text-xs text-faded">
                            <span className="label-caps">no. {blog.id}</span>
                            <span className="mx-1.5">·</span>
                            {readTime(blog.content)}
                          </p>
                          <h3 className="font-headline text-xl font-bold leading-snug group-hover:underline decoration-hair decoration-2 underline-offset-4">
                            {blog.title}
                          </h3>
                        </Link>
                      </article>
                    ))}
                  </aside>
                </div>

                {/* the rest of the edition, sorted into classic newspaper columns */}
                {columns.length > 0 && (
                  <section className="mt-12">
                    <div className="border-t-[3px] border-ink pt-1" />
                    <div className="border-b-2 border-rule pb-2 mb-8 flex items-baseline justify-between">
                      <p className="label-caps">more from the paper</p>
                      <p className="text-xs text-faded font-body">
                        {blogs.length} story{blogs.length === 1 ? '' : 's'} in
                        this edition
                      </p>
                    </div>

                    <div className="news-columns">
                      {columns.map((blog) => (
                        <article
                          key={blog.id}
                          className="inline-block w-full border-t border-hair pt-3 pb-9"
                        >
                          <p className="mb-1">
                            <StoryLabel blog={blog} />
                          </p>
                          <Link to={`/blog/${blog.id}`} className="group block">
                            <h3 className="font-headline text-[1.65rem] font-bold leading-snug group-hover:underline decoration-hair decoration-2 underline-offset-4">
                              {blog.title}
                            </h3>
                          </Link>
                          <p className="mt-2 font-body text-[15.5px] leading-relaxed text-ink/95">
                            {deck(blog.content, 112)}
                          </p>
                        </article>
                      ))}
                    </div>
                  </section>
                )}
              </>
            )}
          </div>
        )}
      </main>

      <footer className="border-t-[3px] border-ink">
        <div className="rule-double" />
        <div className="mx-auto w-full max-w-6xl px-4 sm:px-6 py-10 text-center">
          <p className="font-masthead text-3xl text-ink">The Medium</p>
          <p className="mt-3 text-sm font-body italic text-faded">
            An open journal — every story on this paper was written by one of
            its readers.
          </p>
          <nav className="mt-5 flex items-center justify-center gap-6 text-sm">
            <Link to="/" className="label-caps text-faded hover:text-ink transition-colors">
              front page
            </Link>
            <Link to="/profile" className="label-caps text-faded hover:text-ink transition-colors">
              your profile
            </Link>
          </nav>
        </div>
      </footer>

      <CreateBlogModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSuccess={refreshPaper}
      />
    </div>
  );
};
