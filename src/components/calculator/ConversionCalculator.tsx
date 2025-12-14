'use client'

import { useState, useMemo } from 'react'

interface Unit {
  name: string
  symbol: string
  toBase: number // multiply to convert TO base unit
}

interface Category {
  name: string
  baseUnit: string
  units: Unit[]
}

const CATEGORIES: Record<string, Category> = {
  length: {
    name: 'Length',
    baseUnit: 'meters',
    units: [
      { name: 'Millimeters', symbol: 'mm', toBase: 0.001 },
      { name: 'Centimeters', symbol: 'cm', toBase: 0.01 },
      { name: 'Meters', symbol: 'm', toBase: 1 },
      { name: 'Kilometers', symbol: 'km', toBase: 1000 },
      { name: 'Inches', symbol: 'in', toBase: 0.0254 },
      { name: 'Feet', symbol: 'ft', toBase: 0.3048 },
      { name: 'Yards', symbol: 'yd', toBase: 0.9144 },
      { name: 'Miles', symbol: 'mi', toBase: 1609.344 },
      { name: 'Nautical Miles', symbol: 'nmi', toBase: 1852 },
      { name: 'Light Years', symbol: 'ly', toBase: 9.461e15 },
    ]
  },
  mass: {
    name: 'Mass',
    baseUnit: 'kilograms',
    units: [
      { name: 'Milligrams', symbol: 'mg', toBase: 1e-6 },
      { name: 'Grams', symbol: 'g', toBase: 0.001 },
      { name: 'Kilograms', symbol: 'kg', toBase: 1 },
      { name: 'Metric Tonnes', symbol: 't', toBase: 1000 },
      { name: 'Ounces', symbol: 'oz', toBase: 0.0283495 },
      { name: 'Pounds', symbol: 'lb', toBase: 0.453592 },
      { name: 'Stone', symbol: 'st', toBase: 6.35029 },
      { name: 'US Tons', symbol: 'ton', toBase: 907.185 },
    ]
  },
  temperature: {
    name: 'Temperature',
    baseUnit: 'kelvin',
    units: [
      { name: 'Celsius', symbol: '°C', toBase: 1 }, // Special handling
      { name: 'Fahrenheit', symbol: '°F', toBase: 1 }, // Special handling
      { name: 'Kelvin', symbol: 'K', toBase: 1 }, // Special handling
    ]
  },
  area: {
    name: 'Area',
    baseUnit: 'square meters',
    units: [
      { name: 'Square Millimeters', symbol: 'mm²', toBase: 1e-6 },
      { name: 'Square Centimeters', symbol: 'cm²', toBase: 1e-4 },
      { name: 'Square Meters', symbol: 'm²', toBase: 1 },
      { name: 'Hectares', symbol: 'ha', toBase: 10000 },
      { name: 'Square Kilometers', symbol: 'km²', toBase: 1e6 },
      { name: 'Square Inches', symbol: 'in²', toBase: 0.00064516 },
      { name: 'Square Feet', symbol: 'ft²', toBase: 0.092903 },
      { name: 'Square Yards', symbol: 'yd²', toBase: 0.836127 },
      { name: 'Acres', symbol: 'ac', toBase: 4046.86 },
      { name: 'Square Miles', symbol: 'mi²', toBase: 2.59e6 },
    ]
  },
  volume: {
    name: 'Volume',
    baseUnit: 'liters',
    units: [
      { name: 'Milliliters', symbol: 'mL', toBase: 0.001 },
      { name: 'Liters', symbol: 'L', toBase: 1 },
      { name: 'Cubic Meters', symbol: 'm³', toBase: 1000 },
      { name: 'Teaspoons', symbol: 'tsp', toBase: 0.00492892 },
      { name: 'Tablespoons', symbol: 'tbsp', toBase: 0.0147868 },
      { name: 'Fluid Ounces (US)', symbol: 'fl oz', toBase: 0.0295735 },
      { name: 'Cups (US)', symbol: 'cup', toBase: 0.236588 },
      { name: 'Pints (US)', symbol: 'pt', toBase: 0.473176 },
      { name: 'Quarts (US)', symbol: 'qt', toBase: 0.946353 },
      { name: 'Gallons (US)', symbol: 'gal', toBase: 3.78541 },
      { name: 'Gallons (UK)', symbol: 'gal (UK)', toBase: 4.54609 },
    ]
  },
  speed: {
    name: 'Speed',
    baseUnit: 'meters per second',
    units: [
      { name: 'Meters per Second', symbol: 'm/s', toBase: 1 },
      { name: 'Kilometers per Hour', symbol: 'km/h', toBase: 0.277778 },
      { name: 'Miles per Hour', symbol: 'mph', toBase: 0.44704 },
      { name: 'Knots', symbol: 'kn', toBase: 0.514444 },
      { name: 'Feet per Second', symbol: 'ft/s', toBase: 0.3048 },
      { name: 'Mach', symbol: 'M', toBase: 343 },
      { name: 'Speed of Light', symbol: 'c', toBase: 299792458 },
    ]
  },
  time: {
    name: 'Time',
    baseUnit: 'seconds',
    units: [
      { name: 'Nanoseconds', symbol: 'ns', toBase: 1e-9 },
      { name: 'Microseconds', symbol: 'μs', toBase: 1e-6 },
      { name: 'Milliseconds', symbol: 'ms', toBase: 0.001 },
      { name: 'Seconds', symbol: 's', toBase: 1 },
      { name: 'Minutes', symbol: 'min', toBase: 60 },
      { name: 'Hours', symbol: 'h', toBase: 3600 },
      { name: 'Days', symbol: 'd', toBase: 86400 },
      { name: 'Weeks', symbol: 'wk', toBase: 604800 },
      { name: 'Years', symbol: 'yr', toBase: 31536000 },
    ]
  },
  data: {
    name: 'Data',
    baseUnit: 'bytes',
    units: [
      { name: 'Bits', symbol: 'b', toBase: 0.125 },
      { name: 'Bytes', symbol: 'B', toBase: 1 },
      { name: 'Kilobytes', symbol: 'KB', toBase: 1024 },
      { name: 'Megabytes', symbol: 'MB', toBase: 1048576 },
      { name: 'Gigabytes', symbol: 'GB', toBase: 1073741824 },
      { name: 'Terabytes', symbol: 'TB', toBase: 1099511627776 },
      { name: 'Petabytes', symbol: 'PB', toBase: 1125899906842624 },
      { name: 'Kilobits', symbol: 'Kb', toBase: 128 },
      { name: 'Megabits', symbol: 'Mb', toBase: 131072 },
      { name: 'Gigabits', symbol: 'Gb', toBase: 134217728 },
    ]
  },
  energy: {
    name: 'Energy',
    baseUnit: 'joules',
    units: [
      { name: 'Joules', symbol: 'J', toBase: 1 },
      { name: 'Kilojoules', symbol: 'kJ', toBase: 1000 },
      { name: 'Calories', symbol: 'cal', toBase: 4.184 },
      { name: 'Kilocalories', symbol: 'kcal', toBase: 4184 },
      { name: 'Watt Hours', symbol: 'Wh', toBase: 3600 },
      { name: 'Kilowatt Hours', symbol: 'kWh', toBase: 3600000 },
      { name: 'Electronvolts', symbol: 'eV', toBase: 1.602e-19 },
      { name: 'BTU', symbol: 'BTU', toBase: 1055.06 },
    ]
  },
  pressure: {
    name: 'Pressure',
    baseUnit: 'pascals',
    units: [
      { name: 'Pascals', symbol: 'Pa', toBase: 1 },
      { name: 'Kilopascals', symbol: 'kPa', toBase: 1000 },
      { name: 'Bar', symbol: 'bar', toBase: 100000 },
      { name: 'Atmospheres', symbol: 'atm', toBase: 101325 },
      { name: 'PSI', symbol: 'psi', toBase: 6894.76 },
      { name: 'mmHg', symbol: 'mmHg', toBase: 133.322 },
    ]
  }
}

export default function ConversionCalculator() {
  const [category, setCategory] = useState('length')
  const [fromUnit, setFromUnit] = useState('m')
  const [toUnit, setToUnit] = useState('km')
  const [inputValue, setInputValue] = useState('')

  const currentCategory = CATEGORIES[category]
  const units = currentCategory?.units || []

  // Find units
  const from = units.find(u => u.symbol === fromUnit)
  const to = units.find(u => u.symbol === toUnit)

  // Convert value
  const result = useMemo(() => {
    const value = parseFloat(inputValue)
    if (isNaN(value) || !from || !to) return null

    // Special handling for temperature
    if (category === 'temperature') {
      return convertTemperature(value, fromUnit, toUnit)
    }

    // Standard conversion: value → base → target
    const inBase = value * from.toBase
    const converted = inBase / to.toBase
    return converted
  }, [inputValue, from, to, category, fromUnit, toUnit])

  // Temperature conversion
  const convertTemperature = (value: number, from: string, to: string): number => {
    // Convert to Kelvin first
    let kelvin: number
    switch (from) {
      case '°C': kelvin = value + 273.15; break
      case '°F': kelvin = (value - 32) * 5/9 + 273.15; break
      case 'K': kelvin = value; break
      default: return NaN
    }

    // Convert from Kelvin to target
    switch (to) {
      case '°C': return kelvin - 273.15
      case '°F': return (kelvin - 273.15) * 9/5 + 32
      case 'K': return kelvin
      default: return NaN
    }
  }

  // Format result
  const formatResult = (n: number | null): string => {
    if (n === null || isNaN(n) || !isFinite(n)) return '—'
    if (Math.abs(n) >= 1e9 || (Math.abs(n) < 1e-6 && n !== 0)) {
      return n.toExponential(6)
    }
    return n.toLocaleString(undefined, { maximumFractionDigits: 10 })
  }

  // Swap units
  const swapUnits = () => {
    setFromUnit(toUnit)
    setToUnit(fromUnit)
    if (result !== null) {
      setInputValue(formatResult(result))
    }
  }

  // Handle category change
  const handleCategoryChange = (newCategory: string) => {
    setCategory(newCategory)
    const newUnits = CATEGORIES[newCategory].units
    setFromUnit(newUnits[0]?.symbol || '')
    setToUnit(newUnits[1]?.symbol || newUnits[0]?.symbol || '')
    setInputValue('')
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Category Selection */}
      <div className="flex flex-wrap gap-2">
        {Object.entries(CATEGORIES).map(([key, cat]) => (
          <button
            key={key}
            onClick={() => handleCategoryChange(key)}
            className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
              category === key
                ? 'bg-black text-white'
                : 'bg-neutral-100 text-black hover:bg-neutral-200'
            }`}
          >
            {cat.name}
          </button>
        ))}
      </div>

      {/* Conversion Interface */}
      <div className="bg-neutral-100 rounded-xl p-6 space-y-4">
        {/* From */}
        <div>
          <label className="block text-sm text-black/60 mb-2">From</label>
          <div className="flex gap-2">
            <input
              type="number"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Enter value"
              className="flex-1 px-4 py-3 font-mono text-lg bg-white rounded-lg border-0 focus:ring-2 focus:ring-black"
            />
            <select
              value={fromUnit}
              onChange={(e) => setFromUnit(e.target.value)}
              className="px-4 py-3 bg-white rounded-lg border-0 focus:ring-2 focus:ring-black min-w-[140px]"
            >
              {units.map(unit => (
                <option key={unit.symbol} value={unit.symbol}>
                  {unit.symbol} ({unit.name})
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Swap Button */}
        <div className="flex justify-center">
          <button
            onClick={swapUnits}
            className="p-2 bg-white rounded-full hover:bg-neutral-200 transition-colors"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M7 16V4M7 4L3 8M7 4L11 8" />
              <path d="M17 8V20M17 20L21 16M17 20L13 16" />
            </svg>
          </button>
        </div>

        {/* To */}
        <div>
          <label className="block text-sm text-black/60 mb-2">To</label>
          <div className="flex gap-2">
            <div className="flex-1 px-4 py-3 font-mono text-lg bg-white rounded-lg min-h-[52px] flex items-center">
              {formatResult(result)}
            </div>
            <select
              value={toUnit}
              onChange={(e) => setToUnit(e.target.value)}
              className="px-4 py-3 bg-white rounded-lg border-0 focus:ring-2 focus:ring-black min-w-[140px]"
            >
              {units.map(unit => (
                <option key={unit.symbol} value={unit.symbol}>
                  {unit.symbol} ({unit.name})
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Formula display */}
        {inputValue && result !== null && from && to && (
          <div className="text-center text-sm text-black/50 font-mono pt-2">
            {inputValue} {fromUnit} = {formatResult(result)} {toUnit}
          </div>
        )}
      </div>

      {/* Quick Conversions */}
      <div>
        <h3 className="text-sm font-medium text-black/40 uppercase tracking-wider mb-3">
          Common {currentCategory?.name} Conversions
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
          {getCommonConversions(category).map((conv, i) => (
            <button
              key={i}
              onClick={() => {
                setFromUnit(conv.from)
                setToUnit(conv.to)
              }}
              className="px-3 py-2 text-sm bg-neutral-100 rounded-lg hover:bg-neutral-200 transition-colors text-left"
            >
              {conv.from} → {conv.to}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}

// Common conversions for quick access
function getCommonConversions(category: string): { from: string; to: string }[] {
  const commons: Record<string, { from: string; to: string }[]> = {
    length: [
      { from: 'm', to: 'ft' },
      { from: 'km', to: 'mi' },
      { from: 'in', to: 'cm' },
      { from: 'mi', to: 'km' },
      { from: 'yd', to: 'm' },
      { from: 'm', to: 'km' },
    ],
    mass: [
      { from: 'kg', to: 'lb' },
      { from: 'lb', to: 'kg' },
      { from: 'oz', to: 'g' },
      { from: 'st', to: 'kg' },
      { from: 'g', to: 'oz' },
      { from: 't', to: 'kg' },
    ],
    temperature: [
      { from: '°C', to: '°F' },
      { from: '°F', to: '°C' },
      { from: '°C', to: 'K' },
    ],
    volume: [
      { from: 'L', to: 'gal' },
      { from: 'gal', to: 'L' },
      { from: 'mL', to: 'fl oz' },
      { from: 'cup', to: 'mL' },
      { from: 'L', to: 'pt' },
      { from: 'gal', to: 'gal (UK)' },
    ],
    speed: [
      { from: 'km/h', to: 'mph' },
      { from: 'mph', to: 'km/h' },
      { from: 'm/s', to: 'km/h' },
      { from: 'kn', to: 'km/h' },
    ],
    data: [
      { from: 'MB', to: 'GB' },
      { from: 'GB', to: 'TB' },
      { from: 'Mb', to: 'MB' },
      { from: 'KB', to: 'MB' },
    ],
    time: [
      { from: 'h', to: 'min' },
      { from: 'd', to: 'h' },
      { from: 's', to: 'ms' },
    ],
    area: [
      { from: 'm²', to: 'ft²' },
      { from: 'ha', to: 'ac' },
      { from: 'km²', to: 'mi²' },
    ],
    energy: [
      { from: 'J', to: 'cal' },
      { from: 'kWh', to: 'J' },
      { from: 'kcal', to: 'kJ' },
    ],
    pressure: [
      { from: 'bar', to: 'psi' },
      { from: 'atm', to: 'Pa' },
      { from: 'psi', to: 'kPa' },
    ],
  }
  return commons[category] || []
}
