'use client'

import React from 'react'
import { ChevronRight } from 'lucide-react'
import { Boundary } from '../lib/types'
import { BOUNDARY_COLORS } from '../lib/constants'

interface Props {
  boundaries: Boundary[]
  onBoundaryClick: (id: string) => void
}

const BOUNDARY_ICONS: Record<string, string> = {
  schwarzschild: '⚫',
  compton: '〰️',
  planck: '⚛️',
  hubble: '🌌',
}

const BOUNDARY_SUBTITLES: Record<string, string> = {
  schwarzschild: 'The Black Hole Limit',
  compton: 'The Quantum Limit',
  planck: 'The Resolution of Reality',
  hubble: 'The Edge of the Observable',
}

export function LimitsView({ boundaries, onBoundaryClick }: Props) {
  return (
    <div className="px-4 md:px-8 lg:px-12 py-8 md:py-12">
      <div className="max-w-3xl mb-12">
        <h2 className="text-2xl md:text-3xl font-light mb-4">The Four Limits</h2>
        <p className="text-white/60 leading-relaxed">
          The universe permits only certain combinations of mass and size. 
          These four boundaries carve out the "permissible" zone where matter, 
          energy, and structure can exist. Beyond them lie the forbidden regions — 
          where the laws of physics say "nothing here."
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {boundaries.map((boundary) => {
          const colors = BOUNDARY_COLORS[boundary.id as keyof typeof BOUNDARY_COLORS]
          return (
            <button
              key={boundary.id}
              onClick={() => onBoundaryClick(boundary.id)}
              className="group text-left bg-white/5 hover:bg-white/8 border border-white/10 hover:border-white/20 rounded-xl p-6 transition-all"
            >
              <div className="flex items-start justify-between mb-4">
                <div>
                  <div className="flex items-center gap-3 mb-1">
                    <span className="text-2xl">{BOUNDARY_ICONS[boundary.id]}</span>
                    <h3 className="text-xl font-medium text-white">{boundary.name}</h3>
                  </div>
                  <p className="text-sm text-white/50">{BOUNDARY_SUBTITLES[boundary.id]}</p>
                </div>
                <ChevronRight className="w-5 h-5 text-white/30 group-hover:text-white/60 transition-colors" />
              </div>

              <div 
                className="inline-block font-mono text-sm px-3 py-1.5 rounded-lg mb-4"
                style={{ backgroundColor: colors?.fill || 'rgba(255,255,255,0.1)', color: colors?.line || 'white' }}
              >
                {boundary.equation}
              </div>

              <p className="text-white/60 text-sm leading-relaxed mb-4">{boundary.explanations.accessible}</p>

              <div className="flex items-center gap-2 text-xs">
                <span className="text-white/40">Forbids:</span>
                <span 
                  className="px-2 py-0.5 rounded"
                  style={{ backgroundColor: colors?.fill || 'rgba(255,255,255,0.1)', color: colors?.line || 'white' }}
                >
                  {boundary.forbiddenSide === 'above' && 'Region above the line'}
                  {boundary.forbiddenSide === 'below' && 'Region below the line'}
                  {boundary.forbiddenSide === 'left' && 'Region to the left'}
                  {boundary.forbiddenSide === 'right' && 'Region to the right'}
                </span>
              </div>
            </button>
          )
        })}
      </div>

      <div className="mt-12 bg-gradient-to-br from-white/5 to-transparent border border-white/10 rounded-xl p-6 md:p-8">
        <h3 className="text-xl font-medium mb-4">Where They Meet</h3>
        <p className="text-white/60 leading-relaxed mb-6">
          The Schwarzschild and Compton lines intersect at a single point: the 
          <span className="text-white font-medium"> Planck mass</span> (~22 micrograms, 
          10<sup>-5</sup> grams). This is the only mass where an object could be 
          simultaneously a black hole and a quantum particle. It marks the boundary 
          where general relativity and quantum mechanics must somehow merge — the 
          domain of quantum gravity, still not fully understood.
        </p>
        <div className="flex flex-wrap gap-3">
          <div className="bg-white/5 rounded-lg px-4 py-2">
            <div className="text-xs text-white/40 uppercase tracking-wider">Planck Mass</div>
            <div className="font-mono text-white">2.18 × 10⁻⁵ g</div>
          </div>
          <div className="bg-white/5 rounded-lg px-4 py-2">
            <div className="text-xs text-white/40 uppercase tracking-wider">Planck Length</div>
            <div className="font-mono text-white">1.62 × 10⁻³³ cm</div>
          </div>
          <div className="bg-white/5 rounded-lg px-4 py-2">
            <div className="text-xs text-white/40 uppercase tracking-wider">Planck Time</div>
            <div className="font-mono text-white">5.39 × 10⁻⁴⁴ s</div>
          </div>
        </div>
      </div>

      <div className="mt-8 grid md:grid-cols-3 gap-6">
        <div className="bg-white/5 rounded-xl p-5">
          <h4 className="font-medium mb-2">No Arbitrary Sizes</h4>
          <p className="text-sm text-white/60">
            You can't make a stable object of any mass at any size. 
            A grain of sand compressed to Planck length would become a black hole. 
            An electron expanded to a meter would violate quantum mechanics.
          </p>
        </div>
        <div className="bg-white/5 rounded-xl p-5">
          <h4 className="font-medium mb-2">Fine-Tuned Universe</h4>
          <p className="text-sm text-white/60">
            The fundamental constants (G, ℏ, c) set these boundaries. 
            Different constants would give different limits — and possibly 
            no "permissible" zone where complexity can exist.
          </p>
        </div>
        <div className="bg-white/5 rounded-xl p-5">
          <h4 className="font-medium mb-2">We Live in the Middle</h4>
          <p className="text-sm text-white/60">
            Humans, planets, and stars occupy a comfortable middle ground. 
            Not so small we're quantum fuzzy. Not so dense we collapse. 
            Not so large we exceed the cosmic horizon.
          </p>
        </div>
      </div>
    </div>
  )
}
