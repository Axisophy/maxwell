'use client'

import { useState, useMemo } from 'react'

type Shape2D = 'circle' | 'rectangle' | 'square' | 'triangle' | 'ellipse' | 'polygon' | 'trapezoid'
type Shape3D = 'sphere' | 'cube' | 'rectangular-prism' | 'cylinder' | 'cone' | 'pyramid'
type ShapeCategory = '2d' | '3d'

interface ShapeConfig {
  name: string
  inputs: { key: string; label: string; placeholder?: string }[]
  calculate: (inputs: Record<string, number>) => Record<string, number>
}

const SHAPES: Record<ShapeCategory, Record<string, ShapeConfig>> = {
  '2d': {
    circle: {
      name: 'Circle',
      inputs: [
        { key: 'radius', label: 'Radius', placeholder: 'r' }
      ],
      calculate: ({ radius }) => ({
        diameter: radius * 2,
        circumference: 2 * Math.PI * radius,
        area: Math.PI * radius * radius
      })
    },
    rectangle: {
      name: 'Rectangle',
      inputs: [
        { key: 'length', label: 'Length', placeholder: 'l' },
        { key: 'width', label: 'Width', placeholder: 'w' }
      ],
      calculate: ({ length, width }) => ({
        area: length * width,
        perimeter: 2 * (length + width),
        diagonal: Math.sqrt(length * length + width * width)
      })
    },
    square: {
      name: 'Square',
      inputs: [
        { key: 'side', label: 'Side', placeholder: 's' }
      ],
      calculate: ({ side }) => ({
        area: side * side,
        perimeter: 4 * side,
        diagonal: side * Math.sqrt(2)
      })
    },
    triangle: {
      name: 'Triangle',
      inputs: [
        { key: 'base', label: 'Base', placeholder: 'b' },
        { key: 'height', label: 'Height', placeholder: 'h' },
        { key: 'sideA', label: 'Side A (optional)', placeholder: 'a' },
        { key: 'sideB', label: 'Side B (optional)', placeholder: 'c' }
      ],
      calculate: ({ base, height, sideA, sideB }) => {
        const area = 0.5 * base * height
        const results: Record<string, number> = { area }
        if (sideA && sideB) {
          results.perimeter = base + sideA + sideB
        }
        return results
      }
    },
    ellipse: {
      name: 'Ellipse',
      inputs: [
        { key: 'semiMajor', label: 'Semi-major axis', placeholder: 'a' },
        { key: 'semiMinor', label: 'Semi-minor axis', placeholder: 'b' }
      ],
      calculate: ({ semiMajor, semiMinor }) => ({
        area: Math.PI * semiMajor * semiMinor,
        circumference: Math.PI * (3 * (semiMajor + semiMinor) - Math.sqrt((3 * semiMajor + semiMinor) * (semiMajor + 3 * semiMinor)))
      })
    },
    trapezoid: {
      name: 'Trapezoid',
      inputs: [
        { key: 'base1', label: 'Base 1', placeholder: 'a' },
        { key: 'base2', label: 'Base 2', placeholder: 'b' },
        { key: 'height', label: 'Height', placeholder: 'h' }
      ],
      calculate: ({ base1, base2, height }) => ({
        area: 0.5 * (base1 + base2) * height
      })
    }
  },
  '3d': {
    sphere: {
      name: 'Sphere',
      inputs: [
        { key: 'radius', label: 'Radius', placeholder: 'r' }
      ],
      calculate: ({ radius }) => ({
        diameter: radius * 2,
        surfaceArea: 4 * Math.PI * radius * radius,
        volume: (4 / 3) * Math.PI * Math.pow(radius, 3)
      })
    },
    cube: {
      name: 'Cube',
      inputs: [
        { key: 'side', label: 'Side', placeholder: 's' }
      ],
      calculate: ({ side }) => ({
        surfaceArea: 6 * side * side,
        volume: Math.pow(side, 3),
        diagonal: side * Math.sqrt(3)
      })
    },
    'rectangular-prism': {
      name: 'Rectangular Prism',
      inputs: [
        { key: 'length', label: 'Length', placeholder: 'l' },
        { key: 'width', label: 'Width', placeholder: 'w' },
        { key: 'height', label: 'Height', placeholder: 'h' }
      ],
      calculate: ({ length, width, height }) => ({
        surfaceArea: 2 * (length * width + width * height + height * length),
        volume: length * width * height,
        diagonal: Math.sqrt(length * length + width * width + height * height)
      })
    },
    cylinder: {
      name: 'Cylinder',
      inputs: [
        { key: 'radius', label: 'Radius', placeholder: 'r' },
        { key: 'height', label: 'Height', placeholder: 'h' }
      ],
      calculate: ({ radius, height }) => ({
        lateralArea: 2 * Math.PI * radius * height,
        surfaceArea: 2 * Math.PI * radius * (radius + height),
        volume: Math.PI * radius * radius * height
      })
    },
    cone: {
      name: 'Cone',
      inputs: [
        { key: 'radius', label: 'Radius', placeholder: 'r' },
        { key: 'height', label: 'Height', placeholder: 'h' }
      ],
      calculate: ({ radius, height }) => {
        const slant = Math.sqrt(radius * radius + height * height)
        return {
          slantHeight: slant,
          lateralArea: Math.PI * radius * slant,
          surfaceArea: Math.PI * radius * (radius + slant),
          volume: (1 / 3) * Math.PI * radius * radius * height
        }
      }
    },
    pyramid: {
      name: 'Square Pyramid',
      inputs: [
        { key: 'base', label: 'Base side', placeholder: 'b' },
        { key: 'height', label: 'Height', placeholder: 'h' }
      ],
      calculate: ({ base, height }) => {
        const slant = Math.sqrt(Math.pow(base / 2, 2) + height * height)
        return {
          slantHeight: slant,
          surfaceArea: base * base + 2 * base * slant,
          volume: (1 / 3) * base * base * height
        }
      }
    }
  }
}

const RESULT_LABELS: Record<string, string> = {
  diameter: 'Diameter',
  circumference: 'Circumference',
  area: 'Area',
  perimeter: 'Perimeter',
  diagonal: 'Diagonal',
  surfaceArea: 'Surface Area',
  volume: 'Volume',
  lateralArea: 'Lateral Area',
  slantHeight: 'Slant Height'
}

export default function GeometryCalculator() {
  const [category, setCategory] = useState<ShapeCategory>('2d')
  const [selectedShape, setSelectedShape] = useState<string>('circle')
  const [inputs, setInputs] = useState<Record<string, string>>({})

  const shapeConfig = SHAPES[category][selectedShape]

  // Calculate results
  const results = useMemo(() => {
    if (!shapeConfig) return null
    
    const numericInputs: Record<string, number> = {}
    let hasValidInput = false
    
    for (const input of shapeConfig.inputs) {
      const value = parseFloat(inputs[input.key] || '')
      if (!isNaN(value) && value > 0) {
        numericInputs[input.key] = value
        hasValidInput = true
      } else if (!input.label.includes('optional')) {
        return null // Required input missing
      }
    }
    
    if (!hasValidInput) return null
    
    try {
      return shapeConfig.calculate(numericInputs)
    } catch {
      return null
    }
  }, [shapeConfig, inputs])

  // Format number
  const fmt = (n: number) => {
    if (isNaN(n) || !isFinite(n)) return '-'
    if (n >= 1e6 || (n < 0.001 && n !== 0)) return n.toExponential(4)
    return n.toLocaleString(undefined, { maximumFractionDigits: 6 })
  }

  // Handle shape change
  const handleShapeChange = (shape: string) => {
    setSelectedShape(shape)
    setInputs({})
  }

  // Handle category change
  const handleCategoryChange = (cat: ShapeCategory) => {
    setCategory(cat)
    setSelectedShape(Object.keys(SHAPES[cat])[0])
    setInputs({})
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Shape Selection & Inputs */}
      <div className="space-y-4">
        {/* Category Toggle */}
        <div className="flex gap-1 p-1 bg-neutral-200 rounded-lg">
          <button
            onClick={() => handleCategoryChange('2d')}
            className={`flex-1 py-2 rounded-md text-sm font-medium transition-colors ${
              category === '2d' ? 'bg-white text-black' : 'text-black/50 hover:text-black'
            }`}
          >
            2D Shapes
          </button>
          <button
            onClick={() => handleCategoryChange('3d')}
            className={`flex-1 py-2 rounded-md text-sm font-medium transition-colors ${
              category === '3d' ? 'bg-white text-black' : 'text-black/50 hover:text-black'
            }`}
          >
            3D Shapes
          </button>
        </div>

        {/* Shape Selection */}
        <div className="grid grid-cols-3 gap-2">
          {Object.entries(SHAPES[category]).map(([key, config]) => (
            <button
              key={key}
              onClick={() => handleShapeChange(key)}
              className={`p-3 rounded-lg text-sm font-medium transition-colors ${
                selectedShape === key 
                  ? 'bg-black text-white' 
                  : 'bg-neutral-100 text-black hover:bg-neutral-200'
              }`}
            >
              {config.name}
            </button>
          ))}
        </div>

        {/* Input Fields */}
        {shapeConfig && (
          <div className="space-y-3">
            <h3 className="text-sm font-medium text-black/40 uppercase tracking-wider">
              {shapeConfig.name} Dimensions
            </h3>
            {shapeConfig.inputs.map(input => (
              <div key={input.key}>
                <label className="block text-sm text-black/60 mb-1">
                  {input.label}
                </label>
                <input
                  type="number"
                  value={inputs[input.key] || ''}
                  onChange={(e) => setInputs({ ...inputs, [input.key]: e.target.value })}
                  placeholder={input.placeholder}
                  min="0"
                  step="any"
                  className="w-full px-4 py-3 font-mono bg-neutral-100 rounded-lg border-0 focus:ring-2 focus:ring-black"
                />
              </div>
            ))}
          </div>
        )}

        {/* Clear button */}
        <button
          onClick={() => setInputs({})}
          className="w-full py-2 text-sm text-black/40 hover:text-black"
        >
          Clear inputs
        </button>
      </div>

      {/* Results & Diagram */}
      <div className="space-y-4">
        {/* SVG Diagram */}
        <div className="bg-neutral-100 rounded-xl p-6 flex items-center justify-center min-h-[200px]">
          <ShapeDiagram shape={selectedShape} category={category} inputs={inputs} />
        </div>

        {/* Results */}
        {results ? (
          <div className="bg-neutral-100 rounded-xl p-4 space-y-2">
            <h3 className="text-sm font-medium text-black/40 uppercase tracking-wider mb-3">
              Results
            </h3>
            {Object.entries(results).map(([key, value]) => (
              <div key={key} className="flex justify-between py-2 border-b border-neutral-200 last:border-0">
                <span className="text-black/60">{RESULT_LABELS[key] || key}</span>
                <span className="font-mono font-medium">{fmt(value)}</span>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-neutral-100 rounded-xl p-6 text-center text-black/40">
            Enter dimensions to calculate
          </div>
        )}

        {/* Formulas */}
        <div className="text-sm text-black/40">
          <p className="font-medium mb-1">Formulas:</p>
          <FormulasForShape shape={selectedShape} category={category} />
        </div>
      </div>
    </div>
  )
}

// Simple SVG shape diagrams
function ShapeDiagram({ shape, category, inputs }: { shape: string; category: ShapeCategory; inputs: Record<string, string> }) {
  const size = 120
  const cx = size / 2
  const cy = size / 2
  
  if (category === '2d') {
    switch (shape) {
      case 'circle':
        return (
          <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
            <circle cx={cx} cy={cy} r={40} fill="none" stroke="black" strokeWidth="2" />
            <line x1={cx} y1={cy} x2={cx + 40} y2={cy} stroke="black" strokeWidth="1" strokeDasharray="4" />
            <text x={cx + 15} y={cy - 5} fontSize="12" fill="black">r</text>
          </svg>
        )
      case 'rectangle':
        return (
          <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
            <rect x="20" y="30" width="80" height="60" fill="none" stroke="black" strokeWidth="2" />
            <text x="55" y="100" fontSize="12" fill="black" textAnchor="middle">l</text>
            <text x="110" y="60" fontSize="12" fill="black">w</text>
          </svg>
        )
      case 'square':
        return (
          <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
            <rect x="25" y="25" width="70" height="70" fill="none" stroke="black" strokeWidth="2" />
            <text x="60" y="105" fontSize="12" fill="black" textAnchor="middle">s</text>
          </svg>
        )
      case 'triangle':
        return (
          <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
            <polygon points="60,20 20,100 100,100" fill="none" stroke="black" strokeWidth="2" />
            <line x1="60" y1="20" x2="60" y2="100" stroke="black" strokeWidth="1" strokeDasharray="4" />
            <text x="55" y="115" fontSize="12" fill="black" textAnchor="middle">b</text>
            <text x="65" y="60" fontSize="12" fill="black">h</text>
          </svg>
        )
      default:
        return <div className="text-black/40">Shape diagram</div>
    }
  }
  
  // 3D shapes - simplified representations
  return <div className="text-4xl">{ category === '3d' ? '📦' : '⬜' }</div>
}

// Formulas for each shape
function FormulasForShape({ shape, category }: { shape: string; category: ShapeCategory }) {
  const formulas: Record<string, Record<string, string[]>> = {
    '2d': {
      circle: ['Area = πr²', 'Circumference = 2πr'],
      rectangle: ['Area = l × w', 'Perimeter = 2(l + w)', 'Diagonal = √(l² + w²)'],
      square: ['Area = s²', 'Perimeter = 4s', 'Diagonal = s√2'],
      triangle: ['Area = ½ × b × h'],
      ellipse: ['Area = πab', 'Circumference ≈ π(3(a+b) - √((3a+b)(a+3b)))'],
      trapezoid: ['Area = ½(a + b) × h']
    },
    '3d': {
      sphere: ['Surface Area = 4πr²', 'Volume = (4/3)πr³'],
      cube: ['Surface Area = 6s²', 'Volume = s³', 'Diagonal = s√3'],
      'rectangular-prism': ['Surface Area = 2(lw + wh + hl)', 'Volume = lwh'],
      cylinder: ['Surface Area = 2πr(r + h)', 'Volume = πr²h'],
      cone: ['Surface Area = πr(r + l)', 'Volume = (1/3)πr²h'],
      pyramid: ['Volume = (1/3)b²h']
    }
  }
  
  const shapeFormulas = formulas[category]?.[shape] || []
  
  return (
    <ul className="space-y-0.5">
      {shapeFormulas.map((f, i) => (
        <li key={i} className="font-mono text-xs">{f}</li>
      ))}
    </ul>
  )
}
