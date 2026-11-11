/**
 * Smart Ink AI - Client-Side Geometry & Handwriting Enhancement Utilities
 * Provides natural jitter reduction, stroke smoothing, line clustering,
 * and baseline alignment without external AI dependencies.
 */

/**
 * Calculates bounding box and metric properties for a stroke
 */
export const getStrokeBounds = (stroke) => {
  if (!stroke) return null;

  if (stroke.points && stroke.points.length > 0) {
    let minX = Infinity;
    let maxX = -Infinity;
    let minY = Infinity;
    let maxY = -Infinity;

    for (let i = 0; i < stroke.points.length; i++) {
      const p = stroke.points[i];
      if (p.x < minX) minX = p.x;
      if (p.x > maxX) maxX = p.x;
      if (p.y < minY) minY = p.y;
      if (p.y > maxY) maxY = p.y;
    }

    const width = maxX - minX;
    const height = maxY - minY;
    const centerX = minX + width / 2;
    const centerY = minY + height / 2;
    // For typical handwritten characters, the baseline sits around bottom 20%
    const baselineY = minY + height * 0.85;

    return {
      minX,
      maxX,
      minY,
      maxY,
      width,
      height,
      centerX,
      centerY,
      baselineY
    };
  }

  if (stroke.start && stroke.end) {
    const minX = Math.min(stroke.start.x, stroke.end.x);
    const maxX = Math.max(stroke.start.x, stroke.end.x);
    const minY = Math.min(stroke.start.y, stroke.end.y);
    const maxY = Math.max(stroke.start.y, stroke.end.y);
    const width = maxX - minX;
    const height = maxY - minY;

    return {
      minX,
      maxX,
      minY,
      maxY,
      width,
      height,
      centerX: (minX + maxX) / 2,
      centerY: (minY + maxY) / 2,
      baselineY: maxY
    };
  }

  return null;
};

/**
 * Checks whether a stroke qualifies as freehand handwriting.
 * Shields vector shapes (line, arrow, rect, ellipse) and non-text diagrams.
 */
export const isHandwritingStroke = (stroke) => {
  if (!stroke) return false;
  // Only freehand pen strokes are handwriting candidates
  if (stroke.tool !== 'pen') return false;
  if (!stroke.points || stroke.points.length < 3) return false;

  const bounds = getStrokeBounds(stroke);
  if (!bounds) return false;

  // Reject massive illustrations or boundary boxes (height > 350px or width > 900px)
  if (bounds.height > 350 || bounds.width > 900) return false;

  // Reject tiny accidental micro-clicks (< 3px)
  if (bounds.width < 3 && bounds.height < 3) return false;

  return true;
};

/**
 * Natural handwriting stroke smoothing.
 * 1. Filter out micro-jitter noise from high-frequency mouse/trackpad events.
 * 2. Apply weighted moving-average interpolation while preserving endpoints and pressure.
 */
export const smoothStrokePoints = (points, options = {}) => {
  if (!Array.isArray(points) || points.length < 3) {
    return points ? [...points] : [];
  }

  const {
    distanceThreshold = 2.0, // Minimum distance in px to filter out micro-jitter
    smoothingFactor = 0.22   // Weight for adjacent point influence (0.15 - 0.25 keeps natural style)
  } = options;

  // Step 1: Distance-based jitter decimation (skip redundant clustered points)
  const decimated = [points[0]];
  for (let i = 1; i < points.length - 1; i++) {
    const prev = decimated[decimated.length - 1];
    const curr = points[i];
    const dx = curr.x - prev.x;
    const dy = curr.y - prev.y;
    const distSq = dx * dx + dy * dy;

    if (distSq >= distanceThreshold * distanceThreshold) {
      decimated.push(curr);
    }
  }
  // Always preserve last point
  decimated.push(points[points.length - 1]);

  if (decimated.length < 3) {
    return decimated;
  }

  // Step 2: Moving window weighted Laplacian smoothing
  // Keeps start and end fixed to prevent stroke shrinkage or drifting
  const smoothed = new Array(decimated.length);
  smoothed[0] = { ...decimated[0] };
  smoothed[decimated.length - 1] = { ...decimated[decimated.length - 1] };

  const centerWeight = 1 - 2 * smoothingFactor;

  for (let i = 1; i < decimated.length - 1; i++) {
    const pPrev = decimated[i - 1];
    const pCurr = decimated[i];
    const pNext = decimated[i + 1];

    const smoothX = pCurr.x * centerWeight + (pPrev.x + pNext.x) * smoothingFactor;
    const smoothY = pCurr.y * centerWeight + (pPrev.y + pNext.y) * smoothingFactor;

    // Smooth pressure sensitivity naturally if available
    const currPressure = pCurr.pressure !== undefined ? pCurr.pressure : 0.5;
    const prevPressure = pPrev.pressure !== undefined ? pPrev.pressure : 0.5;
    const nextPressure = pNext.pressure !== undefined ? pNext.pressure : 0.5;
    const smoothPressure = currPressure * 0.6 + (prevPressure + nextPressure) * 0.2;

    smoothed[i] = {
      x: Number(smoothX.toFixed(2)),
      y: Number(smoothY.toFixed(2)),
      pressure: Number(smoothPressure.toFixed(3))
    };
  }

  return smoothed;
};

/**
 * Cluster strokes into horizontal lines of handwritten text.
 * Uses vertical overlap and proximity heuristic.
 */
export const detectWritingLines = (strokes) => {
  if (!Array.isArray(strokes) || strokes.length === 0) return [];

  // Filter for valid handwriting strokes and pair with bounds
  const strokeItems = [];
  for (const stroke of strokes) {
    if (isHandwritingStroke(stroke)) {
      const bounds = getStrokeBounds(stroke);
      if (bounds) {
        strokeItems.push({ stroke, bounds });
      }
    }
  }

  if (strokeItems.length === 0) return [];

  // Sort by vertical position (top-to-bottom), then horizontal (left-to-right)
  strokeItems.sort((a, b) => {
    const yDiff = a.bounds.minY - b.bounds.minY;
    if (Math.abs(yDiff) > 15) return yDiff;
    return a.bounds.minX - b.bounds.minX;
  });

  const lines = [];

  for (const item of strokeItems) {
    let matchedLine = null;
    let minDistance = Infinity;

    // Find best matching line by checking vertical overlap and center distance
    for (const line of lines) {
      const verticalOverlap =
        Math.min(item.bounds.maxY, line.maxY) - Math.max(item.bounds.minY, line.minY);
      const minHeight = Math.min(item.bounds.height, line.avgHeight);

      // Substantial vertical overlap indicates same writing baseline
      if (verticalOverlap > minHeight * 0.35) {
        const centerDistance = Math.abs(item.bounds.centerY - line.centerY);
        if (centerDistance < minDistance) {
          minDistance = centerDistance;
          matchedLine = line;
        }
      }
    }

    if (matchedLine) {
      matchedLine.items.push(item);
      matchedLine.minX = Math.min(matchedLine.minX, item.bounds.minX);
      matchedLine.maxX = Math.max(matchedLine.maxX, item.bounds.maxX);
      matchedLine.minY = Math.min(matchedLine.minY, item.bounds.minY);
      matchedLine.maxY = Math.max(matchedLine.maxY, item.bounds.maxY);
      matchedLine.centerY = (matchedLine.minY + matchedLine.maxY) / 2;
      matchedLine.avgHeight = (matchedLine.avgHeight * (matchedLine.items.length - 1) + item.bounds.height) / matchedLine.items.length;
      matchedLine.baselines.push(item.bounds.baselineY);
    } else {
      lines.push({
        items: [item],
        minX: item.bounds.minX,
        maxX: item.bounds.maxX,
        minY: item.bounds.minY,
        maxY: item.bounds.maxY,
        centerY: item.bounds.centerY,
        avgHeight: item.bounds.height,
        baselines: [item.bounds.baselineY]
      });
    }
  }

  return lines;
};

/**
 * Intelligent Baseline Alignment:
 * Smooths and straightens handwritten strokes along a clean baseline
 * while preserving natural letter heights, cursive loops, and slant.
 *
 * @param {Array} strokes - The complete list of canvas strokes.
 * @param {Object} options - Tuning options (strength, maxDeltaY).
 * @returns {Object} { strokes: Array, changed: boolean, linesAligned: number }
 */
export const alignHandwritingStrokes = (strokes, options = {}) => {
  if (!Array.isArray(strokes) || strokes.length === 0) {
    return { strokes, changed: false, linesAligned: 0 };
  }

  const {
    strength = 0.55,   // 0.55 provides clean alignment without looking robotic
    maxDeltaY = 16     // Maximum vertical displacement in pixels per stroke
  } = options;

  const lines = detectWritingLines(strokes);
  // Only align if we found meaningful handwriting lines (at least 1 line with >= 2 strokes or 2+ lines)
  const viableLines = lines.filter((l) => l.items.length >= 2 || lines.length >= 2);

  if (viableLines.length === 0) {
    return { strokes, changed: false, linesAligned: 0 };
  }

  // Map of strokeId -> deltaY shift
  const strokeShifts = new Map();

  for (const line of viableLines) {
    if (line.items.length < 2) continue;

    // Calculate median baseline for the line
    const sortedBaselines = [...line.baselines].sort((a, b) => a - b);
    const midIdx = Math.floor(sortedBaselines.length / 2);
    const targetBaseline =
      sortedBaselines.length % 2 === 0
        ? (sortedBaselines[midIdx - 1] + sortedBaselines[midIdx]) / 2
        : sortedBaselines[midIdx];

    for (const item of line.items) {
      const strokeBaseline = item.bounds.baselineY;
      const deviation = targetBaseline - strokeBaseline;
      // Gentle proportional correction
      const deltaY = Math.max(-maxDeltaY, Math.min(maxDeltaY, deviation * strength));

      if (Math.abs(deltaY) > 0.4) {
        strokeShifts.set(item.stroke.id, deltaY);
      }
    }
  }

  if (strokeShifts.size === 0) {
    return { strokes, changed: false, linesAligned: 0 };
  }

  // Create new stroke objects applying the baseline adjustment and smoothing
  const updatedStrokes = strokes.map((stroke) => {
    const shiftY = strokeShifts.get(stroke.id);
    if (shiftY !== undefined && stroke.points && stroke.points.length > 0) {
      const adjustedPoints = stroke.points.map((p) => ({
        ...p,
        y: Number((p.y + shiftY).toFixed(2))
      }));

      // Apply smoothing to the aligned points
      const smoothedPoints = smoothStrokePoints(adjustedPoints);

      return {
        ...stroke,
        points: smoothedPoints
      };
    }
    return stroke;
  });

  return {
    strokes: updatedStrokes,
    changed: true,
    linesAligned: viableLines.length
  };
};
