'use client'

import { useState, useEffect } from 'react'
import WidgetFrame from '@/components/WidgetFrame'
import DashboardSelector from '@/components/DashboardSelector'
import { WIDGET_REGISTRY } from '@/lib/dashboard/widget-registry'
import { getSetById, getDefaultSet } from '@/lib/dashboard/widget-sets'
import { WIDGET_COMPONENTS } from '@/lib/dashboard/widget-components'
import { getSelectedSetId } from '@/lib/dashboard/storage'

export default function DashboardPage() {
  const [currentSetId, setCurrentSetId] = useState<string>('default')
  const [isClient, setIsClient] = useState(false)

  // Ensure we only render dynamic content on client
  // This prevents hydration mismatches from localStorage
  useEffect(() => {
    setIsClient(true)
    setCurrentSetId(getSelectedSetId())
  }, [])

  const currentSet = getSetById(currentSetId) || getDefaultSet()

  const handleSetChange = (setId: string) => {
    setCurrentSetId(setId)
  }

  // Render widgets for current set
  const renderWidgets = () => {
    return currentSet.widgets.map((widgetId) => {
      const widgetDef = WIDGET_REGISTRY[widgetId]
      if (!widgetDef) {
        console.warn(`Widget not found in registry: ${widgetId}`)
        return null
      }

      const WidgetComponent = WIDGET_COMPONENTS[widgetDef.component]
      if (!WidgetComponent) {
        console.warn(`Component not found: ${widgetDef.component}`)
        return null
      }

      return (
        <WidgetFrame
          key={widgetId}
          title={widgetDef.title}
          description={widgetDef.description}
          source={widgetDef.source}
          status={widgetDef.status}
        >
          <WidgetComponent />
        </WidgetFrame>
      )
    })
  }

  return (
    <main className="min-h-screen bg-shell-light">
      {/* Mobile top padding */}
      <div className="h-14 md:hidden" />

      <div className="px-4 md:px-8 lg:px-12 pt-8 md:pt-12 lg:pt-16 pb-16 md:pb-20 lg:pb-24">
        {/* Page header */}
        <div className="mb-6 md:mb-8">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-light text-text-primary mb-3">
            Dashboard
          </h1>
          <p className="text-base md:text-lg text-black/60 max-w-2xl">
            Live data from space agencies, research stations, and sensors worldwide. 
            Switch between curated collections or register to build your own.
          </p>
        </div>

        {/* Dashboard selector */}
        <div className="mb-8 md:mb-10 max-w-sm">
          {isClient && (
            <DashboardSelector 
              onSetChange={handleSetChange}
              isRegistered={false} // TODO: Wire up to Clerk auth via useUser()
            />
          )}
        </div>

        {/* Widget grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          {isClient ? renderWidgets() : (
            // Loading state - show placeholder cards
            <>
              {[...Array(6)].map((_, i) => (
                <div 
                  key={i} 
                  className="bg-white rounded-xl h-64 animate-pulse"
                />
              ))}
            </>
          )}
        </div>
      </div>

      {/* Mobile bottom padding for nav */}
      <div className="h-20 md:hidden" />
    </main>
  )
}
