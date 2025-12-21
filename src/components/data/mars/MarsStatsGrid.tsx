const marsStats = [
  { label: 'Distance from Sun', value: '227.9 M km', context: '1.52 AU' },
  { label: 'Orbital Period', value: '687 days', context: '1.88 Earth years' },
  { label: 'Day Length', value: '24h 37m', context: 'Almost Earth-like' },
  { label: 'Diameter', value: '6,779 km', context: '53% of Earth' },
  { label: 'Mass', value: '6.39 × 10²³ kg', context: '11% of Earth' },
  { label: 'Gravity', value: '3.72 m/s²', context: '38% of Earth' },
  { label: 'Moons', value: '2', context: 'Phobos & Deimos' },
  { label: 'Surface Temp', value: '-87 to -5°C', context: 'Average -63°C' },
  { label: 'Atmosphere', value: '95% CO₂', context: '0.6% Earth pressure' },
  { label: 'Active Missions', value: '8+', context: 'Rovers & orbiters' },
]

export default function MarsStatsGrid() {
  return (
    <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
      {marsStats.map((stat) => (
        <div key={stat.label} className="bg-white rounded-xl p-4">
          <p className="text-xs font-mono text-black/40 uppercase tracking-wider mb-2">
            {stat.label}
          </p>
          <p className="text-lg md:text-xl font-mono font-medium text-black leading-tight">
            {stat.value}
          </p>
          <p className="text-xs text-black/50 mt-1">
            {stat.context}
          </p>
        </div>
      ))}
    </div>
  )
}
