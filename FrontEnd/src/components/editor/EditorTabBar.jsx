import React from 'react';
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
  onOpenMoreMenu
}) => {
  return (
    <div className="h-10 bg-[#12121a] border-b border-[#222230] flex items-center justify-between px-2 select-none">
      {/* Left: Tab list */}
      <div className="flex items-center gap-1 overflow-x-auto obsidian-scrollbar py-0.5">
        {tabs.map((tab) => {
          const isActive = tab.id === activeTabId;
          return (
            <div
              key={tab.id}
              onClick={() => onSwitchTab(tab.id)}
              className={`group flex items-center gap-2 px-3 py-1.5 rounded-t-[4px] text-xs font-medium cursor-pointer transition-all border-t-2 ${
                isActive
                  ? 'bg-[#191924] border-purple-500 text-gray-100 shadow-sm'
                  : 'bg-transparent border-transparent text-gray-400 hover:text-gray-200 hover:bg-[#161620]'
              }`}
            >
              <FileText className={`w-3.5 h-3.5 ${isActive ? 'text-purple-400' : 'text-gray-500'}`} />
              <span className="truncate max-w-[140px]">{tab.title || 'Untitled Note'}</span>

              {tab.isUnsaved && (
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400" title="Unsaved changes" />
              )}

              {tabs.length > 1 && (
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onCloseTab(tab.id);
                  }}
                  className="p-0.5 rounded hover:bg-[#252536] text-gray-400 hover:text-gray-200 opacity-60 group-hover:opacity-100 transition-opacity"
                  title="Close tab"
                >
                  <X className="w-3 h-3" />
                </button>
              )}
            </div>
          );
        })}

        {/* Plus new tab button */}
        <button
          onClick={onNewTab}
          className="p-1.5 text-gray-400 hover:text-gray-200 hover:bg-[#1a1a24] rounded-[3px] transition-colors"
          title="New Tab"
        >
          <Plus className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Right: Status badge & Window Controls */}
      <div className="flex items-center gap-2 pl-2 shrink-0">
        {/* Sync/Save Status Badge */}
        {saveStatus === 'saving' ? (
          <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-purple-950/40 border border-purple-500/30 text-[11px] text-purple-300">
            <Clock className="w-3 h-3 animate-spin" />
            <span>Saving...</span>
          </div>
        ) : saveStatus === 'unsaved' ? (
          <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-amber-950/40 border border-amber-500/30 text-[11px] text-amber-300">
            <span className="w-2 h-2 rounded-full bg-amber-400" />
            <span>Unsaved</span>
          </div>
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
        )}

        {/* Inspector / Properties Panel Toggle */}
        <button
          onClick={onToggleInspector}
          className={`p-1.5 rounded-[3px] transition-colors ${
            isInspectorOpen
              ? 'text-purple-300 bg-purple-900/30'
              : 'text-gray-400 hover:text-gray-200 hover:bg-[#1c1c28]'
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
          className="p-1.5 rounded-[3px] text-gray-400 hover:text-gray-200 hover:bg-[#1c1c28] transition-colors"
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
            className="p-1.5 rounded-[3px] text-gray-400 hover:text-gray-200 hover:bg-[#1c1c28] transition-colors"
            title="More Options"
          >
            <MoreVertical className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
};
