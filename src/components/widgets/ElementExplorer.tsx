'use client';

import React, { useState, useEffect, useMemo, useCallback } from 'react';

// ============================================
// ELEMENT EXPLORER WIDGET - FUNCTIONAL SKELETON
// ============================================
// 
// Features:
// - Element of the day / random element
// - Element details (atomic number, mass, etc.)
// - Category coloring
// - Electron configuration
// - Discovery info
// - Physical properties
// - Responsive: pointer vs touch detection
//
// Data: Essential periodic table data
//
// Styling: Minimal/neutral - ready for design application
// ============================================

interface Element {
  number: number;
  symbol: string;
  name: string;
  mass: number;
  category: string;
  phase: 'solid' | 'liquid' | 'gas' | 'unknown';
  discoveredBy: string | null;
  discoveryYear: number | null;
  electronConfig: string;
  meltingPoint: number | null;  // Kelvin
  boilingPoint: number | null;  // Kelvin
  density: number | null;       // g/cm³
  funFact: string;
}

// Representative sample of elements with fun facts
const ELEMENTS: Element[] = [
  {
    number: 1, symbol: 'H', name: 'Hydrogen', mass: 1.008,
    category: 'nonmetal', phase: 'gas',
    discoveredBy: 'Henry Cavendish', discoveryYear: 1766,
    electronConfig: '1s¹',
    meltingPoint: 14.01, boilingPoint: 20.28, density: 0.00008988,
    funFact: 'Makes up 75% of all normal matter in the universe by mass.'
  },
  {
    number: 2, symbol: 'He', name: 'Helium', mass: 4.0026,
    category: 'noble gas', phase: 'gas',
    discoveredBy: 'Pierre Janssen', discoveryYear: 1868,
    electronConfig: '1s²',
    meltingPoint: 0.95, boilingPoint: 4.22, density: 0.0001785,
    funFact: 'First discovered in the Sun before being found on Earth.'
  },
  {
    number: 6, symbol: 'C', name: 'Carbon', mass: 12.011,
    category: 'nonmetal', phase: 'solid',
    discoveredBy: null, discoveryYear: null,
    electronConfig: '[He] 2s² 2p²',
    meltingPoint: 3823, boilingPoint: 4098, density: 2.267,
    funFact: 'Forms more compounds than any other element — over 10 million known.'
  },
  {
    number: 7, symbol: 'N', name: 'Nitrogen', mass: 14.007,
    category: 'nonmetal', phase: 'gas',
    discoveredBy: 'Daniel Rutherford', discoveryYear: 1772,
    electronConfig: '[He] 2s² 2p³',
    meltingPoint: 63.15, boilingPoint: 77.36, density: 0.0012506,
    funFact: 'Makes up 78% of Earth\'s atmosphere.'
  },
  {
    number: 8, symbol: 'O', name: 'Oxygen', mass: 15.999,
    category: 'nonmetal', phase: 'gas',
    discoveredBy: 'Joseph Priestley', discoveryYear: 1774,
    electronConfig: '[He] 2s² 2p⁴',
    meltingPoint: 54.36, boilingPoint: 90.20, density: 0.001429,
    funFact: 'The most abundant element in Earth\'s crust by mass (46%).'
  },
  {
    number: 26, symbol: 'Fe', name: 'Iron', mass: 55.845,
    category: 'transition metal', phase: 'solid',
    discoveredBy: null, discoveryYear: null,
    electronConfig: '[Ar] 3d⁶ 4s²',
    meltingPoint: 1811, boilingPoint: 3134, density: 7.874,
    funFact: 'Earth\'s core is primarily iron, making it the most common element on Earth by mass.'
  },
  {
    number: 29, symbol: 'Cu', name: 'Copper', mass: 63.546,
    category: 'transition metal', phase: 'solid',
    discoveredBy: null, discoveryYear: null,
    electronConfig: '[Ar] 3d¹⁰ 4s¹',
    meltingPoint: 1357.77, boilingPoint: 2835, density: 8.96,
    funFact: 'One of the few metals with a natural color other than gray or silver.'
  },
  {
    number: 47, symbol: 'Ag', name: 'Silver', mass: 107.87,
    category: 'transition metal', phase: 'solid',
    discoveredBy: null, discoveryYear: null,
    electronConfig: '[Kr] 4d¹⁰ 5s¹',
    meltingPoint: 1234.93, boilingPoint: 2435, density: 10.501,
    funFact: 'The best conductor of electricity of all elements.'
  },
  {
    number: 79, symbol: 'Au', name: 'Gold', mass: 196.97,
    category: 'transition metal', phase: 'solid',
    discoveredBy: null, discoveryYear: null,
    electronConfig: '[Xe] 4f¹⁴ 5d¹⁰ 6s¹',
    meltingPoint: 1337.33, boilingPoint: 3129, density: 19.282,
    funFact: 'All the gold ever mined would fit in a 21-meter cube.'
  },
  {
    number: 80, symbol: 'Hg', name: 'Mercury', mass: 200.59,
    category: 'transition metal', phase: 'liquid',
    discoveredBy: null, discoveryYear: null,
    electronConfig: '[Xe] 4f¹⁴ 5d¹⁰ 6s²',
    meltingPoint: 234.32, boilingPoint: 629.88, density: 13.5336,
    funFact: 'The only metal that is liquid at room temperature.'
  },
  {
    number: 92, symbol: 'U', name: 'Uranium', mass: 238.03,
    category: 'actinide', phase: 'solid',
    discoveredBy: 'Martin Heinrich Klaproth', discoveryYear: 1789,
    electronConfig: '[Rn] 5f³ 6d¹ 7s²',
    meltingPoint: 1405.3, boilingPoint: 4404, density: 19.1,
    funFact: '1 kg of uranium contains as much energy as 1,500 tonnes of coal.'
  },
  {
    number: 94, symbol: 'Pu', name: 'Plutonium', mass: 244,
    category: 'actinide', phase: 'solid',
    discoveredBy: 'Glenn T. Seaborg', discoveryYear: 1940,
    electronConfig: '[Rn] 5f⁶ 7s²',
    meltingPoint: 912.5, boilingPoint: 3501, density: 19.84,
    funFact: 'Named after the dwarf planet Pluto, continuing the pattern from Uranium (Uranus) and Neptunium (Neptune).'
  },
  {
    number: 118, symbol: 'Og', name: 'Oganesson', mass: 294,
    category: 'noble gas', phase: 'unknown',
    discoveredBy: 'JINR and LLNL', discoveryYear: 2002,
    electronConfig: '[Rn] 5f¹⁴ 6d¹⁰ 7s² 7p⁶',
    meltingPoint: null, boilingPoint: null, density: null,
    funFact: 'The heaviest element ever created. Only about 5 atoms have ever been made.'
  },
];

// Category colors
const CATEGORY_COLORS: Record<string, string> = {
  'nonmetal': '#22c55e',
  'noble gas': '#8b5cf6',
  'alkali metal': '#ef4444',
  'alkaline earth metal': '#f97316',
  'transition metal': '#3b82f6',
  'metalloid': '#14b8a6',
  'post-transition metal': '#64748b',
  'lanthanide': '#ec4899',
  'actinide': '#a855f7',
  'unknown': '#9ca3af',
};

// Get element of the day based on date
function getElementOfDay(): Element {
  const today = new Date();
  const dayOfYear = Math.floor((today.getTime() - new Date(today.getFullYear(), 0, 0).getTime()) / (1000 * 60 * 60 * 24));
  return ELEMENTS[dayOfYear % ELEMENTS.length];
}

// Format temperature
function formatTemp(kelvin: number | null): string {
  if (kelvin === null) return 'Unknown';
  const celsius = kelvin - 273.15;
  return `${celsius.toFixed(0)}°C`;
}

// ============================================
// MAIN WIDGET COMPONENT
// ============================================

export default function ElementExplorer() {
  // ---- State ----
  const [element, setElement] = useState<Element>(getElementOfDay());
  const [mode, setMode] = useState<'daily' | 'random'>('daily');
  const [isPointerDevice, setIsPointerDevice] = useState(true);
  
  // ---- Input method detection ----
  useEffect(() => {
    const mediaQuery = window.matchMedia('(pointer: fine)');
    setIsPointerDevice(mediaQuery.matches);
    
    const handler = (e: MediaQueryListEvent) => setIsPointerDevice(e.matches);
    mediaQuery.addEventListener('change', handler);
    return () => mediaQuery.removeEventListener('change', handler);
  }, []);
  
  // ---- Random element ----
  const randomElement = useCallback(() => {
    const randomIndex = Math.floor(Math.random() * ELEMENTS.length);
    setElement(ELEMENTS[randomIndex]);
    setMode('random');
  }, []);
  
  // ---- Today's element ----
  const todaysElement = useCallback(() => {
    setElement(getElementOfDay());
    setMode('daily');
  }, []);
  
  const categoryColor = CATEGORY_COLORS[element.category] || CATEGORY_COLORS['unknown'];

  return (
    <div className={`element-widget ${isPointerDevice ? 'pointer-device' : 'touch-device'}`}>
      
      {/* ---- Header ---- */}
      <div className="widget-header">
        <span className="widget-title">Element Explorer</span>
        <span className="widget-subtitle">
          {mode === 'daily' ? 'Element of the Day' : 'Random Element'}
        </span>
      </div>
      
      {/* ---- Element card ---- */}
      <div className="element-card" style={{ borderColor: categoryColor }}>
        <div className="element-number">{element.number}</div>
        <div className="element-symbol" style={{ color: categoryColor }}>{element.symbol}</div>
        <div className="element-name">{element.name}</div>
        <div className="element-mass">{element.mass}</div>
        <div className="element-category" style={{ backgroundColor: categoryColor }}>
          {element.category}
        </div>
      </div>
      
      {/* ---- Properties ---- */}
      <div className="properties-grid">
        <div className="property">
          <span className="property-label">Electron Config</span>
          <span className="property-value mono">{element.electronConfig}</span>
        </div>
        <div className="property">
          <span className="property-label">Phase (STP)</span>
          <span className="property-value">{element.phase}</span>
        </div>
        <div className="property">
          <span className="property-label">Melting Point</span>
          <span className="property-value">{formatTemp(element.meltingPoint)}</span>
        </div>
        <div className="property">
          <span className="property-label">Boiling Point</span>
          <span className="property-value">{formatTemp(element.boilingPoint)}</span>
        </div>
        {element.density && (
          <div className="property">
            <span className="property-label">Density</span>
            <span className="property-value">{element.density.toFixed(3)} g/cm³</span>
          </div>
        )}
        {element.discoveryYear && (
          <div className="property">
            <span className="property-label">Discovered</span>
            <span className="property-value">{element.discoveryYear}</span>
          </div>
        )}
      </div>
      
      {/* ---- Fun fact ---- */}
      <div className="fun-fact">
        <span className="fact-icon">💡</span>
        <p>{element.funFact}</p>
      </div>
      
      {/* ---- Action buttons ---- */}
      <div className="action-buttons">
        <button 
          className={`action-btn ${mode === 'daily' ? 'active' : ''}`}
          onClick={todaysElement}
        >
          Today's Element
        </button>
        <button 
          className="action-btn"
          onClick={randomElement}
        >
          🎲 Random
        </button>
      </div>
      
      {/* ---- Skeleton Styles ---- */}
      <style jsx>{`
        .element-widget {
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
        
        .element-card {
          position: relative;
          padding: 20px;
          background: #fafafa;
          border-radius: 12px;
          border: 3px solid;
          text-align: center;
          margin-bottom: 12px;
        }
        
        .element-number {
          position: absolute;
          top: 8px;
          left: 12px;
          font-family: var(--font-mono, monospace);
          font-size: 12px;
          color: var(--text-muted);
        }
        
        .element-symbol {
          font-family: var(--font-mono, monospace);
          font-size: 48px;
          font-weight: 700;
          line-height: 1;
        }
        
        .element-name {
          font-size: 18px;
          font-weight: 500;
          color: var(--text-primary);
          margin: 4px 0;
        }
        
        .element-mass {
          font-family: var(--font-mono, monospace);
          font-size: 13px;
          color: var(--text-secondary);
        }
        
        .element-category {
          display: inline-block;
          padding: 4px 12px;
          border-radius: 12px;
          font-size: 10px;
          font-weight: 600;
          color: white;
          text-transform: uppercase;
          margin-top: 8px;
        }
        
        .properties-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 8px;
          margin-bottom: 12px;
        }
        
        .property {
          padding: 8px;
          background: #f8f8f8;
          border-radius: 6px;
        }
        
        .property-label {
          display: block;
          font-size: 10px;
          color: var(--text-muted);
          text-transform: uppercase;
          margin-bottom: 2px;
        }
        
        .property-value {
          font-size: 13px;
          color: var(--text-primary);
        }
        
        .property-value.mono {
          font-family: var(--font-mono, monospace);
          font-size: 12px;
        }
        
        .fun-fact {
          display: flex;
          gap: 8px;
          padding: 12px;
          background: #f0f9ff;
          border-radius: 8px;
          margin-bottom: 12px;
        }
        
        .fact-icon {
          font-size: 16px;
          flex-shrink: 0;
        }
        
        .fun-fact p {
          font-size: 12px;
          color: var(--text-secondary);
          margin: 0;
          line-height: 1.5;
        }
        
        .action-buttons {
          display: flex;
          gap: 8px;
        }
        
        .action-btn {
          flex: 1;
          padding: 10px;
          background: var(--widget-bg);
          border: 1px solid var(--widget-border);
          border-radius: 6px;
          font-size: 12px;
          color: var(--text-primary);
          cursor: pointer;
        }
        
        .action-btn.active {
          background: var(--text-primary);
          color: white;
        }
        
        /* Touch adjustments */
        .touch-device .element-symbol {
          font-size: 56px;
        }
        
        .touch-device .action-btn {
          padding: 14px;
          font-size: 14px;
        }
      `}</style>
    </div>
  );
}