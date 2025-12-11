'use client'

import { useRef, useEffect, useState, useMemo, useCallback } from 'react'
import * as d3 from 'd3'
import { DataPoint } from '../../lib/types'
import { DATASETS, getDatasetColor, formatValue } from '../../lib/datasets'

// ===========================================
// CLIMATE CHART - D3 MULTI-AXIS CHART
// ===========================================

interface ChartDataset {
  id: string
  data: DataPoint[]
  color: string
  yAxisSide: 'left' | 'right'
}

interface ClimateChartProps {
  datasets: ChartDataset[]
  height?: number
  showGrid?: boolean
  animate?: boolean
}

// Chart margins - generous for multi-axis
const MARGIN = { top: 32, right: 80, bottom: 48, left: 80 }

export default function ClimateChart({
  datasets,
  height = 400,
  showGrid = true,
  animate = true,
}: ClimateChartProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const svgRef = useRef<SVGSVGElement>(null)
  const zoomRef = useRef<d3.ZoomBehavior<SVGSVGElement, unknown> | null>(null)
  const [dimensions, setDimensions] = useState({ width: 800, height })
  const [hoveredYear, setHoveredYear] = useState<number | null>(null)
  const [zoomTransform, setZoomTransform] = useState<d3.ZoomTransform>(d3.zoomIdentity)

  // Calculate chart dimensions
  const chartWidth = dimensions.width - MARGIN.left - MARGIN.right
  const chartHeight = dimensions.height - MARGIN.top - MARGIN.bottom

  // Determine X domain from all data
  const fullXDomain = useMemo(() => {
    let minYear = Infinity
    let maxYear = -Infinity
    
    datasets.forEach(ds => {
      ds.data.forEach(d => {
        if (d.year < minYear) minYear = d.year
        if (d.year > maxYear) maxYear = d.year
      })
    })
    
    return [minYear || 1880, maxYear || 2024] as [number, number]
  }, [datasets])

  // Create base X scale (full range)
  const baseXScale = useMemo(() => {
    return d3.scaleLinear()
      .domain(fullXDomain)
      .range([0, chartWidth])
  }, [fullXDomain, chartWidth])

  // Current X scale (with zoom applied)
  const xScale = useMemo(() => {
    return zoomTransform.rescaleX(baseXScale)
  }, [baseXScale, zoomTransform])

  // Create Y scales for each dataset
  const yScales = useMemo(() => {
    const scales: Record<string, d3.ScaleLinear<number, number>> = {}
    
    datasets.forEach(ds => {
      const values = ds.data.map(d => d.value)
      const [min, max] = d3.extent(values) as [number, number]
      const padding = (max - min) * 0.1
      
      scales[ds.id] = d3.scaleLinear()
        .domain([min - padding, max + padding])
        .range([chartHeight, 0])
        .nice()
    })

    return scales
  }, [datasets, chartHeight])

  // Resize observer
  useEffect(() => {
    if (!containerRef.current) return

    const resizeObserver = new ResizeObserver(entries => {
      for (const entry of entries) {
        const { width } = entry.contentRect
        if (width > 0) {
          setDimensions({ width, height })
        }
      }
    })

    resizeObserver.observe(containerRef.current)
    return () => resizeObserver.disconnect()
  }, [height])

  // Main D3 rendering
  useEffect(() => {
    if (!svgRef.current || chartWidth <= 0 || chartHeight <= 0) return

    const svg = d3.select(svgRef.current)
    
    // Clear previous content
    svg.selectAll('*').remove()

    // Clip path for chart area
    svg.append('defs')
      .append('clipPath')
      .attr('id', 'chart-clip')
      .append('rect')
      .attr('width', chartWidth)
      .attr('height', chartHeight)

    // Create main group with margins
    const g = svg.append('g')
      .attr('transform', `translate(${MARGIN.left},${MARGIN.top})`)

    // ─────────────────────────────────────────
    // GRID LINES
    // ─────────────────────────────────────────
    if (showGrid) {
      const gridGroup = g.append('g').attr('class', 'grid')
      
      // Vertical grid (years)
      const xTicks = xScale.ticks(10)
      gridGroup.selectAll('line.grid-x')
        .data(xTicks)
        .enter()
        .append('line')
        .attr('class', 'grid-x')
        .attr('x1', d => xScale(d))
        .attr('x2', d => xScale(d))
        .attr('y1', 0)
        .attr('y2', chartHeight)
        .attr('stroke', '#e5e5e5')
        .attr('stroke-width', 1)

      // Horizontal grid (first dataset's scale)
      if (datasets.length > 0) {
        const firstScale = yScales[datasets[0].id]
        const yTicks = firstScale.ticks(6)
        gridGroup.selectAll('line.grid-y')
          .data(yTicks)
          .enter()
          .append('line')
          .attr('class', 'grid-y')
          .attr('x1', 0)
          .attr('x2', chartWidth)
          .attr('y1', d => firstScale(d))
          .attr('y2', d => firstScale(d))
          .attr('stroke', '#e5e5e5')
          .attr('stroke-width', 1)
      }
    }

    // ─────────────────────────────────────────
    // X AXIS
    // ─────────────────────────────────────────
    const xAxis = d3.axisBottom(xScale)
      .ticks(10)
      .tickFormat(d => d.toString())
      .tickSize(0)
      .tickPadding(12)

    g.append('g')
      .attr('class', 'x-axis')
      .attr('transform', `translate(0,${chartHeight})`)
      .call(xAxis)
      .call(g => g.select('.domain').remove())
      .call(g => g.selectAll('.tick text')
        .attr('font-family', 'var(--font-mono)')
        .attr('font-size', '11px')
        .attr('fill', '#64748b')
      )

    // X axis baseline
    g.append('line')
      .attr('x1', 0)
      .attr('x2', chartWidth)
      .attr('y1', chartHeight)
      .attr('y2', chartHeight)
      .attr('stroke', '#cbd5e1')
      .attr('stroke-width', 1)

    // ─────────────────────────────────────────
    // Y AXES (alternating left/right)
    // ─────────────────────────────────────────
    let leftAxisCount = 0
    let rightAxisCount = 0

    datasets.forEach(ds => {
      const yScale = yScales[ds.id]
      const meta = DATASETS[ds.id]
      const isLeft = ds.yAxisSide === 'left'
      
      const offset = isLeft 
        ? -leftAxisCount * 60 
        : chartWidth + rightAxisCount * 60
      
      if (isLeft) leftAxisCount++
      else rightAxisCount++

      const yAxis = isLeft
        ? d3.axisLeft(yScale).ticks(6).tickSize(0).tickPadding(8)
        : d3.axisRight(yScale).ticks(6).tickSize(0).tickPadding(8)

      const axisG = g.append('g')
        .attr('class', `y-axis y-axis-${ds.id}`)
        .attr('transform', `translate(${offset},0)`)
        .call(yAxis)
        .call(g => g.select('.domain').remove())
        .call(g => g.selectAll('.tick text')
          .attr('font-family', 'var(--font-mono)')
          .attr('font-size', '10px')
          .attr('fill', ds.color)
        )

      // Y axis label (unit)
      axisG.append('text')
        .attr('x', isLeft ? -8 : 8)
        .attr('y', -12)
        .attr('text-anchor', isLeft ? 'end' : 'start')
        .attr('font-family', 'var(--font-sans)')
        .attr('font-size', '10px')
        .attr('font-weight', '500')
        .attr('fill', ds.color)
        .text(meta?.unitShort || '')
    })

    // ─────────────────────────────────────────
    // DATA LINES (clipped)
    // ─────────────────────────────────────────
    const linesGroup = g.append('g')
      .attr('class', 'lines')
      .attr('clip-path', 'url(#chart-clip)')

    const line = (ds: ChartDataset) => d3.line<DataPoint>()
      .x(d => xScale(d.year))
      .y(d => yScales[ds.id](d.value))
      .curve(d3.curveMonotoneX)

    datasets.forEach(ds => {
      const path = linesGroup.append('path')
        .datum(ds.data)
        .attr('class', `line line-${ds.id}`)
        .attr('fill', 'none')
        .attr('stroke', ds.color)
        .attr('stroke-width', 2.5)
        .attr('stroke-linecap', 'round')
        .attr('stroke-linejoin', 'round')
        .attr('d', line(ds))

      // Animate line drawing (only on initial render)
      if (animate && zoomTransform === d3.zoomIdentity) {
        const totalLength = path.node()?.getTotalLength() || 0
        path
          .attr('stroke-dasharray', `${totalLength} ${totalLength}`)
          .attr('stroke-dashoffset', totalLength)
          .transition()
          .duration(1500)
          .ease(d3.easeCubicOut)
          .attr('stroke-dashoffset', 0)
      }
    })

    // ─────────────────────────────────────────
    // HOVER INTERACTION
    // ─────────────────────────────────────────
    const hoverGroup = g.append('g')
      .attr('class', 'hover-elements')
      .style('display', 'none')

    // Crosshair vertical line
    hoverGroup.append('line')
      .attr('class', 'crosshair')
      .attr('y1', 0)
      .attr('y2', chartHeight)
      .attr('stroke', '#94a3b8')
      .attr('stroke-width', 1)
      .attr('stroke-dasharray', '4,4')

    // Hover dots for each dataset
    datasets.forEach(ds => {
      hoverGroup.append('circle')
        .attr('class', `hover-dot hover-dot-${ds.id}`)
        .attr('r', 5)
        .attr('fill', ds.color)
        .attr('stroke', '#fff')
        .attr('stroke-width', 2)
    })

    // Invisible overlay for mouse events
    const overlay = g.append('rect')
      .attr('class', 'overlay')
      .attr('width', chartWidth)
      .attr('height', chartHeight)
      .attr('fill', 'none')
      .attr('pointer-events', 'all')
      .style('cursor', 'crosshair')
      .on('mousemove', function(event) {
        const [mouseX] = d3.pointer(event)
        const year = Math.round(xScale.invert(mouseX))
        
        // Clamp to data range
        const clampedYear = Math.max(fullXDomain[0], Math.min(fullXDomain[1], year))
        setHoveredYear(clampedYear)
        
        hoverGroup.style('display', null)
        hoverGroup.select('.crosshair')
          .attr('x1', xScale(clampedYear))
          .attr('x2', xScale(clampedYear))

        datasets.forEach(ds => {
          const dataPoint = ds.data.find(d => d.year === clampedYear)
          if (dataPoint) {
            hoverGroup.select(`.hover-dot-${ds.id}`)
              .attr('cx', xScale(clampedYear))
              .attr('cy', yScales[ds.id](dataPoint.value))
              .style('display', null)
          } else {
            hoverGroup.select(`.hover-dot-${ds.id}`)
              .style('display', 'none')
          }
        })
      })
      .on('mouseleave', function() {
        setHoveredYear(null)
        hoverGroup.style('display', 'none')
      })

    // ─────────────────────────────────────────
    // ZOOM BEHAVIOR
    // ─────────────────────────────────────────
    const zoom = d3.zoom<SVGSVGElement, unknown>()
      .scaleExtent([1, 20])
      .translateExtent([[0, 0], [dimensions.width, dimensions.height]])
      .extent([[MARGIN.left, MARGIN.top], [dimensions.width - MARGIN.right, dimensions.height - MARGIN.bottom]])
      .filter((event) => {
        // Allow wheel zoom and drag, but not double-click (we use it for reset)
        return !event.button && event.type !== 'dblclick'
      })
      .on('zoom', (event) => {
        setZoomTransform(event.transform)
      })

    zoomRef.current = zoom

    svg.call(zoom)
      .on('dblclick.zoom', null) // Disable default double-click zoom
    
    // Double-click on overlay to reset zoom
    overlay.on('dblclick', () => {
      svg.transition()
        .duration(500)
        .call(zoom.transform, d3.zoomIdentity)
    })

  }, [datasets, yScales, xScale, baseXScale, chartWidth, chartHeight, dimensions, fullXDomain, showGrid, animate, zoomTransform])

  // Get values for tooltip
  const tooltipData = useMemo(() => {
    if (!hoveredYear) return null
    
    const values = datasets.map(ds => {
      const dataPoint = ds.data.find(d => d.year === hoveredYear)
      const meta = DATASETS[ds.id]
      return {
        id: ds.id,
        name: meta?.shortName || ds.id,
        value: dataPoint?.value,
        unit: meta?.unitShort || '',
        color: ds.color,
      }
    }).filter(v => v.value !== undefined)

    if (values.length === 0) return null

    return {
      year: hoveredYear,
      x: xScale(hoveredYear) + MARGIN.left,
      values,
    }
  }, [hoveredYear, datasets, xScale])

  // Check if zoomed
  const isZoomed = zoomTransform.k !== 1 || zoomTransform.x !== 0

  return (
    <div ref={containerRef} className="w-full relative">
      {/* Zoom indicator */}
      {isZoomed && (
        <div className="absolute top-2 right-2 flex items-center gap-2 z-10">
          <span className="text-xs text-neutral-400 bg-white/80 px-2 py-1 rounded">
            {Math.round(zoomTransform.k * 100)}% — double-click to reset
          </span>
        </div>
      )}
      
      <svg
        ref={svgRef}
        width={dimensions.width}
        height={dimensions.height}
        className="overflow-visible"
        style={{ fontFamily: 'var(--font-sans)' }}
      />
      
      {/* Tooltip */}
      {tooltipData && (
        <div
          className="absolute pointer-events-none bg-white border border-neutral-200 rounded-lg shadow-lg px-3 py-2 z-10"
          style={{
            left: Math.min(tooltipData.x, dimensions.width - 150),
            top: MARGIN.top,
            transform: tooltipData.x > dimensions.width - 150 ? 'translateX(-100%)' : 'translateX(-50%)',
          }}
        >
          {/* Year */}
          <div className="font-mono text-sm font-bold text-neutral-900 mb-1.5 text-center">
            {tooltipData.year}
          </div>
          
          {/* Values */}
          <div className="space-y-1">
            {tooltipData.values.map(v => (
              <div key={v.id} className="flex items-center gap-2 text-xs">
                <div 
                  className="w-2 h-2 rounded-full flex-shrink-0"
                  style={{ backgroundColor: v.color }}
                />
                <span className="text-neutral-500">{v.name}</span>
                <span className="font-mono font-medium text-neutral-900">
                  {formatValue(v.value!, v.unit)}
                </span>
                <span className="text-neutral-400">{v.unit}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
