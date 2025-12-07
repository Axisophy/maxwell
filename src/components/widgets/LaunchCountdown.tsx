'use client';

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { format, formatDistanceToNow, differenceInSeconds } from 'date-fns';

// ============================================
// LAUNCH COUNTDOWN WIDGET - FUNCTIONAL SKELETON
// ============================================
// 
// Features:
// - Next upcoming rocket launch
// - Live countdown timer
// - Mission details (rocket, payload, pad)
// - Launch provider logo/info
// - Upcoming launches list
// - Launch status indicator
// - Responsive: pointer vs touch detection
//
// Data source: The Space Devs Launch Library 2
// - https://ll.thespacedevs.com/2.2.0/
// - Free tier: 15 requests/hour
//
// Styling: Minimal/neutral - ready for design application
// ============================================

interface Launch {
  id: string;
  name: string;
  net: string;  // NET = No Earlier Than (ISO date)
  status: {
    id: number;
    name: string;
    abbrev: string;
  };
  rocket: {
    configuration: {
      name: string;
      family: string;
    };
  };
  mission: {
    name: string;
    description: string;
    type: string;
  } | null;
  pad: {
    name: string;
    location: {
      name: string;
      country_code: string;
    };
  };
  launch_service_provider: {
    name: string;
    abbrev: string;
    type: string;
  };
  webcast_live: boolean;
  image: string | null;
}

interface CountdownValues {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  total: number;  // Total seconds remaining
  isPast: boolean;
}

// Calculate countdown values
function getCountdown(targetDate: Date): CountdownValues {
  const now = new Date();
  const total = differenceInSeconds(targetDate, now);
  const isPast = total < 0;
  const absTotal = Math.abs(total);
  
  const days = Math.floor(absTotal / (60 * 60 * 24));
  const hours = Math.floor((absTotal % (60 * 60 * 24)) / (60 * 60));
  const minutes = Math.floor((absTotal % (60 * 60)) / 60);
  const seconds = absTotal % 60;
  
  return { days, hours, minutes, seconds, total, isPast };
}

// Status color mapping
function getStatusColor(statusId: number): string {
  switch (statusId) {
    case 1: return '#22c55e';  // Go for launch (green)
    case 2: return '#f59e0b';  // TBD (amber)
    case 3: return '#22c55e';  // Success (green)
    case 4: return '#ef4444';  // Failure (red)
    case 5: return '#6366f1';  // Hold (purple)
    case 6: return '#64748b';  // In Flight (slate)
    case 7: return '#64748b';  // Partial Failure (slate)
    case 8: return '#f59e0b';  // TBC (amber)
    default: return '#64748b';
  }
}

// ============================================
// COUNTDOWN DISPLAY COMPONENT
// ============================================

interface CountdownDisplayProps {
  countdown: CountdownValues;
}

function CountdownDisplay({ countdown }: CountdownDisplayProps) {
  const { days, hours, minutes, seconds, isPast } = countdown;
  
  return (
    <div className={`countdown-display ${isPast ? 'past' : ''}`}>
      {isPast && <span className="past-indicator">T+</span>}
      {!isPast && countdown.total > 0 && <span className="countdown-prefix">T-</span>}
      
      <div className="countdown-units">
        {days > 0 && (
          <div className="countdown-unit">
            <span className="unit-value">{days}</span>
            <span className="unit-label">days</span>
          </div>
        )}
        <div className="countdown-unit">
          <span className="unit-value">{String(hours).padStart(2, '0')}</span>
          <span className="unit-label">hrs</span>
        </div>
        <div className="countdown-unit">
          <span className="unit-value">{String(minutes).padStart(2, '0')}</span>
          <span className="unit-label">min</span>
        </div>
        <div className="countdown-unit">
          <span className="unit-value">{String(seconds).padStart(2, '0')}</span>
          <span className="unit-label">sec</span>
        </div>
      </div>
    </div>
  );
}

// ============================================
// UPCOMING LAUNCHES LIST
// ============================================

interface UpcomingListProps {
  launches: Launch[];
  onSelect: (launch: Launch) => void;
}

function UpcomingList({ launches, onSelect }: UpcomingListProps) {
  return (
    <div className="upcoming-list">
      <div className="upcoming-header">Upcoming</div>
      {launches.map(launch => {
        const launchDate = new Date(launch.net);
        const timeUntil = formatDistanceToNow(launchDate, { addSuffix: true });
        
        return (
          <div 
            key={launch.id}
            className="upcoming-item"
            onClick={() => onSelect(launch)}
          >
            <div className="upcoming-provider">
              {launch.launch_service_provider.abbrev}
            </div>
            <div className="upcoming-details">
              <div className="upcoming-rocket">{launch.rocket.configuration.name}</div>
              <div className="upcoming-time">{timeUntil}</div>
            </div>
            <div 
              className="upcoming-status"
              style={{ backgroundColor: getStatusColor(launch.status.id) }}
              title={launch.status.name}
            >
              {launch.status.abbrev}
            </div>
          </div>
        );
      })}
    </div>
  );
}

// ============================================
// MAIN WIDGET COMPONENT
// ============================================

export default function LaunchCountdown() {
  // ---- State ----
  const [launches, setLaunches] = useState<Launch[]>([]);
  const [selectedLaunch, setSelectedLaunch] = useState<Launch | null>(null);
  const [countdown, setCountdown] = useState<CountdownValues | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isPointerDevice, setIsPointerDevice] = useState(true);
  
  // ---- Input method detection ----
  useEffect(() => {
    const mediaQuery = window.matchMedia('(pointer: fine)');
    setIsPointerDevice(mediaQuery.matches);
    
    const handler = (e: MediaQueryListEvent) => setIsPointerDevice(e.matches);
    mediaQuery.addEventListener('change', handler);
    return () => mediaQuery.removeEventListener('change', handler);
  }, []);
  
  // ---- Fetch launches ----
  const fetchLaunches = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch(
        'https://ll.thespacedevs.com/2.2.0/launch/upcoming/?limit=10&mode=detailed'
      );
      
      if (!response.ok) {
        if (response.status === 429) {
          throw new Error('Rate limit exceeded — try again in a few minutes');
        }
        throw new Error('Failed to fetch launch data');
      }
      
      const data = await response.json();
      
      if (data.results && data.results.length > 0) {
        setLaunches(data.results);
        setSelectedLaunch(data.results[0]);
      }
      
      setLoading(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
      setLoading(false);
    }
  }, []);
  
  // ---- Initial fetch ----
  useEffect(() => {
    fetchLaunches();
    
    // Refresh every 15 minutes (respect rate limits)
    const interval = setInterval(fetchLaunches, 15 * 60 * 1000);
    return () => clearInterval(interval);
  }, [fetchLaunches]);
  
  // ---- Countdown timer ----
  useEffect(() => {
    if (!selectedLaunch) return;
    
    const targetDate = new Date(selectedLaunch.net);
    
    const updateCountdown = () => {
      setCountdown(getCountdown(targetDate));
    };
    
    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);
    
    return () => clearInterval(interval);
  }, [selectedLaunch]);
  
  // ---- Derived data ----
  const upcomingLaunches = useMemo(() => {
    return launches.filter(l => l.id !== selectedLaunch?.id).slice(0, 4);
  }, [launches, selectedLaunch]);

  return (
    <div className={`launch-widget ${isPointerDevice ? 'pointer-device' : 'touch-device'}`}>
      
      {/* ---- Header ---- */}
      <div className="widget-header">
        <span className="widget-title">Next Launch</span>
        {selectedLaunch?.webcast_live && (
          <span className="live-indicator">● LIVE</span>
        )}
      </div>
      
      {/* ---- Loading State ---- */}
      {loading && (
        <div className="loading-state">
          Fetching launch schedule...
        </div>
      )}
      
      {/* ---- Error State ---- */}
      {error && (
        <div className="error-message">
          {error}
          <button onClick={fetchLaunches} className="retry-btn">Retry</button>
        </div>
      )}
      
      {/* ---- Main Display ---- */}
      {!loading && !error && selectedLaunch && countdown && (
        <>
          {/* Countdown */}
          <CountdownDisplay countdown={countdown} />
          
          {/* Launch status */}
          <div className="launch-status">
            <span 
              className="status-badge"
              style={{ backgroundColor: getStatusColor(selectedLaunch.status.id) }}
            >
              {selectedLaunch.status.name}
            </span>
            <span className="launch-date">
              {format(new Date(selectedLaunch.net), 'MMM d, yyyy • HH:mm')} UTC
            </span>
          </div>
          
          {/* Mission info */}
          <div className="mission-info">
            <div className="mission-name">{selectedLaunch.name}</div>
            
            {selectedLaunch.mission && (
              <div className="mission-description">
                {selectedLaunch.mission.description?.slice(0, 150)}
                {selectedLaunch.mission.description?.length > 150 && '...'}
              </div>
            )}
          </div>
          
          {/* Launch details grid */}
          <div className="details-grid">
            <div className="detail-item">
              <span className="detail-label">Rocket</span>
              <span className="detail-value">{selectedLaunch.rocket.configuration.name}</span>
            </div>
            <div className="detail-item">
              <span className="detail-label">Provider</span>
              <span className="detail-value">{selectedLaunch.launch_service_provider.name}</span>
            </div>
            <div className="detail-item">
              <span className="detail-label">Pad</span>
              <span className="detail-value">{selectedLaunch.pad.name}</span>
            </div>
            <div className="detail-item">
              <span className="detail-label">Location</span>
              <span className="detail-value">{selectedLaunch.pad.location.name}</span>
            </div>
          </div>
          
          {/* Upcoming launches */}
          {upcomingLaunches.length > 0 && (
            <UpcomingList 
              launches={upcomingLaunches}
              onSelect={setSelectedLaunch}
            />
          )}
        </>
      )}
      
      {/* ---- Data source ---- */}
      <div className="data-source">
        Data: The Space Devs Launch Library
      </div>
      
      {/* ---- Skeleton Styles ---- */}
      <style jsx>{`
        .launch-widget {
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
          margin-bottom: 16px;
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
        }
        
        .loading-state {
          text-align: center;
          padding: 60px 20px;
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
        
        .countdown-display {
          text-align: center;
          margin-bottom: 12px;
        }
        
        .past-indicator,
        .countdown-prefix {
          font-family: var(--font-mono, monospace);
          font-size: 14px;
          color: var(--text-muted);
        }
        
        .countdown-display.past .countdown-units {
          opacity: 0.6;
        }
        
        .countdown-units {
          display: flex;
          justify-content: center;
          gap: 4px;
        }
        
        .countdown-unit {
          display: flex;
          flex-direction: column;
          align-items: center;
          min-width: 48px;
        }
        
        .unit-value {
          font-family: var(--font-mono, monospace);
          font-size: 32px;
          font-weight: 700;
          color: var(--text-primary);
          line-height: 1;
        }
        
        .unit-label {
          font-size: 10px;
          color: var(--text-muted);
          text-transform: uppercase;
          margin-top: 4px;
        }
        
        .launch-status {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 12px;
          margin-bottom: 16px;
        }
        
        .status-badge {
          padding: 4px 10px;
          border-radius: 12px;
          font-size: 11px;
          font-weight: 600;
          color: white;
          text-transform: uppercase;
        }
        
        .launch-date {
          font-family: var(--font-mono, monospace);
          font-size: 12px;
          color: var(--text-secondary);
        }
        
        .mission-info {
          margin-bottom: 16px;
          text-align: center;
        }
        
        .mission-name {
          font-size: 16px;
          font-weight: 600;
          color: var(--text-primary);
          margin-bottom: 8px;
        }
        
        .mission-description {
          font-size: 13px;
          color: var(--text-secondary);
          line-height: 1.5;
        }
        
        .details-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 12px;
          padding: 12px;
          background: #f8f8f8;
          border-radius: 8px;
          margin-bottom: 16px;
        }
        
        .detail-item {
          display: flex;
          flex-direction: column;
          gap: 2px;
        }
        
        .detail-label {
          font-size: 10px;
          color: var(--text-muted);
          text-transform: uppercase;
        }
        
        .detail-value {
          font-size: 13px;
          color: var(--text-primary);
        }
        
        .upcoming-list {
          border-top: 1px solid var(--widget-border);
          padding-top: 12px;
        }
        
        .upcoming-header {
          font-size: 11px;
          color: var(--text-muted);
          text-transform: uppercase;
          margin-bottom: 8px;
        }
        
        .upcoming-item {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 8px;
          border-radius: 6px;
          cursor: pointer;
          transition: background 0.2s;
        }
        
        .upcoming-item:hover {
          background: #f5f5f5;
        }
        
        .upcoming-provider {
          font-size: 11px;
          font-weight: 600;
          color: var(--text-muted);
          min-width: 48px;
        }
        
        .upcoming-details {
          flex: 1;
        }
        
        .upcoming-rocket {
          font-size: 13px;
          color: var(--text-primary);
        }
        
        .upcoming-time {
          font-size: 11px;
          color: var(--text-muted);
        }
        
        .upcoming-status {
          padding: 2px 6px;
          border-radius: 4px;
          font-size: 9px;
          font-weight: 600;
          color: white;
        }
        
        .data-source {
          text-align: center;
          font-size: 10px;
          color: var(--text-muted);
          margin-top: 12px;
        }
        
        /* Touch adjustments */
        .touch-device .unit-value {
          font-size: 40px;
        }
        
        .touch-device .upcoming-item {
          padding: 12px;
        }
      `}</style>
    </div>
  );
}