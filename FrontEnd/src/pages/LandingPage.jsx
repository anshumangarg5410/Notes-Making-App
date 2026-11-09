import React from 'react';
import { PencilNavbar } from '../components/landing/PencilNavbar';
import { HeroSection } from '../components/landing/HeroSection';
import { FeatureCards } from '../components/landing/FeatureCards';
import landingBg from '../assets/wide_dark_moody_stationary_themed_background_des.png';

export const LandingPage = () => {
  return (
    <div
      className="min-h-screen w-full relative flex flex-col justify-between overflow-x-hidden text-[#f5f3f0]"
      style={{
        backgroundImage: `url(${landingBg})`,
        backgroundColor: '#0d0a14',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        backgroundAttachment: 'fixed'
      }}
    >
      {/* 1. Pencil Navigation Bar */}
      <PencilNavbar />

      {/* 2. Hero Section (with Left Column and Right Editor Preview) */}
      <main className="flex-1 flex flex-col justify-center">
        <HeroSection />
      </main>

      {/* 3. Five Feature Cards */}
      <FeatureCards />
    </div>
  );
};

export default LandingPage;
