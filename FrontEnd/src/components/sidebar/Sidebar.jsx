import React from 'react';
import { Link } from 'react-router-dom';
import {
  LayoutDashboard,
  FileText,
  Star,
  Folder,
  Tag,
  Trash2,
  Plus,
  X
} from 'lucide-react';
import websiteLogo from '../../assets/shared/logo/websiteLogo.png';
import sidebarQuoteDark from '../../assets/dashboard/sidebar-quote-dark.png';
import sidebarQuoteLight from '../../assets/dashboard/sidebar-quote-light.png';
import { useTheme } from '../../context/ThemeContext';

export const Sidebar = ({
  activeFilter,
  onSelectFilter,
  stats = {},
  onNewNote,
  isOpen,
  onCloseMobile
}) => {
  const { isDark } = useTheme();

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'all', label: 'All Notes', icon: FileText, count: stats.all ?? 48 },
    { id: 'favorites', label: 'Favorites', icon: Star, count: stats.favorites ?? 9 },
    { id: 'folders', label: 'Folders', icon: Folder, count: stats.folders ?? 6 },
    { id: 'tags', label: 'Tags', icon: Tag, count: stats.tags ?? 12 },
    { id: 'trash', label: 'Trash', icon: Trash2, count: stats.trash ?? 0 }
  ];

  const collections = [
    { id: 'dsa', label: 'DSA Notes', color: 'bg-amber-500' },
    { id: 'web-dev', label: 'Web Development', color: 'bg-emerald-500' },
    { id: 'system-design', label: 'System Design', color: 'bg-blue-500' },
    { id: 'recipes', label: 'Recipes', color: 'bg-rose-500' },
    { id: 'travel', label: 'Travel', color: 'bg-purple-500' }
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
        className={`fixed md:static inset-y-0 left-0 z-50 w-64 bg-cream-50/95 dark:bg-charcoal-900 border-r border-warm-border dark:border-charcoal-800 flex flex-col justify-between transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
      >
        <div className="p-4 flex flex-col flex-1 overflow-y-auto">
          {/* Header Brand */}
          <div className="flex items-center justify-between mb-5">
            <Link to="/" className="flex items-center space-x-2.5 group">
              <div className="relative w-8 h-8 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                <div className="absolute inset-0 rounded-full blur-xs bg-purple-500/30 pointer-events-none" />
                <img
                  src={websiteLogo}
                  alt="NoteNest Logo"
                  className="relative z-10 w-full h-full object-contain filter drop-shadow-[0_0_8px_rgba(168,85,247,0.4)]"
                />
              </div>
              <div>
                <h1 className="font-serif font-bold text-lg tracking-tight text-white leading-none">
                  NoteNest
                </h1>
                <p className="text-[9px] uppercase tracking-widest text-purple-400 font-semibold mt-1">
                  Your Ideas, Organized
                </p>
              </div>
            </Link>

            {/* Mobile Close Button */}
            <button
              onClick={onCloseMobile}
              className="p-1.5 rounded-[3px] text-charcoal-400 hover:text-white hover:bg-white/10 md:hidden cursor-pointer"
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
            className="w-full mb-4 py-2.5 px-4 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white rounded-[3px] border border-orange-400/40 font-medium text-sm flex items-center justify-center space-x-2 shadow-sm shadow-orange-500/25 hover:shadow-orange-500/35 transition-all duration-200 active:scale-[0.98] group"
          >
            <Plus className="w-4 h-4 stroke-[2.5] group-hover:rotate-90 transition-transform duration-200" />
            <span>New Note</span>
          </button>

          {/* Navigation Items */}
          <nav className="space-y-0.5">
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
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-[3px] text-xs font-medium transition-all duration-150 ${
                    isActive
                      ? 'bg-orange-500/10 text-orange-600 dark:text-orange-300 font-semibold border-l-2 border-orange-500 pl-2.5'
                      : 'text-charcoal-600 dark:text-charcoal-300 hover:bg-cream-200/60 dark:hover:bg-charcoal-800/60'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <Icon
                      className={`w-4 h-4 ${
                        isActive
                          ? 'text-orange-500 dark:text-orange-400'
                          : 'text-charcoal-400 dark:text-charcoal-500'
                      }`}
                    />
                    <span>{item.label}</span>
                  </div>

                  {typeof item.count === 'number' && item.count > 0 && (
                    <span
                      className={`text-[11px] px-2 py-0.5 rounded-[2px] font-medium ${
                        isActive
                          ? 'bg-orange-100 text-orange-700 dark:bg-orange-950/60 dark:text-orange-200'
                          : 'bg-cream-200/70 text-charcoal-400 dark:bg-charcoal-800 dark:text-charcoal-400'
                      }`}
                    >
                      {item.count}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          {/* Collections Section */}
          <div className="mt-5 pt-4 border-t border-warm-border/60 dark:border-charcoal-800">
            <div className="flex items-center justify-between px-2 mb-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-charcoal-400 dark:text-charcoal-500">
                Collections
              </span>
              <button
                onClick={() => onNewNote()}
                className="p-1 rounded-[2px] text-charcoal-400 hover:text-orange-500 dark:hover:text-orange-400 transition-colors"
                title="Add Collection"
              >
                <Plus className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="space-y-0.5">
              {collections.map((coll) => {
                const isActive = activeFilter === coll.id;
                return (
                  <button
                    key={coll.id}
                    onClick={() => {
                      onSelectFilter(coll.id);
                      if (onCloseMobile) onCloseMobile();
                    }}
                    className={`w-full flex items-center space-x-2.5 px-3 py-1.5 rounded-[3px] text-xs font-medium transition-all ${
                      isActive
                        ? 'bg-orange-500/10 text-orange-600 dark:text-orange-300 font-semibold'
                        : 'text-charcoal-600 dark:text-charcoal-300 hover:bg-cream-200/60 dark:hover:bg-charcoal-800/60'
                    }`}
                  >
                    <div className="flex items-center space-x-2.5 min-w-0">
                      <span className={`w-2 h-2 rounded-full flex-shrink-0 ${coll.color}`} />
                      <Folder className="w-3.5 h-3.5 text-charcoal-400 dark:text-charcoal-500 fill-current opacity-70" />
                      <span className="truncate">{coll.label}</span>
                    </div>
                  </button>
                );
              })}

              <button
                onClick={() => onNewNote()}
                className="w-full flex items-center space-x-2 px-3 py-1.5 rounded-[3px] text-xs text-charcoal-400 dark:text-charcoal-500 hover:text-orange-600 dark:hover:text-orange-400 transition-colors"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>New Collection</span>
              </button>
            </div>
          </div>
        </div>

        {/* Bottom Quote Sticker Card */}
        <div className="p-3 pt-0">
          <div className="relative rounded-[4px] overflow-hidden border border-warm-border dark:border-charcoal-800 shadow-xs bg-cream-100/60 dark:bg-charcoal-800/60 group">
            <img
              src={isDark ? sidebarQuoteDark : sidebarQuoteLight}
              alt="Small notes today, a brighter you tomorrow"
              className="w-full h-auto object-cover rounded-[3px] transition-transform duration-300 group-hover:scale-[1.02]"
            />
          </div>
        </div>
      </aside>
    </>
  );
};
