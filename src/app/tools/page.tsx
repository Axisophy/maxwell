import Calculator from '@/components/widgets/Calculator'
import WidgetFrame from '@/components/WidgetFrame'
import StopwatchTimer from '@/components/widgets/StopwatchTimer'

export default function ToolsPage() {
  return (
    <main className="min-h-screen bg-[#f5f5f5]">
      {/* Mobile top padding */}
      <div className="h-14 md:hidden" />

      <div className="px-4 md:px-8 lg:px-12 pt-8 md:pt-12 lg:pt-16 pb-16 md:pb-20 lg:pb-24">
        <h1 className="text-3xl md:text-4xl lg:text-5xl font-light text-black mb-4">Tools</h1>
        <p className="text-base md:text-lg text-black mb-8 max-w-2xl">
          Interactive instruments - calculators, oscilloscopes, converters.
        </p>

        {/* Tools Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Calculator />

          <WidgetFrame
            title="Stopwatch & Timer"
            description="Precision timing instrument with lap tracking and countdown functionality."
            source="MXWLL"
            status="ok"
          >
            <StopwatchTimer />
          </WidgetFrame>

          {/* Coming Soon: Unit Converter */}
          <div className="bg-[#e5e5e5] rounded-xl p-5">
            <div className="flex items-start justify-between gap-2 mb-2">
              <h3 className="text-base font-medium text-black/40">Unit Converter</h3>
              <span className="flex-shrink-0 text-xs text-black/30">Soon</span>
            </div>
            <p className="text-sm text-black/30">
              Convert between units of length, mass, temperature, pressure, energy, and more.
            </p>
          </div>
        </div>
      </div>

      {/* Mobile bottom padding */}
      <div className="h-20 md:hidden" />
    </main>
  )
}