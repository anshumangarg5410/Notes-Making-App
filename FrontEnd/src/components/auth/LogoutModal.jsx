import React, { useState } from 'react';
import { LogOut, X, Loader2 } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { useTheme } from '../../context/ThemeContext';
import booksMugDark from '../../assets/auth/books-mug-dark-clean.png';
import booksMugLight from '../../assets/auth/books-mug-light-clean.png';
import washiTapeDark from '../../assets/auth/washi-tape-dark.png';
import washiTapeLight from '../../assets/auth/washi-tape-light.png';
import tornBottomDark from '../../assets/auth/torn-bottom-dark.png';
import tornBottomLight from '../../assets/auth/torn-bottom-light.png';

export const LogoutModal = ({ onClose, onConfirm }) => {
  const [loading, setLoading] = useState(false);
  const { logout } = useAuth();
  const { success } = useToast();
  const { isDark } = useTheme();

  const handleLogout = async () => {
    setLoading(true);
    try {
      if (onConfirm) {
        await onConfirm();
      } else {
        await logout();
      }
      success('Logged out successfully. See you soon!');
      if (onClose) onClose();
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className={`relative w-full max-w-md rounded-3xl p-6 sm:p-8 text-center transition-all duration-300 ${
        isDark
          ? 'bg-[#211d2e] text-[#f5f3f0] border border-purple-500/40 shadow-[0_0_50px_rgba(147,51,234,0.35),0_20px_40px_rgba(0,0,0,0.8)]'
          : 'bg-[#fbf7fd] text-[#26153b] border border-purple-300/80 shadow-[0_15px_45px_rgba(147,51,234,0.18)]'
      }`}
    >
      {/* Diagonal Washi Tape at Top-Left */}
      <div className="absolute -top-3 -left-3 pointer-events-none select-none z-30">
        <img
          src={isDark ? washiTapeDark : washiTapeLight}
          alt=""
          className="w-16 h-auto -rotate-12 drop-shadow-md opacity-90"
        />
      </div>

      {/* Spiral Holes on Left Margin */}
      <div className="absolute left-2.5 top-6 bottom-8 flex flex-col justify-between items-center pointer-events-none z-30 select-none">
        {Array.from({ length: 6 }).map((_, i) => (
          <div
            key={i}
            className={`relative w-3 h-3 rounded-full flex items-center justify-center ${
              isDark
                ? 'bg-[#0e0918] shadow-[inset_0_1.5px_3px_rgba(0,0,0,0.9)]'
                : 'bg-[#e4d8f0] shadow-[inset_0_1.5px_2px_rgba(0,0,0,0.3)]'
            }`}
          >
            <div
              className={`absolute -left-1 w-2 h-1 border-t-2 border-l-2 rounded-tl-full rotate-12 ${
                isDark ? 'border-purple-300/40' : 'border-purple-700/30'
              }`}
            />
          </div>
        ))}
      </div>

      {/* Close Button "✕" */}
      <button
        type="button"
        onClick={onClose}
        className={`absolute top-4 right-4 p-1.5 rounded-full transition-colors cursor-pointer ${
          isDark
            ? 'text-stone-400 hover:text-white hover:bg-white/10'
            : 'text-stone-500 hover:text-stone-900 hover:bg-purple-100/70'
        }`}
      >
        <X className="w-5 h-5" />
      </button>

      {/* Centered Coffee Mug & Stacked Books Illustration */}
      <div className="flex justify-center pt-2 pb-3">
        <img
          src={isDark ? booksMugDark : booksMugLight}
          alt="Steaming coffee mug"
          className="w-24 sm:w-28 h-auto object-contain drop-shadow-md"
        />
      </div>

      {/* Heading in cursive handwriting */}
      <h3
        className={`font-handwriting text-3xl sm:text-4xl font-bold tracking-wide ${
          isDark ? 'text-white' : 'text-[#26153b]'
        }`}
      >
        Leaving so soon?
      </h3>

      {/* Subtitle */}
      <p
        className={`text-xs sm:text-sm mt-1 max-w-xs mx-auto ${
          isDark ? 'text-stone-300/80' : 'text-stone-600'
        }`}
      >
        Your notes are safe and waiting for you whenever you return.
      </p>

      {/* Action Buttons */}
      <div className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-3">
        {/* Stay Signed In (Cancel) */}
        <button
          type="button"
          onClick={onClose}
          className={`w-full sm:w-auto px-5 py-2.5 rounded-full text-xs sm:text-sm font-semibold border transition-all cursor-pointer ${
            isDark
              ? 'border-purple-500/30 text-stone-200 hover:bg-white/10 hover:border-purple-400'
              : 'border-purple-300 text-purple-900 hover:bg-purple-100/60'
          }`}
        >
          Stay Signed In
        </button>

        {/* Confirm Log Out */}
        <button
          type="button"
          onClick={handleLogout}
          disabled={loading}
          className="w-full sm:w-auto px-6 py-2.5 rounded-full text-xs sm:text-sm font-semibold bg-gradient-to-r from-red-600 to-purple-600 hover:from-red-500 hover:to-purple-500 text-white shadow-[0_0_20px_rgba(239,68,68,0.35)] hover:shadow-[0_0_25px_rgba(239,68,68,0.5)] transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
        >
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Logging out...</span>
            </>
          ) : (
            <>
              <LogOut className="w-4 h-4" />
              <span>Log Out</span>
            </>
          )}
        </button>
      </div>

      {/* Jagged Torn Paper Bottom Accent */}
      <div className="absolute -bottom-1 left-0 right-0 w-full overflow-hidden rounded-b-3xl pointer-events-none select-none z-10">
        <img
          src={isDark ? tornBottomDark : tornBottomLight}
          alt=""
          className="w-full h-4 sm:h-5 object-cover opacity-85"
        />
      </div>
    </div>
  );
};

export default LogoutModal;
