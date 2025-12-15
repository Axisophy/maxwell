# MXWLL Widget Deployment Package

**Generated:** December 15, 2025  
**Total Widgets:** 28

---

## Quick Start

1. Copy widget files to `src/components/widgets/`
2. Import and wrap each in `<WidgetFrame>` with appropriate props
3. Add to relevant section pages as documented below

---

## Widget Deployment Map

### OBSERVE Section (`/observe`)

Live data widgets for the main dashboard and Your Dashboard.

| File | Widget Name | Description | API/Data Source |
|------|-------------|-------------|-----------------|
| `ActiveFires.tsx` | Active Fires | Global wildfire monitoring | NASA FIRMS |
| `CosmicRaysThrough.tsx` | Cosmic Rays Through You | Personal cosmic ray flux calculator | NMDB + calculation |
| `eBirdLive.tsx` | eBird Live | Recent bird observations | Cornell eBird |
| `EuropeanRadiationMap.tsx` | European Radiation | Radiation monitoring network | EURDEP |
| `GlacierWatch.tsx` | Glacier Watch | Global glacier monitoring | WGMS data |
| `iNaturalistLive.tsx` | iNaturalist Live | Citizen science observations | iNaturalist API |
| `ISSLivePosition.tsx` | ISS Live Position | Real-time ISS tracking | Open Notify |
| `JWSTLatest.tsx` | JWST Latest | Webb telescope images | STScI |
| `MagneticField.tsx` | Magnetic Field | Earth's magnetic field data | NOAA geomagnetic |
| `MagneticFieldStrength.tsx` | Magnetic Field Strength | Local field strength | NOAA + calculation |
| `MarsRoverImages.tsx` | Mars Rover Images | Latest rover photos | NASA Mars API |
| `OceanHydrophones.tsx` | Ocean Hydrophones | Deep sea audio feeds | ONC/MBARI |
| `PollenForecast.tsx` | Pollen Forecast | Pollen count by location | Pollen APIs |
| `SeismographGrid.tsx` | Seismograph Grid | Live seismic waveforms | IRIS network |
| `StarMap.tsx` | Star Map | Interactive night sky | Astronomical calculation |
| `WhatsBelowYou.tsx` | What's Below You | Geological layers to Earth's core | Static data |
| `YourAirJourney.tsx` | Your Air's Journey | Air mass back-trajectory | HYSPLIT model |
| `YourAirsJourney.tsx` | Your Air's Journey (alt) | Air mass tracking | HYSPLIT model |
| `YourBackgroundDose.tsx` | Your Background Dose | Personal radiation exposure | Calculation |
| `YourSkyWhenBorn.tsx` | Your Sky When Born | Birth date star map | Astronomical calculation |

### TOOLS Section (`/tools`)

Scientific instruments and calculators.

| File | Widget Name | Destination | Description |
|------|-------------|-------------|-------------|
| `ScientificCalculator.tsx` | Scientific Calculator | `/tools/calculate` | Full scientific calc, Casio aesthetic |
| `UnitConverter.tsx` | Unit Converter | `/tools/calculate` | Multi-category unit conversion |
| `StopwatchTimer.tsx` | Stopwatch & Timer | `/tools/measure` | Precision timing instrument |
| `ThePlotter.tsx` | The Plotter | `/tools/explore` | Function graphing tool |

### PLAY Section (`/play`)

Mathematical visualizations, simulations, and games.

| File | Widget Name | Destination | Description |
|------|-------------|-------------|-------------|
| `LorenzAttractor.tsx` | Lorenz Attractor | `/play/attractors` | Butterfly attractor, TE aesthetic |
| `CellularAutomata.tsx` | Cellular Automata | `/play/patterns` | Game of Life & variants |
| `ReactionDiffusion.tsx` | Reaction-Diffusion | `/play/patterns` | Gray-Scott Turing patterns |
| `FractalExplorer.tsx` | Fractal Explorer | `/play/fractals` | Mandelbrot/Julia set viewer |

---

## Detailed Deployment Instructions

### For OBSERVE Widgets

```tsx
// In /observe/your-dashboard/page.tsx or similar
import { WidgetFrame } from '@/components/WidgetFrame';
import ActiveFires from '@/components/widgets/ActiveFires';

<WidgetFrame
  title="Active Fires"
  description="Real-time global wildfire monitoring from NASA's Fire Information for Resource Management System (FIRMS)."
  source="NASA FIRMS"
  status="live"
>
  <ActiveFires />
</WidgetFrame>
```

### For TOOLS Widgets

```tsx
// In /tools/calculate/page.tsx
import ScientificCalculator from '@/components/widgets/ScientificCalculator';
import UnitConverter from '@/components/widgets/UnitConverter';

// These can be standalone or in grid
<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
  <WidgetFrame title="Scientific Calculator" source="MXWLL">
    <ScientificCalculator />
  </WidgetFrame>
  <WidgetFrame title="Unit Converter" source="MXWLL">
    <UnitConverter />
  </WidgetFrame>
</div>
```

### For PLAY Widgets

```tsx
// In /play/attractors/page.tsx
import LorenzAttractor from '@/components/widgets/LorenzAttractor';

<WidgetFrame
  title="Lorenz Attractor"
  description="The butterfly attractor - a chaotic system discovered by Edward Lorenz in 1963 while modeling atmospheric convection."
  source="Mathematical simulation"
>
  <LorenzAttractor />
</WidgetFrame>

// In /play/fractals/page.tsx
import FractalExplorer from '@/components/widgets/FractalExplorer';

// In /play/patterns/page.tsx
import CellularAutomata from '@/components/widgets/CellularAutomata';
import ReactionDiffusion from '@/components/widgets/ReactionDiffusion';
```

---

## Widget Categories Summary

### By Section

| Section | Count | Widgets |
|---------|-------|---------|
| **OBSERVE** | 20 | ActiveFires, CosmicRaysThrough, eBirdLive, EuropeanRadiationMap, GlacierWatch, iNaturalistLive, ISSLivePosition, JWSTLatest, MagneticField, MagneticFieldStrength, MarsRoverImages, OceanHydrophones, PollenForecast, SeismographGrid, StarMap, WhatsBelowYou, YourAirJourney, YourAirsJourney, YourBackgroundDose, YourSkyWhenBorn |
| **TOOLS** | 4 | ScientificCalculator, UnitConverter, StopwatchTimer, ThePlotter |
| **PLAY** | 4 | LorenzAttractor, CellularAutomata, ReactionDiffusion, FractalExplorer |

### By Type

| Type | Widgets |
|------|---------|
| **Live Data** | ActiveFires, eBirdLive, EuropeanRadiationMap, GlacierWatch, iNaturalistLive, ISSLivePosition, JWSTLatest, MarsRoverImages, OceanHydrophones, SeismographGrid |
| **Personal/Location** | CosmicRaysThrough, MagneticField, MagneticFieldStrength, PollenForecast, WhatsBelowYou, YourAirJourney, YourBackgroundDose, YourSkyWhenBorn |
| **Tools/Instruments** | ScientificCalculator, UnitConverter, StopwatchTimer, ThePlotter, StarMap |
| **Mathematical Viz** | LorenzAttractor, CellularAutomata, ReactionDiffusion, FractalExplorer |

---

## Notes

### Duplicate Files
- `YourAirJourney.tsx` and `YourAirsJourney.tsx` - Check which is newer/better and use one

### API Routes Needed
Some widgets may need server-side API routes to avoid CORS issues:
- `ISSLivePosition` - May need `/api/iss` proxy
- `eBirdLive` - API key should be server-side
- `iNaturalistLive` - Rate limiting considerations

### Geolocation Widgets
These use browser geolocation API and need HTTPS:
- CosmicRaysThrough
- MagneticField / MagneticFieldStrength
- PollenForecast
- YourAirJourney
- YourBackgroundDose
- StarMap

### Canvas-Based Widgets
These use HTML Canvas for rendering (check performance on mobile):
- LorenzAttractor
- CellularAutomata
- ReactionDiffusion
- FractalExplorer
- SeismographGrid
- StarMap
- YourSkyWhenBorn

---

## WidgetFrame Props Reference

```tsx
interface WidgetFrameProps {
  title: string;
  description?: string;
  source?: string;
  status?: 'live' | 'ok' | 'loading' | 'error';
  children: React.ReactNode;
}
```

---

## Testing Checklist

- [ ] All widgets render without errors
- [ ] Responsive scaling works (test at 300px, 400px, 600px widths)
- [ ] Canvas animations perform smoothly
- [ ] Geolocation widgets handle permission denial gracefully
- [ ] API-dependent widgets show loading/error states
- [ ] Interactive elements work on touch devices

---

*Generated by Claude for MXWLL*
