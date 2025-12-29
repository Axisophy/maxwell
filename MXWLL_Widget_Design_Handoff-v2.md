# MXWLL Widget Design Handoff
## Session: December 29, 2025

*Design improvements and patterns for widget consistency across MXWLL.*

---

## Session Overview

Working through all MXWLL widgets to improve design consistency, functionality, and user experience. Using Apple HIG widget principles as reference framework.

---

## Part 1: Apple HIG Principles Applied to MXWLL Widgets

### Key Principles from Apple Human Interface Guidelines

| Principle | HIG Guidance | MXWLL Application |
|-----------|--------------|-------------------|
| **Glanceable** | Widgets for brief updates, very simple tasks | Widgets should communicate their key data at a glance—no need to interact to understand current state |
| **Quick content loading** | Cache locally, show recent info while updating | All widgets should show last-known data immediately, with subtle loading indicator for fresh data |
| **Clear visual hierarchy** | Controls elevate and distinguish content | Content (imagery, data values) should dominate; controls should recede |
| **Avoid custom backgrounds** | Use system-provided backgrounds for consistency | Maintain shell consistency; personality comes from content, not backgrounds |
| **Single-tap interactions** | Complete tasks in one tap where possible | View changes, info expansion should be single-tap |
| **Content-first design** | Tap content itself rather than "Open App" buttons | Tapping the main content area should link to detailed view, not a separate button |

### Translation to MXWLL Context

**What stays consistent (shell):**
- Widget frame header with title, status indicator, info button
- `#e5e5e5` header background
- `#ffffff` content background (with `1px solid #e5e5e5` border)
- `12px` border radius
- 8px gap between frame and content

**What can have personality (inside content area):**
- Data visualization style
- Colour within visualizations
- Typography beyond the base hierarchy
- Animation and motion
- Dark backgrounds for space/scientific themes

---

## Part 2: Completed Improvements

### ✅ Issue 1: Widget Background Contrast (FIXED)

**Problem:** Widget content backgrounds (`#ffffff`) were barely distinguishable from page background (`#fafafa`).

**Solution:** Added subtle border to widget content area.

**Implementation in WidgetFrame.tsx:**
```tsx
// Widget content container now includes border
<div className="... border border-[#e5e5e5]">
```

**File delivered:** `/mnt/user-data/outputs/WidgetFrame.tsx`

---

### ✅ Issue 2: Solar Widget Naming (FIXED)

**Problem:** "Solar Live" was too generic—didn't distinguish what aspect of the sun it shows.

**Solution:** Renamed widgets for clarity.

| Old Name | New Name | What It Shows |
|----------|----------|---------------|
| Solar Live | **Solar Disk** | The sun's surface/atmosphere in various wavelengths (NASA SDO) |
| SOHO Coronagraph | **Solar Corona** | The outer solar atmosphere and solar wind (SOHO LASCO) |

**Files delivered:**
- `/mnt/user-data/outputs/SolarDisk.tsx` (renamed from SolarLive.tsx)
- `/mnt/user-data/outputs/SolarCorona.tsx` (renamed from SOHOCoronagraph.tsx)

**Import updates required:**
```tsx
// Old
import SolarLive from '@/components/widgets/SolarLive'
import SOHOCoronagraph from '@/components/widgets/SOHOCoronagraph'

// New
import SolarDisk from '@/components/widgets/SolarDisk'
import SolarCorona from '@/components/widgets/SolarCorona'
```

---

### ✅ Issue 3: Solar Disk - Added HMI Magnetogram View (FIXED)

**Problem:** Missing important view showing magnetic field polarity.

**Solution:** Added HMIB (HMI Magnetogram) as 6th view with two-row button layout.

**New view structure:**
```
┌─────────────────────────────────────────────┐
│  Row 1: Corona Views                        │
│  [193Å] [171Å] [304Å] [131Å]               │
├─────────────────────────────────────────────┤
│  Row 2: Surface Views                       │
│  [HMI Vis] [HMI Mag]                        │
└─────────────────────────────────────────────┘
```

**Wavelength data now includes `group` property:**
```tsx
const wavelengths = [
  { id: '0193', label: '193Å', group: 'corona' },
  { id: '0171', label: '171Å', group: 'corona' },
  { id: '0304', label: '304Å', group: 'corona' },
  { id: '0131', label: '131Å', group: 'corona' },
  { id: 'HMIIC', label: 'HMI Vis', group: 'surface' },
  { id: 'HMIB', label: 'HMI Mag', group: 'surface' },
]
```

---

### ✅ Issue 4: Space Weather Widget (REDESIGNED)

**Problems:**
- No padding/border within widget frame
- Broken SVG dial (0, 5, 9 labels overlapping dial image)
- No background—inherited white from WidgetFrame
- Cluttered layout with competing visual elements
- X-ray circle indicator was odd design

**Solution:** Complete redesign with mission control aesthetic.

**Key changes:**

| Aspect | Before | After |
|--------|--------|-------|
| Background | None (white) | `bg-[#1a1a1e]` (dark) |
| Padding | None | `p-[1em]` |
| Kp Display | Broken SVG gauge | Large number + horizontal bar |
| Solar Wind / X-Ray | Circle indicator | Clean cards with status dots |
| Color coding | Inconsistent | Consistent green→yellow→orange→red |

**New layout:**
```
┌─────────────────────────────────────────────┐
│  GEOMAGNETIC ACTIVITY              ● LIVE   │
│                                             │
│  4.3  Active                                │  ← Hero Kp number + status
│  ████████████░░░░░░░░░░░░░░░░░░░░          │  ← Horizontal bar with thresholds
│  0        3     5     7        9            │
│                                             │
│  ┌──────────────┐  ┌──────────────┐        │
│  │ SOLAR WIND   │  │ X-RAY FLUX   │        │  ← Two clean cards
│  │ 423 km/s     │  │ C2.4         │        │
│  │ ● Normal     │  │ ● Low        │        │
│  └──────────────┘  └──────────────┘        │
│                                             │
│  KP HISTORY (72H)                          │
│  ▁▂▃▄▃▂▃▄▅▄▃▂▁▂▃▄▅▆▅▄▃▄▃▂                 │  ← Bar chart
│                                             │
│  ✨ Aurora possible at high latitudes       │  ← Conditional
│                                             │
│  NOAA Space Weather Prediction Center       │
└─────────────────────────────────────────────┘
```

**File delivered:** `/mnt/user-data/outputs/SpaceWeather.tsx`

---

### ✅ Issue 5: Moon Phase Widget (REDESIGNED)

**Problems:**
- Boring single-view design
- Collapsible "More details" section felt hidden
- White background didn't match space theme
- No way to see upcoming phases at a glance

**Solution:** Complete redesign with Today/Week/Month views inspired by Observable's moon phases visualization.

**Key changes:**

| Aspect | Before | After |
|--------|--------|-------|
| Background | White with black moon area | Full dark `#1a1a1e` |
| Details | Collapsible section | Always visible in Today view |
| Views | Single view only | **Today / Week / Month** toggle |
| Week view | N/A | 7 moons with day labels, today highlighted |
| Month view | N/A | Observable-style scrollable row |

**Three views:**

**Today View:**
```
┌─────────────────────────────────────────────┐
│  [Today] [Week] [Month]                     │
│                                             │
│              ╭─────────╮                    │
│             (    🌓    )                    │ ← Large moon with glow
│              ╰─────────╯                    │
│                                             │
│         Waxing Gibbous                      │
│            73% illuminated                  │
│                                             │
│  ┌──────────┐  ┌──────────┐                │
│  │ Moonrise │  │ Moonset  │                │
│  │  18:42   │  │  07:23   │                │
│  └──────────┘  └──────────┘                │
│  ┌──────────┐  ┌──────────┐                │
│  │ Next Full│  │ Next New │                │
│  │  Jan 13  │  │  Jan 29  │                │
│  └──────────┘  └──────────┘                │
│                                             │
│  Moon age: 10.4 days                        │
└─────────────────────────────────────────────┘
```

**Week View:**
```
┌─────────────────────────────────────────────┐
│  [Today] [Week] [Month]                     │
│                                             │
│   🌒   🌓   🌓   🌔   🌔   🌕   🌕          │
│  Mon  Tue  Wed  Thu  Fri  Sat  Sun         │
│   30   31    1    2    3    4    5         │
│              ↑ today (ring highlight)       │
│  ─────────────────────────────────────     │
│  Waxing Gibbous              73%           │
│  Today                 illuminated          │
└─────────────────────────────────────────────┘
```

**Month View:**
```
┌─────────────────────────────────────────────┐
│  [Today] [Week] [Month]                     │
│                                             │
│              January 2025                   │
│                                             │
│  🌑🌒🌒🌓🌓🌔🌔🌕🌕🌖🌖🌗🌗🌘🌘🌑...      │ ← scrollable
│   1 2 3 4 5 6 7 8 9...                     │
│  ─────────────────────────────────────     │
│  New Jan 1 • 1st Qtr Jan 7 • Full Jan 13   │
└─────────────────────────────────────────────┘
```

**Additional features:**
- Glow effect on larger moons (when illumination > 30%)
- Today highlighting with ring in week/month views
- Key phases legend in month view
- Geolocation for accurate rise/set times (falls back to London)

**File delivered:** `/mnt/user-data/outputs/MoonPhase.tsx`

---

## Part 3: Design System Updates

### Update 1: Widget Content Border (NEW STANDARD)

**Added to Design System spec:**

```css
/* Widget content area */
.widget-content {
  background: #ffffff;
  border-radius: 12px;
  border: 1px solid #e5e5e5; /* NEW */
}
```

### Update 2: Dark Background Widgets

For space/scientific themed widgets, use dark backgrounds inside the content area:

```css
/* Space-themed widget content */
.widget-content-dark {
  background: #1a1a1e;
  padding: 1em;
  /* Note: WidgetFrame provides border-radius via overflow-hidden */
}
```

**Widgets using dark backgrounds:**
- Space Weather
- Moon Phase
- (Future: Aurora, Satellites Above, etc.)

### Update 3: Widget Naming Convention

**Principle:** Widget names should communicate **what** you're looking at, not just that it's "live."

**Good examples:**
- "Solar Disk" — what part of the sun
- "Solar Corona" — what part of the sun
- "Pacific Disc" — what part of Earth
- "UK Tides" — specific data + location
- "Moon Phase" — specific phenomenon

---

## Part 4: Files Delivered This Session

| File | Description | Location |
|------|-------------|----------|
| `WidgetFrame.tsx` | Added content border | `/mnt/user-data/outputs/` |
| `SolarDisk.tsx` | Renamed + HMI Magnetogram view | `/mnt/user-data/outputs/` |
| `SolarCorona.tsx` | Renamed from SOHOCoronagraph | `/mnt/user-data/outputs/` |
| `SpaceWeather.tsx` | Complete redesign | `/mnt/user-data/outputs/` |
| `MoonPhase.tsx` | Complete redesign with 3 views | `/mnt/user-data/outputs/` |

---

## Part 5: Widget Review Queue

### Completed This Session ✅

| Widget | Status | Notes |
|--------|--------|-------|
| Solar Disk | ✅ Done | Renamed, added HMI Mag view |
| Solar Corona | ✅ Done | Renamed for consistency |
| Space Weather | ✅ Done | Complete redesign |
| Moon Phase | ✅ Done | Complete redesign with 3 views |
| WidgetFrame | ✅ Done | Added content border |

### OBSERVE Widgets (Remaining)

| Widget | Priority | Notes |
|--------|----------|-------|
| Himawari Pacific Disc | High | Check dark/light approach |
| DSCOVR EPIC | Medium | Slow updates—communicate this |
| Deep Sea Live | Medium | Variable streams—fallback state |
| UK Tides | Medium | — |
| Earthquakes Live | Medium | — |
| UK Energy | Medium | — |
| CO2 Now | Low | Very simple—good reference |
| Air Quality | Medium | Needs API v3 migration |
| ISS Tracker | High | CORS issues, needs visual review |
| Near-Earth Asteroids | Medium | — |
| Launch Countdown | Medium | Rate limited—caching |
| Aurora Forecast | High | Should match Space Weather dark theme |
| World Population | Low | — |
| Nuclear Reactors | Low | — |
| APOD | Medium | Image-focused |

### TOOLS Widgets

| Widget | Priority | Notes |
|--------|----------|-------|
| Light Travel | Medium | — |
| Element Explorer | Medium | — |

### PLAY Widgets

| Widget | Priority | Notes |
|--------|----------|-------|
| Rössler Attractor | Low | — |
| Pendulum Wave | Low | — |

---

## Part 6: Next Session Priorities

1. **Aurora Forecast** — Should use same dark theme as Space Weather/Moon Phase for space cluster consistency
2. **ISS Tracker** — Fix CORS issues + visual review
3. **Himawari Pacific Disc** — Review animation, consider dark/light approach
4. **DSCOVR EPIC** — Communicate slow update frequency better
5. **Deep Sea Live** — Handle variable stream availability gracefully

---

## Part 7: Design Patterns Established

### Dark Theme Pattern (Space Widgets)

```tsx
// Container
<div className="bg-[#1a1a1e] p-[1em]">

// Cards within dark theme
<div className="bg-white/5 rounded-[0.375em] p-[0.625em]">

// Text hierarchy
<span className="text-white">           // Primary
<span className="text-white/60">        // Secondary  
<span className="text-white/40">        // Muted/labels
<span className="text-white/30">        // Attribution

// Status indicator
<span className="relative flex h-[0.5em] w-[0.5em]">
  <span className="animate-ping absolute ..." style={{ backgroundColor: statusColor }} />
  <span className="relative ..." style={{ backgroundColor: statusColor }} />
</span>
```

### View Selector Pattern

```tsx
// Segmented control for view modes
<div className="flex bg-white/5 rounded-[0.5em] p-[0.25em] mb-[1em]">
  {modes.map((mode) => (
    <button
      key={mode}
      onClick={() => setViewMode(mode)}
      className={`
        flex-1 px-[0.5em] py-[0.375em] text-[0.75em] font-medium 
        rounded-[0.375em] transition-colors capitalize
        ${viewMode === mode 
          ? 'bg-white/10 text-white' 
          : 'text-white/40 hover:text-white/60'
        }
      `}
    >
      {mode}
    </button>
  ))}
</div>
```

### Horizontal Bar Indicator Pattern

```tsx
// Used for Kp index, could apply to other metrics
<div className="relative h-[0.5em] bg-white/10 rounded-full overflow-hidden">
  <div 
    className="absolute inset-y-0 left-0 rounded-full transition-all duration-500"
    style={{ width: `${percentage}%`, backgroundColor: statusColor }}
  />
  {/* Optional threshold markers */}
  <div className="absolute inset-0 flex">
    <div className="w-[33.3%] border-r border-white/20" />
    {/* etc */}
  </div>
</div>
```

---

## Appendix: Widget Visual Reference

### Standard Light Widget
```
┌─────────────────────────────────────────────┐
│  [●] Widget Title                    [i]    │ ← Frame header (#e5e5e5)
└─────────────────────────────────────────────┘
         ↓ 8px gap
╔═════════════════════════════════════════════╗ ← 1px border #e5e5e5
║                                             ║
║  WIDGET CONTENT (#ffffff bg)                ║
║                                             ║
╚═════════════════════════════════════════════╝
```

### Dark Theme Widget (Space/Scientific)
```
┌─────────────────────────────────────────────┐
│  [●] Widget Title                    [i]    │ ← Frame header (#e5e5e5)
└─────────────────────────────────────────────┘
         ↓ 8px gap
╔═════════════════════════════════════════════╗ ← 1px border #e5e5e5
║▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓║
║▓▓▓ DARK CONTENT (#1a1a1e bg) ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓║
║▓▓▓ with white/opacity text   ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓║
║▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓║
╚═════════════════════════════════════════════╝
```

---

*Handoff Document v2.0*  
*December 29, 2025*
