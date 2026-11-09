import React, { useState } from 'react';
import { User, Mail, Lock, Eye, EyeOff, ArrowRight, Loader2 } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { useTheme } from '../../context/ThemeContext';
import { SocialButtons } from './SocialButtons';

export const SignupForm = ({ onSwitchToLogin, onSuccess }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const { register } = useAuth();
  const { success, error: toastError } = useToast();
  const { isDark } = useTheme();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim()) {
      toastError('Please enter your full name.');
      return;
    }
    if (!email) {
      toastError('Please enter a valid email address.');
      return;
    }
    if (password.length < 6) {
      toastError('Password must be at least 6 characters long.');
      return;
    }

    setLoading(true);
    try {
      const res = await register(name, email, password, password);
      if (res && res.success) {
        success('Account created successfully! Welcome to NoteNest.');
        if (onSuccess) onSuccess();
      }
    } catch (err) {
      const message =
        err.response?.data?.message ||
        err.message ||
        'Registration failed. Please try again.';
      toastError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full">
      {/* Title & Radiant Sunburst Doodle */}
      <div className="text-center sm:text-left mb-4">
        <div className="inline-flex items-center gap-2">
          <h2
            className={`font-handwriting text-3xl sm:text-4xl font-bold tracking-wide ${
              isDark ? 'text-white' : 'text-[#26153b]'
            }`}
          >
            Create Your Account
          </h2>
          {/* Radiant Sunburst Doodle */}
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
          className={`text-xs sm:text-sm mt-0.5 ${
            isDark ? 'text-stone-300/80' : 'text-stone-600'
          }`}
        >
          Start organizing your ideas with NoteNest.
        </p>
      </div>

      {/* Main Sign Up Form */}
      <form onSubmit={handleSubmit} className="space-y-3">
        {/* Full Name Field */}
        <div>
          <div className="relative">
            <User
              className={`w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none ${
                isDark ? 'text-purple-300/60' : 'text-purple-500'
              }`}
            />
            <input
              type="text"
              required
              placeholder="Enter your name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className={`w-full pl-10 pr-4 py-2.5 rounded-[3px] text-xs sm:text-sm outline-none transition-all duration-200 ${
                isDark
                  ? 'bg-[#181126] border border-purple-500/30 text-white placeholder-purple-300/40 focus:border-purple-400 focus:ring-1 focus:ring-purple-400/50'
                  : 'bg-white border border-purple-200 text-[#26153b] placeholder-purple-900/40 focus:border-purple-500 focus:ring-1 focus:ring-purple-500/40 shadow-xs'
              }`}
            />
          </div>
        </div>

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
              className={`w-full pl-10 pr-4 py-2.5 rounded-[3px] text-xs sm:text-sm outline-none transition-all duration-200 ${
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
              placeholder="Create a password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={`w-full pl-10 pr-10 py-2.5 rounded-[3px] text-xs sm:text-sm outline-none transition-all duration-200 ${
                isDark
                  ? 'bg-[#181126] border border-purple-500/30 text-white placeholder-purple-300/40 focus:border-purple-400 focus:ring-1 focus:ring-purple-400/50'
                  : 'bg-white border border-purple-200 text-[#26153b] placeholder-purple-900/40 focus:border-purple-500 focus:ring-1 focus:ring-purple-500/40 shadow-xs'
              }`}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className={`absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-[2px] transition-colors cursor-pointer ${
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

        {/* Primary Submit Button: Sign Up → */}
        <button
          type="submit"
          disabled={loading}
          className="w-full py-2.5 sm:py-3 px-5 rounded-[3px] font-semibold text-xs sm:text-sm bg-gradient-to-r from-[#9333ea] to-[#7c3aed] border border-purple-400/40 text-white shadow-[0_0_15px_rgba(147,51,234,0.35)] hover:shadow-[0_0_22px_rgba(147,51,234,0.55)] hover:scale-[1.01] active:scale-[0.99] transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60 pt-2"
        >
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Creating account...</span>
            </>
          ) : (
            <>
              <span>Sign Up</span>
              <ArrowRight className="w-4 h-4" />
            </>
          )}
        </button>
      </form>

      {/* Social Auth Section */}
      <SocialButtons isDark={isDark} actionLabel="sign up with" />

      {/* Bottom Switch Link */}
      <div className="mt-4 text-center text-xs">
        <span className={isDark ? 'text-stone-400' : 'text-stone-600'}>
          Already have an account?{' '}
        </span>
        <button
          type="button"
          onClick={onSwitchToLogin}
          className={`font-semibold hover:underline cursor-pointer transition-colors ${
            isDark
              ? 'text-purple-300 hover:text-purple-100'
              : 'text-purple-700 hover:text-purple-900'
          }`}
        >
          Log in
        </button>
      </div>
    </div>
  );
};

export default SignupForm;
