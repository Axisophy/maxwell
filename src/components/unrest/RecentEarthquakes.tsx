'use client';

import { Earthquake } from '@/lib/unrest/types';

interface RecentEarthquakesProps {
  earthquakes: Earthquake[];
  className?: string;
}

function getMagnitudeColor(mag: number): string {
  if (mag >= 7) return '#a855f7'; // purple - great
  if (mag >= 6) return '#ef4444'; // red - major
  if (mag >= 5) return '#f97316'; // orange - strong
  if (mag >= 4) return '#eab308'; // yellow - moderate
  if (mag >= 3) return '#22c55e'; // green - light
  return '#6b7280'; // gray - minor
}

function timeAgo(timestamp: number): string {
  const seconds = Math.floor((Date.now() - timestamp) / 1000);
  if (seconds < 60) return 'just now';
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

export default function RecentEarthquakes({ earthquakes, className = '' }: RecentEarthquakesProps) {
  // Filter to M4.0+ and take most recent 5
  const recent = earthquakes
    .filter(eq => eq.magnitude >= 4)
    .sort((a, b) => b.time - a.time)
    .slice(0, 5);

  return (
    <div className={`bg-white rounded-xl p-5 ${className}`}>
      <h3 className="text-sm font-medium text-black/50 uppercase tracking-wider mb-4">
        Recent Significant Earthquakes
      </h3>

      {recent.length === 0 ? (
        <p className="text-black/40 text-sm">No M4.0+ earthquakes in the last 24 hours</p>
      ) : (
        <div className="space-y-3">
          {recent.map(eq => (
            <a
              key={eq.id}
              href={eq.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-start gap-3 group"
            >
              <span
                className="font-mono font-bold text-lg leading-none mt-0.5 min-w-[3.5rem]"
                style={{ color: getMagnitudeColor(eq.magnitude) }}
              >
                M{eq.magnitude.toFixed(1)}
              </span>
              <div className="flex-1 min-w-0">
                <p className="text-black text-sm group-hover:text-[#e6007e] transition-colors truncate">
                  {eq.place}
                </p>
                <p className="text-black/40 text-xs">
                  {eq.depth}km depth · {timeAgo(eq.time)}
                </p>
              </div>
            </a>
          ))}
        </div>
      )}

      <p className="text-black/30 text-xs mt-4">
        Source: USGS Earthquake Hazards Program
      </p>
    </div>
  );
}
