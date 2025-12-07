'use client';

import React, { useState, useEffect, useMemo } from 'react';

// ============================================
// NUCLEAR REACTORS WIDGET - FUNCTIONAL SKELETON
// ============================================
// 
// Features:
// - Global nuclear reactor statistics
// - Country breakdown
// - Power generation context
// - Construction pipeline
// - Historical trends
// - Responsive: pointer vs touch detection
//
// Data: IAEA PRIS (Power Reactor Information System)
// Static snapshot - would need API for real-time
//
// Styling: Minimal/neutral - ready for design application
// ============================================

interface CountryReactors {
  country: string;
  code: string;
  operating: number;
  underConstruction: number;
  capacity: number;  // MW
  share: number;     // % of electricity from nuclear
}

// IAEA PRIS data snapshot (as of late 2024)
const REACTOR_DATA: CountryReactors[] = [
  { country: 'United States', code: 'US', operating: 93, underConstruction: 2, capacity: 95523, share: 18.2 },
  { country: 'France', code: 'FR', operating: 56, underConstruction: 1, capacity: 61370, share: 64.8 },
  { country: 'China', code: 'CN', operating: 55, underConstruction: 23, capacity: 53226, share: 5.0 },
  { country: 'Russia', code: 'RU', operating: 37, underConstruction: 4, capacity: 27727, share: 19.6 },
  { country: 'Japan', code: 'JP', operating: 33, underConstruction: 2, capacity: 31679, share: 7.2 },
  { country: 'South Korea', code: 'KR', operating: 26, underConstruction: 2, capacity: 25825, share: 32.2 },
  { country: 'India', code: 'IN', operating: 23, underConstruction: 7, capacity: 7480, share: 3.1 },
  { country: 'Canada', code: 'CA', operating: 19, underConstruction: 0, capacity: 13624, share: 13.6 },
  { country: 'Ukraine', code: 'UA', operating: 15, underConstruction: 2, capacity: 13107, share: 55.0 },
  { country: 'United Kingdom', code: 'GB', operating: 9, underConstruction: 2, capacity: 5883, share: 14.2 },
];

// Global totals
const GLOBAL_STATS = {
  operatingReactors: 440,
  underConstruction: 62,
  totalCapacity: 394000, // MW
  countriesWithReactors: 32,
  globalElectricityShare: 9.2,
  co2Avoided: 2000, // Million tonnes per year
};

// Status color
function getStatusColor(share: number): string {
  if (share >= 50) return '#22c55e';  // High nuclear
  if (share >= 20) return '#84cc16';  // Significant
  if (share >= 10) return '#eab308';  // Moderate
  return '#64748b';                    // Low
}

// ============================================
// COUNTRY BAR COMPONENT
// ============================================

interface CountryBarProps {
  data: CountryReactors;
  maxOperating: number;
}

function CountryBar({ data, maxOperating }: CountryBarProps) {
  const operatingWidth = (data.operating / maxOperating) * 100;
  const constructionWidth = (data.underConstruction / maxOperating) * 100;
  
  return (
    <div className="country-bar">
      <div className="country-info">
        <span className="country-name">{data.country}</span>
        <span className="country-share" style={{ color: getStatusColor(data.share) }}>
          {data.share}%
        </span>
      </div>
      
      <div className="bar-container">
        <div className="bar-track">
          <div 
            className="bar-operating" 
            style={{ width: `${operatingWidth}%` }}
          />
          <div 
            className="bar-construction" 
            style={{ width: `${constructionWidth}%`, left: `${operatingWidth}%` }}
          />
        </div>
        <span className="bar-count">
          {data.operating}
          {data.underConstruction > 0 && ` +${data.underConstruction}`}
        </span>
      </div>
      
      <style jsx>{`
        .country-bar {
          margin-bottom: 8px;
        }
        
        .country-info {
          display: flex;
          justify-content: space-between;
          margin-bottom: 4px;
        }
        
        .country-name {
          font-size: 12px;
          color: var(--text-primary, #000);
        }
        
        .country-share {
          font-family: var(--font-mono, monospace);
          font-size: 11px;
          font-weight: 500;
        }
        
        .bar-container {
          display: flex;
          align-items: center;
          gap: 8px;
        }
        
        .bar-track {
          flex: 1;
          height: 8px;
          background: #f0f0f0;
          border-radius: 4px;
          position: relative;
          overflow: hidden;
        }
        
        .bar-operating {
          position: absolute;
          height: 100%;
          background: linear-gradient(90deg, #22c55e, #16a34a);
          border-radius: 4px;
        }
        
        .bar-construction {
          position: absolute;
          height: 100%;
          background: repeating-linear-gradient(
            45deg,
            #fbbf24,
            #fbbf24 2px,
            #f59e0b 2px,
            #f59e0b 4px
          );
          border-radius: 0 4px 4px 0;
        }
        
        .bar-count {
          font-family: var(--font-mono, monospace);
          font-size: 11px;
          color: var(--text-muted, #999);
          min-width: 40px;
          text-align: right;
        }
      `}</style>
    </div>
  );
}

// ============================================
// MAIN WIDGET COMPONENT
// ============================================

export default function NuclearReactors() {
  // ---- State ----
  const [selectedView, setSelectedView] = useState<'countries' | 'stats'>('countries');
  const [isPointerDevice, setIsPointerDevice] = useState(true);
  
  // ---- Input method detection ----
  useEffect(() => {
    const mediaQuery = window.matchMedia('(pointer: fine)');
    setIsPointerDevice(mediaQuery.matches);
    
    const handler = (e: MediaQueryListEvent) => setIsPointerDevice(e.matches);
    mediaQuery.addEventListener('change', handler);
    return () => mediaQuery.removeEventListener('change', handler);
  }, []);
  
  // ---- Max operating for scale ----
  const maxOperating = useMemo(() => {
    return Math.max(...REACTOR_DATA.map(d => d.operating));
  }, []);

  return (
    <div className={`nuclear-widget ${isPointerDevice ? 'pointer-device' : 'touch-device'}`}>
      
      {/* ---- Header ---- */}
      <div className="widget-header">
        <div className="header-text">
          <span className="widget-title">Nuclear Reactors</span>
          <span className="widget-subtitle">Global Power Generation</span>
        </div>
        <div className="nuclear-icon">☢️</div>
      </div>
      
      {/* ---- Global stats summary ---- */}
      <div className="global-summary">
        <div className="summary-stat main">
          <span className="stat-value">{GLOBAL_STATS.operatingReactors}</span>
          <span className="stat-label">Operating Reactors</span>
        </div>
        <div className="summary-row">
          <div className="summary-stat">
            <span className="stat-value">{GLOBAL_STATS.underConstruction}</span>
            <span className="stat-label">Building</span>
          </div>
          <div className="summary-stat">
            <span className="stat-value">{GLOBAL_STATS.countriesWithReactors}</span>
            <span className="stat-label">Countries</span>
          </div>
          <div className="summary-stat">
            <span className="stat-value">{GLOBAL_STATS.globalElectricityShare}%</span>
            <span className="stat-label">Global Power</span>
          </div>
        </div>
      </div>
      
      {/* ---- View toggle ---- */}
      <div className="view-toggle">
        <button
          className={`toggle-btn ${selectedView === 'countries' ? 'active' : ''}`}
          onClick={() => setSelectedView('countries')}
        >
          By Country
        </button>
        <button
          className={`toggle-btn ${selectedView === 'stats' ? 'active' : ''}`}
          onClick={() => setSelectedView('stats')}
        >
          Impact
        </button>
      </div>
      
      {/* ---- Countries view ---- */}
      {selectedView === 'countries' && (
        <div className="countries-list">
          <div className="list-header">
            <span>Country</span>
            <span>% Nuclear</span>
          </div>
          {REACTOR_DATA.map(country => (
            <CountryBar 
              key={country.code}
              data={country}
              maxOperating={maxOperating}
            />
          ))}
          <div className="legend">
            <span className="legend-item">
              <span className="legend-color operating" />
              Operating
            </span>
            <span className="legend-item">
              <span className="legend-color construction" />
              Under Construction
            </span>
          </div>
        </div>
      )}
      
      {/* ---- Stats view ---- */}
      {selectedView === 'stats' && (
        <div className="stats-view">
          <div className="impact-stat">
            <span className="impact-icon">⚡</span>
            <div className="impact-info">
              <span className="impact-value">{(GLOBAL_STATS.totalCapacity / 1000).toFixed(0)} GW</span>
              <span className="impact-label">Total Capacity</span>
            </div>
          </div>
          
          <div className="impact-stat">
            <span className="impact-icon">🌍</span>
            <div className="impact-info">
              <span className="impact-value">{GLOBAL_STATS.co2Avoided}M tonnes</span>
              <span className="impact-label">CO₂ Avoided/Year</span>
            </div>
          </div>
          
          <div className="context-box">
            <h4>Nuclear Power Context</h4>
            <p>
              Nuclear power provides about 10% of the world's electricity and nearly 
              30% of all low-carbon electricity generation. A single reactor can power 
              approximately 1 million homes.
            </p>
          </div>
          
          <div className="context-box highlight">
            <h4>Construction Pipeline</h4>
            <p>
              {GLOBAL_STATS.underConstruction} reactors under construction, 
              with China leading global expansion. New designs focus on smaller 
              modular reactors (SMRs) and enhanced safety features.
            </p>
          </div>
        </div>
      )}
      
      {/* ---- Data source ---- */}
      <div className="data-source">
        Data: IAEA Power Reactor Information System (PRIS)
      </div>
      
      {/* ---- Skeleton Styles ---- */}
      <style jsx>{`
        .nuclear-widget {
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
          align-items: flex-start;
          margin-bottom: 12px;
        }
        
        .header-text {
          display: flex;
          flex-direction: column;
        }
        
        .widget-title {
          font-size: 14px;
          font-weight: 500;
          color: var(--text-primary);
        }
        
        .widget-subtitle {
          font-size: 11px;
          color: var(--text-muted);
        }
        
        .nuclear-icon {
          font-size: 24px;
        }
        
        .global-summary {
          background: linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%);
          border-radius: 12px;
          padding: 16px;
          margin-bottom: 12px;
        }
        
        .summary-stat.main {
          text-align: center;
          margin-bottom: 12px;
          padding-bottom: 12px;
          border-bottom: 1px solid rgba(0,0,0,0.1);
        }
        
        .summary-stat.main .stat-value {
          font-family: var(--font-mono, monospace);
          font-size: 36px;
          font-weight: 700;
          color: #16a34a;
        }
        
        .summary-row {
          display: flex;
          justify-content: space-around;
        }
        
        .summary-stat {
          display: flex;
          flex-direction: column;
          align-items: center;
        }
        
        .stat-value {
          font-family: var(--font-mono, monospace);
          font-size: 18px;
          font-weight: 600;
          color: var(--text-primary);
        }
        
        .stat-label {
          font-size: 10px;
          color: var(--text-secondary);
          text-transform: uppercase;
        }
        
        .view-toggle {
          display: flex;
          gap: 4px;
          margin-bottom: 12px;
        }
        
        .toggle-btn {
          flex: 1;
          padding: 8px;
          background: #f5f5f5;
          border: 1px solid var(--widget-border);
          border-radius: 6px;
          font-size: 12px;
          color: var(--text-secondary);
          cursor: pointer;
        }
        
        .toggle-btn.active {
          background: var(--text-primary);
          color: white;
          border-color: var(--text-primary);
        }
        
        .countries-list {
          max-height: 300px;
          overflow-y: auto;
        }
        
        .list-header {
          display: flex;
          justify-content: space-between;
          font-size: 10px;
          color: var(--text-muted);
          text-transform: uppercase;
          margin-bottom: 8px;
          padding: 0 0 4px 0;
          border-bottom: 1px solid var(--widget-border);
        }
        
        .legend {
          display: flex;
          justify-content: center;
          gap: 16px;
          margin-top: 12px;
          padding-top: 8px;
          border-top: 1px solid var(--widget-border);
        }
        
        .legend-item {
          display: flex;
          align-items: center;
          gap: 4px;
          font-size: 10px;
          color: var(--text-muted);
        }
        
        .legend-color {
          width: 12px;
          height: 8px;
          border-radius: 2px;
        }
        
        .legend-color.operating {
          background: linear-gradient(90deg, #22c55e, #16a34a);
        }
        
        .legend-color.construction {
          background: repeating-linear-gradient(
            45deg,
            #fbbf24,
            #fbbf24 2px,
            #f59e0b 2px,
            #f59e0b 4px
          );
        }
        
        .stats-view {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }
        
        .impact-stat {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 12px;
          background: #f8f8f8;
          border-radius: 8px;
        }
        
        .impact-icon {
          font-size: 24px;
        }
        
        .impact-info {
          display: flex;
          flex-direction: column;
        }
        
        .impact-value {
          font-family: var(--font-mono, monospace);
          font-size: 18px;
          font-weight: 600;
          color: var(--text-primary);
        }
        
        .impact-label {
          font-size: 11px;
          color: var(--text-muted);
        }
        
        .context-box {
          padding: 12px;
          background: #fafafa;
          border-radius: 8px;
        }
        
        .context-box.highlight {
          background: #fef3c7;
          border-left: 3px solid #f59e0b;
        }
        
        .context-box h4 {
          font-size: 12px;
          font-weight: 600;
          color: var(--text-primary);
          margin: 0 0 6px 0;
        }
        
        .context-box p {
          font-size: 11px;
          color: var(--text-secondary);
          margin: 0;
          line-height: 1.5;
        }
        
        .data-source {
          text-align: center;
          font-size: 10px;
          color: var(--text-muted);
          margin-top: 12px;
        }
        
        /* Touch adjustments */
        .touch-device .toggle-btn {
          padding: 12px;
          font-size: 14px;
        }
      `}</style>
    </div>
  );
}