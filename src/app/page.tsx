import TodayStrip from '@/components/TodayStrip'
import WidgetFrame from '@/components/WidgetFrame'

export default function Home() {
  return (
    <>
      <TodayStrip />
      
      <div className="px-6 py-8">
        <div className="max-w-7xl mx-auto">
          {/* Widget Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            
            {/* Solar Live - Placeholder */}
            <WidgetFrame title="Solar Live" isLive timestamp="Updated 3s ago">
              <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-amber-900/20 to-orange-900/20">
                <span className="text-sm text-[var(--text-muted)]">NASA SDO Feed</span>
              </div>
            </WidgetFrame>

            {/* Space Weather - Placeholder */}
            <WidgetFrame title="Space Weather" isLive timestamp="Updated 1m ago">
              <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-900/20 to-purple-900/20">
                <span className="text-sm text-[var(--text-muted)]">NOAA SWPC Data</span>
              </div>
            </WidgetFrame>

            {/* UK Energy Now - Placeholder */}
            <WidgetFrame title="UK Energy Now" isLive timestamp="Updated 30s ago">
              <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-green-900/20 to-emerald-900/20">
                <span className="text-sm text-[var(--text-muted)]">Carbon Intensity API</span>
              </div>
            </WidgetFrame>

            {/* Deep Sea Live - Placeholder */}
            <WidgetFrame title="Deep Sea Live" isLive>
              <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-950/30 to-slate-900/30">
                <span className="text-sm text-[var(--text-muted)]">Monterey Bay ROV</span>
              </div>
            </WidgetFrame>

            {/* Strange Attractor - Placeholder */}
            <WidgetFrame title="Strange Attractor" timestamp="Rössler system">
              <div className="w-full h-full flex items-center justify-center bg-[var(--widget-bg)]">
                <span className="text-sm text-[var(--text-muted)]">Observable/d3</span>
              </div>
            </WidgetFrame>

          </div>
        </div>
      </div>
    </>
  )
}
