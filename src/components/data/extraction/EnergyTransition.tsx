'use client';

import { useState } from 'react';
import {
  DEMAND_PROJECTIONS,
  EV_MATERIALS,
  EV_TOTAL_MINERALS,
  WIND_TURBINE_MATERIALS,
  ENERGY_TRANSITION_FACTS,
} from '@/lib/data/energyTransition';
import { getMaterialById } from '@/lib/data/extractionMaterials';

interface EnergyTransitionProps {
  onSelectMaterial: (materialId: string) => void;
}

export default function EnergyTransition({ onSelectMaterial }: EnergyTransitionProps) {
  const [activeTab, setActiveTab] = useState<'demand' | 'ev' | 'wind'>('demand');

  return (
    <section className="py-12 md:py-16 bg-white">
      <div className="px-4 md:px-8 lg:px-12 max-w-7xl mx-auto">
        <h2 className="text-xl md:text-2xl font-light text-black mb-2">
          The Energy Transition
        </h2>
        <p className="text-black/50 mb-8">
          Clean energy requires vast quantities of mined materials
        </p>

        {/* Tab navigation */}
        <div className="flex gap-2 mb-8 overflow-x-auto pb-2">
          <button
            onClick={() => setActiveTab('demand')}
            className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all ${
              activeTab === 'demand'
                ? 'bg-black text-white'
                : 'bg-[#f5f5f5] text-black/70 hover:bg-[#eee]'
            }`}
          >
            Demand Growth
          </button>
          <button
            onClick={() => setActiveTab('ev')}
            className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all ${
              activeTab === 'ev'
                ? 'bg-black text-white'
                : 'bg-[#f5f5f5] text-black/70 hover:bg-[#eee]'
            }`}
          >
            Electric Vehicles
          </button>
          <button
            onClick={() => setActiveTab('wind')}
            className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all ${
              activeTab === 'wind'
                ? 'bg-black text-white'
                : 'bg-[#f5f5f5] text-black/70 hover:bg-[#eee]'
            }`}
          >
            Wind Turbines
          </button>
        </div>

        {/* Demand Growth Tab */}
        {activeTab === 'demand' && (
          <div className="bg-[#f5f5f5] rounded-xl p-6">
            <h3 className="text-lg font-medium text-black mb-6">
              Projected demand increase by 2040
            </h3>
            <div className="space-y-4">
              {DEMAND_PROJECTIONS.map(projection => {
                const material = getMaterialById(projection.materialId);
                const barWidth = Math.min((projection.multiplier / 42) * 100, 100);

                return (
                  <button
                    key={projection.materialId}
                    onClick={() => onSelectMaterial(projection.materialId)}
                    className="w-full flex items-center gap-4 group text-left"
                  >
                    <div className="w-24 flex items-center gap-2">
                      <div
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: material?.color || '#888' }}
                      />
                      <span className="text-sm font-medium text-black group-hover:underline">
                        {projection.name}
                      </span>
                    </div>
                    <div className="flex-1 h-10 bg-white rounded overflow-hidden relative">
                      <div
                        className="h-full rounded transition-all duration-700 group-hover:opacity-80"
                        style={{
                          width: `${barWidth}%`,
                          backgroundColor: material?.color || '#888',
                        }}
                      />
                      <div className="absolute inset-0 flex items-center justify-end pr-3">
                        <span className="font-mono text-lg font-bold text-black/70">
                          {projection.multiplier}×
                        </span>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
            <p className="text-xs text-black/40 mt-6">
              Source: IEA World Energy Outlook projections for clean energy transition
            </p>
          </div>
        )}

        {/* Electric Vehicles Tab */}
        {activeTab === 'ev' && (
          <div className="bg-[#f5f5f5] rounded-xl p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-medium text-black">
                Materials in an Electric Vehicle
              </h3>
              <span className="text-2xl font-mono font-bold text-black/70">
                {EV_TOTAL_MINERALS}
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {EV_MATERIALS.map(item => {
                const material = getMaterialById(item.materialId);
                return (
                  <button
                    key={item.materialId}
                    onClick={() => onSelectMaterial(item.materialId)}
                    className="flex items-center gap-4 p-4 bg-white rounded-lg hover:shadow-md transition-all text-left group"
                  >
                    <div
                      className="w-12 h-12 rounded-lg flex items-center justify-center font-mono font-bold text-white"
                      style={{ backgroundColor: material?.color || '#888' }}
                    >
                      {material?.symbol || item.materialId.slice(0, 2).toUpperCase()}
                    </div>
                    <div className="flex-1">
                      <div className="font-medium text-black group-hover:underline">
                        {item.name}
                      </div>
                      <div className="text-sm text-black/50">{item.component}</div>
                    </div>
                    <div className="font-mono text-sm text-black/40">{item.amount}</div>
                  </button>
                );
              })}
            </div>

            <p className="text-sm text-black/60 mt-6 italic">
              An EV uses 4× more copper than a combustion vehicle
            </p>
          </div>
        )}

        {/* Wind Turbines Tab */}
        {activeTab === 'wind' && (
          <div className="bg-[#f5f5f5] rounded-xl p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-medium text-black">
                Materials in a 3MW Wind Turbine
              </h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {WIND_TURBINE_MATERIALS.map(item => {
                const material = getMaterialById(item.materialId);
                return (
                  <button
                    key={item.materialId}
                    onClick={() => onSelectMaterial(item.materialId)}
                    className="flex items-center gap-4 p-4 bg-white rounded-lg hover:shadow-md transition-all text-left group"
                  >
                    <div
                      className="w-12 h-12 rounded-lg flex items-center justify-center font-mono font-bold text-white"
                      style={{ backgroundColor: material?.color || '#888' }}
                    >
                      {material?.symbol || item.materialId.slice(0, 2).toUpperCase()}
                    </div>
                    <div className="flex-1">
                      <div className="font-medium text-black group-hover:underline">
                        {item.name}
                      </div>
                      <div className="text-sm text-black/50">{item.component}</div>
                    </div>
                    <div className="font-mono text-sm text-black/40">{item.amount}</div>
                  </button>
                );
              })}
            </div>

            <p className="text-sm text-black/60 mt-6 italic">
              A single offshore wind turbine contains 335kg of rare earth magnets
            </p>
          </div>
        )}

        {/* Rotating facts */}
        <div className="mt-8 p-4 border-l-4 border-black/20 bg-[#f5f5f5] rounded-r-lg">
          <p className="text-sm text-black/70 italic">
            "{ENERGY_TRANSITION_FACTS[Math.floor(Math.random() * ENERGY_TRANSITION_FACTS.length)]}"
          </p>
        </div>
      </div>
    </section>
  );
}
