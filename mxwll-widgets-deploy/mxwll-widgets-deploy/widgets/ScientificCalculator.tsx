'use client'

import { useState, useEffect, useRef } from 'react'

// ===========================================
// SCIENTIFIC CALCULATOR
// ===========================================
// Full scientific calculator functionality
// Design: Vintage Casio fx-82 aesthetic
// ===========================================

export default function ScientificCalculator() {
  const containerRef = useRef<HTMLDivElement>(null)
  const [baseFontSize, setBaseFontSize] = useState(16)
  const [display, setDisplay] = useState('0')
  const [memory, setMemory] = useState(0)
  const [lastOp, setLastOp] = useState<string | null>(null)
  const [lastNum, setLastNum] = useState<number | null>(null)
  const [newNumber, setNewNumber] = useState(true)
  const [mode, setMode] = useState<'DEG' | 'RAD'>('DEG')
  const [shift, setShift] = useState(false)
  
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
  
  const toRad = (deg: number) => deg * Math.PI / 180
  const toDeg = (rad: number) => rad * 180 / Math.PI
  
  const handleNumber = (n: string) => {
    if (newNumber) {
      setDisplay(n === '.' ? '0.' : n)
      setNewNumber(false)
    } else {
      if (n === '.' && display.includes('.')) return
      if (display === '0' && n !== '.') {
        setDisplay(n)
      } else {
        setDisplay(display + n)
      }
    }
    setShift(false)
  }
  
  const calculate = (op: string, a: number, b: number): number => {
    switch (op) {
      case '+': return a + b
      case '-': return a - b
      case '×': return a * b
      case '÷': return b === 0 ? NaN : a / b
      case 'yˣ': return Math.pow(a, b)
      case 'ˣ√y': return Math.pow(a, 1/b)
      default: return b
    }
  }
  
  const handleOperator = (op: string) => {
    const current = parseFloat(display)
    
    if (lastOp && lastNum !== null && !newNumber) {
      const result = calculate(lastOp, lastNum, current)
      setDisplay(String(result))
      setLastNum(result)
    } else {
      setLastNum(current)
    }
    
    setLastOp(op)
    setNewNumber(true)
    setShift(false)
  }
  
  const handleEquals = () => {
    if (lastOp && lastNum !== null) {
      const current = parseFloat(display)
      const result = calculate(lastOp, lastNum, current)
      setDisplay(String(result))
      setLastOp(null)
      setLastNum(null)
      setNewNumber(true)
    }
    setShift(false)
  }
  
  const handleFunction = (fn: string) => {
    const x = parseFloat(display)
    let result: number
    
    switch (fn) {
      case 'sin':
        result = mode === 'DEG' ? Math.sin(toRad(x)) : Math.sin(x)
        break
      case 'cos':
        result = mode === 'DEG' ? Math.cos(toRad(x)) : Math.cos(x)
        break
      case 'tan':
        result = mode === 'DEG' ? Math.tan(toRad(x)) : Math.tan(x)
        break
      case 'asin':
        result = mode === 'DEG' ? toDeg(Math.asin(x)) : Math.asin(x)
        break
      case 'acos':
        result = mode === 'DEG' ? toDeg(Math.acos(x)) : Math.acos(x)
        break
      case 'atan':
        result = mode === 'DEG' ? toDeg(Math.atan(x)) : Math.atan(x)
        break
      case 'ln':
        result = Math.log(x)
        break
      case 'log':
        result = Math.log10(x)
        break
      case '10ˣ':
        result = Math.pow(10, x)
        break
      case 'eˣ':
        result = Math.exp(x)
        break
      case 'x²':
        result = x * x
        break
      case '√':
        result = Math.sqrt(x)
        break
      case '1/x':
        result = 1 / x
        break
      case 'x!':
        result = factorial(Math.floor(x))
        break
      case '±':
        result = -x
        break
      case '%':
        result = x / 100
        break
      case 'π':
        result = Math.PI
        break
      case 'e':
        result = Math.E
        break
      default:
        result = x
    }
    
    setDisplay(String(result))
    setNewNumber(true)
    setShift(false)
  }
  
  const factorial = (n: number): number => {
    if (n < 0) return NaN
    if (n <= 1) return 1
    return n * factorial(n - 1)
  }
  
  const handleClear = () => {
    setDisplay('0')
    setLastOp(null)
    setLastNum(null)
    setNewNumber(true)
    setShift(false)
  }
  
  const handleMemory = (action: 'MC' | 'MR' | 'M+' | 'M-') => {
    switch (action) {
      case 'MC':
        setMemory(0)
        break
      case 'MR':
        setDisplay(String(memory))
        setNewNumber(true)
        break
      case 'M+':
        setMemory(memory + parseFloat(display))
        setNewNumber(true)
        break
      case 'M-':
        setMemory(memory - parseFloat(display))
        setNewNumber(true)
        break
    }
    setShift(false)
  }
  
  const Button = ({ label, shiftLabel, onClick, className = '', wide = false }: {
    label: string
    shiftLabel?: string
    onClick: () => void
    className?: string
    wide?: boolean
  }) => (
    <button
      onClick={onClick}
      className={`relative ${wide ? 'col-span-2' : ''} h-[2em] rounded-[0.25em] text-[0.625em] font-medium transition-all active:scale-95 ${className}`}
    >
      {shiftLabel && (
        <span className={`absolute top-[0.125em] left-[0.25em] text-[0.625em] ${shift ? 'text-[#e65100]' : 'text-black/20'}`}>
          {shiftLabel}
        </span>
      )}
      {label}
    </button>
  )
  
  const formatDisplay = (val: string): string => {
    const num = parseFloat(val)
    if (isNaN(num)) return 'Error'
    if (!isFinite(num)) return num > 0 ? '∞' : '-∞'
    if (Math.abs(num) > 1e10 || (Math.abs(num) < 1e-6 && num !== 0)) {
      return num.toExponential(6)
    }
    if (val.length > 12) return num.toPrecision(10)
    return val
  }
  
  return (
    <div ref={containerRef} style={{ fontSize: `${baseFontSize}px` }} className="bg-[#2d3436] rounded-xl p-[0.75em] h-full flex flex-col">
      {/* Brand */}
      <div className="flex items-center justify-between mb-[0.375em]">
        <div className="text-[0.5em] font-bold text-white/60 tracking-wider">MXWLL</div>
        <div className="text-[0.4375em] text-white/40">fx-82 SCIENTIFIC</div>
      </div>
      
      {/* Display */}
      <div className="bg-[#a8b5a0] rounded-[0.25em] p-[0.5em] mb-[0.5em]">
        <div className="flex items-center justify-between mb-[0.125em]">
          <div className="flex gap-[0.5em] text-[0.4375em] text-[#2d3436]/60">
            <span className={mode === 'DEG' ? 'font-bold' : ''}>DEG</span>
            <span className={mode === 'RAD' ? 'font-bold' : ''}>RAD</span>
          </div>
          <div className="flex gap-[0.375em] text-[0.4375em] text-[#2d3436]/60">
            {memory !== 0 && <span>M</span>}
            {shift && <span className="text-[#e65100] font-bold">SHIFT</span>}
          </div>
        </div>
        <div className="font-mono text-[1.5em] text-[#2d3436] text-right tracking-wider overflow-hidden">
          {formatDisplay(display)}
        </div>
      </div>
      
      {/* Buttons */}
      <div className="flex-1 grid grid-cols-5 gap-[0.25em]">
        {/* Row 1 - Shift and Mode */}
        <Button label="SHIFT" onClick={() => setShift(!shift)} className={`${shift ? 'bg-[#e65100] text-white' : 'bg-[#636e72] text-white'}`} />
        <Button label={mode} onClick={() => setMode(mode === 'DEG' ? 'RAD' : 'DEG')} className="bg-[#636e72] text-white" />
        <Button label="(" onClick={() => handleNumber('(')} className="bg-[#636e72] text-white" />
        <Button label=")" onClick={() => handleNumber(')')} className="bg-[#636e72] text-white" />
        <Button label="AC" onClick={handleClear} className="bg-[#d63031] text-white" />
        
        {/* Row 2 - Functions */}
        <Button label="x²" shiftLabel="√" onClick={() => handleFunction(shift ? '√' : 'x²')} className="bg-[#b2bec3] text-black" />
        <Button label="xʸ" shiftLabel="ˣ√y" onClick={() => handleOperator(shift ? 'ˣ√y' : 'yˣ')} className="bg-[#b2bec3] text-black" />
        <Button label="log" shiftLabel="10ˣ" onClick={() => handleFunction(shift ? '10ˣ' : 'log')} className="bg-[#b2bec3] text-black" />
        <Button label="ln" shiftLabel="eˣ" onClick={() => handleFunction(shift ? 'eˣ' : 'ln')} className="bg-[#b2bec3] text-black" />
        <Button label="÷" onClick={() => handleOperator('÷')} className="bg-[#fdcb6e] text-black" />
        
        {/* Row 3 - Trig */}
        <Button label="sin" shiftLabel="sin⁻¹" onClick={() => handleFunction(shift ? 'asin' : 'sin')} className="bg-[#b2bec3] text-black" />
        <Button label="7" onClick={() => handleNumber('7')} className="bg-white text-black" />
        <Button label="8" onClick={() => handleNumber('8')} className="bg-white text-black" />
        <Button label="9" onClick={() => handleNumber('9')} className="bg-white text-black" />
        <Button label="×" onClick={() => handleOperator('×')} className="bg-[#fdcb6e] text-black" />
        
        {/* Row 4 */}
        <Button label="cos" shiftLabel="cos⁻¹" onClick={() => handleFunction(shift ? 'acos' : 'cos')} className="bg-[#b2bec3] text-black" />
        <Button label="4" onClick={() => handleNumber('4')} className="bg-white text-black" />
        <Button label="5" onClick={() => handleNumber('5')} className="bg-white text-black" />
        <Button label="6" onClick={() => handleNumber('6')} className="bg-white text-black" />
        <Button label="-" onClick={() => handleOperator('-')} className="bg-[#fdcb6e] text-black" />
        
        {/* Row 5 */}
        <Button label="tan" shiftLabel="tan⁻¹" onClick={() => handleFunction(shift ? 'atan' : 'tan')} className="bg-[#b2bec3] text-black" />
        <Button label="1" onClick={() => handleNumber('1')} className="bg-white text-black" />
        <Button label="2" onClick={() => handleNumber('2')} className="bg-white text-black" />
        <Button label="3" onClick={() => handleNumber('3')} className="bg-white text-black" />
        <Button label="+" onClick={() => handleOperator('+')} className="bg-[#fdcb6e] text-black" />
        
        {/* Row 6 */}
        <Button label="π" shiftLabel="e" onClick={() => handleFunction(shift ? 'e' : 'π')} className="bg-[#b2bec3] text-black" />
        <Button label="0" onClick={() => handleNumber('0')} className="bg-white text-black" />
        <Button label="." onClick={() => handleNumber('.')} className="bg-white text-black" />
        <Button label="±" onClick={() => handleFunction('±')} className="bg-[#b2bec3] text-black" />
        <Button label="=" onClick={handleEquals} className="bg-[#0984e3] text-white" />
      </div>
      
      {/* Memory buttons */}
      <div className="mt-[0.375em] flex gap-[0.25em]">
        {(['MC', 'MR', 'M+', 'M-'] as const).map(m => (
          <button
            key={m}
            onClick={() => handleMemory(m)}
            className="flex-1 h-[1.5em] rounded-[0.25em] text-[0.5em] font-medium bg-[#74b9ff] text-black active:scale-95"
          >
            {m}
          </button>
        ))}
        <button
          onClick={() => handleFunction('x!')}
          className="flex-1 h-[1.5em] rounded-[0.25em] text-[0.5em] font-medium bg-[#b2bec3] text-black active:scale-95"
        >
          x!
        </button>
      </div>
    </div>
  )
}
