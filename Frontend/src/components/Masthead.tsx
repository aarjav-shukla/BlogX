import React from 'react';
import { Link, NavLink } from 'react-router-dom';
import { isAuthenticated, getUserEmail, removeToken } from '../config/api';

interface MastheadProps {
  searchQuery?: string;
  setSearchQuery?: (query: string) => void;
  onWrite?: () => void;
}

export const Masthead: React.FC<MastheadProps> = ({
  searchQuery,
  setSearchQuery,
  onWrite,
}) => {
  const authed = isAuthenticated();

  const today = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });

  return (
    <header className="border-b border-rule">
      <div className="mx-auto w-full max-w-6xl px-4 sm:px-6">
        {/* slim dateline strip */}
        <div className="flex flex-wrap items-center justify-between gap-x-6 gap-y-1 border-b border-hair py-2.5 text-[13px] text-faded">
          <span className="label-caps">{today}</span>

          <span className="hidden md:inline label-caps">
            printed daily by anyone who cares to write
          </span>

          <div className="flex items-center gap-4">
            {authed ? (
              <>
                <Link
                  to="/profile"
                  className="label-caps hover:text-ink transition-colors max-w-[16ch] truncate"
                  title={getUserEmail()}
                >
                  {getUserEmail()}
                </Link>
                <button
                  onClick={() => {
                    removeToken();
                    window.location.reload();
                  }}
                  className="label-caps cursor-pointer text-faded underline decoration-hair underline-offset-4 hover:text-ink transition-colors sm:hidden"
                >
                  sign out
                </button>
              </>
            ) : (
              <Link
                to="/signin"
                className="label-caps text-ink underline decoration-hair underline-offset-4 hover:decoration-ink transition-colors"
              >
                sign in
              </Link>
            )}
          </div>
        </div>

        {/* nameplate */}
        <div className="py-8 sm:py-11 text-center">
          <Link to="/" className="inline-block">
            <h1 className="font-masthead text-[clamp(3.4rem,10vw,6.75rem)] leading-[0.9] text-ink">
              The Medium
            </h1>
          </Link>
        </div>

        {/* rule stack: double rule over the nav rail */}
        <div className="rule-double" />
        <div className="flex flex-wrap items-center justify-between gap-x-6 gap-y-2 border-b-2 border-rule py-2.5">
          <nav className="flex items-center gap-6 text-sm">
            <NavLink
              to="/"
              end
              className={({ isActive }) =>
                `label-caps transition-colors ${
                  isActive ? 'text-ink' : 'text-faded hover:text-ink'
                }`
              }
            >
              front page
            </NavLink>

            {authed || onWrite ? (
              onWrite ? (
                <button
                  onClick={onWrite}
                  className="label-caps cursor-pointer text-ink bg-ink text-paper px-3 py-1 transition-opacity hover:opacity-85"
                >
                  write a story
                </button>
              ) : null
            ) : (
              <Link
                to="/signup"
                className="label-caps text-faded hover:text-ink transition-colors"
              >
                become a contributor
              </Link>
            )}
          </nav>

          {/* search — only on pages that wire it up */}
          {setSearchQuery && (
            <div className="flex items-center gap-2">
              <input
                type="text"
                placeholder="Search the paper"
                value={searchQuery ?? ''}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-44 sm:w-56 bg-transparent border-b border-hair py-1 text-sm font-body text-ink placeholder:text-faded/70 placeholder:italic focus:border-ink transition-colors"
              />
            </div>
          )}

          {/* wide-screen sign out */}
          {authed && (
            <button
              onClick={() => {
                removeToken();
                window.location.reload();
              }}
              className="hidden sm:inline cursor-pointer label-caps text-faded hover:text-oxblood transition-colors"
            >
              sign out
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
