import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Camera, Lock, User, ArrowRight, Loader2, AlertCircle } from 'lucide-react';
import { useAdminAuth } from '../context/AdminAuthContext';
import { useAdminToast } from '../components/AdminToast';

export const LoginPage: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { login } = useAdminAuth();
  const navigate = useNavigate();
  const { toast } = useAdminToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim() || !password) {
      setError('Please enter both username and password.');
      return;
    }

    try {
      setIsSubmitting(true);
      setError(null);

      const res = await login(username.trim(), password);
      if (res.success) {
        toast('Welcome back, Administrator.', 'success');
        navigate('/admin');
      } else {
        setError(res.error || 'Authentication failed. Please check credentials.');
      }
    } catch (err: any) {
      setError(err.message || 'An unexpected error occurred');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#07070A] flex items-center justify-center p-4 relative overflow-hidden">
      {/* Subtle background ambient glows */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-96 h-96 bg-champagne/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-64 h-64 bg-emerald-500/5 rounded-full blur-2xl pointer-events-none" />

      <div className="w-full max-w-md relative z-10">
        {/* Brand Header */}
        <div className="text-center mb-8">
          <div className="w-14 h-14 rounded-2xl bg-[#13131A] border border-champagne/40 mx-auto flex items-center justify-center text-champagne mb-4 shadow-xl shadow-champagne/10">
            <Camera className="w-7 h-7" />
          </div>
          <h1 className="font-serif text-2xl sm:text-3xl text-white font-normal">
            Z Skills Photography
          </h1>
          <p className="text-xs font-mono uppercase tracking-widest text-champagne/80 mt-1">
            Secure Management Console
          </p>
        </div>

        {/* Login Card */}
        <div className="bg-[#121217]/95 border border-white/10 rounded-2xl p-6 sm:p-8 backdrop-blur-xl shadow-2xl">
          <h2 className="text-base font-semibold text-white mb-2">Administrator Sign In</h2>
          <p className="text-xs text-white/50 mb-6">
            Enter your credentials to manage portfolio content, media assets, and website configuration.
          </p>

          {error && (
            <div className="mb-6 p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2.5">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-mono uppercase tracking-wider text-white/70 mb-1.5">
                Username
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-white/40 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  autoComplete="username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Enter admin username"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#09090C] border border-white/15 text-white text-sm placeholder:text-white/30 focus:outline-none focus:border-champagne transition-colors"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-mono uppercase tracking-wider text-white/70 mb-1.5">
                Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-white/40 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#09090C] border border-white/15 text-white text-sm placeholder:text-white/30 focus:outline-none focus:border-champagne transition-colors"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full mt-2 py-3 rounded-xl bg-champagne hover:bg-champagne-dark text-black font-semibold text-xs font-mono tracking-widest uppercase flex items-center justify-center gap-2 shadow-lg shadow-champagne/20 transition-all disabled:opacity-50"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Verifying...</span>
                </>
              ) : (
                <>
                  <span>Access Dashboard</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          <div className="mt-6 pt-6 border-t border-white/10 flex items-center justify-between text-xs text-white/40">
            <span>Location: Sirsa, India</span>
            <a href="/" className="hover:text-champagne transition-colors">
              Return to Website
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
