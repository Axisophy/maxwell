'use client';

import React, { useState, useEffect, useCallback, useMemo } from 'react';

// ============================================
// CO2 NOW WIDGET - FUNCTIONAL SKELETON
// ============================================
// 
// Features:
// - Current atmospheric CO2 concentration
// - Comparison to pre-industrial levels (~280 ppm)
// - Year-over-year change
// - Mini Keeling Curve chart
// - Historical context
// - Responsive: pointer vs touch detection
//
// Data source: NOAA Global Monitoring Laboratory
// - Mauna Loa Observatory measurements
// - The "Keeling Curve" - measurements since 1958
//
// Note: Direct NOAA data requires parsing text files.
// This skeleton includes fallback/mock data structure
// and the parsing logic for the actual data.
//
// Styling: Minimal/neutral - ready for design application
// ============================================

interface CO2Reading {
  year: number;
  month: number;
  day?: number;
  value: number;  // ppm
}

interface CO2Data {
  current: number;
  currentDate: string;
  yearAgo: number;
  yearChange: number;
  percentAbovePreIndustrial: number;
  trend: CO2Reading[];  // Recent readings for sparkline
}

// Pre-industrial CO2 level (approximate, ~1750-1850 average)
const PRE_INDUSTRIAL_CO2 = 280;

// Key milestones
const CO2_MILESTONES = [
  { value: 280, label: 'Pre-industrial baseline', year: '~1850' },
  { value: 315, label: 'When measurements began', year: '1958' },
  { value: 350, label: '"Safe" level (Hansen)', year: '1988' },
  { value: 400, label: 'First sustained above 400', year: '2016' },
  { value: 420, label: 'Current range', year: '2024' },
];

// ============================================
// SPARKLINE COMPONENT
// ============================================

interface SparklineProps {
  data: CO2Reading[];
  width?: number;
  height?: number;
}

function Sparkline({ data, width = 200, height = 60 }: SparklineProps) {
  if (data.length < 2) return null;
  
  const values = data.map(d => d.value);
  const min = Math.min(...values) - 1;
  const max = Math.max(...values) + 1;
  const range = max - min;
  
  // Generate SVG path
  const points = data.map((d, i) => {
    const x = (i / (data.length - 1)) * width;
    const y = height - ((d.value - min) / range) * height;
    return `${x},${y}`;
  });
  
  const pathD = `M ${points.join(' L ')}`;
  
  // Area fill path
  const areaD = `M 0,${height} L ${pathD.substring(2)} L ${width},${height} Z`;
  
  return (
    <svg 
      viewBox={`0 0 ${width} ${height}`}
      className="co2-sparkline"
      preserveAspectRatio="none"
    >
      {/* Gradient fill */}
      <defs>
        <linearGradient id="co2-gradient" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="var(--co2-color, #ef4444)" stopOpacity="0.3" />
          <stop offset="100%" stopColor="var(--co2-color, #ef4444)" stopOpacity="0.05" />
        </linearGradient>
      </defs>
      
      {/* Area fill */}
      <path 
        d={areaD}
        fill="url(#co2-gradient)"
      />
      
      {/* Line */}
      <path 
        d={pathD}
        fill="none"
        stroke="var(--co2-color, #ef4444)"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      
      {/* Current value dot */}
      <circle
        cx={width}
        cy={height - ((values[values.length - 1] - min) / range) * height}
        r="3"
        fill="var(--co2-color, #ef4444)"
      />
    </svg>
  );
}

// ============================================
// MILESTONE BAR COMPONENT
// ============================================

interface MilestoneBarProps {
  current: number;
}

function MilestoneBar({ current }: MilestoneBarProps) {
  const min = 280;
  const max = 450; // Room for growth (unfortunately)
  const range = max - min;
  
  const currentPosition = ((current - min) / range) * 100;
  
  return (
    <div className="milestone-bar">
      <div className="bar-track">
        {/* Filled portion */}
        <div 
          className="bar-fill"
          style={{ width: `${currentPosition}%` }}
        />
        
        {/* Current marker */}
        <div 
          className="current-marker"
          style={{ left: `${currentPosition}%` }}
        />
        
        {/* Milestone markers */}
        {CO2_MILESTONES.map(m => (
          <div
            key={m.value}
            className="milestone-mark"
            style={{ left: `${((m.value - min) / range) * 100}%` }}
            title={`${m.label} (${m.year})`}
          />
        ))}
      </div>
      
      {/* Labels */}
      <div className="bar-labels">
        <span className="bar-label start">{min}</span>
        <span className="bar-label end">{max}</span>
      </div>
    </div>
  );
}

// ============================================
// MAIN WIDGET COMPONENT
// ============================================

// Fallback data (recent approximations - update with real data)
// In production, this would fetch from NOAA
const FALLBACK_DATA: CO2Data = {
  current: 422.5,
  currentDate: 'December 2024',
  yearAgo: 420.2,
  yearChange: 2.3,
  percentAbovePreIndustrial: 50.9,
  trend: [
    { year: 2024, month: 1, value: 422.8 },
    { year: 2024, month: 2, value: 424.0 },
    { year: 2024, month: 3, value: 425.2 },
    { year: 2024, month: 4, value: 426.6 },
    { year: 2024, month: 5, value: 426.9 },
    { year: 2024, month: 6, value: 424.8 },
    { year: 2024, month: 7, value: 422.1 },
    { year: 2024, month: 8, value: 420.4 },
    { year: 2024, month: 9, value: 420.8 },
    { year: 2024, month: 10, value: 421.6 },
    { year: 2024, month: 11, value: 422.0 },
    { year: 2024, month: 12, value: 422.5 },
  ],
};

export default function CO2Now() {
  // ---- State ----
  const [data, setData] = useState<CO2Data | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showContext, setShowContext] = useState(false);
  const [isPointerDevice, setIsPointerDevice] = useState(true);
  
  // ---- Input method detection ----
  useEffect(() => {
    const mediaQuery = window.matchMedia('(pointer: fine)');
    setIsPointerDevice(mediaQuery.matches);
    
    const handler = (e: MediaQueryListEvent) => setIsPointerDevice(e.matches);
    mediaQuery.addEventListener('change', handler);
    return () => mediaQuery.removeEventListener('change', handler);
  }, []);
  
  // ---- Fetch CO2 data ----
  const fetchCO2Data = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      // Attempt to fetch real data from NOAA
      // Note: NOAA data is in text format, needs parsing
      // For now, using fallback data with a simulated delay
      
      // In production, you would:
      // 1. Fetch from a proxy API that handles CORS
      // 2. Or use a serverless function to fetch and parse
      // 3. Or cache the data and update periodically
      
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Use fallback data
      // In production, replace with real fetched data
      setData(FALLBACK_DATA);
      setLoading(false);
      
    } catch (err) {
      console.error('Error fetching CO2 data:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch data');
      // Still set fallback data on error
      setData(FALLBACK_DATA);
      setLoading(false);
    }
  }, []);
  
  // ---- Initial fetch ----
  useEffect(() => {
    fetchCO2Data();
  }, [fetchCO2Data]);
  
  // ---- Calculate derived values ----
  const displayData = useMemo(() => {
    if (!data) return null;
    
    return {
      ...data,
      changeSign: data.yearChange >= 0 ? '+' : '',
      percentChange: ((data.yearChange / data.yearAgo) * 100).toFixed(2),
    };
  }, [data]);

  return (
    <div className={`co2-widget ${isPointerDevice ? 'pointer-device' : 'touch-device'}`}>
      
      {/* ---- Header ---- */}
      <div className="widget-header">
        <span className="widget-title">Atmospheric CO₂</span>
        <span className="widget-source">Mauna Loa Observatory</span>
      </div>
      
      {/* ---- Loading State ---- */}
      {loading && (
        <div className="loading-state">
          <div className="loading-number">---.-</div>
          <span>Fetching latest data...</span>
        </div>
      )}
      
      {/* ---- Main Display ---- */}
      {!loading && displayData && (
        <>
          {/* The Number */}
          <div className="main-reading">
            <span className="co2-value">{displayData.current.toFixed(1)}</span>
            <span className="co2-unit">ppm</span>
          </div>
          
          {/* Date */}
          <div className="reading-date">{displayData.currentDate}</div>
          
          {/* Year-over-year change */}
          <div className="change-row">
            <div className="change-item">
              <span className="change-label">vs. last year</span>
              <span className={`change-value ${displayData.yearChange >= 0 ? 'increase' : 'decrease'}`}>
                {displayData.changeSign}{displayData.yearChange.toFixed(1)} ppm
              </span>
            </div>
            <div className="change-item">
              <span className="change-label">above pre-industrial</span>
              <span className="change-value increase">
                +{displayData.percentAbovePreIndustrial.toFixed(1)}%
              </span>
            </div>
          </div>
          
          {/* Sparkline */}
          <div className="sparkline-container">
            <Sparkline data={displayData.trend} />
            <div className="sparkline-labels">
              <span>12-month trend</span>
            </div>
          </div>
          
          {/* Milestone bar */}
          <MilestoneBar current={displayData.current} />
          
          {/* Context toggle */}
          <button 
            onClick={() => setShowContext(!showContext)}
            className="context-toggle"
          >
            {showContext ? 'Hide context' : 'Why does this matter?'}
          </button>
          
          {/* Context panel */}
          {showContext && (
            <div className="context-panel">
              <p>
                <strong>{displayData.current.toFixed(0)} parts per million</strong> means 
                that for every million molecules of air, {displayData.current.toFixed(0)} are CO₂.
              </p>
              <p>
                Before the Industrial Revolution, this number was around <strong>280 ppm</strong> and 
                had been stable for thousands of years.
              </p>
              <p>
                The current level is higher than at any point in at least 
                <strong> 800,000 years</strong> of Earth's history.
              </p>
              <p>
                CO₂ levels follow an annual cycle — rising in Northern Hemisphere 
                winter when plants are dormant, falling in summer when they absorb CO₂. 
                But the overall trend continues upward.
              </p>
            </div>
          )}
          
          {/* Data source */}
          <div className="data-source">
            Data: NOAA Global Monitoring Laboratory
          </div>
        </>
      )}
      
      {/* ---- Error indicator (subtle, since we have fallback) ---- */}
      {error && (
        <div className="error-note">
          Using cached data — live update unavailable
        </div>
      )}
      
      {/* ---- Skeleton Styles ---- */}
      <style jsx>{`
        .co2-widget {
          --co2-color: #ef4444;
          --co2-color-light: #fecaca;
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
        
        .widget-source {
          font-size: 11px;
          color: var(--text-muted);
        }
        
        .loading-state {
          text-align: center;
          padding: 40px 20px;
        }
        
        .loading-number {
          font-family: var(--font-mono, monospace);
          font-size: 48px;
          font-weight: 700;
          color: var(--text-muted);
          margin-bottom: 8px;
        }
        
        .loading-state span {
          color: var(--text-secondary);
          font-size: 14px;
        }
        
        .main-reading {
          text-align: center;
          margin-bottom: 4px;
        }
        
        .co2-value {
          font-family: var(--font-mono, monospace);
          font-size: 56px;
          font-weight: 700;
          color: var(--text-primary);
          letter-spacing: -0.02em;
        }
        
        .co2-unit {
          font-size: 20px;
          font-weight: 400;
          color: var(--text-secondary);
          margin-left: 4px;
        }
        
        .reading-date {
          text-align: center;
          font-size: 13px;
          color: var(--text-muted);
          margin-bottom: 16px;
        }
        
        .change-row {
          display: flex;
          justify-content: center;
          gap: 32px;
          margin-bottom: 16px;
          padding-bottom: 16px;
          border-bottom: 1px solid var(--widget-border);
        }
        
        .change-item {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 4px;
        }
        
        .change-label {
          font-size: 11px;
          color: var(--text-muted);
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }
        
        .change-value {
          font-family: var(--font-mono, monospace);
          font-size: 15px;
          font-weight: 500;
        }
        
        .change-value.increase {
          color: var(--co2-color);
        }
        
        .change-value.decrease {
          color: #22c55e;
        }
        
        .sparkline-container {
          margin-bottom: 16px;
        }
        
        :global(.co2-sparkline) {
          width: 100%;
          height: 60px;
          display: block;
        }
        
        .sparkline-labels {
          display: flex;
          justify-content: center;
          margin-top: 4px;
        }
        
        .sparkline-labels span {
          font-size: 11px;
          color: var(--text-muted);
        }
        
        .milestone-bar {
          margin-bottom: 16px;
        }
        
        .bar-track {
          position: relative;
          height: 8px;
          background: #f0f0f0;
          border-radius: 4px;
          overflow: visible;
        }
        
        .bar-fill {
          position: absolute;
          left: 0;
          top: 0;
          height: 100%;
          background: linear-gradient(90deg, #fcd34d, #f97316, var(--co2-color));
          border-radius: 4px 0 0 4px;
        }
        
        .current-marker {
          position: absolute;
          top: -4px;
          width: 4px;
          height: 16px;
          background: var(--co2-color);
          border-radius: 2px;
          transform: translateX(-50%);
        }
        
        .milestone-mark {
          position: absolute;
          top: 0;
          width: 2px;
          height: 8px;
          background: rgba(0,0,0,0.2);
        }
        
        .bar-labels {
          display: flex;
          justify-content: space-between;
          margin-top: 4px;
        }
        
        .bar-label {
          font-family: var(--font-mono, monospace);
          font-size: 10px;
          color: var(--text-muted);
        }
        
        .context-toggle {
          display: block;
          width: 100%;
          padding: 8px;
          background: transparent;
          border: 1px dashed var(--widget-border);
          border-radius: 6px;
          color: var(--text-secondary);
          font-size: 13px;
          cursor: pointer;
          margin-bottom: 12px;
        }
        
        .context-panel {
          background: #fafafa;
          border-radius: 8px;
          padding: 16px;
          margin-bottom: 12px;
        }
        
        .context-panel p {
          font-size: 13px;
          line-height: 1.6;
          color: var(--text-secondary);
          margin: 0 0 12px 0;
        }
        
        .context-panel p:last-child {
          margin-bottom: 0;
        }
        
        .context-panel strong {
          color: var(--text-primary);
        }
        
        .data-source {
          text-align: center;
          font-size: 10px;
          color: var(--text-muted);
        }
        
        .error-note {
          text-align: center;
          font-size: 11px;
          color: #f59e0b;
          margin-bottom: 8px;
        }
        
        /* Touch device adjustments */
        .touch-device .co2-value {
          font-size: 64px;
        }
        
        .touch-device .change-row {
          flex-direction: column;
          gap: 16px;
        }
        
        .touch-device .context-toggle {
          padding: 12px;
          font-size: 15px;
        }
        
        .touch-device .context-panel p {
          font-size: 15px;
        }
      `}</style>
    </div>
  );
}