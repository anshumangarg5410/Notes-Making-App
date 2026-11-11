import React, { useState, useRef, useEffect } from 'react';
import { useTheme } from '../../context/ThemeContext';
import { DrawingCanvas } from './DrawingCanvas';
import { DrawingToolbar } from './DrawingToolbar';
import { DrawingAiCleanupModal } from './DrawingAiCleanupModal';
import { cleanupDrawingWithAi } from '../../services/drawingAiService';
import {
  X,
  Maximize2,
  Minimize2,
  PenTool,
  Sparkles,
  Download,
  Check,
  Edit3
} from 'lucide-react';

export const DrawingModal = ({
  isOpen = false,
  onClose,
  onSave,
  initialData = null,
  isQuickScribble = false,
  noteTitle = ''
}) => {
  const { isDark } = useTheme();
  const canvasRef = useRef(null);

  // Drawing settings
  const [activeTool, setActiveTool] = useState('pen');
  const [color, setColor] = useState(() => (isDark ? '#c084fc' : '#7c3aed'));
  const [thickness, setThickness] = useState(3);
  const [background, setBackground] = useState(() => initialData?.background || 'plain');
  const [zoom, setZoom] = useState(1);
  const [title, setTitle] = useState(() => initialData?.title || (isQuickScribble ? 'Quick Scribble' : 'Drawing'));
  const [isFullscreen, setIsFullscreen] = useState(!isQuickScribble);
  const [historyStatus, setHistoryStatus] = useState({ canUndo: false, canRedo: false });
  const [strokeCount, setStrokeCount] = useState(0);
  const [smartInkEnabled, setSmartInkEnabled] = useState(true);
  const [isAiCleaning, setIsAiCleaning] = useState(false);
  const [aiCleanupData, setAiCleanupData] = useState(null);
  const [aiPreviewImage, setAiPreviewImage] = useState(null);
  const [isAiModalOpen, setIsAiModalOpen] = useState(false);

  const handleAlignWriting = () => {
    if (!canvasRef.current) return;
    canvasRef.current.alignHandwriting();
  };

  const handleAiCleanup = async () => {
    if (!canvasRef.current) return;
    if (strokeCount === 0) return;

    setIsAiCleaning(true);
    try {
      const pngDataUri = canvasRef.current.getPngDataUri();
      setAiPreviewImage(pngDataUri);

      const res = await cleanupDrawingWithAi({
        image: pngDataUri,
        promptHint: title && title !== 'Drawing' ? title : ''
      });

      if (res && res.data) {
        setAiCleanupData(res.data);
        setIsAiModalOpen(true);
      }
    } catch (err) {
      console.error('Smart Ink AI cleanup notice:', err);
    } finally {
      setIsAiCleaning(false);
    }
  };

  // Sync title & background on open
  useEffect(() => {
    if (isOpen) {
      setTitle(initialData?.title || (isQuickScribble ? 'Quick Scribble' : 'Drawing'));
      setBackground(initialData?.background || 'plain');
      setZoom(1);
    }
  }, [isOpen, initialData, isQuickScribble]);

  if (!isOpen) return null;

  // Save handler
  const handleSave = () => {
    if (!canvasRef.current) return;
    const drawingData = canvasRef.current.getDrawingData();
    drawingData.title = title || 'Drawing';
    const svgDataUri = canvasRef.current.getSvgDataUri();
    onSave?.(drawingData, svgDataUri);
    onClose?.();
  };

  // Export handlers
  const handleExportPNG = () => {
    canvasRef.current?.exportPNG(`${title || 'drawing'}.png`);
  };

  const handleExportSVG = () => {
    canvasRef.current?.exportSVG(`${title || 'drawing'}.svg`);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/70 backdrop-blur-md animate-in fade-in duration-150">
      <div
        className={`flex flex-col rounded-2xl shadow-2xl overflow-hidden border transition-all ${
          isDark
            ? 'bg-[#151520] border-[#29293e] shadow-purple-950/40 text-gray-100'
            : 'bg-white border-[#EAE6F4] shadow-purple-200/50 text-[#181326]'
        } ${
          isFullscreen
            ? 'w-full h-full max-w-full max-h-full rounded-none'
            : isQuickScribble
            ? 'w-full max-w-2xl h-[520px]'
            : 'w-full max-w-5xl h-[85vh]'
        }`}
      >
        {/* Top Header */}
        <div
          className={`h-12 px-4 border-b flex items-center justify-between select-none ${
            isDark ? 'border-[#222232] bg-[#12121a]' : 'border-[#EAE6F4] bg-[#FAF8FD]'
          }`}
        >
          {/* Left Title */}
          <div className="flex items-center gap-2.5 flex-1 min-w-0 mr-4">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-purple-600 to-indigo-600 text-white flex items-center justify-center shadow-sm shadow-purple-900/40 shrink-0">
              <PenTool className="w-3.5 h-3.5" />
            </div>

            <div className="flex items-center gap-2 flex-1 min-w-0">
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Drawing Title..."
                className={`text-sm font-semibold bg-transparent border-none focus:outline-none truncate max-w-[240px] sm:max-w-xs ${
                  isDark ? 'text-gray-100 placeholder-gray-500' : 'text-[#181326] placeholder-[#9CA3AF]'
                }`}
              />
              <span className={`text-[10px] hidden sm:inline-block px-1.5 py-0.5 rounded border font-mono ${
                isDark ? 'border-[#2d2d42] text-gray-400' : 'border-[#E2DEEE] text-[#6B7280]'
              }`}>
                {strokeCount} {strokeCount === 1 ? 'stroke' : 'strokes'}
              </span>
            </div>
          </div>

          {/* Right Window Controls */}
          <div className="flex items-center gap-1.5 shrink-0">
            <button
              type="button"
              onClick={() => setIsFullscreen(!isFullscreen)}
              className={`p-1.5 rounded-lg transition-colors ${
                isDark ? 'text-gray-400 hover:text-gray-200 hover:bg-[#1f1f2e]' : 'text-[#6B7280] hover:text-[#181326] hover:bg-[#F3F0FA]'
              }`}
              title={isFullscreen ? 'Exit Fullscreen' : 'Fullscreen Drawing'}
            >
              {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
            </button>

            <button
              type="button"
              onClick={onClose}
              className={`p-1.5 rounded-lg transition-colors ${
                isDark ? 'text-gray-400 hover:text-red-400 hover:bg-red-950/30' : 'text-[#6B7280] hover:text-red-600 hover:bg-red-50'
              }`}
              title="Close (Discard changes)"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Toolbar Bar */}
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
          saveLabel={initialData ? 'Update in Note' : 'Insert into Note'}
          isCompact={isQuickScribble}
          smartInkEnabled={smartInkEnabled}
          onToggleSmartInk={() => setSmartInkEnabled((prev) => !prev)}
          onAlignWriting={handleAlignWriting}
          onAiCleanup={handleAiCleanup}
          isAiCleaning={isAiCleaning}
        />

        {/* Drawing Canvas Area */}
        <div className="flex-1 overflow-hidden relative">
          <DrawingCanvas
            ref={canvasRef}
            initialData={initialData}
            activeTool={activeTool}
            color={color}
            thickness={thickness}
            background={background}
            zoom={zoom}
            smartInkEnabled={smartInkEnabled}
            onHistoryChange={setHistoryStatus}
            onStrokesChange={(s) => setStrokeCount(s.length)}
          />
        </div>
      </div>

      {/* Smart Ink AI Cleanup Preview Modal */}
      <DrawingAiCleanupModal
        isOpen={isAiModalOpen}
        onClose={() => setIsAiModalOpen(false)}
        data={aiCleanupData}
        previewImage={aiPreviewImage}
      />
    </div>
  );
};

export default DrawingModal;

