'use client'

import { useState } from 'react'

// Font candidates - these must be added to Adobe Fonts project toy5zlj
const sansCandidates = [
  { id: 'mr-eaves-xl-modern', label: 'Mr Eaves XL Modern' },
  { id: 'forma-djr-micro', label: 'Forma DJR Micro' },
  { id: 'forma-djr-text', label: 'Forma DJR Text' },
  { id: 'akzidenz-grotesk-next-pro', label: 'Akzidenz Grotesk Next Pro' },
  { id: 'neue-haas-grotesk-display', label: 'Neue Haas Grotesk Display' },
  { id: 'neue-haas-grotesk-text', label: 'Neue Haas Grotesk Text' },
  { id: 'ibm-plex-sans', label: 'IBM Plex Sans' },
  { id: 'polymath-text', label: 'Polymath Text' },
]

const serifCandidates = [
  { id: 'linotype-sabon', label: 'Sabon (Linotype)' },
  { id: 'mrs-eaves', label: 'Mrs Eaves' },
]

const monoCandidates = [
  { id: 'jetbrains-mono', label: 'JetBrains Mono (current)' },
  { id: 'input-mono', label: 'Input Mono' },
]

const displayCandidates = [
  { id: 'sausage', label: 'Sausage' },
]

// Weight specimens
const weights = [
  { value: 200, label: 'Thin (200)' },
  { value: 300, label: 'Light (300)' },
  { value: 400, label: 'Normal (400)' },
  { value: 500, label: 'Medium (500)' },
  { value: 700, label: 'Bold (700)' },
]

export default function DesignTestPage() {
  const [selectedSans, setSelectedSans] = useState(sansCandidates[0].id)
  const [selectedSerif, setSelectedSerif] = useState(serifCandidates[0].id)
  const [selectedMono, setSelectedMono] = useState(monoCandidates[0].id)
  const [selectedDisplay, setSelectedDisplay] = useState(displayCandidates[0].id)

  // Get font family CSS value
  const getMonoFamily = (id: string) => {
    if (id === 'jetbrains-mono') return 'var(--font-jetbrains-mono), monospace'
    return `"${id}", monospace`
  }

  return (
    <div className="min-h-screen">
      {/* Sticky font selector bar */}
      <div className="sticky top-0 z-50 bg-white border-b border-neutral-200 px-8 py-4">
        <div className="flex flex-wrap gap-6 items-center">
          <div className="flex items-center gap-2">
            <label className="text-sm font-medium text-neutral-600">Sans:</label>
            <select
              value={selectedSans}
              onChange={(e) => setSelectedSans(e.target.value)}
              className="text-sm border border-neutral-300 rounded px-2 py-1 bg-white"
            >
              {sansCandidates.map((font) => (
                <option key={font.id} value={font.id}>{font.label}</option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-2">
            <label className="text-sm font-medium text-neutral-600">Serif:</label>
            <select
              value={selectedSerif}
              onChange={(e) => setSelectedSerif(e.target.value)}
              className="text-sm border border-neutral-300 rounded px-2 py-1 bg-white"
            >
              {serifCandidates.map((font) => (
                <option key={font.id} value={font.id}>{font.label}</option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-2">
            <label className="text-sm font-medium text-neutral-600">Mono:</label>
            <select
              value={selectedMono}
              onChange={(e) => setSelectedMono(e.target.value)}
              className="text-sm border border-neutral-300 rounded px-2 py-1 bg-white"
            >
              {monoCandidates.map((font) => (
                <option key={font.id} value={font.id}>{font.label}</option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-2">
            <label className="text-sm font-medium text-neutral-600">Display:</label>
            <select
              value={selectedDisplay}
              onChange={(e) => setSelectedDisplay(e.target.value)}
              className="text-sm border border-neutral-300 rounded px-2 py-1 bg-white"
            >
              {displayCandidates.map((font) => (
                <option key={font.id} value={font.id}>{font.label}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* ========== LIGHT MODE SECTION ========== */}
      <section className="bg-[#f5f5f5] px-8 py-12">
        <h1 
          className="text-3xl font-light tracking-wide mb-2"
          style={{ fontFamily: `"${selectedSans}", system-ui, sans-serif` }}
        >
          Light Mode
        </h1>
        <p className="text-sm text-neutral-500 mb-12 font-mono">
          Shell: #f5f5f5 · Widget: #ffffff · Text: #1a1a1a
        </p>

        {/* PRIMARY SANS */}
        <div className="bg-white rounded-xl p-8 mb-8">
          <h2 className="text-xs font-medium text-neutral-400 uppercase tracking-widest mb-6">
            Primary Sans - {sansCandidates.find(f => f.id === selectedSans)?.label}
          </h2>

          {/* Navigation specimen */}
          <div className="mb-8">
            <p className="text-xs text-neutral-400 mb-2">Navigation (text-2xl, font-light)</p>
            <div 
              className="flex gap-8 text-2xl font-light tracking-wide text-black"
              style={{ fontFamily: `"${selectedSans}", system-ui, sans-serif` }}
            >
              <span className="cursor-pointer">observe</span>
              <span className="cursor-pointer">tools</span>
              <span className="cursor-pointer">data</span>
              <span className="cursor-pointer">knowledge</span>
              <span className="cursor-pointer">play</span>
            </div>
          </div>

          {/* Weight range */}
          <div className="mb-8">
            <p className="text-xs text-neutral-400 mb-3">Weight range</p>
            <div className="space-y-2" style={{ fontFamily: `"${selectedSans}", system-ui, sans-serif` }}>
              {weights.map((w) => (
                <p key={w.value} className="text-xl" style={{ fontWeight: w.value }}>
                  {w.label}: The quick brown fox jumps over the lazy dog
                </p>
              ))}
            </div>
          </div>

          {/* Sizes */}
          <div className="mb-8">
            <p className="text-xs text-neutral-400 mb-3">Size scale</p>
            <div className="space-y-2" style={{ fontFamily: `"${selectedSans}", system-ui, sans-serif` }}>
              <p className="text-4xl font-light">text-4xl - Section Header</p>
              <p className="text-2xl font-light">text-2xl - Navigation Item</p>
              <p className="text-xl font-normal">text-xl - Widget Title</p>
              <p className="text-base font-normal">text-base - Body text at standard size</p>
              <p className="text-sm font-normal">text-sm - Submenu items, labels</p>
              <p className="text-xs font-medium uppercase tracking-widest">text-xs - Category labels</p>
            </div>
          </div>

          {/* Body paragraph */}
          <div>
            <p className="text-xs text-neutral-400 mb-3">Body text (text-base, font-normal)</p>
            <p 
              className="text-base font-normal leading-relaxed max-w-2xl"
              style={{ fontFamily: `"${selectedSans}", system-ui, sans-serif` }}
            >
              MXWLL is a digital laboratory for observing science. We present live data from NASA satellites, 
              seismic monitors, and research institutions - beautifully designed for people who are already 
              curious. This is not science education or science news. This is science, presented properly.
            </p>
          </div>
        </div>

        {/* MONO */}
        <div className="bg-white rounded-xl p-8 mb-8">
          <h2 className="text-xs font-medium text-neutral-400 uppercase tracking-widest mb-6">
            Mono - {monoCandidates.find(f => f.id === selectedMono)?.label}
          </h2>

          {/* Large data display */}
          <div className="mb-8">
            <p className="text-xs text-neutral-400 mb-2">Large data values</p>
            <div 
              className="text-5xl font-normal tabular-nums"
              style={{ fontFamily: getMonoFamily(selectedMono) }}
            >
              42.7°C
            </div>
            <div 
              className="text-5xl font-normal tabular-nums mt-2"
              style={{ fontFamily: getMonoFamily(selectedMono) }}
            >
              1,428,571 km
            </div>
          </div>

          {/* Medium data */}
          <div className="mb-8">
            <p className="text-xs text-neutral-400 mb-2">Widget data values</p>
            <div 
              className="text-2xl tabular-nums space-y-1"
              style={{ fontFamily: getMonoFamily(selectedMono) }}
            >
              <p>Magnitude: <span className="font-medium">6.4</span></p>
              <p>Depth: <span className="font-medium">10.2 km</span></p>
              <p>Lat: <span className="font-medium">35.6762°N</span></p>
              <p>Long: <span className="font-medium">139.6503°E</span></p>
            </div>
          </div>

          {/* Timestamps */}
          <div className="mb-8">
            <p className="text-xs text-neutral-400 mb-2">Timestamps</p>
            <div 
              className="text-sm tabular-nums space-y-1"
              style={{ fontFamily: getMonoFamily(selectedMono) }}
            >
              <p>2024-12-07 14:32:08 UTC</p>
              <p>Last updated: 3 seconds ago</p>
              <p>Next refresh: 00:00:57</p>
            </div>
          </div>

          {/* Mixed text + data */}
          <div>
            <p className="text-xs text-neutral-400 mb-2">Sans + Mono together</p>
            <p 
              className="text-base"
              style={{ fontFamily: `"${selectedSans}", system-ui, sans-serif` }}
            >
              The earthquake measured{' '}
              <span 
                className="font-medium"
                style={{ fontFamily: getMonoFamily(selectedMono) }}
              >
                6.4
              </span>
              {' '}on the Richter scale at a depth of{' '}
              <span 
                className="font-medium"
                style={{ fontFamily: getMonoFamily(selectedMono) }}
              >
                10.2 km
              </span>
              , occurring at{' '}
              <span 
                style={{ fontFamily: getMonoFamily(selectedMono) }}
              >
                14:32 UTC
              </span>
              .
            </p>
          </div>
        </div>

        {/* SERIF */}
        <div className="bg-white rounded-xl p-8 mb-8">
          <h2 className="text-xs font-medium text-neutral-400 uppercase tracking-widest mb-6">
            Serif - {serifCandidates.find(f => f.id === selectedSerif)?.label}
          </h2>

          {/* Long-form reading */}
          <div className="mb-8">
            <p className="text-xs text-neutral-400 mb-3">Long-form reading (KNOWLEDGE section)</p>
            <div 
              className="max-w-2xl space-y-4 text-lg leading-relaxed"
              style={{ fontFamily: `"${selectedSerif}", Georgia, serif` }}
            >
              <p>
                The works of Nature are the works of God, and every one of them 
                may with propriety be denominated his work, and is an expression 
                of his will.
              </p>
              <p>
                But we give the name of Nature more especially to that general 
                course of his operation, by which he produces, sustains, and 
                governs all creatures; and particularly to that constitution of 
                things which he has established, that succession of changes which 
                he has appointed.
              </p>
            </div>
          </div>

          {/* Pull quote */}
          <div className="mb-8">
            <p className="text-xs text-neutral-400 mb-3">Pull quote</p>
            <blockquote 
              className="text-2xl italic leading-relaxed border-l-2 border-neutral-300 pl-6 max-w-2xl"
              style={{ fontFamily: `"${selectedSerif}", Georgia, serif` }}
            >
              "Nothing in life is to be feared, it is only to be understood. 
              Now is the time to understand more, so that we may fear less."
            </blockquote>
            <p 
              className="mt-2 text-sm text-neutral-500 pl-6"
              style={{ fontFamily: `"${selectedSans}", system-ui, sans-serif` }}
            >
              - Marie Curie
            </p>
          </div>

          {/* Different sizes */}
          <div>
            <p className="text-xs text-neutral-400 mb-3">Size scale</p>
            <div 
              className="space-y-2"
              style={{ fontFamily: `"${selectedSerif}", Georgia, serif` }}
            >
              <p className="text-3xl">text-3xl - Chapter heading</p>
              <p className="text-xl">text-xl - Section title</p>
              <p className="text-lg">text-lg - Body text (reading)</p>
              <p className="text-base">text-base - Standard body</p>
              <p className="text-sm italic">text-sm italic - Captions, notes</p>
            </div>
          </div>
        </div>

        {/* DISPLAY */}
        <div className="bg-white rounded-xl p-8 mb-8">
          <h2 className="text-xs font-medium text-neutral-400 uppercase tracking-widest mb-6">
            Display - {displayCandidates.find(f => f.id === selectedDisplay)?.label}
          </h2>

          <div className="space-y-6">
            <div>
              <p className="text-xs text-neutral-400 mb-2">Playful header</p>
              <p 
                className="text-5xl"
                style={{ fontFamily: `"${selectedDisplay}", cursive` }}
              >
                Strange Attractors
              </p>
            </div>

            <div>
              <p className="text-xs text-neutral-400 mb-2">Section callout</p>
              <p 
                className="text-3xl"
                style={{ fontFamily: `"${selectedDisplay}", cursive` }}
              >
                Explore the Chaos
              </p>
            </div>

            <div>
              <p className="text-xs text-neutral-400 mb-2">Badge / label</p>
              <span 
                className="inline-block text-xl px-4 py-1 bg-neutral-100 rounded-full"
                style={{ fontFamily: `"${selectedDisplay}", cursive` }}
              >
                New Widget
              </span>
            </div>
          </div>
        </div>

        {/* TRADE GOTHIC (Book Covers) */}
        <div className="bg-white rounded-xl p-8 mb-8">
          <h2 className="text-xs font-medium text-neutral-400 uppercase tracking-widest mb-6">
            Trade Gothic - Book Covers (decided)
          </h2>

          <div className="flex gap-8">
            {/* Book cover mockup 1 */}
            <div className="w-48 h-72 bg-neutral-900 rounded-lg p-6 flex flex-col justify-between text-white">
              <div>
                <p 
                  className="text-xs uppercase tracking-widest text-neutral-400"
                  style={{ fontFamily: '"trade-gothic-next", sans-serif' }}
                >
                  Elements
                </p>
              </div>
              <div>
                <p 
                  className="text-2xl font-bold leading-tight"
                  style={{ fontFamily: '"trade-gothic-next-compressed", sans-serif' }}
                >
                  EUCLID
                </p>
                <p 
                  className="text-sm mt-1 text-neutral-400"
                  style={{ fontFamily: '"trade-gothic-next", sans-serif' }}
                >
                  c. 300 BCE
                </p>
              </div>
            </div>

            {/* Book cover mockup 2 */}
            <div className="w-48 h-72 bg-amber-100 rounded-lg p-6 flex flex-col justify-between text-neutral-900">
              <div>
                <p 
                  className="text-xs uppercase tracking-widest text-amber-700"
                  style={{ fontFamily: '"trade-gothic-next", sans-serif' }}
                >
                  Natural Philosophy
                </p>
              </div>
              <div>
                <p 
                  className="text-2xl font-bold leading-tight"
                  style={{ fontFamily: '"trade-gothic-next-compressed", sans-serif' }}
                >
                  ON THE ORIGIN OF SPECIES
                </p>
                <p 
                  className="text-sm mt-1"
                  style={{ fontFamily: '"trade-gothic-next", sans-serif' }}
                >
                  Charles Darwin
                </p>
                <p 
                  className="text-xs mt-0.5 text-amber-700"
                  style={{ fontFamily: '"trade-gothic-next", sans-serif' }}
                >
                  1859
                </p>
              </div>
            </div>

            {/* Book cover mockup 3 */}
            <div className="w-48 h-72 bg-blue-900 rounded-lg p-6 flex flex-col justify-between text-white">
              <div>
                <p 
                  className="text-xs uppercase tracking-widest text-blue-300"
                  style={{ fontFamily: '"trade-gothic-next", sans-serif' }}
                >
                  Physics
                </p>
              </div>
              <div>
                <p 
                  className="text-2xl font-bold leading-tight"
                  style={{ fontFamily: '"trade-gothic-next-compressed", sans-serif' }}
                >
                  PRINCIPIA
                </p>
                <p 
                  className="text-sm mt-1 text-blue-200"
                  style={{ fontFamily: '"trade-gothic-next", sans-serif' }}
                >
                  Isaac Newton
                </p>
                <p 
                  className="text-xs mt-0.5 text-blue-400"
                  style={{ fontFamily: '"trade-gothic-next", sans-serif' }}
                >
                  1687
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* COMBINATIONS */}
        <div className="bg-white rounded-xl p-8">
          <h2 className="text-xs font-medium text-neutral-400 uppercase tracking-widest mb-6">
            Combinations - All fonts together
          </h2>

          {/* Widget-style card */}
          <div className="border border-neutral-200 rounded-xl overflow-hidden max-w-md mb-8">
            <div className="px-4 py-3 border-b border-neutral-200 flex items-center justify-between">
              <h3 
                className="text-lg font-medium"
                style={{ fontFamily: `"${selectedSans}", system-ui, sans-serif` }}
              >
                Solar Activity
              </h3>
              <span className="text-xs font-medium text-green-600 flex items-center gap-1">
                <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
                LIVE
              </span>
            </div>
            <div className="p-4 bg-neutral-50">
              <div className="text-center py-8">
                <p 
                  className="text-5xl tabular-nums"
                  style={{ fontFamily: getMonoFamily(selectedMono) }}
                >
                  171 Å
                </p>
                <p 
                  className="text-sm text-neutral-500 mt-2"
                  style={{ fontFamily: `"${selectedSans}", system-ui, sans-serif` }}
                >
                  Extreme Ultraviolet
                </p>
              </div>
            </div>
            <div className="px-4 py-2 text-xs text-neutral-400 border-t border-neutral-200">
              <span style={{ fontFamily: getMonoFamily(selectedMono) }}>
                Updated: 14:32:08 UTC
              </span>
            </div>
          </div>

          {/* Knowledge-style section */}
          <div className="max-w-2xl">
            <p 
              className="text-xs uppercase tracking-widest text-neutral-400 mb-2"
              style={{ fontFamily: `"${selectedSans}", system-ui, sans-serif` }}
            >
              From the Library
            </p>
            <h3 
              className="text-2xl mb-4"
              style={{ fontFamily: `"${selectedSerif}", Georgia, serif` }}
            >
              On the Shoulders of Giants
            </h3>
            <p 
              className="text-lg leading-relaxed text-neutral-700 mb-4"
              style={{ fontFamily: `"${selectedSerif}", Georgia, serif` }}
            >
              If I have seen further it is by standing on the shoulders of Giants. 
              In this letter to Robert Hooke, Newton acknowledged the cumulative 
              nature of scientific progress.
            </p>
            <p 
              className="text-sm text-neutral-500"
              style={{ fontFamily: `"${selectedSans}", system-ui, sans-serif` }}
            >
              From <span className="font-medium">Principia Mathematica</span> · Isaac Newton · 
              <span style={{ fontFamily: getMonoFamily(selectedMono) }}> 1687</span>
            </p>
          </div>
        </div>
      </section>

      {/* ========== DARK MODE SECTION ========== */}
      <section className="bg-[#0a0a0f] px-8 py-12 text-white">
        <h1 
          className="text-3xl font-light tracking-wide mb-2"
          style={{ fontFamily: `"${selectedSans}", system-ui, sans-serif` }}
        >
          Dark Mode
        </h1>
        <p className="text-sm text-neutral-500 mb-12 font-mono">
          Shell: #0a0a0f · Widget: #141419 · Text: #ffffff
        </p>

        {/* PRIMARY SANS - Dark */}
        <div className="bg-[#141419] rounded-xl p-8 mb-8">
          <h2 className="text-xs font-medium text-neutral-500 uppercase tracking-widest mb-6">
            Primary Sans - {sansCandidates.find(f => f.id === selectedSans)?.label}
          </h2>

          {/* Navigation specimen */}
          <div className="mb-8">
            <p className="text-xs text-neutral-500 mb-2">Navigation</p>
            <div 
              className="flex gap-8 text-2xl font-light tracking-wide"
              style={{ fontFamily: `"${selectedSans}", system-ui, sans-serif` }}
            >
              <span className="cursor-pointer">observe</span>
              <span className="cursor-pointer">tools</span>
              <span className="cursor-pointer">data</span>
              <span className="cursor-pointer">knowledge</span>
              <span className="cursor-pointer">play</span>
            </div>
          </div>

          {/* Weight range */}
          <div className="mb-8">
            <p className="text-xs text-neutral-500 mb-3">Weight range</p>
            <div className="space-y-2" style={{ fontFamily: `"${selectedSans}", system-ui, sans-serif` }}>
              {weights.map((w) => (
                <p key={w.value} className="text-xl" style={{ fontWeight: w.value }}>
                  {w.label}: The quick brown fox jumps over the lazy dog
                </p>
              ))}
            </div>
          </div>

          {/* Body paragraph */}
          <div>
            <p className="text-xs text-neutral-500 mb-3">Body text</p>
            <p 
              className="text-base font-normal leading-relaxed max-w-2xl text-neutral-200"
              style={{ fontFamily: `"${selectedSans}", system-ui, sans-serif` }}
            >
              MXWLL is a digital laboratory for observing science. We present live data from NASA satellites, 
              seismic monitors, and research institutions - beautifully designed for people who are already 
              curious. This is not science education or science news. This is science, presented properly.
            </p>
          </div>
        </div>

        {/* MONO - Dark */}
        <div className="bg-[#141419] rounded-xl p-8 mb-8">
          <h2 className="text-xs font-medium text-neutral-500 uppercase tracking-widest mb-6">
            Mono - {monoCandidates.find(f => f.id === selectedMono)?.label}
          </h2>

          {/* Large data display */}
          <div className="mb-8">
            <p className="text-xs text-neutral-500 mb-2">Large data values</p>
            <div 
              className="text-5xl font-normal tabular-nums text-[#00d4ff]"
              style={{ fontFamily: getMonoFamily(selectedMono) }}
            >
              42.7°C
            </div>
            <div 
              className="text-5xl font-normal tabular-nums mt-2 text-[#ffb700]"
              style={{ fontFamily: getMonoFamily(selectedMono) }}
            >
              1,428,571 km
            </div>
          </div>

          {/* Timestamps */}
          <div>
            <p className="text-xs text-neutral-500 mb-2">Timestamps</p>
            <div 
              className="text-sm tabular-nums space-y-1 text-neutral-400"
              style={{ fontFamily: getMonoFamily(selectedMono) }}
            >
              <p>2024-12-07 14:32:08 UTC</p>
              <p>Last updated: 3 seconds ago</p>
              <p>Next refresh: 00:00:57</p>
            </div>
          </div>
        </div>

        {/* SERIF - Dark */}
        <div className="bg-[#141419] rounded-xl p-8 mb-8">
          <h2 className="text-xs font-medium text-neutral-500 uppercase tracking-widest mb-6">
            Serif - {serifCandidates.find(f => f.id === selectedSerif)?.label}
          </h2>

          <div 
            className="max-w-2xl space-y-4 text-lg leading-relaxed text-neutral-200"
            style={{ fontFamily: `"${selectedSerif}", Georgia, serif` }}
          >
            <p>
              The works of Nature are the works of God, and every one of them 
              may with propriety be denominated his work, and is an expression 
              of his will.
            </p>
            <p>
              But we give the name of Nature more especially to that general 
              course of his operation, by which he produces, sustains, and 
              governs all creatures.
            </p>
          </div>
        </div>

        {/* Widget combo - Dark */}
        <div className="bg-[#141419] rounded-xl p-8">
          <h2 className="text-xs font-medium text-neutral-500 uppercase tracking-widest mb-6">
            Combinations - Widget example
          </h2>

          <div className="border border-neutral-800 rounded-xl overflow-hidden max-w-md">
            <div className="px-4 py-3 border-b border-neutral-800 flex items-center justify-between">
              <h3 
                className="text-lg font-medium"
                style={{ fontFamily: `"${selectedSans}", system-ui, sans-serif` }}
              >
                Earthquake Monitor
              </h3>
              <span className="text-xs font-medium text-green-400 flex items-center gap-1">
                <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse" />
                LIVE
              </span>
            </div>
            <div className="p-4">
              <div className="text-center py-8">
                <p 
                  className="text-6xl tabular-nums text-red-400"
                  style={{ fontFamily: getMonoFamily(selectedMono) }}
                >
                  6.4
                </p>
                <p 
                  className="text-sm text-neutral-400 mt-2"
                  style={{ fontFamily: `"${selectedSans}", system-ui, sans-serif` }}
                >
                  Magnitude · Pacific Ring of Fire
                </p>
              </div>
            </div>
            <div className="px-4 py-2 text-xs text-neutral-500 border-t border-neutral-800">
              <span style={{ fontFamily: getMonoFamily(selectedMono) }}>
                Depth: 10.2 km · 35.68°N, 139.65°E
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Footer note */}
      <section className="bg-neutral-100 px-8 py-8 text-center">
        <p className="text-sm text-neutral-500">
          Add all fonts to Adobe Fonts project <code className="bg-neutral-200 px-1 rounded">toy5zlj</code> for this page to work correctly.
        </p>
        <p className="text-xs text-neutral-400 mt-2">
          Trade Gothic requires: trade-gothic-next, trade-gothic-next-compressed
        </p>
      </section>
    </div>
  )
}