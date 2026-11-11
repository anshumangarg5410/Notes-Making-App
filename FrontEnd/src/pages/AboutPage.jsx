import React, { useEffect } from 'react';
import { PencilNavbar } from '../components/landing/PencilNavbar';
import { AboutHero } from '../components/about/AboutHero';
import { AboutMissionCards } from '../components/about/AboutMissionCards';
import { AboutCapabilities } from '../components/about/AboutCapabilities';
import { AboutStory } from '../components/about/AboutStory';
import { Footer } from '../components/footer/Footer';
import { useTheme } from '../context/ThemeContext';
import landingBgDark from '../assets/landing/hero-bg-dark.png';

export const AboutPage = () => {
  const { isDark } = useTheme();

  // Scroll to top on mount
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div
      className={`min-h-screen w-full relative flex flex-col overflow-x-hidden transition-colors duration-300 ${
        isDark ? 'text-slate-100 bg-[#090D16]' : 'text-slate-900 bg-[#FAF8F5]'
      }`}
    >
      {/* ============================================================== */}
      {/* 1. CRITICAL: EXACT SAME HERO BACKGROUND AS LANDING PAGE        */}
      {/* Reusing exact same asset & positioning as LandingPage.jsx      */}
      {/* ============================================================== */}
      <div
        className="fixed inset-0 w-full h-full pointer-events-none z-0"
        style={{
          backgroundImage: `linear-gradient(rgba(9, 13, 22, ${isDark ? '0.22' : '0.86'}), rgba(9, 13, 22, ${isDark ? '0.38' : '0.92'})), url(${landingBgDark})`,
          backgroundColor: isDark ? '#090D16' : '#FAF8F5',
          backgroundSize: 'cover',
          backgroundPosition: 'center top',
          backgroundRepeat: 'no-repeat'
        }}
      />

      {/* ============================================================== */}
      {/* 2. SCROLLABLE PAGE CONTENT (Scrolls smoothly above background) */}
      {/* ============================================================== */}
      <div className="relative z-10 flex flex-col min-h-screen justify-between w-full">
        {/* Fixed Navbar Spacer */}
        <div aria-hidden="true" className="h-[88px] shrink-0 sm:h-[96px] xl:h-[106px]" />

        {/* Existing Landing Page Pencil Navbar */}
        <PencilNavbar />

        {/* Main Content Area */}
        <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-4 sm:py-8 lg:py-10 space-y-8 sm:space-y-12">
          {/* Section 1: Introductory Hero */}
          <AboutHero />

          {/* Section 2: Mission, Vision and Values (3 Cards) */}
          <AboutMissionCards />

          {/* Section 3: Genuine Product Capabilities (Horizontal Bar) */}
          <AboutCapabilities />

          {/* Section 4: The NoteNest Story */}
          <AboutStory />
        </main>

        {/* Existing Website Footer */}
        <Footer />
      </div>
    </div>
  );
};

export default AboutPage;

