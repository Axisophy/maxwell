'use client'

import { useState, useMemo } from 'react'
import { 
  Home, Car, Plane, ShoppingBag, Utensils, Zap, 
  Leaf, TrendingDown, AlertCircle, Info, ChevronDown 
} from 'lucide-react'

// ===========================================
// PERSONAL SCALE VIEW
// ===========================================
// Carbon footprint calculator and personal impact explorer
// Connects individual choices to global trends

// Average UK carbon footprints by category (tonnes CO2e per year)
const UK_AVERAGES = {
  home: 2.5,      // Heating, electricity
  transport: 2.7,  // Car, public transport
  flights: 1.0,    // Average UK resident
  food: 1.5,       // Diet
  goods: 1.8,      // Stuff we buy
  services: 1.0,   // Services we use
}

const TOTAL_UK_AVERAGE = Object.values(UK_AVERAGES).reduce((a, b) => a + b, 0)

// What different choices mean
const ACTIVITY_CARBON = {
  // Flights (one-way, per person, economy)
  flightLondonNY: 0.9,
  flightLondonParis: 0.1,
  flightLondonSydney: 2.5,
  
  // Driving
  carPerMile: 0.00027, // Average UK car, tonnes CO2 per mile
  evPerMile: 0.00005,  // EV on UK grid
  
  // Food
  beefMeal: 0.006,     // Per meal
  chickenMeal: 0.0015,
  veganMeal: 0.0005,
  
  // Household
  gasBoilerYear: 2.0,
  heatPumpYear: 0.5,
  
  // Stuff
  newPhone: 0.07,
  newLaptop: 0.3,
  fastFashionItem: 0.02,
  newCar: 6.0,
}

interface FootprintInputs {
  homeType: 'flat' | 'terrace' | 'semi' | 'detached'
  heatingType: 'gas' | 'oil' | 'electric' | 'heatpump'
  carMilesYear: number
  carType: 'petrol' | 'diesel' | 'hybrid' | 'ev' | 'none'
  flightsShort: number
  flightsLong: number
  dietType: 'meat-heavy' | 'average' | 'meat-light' | 'vegetarian' | 'vegan'
  shoppingHabit: 'minimal' | 'average' | 'frequent'
}

const DEFAULT_INPUTS: FootprintInputs = {
  homeType: 'semi',
  heatingType: 'gas',
  carMilesYear: 7000,
  carType: 'petrol',
  flightsShort: 2,
  flightsLong: 1,
  dietType: 'average',
  shoppingHabit: 'average',
}

// Multipliers for calculations
const HOME_MULTIPLIERS = { flat: 0.6, terrace: 0.8, semi: 1.0, detached: 1.4 }
const HEATING_MULTIPLIERS = { gas: 1.0, oil: 1.2, electric: 0.8, heatpump: 0.3 }
const CAR_EMISSIONS = { petrol: 0.00027, diesel: 0.00026, hybrid: 0.00015, ev: 0.00005, none: 0 }
const DIET_EMISSIONS = { 'meat-heavy': 2.5, average: 1.5, 'meat-light': 1.2, vegetarian: 0.9, vegan: 0.6 }
const SHOPPING_MULTIPLIERS = { minimal: 0.5, average: 1.0, frequent: 1.8 }

export default function PersonalScaleView() {
  const [inputs, setInputs] = useState<FootprintInputs>(DEFAULT_INPUTS)
  const [showDetails, setShowDetails] = useState(false)
  
  // Calculate footprint
  const footprint = useMemo(() => {
    const home = UK_AVERAGES.home * HOME_MULTIPLIERS[inputs.homeType] * HEATING_MULTIPLIERS[inputs.heatingType]
    const transport = inputs.carMilesYear * CAR_EMISSIONS[inputs.carType]
    const flights = (inputs.flightsShort * 0.1) + (inputs.flightsLong * 0.9) * 2 // Round trips
    const food = DIET_EMISSIONS[inputs.dietType]
    const goods = UK_AVERAGES.goods * SHOPPING_MULTIPLIERS[inputs.shoppingHabit]
    const services = UK_AVERAGES.services
    
    const total = home + transport + flights + food + goods + services
    
    return { home, transport, flights, food, goods, services, total }
  }, [inputs])

  const comparedToAverage = ((footprint.total - TOTAL_UK_AVERAGE) / TOTAL_UK_AVERAGE) * 100
  
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-2xl border border-neutral-200 p-6">
        <h2 className="text-xl font-medium text-neutral-900 mb-2">
          Your Carbon Footprint
        </h2>
        <p className="text-sm text-neutral-600">
          Estimate your annual carbon footprint and see how different choices compare. 
          The UK average is about {TOTAL_UK_AVERAGE.toFixed(1)} tonnes CO₂e per person per year.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Calculator inputs */}
        <div className="lg:col-span-2 space-y-4">
          {/* Home */}
          <div className="bg-white rounded-2xl border border-neutral-200 p-5">
            <div className="flex items-center gap-2 mb-4">
              <Home className="w-5 h-5 text-amber-600" />
              <h3 className="font-medium text-neutral-900">Home</h3>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm text-neutral-600 mb-1.5 block">Home type</label>
                <select
                  value={inputs.homeType}
                  onChange={e => setInputs({...inputs, homeType: e.target.value as any})}
                  className="w-full px-3 py-2 border border-neutral-200 rounded-lg text-sm bg-white"
                >
                  <option value="flat">Flat / Apartment</option>
                  <option value="terrace">Terraced house</option>
                  <option value="semi">Semi-detached</option>
                  <option value="detached">Detached house</option>
                </select>
              </div>
              <div>
                <label className="text-sm text-neutral-600 mb-1.5 block">Heating</label>
                <select
                  value={inputs.heatingType}
                  onChange={e => setInputs({...inputs, heatingType: e.target.value as any})}
                  className="w-full px-3 py-2 border border-neutral-200 rounded-lg text-sm bg-white"
                >
                  <option value="gas">Gas boiler</option>
                  <option value="oil">Oil boiler</option>
                  <option value="electric">Electric heating</option>
                  <option value="heatpump">Heat pump</option>
                </select>
              </div>
            </div>
          </div>

          {/* Transport */}
          <div className="bg-white rounded-2xl border border-neutral-200 p-5">
            <div className="flex items-center gap-2 mb-4">
              <Car className="w-5 h-5 text-blue-600" />
              <h3 className="font-medium text-neutral-900">Transport</h3>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm text-neutral-600 mb-1.5 block">Car type</label>
                <select
                  value={inputs.carType}
                  onChange={e => setInputs({...inputs, carType: e.target.value as any})}
                  className="w-full px-3 py-2 border border-neutral-200 rounded-lg text-sm bg-white"
                >
                  <option value="petrol">Petrol</option>
                  <option value="diesel">Diesel</option>
                  <option value="hybrid">Hybrid</option>
                  <option value="ev">Electric</option>
                  <option value="none">No car</option>
                </select>
              </div>
              <div>
                <label className="text-sm text-neutral-600 mb-1.5 block">Miles per year</label>
                <input
                  type="number"
                  value={inputs.carMilesYear}
                  onChange={e => setInputs({...inputs, carMilesYear: parseInt(e.target.value) || 0})}
                  className="w-full px-3 py-2 border border-neutral-200 rounded-lg text-sm"
                  placeholder="7000"
                />
              </div>
            </div>
          </div>

          {/* Flights */}
          <div className="bg-white rounded-2xl border border-neutral-200 p-5">
            <div className="flex items-center gap-2 mb-4">
              <Plane className="w-5 h-5 text-purple-600" />
              <h3 className="font-medium text-neutral-900">Flights (per year)</h3>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm text-neutral-600 mb-1.5 block">Short-haul flights</label>
                <input
                  type="number"
                  value={inputs.flightsShort}
                  onChange={e => setInputs({...inputs, flightsShort: parseInt(e.target.value) || 0})}
                  className="w-full px-3 py-2 border border-neutral-200 rounded-lg text-sm"
                  min="0"
                />
                <p className="text-xs text-neutral-400 mt-1">~0.1t CO₂ each (e.g., London-Paris)</p>
              </div>
              <div>
                <label className="text-sm text-neutral-600 mb-1.5 block">Long-haul flights</label>
                <input
                  type="number"
                  value={inputs.flightsLong}
                  onChange={e => setInputs({...inputs, flightsLong: parseInt(e.target.value) || 0})}
                  className="w-full px-3 py-2 border border-neutral-200 rounded-lg text-sm"
                  min="0"
                />
                <p className="text-xs text-neutral-400 mt-1">~0.9t CO₂ each (e.g., London-NYC)</p>
              </div>
            </div>
          </div>

          {/* Diet */}
          <div className="bg-white rounded-2xl border border-neutral-200 p-5">
            <div className="flex items-center gap-2 mb-4">
              <Utensils className="w-5 h-5 text-green-600" />
              <h3 className="font-medium text-neutral-900">Diet</h3>
            </div>
            
            <div className="flex flex-wrap gap-2">
              {[
                { value: 'meat-heavy', label: 'Meat-heavy', desc: 'Meat most meals' },
                { value: 'average', label: 'Average UK', desc: 'Some meat' },
                { value: 'meat-light', label: 'Meat-light', desc: 'Occasional meat' },
                { value: 'vegetarian', label: 'Vegetarian', desc: 'No meat' },
                { value: 'vegan', label: 'Vegan', desc: 'Plant-based' },
              ].map(option => (
                <button
                  key={option.value}
                  onClick={() => setInputs({...inputs, dietType: option.value as any})}
                  className={`
                    px-4 py-2 rounded-lg text-sm transition-all
                    ${inputs.dietType === option.value
                      ? 'bg-green-100 text-green-800 ring-2 ring-green-500 ring-offset-1'
                      : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'
                    }
                  `}
                >
                  <div className="font-medium">{option.label}</div>
                  <div className="text-xs opacity-70">{option.desc}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Shopping */}
          <div className="bg-white rounded-2xl border border-neutral-200 p-5">
            <div className="flex items-center gap-2 mb-4">
              <ShoppingBag className="w-5 h-5 text-pink-600" />
              <h3 className="font-medium text-neutral-900">Shopping & Goods</h3>
            </div>
            
            <div className="flex flex-wrap gap-2">
              {[
                { value: 'minimal', label: 'Minimal', desc: 'Buy only essentials' },
                { value: 'average', label: 'Average', desc: 'Typical UK consumer' },
                { value: 'frequent', label: 'Frequent', desc: 'Lots of new stuff' },
              ].map(option => (
                <button
                  key={option.value}
                  onClick={() => setInputs({...inputs, shoppingHabit: option.value as any})}
                  className={`
                    px-4 py-2 rounded-lg text-sm transition-all
                    ${inputs.shoppingHabit === option.value
                      ? 'bg-pink-100 text-pink-800 ring-2 ring-pink-500 ring-offset-1'
                      : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'
                    }
                  `}
                >
                  <div className="font-medium">{option.label}</div>
                  <div className="text-xs opacity-70">{option.desc}</div>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Results panel */}
        <div className="space-y-4">
          {/* Total */}
          <div className="bg-white rounded-2xl border border-neutral-200 p-6 sticky top-4">
            <h3 className="text-sm font-medium text-neutral-500 uppercase tracking-wider mb-3">
              Your Annual Footprint
            </h3>
            
            <div className="text-center mb-4">
              <div className="text-5xl font-bold text-neutral-900">
                {footprint.total.toFixed(1)}
              </div>
              <div className="text-neutral-500">tonnes CO₂e / year</div>
            </div>

            {/* Comparison */}
            <div className={`
              p-3 rounded-lg text-sm text-center mb-4
              ${comparedToAverage > 0 ? 'bg-amber-50 text-amber-800' : 'bg-green-50 text-green-800'}
            `}>
              {comparedToAverage > 0 ? (
                <>
                  <AlertCircle className="w-4 h-4 inline mr-1" />
                  {Math.abs(comparedToAverage).toFixed(0)}% above UK average
                </>
              ) : (
                <>
                  <Leaf className="w-4 h-4 inline mr-1" />
                  {Math.abs(comparedToAverage).toFixed(0)}% below UK average
                </>
              )}
            </div>

            {/* Breakdown */}
            <div className="space-y-2">
              <BreakdownBar label="Home" value={footprint.home} max={footprint.total} color="bg-amber-400" />
              <BreakdownBar label="Transport" value={footprint.transport} max={footprint.total} color="bg-blue-400" />
              <BreakdownBar label="Flights" value={footprint.flights} max={footprint.total} color="bg-purple-400" />
              <BreakdownBar label="Food" value={footprint.food} max={footprint.total} color="bg-green-400" />
              <BreakdownBar label="Goods" value={footprint.goods} max={footprint.total} color="bg-pink-400" />
              <BreakdownBar label="Services" value={footprint.services} max={footprint.total} color="bg-neutral-400" />
            </div>

            {/* Context */}
            <button
              onClick={() => setShowDetails(!showDetails)}
              className="w-full mt-4 px-3 py-2 text-sm text-neutral-600 hover:text-neutral-900 flex items-center justify-center gap-1"
            >
              <span>What does this mean?</span>
              <ChevronDown className={`w-4 h-4 transition-transform ${showDetails ? 'rotate-180' : ''}`} />
            </button>

            {showDetails && (
              <div className="mt-3 p-3 bg-neutral-50 rounded-lg text-sm text-neutral-600 space-y-2">
                <p>
                  <strong>To limit warming to 1.5°C,</strong> we need to reach about 2 tonnes per person 
                  globally by 2050.
                </p>
                <p>
                  <strong>Global average:</strong> 4.7 tonnes per person
                </p>
                <p>
                  <strong>US average:</strong> 15.5 tonnes per person
                </p>
              </div>
            )}
          </div>

          {/* Big impact swaps */}
          <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl border border-green-200 p-5">
            <h4 className="font-medium text-green-900 mb-3 flex items-center gap-2">
              <TrendingDown className="w-5 h-5" />
              Biggest Impact Swaps
            </h4>
            <div className="space-y-2 text-sm">
              <SwapSuggestion 
                from="Gas boiler" 
                to="Heat pump" 
                saving="~1.5t/year"
              />
              <SwapSuggestion 
                from="1 long-haul flight" 
                to="Skip it" 
                saving="~1.8t/year"
              />
              <SwapSuggestion 
                from="Meat-heavy diet" 
                to="Vegetarian" 
                saving="~1.6t/year"
              />
              <SwapSuggestion 
                from="Petrol car 10k mi" 
                to="EV on UK grid" 
                saving="~2.2t/year"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Global context */}
      <div className="bg-white rounded-2xl border border-neutral-200 p-6">
        <h3 className="text-lg font-medium text-neutral-900 mb-4">
          Individual vs Systemic
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <p className="text-sm text-neutral-600 mb-3">
              Personal footprint matters, but context matters more. 100 companies are responsible 
              for 71% of global emissions. Many choices are constrained by infrastructure, policy, 
              and economics.
            </p>
            <p className="text-sm text-neutral-600">
              The most impactful individual actions are often <em>collective</em>: voting, 
              advocating, supporting policy change, and shifting social norms.
            </p>
          </div>
          <div className="p-4 bg-neutral-50 rounded-xl">
            <h4 className="font-medium text-neutral-900 mb-2">Beyond your footprint</h4>
            <ul className="space-y-1.5 text-sm text-neutral-600">
              <li>• Vote for climate-serious candidates</li>
              <li>• Support climate litigation and advocacy</li>
              <li>• Talk about climate with friends and family</li>
              <li>• Choose employers with climate plans</li>
              <li>• Move money to climate-aligned banks/pensions</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}

// Helper components
function BreakdownBar({ 
  label, 
  value, 
  max, 
  color 
}: { 
  label: string
  value: number
  max: number
  color: string 
}) {
  const percentage = (value / max) * 100
  
  return (
    <div className="flex items-center gap-2">
      <div className="w-20 text-xs text-neutral-600">{label}</div>
      <div className="flex-1 h-4 bg-neutral-100 rounded-full overflow-hidden">
        <div 
          className={`h-full ${color} rounded-full transition-all`}
          style={{ width: `${percentage}%` }}
        />
      </div>
      <div className="w-12 text-right text-xs font-mono text-neutral-600">
        {value.toFixed(1)}t
      </div>
    </div>
  )
}

function SwapSuggestion({ 
  from, 
  to, 
  saving 
}: { 
  from: string
  to: string
  saving: string 
}) {
  return (
    <div className="flex items-center gap-2 p-2 bg-white/60 rounded-lg">
      <div className="flex-1">
        <span className="text-red-600 line-through opacity-70">{from}</span>
        {' → '}
        <span className="text-green-700 font-medium">{to}</span>
      </div>
      <div className="text-green-600 font-mono text-xs">{saving}</div>
    </div>
  )
}