'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';

// ============================================
// PENDULUM WAVE WIDGET - FUNCTIONAL SKELETON
// ============================================
// 
// Features:
// - Synchronized pendulum wave simulation
// - Adjustable number of pendulums
// - Speed control
// - Phase visualization
// - Full cycle timer
// - Responsive: pointer vs touch detection
//
// Physics: Simple harmonic motion with varying periods
// Each pendulum has a slightly different length/period
// Creates interference patterns as they go in and out of phase
//
// Styling: Minimal/neutral - ready for design application
// ============================================

interface PendulumConfig {
  count: number;
  minPeriod: number;  // seconds
  maxPeriod: number;  // seconds
  amplitude: number;  // degrees
}

const DEFAULT_CONFIG: PendulumConfig = {
  count: 15,
  minPeriod: 1.5,  // Shortest pendulum period
  maxPeriod: 2.0,  // Longest pendulum period
  amplitude: 45,   // Swing amplitude in degrees
};

// Calculate pendulum period based on index
function getPendulumPeriod(index: number, count: number, minPeriod: number, maxPeriod: number): number {
  if (count === 1) return minPeriod;
  return minPeriod + (index / (count - 1)) * (maxPeriod - minPeriod);
}

// Calculate pendulum angle at given time
function getPendulumAngle(time: number, period: number, amplitude: number): number {
  return amplitude * Math.sin((2 * Math.PI * time) / period);
}

// ============================================
// MAIN WIDGET COMPONENT
// ============================================

export default function PendulumWave() {
  // ---- Refs ----
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>();
  const startTimeRef = useRef<number>(0);
  
  // ---- State ----
  const [config, setConfig] = useState(DEFAULT_CONFIG);
  const [isPaused, setIsPaused] = useState(false);
  const [speed, setSpeed] = useState(1);
  const [elapsed, setElapsed] = useState(0);
  const [cycleProgress, setCycleProgress] = useState(0);
  const [isPointerDevice, setIsPointerDevice] = useState(true);
  const [showTrails, setShowTrails] = useState(false);
  
  // ---- Input method detection ----
  useEffect(() => {
    const mediaQuery = window.matchMedia('(pointer: fine)');
    setIsPointerDevice(mediaQuery.matches);
    
    const handler = (e: MediaQueryListEvent) => setIsPointerDevice(e.matches);
    mediaQuery.addEventListener('change', handler);
    return () => mediaQuery.removeEventListener('change', handler);
  }, []);
  
  // ---- Calculate full cycle time ----
  // Time for all pendulums to return to starting phase
  const fullCycleTime = useCallback(() => {
    // LCM of all periods (approximated)
    const { minPeriod, maxPeriod } = config;
    // Full cycle is when shortest pendulum has done N cycles and longest has done N-1
    // T_full = N * T_min = (N-1) * T_max
    // Solving: T_full = T_min * T_max / (T_max - T_min)
    return (minPeriod * maxPeriod) / (maxPeriod - minPeriod);
  }, [config]);
  
  // ---- Reset simulation ----
  const reset = useCallback(() => {
    startTimeRef.current = performance.now();
    setElapsed(0);
    setCycleProgress(0);
  }, []);
  
  // ---- Animation loop ----
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // Set canvas size
    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      canvas.width = rect.width * window.devicePixelRatio;
      canvas.height = rect.height * window.devicePixelRatio;
      ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
    };
    
    resize();
    window.addEventListener('resize', resize);
    
    let lastTime = performance.now();
    let accumulatedTime = 0;
    
    const animate = (currentTime: number) => {
      const deltaTime = (currentTime - lastTime) / 1000;  // Convert to seconds
      lastTime = currentTime;
      
      if (!isPaused) {
        accumulatedTime += deltaTime * speed;
      }
      
      const width = canvas.width / window.devicePixelRatio;
      const height = canvas.height / window.devicePixelRatio;
      
      // Clear canvas
      if (showTrails) {
        ctx.fillStyle = 'rgba(255, 255, 255, 0.1)';
      } else {
        ctx.fillStyle = '#ffffff';
      }
      ctx.fillRect(0, 0, width, height);
      
      // Pendulum dimensions
      const pendulumSpacing = width / (config.count + 1);
      const pivotY = 30;
      const maxLength = height - pivotY - 40;
      
      // Draw pendulums
      for (let i = 0; i < config.count; i++) {
        const x = pendulumSpacing * (i + 1);
        const period = getPendulumPeriod(i, config.count, config.minPeriod, config.maxPeriod);
        const angle = getPendulumAngle(accumulatedTime, period, config.amplitude);
        const angleRad = (angle * Math.PI) / 180;
        
        // Pendulum length varies with period (longer period = longer pendulum)
        const lengthRatio = (period - config.minPeriod) / (config.maxPeriod - config.minPeriod);
        const length = maxLength * (0.6 + 0.4 * lengthRatio);
        
        // Calculate bob position
        const bobX = x + length * Math.sin(angleRad);
        const bobY = pivotY + length * Math.cos(angleRad);
        
        // Draw string
        ctx.beginPath();
        ctx.moveTo(x, pivotY);
        ctx.lineTo(bobX, bobY);
        ctx.strokeStyle = '#cbd5e1';
        ctx.lineWidth = 1;
        ctx.stroke();
        
        // Draw bob
        const bobRadius = 8;
        const hue = (i / config.count) * 280;  // Rainbow colors
        ctx.beginPath();
        ctx.arc(bobX, bobY, bobRadius, 0, Math.PI * 2);
        ctx.fillStyle = `hsl(${hue}, 70%, 50%)`;
        ctx.fill();
      }
      
      // Draw pivot bar
      ctx.fillStyle = '#334155';
      ctx.fillRect(0, pivotY - 4, width, 8);
      
      // Update elapsed time display
      setElapsed(accumulatedTime);
      setCycleProgress((accumulatedTime % fullCycleTime()) / fullCycleTime() * 100);
      
      animationRef.current = requestAnimationFrame(animate);
    };
    
    startTimeRef.current = performance.now();
    animate(performance.now());
    
    return () => {
      window.removeEventListener('resize', resize);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [config, isPaused, speed, showTrails, fullCycleTime]);

  return (
    <div className={`pendulum-widget ${isPointerDevice ? 'pointer-device' : 'touch-device'}`}>
      
      {/* ---- Header ---- */}
      <div className="widget-header">
        <div className="header-text">
          <span className="widget-title">Pendulum Wave</span>
          <span className="widget-subtitle">{config.count} synchronized pendulums</span>
        </div>
      </div>
      
      {/* ---- Canvas ---- */}
      <div className="canvas-container">
        <canvas ref={canvasRef} className="pendulum-canvas" />
      </div>
      
      {/* ---- Timer display ---- */}
      <div className="timer-display">
        <div className="timer-item">
          <span className="timer-value">{elapsed.toFixed(1)}</span>
          <span className="timer-label">seconds</span>
        </div>
        <div className="timer-item">
          <span className="timer-value">{cycleProgress.toFixed(0)}%</span>
          <span className="timer-label">cycle</span>
        </div>
        <div className="timer-item">
          <span className="timer-value">{fullCycleTime().toFixed(1)}s</span>
          <span className="timer-label">full cycle</span>
        </div>
      </div>
      
      {/* ---- Controls ---- */}
      <div className="controls">
        <div className="control-row">
          <label>Pendulums</label>
          <input
            type="range"
            min="5"
            max="25"
            value={config.count}
            onChange={(e) => {
              setConfig({ ...config, count: parseInt(e.target.value) });
              reset();
            }}
          />
          <span className="control-value">{config.count}</span>
        </div>
        
        <div className="control-row">
          <label>Speed</label>
          <input
            type="range"
            min="0.25"
            max="3"
            step="0.25"
            value={speed}
            onChange={(e) => setSpeed(parseFloat(e.target.value))}
          />
          <span className="control-value">{speed}×</span>
        </div>
      </div>
      
      {/* ---- Action buttons ---- */}
      <div className="action-buttons">
        <button 
          className="action-btn"
          onClick={() => setIsPaused(!isPaused)}
        >
          {isPaused ? '▶ Play' : '⏸ Pause'}
        </button>
        <button 
          className="action-btn"
          onClick={reset}
        >
          ↺ Reset
        </button>
        <button 
          className={`action-btn ${showTrails ? 'active' : ''}`}
          onClick={() => setShowTrails(!showTrails)}
        >
          Trails
        </button>
      </div>
      
      {/* ---- Info ---- */}
      <div className="info-text">
        <p>
          Each pendulum has a slightly different period. They start in phase, 
          drift apart creating waves, then eventually realign.
        </p>
      </div>
      
      {/* ---- Skeleton Styles ---- */}
      <style jsx>{`
        .pendulum-widget {
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
        
        .canvas-container {
          width: 100%;
          aspect-ratio: 4/3;
          background: #fafafa;
          border-radius: 8px;
          overflow: hidden;
          margin-bottom: 12px;
        }
        
        .pendulum-canvas {
          width: 100%;
          height: 100%;
          display: block;
        }
        
        .timer-display {
          display: flex;
          justify-content: space-around;
          padding: 12px;
          background: #f8f8f8;
          border-radius: 8px;
          margin-bottom: 12px;
        }
        
        .timer-item {
          display: flex;
          flex-direction: column;
          align-items: center;
        }
        
        .timer-value {
          font-family: var(--font-mono, monospace);
          font-size: 18px;
          font-weight: 600;
          color: var(--text-primary);
        }
        
        .timer-label {
          font-size: 10px;
          color: var(--text-muted);
          text-transform: uppercase;
        }
        
        .controls {
          margin-bottom: 12px;
        }
        
        .control-row {
          display: flex;
          align-items: center;
          gap: 8px;
          margin-bottom: 8px;
        }
        
        .control-row label {
          font-size: 12px;
          color: var(--text-secondary);
          min-width: 70px;
        }
        
        .control-row input[type="range"] {
          flex: 1;
          height: 4px;
          -webkit-appearance: none;
          background: var(--widget-border);
          border-radius: 2px;
        }
        
        .control-row input[type="range"]::-webkit-slider-thumb {
          -webkit-appearance: none;
          width: 14px;
          height: 14px;
          background: var(--text-primary);
          border-radius: 50%;
          cursor: pointer;
        }
        
        .control-value {
          font-family: var(--font-mono, monospace);
          font-size: 12px;
          color: var(--text-muted);
          min-width: 32px;
          text-align: right;
        }
        
        .action-buttons {
          display: flex;
          gap: 8px;
          margin-bottom: 12px;
        }
        
        .action-btn {
          flex: 1;
          padding: 8px;
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
        
        .info-text {
          padding: 8px;
          background: #fafafa;
          border-radius: 6px;
        }
        
        .info-text p {
          font-size: 11px;
          color: var(--text-secondary);
          margin: 0;
          line-height: 1.5;
        }
        
        /* Touch adjustments */
        .touch-device .action-btn {
          padding: 12px;
          font-size: 14px;
        }
        
        .touch-device .control-row input[type="range"]::-webkit-slider-thumb {
          width: 20px;
          height: 20px;
        }
      `}</style>
    </div>
  );
}