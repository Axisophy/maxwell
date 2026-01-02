'use client'

import { X } from 'lucide-react'
import { TrackedAnimal, categoryColors } from '@/lib/wildlife/types'

interface AnimalDetailPanelProps {
  animal: TrackedAnimal
  onClose: () => void
}

function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })
}

function Stat({ label, value }: { label: string; value: string | number }) {
  return (
    <div>
      <p className="text-xs text-black/40 uppercase tracking-wider mb-0.5">{label}</p>
      <p className="text-base font-medium text-black">{value}</p>
    </div>
  )
}

export default function AnimalDetailPanel({ animal, onClose }: AnimalDetailPanelProps) {
  const color = categoryColors[animal.category]

  return (
    <div className="absolute top-0 right-0 h-full w-full md:w-96 bg-white shadow-xl z-[600] overflow-y-auto animate-slide-in-right">
      {/* Header */}
      <div className="sticky top-0 bg-white border-b border-black/10 p-4 flex items-start justify-between">
        <div className="flex items-start gap-3">
          <div
            className="w-4 h-4 rounded-full mt-1 flex-shrink-0"
            style={{ backgroundColor: color }}
          />
          <div>
            <h2 className="text-2xl font-light text-black">{animal.name}</h2>
            <p className="text-sm text-black/50">{animal.speciesCommon}</p>
            <p className="text-xs text-black/30 italic">{animal.species}</p>
          </div>
        </div>
        <button
          onClick={onClose}
          className="p-2 hover:bg-black/5 rounded-lg transition-colors"
        >
          <X className="w-5 h-5 text-black/40" />
        </button>
      </div>

      {/* Content */}
      <div className="p-4 space-y-6">
        {/* Current Status */}
        <div className="bg-[#f5f5f5] rounded-xl p-4">
          <p className="text-xs text-black/40 uppercase tracking-wider mb-2">Current Status</p>
          <div className="flex items-center gap-2 mb-2">
            <span className="relative flex h-2.5 w-2.5">
              <span
                className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75"
                style={{ backgroundColor: color }}
              />
              <span
                className="relative inline-flex rounded-full h-full w-full"
                style={{ backgroundColor: color }}
              />
            </span>
            <span className="text-sm font-medium text-black">
              {animal.isRecentlyActive ? 'Active' : 'Inactive'}
            </span>
          </div>
          <p className="text-sm text-black/60">
            Last ping: {animal.lastPingAge}
          </p>
          <p className="text-xs text-black/40 mt-1">
            {animal.currentLocation.lat.toFixed(4)}°, {animal.currentLocation.lng.toFixed(4)}°
          </p>
        </div>

        {/* Journey Stats */}
        <div>
          <p className="text-xs text-black/40 uppercase tracking-wider mb-3">Journey Stats</p>
          <div className="grid grid-cols-2 gap-4">
            <Stat
              label="Distance travelled"
              value={`${animal.journey.totalDistanceKm.toLocaleString()} km`}
            />
            <Stat
              label="Tracking since"
              value={formatDate(animal.journey.trackingStartDate)}
            />
            <Stat
              label="Days tracked"
              value={animal.journey.daysSinceFirstPing}
            />
            <Stat
              label="Total pings"
              value={animal.journey.totalPings.toLocaleString()}
            />
          </div>
        </div>

        {/* Physical Characteristics */}
        {(animal.length || animal.weight || animal.sex || animal.ageClass) && (
          <div>
            <p className="text-xs text-black/40 uppercase tracking-wider mb-3">Profile</p>
            <div className="grid grid-cols-2 gap-4">
              {animal.sex && (
                <Stat label="Sex" value={animal.sex.charAt(0).toUpperCase() + animal.sex.slice(1)} />
              )}
              {animal.ageClass && (
                <Stat label="Age class" value={animal.ageClass.charAt(0).toUpperCase() + animal.ageClass.slice(1)} />
              )}
              {animal.length && (
                <Stat label="Length" value={`${animal.length} m`} />
              )}
              {animal.weight && (
                <Stat label="Weight" value={`${animal.weight} kg`} />
              )}
            </div>
          </div>
        )}

        {/* Recent Track Visualization */}
        <div>
          <p className="text-xs text-black/40 uppercase tracking-wider mb-3">Recent Journey (30 days)</p>
          <div className="bg-[#f5f5f5] rounded-xl p-4">
            <div className="h-16 flex items-end gap-0.5">
              {animal.recentTrack.slice(-30).map((_, i) => {
                const height = 20 + Math.random() * 80 // Simulated activity
                const opacity = 0.3 + (i / 30) * 0.7
                return (
                  <div
                    key={i}
                    className="flex-1 rounded-t"
                    style={{
                      height: `${height}%`,
                      backgroundColor: color,
                      opacity,
                    }}
                  />
                )
              })}
            </div>
            <div className="flex justify-between mt-2 text-[10px] text-black/40">
              <span>30 days ago</span>
              <span>Today</span>
            </div>
          </div>
        </div>

        {/* Study Info */}
        <div className="bg-[#f5f5f5] rounded-xl p-4">
          <p className="text-xs text-black/40 uppercase tracking-wider mb-2">Research Study</p>
          <p className="text-sm font-medium text-black">{animal.studyName}</p>
          <p className="text-xs text-black/40 mt-1">ID: {animal.studyId}</p>
        </div>
      </div>

      {/* Animation styles */}
      <style jsx>{`
        @keyframes slide-in-right {
          from {
            transform: translateX(100%);
          }
          to {
            transform: translateX(0);
          }
        }
        .animate-slide-in-right {
          animation: slide-in-right 0.3s ease-out;
        }
      `}</style>
    </div>
  )
}
