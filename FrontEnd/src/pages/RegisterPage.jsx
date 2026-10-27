import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Feather, ArrowRight, Lock, Mail, User } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

export const RegisterPage = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const { register } = useAuth();
  const { success, error: toastError } = useToast();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      toastError('Passwords do not match');
      return;
    }

    if (password.length < 6) {
      toastError('Password must be at least 6 characters');
      return;
    }

    setLoading(true);

    try {
      const res = await register(name, email, password, confirmPassword);
      if (res.success) {
        success('Account created successfully! Welcome to Notely.');
        navigate('/', { replace: true });
      }
    } catch (err) {
      toastError(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-warm-bg dark:bg-charcoal-950 flex flex-col justify-center items-center px-4 py-12 select-none">
      <div className="w-full max-w-md bg-warm-card dark:bg-charcoal-900 border border-warm-border dark:border-charcoal-800 rounded-3xl shadow-card p-8 md:p-10">
        {/* Brand Header */}
        <div className="flex flex-col items-center text-center mb-8">
          <div className="w-12 h-12 rounded-2xl bg-terracotta-100 dark:bg-terracotta-900/40 text-terracotta-500 flex items-center justify-center mb-3 shadow-xs">
            <Feather className="w-6 h-6 transform -rotate-12" />
          </div>
          <h1 className="font-serif font-bold text-3xl text-charcoal-900 dark:text-cream-50">
            Create an Account
          </h1>
          <p className="text-xs text-charcoal-400 dark:text-charcoal-500 mt-1.5">
            Start organizing your thoughts and ideas today.
          </p>
        </div>

        {/* Register Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-charcoal-600 dark:text-cream-200 mb-1.5">
              Full Name
            </label>
            <div className="relative">
              <User className="w-4 h-4 text-charcoal-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                required
                placeholder="Eleanor Vance"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-cream-50 dark:bg-charcoal-800 border border-warm-border dark:border-charcoal-700 rounded-xl text-sm text-charcoal-900 dark:text-cream-50 outline-none focus:ring-1 focus:ring-terracotta-500 transition-all"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-charcoal-600 dark:text-cream-200 mb-1.5">
              Email Address
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-charcoal-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                required
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-cream-50 dark:bg-charcoal-800 border border-warm-border dark:border-charcoal-700 rounded-xl text-sm text-charcoal-900 dark:text-cream-50 outline-none focus:ring-1 focus:ring-terracotta-500 transition-all"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-charcoal-600 dark:text-cream-200 mb-1.5">
              Password
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-charcoal-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                required
                minLength={6}
                placeholder="At least 6 characters"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-cream-50 dark:bg-charcoal-800 border border-warm-border dark:border-charcoal-700 rounded-xl text-sm text-charcoal-900 dark:text-cream-50 outline-none focus:ring-1 focus:ring-terracotta-500 transition-all"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-charcoal-600 dark:text-cream-200 mb-1.5">
              Confirm Password
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-charcoal-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                required
                minLength={6}
                placeholder="Re-enter password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-cream-50 dark:bg-charcoal-800 border border-warm-border dark:border-charcoal-700 rounded-xl text-sm text-charcoal-900 dark:text-cream-50 outline-none focus:ring-1 focus:ring-terracotta-500 transition-all"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-2 py-3 px-4 bg-terracotta-500 hover:bg-terracotta-600 text-white rounded-xl font-medium text-sm flex items-center justify-center space-x-2 shadow-sm transition-all duration-200 active:scale-[0.98] disabled:opacity-50"
          >
            <span>{loading ? 'Creating account...' : 'Create Account'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        {/* Footer */}
        <div className="mt-8 text-center text-xs text-charcoal-500 dark:text-charcoal-400">
          Already have an account?{' '}
          <Link
            to="/login"
            className="font-semibold text-terracotta-500 hover:text-terracotta-600 dark:hover:text-terracotta-400 hover:underline"
          >
            Sign in
          </Link>
        </div>
      </div>
    </div>
  );
};
