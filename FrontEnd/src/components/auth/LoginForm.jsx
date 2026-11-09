import React, { useState } from 'react';
import { Mail, Lock, Eye, EyeOff, ArrowRight, Loader2 } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { useTheme } from '../../context/ThemeContext';
import { SocialButtons } from './SocialButtons';

export const LoginForm = ({ onSwitchToSignup, onSwitchToForgot, onSuccess }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const { success, error: toastError } = useToast();
  const { isDark } = useTheme();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      toastError('Please enter both email and password.');
      return;
    }

    setLoading(true);
    try {
      const res = await login(email, password);
      if (res && res.success) {
        if (rememberMe) {
          localStorage.setItem('notenest_remember_email', email);
        } else {
          localStorage.removeItem('notenest_remember_email');
        }
        success('Welcome back to NoteNest!');
        if (onSuccess) onSuccess();
      }
    } catch (err) {
      const message =
        err.response?.data?.message ||
        err.message ||
        'Invalid email or password. Please try again.';
      toastError(message);
    } finally {
      setLoading(false);
    }
  };

  const handleFillDemo = () => {
    setEmail('demo@notenest.com');
    setPassword('password123');
  };

  return (
    <div className="w-full">
      {/* Title & Radiant Sunburst Doodle */}
      <div className="text-center sm:text-left mb-5">
        <div className="inline-flex items-center gap-2">
          <h2
            className={`font-handwriting text-3xl sm:text-4xl font-bold tracking-wide ${
              isDark ? 'text-white' : 'text-[#26153b]'
            }`}
          >
            Welcome Back!
          </h2>
          {/* Radiant Sunburst Doodle Lines */}
          <svg
            className="w-5 h-5 text-amber-400 -mt-2 animate-pulse"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
          >
            <line x1="12" y1="2" x2="12" y2="6" />
            <line x1="19" y1="5" x2="16" y2="8" />
            <line x1="22" y1="12" x2="18" y2="12" />
            <line x1="19" y1="19" x2="16" y2="16" />
          </svg>
        </div>
        <p
          className={`text-xs sm:text-sm mt-1 ${
            isDark ? 'text-stone-300/80' : 'text-stone-600'
          }`}
        >
          Log in to continue your note-taking journey.
        </p>
      </div>

      {/* Main Login Form */}
      <form onSubmit={handleSubmit} className="space-y-3.5">
        {/* Email Field */}
        <div>
          <div className="relative">
            <Mail
              className={`w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none ${
                isDark ? 'text-purple-300/60' : 'text-purple-500'
              }`}
            />
            <input
              type="email"
              required
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={`w-full pl-10 pr-4 py-2.5 rounded-xl text-xs sm:text-sm outline-none transition-all duration-200 ${
                isDark
                  ? 'bg-[#181126] border border-purple-500/30 text-white placeholder-purple-300/40 focus:border-purple-400 focus:ring-1 focus:ring-purple-400/50'
                  : 'bg-white border border-purple-200 text-[#26153b] placeholder-purple-900/40 focus:border-purple-500 focus:ring-1 focus:ring-purple-500/40 shadow-xs'
              }`}
            />
          </div>
        </div>

        {/* Password Field */}
        <div>
          <div className="relative">
            <Lock
              className={`w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none ${
                isDark ? 'text-purple-300/60' : 'text-purple-500'
              }`}
            />
            <input
              type={showPassword ? 'text' : 'password'}
              required
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={`w-full pl-10 pr-10 py-2.5 rounded-xl text-xs sm:text-sm outline-none transition-all duration-200 ${
                isDark
                  ? 'bg-[#181126] border border-purple-500/30 text-white placeholder-purple-300/40 focus:border-purple-400 focus:ring-1 focus:ring-purple-400/50'
                  : 'bg-white border border-purple-200 text-[#26153b] placeholder-purple-900/40 focus:border-purple-500 focus:ring-1 focus:ring-purple-500/40 shadow-xs'
              }`}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className={`absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded transition-colors cursor-pointer ${
                isDark
                  ? 'text-purple-300/60 hover:text-white'
                  : 'text-purple-500/70 hover:text-purple-900'
              }`}
            >
              {showPassword ? (
                <EyeOff className="w-4 h-4" />
              ) : (
                <Eye className="w-4 h-4" />
              )}
            </button>
          </div>
        </div>

        {/* Remember Me & Forgot Password Row */}
        <div className="flex items-center justify-between text-xs pt-0.5">
          <label className="flex items-center gap-2 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
              className="w-3.5 h-3.5 rounded accent-purple-600 cursor-pointer"
            />
            <span
              className={isDark ? 'text-stone-300/90' : 'text-stone-700 font-medium'}
            >
              Remember me
            </span>
          </label>

          <button
            type="button"
            onClick={onSwitchToForgot}
            className={`font-medium hover:underline cursor-pointer transition-colors ${
              isDark
                ? 'text-purple-300 hover:text-purple-200'
                : 'text-purple-700 hover:text-purple-900'
            }`}
          >
            Forgot password?
          </button>
        </div>

        {/* Primary Submit Button: Log In → */}
        <button
          type="submit"
          disabled={loading}
          className="w-full py-2.5 sm:py-3 px-5 rounded-full font-semibold text-xs sm:text-sm bg-gradient-to-r from-[#9333ea] to-[#7c3aed] text-white shadow-[0_0_20px_rgba(147,51,234,0.4)] hover:shadow-[0_0_30px_rgba(147,51,234,0.65)] hover:scale-[1.01] active:scale-[0.99] transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
        >
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Logging in...</span>
            </>
          ) : (
            <>
              <span>Log In</span>
              <ArrowRight className="w-4 h-4" />
            </>
          )}
        </button>
      </form>

      {/* Social Auth Section */}
      <SocialButtons isDark={isDark} actionLabel="continue with" />

      {/* Bottom Switch Link */}
      <div className="mt-4 text-center text-xs">
        <span className={isDark ? 'text-stone-400' : 'text-stone-600'}>
          New to NoteNest?{' '}
        </span>
        <button
          type="button"
          onClick={onSwitchToSignup}
          className={`font-semibold hover:underline cursor-pointer transition-colors ${
            isDark
              ? 'text-purple-300 hover:text-purple-100'
              : 'text-purple-700 hover:text-purple-900'
          }`}
        >
          Create an account
        </button>
      </div>

      {/* Demo Credentials Quick Fill */}
      <div className="mt-3 pt-2 text-center border-t border-purple-500/10">
        <button
          type="button"
          onClick={handleFillDemo}
          className={`text-[11px] underline opacity-70 hover:opacity-100 cursor-pointer transition-opacity ${
            isDark ? 'text-purple-300/70' : 'text-purple-700/70'
          }`}
        >
          Use demo credentials (demo@notenest.com)
        </button>
      </div>
    </div>
  );
};

export default LoginForm;
