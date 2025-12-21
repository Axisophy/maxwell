'use client';

import { useState } from 'react';
import {
  CLARION_CLIPPERTON,
  NODULE_COMPOSITION,
  OCEAN_MINING_CONTROVERSY,
  OCEAN_MINING_COMPANIES,
  OCEAN_MINING_TIMELINE,
} from '@/lib/data/oceanMining';
import { getMaterialById } from '@/lib/data/extractionMaterials';

interface OceanMiningProps {
  onFlyTo: (lat: number, lng: number, zoom?: number) => void;
  onSelectMaterial: (materialId: string) => void;
}

export default function OceanMining({ onFlyTo, onSelectMaterial }: OceanMiningProps) {
  const [showTimeline, setShowTimeline] = useState(false);

  const handleFlyToZone = () => {
    const centerLat = (CLARION_CLIPPERTON.coordinates.north + CLARION_CLIPPERTON.coordinates.south) / 2;
    const centerLng = (CLARION_CLIPPERTON.coordinates.east + CLARION_CLIPPERTON.coordinates.west) / 2;
    onFlyTo(centerLat, centerLng, 4);
  };

  return (
    <section className="py-12 md:py-16 bg-gradient-to-b from-blue-950 to-blue-900 text-white">
      <div className="px-4 md:px-8 lg:px-12 max-w-7xl mx-auto">
        <h2 className="text-xl md:text-2xl font-light mb-2">
          The Last Frontier: Deep Sea Mining
        </h2>
        <p className="text-white/50 mb-8">
          Billions of tonnes of minerals lie on the ocean floor
        </p>

        {/* Clarion-Clipperton Zone */}
        <div className="bg-white/10 backdrop-blur rounded-xl p-6 mb-8">
          <div className="flex flex-col md:flex-row md:items-start gap-6">
            <div className="flex-1">
              <h3 className="text-xl font-medium mb-2">{CLARION_CLIPPERTON.name}</h3>
              <p className="text-white/70 mb-4">{CLARION_CLIPPERTON.description}</p>

              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <div className="text-white/40 text-xs uppercase tracking-wide">Area</div>
                  <div className="font-mono text-lg">{CLARION_CLIPPERTON.area}</div>
                </div>
                <div>
                  <div className="text-white/40 text-xs uppercase tracking-wide">Depth</div>
                  <div className="font-mono text-lg">{CLARION_CLIPPERTON.depth}</div>
                </div>
              </div>

              <button
                onClick={handleFlyToZone}
                className="px-4 py-2 bg-white/20 hover:bg-white/30 rounded-lg text-sm font-medium transition-colors"
              >
                Fly to Zone →
              </button>
            </div>

            {/* Nodule composition */}
            <div className="md:w-64 bg-black/20 rounded-lg p-4">
              <h4 className="text-sm font-medium text-white/70 mb-3">
                Polymetallic Nodule Composition
              </h4>
              <div className="space-y-2">
                {NODULE_COMPOSITION.map(item => {
                  const material = item.materialId ? getMaterialById(item.materialId) : null;
                  return (
                    <button
                      key={item.element}
                      onClick={() => item.materialId && onSelectMaterial(item.materialId)}
                      className={`w-full flex items-center gap-2 text-left ${
                        item.materialId ? 'hover:bg-white/10 cursor-pointer' : ''
                      } rounded px-2 py-1 -mx-2 transition-colors`}
                    >
                      <div
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: material?.color || '#888' }}
                      />
                      <span className="flex-1 text-sm">{item.element}</span>
                      <span className="font-mono text-xs text-white/50">{item.percent}%</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Controversy panel */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <div className="bg-emerald-500/20 rounded-xl p-6">
            <h4 className="text-emerald-300 font-medium mb-2">The Case For</h4>
            <p className="text-white/80 text-sm">{OCEAN_MINING_CONTROVERSY.pro}</p>
          </div>
          <div className="bg-rose-500/20 rounded-xl p-6">
            <h4 className="text-rose-300 font-medium mb-2">The Case Against</h4>
            <p className="text-white/80 text-sm">{OCEAN_MINING_CONTROVERSY.con}</p>
          </div>
        </div>

        {/* Quote */}
        <blockquote className="border-l-4 border-white/20 pl-4 mb-8">
          <p className="text-white/60 italic">"{OCEAN_MINING_CONTROVERSY.quote}"</p>
        </blockquote>

        {/* Companies */}
        <div className="mb-8">
          <h4 className="text-sm font-medium text-white/70 mb-4">Active Exploration Companies</h4>
          <div className="flex flex-wrap gap-3">
            {OCEAN_MINING_COMPANIES.map(company => (
              <div
                key={company.name}
                className="px-3 py-2 bg-white/10 rounded-lg text-sm"
              >
                <span className="font-medium">{company.name}</span>
                <span className="text-white/40 ml-2">({company.country})</span>
                <span
                  className={`ml-2 text-xs px-2 py-0.5 rounded-full ${
                    company.status === 'testing'
                      ? 'bg-amber-500/30 text-amber-200'
                      : company.status === 'licensed'
                      ? 'bg-emerald-500/30 text-emerald-200'
                      : 'bg-white/20 text-white/60'
                  }`}
                >
                  {company.status}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Timeline toggle */}
        <button
          onClick={() => setShowTimeline(!showTimeline)}
          className="text-sm text-white/50 hover:text-white/70 transition-colors flex items-center gap-2"
        >
          {showTimeline ? '▼' : '▶'} Timeline of Deep Sea Mining
        </button>

        {showTimeline && (
          <div className="mt-4 pl-4 border-l-2 border-white/20 space-y-4">
            {OCEAN_MINING_TIMELINE.map((item, index) => (
              <div key={index} className="relative">
                <div className="absolute -left-[21px] w-3 h-3 rounded-full bg-blue-400" />
                <div className="font-mono text-sm text-white/40">{item.year}</div>
                <div className="text-white/80 text-sm">{item.event}</div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
