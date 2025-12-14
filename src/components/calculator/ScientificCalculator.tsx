'use client'

import { useState, useCallback, useEffect } from 'react'

// Function categories for the collapsible palette
const functionGroups = {
  basic: {
    label: 'Basic',
    functions: [
      { key: 'percent', label: '%', fn: (x: number) => x / 100 },
      { key: 'negate', label: '±', fn: (x: number) => -x },
      { key: 'reciprocal', label: '1/x', fn: (x: number) => 1 / x },
    ]
  },
  powers: {
    label: 'Powers & Roots',
    functions: [
      { key: 'square', label: 'x²', fn: (x: number) => x * x },
      { key: 'cube', label: 'x³', fn: (x: number) => x * x * x },
      { key: 'sqrt', label: '√x', fn: (x: number) => Math.sqrt(x) },
      { key: 'cbrt', label: '³√x', fn: (x: number) => Math.cbrt(x) },
      { key: 'exp', label: 'eˣ', fn: (x: number) => Math.exp(x) },
      { key: 'pow10', label: '10ˣ', fn: (x: number) => Math.pow(10, x) },
    ]
  },
  logarithms: {
    label: 'Logarithms',
    functions: [
      { key: 'ln', label: 'ln', fn: (x: number) => Math.log(x) },
      { key: 'log10', label: 'log', fn: (x: number) => Math.log10(x) },
      { key: 'log2', label: 'log₂', fn: (x: number) => Math.log2(x) },
    ]
  },
  trigonometry: {
    label: 'Trigonometry',
    functions: [
      { key: 'sin', label: 'sin', fn: (x: number, deg: boolean) => Math.sin(deg ? x * Math.PI / 180 : x) },
      { key: 'cos', label: 'cos', fn: (x: number, deg: boolean) => Math.cos(deg ? x * Math.PI / 180 : x) },
      { key: 'tan', label: 'tan', fn: (x: number, deg: boolean) => Math.tan(deg ? x * Math.PI / 180 : x) },
      { key: 'asin', label: 'sin⁻¹', fn: (x: number, deg: boolean) => deg ? Math.asin(x) * 180 / Math.PI : Math.asin(x) },
      { key: 'acos', label: 'cos⁻¹', fn: (x: number, deg: boolean) => deg ? Math.acos(x) * 180 / Math.PI : Math.acos(x) },
      { key: 'atan', label: 'tan⁻¹', fn: (x: number, deg: boolean) => deg ? Math.atan(x) * 180 / Math.PI : Math.atan(x) },
    ]
  },
  hyperbolic: {
    label: 'Hyperbolic',
    functions: [
      { key: 'sinh', label: 'sinh', fn: (x: number) => Math.sinh(x) },
      { key: 'cosh', label: 'cosh', fn: (x: number) => Math.cosh(x) },
      { key: 'tanh', label: 'tanh', fn: (x: number) => Math.tanh(x) },
      { key: 'asinh', label: 'sinh⁻¹', fn: (x: number) => Math.asinh(x) },
      { key: 'acosh', label: 'cosh⁻¹', fn: (x: number) => Math.acosh(x) },
      { key: 'atanh', label: 'tanh⁻¹', fn: (x: number) => Math.atanh(x) },
    ]
  },
  constants: {
    label: 'Constants',
    functions: [
      { key: 'pi', label: 'π', fn: () => Math.PI },
      { key: 'e', label: 'e', fn: () => Math.E },
      { key: 'phi', label: 'φ', fn: () => (1 + Math.sqrt(5)) / 2 },
    ]
  },
  other: {
    label: 'Other',
    functions: [
      { key: 'abs', label: '|x|', fn: (x: number) => Math.abs(x) },
      { key: 'floor', label: '⌊x⌋', fn: (x: number) => Math.floor(x) },
      { key: 'ceil', label: '⌈x⌉', fn: (x: number) => Math.ceil(x) },
      { key: 'round', label: 'round', fn: (x: number) => Math.round(x) },
      { key: 'factorial', label: 'n!', fn: (x: number) => {
        if (x < 0 || !Number.isInteger(x)) return NaN
        if (x === 0 || x === 1) return 1
        let result = 1
        for (let i = 2; i <= x; i++) result *= i
        return result
      }},
      { key: 'random', label: 'rand', fn: () => Math.random() },
    ]
  }
}

type Operation = '+' | '-' | '×' | '÷' | '^' | null

interface HistoryEntry {
  expression: string
  result: string
  timestamp: Date
}

export default function ScientificCalculator() {
  const [display, setDisplay] = useState('0')
  const [expression, setExpression] = useState('')
  const [previousValue, setPreviousValue] = useState<number | null>(null)
  const [operation, setOperation] = useState<Operation>(null)
  const [waitingForOperand, setWaitingForOperand] = useState(false)
  const [memory, setMemory] = useState<number>(0)
  const [hasMemory, setHasMemory] = useState(false)
  const [degreeMode, setDegreeMode] = useState(true) // true = degrees, false = radians
  const [history, setHistory] = useState<HistoryEntry[]>([])
  const [expandedGroups, setExpandedGroups] = useState<string[]>(['powers', 'trigonometry', 'constants'])
  const [showHistory, setShowHistory] = useState(false)

  // Load history from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('mxwll-calc-history')
    if (saved) {
      try {
        const parsed = JSON.parse(saved)
        setHistory(parsed.map((h: any) => ({ ...h, timestamp: new Date(h.timestamp) })))
      } catch (e) {
        // Ignore parse errors
      }
    }
  }, [])

  // Save history to localStorage
  useEffect(() => {
    localStorage.setItem('mxwll-calc-history', JSON.stringify(history.slice(0, 20)))
  }, [history])

  // Format number for display
  const formatDisplay = (num: string): string => {
    const n = parseFloat(num)
    if (isNaN(n)) return 'Error'
    if (!isFinite(n)) return n > 0 ? '∞' : '-∞'
    
    // Scientific notation for very large/small numbers
    if (Math.abs(n) >= 1e12 || (Math.abs(n) < 1e-6 && n !== 0)) {
      return n.toExponential(6)
    }
    
    // Add thousands separators
    const parts = num.split('.')
    const intPart = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',')
    
    // Limit decimal places
    if (parts.length > 1) {
      const decimals = parts[1].slice(0, 10)
      return `${intPart}.${decimals}`
    }
    return intPart
  }

  // Clear all
  const clear = useCallback(() => {
    setDisplay('0')
    setExpression('')
    setPreviousValue(null)
    setOperation(null)
    setWaitingForOperand(false)
  }, [])

  // Input digit
  const inputDigit = useCallback((digit: string) => {
    if (waitingForOperand) {
      setDisplay(digit)
      setWaitingForOperand(false)
    } else {
      setDisplay(display === '0' ? digit : display + digit)
    }
  }, [display, waitingForOperand])

  // Input decimal
  const inputDecimal = useCallback(() => {
    if (waitingForOperand) {
      setDisplay('0.')
      setWaitingForOperand(false)
      return
    }
    if (!display.includes('.')) {
      setDisplay(display + '.')
    }
  }, [display, waitingForOperand])

  // Calculate result
  const calculate = (left: number, right: number, op: Operation): number => {
    switch (op) {
      case '+': return left + right
      case '-': return left - right
      case '×': return left * right
      case '÷': return right !== 0 ? left / right : NaN
      case '^': return Math.pow(left, right)
      default: return right
    }
  }

  // Handle operator
  const handleOperator = useCallback((nextOp: Operation) => {
    const inputValue = parseFloat(display)
    
    if (previousValue === null) {
      setPreviousValue(inputValue)
      setExpression(`${inputValue} ${nextOp}`)
    } else if (operation && !waitingForOperand) {
      const result = calculate(previousValue, inputValue, operation)
      setDisplay(String(result))
      setPreviousValue(result)
      setExpression(`${result} ${nextOp}`)
    } else {
      setExpression(`${previousValue} ${nextOp}`)
    }
    
    setOperation(nextOp)
    setWaitingForOperand(true)
  }, [display, previousValue, operation, waitingForOperand])

  // Equals
  const handleEquals = useCallback(() => {
    if (operation === null || previousValue === null) return
    
    const inputValue = parseFloat(display)
    const result = calculate(previousValue, inputValue, operation)
    const expr = `${previousValue} ${operation} ${inputValue}`
    
    // Add to history
    setHistory(prev => [{
      expression: expr,
      result: String(result),
      timestamp: new Date()
    }, ...prev.slice(0, 19)])
    
    setDisplay(String(result))
    setExpression(`${expr} =`)
    setPreviousValue(null)
    setOperation(null)
    setWaitingForOperand(true)
  }, [display, previousValue, operation])

  // Apply unary function
  const applyFunction = useCallback((key: string) => {
    const value = parseFloat(display)
    let result: number
    let expr: string
    
    // Find the function
    for (const group of Object.values(functionGroups)) {
      const fn = group.functions.find(f => f.key === key)
      if (fn) {
        // Handle trig functions with degree mode
        if (['sin', 'cos', 'tan', 'asin', 'acos', 'atan'].includes(key)) {
          result = (fn.fn as (x: number, deg: boolean) => number)(value, degreeMode)
          expr = `${fn.label}(${value}${degreeMode ? '°' : ''})`
        } else if (['pi', 'e', 'phi', 'random'].includes(key)) {
          result = (fn.fn as () => number)()
          expr = fn.label
        } else {
          result = (fn.fn as (x: number) => number)(value)
          expr = `${fn.label}(${value})`
        }
        
        setDisplay(String(result))
        setExpression(expr)
        setWaitingForOperand(true)
        return
      }
    }
  }, [display, degreeMode])

  // Memory functions
  const memoryClear = () => { setMemory(0); setHasMemory(false) }
  const memoryRecall = () => { if (hasMemory) { setDisplay(String(memory)); setWaitingForOperand(true) } }
  const memoryAdd = () => { setMemory(memory + parseFloat(display)); setHasMemory(true) }
  const memorySubtract = () => { setMemory(memory - parseFloat(display)); setHasMemory(true) }
  const memoryStore = () => { setMemory(parseFloat(display)); setHasMemory(true) }

  // Toggle group expansion
  const toggleGroup = (groupKey: string) => {
    setExpandedGroups(prev => 
      prev.includes(groupKey) 
        ? prev.filter(g => g !== groupKey)
        : [...prev, groupKey]
    )
  }

  // Copy to clipboard
  const copyResult = () => {
    navigator.clipboard.writeText(display)
  }

  // Recall from history
  const recallHistory = (entry: HistoryEntry) => {
    setDisplay(entry.result)
    setExpression(entry.expression + ' =')
    setWaitingForOperand(true)
  }

  // Keyboard support
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key >= '0' && e.key <= '9') inputDigit(e.key)
      else if (e.key === '.') inputDecimal()
      else if (e.key === '+') handleOperator('+')
      else if (e.key === '-') handleOperator('-')
      else if (e.key === '*') handleOperator('×')
      else if (e.key === '/') { e.preventDefault(); handleOperator('÷') }
      else if (e.key === '^') handleOperator('^')
      else if (e.key === 'Enter' || e.key === '=') handleEquals()
      else if (e.key === 'Escape') clear()
      else if (e.key === 'Backspace') {
        setDisplay(prev => prev.length > 1 ? prev.slice(0, -1) : '0')
      }
      else if (e.key === 'p' && e.ctrlKey) { e.preventDefault(); applyFunction('pi') }
    }
    
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [inputDigit, inputDecimal, handleOperator, handleEquals, clear, applyFunction])

  // Button component
  const Button = ({ 
    children, 
    onClick, 
    variant = 'number',
    className = ''
  }: { 
    children: React.ReactNode
    onClick: () => void
    variant?: 'number' | 'operator' | 'function' | 'equals' | 'clear' | 'memory'
    className?: string
  }) => {
    const baseStyles = "flex items-center justify-center rounded-lg font-mono transition-all active:scale-95 h-12"
    const variants = {
      number: "bg-white text-black hover:bg-neutral-100 border border-neutral-200",
      operator: "bg-neutral-200 text-black hover:bg-neutral-300",
      function: "bg-neutral-100 text-black hover:bg-neutral-200 text-sm",
      equals: "bg-black text-white hover:bg-neutral-800",
      clear: "bg-red-500 text-white hover:bg-red-600",
      memory: "bg-neutral-100 text-black/60 hover:bg-neutral-200 text-xs"
    }
    
    return (
      <button
        onClick={onClick}
        className={`${baseStyles} ${variants[variant]} ${className}`}
      >
        {children}
      </button>
    )
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Main Calculator */}
      <div className="lg:col-span-2 space-y-4">
        {/* Display */}
        <div className="bg-neutral-100 rounded-xl p-4">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              {/* Degree/Radian toggle */}
              <button
                onClick={() => setDegreeMode(!degreeMode)}
                className="text-xs font-mono px-2 py-1 rounded bg-neutral-200 hover:bg-neutral-300"
              >
                {degreeMode ? 'DEG' : 'RAD'}
              </button>
              {/* Memory indicator */}
              {hasMemory && (
                <span className="text-xs font-mono text-black/40">M</span>
              )}
            </div>
            <button
              onClick={copyResult}
              className="text-xs text-black/40 hover:text-black"
            >
              Copy
            </button>
          </div>
          <div className="text-black/40 font-mono text-sm h-6 truncate">
            {expression || ' '}
          </div>
          <div className="text-black font-mono text-4xl font-medium text-right truncate">
            {formatDisplay(display)}
          </div>
        </div>

        {/* Memory Row */}
        <div className="grid grid-cols-5 gap-2">
          <Button onClick={memoryClear} variant="memory">MC</Button>
          <Button onClick={memoryRecall} variant="memory">MR</Button>
          <Button onClick={memoryAdd} variant="memory">M+</Button>
          <Button onClick={memorySubtract} variant="memory">M−</Button>
          <Button onClick={memoryStore} variant="memory">MS</Button>
        </div>

        {/* Quick Scientific Row */}
        <div className="grid grid-cols-6 gap-2">
          <Button onClick={() => applyFunction('sin')} variant="function">sin</Button>
          <Button onClick={() => applyFunction('cos')} variant="function">cos</Button>
          <Button onClick={() => applyFunction('tan')} variant="function">tan</Button>
          <Button onClick={() => applyFunction('ln')} variant="function">ln</Button>
          <Button onClick={() => applyFunction('log10')} variant="function">log</Button>
          <Button onClick={() => applyFunction('sqrt')} variant="function">√</Button>
        </div>

        <div className="grid grid-cols-6 gap-2">
          <Button onClick={() => applyFunction('square')} variant="function">x²</Button>
          <Button onClick={() => applyFunction('cube')} variant="function">x³</Button>
          <Button onClick={() => handleOperator('^')} variant="function">xⁿ</Button>
          <Button onClick={() => applyFunction('pi')} variant="function">π</Button>
          <Button onClick={() => applyFunction('e')} variant="function">e</Button>
          <Button onClick={() => applyFunction('factorial')} variant="function">n!</Button>
        </div>

        {/* Main Button Grid */}
        <div className="grid grid-cols-4 gap-2">
          <Button onClick={clear} variant="clear">C</Button>
          <Button onClick={() => applyFunction('negate')} variant="operator">±</Button>
          <Button onClick={() => applyFunction('percent')} variant="operator">%</Button>
          <Button onClick={() => handleOperator('÷')} variant="operator">÷</Button>
          
          <Button onClick={() => inputDigit('7')} variant="number">7</Button>
          <Button onClick={() => inputDigit('8')} variant="number">8</Button>
          <Button onClick={() => inputDigit('9')} variant="number">9</Button>
          <Button onClick={() => handleOperator('×')} variant="operator">×</Button>
          
          <Button onClick={() => inputDigit('4')} variant="number">4</Button>
          <Button onClick={() => inputDigit('5')} variant="number">5</Button>
          <Button onClick={() => inputDigit('6')} variant="number">6</Button>
          <Button onClick={() => handleOperator('-')} variant="operator">−</Button>
          
          <Button onClick={() => inputDigit('1')} variant="number">1</Button>
          <Button onClick={() => inputDigit('2')} variant="number">2</Button>
          <Button onClick={() => inputDigit('3')} variant="number">3</Button>
          <Button onClick={() => handleOperator('+')} variant="operator">+</Button>
          
          <Button onClick={() => inputDigit('0')} variant="number" className="col-span-2">0</Button>
          <Button onClick={inputDecimal} variant="number">.</Button>
          <Button onClick={handleEquals} variant="equals">=</Button>
        </div>
      </div>

      {/* Function Palette & History */}
      <div className="space-y-4">
        {/* Toggle */}
        <div className="flex gap-1 p-1 bg-neutral-200 rounded-lg">
          <button
            onClick={() => setShowHistory(false)}
            className={`flex-1 py-2 rounded-md text-sm font-medium transition-colors ${
              !showHistory ? 'bg-white text-black' : 'text-black/50 hover:text-black'
            }`}
          >
            Functions
          </button>
          <button
            onClick={() => setShowHistory(true)}
            className={`flex-1 py-2 rounded-md text-sm font-medium transition-colors ${
              showHistory ? 'bg-white text-black' : 'text-black/50 hover:text-black'
            }`}
          >
            History
          </button>
        </div>

        {!showHistory ? (
          /* Function Groups */
          <div className="space-y-2 max-h-[500px] overflow-y-auto">
            {Object.entries(functionGroups).map(([key, group]) => (
              <div key={key} className="border border-neutral-200 rounded-lg overflow-hidden">
                <button
                  onClick={() => toggleGroup(key)}
                  className="w-full px-3 py-2 bg-neutral-100 text-left text-sm font-medium flex items-center justify-between"
                >
                  <span>{group.label}</span>
                  <span className="text-black/40">{expandedGroups.includes(key) ? '−' : '+'}</span>
                </button>
                {expandedGroups.includes(key) && (
                  <div className="p-2 grid grid-cols-3 gap-1">
                    {group.functions.map(fn => (
                      <button
                        key={fn.key}
                        onClick={() => applyFunction(fn.key)}
                        className="px-2 py-2 text-sm font-mono bg-white hover:bg-neutral-100 rounded border border-neutral-200"
                      >
                        {fn.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          /* History */
          <div className="space-y-2 max-h-[500px] overflow-y-auto">
            {history.length === 0 ? (
              <div className="text-center text-black/40 text-sm py-8">
                No calculations yet
              </div>
            ) : (
              history.map((entry, idx) => (
                <button
                  key={idx}
                  onClick={() => recallHistory(entry)}
                  className="w-full p-3 text-left bg-neutral-100 hover:bg-neutral-200 rounded-lg transition-colors"
                >
                  <div className="text-sm text-black/50 font-mono">{entry.expression}</div>
                  <div className="text-lg font-mono font-medium">= {entry.result}</div>
                </button>
              ))
            )}
            {history.length > 0 && (
              <button
                onClick={() => setHistory([])}
                className="w-full py-2 text-sm text-black/40 hover:text-black"
              >
                Clear History
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
