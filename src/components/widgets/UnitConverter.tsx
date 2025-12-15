'use client'

import { useState, useEffect, useRef } from 'react'

// ===========================================
// UNIT CONVERTER
// ===========================================
// Convert between units across categories
// Design: Pure typographic, minimal
// ===========================================

interface UnitCategory {
  name: string
  units: { id: string; name: string; toBase: number; symbol: string }[]
}

const categories: UnitCategory[] = [
  {
    name: 'Length',
    units: [
      { id: 'km', name: 'Kilometers', toBase: 1000, symbol: 'km' },
      { id: 'm', name: 'Meters', toBase: 1, symbol: 'm' },
      { id: 'cm', name: 'Centimeters', toBase: 0.01, symbol: 'cm' },
      { id: 'mm', name: 'Millimeters', toBase: 0.001, symbol: 'mm' },
      { id: 'mi', name: 'Miles', toBase: 1609.344, symbol: 'mi' },
      { id: 'yd', name: 'Yards', toBase: 0.9144, symbol: 'yd' },
      { id: 'ft', name: 'Feet', toBase: 0.3048, symbol: 'ft' },
      { id: 'in', name: 'Inches', toBase: 0.0254, symbol: 'in' },
      { id: 'nm', name: 'Nautical Miles', toBase: 1852, symbol: 'nmi' },
      { id: 'ly', name: 'Light Years', toBase: 9.461e15, symbol: 'ly' },
      { id: 'au', name: 'Astronomical Units', toBase: 1.496e11, symbol: 'AU' },
    ]
  },
  {
    name: 'Mass',
    units: [
      { id: 'kg', name: 'Kilograms', toBase: 1, symbol: 'kg' },
      { id: 'g', name: 'Grams', toBase: 0.001, symbol: 'g' },
      { id: 'mg', name: 'Milligrams', toBase: 0.000001, symbol: 'mg' },
      { id: 't', name: 'Tonnes', toBase: 1000, symbol: 't' },
      { id: 'lb', name: 'Pounds', toBase: 0.453592, symbol: 'lb' },
      { id: 'oz', name: 'Ounces', toBase: 0.0283495, symbol: 'oz' },
      { id: 'st', name: 'Stone', toBase: 6.35029, symbol: 'st' },
    ]
  },
  {
    name: 'Temperature',
    units: [
      { id: 'c', name: 'Celsius', toBase: 1, symbol: '°C' },
      { id: 'f', name: 'Fahrenheit', toBase: 1, symbol: '°F' },
      { id: 'k', name: 'Kelvin', toBase: 1, symbol: 'K' },
    ]
  },
  {
    name: 'Time',
    units: [
      { id: 'ms', name: 'Milliseconds', toBase: 0.001, symbol: 'ms' },
      { id: 's', name: 'Seconds', toBase: 1, symbol: 's' },
      { id: 'min', name: 'Minutes', toBase: 60, symbol: 'min' },
      { id: 'hr', name: 'Hours', toBase: 3600, symbol: 'hr' },
      { id: 'day', name: 'Days', toBase: 86400, symbol: 'd' },
      { id: 'wk', name: 'Weeks', toBase: 604800, symbol: 'wk' },
      { id: 'yr', name: 'Years', toBase: 31557600, symbol: 'yr' },
    ]
  },
  {
    name: 'Speed',
    units: [
      { id: 'mps', name: 'Meters/second', toBase: 1, symbol: 'm/s' },
      { id: 'kmh', name: 'Kilometers/hour', toBase: 0.277778, symbol: 'km/h' },
      { id: 'mph', name: 'Miles/hour', toBase: 0.44704, symbol: 'mph' },
      { id: 'kn', name: 'Knots', toBase: 0.514444, symbol: 'kn' },
      { id: 'c', name: 'Speed of Light', toBase: 299792458, symbol: 'c' },
    ]
  },
  {
    name: 'Energy',
    units: [
      { id: 'j', name: 'Joules', toBase: 1, symbol: 'J' },
      { id: 'kj', name: 'Kilojoules', toBase: 1000, symbol: 'kJ' },
      { id: 'cal', name: 'Calories', toBase: 4.184, symbol: 'cal' },
      { id: 'kcal', name: 'Kilocalories', toBase: 4184, symbol: 'kcal' },
      { id: 'wh', name: 'Watt-hours', toBase: 3600, symbol: 'Wh' },
      { id: 'kwh', name: 'Kilowatt-hours', toBase: 3600000, symbol: 'kWh' },
      { id: 'ev', name: 'Electron-volts', toBase: 1.602e-19, symbol: 'eV' },
    ]
  },
  {
    name: 'Data',
    units: [
      { id: 'b', name: 'Bits', toBase: 0.125, symbol: 'b' },
      { id: 'B', name: 'Bytes', toBase: 1, symbol: 'B' },
      { id: 'KB', name: 'Kilobytes', toBase: 1024, symbol: 'KB' },
      { id: 'MB', name: 'Megabytes', toBase: 1048576, symbol: 'MB' },
      { id: 'GB', name: 'Gigabytes', toBase: 1073741824, symbol: 'GB' },
      { id: 'TB', name: 'Terabytes', toBase: 1099511627776, symbol: 'TB' },
      { id: 'PB', name: 'Petabytes', toBase: 1125899906842624, symbol: 'PB' },
    ]
  },
  {
    name: 'Pressure',
    units: [
      { id: 'pa', name: 'Pascals', toBase: 1, symbol: 'Pa' },
      { id: 'kpa', name: 'Kilopascals', toBase: 1000, symbol: 'kPa' },
      { id: 'bar', name: 'Bar', toBase: 100000, symbol: 'bar' },
      { id: 'atm', name: 'Atmospheres', toBase: 101325, symbol: 'atm' },
      { id: 'psi', name: 'PSI', toBase: 6894.76, symbol: 'psi' },
      { id: 'mmhg', name: 'mmHg', toBase: 133.322, symbol: 'mmHg' },
    ]
  },
]

export default function UnitConverter() {
  const containerRef = useRef<HTMLDivElement>(null)
  const [baseFontSize, setBaseFontSize] = useState(16)
  const [category, setCategory] = useState(categories[0])
  const [fromUnit, setFromUnit] = useState(categories[0].units[0])
  const [toUnit, setToUnit] = useState(categories[0].units[1])
  const [fromValue, setFromValue] = useState('1')
  const [toValue, setToValue] = useState('')
  
  useEffect(() => {
    const updateSize = () => {
      if (containerRef.current) {
        const width = containerRef.current.clientWidth
        setBaseFontSize(width / 25)
      }
    }
    updateSize()
    const observer = new ResizeObserver(updateSize)
    if (containerRef.current) observer.observe(containerRef.current)
    return () => observer.disconnect()
  }, [])
  
  const convert = (value: string, from: typeof fromUnit, to: typeof toUnit): string => {
    const num = parseFloat(value)
    if (isNaN(num)) return ''
    
    // Special case for temperature
    if (category.name === 'Temperature') {
      let celsius: number
      
      // Convert to Celsius first
      if (from.id === 'c') celsius = num
      else if (from.id === 'f') celsius = (num - 32) * 5/9
      else celsius = num - 273.15 // Kelvin
      
      // Convert from Celsius to target
      let result: number
      if (to.id === 'c') result = celsius
      else if (to.id === 'f') result = celsius * 9/5 + 32
      else result = celsius + 273.15 // Kelvin
      
      return formatNumber(result)
    }
    
    // Standard conversion through base unit
    const base = num * from.toBase
    const result = base / to.toBase
    return formatNumber(result)
  }
  
  const formatNumber = (n: number): string => {
    if (Math.abs(n) < 0.0001 || Math.abs(n) >= 1e10) {
      return n.toExponential(6)
    }
    // Avoid floating point display issues
    const str = n.toPrecision(10)
    const num = parseFloat(str)
    if (Number.isInteger(num)) return num.toString()
    return parseFloat(num.toFixed(8)).toString()
  }
  
  useEffect(() => {
    setToValue(convert(fromValue, fromUnit, toUnit))
  }, [fromValue, fromUnit, toUnit, category])
  
  const swapUnits = () => {
    const temp = fromUnit
    setFromUnit(toUnit)
    setToUnit(temp)
    setFromValue(toValue)
  }
  
  const handleCategoryChange = (newCat: UnitCategory) => {
    setCategory(newCat)
    setFromUnit(newCat.units[0])
    setToUnit(newCat.units[1])
    setFromValue('1')
  }
  
  return (
    <div ref={containerRef} style={{ fontSize: `${baseFontSize}px` }} className="bg-white rounded-xl p-[1em] h-full flex flex-col">
      {/* Header */}
      <div className="text-[0.625em] font-medium text-black/40 uppercase tracking-wider mb-[0.75em]">
        UNIT CONVERTER
      </div>
      
      {/* Category tabs */}
      <div className="flex flex-wrap gap-[0.25em] mb-[1em]">
        {categories.map(cat => (
          <button
            key={cat.name}
            onClick={() => handleCategoryChange(cat)}
            className={`px-[0.5em] py-[0.25em] rounded text-[0.5em] font-medium transition-colors ${
              category.name === cat.name
                ? 'bg-black text-white'
                : 'bg-black/5 text-black/60 hover:bg-black/10'
            }`}
          >
            {cat.name}
          </button>
        ))}
      </div>
      
      {/* From */}
      <div className="mb-[0.5em]">
        <div className="flex items-center gap-[0.5em] mb-[0.25em]">
          <select
            value={fromUnit.id}
            onChange={(e) => setFromUnit(category.units.find(u => u.id === e.target.value)!)}
            className="flex-1 px-[0.5em] py-[0.375em] rounded-lg border border-black/10 text-[0.75em] font-medium bg-white cursor-pointer focus:outline-none focus:border-black/30"
          >
            {category.units.map(unit => (
              <option key={unit.id} value={unit.id}>{unit.name}</option>
            ))}
          </select>
        </div>
        <div className="relative">
          <input
            type="number"
            value={fromValue}
            onChange={(e) => setFromValue(e.target.value)}
            className="w-full px-[0.75em] py-[0.5em] pr-[3em] rounded-lg border border-black/10 text-[1.25em] font-mono font-medium bg-black/[0.02] focus:outline-none focus:border-black/30"
            placeholder="0"
          />
          <span className="absolute right-[0.75em] top-1/2 -translate-y-1/2 text-[0.75em] font-mono text-black/40">
            {fromUnit.symbol}
          </span>
        </div>
      </div>
      
      {/* Swap button */}
      <div className="flex justify-center my-[0.25em]">
        <button
          onClick={swapUnits}
          className="w-[2em] h-[2em] rounded-full bg-black/5 hover:bg-black/10 flex items-center justify-center text-[0.875em] text-black/60 transition-colors"
        >
          ⇅
        </button>
      </div>
      
      {/* To */}
      <div className="mb-[0.5em]">
        <div className="flex items-center gap-[0.5em] mb-[0.25em]">
          <select
            value={toUnit.id}
            onChange={(e) => setToUnit(category.units.find(u => u.id === e.target.value)!)}
            className="flex-1 px-[0.5em] py-[0.375em] rounded-lg border border-black/10 text-[0.75em] font-medium bg-white cursor-pointer focus:outline-none focus:border-black/30"
          >
            {category.units.map(unit => (
              <option key={unit.id} value={unit.id}>{unit.name}</option>
            ))}
          </select>
        </div>
        <div className="relative">
          <input
            type="text"
            value={toValue}
            readOnly
            className="w-full px-[0.75em] py-[0.5em] pr-[3em] rounded-lg border border-black/10 text-[1.25em] font-mono font-bold bg-black/[0.02]"
            placeholder="0"
          />
          <span className="absolute right-[0.75em] top-1/2 -translate-y-1/2 text-[0.75em] font-mono text-black/40">
            {toUnit.symbol}
          </span>
        </div>
      </div>
      
      {/* Formula display */}
      <div className="mt-auto pt-[0.75em] border-t border-black/5">
        <div className="text-[0.5625em] text-black/40 text-center font-mono">
          {fromValue || '1'} {fromUnit.symbol} = {toValue || '?'} {toUnit.symbol}
        </div>
      </div>
    </div>
  )
}
