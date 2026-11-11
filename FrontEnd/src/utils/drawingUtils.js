/**
 * NoteNest Drawing & Scribble Utilities
 * High-performance vector stroke rendering, SVG generator, and PNG exporter.
 */

// Draw background grid, dots, or lines on canvas
export const drawBackground = (ctx, width, height, type = 'plain', isDark = true) => {
  ctx.save();
  // Base background fill
  ctx.fillStyle = isDark ? '#12121a' : '#FFFFFF';
  ctx.fillRect(0, 0, width, height);

  if (type === 'plain') {
    ctx.restore();
    return;
  }

  const gridColor = isDark ? 'rgba(168, 85, 247, 0.15)' : 'rgba(124, 58, 237, 0.12)';
  const dotColor = isDark ? 'rgba(168, 85, 247, 0.28)' : 'rgba(124, 58, 237, 0.22)';
  const lineColor = isDark ? 'rgba(168, 85, 247, 0.14)' : 'rgba(124, 58, 237, 0.14)';
  const marginColor = isDark ? 'rgba(239, 68, 68, 0.25)' : 'rgba(239, 68, 68, 0.3)';

  if (type === 'grid') {
    const step = 24;
    ctx.strokeStyle = gridColor;
    ctx.lineWidth = 1;
    ctx.beginPath();
    for (let x = 0; x <= width; x += step) {
      ctx.moveTo(x + 0.5, 0);
      ctx.lineTo(x + 0.5, height);
    }
    for (let y = 0; y <= height; y += step) {
      ctx.moveTo(0, y + 0.5);
      ctx.lineTo(width, y + 0.5);
    }
    ctx.stroke();
  } else if (type === 'dotted') {
    const step = 24;
    ctx.fillStyle = dotColor;
    for (let x = step / 2; x < width; x += step) {
      for (let y = step / 2; y < height; y += step) {
        ctx.beginPath();
        ctx.arc(x, y, 1.2, 0, Math.PI * 2);
        ctx.fill();
      }
    }
  } else if (type === 'lined') {
    const step = 30;
    ctx.strokeStyle = lineColor;
    ctx.lineWidth = 1;
    ctx.beginPath();
    for (let y = step; y <= height; y += step) {
      ctx.moveTo(0, y + 0.5);
      ctx.lineTo(width, y + 0.5);
    }
    ctx.stroke();

    // Red notebook margin on the left
    if (width > 80) {
      ctx.strokeStyle = marginColor;
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(60.5, 0);
      ctx.lineTo(60.5, height);
      ctx.stroke();
    }
  }

  ctx.restore();
};

// Render a single stroke or shape onto 2D canvas context
export const renderStroke = (ctx, stroke) => {
  if (!stroke) return;
  const { tool, color, thickness = 3, opacity = 1, points, start, end } = stroke;

  ctx.save();
  ctx.strokeStyle = color;
  ctx.fillStyle = color;
  ctx.lineWidth = thickness;
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';
  ctx.globalAlpha = opacity;

  if (tool === 'highlighter') {
    ctx.globalAlpha = Math.min(opacity, 0.35);
    ctx.lineCap = 'square';
    ctx.lineWidth = thickness * 3;
  }

  if (tool === 'pen' || tool === 'highlighter') {
    if (!points || points.length === 0) {
      ctx.restore();
      return;
    }

    if (points.length === 1) {
      ctx.beginPath();
      ctx.arc(points[0].x, points[0].y, thickness / 2, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
      return;
    }

    ctx.beginPath();
    ctx.moveTo(points[0].x, points[0].y);

    // Natural curve smoothing using midpoint quadratic curves
    for (let i = 1; i < points.length - 1; i++) {
      const p1 = points[i];
      const p2 = points[i + 1];
      const midX = (p1.x + p2.x) / 2;
      const midY = (p1.y + p2.y) / 2;
      ctx.quadraticCurveTo(p1.x, p1.y, midX, midY);
    }

    const last = points[points.length - 1];
    ctx.lineTo(last.x, last.y);
    ctx.stroke();
  } else if (tool === 'line') {
    if (!start || !end) {
      ctx.restore();
      return;
    }
    ctx.beginPath();
    ctx.moveTo(start.x, start.y);
    ctx.lineTo(end.x, end.y);
    ctx.stroke();
  } else if (tool === 'arrow') {
    if (!start || !end) {
      ctx.restore();
      return;
    }
    ctx.beginPath();
    ctx.moveTo(start.x, start.y);
    ctx.lineTo(end.x, end.y);
    ctx.stroke();

    // Arrowhead calculations
    const angle = Math.atan2(end.y - start.y, end.x - start.x);
    const headLength = Math.max(12, thickness * 3.2);
    ctx.beginPath();
    ctx.moveTo(end.x, end.y);
    ctx.lineTo(
      end.x - headLength * Math.cos(angle - Math.PI / 6),
      end.y - headLength * Math.sin(angle - Math.PI / 6)
    );
    ctx.lineTo(
      end.x - headLength * Math.cos(angle + Math.PI / 6),
      end.y - headLength * Math.sin(angle + Math.PI / 6)
    );
    ctx.closePath();
    ctx.fill();
  } else if (tool === 'rect') {
    if (!start || !end) {
      ctx.restore();
      return;
    }
    const x = Math.min(start.x, end.x);
    const y = Math.min(start.y, end.y);
    const w = Math.abs(end.x - start.x);
    const h = Math.abs(end.y - start.y);
    const r = Math.min(8, w / 4, h / 4);

    ctx.beginPath();
    if (r > 0) {
      ctx.roundRect ? ctx.roundRect(x, y, w, h, r) : ctx.rect(x, y, w, h);
    } else {
      ctx.rect(x, y, w, h);
    }
    ctx.stroke();
  } else if (tool === 'ellipse') {
    if (!start || !end) {
      ctx.restore();
      return;
    }
    const cx = (start.x + end.x) / 2;
    const cy = (start.y + end.y) / 2;
    const rx = Math.abs(end.x - start.x) / 2;
    const ry = Math.abs(end.y - start.y) / 2;

    ctx.beginPath();
    ctx.ellipse(cx, cy, Math.max(0.1, rx), Math.max(0.1, ry), 0, 0, Math.PI * 2);
    ctx.stroke();
  }

  ctx.restore();
};

// Check if a point hits/intersects a stroke for eraser
export const isPointNearStroke = (point, stroke, threshold = 14) => {
  if (!stroke) return false;
  const t = Math.max(threshold, (stroke.thickness || 3) * 1.5);

  if (stroke.points && stroke.points.length > 0) {
    for (const p of stroke.points) {
      const dx = p.x - point.x;
      const dy = p.y - point.y;
      if (dx * dx + dy * dy <= t * t) {
        return true;
      }
    }
    return false;
  }

  if (stroke.start && stroke.end) {
    // Distance from point to line segment
    const { start, end } = stroke;
    const l2 = (end.x - start.x) ** 2 + (end.y - start.y) ** 2;
    if (l2 === 0) {
      return (start.x - point.x) ** 2 + (start.y - point.y) ** 2 <= t * t;
    }
    let r = ((point.x - start.x) * (end.x - start.x) + (point.y - start.y) * (end.y - start.y)) / l2;
    r = Math.max(0, Math.min(1, r));
    const projX = start.x + r * (end.x - start.x);
    const projY = start.y + r * (end.y - start.y);
    return (point.x - projX) ** 2 + (point.y - projY) ** 2 <= t * t;
  }

  return false;
};

// Convert drawing stroke list into SVG markup string
export const exportDrawingToSVG = (drawingData, options = {}) => {
  const { width = 900, height = 550, strokes = [], background = 'plain' } = drawingData;
  const isDark = options.isDark ?? true;
  const includeBg = options.includeBackground ?? true;

  let bgMarkup = '';
  if (includeBg) {
    const bgColor = isDark ? '#12121a' : '#FFFFFF';
    bgMarkup = `<rect width="${width}" height="${height}" fill="${bgColor}" />`;

    if (background === 'grid') {
      const gColor = isDark ? 'rgba(168,85,247,0.15)' : 'rgba(124,58,237,0.12)';
      bgMarkup += `
        <defs>
          <pattern id="grid-pattern" width="24" height="24" patternUnits="userSpaceOnUse">
            <path d="M 24 0 L 0 0 0 24" fill="none" stroke="${gColor}" stroke-width="1"/>
          </pattern>
        </defs>
        <rect width="${width}" height="${height}" fill="url(#grid-pattern)" />
      `;
    } else if (background === 'dotted') {
      const dColor = isDark ? 'rgba(168,85,247,0.3)' : 'rgba(124,58,237,0.22)';
      bgMarkup += `
        <defs>
          <pattern id="dot-pattern" width="24" height="24" patternUnits="userSpaceOnUse">
            <circle cx="12" cy="12" r="1.2" fill="${dColor}" />
          </pattern>
        </defs>
        <rect width="${width}" height="${height}" fill="url(#dot-pattern)" />
      `;
    } else if (background === 'lined') {
      const lColor = isDark ? 'rgba(168,85,247,0.15)' : 'rgba(124,58,237,0.12)';
      const mColor = isDark ? 'rgba(239,68,68,0.25)' : 'rgba(239,68,68,0.3)';
      bgMarkup += `
        <defs>
          <pattern id="line-pattern" width="900" height="30" patternUnits="userSpaceOnUse">
            <line x1="0" y1="30" x2="900" y2="30" stroke="${lColor}" stroke-width="1"/>
          </pattern>
        </defs>
        <rect width="${width}" height="${height}" fill="url(#line-pattern)" />
        <line x1="60" y1="0" x2="60" y2="${height}" stroke="${mColor}" stroke-width="1.5" />
      `;
    }
  }

  const elementsMarkup = strokes.map((s) => {
    const { tool, color, thickness = 3, opacity = 1, points, start, end } = s;

    if (tool === 'pen' || tool === 'highlighter') {
      if (!points || points.length === 0) return '';
      const actualThickness = tool === 'highlighter' ? thickness * 3 : thickness;
      const actualOpacity = tool === 'highlighter' ? Math.min(opacity, 0.35) : opacity;
      const lineCap = tool === 'highlighter' ? 'square' : 'round';

      if (points.length === 1) {
        return `<circle cx="${points[0].x}" cy="${points[0].y}" r="${actualThickness / 2}" fill="${color}" opacity="${actualOpacity}" />`;
      }

      let d = `M ${points[0].x} ${points[0].y}`;
      for (let i = 1; i < points.length - 1; i++) {
        const p1 = points[i];
        const p2 = points[i + 1];
        const midX = ((p1.x + p2.x) / 2).toFixed(1);
        const midY = ((p1.y + p2.y) / 2).toFixed(1);
        d += ` Q ${p1.x.toFixed(1)} ${p1.y.toFixed(1)}, ${midX} ${midY}`;
      }
      const last = points[points.length - 1];
      d += ` L ${last.x.toFixed(1)} ${last.y.toFixed(1)}`;

      return `<path d="${d}" fill="none" stroke="${color}" stroke-width="${actualThickness}" stroke-linecap="${lineCap}" stroke-linejoin="round" opacity="${actualOpacity}" />`;
    }

    if (tool === 'line') {
      if (!start || !end) return '';
      return `<line x1="${start.x}" y1="${start.y}" x2="${end.x}" y2="${end.y}" stroke="${color}" stroke-width="${thickness}" stroke-linecap="round" opacity="${opacity}" />`;
    }

    if (tool === 'arrow') {
      if (!start || !end) return '';
      const angle = Math.atan2(end.y - start.y, end.x - start.x);
      const headLength = Math.max(12, thickness * 3.2);
      const x1 = (end.x - headLength * Math.cos(angle - Math.PI / 6)).toFixed(1);
      const y1 = (end.y - headLength * Math.sin(angle - Math.PI / 6)).toFixed(1);
      const x2 = (end.x - headLength * Math.cos(angle + Math.PI / 6)).toFixed(1);
      const y2 = (end.y - headLength * Math.sin(angle + Math.PI / 6)).toFixed(1);

      return `
        <line x1="${start.x}" y1="${start.y}" x2="${end.x}" y2="${end.y}" stroke="${color}" stroke-width="${thickness}" stroke-linecap="round" opacity="${opacity}" />
        <polygon points="${end.x},${end.y} ${x1},${y1} ${x2},${y2}" fill="${color}" opacity="${opacity}" />
      `;
    }

    if (tool === 'rect') {
      if (!start || !end) return '';
      const x = Math.min(start.x, end.x);
      const y = Math.min(start.y, end.y);
      const w = Math.abs(end.x - start.x);
      const h = Math.abs(end.y - start.y);
      return `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="6" fill="none" stroke="${color}" stroke-width="${thickness}" opacity="${opacity}" />`;
    }

    if (tool === 'ellipse') {
      if (!start || !end) return '';
      const cx = (start.x + end.x) / 2;
      const cy = (start.y + end.y) / 2;
      const rx = Math.abs(end.x - start.x) / 2;
      const ry = Math.abs(end.y - start.y) / 2;
      return `<ellipse cx="${cx}" cy="${cy}" rx="${rx}" ry="${ry}" fill="none" stroke="${color}" stroke-width="${thickness}" opacity="${opacity}" />`;
    }

    return '';
  }).join('\n');

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}" width="${width}" height="${height}">
${bgMarkup}
${elementsMarkup}
</svg>`;
};

// Generate an SVG data URI for embedding directly in <img> tags
export const createDrawingSvgDataUri = (drawingData, isDark = true) => {
  const svg = exportDrawingToSVG(drawingData, { isDark, includeBackground: true });
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
};

// Generate a PNG data URI for export or AI recognition
export const createDrawingPngDataUri = (drawingData, isDark = true, maxWidth = 1200) => {
  const { width = 900, height = 550, strokes = [], background = 'plain' } = drawingData;
  const canvas = document.createElement('canvas');
  const scale = width > maxWidth ? maxWidth / width : 1.5;
  canvas.width = Math.round(width * scale);
  canvas.height = Math.round(height * scale);

  const ctx = canvas.getContext('2d');
  ctx.scale(scale, scale);

  drawBackground(ctx, width, height, background, isDark);
  for (const stroke of strokes) {
    renderStroke(ctx, stroke);
  }

  return canvas.toDataURL('image/png', 0.92);
};

// Export drawing to PNG file download
export const exportDrawingToPNG = (drawingData, isDark = true, filename = 'drawing.png') => {
  const { width = 900, height = 550, strokes = [], background = 'plain' } = drawingData;
  const canvas = document.createElement('canvas');
  // 2x scale for sharp retina export
  const scale = 2;
  canvas.width = width * scale;
  canvas.height = height * scale;

  const ctx = canvas.getContext('2d');
  ctx.scale(scale, scale);

  drawBackground(ctx, width, height, background, isDark);
  for (const stroke of strokes) {
    renderStroke(ctx, stroke);
  }

  canvas.toBlob((blob) => {
    if (!blob) return;
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename.endsWith('.png') ? filename : `${filename}.png`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }, 'image/png');
};

// Export drawing as downloadable SVG file
export const downloadDrawingSVG = (drawingData, isDark = true, filename = 'drawing.svg') => {
  const svg = exportDrawingToSVG(drawingData, { isDark, includeBackground: true });
  const blob = new Blob([svg], { type: 'image/svg+xml;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename.endsWith('.svg') ? filename : `${filename}.svg`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};

