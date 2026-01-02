'use client';

import React, { useState, useRef, useCallback, useEffect, useMemo } from 'react';
import {
  SPECTRUM_BANDS,
  SPECTRUM_LANDMARKS,
  SPECTRUM_STATS,
  wavelengthToLogPosition,
  logPositionToWavelength,
  formatWavelength,
  formatFrequency,
  formatEnergy,
  wavelengthToFrequency,
  wavelengthToEnergy,
  wavelengthToVisibleColor,
  getBandAtWavelength,
  type SpectrumBand,
  type SpectrumLandmark,
} from './emSpectrumData';

type ViewMode = 'ruler' | 'bands' | 'landmarks';
type LensMode = 'all' | 'technology' | 'astronomy' | 'biology' | 'medical' | 'physics';

interface EMSpectrumChartProps {
  className?: string;
}

// Spectrum ruler component with zoom/pan
function SpectrumRuler({
  zoom,
  panOffset,
  onZoomChange,
  onPanChange,
  selectedBand,
  selectedLandmark,
  onSelectBand,
  onSelectLandmark,
  lensMode,
}: {
  zoom: number;
  panOffset: number;
  onZoomChange: (z: number) => void;
  onPanChange: (p: number) => void;
  selectedBand: SpectrumBand | null;
  selectedLandmark: SpectrumLandmark | null;
  onSelectBand: (b: SpectrumBand | null) => void;
  onSelectLandmark: (l: SpectrumLandmark | null) => void;
  lensMode: LensMode;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const isDragging = useRef(false);
  const lastX = useRef(0);

  // Handle wheel zoom
  const handleWheel = useCallback(
    (e: WheelEvent) => {
      e.preventDefault();
      const delta = e.deltaY > 0 ? 0.9 : 1.1;
      const newZoom = Math.max(1, Math.min(50, zoom * delta));
      onZoomChange(newZoom);
    },
    [zoom, onZoomChange]
  );

  // Mouse drag for panning
  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    isDragging.current = true;
    lastX.current = e.clientX;
  }, []);

  const handleMouseMove = useCallback(
    (e: React.MouseEvent) => {
      if (!isDragging.current || !containerRef.current) return;
      const dx = e.clientX - lastX.current;
      const containerWidth = containerRef.current.offsetWidth;
      const panDelta = (dx / containerWidth) * (100 / zoom);
      const newPan = Math.max(-50 + 50 / zoom, Math.min(50 - 50 / zoom, panOffset - panDelta));
      onPanChange(newPan);
      lastX.current = e.clientX;
    },
    [zoom, panOffset, onPanChange]
  );

  const handleMouseUp = useCallback(() => {
    isDragging.current = false;
  }, []);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    container.addEventListener('wheel', handleWheel, { passive: false });
    window.addEventListener('mouseup', handleMouseUp);

    return () => {
      container.removeEventListener('wheel', handleWheel);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [handleWheel, handleMouseUp]);

  // Calculate visible range
  const viewStart = 50 - 50 / zoom + panOffset;
  const viewEnd = 50 + 50 / zoom + panOffset;

  // Filter landmarks by lens mode
  const filteredLandmarks = useMemo(() => {
    if (lensMode === 'all') return SPECTRUM_LANDMARKS;
    return SPECTRUM_LANDMARKS.filter((l) => l.type === lensMode);
  }, [lensMode]);

  // Generate tick marks
  const ticks = useMemo(() => {
    const result: { position: number; label: string; major: boolean }[] = [];
    // Generate ticks at powers of 10
    for (let exp = -14; exp <= 5; exp++) {
      const wavelength = Math.pow(10, exp);
      const position = wavelengthToLogPosition(wavelength) * 100;
      if (position >= viewStart && position <= viewEnd) {
        result.push({
          position: ((position - viewStart) / (viewEnd - viewStart)) * 100,
          label: formatWavelength(wavelength),
          major: true,
        });
      }
    }
    return result;
  }, [viewStart, viewEnd]);

  return (
    <div className="w-full">
      {/* Zoom controls */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <button
            onClick={() => onZoomChange(Math.max(1, zoom / 1.5))}
            className="w-8 h-8 bg-neutral-200 hover:bg-neutral-300 rounded flex items-center justify-center text-lg"
          >
            −
          </button>
          <span className="text-sm text-black/60 tabular-nums w-16 text-center">
            {zoom.toFixed(1)}×
          </span>
          <button
            onClick={() => onZoomChange(Math.min(50, zoom * 1.5))}
            className="w-8 h-8 bg-neutral-200 hover:bg-neutral-300 rounded flex items-center justify-center text-lg"
          >
            +
          </button>
          <button
            onClick={() => {
              onZoomChange(1);
              onPanChange(0);
            }}
            className="ml-2 px-2 py-1 text-xs bg-neutral-200 hover:bg-neutral-300 rounded"
          >
            Reset
          </button>
        </div>
        <div className="text-xs text-black/40">Scroll to zoom • Drag to pan</div>
      </div>

      {/* Main ruler */}
      <div
        ref={containerRef}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        className="relative h-40 bg-neutral-100 rounded-xl overflow-hidden cursor-grab active:cursor-grabbing select-none"
      >
        {/* Band backgrounds */}
        {SPECTRUM_BANDS.map((band) => {
          const bandStart = wavelengthToLogPosition(band.wavelengthMax) * 100;
          const bandEnd = wavelengthToLogPosition(band.wavelengthMin) * 100;

          if (bandEnd < viewStart || bandStart > viewEnd) return null;

          const displayStart = Math.max(0, ((bandStart - viewStart) / (viewEnd - viewStart)) * 100);
          const displayEnd = Math.min(100, ((bandEnd - viewStart) / (viewEnd - viewStart)) * 100);

          const isSelected = selectedBand?.id === band.id;
          const bgStyle =
            band.id === 'visible'
              ? {
                  background:
                    'linear-gradient(90deg, #8b5cf6, #3b82f6, #22c55e, #eab308, #f97316, #ef4444)',
                }
              : { backgroundColor: band.color };

          return (
            <div
              key={band.id}
              onClick={() => onSelectBand(isSelected ? null : band)}
              className={`absolute top-0 bottom-0 transition-opacity cursor-pointer ${
                isSelected ? 'opacity-100' : 'opacity-40 hover:opacity-70'
              }`}
              style={{
                left: `${displayStart}%`,
                width: `${displayEnd - displayStart}%`,
                ...bgStyle,
              }}
            >
              {displayEnd - displayStart > 8 && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-white text-xs font-medium drop-shadow-md">
                    {band.shortName}
                  </span>
                </div>
              )}
            </div>
          );
        })}

        {/* Visible spectrum rainbow detail (when zoomed in) */}
        {zoom > 5 && (
          <div className="absolute top-0 bottom-0 pointer-events-none">
            {Array.from({ length: 32 }).map((_, i) => {
              const nm = 380 + i * 10;
              const wavelength = nm * 1e-9;
              const position = wavelengthToLogPosition(wavelength) * 100;
              if (position < viewStart || position > viewEnd) return null;

              const displayPos = ((position - viewStart) / (viewEnd - viewStart)) * 100;
              const color = wavelengthToVisibleColor(wavelength);
              if (!color) return null;

              return (
                <div
                  key={nm}
                  className="absolute top-0 bottom-0 w-px"
                  style={{
                    left: `${displayPos}%`,
                    backgroundColor: color,
                  }}
                />
              );
            })}
          </div>
        )}

        {/* Landmarks */}
        {filteredLandmarks.map((landmark) => {
          const position = wavelengthToLogPosition(landmark.wavelength) * 100;
          if (position < viewStart || position > viewEnd) return null;

          const displayPos = ((position - viewStart) / (viewEnd - viewStart)) * 100;
          const isSelected = selectedLandmark?.id === landmark.id;

          return (
            <div
              key={landmark.id}
              onClick={(e) => {
                e.stopPropagation();
                onSelectLandmark(isSelected ? null : landmark);
              }}
              className={`absolute top-2 cursor-pointer transition-transform ${
                isSelected ? 'z-20 scale-110' : 'z-10 hover:scale-105'
              }`}
              style={{ left: `${displayPos}%`, transform: 'translateX(-50%)' }}
            >
              <div
                className={`w-2 h-2 rounded-full border-2 ${
                  isSelected
                    ? 'bg-black border-black'
                    : 'bg-white border-black/30 hover:border-black/60'
                }`}
              />
              {(zoom > 3 || isSelected) && (
                <div
                  className={`absolute top-4 left-1/2 -translate-x-1/2 whitespace-nowrap text-[9px] ${
                    isSelected ? 'text-black font-medium' : 'text-black/50'
                  }`}
                >
                  {landmark.name}
                </div>
              )}
            </div>
          );
        })}

        {/* Tick marks */}
        <div className="absolute bottom-0 left-0 right-0 h-8 border-t border-black/10">
          {ticks.map((tick, i) => (
            <div
              key={i}
              className="absolute bottom-0 flex flex-col items-center"
              style={{ left: `${tick.position}%`, transform: 'translateX(-50%)' }}
            >
              <div className={`w-px bg-black/30 ${tick.major ? 'h-3' : 'h-2'}`} />
              {tick.major && (
                <span className="text-[9px] text-black/50 mt-1 font-mono">{tick.label}</span>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Scale labels */}
      <div className="flex justify-between mt-2 text-[10px] text-black/40 uppercase tracking-wider">
        <span>← High energy / Short λ</span>
        <span>Low energy / Long λ →</span>
      </div>
    </div>
  );
}

// Band card component
function BandCard({
  band,
  isSelected,
  onClick,
}: {
  band: SpectrumBand;
  isSelected: boolean;
  onClick: () => void;
}) {
  const bgStyle =
    band.id === 'visible'
      ? { background: 'linear-gradient(135deg, #8b5cf6, #3b82f6, #22c55e, #eab308, #f97316, #ef4444)' }
      : { backgroundColor: band.color };

  return (
    <button
      onClick={onClick}
      className={`w-full text-left p-3 rounded-lg transition-all ${
        isSelected ? 'bg-black text-white' : 'bg-neutral-100 hover:bg-neutral-200'
      }`}
    >
      <div className="flex items-start gap-3">
        <div className="w-10 h-10 rounded-lg flex-shrink-0" style={bgStyle} />
        <div className="flex-1 min-w-0">
          <div className="font-medium text-sm">{band.name}</div>
          <div className={`text-xs mt-0.5 ${isSelected ? 'text-white/60' : 'text-black/50'}`}>
            {formatWavelength(band.wavelengthMax)} – {formatWavelength(band.wavelengthMin)}
          </div>
        </div>
      </div>
    </button>
  );
}

// Detail panel for selected band or landmark
function DetailPanel({
  band,
  landmark,
  onClose,
}: {
  band: SpectrumBand | null;
  landmark: SpectrumLandmark | null;
  onClose: () => void;
}) {
  if (!band && !landmark) return null;

  if (landmark) {
    const landmarkBand = getBandAtWavelength(landmark.wavelength);
    return (
      <div className="w-full md:w-80 bg-white border-t md:border-t-0 md:border-l border-black/10 overflow-y-auto">
        <div className="p-4">
          <div className="flex items-start justify-between mb-4">
            <div>
              <p className="text-xs text-black/50 uppercase tracking-wider">{landmark.type}</p>
              <h2 className="text-xl font-light text-black mt-1">{landmark.name}</h2>
            </div>
            <button onClick={onClose} className="text-2xl text-black/30 hover:text-black leading-none">
              ×
            </button>
          </div>

          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-2">
              <div className="bg-neutral-100 rounded-lg p-3">
                <p className="text-[10px] text-black/50 uppercase tracking-wider mb-1">Wavelength</p>
                <p className="text-lg font-mono font-bold">{formatWavelength(landmark.wavelength)}</p>
              </div>
              <div className="bg-neutral-100 rounded-lg p-3">
                <p className="text-[10px] text-black/50 uppercase tracking-wider mb-1">Frequency</p>
                <p className="text-lg font-mono font-bold">
                  {formatFrequency(wavelengthToFrequency(landmark.wavelength))}
                </p>
              </div>
              <div className="bg-neutral-100 rounded-lg p-3">
                <p className="text-[10px] text-black/50 uppercase tracking-wider mb-1">Energy</p>
                <p className="text-lg font-mono font-bold">
                  {formatEnergy(wavelengthToEnergy(landmark.wavelength))}
                </p>
              </div>
              <div className="bg-neutral-100 rounded-lg p-3">
                <p className="text-[10px] text-black/50 uppercase tracking-wider mb-1">Band</p>
                <p className="text-lg font-bold">{landmarkBand?.shortName || '—'}</p>
              </div>
            </div>

            <div className="bg-neutral-100 rounded-lg p-3">
              <p className="text-[10px] text-black/50 uppercase tracking-wider mb-1">Description</p>
              <p className="text-sm">{landmark.description}</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (band) {
    const bgStyle =
      band.id === 'visible'
        ? { background: 'linear-gradient(90deg, #8b5cf6, #3b82f6, #22c55e, #eab308, #f97316, #ef4444)' }
        : { backgroundColor: band.color };

    return (
      <div className="w-full md:w-80 bg-white border-t md:border-t-0 md:border-l border-black/10 overflow-y-auto">
        <div className="h-2" style={bgStyle} />
        <div className="p-4">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h2 className="text-xl font-light text-black">{band.name}</h2>
              <p className="text-sm text-black/50 mt-0.5 font-mono">
                {formatWavelength(band.wavelengthMax)} – {formatWavelength(band.wavelengthMin)}
              </p>
            </div>
            <button onClick={onClose} className="text-2xl text-black/30 hover:text-black leading-none">
              ×
            </button>
          </div>

          <p className="text-sm text-black/70 mb-4">{band.description}</p>

          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-2">
              <div className="bg-neutral-100 rounded-lg p-3">
                <p className="text-[10px] text-black/50 uppercase tracking-wider mb-1">Frequency</p>
                <p className="text-sm font-mono">
                  {formatFrequency(wavelengthToFrequency(band.wavelengthMax))} –{' '}
                  {formatFrequency(wavelengthToFrequency(band.wavelengthMin))}
                </p>
              </div>
              <div className="bg-neutral-100 rounded-lg p-3">
                <p className="text-[10px] text-black/50 uppercase tracking-wider mb-1">Energy</p>
                <p className="text-sm font-mono">
                  {formatEnergy(wavelengthToEnergy(band.wavelengthMax))} –{' '}
                  {formatEnergy(wavelengthToEnergy(band.wavelengthMin))}
                </p>
              </div>
            </div>

            <div className="bg-neutral-100 rounded-lg p-3">
              <p className="text-[10px] text-black/50 uppercase tracking-wider mb-2">How It Works</p>
              <p className="text-sm text-black/70">{band.mechanism}</p>
            </div>

            <div className="bg-neutral-100 rounded-lg p-3">
              <p className="text-[10px] text-black/50 uppercase tracking-wider mb-2">Applications</p>
              <div className="flex flex-wrap gap-1">
                {band.applications.slice(0, 6).map((app, i) => (
                  <span key={i} className="px-2 py-0.5 text-xs bg-white rounded">
                    {app}
                  </span>
                ))}
              </div>
            </div>

            {band.subBands && (
              <div className="bg-neutral-100 rounded-lg p-3">
                <p className="text-[10px] text-black/50 uppercase tracking-wider mb-2">Sub-bands</p>
                <div className="space-y-1">
                  {band.subBands.map((sub, i) => (
                    <div key={i} className="flex justify-between text-xs">
                      <span className="font-medium">{sub.name}</span>
                      <span className="text-black/50 font-mono">{sub.range}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="bg-neutral-100 rounded-lg p-3">
              <p className="text-[10px] text-black/50 uppercase tracking-wider mb-2">Sources</p>
              <p className="text-sm text-black/70">{band.sources.slice(0, 4).join(', ')}</p>
            </div>

            {band.hazards.length > 0 && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                <p className="text-[10px] text-red-700 uppercase tracking-wider mb-2">Hazards</p>
                <ul className="space-y-1">
                  {band.hazards.map((hazard, i) => (
                    <li key={i} className="text-xs text-red-900 flex items-start gap-1">
                      <span className="text-red-400">⚠</span>
                      <span>{hazard}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
              <p className="text-[10px] text-blue-700 uppercase tracking-wider mb-1">Did You Know?</p>
              <p className="text-sm text-blue-900">{band.funFact}</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return null;
}

// Landmarks list view
function LandmarksView({
  lensMode,
  selectedLandmark,
  onSelectLandmark,
}: {
  lensMode: LensMode;
  selectedLandmark: SpectrumLandmark | null;
  onSelectLandmark: (l: SpectrumLandmark) => void;
}) {
  const filteredLandmarks = useMemo(() => {
    if (lensMode === 'all') return SPECTRUM_LANDMARKS;
    return SPECTRUM_LANDMARKS.filter((l) => l.type === lensMode);
  }, [lensMode]);

  // Group by band
  const groupedByBand = useMemo(() => {
    const groups: Record<string, SpectrumLandmark[]> = {};
    filteredLandmarks.forEach((l) => {
      if (!groups[l.band]) groups[l.band] = [];
      groups[l.band].push(l);
    });
    return groups;
  }, [filteredLandmarks]);

  return (
    <div className="p-4 md:p-6">
      <div className="max-w-3xl mx-auto space-y-6">
        {SPECTRUM_BANDS.map((band) => {
          const landmarks = groupedByBand[band.id];
          if (!landmarks || landmarks.length === 0) return null;

          const bgStyle =
            band.id === 'visible'
              ? { background: 'linear-gradient(90deg, #8b5cf6, #3b82f6, #22c55e, #eab308)' }
              : { backgroundColor: band.color };

          return (
            <div key={band.id}>
              <div className="flex items-center gap-2 mb-3">
                <div className="w-4 h-4 rounded" style={bgStyle} />
                <h3 className="text-sm font-medium text-black/70">{band.name}</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {landmarks.map((l) => (
                  <button
                    key={l.id}
                    onClick={() => onSelectLandmark(l)}
                    className={`p-3 rounded-lg text-left transition-colors ${
                      selectedLandmark?.id === l.id
                        ? 'bg-black text-white'
                        : 'bg-neutral-100 hover:bg-neutral-200'
                    }`}
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="font-medium text-sm">{l.name}</div>
                        <div
                          className={`text-xs mt-0.5 ${
                            selectedLandmark?.id === l.id ? 'text-white/60' : 'text-black/50'
                          }`}
                        >
                          {l.description}
                        </div>
                      </div>
                      <span
                        className={`text-xs font-mono ${
                          selectedLandmark?.id === l.id ? 'text-white/60' : 'text-black/40'
                        }`}
                      >
                        {formatWavelength(l.wavelength)}
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// Main component
export default function EMSpectrumChart({ className = '' }: EMSpectrumChartProps) {
  const [viewMode, setViewMode] = useState<ViewMode>('ruler');
  const [lensMode, setLensMode] = useState<LensMode>('all');
  const [selectedBand, setSelectedBand] = useState<SpectrumBand | null>(null);
  const [selectedLandmark, setSelectedLandmark] = useState<SpectrumLandmark | null>(null);
  const [zoom, setZoom] = useState(1);
  const [panOffset, setPanOffset] = useState(0);

  const handleSelectBand = useCallback((b: SpectrumBand | null) => {
    setSelectedBand(b);
    setSelectedLandmark(null);
  }, []);

  const handleSelectLandmark = useCallback((l: SpectrumLandmark | null) => {
    setSelectedLandmark(l);
    setSelectedBand(null);
  }, []);

  const closeDetail = useCallback(() => {
    setSelectedBand(null);
    setSelectedLandmark(null);
  }, []);

  return (
    <div className={`flex flex-col h-full bg-white ${className}`}>
      {/* Header */}
      <div className="border-b border-black/10 px-4 py-3">
        <div className="flex flex-wrap items-center gap-4 justify-between">
          <div>
            <h1 className="text-xl font-light text-black">Electromagnetic Spectrum</h1>
            <p className="text-sm text-black/50">
              19 orders of magnitude • Visible: {SPECTRUM_STATS.visibleFraction}%
            </p>
          </div>

          {/* View mode toggle */}
          <div className="flex items-center gap-2">
            {(['ruler', 'bands', 'landmarks'] as ViewMode[]).map((mode) => (
              <button
                key={mode}
                onClick={() => setViewMode(mode)}
                className={`px-3 py-1.5 text-xs font-medium rounded transition-colors uppercase ${
                  viewMode === mode ? 'bg-black text-white' : 'bg-neutral-200 hover:bg-neutral-300'
                }`}
              >
                {mode}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Lens mode filter */}
      {(viewMode === 'ruler' || viewMode === 'landmarks') && (
        <div className="border-b border-black/10 px-4 py-2">
          <div className="flex items-center gap-2">
            <span className="text-xs text-black/50">Filter:</span>
            {(['all', 'technology', 'astronomy', 'biology', 'medical', 'physics'] as LensMode[]).map(
              (mode) => (
                <button
                  key={mode}
                  onClick={() => setLensMode(mode)}
                  className={`px-2 py-1 text-xs rounded transition-colors capitalize ${
                    lensMode === mode ? 'bg-black text-white' : 'bg-neutral-200 hover:bg-neutral-300'
                  }`}
                >
                  {mode}
                </button>
              )
            )}
          </div>
        </div>
      )}

      {/* Main content */}
      <div className="flex-1 flex flex-col md:flex-row min-h-0 overflow-hidden">
        {/* Chart area */}
        <div className="flex-1 overflow-auto">
          {viewMode === 'ruler' && (
            <div className="p-4 md:p-6">
              <SpectrumRuler
                zoom={zoom}
                panOffset={panOffset}
                onZoomChange={setZoom}
                onPanChange={setPanOffset}
                selectedBand={selectedBand}
                selectedLandmark={selectedLandmark}
                onSelectBand={handleSelectBand}
                onSelectLandmark={handleSelectLandmark}
                lensMode={lensMode}
              />
            </div>
          )}

          {viewMode === 'bands' && (
            <div className="p-4 md:p-6">
              <div className="max-w-2xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-3">
                {SPECTRUM_BANDS.map((band) => (
                  <BandCard
                    key={band.id}
                    band={band}
                    isSelected={selectedBand?.id === band.id}
                    onClick={() => handleSelectBand(selectedBand?.id === band.id ? null : band)}
                  />
                ))}
              </div>
            </div>
          )}

          {viewMode === 'landmarks' && (
            <LandmarksView
              lensMode={lensMode}
              selectedLandmark={selectedLandmark}
              onSelectLandmark={handleSelectLandmark}
            />
          )}
        </div>

        {/* Detail panel */}
        {(selectedBand || selectedLandmark) && (
          <DetailPanel band={selectedBand} landmark={selectedLandmark} onClose={closeDetail} />
        )}
      </div>
    </div>
  );
}
