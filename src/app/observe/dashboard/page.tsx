'use client'

import { useState, useEffect } from 'react'
import WidgetFrame from '@/components/WidgetFrame'
import DashboardSelector from '@/components/DashboardSelector'
import { WIDGET_REGISTRY } from '@/lib/dashboard/widget-registry'
import { getSetById, getDefaultSet } from '@/lib/dashboard/widget-sets'
import { WIDGET_COMPONENTS } from '@/lib/dashboard/widget-components'
import { getSelectedSetId } from '@/lib/dashboard/storage'
import Breadcrumb from '@/components/ui/Breadcrumb'
import { ObserveIcon } from '@/components/icons'

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
    <main className="min-h-screen bg-black">
      <div className="px-2 md:px-4 pt-2 md:pt-4 pb-4 md:pb-8">

        {/* Breadcrumb Frame */}
        <div className="mb-px">
          <div className="block bg-white rounded-lg py-1 md:py-2 px-2 md:px-4">
            <Breadcrumb
              items={[
                { label: 'MXWLL', href: '/' },
                { label: 'Observe', href: '/observe' },
                { label: 'Dashboard' },
              ]}
              theme="light"
            />
          </div>
        </div>

        {/* Frames container */}
        <div className="flex flex-col gap-px">

          {/* Header Frame */}
          <section className="bg-white rounded-lg p-2 md:p-4">
            <ObserveIcon className="text-black mb-3 w-12 h-12 md:w-16 md:h-16 lg:w-[100px] lg:h-[100px]" />
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-light text-black uppercase mb-3">
              Dashboard
            </h1>
            <p className="text-base md:text-lg text-black/60 max-w-2xl">
              Live data from space agencies, research stations, and sensors worldwide.
              Switch between curated collections or register to build your own.
            </p>
          </section>

          {/* Selector Frame */}
          <section className="bg-white rounded-lg p-2 md:p-4">
            <div className="text-2xl md:text-3xl lg:text-4xl font-light text-black uppercase mb-4">
              Viewing
            </div>
            <div className="max-w-sm">
              {isClient && (
                <DashboardSelector
                  onSetChange={handleSetChange}
                  isRegistered={false}
                />
              )}
            </div>
          </section>

          {/* Widgets Frame */}
          <section className="bg-white rounded-lg p-2 md:p-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
              {isClient ? renderWidgets() : (
                <>
                  {[...Array(6)].map((_, i) => (
                    <div
                      key={i}
                      className="bg-[#f5f5f5] rounded-lg h-64 animate-pulse"
                    />
                  ))}
                </>
              )}
            </div>
          </section>

        </div>
      </div>

      {/* Mobile bottom padding for nav */}
      <div className="h-20 md:hidden" />
    </main>
  )
}
