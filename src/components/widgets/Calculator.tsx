'use client'

import { useState, useCallback, useEffect, useRef } from 'react'
import Link from 'next/link'

// Calculator Widget for /tools dashboard
// Provides basic + select scientific functions at widget scale

interface CalculatorProps {
  className?: string
}

type Operation = '+' | '-' | '×' | '÷' | null

export default function Calculator({ className = '' }: CalculatorProps) {
  const [display, setDisplay] = useState('0')
  const [expression, setExpression] = useState('')
  const [previousValue, setPreviousValue] = useState<number | null>(null)
  const [operation, setOperation] = useState<Operation>(null)
  const [waitingForOperand, setWaitingForOperand] = useState(false)
  const [lastButtonWasEquals, setLastButtonWasEquals] = useState(false)
  
  const containerRef = useRef<HTMLDivElement>(null)
  const [baseFontSize, setBaseFontSize] = useState(16)

  // Responsive scaling
  useEffect(() => {
    const updateSize = () => {
      if (containerRef.current) {
        const width = containerRef.current.clientWidth
        setBaseFontSize(Math.max(12, Math.min(18, width / 22)))
      }
    }
    updateSize()
    const observer = new ResizeObserver(updateSize)
    if (containerRef.current) observer.observe(containerRef.current)
    return () => observer.disconnect()
  }, [])

  // Format number for display
  const formatDisplay = (num: string): string => {
    const parts = num.split('.')
    const intPart = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',')
    return parts.length > 1 ? `${intPart}.${parts[1]}` : intPart
  }

  // Input digit
  const inputDigit = useCallback((digit: string) => {
    if (lastButtonWasEquals) {
      setDisplay(digit)
      setExpression(digit)
      setLastButtonWasEquals(false)
      return
    }
    
    if (waitingForOperand) {
      setDisplay(digit)
      setWaitingForOperand(false)
    } else {
      setDisplay(display === '0' ? digit : display + digit)
    }
    setExpression(prev => waitingForOperand ? prev + digit : (display === '0' ? digit : prev + digit))
  }, [display, waitingForOperand, lastButtonWasEquals])

  // Input decimal
  const inputDecimal = useCallback(() => {
    if (lastButtonWasEquals) {
      setDisplay('0.')
      setExpression('0.')
      setLastButtonWasEquals(false)
      return
    }
    
    if (waitingForOperand) {
      setDisplay('0.')
      setExpression(prev => prev + '0.')
      setWaitingForOperand(false)
      return
    }
    
    if (!display.includes('.')) {
      setDisplay(display + '.')
      setExpression(prev => prev + '.')
    }
  }, [display, waitingForOperand, lastButtonWasEquals])

  // Clear
  const clear = useCallback(() => {
    setDisplay('0')
    setExpression('')
    setPreviousValue(null)
    setOperation(null)
    setWaitingForOperand(false)
    setLastButtonWasEquals(false)
  }, [])

  // Toggle sign
  const toggleSign = useCallback(() => {
    const value = parseFloat(display)
    setDisplay(String(-value))
  }, [display])

  // Percentage
  const percentage = useCallback(() => {
    const value = parseFloat(display)
    setDisplay(String(value / 100))
  }, [display])

  // Perform calculation
  const calculate = (left: number, right: number, op: Operation): number => {
    switch (op) {
      case '+': return left + right
      case '-': return left - right
      case '×': return left * right
      case '÷': return right !== 0 ? left / right : 0
      default: return right
    }
  }

  // Handle operator
  const handleOperator = useCallback((nextOp: Operation) => {
    const inputValue = parseFloat(display)
    
    if (previousValue === null) {
      setPreviousValue(inputValue)
    } else if (operation && !waitingForOperand) {
      const result = calculate(previousValue, inputValue, operation)
      setDisplay(String(result))
      setPreviousValue(result)
    }
    
    setOperation(nextOp)
    setWaitingForOperand(true)
    setExpression(prev => prev + ` ${nextOp} `)
    setLastButtonWasEquals(false)
  }, [display, previousValue, operation, waitingForOperand])

  // Equals
  const handleEquals = useCallback(() => {
    if (operation === null || previousValue === null) return
    
    const inputValue = parseFloat(display)
    const result = calculate(previousValue, inputValue, operation)
    
    setDisplay(String(result))
    setExpression(`${result}`)
    setPreviousValue(null)
    setOperation(null)
    setWaitingForOperand(false)
    setLastButtonWasEquals(true)
  }, [display, previousValue, operation])

  // Scientific functions
  const scientificFunction = useCallback((fn: string) => {
    const value = parseFloat(display)
    let result: number
    
    switch (fn) {
      case 'sin':
        result = Math.sin(value * Math.PI / 180) // Degrees
        setExpression(`sin(${value}°)`)
        break
      case 'cos':
        result = Math.cos(value * Math.PI / 180)
        setExpression(`cos(${value}°)`)
        break
      case 'tan':
        result = Math.tan(value * Math.PI / 180)
        setExpression(`tan(${value}°)`)
        break
      case 'sqrt':
        result = Math.sqrt(value)
        setExpression(`√(${value})`)
        break
      case 'square':
        result = value * value
        setExpression(`${value}²`)
        break
      case 'pi':
        result = Math.PI
        setExpression('π')
        break
      case 'e':
        result = Math.E
        setExpression('e')
        break
      default:
        result = value
    }
    
    setDisplay(String(result))
    setWaitingForOperand(true)
    setLastButtonWasEquals(true)
  }, [display])

  // Keyboard support
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key >= '0' && e.key <= '9') inputDigit(e.key)
      else if (e.key === '.') inputDecimal()
      else if (e.key === '+') handleOperator('+')
      else if (e.key === '-') handleOperator('-')
      else if (e.key === '*') handleOperator('×')
      else if (e.key === '/') { e.preventDefault(); handleOperator('÷') }
      else if (e.key === 'Enter' || e.key === '=') handleEquals()
      else if (e.key === 'Escape' || e.key === 'c') clear()
      else if (e.key === 'Backspace') {
        setDisplay(prev => prev.length > 1 ? prev.slice(0, -1) : '0')
      }
    }
    
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [inputDigit, inputDecimal, handleOperator, handleEquals, clear])

  // Button component
  const Button = ({ 
    children, 
    onClick, 
    variant = 'number',
    span = 1 
  }: { 
    children: React.ReactNode
    onClick: () => void
    variant?: 'number' | 'operator' | 'function' | 'equals' | 'clear'
    span?: number
  }) => {
    const baseStyles = "flex items-center justify-center rounded-lg font-mono font-medium transition-all active:scale-95"
    const variants = {
      number: "bg-white text-black hover:bg-neutral-100",
      operator: "bg-neutral-200 text-black hover:bg-neutral-300",
      function: "bg-neutral-200 text-black hover:bg-neutral-300 text-[0.75em]",
      equals: "bg-black text-white hover:bg-neutral-800",
      clear: "bg-red-500 text-white hover:bg-red-600"
    }
    
    return (
      <button
        onClick={onClick}
        className={`${baseStyles} ${variants[variant]}`}
        style={{ 
          height: '2.75em',
          gridColumn: span > 1 ? `span ${span}` : undefined,
          fontSize: '1em'
        }}
      >
        {children}
      </button>
    )
  }

  return (
    <div 
      ref={containerRef}
      className={`flex flex-col ${className}`}
      style={{ fontSize: `${baseFontSize}px` }}
    >
      {/* Widget Frame */}
      <div className="bg-[#e5e5e5] rounded-xl px-[1em] py-[0.75em] flex items-center justify-between">
        <span className="font-sans text-[1.125em] text-black">Calculator</span>
        <div className="w-[0.5em] h-[0.5em] rounded-full bg-green-500" />
      </div>
      
      {/* Widget Content */}
      <div className="mt-[0.5em] bg-white rounded-xl p-[1em] flex flex-col gap-[0.75em]">
        {/* Display */}
        <div className="bg-neutral-100 rounded-lg p-[0.75em] min-h-[4em]">
          <div className="text-black/40 font-mono text-[0.75em] h-[1.5em] truncate">
            {expression || ' '}
          </div>
          <div className="text-black font-mono text-[1.75em] font-medium text-right truncate">
            {formatDisplay(display)}
          </div>
        </div>
        
        {/* Scientific Row */}
        <div className="grid grid-cols-6 gap-[0.375em]">
          <Button onClick={() => scientificFunction('sin')} variant="function">sin</Button>
          <Button onClick={() => scientificFunction('cos')} variant="function">cos</Button>
          <Button onClick={() => scientificFunction('tan')} variant="function">tan</Button>
          <Button onClick={() => scientificFunction('pi')} variant="function">π</Button>
          <Button onClick={() => scientificFunction('e')} variant="function">e</Button>
          <Button onClick={() => scientificFunction('sqrt')} variant="function">√</Button>
        </div>
        
        {/* Main Grid */}
        <div className="grid grid-cols-4 gap-[0.375em]">
          <Button onClick={clear} variant="clear">C</Button>
          <Button onClick={toggleSign} variant="operator">±</Button>
          <Button onClick={percentage} variant="operator">%</Button>
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
          
          <Button onClick={() => inputDigit('0')} variant="number" span={2}>0</Button>
          <Button onClick={inputDecimal} variant="number">.</Button>
          <Button onClick={handleEquals} variant="equals">=</Button>
        </div>
        
        {/* Link to full calculator */}
        <Link 
          href="/tools/calculator"
          className="text-center text-[0.75em] text-black/50 hover:text-black transition-colors py-[0.5em]"
        >
          Open Full Calculator →
        </Link>
      </div>
    </div>
  )
}
