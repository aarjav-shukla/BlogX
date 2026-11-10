import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Masthead } from '../components/Masthead';
import { api, getAuthHeader, getAuthUserId } from '../config/api';
import type { Blog } from '../types/blog';
import { readTime, byline } from '../utils/text';

interface StoryResult {
  id: string | undefined;
  blog: Blog | null;
  error: string | null;
}

export const ArticlePage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [result, setResult] = useState<StoryResult | null>(null);

  useEffect(() => {
    let cancelled = false;

    api
      .get(`/api/v1/blog/${id}`, { headers: getAuthHeader() })
      .then((response) => {
        if (cancelled) return;
        if (response.data?.blog) {
          setResult({ id, blog: response.data.blog as Blog, error: null });
        } else {
          setResult({ id, blog: null, error: 'No story exists at this number in the archive.' });
        }
      })
      .catch(() => {
        if (cancelled) return;
        setResult({
          id,
          blog: null,
          error:
            'This story could not be pulled from the presses. It may have been removed, or the backend may be offline.',
        });
      });

    return () => {
      cancelled = true;
    };
  }, [id]);

  const fetching = result === null || result.id !== id;
  const blog = fetching ? null : result.blog;
  const errorMsg = fetching ? null : result.error;

  const paragraphs = blog
    ? blog.content
        .split(/\n{1,}/)
        .map((p) => p.trim())
        .filter(Boolean)
    : [];

  return (
    <div className="min-h-screen flex flex-col surface-paper">
      <Masthead />

      <main className="flex-1 w-full">
        <div className="mx-auto max-w-[52rem] px-4 sm:px-6 py-10 sm:py-14">
          <Link
            to="/"
            className="label-caps text-faded hover:text-ink transition-colors"
          >
            ← back to the front page
          </Link>

          {fetching && (
            <div className="mt-12 space-y-5" aria-hidden="true">
              <div className="h-4 w-52 skeleton-line" />
              <div className="h-14 w-full skeleton-line" />
              <div className="h-14 w-9/12 skeleton-line" />
              <div className="h-4 w-full skeleton-line mt-8" />
              <div className="h-4 w-full skeleton-line" />
              <div className="h-4 w-10/12 skeleton-line" />
              <div className="h-4 w-11/12 skeleton-line" />
            </div>
          )}

          {!fetching && errorMsg && (
            <div className="mt-12 border border-rule bg-paper-2 px-8 py-10 text-center">
              <p className="label-caps text-faded">notice to readers</p>
              <h2 className="font-headline text-3xl font-bold mt-2 mb-3">
                Story not found
              </h2>
              <p className="font-body text-faded">{errorMsg}</p>
            </div>
          )}

          {!fetching && blog && (
            <article className="mt-10">
              {/* kicker line, as in a printed edition */}
              <div className="flex flex-wrap items-center gap-x-3 gap-y-1 border-b border-hair pb-3 text-sm text-faded">
                <span className="label-caps text-ink">report no. {blog.id}</span>
                <span className="text-hair">|</span>
                <span className="label-caps">{readTime(blog.content)}</span>
                <span className="text-hair">|</span>
                <span className="label-caps">{byline(blog.authorId, getAuthUserId())}</span>
              </div>

              <h1 className="font-headline font-bold tracking-tight text-[clamp(2.4rem,6vw,3.9rem)] leading-[1.04] text-balance mt-8">
                {blog.title}
              </h1>

              <div className="flex justify-between items-center mt-8 border-y-2 border-rule py-2 px-1">
                <span className="label-caps text-faded">The Medium</span>
                <span className="font-body italic text-faded text-sm">
                  {readTime(blog.content)}
                </span>
              </div>

              <div className="reading-width mt-10 space-y-6 text-[1.16rem] leading-[1.75] text-ink/95">
                {paragraphs.map((p, i) => (
                  <p key={i} className={i === 0 ? 'dropcap' : ''}>
                    {p}
                  </p>
                ))}
              </div>

              <div className="reading-width mt-14">
                <div className="border-t-[3px] border-ink" />
                <div className="rule-double" />
                <div className="flex justify-between items-center py-3 text-sm">
                  <span className="label-caps text-faded">
                    end of report no. {blog.id}
                  </span>
                  <Link
                    to="/"
                    className="label-caps text-ink underline decoration-hair decoration-2 underline-offset-4 hover:decoration-ink transition-colors"
                  >
                    back to the front page
                  </Link>
                </div>
              </div>
            </article>
          )}
        </div>
      </main>
    </div>
  );
};

export default ArticlePage;
