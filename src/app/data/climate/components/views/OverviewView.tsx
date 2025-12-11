'use client'

import { useState, useEffect, useMemo, useCallback } from 'react'
import { Download, Share2, RotateCcw } from 'lucide-react'
import ClimateChart from '../chart/ClimateChart'
import MetricCategory from '../metrics/MetricCategory'
import ActiveDatasetsBar from '../metrics/ActiveDatasetsBar'
import { 
  DATASETS, 
  CATEGORIES, 
  getDatasetsByCategory, 
  getDatasetColor,
  DEFAULT_ACTIVE_DATASETS 
} from '../../lib/datasets'
import { DataPoint, ActiveDataset } from '../../lib/types'

// ===========================================
// OVERVIEW VIEW
// ===========================================
// Main climate data exploration view with:
// - Multi-axis chart showing selected datasets
// - Category panels with metric cards
// - Active datasets bar
// - Chart controls

// Import data files
import co2Data from '../../data/co2.json'
import tempGlobalData from '../../data/temp-global.json'
import seaLevelData from '../../data/sea-level.json'
import arcticIceData from '../../data/arctic-ice.json'

// Map data files to dataset IDs
const DATA_FILES: Record<string, { data: DataPoint[] }> = {
  'co2': co2Data,
  'temp-global': tempGlobalData,
  'sea-level': seaLevelData,
  'arctic-ice': arcticIceData,
}

export default function OverviewView() {
  const [activeDatasetIds, setActiveDatasetIds] = useState<string[]>(DEFAULT_ACTIVE_DATASETS)
  const [chartXDomain, setChartXDomain] = useState<[number, number] | null>(null)
  const [hoveredData, setHoveredData] = useState<{ year: number; values: { id: string; value: number }[] } | null>(null)

  // Prepare chart datasets from active selections
  const chartDatasets = useMemo(() => {
    const leftSideIds: string[] = []
    const rightSideIds: string[] = []
    
    // Alternate datasets between left and right Y-axes
    activeDatasetIds.forEach((id, i) => {
      if (i % 2 === 0) leftSideIds.push(id)
      else rightSideIds.push(id)
    })

    return activeDatasetIds.map(id => {
      const dataFile = DATA_FILES[id]
      return {
        id,
        data: dataFile?.data || [],
        color: getDatasetColor(id),
        yAxisSide: (leftSideIds.includes(id) ? 'left' : 'right') as 'left' | 'right',
      }
    }).filter(ds => ds.data.length > 0)
  }, [activeDatasetIds])

  // Toggle dataset active state
  const handleToggleDataset = useCallback((id: string) => {
    setActiveDatasetIds(prev => {
      if (prev.includes(id)) {
        return prev.filter(d => d !== id)
      }
      // Limit to 6 datasets for readability
      if (prev.length >= 6) {
        return [...prev.slice(1), id]
      }
      return [...prev, id]
    })
  }, [])

  // Remove dataset
  const handleRemoveDataset = useCallback((id: string) => {
    setActiveDatasetIds(prev => prev.filter(d => d !== id))
  }, [])

  // Clear all datasets
  const handleClearAll = useCallback(() => {
    setActiveDatasetIds([])
  }, [])

  // Reset zoom
  const handleResetZoom = useCallback(() => {
    setChartXDomain(null)
  }, [])

  // Handle chart hover
  const handleChartHover = useCallback((year: number | null, values: { id: string; value: number }[]) => {
    if (year) {
      setHoveredData({ year, values })
    } else {
      setHoveredData(null)
    }
  }, [])

  // Handle zoom change
  const handleZoom = useCallback((domain: [number, number]) => {
    setChartXDomain(domain)
  }, [])

  // Get datasets by category
  const atmosphericDatasets = getDatasetsByCategory('atmospheric')
  const temperatureDatasets = getDatasetsByCategory('temperature')
  const cryosphereDatasets = getDatasetsByCategory('cryosphere')
  const oceansDatasets = getDatasetsByCategory('oceans')

  return (
    <div className="space-y-6">
      {/* Chart Section */}
      <div className="bg-white rounded-2xl border border-neutral-200 overflow-hidden">
        {/* Chart Header */}
        <div className="px-6 py-4 border-b border-neutral-100 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-medium text-neutral-900">
              Climate Data Overview
            </h2>
            <p className="text-sm text-neutral-500 mt-0.5">
              Select datasets below to overlay on the chart. Scroll to zoom, drag to pan.
            </p>
          </div>
          
          {/* Chart Controls */}
          <div className="flex items-center gap-2">
            <button
              onClick={handleResetZoom}
              className="flex items-center gap-1.5 px-3 py-1.5 text-sm text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100 rounded-lg transition-colors"
              title="Reset zoom"
            >
              <RotateCcw className="w-4 h-4" />
              <span className="hidden sm:inline">Reset</span>
            </button>
            
            <button
              className="flex items-center gap-1.5 px-3 py-1.5 text-sm text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100 rounded-lg transition-colors"
              title="Download chart as PNG"
            >
              <Download className="w-4 h-4" />
              <span className="hidden sm:inline">PNG</span>
            </button>
            
            <button
              className="flex items-center gap-1.5 px-3 py-1.5 text-sm text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100 rounded-lg transition-colors"
              title="Share chart"
            >
              <Share2 className="w-4 h-4" />
              <span className="hidden sm:inline">Share</span>
            </button>
          </div>
        </div>
        
        {/* Chart */}
        <div className="p-6">
          {chartDatasets.length > 0 ? (
            <ClimateChart
              datasets={chartDatasets}
              xDomain={chartXDomain || undefined}
              onHover={handleChartHover}
              onZoom={handleZoom}
              height={450}
              showGrid={true}
              animate={true}
            />
          ) : (
            <div className="h-[450px] flex items-center justify-center bg-neutral-50 rounded-xl">
              <div className="text-center">
                <p className="text-neutral-500 mb-2">No datasets selected</p>
                <p className="text-sm text-neutral-400">
                  Choose from the categories below to start exploring
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Active Datasets Bar */}
      <ActiveDatasetsBar
        activeDatasets={activeDatasetIds}
        onRemove={handleRemoveDataset}
        onClearAll={handleClearAll}
      />

      {/* Dataset Categories */}
      <div className="space-y-4">
        <MetricCategory
          name={CATEGORIES.temperature.name}
          description={CATEGORIES.temperature.description}
          datasets={temperatureDatasets}
          activeDatasets={activeDatasetIds}
          onToggleDataset={handleToggleDataset}
          defaultExpanded={true}
        />
        
        <MetricCategory
          name={CATEGORIES.atmospheric.name}
          description={CATEGORIES.atmospheric.description}
          datasets={atmosphericDatasets}
          activeDatasets={activeDatasetIds}
          onToggleDataset={handleToggleDataset}
          defaultExpanded={false}
        />
        
        <MetricCategory
          name={CATEGORIES.cryosphere.name}
          description={CATEGORIES.cryosphere.description}
          datasets={cryosphereDatasets}
          activeDatasets={activeDatasetIds}
          onToggleDataset={handleToggleDataset}
          defaultExpanded={false}
        />
        
        <MetricCategory
          name={CATEGORIES.oceans.name}
          description={CATEGORIES.oceans.description}
          datasets={oceansDatasets}
          activeDatasets={activeDatasetIds}
          onToggleDataset={handleToggleDataset}
          defaultExpanded={false}
        />
      </div>
    </div>
  )
}
