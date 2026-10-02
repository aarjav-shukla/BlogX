import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { getToken, removeToken, getUserEmail, isAuthenticated } from '../config/api';
import { User, LogOut, Key, Newspaper, ArrowLeft, ShieldCheck, FileText } from 'lucide-react';

export const Profile: React.FC = () => {
  const navigate = useNavigate();
  const loggedIn = isAuthenticated();
  const token = getToken();
  const email = getUserEmail();

  const handleLogout = () => {
    removeToken();
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-newspaper text-stone-900 dark:text-stone-100 flex flex-col justify-between selection:bg-stone-900 selection:text-white font-sans">
      {/* Top Navigation */}
      <header className="border-b-2 border-stone-800 dark:border-stone-200 py-4 px-6 bg-stone-900 text-stone-100 flex justify-between items-center">
        <Link to="/" className="flex items-center gap-2 group">
          <Newspaper className="w-6 h-6 text-amber-400 group-hover:rotate-12 transition-transform" />
          <span className="font-cinzel text-xl font-black tracking-wider uppercase">
            THE GAZETTE
          </span>
        </Link>
        <Link 
          to="/" 
          className="text-xs font-mono uppercase tracking-widest text-stone-400 hover:text-stone-100 transition flex items-center gap-1"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> Back to Gazette
        </Link>
      </header>

      {/* Main Profile View */}
      <main className="flex-1 max-w-4xl w-full mx-auto p-4 sm:p-8 flex items-center justify-center">
        <div className="w-full bg-white dark:bg-stone-900 border-2 border-stone-900 dark:border-stone-200 p-6 sm:p-10 shadow-2xl">
          
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b-2 border-stone-800 dark:border-stone-200 pb-6 mb-6 gap-4">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-stone-900 text-amber-400 dark:bg-stone-100 dark:text-stone-900 flex items-center justify-center font-bold text-2xl border-2 border-stone-800">
                <User className="w-8 h-8" />
              </div>
              <div>
                <span className="text-[10px] font-mono tracking-widest text-amber-700 dark:text-amber-400 uppercase font-bold">
                  AUTHOR PROFILE & CREDENTIALS
                </span>
                <h1 className="text-2xl font-black font-playfair uppercase text-stone-900 dark:text-stone-100">
                  {loggedIn ? email : 'Guest User'}
                </h1>
              </div>
            </div>

            {loggedIn && (
              <button
                onClick={handleLogout}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-mono text-xs uppercase tracking-wider font-bold flex items-center gap-2 transition cursor-pointer"
              >
                <LogOut className="w-4 h-4" />
                <span>Sign Out</span>
              </button>
            )}
          </div>

          {!loggedIn ? (
            <div className="text-center py-12 border-2 border-dashed border-stone-300 dark:border-stone-700 bg-stone-50 dark:bg-stone-800/40">
              <h2 className="text-lg font-bold font-playfair uppercase mb-2">No Active Session</h2>
              <p className="text-xs text-stone-600 dark:text-stone-400 max-w-md mx-auto mb-6">
                You are not currently logged in. Please sign in or register to publish articles and manage your authorization token.
              </p>
              <div className="flex justify-center gap-4">
                <Link
                  to="/signin"
                  className="px-5 py-2.5 bg-stone-900 text-white dark:bg-stone-100 dark:text-stone-900 text-xs font-mono font-bold uppercase tracking-wider"
                >
                  Sign In
                </Link>
                <Link
                  to="/signup"
                  className="px-5 py-2.5 border-2 border-stone-900 dark:border-stone-100 text-xs font-mono font-bold uppercase tracking-wider"
                >
                  Register Account
                </Link>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Auth Details */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 font-mono text-xs">
                <div className="p-4 border border-stone-300 dark:border-stone-700 bg-stone-50 dark:bg-stone-800/50">
                  <div className="flex items-center gap-2 text-stone-500 uppercase tracking-wider mb-2">
                    <ShieldCheck className="w-4 h-4 text-emerald-500" />
                    <span>AUTHENTICATION STATUS</span>
                  </div>
                  <div className="text-sm font-bold text-emerald-600 dark:text-emerald-400">
                    AUTHENTICATED & ACTIVE
                  </div>
                  <p className="text-[11px] text-stone-500 mt-1">
                    Your JWT authorization token is saved locally and attached to all API requests automatically.
                  </p>
                </div>

                <div className="p-4 border border-stone-300 dark:border-stone-700 bg-stone-50 dark:bg-stone-800/50">
                  <div className="flex items-center gap-2 text-stone-500 uppercase tracking-wider mb-2">
                    <FileText className="w-4 h-4 text-amber-500" />
                    <span>AUTHOR RIGHTS</span>
                  </div>
                  <div className="text-sm font-bold text-stone-900 dark:text-stone-100">
                    DISPATCH PUBLISHER
                  </div>
                  <p className="text-[11px] text-stone-500 mt-1">
                    You have full permission to compose, publish, and manage blog posts on the backend API.
                  </p>
                </div>
              </div>

              {/* JWT Token Storage Info */}
              <div className="p-4 border border-stone-300 dark:border-stone-700 bg-stone-900 text-stone-200 font-mono text-xs">
                <div className="flex items-center gap-2 text-amber-400 mb-2">
                  <Key className="w-4 h-4" />
                  <span className="uppercase tracking-wider font-bold">Stored Authorization Token Header</span>
                </div>
                <div className="bg-stone-950 p-3 rounded font-mono text-[11px] text-emerald-400 break-all select-all border border-stone-800">
                  {token}
                </div>
                <p className="text-[10px] text-stone-400 mt-2 italic">
                  Note: This token is securely stored in your browser's local storage and included in the Authorization header on all blog creation requests.
                </p>
              </div>

              <div className="pt-4 flex justify-end gap-3 border-t border-stone-200 dark:border-stone-800">
                <Link
                  to="/"
                  className="px-5 py-2.5 bg-stone-900 text-white dark:bg-stone-100 dark:text-stone-900 font-mono text-xs uppercase tracking-wider font-bold"
                >
                  Return To Front Page
                </Link>
              </div>
            </div>
          )}
        </div>
      </main>

      <footer className="py-4 text-center text-xs font-mono text-stone-500 border-t border-stone-300 dark:border-stone-800">
        THE MEDIUM GAZETTE • AUTHOR PROFILE
      </footer>
    </div>
  );
};

export default Profile;
