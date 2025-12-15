'use client'

import { useState, useEffect, useRef } from 'react'

// ===========================================
// iNATURALIST LIVE
// ===========================================
// Recent species observations from citizen scientists
// Data: iNaturalist API (https://api.inaturalist.org)
// ===========================================

interface Observation {
  id: number
  species: string
  commonName: string
  imageUrl: string | null
  observer: string
  location: string
  quality: 'research' | 'needs_id' | 'casual'
  observedAt: string
  taxonIcon: string
  lat: number
  lon: number
}

export default function iNaturalistLive() {
  const containerRef = useRef<HTMLDivElement>(null)
  const [baseFontSize, setBaseFontSize] = useState(16)
  const [observations, setObservations] = useState<Observation[]>([])
  const [selectedObs, setSelectedObs] = useState<Observation | null>(null)
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<'all' | 'plants' | 'animals' | 'fungi' | 'insects'>('all')
  const [totalToday, setTotalToday] = useState(0)
  
  useEffect(() => {
    const updateSize = () => {
      if (containerRef.current) {
        const width = containerRef.current.clientWidth
        setBaseFontSize(width / 25)
      }
    }
    updateSize()
    const observer = new ResizeObserver(updateSize)
    if (containerRef.current) observer.observe(containerRef.current)
    return () => observer.disconnect()
  }, [])
  
  useEffect(() => {
    const fetchObservations = async () => {
      try {
        const res = await fetch('/api/inaturalist')
        if (res.ok) {
          const data = await res.json()
          setObservations(data.observations || [])
          setTotalToday(data.totalToday || 0)
        }
      } catch (e) {
        // Fallback data
        generateFallbackData()
      }
      setLoading(false)
    }
    
    const generateFallbackData = () => {
      const species = [
        { species: 'Corvus corax', commonName: 'Common Raven', icon: '🐦', group: 'animals' },
        { species: 'Amanita muscaria', commonName: 'Fly Agaric', icon: '🍄', group: 'fungi' },
        { species: 'Quercus robur', commonName: 'English Oak', icon: '🌳', group: 'plants' },
        { species: 'Apis mellifera', commonName: 'Western Honey Bee', icon: '🐝', group: 'insects' },
        { species: 'Vulpes vulpes', commonName: 'Red Fox', icon: '🦊', group: 'animals' },
        { species: 'Taraxacum officinale', commonName: 'Common Dandelion', icon: '🌼', group: 'plants' },
        { species: 'Boletus edulis', commonName: 'Porcini', icon: '🍄', group: 'fungi' },
        { species: 'Erithacus rubecula', commonName: 'European Robin', icon: '🐦', group: 'animals' },
        { species: 'Papilio machaon', commonName: 'Swallowtail', icon: '🦋', group: 'insects' },
        { species: 'Hedera helix', commonName: 'Common Ivy', icon: '🌿', group: 'plants' },
        { species: 'Sciurus vulgaris', commonName: 'Red Squirrel', icon: '🐿️', group: 'animals' },
        { species: 'Cantharellus cibarius', commonName: 'Chanterelle', icon: '🍄', group: 'fungi' },
      ]
      
      const locations = [
        'Sussex, UK', 'Bavaria, Germany', 'Brittany, France', 'Catalonia, Spain',
        'Tuscany, Italy', 'Oregon, USA', 'British Columbia, Canada', 'Hokkaido, Japan'
      ]
      
      const observers = ['naturelover42', 'fieldbiologist', 'mushroom_hunter', 'birdwatcher_uk', 'insect_enthusiast']
      
      const obs: Observation[] = species.map((s, i) => ({
        id: 100000 + i,
        species: s.species,
        commonName: s.commonName,
        imageUrl: null,
        observer: observers[Math.floor(Math.random() * observers.length)],
        location: locations[Math.floor(Math.random() * locations.length)],
        quality: Math.random() > 0.3 ? 'research' : Math.random() > 0.5 ? 'needs_id' : 'casual',
        observedAt: new Date(Date.now() - Math.random() * 86400000).toISOString(),
        taxonIcon: s.icon,
        lat: 51 + (Math.random() - 0.5) * 20,
        lon: 0 + (Math.random() - 0.5) * 30
      }))
      
      setObservations(obs)
      setTotalToday(Math.floor(Math.random() * 50000) + 80000)
    }
    
    fetchObservations()
    const interval = setInterval(fetchObservations, 60000)
    return () => clearInterval(interval)
  }, [])
  
  const filteredObs = observations.filter(o => {
    if (filter === 'all') return true
    const taxon = o.taxonIcon
    if (filter === 'plants') return ['🌳', '🌿', '🌼', '🌸', '🌺'].includes(taxon)
    if (filter === 'animals') return ['🐦', '🦊', '🐿️', '🦌', '🐸'].includes(taxon)
    if (filter === 'fungi') return taxon === '🍄'
    if (filter === 'insects') return ['🐝', '🦋', '🐛', '🐜', '🪲'].includes(taxon)
    return true
  })
  
  const qualityColor = (q: string) => {
    if (q === 'research') return '#22c55e'
    if (q === 'needs_id') return '#f59e0b'
    return '#94a3b8'
  }
  
  const formatTime = (iso: string) => {
    const d = new Date(iso)
    const now = new Date()
    const diff = now.getTime() - d.getTime()
    const hours = Math.floor(diff / 3600000)
    if (hours < 1) return `${Math.floor(diff / 60000)}m ago`
    if (hours < 24) return `${hours}h ago`
    return d.toLocaleDateString()
  }
  
  if (loading) {
    return (
      <div ref={containerRef} style={{ fontSize: `${baseFontSize}px` }} className="bg-white rounded-xl p-[1em] h-full flex items-center justify-center">
        <div className="text-[0.875em] text-black/40">Loading observations...</div>
      </div>
    )
  }
  
  return (
    <div ref={containerRef} style={{ fontSize: `${baseFontSize}px` }} className="bg-white rounded-xl p-[1em] h-full flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between mb-[0.75em]">
        <div>
          <div className="text-[0.625em] font-medium text-black/40 uppercase tracking-wider mb-[0.25em]">
            CITIZEN SCIENCE
          </div>
          <div className="font-mono text-[1.5em] font-bold text-[#74ac00]">
            {totalToday.toLocaleString()}
          </div>
          <div className="text-[0.625em] text-black/40">observations today</div>
        </div>
        <div className="text-[2.5em]">🔬</div>
      </div>
      
      {/* Filter tabs */}
      <div className="flex gap-[0.25em] mb-[0.75em] overflow-x-auto">
        {(['all', 'animals', 'plants', 'fungi', 'insects'] as const).map(f => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-[0.5em] py-[0.25em] rounded-full text-[0.625em] font-medium whitespace-nowrap transition-colors ${
              filter === f 
                ? 'bg-[#74ac00] text-white' 
                : 'bg-black/5 text-black/60 hover:bg-black/10'
            }`}
          >
            {f === 'all' ? '🌍 All' : 
             f === 'animals' ? '🦊 Animals' :
             f === 'plants' ? '🌿 Plants' :
             f === 'fungi' ? '🍄 Fungi' : '🦋 Insects'}
          </button>
        ))}
      </div>
      
      {/* Observations list */}
      <div className="flex-1 overflow-y-auto space-y-[0.5em] min-h-0">
        {filteredObs.slice(0, 8).map(obs => (
          <button
            key={obs.id}
            onClick={() => setSelectedObs(selectedObs?.id === obs.id ? null : obs)}
            className={`w-full text-left p-[0.5em] rounded-lg transition-colors ${
              selectedObs?.id === obs.id ? 'bg-[#74ac00]/10' : 'bg-black/[0.02] hover:bg-black/[0.04]'
            }`}
          >
            <div className="flex items-start gap-[0.5em]">
              <div className="text-[1.25em]">{obs.taxonIcon}</div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-[0.25em]">
                  <span className="text-[0.75em] font-medium text-black truncate">
                    {obs.commonName}
                  </span>
                  <span 
                    className="w-[0.375em] h-[0.375em] rounded-full flex-shrink-0"
                    style={{ backgroundColor: qualityColor(obs.quality) }}
                  />
                </div>
                <div className="text-[0.5625em] text-black/40 italic truncate">
                  {obs.species}
                </div>
                <div className="flex items-center gap-[0.5em] text-[0.5em] text-black/40 mt-[0.125em]">
                  <span>📍 {obs.location}</span>
                  <span>• {formatTime(obs.observedAt)}</span>
                </div>
              </div>
            </div>
            
            {selectedObs?.id === obs.id && (
              <div className="mt-[0.5em] pt-[0.5em] border-t border-black/5">
                <div className="grid grid-cols-2 gap-[0.5em] text-[0.5625em]">
                  <div>
                    <div className="text-black/40">Observer</div>
                    <div className="text-black">@{obs.observer}</div>
                  </div>
                  <div>
                    <div className="text-black/40">Grade</div>
                    <div className="text-black capitalize">{obs.quality.replace('_', ' ')}</div>
                  </div>
                  <div>
                    <div className="text-black/40">Coordinates</div>
                    <div className="font-mono text-black">
                      {obs.lat.toFixed(2)}°, {obs.lon.toFixed(2)}°
                    </div>
                  </div>
                </div>
              </div>
            )}
          </button>
        ))}
      </div>
      
      {/* Footer */}
      <div className="mt-[0.5em] pt-[0.5em] border-t border-black/5 flex items-center justify-between">
        <div className="text-[0.5em] text-black/30">
          iNaturalist • Research grade: {observations.filter(o => o.quality === 'research').length}
        </div>
        <div className="flex items-center gap-[0.25em]">
          <div className="w-[0.375em] h-[0.375em] rounded-full bg-[#74ac00] animate-pulse" />
          <span className="text-[0.5em] text-black/40">LIVE</span>
        </div>
      </div>
    </div>
  )
}
