import React from 'react';
import { Info, BookOpen, ExternalLink, Github, Heart } from 'lucide-react';

export const AboutSettings = () => {
  return (
    <div className="space-y-4 text-xs">
      <div className="rounded-[6px] border border-[#272738] bg-[#14141e] p-6 shadow-sm">
        {/* Header with App Logo */}
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-[6px] bg-gradient-to-br from-purple-600 to-indigo-600 flex items-center justify-center text-white shadow-md">
            <BookOpen className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white tracking-tight flex items-center gap-2">
              NoteNest
              <span className="px-2 py-0.5 text-[10px] bg-purple-900/50 text-purple-300 border border-purple-700/50 rounded font-semibold">
                v1.0.0
              </span>
            </h3>
            <p className="text-[11px] text-gray-400">Your Ideas, Organized.</p>
          </div>
        </div>

        <p className="text-xs text-gray-300 leading-relaxed mb-5 max-w-xl">
          NoteNest is a modern, multi-user, offline-first knowledge management application designed for speed, distraction-free writing, and reliable cloud persistence.
        </p>

        {/* System Stack */}
        <div className="p-3.5 bg-[#171722] border border-[#272738] rounded-[6px] mb-5">
          <h4 className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider mb-2">
            Technology Stack
          </h4>
          <div className="flex flex-wrap gap-2 text-[11px] text-gray-300">
            <span className="px-2 py-1 rounded bg-[#20202e] border border-[#2e2e42]">React 19</span>
            <span className="px-2 py-1 rounded bg-[#20202e] border border-[#2e2e42]">Tailwind CSS v4</span>
            <span className="px-2 py-1 rounded bg-[#20202e] border border-[#2e2e42]">TipTap Editor</span>
            <span className="px-2 py-1 rounded bg-[#20202e] border border-[#2e2e42]">Dexie.js IndexedDB</span>
            <span className="px-2 py-1 rounded bg-[#20202e] border border-[#2e2e42]">Node / Express</span>
            <span className="px-2 py-1 rounded bg-[#20202e] border border-[#2e2e42]">MongoDB Atlas</span>
          </div>
        </div>

        {/* Resource Links */}
        <div className="space-y-2 border-t border-[#272738]/60 pt-4 max-w-lg">
          <a
            href="/"
            className="flex items-center justify-between p-2 rounded-[5px] hover:bg-[#1a1a26] text-gray-300 hover:text-white transition-colors"
          >
            <span>Landing Page</span>
            <ExternalLink className="w-3.5 h-3.5 text-gray-500" />
          </a>
          <a
            href="https://github.com"
            target="_blank"
            rel="noreferrer"
            className="flex items-center justify-between p-2 rounded-[5px] hover:bg-[#1a1a26] text-gray-300 hover:text-white transition-colors"
          >
            <span className="flex items-center gap-2">
              <Github className="w-3.5 h-3.5" />
              <span>Source Repository</span>
            </span>
            <ExternalLink className="w-3.5 h-3.5 text-gray-500" />
          </a>
        </div>

        <div className="pt-6 text-[11px] text-gray-500 flex items-center gap-1.5">
          <span>Crafted with</span>
          <Heart className="w-3 h-3 text-purple-400 fill-purple-400" />
          <span>© 2026 NoteNest. All rights reserved.</span>
        </div>
      </div>
    </div>
  );
};

