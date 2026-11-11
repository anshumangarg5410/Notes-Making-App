import React, { useRef, useEffect, useState, useCallback, useImperativeHandle, forwardRef } from 'react';
import { useTheme } from '../../context/ThemeContext';
import { Plus } from 'lucide-react';
import {
  drawBackground,
  renderStroke,
  isPointNearStroke,
  exportDrawingToSVG,
  exportDrawingToPNG,
  downloadDrawingSVG,
  createDrawingSvgDataUri
} from '../../utils/drawingUtils';

// Helper to determine the maximum Y coordinate in a stroke
const getStrokeMaxY = (stroke) => {
  if (!stroke) return 0;
  if (stroke.points && stroke.points.length > 0) {
    let max = 0;
    for (const p of stroke.points) {
      if (p.y > max) max = p.y;
    }
    return max;
  }
  if (stroke.start && stroke.end) {
    return Math.max(stroke.start.y, stroke.end.y);
  }
  return 0;
};

export const DrawingCanvas = forwardRef(({
  initialData,
  activeTool = 'pen',
  color = '#c084fc',
  thickness = 3,
  background = 'plain',
  zoom = 1,
  pan = { x: 0, y: 0 },
  onHistoryChange,
  onStrokesChange,
  isInteractive = true,
  className = ''
}, ref) => {
  const { isDark } = useTheme();
  const canvasRef = useRef(null);
  const containerRef = useRef(null);

  // Core Drawing Vector State
  const [strokes, setStrokes] = useState(() => initialData?.strokes || []);
  const [history, setHistory] = useState([initialData?.strokes || []]);
  const [historyIndex, setHistoryIndex] = useState(0);

  // Active in-progress stroke
  const currentStrokeRef = useRef(null);
  const isDrawingRef = useRef(false);

  // Logical canvas dimensions with generous initial height
  const [dimensions, setDimensions] = useState(() => {
    let maxStrokeY = 0;
    if (initialData?.strokes) {
      for (const s of initialData.strokes) {
        const my = getStrokeMaxY(s);
        if (my > maxStrokeY) maxStrokeY = my;
      }
    }
    return {
      width: initialData?.width || 1200,
      height: Math.max(initialData?.height || 1800, maxStrokeY + 600, 1800)
    };
  });

  const dimensionsRef = useRef(dimensions);
  useEffect(() => {
    dimensionsRef.current = dimensions;
  }, [dimensions]);

  // Notify parent of undo/redo availability
  useEffect(() => {
    onHistoryChange?.({
      canUndo: historyIndex > 0,
      canRedo: historyIndex < history.length - 1
    });
  }, [historyIndex, history.length, onHistoryChange]);

  // Notify parent of strokes count
  useEffect(() => {
    onStrokesChange?.(strokes);
  }, [strokes, onStrokesChange]);

  // Adjust canvas dimensions to fit container and provide generous scroll room
  useEffect(() => {
    if (!containerRef.current) return;
    const updateSize = () => {
      const rect = containerRef.current.getBoundingClientRect();
      if (rect.width > 200 && rect.height > 200) {
        setDimensions((prev) => {
          let maxStrokeY = 0;
          for (const s of strokes) {
            const sMax = getStrokeMaxY(s);
            if (sMax > maxStrokeY) maxStrokeY = sMax;
          }
          const defaultMinHeight = Math.max(1800, Math.round(rect.height + 800), maxStrokeY + 600);
          const width = initialData?.width || Math.max(1200, Math.round(rect.width - 48));
          const height = Math.max(prev.height, initialData?.height || 0, defaultMinHeight);
          return { width, height };
        });
      }
    };
    updateSize();
    window.addEventListener('resize', updateSize);
    return () => window.removeEventListener('resize', updateSize);
  }, [initialData, strokes]);

  // Redraw the entire canvas
  const redrawCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    const w = dimensions.width;
    const h = dimensions.height;

    // Reset transform and clear
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Apply DPR & zoom scaling
    ctx.scale(dpr * zoom, dpr * zoom);

    // 1. Draw canvas background grid/dots/lines
    drawBackground(ctx, w, h, background, isDark);

    // 2. Draw all committed vector strokes
    for (const stroke of strokes) {
      renderStroke(ctx, stroke);
    }

    // 3. Draw active in-progress stroke
    if (currentStrokeRef.current) {
      renderStroke(ctx, currentStrokeRef.current);
    }
  }, [dimensions, strokes, background, isDark, zoom]);

  // Sync canvas width/height attributes with DPR
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const dpr = window.devicePixelRatio || 1;
    canvas.width = dimensions.width * dpr * zoom;
    canvas.height = dimensions.height * dpr * zoom;
    canvas.style.width = `${dimensions.width * zoom}px`;
    canvas.style.height = `${dimensions.height * zoom}px`;
    redrawCanvas();
  }, [dimensions, zoom, redrawCanvas]);

  // Immediate redraw on background, theme, or strokes change
  useEffect(() => {
    redrawCanvas();
  }, [background, isDark, strokes, redrawCanvas]);

  // Push new state to history stack
  const pushToHistory = useCallback((newStrokes) => {
    setHistory((prev) => {
      const upToCurrent = prev.slice(0, historyIndex + 1);
      return [...upToCurrent, newStrokes];
    });
    setHistoryIndex((prev) => prev + 1);
    setStrokes(newStrokes);
  }, [historyIndex]);

  // Undo
  const undo = useCallback(() => {
    if (historyIndex > 0) {
      const nextIdx = historyIndex - 1;
      setHistoryIndex(nextIdx);
      setStrokes(history[nextIdx]);
    }
  }, [historyIndex, history]);

  // Redo
  const redo = useCallback(() => {
    if (historyIndex < history.length - 1) {
      const nextIdx = historyIndex + 1;
      setHistoryIndex(nextIdx);
      setStrokes(history[nextIdx]);
    }
  }, [historyIndex, history]);

  // Clear Canvas
  const clear = useCallback(() => {
    pushToHistory([]);
  }, [pushToHistory]);

  // Convert browser mouse/touch event coordinates into canvas-space coordinates
  const getCanvasCoords = (e) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();
    const clientX = e.clientX;
    const clientY = e.clientY;
    return {
      x: (clientX - rect.left) / zoom,
      y: (clientY - rect.top) / zoom,
      pressure: e.pressure && e.pressure > 0 && e.pressure <= 1 ? e.pressure : 0.5
    };
  };

  // POINTER DOWN: Start drawing
  const handlePointerDown = (e) => {
    if (!isInteractive) return;
    // Allow primary mouse click or stylus/touch
    if (e.button !== 0 && e.pointerType === 'mouse') return;

    const coords = getCanvasCoords(e);
    isDrawingRef.current = true;

    try {
      e.target.setPointerCapture(e.pointerId);
    } catch (_) {}

    if (activeTool === 'eraser') {
      // Stroke eraser: immediately check and erase intersected strokes
      const remaining = strokes.filter((s) => !isPointNearStroke(coords, s));
      if (remaining.length !== strokes.length) {
        setStrokes(remaining);
      }
      return;
    }

    if (activeTool === 'pen' || activeTool === 'highlighter') {
      currentStrokeRef.current = {
        id: `stroke_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`,
        tool: activeTool,
        color,
        thickness,
        opacity: activeTool === 'highlighter' ? 0.35 : 1,
        points: [{ x: coords.x, y: coords.y, pressure: coords.pressure }]
      };
    } else {
      // Shape tools: line, arrow, rect, ellipse
      currentStrokeRef.current = {
        id: `shape_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`,
        tool: activeTool,
        color,
        thickness,
        opacity: 1,
        start: { x: coords.x, y: coords.y },
        end: { x: coords.x, y: coords.y }
      };
    }

    redrawCanvas();
  };

  // POINTER MOVE: Append points, update shape bounds, and auto-expand canvas if near bottom
  const handlePointerMove = (e) => {
    if (!isDrawingRef.current) return;
    const coords = getCanvasCoords(e);

    // Auto-expand canvas height dynamically as space vertically fills up
    // If drawing within 300px of current canvas bottom, increase canvas height
    if (coords.y > dimensionsRef.current.height - 300) {
      const expandedHeight = Math.max(dimensionsRef.current.height + 800, Math.round(coords.y + 800));
      dimensionsRef.current.height = expandedHeight;
      setDimensions((prev) => ({
        ...prev,
        height: expandedHeight
      }));
    }

    // Auto-scroll container downward if pointer is drawing near the visible viewport bottom
    if (containerRef.current) {
      const containerRect = containerRef.current.getBoundingClientRect();
      if (e.clientY > containerRect.bottom - 70) {
        containerRef.current.scrollTop += 14;
      } else if (e.clientY < containerRect.top + 70 && containerRef.current.scrollTop > 0) {
        containerRef.current.scrollTop -= 14;
      }
    }

    if (activeTool === 'eraser') {
      // Erase strokes as pointer moves
      setStrokes((prev) => {
        const remaining = prev.filter((s) => !isPointNearStroke(coords, s));
        return remaining.length === prev.length ? prev : remaining;
      });
      return;
    }

    if (!currentStrokeRef.current) return;

    if (activeTool === 'pen' || activeTool === 'highlighter') {
      currentStrokeRef.current.points.push({
        x: coords.x,
        y: coords.y,
        pressure: coords.pressure
      });
    } else {
      currentStrokeRef.current.end = {
        x: coords.x,
        y: coords.y
      };
    }

    // High-performance requestAnimationFrame redraw
    window.requestAnimationFrame(redrawCanvas);
  };

  // POINTER UP: Commit stroke to vector list, history, and auto-expand if at bottom
  const handlePointerUp = (e) => {
    if (!isDrawingRef.current) return;
    isDrawingRef.current = false;

    try {
      e.target.releasePointerCapture(e.pointerId);
    } catch (_) {}

    if (activeTool === 'eraser') {
      // Record history if strokes changed
      if (strokes.length !== history[historyIndex]?.length) {
        pushToHistory(strokes);
      }
      return;
    }

    if (currentStrokeRef.current) {
      const finishedStroke = currentStrokeRef.current;
      currentStrokeRef.current = null;
      const nextStrokes = [...strokes, finishedStroke];
      pushToHistory(nextStrokes);

      // Check if finished stroke's lowest point is near bottom
      const strokeMaxY = getStrokeMaxY(finishedStroke);
      if (strokeMaxY > dimensionsRef.current.height - 350) {
        const nextHeight = Math.max(dimensionsRef.current.height + 800, Math.round(strokeMaxY + 800));
        dimensionsRef.current.height = nextHeight;
        setDimensions((prev) => ({
          ...prev,
          height: nextHeight
        }));
      }
    }
  };

  const handlePointerCancel = (e) => {
    isDrawingRef.current = false;
    currentStrokeRef.current = null;
    redrawCanvas();
  };

  // Package current drawing payload
  const getDrawingData = useCallback(() => {
    return {
      id: initialData?.id || `draw_${Date.now()}`,
      title: initialData?.title || 'Drawing',
      strokes,
      background,
      width: dimensions.width,
      height: dimensions.height,
      createdAt: initialData?.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
  }, [initialData, strokes, background, dimensions]);

  // Expose imperative API methods to parent component via ref
  useImperativeHandle(ref, () => ({
    undo,
    redo,
    clear,
    getDrawingData,
    exportPNG: (filename) => exportDrawingToPNG(getDrawingData(), isDark, filename),
    exportSVG: (filename) => downloadDrawingSVG(getDrawingData(), isDark, filename),
    getSvgDataUri: () => createDrawingSvgDataUri(getDrawingData(), isDark),
    getSvgString: () => exportDrawingToSVG(getDrawingData(), { isDark, includeBackground: true }),
    getStrokesCount: () => strokes.length,
    addVerticalSpace: (amount = 800) => {
      const nextHeight = dimensionsRef.current.height + amount;
      dimensionsRef.current.height = nextHeight;
      setDimensions((prev) => ({ ...prev, height: nextHeight }));
    }
  }), [undo, redo, clear, getDrawingData, isDark, strokes.length]);

  return (
    <div
      ref={containerRef}
      className={`relative w-full h-full overflow-y-auto overflow-x-auto obsidian-scrollbar flex flex-col items-center justify-start py-8 px-4 transition-colors ${className} ${
        isDark ? 'bg-[#0d0d14]' : 'bg-[#F5F3FA]'
      }`}
    >
      <div
        className={`shadow-2xl rounded-2xl overflow-hidden border shrink-0 transition-all ${
          isDark
            ? 'border-[#26263a] bg-[#12121a] shadow-purple-950/20'
            : 'border-[#EAE6F4] bg-white shadow-purple-200/40'
        }`}
        style={{
          width: `${dimensions.width * zoom}px`,
          height: `${dimensions.height * zoom}px`
        }}
      >
        <canvas
          ref={canvasRef}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerCancel={handlePointerCancel}
          className={`block ${isInteractive ? 'cursor-crosshair' : 'cursor-default'}`}
          style={{ touchAction: 'none' }}
        />
      </div>

      {/* Bottom extend canvas control */}
      {isInteractive && (
        <div className="flex items-center justify-center gap-3 py-6 shrink-0">
          <button
            type="button"
            onClick={() => {
              const nextHeight = dimensionsRef.current.height + 800;
              dimensionsRef.current.height = nextHeight;
              setDimensions((prev) => ({ ...prev, height: nextHeight }));
            }}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold border shadow-sm transition-all cursor-pointer ${
              isDark
                ? 'border-[#2d2d42] bg-[#161622] hover:bg-[#1e1e2e] text-purple-300 hover:text-white shadow-purple-950/20'
                : 'border-[#E2DEEE] bg-white hover:bg-[#F8F6FD] text-purple-700 hover:text-purple-900 shadow-purple-100'
            }`}
            title="Add vertical space to drawing page"
          >
            <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
            <span>Add Page (+800px)</span>
          </button>
          <span className={`text-[11px] font-mono select-none ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
            Canvas Height: {dimensions.height}px
          </span>
        </div>
      )}
    </div>
  );
});

export default DrawingCanvas;

