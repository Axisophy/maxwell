'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import {
  TLEData,
  SatellitePosition,
  OrbitPoint,
  ConstellationGroup,
} from '@/lib/satellites/types'
import {
  propagateAll,
  calculateOrbitPath,
} from '@/lib/satellites/propagate'

// Re-export types
export type { ConstellationGroup }

interface UseSatelliteDataOptions {
  groups: ConstellationGroup[]
  updateInterval?: number
  enabled?: boolean
}

interface UseSatelliteDataResult {
  satellites: SatellitePosition[]
  totalCount: Record<string, number>
  selectedSatellite: SatellitePosition | null
  orbitPath: OrbitPoint[]
  isLoading: boolean
  error: string | null
  selectSatellite: (sat: SatellitePosition | null) => void
  refresh: () => void
}

export function useSatelliteData({
  groups,
  updateInterval = 1000,
  enabled = true,
}: UseSatelliteDataOptions): UseSatelliteDataResult {
  const [tleData, setTleData] = useState<TLEData[]>([])
  const [satellites, setSatellites] = useState<SatellitePosition[]>([])
  const [totalCount, setTotalCount] = useState<Record<string, number>>({})
  const [selectedSatellite, setSelectedSatellite] = useState<SatellitePosition | null>(null)
  const [orbitPath, setOrbitPath] = useState<OrbitPoint[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchedGroupsRef = useRef<string>('')

  // Fetch TLE data from API
  const fetchTLEData = useCallback(async () => {
    if (groups.length === 0) return

    const groupsKey = groups.sort().join(',')

    // Only fetch if groups changed
    if (groupsKey === fetchedGroupsRef.current && tleData.length > 0) {
      return
    }

    try {
      setIsLoading(true)
      setError(null)

      const response = await fetch(`/api/satellites?groups=${groupsKey}`)

      if (!response.ok) {
        throw new Error('Failed to fetch satellite data')
      }

      const data = await response.json()

      // Flatten satellite data from all groups
      const allTLE: TLEData[] = []
      const counts: Record<string, number> = {}

      for (const [group, sats] of Object.entries(data.satellites)) {
        const satellites = sats as Array<{
          name: string
          noradId: string
          line1: string
          line2: string
          group: string
        }>
        counts[group] = satellites.length
        allTLE.push(...satellites)
      }

      setTleData(allTLE)
      setTotalCount(counts)
      fetchedGroupsRef.current = groupsKey
    } catch (err) {
      console.error('Failed to fetch TLE data:', err)
      setError(err instanceof Error ? err.message : 'Failed to fetch data')
    } finally {
      setIsLoading(false)
    }
  }, [groups, tleData.length])

  // Propagate positions
  const updatePositions = useCallback(() => {
    if (tleData.length === 0) return

    const positions = propagateAll(tleData)
    setSatellites(positions)

    // Update selected satellite position if selected
    if (selectedSatellite) {
      const updated = positions.find(s => s.id === selectedSatellite.id)
      if (updated) {
        setSelectedSatellite(updated)
      }
    }
  }, [tleData, selectedSatellite])

  // Select satellite and calculate orbit
  const selectSatellite = useCallback((sat: SatellitePosition | null) => {
    setSelectedSatellite(sat)

    if (sat) {
      const tle: TLEData = {
        name: sat.name,
        noradId: sat.noradId,
        line1: sat.line1,
        line2: sat.line2,
        group: sat.group,
      }
      const path = calculateOrbitPath(tle, 90, 180)
      setOrbitPath(path)
    } else {
      setOrbitPath([])
    }
  }, [])

  // Refresh data
  const refresh = useCallback(() => {
    fetchedGroupsRef.current = ''
    fetchTLEData()
  }, [fetchTLEData])

  // Fetch TLE data when groups change
  useEffect(() => {
    if (enabled) {
      fetchTLEData()
    }
  }, [enabled, fetchTLEData])

  // Update positions periodically
  useEffect(() => {
    if (!enabled || tleData.length === 0) return

    // Initial update
    updatePositions()

    // Set up interval
    const interval = setInterval(updatePositions, updateInterval)

    return () => clearInterval(interval)
  }, [enabled, tleData, updateInterval, updatePositions])

  return {
    satellites,
    totalCount,
    selectedSatellite,
    orbitPath,
    isLoading,
    error,
    selectSatellite,
    refresh,
  }
}
