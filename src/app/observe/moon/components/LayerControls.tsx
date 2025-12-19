'use client';

import { useState } from 'react';
import { ChevronDown, ChevronRight, Layers, X } from 'lucide-react';
import { LayerGroup } from '@/lib/moon/types';

interface LayerControlsProps {
  groups: LayerGroup[];
  onToggleLayer: (layerId: string) => void;
  onToggleGroup: (groupId: string) => void;
}

export default function LayerControls({
  groups,
  onToggleLayer,
  onToggleGroup,
}: LayerControlsProps) {
  const [isOpen, setIsOpen] = useState(false);

  // Count active layers
  const activeCount = groups
    .flatMap(g => g.layers)
    .filter(l => l.visible).length;

  return (
    <>
      {/* Toggle button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="absolute top-4 right-4 z-[1000] flex items-center gap-2 px-3 py-2 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow"
        aria-label="Toggle layers"
      >
        <Layers className="w-4 h-4" />
        <span className="text-sm font-medium">Layers</span>
        {activeCount > 0 && (
          <span className="flex items-center justify-center w-5 h-5 text-xs font-medium bg-black text-white rounded-full">
            {activeCount}
          </span>
        )}
      </button>

      {/* Layer panel */}
      {isOpen && (
        <div className="absolute top-4 right-4 z-[1001] w-72 bg-white rounded-xl shadow-xl overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-neutral-100">
            <h3 className="text-sm font-medium uppercase tracking-wider text-black/50">
              Layers
            </h3>
            <button
              onClick={() => setIsOpen(false)}
              className="p-1 hover:bg-neutral-100 rounded-md transition-colors"
              aria-label="Close layers"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Layer groups */}
          <div className="max-h-[60vh] overflow-y-auto">
            {groups.map(group => (
              <div key={group.id} className="border-b border-neutral-100 last:border-b-0">
                {/* Group header */}
                <button
                  onClick={() => onToggleGroup(group.id)}
                  className="w-full flex items-center gap-2 px-4 py-3 hover:bg-neutral-50 transition-colors"
                >
                  {group.expanded ? (
                    <ChevronDown className="w-4 h-4 text-black/40" />
                  ) : (
                    <ChevronRight className="w-4 h-4 text-black/40" />
                  )}
                  <span className="text-sm font-medium">{group.name}</span>
                  <span className="ml-auto text-xs text-black/40">
                    {group.layers.filter(l => l.visible).length}/{group.layers.length}
                  </span>
                </button>

                {/* Layers */}
                {group.expanded && (
                  <div className="pb-2">
                    {group.layers.map(layer => (
                      <label
                        key={layer.id}
                        className="flex items-center gap-3 px-4 py-2 pl-10 cursor-pointer hover:bg-neutral-50 transition-colors"
                      >
                        <input
                          type="checkbox"
                          checked={layer.visible}
                          onChange={() => onToggleLayer(layer.id)}
                          className="w-4 h-4 rounded border-neutral-300 text-black focus:ring-black focus:ring-offset-0"
                        />
                        <span
                          className="w-3 h-3 rounded-full flex-shrink-0"
                          style={{ backgroundColor: layer.color }}
                        />
                        <span className="text-sm">{layer.name}</span>
                      </label>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </>
  );
}
