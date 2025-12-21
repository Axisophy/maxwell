const neptuneStats = [
  { label: 'Distance from Sun', value: '4.5 B km', context: '30 AU' },
  { label: 'Orbital Period', value: '164.8 years', context: 'First orbit since discovery: 2011' },
  { label: 'Day Length', value: '16h 6m', context: 'Fast rotation' },
  { label: 'Diameter', value: '49,528 km', context: '3.9× Earth' },
  { label: 'Mass', value: '1.02 × 10²⁶ kg', context: '17× Earth' },
  { label: 'Gravity', value: '11.15 m/s²', context: '1.14× Earth' },
  { label: 'Moons', value: '16 known', context: 'Triton dominates' },
  { label: 'Rings', value: '5 main', context: 'Faint, dusty' },
  { label: 'Temperature', value: '-214°C', context: 'Coldest planet' },
  { label: 'Wind Speed', value: '2,100 km/h', context: 'Fastest in solar system' },
]

export default function NeptuneStatsGrid() {
  return (
    <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
      {neptuneStats.map((stat) => (
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
