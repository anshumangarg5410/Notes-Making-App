import React from 'react';
import { LandingNavbar } from '../components/landing/LandingNavbar';
import { HeroSection } from '../components/landing/HeroSection';
import { FeatureCards } from '../components/landing/FeatureCards';
import { AboutSection } from '../components/landing/AboutSection';
import { HowItWorks } from '../components/landing/HowItWorks';
import { FinalCTA } from '../components/landing/FinalCTA';
import { LandingFooter } from '../components/landing/LandingFooter';
import { useTheme } from '../context/ThemeContext';

export const LandingPage = () => {
  const { isDark } = useTheme();

  return (
    <div
      className={`min-h-screen overflow-x-hidden transition-colors duration-300 ${
        isDark ? 'bg-[#0c0916] text-[#f0eeff]' : 'bg-[#faf8f5] text-stone-900'
      }`}
    >
      <LandingNavbar />
      <main>
        <HeroSection />
        <FeatureCards />
        <AboutSection />
        <HowItWorks />
        <FinalCTA />
      </main>
      <LandingFooter />
    </div>
  );
};

export default LandingPage;
