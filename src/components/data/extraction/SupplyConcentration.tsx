'use client';

import { MATERIALS } from '@/lib/data/extractionMaterials';

interface SupplyConcentrationProps {
  onSelectMaterial: (materialId: string) => void;
  selectedMaterial: string | null;
}

export default function SupplyConcentration({
  onSelectMaterial,
  selectedMaterial,
}: SupplyConcentrationProps) {
  // Filter materials that have supply concentration data (topProducers)
  const materialsWithSupply = MATERIALS.filter(
    m => m.topProducers && m.topProducers.length > 0
  );

  const selected = materialsWithSupply.find(m => m.id === selectedMaterial);

  return (
    <section className="py-12 md:py-16 bg-[#f5f5f5]">
      <div className="px-4 md:px-8 lg:px-12 max-w-7xl mx-auto">
        <h2 className="text-xl md:text-2xl font-light text-black mb-2">
          Supply Concentration
        </h2>
        <p className="text-black/50 mb-8">
          Where do critical materials come from?
        </p>

        {/* Material selector pills */}
        <div className="flex flex-wrap gap-2 mb-8">
          {materialsWithSupply.map(material => (
            <button
              key={material.id}
              onClick={() => onSelectMaterial(material.id)}
              className={`
                px-4 py-2 rounded-full text-sm font-medium transition-all
                ${selectedMaterial === material.id
                  ? 'text-white shadow-lg'
                  : 'bg-white text-black/70 hover:bg-white/80 border border-black/10'
                }
              `}
              style={
                selectedMaterial === material.id
                  ? { backgroundColor: material.color }
                  : undefined
              }
            >
              {material.name}
            </button>
          ))}
        </div>

        {/* Supply breakdown chart */}
        {selected && selected.topProducers && (
          <div className="bg-white rounded-xl p-6 border border-black/5 animate-fadeIn">
            <div className="flex items-center gap-3 mb-6">
              <div
                className="w-12 h-12 rounded-lg flex items-center justify-center font-mono text-lg font-bold text-white"
                style={{ backgroundColor: selected.color }}
              >
                {selected.symbol || selected.id.slice(0, 2).toUpperCase()}
              </div>
              <div>
                <h3 className="text-xl font-medium text-black">{selected.name}</h3>
                <p className="text-black/50 text-sm">Global production share by country</p>
              </div>
            </div>

            <div className="space-y-3">
              {selected.topProducers.map((item: { country: string; percent: number }, index: number) => (
                <div key={item.country} className="flex items-center gap-4">
                  <div className="w-24 text-sm text-black/70 font-medium">
                    {item.country}
                  </div>
                  <div className="flex-1 h-8 bg-[#f5f5f5] rounded overflow-hidden relative">
                    <div
                      className="h-full rounded transition-all duration-700"
                      style={{
                        width: `${item.percent}%`,
                        backgroundColor: selected.color,
                        opacity: 1 - index * 0.15,
                      }}
                    />
                    <span className="absolute right-2 top-1/2 -translate-y-1/2 font-mono text-xs text-black/50">
                      {item.percent}%
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {/* Risk indicator */}
            {selected.topProducers[0]?.percent > 50 && (
              <div className="mt-6 p-4 bg-amber-50 rounded-lg border border-amber-200">
                <div className="flex items-start gap-3">
                  <span className="text-amber-500 text-xl">⚠️</span>
                  <div>
                    <p className="font-medium text-amber-800">High Supply Concentration</p>
                    <p className="text-sm text-amber-700 mt-1">
                      {selected.topProducers[0].country} controls over{' '}
                      {selected.topProducers[0].percent}% of global {selected.name.toLowerCase()} production,
                      creating potential supply chain vulnerabilities.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {!selected && (
          <div className="bg-white rounded-xl p-12 border border-black/5 text-center">
            <p className="text-black/40">Select a material above to see supply concentration data</p>
          </div>
        )}
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn { animation: fadeIn 0.3s ease-out; }
      `}</style>
    </section>
  );
}
