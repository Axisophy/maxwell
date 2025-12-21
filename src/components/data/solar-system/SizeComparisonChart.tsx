const planets = [
  { name: 'Jupiter', diameter: 139820, color: '#D8CA9D' },
  { name: 'Saturn', diameter: 116460, color: '#F4D59E' },
  { name: 'Uranus', diameter: 50724, color: '#D1E7E7' },
  { name: 'Neptune', diameter: 49244, color: '#5B5DDF' },
  { name: 'Earth', diameter: 12742, color: '#6B93D6' },
  { name: 'Venus', diameter: 12104, color: '#E6C86E' },
  { name: 'Mars', diameter: 6779, color: '#C1440E' },
  { name: 'Mercury', diameter: 4879, color: '#B5B5B5' },
]

const maxDiameter = 139820 // Jupiter

export default function SizeComparisonChart() {
  return (
    <div className="space-y-3">
      {planets.map((planet) => {
        const widthPercent = (planet.diameter / maxDiameter) * 100

        return (
          <div key={planet.name} className="flex items-center gap-3">
            <span className="w-16 text-sm text-black/50 text-right">
              {planet.name}
            </span>
            <div className="flex-1 h-6 bg-[#f5f5f5] rounded overflow-hidden">
              <div
                className="h-full rounded transition-all duration-500"
                style={{
                  width: `${widthPercent}%`,
                  backgroundColor: planet.color,
                  minWidth: '8px',
                }}
              />
            </div>
            <span className="w-24 text-xs font-mono text-black/50">
              {planet.diameter.toLocaleString()} km
            </span>
          </div>
        )
      })}
    </div>
  )
}
