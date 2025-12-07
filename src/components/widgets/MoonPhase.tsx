'use client';

import React, { useState, useEffect, useMemo } from 'react';
import SunCalc from 'suncalc';
import { format, addDays, differenceInDays } from 'date-fns';

// ============================================
// MOON PHASE WIDGET - FUNCTIONAL SKELETON
// ============================================
// 
// Features:
// - Real-time moon phase calculation (no API)
// - Visual moon showing current illumination
// - Phase name, illumination %, moon age
// - Date picker to explore any date
// - Next full/new moon dates
// - Moonrise/moonset times (requires location)
// - Responsive: pointer vs touch detection
//
// Styling: Minimal/neutral - ready for design application
// ============================================

interface MoonData {
  phase: number;           // 0-1 (0 = new, 0.5 = full)
  illumination: number;    // 0-1 fraction illuminated
  angle: number;           // Moon's rotation angle
  phaseName: string;
  moonAge: number;         // Days since new moon
  emoji: string;
}

interface MoonTimes {
  rise: Date | null;
  set: Date | null;
  alwaysUp: boolean;
  alwaysDown: boolean;
}

// Get phase name from phase value (0-1)
function getPhaseName(phase: number): { name: string; emoji: string } {
  // Phase: 0 = new, 0.25 = first quarter, 0.5 = full, 0.75 = last quarter
  if (phase < 0.025 || phase >= 0.975) return { name: 'New Moon', emoji: '🌑' };
  if (phase < 0.225) return { name: 'Waxing Crescent', emoji: '🌒' };
  if (phase < 0.275) return { name: 'First Quarter', emoji: '🌓' };
  if (phase < 0.475) return { name: 'Waxing Gibbous', emoji: '🌔' };
  if (phase < 0.525) return { name: 'Full Moon', emoji: '🌕' };
  if (phase < 0.725) return { name: 'Waning Gibbous', emoji: '🌖' };
  if (phase < 0.775) return { name: 'Last Quarter', emoji: '🌗' };
  return { name: 'Waning Crescent', emoji: '🌘' };
}

// Find next occurrence of a specific phase
function findNextPhase(startDate: Date, targetPhase: number, phaseName: string): Date {
  let date = new Date(startDate);
  const maxDays = 30; // Lunar cycle is ~29.5 days
  
  for (let i = 0; i < maxDays; i++) {
    const illumination = SunCalc.getMoonIllumination(date);
    const diff = Math.abs(illumination.phase - targetPhase);
    
    // Check if we're close to target phase (within ~0.5 days worth)
    if (diff < 0.017 || diff > 0.983) {
      return date;
    }
    date = addDays(date, 1);
  }
  return date;
}

// Calculate moon data for a given date
function getMoonData(date: Date): MoonData {
  const illumination = SunCalc.getMoonIllumination(date);
  const { name, emoji } = getPhaseName(illumination.phase);
  
  // Moon age: days since last new moon (phase 0)
  // Phase 0-1 maps to 0-29.53 days
  const moonAge = illumination.phase * 29.53;
  
  return {
    phase: illumination.phase,
    illumination: illumination.fraction,
    angle: illumination.angle,
    phaseName: name,
    moonAge: moonAge,
    emoji: emoji,
  };
}

// Get moonrise/moonset times for location
function getMoonTimes(date: Date, lat: number, lon: number): MoonTimes {
  const times = SunCalc.getMoonTimes(date, lat, lon);
  return {
    rise: times.rise || null,
    set: times.set || null,
    alwaysUp: times.alwaysUp || false,
    alwaysDown: times.alwaysDown || false,
  };
}

// ============================================
// MOON VISUAL COMPONENT (SVG)
// ============================================

interface MoonVisualProps {
  phase: number;        // 0-1
  illumination: number; // 0-1
  size?: number;
}

function MoonVisual({ phase, illumination, size = 200 }: MoonVisualProps) {
  // Calculate the terminator position
  // phase 0 = new (dark), 0.25 = first quarter (right half lit)
  // 0.5 = full (all lit), 0.75 = last quarter (left half lit)
  
  const radius = size / 2 - 4;
  const cx = size / 2;
  const cy = size / 2;
  
  // Determine if waxing (0-0.5) or waning (0.5-1)
  const isWaxing = phase < 0.5;
  
  // Calculate the curve of the terminator
  // At new moon (0) and full moon (0.5), terminator is at edge
  // At quarters (0.25, 0.75), terminator is straight down middle
  
  let terminatorX: number;
  if (phase <= 0.25) {
    // New to first quarter: right side illuminating
    terminatorX = radius * Math.cos(Math.PI * (0.5 - phase * 2));
  } else if (phase <= 0.5) {
    // First quarter to full: left side of terminator moving left
    terminatorX = -radius * Math.cos(Math.PI * ((phase - 0.25) * 2));
  } else if (phase <= 0.75) {
    // Full to last quarter: right side darkening
    terminatorX = -radius * Math.cos(Math.PI * ((phase - 0.5) * 2));
  } else {
    // Last quarter to new: left side darkening
    terminatorX = radius * Math.cos(Math.PI * ((phase - 0.75) * 2));
  }
  
  // Create the illuminated portion path
  // This is simplified - a proper moon would use elliptical arcs
  const illuminatedPath = useMemo(() => {
    if (illumination < 0.01) {
      // New moon - no illumination
      return '';
    }
    if (illumination > 0.99) {
      // Full moon - full circle
      return `M ${cx - radius} ${cy} 
              A ${radius} ${radius} 0 1 1 ${cx + radius} ${cy}
              A ${radius} ${radius} 0 1 1 ${cx - radius} ${cy}`;
    }
    
    // Calculate ellipse width for terminator curve
    const sweepWidth = Math.abs(Math.cos(phase * 2 * Math.PI)) * radius;
    
    if (phase <= 0.5) {
      // Waxing: illuminated on the right
      return `M ${cx} ${cy - radius}
              A ${radius} ${radius} 0 0 1 ${cx} ${cy + radius}
              A ${sweepWidth} ${radius} 0 0 ${phase < 0.25 ? 1 : 0} ${cx} ${cy - radius}`;
    } else {
      // Waning: illuminated on the left
      return `M ${cx} ${cy - radius}
              A ${radius} ${radius} 0 0 0 ${cx} ${cy + radius}
              A ${sweepWidth} ${radius} 0 0 ${phase > 0.75 ? 0 : 1} ${cx} ${cy - radius}`;
    }
  }, [phase, illumination, cx, cy, radius]);

  return (
    <svg 
      width={size} 
      height={size} 
      viewBox={`0 0 ${size} ${size}`}
      className="moon-visual"
    >
      {/* Dark moon base */}
      <circle
        cx={cx}
        cy={cy}
        r={radius}
        fill="var(--moon-dark, #1a1a1a)"
        stroke="var(--moon-border, #333)"
        strokeWidth="1"
      />
      
      {/* Illuminated portion */}
      {illumination > 0.01 && (
        <path
          d={illuminatedPath}
          fill="var(--moon-light, #f5f5f0)"
        />
      )}
      
      {/* Optional: subtle crater texture could go here */}
    </svg>
  );
}

// ============================================
// MAIN WIDGET COMPONENT
// ============================================

interface MoonPhaseProps {
  // Optional: user's location for rise/set times
  latitude?: number;
  longitude?: number;
  // Optional: controlled date (for embedding)
  initialDate?: Date;
}

export default function MoonPhase({ 
  latitude, 
  longitude,
  initialDate 
}: MoonPhaseProps) {
  // ---- State ----
  const [selectedDate, setSelectedDate] = useState<Date>(initialDate || new Date());
  const [userLocation, setUserLocation] = useState<{ lat: number; lon: number } | null>(
    latitude && longitude ? { lat: latitude, lon: longitude } : null
  );
  const [isPointerDevice, setIsPointerDevice] = useState(true);
  const [showDatePicker, setShowDatePicker] = useState(false);
  
  // ---- Input method detection ----
  useEffect(() => {
    const mediaQuery = window.matchMedia('(pointer: fine)');
    setIsPointerDevice(mediaQuery.matches);
    
    const handler = (e: MediaQueryListEvent) => setIsPointerDevice(e.matches);
    mediaQuery.addEventListener('change', handler);
    return () => mediaQuery.removeEventListener('change', handler);
  }, []);
  
  // ---- Request user location (optional) ----
  const requestLocation = () => {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lon: position.coords.longitude,
          });
        },
        (error) => {
          console.log('Location access denied:', error.message);
        }
      );
    }
  };
  
  // ---- Calculate moon data ----
  const moonData = useMemo(() => getMoonData(selectedDate), [selectedDate]);
  
  const moonTimes = useMemo(() => {
    if (!userLocation) return null;
    return getMoonTimes(selectedDate, userLocation.lat, userLocation.lon);
  }, [selectedDate, userLocation]);
  
  // ---- Find next full and new moons ----
  const nextFullMoon = useMemo(() => findNextPhase(selectedDate, 0.5, 'Full'), [selectedDate]);
  const nextNewMoon = useMemo(() => findNextPhase(selectedDate, 0, 'New'), [selectedDate]);
  
  // ---- Date navigation ----
  const goToToday = () => setSelectedDate(new Date());
  const goToPrevDay = () => setSelectedDate(prev => addDays(prev, -1));
  const goToNextDay = () => setSelectedDate(prev => addDays(prev, 1));
  
  // Check if viewing today
  const isToday = differenceInDays(selectedDate, new Date()) === 0 && 
                  selectedDate.getDate() === new Date().getDate();

  return (
    <div className={`moon-phase-widget ${isPointerDevice ? 'pointer-device' : 'touch-device'}`}>
      
      {/* ---- Header ---- */}
      <div className="widget-header">
        <span className="widget-title">Moon Phase</span>
        <span className="widget-date">
          {isToday ? 'Today' : format(selectedDate, 'MMM d, yyyy')}
        </span>
      </div>
      
      {/* ---- Main Display ---- */}
      <div className="widget-display">
        <MoonVisual 
          phase={moonData.phase} 
          illumination={moonData.illumination}
          size={isPointerDevice ? 180 : 200}
        />
        
        <div className="phase-info">
          <div className="phase-name">
            <span className="emoji">{moonData.emoji}</span>
            <span className="name">{moonData.phaseName}</span>
          </div>
          
          <div className="phase-stats">
            <div className="stat">
              <span className="stat-label">Illumination</span>
              <span className="stat-value">{(moonData.illumination * 100).toFixed(1)}%</span>
            </div>
            <div className="stat">
              <span className="stat-label">Moon Age</span>
              <span className="stat-value">{moonData.moonAge.toFixed(1)} days</span>
            </div>
          </div>
        </div>
      </div>
      
      {/* ---- Rise/Set Times (if location available) ---- */}
      {moonTimes && (
        <div className="moon-times">
          <div className="time-item">
            <span className="time-label">Moonrise</span>
            <span className="time-value">
              {moonTimes.rise ? format(moonTimes.rise, 'HH:mm') : '—'}
            </span>
          </div>
          <div className="time-item">
            <span className="time-label">Moonset</span>
            <span className="time-value">
              {moonTimes.set ? format(moonTimes.set, 'HH:mm') : '—'}
            </span>
          </div>
        </div>
      )}
      
      {/* ---- Location Request (if no location) ---- */}
      {!userLocation && (
        <button 
          onClick={requestLocation}
          className="location-button"
        >
          Enable location for rise/set times
        </button>
      )}
      
      {/* ---- Upcoming Phases ---- */}
      <div className="upcoming-phases">
        <div className="upcoming-item">
          <span className="upcoming-label">Next Full Moon</span>
          <span className="upcoming-value">{format(nextFullMoon, 'MMM d')}</span>
        </div>
        <div className="upcoming-item">
          <span className="upcoming-label">Next New Moon</span>
          <span className="upcoming-value">{format(nextNewMoon, 'MMM d')}</span>
        </div>
      </div>
      
      {/* ---- Date Controls ---- */}
      <div className="date-controls">
        {isPointerDevice ? (
          // Pointer: compact inline controls
          <>
            <button onClick={goToPrevDay} className="date-btn">←</button>
            <button onClick={goToToday} className="date-btn today-btn" disabled={isToday}>
              Today
            </button>
            <input
              type="date"
              value={format(selectedDate, 'yyyy-MM-dd')}
              onChange={(e) => setSelectedDate(new Date(e.target.value))}
              className="date-input"
            />
            <button onClick={goToNextDay} className="date-btn">→</button>
          </>
        ) : (
          // Touch: larger buttons, stacked layout
          <>
            <div className="date-nav-row">
              <button onClick={goToPrevDay} className="date-btn large">
                ← Previous Day
              </button>
              <button onClick={goToNextDay} className="date-btn large">
                Next Day →
              </button>
            </div>
            <div className="date-action-row">
              <button onClick={goToToday} className="date-btn large" disabled={isToday}>
                Today
              </button>
              <input
                type="date"
                value={format(selectedDate, 'yyyy-MM-dd')}
                onChange={(e) => setSelectedDate(new Date(e.target.value))}
                className="date-input large"
              />
            </div>
          </>
        )}
      </div>
      
      {/* ---- Skeleton Styles (to be replaced by design) ---- */}
      <style jsx>{`
        .moon-phase-widget {
          --moon-dark: #1a1a1a;
          --moon-light: #f5f5f0;
          --moon-border: #333;
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
          align-items: baseline;
          margin-bottom: 16px;
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
        
        .widget-display {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 16px;
          margin-bottom: 16px;
        }
        
        .phase-info {
          text-align: center;
        }
        
        .phase-name {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          margin-bottom: 12px;
        }
        
        .phase-name .emoji {
          font-size: 24px;
        }
        
        .phase-name .name {
          font-size: 18px;
          font-weight: 500;
          color: var(--text-primary);
        }
        
        .phase-stats {
          display: flex;
          gap: 24px;
          justify-content: center;
        }
        
        .stat {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 4px;
        }
        
        .stat-label {
          font-size: 11px;
          color: var(--text-muted);
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }
        
        .stat-value {
          font-family: var(--font-mono, monospace);
          font-size: 16px;
          font-weight: 500;
          color: var(--text-primary);
        }
        
        .moon-times {
          display: flex;
          justify-content: center;
          gap: 32px;
          padding: 12px 0;
          border-top: 1px solid var(--widget-border);
          border-bottom: 1px solid var(--widget-border);
          margin-bottom: 12px;
        }
        
        .time-item {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 4px;
        }
        
        .time-label {
          font-size: 11px;
          color: var(--text-muted);
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }
        
        .time-value {
          font-family: var(--font-mono, monospace);
          font-size: 16px;
          color: var(--text-primary);
        }
        
        .location-button {
          display: block;
          width: 100%;
          padding: 8px 12px;
          margin-bottom: 12px;
          background: transparent;
          border: 1px dashed var(--widget-border);
          border-radius: 6px;
          color: var(--text-secondary);
          font-size: 12px;
          cursor: pointer;
          transition: border-color 0.2s;
        }
        
        .location-button:hover {
          border-color: var(--text-secondary);
        }
        
        .upcoming-phases {
          display: flex;
          justify-content: space-around;
          padding: 12px 0;
          margin-bottom: 12px;
        }
        
        .upcoming-item {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 4px;
        }
        
        .upcoming-label {
          font-size: 11px;
          color: var(--text-muted);
        }
        
        .upcoming-value {
          font-family: var(--font-mono, monospace);
          font-size: 14px;
          color: var(--text-primary);
        }
        
        .date-controls {
          display: flex;
          gap: 8px;
          align-items: center;
          justify-content: center;
        }
        
        .date-btn {
          padding: 6px 12px;
          background: var(--widget-bg);
          border: 1px solid var(--widget-border);
          border-radius: 6px;
          color: var(--text-primary);
          font-size: 13px;
          cursor: pointer;
          transition: background 0.2s;
        }
        
        .date-btn:hover:not(:disabled) {
          background: #f5f5f5;
        }
        
        .date-btn:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }
        
        .date-input {
          padding: 6px 10px;
          border: 1px solid var(--widget-border);
          border-radius: 6px;
          font-family: var(--font-mono, monospace);
          font-size: 13px;
          color: var(--text-primary);
        }
        
        /* Touch device adjustments */
        .touch-device .date-controls {
          flex-direction: column;
          gap: 12px;
        }
        
        .touch-device .date-nav-row,
        .touch-device .date-action-row {
          display: flex;
          gap: 12px;
          width: 100%;
        }
        
        .touch-device .date-btn.large {
          flex: 1;
          padding: 12px 16px;
          font-size: 15px;
        }
        
        .touch-device .date-input.large {
          flex: 1;
          padding: 12px;
          font-size: 15px;
        }
      `}</style>
    </div>
  );
}