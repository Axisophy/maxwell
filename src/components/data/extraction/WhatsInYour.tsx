'use client';

import { useState } from 'react';
import { getMaterialById } from '@/lib/data/extractionMaterials';

interface Product {
  id: string;
  name: string;
  icon: string;
  tagline: string;
  materials: { materialId: string; component: string; amount?: string }[];
}

const PRODUCTS: Product[] = [
  {
    id: 'smartphone',
    name: 'Smartphone',
    icon: '📱',
    tagline: 'Over 30 elements from 6 continents',
    materials: [
      { materialId: 'lithium', component: 'Battery', amount: '3-4g' },
      { materialId: 'cobalt', component: 'Battery', amount: '5-8g' },
      { materialId: 'gold', component: 'Circuits', amount: '0.034g' },
      { materialId: 'copper', component: 'Wiring', amount: '15g' },
      { materialId: 'rare-earths', component: 'Speakers' },
      { materialId: 'tantalum', component: 'Capacitors', amount: '40mg' },
    ],
  },
  {
    id: 'ev',
    name: 'Electric Vehicle',
    icon: '🚗',
    tagline: '200kg of minerals per vehicle',
    materials: [
      { materialId: 'lithium', component: 'Battery', amount: '8-12kg' },
      { materialId: 'cobalt', component: 'Battery', amount: '14kg' },
      { materialId: 'copper', component: 'Motor', amount: '80kg' },
      { materialId: 'nickel', component: 'Battery', amount: '40kg' },
      { materialId: 'graphite', component: 'Anode', amount: '50kg' },
      { materialId: 'rare-earths', component: 'Motor', amount: '2kg' },
    ],
  },
  {
    id: 'wind-turbine',
    name: 'Wind Turbine',
    icon: '💨',
    tagline: '335kg of rare earths per 3MW turbine',
    materials: [
      { materialId: 'rare-earths', component: 'Generator', amount: '335kg' },
      { materialId: 'copper', component: 'Wiring', amount: '2,000kg' },
      { materialId: 'iron', component: 'Tower' },
    ],
  },
  {
    id: 'house',
    name: 'House',
    icon: '🏠',
    tagline: 'Foundations to wiring',
    materials: [
      { materialId: 'copper', component: 'Wiring', amount: '200kg' },
      { materialId: 'iron', component: 'Steel frame' },
      { materialId: 'limestone', component: 'Cement' },
    ],
  },
  {
    id: 'solar-panel',
    name: 'Solar Panel',
    icon: '☀️',
    tagline: 'Harvesting sunlight with silicon and silver',
    materials: [
      { materialId: 'silica-sand', component: 'Cells' },
      { materialId: 'silver', component: 'Contacts', amount: '20g' },
      { materialId: 'copper', component: 'Wiring' },
      { materialId: 'aluminum', component: 'Frame' },
    ],
  },
];

interface WhatsInYourProps {
  onSelectMaterial: (materialId: string) => void;
}

export default function WhatsInYour({ onSelectMaterial }: WhatsInYourProps) {
  const [expandedProduct, setExpandedProduct] = useState<string | null>(null);
  const product = PRODUCTS.find(p => p.id === expandedProduct);

  return (
    <section className="py-12 md:py-16 bg-white">
      <div className="px-4 md:px-8 lg:px-12 max-w-7xl mx-auto">
        <h2 className="text-xl md:text-2xl font-light text-black mb-2">
          What's In Your...
        </h2>
        <p className="text-black/50 mb-8">
          Everything connects to the ground beneath us
        </p>

        {/* Cards - horizontal scroll on mobile, grid on desktop */}
        <div className="flex gap-4 overflow-x-auto pb-4 snap-x snap-mandatory md:grid md:grid-cols-5 md:overflow-visible md:pb-0">
          {PRODUCTS.map(p => (
            <button
              key={p.id}
              onClick={() => setExpandedProduct(expandedProduct === p.id ? null : p.id)}
              className={`
                flex-shrink-0 w-40 md:w-auto snap-start
                flex flex-col items-center gap-3 p-6 rounded-xl
                border border-black/5 transition-all
                ${expandedProduct === p.id
                  ? 'bg-black text-white shadow-lg'
                  : 'bg-[#f5f5f5] hover:bg-[#eee]'
                }
              `}
            >
              <span className="text-4xl">{p.icon}</span>
              <div className="text-center">
                <div className="font-medium text-sm">{p.name}</div>
                <div className={`text-xs mt-1 ${expandedProduct === p.id ? 'text-white/60' : 'text-black/40'}`}>
                  {p.materials.length} minerals
                </div>
              </div>
            </button>
          ))}
        </div>

        {/* Expanded detail panel */}
        {product && (
          <div className="mt-8 p-6 bg-[#f5f5f5] rounded-xl animate-fadeIn">
            <div className="flex items-start gap-4 mb-6">
              <span className="text-5xl">{product.icon}</span>
              <div>
                <h3 className="text-xl font-medium text-black">{product.name}</h3>
                <p className="text-black/50 mt-1">{product.tagline}</p>
              </div>
            </div>

            <div className="space-y-3">
              {product.materials.map(item => {
                const materialData = getMaterialById(item.materialId);
                if (!materialData) return null;

                return (
                  <button
                    key={item.materialId}
                    onClick={() => onSelectMaterial(item.materialId)}
                    className="w-full flex items-center gap-4 p-4 bg-white rounded-lg hover:shadow-md transition-all text-left group"
                  >
                    <div
                      className="w-10 h-10 rounded-lg flex items-center justify-center font-mono text-sm font-bold text-white"
                      style={{ background: materialData.color }}
                    >
                      {materialData.symbol || materialData.id.slice(0, 2).toUpperCase()}
                    </div>
                    <div className="flex-1">
                      <span className="font-medium text-black">{materialData.name}</span>
                      <span className="text-black/30 mx-2">→</span>
                      <span className="text-black/50">{item.component}</span>
                    </div>
                    {item.amount && (
                      <span className="font-mono text-sm text-black/40">{item.amount}</span>
                    )}
                    <svg
                      className="w-4 h-4 text-black/30 group-hover:text-black group-hover:translate-x-1 transition-all"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                );
              })}
            </div>
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
