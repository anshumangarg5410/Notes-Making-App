import React, { useState } from 'react';
import { Mail, Send, CheckCircle2, ArrowRight } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { FooterBrand } from './FooterBrand';
import { FooterLinks } from './FooterLinks';
import pinnedHeartDark from '../../assets/footer/pinned-heart-dark.png';
import pinnedHeartLight from '../../assets/footer/pinned-heart-light.png';
import paperAirplaneDark from '../../assets/footer/paper-airplane-dark.png';
import paperAirplaneLight from '../../assets/footer/paper-airplane-light.png';

// Social links configuration
const SOCIAL_LINKS = [
  {
    name: 'GitHub',
    url: 'https://github.com',
    icon: (props) => (
      <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" {...props}>
        <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22" />
      </svg>
    ),
  },
  {
    name: 'LinkedIn',
    url: 'https://linkedin.com',
    icon: (props) => (
      <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" {...props}>
        <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
        <rect x="2" y="9" width="4" height="12" />
        <circle cx="4" cy="4" r="2" />
      </svg>
    ),
  },
  {
    name: 'X',
    url: 'https://x.com',
    icon: (props) => (
      <svg viewBox="0 0 24 24" width="15" height="15" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" {...props}>
        <path d="M4 4l16 16m0-16L4 20" />
      </svg>
    ),
  },
  {
    name: 'YouTube',
    url: 'https://youtube.com',
    icon: (props) => (
      <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" {...props}>
        <path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33z" />
        <polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02" fill="currentColor" />
      </svg>
    ),
  },
];

export const Footer = () => {
  const { isDark } = useTheme();
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState('idle'); // idle | error | success
  const [feedbackMsg, setFeedbackMsg] = useState('');

  const handleSubscribe = (e) => {
    e.preventDefault();
    const trimmed = email.trim();
    if (!trimmed || !trimmed.includes('@') || !trimmed.includes('.')) {
      setStatus('error');
      setFeedbackMsg('Please enter a valid email address.');
      return;
    }

    setStatus('success');
    setFeedbackMsg('Thanks for subscribing!');
    setEmail('');
    setTimeout(() => {
      setStatus('idle');
      setFeedbackMsg('');
    }, 4000);
  };

  return (
    <footer
      className={`relative w-full pt-12 pb-6 overflow-hidden transition-colors duration-300 ${
        isDark
          ? 'bg-[#100b1d] text-[#f5f3f0]'
          : 'bg-[#faf5ff] text-[#26153b]'
      }`}
      style={{
        borderTop: isDark
          ? '1px solid rgba(168, 85, 247, 0.2)'
          : '1px solid rgba(147, 51, 234, 0.15)'
      }}
    >
      {/* Upper Torn-Paper Corner in Top-Left (from reference) */}
      <div
        className="absolute top-0 left-0 w-24 h-16 pointer-events-none select-none opacity-40"
        style={{
          background: isDark
            ? 'linear-gradient(135deg, rgba(168,85,247,0.3) 0%, transparent 60%)'
            : 'linear-gradient(135deg, rgba(192,132,252,0.35) 0%, transparent 60%)'
        }}
      />

      {/* Main 4-Column Content Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">

          {/* Col 1: Brand Section (4 cols on lg) */}
          <div className="lg:col-span-4">
            <FooterBrand />
          </div>

          {/* Cols 2 & 3: Product, Features, Company (5 cols on lg) */}
          <div className="lg:col-span-5">
            <FooterLinks />
          </div>

          {/* Col 4: Newsletter Section with Pinned Sticky Note (3 cols on lg) */}
          <div className="lg:col-span-3 relative space-y-4">

            {/* Pinned Heart Yellow Sticky Note in Top-Right */}
            <div className="absolute -top-12 -right-4 w-16 sm:w-20 select-none pointer-events-none transform rotate-12 filter drop-shadow-[0_8px_16px_rgba(0,0,0,0.35)]">
              <img
                src={isDark ? pinnedHeartDark : pinnedHeartLight}
                alt="Heart Sticky Note"
                className="w-full h-auto object-contain"
              />
            </div>

            {/* Newsletter Heading: "Stay in the Loop" with yellow sunburst rays */}
            <div className="relative inline-block">
              <div className="flex items-center gap-1.5">
                <h4
                  className={`text-lg font-bold font-serif tracking-tight ${
                    isDark ? 'text-white' : 'text-[#26153b]'
                  }`}
                >
                  Stay in the Loop
                </h4>
                {/* Yellow sunburst rays */}
                <span className="text-amber-400 font-mono text-sm select-none">✦</span>
              </div>
            </div>

            {/* Newsletter Description */}
            <p
              className={`text-xs sm:text-sm leading-relaxed ${
                isDark ? 'text-[#c4c0d0]' : 'text-[#5c4a70]'
              }`}
            >
              Get product updates, new features and helpful tips.
            </p>

            {/* Functional Newsletter Input Pill */}
            <form onSubmit={handleSubscribe} className="relative mt-2">
              <div
                className={`flex items-center rounded-[3px] p-1 border transition-all ${
                  isDark
                    ? 'bg-[#181228] border-purple-500/40 focus-within:border-purple-400 focus-within:shadow-[0_0_15px_rgba(168,85,247,0.35)]'
                    : 'bg-white border-purple-300 focus-within:border-purple-500 focus-within:shadow-[0_0_15px_rgba(147,51,234,0.2)]'
                }`}
              >
                {/* Mail Envelope Icon */}
                <div className="pl-3 pr-2 text-purple-400">
                  <Mail className="w-4 h-4" />
                </div>

                {/* Email Input */}
                <input
                  type="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (status === 'error') setStatus('idle');
                  }}
                  placeholder="Enter your email"
                  aria-label="Email address for newsletter"
                  className={`w-full bg-transparent text-xs sm:text-sm outline-none px-1 py-1.5 ${
                    isDark
                      ? 'text-white placeholder-stone-400'
                      : 'text-[#26153b] placeholder-stone-500'
                  }`}
                />

                {/* Rectangular Purple Submit Button with Paper Plane Icon */}
                <button
                  type="submit"
                  aria-label="Subscribe to newsletter"
                  className={`shrink-0 w-8 h-8 rounded-[3px] flex items-center justify-center transition-all cursor-pointer ${
                    isDark
                      ? 'bg-[#9333ea] hover:bg-[#a855f7] border border-purple-400/40 text-white shadow-[0_0_10px_rgba(147,51,234,0.4)] hover:scale-102 active:scale-98'
                      : 'bg-[#7c3aed] hover:bg-[#6d28d9] border border-purple-400/40 text-white shadow-sm hover:scale-102 active:scale-98'
                  }`}
                >
                  <Send className="w-3.5 h-3.5 fill-current ml-0.5" />
                </button>
              </div>

              {/* Feedback Message */}
              {feedbackMsg && (
                <p
                  className={`text-xs mt-1.5 pl-2 ${
                    status === 'success' ? 'text-emerald-400' : 'text-rose-400'
                  }`}
                >
                  {feedbackMsg}
                </p>
              )}
            </form>

            {/* Decorative Purple Curved Hand-Drawn Arrow Curling Beneath Newsletter */}
            <div className="pt-2 flex justify-end select-none pointer-events-none">
              <svg
                className="w-16 h-8 text-purple-400/70"
                viewBox="0 0 80 40"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M 10,10 Q 40,35 65,15"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
                <path
                  d="M 55,10 L 67,14 L 62,24"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>

          </div>

        </div>
      </div>

      {/* 5. Paper Airplane Flight Path */}
      <div className="relative w-full mt-6 overflow-hidden select-none">
        {/* Dashed Paper-Airplane Flight Trail Path */}
        <div className="relative w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <svg
            className="w-full h-8 overflow-visible"
            viewBox="0 0 1200 40"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M 0,25 Q 300,5 600,28 T 1200,15"
              stroke={isDark ? '#a855f7' : '#c084fc'}
              strokeWidth="1.8"
              strokeDasharray="6 6"
              strokeOpacity="0.75"
            />
          </svg>

          {/* Folded Paper Airplane Icon Positioned Along the Trail */}
          <div className="absolute top-0 right-1/4 sm:right-1/3 w-10 sm:w-12 pointer-events-none transform -rotate-12 filter drop-shadow-[0_2px_8px_rgba(168,85,247,0.4)]">
            <img
              src={isDark ? paperAirplaneDark : paperAirplaneLight}
              alt="Paper Airplane"
              className="w-full h-auto object-contain"
            />
          </div>
        </div>

      </div>

      {/* 6. Bottom Footer Row: Copyright (Left) & Social Media Icons (Right) */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-3 relative z-10">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">

          {/* Left: Copyright */}
          <p
            className={`text-xs font-sans tracking-wide ${
              isDark ? 'text-[#a69db8]' : 'text-[#6e5d84]'
            }`}
          >
            © 2026 NoteNest. All rights reserved.
          </p>

          {/* Right: Circular Social Media Icon Buttons */}
          <div className="flex items-center gap-2.5">
            {SOCIAL_LINKS.map((item) => {
              const Icon = item.icon;
              return (
                <a
                  key={item.name}
                  href={item.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`Visit NoteNest on ${item.name}`}
                  className={`w-8 h-8 rounded-[3px] flex items-center justify-center border transition-all duration-200 cursor-pointer ${
                    isDark
                      ? 'bg-[#1b142c] border-purple-500/30 text-stone-300 hover:text-white hover:border-purple-400 hover:bg-[#281d42] hover:scale-105 hover:shadow-[0_0_10px_rgba(168,85,247,0.35)]'
                      : 'bg-white border-purple-200 text-[#5c4a70] hover:text-[#26153b] hover:border-purple-400 hover:bg-purple-50 hover:scale-105 hover:shadow-sm'
                  }`}
                >
                  <Icon />
                </a>
              );
            })}
          </div>

        </div>
      </div>
    </footer>
  );
};

export default Footer;
