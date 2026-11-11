import React from 'react';
import { useTheme } from '../../context/ThemeContext';
import {
  FileText,
  X,
  Plus,
  CheckCircle2,
  Clock,
  AlertCircle,
  PanelRightClose,
  PanelRightOpen,
  Maximize2,
  Minimize2,
  MoreVertical
} from 'lucide-react';

export const EditorTabBar = ({
  tabs = [],
  activeTabId,
  onSwitchTab,
  onCloseTab,
  onNewTab,
  saveStatus = 'saved', // 'saved', 'saving', 'unsaved', 'offline'
  isInspectorOpen = true,
  onToggleInspector,
  isFocusMode = false,
  onToggleFocusMode,
  onOpenMoreMenu,
  onManualSave
}) => {
  const { isDark } = useTheme();
  return (
    <div className={`h-10 border-b flex items-center justify-between px-2 select-none transition-colors duration-150 ${
      isDark ? 'bg-[#12121a] border-[#222230]' : 'bg-[#FAFAFD] border-[#EAE6F4]'
    }`}>
      {/* Left: Tab list */}
      <div className="flex items-center gap-1 overflow-x-auto obsidian-scrollbar py-0.5">
        {tabs.map((tab) => {
          const isActive = tab.id === activeTabId;
          return (
            <div
              key={tab.id}
              onClick={() => onSwitchTab(tab.id)}
              style={isActive ? { borderTopColor: 'var(--accent, #a855f7)' } : undefined}
              className={`group flex items-center gap-2 px-3 py-1.5 rounded-t-[4px] text-xs font-medium cursor-pointer transition-all border-t-2 ${
                isActive
                  ? isDark
                    ? 'bg-[#191924] text-gray-100 shadow-sm'
                    : 'bg-white text-[#181326] shadow-sm border-[#7C3AED]'
                  : isDark
                    ? 'bg-transparent border-transparent text-gray-400 hover:text-gray-200 hover:bg-[#161620]'
                    : 'bg-transparent border-transparent text-[#6B7280] hover:text-[#181326] hover:bg-[#F3F0F9]'
              }`}
            >
              <FileText
                className="w-3.5 h-3.5"
                style={isActive ? { color: 'var(--accent, #c084fc)' } : undefined}
              />
              <span className="truncate max-w-[140px]">{tab.title || 'Untitled Note'}</span>

              {tab.isUnsaved && (
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400" title="Unsaved changes" />
              )}

              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onCloseTab(tab.id);
                }}
                className={`p-0.5 rounded opacity-60 group-hover:opacity-100 transition-opacity ${
                  isDark ? 'hover:bg-[#252536] text-gray-400 hover:text-gray-200' : 'hover:bg-[#EAE6F4] text-[#6B7280] hover:text-[#181326]'
                }`}
                title="Close tab"
              >
                <X className="w-3 h-3" />
              </button>
            </div>
          );
        })}

        {/* Plus new tab button */}
        <button
          onClick={onNewTab}
          className={`p-1.5 rounded-[3px] transition-colors ${
            isDark ? 'text-gray-400 hover:text-gray-200 hover:bg-[#1a1a24]' : 'text-[#6B7280] hover:text-[#181326] hover:bg-[#F3F0F9]'
          }`}
          title="New Tab"
        >
          <Plus className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Right: Status badge & Window Controls */}
      <div className="flex items-center gap-2 pl-2 shrink-0">
        {/* Sync/Save Status Badge */}
        {activeTabId && tabs.length > 0 && (
          saveStatus === 'saving' ? (
            <div
              className="flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[11px] border"
              style={{
                backgroundColor: 'var(--accent-bg, rgba(168, 85, 247, 0.15))',
                borderColor: 'var(--accent-border, rgba(168, 85, 247, 0.4))',
                color: 'var(--accent-text, #c084fc)'
              }}
            >
              <Clock className="w-3 h-3 animate-spin" />
              <span>Saving...</span>
            </div>
          ) : saveStatus === 'unsaved' ? (
            <button
              type="button"
              onClick={onManualSave}
              title="Click or press Ctrl+S to save"
              className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-amber-950/40 border border-amber-500/40 hover:border-amber-400 text-[11px] text-amber-300 transition-colors cursor-pointer"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
              <span>Save (Ctrl+S)</span>
            </button>
          ) : saveStatus === 'offline' ? (
            <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-blue-950/40 border border-blue-500/30 text-[11px] text-blue-300">
              <span className="w-2 h-2 rounded-full bg-blue-400" />
              <span>Saved locally</span>
            </div>
          ) : (
            <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-emerald-950/40 border border-emerald-500/30 text-[11px] text-emerald-400">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
              <span>Saved</span>
            </div>
          )
        )}

        {/* Inspector / Properties Panel Toggle */}
        <button
          onClick={onToggleInspector}
          className={`p-1.5 rounded-[3px] transition-colors ${
            isInspectorOpen
              ? isDark ? 'text-purple-300 bg-purple-900/30' : 'text-[#7C3AED] bg-[#EDE9FE]'
              : isDark ? 'text-gray-400 hover:text-gray-200 hover:bg-[#1c1c28]' : 'text-[#6B7280] hover:text-[#181326] hover:bg-[#F3F0F9]'
          }`}
          title={isInspectorOpen ? 'Hide Properties Panel' : 'Show Properties Panel'}
        >
          {isInspectorOpen ? (
            <PanelRightClose className="w-4 h-4" />
          ) : (
            <PanelRightOpen className="w-4 h-4" />
          )}
        </button>

        {/* Focus / Maximize Toggle */}
        <button
          onClick={onToggleFocusMode}
          className={`p-1.5 rounded-[3px] transition-colors ${
            isDark ? 'text-gray-400 hover:text-gray-200 hover:bg-[#1c1c28]' : 'text-[#6B7280] hover:text-[#181326] hover:bg-[#F3F0F9]'
          }`}
          title={isFocusMode ? 'Exit Fullscreen' : 'Fullscreen / Focus'}
        >
          {isFocusMode ? (
            <Minimize2 className="w-4 h-4" />
          ) : (
            <Maximize2 className="w-4 h-4" />
          )}
        </button>

        {/* More Menu */}
        {onOpenMoreMenu && (
          <button
            onClick={onOpenMoreMenu}
            className={`p-1.5 rounded-[3px] transition-colors ${
              isDark ? 'text-gray-400 hover:text-gray-200 hover:bg-[#1c1c28]' : 'text-[#6B7280] hover:text-[#181326] hover:bg-[#F3F0F9]'
            }`}
            title="More Options"
          >
            <MoreVertical className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
};

