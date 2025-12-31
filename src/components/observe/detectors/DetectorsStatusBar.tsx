'use client'

import { useState, useEffect } from 'react'

interface DetectorsStatusBarProps {
  className?: string
}

interface DetectorStats {
  lhcStatus: string
  lhcEnergy: number
  ligoStatus: string
  icecubeAlerts: number
}

export default function DetectorsStatusBar({ className = '' }: DetectorsStatusBarProps) {
  const [stats, setStats] = useState<DetectorStats | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchData() {
      try {
        // For now, use simulated data - will connect to real APIs later
        // LHC typically runs in cycles with technical stops
        const lhcStatuses = ['STABLE BEAMS', 'RAMP', 'INJECTION', 'NO BEAM', 'FLAT TOP']
        const randomStatus = lhcStatuses[Math.floor(Math.random() * 2)] // Mostly stable beams

        setStats({
          lhcStatus: randomStatus,
          lhcEnergy: 6800, // GeV per beam (13.6 TeV collisions)
          ligoStatus: 'OBSERVING',
          icecubeAlerts: Math.floor(Math.random() * 5) + 1, // 1-5 alerts in 24h
        })
      } catch (error) {
        console.error('Failed to fetch detector stats:', error)
        setStats({
          lhcStatus: 'STABLE BEAMS',
          lhcEnergy: 6800,
          ligoStatus: 'OBSERVING',
          icecubeAlerts: 2,
        })
      } finally {
        setLoading(false)
      }
    }

    fetchData()
    const interval = setInterval(fetchData, 5 * 60 * 1000) // Every 5 minutes
    return () => clearInterval(interval)
  }, [])

  const getLHCStatusColor = (status: string) => {
    switch (status) {
      case 'STABLE BEAMS':
        return 'text-emerald-400'
      case 'RAMP':
      case 'FLAT TOP':
        return 'text-amber-400'
      case 'INJECTION':
        return 'text-cyan-400'
      default:
        return 'text-white/40'
    }
  }

  const getLIGOStatusColor = (status: string) => {
    switch (status) {
      case 'OBSERVING':
        return 'text-emerald-400'
      case 'COMMISSIONING':
        return 'text-amber-400'
      default:
        return 'text-white/40'
    }
  }

  if (loading) {
    return (
      <div className={`bg-[#0f0f14] rounded-xl p-4 ${className}`}>
        <div className="flex items-center gap-2 text-white/40 text-sm">
          <div className="w-2 h-2 rounded-full bg-white/20 animate-pulse" />
          Loading detector status...
        </div>
      </div>
    )
  }

  if (!stats) return null

  return (
    <div className={`bg-[#0f0f14] rounded-xl p-4 ${className}`}>
      <div className="flex flex-wrap items-center gap-4 md:gap-8">
        {/* Live indicator */}
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-xs font-mono text-white/40 uppercase">Live</span>
        </div>

        {/* LHC Status */}
        <div className="flex items-center gap-2">
          <span className="text-xs text-white/40">LHC</span>
          <span className={`text-sm font-mono font-bold ${getLHCStatusColor(stats.lhcStatus)}`}>
            {stats.lhcStatus}
          </span>
        </div>

        {/* LHC Energy */}
        <div className="flex items-center gap-2">
          <span className="text-xs text-white/40">Energy</span>
          <span className="text-lg font-mono font-bold text-purple-400">
            {(stats.lhcEnergy / 1000).toFixed(1)}
          </span>
          <span className="text-xs text-white/30">TeV/beam</span>
        </div>

        {/* LIGO Status */}
        <div className="flex items-center gap-2">
          <span className="text-xs text-white/40">LIGO</span>
          <span className={`text-sm font-mono font-bold ${getLIGOStatusColor(stats.ligoStatus)}`}>
            {stats.ligoStatus}
          </span>
        </div>

        {/* IceCube Alerts */}
        <div className="flex items-center gap-2">
          <span className="text-xs text-white/40">IceCube</span>
          <span className="text-lg font-mono font-bold text-cyan-400">
            {stats.icecubeAlerts}
          </span>
          <span className="text-xs text-white/30">alerts (24h)</span>
        </div>
      </div>
    </div>
  )
}
