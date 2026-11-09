import React from 'react';
import editorPreviewDark from '../../assets/landing/editor-preview-dark.png';
import stickyHeartDark from '../../assets/landing/sticky-heart-dark.png';
import binderClipDark from '../../assets/landing/binder-clip-dark.png';

export const EditorPreview = () => {
  return (
    <div className="relative w-full max-w-2xl select-none group">
      {/* Ambient Purple Light Bloom behind Editor */}
      <div
        className="absolute -inset-6 rounded-3xl blur-2xl opacity-50 pointer-events-none transition-opacity duration-500 group-hover:opacity-75"
        style={{
          background: 'radial-gradient(circle, rgba(168,85,247,0.4) 0%, rgba(139,92,246,0.18) 50%, transparent 75%)'
        }}
      />

      {/* Floating Yellow Heart Sticky Note on Top-Right */}
      <div
        className="absolute -top-7 -right-4 w-16 sm:w-20 z-20 transform rotate-12 transition-transform duration-300 group-hover:rotate-6 group-hover:scale-105 filter drop-shadow-[0_8px_16px_rgba(0,0,0,0.4)] pointer-events-none"
      >
        <img
          src={stickyHeartDark}
          alt="Sticky Note"
          className="w-full h-auto object-contain"
        />
      </div>

      {/* Metal Stationery Binder Clip on Top-Left */}
      <div
        className="absolute -top-5 left-16 sm:left-24 w-8 sm:w-11 z-20 transform -rotate-6 transition-transform duration-300 group-hover:rotate-0 filter drop-shadow-[0_4px_8px_rgba(0,0,0,0.5)] pointer-events-none"
      >
        <img
          src={binderClipDark}
          alt="Binder Clip"
          className="w-full h-auto object-contain"
        />
      </div>

      {/* Tablet Editor Mockup Container */}
      <div className="relative rounded-[4px] overflow-hidden filter drop-shadow-[0_20px_50px_rgba(0,0,0,0.7)] transition-transform duration-500 group-hover:scale-[1.015]">
        <img
          src={editorPreviewDark}
          alt="NoteNest Application Interface"
          className="w-full h-auto object-contain block select-none"
          loading="eager"
        />

        {/* Subtle glass reflection highlight */}
        <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-transparent pointer-events-none opacity-40 group-hover:opacity-80 transition-opacity duration-700" />
      </div>
    </div>
  );
};

export default EditorPreview;
