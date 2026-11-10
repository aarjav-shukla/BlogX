import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { api, setToken } from '../config/api';
import { Masthead } from '../components/Masthead';
import { readApiError } from '../utils/errors';

export const Signin: React.FC = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (!email.trim() || !password.trim()) {
      setErrorMsg('Enter your email address and password to continue.');
      return;
    }

    setLoading(true);

    try {
      const response = await api.post('/api/v1/user/signin', {
        email: email.trim(),
        password: password,
      });

      if (response.data && response.data.jwt) {
        setToken(response.data.jwt, email.trim());
        navigate('/');
      } else {
        setErrorMsg('The server signed in but returned no pass. Try again.');
      }
    } catch (err) {
      const status = (err as { response?: { status?: number } } | undefined)
        ?.response?.status;
      const byStatus =
        status === 403
          ? 'No contributor found with this email. Register first.'
          : status === 401
            ? 'That password was refused. Try again.'
            : 'The presses could not be reached. Check that the backend is running.';
      setErrorMsg(readApiError(err, byStatus));
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
                Sign in
              </h1>
              <p className="font-body italic text-faded mt-2 text-sm">
                Returning contributors show their pass.
              </p>
            </div>

            <div className="px-8 py-7">
              {errorMsg && (
                <div className="mb-5 border border-oxblood/60 bg-oxblood/5 px-4 py-3 text-sm text-oxblood">
                  {errorMsg}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
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
                    password
                  </label>
                  <input
                    id="password"
                    type="password"
                    required
                    autoComplete="current-password"
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
                  {loading ? 'checking the register…' : 'enter the press room'}
                </button>
              </form>

              <p className="mt-6 pt-5 border-t border-hair text-center font-body text-sm text-faded">
                Not in the register yet?{' '}
                <Link
                  to="/signup"
                  className="text-ink underline decoration-hair decoration-2 underline-offset-4 hover:decoration-ink transition-colors"
                >
                  Register
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

export default Signin;
