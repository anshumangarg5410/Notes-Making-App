import React from 'react';
import websiteLogo from '../../assets/shared/logo/websiteLogo.png';

export const BrandLogo = ({
  size = 'md', // 'xs', 'sm', 'md', 'lg', 'xl', or custom class
  showText = true,
  textClassName = '',
  className = '',
  imgClassName = '',
  glow = true
}) => {
  const sizeMap = {
    xs: 'w-5 h-5',
    sm: 'w-6 h-6',
    md: 'w-8 h-8',
    lg: 'w-10 h-10',
    xl: 'w-14 h-14'
  };

  const dim = sizeMap[size] || size;

  return (
    <div className={`inline-flex items-center gap-2.5 select-none ${className}`}>
      <div className={`relative ${dim} flex items-center justify-center shrink-0`}>
        {glow && (
          <div className="absolute inset-0 rounded-full blur-md bg-purple-500/30 pointer-events-none" />
        )}
        <img
          src={websiteLogo}
          alt="NoteNest Logo"
          className={`relative z-10 w-full h-full object-contain filter drop-shadow-[0_0_8px_rgba(168,85,247,0.4)] ${imgClassName}`}
          loading="eager"
        />
      </div>
      {showText && (
        <span className={`font-serif font-bold tracking-tight text-white ${textClassName}`}>
          Note<span className="text-purple-400">Nest</span>
        </span>
      )}
    </div>
  );
};

export default BrandLogo;

