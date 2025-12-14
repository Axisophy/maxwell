'use client'

import { Suspense, useState, useEffect } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import ScientificCalculator from '@/components/calculator/ScientificCalculator'
import StatisticsCalculator from '@/components/calculator/StatisticsCalculator'
import GraphCalculator from '@/components/calculator/GraphCalculator'
import GeometryCalculator from '@/components/calculator/GeometryCalculator'
import ConversionCalculator from '@/components/calculator/ConversionCalculator'

type ViewType = 'scientific' | 'statistics' | 'graph' | 'geometry' | 'conversion'

const views: { id: ViewType; label: string }[] = [
  { id: 'scientific', label: 'Scientific' },
  { id: 'statistics', label: 'Statistics' },
  { id: 'graph', label: 'Graph' },
  { id: 'geometry', label: 'Geometry' },
  { id: 'conversion', label: 'Conversion' },
]

function CalculatorContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const [currentView, setCurrentView] = useState<ViewType>('scientific')

  // Sync view with URL parameter
  useEffect(() => {
    const viewParam = searchParams.get('view') as ViewType
    if (viewParam && views.some(v => v.id === viewParam)) {
      setCurrentView(viewParam)
    }
  }, [searchParams])

  // Update URL when view changes
  const handleViewChange = (view: ViewType) => {
    setCurrentView(view)
    router.push(`/tools/calculator?view=${view}`, { scroll: false })
  }

  // Render current view
  const renderView = () => {
    switch (currentView) {
      case 'scientific':
        return <ScientificCalculator />
      case 'statistics':
        return <StatisticsCalculator />
      case 'graph':
        return <GraphCalculator />
      case 'geometry':
        return <GeometryCalculator />
      case 'conversion':
        return <ConversionCalculator />
      default:
        return <ScientificCalculator />
    }
  }

  return (
    <>
      {/* Header */}
      <div className="mb-6 md:mb-8">
        <h1 className="text-3xl md:text-4xl lg:text-5xl font-light text-black mb-2">
          Calculator
        </h1>
        <p className="text-base text-black/50">
          Scientific calculations, statistics, graphing, and more.
        </p>
      </div>

      {/* View Tabs */}
      <div className="mb-6 md:mb-8 overflow-x-auto">
        <div className="flex gap-1 p-1 bg-[#e5e5e5] rounded-xl w-fit min-w-full md:min-w-0">
          {views.map((view) => (
            <button
              key={view.id}
              onClick={() => handleViewChange(view.id)}
              className={`
                px-4 py-2 rounded-lg text-sm font-medium transition-all whitespace-nowrap
                ${currentView === view.id
                  ? 'bg-white text-black shadow-sm'
                  : 'text-black/50 hover:text-black'
                }
              `}
            >
              {view.label}
            </button>
          ))}
        </div>
      </div>

      {/* Calculator View */}
      <div className="bg-white rounded-xl p-4 md:p-6 lg:p-8 shadow-sm">
        {renderView()}
      </div>
    </>
  )
}

export default function CalculatorPage() {
  return (
    <main className="min-h-screen bg-[#f5f5f5]">
      <div className="px-4 md:px-8 lg:px-12 pt-8 md:pt-12 lg:pt-16 pb-16 md:pb-20 lg:pb-24">
        <Suspense fallback={
          <div className="animate-pulse">
            <div className="h-12 bg-neutral-200 rounded w-1/3 mb-4" />
            <div className="h-6 bg-neutral-200 rounded w-1/2 mb-8" />
            <div className="h-12 bg-neutral-200 rounded mb-8" />
            <div className="h-96 bg-neutral-200 rounded" />
          </div>
        }>
          <CalculatorContent />
        </Suspense>
      </div>
    </main>
  )
}
