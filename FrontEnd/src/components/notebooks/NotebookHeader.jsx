import React, { useState, useRef, useEffect } from 'react';
import {
  Book,
  BookOpen,
  Code,
  Lightbulb,
  GraduationCap,
  Briefcase,
  Heart,
  Compass,
  Bookmark,
  MoreVertical,
  Edit2,
  Palette,
  Plus,
  Trash2
} from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

const ICON_MAP = {
  book: Book,
  'book-open': BookOpen,
  code: Code,
  lightbulb: Lightbulb,
  'graduation-cap': GraduationCap,
  briefcase: Briefcase,
  heart: Heart,
  compass: Compass,
  bookmark: Bookmark
};

export const NotebookHeader = ({
  notebook,
  sections = [],
  notesCount = 0,
  onEditNotebook,
  onAddSection,
  onDeleteNotebook
}) => {
  const { isDark } = useTheme();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    const handleOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleOutside);
    return () => document.removeEventListener('mousedown', handleOutside);
  }, []);

  if (!notebook) return null;

  const IconComponent = ICON_MAP[notebook.icon] || Book;

  return (
    <div
      className={`p-3.5 pb-3 border-b transition-colors ${
        isDark ? 'bg-[#15151f] border-[#222230]' : 'bg-[#FAF8FD] border-[#EAE6F4]'
      }`}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="w-8 h-8 rounded-xl bg-pink-500/15 border border-pink-500/30 text-pink-400 flex items-center justify-center shrink-0">
            <IconComponent className="w-4 h-4" />
          </div>

          <div className="min-w-0">
            <h2 className={`text-sm font-bold tracking-tight truncate ${isDark ? 'text-white' : 'text-slate-900'}`}>
              {notebook.name}
            </h2>
            <p className={`text-[11px] truncate mt-0.5 ${isDark ? 'text-gray-400' : 'text-slate-500'}`}>
              {sections.length} {sections.length === 1 ? 'section' : 'sections'} • {notesCount} {notesCount === 1 ? 'note' : 'notes'}
            </p>
          </div>
        </div>

        {/* Three-dot menu */}
        <div className="relative shrink-0" ref={menuRef}>
          <button
            type="button"
            onClick={() => setMenuOpen(!menuOpen)}
            className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
              isDark ? 'text-gray-400 hover:text-white hover:bg-white/10' : 'text-slate-400 hover:text-slate-700 hover:bg-slate-100'
            }`}
            title="Notebook actions"
          >
            <MoreVertical className="w-4 h-4" />
          </button>

          {menuOpen && (
            <div
              className={`absolute top-full right-0 mt-1 py-1 w-44 rounded-xl border shadow-xl z-50 text-xs backdrop-blur-md animate-in fade-in zoom-in-95 ${
                isDark ? 'bg-[#181826] border-[#2b2b3e] text-gray-200' : 'bg-white border-slate-200 text-slate-800 shadow-purple-200/40'
              }`}
            >
              <button
                type="button"
                onClick={() => {
                  setMenuOpen(false);
                  onEditNotebook?.(notebook);
                }}
                className={`w-full text-left px-3 py-2 flex items-center gap-2 transition-colors cursor-pointer ${
                  isDark ? 'hover:bg-white/5' : 'hover:bg-slate-50'
                }`}
              >
                <Edit2 className="w-3.5 h-3.5 text-pink-400" />
                <span>Rename Notebook</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setMenuOpen(false);
                  onEditNotebook?.(notebook);
                }}
                className={`w-full text-left px-3 py-2 flex items-center gap-2 transition-colors cursor-pointer ${
                  isDark ? 'hover:bg-white/5' : 'hover:bg-slate-50'
                }`}
              >
                <Palette className="w-3.5 h-3.5 text-purple-400" />
                <span>Change Appearance</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setMenuOpen(false);
                  onAddSection?.();
                }}
                className={`w-full text-left px-3 py-2 flex items-center gap-2 transition-colors cursor-pointer ${
                  isDark ? 'hover:bg-white/5' : 'hover:bg-slate-50'
                }`}
              >
                <Plus className="w-3.5 h-3.5 text-emerald-400" />
                <span>Add Section</span>
              </button>

              <div className={`my-1 border-t ${isDark ? 'border-[#262638]' : 'border-slate-100'}`} />

              <button
                type="button"
                onClick={() => {
                  setMenuOpen(false);
                  onDeleteNotebook?.(notebook);
                }}
                className="w-full text-left px-3 py-2 flex items-center gap-2 text-red-400 hover:bg-red-500/10 transition-colors cursor-pointer"
              >
                <Trash2 className="w-3.5 h-3.5 text-red-400" />
                <span>Delete Notebook</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default NotebookHeader;
