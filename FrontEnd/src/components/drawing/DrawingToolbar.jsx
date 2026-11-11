import React, { useState, useRef, useEffect } from 'react';
import { useTheme } from '../../context/ThemeContext';
import {
  Pen,
  Highlighter,
  Eraser,
  Minus,
  Square,
  Circle,
  MoveRight,
  Undo2,
  Redo2,
  Trash2,
  ZoomIn,
  ZoomOut,
  Maximize2,
  Grid,
  Download,
  Check,
  ChevronDown,
  Sparkles,
  FileImage,
  Layers,
  Palette,
  Wand2,
  AlignLeft,
  Loader2
} from 'lucide-react';

export const DRAWING_PALETTES = [
  { name: 'Purple', dark: '#c084fc', light: '#7c3aed' },
  { name: 'Blue', dark: '#60a5fa', light: '#2563eb' },
  { name: 'Cyan', dark: '#22d3ee', light: '#0891b2' },
  { name: 'Emerald', dark: '#34d399', light: '#059669' },
  { name: 'Amber', dark: '#fbbf24', light: '#d97706' },
  { name: 'Rose', dark: '#f43f5e', light: '#e11d48' },
  { name: 'Monochrome', dark: '#f3f4f6', light: '#181326' },
  { name: 'Muted', dark: '#9ca3af', light: '#6b7280' }
];

export const HIGHLIGHTER_PALETTES = [
  { name: 'Yellow', color: '#fef08a' },
  { name: 'Lavender', color: '#e9d5ff' },
  { name: 'Mint', color: '#a7f3d0' },
  { name: 'Sky', color: '#bae6fd' },
  { name: 'Pink', color: '#fbcfe8' },
  { name: 'Orange', color: '#fed7aa' }
];

export const THICKNESS_PRESETS = [
  { label: 'Fine', value: 2 },
  { label: 'Medium', value: 4 },
  { label: 'Thick', value: 8 },
  { label: 'Bold', value: 14 }
];

export const DrawingToolbar = ({
  activeTool = 'pen',
  onSelectTool,
  color,
  onChangeColor,
  thickness = 3,
  onChangeThickness,
  background = 'plain',
  onChangeBackground,
  canUndo = false,
  canRedo = false,
  onUndo,
  onRedo,
  onClear,
  zoom = 1,
  onZoomIn,
  onZoomOut,
  onFitScreen,
  onExportPNG,
  onExportSVG,
  onSave,
  saveLabel = 'Insert into Note',
  isCompact = false,
  smartInkEnabled = true,
  onToggleSmartInk,
  onAlignWriting,
  onAiCleanup,
  isAiCleaning = false
}) => {
  const { isDark } = useTheme();
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [showThicknessMenu, setShowThicknessMenu] = useState(false);
  const [showBgMenu, setShowBgMenu] = useState(false);
  const [showExportMenu, setShowExportMenu] = useState(false);
  const [confirmClear, setConfirmClear] = useState(false);

  const colorRef = useRef(null);
  const thicknessRef = useRef(null);
  const bgRef = useRef(null);
  const exportRef = useRef(null);

  // Close dropdowns on click outside
  useEffect(() => {
    const handleOutside = (e) => {
      if (colorRef.current && !colorRef.current.contains(e.target)) setShowColorPicker(false);
      if (thicknessRef.current && !thicknessRef.current.contains(e.target)) setShowThicknessMenu(false);
      if (bgRef.current && !bgRef.current.contains(e.target)) setShowBgMenu(false);
      if (exportRef.current && !exportRef.current.contains(e.target)) setShowExportMenu(false);
    };
    document.addEventListener('mousedown', handleOutside);
    return () => document.removeEventListener('mousedown', handleOutside);
  }, []);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Don't trigger if user is typing in an input
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;

      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'z') {
        e.preventDefault();
        if (e.shiftKey) {
          if (canRedo && onRedo) onRedo();
        } else {
          if (canUndo && onUndo) onUndo();
        }
      } else if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'y') {
        e.preventDefault();
        if (canRedo && onRedo) onRedo();
      } else if (e.key === 'p' || e.key === 'P') {
        onSelectTool?.('pen');
      } else if (e.key === 'h' || e.key === 'H') {
        onSelectTool?.('highlighter');
      } else if (e.key === 'e' || e.key === 'E') {
        onSelectTool?.('eraser');
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [canUndo, canRedo, onUndo, onRedo, onSelectTool]);

  const activeColor = color || (isDark ? '#c084fc' : '#7c3aed');

  const getToolBtnClass = (toolName) => {
    const isSelected = activeTool === toolName;
    return `p-2 rounded-lg transition-all flex items-center justify-center relative cursor-pointer ${
      isSelected
        ? isDark
          ? 'bg-purple-900/40 text-purple-200 border border-purple-500/50 shadow-sm shadow-purple-950/40'
          : 'bg-[#EDE9FE] text-[#7C3AED] border border-[#DDD6FE] font-semibold shadow-sm shadow-purple-100'
        : isDark
          ? 'text-gray-400 hover:text-gray-200 hover:bg-[#1a1a26]'
          : 'text-[#6B7280] hover:text-[#181326] hover:bg-[#F3F0FA]'
    }`;
  };

  return (
    <div
      className={`px-3 py-2 border-b flex items-center justify-between gap-2 select-none text-xs transition-colors duration-150 relative z-30 overflow-visible ${
        isDark ? 'bg-[#151520] border-[#222232]' : 'bg-[#FAFAFD] border-[#EAE6F4]'
      }`}
    >
      {/* LEFT: Drawing Tools (Pen, Highlighter, Eraser, Shapes) */}
      <div className="flex items-center gap-1 overflow-visible py-0.5">
        {/* 1. Pen Tool */}
        <button
          type="button"
          onClick={() => onSelectTool('pen')}
          className={getToolBtnClass('pen')}
          title="Pen (P) - Smooth freehand drawing with pressure sensitivity"
        >
          <Pen className="w-4 h-4" />
        </button>

        {/* 2. Highlighter Tool */}
        <button
          type="button"
          onClick={() => onSelectTool('highlighter')}
          className={getToolBtnClass('highlighter')}
          title="Highlighter (H) - Translucent highlighting"
        >
          <Highlighter className="w-4 h-4" />
        </button>

        {/* 3. Eraser Tool */}
        <button
          type="button"
          onClick={() => onSelectTool('eraser')}
          className={getToolBtnClass('eraser')}
          title="Eraser (E) - Click or drag across strokes to erase"
        >
          <Eraser className="w-4 h-4" />
        </button>

        {/* Separator */}
        <div className={`w-[1px] h-5 mx-1 ${isDark ? 'bg-[#28283a]' : 'bg-[#EAE6F4]'}`} />

        {/* 4. Shapes (Line, Arrow, Rect, Ellipse) */}
        <button
          type="button"
          onClick={() => onSelectTool('line')}
          className={getToolBtnClass('line')}
          title="Straight Line"
        >
          <Minus className="w-4 h-4" />
        </button>

        <button
          type="button"
          onClick={() => onSelectTool('arrow')}
          className={getToolBtnClass('arrow')}
          title="Arrow"
        >
          <MoveRight className="w-4 h-4" />
        </button>

        <button
          type="button"
          onClick={() => onSelectTool('rect')}
          className={getToolBtnClass('rect')}
          title="Rectangle"
        >
          <Square className="w-4 h-4" />
        </button>

        <button
          type="button"
          onClick={() => onSelectTool('ellipse')}
          className={getToolBtnClass('ellipse')}
          title="Circle / Ellipse"
        >
          <Circle className="w-4 h-4" />
        </button>

        {/* Separator */}
        <div className={`w-[1px] h-5 mx-1 ${isDark ? 'bg-[#28283a]' : 'bg-[#EAE6F4]'}`} />

        {/* 5. Color Picker Dropdown */}
        <div className="relative" ref={colorRef}>
          <button
            type="button"
            onClick={() => {
              setShowColorPicker((prev) => !prev);
              setShowThicknessMenu(false);
              setShowBgMenu(false);
              setShowExportMenu(false);
              setConfirmClear(false);
            }}
            className={`p-1.5 px-2.5 rounded-lg border flex items-center gap-1.5 transition-colors cursor-pointer ${
              isDark
                ? 'bg-[#1a1a26] border-[#29293e] text-gray-200 hover:bg-[#222234]'
                : 'bg-white border-[#E2DEEE] text-[#181326] hover:bg-[#F9F8FD]'
            }`}
            title="Stroke Color"
          >
            <span
              className="w-3.5 h-3.5 rounded-full border border-black/20 shadow-sm shrink-0"
              style={{ backgroundColor: activeColor }}
            />
            <ChevronDown className="w-3 h-3 text-gray-400" />
          </button>

          {showColorPicker && (
            <div
              className={`absolute top-full left-0 mt-1.5 p-3 rounded-xl border shadow-2xl z-50 w-56 text-xs backdrop-blur-md animate-in fade-in zoom-in-95 ${
                isDark ? 'bg-[#181824] border-[#2b2b3e]' : 'bg-white border-[#E2DEEE] shadow-purple-200/50'
              }`}
            >
              <div className={`text-[10px] font-semibold uppercase tracking-wider mb-2 ${isDark ? 'text-gray-400' : 'text-[#6B7280]'}`}>
                {activeTool === 'highlighter' ? 'Highlighter Colors' : 'Color Palette'}
              </div>

              <div className="grid grid-cols-4 gap-2 mb-3">
                {(activeTool === 'highlighter' ? HIGHLIGHTER_PALETTES : DRAWING_PALETTES).map((p) => {
                  const c = p.color || (isDark ? p.dark : p.light);
                  const isCur = activeColor.toLowerCase() === c.toLowerCase();
                  return (
                    <button
                      key={p.name}
                      type="button"
                      onClick={() => {
                        onChangeColor(c);
                        if (activeTool === 'eraser') {
                          onSelectTool?.('pen');
                        }
                        setShowColorPicker(false);
                      }}
                      className="group relative flex flex-col items-center gap-1 p-1 rounded-lg hover:bg-purple-500/10 transition-colors cursor-pointer"
                      title={p.name}
                    >
                      <span
                        className="w-6 h-6 rounded-full border border-black/20 shadow-sm flex items-center justify-center transition-transform group-hover:scale-110"
                        style={{ backgroundColor: c }}
                      >
                        {isCur && <Check className="w-3 h-3 text-black/80 drop-shadow" />}
                      </span>
                      <span className={`text-[9px] truncate max-w-[44px] ${isDark ? 'text-gray-400' : 'text-[#6B7280]'}`}>
                        {p.name}
                      </span>
                    </button>
                  );
                })}
              </div>

              {/* Custom hex color input */}
              <div className={`pt-2 border-t flex items-center gap-2 ${isDark ? 'border-[#26263a]' : 'border-[#F0ECF8]'}`}>
                <span className={`text-[11px] ${isDark ? 'text-gray-400' : 'text-[#6B7280]'}`}>Custom:</span>
                <input
                  type="color"
                  value={activeColor.startsWith('#') && activeColor.length === 7 ? activeColor : '#a855f7'}
                  onChange={(e) => {
                    onChangeColor(e.target.value);
                    if (activeTool === 'eraser') {
                      onSelectTool?.('pen');
                    }
                  }}
                  className="w-7 h-7 rounded cursor-pointer border-none bg-transparent"
                  title="Pick custom color"
                />
                <span className="font-mono text-[10px] text-purple-400">{activeColor.toUpperCase()}</span>
              </div>
            </div>
          )}
        </div>

        {/* 6. Thickness Selector */}
        <div className="relative" ref={thicknessRef}>
          <button
            type="button"
            onClick={() => {
              setShowThicknessMenu((prev) => !prev);
              setShowColorPicker(false);
              setShowBgMenu(false);
              setShowExportMenu(false);
              setConfirmClear(false);
            }}
            className={`p-1.5 px-2 rounded-lg border flex items-center gap-1.5 transition-colors cursor-pointer ${
              isDark
                ? 'bg-[#1a1a26] border-[#29293e] text-gray-200 hover:bg-[#222234]'
                : 'bg-white border-[#E2DEEE] text-[#181326] hover:bg-[#F9F8FD]'
            }`}
            title="Stroke Thickness"
          >
            <div className="w-4 flex items-center justify-center">
              <span
                className="w-full rounded-full"
                style={{
                  height: `${Math.min(10, Math.max(2, thickness))}px`,
                  backgroundColor: activeColor
                }}
              />
            </div>
            <span className="text-[11px] font-mono">{thickness}px</span>
            <ChevronDown className="w-3 h-3 text-gray-400" />
          </button>

          {showThicknessMenu && (
            <div
              className={`absolute top-full left-0 mt-1.5 p-3 rounded-xl border shadow-2xl z-50 w-48 text-xs backdrop-blur-md animate-in fade-in zoom-in-95 ${
                isDark ? 'bg-[#181824] border-[#2b2b3e]' : 'bg-white border-[#E2DEEE] shadow-purple-200/50'
              }`}
            >
              <div className={`text-[10px] font-semibold uppercase tracking-wider mb-2 ${isDark ? 'text-gray-400' : 'text-[#6B7280]'}`}>
                Stroke Width
              </div>

              <div className="space-y-1.5 mb-3">
                {THICKNESS_PRESETS.map((tp) => (
                  <button
                    key={tp.label}
                    type="button"
                    onClick={() => {
                      onChangeThickness(tp.value);
                      if (activeTool === 'eraser') {
                        onSelectTool?.('pen');
                      }
                      setShowThicknessMenu(false);
                    }}
                    className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg transition-colors cursor-pointer ${
                      thickness === tp.value
                        ? isDark ? 'bg-purple-900/40 text-purple-300' : 'bg-[#EDE9FE] text-[#7C3AED] font-semibold'
                        : isDark ? 'hover:bg-[#232336] text-gray-300' : 'hover:bg-[#F4F2FA] text-[#374151]'
                    }`}
                  >
                    <span>{tp.label}</span>
                    <span
                      className="rounded-full"
                      style={{
                        width: '32px',
                        height: `${Math.min(10, tp.value)}px`,
                        backgroundColor: activeColor
                      }}
                    />
                  </button>
                ))}
              </div>

              {/* Slider for fine adjustment */}
              <div className="pt-2 border-t flex items-center gap-2">
                <input
                  type="range"
                  min="1"
                  max="32"
                  value={thickness}
                  onChange={(e) => onChangeThickness(Number(e.target.value))}
                  className="w-full accent-purple-500 cursor-pointer"
                />
              </div>
            </div>
          )}
        </div>

        {/* 7. Canvas Background Selector (Plain, Grid, Dotted, Lined) */}
        <div className="relative" ref={bgRef}>
          <button
            type="button"
            onClick={() => {
              setShowBgMenu((prev) => !prev);
              setShowColorPicker(false);
              setShowThicknessMenu(false);
              setShowExportMenu(false);
              setConfirmClear(false);
            }}
            className={`p-1.5 px-2 rounded-lg border flex items-center gap-1.5 transition-colors cursor-pointer ${
              isDark
                ? 'bg-[#1a1a26] border-[#29293e] text-gray-200 hover:bg-[#222234]'
                : 'bg-white border-[#E2DEEE] text-[#181326] hover:bg-[#F9F8FD]'
            }`}
            title="Canvas Background Style"
          >
            <Grid className="w-3.5 h-3.5 text-purple-500" />
            <span className="capitalize">{background}</span>
            <ChevronDown className="w-3 h-3 text-gray-400" />
          </button>

          {showBgMenu && (
            <div
              className={`absolute top-full left-0 mt-1.5 p-1.5 rounded-xl border shadow-2xl z-50 w-36 text-xs backdrop-blur-md animate-in fade-in zoom-in-95 ${
                isDark ? 'bg-[#181824] border-[#2b2b3e]' : 'bg-white border-[#E2DEEE] shadow-purple-200/50'
              }`}
            >
              {['plain', 'grid', 'dotted', 'lined'].map((bg) => (
                <button
                  key={bg}
                  type="button"
                  onClick={() => {
                    onChangeBackground(bg);
                    setShowBgMenu(false);
                  }}
                  className={`w-full text-left px-3 py-1.5 rounded-lg capitalize transition-colors flex items-center justify-between cursor-pointer ${
                    background === bg
                      ? isDark ? 'bg-purple-900/40 text-purple-300 font-semibold' : 'bg-[#EDE9FE] text-[#7C3AED] font-semibold'
                      : isDark ? 'text-gray-300 hover:bg-[#232336]' : 'text-[#374151] hover:bg-[#F4F2FA]'
                  }`}
                >
                  <span>{bg}</span>
                  {background === bg && <Check className="w-3 h-3 text-purple-500" />}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Separator */}
        <div className={`w-[1px] h-5 mx-1 hidden sm:block ${isDark ? 'bg-[#28283a]' : 'bg-[#EAE6F4]'}`} />

        {/* 8. Smart Ink AI Mode Toggle */}
        {onToggleSmartInk && (
          <button
            type="button"
            onClick={onToggleSmartInk}
            className={`p-1.5 px-2.5 rounded-lg border flex items-center gap-1.5 text-xs font-medium transition-all duration-150 cursor-pointer ${
              smartInkEnabled
                ? isDark
                  ? 'bg-purple-950/60 border-purple-500/60 text-purple-200 shadow-[0_0_12px_rgba(168,85,247,0.25)]'
                  : 'bg-purple-100 border-purple-400 text-purple-900 shadow-sm'
                : isDark
                  ? 'bg-[#1a1a26] border-[#29293e] text-gray-400 hover:text-gray-200 hover:bg-[#222234]'
                  : 'bg-white border-[#E2DEEE] text-[#6B7280] hover:text-[#181326] hover:bg-[#F9F8FD]'
            }`}
            title="Smart Ink: Natural jitter reduction & handwriting smoothing (Click to toggle)"
          >
            <Wand2 className={`w-3.5 h-3.5 ${smartInkEnabled ? 'text-purple-400' : 'text-gray-400'}`} />
            <span className="hidden sm:inline">Smart Ink</span>
            <span
              className={`w-1.5 h-1.5 rounded-full ${
                smartInkEnabled ? 'bg-purple-400 shadow-[0_0_6px_#c084fc]' : 'bg-gray-500'
              }`}
            />
          </button>
        )}

        {/* 9. Align Handwriting Action */}
        {onAlignWriting && (
          <button
            type="button"
            onClick={onAlignWriting}
            className={`p-1.5 px-2 rounded-lg border flex items-center gap-1.5 text-xs transition-colors cursor-pointer ${
              isDark
                ? 'bg-[#1a1a26] border-[#29293e] text-gray-300 hover:text-white hover:border-purple-500/40 hover:bg-[#222234]'
                : 'bg-white border-[#E2DEEE] text-[#374151] hover:text-[#181326] hover:border-purple-300 hover:bg-[#F9F8FD]'
            }`}
            title="Align Handwriting: Straighten writing baselines & spacing (Ctrl+Z to undo)"
          >
            <AlignLeft className="w-3.5 h-3.5 text-purple-400" />
            <span className="hidden md:inline">Align Writing</span>
          </button>
        )}

        {/* 10. AI Cleanup Action (Gemini Powered) */}
        {onAiCleanup && (
          <button
            type="button"
            onClick={onAiCleanup}
            disabled={isAiCleaning}
            className={`p-1.5 px-2.5 rounded-lg border flex items-center gap-1.5 text-xs font-medium transition-all duration-150 cursor-pointer ${
              isAiCleaning
                ? 'bg-purple-950/60 border-purple-500/50 text-purple-300 animate-pulse'
                : isDark
                ? 'bg-gradient-to-r from-purple-900/40 to-indigo-900/40 border-purple-500/40 text-purple-200 hover:border-purple-400 hover:shadow-[0_0_12px_rgba(168,85,247,0.25)]'
                : 'bg-purple-50 border-purple-300 text-purple-900 hover:bg-purple-100 hover:shadow-sm'
            }`}
            title="Smart Ink AI Cleanup: Transcribe & organize handwriting with Gemini (Click to run)"
          >
            {isAiCleaning ? (
              <>
                <Loader2 className="w-3.5 h-3.5 text-purple-400 animate-spin" />
                <span className="hidden md:inline">Analyzing...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-3.5 h-3.5 text-purple-400" />
                <span className="hidden md:inline">AI Cleanup</span>
              </>
            )}
          </button>
        )}
      </div>

      {/* RIGHT: History, Zoom, Clear, Export, Save Action */}
      <div className="flex items-center gap-1 shrink-0">
        {/* Undo */}
        <button
          type="button"
          onClick={onUndo}
          disabled={!canUndo}
          className={`p-1.5 rounded-lg transition-colors ${
            isDark
              ? 'text-gray-400 hover:text-gray-200 hover:bg-[#1a1a26] disabled:opacity-30 disabled:hover:bg-transparent'
              : 'text-[#6B7280] hover:text-[#181326] hover:bg-[#F3F0FA] disabled:opacity-30 disabled:hover:bg-transparent'
          }`}
          title="Undo (Ctrl+Z / Cmd+Z)"
        >
          <Undo2 className="w-4 h-4" />
        </button>

        {/* Redo */}
        <button
          type="button"
          onClick={onRedo}
          disabled={!canRedo}
          className={`p-1.5 rounded-lg transition-colors ${
            isDark
              ? 'text-gray-400 hover:text-gray-200 hover:bg-[#1a1a26] disabled:opacity-30 disabled:hover:bg-transparent'
              : 'text-[#6B7280] hover:text-[#181326] hover:bg-[#F3F0FA] disabled:opacity-30 disabled:hover:bg-transparent'
          }`}
          title="Redo (Ctrl+Y / Cmd+Shift+Z)"
        >
          <Redo2 className="w-4 h-4" />
        </button>

        {/* Clear Canvas with confirmation popover */}
        <div className="relative">
          <button
            type="button"
            onClick={() => setConfirmClear(!confirmClear)}
            className={`p-1.5 rounded-lg transition-colors text-red-400 hover:text-red-500 hover:bg-red-500/10`}
            title="Clear entire canvas"
          >
            <Trash2 className="w-4 h-4" />
          </button>

          {confirmClear && (
            <div
              className={`absolute top-full right-0 mt-1.5 p-3 rounded-xl border shadow-2xl z-50 w-52 text-xs backdrop-blur-md animate-in fade-in zoom-in-95 ${
                isDark ? 'bg-[#1a1824] border-red-500/40 text-gray-200' : 'bg-white border-red-200 text-gray-800 shadow-red-100'
              }`}
            >
              <div className="font-semibold text-red-400 mb-1">Clear Canvas?</div>
              <p className="text-[11px] text-gray-400 mb-2.5">All strokes will be erased. You can undo this action.</p>
              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => {
                    onClear?.();
                    setConfirmClear(false);
                  }}
                  className="flex-1 py-1 px-2 rounded-lg bg-red-600 hover:bg-red-500 text-white font-medium text-[11px] transition-colors"
                >
                  Yes, Clear
                </button>
                <button
                  type="button"
                  onClick={() => setConfirmClear(false)}
                  className={`py-1 px-2 rounded-lg ${isDark ? 'bg-[#252538] text-gray-300' : 'bg-gray-100 text-gray-700'}`}
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Separator */}
        <div className={`w-[1px] h-5 mx-1 ${isDark ? 'bg-[#28283a]' : 'bg-[#EAE6F4]'}`} />

        {/* Zoom Controls */}
        <div className="flex items-center gap-0.5">
          <button
            type="button"
            onClick={onZoomOut}
            className={`p-1.5 rounded-lg ${isDark ? 'text-gray-400 hover:text-gray-200 hover:bg-[#1a1a26]' : 'text-[#6B7280] hover:text-[#181326] hover:bg-[#F3F0FA]'}`}
            title="Zoom Out"
          >
            <ZoomOut className="w-3.5 h-3.5" />
          </button>
          <span className="font-mono text-[10px] text-gray-400 px-1">{Math.round(zoom * 100)}%</span>
          <button
            type="button"
            onClick={onZoomIn}
            className={`p-1.5 rounded-lg ${isDark ? 'text-gray-400 hover:text-gray-200 hover:bg-[#1a1a26]' : 'text-[#6B7280] hover:text-[#181326] hover:bg-[#F3F0FA]'}`}
            title="Zoom In"
          >
            <ZoomIn className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={onFitScreen}
            className={`p-1.5 rounded-lg ${isDark ? 'text-gray-400 hover:text-gray-200 hover:bg-[#1a1a26]' : 'text-[#6B7280] hover:text-[#181326] hover:bg-[#F3F0FA]'}`}
            title="Fit to Screen (100%)"
          >
            <Maximize2 className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Separator */}
        <div className={`w-[1px] h-5 mx-1 ${isDark ? 'bg-[#28283a]' : 'bg-[#EAE6F4]'}`} />

        {/* Export Dropdown (PNG, SVG) */}
        <div className="relative" ref={exportRef}>
          <button
            type="button"
            onClick={() => setShowExportMenu(!showExportMenu)}
            className={`p-1.5 px-2 rounded-lg border flex items-center gap-1 transition-colors ${
              isDark
                ? 'bg-[#1a1a26] border-[#29293e] text-gray-300 hover:text-white hover:bg-[#222234]'
                : 'bg-white border-[#E2DEEE] text-[#4B5563] hover:text-[#111827] hover:bg-[#F9F8FD]'
            }`}
            title="Export drawing"
          >
            <Download className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Export</span>
            <ChevronDown className="w-3 h-3 text-gray-400" />
          </button>

          {showExportMenu && (
            <div
              className={`absolute top-full right-0 mt-1.5 p-1.5 rounded-xl border shadow-2xl z-50 w-44 text-xs backdrop-blur-md animate-in fade-in zoom-in-95 ${
                isDark ? 'bg-[#181824] border-[#2b2b3e]' : 'bg-white border-[#E2DEEE] shadow-purple-200/50'
              }`}
            >
              <button
                type="button"
                onClick={() => {
                  onExportPNG?.();
                  setShowExportMenu(false);
                }}
                className={`w-full text-left px-3 py-1.5 rounded-lg transition-colors flex items-center gap-2 ${
                  isDark ? 'text-gray-300 hover:bg-[#232336]' : 'text-[#374151] hover:bg-[#F4F2FA]'
                }`}
              >
                <FileImage className="w-3.5 h-3.5 text-purple-500" />
                <span>Export as PNG (Image)</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  onExportSVG?.();
                  setShowExportMenu(false);
                }}
                className={`w-full text-left px-3 py-1.5 rounded-lg transition-colors flex items-center gap-2 ${
                  isDark ? 'text-gray-300 hover:bg-[#232336]' : 'text-[#374151] hover:bg-[#F4F2FA]'
                }`}
              >
                <Layers className="w-3.5 h-3.5 text-purple-500" />
                <span>Export as SVG (Vector)</span>
              </button>
            </div>
          )}
        </div>

        {/* Primary Save Action Button */}
        {onSave && (
          <button
            type="button"
            onClick={onSave}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-medium text-xs shadow-sm shadow-purple-900/40 transition-all cursor-pointer"
          >
            <Check className="w-3.5 h-3.5 stroke-[2.5]" />
            <span>{saveLabel}</span>
          </button>
        )}
      </div>
    </div>
  );
};

export default DrawingToolbar;

