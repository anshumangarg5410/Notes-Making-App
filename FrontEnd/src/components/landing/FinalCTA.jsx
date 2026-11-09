import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowRight, Sparkles, Mail, CheckCircle2 } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import footerCtaDark from '../../assets/landing/footer-cta-dark.png';
import footerCtaLight from '../../assets/landing/footer-cta-light.png';

export const FinalCTA = () => {
  const { isDark } = useTheme();
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (email.trim()) {
      setSubmitted(true);
      setTimeout(() => {
        navigate(`/register?email=${encodeURIComponent(email.trim())}`);
      }, 800);
    }
  };

  return (
    <section
      id="contact"
      className="relative py-24 px-4 sm:px-6 lg:px-8 overflow-hidden transition-colors duration-300"
      style={{
        background: isDark
          ? 'radial-gradient(ellipse at center, #241444 0%, #110d21 60%, #0a0714 100%)'
          : 'radial-gradient(ellipse at center, #faedf9 0%, #faf8f5 60%, #f3edf8 100%)'
      }}
    >
      {/* Background Ambient Glow */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] rounded-full blur-[140px] pointer-events-none opacity-40 transition-colors"
        style={{ background: isDark ? '#9333ea' : '#d8b4fe' }}
      />

      <div className="max-w-5xl mx-auto relative z-10">
        <div
          className={`relative rounded-3xl p-8 sm:p-14 text-center border shadow-2xl overflow-hidden ${
            isDark
              ? 'bg-[#181129]/90 border-purple-800/40 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.8),0_0_40px_rgba(168,85,247,0.15)]'
              : 'bg-white/95 border-amber-900/15 shadow-[0_20px_50px_-15px_rgba(120,80,40,0.12)]'
          }`}
        >
          {/* Decorative Corner Doodle */}
          <div className="absolute top-4 left-6 text-amber-400 opacity-60 text-lg font-serif">✦</div>
          <div className="absolute bottom-4 right-8 text-purple-400 opacity-60 text-lg font-serif">✦</div>

          {/* Eyebrow */}
          <div className="inline-flex items-center gap-2 mb-4">
            <span
              className="text-sm font-serif italic tracking-wide"
              style={{ color: isDark ? '#c4b5fd' : '#7c3aed' }}
            >
              ✦ Ready to Elevate Your Writing?
            </span>
          </div>

          {/* Main Heading */}
          <h2 className={`text-3xl sm:text-5xl font-extrabold font-serif tracking-tight max-w-2xl mx-auto leading-[1.15] mb-5 ${
            isDark ? 'text-white' : 'text-stone-900'
          }`}>
            Your Next Great Idea Starts Here.
          </h2>

          {/* Description */}
          <p className={`text-base sm:text-lg max-w-xl mx-auto mb-8 font-sans ${
            isDark ? 'text-stone-300' : 'text-stone-600'
          }`}>
            Give your thoughts a home. Start organizing your ideas with NoteNest — beautiful,
            blazing fast, and ready offline.
          </p>

          {/* Email Quick-Start Form matching Reference Footer Asset */}
          <form
            onSubmit={handleSubmit}
            className="max-w-md mx-auto mb-6 flex flex-col sm:flex-row items-center gap-2.5"
          >
            <div className="relative w-full">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-stone-400">
                <Mail className="w-4 h-4" />
              </div>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                required
                className={`w-full pl-10 pr-4 py-3.5 rounded-2xl text-sm font-medium transition-all outline-none ${
                  isDark
                    ? 'bg-[#110c1f] border border-purple-500/30 text-white placeholder-stone-400 focus:border-purple-400 focus:ring-2 focus:ring-purple-500/20'
                    : 'bg-stone-50 border border-stone-300 text-stone-900 placeholder-stone-500 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20'
                }`}
              />
            </div>

            <button
              type="submit"
              className={`w-full sm:w-auto shrink-0 px-6 py-3.5 rounded-2xl font-semibold text-sm transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer shadow-lg ${
                isDark
                  ? 'bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white shadow-purple-600/30 hover:scale-102'
                  : 'bg-purple-600 hover:bg-purple-700 text-white shadow-purple-600/25 hover:scale-102'
              }`}
            >
              {submitted ? (
                <>
                  <CheckCircle2 className="w-4 h-4 text-emerald-300" />
                  <span>Redirecting...</span>
                </>
              ) : (
                <>
                  <span>Get Started for Free</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Trust Guarantees */}
          <div className="flex flex-wrap items-center justify-center gap-6 text-xs text-stone-400">
            <span className="flex items-center gap-1.5">
              <span className="text-emerald-400 font-bold">✓</span> No credit card required
            </span>
            <span className="flex items-center gap-1.5">
              <span className="text-emerald-400 font-bold">✓</span> Free forever plan
            </span>
            <span className="flex items-center gap-1.5">
              <span className="text-emerald-400 font-bold">✓</span> Offline enabled instantly
            </span>
          </div>

        </div>
      </div>
    </section>
  );
};

export default FinalCTA;
