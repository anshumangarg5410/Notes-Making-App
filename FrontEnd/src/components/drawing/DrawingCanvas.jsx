import React, { useRef, useEffect, useState, useCallback, useImperativeHandle, forwardRef } from 'react';
import { useTheme } from '../../context/ThemeContext';
import {
  drawBackground,
  renderStroke,
  isPointNearStroke,
  exportDrawingToSVG,
  exportDrawingToPNG,
  downloadDrawingSVG,
  createDrawingSvgDataUri
} from '../../utils/drawingUtils';

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

  // Logical canvas dimensions
  const [dimensions, setDimensions] = useState({
    width: initialData?.width || 1200,
    height: initialData?.height || 800
  });

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

  // Adjust canvas dimensions to fit container if initial dimensions not specified
  useEffect(() => {
    if (!containerRef.current) return;
    const updateSize = () => {
      const rect = containerRef.current.getBoundingClientRect();
      if (rect.width > 200 && rect.height > 200 && !initialData?.width) {
        setDimensions({
          width: Math.max(1200, Math.round(rect.width)),
          height: Math.max(800, Math.round(rect.height))
        });
      }
    };
    updateSize();
    window.addEventListener('resize', updateSize);
    return () => window.removeEventListener('resize', updateSize);
  }, [initialData]);

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

  // POINTER MOVE: Append points or update shape bounds
  const handlePointerMove = (e) => {
    if (!isDrawingRef.current) return;
    const coords = getCanvasCoords(e);

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

  // POINTER UP: Commit stroke to vector list and history
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
    getStrokesCount: () => strokes.length
  }), [undo, redo, clear, getDrawingData, isDark, strokes.length]);

  return (
    <div
      ref={containerRef}
      className={`relative w-full h-full overflow-auto obsidian-scrollbar flex items-center justify-center p-4 transition-colors ${className} ${
        isDark ? 'bg-[#0d0d14]' : 'bg-[#F5F3FA]'
      }`}
      style={{ touchAction: 'none' }}
    >
      <div
        className={`shadow-2xl rounded-2xl overflow-hidden border transition-all ${
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
          className={`block ${isInteractive ? (activeTool === 'eraser' ? 'cursor-crosshair' : 'cursor-crosshair') : 'cursor-default'}`}
          style={{ touchAction: 'none' }}
        />
      </div>
    </div>
  );
});

export default DrawingCanvas;

