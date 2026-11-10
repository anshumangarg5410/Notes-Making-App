import React, { useRef, useState, useEffect } from 'react';
import { Pencil, Image, Sparkles, Crown } from 'lucide-react';
import purpleMountainMoon from '../../assets/editor/purple-mountain-moon.png';

export const ProfileBanner = ({
  user,
  onAvatarUpload,
  onCoverUpload
}) => {
  const avatarInputRef = useRef(null);
  const coverInputRef = useRef(null);
  const [avatarLoadFailed, setAvatarLoadFailed] = useState(false);

  useEffect(() => {
    setAvatarLoadFailed(false);
  }, [user?.avatar]);

  const resolveAvatarUrl = (url) => {
    if (!url) return '';
    if (url.startsWith('http://') || url.startsWith('https://') || url.startsWith('data:')) {
      return url;
    }
    return `http://localhost:5001${url.startsWith('/') ? '' : '/'}${url}`;
  };

  // Derive initials
  const getInitials = (nameStr) => {
    if (!nameStr) return 'AG';
    const parts = nameStr.trim().split(/\s+/);
    if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  };

  const handleAvatarFile = (e) => {
    const file = e.target.files?.[0];
    if (file && onAvatarUpload) {
      const reader = new FileReader();
      reader.onload = (ev) => {
        onAvatarUpload(ev.target?.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCoverFile = (e) => {
    const file = e.target.files?.[0];
    if (file && onCoverUpload) {
      const reader = new FileReader();
      reader.onload = (ev) => {
        onCoverUpload(ev.target?.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const memberSince = user?.createdAt
    ? new Date(user.createdAt).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
      })
    : 'Jan 18, 2025';

  return (
    <div className="relative rounded-[6px] border border-[#272738] bg-[#14141e] overflow-hidden p-5 shadow-lg select-none">
      {/* Hidden file inputs */}
      <input
        type="file"
        ref={avatarInputRef}
        onChange={handleAvatarFile}
        accept="image/*"
        className="hidden"
      />
      <input
        type="file"
        ref={coverInputRef}
        onChange={handleCoverFile}
        accept="image/*"
        className="hidden"
      />

      {/* Right-aligned mountain backdrop illustration */}
      <div className="absolute right-0 top-0 bottom-0 w-1/2 overflow-hidden pointer-events-none opacity-80">
        <img
          src={user?.coverImage || purpleMountainMoon}
          alt="Profile cover"
          className="w-full h-full object-cover object-right"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#14141e] via-[#14141e]/80 to-transparent" />
      </div>

      {/* Profile Details Content */}
      <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        {/* Left: Avatar + Names */}
        <div className="flex items-center gap-4">
          {/* Avatar Box with Pencil icon */}
          <div className="relative group">
            {user?.avatar && !avatarLoadFailed ? (
              <img
                src={resolveAvatarUrl(user.avatar)}
                alt={user.name || 'User avatar'}
                onError={() => setAvatarLoadFailed(true)}
                className="w-16 h-16 rounded-[8px] object-cover border border-purple-500/50 shadow-md shadow-purple-950/50"
              />
            ) : (
              <div className="w-16 h-16 rounded-[8px] bg-gradient-to-br from-purple-900/60 to-indigo-950/80 border border-purple-500/50 text-white font-bold text-xl flex items-center justify-center tracking-wider shadow-md shadow-purple-950/50">
                {getInitials(user?.name || 'Anshuman Garg')}
              </div>
            )}

            <button
              type="button"
              onClick={() => avatarInputRef.current?.click()}
              className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-purple-600 hover:bg-purple-500 text-white flex items-center justify-center border-2 border-[#14141e] shadow-md transition-transform hover:scale-110"
              title="Change Profile Photo"
            >
              <Pencil className="w-3 h-3" />
            </button>
          </div>

          {/* User info */}
          <div className="space-y-1">
            <h2 className="text-lg font-bold text-white tracking-tight leading-tight">
              {user?.name || 'Anshuman Garg'}
            </h2>
            <div className="text-xs text-gray-400 font-mono">
              {user?.email || 'anshumangarg@gmail.com'}
            </div>

            <div className="flex items-center gap-2 pt-0.5 text-xs text-gray-400">
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium bg-purple-950/60 text-purple-300 border border-purple-500/40">
                <Crown className="w-3 h-3 text-amber-400" />
                <span>{user?.plan || 'Pro Plan'}</span>
              </span>
              <span className="text-gray-600">•</span>
              <span className="text-[11px] text-gray-400">
                Member since {memberSince}
              </span>
            </div>
          </div>
        </div>

        {/* Right: Change Cover Button */}
        <div>
          <button
            type="button"
            onClick={() => coverInputRef.current?.click()}
            className="px-3 py-1.5 rounded-[4px] bg-[#1a1a26]/90 hover:bg-[#222232] border border-[#2e2e42] hover:border-gray-500 text-gray-200 text-xs font-medium flex items-center gap-1.5 transition-colors shadow-sm backdrop-blur-sm"
          >
            <Image className="w-3.5 h-3.5 text-purple-400" />
            <span>Change Cover</span>
          </button>
        </div>
      </div>
    </div>
  );
};

