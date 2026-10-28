import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  ArrowRight,
  Play,
  CheckCircle2,
  Zap,
  Cloud,
  FileText,
  Link2,
  Image as ImageIcon,
  CheckSquare,
  Sparkles,
  BookOpen,
  Laptop,
  Folder
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';

export const HeroSection = () => {
  const { isAuthenticated, login, user } = useAuth();
  const { success, error: toastError } = useToast();
  const navigate = useNavigate();
  const [demoLoading, setDemoLoading] = useState(false);
  const [quickInput, setQuickInput] = useState('');

  const displayName = user?.name ? user.name.split(' ')[0] : 'Anshuman';

  const handleStartWriting = () => {
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
        success('Logged into demo workspace!');
        navigate('/notes');
      }
    } catch (err) {
      toastError(err.response?.data?.message || 'Demo login failed');
    } finally {
      setDemoLoading(false);
    }
  };

  const handleQuickCapture = (type = 'Note') => {
    if (isAuthenticated) {
      navigate(`/notes?action=new&title=${encodeURIComponent(quickInput || 'Quick Idea')}`);
    } else {
      handleStartWriting();
    }
  };

  return (
    <section className="relative overflow-hidden pt-8 pb-16 md:pt-14 md:pb-24 bg-gradient-to-b from-[#FFF5EC] via-[#FDF9F4] to-[#FBF9F5] dark:from-[#1E1712] dark:via-[#161413] dark:to-[#121316] select-none transition-colors border-b border-[#F0EBE1] dark:border-[#262422]">
      {/* Ambient background glow */}
      <div className="absolute top-10 left-1/4 w-[500px] h-[350px] bg-orange-400/15 dark:bg-orange-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-20 right-10 w-[400px] h-[300px] bg-amber-400/15 dark:bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-8 items-center">
          
          {/* Left Column: Headline & Action Buttons */}
          <div className="lg:col-span-5 space-y-6 text-center lg:text-left">
            {/* Pill Tag */}
            <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-orange-100/80 dark:bg-orange-950/60 text-orange-700 dark:text-orange-300 border border-orange-200/80 dark:border-orange-900/50">
              <Sparkles className="w-3.5 h-3.5 text-orange-600 dark:text-orange-400" />
              <span>Your Second Brain</span>
            </div>

            {/* Big Headline */}
            <h1 className="font-serif font-extrabold text-4xl sm:text-5xl lg:text-5xl xl:text-6xl text-[#1E1E1E] dark:text-[#FAF8F5] leading-[1.12] tracking-tight">
              Capture Ideas. <br />
              Connect Knowledge. <br />
              <span className="text-orange-600 dark:text-orange-400">
                Remember Forever.
              </span>
            </h1>

            {/* Subtitle */}
            <p className="text-sm sm:text-base text-[#6E6C66] dark:text-[#A8A59E] leading-relaxed max-w-lg mx-auto lg:mx-0">
              A modern note-taking app that helps you write, organize, understand and actually use your knowledge with the power of AI.
            </p>

            {/* Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3 pt-2">
              <button
                onClick={handleStartWriting}
                id="hero-get-started-btn"
                className="w-full sm:w-auto px-7 py-3.5 bg-gradient-to-r from-orange-600 via-orange-500 to-amber-600 hover:from-orange-700 hover:to-amber-700 text-white rounded-2xl font-semibold text-sm flex items-center justify-center space-x-2 shadow-lg shadow-orange-500/25 hover:shadow-orange-500/35 transition-all active:scale-[0.98]"
              >
                <span>Get Started</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={handleDemoLogin}
                disabled={demoLoading}
                className="w-full sm:w-auto px-6 py-3.5 bg-white dark:bg-[#1E2026] border border-[#E5E0D5] dark:border-[#2E313A] hover:bg-[#F8F5EE] dark:hover:bg-[#282B33] text-[#333] dark:text-[#EEE] rounded-2xl font-semibold text-sm flex items-center justify-center space-x-2 shadow-xs transition-all"
              >
                <Play className="w-3.5 h-3.5 fill-current text-orange-500" />
                <span>{demoLoading ? 'Opening Demo...' : 'Watch Demo'}</span>
              </button>
            </div>

            {/* Trust Checks */}
            <div className="flex items-center justify-center lg:justify-start gap-5 pt-3 text-xs text-[#7A7872] dark:text-[#9A9893] font-medium">
              <div className="flex items-center space-x-1.5">
                <CheckCircle2 className="w-4 h-4 text-orange-500" />
                <span>Free to start</span>
              </div>
              <div className="flex items-center space-x-1.5">
                <Zap className="w-4 h-4 text-orange-500" />
                <span>AI-powered</span>
              </div>
              <div className="flex items-center space-x-1.5">
                <Cloud className="w-4 h-4 text-orange-500" />
                <span>Sync across devices</span>
              </div>
            </div>
          </div>

          {/* Right Column: Floating 3D Dashboard Mockup Card */}
          <div className="lg:col-span-7 relative">
            {/* Tilted Floating Mockup Container */}
            <div className="relative rounded-3xl border border-[#E8E2D5] dark:border-[#2D2E36] bg-white dark:bg-[#181A20] shadow-2xl p-5 sm:p-7 space-y-5 transition-transform duration-300 hover:scale-[1.01]">
              
              {/* Header Greeting */}
              <div className="flex items-center justify-between pb-3 border-b border-[#F0EBE0] dark:border-[#252731]">
                <div>
                  <h3 className="font-serif font-bold text-lg sm:text-xl text-[#222] dark:text-[#FAF8F5]">
                    Good morning, {displayName} 👋
                  </h3>
                  <p className="text-xs text-[#88857E] dark:text-[#7A7C85]">
                    Capture ideas, connect knowledge
                  </p>
                </div>
                <button
                  onClick={handleStartWriting}
                  className="px-3.5 py-1.5 bg-orange-600 hover:bg-orange-700 text-white rounded-xl text-xs font-semibold shadow-xs flex items-center space-x-1 transition-colors"
                >
                  <FileText className="w-3.5 h-3.5" />
                  <span>+ New Note</span>
                </button>
              </div>

              {/* Quick Capture Card */}
              <div className="rounded-2xl border border-[#EBE5DA] dark:border-[#272933] bg-[#FAF8F4] dark:bg-[#1C1E26] p-4 space-y-3">
                <div className="flex items-center justify-between text-xs font-semibold text-[#55534E] dark:text-[#C5C2BA]">
                  <span>Quick Capture</span>
                  <span className="text-[11px] text-orange-600 dark:text-orange-400 font-mono">⌘ K</span>
                </div>
                <input
                  type="text"
                  placeholder="Jot down an idea, paste a link, or write anything..."
                  value={quickInput}
                  onChange={(e) => setQuickInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleQuickCapture()}
                  className="w-full px-3 py-2 bg-white dark:bg-[#15171D] border border-[#E0DAD0] dark:border-[#2B2D37] rounded-xl text-xs placeholder:text-[#9A9893] text-[#222] dark:text-[#EEE] focus:outline-none focus:ring-1 focus:ring-orange-500"
                />
                <div className="flex items-center space-x-2 text-xs">
                  <button
                    onClick={() => handleQuickCapture('Note')}
                    className="px-2.5 py-1 rounded-lg bg-white dark:bg-[#23252E] border border-[#E5DFD4] dark:border-[#2D303B] hover:border-orange-400 text-[#555] dark:text-[#CCC] flex items-center space-x-1"
                  >
                    <FileText className="w-3 h-3 text-orange-500" />
                    <span>Note</span>
                  </button>
                  <button
                    onClick={() => handleQuickCapture('Link')}
                    className="px-2.5 py-1 rounded-lg bg-white dark:bg-[#23252E] border border-[#E5DFD4] dark:border-[#2D303B] hover:border-orange-400 text-[#555] dark:text-[#CCC] flex items-center space-x-1"
                  >
                    <Link2 className="w-3 h-3 text-blue-500" />
                    <span>Link</span>
                  </button>
                  <button
                    onClick={() => handleQuickCapture('Image')}
                    className="px-2.5 py-1 rounded-lg bg-white dark:bg-[#23252E] border border-[#E5DFD4] dark:border-[#2D303B] hover:border-orange-400 text-[#555] dark:text-[#CCC] flex items-center space-x-1"
                  >
                    <ImageIcon className="w-3 h-3 text-emerald-500" />
                    <span>Image</span>
                  </button>
                  <button
                    onClick={() => handleQuickCapture('Checklist')}
                    className="px-2.5 py-1 rounded-lg bg-white dark:bg-[#23252E] border border-[#E5DFD4] dark:border-[#2D303B] hover:border-orange-400 text-[#555] dark:text-[#CCC] flex items-center space-x-1"
                  >
                    <CheckSquare className="w-3 h-3 text-purple-500" />
                    <span>Checklist</span>
                  </button>
                </div>
              </div>

              {/* Recent Notes Grid */}
              <div className="space-y-2">
                <span className="text-[11px] font-semibold uppercase tracking-wider text-[#98958E] dark:text-[#7A7C85]">
                  Recent Notes
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                  <div
                    onClick={() => navigate('/notes')}
                    className="p-3 rounded-xl border border-[#E8E2D5] dark:border-[#282A33] bg-[#FAF8F4] dark:bg-[#1A1C22] hover:border-orange-400 dark:hover:border-orange-600 transition-all cursor-pointer space-y-1"
                  >
                    <div className="flex items-center space-x-1.5 text-xs font-semibold text-[#222] dark:text-[#FAF8F5]">
                      <span className="w-2 h-2 rounded-full bg-orange-500" />
                      <span className="truncate">Dijkstra&apos;s Algorithm</span>
                    </div>
                    <p className="text-[10px] text-[#88857E] dark:text-[#7A7C85]">
                      DSA Notes • 2h ago
                    </p>
                  </div>

                  <div
                    onClick={() => navigate('/notes')}
                    className="p-3 rounded-xl border border-[#E8E2D5] dark:border-[#282A33] bg-[#FAF8F4] dark:bg-[#1A1C22] hover:border-emerald-400 dark:hover:border-emerald-600 transition-all cursor-pointer space-y-1"
                  >
                    <div className="flex items-center space-x-1.5 text-xs font-semibold text-[#222] dark:text-[#FAF8F5]">
                      <span className="w-2 h-2 rounded-full bg-emerald-500" />
                      <span className="truncate">System Design Basics</span>
                    </div>
                    <p className="text-[10px] text-[#88857E] dark:text-[#7A7C85]">
                      System Design • 1d ago
                    </p>
                  </div>

                  <div
                    onClick={() => navigate('/notes')}
                    className="p-3 rounded-xl border border-[#E8E2D5] dark:border-[#282A33] bg-[#FAF8F4] dark:bg-[#1A1C22] hover:border-purple-400 dark:hover:border-purple-600 transition-all cursor-pointer space-y-1"
                  >
                    <div className="flex items-center space-x-1.5 text-xs font-semibold text-[#222] dark:text-[#FAF8F5]">
                      <span className="w-2 h-2 rounded-full bg-purple-500" />
                      <span className="truncate">My AI Project Ideas</span>
                    </div>
                    <p className="text-[10px] text-[#88857E] dark:text-[#7A7C85]">
                      Personal • 3d ago
                    </p>
                  </div>
                </div>
              </div>

              {/* Continue Learning Cards */}
              <div className="space-y-2">
                <span className="text-[11px] font-semibold uppercase tracking-wider text-[#98958E] dark:text-[#7A7C85]">
                  Continue Learning
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  <div
                    onClick={() => navigate('/notes')}
                    className="p-3 rounded-xl border border-[#E8E2D5] dark:border-[#282A33] bg-[#FAF8F4] dark:bg-[#1A1C22] flex items-center justify-between cursor-pointer hover:border-orange-300"
                  >
                    <div className="space-y-1">
                      <span className="text-xs font-semibold text-[#222] dark:text-[#FAF8F5] block">
                        Graph Algorithms
                      </span>
                      <span className="text-[10px] text-[#88857E] dark:text-[#7A7C85]">
                        12 cards • 80% complete
                      </span>
                    </div>
                    <div className="w-16 h-1.5 rounded-full bg-orange-100 dark:bg-orange-950/80 overflow-hidden">
                      <div className="w-4/5 h-full bg-orange-500 rounded-full" />
                    </div>
                  </div>

                  <div
                    onClick={() => navigate('/notes')}
                    className="p-3 rounded-xl border border-[#E8E2D5] dark:border-[#282A33] bg-[#FAF8F4] dark:bg-[#1A1C22] flex items-center justify-between cursor-pointer hover:border-blue-300"
                  >
                    <div className="space-y-1">
                      <span className="text-xs font-semibold text-[#222] dark:text-[#FAF8F5] block">
                        Operating Systems
                      </span>
                      <span className="text-[10px] text-[#88857E] dark:text-[#7A7C85]">
                        8 cards • 60% complete
                      </span>
                    </div>
                    <div className="w-16 h-1.5 rounded-full bg-blue-100 dark:bg-blue-950/80 overflow-hidden">
                      <div className="w-3/5 h-full bg-blue-500 rounded-full" />
                    </div>
                  </div>
                </div>
              </div>

            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
