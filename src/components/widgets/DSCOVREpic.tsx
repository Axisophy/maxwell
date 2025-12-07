'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { format, parseISO, subDays } from 'date-fns';

// ============================================
// DSCOVR EPIC WIDGET - FUNCTIONAL SKELETON
// ============================================
// 
// Features:
// - Whole Earth images from DSCOVR spacecraft at L1
// - Natural and enhanced color modes
// - Date navigation
// - Earth position/rotation info
// - The "pale blue dot" from 1.5 million km
// - Responsive: pointer vs touch detection
//
// Data source: NASA DSCOVR EPIC API
// - https://epic.gsfc.nasa.gov/api/
// - Reliable, beautiful imagery
//
// Styling: Minimal/neutral - ready for design application
// ============================================

interface EPICImage {
  identifier: string;
  date: string;
  caption: string;
  image: string;  // Image filename (without extension)
  centroidCoordinates: {
    lat: number;
    lon: number;
  };
  sunJ2000Position: { x: number; y: number; z: number };
  lunarJ2000Position: { x: number; y: number; z: number };
}

type ImageType = 'natural' | 'enhanced';

// Parse EPIC date format: "2024-12-05 00:41:27" (space instead of T)
function parseEPICDate(dateStr: string): Date {
  if (!dateStr) return new Date();
  // Replace space with T for ISO parsing
  const isoStr = dateStr.replace(' ', 'T');
  try {
    return parseISO(isoStr);
  } catch {
    return new Date();
  }
}

// Build image URL from EPIC data
function buildImageUrl(image: EPICImage, type: ImageType): string {
  const date = parseEPICDate(image.date);
  const year = format(date, 'yyyy');
  const month = format(date, 'MM');
  const day = format(date, 'dd');
  
  return `https://epic.gsfc.nasa.gov/archive/${type}/${year}/${month}/${day}/png/${image.image}.png`;
}

// ============================================
// MAIN WIDGET COMPONENT
// ============================================

export default function DSCOVREpic() {
  // ---- State ----
  const [images, setImages] = useState<EPICImage[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [imageType, setImageType] = useState<ImageType>('natural');
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [loading, setLoading] = useState(true);
  const [imageLoading, setImageLoading] = useState(false);
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
  
  // ---- Fetch images for date ----
  const fetchImages = useCallback(async (date: Date, type: ImageType) => {
    setLoading(true);
    setError(null);
    
    const dateStr = format(date, 'yyyy-MM-dd');
    
    try {
      const response = await fetch(
        `https://epic.gsfc.nasa.gov/api/${type}/date/${dateStr}`
      );
      
      if (!response.ok) {
        // Try previous day if no images
        if (response.status === 404) {
          const prevDate = subDays(date, 1);
          return fetchImages(prevDate, type);
        }
        throw new Error('Failed to fetch EPIC images');
      }
      
      const data: EPICImage[] = await response.json();
      
      if (data.length === 0) {
        // No images for this date, try previous day
        const prevDate = subDays(date, 1);
        return fetchImages(prevDate, type);
      }
      
      setImages(data);
      setCurrentIndex(0);
      setSelectedDate(date);
      setLoading(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
      setLoading(false);
    }
  }, []);
  
  // ---- Fetch available dates (to get most recent) ----
  const fetchLatest = useCallback(async () => {
    try {
      const response = await fetch(
        `https://epic.gsfc.nasa.gov/api/${imageType}/all`
      );
      
      if (response.ok) {
        const dates = await response.json();
        if (dates.length > 0) {
          const latestDate = parseEPICDate(dates[0].date);
          fetchImages(latestDate, imageType);
          return;
        }
      }
      
      // Fallback: try today, then work backwards
      fetchImages(new Date(), imageType);
    } catch (err) {
      fetchImages(new Date(), imageType);
    }
  }, [imageType, fetchImages]);
  
  // ---- Initial fetch ----
  useEffect(() => {
    fetchLatest();
  }, [fetchLatest]);
  
  // ---- Handle type change ----
  useEffect(() => {
    if (images.length > 0) {
      fetchImages(selectedDate, imageType);
    }
  }, [imageType]);
  
  // ---- Navigation ----
  const goToPrevImage = () => {
    setImageLoading(true);
    setCurrentIndex(prev => (prev > 0 ? prev - 1 : images.length - 1));
  };
  
  const goToNextImage = () => {
    setImageLoading(true);
    setCurrentIndex(prev => (prev < images.length - 1 ? prev + 1 : 0));
  };
  
  const goToPrevDay = () => {
    fetchImages(subDays(selectedDate, 1), imageType);
  };
  
  const goToNextDay = () => {
    const nextDate = subDays(selectedDate, -1);
    if (nextDate <= new Date()) {
      fetchImages(nextDate, imageType);
    }
  };
  
  // Current image
  const currentImage = images[currentIndex];
  const imageUrl = currentImage ? buildImageUrl(currentImage, imageType) : null;

  return (
    <div className={`epic-widget ${isPointerDevice ? 'pointer-device' : 'touch-device'}`}>
      
      {/* ---- Header ---- */}
      <div className="widget-header">
        <div className="header-text">
          <span className="widget-title">DSCOVR EPIC</span>
          <span className="widget-subtitle">Earth from 1.5 million km</span>
        </div>
        <div className="type-toggle">
          <button
            className={`type-btn ${imageType === 'natural' ? 'active' : ''}`}
            onClick={() => setImageType('natural')}
          >
            Natural
          </button>
          <button
            className={`type-btn ${imageType === 'enhanced' ? 'active' : ''}`}
            onClick={() => setImageType('enhanced')}
          >
            Enhanced
          </button>
        </div>
      </div>
      
      {/* ---- Loading State ---- */}
      {loading && (
        <div className="loading-state">
          <div className="loading-earth">🌍</div>
          <span>Receiving transmission from L1...</span>
        </div>
      )}
      
      {/* ---- Error State ---- */}
      {error && (
        <div className="error-message">
          {error}
          <button onClick={fetchLatest} className="retry-btn">Retry</button>
        </div>
      )}
      
      {/* ---- Main Display ---- */}
      {!loading && !error && currentImage && imageUrl && (
        <>
          {/* Image container */}
          <div className="image-container">
            {imageLoading && <div className="image-loading-overlay" />}
            <img
              src={imageUrl}
              alt={currentImage.caption || 'Earth from DSCOVR'}
              className="earth-image"
              onLoad={() => setImageLoading(false)}
            />
            
            {/* Image navigation overlay */}
            {images.length > 1 && (
              <div className="image-nav">
                <button onClick={goToPrevImage} className="nav-btn prev">‹</button>
                <button onClick={goToNextImage} className="nav-btn next">›</button>
              </div>
            )}
          </div>
          
          {/* Image counter */}
          {images.length > 1 && (
            <div className="image-counter">
              {currentIndex + 1} of {images.length} images
            </div>
          )}
          
          {/* Image info */}
          <div className="image-info">
            <div className="info-row">
              <span className="info-label">Captured</span>
              <span className="info-value">
                {format(parseEPICDate(currentImage.date), 'MMM d, yyyy • HH:mm')} UTC
              </span>
            </div>
            
            <div className="info-row">
              <span className="info-label">Centroid</span>
              <span className="info-value">
                {currentImage.centroidCoordinates ? (
                  <>
                    {currentImage.centroidCoordinates.lat.toFixed(1)}°
                    {currentImage.centroidCoordinates.lat >= 0 ? 'N' : 'S'},
                    {' '}
                    {Math.abs(currentImage.centroidCoordinates.lon).toFixed(1)}°
                    {currentImage.centroidCoordinates.lon >= 0 ? 'E' : 'W'}
                  </>
                ) : 'N/A'}
              </span>
            </div>
          </div>
          
          {/* Date navigation */}
          <div className="date-nav">
            <button onClick={goToPrevDay} className="date-btn">
              ← Previous Day
            </button>
            <span className="current-date">
              {format(selectedDate, 'MMM d, yyyy')}
            </span>
            <button 
              onClick={goToNextDay} 
              className="date-btn"
              disabled={subDays(selectedDate, -1) > new Date()}
            >
              Next Day →
            </button>
          </div>
          
          {/* Context */}
          <div className="context-panel">
            <p>
              DSCOVR orbits the L1 Lagrange point, where Earth and Sun's gravity balance.
              From there, it always sees the sunlit side of Earth — our planet as a distant traveler would see it.
            </p>
          </div>
        </>
      )}
      
      {/* ---- Data source ---- */}
      <div className="data-source">
        Data: NASA DSCOVR EPIC Camera
      </div>
      
      {/* ---- Skeleton Styles ---- */}
      <style jsx>{`
        .epic-widget {
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
        
        .type-toggle {
          display: flex;
          gap: 4px;
        }
        
        .type-btn {
          padding: 4px 10px;
          font-size: 11px;
          background: #f5f5f5;
          border: 1px solid var(--widget-border);
          border-radius: 4px;
          color: var(--text-secondary);
          cursor: pointer;
        }
        
        .type-btn.active {
          background: var(--text-primary);
          color: white;
          border-color: var(--text-primary);
        }
        
        .loading-state {
          text-align: center;
          padding: 60px 20px;
          color: var(--text-secondary);
        }
        
        .loading-earth {
          font-size: 48px;
          margin-bottom: 12px;
          animation: pulse 2s infinite;
        }
        
        @keyframes pulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.1); }
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
        
        .image-container {
          position: relative;
          border-radius: 8px;
          overflow: hidden;
          background: #000;
          margin-bottom: 8px;
        }
        
        .image-loading-overlay {
          position: absolute;
          inset: 0;
          background: rgba(0, 0, 0, 0.5);
          display: flex;
          align-items: center;
          justify-content: center;
        }
        
        .earth-image {
          width: 100%;
          height: auto;
          display: block;
        }
        
        .image-nav {
          position: absolute;
          inset: 0;
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 8px;
          pointer-events: none;
        }
        
        .nav-btn {
          width: 36px;
          height: 36px;
          border-radius: 50%;
          background: rgba(0, 0, 0, 0.5);
          border: none;
          color: white;
          font-size: 20px;
          cursor: pointer;
          pointer-events: auto;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        
        .nav-btn:hover {
          background: rgba(0, 0, 0, 0.7);
        }
        
        .image-counter {
          text-align: center;
          font-size: 11px;
          color: var(--text-muted);
          margin-bottom: 12px;
        }
        
        .image-info {
          background: #f8f8f8;
          border-radius: 8px;
          padding: 12px;
          margin-bottom: 12px;
        }
        
        .info-row {
          display: flex;
          justify-content: space-between;
          padding: 4px 0;
        }
        
        .info-label {
          font-size: 12px;
          color: var(--text-muted);
        }
        
        .info-value {
          font-family: var(--font-mono, monospace);
          font-size: 12px;
          color: var(--text-primary);
        }
        
        .date-nav {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 8px;
          margin-bottom: 12px;
        }
        
        .date-btn {
          padding: 8px 12px;
          background: var(--widget-bg);
          border: 1px solid var(--widget-border);
          border-radius: 6px;
          font-size: 12px;
          color: var(--text-primary);
          cursor: pointer;
        }
        
        .date-btn:disabled {
          opacity: 0.4;
          cursor: not-allowed;
        }
        
        .current-date {
          font-family: var(--font-mono, monospace);
          font-size: 13px;
          color: var(--text-secondary);
        }
        
        .context-panel {
          padding: 12px;
          background: #fafafa;
          border-radius: 8px;
          margin-bottom: 12px;
        }
        
        .context-panel p {
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
        .touch-device .nav-btn {
          width: 48px;
          height: 48px;
          font-size: 24px;
        }
        
        .touch-device .date-btn {
          padding: 12px 16px;
          font-size: 14px;
        }
      `}</style>
    </div>
  );
}