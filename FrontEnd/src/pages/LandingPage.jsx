import React, { useEffect } from 'react';
import { PencilNavbar } from '../components/landing/PencilNavbar';
import { HeroSection } from '../components/landing/HeroSection';
import { FeatureCards } from '../components/landing/FeatureCards';
import { FeaturesOverview } from '../components/landing/FeaturesOverview';
import { EditorShowcase } from '../components/landing/EditorShowcase';
import { AboutSection } from '../components/landing/AboutSection';
import { Footer } from '../components/footer/Footer';
import { SectionDivider } from '../components/landing/SectionDivider';
import { useTheme } from '../context/ThemeContext';
import landingBgDark from '../assets/landing/newbglandingpage.png';

export const LandingPage = () => {
  const { isDark, setTheme } = useTheme();

  // Ensure landing page stays in NoteNest's signature dark aesthetic
  useEffect(() => {
    if (!isDark && setTheme) {
      setTheme('dark');
    }
  }, [isDark, setTheme]);

  // Scroll to hash section if present in URL
  useEffect(() => {
    if (window.location.hash) {
      const id = window.location.hash.replace('#', '');
      const el = document.getElementById(id);
      if (el) {
        setTimeout(() => el.scrollIntoView({ behavior: 'smooth' }), 120);
      }
    }
  }, []);

  return (
    <div className="min-h-screen w-full relative flex flex-col overflow-x-hidden text-slate-100 bg-[#090D16]">
      {/* ============================================================== */}
      {/* Persistent Fixed Hero Background Layer                         */}
      {/* Stays fixed in the viewport while everything scrolls above it   */}
      {/* ============================================================== */}
      <div
        className="fixed inset-0 w-full h-full pointer-events-none z-0"
        style={{
          backgroundImage: `linear-gradient(rgba(9, 13, 22, 0.22), rgba(9, 13, 22, 0.38)), url(${landingBgDark})`,
          backgroundColor: '#090D16',
          backgroundSize: 'cover',
          backgroundPosition: 'center top',
          backgroundRepeat: 'no-repeat'
        }}
      />

      {/* ============================================================== */}
      {/* Scrollable Content Container (All sections scroll above it)   */}
      {/* ============================================================== */}
      <div className="relative z-10 flex flex-col w-full">
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
        {/* Section Divider: Hero & Feature Cards -> Features Overview     */}
        {/* ============================================================== */}
        <SectionDivider id="divider-hero-features" />

        {/* ============================================================== */}
        {/* 2. DOWNSTREAM PAGES / SECTIONS (Scroll down above background)   */}
        {/* ============================================================== */}
        {/* Features Overview Section (Interconnected Knowledge Universe) */}
        <FeaturesOverview />

        {/* ============================================================== */}
        {/* Section Divider: Features Overview -> Editor Showcase          */}
        {/* ============================================================== */}
        <SectionDivider id="divider-features-editor" />

        {/* Editor Showcase Section (Obsidian Rich-Text Editor Experience) */}
        <EditorShowcase />

        {/* ============================================================== */}
        {/* Section Divider: Editor Showcase -> About NoteNest             */}
        {/* ============================================================== */}
        <SectionDivider id="divider-editor-about" />

        {/* About NoteNest Section */}
        <AboutSection />

        {/* Four-Column Footer */}
        <Footer />
      </div>
    </div>
  );
};

export default LandingPage;
