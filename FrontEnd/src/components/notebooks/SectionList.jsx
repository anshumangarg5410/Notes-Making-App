import React, { useState, useRef, useEffect } from 'react';
import {
  Bookmark,
  FileText,
  Code,
  CheckSquare,
  List,
  Hash,
  Tag,
  Star,
  Folder,
  Plus,
  MoreVertical,
  Edit2,
  ArrowRight,
  Trash2,
  GripVertical
} from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

const ICON_MAP = {
  bookmark: Bookmark,
  'file-text': FileText,
  code: Code,
  'check-square': CheckSquare,
  list: List,
  hash: Hash,
  tag: Tag,
  star: Star,
  folder: Folder
};

export const SectionList = ({
  sections = [],
  selectedSectionId = null,
  onSelectSection,
  onAddSection,
  onEditSection,
  onMoveSection,
  onDeleteSection,
  onReorderSections
}) => {
  const { isDark } = useTheme();
  const [activeMenuId, setActiveMenuId] = useState(null);
  const [draggedIdx, setDraggedIdx] = useState(null);
  const menuRef = useRef(null);

  useEffect(() => {
    const handleOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setActiveMenuId(null);
      }
    };
    document.addEventListener('mousedown', handleOutside);
    return () => document.removeEventListener('mousedown', handleOutside);
  }, []);

  const handleDragStart = (e, index) => {
    setDraggedIdx(index);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e, index) => {
    e.preventDefault();
    if (draggedIdx === null || draggedIdx === index) return;

    const updated = [...sections];
    const draggedItem = updated[draggedIdx];
    updated.splice(draggedIdx, 1);
    updated.splice(index, 0, draggedItem);
    setDraggedIdx(index);
    onReorderSections?.(updated);
  };

  const handleDragEnd = () => {
    setDraggedIdx(null);
  };

  return (
    <div className="flex-1 flex flex-col justify-between overflow-hidden p-3">
      <div className="space-y-1.5 overflow-y-auto obsidian-scrollbar flex-1 pr-1">
        {sections.length === 0 ? (
          <div className="p-6 text-center text-xs opacity-60">
            <Bookmark className="w-6 h-6 mx-auto mb-2 text-pink-400 opacity-60" />
            <p className="font-medium">No sections yet</p>
            <p className="text-[11px] mt-1">Create your first section to organize notes</p>
          </div>
        ) : (
          sections.map((section, idx) => {
            const secId = section._id || section.id;
            const isSelected = selectedSectionId === secId;
            const IconComponent = ICON_MAP[section.icon] || Bookmark;
            const isMenuOpen = activeMenuId === secId;

            return (
              <div
                key={secId}
                draggable
                onDragStart={(e) => handleDragStart(e, idx)}
                onDragOver={(e) => handleDragOver(e, idx)}
                onDragEnd={handleDragEnd}
                onClick={() => onSelectSection?.(section)}
                className={`group relative p-2.5 rounded-xl border flex items-center justify-between transition-all duration-150 cursor-pointer select-none ${
                  isSelected
                    ? isDark
                      ? 'bg-pink-500/15 border-pink-500/40 text-pink-200 shadow-sm'
                      : 'bg-pink-50/80 border-pink-300 text-pink-900 shadow-xs'
                    : isDark
                      ? 'bg-[#181824]/60 hover:bg-[#1c1c2a] border-[#242436] text-gray-200 hover:border-[#32324a]'
                      : 'bg-white hover:bg-[#FAF8FD] border-[#EAE6F4] text-slate-800 hover:border-[#DDD6FE]'
                }`}
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  {/* Drag Handle */}
                  <div className="opacity-0 group-hover:opacity-40 hover:opacity-100 cursor-grab transition-opacity shrink-0">
                    <GripVertical className="w-3.5 h-3.5" />
                  </div>

                  {/* Section Icon */}
                  <div
                    className={`w-6 h-6 rounded-lg flex items-center justify-center shrink-0 transition-colors ${
                      isSelected
                        ? 'bg-pink-500/20 text-pink-400'
                        : isDark
                          ? 'bg-[#222234] text-gray-400 group-hover:text-pink-400'
                          : 'bg-[#F2EDFA] text-slate-500 group-hover:text-pink-600'
                    }`}
                  >
                    <IconComponent className="w-3.5 h-3.5" />
                  </div>

                  {/* Section Name & Note count */}
                  <div className="min-w-0">
                    <h4 className="text-xs font-semibold truncate leading-tight">
                      {section.name}
                    </h4>
                    <span className={`text-[10px] block mt-0.5 ${isDark ? 'text-gray-400' : 'text-slate-500'}`}>
                      {section.noteCount || 0} {section.noteCount === 1 ? 'note' : 'notes'}
                    </span>
                  </div>
                </div>

                {/* Section Context Menu */}
                <div className="relative shrink-0" ref={isMenuOpen ? menuRef : null}>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setActiveMenuId(isMenuOpen ? null : secId);
                    }}
                    className={`p-1 rounded-md opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer ${
                      isDark ? 'hover:bg-white/10 text-gray-400' : 'hover:bg-slate-100 text-slate-500'
                    }`}
                    title="Section options"
                  >
                    <MoreVertical className="w-3.5 h-3.5" />
                  </button>

                  {isMenuOpen && (
                    <div
                      className={`absolute top-full right-0 mt-1 py-1 w-44 rounded-xl border shadow-xl z-50 text-xs backdrop-blur-md animate-in fade-in zoom-in-95 ${
                        isDark ? 'bg-[#181826] border-[#2b2b3e] text-gray-200' : 'bg-white border-slate-200 text-slate-800 shadow-purple-200/40'
                      }`}
                      onClick={(e) => e.stopPropagation()}
                    >
                      <button
                        type="button"
                        onClick={() => {
                          setActiveMenuId(null);
                          onEditSection?.(section);
                        }}
                        className={`w-full text-left px-3 py-1.5 flex items-center gap-2 transition-colors cursor-pointer ${
                          isDark ? 'hover:bg-white/5' : 'hover:bg-slate-50'
                        }`}
                      >
                        <Edit2 className="w-3 h-3 text-pink-400" />
                        <span>Rename Section</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          setActiveMenuId(null);
                          onMoveSection?.(section);
                        }}
                        className={`w-full text-left px-3 py-1.5 flex items-center gap-2 transition-colors cursor-pointer ${
                          isDark ? 'hover:bg-white/5' : 'hover:bg-slate-50'
                        }`}
                      >
                        <ArrowRight className="w-3 h-3 text-purple-400" />
                        <span>Move to Notebook...</span>
                      </button>

                      <div className={`my-1 border-t ${isDark ? 'border-[#262638]' : 'border-slate-100'}`} />

                      <button
                        type="button"
                        onClick={() => {
                          setActiveMenuId(null);
                          onDeleteSection?.(section);
                        }}
                        className="w-full text-left px-3 py-1.5 flex items-center gap-2 text-red-400 hover:bg-red-500/10 transition-colors cursor-pointer"
                      >
                        <Trash2 className="w-3 h-3 text-red-400" />
                        <span>Delete Section</span>
                      </button>
                    </div>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Add Section Button at the bottom */}
      <div className="pt-2 border-t border-inherit shrink-0">
        <button
          type="button"
          onClick={onAddSection}
          className={`w-full py-2 px-3 rounded-xl border border-dashed flex items-center justify-center gap-2 text-xs font-semibold transition-all cursor-pointer ${
            isDark
              ? 'border-pink-500/30 text-pink-400 hover:bg-pink-500/10 hover:border-pink-500/60'
              : 'border-pink-300 text-pink-600 hover:bg-pink-50 hover:border-pink-400'
          }`}
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Add Section</span>
        </button>
      </div>
    </div>
  );
};

export default SectionList;

