# MXWLL New Widgets Package

7 new OBSERVE widgets for the MXWLL dashboard.

## Contents

### Widget Components (`src/components/widgets/`)
- `DeepSpaceNetwork.tsx` - NASA DSN dish communications
- `LHCStatus.tsx` - CERN Large Hadron Collider status
- `NeutrinoWatch.tsx` - IceCube neutrino detections
- `SatellitesAbove.tsx` - Satellites overhead (location-based)
- `SOHOCoronagraph.tsx` - Sun's corona imagery
- `CosmicRayMonitor.tsx` - Neutron monitor cosmic ray flux
- `GravitationalWaves.tsx` - LIGO detector status

### API Routes (`src/app/api/`)
- `dsn/route.ts` - Deep Space Network data
- `lhc/route.ts` - LHC status from CERN
- `neutrinos/route.ts` - IceCube neutrino data
- `satellites-above/route.ts` - N2YO satellite tracking
- `cosmic-rays/route.ts` - NMDB cosmic ray data
- `gravitational-waves/route.ts` - LIGO/Virgo status

**Note:** `SOHOCoronagraph` doesn't need an API route - it fetches NASA images directly.

---

## Deployment Instructions

### Step 1: Copy Widget Components

Copy all `.tsx` files from `widgets/` to:
```
src/components/widgets/
```

### Step 2: Create API Routes

For each API route file, create the directory and copy the file:

```bash
# Create API directories
mkdir -p src/app/api/dsn
mkdir -p src/app/api/lhc
mkdir -p src/app/api/neutrinos
mkdir -p src/app/api/satellites-above
mkdir -p src/app/api/cosmic-rays
mkdir -p src/app/api/gravitational-waves

# Copy route files (rename to route.ts)
cp api/dsn-route.ts src/app/api/dsn/route.ts
cp api/lhc-route.ts src/app/api/lhc/route.ts
cp api/neutrinos-route.ts src/app/api/neutrinos/route.ts
cp api/satellites-above-route.ts src/app/api/satellites-above/route.ts
cp api/cosmic-rays-route.ts src/app/api/cosmic-rays/route.ts
cp api/gravitational-waves-route.ts src/app/api/gravitational-waves/route.ts
```

### Step 3: Add to Dashboard Page

In `src/app/observe/dashboard/page.tsx`, add the imports:

```tsx
import DeepSpaceNetwork from '@/components/widgets/DeepSpaceNetwork'
import LHCStatus from '@/components/widgets/LHCStatus'
import NeutrinoWatch from '@/components/widgets/NeutrinoWatch'
import SatellitesAbove from '@/components/widgets/SatellitesAbove'
import SOHOCoronagraph from '@/components/widgets/SOHOCoronagraph'
import CosmicRayMonitor from '@/components/widgets/CosmicRayMonitor'
import GravitationalWaves from '@/components/widgets/GravitationalWaves'
```

Then add these WidgetFrame entries to the grid:

```tsx
{/* Deep Space Network */}
<WidgetFrame
  title="Deep Space Network"
  description="NASA's global array of giant radio antennas communicating with spacecraft across the solar system. Three stations in California, Spain, and Australia maintain contact with missions from Mars rovers to Voyager at the edge of interstellar space."
  source="NASA Jet Propulsion Laboratory"
  status="live"
>
  <DeepSpaceNetwork />
</WidgetFrame>

{/* LHC Status */}
<WidgetFrame
  title="LHC Status"
  description="The Large Hadron Collider is a 27km ring beneath Geneva that accelerates protons to 99.9999991% the speed of light. When beams collide, they recreate conditions a trillionth of a second after the Big Bang."
  source="CERN"
  status="live"
>
  <LHCStatus />
</WidgetFrame>

{/* Neutrino Watch */}
<WidgetFrame
  title="Neutrino Watch"
  description="IceCube is a cubic kilometer of Antarctic ice instrumented with 5,160 optical sensors. It detects neutrinos—particles so weakly interacting that trillions pass through you every second without touching anything."
  source="IceCube Neutrino Observatory"
  status="live"
>
  <NeutrinoWatch />
</WidgetFrame>

{/* Satellites Above */}
<WidgetFrame
  title="Satellites Above"
  description="Every tracked satellite currently overhead—GPS, Starlink, weather satellites, the ISS. At any moment, hundreds of satellites pass above your location."
  source="N2YO Satellite Database"
  status="live"
>
  <SatellitesAbove />
</WidgetFrame>

{/* SOHO Coronagraph */}
<WidgetFrame
  title="Solar Corona"
  description="SOHO's coronagraph creates an artificial eclipse—blocking the solar disk—to reveal the sun's ghostly outer atmosphere. Watch for coronal mass ejections blasting into space."
  source="SOHO/LASCO, ESA & NASA"
  status="live"
>
  <SOHOCoronagraph />
</WidgetFrame>

{/* Cosmic Ray Monitor */}
<WidgetFrame
  title="Cosmic Rays"
  description="Cosmic rays from supernovae constantly bombard Earth. Their flux varies inversely with solar activity—when the sun is quiet, more cosmic rays reach us. Neutron monitors worldwide track this invisible shower."
  source="Neutron Monitor Database (NMDB)"
  status="live"
>
  <CosmicRayMonitor />
</WidgetFrame>

{/* Gravitational Waves */}
<WidgetFrame
  title="Gravitational Waves"
  description="LIGO's twin 4km laser interferometers detect spacetime ripples from colliding black holes and neutron stars billions of light years away. The distortion measured is smaller than 1/10,000th the width of a proton."
  source="LIGO Scientific Collaboration"
  status="live"
>
  <GravitationalWaves />
</WidgetFrame>
```

### Step 4: Environment Variables (Optional)

For full Satellites Above functionality, add to `.env.local`:
```
N2YO_API_KEY=your_api_key_here
```

Get a free API key at https://www.n2yo.com/api/

Without this key, the widget will show realistic simulated data.

---

## Widget Summary

| Widget | Data Source | Updates | Notes |
|--------|-------------|---------|-------|
| Deep Space Network | NASA DSN XML | 30s | Rock solid |
| LHC Status | CERN | 60s | May show offline during maintenance |
| Neutrino Watch | IceCube/GCN | 5min | High-energy events are rare |
| Satellites Above | N2YO API | 60s | Uses geolocation |
| SOHO Coronagraph | NASA images | 30min | Direct image fetch |
| Cosmic Ray Monitor | NMDB | 5min | Multiple stations |
| Gravitational Waves | LIGO/GraceDB | 5min | Detectors often offline |

---

## Testing

After deployment, verify each widget loads at:
- `/observe/dashboard`

Check browser console for any API errors. All widgets have graceful fallbacks for offline/error states.
