const sunStats = [
  { label: 'Spectral Type', value: 'G2V', context: 'Yellow dwarf' },
  { label: 'Age', value: '4.6 Gyr', context: '46% through main sequence' },
  { label: 'Mass', value: '1.989 × 10³⁰ kg', context: '333,000 × Earth' },
  { label: 'Diameter', value: '1,392,700 km', context: '109 × Earth' },
  { label: 'Distance', value: '149.6 M km', context: '8 min 20 sec light-time' },
  { label: 'Surface Temp', value: '5,778 K', context: '5,505°C' },
  { label: 'Core Temp', value: '15.7 M K', context: 'Fusion temperature' },
  { label: 'Luminosity', value: '3.83 × 10²⁶ W', context: '1 L☉' },
  { label: 'Rotation', value: '25.4 days', context: 'At equator' },
  { label: 'Composition', value: '73% H, 25% He', context: 'By mass' },
]

export default function KeyStatsGrid() {
  return (
    <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
      {sunStats.map((stat) => (
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
