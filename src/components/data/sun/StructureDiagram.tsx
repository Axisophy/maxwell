'use client'

import { useState } from 'react'

const solarLayers = [
  {
    id: 'core',
    name: 'Core',
    radius: '0 - 0.25 R☉',
    temp: '15.7 million K',
    density: '150 g/cm³',
    color: '#fef3c7',
    description: 'Where nuclear fusion occurs. Hydrogen fuses into helium, releasing the energy that powers the Sun. Contains 34% of the Sun\'s mass in just 0.8% of its volume.',
  },
  {
    id: 'radiative',
    name: 'Radiative Zone',
    radius: '0.25 - 0.7 R☉',
    temp: '7M → 2M K',
    density: '20 → 0.2 g/cm³',
    color: '#fed7aa',
    description: 'Energy travels outward via radiation. A photon takes approximately 170,000 years to cross this zone, bouncing between atoms countless times.',
  },
  {
    id: 'convective',
    name: 'Convective Zone',
    radius: '0.7 - 1.0 R☉',
    temp: '2M → 5,778 K',
    density: '0.2 → 10⁻⁷ g/cm³',
    color: '#fdba74',
    description: 'Hot plasma rises, cools at the surface, and sinks back down in giant convection cells. This churning motion brings energy to the surface in just weeks.',
  },
  {
    id: 'photosphere',
    name: 'Photosphere',
    radius: 'Surface (~500 km thick)',
    temp: '5,778 K',
    density: '10⁻⁷ g/cm³',
    color: '#fb923c',
    description: 'The visible "surface" of the Sun. This is where sunspots appear and where we see granulation - the tops of convection cells.',
  },
  {
    id: 'chromosphere',
    name: 'Chromosphere',
    radius: '~2,000 km above',
    temp: '4,000 → 25,000 K',
    color: '#f97316',
    description: 'Visible as a pink flash during total solar eclipses. Home to spicules, prominences, and the transition to the corona.',
  },
  {
    id: 'corona',
    name: 'Corona',
    radius: 'Millions of km',
    temp: '1 - 3 million K',
    density: '10⁻¹² g/cm³',
    color: '#ea580c',
    description: 'The outer atmosphere, mysteriously hotter than the surface. Visible during eclipses or with coronagraphs. Source of the solar wind.',
  },
]

export default function StructureDiagram() {
  const [selectedLayer, setSelectedLayer] = useState<string | null>(null)

  const selected = solarLayers.find(l => l.id === selectedLayer)

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Diagram */}
      <div className="bg-[#1a1a1e] rounded-xl p-6 flex items-center justify-center min-h-[300px]">
        <div className="relative w-64 h-64">
          {/* Layers as concentric circles */}
          {[...solarLayers].reverse().map((layer, index) => {
            const size = 100 - index * 14
            const isSelected = selectedLayer === layer.id
            return (
              <button
                key={layer.id}
                onClick={() => setSelectedLayer(selectedLayer === layer.id ? null : layer.id)}
                className="absolute rounded-full transition-all duration-300"
                style={{
                  width: `${size}%`,
                  height: `${size}%`,
                  left: `${(100 - size) / 2}%`,
                  top: `${(100 - size) / 2}%`,
                  backgroundColor: layer.color,
                  opacity: isSelected ? 1 : 0.7,
                  transform: isSelected ? 'scale(1.02)' : 'scale(1)',
                  boxShadow: isSelected ? `0 0 20px ${layer.color}` : 'none',
                }}
              />
            )
          })}
          {/* Center label */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <span className="text-xs font-mono text-black/60">
              {selectedLayer ? '' : 'Click a layer'}
            </span>
          </div>
        </div>
      </div>

      {/* Layer list / info */}
      <div className="space-y-2">
        {solarLayers.map((layer) => {
          const isSelected = selectedLayer === layer.id
          return (
            <button
              key={layer.id}
              onClick={() => setSelectedLayer(isSelected ? null : layer.id)}
              className={`w-full text-left p-3 rounded-lg transition-colors ${
                isSelected ? 'bg-white shadow-sm' : 'hover:bg-white/50'
              }`}
            >
              <div className="flex items-center gap-3">
                <div
                  className="w-4 h-4 rounded-full flex-shrink-0"
                  style={{ backgroundColor: layer.color }}
                />
                <div className="flex-grow">
                  <p className="font-medium text-black text-sm">{layer.name}</p>
                  <p className="text-xs text-black/50">{layer.radius}</p>
                </div>
                <div className="text-right">
                  <p className="text-xs font-mono text-black/60">{layer.temp}</p>
                </div>
              </div>
              {isSelected && (
                <div className="mt-3 pl-7">
                  <p className="text-sm text-black/60 leading-relaxed">
                    {layer.description}
                  </p>
                  {layer.density && (
                    <p className="text-xs text-black/40 mt-2">
                      Density: {layer.density}
                    </p>
                  )}
                </div>
              )}
            </button>
          )
        })}
      </div>
    </div>
  )
}
