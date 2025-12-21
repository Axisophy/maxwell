'use client';

import { LARGEST_PITS, DEEPEST_MINES, SuperlativeSite } from '@/lib/data/extractionSuperlatives';
import { getMaterialById } from '@/lib/data/extractionMaterials';

interface SuperlativesProps {
  onFlyTo: (lat: number, lng: number, zoom?: number) => void;
}

export default function Superlatives({ onFlyTo }: SuperlativesProps) {
  return (
    <section className="py-12 md:py-16">
      <div className="px-4 md:px-8 lg:px-12 max-w-7xl mx-auto">
        <h2 className="text-xl md:text-2xl font-light text-black mb-2">
          The Extremes of Extraction
        </h2>
        <p className="text-black/50 mb-12">
          The scale of human endeavour, visible from space
        </p>

        {/* Largest Open-Pit Mines */}
        <div className="mb-16">
          <h3 className="text-lg font-medium text-black mb-6">Largest Open-Pit Mines</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {LARGEST_PITS.map(site => (
              <SuperlativeCard key={site.id} site={site} onFlyTo={onFlyTo} />
            ))}
          </div>
        </div>

        {/* Deepest Mines */}
        <div>
          <h3 className="text-lg font-medium text-black mb-6">Deepest Mines</h3>
          <div className="bg-white rounded-xl p-6 border border-black/5">
            <DeepestMinesChart mines={DEEPEST_MINES} onFlyTo={onFlyTo} />
            {DEEPEST_MINES[0].fact && (
              <p className="text-sm text-black/60 mt-6 italic border-t border-black/5 pt-4">
                "{DEEPEST_MINES[0].fact}"
              </p>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

function SuperlativeCard({
  site,
  onFlyTo,
}: {
  site: SuperlativeSite;
  onFlyTo: (lat: number, lng: number, zoom?: number) => void;
}) {
  const material = getMaterialById(site.materialId);
  const mapboxToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;
  const imageUrl = mapboxToken
    ? `https://api.mapbox.com/styles/v1/mapbox/satellite-v9/static/${site.lng},${site.lat},12,0/400x300@2x?access_token=${mapboxToken}`
    : null;

  return (
    <div className="bg-white rounded-xl overflow-hidden border border-black/5 group">
      {/* Satellite image */}
      <div className="h-40 bg-neutral-200 relative overflow-hidden">
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={site.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-4xl opacity-30">
            ⛏️
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
        <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between">
          <span
            className="px-2 py-1 rounded text-xs font-medium text-white"
            style={{ background: material?.color || '#888' }}
          >
            {site.material}
          </span>
        </div>
      </div>

      {/* Info */}
      <div className="p-4">
        <h4 className="font-medium text-black">{site.name}</h4>
        <p className="text-sm text-black/50">
          {site.location}, {site.country}
        </p>

        {/* Stats */}
        <div className="mt-3 flex flex-wrap gap-2">
          {site.stats.map(stat => (
            <div key={stat.label} className="text-xs">
              <span className="text-black/40">{stat.label}:</span>{' '}
              <span className="font-mono text-black/70">{stat.value}</span>
            </div>
          ))}
        </div>

        {/* Fly to button */}
        <button
          onClick={() => onFlyTo(site.lat, site.lng, 12)}
          className="mt-4 w-full py-2 px-3 rounded-lg bg-[#f5f5f5] hover:bg-black hover:text-white text-sm font-medium transition-colors"
        >
          Fly to →
        </button>
      </div>
    </div>
  );
}

function DeepestMinesChart({
  mines,
  onFlyTo,
}: {
  mines: SuperlativeSite[];
  onFlyTo: (lat: number, lng: number, zoom?: number) => void;
}) {
  const maxDepth = 4.0; // km

  return (
    <div className="space-y-3">
      {mines.map(mine => {
        const depth = parseFloat(mine.stats[0].value.replace(' km', ''));
        const widthPercent = (depth / maxDepth) * 100;

        return (
          <div key={mine.id} className="flex items-center gap-4">
            <div className="w-32 text-sm">
              <button
                onClick={() => onFlyTo(mine.lat, mine.lng, 10)}
                className="text-black hover:underline text-left font-medium"
              >
                {mine.name}
              </button>
            </div>
            <div className="flex-1 h-8 bg-[#f5f5f5] rounded overflow-hidden relative">
              <div
                className="h-full bg-gradient-to-r from-amber-500 to-amber-600 rounded transition-all duration-700"
                style={{ width: `${widthPercent}%` }}
              />
              <span className="absolute right-2 top-1/2 -translate-y-1/2 font-mono text-xs text-black/50">
                {mine.stats[0].value}
              </span>
            </div>
          </div>
        );
      })}

      {/* Scale */}
      <div className="flex items-center gap-4 pt-2 border-t border-black/5 mt-4">
        <div className="w-32 text-xs text-black/40">Depth below surface</div>
        <div className="flex-1 flex justify-between text-xs text-black/30 font-mono">
          <span>0</span>
          <span>1 km</span>
          <span>2 km</span>
          <span>3 km</span>
          <span>4 km</span>
        </div>
      </div>
    </div>
  );
}
