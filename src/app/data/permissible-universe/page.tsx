'use client'

// ===========================================
// THE PERMISSIBLE UNIVERSE
// ===========================================
// An interactive mass-radius diagram showing everything
// that can exist in the universe

import React, { useState, useCallback, useMemo } from 'react'
import Breadcrumb from '@/components/ui/Breadcrumb'
import { CosmicObject, ObjectCategory, ViewMode, ModalState } from './lib/types'
import {
  ALL_OBJECTS,
  getObject,
  searchObjects,
  CATEGORIES,
  CHART_CONFIG,
  INITIAL_VIEW,
  BOUNDARY_LIST,
  BOUNDARIES,
} from './lib/index'
import {
  CosmicDiagram,
  ObjectModal,
  BoundaryModal,
  CategoryFilter,
  SearchBox,
  ViewToggle,
  LimitsView,
} from './components'

// ─────────────────────────────────────────────
// MAIN PAGE COMPONENT
// ─────────────────────────────────────────────

export default function PermissibleUniversePage() {
  // View state
  const [viewMode, setViewMode] = useState<ViewMode>('map')
  const [visibleCategories, setVisibleCategories] = useState<Set<ObjectCategory>>(
    new Set(Object.keys(CATEGORIES) as ObjectCategory[])
  )
  const [showEpochs, setShowEpochs] = useState(false)
  const [showDomination, setShowDomination] = useState(false)

  // Search
  const [searchQuery, setSearchQuery] = useState('')
  const searchResults = useMemo(() =>
    searchQuery ? searchObjects(searchQuery) : [],
    [searchQuery]
  )

  // Modal state
  const [modal, setModal] = useState<ModalState>({
    type: null,
    id: null,
    explanationLevel: 1,
  })

  // Hover state (for tooltip)
  const [hoveredObject, setHoveredObject] = useState<string | null>(null)

  // Filter objects
  const visibleObjects = useMemo(() => {
    let objects = ALL_OBJECTS.filter(obj => visibleCategories.has(obj.category))

    // If searching, highlight search results
    if (searchQuery && searchResults.length > 0) {
      const searchIds = new Set(searchResults.map(o => o.id))
      objects = objects.map(obj => ({
        ...obj,
        _isSearchResult: searchIds.has(obj.id),
      }))
    }

    return objects
  }, [visibleCategories, searchQuery, searchResults])

  // Handlers
  const handleObjectClick = useCallback((id: string) => {
    setModal({ type: 'object', id, explanationLevel: 1 })
  }, [])

  const handleBoundaryClick = useCallback((id: string) => {
    setModal({ type: 'boundary', id, explanationLevel: 1 })
  }, [])

  const handleCloseModal = useCallback(() => {
    setModal({ type: null, id: null, explanationLevel: 1 })
  }, [])

  const handleExplanationLevelChange = useCallback((level: 1 | 2 | 3 | 4) => {
    setModal(prev => ({ ...prev, explanationLevel: level }))
  }, [])

  const toggleCategory = useCallback((category: ObjectCategory) => {
    setVisibleCategories(prev => {
      const next = new Set(prev)
      if (next.has(category)) {
        next.delete(category)
      } else {
        next.add(category)
      }
      return next
    })
  }, [])

  const showAllCategories = useCallback(() => {
    setVisibleCategories(new Set(Object.keys(CATEGORIES) as ObjectCategory[]))
  }, [])

  const hideAllCategories = useCallback(() => {
    setVisibleCategories(new Set())
  }, [])

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white">
      {/* Header */}
      <header className="border-b border-white/10">
        <div className="px-4 md:px-8 lg:px-12 py-6">
          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-4">
            {/* Title */}
            <div>
              <Breadcrumb
                items={[
                  { label: 'MXWLL', href: '/' },
                  { label: 'Data', href: '/data' },
                  { label: 'Permissible Universe' },
                ]}
                theme="dark"
                className="mb-2"
              />
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-light tracking-tight">
                The Permissible Universe
              </h1>
              <p className="text-white/60 mt-2 max-w-2xl text-sm md:text-base">
                A map of everything that can exist: from quarks to superclusters,
                bounded by the laws of physics. The forbidden zones show where
                nature draws the line.
              </p>
            </div>

            {/* View Toggle */}
            <ViewToggle
              mode={viewMode}
              onChange={setViewMode}
            />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative">
        {viewMode === 'map' ? (
          <>
            {/* Controls Bar */}
            <div className="border-b border-white/10 bg-[#0a0a0f]/80 backdrop-blur-sm sticky top-0 z-20">
              <div className="px-4 md:px-8 lg:px-12 py-3">
                <div className="flex flex-col md:flex-row md:items-center gap-4">
                  {/* Search */}
                  <div className="flex-shrink-0 w-full md:w-64">
                    <SearchBox
                      value={searchQuery}
                      onChange={setSearchQuery}
                      results={searchResults}
                      onResultClick={handleObjectClick}
                    />
                  </div>

                  {/* Category Filters */}
                  <div className="flex-1 overflow-x-auto">
                    <CategoryFilter
                      categories={CATEGORIES}
                      visible={visibleCategories}
                      onToggle={toggleCategory}
                      onShowAll={showAllCategories}
                      onHideAll={hideAllCategories}
                    />
                  </div>

                  {/* Overlay toggles */}
                  <div className="flex items-center gap-3 text-xs">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={showEpochs}
                        onChange={(e) => setShowEpochs(e.target.checked)}
                        className="w-3 h-3 rounded border-white/30 bg-transparent"
                      />
                      <span className="text-white/60">Epochs</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={showDomination}
                        onChange={(e) => setShowDomination(e.target.checked)}
                        className="w-3 h-3 rounded border-white/30 bg-transparent"
                      />
                      <span className="text-white/60">Ω Regions</span>
                    </label>
                  </div>
                </div>
              </div>
            </div>

            {/* Diagram */}
            <div className="px-4 md:px-8 lg:px-12 py-4">
              <div className="relative rounded-xl overflow-hidden" style={{ height: 'calc(100vh - 260px)', minHeight: '500px', maxHeight: '800px' }}>
                <CosmicDiagram
                  objects={visibleObjects}
                  boundaries={BOUNDARY_LIST}
                  showEpochs={showEpochs}
                  showDomination={showDomination}
                  onObjectClick={handleObjectClick}
                  onObjectHover={setHoveredObject}
                  onBoundaryClick={handleBoundaryClick}
                  initialView={INITIAL_VIEW}
                />

                {/* Legend */}
                <div className="absolute bottom-4 left-4 bg-black/80 backdrop-blur-sm rounded-lg p-3 text-xs max-w-xs">
                <div className="font-medium text-white/80 mb-2">Forbidden Zones</div>
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-0.5 bg-red-800"></div>
                    <span className="text-white/60">Schwarzschild (black hole)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-0.5 bg-blue-800"></div>
                    <span className="text-white/60">Compton (quantum limit)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-0.5 bg-gray-500 opacity-50" style={{ borderStyle: 'dashed' }}></div>
                    <span className="text-white/60">Planck scale</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-0.5 bg-teal-800 opacity-50"></div>
                    <span className="text-white/60">Hubble radius</span>
                  </div>
                </div>
              </div>

                {/* Object count */}
                <div className="absolute bottom-4 right-4 bg-black/80 backdrop-blur-sm rounded-lg px-3 py-2 text-xs text-white/40 font-mono">
                  {visibleObjects.length} objects
                </div>
              </div>
            </div>
          </>
        ) : (
          /* Limits View */
          <LimitsView
            boundaries={BOUNDARY_LIST}
            onBoundaryClick={handleBoundaryClick}
          />
        )}
      </main>

      {/* Object Modal */}
      {modal.type === 'object' && modal.id && (
        <ObjectModal
          object={getObject(modal.id)!}
          explanationLevel={modal.explanationLevel}
          onLevelChange={handleExplanationLevelChange}
          onClose={handleCloseModal}
          onObjectClick={handleObjectClick}
        />
      )}

      {/* Boundary Modal */}
      {modal.type === 'boundary' && modal.id && (
        <BoundaryModal
          boundary={BOUNDARIES[modal.id]}
          explanationLevel={modal.explanationLevel}
          onLevelChange={handleExplanationLevelChange}
          onClose={handleCloseModal}
          onObjectClick={handleObjectClick}
        />
      )}
    </div>
  )
}
