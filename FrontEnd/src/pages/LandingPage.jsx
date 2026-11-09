import React from 'react';
import { PencilNavbar } from '../components/landing/PencilNavbar';
import { HeroSection } from '../components/landing/HeroSection';
import { FeatureCards } from '../components/landing/FeatureCards';
import { FeaturesOverview } from '../components/landing/FeaturesOverview';
import { EditorShowcase } from '../components/landing/EditorShowcase';
import { Footer } from '../components/footer/Footer';
import { useTheme } from '../context/ThemeContext';
import landingBgDark from '../assets/landing/hero-bg-dark.png';

export const LandingPage = () => {
  const { isDark } = useTheme();

  return (
    <div
      className={`min-h-screen w-full relative flex flex-col overflow-x-hidden transition-colors duration-300 ${
        isDark ? 'text-slate-100' : 'text-slate-900'
      }`}
      style={{
        backgroundImage: isDark
          ? `linear-gradient(rgba(9, 13, 22, 0.18), rgba(9, 13, 22, 0.3)), url(${landingBgDark})`
          : 'radial-gradient(ellipse at 82% 4%, rgba(192, 132, 252, 0.16), transparent 38%), radial-gradient(ellipse at 8% 52%, rgba(251, 191, 36, 0.06), transparent 34%), linear-gradient(180deg, #FFFAFF 0%, #FBF7FF 55%, #F8F3FF 100%)',
        backgroundColor: isDark ? '#090D16' : '#FFFAFF',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        backgroundAttachment: 'fixed'
      }}
    >
      {/* ============================================================== */}
      {/* 1. FULL-SCREEN HERO VIEWPORT (Covers 100vh on Initial Load)    */}
      {/* ============================================================== */}
      <div className="min-h-screen w-full flex flex-col justify-between relative">
        {/* Fixed navbar height offset */}
        <div aria-hidden="true" className="h-[92px] shrink-0 xl:h-[102px]" />

        {/* Floating Pencil Navbar */}
        <PencilNavbar />

        {/* Hero Section (Left copy, CTA & Right Editor Preview) */}
        <main className="flex-1 flex flex-col justify-center my-auto">
          <HeroSection />
        </main>

        {/* Five Square Feature Cards at the bottom of the Hero screen */}
        <FeatureCards />
      </div>

      {/* ============================================================== */}
      {/* 2. DOWNSTREAM PAGES / SECTIONS (Scroll down to reveal)          */}
      {/* ============================================================== */}
      {/* Features Overview Section (Interconnected Knowledge Universe) */}
      <FeaturesOverview />

      {/* Editor Showcase Section (Obsidian Rich-Text Editor Experience) */}
      <EditorShowcase />

      {/* Four-Column Footer */}
      <Footer />
    </div>
  );
};

export default LandingPage;
