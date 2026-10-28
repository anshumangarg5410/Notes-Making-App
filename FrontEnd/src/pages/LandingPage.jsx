import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Feather,
  ArrowRight,
  FileText,
  Plus,
  Sparkles,
  Zap,
  ShieldCheck,
  Tag,
  CheckCircle2,
  Lock,
  Download,
  Trash2,
  Star,
  Pin,
  Clock,
  Layers,
  CheckSquare
} from 'lucide-react';
import { Navbar } from '../components/navigation/Navbar';
import { Footer } from '../components/navigation/Footer';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

export const LandingPage = () => {
  const { isAuthenticated, login } = useAuth();
  const { success, error: toastError } = useToast();
  const navigate = useNavigate();
  const [demoLoading, setDemoLoading] = useState(false);

  const handleCreateNoteClick = () => {
    if (isAuthenticated) {
      navigate('/notes?action=new');
    } else {
      navigate('/login', { state: { from: { pathname: '/notes', search: '?action=new' } } });
    }
  };

  const handleDemoLogin = async () => {
    setDemoLoading(true);
    try {
      const res = await login('demo@notely.com', 'password123');
      if (res.success) {
        success('Logged in as Demo User with pre-loaded notes!');
        navigate('/notes');
      }
    } catch (err) {
      toastError(err.response?.data?.message || 'Failed to login with demo account');
    } finally {
      setDemoLoading(false);
    }
  };

  const features = [
    {
      icon: Feather,
      title: 'TipTap Rich Canvas',
      desc: 'Format naturally with H1–H3 headings, bold, italics, checklists, blockquotes, tables, and code snippets.'
    },
    {
      icon: Zap,
      title: 'Instant Debounced Autosave',
      desc: 'Never worry about losing your work. Every character is saved to the cloud in the background within 750ms.'
    },
    {
      icon: Tag,
      title: 'Smart Tags & Categories',
      desc: 'Organize notes by Study, Work, Personal, and Ideas. Filter instantly across categories and search by keyword.'
    },
    {
      icon: Pin,
      title: 'Pins & Favorites',
      desc: 'Keep high-priority ideas anchored to the top of your workspace and star essential notes for quick access.'
    },
    {
      icon: Download,
      title: 'Markdown & Text Export',
      desc: 'Download any note as a clean Markdown (.md) document or plain text file with a single click.'
    },
    {
      icon: ShieldCheck,
      title: 'Strict User Privacy',
      desc: 'Every database query enforces strict user isolation. Your thoughts and notes belong only to you.'
    }
  ];

  return (
    <div className="min-h-screen bg-warm-bg dark:bg-charcoal-950 text-charcoal-900 dark:text-cream-50 flex flex-col font-sans transition-colors">
      <Navbar />

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-12 pb-20 md:pt-20 md:pb-28 border-b border-warm-border dark:border-charcoal-800">
        {/* Subtle decorative glow */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[300px] bg-gradient-to-tr from-indigo-500/10 via-violet-500/10 to-transparent blur-3xl pointer-events-none rounded-full" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-3xl mx-auto space-y-6">
            {/* Pill Badge */}
            <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800/60 shadow-xs">
              <Sparkles className="w-3.5 h-3.5 text-indigo-500" />
              <span>Full-Stack MERN Knowledge Base</span>
            </div>

            {/* Main Headline */}
            <h1 className="font-serif font-bold text-4xl sm:text-5xl lg:text-6xl tracking-tight text-charcoal-900 dark:text-cream-50 leading-[1.15]">
              Capture every idea. <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 via-indigo-500 to-violet-600 dark:from-indigo-400 dark:via-indigo-300 dark:to-violet-400">
                Organize without chaos.
              </span>
            </h1>

            {/* Description */}
            <p className="text-base sm:text-lg text-charcoal-600 dark:text-charcoal-300 leading-relaxed max-w-2xl mx-auto">
              Notely is an editorial workspace built for thinkers, writers, and developers.
              Enjoy effortless rich-text editing, real-time cloud autosave, intelligent tags,
              and strict privacy for all your notes.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-4">
              <button
                onClick={handleCreateNoteClick}
                id="hero-create-note-btn"
                className="w-full sm:w-auto px-6 py-3.5 bg-gradient-to-r from-indigo-500 via-indigo-600 to-violet-600 hover:from-indigo-600 hover:to-violet-700 text-white rounded-2xl font-semibold text-sm flex items-center justify-center space-x-2 shadow-lg shadow-indigo-500/25 hover:shadow-indigo-500/35 transition-all duration-200 active:scale-[0.98] group"
              >
                <Plus className="w-4 h-4 stroke-[2.5] group-hover:rotate-90 transition-transform duration-200" />
                <span>Create a Note</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>

              <Link
                to="/notes"
                id="hero-view-notes-btn"
                className="w-full sm:w-auto px-6 py-3.5 bg-warm-card dark:bg-charcoal-800 border border-warm-border dark:border-charcoal-700 hover:bg-cream-100 dark:hover:bg-charcoal-700 text-charcoal-800 dark:text-cream-50 rounded-2xl font-semibold text-sm flex items-center justify-center space-x-2 shadow-xs transition-all duration-200"
              >
                <FileText className="w-4 h-4 text-indigo-500" />
                <span>View My Notes</span>
              </Link>

              {!isAuthenticated && (
                <button
                  onClick={handleDemoLogin}
                  disabled={demoLoading}
                  className="w-full sm:w-auto px-5 py-3.5 text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 bg-indigo-50/60 dark:bg-indigo-950/40 border border-indigo-200/60 dark:border-indigo-800/40 rounded-2xl transition-colors flex items-center justify-center space-x-1.5"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>{demoLoading ? 'Logging into Demo...' : 'Try 1-Click Demo'}</span>
                </button>
              )}
            </div>

            {/* Quick Benefits list */}
            <div className="flex flex-wrap items-center justify-center gap-6 pt-4 text-xs text-charcoal-500 dark:text-charcoal-400">
              <span className="flex items-center space-x-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                <span>Autosave Enabled</span>
              </span>
              <span className="flex items-center space-x-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                <span>No Credit Card Required</span>
              </span>
              <span className="flex items-center space-x-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                <span>Encrypted Credentials</span>
              </span>
            </div>
          </div>

          {/* Hero Workspace Mockup Preview */}
          <div className="mt-14 max-w-4xl mx-auto rounded-3xl border border-warm-border/80 dark:border-charcoal-700/80 bg-warm-card dark:bg-charcoal-900 shadow-2xl overflow-hidden">
            {/* Mock Window Top Bar */}
            <div className="px-5 py-3 border-b border-warm-border/70 dark:border-charcoal-800 bg-cream-100/50 dark:bg-charcoal-800/50 flex items-center justify-between text-xs">
              <div className="flex items-center space-x-2">
                <span className="w-3 h-3 rounded-full bg-red-400/80 inline-block" />
                <span className="w-3 h-3 rounded-full bg-amber-400/80 inline-block" />
                <span className="w-3 h-3 rounded-full bg-emerald-400/80 inline-block" />
                <span className="ml-2 font-mono text-[11px] text-charcoal-400 dark:text-charcoal-500">
                  notely.app/workspace
                </span>
              </div>
              <div className="flex items-center space-x-3 text-[11px] text-charcoal-500 dark:text-charcoal-400">
                <span className="inline-flex items-center space-x-1 text-emerald-600 dark:text-emerald-400">
                  <CheckCircle2 className="w-3 h-3" />
                  <span>Autosaved</span>
                </span>
                <span className="font-mono">142 words</span>
              </div>
            </div>

            {/* Mock Editor Canvas */}
            <div className="p-6 md:p-8 space-y-4">
              <div className="flex items-center justify-between">
                <span className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 border border-indigo-200/60 dark:border-indigo-800/60">
                  Study & Research
                </span>
                <div className="flex items-center space-x-1.5 text-charcoal-400">
                  <Pin className="w-4 h-4 text-indigo-500" />
                  <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
                </div>
              </div>

              <h2 className="font-serif font-bold text-2xl md:text-3xl text-charcoal-900 dark:text-cream-50">
                Product Architecture & Distributed Knowledge Base
              </h2>

              <div className="space-y-2 text-sm text-charcoal-600 dark:text-charcoal-300 leading-relaxed">
                <p>
                  High-performance applications require immediate feedback loops. Notely couples a
                  clean prose canvas with debounced background synchronization:
                </p>
                <div className="space-y-1.5 pt-1 pl-1">
                  <div className="flex items-center space-x-2 text-charcoal-700 dark:text-cream-200">
                    <CheckSquare className="w-4 h-4 text-indigo-500 flex-shrink-0" />
                    <span>Autosave every edit with 750ms debounce window</span>
                  </div>
                  <div className="flex items-center space-x-2 text-charcoal-700 dark:text-cream-200">
                    <CheckSquare className="w-4 h-4 text-indigo-500 flex-shrink-0" />
                    <span>Isolate each user&apos;s records at the MongoDB layer</span>
                  </div>
                  <div className="flex items-center space-x-2 text-charcoal-700 dark:text-cream-200">
                    <CheckSquare className="w-4 h-4 text-indigo-500 flex-shrink-0" />
                    <span>Export to Markdown or Plaintext with one click</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid Section */}
      <section id="features" className="py-20 md:py-28 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
          <h2 className="font-serif font-bold text-3xl sm:text-4xl text-charcoal-900 dark:text-cream-50">
            Engineered for thoughtful writers
          </h2>
          <p className="text-sm sm:text-base text-charcoal-500 dark:text-charcoal-400">
            Everything you need to write, organize, and retrieve your thoughts in seconds.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {features.map((feat, idx) => {
            const Icon = feat.icon;
            return (
              <div
                key={idx}
                className="p-6 md:p-7 rounded-3xl bg-warm-card dark:bg-charcoal-900 border border-warm-border dark:border-charcoal-800 hover:border-indigo-400/60 dark:hover:border-indigo-600/60 transition-all duration-200 shadow-sm hover:shadow-card group"
              >
                <div className="w-11 h-11 rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform duration-200 border border-indigo-100 dark:border-indigo-900/40">
                  <Icon className="w-5 h-5" />
                </div>
                <h3 className="font-serif font-bold text-lg text-charcoal-900 dark:text-cream-50 mb-2">
                  {feat.title}
                </h3>
                <p className="text-xs sm:text-sm text-charcoal-500 dark:text-charcoal-400 leading-relaxed">
                  {feat.desc}
                </p>
              </div>
            );
          })}
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-16 md:py-24 bg-cream-100/40 dark:bg-charcoal-900/60 border-y border-warm-border dark:border-charcoal-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12 space-y-2">
            <h2 className="font-serif font-bold text-2xl sm:text-3xl text-charcoal-900 dark:text-cream-50">
              Three simple steps to clarity
            </h2>
            <p className="text-xs sm:text-sm text-charcoal-500 dark:text-charcoal-400">
              Streamlined workflow designed to keep you in flow state.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center space-y-3 p-6 rounded-2xl bg-warm-card dark:bg-charcoal-800/80 border border-warm-border dark:border-charcoal-700/60">
              <div className="w-10 h-10 mx-auto rounded-xl bg-indigo-600 text-white font-bold text-sm flex items-center justify-center shadow-md shadow-indigo-500/20">
                1
              </div>
              <h3 className="font-serif font-bold text-base text-charcoal-900 dark:text-cream-50">
                Write Freely
              </h3>
              <p className="text-xs text-charcoal-500 dark:text-charcoal-400 leading-relaxed">
                Click Add Note and start typing. TipTap formats markdown elements instantly with zero lag.
              </p>
            </div>

            <div className="text-center space-y-3 p-6 rounded-2xl bg-warm-card dark:bg-charcoal-800/80 border border-warm-border dark:border-charcoal-700/60">
              <div className="w-10 h-10 mx-auto rounded-xl bg-violet-600 text-white font-bold text-sm flex items-center justify-center shadow-md shadow-violet-500/20">
                2
              </div>
              <h3 className="font-serif font-bold text-base text-charcoal-900 dark:text-cream-50">
                Organize Instantly
              </h3>
              <p className="text-xs text-charcoal-500 dark:text-charcoal-400 leading-relaxed">
                Assign categories like Work or Ideas, color-code your card, and pin crucial notes to the top.
              </p>
            </div>

            <div className="text-center space-y-3 p-6 rounded-2xl bg-warm-card dark:bg-charcoal-800/80 border border-warm-border dark:border-charcoal-700/60">
              <div className="w-10 h-10 mx-auto rounded-xl bg-indigo-500 text-white font-bold text-sm flex items-center justify-center shadow-md shadow-indigo-500/20">
                3
              </div>
              <h3 className="font-serif font-bold text-base text-charcoal-900 dark:text-cream-50">
                Access & Export
              </h3>
              <p className="text-xs text-charcoal-500 dark:text-charcoal-400 leading-relaxed">
                Retrieve any note with instant fuzzy search or export cleanly to .md and .txt whenever needed.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action Banner */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-600 via-indigo-700 to-violet-800 text-white p-8 sm:p-12 md:p-16 text-center space-y-6 shadow-xl shadow-indigo-500/15">
          <h2 className="font-serif font-bold text-3xl sm:text-4xl lg:text-5xl max-w-xl mx-auto leading-tight">
            Ready to give your ideas a permanent home?
          </h2>
          <p className="text-indigo-100 text-sm sm:text-base max-w-md mx-auto leading-relaxed">
            Open the notes dashboard right now and start organizing your knowledge base.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <Link
              to="/notes"
              className="w-full sm:w-auto px-7 py-3.5 bg-white text-indigo-700 hover:bg-cream-50 font-semibold text-sm rounded-2xl shadow-md transition-all active:scale-[0.98]"
            >
              Open Notes Dashboard
            </Link>
            {!isAuthenticated && (
              <Link
                to="/register"
                className="w-full sm:w-auto px-7 py-3.5 bg-indigo-900/60 hover:bg-indigo-900/80 text-white border border-indigo-300/30 font-semibold text-sm rounded-2xl transition-all"
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
