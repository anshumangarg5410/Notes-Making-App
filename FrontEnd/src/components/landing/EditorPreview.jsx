import React from 'react';
import editorPreviewDark from '../../assets/landing/newlaptop.png';
import editorPreviewLight from '../../assets/landing/editor-preview-light-updated.png';
import stickyHeartDark from '../../assets/landing/sticky-heart-dark.png';
import binderClipDark from '../../assets/landing/binder-clip-dark.png';
import { useTheme } from '../../context/ThemeContext';

export const EditorPreview = () => {
  const { isDark } = useTheme();

  return (
    <div className="relative aspect-[3/2] w-full max-w-2xl select-none group">
      {/* Ambient Purple Light Bloom behind Editor */}
      <div
        className="absolute -inset-6 rounded-3xl blur-2xl opacity-50 pointer-events-none transition-opacity duration-500 group-hover:opacity-75"
        style={{
          background: isDark
            ? 'radial-gradient(circle, rgba(129,140,248,0.28) 0%, rgba(99,102,241,0.14) 50%, transparent 75%)'
            : 'radial-gradient(circle, rgba(99,102,241,0.16) 0%, rgba(129,140,248,0.08) 50%, transparent 75%)'
        }}
      />

      {/* Floating Yellow Heart Sticky Note on Top-Right */}
      {isDark && <div
        className="absolute -top-7 -right-4 w-16 sm:w-20 z-20 transform rotate-12 transition-transform duration-300 group-hover:rotate-6 group-hover:scale-105 filter drop-shadow-[0_8px_16px_rgba(0,0,0,0.4)] pointer-events-none"
      >
        <img
          src={stickyHeartDark}
          alt="Sticky Note"
          className="w-full h-auto object-contain"
        />
      </div>}

      {/* Metal Stationery Binder Clip on Top-Left */}
      {isDark && <div
        className="absolute -top-5 left-16 sm:left-24 w-8 sm:w-11 z-20 transform -rotate-6 transition-transform duration-300 group-hover:rotate-0 filter drop-shadow-[0_4px_8px_rgba(0,0,0,0.5)] pointer-events-none"
      >
        <img
          src={binderClipDark}
          alt="Binder Clip"
          className="w-full h-auto object-contain"
        />
      </div>}

      {/* Tablet Editor Mockup Container */}
      <div className={`absolute inset-0 rounded-xl overflow-hidden transition-transform duration-500 group-hover:scale-[1.015] ${
        isDark ? 'filter drop-shadow-[0_20px_50px_rgba(0,0,0,0.7)]' : 'filter drop-shadow-[0_20px_40px_rgba(15,23,42,0.18)]'
      }`}>
        <img
          src={isDark ? editorPreviewDark : editorPreviewLight}
          alt="NoteNest Application Interface"
          className="block h-full w-full object-contain select-none"
          loading="eager"
        />

        {/* Subtle glass reflection highlight */}
        {isDark && <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-transparent pointer-events-none opacity-40 group-hover:opacity-80 transition-opacity duration-700" />}
      </div>
    </div>
  );
};

export default EditorPreview;
