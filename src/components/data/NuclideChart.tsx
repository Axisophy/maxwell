'use client';

import React, { useRef, useEffect, useState, useCallback, useMemo } from 'react';
import {
  NUCLIDES,
  ELEMENTS,
  MAGIC_NUMBERS,
  DECAY_COLORS,
  DECAY_LABELS,
  CHART_BOUNDS,
  getNuclidesForElement,
  type Nuclide,
  type DecayMode,
} from './nuclideData';

function isColorDark(hex: string): boolean {
  const c = hex.replace('#', '');
  const r = parseInt(c.substring(0, 2), 16);
  const g = parseInt(c.substring(2, 4), 16);
  const b = parseInt(c.substring(4, 6), 16);
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  return luminance < 0.5;
}

// Chart configuration
const CELL_SIZE = 12;
const MIN_ZOOM = 0.3;
const MAX_ZOOM = 4;
const ZOOM_STEP = 0.1;

interface NuclideChartProps {
  className?: string;
}

export default function NuclideChart({ className = '' }: NuclideChartProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // State
  const [dimensions, setDimensions] = useState({ width: 800, height: 600 });
  const [zoom, setZoom] = useState(1);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [selectedNuclide, setSelectedNuclide] = useState<Nuclide | null>(null);
  const [hoveredNuclide, setHoveredNuclide] = useState<Nuclide | null>(null);
  const [highlightElement, setHighlightElement] = useState<number | null>(null);
  const [showMagicNumbers, setShowMagicNumbers] = useState(true);
  const [colorMode, setColorMode] = useState<'decay' | 'halflife'>('decay');

  // Build a lookup map for fast access
  const nuclideMap = useMemo(() => {
    const map = new Map<string, Nuclide>();
    NUCLIDES.forEach(nuc => {
      map.set(`${nuc.z}-${nuc.n}`, nuc);
    });
    return map;
  }, []);

  // Handle resize
  useEffect(() => {
    const updateDimensions = () => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        setDimensions({ width: rect.width, height: rect.height });
      }
    };

    updateDimensions();
    window.addEventListener('resize', updateDimensions);
    return () => window.removeEventListener('resize', updateDimensions);
  }, []);

  // Centre chart initially
  useEffect(() => {
    const centerZ = 40;
    const centerN = 50;
    setOffset({
      x: dimensions.width / 2 - centerN * CELL_SIZE * zoom,
      y: dimensions.height / 2 + centerZ * CELL_SIZE * zoom - dimensions.height,
    });
  }, [dimensions, zoom]);

  // Get half-life colour
  const getHalfLifeColor = useCallback((nuc: Nuclide): string => {
    if (nuc.isStable) return '#000000';
    if (nuc.halfLifeSeconds === null) return '#808080';

    const t = nuc.halfLifeSeconds;
    const YEAR = 31557600;

    if (t > 1e9 * YEAR) return '#1a1a2e';
    if (t > 1e6 * YEAR) return '#16213e';
    if (t > 1000 * YEAR) return '#0f3460';
    if (t > YEAR) return '#1a508b';
    if (t > 86400) return '#2176ae';
    if (t > 3600) return '#57c4e5';
    if (t > 60) return '#ffc93c';
    if (t > 1) return '#ff9a3c';
    if (t > 0.001) return '#ff6f3c';
    return '#e84545';
  }, []);

  // Get colour for a nuclide
  const getNuclideColor = useCallback((nuc: Nuclide): string => {
    if (colorMode === 'halflife') {
      return getHalfLifeColor(nuc);
    }
    return DECAY_COLORS[nuc.decay] || '#808080';
  }, [colorMode, getHalfLifeColor]);

  // Convert screen coordinates to chart coordinates
  const screenToChart = useCallback((screenX: number, screenY: number) => {
    const canvasRect = canvasRef.current?.getBoundingClientRect();
    if (!canvasRect) return { n: 0, z: 0 };

    const x = screenX - canvasRect.left;
    const y = screenY - canvasRect.top;

    const n = Math.floor((x - offset.x) / (CELL_SIZE * zoom));
    const z = Math.floor((dimensions.height - y + offset.y) / (CELL_SIZE * zoom));

    return { n, z };
  }, [offset, zoom, dimensions.height]);

  // Draw the chart
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = dimensions.width * window.devicePixelRatio;
    canvas.height = dimensions.height * window.devicePixelRatio;
    canvas.style.width = `${dimensions.width}px`;
    canvas.style.height = `${dimensions.height}px`;
    ctx.scale(window.devicePixelRatio, window.devicePixelRatio);

    // Clear with light background
    ctx.fillStyle = '#fafafa';
    ctx.fillRect(0, 0, dimensions.width, dimensions.height);

    const cellSize = CELL_SIZE * zoom;

    // Calculate visible range
    const minVisibleN = Math.floor(-offset.x / cellSize) - 1;
    const maxVisibleN = Math.ceil((dimensions.width - offset.x) / cellSize) + 1;
    const minVisibleZ = Math.floor(offset.y / cellSize) - 2;
    const maxVisibleZ = Math.ceil((dimensions.height + offset.y) / cellSize) + 1;

    // Draw magic number lines if enabled
    if (showMagicNumbers && zoom > 0.5) {
      ctx.strokeStyle = 'rgba(0, 0, 0, 0.1)';
      ctx.lineWidth = 2;

      MAGIC_NUMBERS.forEach(magic => {
        if (magic >= minVisibleN && magic <= maxVisibleN) {
          const x = offset.x + magic * cellSize;
          ctx.beginPath();
          ctx.moveTo(x, 0);
          ctx.lineTo(x, dimensions.height);
          ctx.stroke();
        }

        if (magic >= minVisibleZ && magic <= maxVisibleZ) {
          const y = dimensions.height - magic * cellSize + offset.y;
          ctx.beginPath();
          ctx.moveTo(0, y);
          ctx.lineTo(dimensions.width, y);
          ctx.stroke();
        }
      });
    }

    // Draw nuclides
    NUCLIDES.forEach(nuc => {
      if (nuc.n < minVisibleN || nuc.n > maxVisibleN) return;
      if (nuc.z < minVisibleZ || nuc.z > maxVisibleZ) return;

      const x = offset.x + nuc.n * cellSize;
      const y = dimensions.height - (nuc.z + 1) * cellSize + offset.y;

      if (x + cellSize < 0 || x > dimensions.width) return;
      if (y + cellSize < 0 || y > dimensions.height) return;

      const isHighlighted = highlightElement !== null && nuc.z === highlightElement;
      const isSelected = selectedNuclide?.z === nuc.z && selectedNuclide?.n === nuc.n;
      const isHovered = hoveredNuclide?.z === nuc.z && hoveredNuclide?.n === nuc.n;

      let fillColor = getNuclideColor(nuc);
      if (highlightElement !== null && !isHighlighted) {
        fillColor = '#e0e0e0';
      }

      ctx.fillStyle = fillColor;
      ctx.fillRect(x + 0.5, y + 0.5, cellSize - 1, cellSize - 1);

      if (isSelected) {
        ctx.strokeStyle = '#e6007e';
        ctx.lineWidth = 2;
        ctx.strokeRect(x + 1, y + 1, cellSize - 2, cellSize - 2);
      } else if (isHovered) {
        ctx.strokeStyle = '#000';
        ctx.lineWidth = 1.5;
        ctx.strokeRect(x + 0.5, y + 0.5, cellSize - 1, cellSize - 1);
      }

      if (zoom >= 1.5 && cellSize >= 18) {
        const cellColor = getNuclideColor(nuc);
        ctx.fillStyle = isColorDark(cellColor) ? '#fff' : '#000';
        ctx.font = `${Math.max(8, cellSize * 0.4)}px sans-serif`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(nuc.symbol, x + cellSize / 2, y + cellSize / 2);
      }
    });

    // Draw axes labels when zoomed out
    if (zoom <= 1) {
      ctx.fillStyle = '#000';
      ctx.font = '11px sans-serif';
      ctx.textAlign = 'center';

      for (let n = 0; n <= CHART_BOUNDS.maxN; n += 20) {
        if (n >= minVisibleN && n <= maxVisibleN) {
          const x = offset.x + n * cellSize + cellSize / 2;
          if (x > 30 && x < dimensions.width - 30) {
            ctx.fillText(`N=${n}`, x, dimensions.height - 8);
          }
        }
      }

      ctx.textAlign = 'left';
      for (let z = 0; z <= CHART_BOUNDS.maxZ; z += 20) {
        if (z >= minVisibleZ && z <= maxVisibleZ) {
          const y = dimensions.height - (z + 0.5) * cellSize + offset.y;
          if (y > 20 && y < dimensions.height - 20) {
            ctx.fillText(`Z=${z}`, 8, y);
          }
        }
      }
    }

  }, [dimensions, zoom, offset, nuclideMap, showMagicNumbers, colorMode,
      highlightElement, selectedNuclide, hoveredNuclide, getNuclideColor]);

  // Mouse handlers
  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    if (e.button === 0) {
      setIsDragging(true);
      setDragStart({ x: e.clientX - offset.x, y: e.clientY - offset.y });
    }
  }, [offset]);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (isDragging) {
      setOffset({
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y,
      });
    } else {
      const { n, z } = screenToChart(e.clientX, e.clientY);
      const nuc = nuclideMap.get(`${z}-${n}`);
      setHoveredNuclide(nuc || null);
    }
  }, [isDragging, dragStart, screenToChart, nuclideMap]);

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  const handleMouseLeave = useCallback(() => {
    setIsDragging(false);
    setHoveredNuclide(null);
  }, []);

  const handleClick = useCallback((e: React.MouseEvent) => {
    const { n, z } = screenToChart(e.clientX, e.clientY);
    const nuc = nuclideMap.get(`${z}-${n}`);
    setSelectedNuclide(nuc || null);
  }, [screenToChart, nuclideMap]);

  const handleWheel = useCallback((e: React.WheelEvent) => {
    e.preventDefault();
    const delta = e.deltaY > 0 ? -ZOOM_STEP : ZOOM_STEP;
    const newZoom = Math.max(MIN_ZOOM, Math.min(MAX_ZOOM, zoom + delta));

    const rect = canvasRef.current?.getBoundingClientRect();
    if (rect) {
      const mouseX = e.clientX - rect.left;
      const mouseY = e.clientY - rect.top;

      const zoomRatio = newZoom / zoom;
      setOffset({
        x: mouseX - (mouseX - offset.x) * zoomRatio,
        y: mouseY - (mouseY - offset.y) * zoomRatio,
      });
    }

    setZoom(newZoom);
  }, [zoom, offset]);

  // Touch handlers
  const [touchStart, setTouchStart] = useState<{ x: number; y: number } | null>(null);
  const [initialPinchDistance, setInitialPinchDistance] = useState<number | null>(null);
  const [initialPinchZoom, setInitialPinchZoom] = useState<number>(1);

  const getTouchDistance = (touches: React.TouchList) => {
    if (touches.length < 2) return 0;
    const dx = touches[0].clientX - touches[1].clientX;
    const dy = touches[0].clientY - touches[1].clientY;
    return Math.sqrt(dx * dx + dy * dy);
  };

  const getTouchCenter = (touches: React.TouchList) => {
    if (touches.length < 2) return { x: touches[0].clientX, y: touches[0].clientY };
    return {
      x: (touches[0].clientX + touches[1].clientX) / 2,
      y: (touches[0].clientY + touches[1].clientY) / 2,
    };
  };

  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    if (e.touches.length >= 2) {
      e.preventDefault();
      const center = getTouchCenter(e.touches);
      setTouchStart({ x: center.x - offset.x, y: center.y - offset.y });
      setInitialPinchDistance(getTouchDistance(e.touches));
      setInitialPinchZoom(zoom);
      setIsDragging(true);
    }
  }, [offset, zoom]);

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    if (isDragging && touchStart && e.touches.length >= 2) {
      e.preventDefault();
      const center = getTouchCenter(e.touches);

      setOffset({
        x: center.x - touchStart.x,
        y: center.y - touchStart.y,
      });

      if (initialPinchDistance) {
        const currentDistance = getTouchDistance(e.touches);
        const scale = currentDistance / initialPinchDistance;
        const newZoom = Math.max(MIN_ZOOM, Math.min(MAX_ZOOM, initialPinchZoom * scale));
        setZoom(newZoom);
      }
    }
  }, [isDragging, touchStart, initialPinchDistance, initialPinchZoom]);

  const handleTouchEnd = useCallback(() => {
    setIsDragging(false);
    setTouchStart(null);
    setInitialPinchDistance(null);
  }, []);

  // Zoom controls
  const handleZoomIn = () => setZoom(z => Math.min(MAX_ZOOM, z + ZOOM_STEP * 2));
  const handleZoomOut = () => setZoom(z => Math.max(MIN_ZOOM, z - ZOOM_STEP * 2));
  const handleResetView = () => {
    setZoom(1);
    setOffset({
      x: dimensions.width / 2 - 50 * CELL_SIZE,
      y: dimensions.height / 2 + 40 * CELL_SIZE - dimensions.height,
    });
  };

  return (
    <div className={`flex flex-col h-full bg-white ${className}`}>
      {/* Controls Header */}
      <div className="border-b border-black/10 px-3 py-2">
        <div className="flex flex-wrap items-center gap-3 justify-between">
          <div className="text-xs text-black/50">
            Drag to pan · Scroll to zoom · Click for details
          </div>

          {/* Controls */}
          <div className="flex flex-wrap items-center gap-2">
            {/* Colour mode toggle */}
            <div className="flex gap-px">
              <button
                onClick={() => setColorMode('decay')}
                className={`px-2 py-1 text-xs font-medium rounded-l transition-colors ${
                  colorMode === 'decay'
                    ? 'bg-black text-white'
                    : 'bg-black/5 text-black/60 hover:text-black'
                }`}
              >
                Decay
              </button>
              <button
                onClick={() => setColorMode('halflife')}
                className={`px-2 py-1 text-xs font-medium rounded-r transition-colors ${
                  colorMode === 'halflife'
                    ? 'bg-black text-white'
                    : 'bg-black/5 text-black/60 hover:text-black'
                }`}
              >
                Half-life
              </button>
            </div>

            {/* Magic numbers toggle */}
            <button
              onClick={() => setShowMagicNumbers(!showMagicNumbers)}
              className={`px-2 py-1 text-xs font-medium rounded transition-colors ${
                showMagicNumbers
                  ? 'bg-black text-white'
                  : 'bg-black/5 text-black/60 hover:text-black'
              }`}
            >
              Magic #
            </button>

            {/* Element filter */}
            <select
              value={highlightElement ?? ''}
              onChange={(e) => setHighlightElement(e.target.value ? parseInt(e.target.value) : null)}
              className="text-xs border border-black/10 rounded px-2 py-1 bg-white"
            >
              <option value="">All elements</option>
              {Object.entries(ELEMENTS).slice(1).map(([z, el]) => (
                <option key={z} value={z}>{el.symbol} — {el.name}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <div className="flex-1 flex min-h-0">
        {/* Chart */}
        <div
          ref={containerRef}
          className="flex-1 relative overflow-hidden cursor-grab active:cursor-grabbing min-h-0"
        >
          <canvas
            ref={canvasRef}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseLeave}
            onClick={handleClick}
            onWheel={handleWheel}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
            className="absolute inset-0"
          />

          {/* Zoom controls */}
          <div className="absolute bottom-3 right-3 flex flex-col gap-1">
            <button
              onClick={handleZoomIn}
              className="w-8 h-8 bg-white rounded border border-black/10 flex items-center justify-center text-lg font-light hover:bg-black/5 transition-colors"
            >
              +
            </button>
            <button
              onClick={handleZoomOut}
              className="w-8 h-8 bg-white rounded border border-black/10 flex items-center justify-center text-lg font-light hover:bg-black/5 transition-colors"
            >
              −
            </button>
            <button
              onClick={handleResetView}
              className="w-8 h-8 bg-white rounded border border-black/10 flex items-center justify-center text-[10px] hover:bg-black/5 transition-colors"
            >
              Reset
            </button>
          </div>

          {/* Hover tooltip */}
          {hoveredNuclide && !isDragging && (
            <div className="absolute top-3 left-3 bg-white rounded-lg border border-black/10 shadow-sm p-3 pointer-events-none">
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-mono font-bold">{hoveredNuclide.symbol}</span>
                <span className="text-lg font-mono text-black/60">{hoveredNuclide.massNumber}</span>
              </div>
              <p className="text-sm text-black/60">{hoveredNuclide.name}</p>
              <p className="text-xs font-mono text-black/40">
                Z={hoveredNuclide.z}, N={hoveredNuclide.n}
              </p>
            </div>
          )}

          {/* Zoom indicator */}
          <div className="absolute bottom-3 left-3 bg-white/90 rounded px-2 py-1 text-xs font-mono text-black/60">
            {(zoom * 100).toFixed(0)}%
          </div>
        </div>

        {/* Detail panel */}
        {selectedNuclide && (
          <div className="w-72 md:w-80 bg-white border-l border-black/10 overflow-y-auto">
            <div className="p-4">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <div className="flex items-baseline gap-2">
                    <span className="text-4xl font-mono font-bold">{selectedNuclide.symbol}</span>
                    <span className="text-2xl font-mono text-black/60">{selectedNuclide.massNumber}</span>
                  </div>
                  <p className="text-base text-black/60">{selectedNuclide.name}-{selectedNuclide.massNumber}</p>
                </div>
                <button
                  onClick={() => setSelectedNuclide(null)}
                  className="w-8 h-8 flex items-center justify-center text-xl text-black/30 hover:text-black rounded hover:bg-black/5 transition-colors"
                >
                  ×
                </button>
              </div>

              <div className="space-y-3">
                {/* Composition */}
                <div className="grid grid-cols-2 gap-2">
                  <div className="bg-black rounded-lg p-3">
                    <p className="text-[10px] text-white/50 uppercase tracking-wider mb-1">Protons (Z)</p>
                    <p className="text-2xl font-mono font-bold text-white">{selectedNuclide.z}</p>
                  </div>
                  <div className="bg-black rounded-lg p-3">
                    <p className="text-[10px] text-white/50 uppercase tracking-wider mb-1">Neutrons (N)</p>
                    <p className="text-2xl font-mono font-bold text-white">{selectedNuclide.n}</p>
                  </div>
                </div>

                {/* Stability */}
                <div className="bg-black rounded-lg p-3">
                  <p className="text-[10px] text-white/50 uppercase tracking-wider mb-1">Stability</p>
                  <div className="flex items-center gap-2">
                    <span
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: DECAY_COLORS[selectedNuclide.decay] }}
                    />
                    <span className="text-sm font-medium text-white">
                      {DECAY_LABELS[selectedNuclide.decay]}
                    </span>
                  </div>
                  {!selectedNuclide.isStable && (
                    <p className="text-sm font-mono text-white/60 mt-1">t½ = {selectedNuclide.halfLife}</p>
                  )}
                </div>

                {/* Abundance */}
                {selectedNuclide.abundance !== null && (
                  <div className="bg-black rounded-lg p-3">
                    <p className="text-[10px] text-white/50 uppercase tracking-wider mb-1">Natural Abundance</p>
                    <p className="text-2xl font-mono font-bold text-white">
                      {selectedNuclide.abundance.toFixed(selectedNuclide.abundance < 1 ? 4 : 2)}%
                    </p>
                  </div>
                )}

                {/* Magic numbers */}
                {(MAGIC_NUMBERS.includes(selectedNuclide.z) || MAGIC_NUMBERS.includes(selectedNuclide.n)) && (
                  <div className="bg-amber-500/10 border border-amber-500/20 rounded-lg p-3">
                    <p className="text-[10px] text-amber-600 uppercase tracking-wider mb-1">Magic Numbers</p>
                    <p className="text-sm text-amber-700">
                      {MAGIC_NUMBERS.includes(selectedNuclide.z) && MAGIC_NUMBERS.includes(selectedNuclide.n)
                        ? '✨ Doubly magic nucleus — extra stable!'
                        : MAGIC_NUMBERS.includes(selectedNuclide.z)
                        ? `Magic proton number (Z = ${selectedNuclide.z})`
                        : `Magic neutron number (N = ${selectedNuclide.n})`
                      }
                    </p>
                  </div>
                )}

                {/* Notes */}
                {selectedNuclide.notes && (
                  <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-3">
                    <p className="text-[10px] text-blue-600 uppercase tracking-wider mb-1">Notes</p>
                    <p className="text-sm text-blue-700">{selectedNuclide.notes}</p>
                  </div>
                )}

                {/* Other isotopes */}
                <div>
                  <p className="text-[10px] text-black/50 uppercase tracking-wider mb-2">
                    Other {selectedNuclide.name} Isotopes
                  </p>
                  <div className="flex flex-wrap gap-1">
                    {getNuclidesForElement(selectedNuclide.z)
                      .sort((a, b) => a.massNumber - b.massNumber)
                      .map(nuc => (
                        <button
                          key={nuc.massNumber}
                          onClick={() => setSelectedNuclide(nuc)}
                          className={`px-2 py-1 text-xs font-mono rounded transition-colors ${
                            nuc.massNumber === selectedNuclide.massNumber
                              ? 'bg-[#e6007e] text-white'
                              : nuc.isStable
                              ? 'bg-black text-white'
                              : 'bg-black/10 hover:bg-black/20 text-black'
                          }`}
                        >
                          {nuc.massNumber}
                        </button>
                      ))
                    }
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Legend */}
      <div className="border-t border-black/10 px-3 py-2">
        <div className="flex flex-wrap items-center gap-3 text-xs">
          {colorMode === 'decay' ? (
            <>
              <span className="text-black/50">Decay mode:</span>
              {Object.entries(DECAY_COLORS).slice(0, 8).map(([mode, color]) => (
                <div key={mode} className="flex items-center gap-1">
                  <span className="w-3 h-3 rounded-sm" style={{ backgroundColor: color }} />
                  <span className="text-black/60">{DECAY_LABELS[mode as DecayMode]}</span>
                </div>
              ))}
            </>
          ) : (
            <>
              <span className="text-black/50">Half-life:</span>
              <div className="flex items-center gap-1">
                <span className="w-3 h-3 rounded-sm bg-black" />
                <span className="text-black/60">Stable</span>
              </div>
              <div className="flex items-center gap-1">
                <span className="w-3 h-3 rounded-sm" style={{ backgroundColor: '#1a508b' }} />
                <span className="text-black/60">&gt;1 year</span>
              </div>
              <div className="flex items-center gap-1">
                <span className="w-3 h-3 rounded-sm" style={{ backgroundColor: '#57c4e5' }} />
                <span className="text-black/60">&gt;1 hour</span>
              </div>
              <div className="flex items-center gap-1">
                <span className="w-3 h-3 rounded-sm" style={{ backgroundColor: '#ffc93c' }} />
                <span className="text-black/60">&gt;1 min</span>
              </div>
              <div className="flex items-center gap-1">
                <span className="w-3 h-3 rounded-sm" style={{ backgroundColor: '#e84545' }} />
                <span className="text-black/60">&lt;1 ms</span>
              </div>
            </>
          )}

          {showMagicNumbers && (
            <>
              <span className="text-black/20">|</span>
              <span className="text-black/40">Magic numbers: {MAGIC_NUMBERS.join(', ')}</span>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
