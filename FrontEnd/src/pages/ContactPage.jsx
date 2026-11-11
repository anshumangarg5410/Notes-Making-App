import React, { useEffect } from 'react';
import { PencilNavbar } from '../components/landing/PencilNavbar';
import { ContactHero } from '../components/contact/ContactHero';
import { ContactForm } from '../components/contact/ContactForm';
import { ContactInfoCards } from '../components/contact/ContactInfoCards';
import { Footer } from '../components/footer/Footer';
import { useTheme } from '../context/ThemeContext';
import landingBgDark from '../assets/landing/newbglandingpage.png';

export const ContactPage = () => {
  const { isDark } = useTheme();

  // Scroll to top on page load
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
        <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-4 sm:py-8 lg:py-10">
          {/* Section 1: Contact Hero (Title & Glowing Envelope Illustration) */}
          <ContactHero />

          {/* Section 2: Contact Form & Reach Us Information Cards */}
          <div className="mt-6 sm:mt-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Left 7 Columns: Interactive Contact Form */}
            <div className="lg:col-span-7 w-full">
              <ContactForm />
            </div>

            {/* Right 5 Columns: Other Ways to Reach Us & Quick Response Cards */}
            <div className="lg:col-span-5 w-full">
              <ContactInfoCards />
            </div>
          </div>
        </main>

        {/* Existing Website Footer */}
        <Footer />
      </div>
    </div>
  );
};

export default ContactPage;

