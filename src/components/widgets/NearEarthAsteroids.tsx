'use client';

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { format, parse, addDays } from 'date-fns';

// ============================================
// NEAR-EARTH ASTEROIDS WIDGET - FUNCTIONAL SKELETON
// ============================================
// 
// Features:
// - Upcoming asteroid close approaches
// - Distance comparison (lunar distances)
// - Size estimates
// - Potentially hazardous indicator
// - Timeline of approaches
// - Responsive: pointer vs touch detection
//
// Data source: NASA JPL Small-Body Database
// - https://ssd-api.jpl.nasa.gov/cad.api
// - Reliable, well-documented
//
// Styling: Minimal/neutral - ready for design application
// ============================================

interface Asteroid {
  id: string;
  name: string;
  closeApproachDate: Date;
  distanceKm: number;
  distanceLunar: number;  // In lunar distances (1 LD ≈ 384,400 km)
  velocityKmS: number;
  diameterMin: number;    // meters
  diameterMax: number;    // meters
  isPotentiallyHazardous: boolean;
}

// Parse JPL date format: "2024-Dec-07 14:23"
function parseJPLDate(dateStr: string): Date {
  try {
    // Try parsing with date-fns
    return parse(dateStr, 'yyyy-MMM-dd HH:mm', new Date());
  } catch {
    // Fallback: manual parsing
    const months: Record<string, string> = {
      'Jan': '01', 'Feb': '02', 'Mar': '03', 'Apr': '04',
      'May': '05', 'Jun': '06', 'Jul': '07', 'Aug': '08',
      'Sep': '09', 'Oct': '10', 'Nov': '11', 'Dec': '12'
    };
    // "2024-Dec-07 14:23" -> "2024-12-07T14:23:00Z"
    const parts = dateStr.match(/(\d{4})-(\w{3})-(\d{2})\s+(\d{2}):(\d{2})/);
    if (parts) {
      const [, year, mon, day, hour, min] = parts;
      const month = months[mon] || '01';
      return new Date(`${year}-${month}-${day}T${hour}:${min}:00Z`);
    }
    return new Date(); // Fallback to now if parsing fails
  }
}

// Size comparisons for context
function getSizeComparison(diameterM: number): string {
  if (diameterM < 10) return 'car-sized';
  if (diameterM < 25) return 'bus-sized';
  if (diameterM < 50) return 'house-sized';
  if (diameterM < 100) return 'airplane-sized';
  if (diameterM < 200) return 'football field';
  if (diameterM < 500) return 'stadium-sized';
  if (diameterM < 1000) return 'small mountain';
  return 'mountain-sized';
}

// Distance danger color
function getDistanceColor(lunarDistance: number): string {
  if (lunarDistance < 1) return '#ef4444';   // Closer than moon - red
  if (lunarDistance < 5) return '#f59e0b';   // Close - amber
  if (lunarDistance < 10) return '#84cc16';  // Moderate - lime
  return '#22c55e';                           // Safe - green
}

// ============================================
// ASTEROID CARD COMPONENT
// ============================================

interface AsteroidCardProps {
  asteroid: Asteroid;
  isNext: boolean;
}

function AsteroidCard({ asteroid, isNext }: AsteroidCardProps) {
  const avgDiameter = (asteroid.diameterMin + asteroid.diameterMax) / 2;
  const sizeDesc = getSizeComparison(avgDiameter);
  const distanceColor = getDistanceColor(asteroid.distanceLunar);
  
  return (
    <div className={`asteroid-card ${isNext ? 'next' : ''} ${asteroid.isPotentiallyHazardous ? 'hazardous' : ''}`}>
      {isNext && <span className="next-badge">NEXT</span>}
      {asteroid.isPotentiallyHazardous && <span className="hazard-badge">⚠️ PHA</span>}
      
      <div className="asteroid-name">{asteroid.name}</div>
      
      <div className="asteroid-date">
        {format(asteroid.closeApproachDate, 'MMM d, yyyy • HH:mm')} UTC
      </div>
      
      <div className="asteroid-stats">
        <div className="stat">
          <span className="stat-value" style={{ color: distanceColor }}>
            {asteroid.distanceLunar.toFixed(2)}
          </span>
          <span className="stat-unit">lunar distances</span>
          <span className="stat-detail">{(asteroid.distanceKm / 1000000).toFixed(2)}M km</span>
        </div>
        
        <div className="stat">
          <span className="stat-value">{avgDiameter.toFixed(0)}</span>
          <span className="stat-unit">meters</span>
          <span className="stat-detail">{sizeDesc}</span>
        </div>
        
        <div className="stat">
          <span className="stat-value">{asteroid.velocityKmS.toFixed(1)}</span>
          <span className="stat-unit">km/s</span>
          <span className="stat-detail">{(asteroid.velocityKmS * 3600).toFixed(0)} km/h</span>
        </div>
      </div>
    </div>
  );
}

// ============================================
// DISTANCE SCALE COMPONENT
// ============================================

interface DistanceScaleProps {
  asteroids: Asteroid[];
}

function DistanceScale({ asteroids }: DistanceScaleProps) {
  const maxLD = 20; // Show up to 20 lunar distances
  
  return (
    <div className="distance-scale">
      <div className="scale-header">Distance from Earth</div>
      <div className="scale-track">
        {/* Moon marker */}
        <div className="scale-marker moon" style={{ left: `${(1 / maxLD) * 100}%` }}>
          <span className="marker-icon">🌙</span>
          <span className="marker-label">Moon</span>
        </div>
        
        {/* Asteroid markers */}
        {asteroids.slice(0, 5).map((ast, i) => {
          const pos = Math.min((ast.distanceLunar / maxLD) * 100, 100);
          return (
            <div 
              key={ast.id}
              className="scale-marker asteroid"
              style={{ left: `${pos}%` }}
              title={`${ast.name}: ${ast.distanceLunar.toFixed(1)} LD`}
            >
              <span className="marker-dot" style={{ backgroundColor: getDistanceColor(ast.distanceLunar) }} />
            </div>
          );
        })}
        
        {/* Scale line */}
        <div className="scale-line" />
      </div>
      <div className="scale-labels">
        <span>0</span>
        <span>5 LD</span>
        <span>10 LD</span>
        <span>15 LD</span>
        <span>20 LD</span>
      </div>
    </div>
  );
}

// ============================================
// MAIN WIDGET COMPONENT
// ============================================

type TimeRange = 'week' | 'month' | '3months';

export default function NearEarthAsteroids() {
  // ---- State ----
  const [asteroids, setAsteroids] = useState<Asteroid[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [timeRange, setTimeRange] = useState<TimeRange>('month');
  const [showHazardousOnly, setShowHazardousOnly] = useState(false);
  const [isPointerDevice, setIsPointerDevice] = useState(true);
  
  // ---- Input method detection ----
  useEffect(() => {
    const mediaQuery = window.matchMedia('(pointer: fine)');
    setIsPointerDevice(mediaQuery.matches);
    
    const handler = (e: MediaQueryListEvent) => setIsPointerDevice(e.matches);
    mediaQuery.addEventListener('change', handler);
    return () => mediaQuery.removeEventListener('change', handler);
  }, []);
  
  // ---- Calculate date range ----
  const dateRange = useMemo(() => {
    const now = new Date();
    const days = timeRange === 'week' ? 7 : timeRange === 'month' ? 30 : 90;
    return {
      start: format(now, 'yyyy-MM-dd'),
      end: format(addDays(now, days), 'yyyy-MM-dd'),
    };
  }, [timeRange]);
  
  // ---- Fetch data ----
  const fetchAsteroids = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      // JPL CAD (Close Approach Data) API
      const url = new URL('https://ssd-api.jpl.nasa.gov/cad.api');
      url.searchParams.set('date-min', dateRange.start);
      url.searchParams.set('date-max', dateRange.end);
      url.searchParams.set('dist-max', '0.05');  // 0.05 AU ≈ 20 lunar distances
      url.searchParams.set('sort', 'date');
      
      const response = await fetch(url.toString());
      if (!response.ok) throw new Error('Failed to fetch asteroid data');
      
      const data = await response.json();
      
      if (!data.data) {
        setAsteroids([]);
        setLoading(false);
        return;
      }
      
      // Parse response
      // Fields: des, orbit_id, jd, cd, dist, dist_min, dist_max, v_rel, v_inf, t_sigma_f, h
      const parsed: Asteroid[] = data.data.map((row: string[]) => {
        const distanceAU = parseFloat(row[4]);
        const distanceKm = distanceAU * 149597870.7;  // AU to km
        const distanceLunar = distanceKm / 384400;
        
        // Estimate diameter from absolute magnitude (H)
        // Using simplified formula: D = 1329 / sqrt(albedo) * 10^(-H/5)
        // Assuming albedo of 0.14 (typical for asteroids)
        const H = parseFloat(row[10]) || 25;
        const diameter = 1329 / Math.sqrt(0.14) * Math.pow(10, -H / 5) * 1000;  // meters
        
        return {
          id: row[0],
          name: row[0],
          closeApproachDate: parseJPLDate(row[3]),
          distanceKm,
          distanceLunar,
          velocityKmS: parseFloat(row[7]),
          diameterMin: diameter * 0.5,
          diameterMax: diameter * 2,
          // PHA criteria: H < 22 and MOID < 0.05 AU
          isPotentiallyHazardous: H < 22 && distanceAU < 0.05,
        };
      });
      
      setAsteroids(parsed);
      setLoading(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
      setLoading(false);
    }
  }, [dateRange]);
  
  // ---- Fetch on mount and range change ----
  useEffect(() => {
    fetchAsteroids();
  }, [fetchAsteroids]);
  
  // ---- Filter asteroids ----
  const filteredAsteroids = useMemo(() => {
    let filtered = asteroids;
    if (showHazardousOnly) {
      filtered = filtered.filter(a => a.isPotentiallyHazardous);
    }
    return filtered;
  }, [asteroids, showHazardousOnly]);
  
  // ---- Stats ----
  const stats = useMemo(() => {
    if (asteroids.length === 0) return null;
    
    const closest = asteroids.reduce((min, a) => a.distanceLunar < min.distanceLunar ? a : min);
    const hazardous = asteroids.filter(a => a.isPotentiallyHazardous).length;
    
    return {
      total: asteroids.length,
      closest,
      hazardous,
    };
  }, [asteroids]);

  return (
    <div className={`asteroids-widget ${isPointerDevice ? 'pointer-device' : 'touch-device'}`}>
      
      {/* ---- Header ---- */}
      <div className="widget-header">
        <span className="widget-title">Near-Earth Asteroids</span>
        <span className="widget-subtitle">Close Approaches</span>
      </div>
      
      {/* ---- Filters ---- */}
      <div className="filters">
        <div className="time-filter">
          {(['week', 'month', '3months'] as TimeRange[]).map(range => (
            <button
              key={range}
              className={`filter-btn ${timeRange === range ? 'active' : ''}`}
              onClick={() => setTimeRange(range)}
            >
              {range === 'week' ? '7 days' : range === 'month' ? '30 days' : '90 days'}
            </button>
          ))}
        </div>
        
        <label className="hazard-filter">
          <input
            type="checkbox"
            checked={showHazardousOnly}
            onChange={(e) => setShowHazardousOnly(e.target.checked)}
          />
          <span>PHA only</span>
        </label>
      </div>
      
      {/* ---- Loading State ---- */}
      {loading && (
        <div className="loading-state">
          Scanning near-Earth space...
        </div>
      )}
      
      {/* ---- Error State ---- */}
      {error && (
        <div className="error-message">
          {error}
          <button onClick={fetchAsteroids} className="retry-btn">Retry</button>
        </div>
      )}
      
      {/* ---- Main Display ---- */}
      {!loading && !error && (
        <>
          {/* Stats */}
          {stats && (
            <div className="stats-bar">
              <div className="stat">
                <span className="stat-value">{stats.total}</span>
                <span className="stat-label">approaches</span>
              </div>
              <div className="stat">
                <span className="stat-value">{stats.closest.distanceLunar.toFixed(1)}</span>
                <span className="stat-label">closest (LD)</span>
              </div>
              <div className="stat">
                <span className="stat-value">{stats.hazardous}</span>
                <span className="stat-label">hazardous</span>
              </div>
            </div>
          )}
          
          {/* Distance scale */}
          {filteredAsteroids.length > 0 && (
            <DistanceScale asteroids={filteredAsteroids} />
          )}
          
          {/* Asteroid list */}
          <div className="asteroid-list">
            {filteredAsteroids.length > 0 ? (
              filteredAsteroids.slice(0, 5).map((asteroid, i) => (
                <AsteroidCard 
                  key={asteroid.id}
                  asteroid={asteroid}
                  isNext={i === 0}
                />
              ))
            ) : (
              <div className="no-asteroids">
                No close approaches in selected period
              </div>
            )}
          </div>
          
          {filteredAsteroids.length > 5 && (
            <div className="more-count">
              +{filteredAsteroids.length - 5} more approaches
            </div>
          )}
        </>
      )}
      
      {/* ---- Context ---- */}
      <div className="context-note">
        1 LD (Lunar Distance) = 384,400 km — the distance from Earth to the Moon
      </div>
      
      {/* ---- Data source ---- */}
      <div className="data-source">
        Data: NASA JPL Center for Near-Earth Object Studies
      </div>
      
      {/* ---- Skeleton Styles ---- */}
      <style jsx>{`
        .asteroids-widget {
          --widget-bg: #ffffff;
          --widget-border: #e0e0e0;
          --text-primary: #000000;
          --text-secondary: #666666;
          --text-muted: #999999;
          
          background: var(--widget-bg);
          border: 1px solid var(--widget-border);
          border-radius: 12px;
          padding: 16px;
          font-family: var(--font-sans, system-ui, sans-serif);
        }
        
        .widget-header {
          margin-bottom: 12px;
        }
        
        .widget-title {
          font-size: 14px;
          font-weight: 500;
          color: var(--text-primary);
          display: block;
        }
        
        .widget-subtitle {
          font-size: 11px;
          color: var(--text-muted);
        }
        
        .filters {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 12px;
          flex-wrap: wrap;
          gap: 8px;
        }
        
        .time-filter {
          display: flex;
          gap: 4px;
        }
        
        .filter-btn {
          padding: 4px 10px;
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
        
        .hazard-filter {
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 11px;
          color: var(--text-secondary);
          cursor: pointer;
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
          cursor: pointer;
        }
        
        .stats-bar {
          display: flex;
          justify-content: space-around;
          padding: 8px 0;
          margin-bottom: 12px;
          border-bottom: 1px solid var(--widget-border);
        }
        
        .stats-bar .stat {
          display: flex;
          flex-direction: column;
          align-items: center;
        }
        
        .stats-bar .stat-value {
          font-family: var(--font-mono, monospace);
          font-size: 20px;
          font-weight: 600;
          color: var(--text-primary);
        }
        
        .stats-bar .stat-label {
          font-size: 10px;
          color: var(--text-muted);
        }
        
        .distance-scale {
          margin-bottom: 16px;
          padding: 12px;
          background: #f8f8f8;
          border-radius: 8px;
        }
        
        .scale-header {
          font-size: 11px;
          color: var(--text-muted);
          margin-bottom: 12px;
        }
        
        .scale-track {
          position: relative;
          height: 40px;
        }
        
        .scale-line {
          position: absolute;
          bottom: 16px;
          left: 0;
          right: 0;
          height: 2px;
          background: var(--widget-border);
        }
        
        .scale-marker {
          position: absolute;
          transform: translateX(-50%);
          display: flex;
          flex-direction: column;
          align-items: center;
        }
        
        .scale-marker.moon {
          bottom: 12px;
        }
        
        .marker-icon {
          font-size: 16px;
        }
        
        .marker-label {
          font-size: 9px;
          color: var(--text-muted);
        }
        
        .scale-marker.asteroid {
          bottom: 14px;
        }
        
        .marker-dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
        }
        
        .scale-labels {
          display: flex;
          justify-content: space-between;
          font-family: var(--font-mono, monospace);
          font-size: 9px;
          color: var(--text-muted);
        }
        
        .asteroid-list {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }
        
        .asteroid-card {
          position: relative;
          padding: 12px;
          background: #fafafa;
          border-radius: 8px;
          border: 1px solid transparent;
        }
        
        .asteroid-card.next {
          background: #f0f9ff;
          border-color: #bae6fd;
        }
        
        .asteroid-card.hazardous {
          border-color: #fecaca;
        }
        
        .next-badge {
          position: absolute;
          top: 8px;
          right: 8px;
          padding: 2px 6px;
          background: #0ea5e9;
          color: white;
          font-size: 9px;
          font-weight: 600;
          border-radius: 4px;
        }
        
        .hazard-badge {
          position: absolute;
          top: 8px;
          right: 48px;
          font-size: 12px;
        }
        
        .asteroid-name {
          font-family: var(--font-mono, monospace);
          font-size: 13px;
          font-weight: 500;
          color: var(--text-primary);
          margin-bottom: 4px;
        }
        
        .asteroid-date {
          font-size: 11px;
          color: var(--text-secondary);
          margin-bottom: 8px;
        }
        
        .asteroid-stats {
          display: flex;
          gap: 16px;
        }
        
        .asteroid-stats .stat {
          display: flex;
          flex-direction: column;
        }
        
        .asteroid-stats .stat-value {
          font-family: var(--font-mono, monospace);
          font-size: 16px;
          font-weight: 600;
        }
        
        .asteroid-stats .stat-unit {
          font-size: 10px;
          color: var(--text-muted);
        }
        
        .asteroid-stats .stat-detail {
          font-size: 10px;
          color: var(--text-secondary);
        }
        
        .no-asteroids {
          text-align: center;
          padding: 24px;
          color: var(--text-muted);
        }
        
        .more-count {
          text-align: center;
          font-size: 12px;
          color: var(--text-muted);
          margin-top: 8px;
        }
        
        .context-note {
          font-size: 11px;
          color: var(--text-muted);
          text-align: center;
          margin: 12px 0;
          padding: 8px;
          background: #fafafa;
          border-radius: 6px;
        }
        
        .data-source {
          text-align: center;
          font-size: 10px;
          color: var(--text-muted);
        }
        
        /* Touch adjustments */
        .touch-device .filter-btn {
          padding: 8px 14px;
          font-size: 13px;
        }
        
        .touch-device .asteroid-card {
          padding: 16px;
        }
      `}</style>
    </div>
  );
}