'use client'

import { useState } from 'react'
import { ChevronDown, ExternalLink, Info } from 'lucide-react'
import { DatasetMetadata, formatValue } from '../../lib/datasets'

// ===========================================
// METRIC CARD COMPONENT (ENHANCED)
// ===========================================
// Displays a single climate metric with current value
// Can be toggled to add/remove from chart
// Includes expandable info panel with full description

interface MetricCardProps {
  dataset: DatasetMetadata
  isActive: boolean
  onToggle: () => void
}

export default function MetricCard({ dataset, isActive, onToggle }: MetricCardProps) {
  const [showInfo, setShowInfo] = useState(false)
  const { 
    shortName, 
    name,
    currentValue, 
    changePerDecade, 
    unitShort, 
    unit,
    direction, 
    color,
    description,
    source,
    sourceUrl,
    baseline,
    startYear,
    endYear
  } = dataset
  
  // Determine trend direction
  const isIncreasing = changePerDecade && changePerDecade > 0
  const trendBad = (direction === 'up-bad' && isIncreasing) || (direction === 'down-bad' && !isIncreasing)
  
  return (
    <div 
      className={`
        relative rounded-xl border-2 transition-all duration-200
        ${isActive 
          ? 'border-current bg-neutral-50' 
          : 'border-transparent bg-white hover:border-neutral-200'
        }
      `}
      style={{ 
        borderColor: isActive ? color : undefined,
      }}
    >
      {/* Main clickable area */}
      <button
        onClick={onToggle}
        className="w-full p-4 text-left group"
      >
        {/* Active indicator dot */}
        {isActive && (
          <div 
            className="absolute top-3 right-3 w-2 h-2 rounded-full"
            style={{ backgroundColor: color }}
          />
        )}
        
        {/* Label */}
        <div className="text-xs font-medium uppercase tracking-wider text-neutral-400 mb-1">
          {shortName}
        </div>
        
        {/* Value */}
        <div className="flex items-baseline gap-1.5">
          <span 
            className="font-mono text-2xl font-bold"
            style={{ color: isActive ? color : '#000' }}
          >
            {currentValue !== undefined ? formatValue(currentValue, unitShort) : '-'}
          </span>
          <span className="text-sm text-neutral-400">
            {unitShort}
          </span>
        </div>
        
        {/* Trend */}
        {changePerDecade !== undefined && (
          <div className={`
            mt-1.5 text-xs font-mono
            ${trendBad ? 'text-red-500' : 'text-neutral-500'}
          `}>
            {isIncreasing ? '↑' : '↓'} {Math.abs(changePerDecade).toFixed(1)} / decade
          </div>
        )}
        
        {/* Add/Remove hint */}
        <div className={`
          mt-2 text-xs transition-opacity
          ${isActive ? 'text-neutral-500' : 'text-neutral-400 opacity-0 group-hover:opacity-100'}
        `}>
          {isActive ? 'Click to remove' : '+ Add to chart'}
        </div>
      </button>

      {/* Info toggle button */}
      <button
        onClick={(e) => {
          e.stopPropagation()
          setShowInfo(!showInfo)
        }}
        className={`
          absolute bottom-3 right-3 flex items-center gap-1 
          text-xs text-neutral-400 hover:text-neutral-600 
          transition-colors z-10
        `}
      >
        <Info className="w-3.5 h-3.5" />
        <ChevronDown 
          className={`w-3 h-3 transition-transform duration-200 ${
            showInfo ? 'rotate-180' : ''
          }`} 
        />
      </button>

      {/* Expandable info panel */}
      <div
        className={`
          overflow-hidden transition-all duration-300 ease-in-out
          ${showInfo ? 'max-h-[800px] opacity-100' : 'max-h-0 opacity-0'}
        `}
      >
        <div className="px-4 pb-4 border-t border-neutral-100 mt-2 pt-4">
          {/* Full name */}
          <h4 className="font-medium text-neutral-900 mb-2">
            {name}
          </h4>

          {/* Description - this is the long narrative text */}
          <p className="text-sm text-neutral-600 leading-relaxed mb-4">
            {description}
          </p>

          {/* Stats row */}
          <div className="flex flex-wrap gap-2 mb-4">
            {baseline && (
              <div className="bg-neutral-100 rounded-lg px-2.5 py-1.5">
                <span className="text-[10px] uppercase tracking-wider text-neutral-500 block">
                  Baseline
                </span>
                <span className="text-xs font-medium text-neutral-700">
                  {baseline}
                </span>
              </div>
            )}
            
            <div className="bg-neutral-100 rounded-lg px-2.5 py-1.5">
              <span className="text-[10px] uppercase tracking-wider text-neutral-500 block">
                Record
              </span>
              <span className="text-xs font-medium text-neutral-700">
                {startYear < 0 
                  ? `${Math.abs(startYear).toLocaleString()} BCE`
                  : startYear
                } – {endYear}
              </span>
            </div>

            {changePerDecade !== undefined && (
              <div className="bg-neutral-100 rounded-lg px-2.5 py-1.5">
                <span className="text-[10px] uppercase tracking-wider text-neutral-500 block">
                  Change/decade
                </span>
                <span className={`text-xs font-medium ${
                  trendBad ? 'text-red-600' : 'text-neutral-700'
                }`}>
                  {changePerDecade > 0 ? '+' : ''}{changePerDecade} {unitShort}
                </span>
              </div>
            )}
          </div>

          {/* Source link */}
          <a
            href={sourceUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            className="inline-flex items-center gap-1.5 text-xs text-blue-600 hover:text-blue-700 hover:underline"
          >
            <span>Source: {source}</span>
            <ExternalLink className="w-3 h-3" />
          </a>
        </div>
      </div>
    </div>
  )
}