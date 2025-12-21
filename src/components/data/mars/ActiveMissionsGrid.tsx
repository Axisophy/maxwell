const surfaceMissions = [
  { name: 'Perseverance', agency: 'NASA', arrived: 2021, status: 'Active', location: 'Jezero Crater', type: 'Rover' },
  { name: 'Ingenuity', agency: 'NASA', arrived: 2021, status: 'Completed', location: 'Jezero Crater', type: 'Helicopter', note: '72 flights' },
  { name: 'Curiosity', agency: 'NASA', arrived: 2012, status: 'Active', location: 'Gale Crater', type: 'Rover' },
  { name: 'Zhurong', agency: 'CNSA', arrived: 2021, status: 'Hibernating', location: 'Utopia Planitia', type: 'Rover' },
]

const orbitalMissions = [
  { name: 'Mars Reconnaissance Orbiter', agency: 'NASA', arrived: 2006 },
  { name: 'MAVEN', agency: 'NASA', arrived: 2014 },
  { name: 'Mars Odyssey', agency: 'NASA', arrived: 2001 },
  { name: 'Mars Express', agency: 'ESA', arrived: 2003 },
  { name: 'ExoMars TGO', agency: 'ESA/Roscosmos', arrived: 2016 },
  { name: 'Tianwen-1 orbiter', agency: 'CNSA', arrived: 2021 },
  { name: 'Hope', agency: 'UAE', arrived: 2021 },
]

export default function ActiveMissionsGrid() {
  return (
    <div className="space-y-6">
      {/* Surface Missions */}
      <div>
        <h3 className="text-lg font-medium text-black mb-4">On the Surface</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {surfaceMissions.map((mission) => (
            <div key={mission.name} className="bg-white rounded-xl p-5">
              <div className="flex items-start justify-between mb-2">
                <div>
                  <h4 className="font-medium text-black">{mission.name}</h4>
                  <p className="text-sm text-black/50">{mission.agency} • {mission.type}</p>
                </div>
                <span className={`text-xs font-mono px-2 py-1 rounded ${
                  mission.status === 'Active'
                    ? 'bg-green-100 text-green-700'
                    : mission.status === 'Hibernating'
                    ? 'bg-yellow-100 text-yellow-700'
                    : 'bg-gray-100 text-gray-600'
                }`}>
                  {mission.status}
                </span>
              </div>
              <p className="text-sm text-black/60">{mission.location}</p>
              {mission.note && (
                <p className="text-xs text-black/40 mt-1">{mission.note}</p>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Orbital Missions */}
      <div>
        <h3 className="text-lg font-medium text-black mb-4">In Orbit</h3>
        <div className="bg-white rounded-xl overflow-hidden">
          <table className="w-full">
            <thead className="border-b border-black/10">
              <tr>
                <th className="px-4 py-2 text-left text-xs font-medium text-black/50 uppercase">Mission</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-black/50 uppercase">Agency</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-black/50 uppercase">Arrived</th>
              </tr>
            </thead>
            <tbody>
              {orbitalMissions.map((mission, i) => (
                <tr key={mission.name} className={i !== orbitalMissions.length - 1 ? 'border-b border-black/5' : ''}>
                  <td className="px-4 py-3 text-sm font-medium text-black">{mission.name}</td>
                  <td className="px-4 py-3 text-sm text-black/60">{mission.agency}</td>
                  <td className="px-4 py-3 text-sm font-mono text-black/60">{mission.arrived}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
