'use client';

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { format } from 'date-fns';

// ============================================
// AIR QUALITY WIDGET - FUNCTIONAL SKELETON
// ============================================
// 
// Features:
// - Current air quality index
// - Pollutant breakdown (PM2.5, PM10, NO2, O3)
// - Health recommendations
// - Location-based or default city
// - Historical comparison
// - Responsive: pointer vs touch detection
//
// Data source: OpenAQ API (global) with UK focus option
// - https://api.openaq.org/v2/
// - Free API, good coverage
//
// Styling: Minimal/neutral - ready for design application
// ============================================

interface AQReading {
  parameter: string;  // pm25, pm10, no2, o3, co, so2
  value: number;
  unit: string;
  lastUpdated: string;
}

interface LocationData {
  name: string;
  city: string;
  country: string;
  coordinates: { latitude: number; longitude: number };
  readings: AQReading[];
}

// AQI categories based on PM2.5 (simplified US EPA scale)
function getAQICategory(pm25: number): { 
  level: string; 
  color: string; 
  description: string;
  health: string;
} {
  if (pm25 <= 12) return { 
    level: 'Good', 
    color: '#22c55e', 
    description: 'Air quality is satisfactory',
    health: 'Ideal for outdoor activities'
  };
  if (pm25 <= 35.4) return { 
    level: 'Moderate', 
    color: '#eab308', 
    description: 'Air quality is acceptable',
    health: 'Unusually sensitive people should consider reducing outdoor activity'
  };
  if (pm25 <= 55.4) return { 
    level: 'Unhealthy for Sensitive Groups', 
    color: '#f97316', 
    description: 'May affect sensitive groups',
    health: 'People with respiratory conditions should limit outdoor exertion'
  };
  if (pm25 <= 150.4) return { 
    level: 'Unhealthy', 
    color: '#ef4444', 
    description: 'Everyone may experience effects',
    health: 'Everyone should reduce prolonged outdoor exertion'
  };
  if (pm25 <= 250.4) return { 
    level: 'Very Unhealthy', 
    color: '#7c3aed', 
    description: 'Health alert',
    health: 'Everyone should avoid outdoor exertion'
  };
  return { 
    level: 'Hazardous', 
    color: '#7f1d1d', 
    description: 'Emergency conditions',
    health: 'Everyone should avoid all outdoor activity'
  };
}

// Convert PM2.5 to AQI (simplified)
function pm25ToAQI(pm25: number): number {
  if (pm25 <= 12) return Math.round((50 / 12) * pm25);
  if (pm25 <= 35.4) return Math.round(50 + ((100 - 51) / (35.4 - 12.1)) * (pm25 - 12.1));
  if (pm25 <= 55.4) return Math.round(100 + ((150 - 101) / (55.4 - 35.5)) * (pm25 - 35.5));
  if (pm25 <= 150.4) return Math.round(150 + ((200 - 151) / (150.4 - 55.5)) * (pm25 - 55.5));
  if (pm25 <= 250.4) return Math.round(200 + ((300 - 201) / (250.4 - 150.5)) * (pm25 - 150.5));
  return Math.round(300 + ((500 - 301) / (500.4 - 250.5)) * (pm25 - 250.5));
}

// Pollutant display info
const POLLUTANTS: Record<string, { name: string; unit: string; who: number }> = {
  pm25: { name: 'PM2.5', unit: 'μg/m³', who: 15 },
  pm10: { name: 'PM10', unit: 'μg/m³', who: 45 },
  no2: { name: 'NO₂', unit: 'μg/m³', who: 25 },
  o3: { name: 'O₃', unit: 'μg/m³', who: 100 },
  so2: { name: 'SO₂', unit: 'μg/m³', who: 40 },
  co: { name: 'CO', unit: 'μg/m³', who: 4000 },
};

// ============================================
// AQI GAUGE COMPONENT
// ============================================

interface AQIGaugeProps {
  aqi: number;
  pm25: number;
}

function AQIGauge({ aqi, pm25 }: AQIGaugeProps) {
  const category = getAQICategory(pm25);
  const percentage = Math.min(100, (aqi / 300) * 100);
  
  return (
    <div className="aqi-gauge">
      <div className="gauge-circle" style={{ borderColor: category.color }}>
        <span className="gauge-value" style={{ color: category.color }}>{aqi}</span>
        <span className="gauge-label">AQI</span>
      </div>
      
      <div className="gauge-info">
        <span className="gauge-level" style={{ color: category.color }}>
          {category.level}
        </span>
        <span className="gauge-description">{category.description}</span>
      </div>
    </div>
  );
}

// ============================================
// POLLUTANT BAR COMPONENT
// ============================================

interface PollutantBarProps {
  reading: AQReading;
}

function PollutantBar({ reading }: PollutantBarProps) {
  const info = POLLUTANTS[reading.parameter] || { name: reading.parameter, unit: reading.unit, who: 100 };
  const percentage = Math.min(100, (reading.value / (info.who * 2)) * 100);
  const exceedsWHO = reading.value > info.who;
  
  return (
    <div className="pollutant-bar">
      <div className="pollutant-header">
        <span className="pollutant-name">{info.name}</span>
        <span className={`pollutant-value ${exceedsWHO ? 'exceeds' : ''}`}>
          {reading.value.toFixed(1)} {info.unit}
        </span>
      </div>
      
      <div className="pollutant-track">
        <div 
          className="pollutant-fill"
          style={{ 
            width: `${percentage}%`,
            backgroundColor: exceedsWHO ? '#ef4444' : '#22c55e'
          }}
        />
        <div 
          className="who-marker"
          style={{ left: `${Math.min(100, (info.who / (info.who * 2)) * 100)}%` }}
          title={`WHO guideline: ${info.who} ${info.unit}`}
        />
      </div>
    </div>
  );
}

// ============================================
// MAIN WIDGET COMPONENT
// ============================================

// Default cities for quick selection
const DEFAULT_CITIES = [
  { name: 'London', country: 'GB' },
  { name: 'Manchester', country: 'GB' },
  { name: 'Edinburgh', country: 'GB' },
  { name: 'Birmingham', country: 'GB' },
];

export default function AirQuality() {
  // ---- State ----
  const [location, setLocation] = useState<LocationData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedCity, setSelectedCity] = useState(DEFAULT_CITIES[0]);
  const [userLocation, setUserLocation] = useState<{ lat: number; lon: number } | null>(null);
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
  
  // ---- Request user location ----
  const requestLocation = () => {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lon: position.coords.longitude,
          });
        },
        (error) => console.log('Location denied:', error.message)
      );
    }
  };
  
  // ---- Fetch air quality data ----
  const fetchAirQuality = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      let url = 'https://api.openaq.org/v2/latest?';
      
      if (userLocation) {
        url += `coordinates=${userLocation.lat},${userLocation.lon}&radius=25000&limit=1`;
      } else {
        url += `city=${selectedCity.name}&country=${selectedCity.country}&limit=1`;
      }
      
      const response = await fetch(url, {
        headers: {
          'Accept': 'application/json',
        }
      });
      
      if (!response.ok) throw new Error('Failed to fetch air quality data');
      
      const data = await response.json();
      
      if (data.results && data.results.length > 0) {
        const result = data.results[0];
        
        const locationData: LocationData = {
          name: result.location,
          city: result.city || selectedCity.name,
          country: result.country,
          coordinates: result.coordinates,
          readings: result.measurements.map((m: any) => ({
            parameter: m.parameter,
            value: m.value,
            unit: m.unit,
            lastUpdated: m.lastUpdated,
          })),
        };
        
        setLocation(locationData);
        setLastUpdate(new Date());
      } else {
        // No data, use fallback
        throw new Error('No air quality data available for this location');
      }
      
      setLoading(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
      setLoading(false);
    }
  }, [selectedCity, userLocation]);
  
  // ---- Fetch on mount and city change ----
  useEffect(() => {
    fetchAirQuality();
    
    // Refresh every 30 minutes
    const interval = setInterval(fetchAirQuality, 30 * 60 * 1000);
    return () => clearInterval(interval);
  }, [fetchAirQuality]);
  
  // ---- Calculate AQI from PM2.5 ----
  const aqiData = useMemo(() => {
    if (!location) return null;
    
    const pm25Reading = location.readings.find(r => r.parameter === 'pm25');
    if (!pm25Reading) return null;
    
    const aqi = pm25ToAQI(pm25Reading.value);
    const category = getAQICategory(pm25Reading.value);
    
    return { aqi, pm25: pm25Reading.value, category };
  }, [location]);

  return (
    <div className={`air-quality-widget ${isPointerDevice ? 'pointer-device' : 'touch-device'}`}>
      
      {/* ---- Header ---- */}
      <div className="widget-header">
        <span className="widget-title">Air Quality</span>
        {lastUpdate && (
          <span className="last-update">
            {format(lastUpdate, 'HH:mm')}
          </span>
        )}
      </div>
      
      {/* ---- Location selector ---- */}
      <div className="location-selector">
        {DEFAULT_CITIES.map(city => (
          <button
            key={city.name}
            className={`city-btn ${selectedCity.name === city.name && !userLocation ? 'active' : ''}`}
            onClick={() => {
              setUserLocation(null);
              setSelectedCity(city);
            }}
          >
            {city.name}
          </button>
        ))}
        <button
          className={`city-btn location-btn ${userLocation ? 'active' : ''}`}
          onClick={requestLocation}
          title="Use my location"
        >
          📍
        </button>
      </div>
      
      {/* ---- Loading State ---- */}
      {loading && (
        <div className="loading-state">
          Checking air quality...
        </div>
      )}
      
      {/* ---- Error State ---- */}
      {error && (
        <div className="error-message">
          {error}
          <button onClick={fetchAirQuality} className="retry-btn">Retry</button>
        </div>
      )}
      
      {/* ---- Main Display ---- */}
      {!loading && !error && location && (
        <>
          {/* Location name */}
          <div className="location-info">
            <span className="location-name">{location.city}</span>
            {location.name && location.name !== location.city && (
              <span className="station-name">{location.name}</span>
            )}
          </div>
          
          {/* AQI Gauge */}
          {aqiData && (
            <>
              <AQIGauge aqi={aqiData.aqi} pm25={aqiData.pm25} />
              
              {/* Health advice */}
              <div className="health-advice">
                <span className="advice-icon">💡</span>
                <span className="advice-text">{aqiData.category.health}</span>
              </div>
            </>
          )}
          
          {/* Pollutant breakdown */}
          <div className="pollutants">
            <div className="pollutants-header">Pollutants</div>
            {location.readings
              .filter(r => ['pm25', 'pm10', 'no2', 'o3'].includes(r.parameter))
              .map(reading => (
                <PollutantBar key={reading.parameter} reading={reading} />
              ))
            }
          </div>
          
          {/* WHO reference */}
          <div className="who-note">
            <span className="who-marker-legend" />
            <span>WHO guideline</span>
          </div>
        </>
      )}
      
      {/* ---- Data source ---- */}
      <div className="data-source">
        Data: OpenAQ
      </div>
      
      {/* ---- Skeleton Styles ---- */}
      <style jsx>{`
        .air-quality-widget {
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
        
        .last-update {
          font-family: var(--font-mono, monospace);
          font-size: 11px;
          color: var(--text-muted);
        }
        
        .location-selector {
          display: flex;
          gap: 4px;
          margin-bottom: 12px;
          flex-wrap: wrap;
        }
        
        .city-btn {
          padding: 4px 10px;
          font-size: 11px;
          background: #f5f5f5;
          border: 1px solid var(--widget-border);
          border-radius: 4px;
          color: var(--text-secondary);
          cursor: pointer;
        }
        
        .city-btn.active {
          background: var(--text-primary);
          color: white;
          border-color: var(--text-primary);
        }
        
        .location-btn {
          padding: 4px 8px;
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
        
        .location-info {
          margin-bottom: 12px;
        }
        
        .location-name {
          font-size: 16px;
          font-weight: 500;
          color: var(--text-primary);
          display: block;
        }
        
        .station-name {
          font-size: 11px;
          color: var(--text-muted);
        }
        
        .aqi-gauge {
          display: flex;
          align-items: center;
          gap: 16px;
          margin-bottom: 16px;
        }
        
        .gauge-circle {
          width: 80px;
          height: 80px;
          border-radius: 50%;
          border: 4px solid;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
        }
        
        .gauge-value {
          font-family: var(--font-mono, monospace);
          font-size: 28px;
          font-weight: 700;
          line-height: 1;
        }
        
        .gauge-label {
          font-size: 10px;
          color: var(--text-muted);
        }
        
        .gauge-info {
          flex: 1;
        }
        
        .gauge-level {
          font-size: 16px;
          font-weight: 600;
          display: block;
          margin-bottom: 4px;
        }
        
        .gauge-description {
          font-size: 12px;
          color: var(--text-secondary);
        }
        
        .health-advice {
          display: flex;
          align-items: flex-start;
          gap: 8px;
          padding: 12px;
          background: #f8f8f8;
          border-radius: 8px;
          margin-bottom: 16px;
        }
        
        .advice-icon {
          font-size: 16px;
        }
        
        .advice-text {
          font-size: 13px;
          color: var(--text-secondary);
          line-height: 1.4;
        }
        
        .pollutants {
          margin-bottom: 12px;
        }
        
        .pollutants-header {
          font-size: 11px;
          color: var(--text-muted);
          text-transform: uppercase;
          margin-bottom: 8px;
        }
        
        .pollutant-bar {
          margin-bottom: 8px;
        }
        
        .pollutant-header {
          display: flex;
          justify-content: space-between;
          margin-bottom: 4px;
        }
        
        .pollutant-name {
          font-size: 12px;
          color: var(--text-primary);
        }
        
        .pollutant-value {
          font-family: var(--font-mono, monospace);
          font-size: 12px;
          color: var(--text-secondary);
        }
        
        .pollutant-value.exceeds {
          color: #ef4444;
          font-weight: 500;
        }
        
        .pollutant-track {
          position: relative;
          height: 6px;
          background: #f0f0f0;
          border-radius: 3px;
          overflow: visible;
        }
        
        .pollutant-fill {
          height: 100%;
          border-radius: 3px;
          transition: width 0.3s;
        }
        
        .who-marker {
          position: absolute;
          top: -2px;
          width: 2px;
          height: 10px;
          background: var(--text-primary);
        }
        
        .who-note {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 10px;
          color: var(--text-muted);
          margin-bottom: 12px;
        }
        
        .who-marker-legend {
          width: 8px;
          height: 8px;
          background: var(--text-primary);
        }
        
        .data-source {
          text-align: center;
          font-size: 10px;
          color: var(--text-muted);
        }
        
        /* Touch adjustments */
        .touch-device .city-btn {
          padding: 8px 14px;
          font-size: 13px;
        }
        
        .touch-device .gauge-circle {
          width: 100px;
          height: 100px;
        }
        
        .touch-device .gauge-value {
          font-size: 36px;
        }
      `}</style>
    </div>
  );
}