'use client'

import { useState } from 'react'

type SortKey = 'name' | 'diameter' | 'mass' | 'distance' | 'moons'

const planets = [
  { name: 'Mercury', diameter: 4879, mass: 0.055, distance: 0.39, dayLength: '59 days', yearLength: '88 days', moons: 0, rings: false },
  { name: 'Venus', diameter: 12104, mass: 0.815, distance: 0.72, dayLength: '243 days', yearLength: '225 days', moons: 0, rings: false },
  { name: 'Earth', diameter: 12742, mass: 1.000, distance: 1.00, dayLength: '24 hours', yearLength: '365 days', moons: 1, rings: false },
  { name: 'Mars', diameter: 6779, mass: 0.107, distance: 1.52, dayLength: '24.6 hours', yearLength: '687 days', moons: 2, rings: false },
  { name: 'Jupiter', diameter: 139820, mass: 317.8, distance: 5.20, dayLength: '10 hours', yearLength: '12 years', moons: 95, rings: true },
  { name: 'Saturn', diameter: 116460, mass: 95.2, distance: 9.54, dayLength: '10.7 hours', yearLength: '29 years', moons: 146, rings: true },
  { name: 'Uranus', diameter: 50724, mass: 14.5, distance: 19.2, dayLength: '17 hours', yearLength: '84 years', moons: 28, rings: true },
  { name: 'Neptune', diameter: 49244, mass: 17.1, distance: 30.1, dayLength: '16 hours', yearLength: '165 years', moons: 16, rings: true },
]

export default function PlanetComparisonTable() {
  const [sortKey, setSortKey] = useState<SortKey>('distance')
  const [sortAsc, setSortAsc] = useState(true)

  const sortedPlanets = [...planets].sort((a, b) => {
    const aVal = a[sortKey]
    const bVal = b[sortKey]
    if (typeof aVal === 'string' && typeof bVal === 'string') {
      return sortAsc ? aVal.localeCompare(bVal) : bVal.localeCompare(aVal)
    }
    return sortAsc ? (aVal as number) - (bVal as number) : (bVal as number) - (aVal as number)
  })

  const handleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortAsc(!sortAsc)
    } else {
      setSortKey(key)
      setSortAsc(true)
    }
  }

  const SortHeader = ({ label, sortKeyName }: { label: string; sortKeyName: SortKey }) => (
    <th
      className="px-3 py-2 text-left text-xs font-medium text-black/50 uppercase tracking-wider cursor-pointer hover:text-black transition-colors"
      onClick={() => handleSort(sortKeyName)}
    >
      {label}
      {sortKey === sortKeyName && (
        <span className="ml-1">{sortAsc ? '↑' : '↓'}</span>
      )}
    </th>
  )

  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[600px]">
        <thead className="border-b border-black/10">
          <tr>
            <SortHeader label="Planet" sortKeyName="name" />
            <SortHeader label="Diameter (km)" sortKeyName="diameter" />
            <SortHeader label="Mass (Earth=1)" sortKeyName="mass" />
            <SortHeader label="Distance (AU)" sortKeyName="distance" />
            <th className="px-3 py-2 text-left text-xs font-medium text-black/50 uppercase tracking-wider">Day</th>
            <th className="px-3 py-2 text-left text-xs font-medium text-black/50 uppercase tracking-wider">Year</th>
            <SortHeader label="Moons" sortKeyName="moons" />
            <th className="px-3 py-2 text-left text-xs font-medium text-black/50 uppercase tracking-wider">Rings</th>
          </tr>
        </thead>
        <tbody>
          {sortedPlanets.map((planet, i) => (
            <tr
              key={planet.name}
              className={`
                border-b border-black/5
                ${planet.name === 'Earth' ? 'bg-blue-50' : i % 2 === 0 ? 'bg-white' : 'bg-[#fafafa]'}
              `}
            >
              <td className="px-3 py-3 text-sm font-medium text-black">{planet.name}</td>
              <td className="px-3 py-3 text-sm font-mono text-black/70">{planet.diameter.toLocaleString()}</td>
              <td className="px-3 py-3 text-sm font-mono text-black/70">{planet.mass}</td>
              <td className="px-3 py-3 text-sm font-mono text-black/70">{planet.distance}</td>
              <td className="px-3 py-3 text-sm text-black/70">{planet.dayLength}</td>
              <td className="px-3 py-3 text-sm text-black/70">{planet.yearLength}</td>
              <td className="px-3 py-3 text-sm font-mono text-black/70">{planet.moons}</td>
              <td className="px-3 py-3 text-sm text-black/70">{planet.rings ? 'Yes' : '-'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
