'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { format } from 'date-fns';

// ============================================
// AURORA FORECAST WIDGET - FUNCTIONAL SKELETON
// ============================================
// 
// Features:
// - Current Kp index (planetary geomagnetic activity)
// - Aurora viewing probability
// - 3-day forecast
// - Location-based visibility estimate
// - Solar wind conditions
// - Responsive: pointer vs touch detection
//
// Data source: NOAA Space Weather Prediction Center
// - https://services.swpc.noaa.gov/products/
// - Rock solid API
//
// Styling: Minimal/neutral - ready for design application
// ============================================

interface KpData {
  timeTag: string;
  kpIndex: number;
  observed: boolean;  // true = observed, false = predicted
}

interface SolarWindData {
  speed: number;      // km/s
  density: number;    // p/cm³
  bz: number;         // nT (negative = good for aurora)
}

// Kp index interpretation
function getKpInfo(kp: number): { level: string; color: string; description: string } {
  if (kp >= 9) return { level: 'Extreme', color: '#7f1d1d', description: 'Aurora visible at very low latitudes' };
  if (kp >= 8) return { level: 'Severe', color: '#991b1b', description: 'Aurora visible across mid-latitudes' };
  if (kp >= 7) return { level: 'Strong', color: '#dc2626', description: 'Aurora visible at 50° latitude' };
  if (kp >= 6) return { level: 'Moderate', color: '#ea580c', description: 'Aurora visible at 55° latitude' };
  if (kp >= 5) return { level: 'Minor', color: '#f59e0b', description: 'Aurora visible at 60° latitude' };
  if (kp >= 4) return { level: 'Active', color: '#84cc16', description: 'Aurora possible at high latitudes' };
  if (kp >= 3) return { level: 'Unsettled', color: '#22c55e', description: 'Aurora visible near Arctic/Antarctic' };
  if (kp >= 2) return { level: 'Quiet', color: '#14b8a6', description: 'Aurora confined to polar regions' };
  return { level: 'Very Quiet', color: '#06b6d4', description: 'Minimal aurora activity' };
}

// Latitude thresholds for aurora visibility based on Kp
function getVisibilityLatitude(kp: number): number {
  const thresholds: Record<number, number> = {
    0: 67, 1: 65, 2: 63, 3: 61, 4: 58,
    5: 55, 6: 52, 7: 50, 8: 48, 9: 45,
  };
  return thresholds[Math.min(9, Math.floor(kp))] || 67;
}

// ============================================
// KP GAUGE COMPONENT
// ============================================

interface KpGaugeProps {
  kp: number;
}

function KpGauge({ kp }: KpGaugeProps) {
  const info = getKpInfo(kp);
  const percentage = (kp / 9) * 100;
  
  return (
    <div className="kp-gauge">
      <div className="gauge-display">
        <div className="gauge-value" style={{ color: info.color }}>
          {kp.toFixed(1)}
        </div>
        <div className="gauge-label">Kp Index</div>
      </div>
      
      <div className="gauge-bar">
        <div className="gauge-track">
          {/* Color segments */}
          <div className="gauge-segments">
            {[0, 1, 2, 3, 4, 5, 6, 7, 8].map(i => (
              <div 
                key={i}
                className="gauge-segment"
                style={{ backgroundColor: getKpInfo(i + 0.5).color }}
              />
            ))}
          </div>
          {/* Current value marker */}
          <div 
            className="gauge-marker"
            style={{ left: `${Math.min(100, percentage)}%` }}
          />
        </div>
        <div className="gauge-scale">
          <span>0</span>
          <span>3</span>
          <span>5</span>
          <span>7</span>
          <span>9</span>
        </div>
      </div>
      
      <div className="gauge-status">
        <span className="status-level" style={{ color: info.color }}>{info.level}</span>
        <span className="status-desc">{info.description}</span>
      </div>
    </div>
  );
}

// ============================================
// FORECAST BAR COMPONENT
// ============================================

interface ForecastBarProps {
  forecast: KpData[];
}

function ForecastBar({ forecast }: ForecastBarProps) {
  // Group by day and find max Kp for each period
  const next24h = forecast.slice(0, 8);  // 3-hour intervals
  
  return (
    <div className="forecast-bar">
      <div className="forecast-header">24-Hour Forecast</div>
      <div className="forecast-items">
        {next24h.map((item, i) => {
          const info = getKpInfo(item.kpIndex);
          const hour = format(new Date(item.timeTag), 'HH:mm');
          
          return (
            <div key={i} className="forecast-item">
              <div 
                className="forecast-bar-fill"
                style={{ 
                  height: `${(item.kpIndex / 9) * 100}%`,
                  backgroundColor: info.color,
                }}
              />
              <span className="forecast-time">{hour}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ============================================
// MAIN WIDGET COMPONENT
// ============================================

interface AuroraForecastProps {
  // Optional: user's latitude for visibility estimate
  latitude?: number;
}

export default function AuroraForecast({ latitude }: AuroraForecastProps) {
  // ---- State ----
  const [currentKp, setCurrentKp] = useState<number | null>(null);
  const [forecast, setForecast] = useState<KpData[]>([]);
  const [solarWind, setSolarWind] = useState<SolarWindData | null>(null);
  const [userLatitude, setUserLatitude] = useState<number | null>(latitude || null);
  const [loading, setLoading] = useState(true);
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
  
  // ---- Request location ----
  const requestLocation = () => {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => setUserLatitude(position.coords.latitude),
        (error) => console.log('Location access denied:', error.message)
      );
    }
  };
  
  // ---- Fetch data ----
  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      // Fetch Kp index (current and forecast)
      const kpResponse = await fetch(
        'https://services.swpc.noaa.gov/products/noaa-planetary-k-index-forecast.json'
      );
      
      if (!kpResponse.ok) throw new Error('Failed to fetch Kp data');
      
      const kpData = await kpResponse.json();
      
      // Parse Kp data (skip header row)
      const parsedKp: KpData[] = kpData.slice(1).map((row: string[]) => ({
        timeTag: row[0],
        kpIndex: parseFloat(row[1]),
        observed: row[2] === 'observed',
      }));
      
      // Find current (most recent observed) and set forecast
      const observed = parsedKp.filter(d => d.observed);
      if (observed.length > 0) {
        setCurrentKp(observed[observed.length - 1].kpIndex);
      }
      setForecast(parsedKp.filter(d => !d.observed));
      
      // Fetch solar wind data
      try {
        const windResponse = await fetch(
          'https://services.swpc.noaa.gov/products/solar-wind/plasma-7-day.json'
        );
        
        if (windResponse.ok) {
          const windData = await windResponse.json();
          const latest = windData[windData.length - 1];
          
          if (latest) {
            setSolarWind({
              speed: parseFloat(latest[2]) || 0,
              density: parseFloat(latest[1]) || 0,
              bz: 0, // Would need mag data for Bz
            });
          }
        }
      } catch (e) {
        // Solar wind is supplementary, don't fail if unavailable
        console.log('Solar wind data unavailable');
      }
      
      setLastUpdate(new Date());
      setLoading(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
      setLoading(false);
    }
  }, []);
  
  // ---- Initial fetch ----
  useEffect(() => {
    fetchData();
    
    // Refresh every 15 minutes
    const interval = setInterval(fetchData, 15 * 60 * 1000);
    return () => clearInterval(interval);
  }, [fetchData]);
  
  // ---- Visibility estimate ----
  const visibilityInfo = currentKp !== null && userLatitude !== null
    ? {
        visibleAt: getVisibilityLatitude(currentKp),
        canSee: Math.abs(userLatitude) >= getVisibilityLatitude(currentKp),
        userLat: userLatitude,
      }
    : null;

  return (
    <div className={`aurora-widget ${isPointerDevice ? 'pointer-device' : 'touch-device'}`}>
      
      {/* ---- Header ---- */}
      <div className="widget-header">
        <span className="widget-title">Aurora Forecast</span>
        {lastUpdate && (
          <span className="last-update">
            {format(lastUpdate, 'HH:mm')}
          </span>
        )}
      </div>
      
      {/* ---- Loading State ---- */}
      {loading && (
        <div className="loading-state">
          Fetching space weather data...
        </div>
      )}
      
      {/* ---- Error State ---- */}
      {error && (
        <div className="error-message">
          {error}
          <button onClick={fetchData} className="retry-btn">Retry</button>
        </div>
      )}
      
      {/* ---- Main Display ---- */}
      {!loading && !error && currentKp !== null && (
        <>
          {/* Kp Gauge */}
          <KpGauge kp={currentKp} />
          
          {/* Visibility estimate */}
          {visibilityInfo && (
            <div className={`visibility-card ${visibilityInfo.canSee ? 'visible' : 'not-visible'}`}>
              <span className="visibility-icon">
                {visibilityInfo.canSee ? '✓' : '✗'}
              </span>
              <div className="visibility-text">
                <span className="visibility-title">
                  {visibilityInfo.canSee ? 'Visible from your location' : 'Not visible from your location'}
                </span>
                <span className="visibility-detail">
                  Current aurora visible at {visibilityInfo.visibleAt}°+ latitude
                  {' '}(you're at {Math.abs(visibilityInfo.userLat).toFixed(1)}°)
                </span>
              </div>
            </div>
          )}
          
          {/* Location request */}
          {!userLatitude && (
            <button onClick={requestLocation} className="location-button">
              Check visibility for my location
            </button>
          )}
          
          {/* Solar wind conditions */}
          {solarWind && (
            <div className="solar-wind">
              <div className="wind-header">Solar Wind</div>
              <div className="wind-stats">
                <div className="wind-stat">
                  <span className="wind-value">{solarWind.speed.toFixed(0)}</span>
                  <span className="wind-unit">km/s</span>
                  <span className="wind-label">Speed</span>
                </div>
                <div className="wind-stat">
                  <span className="wind-value">{solarWind.density.toFixed(1)}</span>
                  <span className="wind-unit">p/cm³</span>
                  <span className="wind-label">Density</span>
                </div>
              </div>
            </div>
          )}
          
          {/* Forecast */}
          {forecast.length > 0 && (
            <ForecastBar forecast={forecast} />
          )}
          
          {/* Tips */}
          <div className="aurora-tips">
            <p>Best viewing: clear skies, away from city lights, between 10pm–2am local time.</p>
          </div>
        </>
      )}
      
      {/* ---- Data source ---- */}
      <div className="data-source">
        Data: NOAA Space Weather Prediction Center
      </div>
      
      {/* ---- Skeleton Styles ---- */}
      <style jsx>{`
        .aurora-widget {
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
          margin-bottom: 16px;
        }
        
        .widget-title {
          font-size: 14px;
          font-weight: 500;
          color: var(--text-primary);
        }
        
        .last-update {
          font-family: var(--font-mono, monospace);
          font-size: 11px;
          color: var(--text-muted);
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
        
        .kp-gauge {
          margin-bottom: 16px;
        }
        
        .gauge-display {
          text-align: center;
          margin-bottom: 12px;
        }
        
        .gauge-value {
          font-family: var(--font-mono, monospace);
          font-size: 48px;
          font-weight: 700;
          line-height: 1;
        }
        
        .gauge-label {
          font-size: 12px;
          color: var(--text-muted);
          margin-top: 4px;
        }
        
        .gauge-bar {
          margin-bottom: 12px;
        }
        
        .gauge-track {
          position: relative;
          height: 12px;
          border-radius: 6px;
          overflow: hidden;
        }
        
        .gauge-segments {
          display: flex;
          height: 100%;
        }
        
        .gauge-segment {
          flex: 1;
        }
        
        .gauge-marker {
          position: absolute;
          top: -4px;
          width: 4px;
          height: 20px;
          background: var(--text-primary);
          border-radius: 2px;
          transform: translateX(-50%);
          box-shadow: 0 0 0 2px white;
        }
        
        .gauge-scale {
          display: flex;
          justify-content: space-between;
          margin-top: 4px;
          font-family: var(--font-mono, monospace);
          font-size: 10px;
          color: var(--text-muted);
        }
        
        .gauge-status {
          text-align: center;
        }
        
        .status-level {
          font-size: 16px;
          font-weight: 600;
          display: block;
        }
        
        .status-desc {
          font-size: 12px;
          color: var(--text-secondary);
        }
        
        .visibility-card {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 12px;
          border-radius: 8px;
          margin-bottom: 12px;
        }
        
        .visibility-card.visible {
          background: #f0fdf4;
          border: 1px solid #86efac;
        }
        
        .visibility-card.not-visible {
          background: #fef2f2;
          border: 1px solid #fecaca;
        }
        
        .visibility-icon {
          font-size: 20px;
          font-weight: bold;
        }
        
        .visible .visibility-icon { color: #22c55e; }
        .not-visible .visibility-icon { color: #ef4444; }
        
        .visibility-text {
          display: flex;
          flex-direction: column;
          gap: 2px;
        }
        
        .visibility-title {
          font-size: 13px;
          font-weight: 500;
          color: var(--text-primary);
        }
        
        .visibility-detail {
          font-size: 11px;
          color: var(--text-secondary);
        }
        
        .location-button {
          display: block;
          width: 100%;
          padding: 10px;
          background: transparent;
          border: 1px dashed var(--widget-border);
          border-radius: 8px;
          color: var(--text-secondary);
          font-size: 13px;
          cursor: pointer;
          margin-bottom: 12px;
        }
        
        .solar-wind {
          background: #f8f8f8;
          border-radius: 8px;
          padding: 12px;
          margin-bottom: 12px;
        }
        
        .wind-header {
          font-size: 11px;
          color: var(--text-muted);
          text-transform: uppercase;
          margin-bottom: 8px;
        }
        
        .wind-stats {
          display: flex;
          justify-content: space-around;
        }
        
        .wind-stat {
          display: flex;
          flex-direction: column;
          align-items: center;
        }
        
        .wind-value {
          font-family: var(--font-mono, monospace);
          font-size: 20px;
          font-weight: 600;
          color: var(--text-primary);
        }
        
        .wind-unit {
          font-size: 11px;
          color: var(--text-muted);
        }
        
        .wind-label {
          font-size: 10px;
          color: var(--text-muted);
          text-transform: uppercase;
          margin-top: 2px;
        }
        
        .forecast-bar {
          margin-bottom: 12px;
        }
        
        .forecast-header {
          font-size: 11px;
          color: var(--text-muted);
          text-transform: uppercase;
          margin-bottom: 8px;
        }
        
        .forecast-items {
          display: flex;
          gap: 4px;
          height: 60px;
        }
        
        .forecast-item {
          flex: 1;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: flex-end;
          background: #f5f5f5;
          border-radius: 4px;
          overflow: hidden;
          position: relative;
        }
        
        .forecast-bar-fill {
          width: 100%;
          position: absolute;
          bottom: 16px;
          border-radius: 2px 2px 0 0;
        }
        
        .forecast-time {
          font-size: 9px;
          color: var(--text-muted);
          padding: 2px;
          position: relative;
          z-index: 1;
        }
        
        .aurora-tips {
          padding: 12px;
          background: #fafafa;
          border-radius: 8px;
          margin-bottom: 12px;
        }
        
        .aurora-tips p {
          font-size: 12px;
          color: var(--text-secondary);
          margin: 0;
          line-height: 1.5;
        }
        
        .data-source {
          text-align: center;
          font-size: 10px;
          color: var(--text-muted);
        }
        
        /* Touch adjustments */
        .touch-device .gauge-value {
          font-size: 56px;
        }
        
        .touch-device .location-button {
          padding: 14px;
          font-size: 15px;
        }
      `}</style>
    </div>
  );
}