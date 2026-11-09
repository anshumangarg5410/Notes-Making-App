import React, { useState } from 'react';
import { Mail, ArrowRight, ArrowLeft, Loader2, CheckCircle2 } from 'lucide-react';
import { useToast } from '../../context/ToastContext';
import { useTheme } from '../../context/ThemeContext';

export const ForgotPasswordForm = ({ onSwitchToLogin }) => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const { success, error: toastError } = useToast();
  const { isDark } = useTheme();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) {
      toastError('Please enter your email address.');
      return;
    }

    setLoading(true);
    // Simulate API password recovery request
    setTimeout(() => {
      setLoading(false);
      setSent(true);
      success('Password reset instructions sent to your email.');
    }, 900);
  };

  return (
    <div className="w-full">
      {/* Title */}
      <div className="text-center sm:text-left mb-5">
        <h2
          className={`font-handwriting text-3xl sm:text-4xl font-bold tracking-wide ${
            isDark ? 'text-white' : 'text-[#26153b]'
          }`}
        >
          Reset Password
        </h2>
        <p
          className={`text-xs sm:text-sm mt-1 ${
            isDark ? 'text-stone-300/80' : 'text-stone-600'
          }`}
        >
          {sent
            ? 'Check your inbox for recovery instructions.'
            : "Enter your email address and we'll send you recovery instructions."}
        </p>
      </div>

      {sent ? (
        <div className="space-y-4 py-3 text-center sm:text-left">
          <div
            className={`p-4 rounded-2xl flex items-start gap-3 ${
              isDark
                ? 'bg-purple-950/40 border border-purple-500/30 text-purple-200'
                : 'bg-purple-50 border border-purple-200 text-purple-900'
            }`}
          >
            <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
            <div className="text-xs sm:text-sm text-left">
              <p className="font-semibold">Reset email sent!</p>
              <p className="opacity-80 mt-0.5">
                We sent a link to <span className="font-mono font-medium">{email}</span>. Click the link inside to set a new password.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onSwitchToLogin}
            className="w-full py-2.5 sm:py-3 px-5 rounded-full font-semibold text-xs sm:text-sm bg-gradient-to-r from-[#9333ea] to-[#7c3aed] text-white shadow-[0_0_20px_rgba(147,51,234,0.4)] hover:shadow-[0_0_30px_rgba(147,51,234,0.65)] transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Return to Log In</span>
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
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
                placeholder="Enter your registered email"
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

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 sm:py-3 px-5 rounded-full font-semibold text-xs sm:text-sm bg-gradient-to-r from-[#9333ea] to-[#7c3aed] text-white shadow-[0_0_20px_rgba(147,51,234,0.4)] hover:shadow-[0_0_30px_rgba(147,51,234,0.65)] hover:scale-[1.01] active:scale-[0.99] transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Sending reset link...</span>
              </>
            ) : (
              <>
                <span>Send Reset Link</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>

          <div className="pt-2 text-center">
            <button
              type="button"
              onClick={onSwitchToLogin}
              className={`inline-flex items-center gap-1.5 text-xs font-medium cursor-pointer transition-colors ${
                isDark
                  ? 'text-purple-300 hover:text-white'
                  : 'text-purple-700 hover:text-purple-950'
              }`}
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Log In</span>
            </button>
          </div>
        </form>
      )}
    </div>
  );
};

export default ForgotPasswordForm;
