'use client'

const POLLEN_TYPES = [
  { type: 'Tree', level: 'High', color: 'bg-orange-500', species: 'Oak, Birch, Ash' },
  { type: 'Grass', level: 'Moderate', color: 'bg-yellow-500', species: 'Timothy, Ryegrass' },
  { type: 'Weed', level: 'Low', color: 'bg-green-500', species: 'Ragweed, Nettle' },
  { type: 'Mold', level: 'Low', color: 'bg-green-500', species: 'Alternaria, Cladosporium' },
]

const REGIONAL_FORECASTS = [
  { region: 'Northern Europe', tree: 'High', grass: 'Low', weed: 'Low' },
  { region: 'Central Europe', tree: 'High', grass: 'Moderate', weed: 'Low' },
  { region: 'Southern Europe', tree: 'Moderate', grass: 'Low', weed: 'Low' },
  { region: 'UK & Ireland', tree: 'Moderate', grass: 'Low', weed: 'Low' },
  { region: 'Eastern US', tree: 'High', grass: 'Moderate', weed: 'Low' },
  { region: 'Western US', tree: 'Moderate', grass: 'Low', weed: 'Low' },
]

export default function PollenTab() {
  const getLevelColor = (level: string) => {
    switch (level) {
      case 'High': return 'bg-orange-500 text-orange-600'
      case 'Very High': return 'bg-red-500 text-red-600'
      case 'Moderate': return 'bg-yellow-500 text-yellow-600'
      default: return 'bg-green-500 text-green-600'
    }
  }

  return (
    <div className="space-y-6">
      {/* Current Pollen Levels */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {POLLEN_TYPES.map((pollen) => (
          <div key={pollen.type} className="bg-white rounded-xl p-5">
            <div className="flex items-center gap-2 mb-2">
              <div className={`w-3 h-3 rounded-full ${pollen.color}`} />
              <h3 className="text-sm font-medium text-black">{pollen.type}</h3>
            </div>
            <p className={`text-2xl font-light ${getLevelColor(pollen.level).split(' ')[1]}`}>
              {pollen.level}
            </p>
            <p className="text-xs text-black/40 mt-1">{pollen.species}</p>
          </div>
        ))}
      </div>

      {/* Regional Forecast */}
      <div className="bg-white rounded-xl p-5">
        <h3 className="text-sm font-medium text-black/50 uppercase tracking-wider mb-4">
          Regional Pollen Forecast
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-black/10">
                <th className="text-left py-2 text-black/50 font-medium">Region</th>
                <th className="text-center py-2 text-black/50 font-medium">Tree</th>
                <th className="text-center py-2 text-black/50 font-medium">Grass</th>
                <th className="text-center py-2 text-black/50 font-medium">Weed</th>
              </tr>
            </thead>
            <tbody>
              {REGIONAL_FORECASTS.map((forecast) => (
                <tr key={forecast.region} className="border-b border-black/5">
                  <td className="py-3 text-black">{forecast.region}</td>
                  <td className="py-3 text-center">
                    <span className={`inline-block px-2 py-0.5 rounded text-xs ${getLevelColor(forecast.tree)}`}>
                      {forecast.tree}
                    </span>
                  </td>
                  <td className="py-3 text-center">
                    <span className={`inline-block px-2 py-0.5 rounded text-xs ${getLevelColor(forecast.grass)}`}>
                      {forecast.grass}
                    </span>
                  </td>
                  <td className="py-3 text-center">
                    <span className={`inline-block px-2 py-0.5 rounded text-xs ${getLevelColor(forecast.weed)}`}>
                      {forecast.weed}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Seasonal Calendar */}
      <div className="bg-[#e5e5e5] rounded-xl p-5">
        <h3 className="text-sm font-medium text-black/50 uppercase tracking-wider mb-4">
          Pollen Season Calendar (Northern Hemisphere)
        </h3>
        <div className="grid grid-cols-12 gap-1 mb-4">
          {['J', 'F', 'M', 'A', 'M', 'J', 'J', 'A', 'S', 'O', 'N', 'D'].map((month, i) => (
            <div key={month} className="text-center text-xs text-black/50">{month}</div>
          ))}
        </div>
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="w-16 text-xs text-black/50">Tree</span>
            <div className="flex-1 grid grid-cols-12 gap-1">
              {[0, 0, 1, 2, 2, 1, 0, 0, 0, 0, 0, 0].map((level, i) => (
                <div
                  key={i}
                  className={`h-4 rounded ${
                    level === 0 ? 'bg-white' :
                    level === 1 ? 'bg-yellow-400' : 'bg-orange-500'
                  }`}
                />
              ))}
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-16 text-xs text-black/50">Grass</span>
            <div className="flex-1 grid grid-cols-12 gap-1">
              {[0, 0, 0, 0, 1, 2, 2, 1, 0, 0, 0, 0].map((level, i) => (
                <div
                  key={i}
                  className={`h-4 rounded ${
                    level === 0 ? 'bg-white' :
                    level === 1 ? 'bg-yellow-400' : 'bg-orange-500'
                  }`}
                />
              ))}
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-16 text-xs text-black/50">Weed</span>
            <div className="flex-1 grid grid-cols-12 gap-1">
              {[0, 0, 0, 0, 0, 0, 1, 2, 2, 1, 0, 0].map((level, i) => (
                <div
                  key={i}
                  className={`h-4 rounded ${
                    level === 0 ? 'bg-white' :
                    level === 1 ? 'bg-yellow-400' : 'bg-orange-500'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
        <div className="flex items-center gap-4 mt-4 text-xs text-black/50">
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 rounded bg-white border border-black/10" />
            <span>Low</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 rounded bg-yellow-400" />
            <span>Moderate</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 rounded bg-orange-500" />
            <span>High</span>
          </div>
        </div>
      </div>

      {/* Allergy Tips */}
      <div className="bg-white rounded-xl p-5">
        <h3 className="text-sm font-medium text-black mb-3">Managing Pollen Allergies</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-black/60">
          <div>
            <p className="font-medium text-black mb-1">When counts are high:</p>
            <ul className="list-disc list-inside space-y-1">
              <li>Keep windows closed</li>
              <li>Shower after being outdoors</li>
              <li>Dry clothes indoors</li>
            </ul>
          </div>
          <div>
            <p className="font-medium text-black mb-1">Best times to go outside:</p>
            <ul className="list-disc list-inside space-y-1">
              <li>After rain (washes pollen away)</li>
              <li>Early morning or evening</li>
              <li>Overcast, still days</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}
