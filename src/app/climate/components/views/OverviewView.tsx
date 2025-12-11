'use client'

import { useState, useMemo, useCallback, useRef } from 'react'
import { Download, Share2, RotateCcw } from 'lucide-react'
import ClimateChart, { ClimateChartHandle } from '../chart/ClimateChart'
import MetricCategory from '../metrics/MetricCategory'
import ActiveDatasetsBar from '../metrics/ActiveDatasetsBar'
import { 
  DATASETS, 
  CATEGORIES, 
  getDatasetsByCategory, 
  getDatasetColor,
  DEFAULT_ACTIVE_DATASETS 
} from '../../lib/datasets'
import { DataPoint } from '../../lib/types'

// ===========================================
// OVERVIEW VIEW
// ===========================================

// Import data files - Original
import co2Data from '../../data/co2.json'
import tempGlobalData from '../../data/temp-global.json'
import tempArcticData from '../../data/temp-arctic.json'
import seaLevelData from '../../data/sea-level.json'
import arcticIceData from '../../data/arctic-ice.json'
import methaneData from '../../data/methane.json'
import oceanHeatData from '../../data/ocean-heat.json'
import greenlandIceData from '../../data/greenland-ice.json'
import oceanPhData from '../../data/ocean-ph.json'

// Import data files - Newly added (originally defined)
import n2oData from '../../data/n2o.json'
import tempOceanData from '../../data/temp-ocean.json'
import tempLandData from '../../data/temp-land.json'
import antarcticIceData from '../../data/antarctic-ice.json'
import glaciersData from '../../data/glaciers.json'

// Import data files - Biosphere
import forestCoverData from '../../data/forest-cover.json'
import coralBleachingData from '../../data/coral-bleaching.json'
import wildfireAreaData from '../../data/wildfire-area.json'
import permafrostData from '../../data/permafrost.json'

// Import data files - Biological Indicators
import cherryBlossomsData from '../../data/cherry-blossoms.json'
import wineHarvestData from '../../data/wine-harvest.json'
import growingSeasonData from '../../data/growing-season.json'
import birdMigrationData from '../../data/bird-migration.json'

// Import data files - Natural Forcings
import ensoData from '../../data/enso.json'
import solarIrradianceData from '../../data/solar-irradiance.json'
import volcanicAerosolsData from '../../data/volcanic-aerosols.json'

// Import data files - Emissions
import emissionsGlobalData from '../../data/emissions-global.json'
import emissionsCapitaData from '../../data/emissions-capita.json'

// Import data files - UK Data
import tempCetData from '../../data/temp-cet.json'
import ukRainfallData from '../../data/uk-rainfall.json'
import ukCoalShareData from '../../data/uk-coal-share.json'
import ukRenewableShareData from '../../data/uk-renewable-share.json'

// Import data files - Energy Transition
import renewableCapacityData from '../../data/renewable-capacity.json'
import solarCapacityData from '../../data/solar-capacity.json'
import windCapacityData from '../../data/wind-capacity.json'
import evSalesData from '../../data/ev-sales.json'

// Import data files - Extreme Events
import heatRecordsData from '../../data/heat-records.json'
import fossilSubsidiesData from '../../data/fossil-subsidies.json'

// Map data files to dataset IDs
const DATA_FILES: Record<string, { data: DataPoint[] }> = {
  // Atmospheric
  'co2': co2Data,
  'methane': methaneData,
  'n2o': n2oData,
  // Temperature
  'temp-global': tempGlobalData,
  'temp-arctic': tempArcticData,
  'temp-ocean': tempOceanData,
  'temp-land': tempLandData,
  // Cryosphere
  'arctic-ice': arcticIceData,
  'greenland-ice': greenlandIceData,
  'antarctic-ice': antarcticIceData,
  'glaciers': glaciersData,
  // Oceans
  'sea-level': seaLevelData,
  'ocean-heat': oceanHeatData,
  'ocean-ph': oceanPhData,
  // Biosphere
  'forest-cover': forestCoverData,
  'coral-bleaching': coralBleachingData,
  'wildfire-area': wildfireAreaData,
  'permafrost': permafrostData,
  // Biological Indicators
  'cherry-blossoms': cherryBlossomsData,
  'wine-harvest': wineHarvestData,
  'growing-season': growingSeasonData,
  'bird-migration': birdMigrationData,
  // Natural Forcings
  'enso': ensoData,
  'solar-irradiance': solarIrradianceData,
  'volcanic-aerosols': volcanicAerosolsData,
  // Emissions
  'emissions-global': emissionsGlobalData,
  'emissions-capita': emissionsCapitaData,
  // UK Data
  'temp-cet': tempCetData,
  'uk-rainfall': ukRainfallData,
  'uk-coal-share': ukCoalShareData,
  'uk-renewable-share': ukRenewableShareData,
  // Energy Transition
  'renewable-capacity': renewableCapacityData,
  'solar-capacity': solarCapacityData,
  'wind-capacity': windCapacityData,
  'ev-sales': evSalesData,
  // Extreme Events
  'heat-records': heatRecordsData,
  'fossil-subsidies': fossilSubsidiesData,
}

// Height presets
const HEIGHT_PRESETS = {
  compact: { label: 'Compact', height: 300 },
  default: { label: 'Default', height: 450 },
  tall: { label: 'Tall', height: 600 },
  full: { label: 'Full', height: 800 },
} as const

type HeightPreset = keyof typeof HEIGHT_PRESETS

export default function OverviewView() {
  const [activeDatasetIds, setActiveDatasetIds] = useState<string[]>(DEFAULT_ACTIVE_DATASETS)
  const [heightPreset, setHeightPreset] = useState<HeightPreset>('default')
  const [zoomLevel, setZoomLevel] = useState(100)
  const [isZoomed, setIsZoomed] = useState(false)
  const chartRef = useRef<ClimateChartHandle>(null)

  // Get current height
  const chartHeight = HEIGHT_PRESETS[heightPreset].height

  // Handle zoom changes from chart
  const handleZoomChange = useCallback((level: number, zoomed: boolean) => {
    setZoomLevel(level)
    setIsZoomed(zoomed)
  }, [])

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

  // Cycle through height presets
  const cycleHeight = useCallback(() => {
    const presets: HeightPreset[] = ['compact', 'default', 'tall', 'full']
    const currentIndex = presets.indexOf(heightPreset)
    const nextIndex = (currentIndex + 1) % presets.length
    setHeightPreset(presets[nextIndex])
  }, [heightPreset])

  // Get datasets by category
  const temperatureDatasets = getDatasetsByCategory('temperature')
  const atmosphericDatasets = getDatasetsByCategory('atmospheric')
  const cryosphereDatasets = getDatasetsByCategory('cryosphere')
  const oceansDatasets = getDatasetsByCategory('oceans')
  const biosphereDatasets = getDatasetsByCategory('biosphere')
  const biologicalDatasets = getDatasetsByCategory('biological')
  const forcingsDatasets = getDatasetsByCategory('forcings')
  const emissionsDatasets = getDatasetsByCategory('emissions')
  const ukDataDatasets = getDatasetsByCategory('uk-data')
  const energyTransitionDatasets = getDatasetsByCategory('energy-transition')
  const extremeEventsDatasets = getDatasetsByCategory('extreme-events')

  return (
    <div className="space-y-6">
      {/* Chart Section */}
      <div className="bg-white rounded-2xl border border-neutral-200 overflow-hidden">
        {/* Chart Header */}
        <div className="px-6 py-4 border-b border-neutral-100 flex items-center justify-between flex-wrap gap-4">
          <div>
            <h2 className="text-lg font-medium text-neutral-900">
              Climate Data Overview
            </h2>
            <p className="text-sm text-neutral-500 mt-0.5">
              Scroll to zoom, drag to pan. Select up to 6 datasets.
            </p>
          </div>
          
          {/* Chart Controls */}
          <div className="flex items-center gap-1">
            {/* Zoom reset button - only shows when zoomed */}
            {isZoomed && (
              <button
                onClick={() => chartRef.current?.resetZoom()}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium bg-neutral-100 text-neutral-700 hover:bg-neutral-200 rounded-lg transition-colors mr-2"
                title="Reset zoom"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>{zoomLevel}%</span>
              </button>
            )}
            
            {/* Height selector */}
            <div className="flex items-center border border-neutral-200 rounded-lg overflow-hidden mr-2">
              {(Object.keys(HEIGHT_PRESETS) as HeightPreset[]).map((preset) => (
                <button
                  key={preset}
                  onClick={() => setHeightPreset(preset)}
                  className={`
                    px-3 py-1.5 text-xs font-medium transition-colors
                    ${heightPreset === preset 
                      ? 'bg-neutral-900 text-white' 
                      : 'text-neutral-500 hover:text-neutral-900 hover:bg-neutral-50'
                    }
                  `}
                >
                  {HEIGHT_PRESETS[preset].label}
                </button>
              ))}
            </div>
            
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
              ref={chartRef}
              datasets={chartDatasets}
              height={chartHeight}
              showGrid={true}
              animate={true}
              onZoomChange={handleZoomChange}
            />
          ) : (
            <div 
              className="flex items-center justify-center bg-neutral-50 rounded-xl"
              style={{ height: chartHeight }}
            >
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

        <MetricCategory
          name={CATEGORIES.biosphere.name}
          description={CATEGORIES.biosphere.description}
          datasets={biosphereDatasets}
          activeDatasets={activeDatasetIds}
          onToggleDataset={handleToggleDataset}
          defaultExpanded={false}
        />

        <MetricCategory
          name={CATEGORIES.biological.name}
          description={CATEGORIES.biological.description}
          datasets={biologicalDatasets}
          activeDatasets={activeDatasetIds}
          onToggleDataset={handleToggleDataset}
          defaultExpanded={false}
        />

        <MetricCategory
          name={CATEGORIES.forcings.name}
          description={CATEGORIES.forcings.description}
          datasets={forcingsDatasets}
          activeDatasets={activeDatasetIds}
          onToggleDataset={handleToggleDataset}
          defaultExpanded={false}
        />

        <MetricCategory
          name={CATEGORIES.emissions.name}
          description={CATEGORIES.emissions.description}
          datasets={emissionsDatasets}
          activeDatasets={activeDatasetIds}
          onToggleDataset={handleToggleDataset}
          defaultExpanded={false}
        />

        <MetricCategory
          name={CATEGORIES['uk-data'].name}
          description={CATEGORIES['uk-data'].description}
          datasets={ukDataDatasets}
          activeDatasets={activeDatasetIds}
          onToggleDataset={handleToggleDataset}
          defaultExpanded={false}
        />

        <MetricCategory
          name={CATEGORIES['energy-transition'].name}
          description={CATEGORIES['energy-transition'].description}
          datasets={energyTransitionDatasets}
          activeDatasets={activeDatasetIds}
          onToggleDataset={handleToggleDataset}
          defaultExpanded={false}
        />

        <MetricCategory
          name={CATEGORIES['extreme-events'].name}
          description={CATEGORIES['extreme-events'].description}
          datasets={extremeEventsDatasets}
          activeDatasets={activeDatasetIds}
          onToggleDataset={handleToggleDataset}
          defaultExpanded={false}
        />
      </div>
    </div>
  )
}
