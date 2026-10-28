import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Feather,
  ArrowRight,
  Plus,
  Sparkles,
  Share2,
  List,
  LayoutGrid,
  Columns,
  MoreHorizontal,
  Search,
  Inbox,
  FileText,
  Folder,
  Send,
  CheckCircle2,
  Zap,
  Tag,
  ShieldCheck,
  Download,
  BookOpen,
  HelpCircle,
  Volume2,
  CheckSquare,
  Lock,
  ArrowUpRight
} from 'lucide-react';
import { Navbar } from '../components/navigation/Navbar';
import { Footer } from '../components/navigation/Footer';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

// Clipart pack imports
import heroStudent from '../assets/landing/hero-student.png';
import notebookMascot from '../assets/landing/notebook-mascot.png';
import docCard from '../assets/landing/doc-card.png';
import knowledgeGraph from '../assets/landing/knowledge-graph.png';
import flashcards from '../assets/landing/flashcards.png';
import smartSearch from '../assets/landing/smart-search.png';
import cloudSync from '../assets/landing/cloud-sync.png';
import readingStudent from '../assets/landing/reading-student.png';
import growthChart from '../assets/landing/growth-chart.png';
import coffeeBooks from '../assets/landing/coffee-books.png';
import codePencil from '../assets/landing/code-pencil.png';
import aiBot from '../assets/shared/ai-bot.png';
import paperAirplane from '../assets/shared/paper-airplane.png';

export const LandingPage = () => {
  const { isAuthenticated, login } = useAuth();
  const { success, error: toastError } = useToast();
  const navigate = useNavigate();
  const [demoLoading, setDemoLoading] = useState(false);

  // Interactive Assistant Chat State
  const [chatMessages, setChatMessages] = useState([
    {
      sender: 'bot',
      text: 'Hi there!\n\nYou can use the left workspace to start creating and organizing your work. Anything you create, we can chat about here.\n\nOr, if you want to start brainstorming ideas, you can use our optimized workflows by clicking any prompt below.'
    }
  ]);
  const [chatInput, setChatInput] = useState('');
  const [activeWorkspace, setActiveWorkspace] = useState('Small Business Guide');

  const handleCreateNote = () => {
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
        success('Logged in as Demo User with 7 pre-populated notes!');
        navigate('/notes');
      }
    } catch (err) {
      toastError(err.response?.data?.message || 'Failed to login with demo account');
    } finally {
      setDemoLoading(false);
    }
  };

  const handleSendMessage = (textToSend = null) => {
    const text = textToSend || chatInput;
    if (!text.trim()) return;

    const userMsg = { sender: 'user', text: text.trim() };
    setChatMessages((prev) => [...prev, userMsg]);
    if (!textToSend) setChatInput('');

    // Simulated thoughtful AI response
    setTimeout(() => {
      let reply = "That's a great direction! I've noted down key action items. You can click 'Create a Note' above to turn these into a full document in your workspace.";
      const lower = text.toLowerCase();
      if (lower.includes('marketing')) {
        reply = "For marketing, focus on three pillars: 1) High-converting educational content, 2) Targeted outreach to niche communities, and 3) Tracking CAC vs LTV closely in your notes.";
      } else if (lower.includes('growth') || lower.includes('scale')) {
        reply = "When scaling, automate your routine documentation first. Use Notely's tagged categories ('Ideas', 'Research', 'Drafts') to keep your team aligned!";
      } else if (lower.includes('hiring')) {
        reply = "Here is a quick 3-step hiring rule: 1) Define outcome-based scorecards, 2) Screen for cultural velocity, 3) Document onboarding steps so new hires succeed in Week 1.";
      }
      setChatMessages((prev) => [...prev, { sender: 'bot', text: reply }]);
    }, 600);
  };

  const featureCards = [
    {
      img: docCard,
      title: 'TipTap Rich Canvas',
      desc: 'Clean editorial writing with H1–H3 headings, bold formatting, checklists, quotes, and code blocks.'
    },
    {
      img: cloudSync,
      title: '750ms Cloud Autosave',
      desc: 'Automatic background synchronization. Write without anxiety; your thoughts are saved in real-time.'
    },
    {
      img: knowledgeGraph,
      title: 'Visual Workspace Boards',
      desc: 'Group your notes into Ideas, Research, and Drafts boards with instant filtering and color tags.'
    },
    {
      img: smartSearch,
      title: 'Fuzzy Smart Search',
      desc: 'Find any concept across all notes by keyword, category, tag, or pinned status in milliseconds.'
    },
    {
      img: flashcards,
      title: 'Pins & Starred Favorites',
      desc: 'Anchor high-priority projects and star essential research for rapid one-click retrieval.'
    },
    {
      img: growthChart,
      title: 'Note Metrics & Word Counts',
      desc: 'Real-time word count, character count, and estimated reading time indicators as you write.'
    }
  ];

  return (
    <div className="min-h-screen bg-[#FBF9F5] dark:bg-[#121316] text-[#2E2E2E] dark:text-[#F3F1EC] flex flex-col font-sans transition-colors selection:bg-indigo-500/20">
      <Navbar />

      {/* Hero Intro Header */}
      <section className="pt-10 pb-12 md:pt-16 md:pb-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative select-none">
        {/* Floating Mascot Badges */}
        <div className="hidden lg:flex items-center justify-between absolute inset-x-8 top-12 pointer-events-none opacity-90">
          <div className="flex flex-col items-center animate-bounce duration-1000">
            <img src={heroStudent} alt="Student learning" className="w-28 h-auto drop-shadow-md" />
            <span className="text-[11px] font-semibold text-charcoal-500 dark:text-charcoal-400 mt-1">
              Focus & Think
            </span>
          </div>
          <div className="flex flex-col items-center">
            <img src={notebookMascot} alt="Notebook mascot" className="w-24 h-auto drop-shadow-md animate-pulse" />
            <span className="text-[11px] font-semibold text-indigo-600 dark:text-indigo-400 mt-1">
              Organize Ideas
            </span>
          </div>
        </div>

        {/* Hero Text */}
        <div className="max-w-3xl mx-auto space-y-5">
          <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-[#EFECE6] dark:bg-[#1E2026] text-[#55534E] dark:text-[#D1CEC7] border border-[#E4E0D8] dark:border-[#2D3038] shadow-xs">
            <Sparkles className="w-3.5 h-3.5 text-indigo-500" />
            <span>Editorial Notes & Knowledge Management</span>
          </div>

          <h1 className="font-serif font-bold text-4xl sm:text-5xl lg:text-6xl tracking-tight text-[#1E1E1E] dark:text-[#FAF8F5] leading-[1.12]">
            Where ideas transform into <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 via-indigo-500 to-violet-600 dark:from-indigo-400 dark:via-indigo-300 dark:to-violet-400">
              organized knowledge.
            </span>
          </h1>

          <p className="text-base sm:text-lg text-[#6E6C66] dark:text-[#A8A59E] max-w-2xl mx-auto leading-relaxed">
            A calm, distraction-free workspace designed for thinkers, builders, and writers.
            Draft notes, structure your research into visual boards, and brainstorm with clarity.
          </p>

          {/* Action CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-3">
            <button
              onClick={handleCreateNote}
              id="hero-create-btn"
              className="w-full sm:w-auto px-6 py-3.5 bg-gradient-to-r from-indigo-500 via-indigo-600 to-violet-600 hover:from-indigo-600 hover:to-violet-700 text-white rounded-2xl font-semibold text-sm flex items-center justify-center space-x-2 shadow-md shadow-indigo-500/25 hover:shadow-indigo-500/35 transition-all duration-200 active:scale-[0.98] group"
            >
              <Plus className="w-4 h-4 stroke-[2.5] group-hover:rotate-90 transition-transform duration-200" />
              <span>Create a Note</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>

            <Link
              to="/notes"
              id="hero-view-dashboard-btn"
              className="w-full sm:w-auto px-6 py-3.5 bg-white dark:bg-[#1E2026] border border-[#E5E2DA] dark:border-[#2D3038] hover:bg-[#F3EFE7] dark:hover:bg-[#282B33] text-[#2E2E2E] dark:text-[#FAF8F5] rounded-2xl font-semibold text-sm flex items-center justify-center space-x-2 shadow-xs transition-all duration-200"
            >
              <FileText className="w-4 h-4 text-indigo-500" />
              <span>View Notes Dashboard</span>
            </Link>

            {!isAuthenticated && (
              <button
                onClick={handleDemoLogin}
                disabled={demoLoading}
                className="w-full sm:w-auto px-5 py-3.5 text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 bg-indigo-50/70 dark:bg-indigo-950/40 border border-indigo-200/60 dark:border-indigo-800/40 rounded-2xl transition-colors flex items-center justify-center space-x-1.5"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>{demoLoading ? 'Loading Demo Notes...' : 'Try 1-Click Demo'}</span>
              </button>
            )}
          </div>
        </div>
      </section>

      {/* ======================================================== */}
      {/* EXACT USER-PROVIDED DESIGN: Notion / Strut Workspace Showcase */}
      {/* ======================================================== */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20 select-none">
        <div className="rounded-3xl border border-[#E5E2DA] dark:border-[#262830] bg-[#F7F5F0] dark:bg-[#16171B] shadow-2xl overflow-hidden transition-all">
          
          {/* Top macOS App Bar */}
          <div className="px-5 py-3.5 border-b border-[#E7E4DC] dark:border-[#23252C] bg-[#FAF8F3] dark:bg-[#191B20] flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="flex items-center space-x-1.5">
                <span className="w-3 h-3 rounded-full bg-[#FF5F56] inline-block border border-[#E0443E]" />
                <span className="w-3 h-3 rounded-full bg-[#FFBD2E] inline-block border border-[#DEA123]" />
                <span className="w-3 h-3 rounded-full bg-[#27C93F] inline-block border border-[#1AAB29]" />
              </div>
              <h3 className="font-serif font-bold text-sm text-[#2E2E2E] dark:text-[#F3F1EC] ml-2">
                {activeWorkspace}
              </h3>
            </div>

            <div className="flex items-center space-x-3 text-xs text-[#6E6C66] dark:text-[#9A9893]">
              <button
                onClick={handleCreateNote}
                className="px-3 py-1 bg-white dark:bg-[#22242B] border border-[#E5E2DA] dark:border-[#2D3038] hover:bg-[#F2EFE8] text-[#333] dark:text-[#E8E6E1] rounded-lg font-medium text-xs flex items-center space-x-1 transition-colors shadow-xs"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>New Note</span>
              </button>
              <button
                onClick={() => success('Note link copied to clipboard')}
                className="hover:text-indigo-600 dark:hover:text-indigo-400 flex items-center space-x-1"
              >
                <Share2 className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Share</span>
              </button>
              <div className="hidden sm:flex items-center space-x-1 border-l border-[#E5E2DA] dark:border-[#2D3038] pl-2">
                <button className="p-1 rounded hover:bg-[#EFECE4] dark:hover:bg-[#252730]" title="List View">
                  <List className="w-3.5 h-3.5" />
                </button>
                <button className="p-1 rounded bg-[#E8E4DA] dark:bg-[#2B2E37] text-indigo-600 dark:text-indigo-400" title="Grid View">
                  <LayoutGrid className="w-3.5 h-3.5" />
                </button>
                <button className="p-1 rounded hover:bg-[#EFECE4] dark:hover:bg-[#252730]" title="Board Columns">
                  <Columns className="w-3.5 h-3.5" />
                </button>
              </div>
              <MoreHorizontal className="w-4 h-4 cursor-pointer hover:text-charcoal-800" />
            </div>
          </div>

          {/* Main 3-Column Layout: Left Sidebar + Center Boards + Right AI Assistant */}
          <div className="grid grid-cols-1 lg:grid-cols-12 min-h-[580px]">

            {/* Left Workspace Navigation (col-span-2) */}
            <div className="hidden lg:flex lg:col-span-2 flex-col justify-between border-r border-[#E7E4DC] dark:border-[#23252C] bg-[#FAF8F4] dark:bg-[#18191E] p-4 text-xs">
              <div className="space-y-4">
                {/* Top quick links */}
                <div className="space-y-1">
                  <div className="flex items-center space-x-2 px-2 py-1.5 rounded-lg text-[#6E6C66] dark:text-[#9A9893] hover:bg-[#EFECE4] dark:hover:bg-[#23252C] cursor-pointer">
                    <Inbox className="w-3.5 h-3.5 text-charcoal-400" />
                    <span>Inbox</span>
                  </div>
                  <div
                    onClick={handleCreateNote}
                    className="flex items-center space-x-2 px-2 py-1.5 rounded-lg text-[#6E6C66] dark:text-[#9A9893] hover:bg-[#EFECE4] dark:hover:bg-[#23252C] cursor-pointer"
                  >
                    <Zap className="w-3.5 h-3.5 text-amber-500" />
                    <span>Quick Note</span>
                  </div>
                  <div
                    onClick={() => navigate('/notes')}
                    className="flex items-center space-x-2 px-2 py-1.5 rounded-lg text-[#6E6C66] dark:text-[#9A9893] hover:bg-[#EFECE4] dark:hover:bg-[#23252C] cursor-pointer"
                  >
                    <Search className="w-3.5 h-3.5 text-charcoal-400" />
                    <span>Search</span>
                  </div>
                </div>

                {/* Workspaces list */}
                <div>
                  <span className="text-[10px] font-semibold uppercase tracking-wider text-[#98958E] dark:text-[#6F727A] px-2 block mb-1">
                    Workspaces
                  </span>
                  <div className="space-y-0.5">
                    {[
                      'Small Business Guide',
                      'Social Posts',
                      'Research & Tech',
                      'Dieter Rams Design',
                      'Video Scripts',
                      'Newsletter'
                    ].map((ws) => (
                      <div
                        key={ws}
                        onClick={() => setActiveWorkspace(ws)}
                        className={`flex items-center space-x-2 px-2 py-1.5 rounded-lg cursor-pointer transition-colors ${
                          activeWorkspace === ws
                            ? 'bg-[#EAE6DD] dark:bg-[#2A2C35] font-semibold text-[#1F1F1F] dark:text-[#FAF8F5]'
                            : 'text-[#6E6C66] dark:text-[#9A9893] hover:bg-[#EFECE4] dark:hover:bg-[#23252C]'
                        }`}
                      >
                        <Folder className="w-3.5 h-3.5 text-indigo-500/80" />
                        <span className="truncate">{ws}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Bottom sidebar actions */}
              <div className="pt-4 border-t border-[#E7E4DC] dark:border-[#23252C] space-y-1 text-[#7A7872] dark:text-[#91949D]">
                <div className="flex items-center space-x-2 px-2 py-1 hover:text-indigo-600 cursor-pointer">
                  <Volume2 className="w-3.5 h-3.5" />
                  <span>Voice & Tone</span>
                </div>
                <div className="flex items-center space-x-2 px-2 py-1 hover:text-indigo-600 cursor-pointer">
                  <HelpCircle className="w-3.5 h-3.5" />
                  <span>Help & Support</span>
                </div>
              </div>
            </div>

            {/* Central Workspace Canvas (col-span-7) */}
            <div className="lg:col-span-7 p-5 sm:p-6 space-y-8 overflow-y-auto max-h-[640px]">
              
              {/* Board 1: Ideas */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <span className="w-3 h-3 rounded-full border-2 border-indigo-500 inline-block" />
                    <h4 className="font-serif font-bold text-sm text-[#2E2E2E] dark:text-[#F3F1EC]">
                      Ideas
                    </h4>
                  </div>
                  <button onClick={handleCreateNote} className="text-[#88857E] hover:text-[#2E2E2E] p-1">
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  {/* + New Doc dashed card */}
                  <div
                    onClick={handleCreateNote}
                    className="border-2 border-dashed border-[#DCD8CF] dark:border-[#2F313B] rounded-2xl p-6 flex flex-col items-center justify-center cursor-pointer hover:border-indigo-400 hover:bg-white/40 dark:hover:bg-charcoal-800/40 transition-all text-[#77746E] dark:text-[#9A9893] group min-h-[170px]"
                  >
                    <Plus className="w-5 h-5 mb-1 group-hover:scale-110 group-hover:text-indigo-500 transition-all" />
                    <span className="text-xs font-semibold group-hover:text-indigo-600 dark:group-hover:text-indigo-400">
                      + New Doc
                    </span>
                  </div>

                  {/* Hiring Card */}
                  <div
                    onClick={() => navigate('/notes')}
                    className="bg-white dark:bg-[#1B1D23] border border-[#E5E2DA] dark:border-[#282A33] rounded-2xl p-4 shadow-sm hover:shadow-md hover:border-indigo-300 dark:hover:border-indigo-700/60 transition-all cursor-pointer flex flex-col justify-between space-y-2.5"
                  >
                    <div>
                      <h5 className="font-serif font-bold text-xs text-[#222] dark:text-[#F5F3EF]">
                        Hiring Strategy
                      </h5>
                      <ul className="text-[11px] text-[#55534E] dark:text-[#A8A59E] mt-2 space-y-0.5 leading-snug">
                        <li>• When to hire</li>
                        <li>• Full-time vs freelance</li>
                        <li>• Interview scorecards</li>
                        <li>• Onboarding process</li>
                      </ul>
                      <p className="text-[10px] text-[#88857E] dark:text-[#7A7C85] mt-2 line-clamp-2 leading-relaxed">
                        Regular performance reviews identify areas for employee development and capacity growth.
                      </p>
                    </div>
                    <div className="pt-2">
                      <span className="inline-flex items-center space-x-1 px-2 py-0.5 rounded-full text-[10px] font-medium bg-[#F1EDE4] dark:bg-[#262831] text-[#555] dark:text-[#D1CEC7]">
                        <span className="w-1.5 h-1.5 rounded-full bg-indigo-500" />
                        <span>Hiring</span>
                      </span>
                    </div>
                  </div>

                  {/* Customer Service Card */}
                  <div
                    onClick={() => navigate('/notes')}
                    className="bg-white dark:bg-[#1B1D23] border border-[#E5E2DA] dark:border-[#282A33] rounded-2xl p-4 shadow-sm hover:shadow-md hover:border-indigo-300 dark:hover:border-indigo-700/60 transition-all cursor-pointer flex flex-col justify-between space-y-2.5"
                  >
                    <div>
                      <h5 className="font-serif font-bold text-xs text-[#222] dark:text-[#F5F3EF]">
                        Customer Service
                      </h5>
                      <ul className="text-[11px] text-[#55534E] dark:text-[#A8A59E] mt-2 space-y-0.5 leading-snug">
                        <li>• Importance of CS</li>
                        <li>• Training staff</li>
                        <li>• Handling complaints</li>
                        <li>• Customer feedback loops</li>
                      </ul>
                      <p className="text-[10px] text-[#88857E] dark:text-[#7A7C85] mt-2 line-clamp-2 leading-relaxed">
                        A well-trained customer service team significantly improves long-term customer retention.
                      </p>
                    </div>
                    <div className="pt-2">
                      <span className="inline-flex items-center space-x-1 px-2 py-0.5 rounded-full text-[10px] font-medium bg-[#F1EDE4] dark:bg-[#262831] text-[#555] dark:text-[#D1CEC7]">
                        <span className="w-1.5 h-1.5 rounded-full bg-violet-500" />
                        <span>CS Team</span>
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Board 2: Research */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <span className="w-3 h-3 rounded-full border-2 border-violet-500 inline-block" />
                    <h4 className="font-serif font-bold text-sm text-[#2E2E2E] dark:text-[#F3F1EC]">
                      Research
                    </h4>
                  </div>
                  <button onClick={handleCreateNote} className="text-[#88857E] hover:text-[#2E2E2E] p-1">
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  {/* Growth Strategies */}
                  <div
                    onClick={() => navigate('/notes')}
                    className="bg-white dark:bg-[#1B1D23] border border-[#E5E2DA] dark:border-[#282A33] rounded-2xl p-4 shadow-sm hover:shadow-md hover:border-violet-300 dark:hover:border-violet-700/60 transition-all cursor-pointer flex flex-col justify-between space-y-2.5"
                  >
                    <div>
                      <h5 className="font-serif font-bold text-xs text-[#222] dark:text-[#F5F3EF]">
                        Growth Strategies
                      </h5>
                      <ul className="text-[11px] text-[#55534E] dark:text-[#A8A59E] mt-2 space-y-0.5 leading-snug">
                        <li>• Scaling vs expanding</li>
                        <li>• Strategic partnerships</li>
                        <li>• Channel diversification</li>
                      </ul>
                      <p className="text-[10px] text-[#88857E] dark:text-[#7A7C85] mt-2 line-clamp-2 leading-relaxed">
                        Scaling refers to increasing revenue without a proportional increase in operating expenditure.
                      </p>
                    </div>
                    <div className="pt-2">
                      <span className="inline-flex items-center space-x-1 px-2 py-0.5 rounded-full text-[10px] font-medium bg-[#F1EDE4] dark:bg-[#262831] text-[#555] dark:text-[#D1CEC7]">
                        <span className="w-1.5 h-1.5 rounded-full bg-violet-500" />
                        <span>Growth</span>
                      </span>
                    </div>
                  </div>

                  {/* Sales Strategies */}
                  <div
                    onClick={() => navigate('/notes')}
                    className="bg-white dark:bg-[#1B1D23] border border-[#E5E2DA] dark:border-[#282A33] rounded-2xl p-4 shadow-sm hover:shadow-md hover:border-violet-300 dark:hover:border-violet-700/60 transition-all cursor-pointer flex flex-col justify-between space-y-2.5"
                  >
                    <div>
                      <h5 className="font-serif font-bold text-xs text-[#222] dark:text-[#F5F3EF]">
                        Sales Strategies
                      </h5>
                      <ul className="text-[11px] text-[#55534E] dark:text-[#A8A59E] mt-2 space-y-0.5 leading-snug">
                        <li>• Inbound vs Outbound</li>
                        <li>• Pipeline health basics</li>
                        <li>• CRM integration</li>
                      </ul>
                      <p className="text-[10px] text-[#88857E] dark:text-[#7A7C85] mt-2 line-clamp-2 leading-relaxed">
                        Understanding drop-offs helps pinpoint friction points in potential conversions.
                      </p>
                    </div>
                    <div className="pt-2">
                      <span className="inline-flex items-center space-x-1 px-2 py-0.5 rounded-full text-[10px] font-medium bg-[#F1EDE4] dark:bg-[#262831] text-[#555] dark:text-[#D1CEC7]">
                        <span className="w-1.5 h-1.5 rounded-full bg-violet-500" />
                        <span>Sales</span>
                      </span>
                    </div>
                  </div>

                  {/* Marketing Card */}
                  <div
                    onClick={() => navigate('/notes')}
                    className="bg-white dark:bg-[#1B1D23] border border-[#E5E2DA] dark:border-[#282A33] rounded-2xl p-4 shadow-sm hover:shadow-md hover:border-violet-300 dark:hover:border-violet-700/60 transition-all cursor-pointer flex flex-col justify-between space-y-2.5"
                  >
                    <div>
                      <h5 className="font-serif font-bold text-xs text-[#222] dark:text-[#F5F3EF]">
                        Marketing
                      </h5>
                      <ul className="text-[11px] text-[#55534E] dark:text-[#A8A59E] mt-2 space-y-0.5 leading-snug">
                        <li>• Organic vs Paid</li>
                        <li>• Content distribution</li>
                        <li>• ROI & attribution tracking</li>
                      </ul>
                      <p className="text-[10px] text-[#88857E] dark:text-[#7A7C85] mt-2 line-clamp-2 leading-relaxed">
                        Target demographics and psychographics to tailor marketing copy for maximum engagement.
                      </p>
                    </div>
                    <div className="pt-2">
                      <span className="inline-flex items-center space-x-1 px-2 py-0.5 rounded-full text-[10px] font-medium bg-[#F1EDE4] dark:bg-[#262831] text-[#555] dark:text-[#D1CEC7]">
                        <span className="w-1.5 h-1.5 rounded-full bg-violet-500" />
                        <span>Marketing</span>
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Board 3: Drafts */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <span className="w-3 h-3 rounded-full border-2 border-amber-500 inline-block" />
                    <h4 className="font-serif font-bold text-sm text-[#2E2E2E] dark:text-[#F3F1EC]">
                      Drafts
                    </h4>
                  </div>
                  <button onClick={handleCreateNote} className="text-[#88857E] hover:text-[#2E2E2E] p-1">
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div
                    onClick={() => navigate('/notes')}
                    className="bg-white dark:bg-[#1B1D23] border border-[#E5E2DA] dark:border-[#282A33] rounded-2xl p-4 shadow-sm hover:shadow-md transition-all cursor-pointer space-y-2"
                  >
                    <h5 className="font-serif font-bold text-xs text-[#222] dark:text-[#F5F3EF]">
                      Role of Customer Service in Retention
                    </h5>
                    <p className="text-[10px] text-[#7E7B74] dark:text-[#888B94] leading-relaxed">
                      While various factors contribute to customer loyalty, one aspect that stands out is the quality of support: it is not just an asset, but an enduring necessity.
                    </p>
                  </div>

                  <div
                    onClick={() => navigate('/notes')}
                    className="bg-white dark:bg-[#1B1D23] border border-[#E5E2DA] dark:border-[#282A33] rounded-2xl p-4 shadow-sm hover:shadow-md transition-all cursor-pointer space-y-2"
                  >
                    <div className="flex items-center justify-between">
                      <h5 className="font-serif font-bold text-xs text-[#222] dark:text-[#F5F3EF]">
                        Crafting a Brand Identity
                      </h5>
                      <span className="text-[9px] font-mono bg-[#EFECE5] dark:bg-[#282A33] px-1.5 py-0.5 rounded text-[#777]">
                        ⌘ K
                      </span>
                    </div>
                    <p className="text-[10px] text-[#7E7B74] dark:text-[#888B94] leading-relaxed">
                      Your brand is the essence of your business—it tells your story and connects with your ideal customers across every touchpoint.
                    </p>
                  </div>
                </div>
              </div>

            </div>

            {/* Right Interactive AI Assistant ("Strut" / "Notely AI" Companion) (col-span-3) */}
            <div className="lg:col-span-3 border-t lg:border-t-0 lg:border-l border-[#E7E4DC] dark:border-[#23252C] bg-[#FAF8F3] dark:bg-[#18191E] flex flex-col justify-between p-4 sm:p-5">
              <div className="space-y-4">
                {/* Assistant Header */}
                <div className="flex items-center space-x-2.5 pb-3 border-b border-[#E7E4DC] dark:border-[#252731]">
                  <img src={aiBot} alt="AI Assistant Mascot" className="w-8 h-8 rounded-xl object-contain drop-shadow-xs" />
                  <div>
                    <div className="flex items-center space-x-1.5">
                      <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
                      <h4 className="font-serif font-bold text-xs text-[#222] dark:text-[#F5F3EF]">
                        Notely Companion
                      </h4>
                    </div>
                    <p className="text-[10px] text-[#88857E] dark:text-[#7A7C85]">
                      Active in {activeWorkspace}
                    </p>
                  </div>
                </div>

                {/* Messages stream */}
                <div className="space-y-3 overflow-y-auto max-h-[360px] pr-1">
                  {chatMessages.map((msg, i) => (
                    <div
                      key={i}
                      className={`text-xs leading-relaxed p-3 rounded-2xl ${
                        msg.sender === 'user'
                          ? 'bg-indigo-600 text-white ml-4 font-medium'
                          : 'bg-white dark:bg-[#20222A] border border-[#E5E2DA] dark:border-[#2B2D37] text-[#44423E] dark:text-[#DDD9D2] mr-2 shadow-xs whitespace-pre-line'
                      }`}
                    >
                      {msg.text}
                    </div>
                  ))}
                </div>

                {/* Quick Prompts */}
                <div className="space-y-1 pt-1">
                  <span className="text-[10px] font-semibold uppercase tracking-wider text-[#98958E] dark:text-[#6F727A]">
                    Quick Brainstorm
                  </span>
                  <div className="flex flex-col gap-1.5">
                    {[
                      '💡 Brainstorm Marketing ideas',
                      '📈 Summarize Growth Strategies',
                      '🤝 Create Hiring checklist'
                    ].map((prompt, idx) => (
                      <button
                        key={idx}
                        onClick={() => handleSendMessage(prompt.substring(2))}
                        className="text-left text-[11px] px-2.5 py-1.5 rounded-xl bg-white dark:bg-[#20222A] border border-[#E5E2DA] dark:border-[#2A2C35] hover:border-indigo-400 dark:hover:border-indigo-600 text-[#444] dark:text-[#CCC] transition-colors"
                      >
                        {prompt}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Chat Input */}
              <div className="pt-3 border-t border-[#E7E4DC] dark:border-[#252731]">
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleSendMessage();
                  }}
                  className="relative flex items-center"
                >
                  <input
                    type="text"
                    placeholder="Ask about your notes..."
                    value={chatInput}
                    onChange={(e) => setChatInput(e.target.value)}
                    className="w-full pl-3 pr-8 py-2 bg-white dark:bg-[#20222A] border border-[#E0DCD4] dark:border-[#2D303A] rounded-xl text-xs placeholder:text-[#999] text-[#222] dark:text-[#EEE] focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  />
                  <button
                    type="submit"
                    className="absolute right-1.5 p-1 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 transition-colors"
                  >
                    <Send className="w-3 h-3" />
                  </button>
                </form>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ======================================================== */}
      {/* Feature Grid with Clipart Pack */}
      {/* ======================================================== */}
      <section id="features" className="py-16 md:py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 select-none">
        <div className="text-center max-w-2xl mx-auto mb-14 space-y-3">
          <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Built For Deep Thinkers</span>
          </div>
          <h2 className="font-serif font-bold text-3xl sm:text-4xl text-[#1E1E1E] dark:text-[#FAF8F5]">
            Everything you need for serene note-taking
          </h2>
          <p className="text-sm sm:text-base text-[#6E6C66] dark:text-[#9A9893]">
            Every feature is designed to reduce friction and help you articulate your best ideas.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {featureCards.map((feat, idx) => (
            <div
              key={idx}
              className="p-6 rounded-3xl bg-white dark:bg-[#181A20] border border-[#E8E4DA] dark:border-[#262832] hover:border-indigo-400 dark:hover:border-indigo-600/70 transition-all duration-200 shadow-sm hover:shadow-card group flex flex-col justify-between"
            >
              <div>
                <div className="w-16 h-16 rounded-2xl bg-[#F7F5F0] dark:bg-[#20222A] flex items-center justify-center mb-5 p-2 border border-[#EBE7DE] dark:border-[#2B2D38] group-hover:scale-105 transition-transform duration-200">
                  <img src={feat.img} alt={feat.title} className="w-12 h-12 object-contain" />
                </div>
                <h3 className="font-serif font-bold text-lg text-[#222] dark:text-[#FAF8F5] mb-2">
                  {feat.title}
                </h3>
                <p className="text-xs sm:text-sm text-[#66645E] dark:text-[#9A9893] leading-relaxed">
                  {feat.desc}
                </p>
              </div>
              <div className="pt-4 mt-2 border-t border-[#F2EFE8] dark:border-[#23252E] flex items-center text-xs font-semibold text-indigo-600 dark:text-indigo-400 group-hover:translate-x-1 transition-transform">
                <span>Explore in workspace</span>
                <ArrowRight className="w-3.5 h-3.5 ml-1" />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ======================================================== */}
      {/* Clipart Cozy Reading & Growth Showcase */}
      {/* ======================================================== */}
      <section className="py-14 bg-[#F5F2EA]/60 dark:bg-[#16171C] border-y border-[#EAE6DD] dark:border-[#242630] select-none">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center">
            
            {/* Card 1 */}
            <div className="flex items-center space-x-4 p-5 rounded-2xl bg-white dark:bg-[#1C1E26] border border-[#E7E3D8] dark:border-[#2A2C38] shadow-xs">
              <img src={readingStudent} alt="Student learning" className="w-16 h-16 object-contain flex-shrink-0" />
              <div>
                <h4 className="font-serif font-bold text-sm text-[#222] dark:text-[#F5F3EF]">
                  Distraction Free
                </h4>
                <p className="text-xs text-[#666] dark:text-[#9A9893] mt-1">
                  Minimal chrome so you can enter flow state without interruptions.
                </p>
              </div>
            </div>

            {/* Card 2 */}
            <div className="flex items-center space-x-4 p-5 rounded-2xl bg-white dark:bg-[#1C1E26] border border-[#E7E3D8] dark:border-[#2A2C38] shadow-xs">
              <img src={coffeeBooks} alt="Coffee and books" className="w-16 h-16 object-contain flex-shrink-0" />
              <div>
                <h4 className="font-serif font-bold text-sm text-[#222] dark:text-[#F5F3EF]">
                  Organized by Default
                </h4>
                <p className="text-xs text-[#666] dark:text-[#9A9893] mt-1">
                  Tags, categories, and smart filters keep every note within reach.
                </p>
              </div>
            </div>

            {/* Card 3 */}
            <div className="flex items-center space-x-4 p-5 rounded-2xl bg-white dark:bg-[#1C1E26] border border-[#E7E3D8] dark:border-[#2A2C38] shadow-xs">
              <img src={codePencil} alt="Code and pencil" className="w-16 h-16 object-contain flex-shrink-0" />
              <div>
                <h4 className="font-serif font-bold text-sm text-[#222] dark:text-[#F5F3EF]">
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

      {/* ======================================================== */}
      {/* Call to Action Banner */}
      {/* ======================================================== */}
      <section className="py-16 md:py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 select-none">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-600 via-indigo-700 to-violet-800 text-white p-8 sm:p-12 md:p-16 text-center space-y-6 shadow-xl shadow-indigo-500/15">
          <img src={paperAirplane} alt="Paper airplane flying" className="w-16 h-16 mx-auto object-contain drop-shadow-md" />
          
          <h2 className="font-serif font-bold text-3xl sm:text-4xl lg:text-5xl max-w-xl mx-auto leading-tight">
            Ready to give your ideas a permanent home?
          </h2>
          <p className="text-indigo-100 text-sm sm:text-base max-w-md mx-auto leading-relaxed">
            Open the notes dashboard right now and start organizing your knowledge base.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <Link
              to="/notes"
              className="w-full sm:w-auto px-7 py-3.5 bg-white text-indigo-700 hover:bg-[#F8F6F0] font-semibold text-sm rounded-2xl shadow-md transition-all active:scale-[0.98]"
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
