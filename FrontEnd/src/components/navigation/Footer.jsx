import React from 'react';
import { Link } from 'react-router-dom';
import { Feather, Heart, Shield, Sparkles, CheckCircle2 } from 'lucide-react';

export const Footer = () => {
  return (
    <footer
      id="app-footer"
      role="contentinfo"
      className="w-full bg-[#FAF8F4] dark:bg-[#141518] border-t border-[#EAE5DA] dark:border-[#22242C] transition-colors select-none"
    >
      {/* Top Subtle Border Accent */}
      <div className="w-full h-px bg-gradient-to-r from-transparent via-orange-500/20 to-transparent" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 lg:gap-12">
          {/* Brand Info */}
          <div className="md:col-span-2 space-y-4">
            <Link to="/" className="inline-flex items-center space-x-2.5">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center text-white shadow-md shadow-indigo-500/20">
                <Feather className="w-4 h-4 transform -rotate-12" />
              </div>
              <span className="font-serif font-bold text-xl text-charcoal-900 dark:text-cream-50">
                Notely
              </span>
            </Link>
            <p className="text-xs leading-relaxed text-charcoal-500 dark:text-charcoal-400 max-w-md">
              A distraction-free, full-stack notes and knowledge base application.
              Designed with modern typography, debounced cloud autosave, and strict multi-tenant privacy.
            </p>
            <div className="flex items-center space-x-2 pt-2">
              <span className="inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-full text-[11px] font-medium bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800/60">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                <span>API Status: Operational</span>
              </span>
              <span className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-full text-[11px] font-medium bg-indigo-50 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800/60">
                <Shield className="w-3 h-3" />
                <span>Isolated Privacy</span>
              </span>
            </div>
          </div>

          {/* Quick Navigation */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-charcoal-900 dark:text-cream-100 mb-3">
              Application
            </h4>
            <ul className="space-y-2 text-xs text-charcoal-500 dark:text-charcoal-400">
              <li>
                <Link to="/" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
                  Home Overview
                </Link>
              </li>
              <li>
                <Link to="/notes" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
                  My Notes Dashboard
                </Link>
              </li>
              <li>
                <Link to="/notes?action=new" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
                  Create Note
                </Link>
              </li>
              <li>
                <a href="/#features" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
                  Feature Tour
                </a>
              </li>
            </ul>
          </div>

          {/* Architecture & Tech Stack */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-charcoal-900 dark:text-cream-100 mb-3">
              Built With
            </h4>
            <ul className="space-y-2 text-xs text-charcoal-500 dark:text-charcoal-400">
              <li className="flex items-center space-x-1.5">
                <CheckCircle2 className="w-3 h-3 text-indigo-500" />
                <span>React 18 & Vite 6</span>
              </li>
              <li className="flex items-center space-x-1.5">
                <CheckCircle2 className="w-3 h-3 text-indigo-500" />
                <span>TipTap Rich-Text Engine</span>
              </li>
              <li className="flex items-center space-x-1.5">
                <CheckCircle2 className="w-3 h-3 text-indigo-500" />
                <span>Node.js & Express REST API</span>
              </li>
              <li className="flex items-center space-x-1.5">
                <CheckCircle2 className="w-3 h-3 text-indigo-500" />
                <span>MongoDB & Mongoose ODM</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-6 border-t border-warm-border/60 dark:border-charcoal-800 flex flex-col sm:flex-row items-center justify-between text-xs text-charcoal-400 dark:text-charcoal-500 space-y-3 sm:space-y-0">
          <p>© {new Date().getFullYear()} Notely. Write • Organize • Think.</p>
          <p className="flex items-center space-x-1">
            <span>Crafted for productive thinkers and writers</span>
          </p>
        </div>
      </div>
    </footer>
  );
};
