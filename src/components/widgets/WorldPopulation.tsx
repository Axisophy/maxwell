'use client';

import React, { useState, useEffect, useRef, useMemo } from 'react';

// ============================================
// WORLD POPULATION WIDGET - FUNCTIONAL SKELETON
// ============================================
// 
// Features:
// - Live population counter (estimated)
// - Birth/death rate visualization
// - Population milestones
// - Growth rate context
// - Animated number transitions
// - Responsive: pointer vs touch detection
//
// Data: UN World Population Prospects estimates
// - Base population + growth rate extrapolation
// - Updated annually from UN data
//
// Styling: Minimal/neutral - ready for design application
// ============================================

// UN World Population Prospects 2024 data
// Base: ~8.1 billion as of mid-2024
const POPULATION_DATA = {
  basePopulation: 8_100_000_000,
  baseDate: new Date('2024-07-01T00:00:00Z'),
  
  // Per year rates (2024 estimates)
  birthsPerYear: 140_000_000,      // ~140 million births/year
  deathsPerYear: 60_000_000,       // ~60 million deaths/year
  netGrowthPerYear: 80_000_000,    // ~80 million net growth
  
  // Derived per-second rates
  get birthsPerSecond() { return this.birthsPerYear / (365.25 * 24 * 60 * 60); },
  get deathsPerSecond() { return this.deathsPerYear / (365.25 * 24 * 60 * 60); },
  get growthPerSecond() { return this.netGrowthPerYear / (365.25 * 24 * 60 * 60); },
};

// Historical milestones
const MILESTONES = [
  { year: 1804, population: 1_000_000_000, label: '1 billion' },
  { year: 1927, population: 2_000_000_000, label: '2 billion' },
  { year: 1960, population: 3_000_000_000, label: '3 billion' },
  { year: 1974, population: 4_000_000_000, label: '4 billion' },
  { year: 1987, population: 5_000_000_000, label: '5 billion' },
  { year: 1999, population: 6_000_000_000, label: '6 billion' },
  { year: 2011, population: 7_000_000_000, label: '7 billion' },
  { year: 2022, population: 8_000_000_000, label: '8 billion' },
  { year: 2037, population: 9_000_000_000, label: '9 billion (projected)' },
];

// Format large numbers with commas
function formatNumber(n: number): string {
  return Math.floor(n).toLocaleString();
}

// ============================================
// ANIMATED COUNTER COMPONENT
// ============================================

interface AnimatedCounterProps {
  value: number;
  label: string;
  color?: string;
  size?: 'large' | 'small';
}

function AnimatedCounter({ value, label, color, size = 'small' }: AnimatedCounterProps) {
  const formatted = formatNumber(value);
  
  return (
    <div className={`animated-counter ${size}`}>
      <span className="counter-value" style={{ color }}>
        {formatted}
      </span>
      <span className="counter-label">{label}</span>
      
      <style jsx>{`
        .animated-counter {
          display: flex;
          flex-direction: column;
          align-items: center;
        }
        
        .counter-value {
          font-family: var(--font-mono, monospace);
          font-variant-numeric: tabular-nums;
          letter-spacing: -0.02em;
        }
        
        .animated-counter.large .counter-value {
          font-size: 36px;
          font-weight: 700;
        }
        
        .animated-counter.small .counter-value {
          font-size: 18px;
          font-weight: 600;
        }
        
        .counter-label {
          font-size: 11px;
          color: var(--text-muted, #999);
          text-transform: uppercase;
          letter-spacing: 0.05em;
          margin-top: 4px;
        }
      `}</style>
    </div>
  );
}

// ============================================
// RATE VISUALIZER COMPONENT
// ============================================

interface RateVisualizerProps {
  birthsPerSecond: number;
  deathsPerSecond: number;
}

function RateVisualizer({ birthsPerSecond, deathsPerSecond }: RateVisualizerProps) {
  const [birthPulse, setBirthPulse] = useState(false);
  const [deathPulse, setDeathPulse] = useState(false);
  
  // Pulse animations at realistic intervals
  useEffect(() => {
    const birthInterval = 1000 / birthsPerSecond;  // ~220ms
    const deathInterval = 1000 / deathsPerSecond;  // ~530ms
    
    const birthTimer = setInterval(() => {
      setBirthPulse(true);
      setTimeout(() => setBirthPulse(false), 150);
    }, birthInterval);
    
    const deathTimer = setInterval(() => {
      setDeathPulse(true);
      setTimeout(() => setDeathPulse(false), 150);
    }, deathInterval);
    
    return () => {
      clearInterval(birthTimer);
      clearInterval(deathTimer);
    };
  }, [birthsPerSecond, deathsPerSecond]);
  
  return (
    <div className="rate-visualizer">
      <div className={`rate-item birth ${birthPulse ? 'pulse' : ''}`}>
        <span className="rate-icon">●</span>
        <span className="rate-value">{birthsPerSecond.toFixed(1)}</span>
        <span className="rate-label">births/sec</span>
      </div>
      
      <div className={`rate-item death ${deathPulse ? 'pulse' : ''}`}>
        <span className="rate-icon">●</span>
        <span className="rate-value">{deathsPerSecond.toFixed(1)}</span>
        <span className="rate-label">deaths/sec</span>
      </div>
      
      <style jsx>{`
        .rate-visualizer {
          display: flex;
          justify-content: space-around;
          padding: 12px;
          background: #f8f8f8;
          border-radius: 8px;
        }
        
        .rate-item {
          display: flex;
          align-items: center;
          gap: 8px;
          transition: transform 0.1s;
        }
        
        .rate-item.pulse {
          transform: scale(1.05);
        }
        
        .rate-icon {
          font-size: 12px;
          transition: opacity 0.15s;
        }
        
        .rate-item.birth .rate-icon {
          color: #22c55e;
        }
        
        .rate-item.death .rate-icon {
          color: #64748b;
        }
        
        .rate-item.pulse .rate-icon {
          opacity: 1;
        }
        
        .rate-value {
          font-family: var(--font-mono, monospace);
          font-size: 16px;
          font-weight: 600;
          color: var(--text-primary, #000);
        }
        
        .rate-label {
          font-size: 11px;
          color: var(--text-muted, #999);
        }
      `}</style>
    </div>
  );
}

// ============================================
// MAIN WIDGET COMPONENT
// ============================================

export default function WorldPopulation() {
  // ---- State ----
  const [population, setPopulation] = useState(POPULATION_DATA.basePopulation);
  const [todayBirths, setTodayBirths] = useState(0);
  const [todayDeaths, setTodayDeaths] = useState(0);
  const startTimeRef = useRef(Date.now());
  const [isPointerDevice, setIsPointerDevice] = useState(true);
  
  // ---- Input method detection ----
  useEffect(() => {
    const mediaQuery = window.matchMedia('(pointer: fine)');
    setIsPointerDevice(mediaQuery.matches);
    
    const handler = (e: MediaQueryListEvent) => setIsPointerDevice(e.matches);
    mediaQuery.addEventListener('change', handler);
    return () => mediaQuery.removeEventListener('change', handler);
  }, []);
  
  // ---- Calculate current population ----
  useEffect(() => {
    const updatePopulation = () => {
      const now = Date.now();
      const secondsSinceBase = (now - POPULATION_DATA.baseDate.getTime()) / 1000;
      const currentPop = POPULATION_DATA.basePopulation + (secondsSinceBase * POPULATION_DATA.growthPerSecond);
      setPopulation(currentPop);
      
      // Today's counts (since midnight UTC)
      const today = new Date();
      today.setUTCHours(0, 0, 0, 0);
      const secondsToday = (now - today.getTime()) / 1000;
      setTodayBirths(secondsToday * POPULATION_DATA.birthsPerSecond);
      setTodayDeaths(secondsToday * POPULATION_DATA.deathsPerSecond);
    };
    
    updatePopulation();
    const interval = setInterval(updatePopulation, 100); // Update 10x per second for smooth counter
    
    return () => clearInterval(interval);
  }, []);
  
  // ---- Growth this session ----
  const sessionGrowth = useMemo(() => {
    const elapsed = (Date.now() - startTimeRef.current) / 1000;
    return Math.floor(elapsed * POPULATION_DATA.growthPerSecond);
  }, [population]);
  
  // ---- Next milestone ----
  const nextMilestone = useMemo(() => {
    return MILESTONES.find(m => m.population > population);
  }, [population]);

  return (
    <div className={`population-widget ${isPointerDevice ? 'pointer-device' : 'touch-device'}`}>
      
      {/* ---- Header ---- */}
      <div className="widget-header">
        <span className="widget-title">World Population</span>
        <span className="widget-subtitle">Live estimate</span>
      </div>
      
      {/* ---- Main counter ---- */}
      <div className="main-counter">
        <AnimatedCounter 
          value={population} 
          label="humans on Earth"
          size="large"
        />
      </div>
      
      {/* ---- Rate visualization ---- */}
      <RateVisualizer 
        birthsPerSecond={POPULATION_DATA.birthsPerSecond}
        deathsPerSecond={POPULATION_DATA.deathsPerSecond}
      />
      
      {/* ---- Today's stats ---- */}
      <div className="today-stats">
        <div className="stat-row">
          <span className="stat-label">Today's births</span>
          <span className="stat-value births">{formatNumber(todayBirths)}</span>
        </div>
        <div className="stat-row">
          <span className="stat-label">Today's deaths</span>
          <span className="stat-value deaths">{formatNumber(todayDeaths)}</span>
        </div>
        <div className="stat-row highlight">
          <span className="stat-label">Net growth today</span>
          <span className="stat-value growth">+{formatNumber(todayBirths - todayDeaths)}</span>
        </div>
      </div>
      
      {/* ---- Session counter ---- */}
      <div className="session-counter">
        <span className="session-label">Since you opened this widget:</span>
        <span className="session-value">+{formatNumber(sessionGrowth)} people</span>
      </div>
      
      {/* ---- Next milestone ---- */}
      {nextMilestone && (
        <div className="next-milestone">
          <span className="milestone-label">Next milestone</span>
          <span className="milestone-value">{nextMilestone.label}</span>
          <span className="milestone-year">~{nextMilestone.year}</span>
        </div>
      )}
      
      {/* ---- Context ---- */}
      <div className="context-note">
        Growth rate: {((POPULATION_DATA.netGrowthPerYear / POPULATION_DATA.basePopulation) * 100).toFixed(2)}% per year
      </div>
      
      {/* ---- Data source ---- */}
      <div className="data-source">
        Data: UN World Population Prospects 2024
      </div>
      
      {/* ---- Skeleton Styles ---- */}
      <style jsx>{`
        .population-widget {
          --widget-bg: #ffffff;
          --widget-border: #e0e0e0;
          --text-primary: #000000;
          --text-secondary: #666666;
          --text-muted: #999999;
          --birth-color: #22c55e;
          --death-color: #64748b;
          --growth-color: #0ea5e9;
          
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
        
        .main-counter {
          text-align: center;
          padding: 16px 0;
          margin-bottom: 16px;
        }
        
        .today-stats {
          margin: 16px 0;
          padding: 12px;
          background: #fafafa;
          border-radius: 8px;
        }
        
        .stat-row {
          display: flex;
          justify-content: space-between;
          padding: 4px 0;
        }
        
        .stat-row.highlight {
          border-top: 1px solid var(--widget-border);
          margin-top: 8px;
          padding-top: 8px;
        }
        
        .stat-label {
          font-size: 12px;
          color: var(--text-secondary);
        }
        
        .stat-value {
          font-family: var(--font-mono, monospace);
          font-size: 13px;
          font-weight: 500;
        }
        
        .stat-value.births { color: var(--birth-color); }
        .stat-value.deaths { color: var(--death-color); }
        .stat-value.growth { color: var(--growth-color); }
        
        .session-counter {
          text-align: center;
          padding: 12px;
          background: linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%);
          border-radius: 8px;
          margin-bottom: 12px;
        }
        
        .session-label {
          display: block;
          font-size: 11px;
          color: var(--text-muted);
          margin-bottom: 4px;
        }
        
        .session-value {
          font-family: var(--font-mono, monospace);
          font-size: 18px;
          font-weight: 600;
          color: var(--growth-color);
        }
        
        .next-milestone {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 8px 12px;
          background: #fafafa;
          border-radius: 6px;
          margin-bottom: 12px;
        }
        
        .milestone-label {
          font-size: 11px;
          color: var(--text-muted);
        }
        
        .milestone-value {
          font-size: 13px;
          font-weight: 500;
          color: var(--text-primary);
        }
        
        .milestone-year {
          font-family: var(--font-mono, monospace);
          font-size: 12px;
          color: var(--text-secondary);
        }
        
        .context-note {
          text-align: center;
          font-size: 11px;
          color: var(--text-muted);
          margin-bottom: 8px;
        }
        
        .data-source {
          text-align: center;
          font-size: 10px;
          color: var(--text-muted);
        }
        
        /* Touch adjustments */
        .touch-device .main-counter :global(.counter-value) {
          font-size: 42px;
        }
      `}</style>
    </div>
  );
}