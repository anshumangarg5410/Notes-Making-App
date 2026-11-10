import React, { useState, useRef, useEffect } from 'react';
import { useTheme } from '../../context/ThemeContext';
import { useToast } from '../../context/ToastContext';
import { DrawingCanvas } from './DrawingCanvas';
import { DrawingToolbar } from './DrawingToolbar';
import {
  PenTool,
  Save,
  Download,
  Share2,
  Folder,
  ArrowLeft,
  Check,
  FileImage,
  Layers,
  Sparkles
} from 'lucide-react';

export const DrawingWorkspace = ({
  initialDrawing = null,
  onSaveToNotes,
  onBack,
  activeNote = null
}) => {
  const { isDark } = useTheme();
  const { success, error: toastError, info } = useToast();
  const canvasRef = useRef(null);

  const [activeTool, setActiveTool] = useState('pen');
  const [color, setColor] = useState(() => (isDark ? '#c084fc' : '#7c3aed'));
  const [thickness, setThickness] = useState(3);
  const [background, setBackground] = useState(() => initialDrawing?.background || 'grid');
  const [zoom, setZoom] = useState(1);
  const [title, setTitle] = useState(() => initialDrawing?.title || 'Untitled Sketch');
  const [historyStatus, setHistoryStatus] = useState({ canUndo: false, canRedo: false });
  const [strokeCount, setStrokeCount] = useState(0);
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    if (!canvasRef.current) return;
    setIsSaving(true);
    try {
      const drawingData = canvasRef.current.getDrawingData();
      drawingData.title = title || 'Untitled Sketch';
      const svgDataUri = canvasRef.current.getSvgDataUri();

      if (onSaveToNotes) {
        await onSaveToNotes(drawingData, svgDataUri);
      }
      success('Drawing saved successfully');
    } catch (err) {
      toastError('Failed to save drawing');
    } finally {
      setIsSaving(false);
    }
  };

  const handleExportPNG = () => {
    canvasRef.current?.exportPNG(`${title || 'sketch'}.png`);
    info('Exported as PNG');
  };

  const handleExportSVG = () => {
    canvasRef.current?.exportSVG(`${title || 'sketch'}.svg`);
    info('Exported as SVG');
  };

  return (
    <div
      className={`flex-1 flex flex-col h-full overflow-hidden select-none transition-colors duration-150 ${
        isDark ? 'bg-[#0e0e14] text-gray-100' : 'bg-[#FAF8FD] text-[#181326]'
      }`}
    >
      {/* Top Workspace Header */}
      <div
        className={`h-12 border-b px-4 flex items-center justify-between transition-colors duration-150 ${
          isDark ? 'bg-[#12121a] border-[#222230]' : 'bg-white border-[#EAE6F4]'
        }`}
      >
        <div className="flex items-center gap-3">
          {onBack && (
            <button
              type="button"
              onClick={onBack}
              className={`p-1.5 rounded-lg transition-colors flex items-center gap-1 ${
                isDark ? 'text-gray-400 hover:text-gray-200 hover:bg-[#1a1a24]' : 'text-[#6B7280] hover:text-[#181326] hover:bg-[#F3F0FA]'
              }`}
              title="Return to notes"
            >
              <ArrowLeft className="w-4 h-4" />
              <span className="text-xs font-medium hidden sm:inline">Back</span>
            </button>
          )}

          <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-purple-600 to-indigo-600 text-white flex items-center justify-center shadow-sm shadow-purple-900/40 shrink-0">
            <PenTool className="w-3.5 h-3.5" />
          </div>

          <div className="flex items-center gap-2">
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Untitled Sketch"
              className={`text-sm sm:text-base font-bold bg-transparent border-none focus:outline-none tracking-tight ${
                isDark ? 'text-white' : 'text-[#111827]'
              }`}
            />
            <span
              className={`text-[10px] font-mono px-1.5 py-0.5 rounded border hidden sm:inline-block ${
                isDark ? 'border-[#272738] text-gray-400' : 'border-[#E2DEEE] text-[#6B7280]'
              }`}
            >
              {strokeCount} {strokeCount === 1 ? 'stroke' : 'strokes'}
            </span>
          </div>
        </div>

        {/* Right Header Actions */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleSave}
            disabled={isSaving}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-medium text-xs shadow-sm shadow-purple-900/40 transition-all cursor-pointer disabled:opacity-50"
          >
            <Check className="w-3.5 h-3.5 stroke-[2.5]" />
            <span>{isSaving ? 'Saving...' : activeNote ? 'Save to Note' : 'Save Drawing'}</span>
          </button>
        </div>
      </div>

      {/* Main Drawing Toolbar */}
      <DrawingToolbar
        activeTool={activeTool}
        onSelectTool={setActiveTool}
        color={color}
        onChangeColor={setColor}
        thickness={thickness}
        onChangeThickness={setThickness}
        background={background}
        onChangeBackground={setBackground}
        canUndo={historyStatus.canUndo}
        canRedo={historyStatus.canRedo}
        onUndo={() => canvasRef.current?.undo()}
        onRedo={() => canvasRef.current?.redo()}
        onClear={() => canvasRef.current?.clear()}
        zoom={zoom}
        onZoomIn={() => setZoom((z) => Math.min(2.5, Math.round((z + 0.15) * 100) / 100))}
        onZoomOut={() => setZoom((z) => Math.max(0.4, Math.round((z - 0.15) * 100) / 100))}
        onFitScreen={() => setZoom(1)}
        onExportPNG={handleExportPNG}
        onExportSVG={handleExportSVG}
        onSave={handleSave}
        saveLabel={activeNote ? 'Save to Active Note' : 'Save Sketch'}
      />

      {/* Distraction-free drawing canvas */}
      <div className="flex-1 overflow-hidden relative">
        <DrawingCanvas
          ref={canvasRef}
          initialData={initialDrawing}
          activeTool={activeTool}
          color={color}
          thickness={thickness}
          background={background}
          zoom={zoom}
          onHistoryChange={setHistoryStatus}
          onStrokesChange={(s) => setStrokeCount(s.length)}
        />
      </div>
    </div>
  );
};

export default DrawingWorkspace;

