'use client';

import React, { useState, useEffect, useRef, useMemo } from 'react';

// ============================================
// LIGHT TRAVEL WIDGET - FUNCTIONAL SKELETON
// ============================================
// 
// Features:
// - Real-time distance light has traveled
// - Multiple unit comparisons (Earth orbits, AU, etc.)
// - Landmark distances (to Moon, Sun, stars)
// - Session duration tracking
// - Visual distance bar
// - Responsive: pointer vs touch detection
//
// Physics: Speed of light = 299,792,458 m/s (exact)
//
// Styling: Minimal/neutral - ready for design application
// ============================================

// Physical constants
const SPEED_OF_LIGHT = 299_792_458; // meters per second (exact)

// Distance references
const DISTANCES = {
  earthCircumference: 40_075_000, // meters
  toMoon: 384_400_000, // meters (average)
  toSun: 149_597_870_700, // meters (1 AU)
  toMars: 225_000_000_000, // meters (average)
  toJupiter: 778_500_000_000, // meters (average)
  toPluto: 5_906_380_000_000, // meters (average)
  toProximaCentauri: 4.246 * 9.461e15, // meters (~4.246 light years)
  lightYear: 9.461e15, // meters
};

// Time for light to reach various distances
const LIGHT_TIMES = {
  toMoon: DISTANCES.toMoon / SPEED_OF_LIGHT, // ~1.28 seconds
  toSun: DISTANCES.toSun / SPEED_OF_LIGHT, // ~8.3 minutes (499 seconds)
  toMars: DISTANCES.toMars / SPEED_OF_LIGHT, // ~12.5 minutes
  toJupiter: DISTANCES.toJupiter / SPEED_OF_LIGHT, // ~43 minutes
  toPluto: DISTANCES.toPluto / SPEED_OF_LIGHT, // ~5.5 hours
};

// Format large numbers
function formatDistance(meters: number): { value: string; unit: string } {
  if (meters < 1000) {
    return { value: meters.toFixed(0), unit: 'm' };
  }
  if (meters < 1_000_000) {
    return { value: (meters / 1000).toFixed(2), unit: 'km' };
  }
  if (meters < 1_000_000_000) {
    return { value: (meters / 1_000_000).toFixed(2), unit: 'thousand km' };
  }
  if (meters < 1_000_000_000_000) {
    return { value: (meters / 1_000_000_000).toFixed(3), unit: 'million km' };
  }
  return { value: (meters / 1_000_000_000_000).toFixed(4), unit: 'billion km' };
}

// Format time duration
function formatDuration(seconds: number): string {
  if (seconds < 60) return `${seconds.toFixed(1)}s`;
  if (seconds < 3600) {
    const mins = Math.floor(seconds / 60);
    const secs = (seconds % 60).toFixed(0);
    return `${mins}m ${secs}s`;
  }
  const hours = Math.floor(seconds / 3600);
  const mins = Math.floor((seconds % 3600) / 60);
  return `${hours}h ${mins}m`;
}

// ============================================
// MILESTONE TRACKER COMPONENT
// ============================================

interface MilestoneTrackerProps {
  distanceTraveled: number;
  elapsedSeconds: number;
}

function MilestoneTracker({ distanceTraveled, elapsedSeconds }: MilestoneTrackerProps) {
  const milestones = [
    { name: 'Moon', distance: DISTANCES.toMoon, icon: '🌙', time: LIGHT_TIMES.toMoon },
    { name: 'Sun', distance: DISTANCES.toSun, icon: '☀️', time: LIGHT_TIMES.toSun },
    { name: 'Mars', distance: DISTANCES.toMars, icon: '🔴', time: LIGHT_TIMES.toMars },
    { name: 'Jupiter', distance: DISTANCES.toJupiter, icon: '🪐', time: LIGHT_TIMES.toJupiter },
    { name: 'Pluto', distance: DISTANCES.toPluto, icon: '⚫', time: LIGHT_TIMES.toPluto },
  ];
  
  return (
    <div className="milestone-tracker">
      {milestones.map((m, i) => {
        const reached = distanceTraveled >= m.distance;
        const progress = Math.min(100, (distanceTraveled / m.distance) * 100);
        const timeRemaining = Math.max(0, m.time - elapsedSeconds);
        
        return (
          <div key={m.name} className={`milestone ${reached ? 'reached' : ''}`}>
            <span className="milestone-icon">{m.icon}</span>
            <div className="milestone-info">
              <span className="milestone-name">{m.name}</span>
              {reached ? (
                <span className="milestone-status">✓ Reached</span>
              ) : (
                <span className="milestone-eta">{formatDuration(timeRemaining)}</span>
              )}
            </div>
            <div className="milestone-bar">
              <div className="milestone-fill" style={{ width: `${progress}%` }} />
            </div>
          </div>
        );
      })}
      
      <style jsx>{`
        .milestone-tracker {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }
        
        .milestone {
          display: grid;
          grid-template-columns: 24px 1fr 60px;
          align-items: center;
          gap: 8px;
          padding: 6px 0;
          opacity: 0.6;
          transition: opacity 0.3s;
        }
        
        .milestone.reached {
          opacity: 1;
        }
        
        .milestone-icon {
          font-size: 16px;
          text-align: center;
        }
        
        .milestone-info {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        
        .milestone-name {
          font-size: 12px;
          color: var(--text-primary, #000);
        }
        
        .milestone-status {
          font-size: 10px;
          color: #22c55e;
          font-weight: 500;
        }
        
        .milestone-eta {
          font-family: var(--font-mono, monospace);
          font-size: 10px;
          color: var(--text-muted, #999);
        }
        
        .milestone-bar {
          height: 4px;
          background: #e5e5e5;
          border-radius: 2px;
          overflow: hidden;
        }
        
        .milestone-fill {
          height: 100%;
          background: linear-gradient(90deg, #3b82f6, #8b5cf6);
          border-radius: 2px;
          transition: width 0.1s linear;
        }
      `}</style>
    </div>
  );
}

// ============================================
// MAIN WIDGET COMPONENT
// ============================================

export default function LightTravel() {
  // ---- Refs ----
  const startTimeRef = useRef(Date.now());
  
  // ---- State ----
  const [elapsed, setElapsed] = useState(0);
  const [isPointerDevice, setIsPointerDevice] = useState(true);
  
  // ---- Input method detection ----
  useEffect(() => {
    const mediaQuery = window.matchMedia('(pointer: fine)');
    setIsPointerDevice(mediaQuery.matches);
    
    const handler = (e: MediaQueryListEvent) => setIsPointerDevice(e.matches);
    mediaQuery.addEventListener('change', handler);
    return () => mediaQuery.removeEventListener('change', handler);
  }, []);
  
  // ---- Update timer ----
  useEffect(() => {
    const interval = setInterval(() => {
      setElapsed((Date.now() - startTimeRef.current) / 1000);
    }, 50); // Update 20x per second for smooth counter
    
    return () => clearInterval(interval);
  }, []);
  
  // ---- Calculated values ----
  const distanceTraveled = elapsed * SPEED_OF_LIGHT;
  const formatted = formatDistance(distanceTraveled);
  
  const comparisons = useMemo(() => {
    return [
      { 
        label: 'Times around Earth', 
        value: (distanceTraveled / DISTANCES.earthCircumference).toFixed(2),
      },
      { 
        label: 'Trips to Moon', 
        value: (distanceTraveled / DISTANCES.toMoon).toFixed(3),
      },
      { 
        label: 'AU traveled', 
        value: (distanceTraveled / DISTANCES.toSun).toFixed(6),
      },
    ];
  }, [distanceTraveled]);

  return (
    <div className={`light-widget ${isPointerDevice ? 'pointer-device' : 'touch-device'}`}>
      
      {/* ---- Header ---- */}
      <div className="widget-header">
        <span className="widget-title">Light Travel</span>
        <span className="widget-subtitle">Since you opened this widget</span>
      </div>
      
      {/* ---- Main display ---- */}
      <div className="main-display">
        <div className="distance-display">
          <span className="distance-value">{formatted.value}</span>
          <span className="distance-unit">{formatted.unit}</span>
        </div>
        
        <div className="speed-note">
          at {SPEED_OF_LIGHT.toLocaleString()} m/s
        </div>
      </div>
      
      {/* ---- Session time ---- */}
      <div className="session-time">
        <span className="session-label">Time elapsed</span>
        <span className="session-value">{formatDuration(elapsed)}</span>
      </div>
      
      {/* ---- Comparisons ---- */}
      <div className="comparisons">
        {comparisons.map(c => (
          <div key={c.label} className="comparison">
            <span className="comparison-value">{c.value}</span>
            <span className="comparison-label">{c.label}</span>
          </div>
        ))}
      </div>
      
      {/* ---- Milestone tracker ---- */}
      <div className="milestones-section">
        <div className="section-header">Journey to...</div>
        <MilestoneTracker 
          distanceTraveled={distanceTraveled}
          elapsedSeconds={elapsed}
        />
      </div>
      
      {/* ---- Fun fact ---- */}
      <div className="fun-fact">
        <p>
          Light from the Sun takes about 8 minutes and 20 seconds to reach Earth.
          When you see the Sun, you're seeing it as it was 8 minutes ago.
        </p>
      </div>
      
      {/* ---- Skeleton Styles ---- */}
      <style jsx>{`
        .light-widget {
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
          margin-bottom: 16px;
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
        
        .main-display {
          text-align: center;
          padding: 20px 0;
          margin-bottom: 12px;
          background: linear-gradient(135deg, #faf5ff 0%, #f0f9ff 100%);
          border-radius: 12px;
        }
        
        .distance-display {
          display: flex;
          align-items: baseline;
          justify-content: center;
          gap: 8px;
        }
        
        .distance-value {
          font-family: var(--font-mono, monospace);
          font-size: 36px;
          font-weight: 700;
          color: var(--text-primary);
          font-variant-numeric: tabular-nums;
        }
        
        .distance-unit {
          font-size: 14px;
          color: var(--text-secondary);
        }
        
        .speed-note {
          font-size: 11px;
          color: var(--text-muted);
          margin-top: 8px;
        }
        
        .session-time {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 8px 12px;
          background: #f8f8f8;
          border-radius: 6px;
          margin-bottom: 12px;
        }
        
        .session-label {
          font-size: 12px;
          color: var(--text-secondary);
        }
        
        .session-value {
          font-family: var(--font-mono, monospace);
          font-size: 14px;
          font-weight: 500;
          color: var(--text-primary);
        }
        
        .comparisons {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 8px;
          margin-bottom: 16px;
        }
        
        .comparison {
          text-align: center;
          padding: 8px;
          background: #fafafa;
          border-radius: 6px;
        }
        
        .comparison-value {
          font-family: var(--font-mono, monospace);
          font-size: 14px;
          font-weight: 600;
          color: var(--text-primary);
          display: block;
        }
        
        .comparison-label {
          font-size: 9px;
          color: var(--text-muted);
          line-height: 1.3;
        }
        
        .milestones-section {
          margin-bottom: 12px;
        }
        
        .section-header {
          font-size: 11px;
          color: var(--text-muted);
          text-transform: uppercase;
          margin-bottom: 8px;
        }
        
        .fun-fact {
          padding: 10px;
          background: #fffbeb;
          border-radius: 6px;
          border-left: 3px solid #f59e0b;
        }
        
        .fun-fact p {
          font-size: 11px;
          color: var(--text-secondary);
          margin: 0;
          line-height: 1.5;
        }
        
        /* Touch adjustments */
        .touch-device .distance-value {
          font-size: 42px;
        }
      `}</style>
    </div>
  );
}