import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { api, setToken } from '../config/api';
import { Mail, Lock, ArrowRight, ShieldCheck, Newspaper, AlertCircle, CheckCircle } from 'lucide-react';

export const Signin: React.FC = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessMsg(null);

    if (!email.trim() || !password.trim()) {
      setError('Please enter your email address and password.');
      return;
    }

    setLoading(true);

    try {
      const response = await api.post('/api/v1/user/signin', {
        email: email.trim(),
        password: password,
      });

      if (response.data && response.data.jwt) {
        // Save token in localStorage and update user details
        setToken(response.data.jwt, email.trim());
        setSuccessMsg(response.data.message || 'Successfully signed in! Redirecting...');
        
        setTimeout(() => {
          navigate('/');
        }, 1000);
      } else {
        setError('Sign in failed. Invalid token received from server.');
      }
    } catch (err: any) {
      console.error('Signin error:', err);
      const message =
        err.response?.data?.message ||
        err.response?.data?.error ||
        (err.response?.status === 403 ? 'Account not found. Please check your email or sign up.' : null) ||
        (err.response?.status === 401 ? 'Incorrect password. Please try again.' : null) ||
        'Failed to authenticate with backend server.';
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-newspaper text-stone-900 dark:text-stone-100 flex flex-col justify-between selection:bg-stone-900 selection:text-white font-sans">
      {/* Top Header Masthead Bar */}
      <header className="border-b-2 border-stone-800 dark:border-stone-200 py-4 px-6 bg-stone-900 text-stone-100 flex justify-between items-center">
        <Link to="/" className="flex items-center gap-2 group">
          <Newspaper className="w-6 h-6 text-amber-400 group-hover:rotate-12 transition-transform" />
          <span className="font-cinzel text-xl font-black tracking-wider uppercase">
            THE GAZETTE
          </span>
        </Link>
        <Link 
          to="/" 
          className="text-xs font-mono uppercase tracking-widest text-stone-400 hover:text-stone-100 transition"
        >
          ← Back to Front Page
        </Link>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 flex items-center justify-center p-4 sm:p-8">
        <div className="w-full max-w-4xl grid grid-cols-1 md:grid-cols-2 border-2 border-stone-900 dark:border-stone-200 bg-white dark:bg-stone-900 shadow-2xl overflow-hidden">
          
          {/* Editorial Left Branding Banner */}
          <div className="bg-stone-900 text-stone-100 p-8 flex flex-col justify-between border-b-2 md:border-b-0 md:border-r-2 border-stone-800 dark:border-stone-700 relative">
            <div className="absolute top-0 right-0 w-32 h-32 opacity-10 pointer-events-none">
              <Newspaper className="w-full h-full text-white" />
            </div>

            <div>
              <span className="text-[10px] font-mono tracking-widest text-amber-400 uppercase font-bold block mb-2">
                EDITORIAL PORTAL
              </span>
              <h2 className="text-3xl font-black font-playfair uppercase tracking-tight leading-tight mb-4">
                AUTHOR SIGN IN
              </h2>
              <p className="text-xs font-newsreader italic text-stone-300 leading-relaxed mb-6">
                "Words have power when backed by authentic conviction. Sign in to post dispatches directly to the global network."
              </p>
              <div className="space-y-3 text-xs font-mono text-stone-400 border-t border-stone-800 pt-4">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-amber-400 shrink-0" />
                  <span>Persistent Auth Headers</span>
                </div>
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-amber-400 shrink-0" />
                  <span>Automatic JWT Authorization</span>
                </div>
              </div>
            </div>

            <div className="mt-8 pt-4 border-t border-stone-800 text-[11px] font-mono text-stone-400 uppercase tracking-widest">
              VOL. CXXVI • DISPATCH CENTER
            </div>
          </div>

          {/* Form Right Column */}
          <div className="p-6 sm:p-8 flex flex-col justify-center">
            <div className="mb-6">
              <h3 className="text-xl font-bold font-playfair uppercase text-stone-900 dark:text-stone-100">
                Welcome Back
              </h3>
              <p className="text-xs text-stone-600 dark:text-stone-400 font-sans mt-1">
                Enter your registered credentials to sign in and compose dispatches.
              </p>
            </div>

            {error && (
              <div className="p-3 bg-red-100 dark:bg-red-950 border border-red-400 text-red-900 dark:text-red-200 text-xs font-mono mb-4 flex items-start gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                <span>{error}</span>
              </div>
            )}

            {successMsg && (
              <div className="p-3 bg-emerald-100 dark:bg-emerald-950 border border-emerald-400 text-emerald-900 dark:text-emerald-200 text-xs font-mono mb-4 flex items-center gap-2">
                <CheckCircle className="w-4 h-4 shrink-0" />
                <span>{successMsg}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4 text-xs font-sans">
              <div>
                <label className="block font-mono uppercase tracking-wider text-stone-600 dark:text-stone-400 mb-1">
                  Email Address:
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 absolute left-3 top-3 text-stone-400" />
                  <input
                    type="email"
                    required
                    placeholder="author@gazette.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-9 pr-3 py-2.5 bg-stone-50 dark:bg-stone-800 border border-stone-300 dark:border-stone-700 font-mono text-xs outline-none focus:border-stone-900 dark:focus:border-stone-100 transition"
                  />
                </div>
              </div>

              <div>
                <label className="block font-mono uppercase tracking-wider text-stone-600 dark:text-stone-400 mb-1">
                  Password:
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 absolute left-3 top-3 text-stone-400" />
                  <input
                    type="password"
                    required
                    placeholder="••••••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-9 pr-3 py-2.5 bg-stone-50 dark:bg-stone-800 border border-stone-300 dark:border-stone-700 font-mono text-xs outline-none focus:border-stone-900 dark:focus:border-stone-100 transition"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 bg-stone-900 hover:bg-stone-800 dark:bg-stone-100 dark:hover:bg-white text-white dark:text-stone-900 font-mono text-xs uppercase tracking-wider font-bold flex items-center justify-center gap-2 cursor-pointer transition disabled:opacity-50 mt-6 shadow-md"
              >
                <span>{loading ? 'Authenticating...' : 'Sign In To Account'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>

            <div className="mt-6 pt-4 border-t border-stone-200 dark:border-stone-800 text-center text-xs font-mono text-stone-600 dark:text-stone-400">
              Don't have an author account yet?{' '}
              <Link to="/signup" className="font-bold underline text-stone-900 dark:text-stone-100 hover:text-amber-600">
                Register Here
              </Link>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="py-4 text-center text-xs font-mono text-stone-500 border-t border-stone-300 dark:border-stone-800">
        THE MEDIUM GAZETTE • AUTHOR AUTHENTICATION SYSTEM
      </footer>
    </div>
  );
};

export default Signin;
