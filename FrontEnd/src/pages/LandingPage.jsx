import React from 'react';
import { PencilNavbar } from '../components/landing/PencilNavbar';
import { HeroSection } from '../components/landing/HeroSection';
import { FeatureCards } from '../components/landing/FeatureCards';
import { Footer } from '../components/footer/Footer';
import { useTheme } from '../context/ThemeContext';
import landingBgDark from '../assets/landing/hero-bg-dark.png';

export const LandingPage = () => {
  const { isDark } = useTheme();

  return (
    <div
      className={`min-h-screen w-full relative flex flex-col justify-between overflow-x-hidden transition-colors duration-300 ${
        isDark ? 'text-slate-100' : 'text-slate-900'
      }`}
      style={{
        backgroundImage: isDark
          ? `linear-gradient(rgba(9, 13, 22, 0.18), rgba(9, 13, 22, 0.3)), url(${landingBgDark})`
          : 'radial-gradient(ellipse at 80% 10%, rgba(99, 102, 241, 0.12), transparent 40%), linear-gradient(180deg, #F8FAFC 0%, #F1F5F9 100%)',
        backgroundColor: isDark ? '#090D16' : '#F8FAFC',
        backgroundSize: isDark ? 'cover' : 'auto',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        backgroundAttachment: isDark ? 'fixed' : 'scroll'
      }}
    >
      {/* Keep the fixed navbar from covering the landing page content. */}
      <div aria-hidden="true" className="h-[92px] shrink-0 xl:h-[102px]" />

      {/* 1. Neon Navigation Bar */}
      <PencilNavbar />

      {/* 2. Hero Section (with Left Column and Right Editor Preview) */}
      <main className="flex-1 flex flex-col justify-center">
        <HeroSection />
      </main>

      {/* 3. Five Feature Cards */}
      <FeatureCards />

      {/* 4. Four-column footer */}
      <Footer />
    </div>
  );
};

export default LandingPage;
