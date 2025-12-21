interface ByTheNumbersProps {
  totalAnimals: number
  uniqueSpecies: number
  totalStudies: number
  totalPings: number
}

function Stat({ label, value }: { label: string; value: string | number }) {
  return (
    <div>
      <p className="text-2xl md:text-3xl font-light text-black">{value}</p>
      <p className="text-xs text-black/40 uppercase tracking-wider mt-1">{label}</p>
    </div>
  )
}

export default function ByTheNumbers({
  totalAnimals,
  uniqueSpecies,
  totalStudies,
  totalPings,
}: ByTheNumbersProps) {
  return (
    <div className="bg-white rounded-xl p-5">
      <h3 className="text-sm font-medium text-black/50 uppercase tracking-wider mb-4">
        By The Numbers
      </h3>
      <div className="grid grid-cols-2 gap-4">
        <Stat label="Animals tracked" value={totalAnimals} />
        <Stat label="Species" value={uniqueSpecies} />
        <Stat label="Studies" value={totalStudies} />
        <Stat label="Total pings" value={totalPings.toLocaleString()} />
      </div>
    </div>
  )
}
