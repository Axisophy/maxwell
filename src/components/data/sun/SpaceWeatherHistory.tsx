import Link from 'next/link'

const historicEvents = [
  {
    year: 1859,
    name: 'Carrington Event',
    type: 'CME / Flare',
    magnitude: 'X45+',
    description: 'The largest recorded geomagnetic storm. Auroras seen in Caribbean, telegraph systems shocked operators and caught fire. A similar event today could cause trillions in damage.',
  },
  {
    year: 1989,
    name: 'Quebec Blackout',
    type: 'CME',
    magnitude: 'X15',
    description: 'Geomagnetically induced currents collapsed Hydro-Québec\'s power grid, leaving 6 million people without power for 9 hours.',
  },
  {
    year: 2003,
    name: 'Halloween Storms',
    type: 'CME / Flare',
    magnitude: 'X28+',
    description: 'Series of powerful solar flares and CMEs. Caused satellite malfunctions, power grid issues in Sweden, and astronauts sheltered on ISS.',
  },
  {
    year: 2012,
    name: 'Near Miss',
    type: 'CME',
    magnitude: 'X-class',
    description: 'A Carrington-class CME erupted from the Sun but missed Earth by 9 days of orbital rotation. Had it hit, damage estimates exceed $2 trillion.',
  },
  {
    year: 2017,
    name: 'September Flares',
    type: 'Flare',
    magnitude: 'X9.3',
    description: 'Strongest flare of Solar Cycle 24. Caused radio blackouts over the Americas and disrupted GPS accuracy.',
  },
  {
    year: 2024,
    name: 'May Geomagnetic Storm',
    type: 'CME',
    magnitude: 'G5',
    description: 'Strongest geomagnetic storm since 2003. Aurora visible as far south as Florida and Mexico. Minor power grid fluctuations reported.',
  },
]

export default function SpaceWeatherHistory() {
  return (
    <div className="space-y-6">
      {/* Introduction */}
      <div className="bg-white rounded-xl p-6">
        <p className="text-black/70 leading-relaxed">
          The Sun&apos;s activity directly affects Earth&apos;s technological infrastructure. Solar flares
          emit X-rays that disrupt radio communications. Coronal mass ejections (CMEs) can trigger
          geomagnetic storms that induce currents in power grids, pipelines, and cables. Understanding
          space weather is increasingly critical for our technology-dependent civilization.
        </p>
      </div>

      {/* Events table */}
      <div className="bg-white rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-black/10">
                <th className="text-left text-xs font-mono text-black/40 uppercase tracking-wider p-4">
                  Year
                </th>
                <th className="text-left text-xs font-mono text-black/40 uppercase tracking-wider p-4">
                  Event
                </th>
                <th className="text-left text-xs font-mono text-black/40 uppercase tracking-wider p-4 hidden md:table-cell">
                  Type
                </th>
                <th className="text-left text-xs font-mono text-black/40 uppercase tracking-wider p-4 hidden sm:table-cell">
                  Scale
                </th>
                <th className="text-left text-xs font-mono text-black/40 uppercase tracking-wider p-4">
                  Impact
                </th>
              </tr>
            </thead>
            <tbody>
              {historicEvents.map((event, index) => (
                <tr
                  key={event.year}
                  className={index !== historicEvents.length - 1 ? 'border-b border-black/5' : ''}
                >
                  <td className="p-4 font-mono text-black/60">{event.year}</td>
                  <td className="p-4">
                    <p className="font-medium text-black">{event.name}</p>
                  </td>
                  <td className="p-4 text-sm text-black/60 hidden md:table-cell">{event.type}</td>
                  <td className="p-4 hidden sm:table-cell">
                    <span className="font-mono text-sm bg-amber-100 text-amber-700 px-2 py-0.5 rounded">
                      {event.magnitude}
                    </span>
                  </td>
                  <td className="p-4 text-sm text-black/60 max-w-md">{event.description}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Link to live data */}
      <div className="bg-[#1a1a1e] rounded-xl p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="text-white">
          <h4 className="font-medium mb-1">Current Space Weather</h4>
          <p className="text-sm text-white/60">
            See live solar activity, X-ray flux, and geomagnetic conditions
          </p>
        </div>
        <Link
          href="/observe/solar-observatory"
          className="px-4 py-2 bg-white text-black rounded-lg font-medium text-sm hover:bg-white/90 transition-colors"
        >
          View Solar Observatory →
        </Link>
      </div>

      {/* Scale reference */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-white rounded-xl p-6">
          <h4 className="text-sm font-mono text-black/40 uppercase tracking-wider mb-4">
            Solar Flare Scale
          </h4>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-black/60">X-class</span>
              <span className="font-mono text-black">Major</span>
            </div>
            <div className="flex justify-between">
              <span className="text-black/60">M-class</span>
              <span className="font-mono text-black">Moderate</span>
            </div>
            <div className="flex justify-between">
              <span className="text-black/60">C-class</span>
              <span className="font-mono text-black">Minor</span>
            </div>
            <div className="flex justify-between">
              <span className="text-black/60">B/A-class</span>
              <span className="font-mono text-black">Background</span>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-6">
          <h4 className="text-sm font-mono text-black/40 uppercase tracking-wider mb-4">
            Geomagnetic Storm Scale
          </h4>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-black/60">G5</span>
              <span className="font-mono text-black">Extreme</span>
            </div>
            <div className="flex justify-between">
              <span className="text-black/60">G4</span>
              <span className="font-mono text-black">Severe</span>
            </div>
            <div className="flex justify-between">
              <span className="text-black/60">G3</span>
              <span className="font-mono text-black">Strong</span>
            </div>
            <div className="flex justify-between">
              <span className="text-black/60">G2/G1</span>
              <span className="font-mono text-black">Moderate/Minor</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
