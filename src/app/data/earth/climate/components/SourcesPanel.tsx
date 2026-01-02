'use client'

import { useState } from 'react'
import { ChevronDown, ExternalLink } from 'lucide-react'

// ===========================================
// SOURCES PANEL
// ===========================================
// Collapsible panel showing all data sources

interface Source {
  name: string
  description: string
  url: string
}

const SOURCES: Record<string, Source[]> = {
  'Atmospheric': [
    {
      name: 'NOAA Global Monitoring Laboratory',
      description: 'CO₂, CH₄, N₂O measurements from Mauna Loa and global network',
      url: 'https://gml.noaa.gov/ccgg/trends/',
    },
    {
      name: 'NOAA Paleoclimatology',
      description: 'Ice core records going back 800,000 years',
      url: 'https://www.ncei.noaa.gov/products/paleoclimatology/ice-core',
    },
  ],
  'Temperature': [
    {
      name: 'NASA GISS Surface Temperature',
      description: 'Global and regional temperature anomalies since 1880',
      url: 'https://data.giss.nasa.gov/gistemp/',
    },
    {
      name: 'UK Met Office HadCRUT5',
      description: 'Independent global temperature record since 1850',
      url: 'https://www.metoffice.gov.uk/hadobs/hadcrut5/',
    },
    {
      name: 'Berkeley Earth',
      description: 'Land surface temperature analysis',
      url: 'https://berkeleyearth.org/data/',
    },
  ],
  'Cryosphere': [
    {
      name: 'NSIDC Sea Ice Index',
      description: 'Arctic and Antarctic sea ice extent since 1979',
      url: 'https://nsidc.org/data/seaice_index',
    },
    {
      name: 'NASA GRACE/GRACE-FO',
      description: 'Ice sheet mass changes for Greenland and Antarctica',
      url: 'https://grace.jpl.nasa.gov/',
    },
    {
      name: 'World Glacier Monitoring Service',
      description: 'Global glacier mass balance measurements',
      url: 'https://wgms.ch/',
    },
  ],
  'Oceans': [
    {
      name: 'NASA Sea Level Change',
      description: 'Satellite altimetry data since 1993',
      url: 'https://sealevel.nasa.gov/',
    },
    {
      name: 'NOAA Ocean Heat Content',
      description: 'Global ocean heat content (0-2000m)',
      url: 'https://www.ncei.noaa.gov/access/global-ocean-heat-content/',
    },
    {
      name: 'NOAA Ocean Acidification',
      description: 'Ocean pH measurements and research',
      url: 'https://www.pmel.noaa.gov/co2/story/Ocean+Acidification',
    },
  ],
}

export default function SourcesPanel() {
  const [isExpanded, setIsExpanded] = useState(false)

  return (
    <div className="border border-neutral-200 rounded-xl overflow-hidden bg-white">
      {/* Header */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full px-5 py-3 flex items-center justify-between hover:bg-neutral-50 transition-colors"
      >
        <div className="flex items-center gap-3">
          <span className="text-sm font-medium text-neutral-700">
            Data Sources
          </span>
          <span className="text-xs text-neutral-400">
            Updated weekly
          </span>
        </div>
        
        <ChevronDown 
          className={`w-4 h-4 text-neutral-400 transition-transform ${isExpanded ? 'rotate-180' : ''}`}
        />
      </button>
      
      {/* Content */}
      {isExpanded && (
        <div className="px-5 pb-5 pt-2 border-t border-neutral-100">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {Object.entries(SOURCES).map(([category, sources]) => (
              <div key={category}>
                <h4 className="text-xs font-medium uppercase tracking-wider text-neutral-400 mb-3">
                  {category}
                </h4>
                <ul className="space-y-2.5">
                  {sources.map(source => (
                    <li key={source.name}>
                      <a
                        href={source.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group block"
                      >
                        <div className="flex items-center gap-1 text-sm text-neutral-700 group-hover:text-blue-600 transition-colors">
                          {source.name}
                          <ExternalLink className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                        </div>
                        <p className="text-xs text-neutral-400 mt-0.5">
                          {source.description}
                        </p>
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          
          {/* Footer note */}
          <div className="mt-6 pt-4 border-t border-neutral-100">
            <p className="text-xs text-neutral-400">
              All data is from peer-reviewed scientific sources. Climate data updates automatically 
              via weekly synchronization. Last update: December 9, 2024.
            </p>
          </div>
        </div>
      )}
    </div>
  )
}
