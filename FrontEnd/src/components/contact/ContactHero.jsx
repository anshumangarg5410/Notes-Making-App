import React from 'react';
import { Mail, Sparkles } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import envelopeImg from '../../assets/contact/envelope-message-glow.png';

export const ContactHero = () => {
  const { isDark } = useTheme();

  return (
    <section className="relative w-full pt-4 pb-8 sm:pb-12 text-left">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
        {/* Left Column: Heading, Eyebrow & Description */}
        <div className="lg:col-span-7 space-y-4 sm:space-y-5">
          {/* Eyebrow Badge: "Get in Touch" */}
          <div
            className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold border transition-all ${
              isDark
                ? 'bg-purple-950/40 border-purple-500/40 text-purple-300 shadow-[0_0_15px_rgba(168,85,247,0.25)]'
                : 'bg-purple-50 border-purple-300 text-purple-700 shadow-sm'
            }`}
          >
            <Mail className="w-3.5 h-3.5 text-purple-400" />
            <span>Get in Touch</span>
          </div>

          {/* Main Heading */}
          <h1
            className={`text-3xl sm:text-4xl lg:text-5xl font-serif font-extrabold tracking-tight leading-[1.15] ${
              isDark ? 'text-white' : 'text-slate-900'
            }`}
          >
            Let's Talk, <br />
            <span className="bg-gradient-to-r from-purple-400 via-fuchsia-300 to-indigo-400 bg-clip-text text-transparent">
              We're Here to Help
            </span>
          </h1>

          {/* Description */}
          <p
            className={`text-sm sm:text-base lg:text-lg leading-relaxed max-w-xl ${
              isDark ? 'text-slate-300/90' : 'text-slate-600'
            }`}
          >
            Have a question, feedback or a suggestion? We'd love to hear from you.
            Reach out to us and we'll get back to you as soon as possible.
          </p>
        </div>

        {/* Right Column: Envelope & Paper Airplane Illustration */}
        <div className="lg:col-span-5 flex items-center justify-center lg:justify-end relative">
          {/* Subtle purple radial glow backdrop */}
          <div
            className={`absolute w-64 h-64 rounded-full blur-[90px] pointer-events-none transition-opacity ${
              isDark ? 'bg-purple-600/35 opacity-90' : 'bg-purple-400/25 opacity-70'
            }`}
          />

          {/* Glowing Illustration Asset */}
          <div className="relative z-10 w-64 sm:w-80 lg:w-96 select-none group">
            <img
              src={envelopeImg}
              alt="NoteNest Contact Message"
              className="w-full h-auto object-contain drop-shadow-[0_0_35px_rgba(168,85,247,0.65)] transform hover:scale-102 transition-transform duration-300"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactHero;

