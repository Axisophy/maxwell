'use client';

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { format, addHours, startOfDay, differenceInMinutes } from 'date-fns';

// ============================================
// UK TIDES WIDGET - FUNCTIONAL SKELETON
// ============================================
// 
// Features:
// - Tide times for UK coastal locations
// - High/low tide predictions
// - Tide height visualization
// - Current tide state (rising/falling)
// - 24-hour tide curve
// - Responsive: pointer vs touch detection
//
// Data: Using simplified harmonic calculation
// For production: WorldTides API or UKHO Admiralty data
//
// Styling: Minimal/neutral - ready for design application
// ============================================

interface TideEvent {
  type: 'high' | 'low';
  time: Date;
  height: number;  // meters
}

interface TidePoint {
  time: Date;
  height: number;
}

// UK coastal locations with approximate tidal constants
// In production, these would come from a proper tidal database
const UK_LOCATIONS = [
  { name: 'London Bridge', lat: 51.5074, lon: -0.0877, meanRange: 6.6, offset: 0 },
  { name: 'Dover', lat: 51.1279, lon: 1.3134, meanRange: 5.9, offset: 15 },
  { name: 'Brighton', lat: 50.8225, lon: -0.1372, meanRange: 5.2, offset: -45 },
  { name: 'Southampton', lat: 50.9097, lon: -1.4044, meanRange: 4.0, offset: 30 },
  { name: 'Liverpool', lat: 53.4084, lon: -2.9916, meanRange: 8.4, offset: -120 },
  { name: 'Bristol', lat: 51.4545, lon: -2.5879, meanRange: 12.2, offset: -180 },
  { name: 'Edinburgh (Leith)', lat: 55.9533, lon: -3.1883, meanRange: 4.8, offset: 60 },
  { name: 'St Leonards', lat: 50.8571, lon: 0.5456, meanRange: 6.0, offset: -30 },
];

// Simplified tide calculation using lunar period
// Real tides use complex harmonic constituents
function calculateTides(location: typeof UK_LOCATIONS[0], date: Date): {
  events: TideEvent[];
  curve: TidePoint[];
} {
  const lunarPeriod = 12.42; // hours between high tides
  const dayStart = startOfDay(date);
  
  // Reference point: approximate high water at London Bridge
  const referenceHigh = new Date('2024-01-01T00:24:00Z');
  const hoursSinceReference = (date.getTime() - referenceHigh.getTime()) / (1000 * 60 * 60);
  
  // Calculate phase (0-1 where 0.5 is low tide)
  const phase = (hoursSinceReference / lunarPeriod) % 1;
  
  // Find today's tide events
  const events: TideEvent[] = [];
  const halfRange = location.meanRange / 2;
  const meanLevel = 3.5; // Approximate mean sea level
  
  // Generate events for the day
  for (let i = -1; i < 4; i++) {
    // High tide
    const highTime = addHours(referenceHigh, Math.floor(hoursSinceReference / lunarPeriod + i) * lunarPeriod + (location.offset / 60));
    if (highTime >= dayStart && highTime < addHours(dayStart, 24)) {
      events.push({
        type: 'high',
        time: highTime,
        height: meanLevel + halfRange,
      });
    }
    
    // Low tide (6.21 hours after high)
    const lowTime = addHours(highTime, lunarPeriod / 2);
    if (lowTime >= dayStart && lowTime < addHours(dayStart, 24)) {
      events.push({
        type: 'low',
        time: lowTime,
        height: meanLevel - halfRange,
      });
    }
  }
  
  // Sort by time
  events.sort((a, b) => a.time.getTime() - b.time.getTime());
  
  // Generate smooth curve (every 15 minutes)
  const curve: TidePoint[] = [];
  for (let h = 0; h < 24; h += 0.25) {
    const time = addHours(dayStart, h);
    const hoursSinceRef = (time.getTime() - referenceHigh.getTime()) / (1000 * 60 * 60) + (location.offset / 60);
    const tidePhase = (hoursSinceRef / lunarPeriod) % 1;
    const height = meanLevel + halfRange * Math.cos(tidePhase * 2 * Math.PI);
    curve.push({ time, height });
  }
  
  return { events, curve };
}

// ============================================
// TIDE CURVE COMPONENT
// ============================================

interface TideCurveProps {
  curve: TidePoint[];
  events: TideEvent[];
  now: Date;
  meanRange: number;
}

function TideCurve({ curve, events, now, meanRange }: TideCurveProps) {
  const width = 320;
  const height = 100;
  const padding = { top: 10, right: 10, bottom: 20, left: 30 };
  
  const innerWidth = width - padding.left - padding.right;
  const innerHeight = height - padding.top - padding.bottom;
  
  // Scale functions
  const dayStart = startOfDay(now);
  const xScale = (time: Date) => {
    const minutes = differenceInMinutes(time, dayStart);
    return padding.left + (minutes / (24 * 60)) * innerWidth;
  };
  
  const minHeight = Math.min(...curve.map(p => p.height));
  const maxHeight = Math.max(...curve.map(p => p.height));
  const yScale = (h: number) => {
    return padding.top + innerHeight - ((h - minHeight) / (maxHeight - minHeight)) * innerHeight;
  };
  
  // Generate path
  const pathD = curve.map((p, i) => {
    const x = xScale(p.time);
    const y = yScale(p.height);
    return `${i === 0 ? 'M' : 'L'} ${x} ${y}`;
  }).join(' ');
  
  // Current time position
  const nowX = xScale(now);
  const currentHeight = curve.reduce((closest, p) => {
    return Math.abs(p.time.getTime() - now.getTime()) < Math.abs(closest.time.getTime() - now.getTime()) ? p : closest;
  }).height;
  const nowY = yScale(currentHeight);
  
  return (
    <svg viewBox={`0 0 ${width} ${height}`} className="tide-curve">
      {/* Grid lines */}
      {[0, 6, 12, 18].map(h => (
        <line
          key={h}
          x1={xScale(addHours(dayStart, h))}
          y1={padding.top}
          x2={xScale(addHours(dayStart, h))}
          y2={height - padding.bottom}
          stroke="#e5e5e5"
          strokeDasharray="2,2"
        />
      ))}
      
      {/* Mean level line */}
      <line
        x1={padding.left}
        y1={yScale((minHeight + maxHeight) / 2)}
        x2={width - padding.right}
        y2={yScale((minHeight + maxHeight) / 2)}
        stroke="#e5e5e5"
        strokeDasharray="4,4"
      />
      
      {/* Tide curve */}
      <path
        d={pathD}
        fill="none"
        stroke="var(--tide-color, #0ea5e9)"
        strokeWidth="2"
      />
      
      {/* High/low markers */}
      {events.map((e, i) => (
        <g key={i}>
          <circle
            cx={xScale(e.time)}
            cy={yScale(e.height)}
            r="4"
            fill={e.type === 'high' ? '#0ea5e9' : '#64748b'}
          />
        </g>
      ))}
      
      {/* Current time marker */}
      <line
        x1={nowX}
        y1={padding.top}
        x2={nowX}
        y2={height - padding.bottom}
        stroke="#ef4444"
        strokeWidth="1"
      />
      <circle
        cx={nowX}
        cy={nowY}
        r="5"
        fill="#ef4444"
      />
      
      {/* X axis labels */}
      {[0, 6, 12, 18, 24].map(h => (
        <text
          key={h}
          x={xScale(addHours(dayStart, h))}
          y={height - 4}
          textAnchor="middle"
          fontSize="9"
          fill="#999"
        >
          {h === 24 ? '00' : String(h).padStart(2, '0')}
        </text>
      ))}
      
      {/* Y axis labels */}
      <text x={4} y={padding.top + 4} fontSize="9" fill="#999">{maxHeight.toFixed(1)}m</text>
      <text x={4} y={height - padding.bottom} fontSize="9" fill="#999">{minHeight.toFixed(1)}m</text>
    </svg>
  );
}

// ============================================
// MAIN WIDGET COMPONENT
// ============================================

export default function UKTides() {
  // ---- State ----
  const [selectedLocation, setSelectedLocation] = useState(UK_LOCATIONS[7]); // St Leonards default
  const [now, setNow] = useState(new Date());
  const [isPointerDevice, setIsPointerDevice] = useState(true);
  
  // ---- Input method detection ----
  useEffect(() => {
    const mediaQuery = window.matchMedia('(pointer: fine)');
    setIsPointerDevice(mediaQuery.matches);
    
    const handler = (e: MediaQueryListEvent) => setIsPointerDevice(e.matches);
    mediaQuery.addEventListener('change', handler);
    return () => mediaQuery.removeEventListener('change', handler);
  }, []);
  
  // ---- Update time ----
  useEffect(() => {
    const interval = setInterval(() => setNow(new Date()), 60000);
    return () => clearInterval(interval);
  }, []);
  
  // ---- Calculate tides ----
  const tideData = useMemo(() => {
    return calculateTides(selectedLocation, now);
  }, [selectedLocation, now]);
  
  // ---- Find next event ----
  const nextEvent = useMemo(() => {
    return tideData.events.find(e => e.time > now) || tideData.events[0];
  }, [tideData.events, now]);
  
  // ---- Calculate current state ----
  const currentState = useMemo(() => {
    const currentHeight = tideData.curve.reduce((closest, p) => {
      return Math.abs(p.time.getTime() - now.getTime()) < Math.abs(closest.time.getTime() - now.getTime()) ? p : closest;
    });
    
    // Check if rising or falling by comparing to point 30 min ago
    const prev = tideData.curve.reduce((closest, p) => {
      const target = new Date(now.getTime() - 30 * 60 * 1000);
      return Math.abs(p.time.getTime() - target.getTime()) < Math.abs(closest.time.getTime() - target.getTime()) ? p : closest;
    });
    
    const isRising = currentHeight.height > prev.height;
    
    return {
      height: currentHeight.height,
      isRising,
    };
  }, [tideData.curve, now]);
  
  // ---- Time until next event ----
  const timeUntilNext = useMemo(() => {
    if (!nextEvent) return '';
    const minutes = differenceInMinutes(nextEvent.time, now);
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
  }, [nextEvent, now]);

  return (
    <div className={`tides-widget ${isPointerDevice ? 'pointer-device' : 'touch-device'}`}>
      
      {/* ---- Header ---- */}
      <div className="widget-header">
        <span className="widget-title">UK Tides</span>
        <span className="widget-date">{format(now, 'MMM d')}</span>
      </div>
      
      {/* ---- Location selector ---- */}
      <div className="location-selector">
        <select
          value={selectedLocation.name}
          onChange={(e) => {
            const loc = UK_LOCATIONS.find(l => l.name === e.target.value);
            if (loc) setSelectedLocation(loc);
          }}
          className="location-select"
        >
          {UK_LOCATIONS.map(loc => (
            <option key={loc.name} value={loc.name}>{loc.name}</option>
          ))}
        </select>
      </div>
      
      {/* ---- Current state ---- */}
      <div className="current-state">
        <div className="state-indicator">
          <span className={`tide-arrow ${currentState.isRising ? 'rising' : 'falling'}`}>
            {currentState.isRising ? '↑' : '↓'}
          </span>
          <span className="state-label">
            {currentState.isRising ? 'Rising' : 'Falling'}
          </span>
        </div>
        
        <div className="current-height">
          <span className="height-value">{currentState.height.toFixed(1)}</span>
          <span className="height-unit">m</span>
        </div>
        
        <div className="next-event">
          <span className="next-label">
            {nextEvent?.type === 'high' ? 'High' : 'Low'} tide
          </span>
          <span className="next-time">in {timeUntilNext}</span>
        </div>
      </div>
      
      {/* ---- Tide curve ---- */}
      <div className="curve-container">
        <TideCurve
          curve={tideData.curve}
          events={tideData.events}
          now={now}
          meanRange={selectedLocation.meanRange}
        />
      </div>
      
      {/* ---- Today's tides ---- */}
      <div className="tide-events">
        {tideData.events.map((event, i) => {
          const isPast = event.time < now;
          const isNext = event === nextEvent;
          
          return (
            <div key={i} className={`tide-event ${isPast ? 'past' : ''} ${isNext ? 'next' : ''}`}>
              <span className={`event-type ${event.type}`}>
                {event.type === 'high' ? '▲' : '▼'}
              </span>
              <span className="event-time">{format(event.time, 'HH:mm')}</span>
              <span className="event-height">{event.height.toFixed(1)}m</span>
            </div>
          );
        })}
      </div>
      
      {/* ---- Range info ---- */}
      <div className="range-info">
        Mean tidal range: {selectedLocation.meanRange.toFixed(1)}m
      </div>
      
      {/* ---- Disclaimer ---- */}
      <div className="disclaimer">
        Approximate predictions only. Check official sources for navigation.
      </div>
      
      {/* ---- Skeleton Styles ---- */}
      <style jsx>{`
        .tides-widget {
          --tide-color: #0ea5e9;
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
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 12px;
        }
        
        .widget-title {
          font-size: 14px;
          font-weight: 500;
          color: var(--text-primary);
        }
        
        .widget-date {
          font-family: var(--font-mono, monospace);
          font-size: 12px;
          color: var(--text-secondary);
        }
        
        .location-selector {
          margin-bottom: 12px;
        }
        
        .location-select {
          width: 100%;
          padding: 8px 12px;
          border: 1px solid var(--widget-border);
          border-radius: 6px;
          background: var(--widget-bg);
          font-size: 14px;
          color: var(--text-primary);
          cursor: pointer;
        }
        
        .current-state {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 12px;
          background: #f8f8f8;
          border-radius: 8px;
          margin-bottom: 12px;
        }
        
        .state-indicator {
          display: flex;
          align-items: center;
          gap: 6px;
        }
        
        .tide-arrow {
          font-size: 24px;
          font-weight: bold;
        }
        
        .tide-arrow.rising {
          color: var(--tide-color);
        }
        
        .tide-arrow.falling {
          color: #64748b;
        }
        
        .state-label {
          font-size: 13px;
          color: var(--text-secondary);
        }
        
        .current-height {
          text-align: center;
        }
        
        .height-value {
          font-family: var(--font-mono, monospace);
          font-size: 28px;
          font-weight: 700;
          color: var(--text-primary);
        }
        
        .height-unit {
          font-size: 14px;
          color: var(--text-muted);
          margin-left: 2px;
        }
        
        .next-event {
          text-align: right;
        }
        
        .next-label {
          display: block;
          font-size: 12px;
          color: var(--text-muted);
        }
        
        .next-time {
          font-family: var(--font-mono, monospace);
          font-size: 14px;
          font-weight: 500;
          color: var(--text-primary);
        }
        
        .curve-container {
          margin-bottom: 12px;
        }
        
        :global(.tide-curve) {
          width: 100%;
          height: auto;
          display: block;
        }
        
        .tide-events {
          display: flex;
          justify-content: space-around;
          margin-bottom: 12px;
          padding: 8px 0;
          border-top: 1px solid var(--widget-border);
          border-bottom: 1px solid var(--widget-border);
        }
        
        .tide-event {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 2px;
          opacity: 1;
          transition: opacity 0.2s;
        }
        
        .tide-event.past {
          opacity: 0.4;
        }
        
        .tide-event.next {
          font-weight: 500;
        }
        
        .event-type {
          font-size: 12px;
        }
        
        .event-type.high {
          color: var(--tide-color);
        }
        
        .event-type.low {
          color: #64748b;
        }
        
        .event-time {
          font-family: var(--font-mono, monospace);
          font-size: 14px;
          color: var(--text-primary);
        }
        
        .event-height {
          font-family: var(--font-mono, monospace);
          font-size: 11px;
          color: var(--text-muted);
        }
        
        .range-info {
          text-align: center;
          font-size: 11px;
          color: var(--text-muted);
          margin-bottom: 8px;
        }
        
        .disclaimer {
          text-align: center;
          font-size: 10px;
          color: var(--text-muted);
          font-style: italic;
        }
        
        /* Touch adjustments */
        .touch-device .location-select {
          padding: 12px 16px;
          font-size: 16px;
        }
        
        .touch-device .height-value {
          font-size: 36px;
        }
      `}</style>
    </div>
  );
}