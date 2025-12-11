'use client'

import { useRef, useEffect, useState, useMemo } from 'react'
import * as d3 from 'd3'
import { DataPoint, ActiveDataset } from '../../lib/types'
import { DATASETS, getDatasetColor, formatValue } from '../../lib/datasets'

// ===========================================
// CLIMATE CHART - D3 MULTI-AXIS CHART
// ===========================================
// A beautiful, precise chart for overlaying climate datasets
// Features:
// - Multiple Y-axes (alternating left/right)
// - Smooth animated transitions
// - Crosshair hover with multi-dataset tooltip
// - Horizontal zoom/pan
// - Clean, minimal design

interface ChartDataset {
  id: string
  data: DataPoint[]
  color: string
  yAxisSide: 'left' | 'right'
}

interface ClimateChartProps {
  datasets: ChartDataset[]
  xDomain?: [number, number]
  onHover?: (year: number | null, datasets: { id: string; value: number }[]) => void
  onZoom?: (domain: [number, number]) => void
  height?: number
  showGrid?: boolean
  animate?: boolean
}

// Chart margins - generous for multi-axis
const MARGIN = { top: 24, right: 80, bottom: 48, left: 80 }

export default function ClimateChart({
  datasets,
  xDomain: propXDomain,
  onHover,
  onZoom,
  height = 400,
  showGrid = true,
  animate = true,
}: ClimateChartProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const svgRef = useRef<SVGSVGElement>(null)
  const [dimensions, setDimensions] = useState({ width: 800, height })
  const [hoveredYear, setHoveredYear] = useState<number | null>(null)
  const [currentXDomain, setCurrentXDomain] = useState<[number, number] | null>(null)

  // Calculate chart dimensions
  const chartWidth = dimensions.width - MARGIN.left - MARGIN.right
  const chartHeight = dimensions.height - MARGIN.top - MARGIN.bottom

  // Determine X domain from data or props
  const xDomain = useMemo(() => {
    if (currentXDomain) return currentXDomain
    if (propXDomain) return propXDomain
    
    let minYear = Infinity
    let maxYear = -Infinity
    
    datasets.forEach(ds => {
      ds.data.forEach(d => {
        if (d.year < minYear) minYear = d.year
        if (d.year > maxYear) maxYear = d.year
      })
    })
    
    return [minYear || 1880, maxYear || 2024] as [number, number]
  }, [datasets, propXDomain, currentXDomain])

  // Create scales for each dataset
  const scales = useMemo(() => {
    const xScale = d3.scaleLinear()
      .domain(xDomain)
      .range([0, chartWidth])

    const yScales: Record<string, d3.ScaleLinear<number, number>> = {}
    
    datasets.forEach(ds => {
      const values = ds.data.map(d => d.value)
      const [min, max] = d3.extent(values) as [number, number]
      const padding = (max - min) * 0.1
      
      yScales[ds.id] = d3.scaleLinear()
        .domain([min - padding, max + padding])
        .range([chartHeight, 0])
        .nice()
    })

    return { xScale, yScales }
  }, [datasets, xDomain, chartWidth, chartHeight])

  // Resize observer
  useEffect(() => {
    if (!containerRef.current) return

    const resizeObserver = new ResizeObserver(entries => {
      for (const entry of entries) {
        const { width } = entry.contentRect
        setDimensions({ width, height })
      }
    })

    resizeObserver.observe(containerRef.current)
    return () => resizeObserver.disconnect()
  }, [height])

  // Main D3 rendering
  useEffect(() => {
    if (!svgRef.current || chartWidth <= 0) return

    const svg = d3.select(svgRef.current)
    
    // Clear previous content
    svg.selectAll('*').remove()

    // Create main group with margins
    const g = svg.append('g')
      .attr('transform', `translate(${MARGIN.left},${MARGIN.top})`)

    // ─────────────────────────────────────────
    // GRID LINES
    // ─────────────────────────────────────────
    if (showGrid) {
      // Vertical grid (years)
      const xTicks = scales.xScale.ticks(10)
      g.append('g')
        .attr('class', 'grid-x')
        .selectAll('line')
        .data(xTicks)
        .enter()
        .append('line')
        .attr('x1', d => scales.xScale(d))
        .attr('x2', d => scales.xScale(d))
        .attr('y1', 0)
        .attr('y2', chartHeight)
        .attr('stroke', '#e5e5e5')
        .attr('stroke-width', 1)

      // Horizontal grid (first dataset's scale)
      if (datasets.length > 0) {
        const firstScale = scales.yScales[datasets[0].id]
        const yTicks = firstScale.ticks(6)
        g.append('g')
          .attr('class', 'grid-y')
          .selectAll('line')
          .data(yTicks)
          .enter()
          .append('line')
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
    const xAxis = d3.axisBottom(scales.xScale)
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
      const yScale = scales.yScales[ds.id]
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
        .attr('y', -10)
        .attr('text-anchor', isLeft ? 'end' : 'start')
        .attr('font-family', 'var(--font-sans)')
        .attr('font-size', '10px')
        .attr('font-weight', '500')
        .attr('fill', ds.color)
        .text(meta?.unitShort || '')
    })

    // ─────────────────────────────────────────
    // DATA LINES
    // ─────────────────────────────────────────
    const line = (ds: ChartDataset) => d3.line<DataPoint>()
      .x(d => scales.xScale(d.year))
      .y(d => scales.yScales[ds.id](d.value))
      .curve(d3.curveMonotoneX)

    datasets.forEach(ds => {
      const filteredData = ds.data.filter(d => 
        d.year >= xDomain[0] && d.year <= xDomain[1]
      )

      const path = g.append('path')
        .datum(filteredData)
        .attr('class', `line line-${ds.id}`)
        .attr('fill', 'none')
        .attr('stroke', ds.color)
        .attr('stroke-width', 2.5)
        .attr('stroke-linecap', 'round')
        .attr('stroke-linejoin', 'round')
        .attr('d', line(ds))

      // Animate line drawing
      if (animate) {
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
    g.append('rect')
      .attr('class', 'overlay')
      .attr('width', chartWidth)
      .attr('height', chartHeight)
      .attr('fill', 'none')
      .attr('pointer-events', 'all')
      .on('mousemove', function(event) {
        const [mouseX] = d3.pointer(event)
        const year = Math.round(scales.xScale.invert(mouseX))
        
        setHoveredYear(year)
        
        // Find values for each dataset at this year
        const values: { id: string; value: number }[] = []
        
        hoverGroup.style('display', null)
        hoverGroup.select('.crosshair')
          .attr('x1', scales.xScale(year))
          .attr('x2', scales.xScale(year))

        datasets.forEach(ds => {
          const dataPoint = ds.data.find(d => d.year === year)
          if (dataPoint) {
            values.push({ id: ds.id, value: dataPoint.value })
            hoverGroup.select(`.hover-dot-${ds.id}`)
              .attr('cx', scales.xScale(year))
              .attr('cy', scales.yScales[ds.id](dataPoint.value))
              .style('display', null)
          } else {
            hoverGroup.select(`.hover-dot-${ds.id}`)
              .style('display', 'none')
          }
        })

        onHover?.(year, values)
      })
      .on('mouseleave', function() {
        setHoveredYear(null)
        hoverGroup.style('display', 'none')
        onHover?.(null, [])
      })

    // ─────────────────────────────────────────
    // ZOOM BEHAVIOR
    // ─────────────────────────────────────────
    const zoom = d3.zoom<SVGSVGElement, unknown>()
      .scaleExtent([1, 10])
      .translateExtent([[0, 0], [dimensions.width, dimensions.height]])
      .extent([[0, 0], [dimensions.width, dimensions.height]])
      .on('zoom', (event) => {
        const newXScale = event.transform.rescaleX(scales.xScale)
        const newDomain = newXScale.domain() as [number, number]
        setCurrentXDomain(newDomain)
        onZoom?.(newDomain)
      })

    svg.call(zoom)

  }, [datasets, scales, chartWidth, chartHeight, dimensions, xDomain, showGrid, animate, onHover, onZoom])

  return (
    <div ref={containerRef} className="w-full">
      <svg
        ref={svgRef}
        width={dimensions.width}
        height={dimensions.height}
        className="overflow-visible"
        style={{ fontFamily: 'var(--font-sans)' }}
      />
      
      {/* Tooltip */}
      {hoveredYear && (
        <HoverTooltip
          year={hoveredYear}
          datasets={datasets}
          xScale={scales.xScale}
          yScales={scales.yScales}
          marginLeft={MARGIN.left}
        />
      )}
    </div>
  )
}

// ===========================================
// HOVER TOOLTIP COMPONENT
// ===========================================

interface HoverTooltipProps {
  year: number
  datasets: ChartDataset[]
  xScale: d3.ScaleLinear<number, number>
  yScales: Record<string, d3.ScaleLinear<number, number>>
  marginLeft: number
}

function HoverTooltip({ year, datasets, xScale, yScales, marginLeft }: HoverTooltipProps) {
  const x = xScale(year) + marginLeft
  
  // Get values for each dataset
  const values = datasets.map(ds => {
    const dataPoint = ds.data.find(d => d.year === year)
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

  return (
    <div
      className="absolute pointer-events-none bg-white border border-neutral-200 rounded-lg shadow-lg px-3 py-2 z-10"
      style={{
        left: x,
        top: MARGIN.top,
        transform: 'translateX(-50%)',
      }}
    >
      {/* Year */}
      <div className="font-mono text-sm font-medium text-neutral-900 mb-1.5 text-center">
        {year}
      </div>
      
      {/* Values */}
      <div className="space-y-1">
        {values.map(v => (
          <div key={v.id} className="flex items-center gap-2 text-xs">
            <div 
              className="w-2 h-2 rounded-full"
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
  )
}
