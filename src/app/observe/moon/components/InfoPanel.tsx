'use client';

import { X, ExternalLink, MapPin, Calendar, Users } from 'lucide-react';
import Link from 'next/link';

interface InfoPanelProps {
  feature: {
    id: string;
    properties: Record<string, unknown>;
  } | null;
  onClose: () => void;
}

export default function InfoPanel({ feature, onClose }: InfoPanelProps) {
  if (!feature) return null;

  const { properties } = feature;

  // Type helper functions
  const getString = (key: string): string | undefined => {
    const val = properties[key];
    return typeof val === 'string' ? val : undefined;
  };

  const getNumber = (key: string): number | undefined => {
    const val = properties[key];
    return typeof val === 'number' ? val : undefined;
  };

  const getStringArray = (key: string): string[] | undefined => {
    const val = properties[key];
    return Array.isArray(val) ? val.filter((v): v is string => typeof v === 'string') : undefined;
  };

  const name = getString('name');
  const type = getString('type');
  const category = getString('category');
  const englishName = getString('englishName');
  const location = getString('location');
  const description = getString('description');
  const date = getString('date');
  const cmpilot = getString('cmpilot');
  const surfaceDuration = getString('surfaceDuration');
  const evaDuration = getString('evaDuration');
  const age = getString('age');
  const formed = getString('formed');
  const firstWords = getString('firstWords');
  const lastWords = getString('lastWords');

  const diameter = getNumber('diameter');
  const depth = getNumber('depth');
  const samples = getNumber('samples');
  const roverDistance = getNumber('roverDistance');

  const crew = getStringArray('crew');
  const artifacts = getStringArray('artifacts');

  const isApollo = category === 'apollo';
  const isMare = type === 'mare';
  const isCrater = type === 'crater';

  return (
    <div className="absolute bottom-0 left-0 right-0 md:bottom-auto md:top-4 md:left-4 md:right-auto md:w-96 z-[1000] bg-white rounded-t-xl md:rounded-xl shadow-xl max-h-[70vh] overflow-hidden flex flex-col">
      {/* Header */}
      <div className="flex items-start justify-between p-4 border-b border-neutral-100">
        <div>
          <h2 className="text-xl font-light text-black">
            {name}
          </h2>
          {englishName && (
            <p className="text-sm text-black/50">{englishName}</p>
          )}
          {location && !englishName && (
            <p className="text-sm text-black/50 flex items-center gap-1">
              <MapPin className="w-3 h-3" />
              {location}
            </p>
          )}
        </div>
        <button
          onClick={onClose}
          className="p-2 hover:bg-neutral-100 rounded-lg transition-colors"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {/* Apollo mission details */}
        {isApollo && (
          <>
            {date && (
              <div className="flex items-center gap-2 text-sm">
                <Calendar className="w-4 h-4 text-black/40" />
                <span>
                  {new Date(date).toLocaleDateString('en-GB', {
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric',
                  })}
                </span>
              </div>
            )}

            {crew && crew.length > 0 && (
              <div className="flex items-start gap-2 text-sm">
                <Users className="w-4 h-4 text-black/40 mt-0.5" />
                <div>
                  <p className="font-medium">Surface crew</p>
                  <p className="text-black/70">{crew.join(' & ')}</p>
                  {cmpilot && (
                    <p className="text-black/50 text-xs mt-1">
                      Command module: {cmpilot}
                    </p>
                  )}
                </div>
              </div>
            )}

            {/* Stats grid */}
            <div className="grid grid-cols-2 gap-3">
              {surfaceDuration && (
                <div className="bg-neutral-50 rounded-lg p-3">
                  <p className="text-xs text-black/50 uppercase tracking-wider mb-1">
                    Surface time
                  </p>
                  <p className="text-sm font-mono">{surfaceDuration}</p>
                </div>
              )}
              {evaDuration && (
                <div className="bg-neutral-50 rounded-lg p-3">
                  <p className="text-xs text-black/50 uppercase tracking-wider mb-1">
                    EVA time
                  </p>
                  <p className="text-sm font-mono">{evaDuration}</p>
                </div>
              )}
              {samples !== undefined && (
                <div className="bg-neutral-50 rounded-lg p-3">
                  <p className="text-xs text-black/50 uppercase tracking-wider mb-1">
                    Samples
                  </p>
                  <p className="text-sm font-mono">{samples} kg</p>
                </div>
              )}
              {roverDistance !== undefined && (
                <div className="bg-neutral-50 rounded-lg p-3">
                  <p className="text-xs text-black/50 uppercase tracking-wider mb-1">
                    Rover distance
                  </p>
                  <p className="text-sm font-mono">{roverDistance} km</p>
                </div>
              )}
            </div>
          </>
        )}

        {/* Crater details */}
        {isCrater && (
          <div className="grid grid-cols-2 gap-3">
            {diameter !== undefined && (
              <div className="bg-neutral-50 rounded-lg p-3">
                <p className="text-xs text-black/50 uppercase tracking-wider mb-1">
                  Diameter
                </p>
                <p className="text-sm font-mono">{diameter} km</p>
              </div>
            )}
            {depth !== undefined && (
              <div className="bg-neutral-50 rounded-lg p-3">
                <p className="text-xs text-black/50 uppercase tracking-wider mb-1">
                  Depth
                </p>
                <p className="text-sm font-mono">{(depth / 1000).toFixed(1)} km</p>
              </div>
            )}
            {age && (
              <div className="bg-neutral-50 rounded-lg p-3 col-span-2">
                <p className="text-xs text-black/50 uppercase tracking-wider mb-1">
                  Age
                </p>
                <p className="text-sm">{age}</p>
              </div>
            )}
          </div>
        )}

        {/* Mare details */}
        {isMare && (
          <div className="grid grid-cols-2 gap-3">
            {diameter !== undefined && (
              <div className="bg-neutral-50 rounded-lg p-3">
                <p className="text-xs text-black/50 uppercase tracking-wider mb-1">
                  Diameter
                </p>
                <p className="text-sm font-mono">{diameter} km</p>
              </div>
            )}
            {formed && (
              <div className="bg-neutral-50 rounded-lg p-3 col-span-2">
                <p className="text-xs text-black/50 uppercase tracking-wider mb-1">
                  Formation
                </p>
                <p className="text-sm">{formed}</p>
              </div>
            )}
          </div>
        )}

        {/* Description */}
        {description && (
          <p className="text-sm text-black/70 leading-relaxed">
            {description}
          </p>
        )}

        {/* First/last words */}
        {firstWords && (
          <blockquote className="border-l-2 border-black/20 pl-3 italic text-sm text-black/60">
            &ldquo;{firstWords}&rdquo;
          </blockquote>
        )}
        {lastWords && (
          <blockquote className="border-l-2 border-black/20 pl-3 italic text-sm text-black/60">
            &ldquo;{lastWords}&rdquo;
          </blockquote>
        )}

        {/* Artifacts */}
        {artifacts && artifacts.length > 0 && (
          <div>
            <p className="text-xs text-black/50 uppercase tracking-wider mb-2">
              Left on surface
            </p>
            <div className="flex flex-wrap gap-2">
              {artifacts.map((artifact, i) => (
                <span
                  key={i}
                  className="px-2 py-1 bg-neutral-100 rounded text-xs"
                >
                  {artifact}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-neutral-100 bg-neutral-50">
        <Link
          href={`/data/moon`}
          className="flex items-center justify-center gap-2 w-full py-2 px-4 bg-black text-white rounded-lg text-sm font-medium hover:bg-black/80 transition-colors"
        >
          View Moon data
          <ExternalLink className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
}
