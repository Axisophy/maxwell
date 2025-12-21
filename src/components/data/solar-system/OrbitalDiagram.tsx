'use client'

import Link from 'next/link'
import { useState } from 'react'

const planets = [
  { name: 'Sun', color: '#FDB813', size: 30, orbit: 0, href: '/data/solar-system/sun', built: true },
  { name: 'Mercury', color: '#B5B5B5', size: 4, orbit: 45, href: '/data/solar-system/mercury', built: false },
  { name: 'Venus', color: '#E6C86E', size: 6, orbit: 65, href: '/data/solar-system/venus', built: false },
  { name: 'Earth', color: '#6B93D6', size: 6, orbit: 85, href: '/data/solar-system/earth', built: false },
  { name: 'Mars', color: '#C1440E', size: 5, orbit: 110, href: '/data/solar-system/mars', built: true },
  { name: 'Jupiter', color: '#D8CA9D', size: 16, orbit: 155, href: '/data/solar-system/jupiter', built: false },
  { name: 'Saturn', color: '#F4D59E', size: 14, orbit: 200, href: '/data/solar-system/saturn', built: false },
  { name: 'Uranus', color: '#D1E7E7', size: 10, orbit: 240, href: '/data/solar-system/uranus', built: false },
  { name: 'Neptune', color: '#5B5DDF', size: 10, orbit: 275, href: '/data/solar-system/neptune', built: true },
]

export default function OrbitalDiagram() {
  const [hoveredPlanet, setHoveredPlanet] = useState<string | null>(null)

  const centerX = 300
  const centerY = 200

  return (
    <div className="relative">
      <svg
        viewBox="0 0 600 400"
        className="w-full h-auto"
        style={{ maxHeight: '400px' }}
      >
        {/* Orbit paths */}
        {planets.filter(p => p.orbit > 0).map((planet) => (
          <ellipse
            key={`orbit-${planet.name}`}
            cx={centerX}
            cy={centerY}
            rx={planet.orbit}
            ry={planet.orbit * 0.4}
            fill="none"
            stroke="rgba(255,255,255,0.15)"
            strokeWidth="1"
          />
        ))}

        {/* Asteroid belt hint */}
        <ellipse
          cx={centerX}
          cy={centerY}
          rx={132}
          ry={132 * 0.4}
          fill="none"
          stroke="rgba(255,255,255,0.08)"
          strokeWidth="8"
          strokeDasharray="2 4"
        />

        {/* Planets */}
        {planets.map((planet, i) => {
          const angle = (i * 40 + 30) * (Math.PI / 180)
          const x = planet.orbit === 0 ? centerX : centerX + planet.orbit * Math.cos(angle)
          const y = planet.orbit === 0 ? centerY : centerY + planet.orbit * 0.4 * Math.sin(angle)

          const isHovered = hoveredPlanet === planet.name

          const PlanetElement = (
            <g
              onMouseEnter={() => setHoveredPlanet(planet.name)}
              onMouseLeave={() => setHoveredPlanet(null)}
              style={{ cursor: planet.built ? 'pointer' : 'default' }}
            >
              {/* Glow effect on hover */}
              {isHovered && (
                <circle
                  cx={x}
                  cy={y}
                  r={planet.size + 8}
                  fill={planet.color}
                  opacity={0.3}
                />
              )}

              {/* Planet */}
              <circle
                cx={x}
                cy={y}
                r={planet.size}
                fill={planet.color}
                className="transition-all duration-200"
                style={{
                  filter: isHovered ? 'brightness(1.2)' : 'none',
                  opacity: planet.built ? 1 : 0.5,
                }}
              />

              {/* Saturn's rings */}
              {planet.name === 'Saturn' && (
                <ellipse
                  cx={x}
                  cy={y}
                  rx={planet.size * 1.8}
                  ry={planet.size * 0.4}
                  fill="none"
                  stroke={planet.color}
                  strokeWidth="2"
                  opacity={0.6}
                />
              )}

              {/* Label on hover */}
              {isHovered && (
                <text
                  x={x}
                  y={y - planet.size - 10}
                  textAnchor="middle"
                  fill="white"
                  fontSize="12"
                  fontFamily="system-ui"
                >
                  {planet.name}
                </text>
              )}
            </g>
          )

          if (planet.built) {
            return (
              <Link key={planet.name} href={planet.href}>
                {PlanetElement}
              </Link>
            )
          }

          return <g key={planet.name}>{PlanetElement}</g>
        })}
      </svg>

      {/* Mobile: show planet name below */}
      {hoveredPlanet && (
        <p className="text-center text-white/60 text-sm mt-2 md:hidden">
          {hoveredPlanet}
        </p>
      )}
    </div>
  )
}
