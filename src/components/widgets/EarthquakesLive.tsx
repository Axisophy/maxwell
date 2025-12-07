'use client';

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { formatDistanceToNow } from 'date-fns';

// ============================================
// EARTHQUAKES LIVE WIDGET - FUNCTIONAL SKELETON
// ============================================
// 
// Features:
// - Real-time global earthquake data from USGS
// - Filterable by magnitude and time range
// - Simple world map with earthquake markers
// - List view with details
// - Magnitude-based colour coding
// - Responsive: pointer vs touch detection
//
// Data source: USGS Earthquake Hazards Program
// - https://earthquake.usgs.gov/fdsnws/event/1/
// - Rock solid API, excellent documentation
//
// Styling: Minimal/neutral - ready for design application
// ============================================

interface Earthquake {
  id: string;
  magnitude: number;
  place: string;
  time: number;  // Unix timestamp ms
  latitude: number;
  longitude: number;
  depth: number;  // km
  url: string;
  tsunami: boolean;
  felt: number | null;  // Number of "felt" reports
}

// Magnitude colour scale
function getMagnitudeColor(mag: number): string {
  if (mag >= 7) return '#7f1d1d';  // Major - dark red
  if (mag >= 6) return '#dc2626';  // Strong - red
  if (mag >= 5) return '#ea580c';  // Moderate - orange
  if (mag >= 4) return '#f59e0b';  // Light - amber
  if (mag >= 3) return '#eab308';  // Minor - yellow
  return '#84cc16';                 // Micro - lime
}

// Magnitude size scale (for markers)
function getMagnitudeSize(mag: number): number {
  if (mag >= 7) return 16;
  if (mag >= 6) return 12;
  if (mag >= 5) return 9;
  if (mag >= 4) return 7;
  if (mag >= 3) return 5;
  return 4;
}

// Convert lat/long to SVG coordinates
function latLonToSVG(lat: number, lon: number, width: number, height: number): { x: number; y: number } {
  const x = ((lon + 180) / 360) * width;
  const y = ((90 - lat) / 180) * height;
  return { x, y };
}

// ============================================
// EARTHQUAKE MAP COMPONENT
// ============================================

interface EarthquakeMapProps {
  earthquakes: Earthquake[];
  selectedId: string | null;
  onSelect: (id: string | null) => void;
  width?: number;
  height?: number;
}

function EarthquakeMap({ earthquakes, selectedId, onSelect, width = 360, height = 180 }: EarthquakeMapProps) {
  return (
    <svg 
      viewBox={`0 0 ${width} ${height}`}
      className="earthquake-map"
      preserveAspectRatio="xMidYMid meet"
    >
      {/* Ocean background */}
      <rect 
        x="0" y="0" 
        width={width} height={height} 
        fill="var(--map-ocean, #1e293b)"
      />
      
      {/* Simplified land masses */}
      <ellipse cx="80" cy="55" rx="35" ry="25" fill="var(--map-land, #334155)" />
      <ellipse cx="100" cy="110" rx="18" ry="30" fill="var(--map-land, #334155)" />
      <ellipse cx="185" cy="70" rx="20" ry="40" fill="var(--map-land, #334155)" />
      <ellipse cx="260" cy="55" rx="50" ry="30" fill="var(--map-land, #334155)" />
      <ellipse cx="300" cy="120" rx="20" ry="15" fill="var(--map-land, #334155)" />
      
      {/* Tectonic plate boundaries (simplified) */}
      <path
        d="M 0,55 Q 40,70 80,55 T 160,50 T 240,45 T 320,50 L 360,55"
        fill="none"
        stroke="var(--plate-boundary, #475569)"
        strokeWidth="1"
        strokeDasharray="4,4"
        opacity="0.5"
      />
      
      {/* Earthquake markers */}
      {earthquakes.map(eq => {
        const { x, y } = latLonToSVG(eq.latitude, eq.longitude, width, height);
        const size = getMagnitudeSize(eq.magnitude);
        const color = getMagnitudeColor(eq.magnitude);
        const isSelected = eq.id === selectedId;
        
        return (
          <g key={eq.id} onClick={() => onSelect(isSelected ? null : eq.id)} style={{ cursor: 'pointer' }}>
            {/* Pulse ring for recent/large quakes */}
            {eq.magnitude >= 5 && (
              <circle
                cx={x} cy={y}
                r={size + 4}
                fill="none"
                stroke={color}
                strokeWidth="2"
                opacity="0.4"
                className="quake-pulse"
              />
            )}
            
            {/* Main marker */}
            <circle
              cx={x} cy={y}
              r={size}
              fill={color}
              stroke={isSelected ? '#fff' : 'none'}
              strokeWidth={isSelected ? 2 : 0}
              opacity={isSelected ? 1 : 0.8}
            />
          </g>
        );
      })}
    </svg>
  );
}

// ============================================
// EARTHQUAKE LIST COMPONENT
// ============================================

interface EarthquakeListProps {
  earthquakes: Earthquake[];
  selectedId: string | null;
  onSelect: (id: string | null) => void;
  maxItems?: number;
}

function EarthquakeList({ earthquakes, selectedId, onSelect, maxItems = 10 }: EarthquakeListProps) {
  const displayQuakes = earthquakes.slice(0, maxItems);
  
  return (
    <div className="earthquake-list">
      {displayQuakes.map(eq => {
        const isSelected = eq.id === selectedId;
        const timeAgo = formatDistanceToNow(new Date(eq.time), { addSuffix: true });
        
        return (
          <div 
            key={eq.id}
            className={`quake-item ${isSelected ? 'selected' : ''}`}
            onClick={() => onSelect(isSelected ? null : eq.id)}
          >
            <div 
              className="quake-mag"
              style={{ backgroundColor: getMagnitudeColor(eq.magnitude) }}
            >
              {eq.magnitude.toFixed(1)}
            </div>
            <div className="quake-details">
              <div className="quake-place">{eq.place}</div>
              <div className="quake-meta">
                <span className="quake-time">{timeAgo}</span>
                <span className="quake-depth">{eq.depth.toFixed(0)} km deep</span>
              </div>
            </div>
            {eq.tsunami && <span className="tsunami-alert" title="Tsunami warning">🌊</span>}
          </div>
        );
      })}
    </div>
  );
}

// ============================================
// MAIN WIDGET COMPONENT
// ============================================

type TimeRange = 'hour' | 'day' | 'week' | 'month';
type MinMagnitude = 2.5 | 4.5 | 5.5 | 6.5;

const TIME_RANGE_OPTIONS: { value: TimeRange; label: string }[] = [
  { value: 'hour', label: 'Past Hour' },
  { value: 'day', label: 'Past Day' },
  { value: 'week', label: 'Past Week' },
  { value: 'month', label: 'Past Month' },
];

const MAGNITUDE_OPTIONS: { value: MinMagnitude; label: string }[] = [
  { value: 2.5, label: 'M2.5+' },
  { value: 4.5, label: 'M4.5+' },
  { value: 5.5, label: 'M5.5+' },
  { value: 6.5, label: 'M6.5+' },
];

export default function EarthquakesLive() {
  // ---- State ----
  const [earthquakes, setEarthquakes] = useState<Earthquake[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [timeRange, setTimeRange] = useState<TimeRange>('day');
  const [minMagnitude, setMinMagnitude] = useState<MinMagnitude>(4.5);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null);
  const [isPointerDevice, setIsPointerDevice] = useState(true);
  
  // ---- Input method detection ----
  useEffect(() => {
    const mediaQuery = window.matchMedia('(pointer: fine)');
    setIsPointerDevice(mediaQuery.matches);
    
    const handler = (e: MediaQueryListEvent) => setIsPointerDevice(e.matches);
    mediaQuery.addEventListener('change', handler);
    return () => mediaQuery.removeEventListener('change', handler);
  }, []);
  
  // ---- Build API URL ----
  const apiUrl = useMemo(() => {
    // USGS provides pre-built feeds for common queries
    const feedMap: Record<string, string> = {
      'hour-2.5': 'all_hour',
      'hour-4.5': 'all_hour',
      'day-2.5': '2.5_day',
      'day-4.5': '4.5_day',
      'week-2.5': '2.5_week',
      'week-4.5': '4.5_week',
      'month-2.5': '2.5_month',
      'month-4.5': '4.5_month',
      // Significant earthquakes feed for higher magnitudes
      'day-5.5': 'significant_day',
      'day-6.5': 'significant_day',
      'week-5.5': 'significant_week',
      'week-6.5': 'significant_week',
      'month-5.5': 'significant_month',
      'month-6.5': 'significant_month',
    };
    
    const key = `${timeRange}-${minMagnitude}`;
    const feed = feedMap[key] || '4.5_day';
    
    return `https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/${feed}.geojson`;
  }, [timeRange, minMagnitude]);
  
  // ---- Fetch earthquakes ----
  const fetchEarthquakes = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch(apiUrl);
      if (!response.ok) throw new Error('Failed to fetch earthquake data');
      
      const data = await response.json();
      
      const quakes: Earthquake[] = data.features
        .map((f: any) => ({
          id: f.id,
          magnitude: f.properties.mag,
          place: f.properties.place || 'Unknown location',
          time: f.properties.time,
          latitude: f.geometry.coordinates[1],
          longitude: f.geometry.coordinates[0],
          depth: f.geometry.coordinates[2],
          url: f.properties.url,
          tsunami: f.properties.tsunami === 1,
          felt: f.properties.felt,
        }))
        .filter((eq: Earthquake) => eq.magnitude >= minMagnitude)
        .sort((a: Earthquake, b: Earthquake) => b.time - a.time);
      
      setEarthquakes(quakes);
      setLastUpdate(new Date());
      setLoading(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
      setLoading(false);
    }
  }, [apiUrl, minMagnitude]);
  
  // ---- Fetch on mount and filter change ----
  useEffect(() => {
    fetchEarthquakes();
    
    // Refresh every 5 minutes
    const interval = setInterval(fetchEarthquakes, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, [fetchEarthquakes]);
  
  // ---- Summary stats ----
  const stats = useMemo(() => {
    if (earthquakes.length === 0) return null;
    
    const maxMag = Math.max(...earthquakes.map(eq => eq.magnitude));
    const avgMag = earthquakes.reduce((sum, eq) => sum + eq.magnitude, 0) / earthquakes.length;
    
    return {
      count: earthquakes.length,
      maxMagnitude: maxMag,
      avgMagnitude: avgMag,
    };
  }, [earthquakes]);

  return (
    <div className={`earthquakes-widget ${isPointerDevice ? 'pointer-device' : 'touch-device'}`}>
      
      {/* ---- Header ---- */}
      <div className="widget-header">
        <div className="header-left">
          <span className="widget-title">Earthquakes</span>
          <span className="live-indicator">● LIVE</span>
        </div>
        {lastUpdate && (
          <span className="last-update">
            {formatDistanceToNow(lastUpdate, { addSuffix: true })}
          </span>
        )}
      </div>
      
      {/* ---- Filters ---- */}
      <div className="filters">
        <div className="filter-group">
          <label className="filter-label">Time</label>
          <div className="filter-buttons">
            {TIME_RANGE_OPTIONS.map(opt => (
              <button
                key={opt.value}
                className={`filter-btn ${timeRange === opt.value ? 'active' : ''}`}
                onClick={() => setTimeRange(opt.value)}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>
        
        <div className="filter-group">
          <label className="filter-label">Magnitude</label>
          <div className="filter-buttons">
            {MAGNITUDE_OPTIONS.map(opt => (
              <button
                key={opt.value}
                className={`filter-btn ${minMagnitude === opt.value ? 'active' : ''}`}
                onClick={() => setMinMagnitude(opt.value)}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>
      </div>
      
      {/* ---- Loading State ---- */}
      {loading && (
        <div className="loading-state">
          Fetching seismic data...
        </div>
      )}
      
      {/* ---- Error State ---- */}
      {error && (
        <div className="error-message">
          {error}
          <button onClick={fetchEarthquakes} className="retry-btn">Retry</button>
        </div>
      )}
      
      {/* ---- Main Display ---- */}
      {!loading && !error && (
        <>
          {/* Stats bar */}
          {stats && (
            <div className="stats-bar">
              <div className="stat">
                <span className="stat-value">{stats.count}</span>
                <span className="stat-label">quakes</span>
              </div>
              <div className="stat">
                <span className="stat-value" style={{ color: getMagnitudeColor(stats.maxMagnitude) }}>
                  {stats.maxMagnitude.toFixed(1)}
                </span>
                <span className="stat-label">max</span>
              </div>
              <div className="stat">
                <span className="stat-value">{stats.avgMagnitude.toFixed(1)}</span>
                <span className="stat-label">avg</span>
              </div>
            </div>
          )}
          
          {/* Map */}
          <div className="map-container">
            <EarthquakeMap 
              earthquakes={earthquakes}
              selectedId={selectedId}
              onSelect={setSelectedId}
            />
          </div>
          
          {/* Magnitude scale */}
          <div className="magnitude-scale">
            {[3, 4, 5, 6, 7].map(mag => (
              <div key={mag} className="scale-item">
                <div 
                  className="scale-dot"
                  style={{ 
                    backgroundColor: getMagnitudeColor(mag),
                    width: getMagnitudeSize(mag) * 1.5,
                    height: getMagnitudeSize(mag) * 1.5,
                  }}
                />
                <span className="scale-label">{mag}+</span>
              </div>
            ))}
          </div>
          
          {/* List */}
          {earthquakes.length > 0 ? (
            <EarthquakeList 
              earthquakes={earthquakes}
              selectedId={selectedId}
              onSelect={setSelectedId}
            />
          ) : (
            <div className="no-quakes">
              No earthquakes matching filters
            </div>
          )}
        </>
      )}
      
      {/* ---- Data source ---- */}
      <div className="data-source">
        Data: USGS Earthquake Hazards Program
      </div>
      
      {/* ---- Skeleton Styles ---- */}
      <style jsx>{`
        .earthquakes-widget {
          --map-ocean: #1e293b;
          --map-land: #334155;
          --widget-bg: #ffffff;
          --widget-border: #e0e0e0;
          --text-primary: #000000;
          --text-secondary: #666666;
          --text-muted: #999999;
          --live-color: #22c55e;
          
          background: var(--widget-bg);
          border: 1px solid var(--widget-border);
          border-radius: 12px;
          padding: 16px;
          font-family: var(--font-sans, system-ui, sans-serif);
        }
        
        .widget-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 12px;
        }
        
        .header-left {
          display: flex;
          align-items: center;
          gap: 12px;
        }
        
        .widget-title {
          font-size: 14px;
          font-weight: 500;
          color: var(--text-primary);
        }
        
        .live-indicator {
          font-size: 10px;
          font-weight: 600;
          color: var(--live-color);
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }
        
        .last-update {
          font-size: 11px;
          color: var(--text-muted);
        }
        
        .filters {
          display: flex;
          flex-direction: column;
          gap: 8px;
          margin-bottom: 12px;
        }
        
        .filter-group {
          display: flex;
          align-items: center;
          gap: 8px;
        }
        
        .filter-label {
          font-size: 11px;
          color: var(--text-muted);
          min-width: 60px;
        }
        
        .filter-buttons {
          display: flex;
          gap: 4px;
          flex-wrap: wrap;
        }
        
        .filter-btn {
          padding: 4px 8px;
          font-size: 11px;
          background: #f5f5f5;
          border: 1px solid var(--widget-border);
          border-radius: 4px;
          color: var(--text-secondary);
          cursor: pointer;
        }
        
        .filter-btn.active {
          background: var(--text-primary);
          color: white;
          border-color: var(--text-primary);
        }
        
        .loading-state {
          text-align: center;
          padding: 40px 20px;
          color: var(--text-secondary);
        }
        
        .error-message {
          background: #fef2f2;
          border: 1px solid #fecaca;
          border-radius: 8px;
          padding: 12px;
          color: #991b1b;
          font-size: 13px;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        
        .retry-btn {
          padding: 4px 12px;
          background: #991b1b;
          color: white;
          border: none;
          border-radius: 4px;
          font-size: 12px;
          cursor: pointer;
        }
        
        .stats-bar {
          display: flex;
          justify-content: space-around;
          padding: 8px 0;
          margin-bottom: 12px;
          border-bottom: 1px solid var(--widget-border);
        }
        
        .stat {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 2px;
        }
        
        .stat-value {
          font-family: var(--font-mono, monospace);
          font-size: 18px;
          font-weight: 600;
          color: var(--text-primary);
        }
        
        .stat-label {
          font-size: 10px;
          color: var(--text-muted);
          text-transform: uppercase;
        }
        
        .map-container {
          border-radius: 8px;
          overflow: hidden;
          margin-bottom: 8px;
        }
        
        :global(.earthquake-map) {
          width: 100%;
          height: auto;
          display: block;
        }
        
        :global(.quake-pulse) {
          animation: pulse 2s ease-out infinite;
        }
        
        @keyframes pulse {
          0% { opacity: 0.6; transform: scale(1); }
          100% { opacity: 0; transform: scale(1.5); }
        }
        
        .magnitude-scale {
          display: flex;
          justify-content: center;
          gap: 16px;
          margin-bottom: 12px;
          padding: 8px 0;
        }
        
        .scale-item {
          display: flex;
          align-items: center;
          gap: 4px;
        }
        
        .scale-dot {
          border-radius: 50%;
        }
        
        .scale-label {
          font-size: 10px;
          color: var(--text-muted);
        }
        
        .earthquake-list {
          max-height: 200px;
          overflow-y: auto;
        }
        
        .quake-item {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 8px;
          border-radius: 6px;
          cursor: pointer;
          transition: background 0.2s;
        }
        
        .quake-item:hover {
          background: #f5f5f5;
        }
        
        .quake-item.selected {
          background: #f0f9ff;
        }
        
        .quake-mag {
          width: 40px;
          height: 40px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 6px;
          font-family: var(--font-mono, monospace);
          font-size: 14px;
          font-weight: 600;
          color: white;
        }
        
        .quake-details {
          flex: 1;
          min-width: 0;
        }
        
        .quake-place {
          font-size: 13px;
          color: var(--text-primary);
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        
        .quake-meta {
          display: flex;
          gap: 12px;
          margin-top: 2px;
        }
        
        .quake-time,
        .quake-depth {
          font-size: 11px;
          color: var(--text-muted);
        }
        
        .tsunami-alert {
          font-size: 16px;
        }
        
        .no-quakes {
          text-align: center;
          padding: 24px;
          color: var(--text-muted);
          font-size: 13px;
        }
        
        .data-source {
          text-align: center;
          font-size: 10px;
          color: var(--text-muted);
          margin-top: 12px;
        }
        
        /* Touch adjustments */
        .touch-device .filter-btn {
          padding: 8px 12px;
          font-size: 13px;
        }
        
        .touch-device .quake-item {
          padding: 12px;
        }
      `}</style>
    </div>
  );
}