import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { SyncStatus } from './SyncStatus';
import deskIllustration from '../../assets/dashboard/desk-illustration-feathered.png';

export const WelcomeSection = () => {
  const { user } = useAuth();

  // Dynamic greeting based on current local hour
  const currentHour = new Date().getHours();
  let greetingTime = 'Good Morning';
  if (currentHour >= 12 && currentHour < 17) {
    greetingTime = 'Good Afternoon';
  } else if (currentHour >= 17) {
    greetingTime = 'Good Evening';
  }

  const firstName = user?.name ? user.name.split(' ')[0] : 'Anshuman';

  return (
    <div className="relative w-full rounded-3xl p-6 sm:p-8 bg-gradient-to-r from-[#181126] via-[#1c142c] to-[#160f24] border border-purple-500/25 overflow-hidden shadow-xl select-none">
      {/* Background ambient lighting */}
      <div className="absolute top-0 right-1/4 w-72 h-72 bg-purple-600/15 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
        {/* Left Column: Greeting, Heading, Description, Sync Status */}
        <div className="space-y-3.5 max-w-xl text-left">
          {/* Subtle Greeting */}
          <p className="text-xs sm:text-sm font-medium text-purple-300/80 flex items-center gap-1.5">
            <span>{greetingTime}, {firstName}</span>
            <span className="text-base">👋</span>
          </p>

          {/* Main Heading with Purple Gradient Highlight on "Organized." */}
          <h1 className="text-3xl sm:text-4xl lg:text-[2.6rem] font-serif font-bold text-white tracking-tight leading-[1.15]">
            Your Ideas,{' '}
            <span className="bg-gradient-to-r from-[#c084fc] via-[#a855f7] to-[#8b5cf6] bg-clip-text text-transparent drop-shadow-[0_0_20px_rgba(168,85,247,0.4)]">
              Organized.
            </span>
          </h1>

          {/* Description */}
          <p className="text-xs sm:text-sm text-stone-300/80 leading-relaxed max-w-md">
            Capture, write, and manage your knowledge — all in one place.
          </p>

          {/* Sync Status Badge */}
          <div className="pt-1">
            <SyncStatus />
          </div>
        </div>

        {/* Right Column: Desk Illustration */}
        <div className="hidden md:flex shrink-0 items-center justify-end relative select-none pointer-events-none">
          <div className="relative">
            {/* Ambient Purple Backlight glow */}
            <div className="absolute inset-0 bg-purple-500/25 blur-2xl rounded-full transform scale-90" />
            <img
              src={deskIllustration}
              alt="Workspace Desk"
              className="relative w-56 sm:w-64 lg:w-72 h-auto object-contain drop-shadow-2xl"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default WelcomeSection;
