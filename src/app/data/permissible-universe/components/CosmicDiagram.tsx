'use client'

import React, { useRef, useEffect, useState, useCallback } from 'react'
import * as d3 from 'd3'
import { CosmicObject, Boundary } from '../lib/types'
import { CATEGORIES, formatSuperscript } from '../lib/constants'
import { EPOCH_LIST, DOMINATION_LIST } from '../lib/epochs'

interface Props {
  objects: CosmicObject[]
  boundaries: Boundary[]
  showEpochs: boolean
  showDomination: boolean
  onObjectClick: (id: string) => void
  onObjectHover: (id: string | null) => void
  onBoundaryClick: (id: string) => void
  initialView: { center: { logR: number; logM: number }; zoom: number }
}

export function CosmicDiagram({
  objects,
  boundaries,
  showEpochs,
  showDomination,
  onObjectClick,
  onObjectHover,
  onBoundaryClick,
}: Props) {
  const containerRef = useRef<HTMLDivElement>(null)
  const svgRef = useRef<SVGSVGElement>(null)
  const zoomScaleRef = useRef(1)
  const [dimensions, setDimensions] = useState({ width: 800, height: 600 })
  const [tooltip, setTooltip] = useState<{
    visible: boolean
    x: number
    y: number
    object: CosmicObject | null
  }>({ visible: false, x: 0, y: 0, object: null })

  useEffect(() => {
    const updateDimensions = () => {
      if (containerRef.current) {
        setDimensions({
          width: containerRef.current.clientWidth,
          height: containerRef.current.clientHeight,
        })
      }
    }
    updateDimensions()
    window.addEventListener('resize', updateDimensions)
    return () => window.removeEventListener('resize', updateDimensions)
  }, [])

  useEffect(() => {
    if (!svgRef.current || dimensions.width === 0) return

    const svg = d3.select(svgRef.current)
    svg.selectAll('*').remove()

    const margin = { top: 50, right: 80, bottom: 60, left: 80 }
    const width = dimensions.width - margin.left - margin.right
    const height = dimensions.height - margin.top - margin.bottom

    const xScale = d3.scaleLinear().domain([-45, 65]).range([0, width])
    const yScale = d3.scaleLinear().domain([-40, 35]).range([height, 0])

    const g = svg.append('g').attr('transform', `translate(${margin.left},${margin.top})`)

    svg.append('defs').append('clipPath').attr('id', 'chart-clip')
      .append('rect').attr('width', width).attr('height', height)

    const chartArea = g.append('g').attr('clip-path', 'url(#chart-clip)')
    const gridGroup = chartArea.append('g').attr('class', 'grid')

    for (let m = -40; m <= 60; m += 10) {
      gridGroup.append('line')
        .attr('x1', xScale(m)).attr('x2', xScale(m))
        .attr('y1', 0).attr('y2', height)
        .attr('stroke', 'white')
        .attr('stroke-opacity', m % 20 === 0 ? 0.15 : 0.05)
    }

    for (let r = -40; r <= 30; r += 10) {
      gridGroup.append('line')
        .attr('x1', 0).attr('x2', width)
        .attr('y1', yScale(r)).attr('y2', yScale(r))
        .attr('stroke', 'white')
        .attr('stroke-opacity', r % 20 === 0 ? 0.15 : 0.05)
    }

    if (showDomination) {
      const domGroup = chartArea.append('g').attr('class', 'domination')
      for (const era of DOMINATION_LIST) {
        const points = era.region.map(([logR, logM]) => [xScale(logM), yScale(logR)] as [number, number])
        domGroup.append('polygon')
          .attr('points', points.map(p => p.join(',')).join(' '))
          .attr('fill', era.color)
          .attr('stroke', 'none')
      }
    }

    const boundaryGroup = chartArea.append('g').attr('class', 'boundaries')

    for (const boundary of boundaries) {
      if (boundary.lineType === 'schwarzschild') {
        const x1 = xScale(-45)
        const y1 = yScale(-45 + (boundary.intercept ?? 0))
        const x2 = xScale(65)
        const y2 = yScale(65 + (boundary.intercept ?? 0))
        // Fill from line to top of chart - clipPath handles overflow
        const polygon = [[x1, y1], [x2, y2], [x2, 0], [x1, 0]]
        boundaryGroup.append('polygon')
          .attr('points', polygon.map(p => p.join(',')).join(' '))
          .attr('fill', boundary.fillColor)
        boundaryGroup.append('line')
          .attr('x1', x1).attr('y1', y1).attr('x2', x2).attr('y2', y2)
          .attr('stroke', boundary.color).attr('stroke-width', 2)
          .style('cursor', 'pointer').on('click', () => onBoundaryClick(boundary.id))
        boundaryGroup.append('text')
          .attr('x', xScale(45)).attr('y', yScale(45 + (boundary.intercept ?? 0)) - 8)
          .attr('fill', boundary.color).attr('font-size', '10px').attr('font-family', 'monospace')
          .text('SCHWARZSCHILD LIMIT').style('cursor', 'pointer').on('click', () => onBoundaryClick(boundary.id))
      }

      if (boundary.lineType === 'compton') {
        const x1 = xScale(-45)
        const y1 = yScale(45 + (boundary.intercept ?? 0))
        const x2 = xScale(65)
        const y2 = yScale(-65 + (boundary.intercept ?? 0))
        // Fill from line to bottom of chart - clipPath handles overflow
        const polygon = [[x1, y1], [x2, y2], [x2, height], [x1, height]]
        boundaryGroup.append('polygon')
          .attr('points', polygon.map(p => p.join(',')).join(' '))
          .attr('fill', boundary.fillColor)
        boundaryGroup.append('line')
          .attr('x1', x1).attr('y1', y1).attr('x2', x2).attr('y2', y2)
          .attr('stroke', boundary.color).attr('stroke-width', 2)
          .style('cursor', 'pointer').on('click', () => onBoundaryClick(boundary.id))
        boundaryGroup.append('text')
          .attr('x', xScale(-30)).attr('y', yScale(30 + (boundary.intercept ?? 0)) + 15)
          .attr('fill', boundary.color).attr('font-size', '10px').attr('font-family', 'monospace')
          .text('COMPTON LIMIT').style('cursor', 'pointer').on('click', () => onBoundaryClick(boundary.id))
      }

      if (boundary.lineType === 'planck-vertical') {
        const x = xScale(-5)
        boundaryGroup.append('line')
          .attr('x1', x).attr('x2', x).attr('y1', 0).attr('y2', height)
          .attr('stroke', boundary.color).attr('stroke-width', 1)
          .attr('stroke-dasharray', '4,4').attr('opacity', 0.6)
      }

      if (boundary.lineType === 'hubble-horizontal') {
        const y = yScale(28)
        boundaryGroup.append('line')
          .attr('x1', 0).attr('x2', width).attr('y1', y).attr('y2', y)
          .attr('stroke', boundary.color).attr('stroke-width', 1)
          .attr('stroke-dasharray', '8,4').attr('opacity', 0.6)
        boundaryGroup.append('text')
          .attr('x', width - 10).attr('y', y - 5)
          .attr('fill', boundary.color).attr('font-size', '10px')
          .attr('font-family', 'monospace').attr('text-anchor', 'end')
          .text('HUBBLE RADIUS')
      }
    }

    if (showEpochs) {
      const epochGroup = chartArea.append('g').attr('class', 'epochs')
      for (const epoch of EPOCH_LIST) {
        const y = yScale(epoch.logRadiusIntercept)
        epochGroup.append('line')
          .attr('x1', 0).attr('x2', width).attr('y1', y).attr('y2', y)
          .attr('stroke', epoch.color).attr('stroke-width', 1)
          .attr('stroke-dasharray', '2,4').attr('opacity', 0.4)
        epochGroup.append('text')
          .attr('x', 5).attr('y', y - 3)
          .attr('fill', epoch.color).attr('font-size', '9px').attr('opacity', 0.7)
          .text(epoch.shortName)
      }
    }

    const objectsGroup = chartArea.append('g').attr('class', 'objects')

    // Handle overlapping objects
    const OVERLAP_OFFSETS: Record<string, { x: number; y: number }> = {
      'proton': { x: -8, y: -8 },
      'neutron': { x: 8, y: 8 },
    }

    // Uniform dot size for all objects
    const DOT_RADIUS = 5

    for (const obj of objects) {
      const offset = OVERLAP_OFFSETS[obj.id] || { x: 0, y: 0 }
      const x = xScale(obj.logMass) + offset.x
      const y = yScale(obj.logRadius) + offset.y
      const color = CATEGORIES[obj.category].color

      if (x < -20 || x > width + 20 || y < -20 || y > height + 20) continue

      const group = objectsGroup.append('g')
        .attr('class', 'object-group')
        .attr('data-id', obj.id)
        .attr('transform', `translate(${x},${y})`)
        .style('cursor', 'pointer')
        .on('click', function() {
          // Reset dot size before opening modal
          d3.select(this).select('.dot')
            .transition()
            .duration(100)
            .attr('r', DOT_RADIUS / zoomScaleRef.current)
          onObjectClick(obj.id)
        })
        .on('mouseenter', (event) => {
          onObjectHover(obj.id)
          setTooltip({ visible: true, x: event.pageX, y: event.pageY, object: obj })
        })
        .on('mouseleave', () => {
          onObjectHover(null)
          setTooltip(prev => ({ ...prev, visible: false }))
        })

      // Single uniform dot for all objects
      group.append('circle')
        .attr('class', 'dot')
        .attr('r', DOT_RADIUS)
        .attr('fill', color)
        .attr('stroke', 'white')
        .attr('stroke-width', 0.5)
        .attr('stroke-opacity', 0.5)

      // Hover effect - subtle glow (adjusted for zoom level)
      group.on('mouseenter.glow', function() {
        d3.select(this).select('.dot')
          .transition()
          .duration(100)
          .attr('r', (DOT_RADIUS + 2) / zoomScaleRef.current)
      })
      .on('mouseleave.glow', function() {
        d3.select(this).select('.dot')
          .transition()
          .duration(100)
          .attr('r', DOT_RADIUS / zoomScaleRef.current)
      })
    }

    const xAxis = d3.axisBottom(xScale)
      .tickValues([-40, -30, -20, -10, 0, 10, 20, 30, 40, 50, 60])
      .tickFormat(d => `10${formatSuperscript(d as number)}`)

    g.append('g').attr('transform', `translate(0,${height})`).call(xAxis).attr('color', 'white').attr('opacity', 0.6)
    g.append('text').attr('x', width / 2).attr('y', height + 45)
      .attr('fill', 'white').attr('text-anchor', 'middle').attr('font-size', '12px').attr('opacity', 0.8)
      .text('Mass (grams)')

    const yAxis = d3.axisLeft(yScale)
      .tickValues([-30, -20, -10, 0, 10, 20, 30])
      .tickFormat(d => `10${formatSuperscript(d as number)}`)

    g.append('g').call(yAxis).attr('color', 'white').attr('opacity', 0.6)
    g.append('text').attr('transform', 'rotate(-90)').attr('x', -height / 2).attr('y', -55)
      .attr('fill', 'white').attr('text-anchor', 'middle').attr('font-size', '12px').attr('opacity', 0.8)
      .text('Radius (cm)')

    // Touch device detection - require two-finger gesture
    const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0

    const zoom = d3.zoom<SVGSVGElement, unknown>()
      .scaleExtent([1, 20])
      .translateExtent([[0, 0], [width, height]])
      .filter((event) => {
        // For touch events, require two fingers to prevent page scroll hijacking
        if (event.type === 'touchstart' || event.type === 'touchmove') {
          return event.touches?.length >= 2
        }
        // Allow all mouse events
        return true
      })
      .on('zoom', (event) => {
        const { transform } = event
        const k = transform.k
        zoomScaleRef.current = k  // Track current scale

        chartArea.attr('transform', transform)

        // Inverse scale for dots to keep them constant screen size
        objectsGroup.selectAll('.object-group').each(function() {
          const group = d3.select(this)

          group.selectAll('.dot')
            .attr('r', DOT_RADIUS / k)
            .attr('stroke-width', 0.5 / k)
        })

        boundaryGroup.selectAll('text')
          .attr('font-size', `${10 / k}px`)

        if (showEpochs) {
          chartArea.selectAll('.epochs text')
            .attr('font-size', `${9 / k}px`)
        }
      })
    svg.call(zoom)

  }, [dimensions, objects, boundaries, showEpochs, showDomination, onObjectClick, onObjectHover, onBoundaryClick])

  return (
    <div ref={containerRef} className="w-full h-full relative">
      <svg ref={svgRef} width={dimensions.width} height={dimensions.height} className="bg-[#0a0a0f]" />
      {tooltip.visible && tooltip.object && (
        <div
          className="fixed z-50 pointer-events-none bg-black/90 backdrop-blur-sm rounded-lg p-3 max-w-xs border border-white/20"
          style={{ left: tooltip.x + 15, top: tooltip.y - 10 }}
        >
          <div className="flex items-center gap-2 mb-1">
            <div className="w-2 h-2 rounded-full" style={{ backgroundColor: CATEGORIES[tooltip.object.category].color }} />
            <span className="font-medium text-sm">{tooltip.object.name}</span>
          </div>
          <p className="text-xs text-white/60 mb-2">{tooltip.object.tagline}</p>
          <div className="flex gap-4 text-xs font-mono text-white/50">
            <span>R: {tooltip.object.radius.formatted}</span>
            <span>M: {tooltip.object.mass.formatted}</span>
          </div>
        </div>
      )}
    </div>
  )
}
