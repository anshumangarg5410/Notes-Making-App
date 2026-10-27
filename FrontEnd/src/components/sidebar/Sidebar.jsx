import React from 'react';
import {
  FileText,
  Star,
  GraduationCap,
  Briefcase,
  User,
  Lightbulb,
  Archive,
  Trash2,
  Plus,
  Feather,
  X
} from 'lucide-react';
import { LandscapeIllustration } from '../common/LandscapeIllustration';

export const Sidebar = ({
  activeFilter,
  onSelectFilter,
  stats = {},
  onNewNote,
  isOpen,
  onCloseMobile
}) => {
  const navItems = [
    { id: 'all', label: 'All Notes', icon: FileText, count: stats.all },
    { id: 'favorites', label: 'Favorites', icon: Star, count: stats.favorites },
    { id: 'study', label: 'Study', icon: GraduationCap, count: stats.study },
    { id: 'work', label: 'Work', icon: Briefcase, count: stats.work },
    { id: 'personal', label: 'Personal', icon: User, count: stats.personal },
    { id: 'ideas', label: 'Ideas', icon: Lightbulb, count: stats.ideas },
    { id: 'archived', label: 'Archive', icon: Archive, count: stats.archive },
    { id: 'trash', label: 'Trash', icon: Trash2, count: stats.trash }
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-charcoal-950/40 backdrop-blur-sm z-40 md:hidden"
          onClick={onCloseMobile}
        />
      )}

      {/* Sidebar Panel */}
      <aside
        className={`fixed md:static inset-y-0 left-0 z-50 w-64 bg-warm-sidebar dark:bg-charcoal-900 border-r border-warm-border dark:border-charcoal-800 flex flex-col justify-between transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
      >
        <div className="p-5 flex flex-col flex-1 overflow-y-auto">
          {/* Header Brand */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-3">
              <div className="w-9 h-9 rounded-xl bg-terracotta-100 dark:bg-terracotta-900/40 flex items-center justify-center text-terracotta-500 shadow-sm">
                <Feather className="w-5 h-5 transform -rotate-12" />
              </div>
              <div>
                <h1 className="font-serif font-bold text-2xl tracking-tight text-charcoal-900 dark:text-cream-50 leading-none">
                  Notely
                </h1>
                <p className="text-[10px] uppercase tracking-widest text-charcoal-400 dark:text-charcoal-500 font-medium mt-1">
                  Write • Organize • Think
                </p>
              </div>
            </div>

            {/* Mobile Close Button */}
            <button
              onClick={onCloseMobile}
              className="p-1.5 rounded-lg text-charcoal-400 hover:text-charcoal-700 dark:hover:text-cream-100 hover:bg-cream-200/50 dark:hover:bg-charcoal-800 md:hidden"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* New Note Button */}
          <button
            onClick={() => {
              onNewNote();
              if (onCloseMobile) onCloseMobile();
            }}
            id="new-note-btn"
            className="w-full mb-6 py-2.5 px-4 bg-terracotta-500 hover:bg-terracotta-600 text-white rounded-xl font-medium text-sm flex items-center justify-center space-x-2 shadow-sm transition-all duration-200 active:scale-[0.98] group"
          >
            <Plus className="w-4 h-4 stroke-[2.5] group-hover:rotate-90 transition-transform duration-200" />
            <span>New Note</span>
          </button>

          {/* Navigation Items */}
          <nav className="space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeFilter === item.id;

              return (
                <button
                  key={item.id}
                  onClick={() => {
                    onSelectFilter(item.id);
                    if (onCloseMobile) onCloseMobile();
                  }}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all duration-150 ${
                    isActive
                      ? 'bg-terracotta-100/70 text-terracotta-700 dark:bg-terracotta-900/30 dark:text-terracotta-300'
                      : 'text-charcoal-600 dark:text-charcoal-300 hover:bg-cream-100/70 dark:hover:bg-charcoal-800/60'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <Icon
                      className={`w-4 h-4 ${
                        isActive
                          ? 'text-terracotta-500'
                          : 'text-charcoal-400 dark:text-charcoal-500'
                      }`}
                    />
                    <span>{item.label}</span>
                  </div>

                  {typeof item.count === 'number' && item.count > 0 && (
                    <span
                      className={`text-xs px-2 py-0.5 rounded-full font-semibold ${
                        isActive
                          ? 'bg-terracotta-200/80 text-terracotta-800 dark:bg-terracotta-800 dark:text-terracotta-200'
                          : 'bg-cream-200/80 text-charcoal-500 dark:bg-charcoal-800 dark:text-charcoal-400'
                      }`}
                    >
                      {item.count}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Bottom Landscape Artwork */}
        <div className="p-4 pt-0">
          <LandscapeIllustration />
        </div>
      </aside>
    </>
  );
};
