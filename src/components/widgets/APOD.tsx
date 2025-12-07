'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { format, subDays, isToday, isBefore, startOfDay } from 'date-fns';

// ============================================
// APOD WIDGET - FUNCTIONAL SKELETON
// ============================================
// 
// Features:
// - NASA Astronomy Picture of the Day
// - Image display with title and explanation
// - Date navigation to explore archive (back to 1995!)
// - Handles both images and videos
// - HD image option
// - Copyright attribution
// - Responsive: pointer vs touch detection
//
// Data source: NASA APOD API
// - https://api.nasa.gov/planetary/apod
// - Free API key from NASA (or use DEMO_KEY with limits)
//
// Styling: Minimal/neutral - ready for design application
// ============================================

interface APODData {
  date: string;
  title: string;
  explanation: string;
  url: string;
  hdurl?: string;
  media_type: 'image' | 'video';
  copyright?: string;
  thumbnail_url?: string; // For videos
}

// APOD started on June 16, 1995
const APOD_START_DATE = new Date(1995, 5, 16);

// ============================================
// MAIN WIDGET COMPONENT
// ============================================

interface APODProps {
  // Optional: provide your own NASA API key
  apiKey?: string;
  // Optional: start with a specific date
  initialDate?: Date;
}

export default function APOD({ 
  apiKey = 'DEMO_KEY',
  initialDate 
}: APODProps) {
  // ---- State ----
  const [selectedDate, setSelectedDate] = useState<Date>(initialDate || new Date());
  const [apodData, setApodData] = useState<APODData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showFullExplanation, setShowFullExplanation] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [isPointerDevice, setIsPointerDevice] = useState(true);
  
  // ---- Input method detection ----
  useEffect(() => {
    const mediaQuery = window.matchMedia('(pointer: fine)');
    setIsPointerDevice(mediaQuery.matches);
    
    const handler = (e: MediaQueryListEvent) => setIsPointerDevice(e.matches);
    mediaQuery.addEventListener('change', handler);
    return () => mediaQuery.removeEventListener('change', handler);
  }, []);
  
  // ---- Fetch APOD data ----
  const fetchAPOD = useCallback(async (date: Date) => {
    setLoading(true);
    setError(null);
    setImageLoaded(false);
    
    const dateStr = format(date, 'yyyy-MM-dd');
    
    try {
      const response = await fetch(
        `https://api.nasa.gov/planetary/apod?api_key=${apiKey}&date=${dateStr}`
      );
      
      if (!response.ok) {
        if (response.status === 404) {
          throw new Error('No APOD available for this date');
        }
        throw new Error('Failed to fetch APOD');
      }
      
      const data: APODData = await response.json();
      setApodData(data);
      setLoading(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
      setLoading(false);
    }
  }, [apiKey]);
  
  // ---- Fetch on date change ----
  useEffect(() => {
    fetchAPOD(selectedDate);
  }, [selectedDate, fetchAPOD]);
  
  // ---- Date navigation ----
  const goToToday = () => setSelectedDate(new Date());
  
  const goToPrevDay = () => {
    const prevDay = subDays(selectedDate, 1);
    // Don't go before APOD start date
    if (!isBefore(prevDay, APOD_START_DATE)) {
      setSelectedDate(prevDay);
    }
  };
  
  const goToNextDay = () => {
    const nextDay = subDays(selectedDate, -1);
    // Don't go into the future
    if (!isBefore(startOfDay(new Date()), startOfDay(nextDay))) {
      setSelectedDate(nextDay);
    }
  };
  
  const goToRandomDate = () => {
    const today = new Date();
    const totalDays = Math.floor((today.getTime() - APOD_START_DATE.getTime()) / (1000 * 60 * 60 * 24));
    const randomDays = Math.floor(Math.random() * totalDays);
    setSelectedDate(subDays(today, randomDays));
  };
  
  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newDate = new Date(e.target.value);
    if (!isBefore(newDate, APOD_START_DATE) && !isBefore(startOfDay(new Date()), startOfDay(newDate))) {
      setSelectedDate(newDate);
    }
  };
  
  // Check if viewing today
  const viewingToday = isToday(selectedDate);
  
  // Check if can navigate
  const canGoBack = !isBefore(subDays(selectedDate, 1), APOD_START_DATE);
  const canGoForward = !viewingToday;
  
  // Truncate explanation for preview
  const truncatedExplanation = apodData?.explanation 
    ? apodData.explanation.length > 200 
      ? apodData.explanation.substring(0, 200) + '...'
      : apodData.explanation
    : '';

  return (
    <div className={`apod-widget ${isPointerDevice ? 'pointer-device' : 'touch-device'}`}>
      
      {/* ---- Header ---- */}
      <div className="widget-header">
        <span className="widget-title">Astronomy Picture of the Day</span>
        <span className="widget-date">
          {format(selectedDate, 'MMM d, yyyy')}
        </span>
      </div>
      
      {/* ---- Error State ---- */}
      {error && (
        <div className="error-message">
          {error}
          <button onClick={() => fetchAPOD(selectedDate)} className="retry-btn">Retry</button>
        </div>
      )}
      
      {/* ---- Loading State ---- */}
      {loading && !error && (
        <div className="loading-state">
          <div className="loading-shimmer"></div>
          <span>Loading today's picture...</span>
        </div>
      )}
      
      {/* ---- Main Display ---- */}
      {!loading && !error && apodData && (
        <>
          {/* Image/Video Container */}
          <div className="media-container">
            {apodData.media_type === 'video' ? (
              <div className="video-wrapper">
                <iframe
                  src={apodData.url}
                  title={apodData.title}
                  allowFullScreen
                  className="apod-video"
                />
              </div>
            ) : (
              <>
                {!imageLoaded && (
                  <div className="image-loading">
                    <div className="loading-shimmer"></div>
                  </div>
                )}
                <img
                  src={apodData.url}
                  alt={apodData.title}
                  className={`apod-image ${imageLoaded ? 'loaded' : 'loading'}`}
                  onLoad={() => setImageLoaded(true)}
                />
              </>
            )}
          </div>
          
          {/* Title */}
          <h2 className="apod-title">{apodData.title}</h2>
          
          {/* Copyright */}
          {apodData.copyright && (
            <div className="apod-copyright">
              © {apodData.copyright}
            </div>
          )}
          
          {/* Explanation */}
          <div className="apod-explanation">
            <p>
              {showFullExplanation ? apodData.explanation : truncatedExplanation}
            </p>
            {apodData.explanation.length > 200 && (
              <button 
                onClick={() => setShowFullExplanation(!showFullExplanation)}
                className="read-more-btn"
              >
                {showFullExplanation ? 'Show less' : 'Read more'}
              </button>
            )}
          </div>
          
          {/* HD Link (for images) */}
          {apodData.media_type === 'image' && apodData.hdurl && (
            <a 
              href={apodData.hdurl} 
              target="_blank" 
              rel="noopener noreferrer"
              className="hd-link"
            >
              View HD Image ↗
            </a>
          )}
        </>
      )}
      
      {/* ---- Date Controls ---- */}
      <div className="date-controls">
        {isPointerDevice ? (
          // Pointer: compact inline controls
          <>
            <button 
              onClick={goToPrevDay} 
              className="date-btn"
              disabled={!canGoBack}
              title="Previous day"
            >
              ←
            </button>
            
            <button 
              onClick={goToRandomDate} 
              className="date-btn random-btn"
              title="Random APOD"
            >
              🎲
            </button>
            
            <input
              type="date"
              value={format(selectedDate, 'yyyy-MM-dd')}
              onChange={handleDateChange}
              min={format(APOD_START_DATE, 'yyyy-MM-dd')}
              max={format(new Date(), 'yyyy-MM-dd')}
              className="date-input"
            />
            
            <button 
              onClick={goToToday} 
              className="date-btn today-btn" 
              disabled={viewingToday}
            >
              Today
            </button>
            
            <button 
              onClick={goToNextDay} 
              className="date-btn"
              disabled={!canGoForward}
              title="Next day"
            >
              →
            </button>
          </>
        ) : (
          // Touch: larger buttons, stacked layout
          <>
            <div className="date-nav-row">
              <button 
                onClick={goToPrevDay} 
                className="date-btn large"
                disabled={!canGoBack}
              >
                ← Previous
              </button>
              <button 
                onClick={goToNextDay} 
                className="date-btn large"
                disabled={!canGoForward}
              >
                Next →
              </button>
            </div>
            <div className="date-action-row">
              <button 
                onClick={goToRandomDate} 
                className="date-btn large"
              >
                🎲 Random
              </button>
              <button 
                onClick={goToToday} 
                className="date-btn large" 
                disabled={viewingToday}
              >
                Today
              </button>
            </div>
            <input
              type="date"
              value={format(selectedDate, 'yyyy-MM-dd')}
              onChange={handleDateChange}
              min={format(APOD_START_DATE, 'yyyy-MM-dd')}
              max={format(new Date(), 'yyyy-MM-dd')}
              className="date-input large"
            />
          </>
        )}
      </div>
      
      {/* ---- Archive Note ---- */}
      <div className="archive-note">
        Archive goes back to June 16, 1995
      </div>
      
      {/* ---- Skeleton Styles ---- */}
      <style jsx>{`
        .apod-widget {
          --widget-bg: #ffffff;
          --widget-border: #e0e0e0;
          --text-primary: #000000;
          --text-secondary: #666666;
          --text-muted: #999999;
          --accent-color: #0066cc;
          
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
          margin-bottom: 12px;
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
          margin-bottom: 12px;
        }
        
        .retry-btn {
          padding: 4px 12px;
          background: #991b1b;
          color: white;
          border: none;
          border-radius: 4px;
          font-size: 12px;
          cursor: pointer;
        }
        
        .loading-state {
          text-align: center;
          padding: 60px 20px;
          color: var(--text-secondary);
          font-size: 14px;
        }
        
        .loading-shimmer {
          height: 200px;
          background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
          background-size: 200% 100%;
          animation: shimmer 1.5s infinite;
          border-radius: 8px;
          margin-bottom: 12px;
        }
        
        @keyframes shimmer {
          0% { background-position: -200% 0; }
          100% { background-position: 200% 0; }
        }
        
        .media-container {
          margin-bottom: 12px;
          border-radius: 8px;
          overflow: hidden;
          background: #000;
          position: relative;
          min-height: 200px;
        }
        
        .image-loading {
          position: absolute;
          inset: 0;
        }
        
        .image-loading .loading-shimmer {
          height: 100%;
          margin: 0;
          border-radius: 0;
        }
        
        .apod-image {
          width: 100%;
          height: auto;
          display: block;
          opacity: 0;
          transition: opacity 0.3s;
        }
        
        .apod-image.loaded {
          opacity: 1;
        }
        
        .video-wrapper {
          position: relative;
          padding-bottom: 56.25%; /* 16:9 aspect ratio */
          height: 0;
        }
        
        .apod-video {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          border: none;
        }
        
        .apod-title {
          font-size: 18px;
          font-weight: 600;
          color: var(--text-primary);
          margin: 0 0 8px 0;
          line-height: 1.3;
        }
        
        .apod-copyright {
          font-size: 12px;
          color: var(--text-muted);
          margin-bottom: 12px;
        }
        
        .apod-explanation {
          margin-bottom: 12px;
        }
        
        .apod-explanation p {
          font-size: 14px;
          line-height: 1.6;
          color: var(--text-secondary);
          margin: 0;
        }
        
        .read-more-btn {
          background: none;
          border: none;
          color: var(--accent-color);
          font-size: 13px;
          cursor: pointer;
          padding: 4px 0;
          margin-top: 4px;
        }
        
        .hd-link {
          display: inline-block;
          font-size: 13px;
          color: var(--accent-color);
          text-decoration: none;
          margin-bottom: 16px;
        }
        
        .hd-link:hover {
          text-decoration: underline;
        }
        
        .date-controls {
          display: flex;
          gap: 8px;
          align-items: center;
          justify-content: center;
          flex-wrap: wrap;
          padding-top: 12px;
          border-top: 1px solid var(--widget-border);
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
          opacity: 0.4;
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
        
        .archive-note {
          text-align: center;
          font-size: 11px;
          color: var(--text-muted);
          margin-top: 12px;
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
          width: 100%;
          padding: 12px;
          font-size: 15px;
        }
        
        .touch-device .apod-title {
          font-size: 20px;
        }
        
        .touch-device .apod-explanation p {
          font-size: 15px;
        }
      `}</style>
    </div>
  );
}