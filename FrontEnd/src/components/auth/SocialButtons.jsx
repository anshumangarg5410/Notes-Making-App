import React from 'react';
import { GoogleLoginButton } from './GoogleLoginButton';

export const SocialButtons = ({ isDark, actionLabel = 'continue with', onSuccess }) => {
  return (
    <div className="w-full space-y-3 pt-1">
      {/* Divider */}
      <div className="relative flex items-center justify-center">
        <div
          className={`w-full border-t ${
            isDark ? 'border-purple-500/20' : 'border-purple-200'
          }`}
        />
        <span
          className={`absolute px-3 text-xs font-medium tracking-wide ${
            isDark
              ? 'bg-[#211d2e] text-purple-300/70'
              : 'bg-[#f8f0fb] text-purple-900/60'
          }`}
        >
          or {actionLabel}
        </span>
      </div>

      {/* Google Login GIS Button */}
      <div className="w-full">
        <GoogleLoginButton isDark={isDark} onSuccess={onSuccess} />
      </div>
    </div>
  );
};

export default SocialButtons;
