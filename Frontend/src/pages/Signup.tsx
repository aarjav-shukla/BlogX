import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { api, setToken } from '../config/api';
import { Masthead } from '../components/Masthead';
import { readApiError } from '../utils/errors';

export const Signup: React.FC = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [emailRegistered, setEmailRegistered] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setEmailRegistered(false);

    if (!email.trim() || !password.trim()) {
      setErrorMsg('An email address and password are required.');
      return;
    }

    if (password.length < 6) {
      setErrorMsg('Passwords run 6 characters or more.');
      return;
    }

    setLoading(true);

    try {
      const response = await api.post('/api/v1/user/signup', {
        email: email.trim(),
        password: password,
        username: username.trim() || undefined,
      });

      if (response.data && response.data.jwt) {
        setToken(response.data.jwt, email.trim());
        navigate('/');
      } else {
        setErrorMsg('The server accepted you but returned no pass. Try again.');
      }
    } catch (err) {
      const shaped = err as { response?: { status?: number } } | undefined;
      const status = shaped?.response?.status;

      if (status === 400) {
        setEmailRegistered(true);
        setErrorMsg('That email is already in the register.');
      } else {
        const byStatus =
          status === 411
            ? 'The register refused these details. Check the email format and password length.'
            : 'The presses could not be reached. Check that the backend is running.';
        setErrorMsg(readApiError(err, byStatus));
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col surface-paper">
      <Masthead />
      <main className="flex-1 flex items-center justify-center px-4 py-14">
        <div className="w-full max-w-md">
          <div className="border-2 border-ink bg-paper-2 shadow-[8px_8px_0_0_rgba(27,23,16,0.35)]">
            <div className="border-b-2 border-rule px-8 pt-8 pb-5 text-center">
              <span className="label-caps text-faded text-sm">
                the medium — press office
              </span>
              <h1 className="font-headline text-3xl font-bold mt-2">
                Become a contributor
              </h1>
              <p className="font-body italic text-faded mt-2 text-sm">
                Anyone can write here. Every story runs.
              </p>
            </div>

            <div className="px-8 py-7">
              {errorMsg && (
                <div className="mb-5 border border-oxblood/60 bg-oxblood/5 px-4 py-3 text-sm text-oxblood">
                  {errorMsg}
                  {emailRegistered && (
                    <>
                      {' '}
                      <Link
                        to="/signin"
                        className="ml-1 font-semibold underline decoration-oxblood underline-offset-4"
                      >
                        Sign in instead
                      </Link>
                    </>
                  )}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label htmlFor="name" className="label-caps text-sm text-faded">
                    pen name <span className="normal-case font-body italic">(optional)</span>
                  </label>
                  <input
                    id="name"
                    type="text"
                    autoComplete="name"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="How the paper should print you"
                    className="mt-1.5 w-full bg-transparent border-b-2 border-hair py-2 font-body text-lg text-ink placeholder:text-faded/60 placeholder:italic focus:border-ink transition-colors"
                  />
                </div>

                <div>
                  <label htmlFor="email" className="label-caps text-sm text-faded">
                    email address
                  </label>
                  <input
                    id="email"
                    type="email"
                    required
                    autoComplete="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    className="mt-1.5 w-full bg-transparent border-b-2 border-hair py-2 font-body text-lg text-ink placeholder:text-faded/60 placeholder:italic focus:border-ink transition-colors"
                  />
                </div>

                <div>
                  <label htmlFor="password" className="label-caps text-sm text-faded">
                    password <span className="normal-case font-body italic">(6 characters or more)</span>
                  </label>
                  <input
                    id="password"
                    type="password"
                    required
                    minLength={6}
                    autoComplete="new-password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="mt-1.5 w-full bg-transparent border-b-2 border-hair py-2 font-body text-lg tracking-widest text-ink focus:border-ink transition-colors"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full label-caps cursor-pointer bg-ink py-3 text-paper text-base transition-opacity hover:opacity-85 disabled:opacity-50"
                >
                  {loading ? 'setting your byline…' : 'sign the register'}
                </button>
              </form>

              <p className="mt-6 pt-5 border-t border-hair text-center font-body text-sm text-faded">
                Already registered as a contributor?{' '}
                <Link
                  to="/signin"
                  className="text-ink underline decoration-hair decoration-2 underline-offset-4 hover:decoration-ink transition-colors"
                >
                  Sign in
                </Link>
              </p>
            </div>
          </div>

          <p className="mt-5 text-center">
            <Link to="/" className="label-caps text-faded hover:text-ink transition-colors text-sm">
              ← back to the front page
            </Link>
          </p>
        </div>
      </main>
    </div>
  );
};

export default Signup;
