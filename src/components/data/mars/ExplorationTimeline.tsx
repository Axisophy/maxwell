'use client'

const explorationTimeline = [
  { year: 1965, mission: 'Mariner 4', agency: 'NASA', type: 'Flyby', result: 'First close-up images' },
  { year: 1971, mission: 'Mariner 9', agency: 'NASA', type: 'Orbiter', result: 'First Mars orbiter' },
  { year: 1976, mission: 'Viking 1 & 2', agency: 'NASA', type: 'Lander', result: 'First successful landing' },
  { year: 1997, mission: 'Pathfinder', agency: 'NASA', type: 'Lander + Rover', result: 'Sojourner rover' },
  { year: 2004, mission: 'Spirit & Opportunity', agency: 'NASA', type: 'Rovers', result: 'Found water evidence' },
  { year: 2008, mission: 'Phoenix', agency: 'NASA', type: 'Lander', result: 'Confirmed water ice' },
  { year: 2012, mission: 'Curiosity', agency: 'NASA', type: 'Rover', result: 'Still operating' },
  { year: 2014, mission: 'MAVEN', agency: 'NASA', type: 'Orbiter', result: 'Studying atmosphere loss' },
  { year: 2021, mission: 'Perseverance + Ingenuity', agency: 'NASA', type: 'Rover + Helicopter', result: 'Sample collection' },
  { year: 2021, mission: 'Tianwen-1 + Zhurong', agency: 'CNSA', type: 'Orbiter + Rover', result: 'China\'s first Mars landing' },
]

export default function ExplorationTimeline() {
  return (
    <div className="overflow-x-auto pb-4">
      <div className="flex gap-4 min-w-max">
        {explorationTimeline.map((event, i) => (
          <div
            key={i}
            className="w-64 flex-shrink-0 bg-white rounded-xl p-4"
          >
            <p className="text-2xl font-mono font-bold text-black mb-2">
              {event.year}
            </p>
            <p className="font-medium text-black">{event.mission}</p>
            <p className="text-sm text-black/50">{event.agency} • {event.type}</p>
            <p className="text-sm text-black/60 mt-2">{event.result}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
