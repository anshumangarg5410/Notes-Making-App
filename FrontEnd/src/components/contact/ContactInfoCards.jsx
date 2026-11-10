import React from 'react';
import {
  Headphones,
  Mail,
  ExternalLink,
  Zap,
  MessageSquare
} from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

export const ContactInfoCards = () => {
  const { isDark } = useTheme();

  const contactMethods = [
    {
      id: 'email',
      title: 'Email Us',
      displayValue: 'support@notenest.app',
      href: 'mailto:support@notenest.app',
      icon: Mail,
      external: false
    },
    {
      id: 'github',
      title: 'GitHub',
      displayValue: 'github.com/notenest',
      href: 'https://github.com/notenest',
      icon: (props) => (
        <svg
          viewBox="0 0 24 24"
          width="18"
          height="18"
          stroke="currentColor"
          strokeWidth="2"
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
          {...props}
        >
          <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22" />
        </svg>
      ),
      external: true
    },
    {
      id: 'community',
      title: 'Join Our Community',
      displayValue: 'discord.gg/notenest',
      href: 'https://discord.gg/notenest',
      icon: MessageSquare,
      external: true
    }
  ];

  return (
    <div className="space-y-5 sm:space-y-6">
      {/* CARD 1: Other Ways to Reach Us */}
      <div
        className={`relative rounded-2xl p-6 sm:p-7 border backdrop-blur-md transition-all duration-300 shadow-xl ${
          isDark
            ? 'bg-[#120a22]/85 border-purple-500/30 shadow-[0_12px_40px_rgba(0,0,0,0.5),0_0_25px_rgba(168,85,247,0.15)] text-white'
            : 'bg-white/95 border-purple-200/90 shadow-[0_12px_35px_rgba(147,51,234,0.08)] text-slate-900'
        }`}
      >
        {/* Header */}
        <div className="flex items-center gap-3 mb-6 pb-4 border-b border-purple-500/15">
          <div
            className={`w-9 h-9 rounded-xl flex items-center justify-center border ${
              isDark
                ? 'bg-purple-950/60 border-purple-400/30 text-purple-300 shadow-[0_0_12px_rgba(168,85,247,0.3)]'
                : 'bg-purple-100 border-purple-300 text-purple-700 shadow-xs'
            }`}
          >
            <Headphones className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-base sm:text-lg font-bold font-serif tracking-tight">
              Other Ways to Reach Us
            </h3>
            <p className={`text-xs ${isDark ? 'text-gray-400' : 'text-slate-500'}`}>
              Connect with our team across these channels.
            </p>
          </div>
        </div>

        {/* Channels List */}
        <div className="space-y-3.5">
          {contactMethods.map((method) => {
            const Icon = method.icon;
            return (
              <a
                key={method.id}
                href={method.href}
                target={method.external ? '_blank' : undefined}
                rel={method.external ? 'noopener noreferrer' : undefined}
                className={`group flex items-center justify-between p-3.5 rounded-xl border transition-all duration-200 cursor-pointer ${
                  isDark
                    ? 'bg-[#170e2b]/80 border-purple-500/20 hover:border-purple-400/60 hover:bg-[#20143a]/90 hover:shadow-[0_0_20px_rgba(168,85,247,0.25)]'
                    : 'bg-[#f8f5fc]/90 border-purple-200/80 hover:border-purple-400 hover:bg-white hover:shadow-sm'
                }`}
              >
                <div className="flex items-center gap-3.5">
                  <div
                    className={`w-10 h-10 rounded-xl flex items-center justify-center transition-transform group-hover:scale-105 border ${
                      isDark
                        ? 'bg-gradient-to-br from-purple-900/50 to-indigo-900/50 border-purple-400/30 text-purple-300'
                        : 'bg-purple-100/90 border-purple-200 text-purple-700'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                  </div>
                  <div>
                    <h4
                      className={`text-xs sm:text-sm font-semibold tracking-tight ${
                        isDark ? 'text-gray-100 group-hover:text-purple-300' : 'text-slate-900 group-hover:text-purple-700'
                      }`}
                    >
                      {method.title}
                    </h4>
                    <p className={`text-xs ${isDark ? 'text-gray-400' : 'text-slate-500'}`}>
                      {method.displayValue}
                    </p>
                  </div>
                </div>

                <div
                  className={`p-1.5 rounded-lg transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 ${
                    isDark ? 'text-gray-400 group-hover:text-purple-300' : 'text-slate-400 group-hover:text-purple-600'
                  }`}
                >
                  <ExternalLink className="w-4 h-4" />
                </div>
              </a>
            );
          })}
        </div>
      </div>

      {/* CARD 2: Quick Response */}
      <div
        className={`relative rounded-2xl p-5 sm:p-6 border backdrop-blur-md transition-all duration-300 shadow-xl flex items-center gap-4 ${
          isDark
            ? 'bg-[#120a22]/85 border-purple-500/30 shadow-[0_12px_40px_rgba(0,0,0,0.5),0_0_25px_rgba(168,85,247,0.15)] text-white'
            : 'bg-white/95 border-purple-200/90 shadow-[0_12px_35px_rgba(147,51,234,0.08)] text-slate-900'
        }`}
      >
        <div
          className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 border ${
            isDark
              ? 'bg-gradient-to-br from-purple-600/30 to-fuchsia-600/30 border-purple-400/40 text-purple-300 shadow-[0_0_15px_rgba(168,85,247,0.35)]'
              : 'bg-purple-100 border-purple-300 text-purple-700 shadow-xs'
          }`}
        >
          <Zap className="w-5 h-5 fill-current" />
        </div>
        <div>
          <h4 className="text-sm sm:text-base font-bold font-serif tracking-tight">
            Quick Response
          </h4>
          <p className={`text-xs sm:text-[13px] leading-relaxed mt-0.5 ${isDark ? 'text-gray-300' : 'text-slate-600'}`}>
            We aim to respond to your messages as soon as possible.
          </p>
        </div>
      </div>
    </div>
  );
};

export default ContactInfoCards;

