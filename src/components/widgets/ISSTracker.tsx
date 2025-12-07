'use client';

import React, { useState, useEffect, useCallback } from 'react';

// ============================================
// ISS TRACKER WIDGET - FUNCTIONAL SKELETON
// ============================================
// 
// Features:
// - Live ISS position (updates every 5 seconds)
// - Simple world map with ISS marker
// - Ground track (recent path)
// - Current astronauts in space
// - Velocity and altitude display
// - Responsive: pointer vs touch detection
//
// Data source: Open Notify API (rock solid, no auth)
// - /iss-now.json - current position
// - /astros.json - people in space
//
// Styling: Minimal/neutral - ready for design application
// ============================================

interface ISSPosition {
  latitude: number;
  longitude: number;
  timestamp: number;
}

interface Astronaut {
  name: string;
  craft: string;
}

// ISS orbital parameters (approximate)
const ISS_ALTITUDE_KM = 420;
const ISS_VELOCITY_KMH = 27600;

// Convert lat/long to SVG map coordinates
// Simple equirectangular projection
function latLonToSVG(lat: number, lon: number, width: number, height: number): { x: number; y: number } {
  const x = ((lon + 180) / 360) * width;
  const y = ((90 - lat) / 180) * height;
  return { x, y };
}

// Simple world map as SVG path (very simplified continents)
const WORLD_MAP_PATH = `
  M 48,35 L 52,32 58,33 62,30 68,32 72,28 78,30 82,35 88,38 92,42 95,48 
  92,55 88,60 82,62 78,58 72,55 68,52 62,55 58,52 52,55 48,52 45,48 48,35 Z
  M 20,45 L 28,42 35,45 38,52 35,58 28,55 20,52 18,48 20,45 Z
  M 145,55 L 152,48 158,50 162,55 165,62 162,68 155,70 148,68 145,62 145,55 Z
  M 115,75 L 125,72 135,75 142,82 138,88 128,90 118,88 115,82 115,75 Z
`;

// ============================================
// WORLD MAP COMPONENT
// ============================================

interface WorldMapProps {
  issPosition: ISSPosition | null;
  groundTrack: ISSPosition[];
  width?: number;
  height?: number;
}

function WorldMap({ issPosition, groundTrack, width = 360, height = 180 }: WorldMapProps) {
  // Generate ground track path
  const trackPath = groundTrack.length > 1 
    ? groundTrack.map((pos, i) => {
        const { x, y } = latLonToSVG(pos.latitude, pos.longitude, width, height);
        return `${i === 0 ? 'M' : 'L'} ${x} ${y}`;
      }).join(' ')
    : '';

  // ISS current position
  const issXY = issPosition 
    ? latLonToSVG(issPosition.latitude, issPosition.longitude, width, height)
    : null;

  return (
    <svg 
      viewBox={`0 0 ${width} ${height}`}
      className="world-map"
      preserveAspectRatio="xMidYMid meet"
    >
      {/* Ocean background */}
      <rect 
        x="0" y="0" 
        width={width} height={height} 
        fill="var(--map-ocean, #1a2a3a)"
      />
      
      {/* Grid lines */}
      {/* Latitude lines */}
      {[-60, -30, 0, 30, 60].map(lat => {
        const y = ((90 - lat) / 180) * height;
        return (
          <line 
            key={`lat-${lat}`}
            x1="0" y1={y} x2={width} y2={y}
            stroke="var(--map-grid, #2a3a4a)"
            strokeWidth="0.5"
          />
        );
      })}
      
      {/* Longitude lines */}
      {[-120, -60, 0, 60, 120].map(lon => {
        const x = ((lon + 180) / 360) * width;
        return (
          <line 
            key={`lon-${lon}`}
            x1={x} y1="0" x2={x} y2={height}
            stroke="var(--map-grid, #2a3a4a)"
            strokeWidth="0.5"
          />
        );
      })}
      
      {/* Simplified land masses */}
      {/* North America */}
      <ellipse cx="80" cy="55" rx="35" ry="25" fill="var(--map-land, #2d4a2d)" opacity="0.8" />
      {/* South America */}
      <ellipse cx="100" cy="110" rx="18" ry="30" fill="var(--map-land, #2d4a2d)" opacity="0.8" />
      {/* Europe/Africa */}
      <ellipse cx="185" cy="70" rx="20" ry="40" fill="var(--map-land, #2d4a2d)" opacity="0.8" />
      {/* Asia */}
      <ellipse cx="260" cy="55" rx="50" ry="30" fill="var(--map-land, #2d4a2d)" opacity="0.8" />
      {/* Australia */}
      <ellipse cx="300" cy="120" rx="20" ry="15" fill="var(--map-land, #2d4a2d)" opacity="0.8" />
      
      {/* Ground track */}
      {trackPath && (
        <path 
          d={trackPath}
          fill="none"
          stroke="var(--track-color, #ff6b6b)"
          strokeWidth="1.5"
          strokeOpacity="0.6"
          strokeLinecap="round"
        />
      )}
      
      {/* ISS marker */}
      {issXY && (
        <g transform={`translate(${issXY.x}, ${issXY.y})`}>
          {/* Pulse ring */}
          <circle 
            r="8" 
            fill="none" 
            stroke="var(--iss-color, #ffd93d)"
            strokeWidth="2"
            opacity="0.5"
            className="iss-pulse"
          />
          {/* ISS dot */}
          <circle 
            r="4" 
            fill="var(--iss-color, #ffd93d)"
          />
        </g>
      )}
    </svg>
  );
}

// ============================================
// ASTRONAUT LIST COMPONENT
// ============================================

interface AstronautListProps {
  astronauts: Astronaut[];
  loading: boolean;
}

function AstronautList({ astronauts, loading }: AstronautListProps) {
  if (loading) {
    return <div className="astronaut-loading">Loading crew...</div>;
  }
  
  // Group by craft
  const byCraft: Record<string, Astronaut[]> = {};
  astronauts.forEach(a => {
    if (!byCraft[a.craft]) byCraft[a.craft] = [];
    byCraft[a.craft].push(a);
  });
  
  return (
    <div className="astronaut-list">
      <div className="astronaut-header">
        <span className="astronaut-count">{astronauts.length}</span>
        <span className="astronaut-label">humans in space</span>
      </div>
      
      {Object.entries(byCraft).map(([craft, crew]) => (
        <div key={craft} className="craft-group">
          <div className="craft-name">{craft}</div>
          <div className="crew-names">
            {crew.map(a => (
              <span key={a.name} className="crew-member">{a.name}</span>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

// ============================================
// MAIN WIDGET COMPONENT
// ============================================

export default function ISSTracker() {
  // ---- State ----
  const [issPosition, setIssPosition] = useState<ISSPosition | null>(null);
  const [groundTrack, setGroundTrack] = useState<ISSPosition[]>([]);
  const [astronauts, setAstronauts] = useState<Astronaut[]>([]);
  const [loading, setLoading] = useState(true);
  const [astronautsLoading, setAstronautsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
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
  
  // ---- Fetch ISS position ----
  const fetchISSPosition = useCallback(async () => {
    try {
      const response = await fetch('http://api.open-notify.org/iss-now.json');
      if (!response.ok) throw new Error('Failed to fetch ISS position');
      
      const data = await response.json();
      
      if (data.message === 'success') {
        const newPosition: ISSPosition = {
          latitude: parseFloat(data.iss_position.latitude),
          longitude: parseFloat(data.iss_position.longitude),
          timestamp: data.timestamp,
        };
        
        setIssPosition(newPosition);
        setLastUpdate(new Date());
        
        // Add to ground track (keep last 50 points)
        setGroundTrack(prev => {
          const updated = [...prev, newPosition];
          return updated.slice(-50);
        });
        
        setLoading(false);
        setError(null);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
      setLoading(false);
    }
  }, []);
  
  // ---- Fetch astronauts ----
  const fetchAstronauts = useCallback(async () => {
    try {
      const response = await fetch('http://api.open-notify.org/astros.json');
      if (!response.ok) throw new Error('Failed to fetch astronauts');
      
      const data = await response.json();
      
      if (data.message === 'success') {
        setAstronauts(data.people);
        setAstronautsLoading(false);
      }
    } catch (err) {
      console.error('Error fetching astronauts:', err);
      setAstronautsLoading(false);
    }
  }, []);
  
  // ---- Initial fetch and polling ----
  useEffect(() => {
    fetchISSPosition();
    fetchAstronauts();
    
    // Poll position every 5 seconds
    const positionInterval = setInterval(fetchISSPosition, 5000);
    
    // Refresh astronauts every 5 minutes
    const astronautInterval = setInterval(fetchAstronauts, 300000);
    
    return () => {
      clearInterval(positionInterval);
      clearInterval(astronautInterval);
    };
  }, [fetchISSPosition, fetchAstronauts]);
  
  // ---- Format coordinates ----
  const formatCoord = (value: number, isLat: boolean): string => {
    const abs = Math.abs(value);
    const dir = isLat 
      ? (value >= 0 ? 'N' : 'S')
      : (value >= 0 ? 'E' : 'W');
    return `${abs.toFixed(4)}° ${dir}`;
  };

  return (
    <div className={`iss-tracker-widget ${isPointerDevice ? 'pointer-device' : 'touch-device'}`}>
      
      {/* ---- Header ---- */}
      <div className="widget-header">
        <div className="header-left">
          <span className="widget-title">ISS Tracker</span>
          <span className="live-indicator">● LIVE</span>
        </div>
        {lastUpdate && (
          <span className="last-update">
            Updated {lastUpdate.toLocaleTimeString()}
          </span>
        )}
      </div>
      
      {/* ---- Error State ---- */}
      {error && (
        <div className="error-message">
          {error}
          <button onClick={fetchISSPosition} className="retry-btn">Retry</button>
        </div>
      )}
      
      {/* ---- Loading State ---- */}
      {loading && !error && (
        <div className="loading-state">
          Acquiring ISS position...
        </div>
      )}
      
      {/* ---- Main Display ---- */}
      {!loading && !error && issPosition && (
        <>
          {/* World Map */}
          <div className="map-container">
            <WorldMap 
              issPosition={issPosition}
              groundTrack={groundTrack}
            />
          </div>
          
          {/* Position Data */}
          <div className="position-data">
            <div className="coord-group">
              <div className="coord">
                <span className="coord-label">Latitude</span>
                <span className="coord-value">
                  {formatCoord(issPosition.latitude, true)}
                </span>
              </div>
              <div className="coord">
                <span className="coord-label">Longitude</span>
                <span className="coord-value">
                  {formatCoord(issPosition.longitude, false)}
                </span>
              </div>
            </div>
            
            <div className="orbital-data">
              <div className="orbital-item">
                <span className="orbital-label">Altitude</span>
                <span className="orbital-value">{ISS_ALTITUDE_KM} km</span>
              </div>
              <div className="orbital-item">
                <span className="orbital-label">Velocity</span>
                <span className="orbital-value">{ISS_VELOCITY_KMH.toLocaleString()} km/h</span>
              </div>
            </div>
          </div>
          
          {/* Astronaut List */}
          <AstronautList 
            astronauts={astronauts}
            loading={astronautsLoading}
          />
        </>
      )}
      
      {/* ---- Skeleton Styles ---- */}
      <style jsx>{`
        .iss-tracker-widget {
          --map-ocean: #1a2a3a;
          --map-land: #2d4a2d;
          --map-grid: #2a3a4a;
          --iss-color: #ffd93d;
          --track-color: #ff6b6b;
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
          font-family: var(--font-mono, monospace);
          font-size: 11px;
          color: var(--text-muted);
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
        
        .loading-state {
          text-align: center;
          padding: 40px 20px;
          color: var(--text-secondary);
          font-size: 14px;
        }
        
        .map-container {
          border-radius: 8px;
          overflow: hidden;
          margin-bottom: 16px;
        }
        
        :global(.world-map) {
          width: 100%;
          height: auto;
          display: block;
        }
        
        :global(.iss-pulse) {
          animation: pulse 2s ease-out infinite;
        }
        
        @keyframes pulse {
          0% { r: 4; opacity: 0.8; }
          100% { r: 12; opacity: 0; }
        }
        
        .position-data {
          margin-bottom: 16px;
        }
        
        .coord-group {
          display: flex;
          gap: 24px;
          margin-bottom: 12px;
          justify-content: center;
        }
        
        .coord {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 4px;
        }
        
        .coord-label {
          font-size: 11px;
          color: var(--text-muted);
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }
        
        .coord-value {
          font-family: var(--font-mono, monospace);
          font-size: 15px;
          font-weight: 500;
          color: var(--text-primary);
        }
        
        .orbital-data {
          display: flex;
          gap: 24px;
          justify-content: center;
          padding-top: 12px;
          border-top: 1px solid var(--widget-border);
        }
        
        .orbital-item {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 4px;
        }
        
        .orbital-label {
          font-size: 11px;
          color: var(--text-muted);
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }
        
        .orbital-value {
          font-family: var(--font-mono, monospace);
          font-size: 14px;
          color: var(--text-primary);
        }
        
        .astronaut-list {
          background: #f8f8f8;
          border-radius: 8px;
          padding: 12px;
        }
        
        .astronaut-header {
          display: flex;
          align-items: baseline;
          gap: 6px;
          margin-bottom: 12px;
        }
        
        .astronaut-count {
          font-family: var(--font-mono, monospace);
          font-size: 24px;
          font-weight: 600;
          color: var(--text-primary);
        }
        
        .astronaut-label {
          font-size: 14px;
          color: var(--text-secondary);
        }
        
        .astronaut-loading {
          text-align: center;
          padding: 20px;
          color: var(--text-muted);
          font-size: 13px;
        }
        
        .craft-group {
          margin-bottom: 8px;
        }
        
        .craft-group:last-child {
          margin-bottom: 0;
        }
        
        .craft-name {
          font-size: 11px;
          font-weight: 600;
          color: var(--text-muted);
          text-transform: uppercase;
          letter-spacing: 0.05em;
          margin-bottom: 4px;
        }
        
        .crew-names {
          display: flex;
          flex-wrap: wrap;
          gap: 4px 12px;
        }
        
        .crew-member {
          font-size: 13px;
          color: var(--text-primary);
        }
        
        /* Touch device adjustments */
        .touch-device .coord-group {
          flex-direction: column;
          gap: 12px;
        }
        
        .touch-device .coord-value {
          font-size: 18px;
        }
        
        .touch-device .orbital-data {
          flex-direction: column;
          gap: 12px;
        }
      `}</style>
    </div>
  );
}