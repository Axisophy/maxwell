export default function TritonSection() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Image placeholder */}
      <div className="bg-[#0f172a] rounded-xl aspect-square flex items-center justify-center">
        <p className="text-white/30 text-sm">Triton surface — Voyager 2, 1989</p>
      </div>

      {/* Info cards */}
      <div className="space-y-4">
        <div className="bg-white rounded-xl p-5">
          <h3 className="font-medium text-black mb-2">A Captured World</h3>
          <p className="text-sm text-black/60 leading-relaxed">
            Triton is the only large moon in the solar system with a retrograde orbit — it
            orbits Neptune backwards. This means it wasn&apos;t formed with Neptune; it was
            captured, probably from the Kuiper Belt. It&apos;s essentially Pluto&apos;s sibling
            that wandered too close.
          </p>
        </div>

        <div className="bg-white rounded-xl p-5">
          <h3 className="font-medium text-black mb-2">Active Geysers</h3>
          <p className="text-sm text-black/60 leading-relaxed">
            Voyager 2 discovered dark plumes rising 8 km above Triton&apos;s surface — nitrogen
            geysers erupting through the ice. At -235°C, Triton is one of the coldest objects
            in the solar system, yet it&apos;s geologically active.
          </p>
        </div>

        <div className="bg-white rounded-xl p-5">
          <h3 className="font-medium text-black mb-2">Doomed Orbit</h3>
          <p className="text-sm text-black/60 leading-relaxed">
            Triton is slowly spiraling inward. In about 3.6 billion years, it will cross
            Neptune&apos;s Roche limit and be torn apart by tidal forces — potentially creating
            a ring system rivaling Saturn&apos;s.
          </p>
        </div>

        {/* Quick stats */}
        <div className="bg-[#1a1a1e] rounded-xl p-5 text-white">
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-white/50">Diameter</p>
              <p className="font-mono">2,706 km</p>
            </div>
            <div>
              <p className="text-white/50">Orbit</p>
              <p className="font-mono">Retrograde</p>
            </div>
            <div>
              <p className="text-white/50">Temperature</p>
              <p className="font-mono">-235°C</p>
            </div>
            <div>
              <p className="text-white/50">Distance</p>
              <p className="font-mono">354,800 km</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
