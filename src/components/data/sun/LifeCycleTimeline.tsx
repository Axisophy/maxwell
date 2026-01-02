'use client'

import { useState } from 'react'

const lifeCycleStages = [
  {
    id: 'birth',
    name: 'Birth',
    time: '4.6 billion years ago',
    duration: '~50 million years',
    description: 'A cloud of gas and dust collapsed under gravity. As it contracted, it heated up until nuclear fusion ignited in the core.',
    status: 'past',
    position: 0,
  },
  {
    id: 'main-sequence',
    name: 'Main Sequence',
    time: 'Now',
    duration: '~10 billion years total',
    description: 'The Sun has been steadily fusing hydrogen into helium for 4.6 billion years. It will continue for another 5 billion years, gradually brightening by about 10% per billion years.',
    status: 'current',
    position: 46,
  },
  {
    id: 'subgiant',
    name: 'Subgiant',
    time: '+5 billion years',
    duration: '~1 billion years',
    description: 'As core hydrogen depletes, the Sun will expand and cool slightly. Earth may become uninhabitable during this phase.',
    status: 'future',
    position: 73,
  },
  {
    id: 'red-giant',
    name: 'Red Giant',
    time: '+6 billion years',
    duration: '~1 billion years',
    description: 'The Sun will expand to perhaps 200 times its current size, engulfing Mercury and Venus. The outer layers will cool to a red color while the core reaches 100 million K, igniting helium fusion.',
    status: 'future',
    position: 82,
  },
  {
    id: 'helium-flash',
    name: 'Helium Flash',
    time: '+7 billion years',
    duration: 'Minutes',
    description: 'Helium fusion begins explosively in the degenerate core. Despite releasing enormous energy, the flash is absorbed by the envelope and not visible from outside.',
    status: 'future',
    position: 88,
  },
  {
    id: 'horizontal-branch',
    name: 'Horizontal Branch',
    time: '+7 billion years',
    duration: '~100 million years',
    description: 'A stable phase of helium core fusion. The Sun will shrink slightly and stabilise before exhausting its helium.',
    status: 'future',
    position: 91,
  },
  {
    id: 'agb',
    name: 'AGB Phase',
    time: '+7.5 billion years',
    duration: '~20 million years',
    description: 'The asymptotic giant branch: alternating shells of hydrogen and helium fusion cause thermal pulses, ejecting the outer layers.',
    status: 'future',
    position: 94,
  },
  {
    id: 'planetary-nebula',
    name: 'Planetary Nebula',
    time: '+7.8 billion years',
    duration: '~50,000 years',
    description: 'The ejected outer layers form a beautiful glowing shell around the exposed core. Half of the Sun\'s mass will be lost to space.',
    status: 'future',
    position: 97,
  },
  {
    id: 'white-dwarf',
    name: 'White Dwarf',
    time: '+8 billion years',
    duration: 'Trillions of years',
    description: 'The carbon-oxygen core remains as an Earth-sized white dwarf, slowly cooling over trillions of years until it becomes a cold, dark black dwarf.',
    status: 'future',
    position: 100,
  },
]

export default function LifeCycleTimeline() {
  const [selectedStage, setSelectedStage] = useState<string>('main-sequence')

  const selected = lifeCycleStages.find(s => s.id === selectedStage)

  return (
    <div className="space-y-6">
      {/* Timeline visualization */}
      <div className="bg-white rounded-xl p-6">
        <div className="relative">
          {/* Timeline bar */}
          <div className="h-2 bg-gray-100 rounded-full relative overflow-hidden">
            {/* Progress to current */}
            <div
              className="absolute inset-y-0 left-0 bg-gradient-to-r from-amber-200 via-amber-400 to-amber-500 rounded-full"
              style={{ width: '46%' }}
            />
          </div>

          {/* Stage markers */}
          <div className="relative h-12 mt-2">
            {lifeCycleStages.map((stage) => (
              <button
                key={stage.id}
                onClick={() => setSelectedStage(stage.id)}
                className={`absolute transform -translate-x-1/2 flex flex-col items-center transition-all ${
                  selectedStage === stage.id ? 'scale-110' : ''
                }`}
                style={{ left: `${stage.position}%` }}
              >
                <div
                  className={`w-4 h-4 rounded-full border-2 transition-colors ${
                    stage.status === 'past'
                      ? 'bg-amber-300 border-amber-400'
                      : stage.status === 'current'
                      ? 'bg-amber-500 border-amber-600 ring-4 ring-amber-200'
                      : 'bg-gray-200 border-gray-300'
                  } ${selectedStage === stage.id ? 'ring-2 ring-black' : ''}`}
                />
                <span
                  className={`text-[10px] mt-1 whitespace-nowrap ${
                    selectedStage === stage.id ? 'font-medium text-black' : 'text-black/40'
                  } ${stage.position > 80 ? 'hidden md:block' : ''}`}
                >
                  {stage.name}
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Selected stage details */}
      {selected && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="md:col-span-2 bg-white rounded-xl p-6">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="text-xl font-medium text-black">{selected.name}</h3>
                <p className="text-sm text-black/50">{selected.time}</p>
              </div>
              <span
                className={`text-xs font-mono px-2 py-1 rounded ${
                  selected.status === 'past'
                    ? 'bg-amber-100 text-amber-700'
                    : selected.status === 'current'
                    ? 'bg-amber-500 text-white'
                    : 'bg-gray-100 text-gray-600'
                }`}
              >
                {selected.status === 'current' ? 'NOW' : selected.status.toUpperCase()}
              </span>
            </div>
            <p className="text-black/70 leading-relaxed">{selected.description}</p>
          </div>

          <div className="bg-[#1a1a1e] rounded-xl p-6 text-white">
            <h4 className="text-sm font-mono text-white/50 uppercase tracking-wider mb-4">
              Phase Duration
            </h4>
            <p className="text-2xl font-mono font-medium">{selected.duration}</p>
            <div className="mt-4 pt-4 border-t border-white/10">
              <p className="text-xs text-white/40">
                {selected.status === 'current'
                  ? '46% complete'
                  : selected.status === 'past'
                  ? 'Completed'
                  : 'Future phase'}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Quick facts */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg p-4 text-center">
          <p className="text-2xl font-mono font-medium text-black">4.6</p>
          <p className="text-xs text-black/50">Billion years old</p>
        </div>
        <div className="bg-white rounded-lg p-4 text-center">
          <p className="text-2xl font-mono font-medium text-black">~5</p>
          <p className="text-xs text-black/50">Billion years left</p>
        </div>
        <div className="bg-white rounded-lg p-4 text-center">
          <p className="text-2xl font-mono font-medium text-black">200×</p>
          <p className="text-xs text-black/50">Red giant size</p>
        </div>
        <div className="bg-white rounded-lg p-4 text-center">
          <p className="text-2xl font-mono font-medium text-black">∞</p>
          <p className="text-xs text-black/50">White dwarf lifespan</p>
        </div>
      </div>
    </div>
  )
}
