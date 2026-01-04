'use client'

import { useState, useEffect, Suspense } from 'react'
import dynamic from 'next/dynamic'
import Link from 'next/link'
import { BreadcrumbFrame, breadcrumbItems, PageHeaderFrame } from '@/components/ui'
import { ObserveIcon } from '@/components/icons'
import { useTimeController } from '@/lib/orbital/time'
import TimeControls from '@/components/orbital/TimeControls'
import FocusSelector from '@/components/orbital/FocusSelector'
import { getEarthPosition, getMoonHeliocentricPosition } from '@/lib/orbital/bodies'
import { AU, SCALE } from '@/lib/orbital/constants'

// Dynamic import for OrbitalScene to avoid SSR issues with Three.js
const OrbitalScene = dynamic(
  () => import('@/components/orbital/OrbitalScene'),
  {
    ssr: false,
    loading: () => (
      <div className="w-full h-full bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-white/20 border-t-white/60 rounded-full animate-spin mx-auto mb-4" />
          <div className="text-sm text-white/40">Loading orbital engine...</div>
        </div>
      </div>
    ),
  }
)

type FocusTarget = 'sun' | 'earth' | 'moon' | null

// Inner component that uses time-dependent hooks
function OrreryContent() {
  const timeController = useTimeController()
  const [focusTarget, setFocusTarget] = useState<FocusTarget>('earth')
  const [showOrbits, setShowOrbits] = useState(true)

  // Calculate current positions for info display
  const earthPos = getEarthPosition(timeController.time).position

  // Calculate distances
  const earthDistanceKm = Math.sqrt(
    earthPos.x * earthPos.x + earthPos.y * earthPos.y + earthPos.z * earthPos.z
  ) * SCALE
  const earthDistanceAU = earthDistanceKm / 149597870.7

  return (
    <main className="min-h-screen bg-black">
      <div className="px-2 md:px-4 pt-2 md:pt-4 pb-4 md:pb-8">
        <BreadcrumbFrame
          variant="dark"
          icon={<ObserveIcon className="w-4 h-4" />}
          items={breadcrumbItems(
            ['MXWLL', '/'],
            ['Observe', '/observe'],
            ['Space', '/observe/space'],
            ['Orrery']
          )}
        />

        <PageHeaderFrame
          variant="dark"
          title="Solar system"
          description="A real-time visualisation of the inner solar system. Earth and Moon positions calculated using VSOP87 planetary theory. Zoom and pan to explore."
        />

        {/* Main visualisation */}
        <div className="bg-[#1d1d1d] rounded-lg overflow-hidden mb-px">
          <div className="aspect-video md:aspect-[21/9] w-full">
            <Suspense fallback={
              <div className="w-full h-full bg-black flex items-center justify-center">
                <div className="w-8 h-8 border-2 border-white/20 border-t-white/60 rounded-full animate-spin" />
              </div>
            }>
              <OrbitalScene
                time={timeController.time}
                showOrbits={showOrbits}
                focusTarget={focusTarget}
              />
            </Suspense>
          </div>
        </div>

        {/* Controls */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-px mb-px">
          {/* Time controls */}
          <div className="bg-[#1d1d1d] rounded-lg p-4">
            <TimeControls controller={timeController} />
          </div>

          {/* Focus selector */}
          <div className="bg-[#1d1d1d] rounded-lg p-4">
            <FocusSelector current={focusTarget} onChange={setFocusTarget} />
          </div>

          {/* View options */}
          <div className="bg-[#1d1d1d] rounded-lg p-4">
            <div className="bg-black rounded-lg p-4">
              <div className="text-[10px] text-white/40 uppercase tracking-wider mb-3">
                View Options
              </div>
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={showOrbits}
                  onChange={(e) => setShowOrbits(e.target.checked)}
                  className="w-4 h-4 rounded border-white/20 bg-white/10 text-[#ffdf20] focus:ring-0 focus:ring-offset-0"
                />
                <span className="text-sm text-white">Show orbit paths</span>
              </label>
            </div>
          </div>
        </div>

        {/* Current positions */}
        <div className="bg-[#1d1d1d] rounded-lg p-4 mb-px">
          <div className="text-[10px] text-white/40 uppercase tracking-wider mb-4">
            Current Positions
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-black rounded-lg p-3">
              <div className="text-[10px] text-white/40 uppercase mb-1">Earth Distance</div>
              <div className="font-mono text-lg text-white">
                {earthDistanceAU.toFixed(4)} AU
              </div>
              <div className="text-xs text-white/40 mt-1">
                {(earthDistanceKm / 1000000).toFixed(2)} million km
              </div>
            </div>
            <div className="bg-black rounded-lg p-3">
              <div className="text-[10px] text-white/40 uppercase mb-1">Earth X</div>
              <div className="font-mono text-lg text-white">
                {earthPos.x.toFixed(0)}
              </div>
              <div className="text-xs text-white/40 mt-1">scene units</div>
            </div>
            <div className="bg-black rounded-lg p-3">
              <div className="text-[10px] text-white/40 uppercase mb-1">Earth Y</div>
              <div className="font-mono text-lg text-white">
                {earthPos.y.toFixed(0)}
              </div>
              <div className="text-xs text-white/40 mt-1">scene units</div>
            </div>
            <div className="bg-black rounded-lg p-3">
              <div className="text-[10px] text-white/40 uppercase mb-1">Earth Z</div>
              <div className="font-mono text-lg text-white">
                {earthPos.z.toFixed(0)}
              </div>
              <div className="text-xs text-white/40 mt-1">scene units</div>
            </div>
          </div>
        </div>

        {/* Technical info */}
        <div className="bg-[#1d1d1d] rounded-lg p-4 mb-px">
          <div className="text-[10px] text-white/40 uppercase tracking-wider mb-4">
            Technical Details
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div className="space-y-2">
              <div className="text-white/60">
                <span className="text-white/40">Scale: </span>
                1 scene unit = 1,000 km
              </div>
              <div className="text-white/60">
                <span className="text-white/40">Planetary theory: </span>
                VSOP87 via astronomy-engine
              </div>
              <div className="text-white/60">
                <span className="text-white/40">Depth buffer: </span>
                Logarithmic (handles multi-scale)
              </div>
            </div>
            <div className="space-y-2">
              <div className="text-white/60">
                <span className="text-white/40">1 AU: </span>
                {AU.toFixed(0)} scene units (~149.6 million km)
              </div>
              <div className="text-white/60">
                <span className="text-white/40">Earth radius: </span>
                6.37 scene units (6,371 km)
              </div>
              <div className="text-white/60">
                <span className="text-white/40">Moon orbit: </span>
                384 scene units (384,400 km)
              </div>
            </div>
          </div>
        </div>

        {/* Related */}
        <div className="bg-[#1d1d1d] rounded-lg p-4">
          <div className="text-sm text-white/40 uppercase tracking-wider mb-3">
            Related
          </div>
          <div className="flex flex-wrap gap-4 mb-4">
            <Link
              href="/observe/space/solar-observatory"
              className="text-sm text-white/60 hover:text-white transition-colors"
            >
              Solar Observatory →
            </Link>
            <Link
              href="/observe/space/lunar-atlas"
              className="text-sm text-white/60 hover:text-white transition-colors"
            >
              Lunar Atlas →
            </Link>
            <Link
              href="/data/cosmos/solar-system"
              className="text-sm text-white/60 hover:text-white transition-colors"
            >
              Solar System Data →
            </Link>
          </div>

          <div className="pt-4 border-t border-white/10 text-xs text-white/30">
            Positions calculated using VSOP87 planetary theory via astronomy-engine •
            Data accuracy: arc-second level for current epoch
          </div>
        </div>
      </div>
    </main>
  )
}

// Main page component - renders loading state during SSR, real content on client
export default function OrreryPage() {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return (
      <main className="min-h-screen bg-black">
        <div className="px-2 md:px-4 pt-2 md:pt-4 pb-4 md:pb-8">
          <BreadcrumbFrame
            variant="dark"
            icon={<ObserveIcon className="w-4 h-4" />}
            items={breadcrumbItems(
              ['MXWLL', '/'],
              ['Observe', '/observe'],
              ['Space', '/observe/space'],
              ['Orrery']
            )}
          />

          <PageHeaderFrame
            variant="dark"
            title="Solar system"
            description="Loading orbital engine..."
          />

          <div className="bg-[#1d1d1d] rounded-lg overflow-hidden mb-px">
            <div className="aspect-video md:aspect-[21/9] w-full bg-black flex items-center justify-center">
              <div className="w-8 h-8 border-2 border-white/20 border-t-white/60 rounded-full animate-spin" />
            </div>
          </div>
        </div>
      </main>
    )
  }

  return <OrreryContent />
}
