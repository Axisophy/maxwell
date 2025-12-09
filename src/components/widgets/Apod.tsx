'use client'

import { useState, useEffect, useCallback } from 'react'

// ===========================================
// APOD WIDGET
// ===========================================
// NASA Astronomy Picture of the Day
// Simple navigation: prev/next arrows + Today
// Videos link to NASA site rather than embed
// Data: NASA APOD via /api/apod (cached server-side)
// ===========================================

interface APODData {
  date: string
  title: string
  explanation: string
  url: string
  hdurl?: string
  mediaType: 'image' | 'video'
  copyright?: string
  nasaUrl: string
}

// Format date for display
function formatDisplayDate(dateStr: string): string {
  const date = new Date(dateStr + 'T12:00:00') // Noon to avoid timezone issues
  return date.toLocaleDateString('en-GB', { 
    day: 'numeric', 
    month: 'short', 
    year: 'numeric' 
  })
}

// Get today's date as YYYY-MM-DD
function getTodayString(): string {
  return new Date().toISOString().split('T')[0]
}

// Add/subtract days from a date string
function addDays(dateStr: string, days: number): string {
  const date = new Date(dateStr + 'T12:00:00')
  date.setDate(date.getDate() + days)
  return date.toISOString().split('T')[0]
}

// APOD start date
const APOD_START = '1995-06-16'

export default function APOD() {
  const [data, setData] = useState<APODData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [currentDate, setCurrentDate] = useState(getTodayString())
  const [imageLoaded, setImageLoaded] = useState(false)
  const [showExplanation, setShowExplanation] = useState(false)

  // Fetch APOD data
  const fetchData = useCallback(async (date: string) => {
    setIsLoading(true)
    setError(null)
    setImageLoaded(false)
    
    try {
      const response = await fetch(`/api/apod?date=${date}`)
      
      if (!response.ok) {
        const err = await response.json()
        throw new Error(err.error || 'Failed to fetch')
      }
      
      const result = await response.json()
      setData(result)
      setError(null)
    } catch (err) {
      console.error('Error fetching APOD:', err)
      setError(err instanceof Error ? err.message : 'Unable to fetch data')
    } finally {
      setIsLoading(false)
    }
  }, [])

  // Fetch on date change
  useEffect(() => {
    fetchData(currentDate)
  }, [currentDate, fetchData])

  // Navigation
  const today = getTodayString()
  const isToday = currentDate === today
  const canGoBack = currentDate > APOD_START
  const canGoForward = currentDate < today

  const goToPrev = () => {
    if (canGoBack) {
      setCurrentDate(addDays(currentDate, -1))
    }
  }

  const goToNext = () => {
    if (canGoForward) {
      setCurrentDate(addDays(currentDate, 1))
    }
  }

  const goToToday = () => {
    setCurrentDate(today)
  }

  // Loading state
  if (isLoading && !data) {
    return (
      <div className="w-full">
        <div className="aspect-[4/3] bg-[#e5e5e5] rounded-lg animate-pulse" />
        <div className="mt-3 h-5 bg-[#e5e5e5] rounded w-3/4 animate-pulse" />
        <div className="mt-2 h-4 bg-[#e5e5e5] rounded w-1/2 animate-pulse" />
      </div>
    )
  }

  // Error state
  if (error && !data) {
    return (
      <div className="w-full aspect-[4/3] flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-500 text-sm mb-2">{error}</div>
          <button 
            onClick={() => fetchData(currentDate)}
            className="text-xs text-text-muted hover:text-text-primary"
          >
            Try again
          </button>
        </div>
      </div>
    )
  }

  if (!data) return null

  // Truncate explanation
  const truncatedExplanation = data.explanation.length > 180
    ? data.explanation.slice(0, 180) + '...'
    : data.explanation

  return (
    <div className="w-full">
      {/* Date and source */}
      <div className="flex items-center justify-between mb-3">
        <span className="text-sm text-text-primary">
          {formatDisplayDate(data.date)}
        </span>
        <span className="text-xs text-text-muted font-mono">NASA</span>
      </div>

      {/* Image or video placeholder */}
      <div className="relative rounded-lg overflow-hidden bg-black mb-3">
        {data.mediaType === 'video' ? (
          // Video: show placeholder with link to NASA
          <a 
            href={data.nasaUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="block aspect-[4/3] bg-[#1a1a1a] flex items-center justify-center group"
          >
            <div className="text-center">
              <div className="w-16 h-16 rounded-full bg-white/10 flex items-center justify-center mb-3 mx-auto group-hover:bg-white/20 transition-colors">
                <svg className="w-8 h-8 text-white ml-1" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M8 5v14l11-7z" />
                </svg>
              </div>
              <span className="text-white/70 text-sm group-hover:text-white transition-colors">
                View video on NASA →
              </span>
            </div>
          </a>
        ) : (
          // Image
          <>
            {!imageLoaded && (
              <div className="aspect-[4/3] bg-[#1a1a1a] animate-pulse" />
            )}
            <img
              src={data.url}
              alt={data.title}
              className={`w-full h-auto transition-opacity duration-300 ${
                imageLoaded ? 'opacity-100' : 'opacity-0 absolute'
              }`}
              onLoad={() => setImageLoaded(true)}
            />
          </>
        )}
        
        {/* Loading overlay */}
        {isLoading && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
            <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          </div>
        )}
      </div>

      {/* Title */}
      <h3 className="text-base font-medium text-text-primary leading-snug mb-2">
        {data.title}
      </h3>

      {/* Copyright (subtle) */}
      {data.copyright && (
        <div className="text-xs text-text-muted mb-2">
          © {data.copyright}
        </div>
      )}

      {/* Collapsible explanation */}
      <div className="border-t border-[#e5e5e5] pt-3 mt-3">
        <button
          onClick={() => setShowExplanation(!showExplanation)}
          className="flex items-center justify-between w-full text-left"
        >
          <span className="text-xs text-text-muted uppercase tracking-wide">
            About this image
          </span>
          <svg 
            className={`w-4 h-4 text-text-muted transition-transform ${showExplanation ? 'rotate-180' : ''}`}
            fill="none" 
            viewBox="0 0 24 24" 
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>
        
        {showExplanation && (
          <p className="text-sm text-text-muted leading-relaxed mt-3">
            {data.explanation}
          </p>
        )}
      </div>

      {/* Navigation */}
      <div className="flex items-center justify-between border-t border-[#e5e5e5] pt-3 mt-3">
        <button
          onClick={goToPrev}
          disabled={!canGoBack || isLoading}
          className="flex items-center gap-1 text-sm text-text-muted hover:text-text-primary disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          <span>Prev</span>
        </button>

        <button
          onClick={goToToday}
          disabled={isToday || isLoading}
          className="text-sm text-text-muted hover:text-text-primary disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
        >
          Today
        </button>

        <button
          onClick={goToNext}
          disabled={!canGoForward || isLoading}
          className="flex items-center gap-1 text-sm text-text-muted hover:text-text-primary disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
        >
          <span>Next</span>
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>
    </div>
  )
}