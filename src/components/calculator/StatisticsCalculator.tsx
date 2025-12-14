'use client'

import { useState, useMemo } from 'react'

interface Statistics {
  count: number
  sum: number
  mean: number
  median: number
  mode: number[]
  min: number
  max: number
  range: number
  variance: number
  stdDev: number
  stdError: number
  q1: number
  q2: number
  q3: number
  iqr: number
}

export default function StatisticsCalculator() {
  const [input, setInput] = useState('')
  const [data, setData] = useState<number[]>([])
  const [error, setError] = useState('')

  // Parse input data
  const parseData = () => {
    setError('')
    const values = input
      .split(/[,\n\s]+/)
      .map(s => s.trim())
      .filter(s => s.length > 0)
      .map(s => parseFloat(s))
      .filter(n => !isNaN(n))
    
    if (values.length === 0) {
      setError('Please enter valid numbers')
      return
    }
    
    setData(values)
  }

  // Calculate statistics
  const stats = useMemo<Statistics | null>(() => {
    if (data.length === 0) return null
    
    const sorted = [...data].sort((a, b) => a - b)
    const n = data.length
    const sum = data.reduce((a, b) => a + b, 0)
    const mean = sum / n
    
    // Median
    const median = n % 2 === 0
      ? (sorted[n/2 - 1] + sorted[n/2]) / 2
      : sorted[Math.floor(n/2)]
    
    // Mode
    const frequency: Record<number, number> = {}
    data.forEach(v => { frequency[v] = (frequency[v] || 0) + 1 })
    const maxFreq = Math.max(...Object.values(frequency))
    const mode = Object.entries(frequency)
      .filter(([_, f]) => f === maxFreq)
      .map(([v]) => parseFloat(v))
    
    // Variance and standard deviation
    const squaredDiffs = data.map(v => Math.pow(v - mean, 2))
    const variance = squaredDiffs.reduce((a, b) => a + b, 0) / n
    const stdDev = Math.sqrt(variance)
    const stdError = stdDev / Math.sqrt(n)
    
    // Quartiles
    const q1Index = Math.floor(n * 0.25)
    const q3Index = Math.floor(n * 0.75)
    const q1 = sorted[q1Index]
    const q2 = median
    const q3 = sorted[q3Index]
    
    return {
      count: n,
      sum,
      mean,
      median,
      mode,
      min: sorted[0],
      max: sorted[n - 1],
      range: sorted[n - 1] - sorted[0],
      variance,
      stdDev,
      stdError,
      q1,
      q2,
      q3,
      iqr: q3 - q1
    }
  }, [data])

  // Format number
  const fmt = (n: number, decimals = 4) => {
    if (isNaN(n) || !isFinite(n)) return '—'
    return n.toLocaleString(undefined, { 
      minimumFractionDigits: 0, 
      maximumFractionDigits: decimals 
    })
  }

  // Clear data
  const clearData = () => {
    setData([])
    setInput('')
    setError('')
  }

  // Load sample data
  const loadSample = () => {
    const sample = [12, 15, 18, 22, 25, 28, 30, 35, 40, 42, 45, 48, 50, 55, 60]
    setInput(sample.join(', '))
    setData(sample)
    setError('')
  }

  // Stat row component
  const StatRow = ({ label, value }: { label: string, value: string }) => (
    <div className="flex justify-between py-2 border-b border-neutral-100">
      <span className="text-black/60">{label}</span>
      <span className="font-mono font-medium">{value}</span>
    </div>
  )

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Input Area */}
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-black/60 mb-2">
            Enter data (comma, space, or newline separated)
          </label>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="e.g., 12, 15, 18, 22, 25, 28..."
            className="w-full h-48 p-4 font-mono text-sm bg-neutral-100 rounded-xl border-0 focus:ring-2 focus:ring-black resize-none"
          />
        </div>
        
        {error && (
          <div className="text-red-500 text-sm">{error}</div>
        )}
        
        <div className="flex gap-2">
          <button
            onClick={parseData}
            className="flex-1 py-3 bg-black text-white rounded-lg font-medium hover:bg-neutral-800 transition-colors"
          >
            Calculate
          </button>
          <button
            onClick={clearData}
            className="px-4 py-3 bg-neutral-200 text-black rounded-lg font-medium hover:bg-neutral-300 transition-colors"
          >
            Clear
          </button>
          <button
            onClick={loadSample}
            className="px-4 py-3 bg-neutral-200 text-black rounded-lg font-medium hover:bg-neutral-300 transition-colors"
          >
            Sample
          </button>
        </div>
        
        {data.length > 0 && (
          <div className="text-sm text-black/50">
            {data.length} values loaded
          </div>
        )}
      </div>
      
      {/* Results Area */}
      <div className="space-y-4">
        {stats ? (
          <>
            {/* Descriptive Statistics */}
            <div className="bg-neutral-100 rounded-xl p-4">
              <h3 className="text-sm font-medium text-black/40 uppercase tracking-wider mb-3">
                Descriptive Statistics
              </h3>
              <StatRow label="Count (n)" value={fmt(stats.count, 0)} />
              <StatRow label="Sum (Σx)" value={fmt(stats.sum)} />
              <StatRow label="Mean (x̄)" value={fmt(stats.mean)} />
              <StatRow label="Median" value={fmt(stats.median)} />
              <StatRow label="Mode" value={stats.mode.length > 3 ? 'Multiple' : stats.mode.map(m => fmt(m)).join(', ')} />
              <StatRow label="Minimum" value={fmt(stats.min)} />
              <StatRow label="Maximum" value={fmt(stats.max)} />
              <StatRow label="Range" value={fmt(stats.range)} />
            </div>
            
            {/* Dispersion */}
            <div className="bg-neutral-100 rounded-xl p-4">
              <h3 className="text-sm font-medium text-black/40 uppercase tracking-wider mb-3">
                Dispersion
              </h3>
              <StatRow label="Variance (σ²)" value={fmt(stats.variance)} />
              <StatRow label="Std Deviation (σ)" value={fmt(stats.stdDev)} />
              <StatRow label="Std Error" value={fmt(stats.stdError)} />
            </div>
            
            {/* Distribution */}
            <div className="bg-neutral-100 rounded-xl p-4">
              <h3 className="text-sm font-medium text-black/40 uppercase tracking-wider mb-3">
                Distribution
              </h3>
              <StatRow label="Q1 (25th percentile)" value={fmt(stats.q1)} />
              <StatRow label="Q2 (Median)" value={fmt(stats.q2)} />
              <StatRow label="Q3 (75th percentile)" value={fmt(stats.q3)} />
              <StatRow label="IQR (Q3 - Q1)" value={fmt(stats.iqr)} />
            </div>
            
            {/* Simple Histogram */}
            <div className="bg-neutral-100 rounded-xl p-4">
              <h3 className="text-sm font-medium text-black/40 uppercase tracking-wider mb-3">
                Distribution
              </h3>
              <div className="h-24 flex items-end gap-1">
                {(() => {
                  // Create simple histogram buckets
                  const buckets = 10
                  const min = stats.min
                  const max = stats.max
                  const range = max - min || 1
                  const counts = new Array(buckets).fill(0)
                  
                  data.forEach(v => {
                    const idx = Math.min(Math.floor((v - min) / range * buckets), buckets - 1)
                    counts[idx]++
                  })
                  
                  const maxCount = Math.max(...counts)
                  
                  return counts.map((count, i) => (
                    <div
                      key={i}
                      className="flex-1 bg-black/20 rounded-t"
                      style={{ height: `${(count / maxCount) * 100}%` }}
                      title={`${count} values`}
                    />
                  ))
                })()}
              </div>
              <div className="flex justify-between text-xs text-black/40 mt-1 font-mono">
                <span>{fmt(stats.min, 1)}</span>
                <span>{fmt(stats.max, 1)}</span>
              </div>
            </div>
          </>
        ) : (
          <div className="flex items-center justify-center h-64 text-black/40">
            Enter data and click Calculate to see statistics
          </div>
        )}
      </div>
    </div>
  )
}
