import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  Home,
  LayoutGrid,
  PlayCircle,
  Tag,
  PenTool,
  Folder,
  CloudLightning,
  Share2,
  Search,
  Info,
  Mail,
  BookOpen,
  ShieldCheck,
  FileText
} from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

export const FooterLinks = () => {
  const { isDark } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();

  const productLinks = [
    { label: 'Home', icon: Home, href: '#home' },
    { label: 'Features', icon: LayoutGrid, href: '#features' },
    { label: 'How It Works', icon: PlayCircle, href: '#features' },
    { label: 'Use Cases', icon: Tag, href: '#features' },
  ];

  const featureLinks = [
    { label: 'Rich Text Editor', icon: PenTool, href: '#features' },
    { label: 'Folders & Tags', icon: Folder, href: '#features' },
    { label: 'Offline Sync', icon: CloudLightning, href: '#features' },
    { label: 'Import & Export', icon: Share2, href: '#features' },
    { label: 'Full-Text Search', icon: Search, href: '#features' },
  ];

  const companyLinks = [
    { label: 'About', icon: Info, href: '/about' },
    { label: 'Contact', icon: Mail, href: '/contact' },
    { label: 'Documentation', icon: BookOpen, href: '#features' },
    { label: 'Privacy Policy', icon: ShieldCheck, href: '#features' },
    { label: 'Terms of Service', icon: FileText, href: '#features' },
  ];

  const handleScroll = (href) => {
    if (href.startsWith('/')) {
      navigate(href);
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    if (location.pathname !== '/') {
      navigate(`/${href}`);
      return;
    }

    if (href.startsWith('#')) {
      const el = document.querySelector(href);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
      {/* Product Column */}
      <div className="space-y-4">
        <div>
          <h4
            className={`text-base font-bold font-serif tracking-tight ${
              isDark ? 'text-white' : 'text-[#26153b]'
            }`}
          >
            Product
          </h4>
          {/* Golden handwritten underline */}
          <div className="w-12 h-[2px] bg-amber-400 rounded-full mt-1 opacity-80" />
        </div>

        <ul className="space-y-3">
          {productLinks.map((item) => {
            const Icon = item.icon;
            return (
              <li key={item.label}>
                <button
                  onClick={() => handleScroll(item.href)}
                  className={`flex items-center gap-2.5 text-xs sm:text-[13px] transition-all group cursor-pointer ${
                    isDark
                      ? 'text-[#c4c0d0] hover:text-white'
                      : 'text-[#5c4a70] hover:text-[#26153b]'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5 text-purple-400 transition-transform group-hover:scale-110" />
                  <span className="group-hover:translate-x-0.5 transition-transform">{item.label}</span>
                </button>
              </li>
            );
          })}
        </ul>
      </div>

      {/* Features Column */}
      <div className="space-y-4">
        <div>
          <h4
            className={`text-base font-bold font-serif tracking-tight ${
              isDark ? 'text-white' : 'text-[#26153b]'
            }`}
          >
            Features
          </h4>
          {/* Golden handwritten underline */}
          <div className="w-12 h-[2px] bg-amber-400 rounded-full mt-1 opacity-80" />
        </div>

        <ul className="space-y-3">
          {featureLinks.map((item) => {
            const Icon = item.icon;
            return (
              <li key={item.label}>
                <button
                  onClick={() => handleScroll(item.href)}
                  className={`flex items-center gap-2.5 text-xs sm:text-[13px] transition-all group cursor-pointer ${
                    isDark
                      ? 'text-[#c4c0d0] hover:text-white'
                      : 'text-[#5c4a70] hover:text-[#26153b]'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5 text-purple-400 transition-transform group-hover:scale-110" />
                  <span className="group-hover:translate-x-0.5 transition-transform">{item.label}</span>
                </button>
              </li>
            );
          })}
        </ul>
      </div>

      {/* Company Column */}
      <div className="space-y-4">
        <div>
          <h4
            className={`text-base font-bold font-serif tracking-tight ${
              isDark ? 'text-white' : 'text-[#26153b]'
            }`}
          >
            Company
          </h4>
          {/* Golden handwritten underline */}
          <div className="w-12 h-[2px] bg-amber-400 rounded-full mt-1 opacity-80" />
        </div>

        <ul className="space-y-3">
          {companyLinks.map((item) => {
            const Icon = item.icon;
            return (
              <li key={item.label}>
                <button
                  onClick={() => handleScroll(item.href)}
                  className={`flex items-center gap-2.5 text-xs sm:text-[13px] transition-all group cursor-pointer ${
                    isDark
                      ? 'text-[#c4c0d0] hover:text-white'
                      : 'text-[#5c4a70] hover:text-[#26153b]'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5 text-purple-400 transition-transform group-hover:scale-110" />
                  <span className="group-hover:translate-x-0.5 transition-transform">{item.label}</span>
                </button>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
};

export default FooterLinks;
