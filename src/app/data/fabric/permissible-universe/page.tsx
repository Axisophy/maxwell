'use client'

// ===========================================
// THE PERMISSIBLE UNIVERSE
// ===========================================
// An interactive mass-radius diagram showing everything
// that can exist in the universe

import React, { useState, useCallback, useMemo } from 'react'
import Breadcrumb from '@/components/ui/Breadcrumb'
import { CosmicObject, ObjectCategory, ViewMode, ModalState, BigQuestion } from './lib/types'
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
import { BIG_QUESTIONS, DARK_MATTER_CANDIDATES, EM_SPECTRUM } from './lib/questions'
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
  const [showTimeView, setShowTimeView] = useState(false)
  const [showDarkMatter, setShowDarkMatter] = useState(false)
  const [showEMSpectrum, setShowEMSpectrum] = useState(false)
  const [expandedQuestion, setExpandedQuestion] = useState<string | null>(null)

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
                  <div className="flex items-center gap-3 text-xs flex-wrap">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={showEpochs}
                        onChange={(e) => setShowEpochs(e.target.checked)}
                        className="w-3 h-3 rounded border-white/30 bg-transparent"
                      />
                      <span className="text-white/60">Epochs</span>
                    </label>
                    {showEpochs && (
                      <div className="flex items-center gap-1 ml-1">
                        <span className={`text-[10px] ${!showTimeView ? 'text-white/80' : 'text-white/40'}`}>Density</span>
                        <button
                          onClick={() => setShowTimeView(!showTimeView)}
                          className={`w-8 h-4 rounded-full transition-colors relative ${showTimeView ? 'bg-blue-500' : 'bg-white/20'}`}
                        >
                          <div className={`w-3 h-3 rounded-full bg-white absolute top-0.5 transition-transform ${showTimeView ? 'left-4' : 'left-0.5'}`} />
                        </button>
                        <span className={`text-[10px] ${showTimeView ? 'text-white/80' : 'text-white/40'}`}>Time</span>
                      </div>
                    )}
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={showDomination}
                        onChange={(e) => setShowDomination(e.target.checked)}
                        className="w-3 h-3 rounded border-white/30 bg-transparent"
                      />
                      <span className="text-white/60">Ω Regions</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={showDarkMatter}
                        onChange={(e) => setShowDarkMatter(e.target.checked)}
                        className="w-3 h-3 rounded border-white/30 bg-transparent"
                      />
                      <span className="text-white/60">Dark Matter</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={showEMSpectrum}
                        onChange={(e) => setShowEMSpectrum(e.target.checked)}
                        className="w-3 h-3 rounded border-white/30 bg-transparent"
                      />
                      <span className="text-white/60">EM Spectrum</span>
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
                  showTimeView={showTimeView}
                  showDarkMatter={showDarkMatter}
                  showEMSpectrum={showEMSpectrum}
                  darkMatterCandidates={DARK_MATTER_CANDIDATES}
                  emSpectrum={EM_SPECTRUM}
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

            {/* Big Questions Panel */}
            <section className="px-4 md:px-8 lg:px-12 py-8">
              <h2 className="text-xl font-light text-white mb-4">The Big Questions</h2>
              <p className="text-white/50 text-sm mb-6 max-w-2xl">
                The Permissible Universe isn't just a map - it's a window into the deepest mysteries of physics.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {BIG_QUESTIONS.map(question => (
                  <button
                    key={question.id}
                    onClick={() => setExpandedQuestion(expandedQuestion === question.id ? null : question.id)}
                    className={`
                      bg-white/5 rounded-xl p-5 text-left
                      hover:bg-white/10 transition-colors
                      border border-white/10
                      ${expandedQuestion === question.id ? 'ring-1 ring-white/30' : ''}
                    `}
                  >
                    <div className="flex items-start gap-3">
                      <span className="text-white/30 font-mono text-sm">{question.number}</span>
                      <div className="flex-1">
                        <h3 className="text-white font-medium mb-2">{question.title}</h3>
                        <p className="text-white/60 text-sm">{question.hook}</p>
                        {expandedQuestion === question.id && (
                          <div className="mt-4 pt-4 border-t border-white/10">
                            <p className="text-white/70 text-sm whitespace-pre-line">{question.content}</p>
                            {question.relatedConcepts.length > 0 && (
                              <div className="mt-4 flex flex-wrap gap-2">
                                {question.relatedConcepts.map(concept => (
                                  <span key={concept} className="text-xs bg-white/10 text-white/60 px-2 py-1 rounded">
                                    {concept}
                                  </span>
                                ))}
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </section>
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
