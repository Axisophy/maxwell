'use client';

import { ChevronDown, ChevronRight } from 'lucide-react';
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
  return (
    <div className="bg-white rounded-xl p-5">
      <h3 className="text-sm font-medium text-black/50 uppercase tracking-wider mb-4">
        Map Layers
      </h3>

      <div className="space-y-1">
        {groups.map(group => (
          <div key={group.id}>
            {/* Group header */}
            <button
              onClick={() => onToggleGroup(group.id)}
              className="w-full flex items-center gap-2 py-2 hover:bg-neutral-50 rounded-lg transition-colors px-2 -mx-2"
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
              <div className="ml-6 space-y-1 pb-2">
                {group.layers.map(layer => (
                  <label
                    key={layer.id}
                    className="flex items-center gap-3 py-1.5 cursor-pointer hover:bg-neutral-50 rounded-lg px-2 -mx-2 transition-colors"
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
  );
}
