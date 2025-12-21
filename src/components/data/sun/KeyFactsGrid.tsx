const sunFacts = [
  {
    label: 'Age',
    value: '4.6',
    unit: 'billion years',
    detail: 'Middle-aged main sequence star',
  },
  {
    label: 'Mass',
    value: '1.989 × 10³⁰',
    unit: 'kg',
    detail: '99.86% of solar system mass',
  },
  {
    label: 'Diameter',
    value: '1.392',
    unit: 'million km',
    detail: '109 × Earth\'s diameter',
  },
  {
    label: 'Surface Temp',
    value: '5,778',
    unit: 'K',
    detail: 'Photosphere temperature',
  },
  {
    label: 'Core Temp',
    value: '15.7',
    unit: 'million K',
    detail: 'Where fusion occurs',
  },
  {
    label: 'Distance',
    value: '149.6',
    unit: 'million km',
    detail: '1 AU - 8 light-minutes',
  },
]

export default function KeyFactsGrid() {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
      {sunFacts.map((fact) => (
        <div key={fact.label} className="bg-white rounded-xl p-4">
          <p className="text-xs font-mono text-black/40 uppercase tracking-wider mb-2">
            {fact.label}
          </p>
          <div className="flex items-baseline gap-1">
            <span className="text-xl md:text-2xl font-light text-black">
              {fact.value}
            </span>
            <span className="text-xs text-black/50">
              {fact.unit}
            </span>
          </div>
          <p className="text-xs text-black/40 mt-2">
            {fact.detail}
          </p>
        </div>
      ))}
    </div>
  )
}
