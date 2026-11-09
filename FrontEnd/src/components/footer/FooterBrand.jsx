import React from 'react';
import { Link } from 'react-router-dom';
import { BookOpen } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import booksMugDark from '../../assets/auth/books-mug-dark-clean.png';
import booksMugLight from '../../assets/auth/books-mug-light-clean.png';

export const FooterBrand = () => {
  const { isDark } = useTheme();

  return (
    <div className="relative space-y-4 pr-4">
      {/* NoteNest Logo with Open Book */}
      <Link to="/" className="inline-flex items-center gap-2.5 group">
        <div
          className={`w-9 h-9 rounded-xl flex items-center justify-center transition-transform group-hover:scale-105 ${
            isDark
              ? 'bg-[#25173e]/90 border border-purple-500/50 text-purple-300 shadow-[0_0_12px_rgba(168,85,247,0.4)]'
              : 'bg-purple-100 border border-purple-300 text-purple-700 shadow-sm'
          }`}
        >
          <BookOpen className="w-5 h-5 transition-transform group-hover:-rotate-6" />
        </div>
        <span
          className={`text-2xl font-bold font-serif tracking-tight ${
            isDark ? 'text-white' : 'text-[#26153b]'
          }`}
        >
          NoteNest
        </span>
      </Link>

      {/* Tagline: "Your Ideas, Organized." with Handwritten Cursive & Yellow Doodle Rays */}
      <div className="relative inline-block">
        <div className="flex items-center gap-1.5">
          <p
            className={`font-handwriting text-xl sm:text-2xl font-semibold tracking-wide ${
              isDark ? 'text-purple-300' : 'text-[#6b21a8]'
            }`}
          >
            Your Ideas, Organized.
          </p>
          {/* Small yellow ray doodles */}
          <span className="text-amber-400 font-mono text-xs select-none">✦</span>
        </div>

        {/* Handwritten curved underline */}
        <svg
          className="w-28 h-2 mt-0.5"
          viewBox="0 0 120 8"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M 2,5 Q 35,1 60,5 T 118,4"
            stroke={isDark ? '#a855f7' : '#9333ea'}
            strokeWidth="2"
            strokeLinecap="round"
          />
        </svg>
      </div>

      {/* Short Product Description */}
      <p
        className={`text-xs sm:text-sm leading-relaxed max-w-xs font-sans ${
          isDark ? 'text-[#c4c0d0]' : 'text-[#5c4a70]'
        }`}
      >
        A modern note-taking space to write, organize, search and access your notes
        anytime, even offline.
      </p>

      {/* Books and mug illustration */}
      <div className="w-24 select-none pointer-events-none filter drop-shadow-md sm:w-28">
        <img
          src={isDark ? booksMugDark : booksMugLight}
          alt=""
          aria-hidden="true"
          className="w-full h-auto object-contain"
        />
      </div>
    </div>
  );
};

export default FooterBrand;
