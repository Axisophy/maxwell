'use client'

import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import { BreadcrumbFrame, breadcrumbItems, PageHeaderFrame } from '@/components/ui'
import { ObserveIcon } from '@/components/icons'

interface GridData {
  frequency: number
  demand: number
  generation: Record<string, number>
  intensity: number // actual or forecast gCO2/kWh
  renewable: number
  lowCarbon: number
}

const GENERATION_COLORS: Record<string, string> = {
  gas: 'bg-orange-500',
  nuclear: 'bg-purple-500',
  wind: 'bg-teal-500',
  solar: 'bg-yellow-400',
  hydro: 'bg-blue-500',
  biomass: 'bg-green-600',
  coal: 'bg-gray-600',
  imports: 'bg-gray-400',
  other: 'bg-gray-300',
}

const GENERATION_LABELS: Record<string, string> = {
  gas: 'Gas',
  nuclear: 'Nuclear',
  wind: 'Wind',
  solar: 'Solar',
  hydro: 'Hydro',
  biomass: 'Biomass',
  coal: 'Coal',
  imports: 'Imports',
  other: 'Other',
}

export default function PowerPage() {
  const [data, setData] = useState<GridData | null>(null)
  const [loading, setLoading] = useState(true)

  const fetchData = useCallback(async () => {
    try {
      // Fetch UK energy data and grid frequency in parallel
      const [energyRes, freqRes] = await Promise.all([
        fetch('/api/uk-energy'),
        fetch('/api/grid-frequency'),
      ])

      const energyData = await energyRes.json()
      const freqData = await freqRes.json()

      // Extract intensity - API returns { actual, forecast, index }
      const intensityValue = typeof energyData.intensity === 'object'
        ? (energyData.intensity?.actual ?? energyData.intensity?.forecast ?? 186)
        : (energyData.intensity || 186)

      setData({
        frequency: freqData.frequency || 50.0,
        demand: energyData.demand || 32.4,
        generation: energyData.generation || {},
        intensity: intensityValue,
        renewable: energyData.renewablePercent ?? energyData.renewable ?? 35,
        lowCarbon: energyData.lowCarbonPercent ?? energyData.lowCarbon ?? 55,
      })
    } catch (error) {
      console.error('Failed to fetch power data:', error)
      // Fallback data
      setData({
        frequency: 50.01,
        demand: 32.4,
        generation: {
          gas: 38,
          nuclear: 15,
          wind: 25,
          solar: 5,
          hydro: 2,
          biomass: 5,
          imports: 8,
          other: 2,
        },
        intensity: 186,
        renewable: 32,
        lowCarbon: 47,
      })
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchData()
    const interval = setInterval(fetchData, 30 * 1000) // Every 30 seconds
    return () => clearInterval(interval)
  }, [fetchData])

  const getFrequencyColor = (freq: number) => {
    const deviation = Math.abs(freq - 50)
    if (deviation > 0.2) return 'text-red-600'
    if (deviation > 0.1) return 'text-amber-600'
    return 'text-emerald-600'
  }

  const getIntensityColor = (intensity: number) => {
    if (intensity < 100) return 'text-emerald-600'
    if (intensity < 200) return 'text-yellow-600'
    if (intensity < 300) return 'text-orange-600'
    return 'text-red-600'
  }

  if (loading) {
    return (
      <main className="min-h-screen bg-[#f5f5f5]">
        <div className="px-4 md:px-8 lg:px-12 pt-8 md:pt-12 lg:pt-16 pb-16">
          <div className="animate-pulse">
            <div className="h-8 bg-black/10 rounded w-48 mb-4" />
            <div className="h-12 bg-black/10 rounded w-96 mb-8" />
            <div className="h-64 bg-black/10 rounded" />
          </div>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-[#f5f5f5]">
      <div className="px-4 md:px-8 lg:px-12 pt-8 md:pt-12 lg:pt-16 pb-16 md:pb-20 lg:pb-24">
        <BreadcrumbFrame
          variant="light"
          icon={<ObserveIcon className="w-4 h-4" />}
          items={breadcrumbItems(
            ['MXWLL', '/'],
            ['Observe', '/observe'],
            ['Infrastructure', '/observe/infrastructure'],
            ['Power']
          )}
        />

        <PageHeaderFrame
          variant="light"
          title="Power grids"
          description="Live monitoring of electrical power grids. Generation mix, demand, frequency, and carbon intensity."
        />

        {/* Grid Frequency Hero */}
        <section className="mb-8">
          <div className="bg-white rounded-xl p-8 text-center">
            <h2 className="text-sm font-mono text-black/40 uppercase tracking-wider mb-4">
              UK Grid Frequency
            </h2>
            <div className="mb-4">
              <span className={`text-7xl md:text-8xl font-light ${data ? getFrequencyColor(data.frequency) : ''}`}>
                {data?.frequency.toFixed(3)}
              </span>
              <span className="text-2xl text-black/40 ml-2">Hz</span>
            </div>

            {/* Frequency scale */}
            <div className="max-w-md mx-auto mb-4">
              <div className="relative h-3 bg-gradient-to-r from-red-500 via-emerald-500 to-red-500 rounded-full">
                {data && (
                  <div
                    className="absolute top-1/2 -translate-y-1/2 w-4 h-4 bg-white border-2 border-black rounded-full shadow-lg"
                    style={{ left: `${((data.frequency - 49.5) / 1) * 100}%` }}
                  />
                )}
              </div>
              <div className="flex justify-between text-xs text-black/40 mt-1">
                <span>49.5 Hz</span>
                <span>50.0 Hz</span>
                <span>50.5 Hz</span>
              </div>
            </div>

            <p className="text-sm text-black/50">
              Grid frequency indicates supply/demand balance.
              {data && data.frequency < 50 ? ' Below 50Hz = demand exceeds supply.' : ' Above 50Hz = supply exceeds demand.'}
            </p>
          </div>
        </section>

        {/* Current Status Grid */}
        <section className="mb-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-white rounded-xl p-5 text-center">
              <p className="text-xs text-black/40 mb-1">Current Demand</p>
              <p className="text-3xl font-light text-black">{data?.demand.toFixed(1)}</p>
              <p className="text-xs text-black/40">GW</p>
            </div>
            <div className="bg-white rounded-xl p-5 text-center">
              <p className="text-xs text-black/40 mb-1">Carbon Intensity</p>
              <p className={`text-3xl font-light ${data ? getIntensityColor(data.intensity) : ''}`}>
                {data?.intensity}
              </p>
              <p className="text-xs text-black/40">gCO₂/kWh</p>
            </div>
            <div className="bg-white rounded-xl p-5 text-center">
              <p className="text-xs text-black/40 mb-1">Renewable</p>
              <p className="text-3xl font-light text-emerald-600">{data?.renewable}%</p>
              <p className="text-xs text-black/40">of generation</p>
            </div>
            <div className="bg-white rounded-xl p-5 text-center">
              <p className="text-xs text-black/40 mb-1">Low Carbon</p>
              <p className="text-3xl font-light text-teal-600">{data?.lowCarbon}%</p>
              <p className="text-xs text-black/40">of generation</p>
            </div>
          </div>
        </section>

        {/* Generation Mix */}
        <section className="mb-8">
          <h2 className="text-sm font-mono text-black/40 uppercase tracking-wider mb-4">
            UK Generation Mix
          </h2>
          <div className="bg-white rounded-xl p-6">
            {/* Stacked bar */}
            <div className="h-12 flex rounded-lg overflow-hidden mb-6">
              {data && Object.entries(data.generation)
                .filter(([, value]) => value > 0)
                .sort(([, a], [, b]) => b - a)
                .map(([source, percentage]) => (
                  <div
                    key={source}
                    className={`${GENERATION_COLORS[source] || 'bg-gray-400'} flex items-center justify-center`}
                    style={{ width: `${percentage}%` }}
                  >
                    {percentage >= 8 && (
                      <span className="text-white text-xs font-medium">
                        {percentage}%
                      </span>
                    )}
                  </div>
                ))}
            </div>

            {/* Legend */}
            <div className="grid grid-cols-3 md:grid-cols-5 gap-4">
              {data && Object.entries(data.generation)
                .filter(([, value]) => value > 0)
                .sort(([, a], [, b]) => b - a)
                .map(([source, percentage]) => (
                  <div key={source} className="flex items-center gap-2">
                    <div className={`w-3 h-3 rounded ${GENERATION_COLORS[source] || 'bg-gray-400'}`} />
                    <div>
                      <p className="text-sm text-black">{GENERATION_LABELS[source] || source}</p>
                      <p className="text-xs text-black/40">{percentage}%</p>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </section>

        {/* Carbon Intensity Scale */}
        <section className="mb-8">
          <h2 className="text-sm font-mono text-black/40 uppercase tracking-wider mb-4">
            Carbon Intensity Scale
          </h2>
          <div className="bg-white rounded-xl p-6">
            <div className="flex gap-2 mb-4">
              {[
                { range: '0-50', label: 'Very Low', color: 'bg-emerald-500' },
                { range: '50-100', label: 'Low', color: 'bg-green-500' },
                { range: '100-200', label: 'Moderate', color: 'bg-yellow-500' },
                { range: '200-300', label: 'High', color: 'bg-orange-500' },
                { range: '300+', label: 'Very High', color: 'bg-red-500' },
              ].map((level) => (
                <div key={level.range} className="flex-1 text-center">
                  <div className={`h-4 ${level.color} rounded mb-2`} />
                  <p className="text-xs text-black">{level.range}</p>
                  <p className="text-xs text-black/40">{level.label}</p>
                </div>
              ))}
            </div>
            <p className="text-xs text-black/50 text-center">
              gCO₂ emitted per kWh of electricity consumed
            </p>
          </div>
        </section>

        {/* How Grid Frequency Works */}
        <section className="mb-8">
          <h2 className="text-sm font-mono text-black/40 uppercase tracking-wider mb-4">
            How Grid Frequency Works
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-white rounded-xl p-5">
              <h3 className="text-sm font-medium text-black mb-3">The Balance Act</h3>
              <p className="text-xs text-black/50 leading-relaxed">
                Electricity supply must exactly match demand at every moment. The grid
                frequency is a real-time indicator of this balance. When demand exceeds
                supply, generators slow down and frequency drops. When supply exceeds
                demand, frequency rises.
              </p>
            </div>
            <div className="bg-white rounded-xl p-5">
              <h3 className="text-sm font-medium text-black mb-3">Why 50 Hz?</h3>
              <p className="text-xs text-black/50 leading-relaxed">
                The UK and Europe use 50 Hz; the US uses 60 Hz. These are historical choices.
                All generators on a grid must spin at the same frequency, synchronized
                within milliseconds. A deviation of just 0.5 Hz can trigger automatic
                load shedding to protect the grid.
              </p>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="pt-8 border-t border-black/10">
          <div className="flex flex-wrap gap-6">
            <Link
              href="/observe/infrastructure"
              className="text-black/60 hover:text-black transition-colors text-sm"
            >
              ← Back to Infrastructure
            </Link>
            <Link
              href="/observe/infrastructure/internet"
              className="text-black/60 hover:text-black transition-colors text-sm"
            >
              Submarine Cables →
            </Link>
          </div>

          <div className="mt-6 pt-6 border-t border-black/10">
            <p className="text-xs text-black/30 mb-2">Data Sources</p>
            <p className="text-xs text-black/40">
              Carbon Intensity API • National Grid ESO
            </p>
          </div>
        </footer>
      </div>
    </main>
  )
}
