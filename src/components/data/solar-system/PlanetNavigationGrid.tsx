import Link from 'next/link'

const bodies = [
  {
    name: 'Sun',
    tagline: 'The star at the center',
    stat: '99.86% of system mass',
    href: '/data/solar-system/sun',
    color: '#FDB813',
    built: true,
  },
  {
    name: 'Mercury',
    tagline: 'Smallest and fastest',
    stat: '88-day year',
    href: '/data/solar-system/mercury',
    color: '#B5B5B5',
    built: false,
  },
  {
    name: 'Venus',
    tagline: 'Hottest planet',
    stat: '465°C surface',
    href: '/data/solar-system/venus',
    color: '#E6C86E',
    built: false,
  },
  {
    name: 'Earth',
    tagline: 'The living world',
    stat: '7.9 billion humans',
    href: '/data/solar-system/earth',
    color: '#6B93D6',
    built: false,
  },
  {
    name: 'Mars',
    tagline: 'The red planet',
    stat: '2 rovers active',
    href: '/data/solar-system/mars',
    color: '#C1440E',
    built: true,
  },
  {
    name: 'Jupiter',
    tagline: 'King of planets',
    stat: '95 known moons',
    href: '/data/solar-system/jupiter',
    color: '#D8CA9D',
    built: false,
  },
  {
    name: 'Saturn',
    tagline: 'The ringed wonder',
    stat: 'Could float on water',
    href: '/data/solar-system/saturn',
    color: '#F4D59E',
    built: false,
  },
  {
    name: 'Uranus',
    tagline: 'The tilted ice giant',
    stat: 'Rotates on its side',
    href: '/data/solar-system/uranus',
    color: '#D1E7E7',
    built: false,
  },
  {
    name: 'Neptune',
    tagline: 'The windswept blue',
    stat: '2,100 km/h winds',
    href: '/data/solar-system/neptune',
    color: '#5B5DDF',
    built: true,
  },
]

export default function PlanetNavigationGrid() {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
      {bodies.map((body) => {
        const content = (
          <>
            {/* Color circle */}
            <div
              className="w-12 h-12 rounded-full mb-3 mx-auto"
              style={{ backgroundColor: body.color }}
            />

            {/* Name */}
            <h3 className="font-medium text-black text-center mb-1">
              {body.name}
            </h3>

            {/* Tagline */}
            <p className="text-xs text-black/50 text-center mb-2">
              {body.tagline}
            </p>

            {/* Stat */}
            <p className="text-xs font-mono text-black/70 text-center">
              {body.stat}
            </p>

            {/* Coming soon badge for unbuilt pages */}
            {!body.built && (
              <p className="text-xs text-black/30 text-center mt-2">
                Coming soon
              </p>
            )}
          </>
        )

        if (body.built) {
          return (
            <Link
              key={body.name}
              href={body.href}
              className="bg-white rounded-xl p-4 border border-transparent hover:border-black transition-colors group"
            >
              {content}
            </Link>
          )
        }

        return (
          <div
            key={body.name}
            className="bg-white rounded-xl p-4 opacity-50"
          >
            {content}
          </div>
        )
      })}
    </div>
  )
}
