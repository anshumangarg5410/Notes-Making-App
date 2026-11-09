import React from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, Heart, ArrowUp, Sun, Moon } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import footerRibbonDark from '../../assets/landing/footer-ribbon-dark.png';
import footerRibbonLight from '../../assets/landing/footer-ribbon-light.png';

export const LandingFooter = () => {
  const { isDark, toggleTheme } = useTheme();

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const scrollTo = (id) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <footer
      className={`relative pt-16 overflow-hidden border-t transition-colors duration-300 ${
        isDark
          ? 'bg-[#090712] border-purple-950/40 text-stone-300'
          : 'bg-[#faf8f5] border-stone-200 text-stone-600'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">

          {/* Col 1 & 2: Brand Information */}
          <div className="lg:col-span-2 space-y-4">
            <Link to="/" onClick={scrollToTop} className="flex items-center gap-2.5 group inline-flex">
              <div className={`w-9 h-9 rounded-xl flex items-center justify-center transition-transform group-hover:scale-105 ${
                isDark
                  ? 'bg-purple-950/60 border border-purple-500/40 text-purple-300 shadow-[0_0_12px_rgba(168,85,247,0.35)]'
                  : 'bg-amber-100 border border-amber-300 text-amber-900 shadow-sm'
              }`}>
                <BookOpen className="w-5 h-5" />
              </div>
              <span className={`text-2xl font-bold font-serif ${isDark ? 'text-white' : 'text-stone-900'}`}>
                Note<span className={isDark ? 'text-purple-400' : 'text-amber-700'}>Nest</span>
              </span>
            </Link>

            <p className="text-sm font-serif italic text-purple-400 dark:text-purple-300">
              Your Ideas, Organized.
            </p>

            <p className="text-xs sm:text-sm leading-relaxed max-w-sm text-stone-400">
              The modern digital notebook crafted with a tactile paper and pencil aesthetic.
              Write, nest, and access your notes anywhere with offline-first speed.
            </p>

            <div className="pt-2 flex items-center gap-3">
              <button
                onClick={toggleTheme}
                className={`p-2 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer ${
                  isDark
                    ? 'bg-purple-950/40 border border-purple-800/40 text-purple-200 hover:bg-purple-900/50'
                    : 'bg-stone-100 border border-stone-300 text-stone-700 hover:bg-stone-200'
                }`}
              >
                {isDark ? <Sun className="w-3.5 h-3.5 text-amber-300" /> : <Moon className="w-3.5 h-3.5" />}
                <span>{isDark ? 'Light Theme' : 'Dark Theme'}</span>
              </button>
            </div>
          </div>

          {/* Col 3: Product Navigation */}
          <div>
            <h4 className={`text-sm font-bold font-serif uppercase tracking-wider mb-4 ${
              isDark ? 'text-white' : 'text-stone-900'
            }`}>
              Product
            </h4>
            <ul className="space-y-2.5 text-xs sm:text-sm">
              <li>
                <button
                  onClick={() => scrollTo('features')}
                  className="hover:text-purple-400 transition-colors text-left cursor-pointer"
                >
                  Features Overview
                </button>
              </li>
              <li>
                <button
                  onClick={() => scrollTo('home')}
                  className="hover:text-purple-400 transition-colors text-left cursor-pointer"
                >
                  Rich Text Editor
                </button>
              </li>
              <li>
                <button
                  onClick={() => scrollTo('features')}
                  className="hover:text-purple-400 transition-colors text-left cursor-pointer"
                >
                  Nested Folders
                </button>
              </li>
              <li>
                <button
                  onClick={() => scrollTo('features')}
                  className="hover:text-purple-400 transition-colors text-left cursor-pointer"
                >
                  Offline Mode
                </button>
              </li>
            </ul>
          </div>

          {/* Col 4: Navigation Links */}
          <div>
            <h4 className={`text-sm font-bold font-serif uppercase tracking-wider mb-4 ${
              isDark ? 'text-white' : 'text-stone-900'
            }`}>
              Explore
            </h4>
            <ul className="space-y-2.5 text-xs sm:text-sm">
              <li>
                <button
                  onClick={() => scrollTo('about')}
                  className="hover:text-purple-400 transition-colors text-left cursor-pointer"
                >
                  About NoteNest
                </button>
              </li>
              <li>
                <button
                  onClick={() => scrollTo('how-it-works')}
                  className="hover:text-purple-400 transition-colors text-left cursor-pointer"
                >
                  How It Works
                </button>
              </li>
              <li>
                <button
                  onClick={() => scrollTo('contact')}
                  className="hover:text-purple-400 transition-colors text-left cursor-pointer"
                >
                  Contact & Support
                </button>
              </li>
            </ul>
          </div>

          {/* Col 5: Account & Access */}
          <div>
            <h4 className={`text-sm font-bold font-serif uppercase tracking-wider mb-4 ${
              isDark ? 'text-white' : 'text-stone-900'
            }`}>
              Get Started
            </h4>
            <ul className="space-y-2.5 text-xs sm:text-sm">
              <li>
                <Link to="/login" className="hover:text-purple-400 transition-colors">
                  Log In
                </Link>
              </li>
              <li>
                <Link to="/register" className="hover:text-purple-400 font-semibold text-purple-400 transition-colors">
                  Sign Up Free
                </Link>
              </li>
              <li>
                <Link to="/notes" className="hover:text-purple-400 transition-colors">
                  Open Workspace
                </Link>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom Bar: Copyright & Back to Top */}
        <div className="mt-12 pt-8 border-t border-purple-500/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-stone-400">
          <p>© {new Date().getFullYear()} NoteNest. All rights reserved. Hand-crafted with care.</p>

          <button
            onClick={scrollToTop}
            className={`p-2 rounded-xl transition-all flex items-center gap-1.5 cursor-pointer ${
              isDark ? 'hover:text-white hover:bg-white/5' : 'hover:text-stone-900 hover:bg-stone-200'
            }`}
          >
            <span>Back to top</span>
            <ArrowUp className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Decorative Bottom Torn-Paper Desk Ribbon Asset from Reference */}
      <div className="w-full overflow-hidden leading-none select-none pointer-events-none opacity-80">
        <img
          src={isDark ? footerRibbonDark : footerRibbonLight}
          alt="Desk Ribbon"
          className="w-full h-auto object-cover min-h-[40px] max-h-[90px]"
        />
      </div>
    </footer>
  );
};

export default LandingFooter;

