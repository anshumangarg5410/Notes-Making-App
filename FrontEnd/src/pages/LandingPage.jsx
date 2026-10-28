import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowRight, Sparkles } from 'lucide-react';
import { Navbar } from '../components/navigation/Navbar';
import { Footer } from '../components/navigation/Footer';
import { useAuth } from '../context/AuthContext';

// Modular Landing Page Sections matching User Mockup
import { HeroSection } from '../components/landing/HeroSection';
import { FeatureBadges } from '../components/landing/FeatureBadges';
import { EditorShowcase } from '../components/landing/EditorShowcase';
import { AiAssistantSection } from '../components/landing/AiAssistantSection';
import { KnowledgeGraphSection } from '../components/landing/KnowledgeGraphSection';
import { FlashcardsSection } from '../components/landing/FlashcardsSection';
import { EverythingSection } from '../components/landing/EverythingSection';

// Clipart Assets
import readingStudent from '../assets/landing/reading-student.png';
import coffeeBooks from '../assets/landing/coffee-books.png';
import codePencil from '../assets/landing/code-pencil.png';
import paperAirplane from '../assets/shared/paper-airplane.png';
import heroBgDark from '../assets/landing/backgrounds/hero-bg-dark.png';

export const LandingPage = () => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#FDFBF7] dark:bg-[#121316] text-[#2E2E2E] dark:text-[#F3F1EC] flex flex-col font-sans transition-colors selection:bg-orange-500/20">
      <Navbar />

      {/* 1. Hero Section: Headline, CTAs & 3D Floating Dashboard Card */}
      <HeroSection />

      {/* 2. "More than just a note-taking app": 6 Category Badges */}
      <FeatureBadges />

      {/* 3. "A powerful editor for deeper thinking": Block Editor Showcase */}
      <EditorShowcase />

      {/* 4. "Your personal AI knowledge assistant": Grounded AI Assistant */}
      <AiAssistantSection />

      {/* 5. "Visualize your knowledge": Interactive Dark Knowledge Graph */}
      <KnowledgeGraphSection />

      {/* 6. "Turn notes into long-term knowledge": Interactive Flashcards */}
      <FlashcardsSection />

      {/* 7. "Everything in one place": 6 Bottom Pillars */}
      <EverythingSection />

      {/* Clipart Cozy Reading & Growth Showcase */}
      <section className="py-12 bg-[#F6F2EA]/60 dark:bg-[#16171D] border-y border-[#ECE7DC] dark:border-[#242632] select-none">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
            
            <div className="flex items-center space-x-4 p-5 rounded-2xl bg-white dark:bg-[#1B1D24] border border-[#E8E3D8] dark:border-[#2A2C38] shadow-xs">
              <img src={readingStudent} alt="Student learning" className="w-14 h-14 object-contain flex-shrink-0" />
              <div>
                <h4 className="font-serif font-bold text-sm text-[#222] dark:text-[#FAF8F5]">
                  Distraction Free
                </h4>
                <p className="text-xs text-[#666] dark:text-[#9A9893] mt-1">
                  Minimal chrome so you can enter deep flow state without interruptions.
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-4 p-5 rounded-2xl bg-white dark:bg-[#1B1D24] border border-[#E8E3D8] dark:border-[#2A2C38] shadow-xs">
              <img src={coffeeBooks} alt="Coffee and books" className="w-14 h-14 object-contain flex-shrink-0" />
              <div>
                <h4 className="font-serif font-bold text-sm text-[#222] dark:text-[#FAF8F5]">
                  Organized by Default
                </h4>
                <p className="text-xs text-[#666] dark:text-[#9A9893] mt-1">
                  Tags, categories, and smart search keep every note instantly within reach.
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-4 p-5 rounded-2xl bg-white dark:bg-[#1B1D24] border border-[#E8E3D8] dark:border-[#2A2C38] shadow-xs">
              <img src={codePencil} alt="Code and pencil" className="w-14 h-14 object-contain flex-shrink-0" />
              <div>
                <h4 className="font-serif font-bold text-sm text-[#222] dark:text-[#FAF8F5]">
                  Developer Ready
                </h4>
                <p className="text-xs text-[#666] dark:text-[#9A9893] mt-1">
                  Code blocks, markdown export, and clean keyboard shortcuts.
                </p>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Call to Action Banner */}
      <section className="py-16 md:py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 select-none">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-orange-600 via-orange-500 to-amber-600 text-white p-8 sm:p-12 md:p-14 text-center space-y-6 shadow-2xl shadow-orange-500/20">
          {/* Background Ambient Glow & Curves Overlay */}
          <div
            className="absolute inset-0 bg-cover bg-center opacity-30 mix-blend-overlay pointer-events-none"
            style={{ backgroundImage: `url(${heroBgDark})` }}
          />
          <img src={paperAirplane} alt="Paper airplane flying" className="w-14 h-14 mx-auto object-contain drop-shadow-md relative z-10" />
          
          <h2 className="font-serif font-extrabold text-3xl sm:text-4xl lg:text-5xl max-w-xl mx-auto leading-tight">
            Ready to give your ideas a permanent home?
          </h2>
          <p className="text-orange-100 text-sm sm:text-base max-w-md mx-auto leading-relaxed">
            Open your notes workspace right now and turn fleeting thoughts into lasting knowledge.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <Link
              to="/notes"
              id="cta-open-dashboard"
              className="w-full sm:w-auto px-7 py-3.5 bg-white text-orange-600 hover:bg-[#FFF8F3] font-semibold text-sm rounded-2xl shadow-md transition-all active:scale-[0.98] flex items-center justify-center space-x-2"
            >
              <span>Open Notes Workspace</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
            {!isAuthenticated && (
              <Link
                to="/register"
                id="cta-register"
                className="w-full sm:w-auto px-7 py-3.5 bg-orange-700/80 hover:bg-orange-800 text-white border border-orange-300/30 font-semibold text-sm rounded-2xl transition-all"
              >
                Create Free Account
              </Link>
            )}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};
