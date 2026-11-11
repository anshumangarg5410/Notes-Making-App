import React from 'react';
import editorPreviewDark from '../../assets/landing/newlaptop.png';
import editorPreviewLight from '../../assets/landing/editor-preview-light-updated.png';
import { useTheme } from '../../context/ThemeContext';

export const EditorPreview = () => {
  const { isDark } = useTheme();

  return (
    <div className="relative aspect-[3/2] w-full max-w-2xl select-none group flex items-center justify-center">
      {/* Soft ambient violet glow centered behind the laptop */}
      <div
        className="absolute inset-4 rounded-full blur-3xl opacity-40 pointer-events-none transition-opacity duration-500 group-hover:opacity-60"
        style={{
          background: isDark
            ? 'radial-gradient(circle, rgba(168,85,247,0.25) 0%, rgba(99,102,241,0.12) 50%, transparent 70%)'
            : 'radial-gradient(circle, rgba(168,85,247,0.18) 0%, rgba(99,102,241,0.08) 50%, transparent 70%)'
        }}
      />

      {/* Transparent Laptop Mockup Image */}
      <div className="relative w-full h-full transition-transform duration-500 group-hover:scale-[1.015]">
        <img
          src={isDark ? editorPreviewDark : editorPreviewLight}
          alt="NoteNest Application Interface"
          className="block h-full w-full object-contain select-none filter drop-shadow-[0_20px_40px_rgba(0,0,0,0.6)]"
          loading="eager"
        />
      </div>
    </div>
  );
};

export default EditorPreview;
