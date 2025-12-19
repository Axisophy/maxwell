# MXWLL Lunar Atlas Prototype

This folder contains a prototype implementation of the Lunar Atlas exploration page for MXWLL.

## Overview

The Lunar Atlas is an interactive map of the Moon's near side, featuring:
- **Zoomable base imagery** from NASA's Lunar Reconnaissance Orbiter
- **Toggleable layers** for maria, craters, and Apollo landing sites
- **Feature info panels** with mission details, geological data, etc.
- **Cross-links** to the `/data/moon` reference page

## File Structure

```
moon-prototype/
├── app/
│   ├── observe/
│   │   └── moon/
│   │       ├── page.tsx              # Main atlas page
│   │       └── components/
│   │           ├── LunarAtlas.tsx    # Leaflet map component
│   │           ├── LayerControls.tsx # Layer toggle UI
│   │           └── InfoPanel.tsx     # Feature details panel
│   └── data/
│       └── moon/
│           └── page.tsx              # Moon reference page
├── lib/
│   └── moon/
│       ├── types.ts                  # TypeScript definitions
│       ├── layers.ts                 # Layer configuration
│       └── apollo-data.ts            # Apollo mission data
└── public/
    └── data/
        └── moon/
            ├── maria.geojson         # Lunar maria (seas)
            ├── craters.geojson       # Major craters
            └── apollo-sites.geojson  # Apollo landing sites
```

## Integration Steps

### 1. Install Dependencies

```bash
npm install leaflet
npm install -D @types/leaflet
```

### 2. Copy Files

Copy the contents of this prototype into your maxwell project:

- `app/observe/moon/` → `maxwell/app/observe/moon/`
- `app/data/moon/` → `maxwell/app/data/moon/`
- `lib/moon/` → `maxwell/lib/moon/`
- `public/data/moon/` → `maxwell/public/data/moon/`

### 3. Add Leaflet CSS

Ensure Leaflet CSS is loaded. The component imports it directly:
```tsx
import 'leaflet/dist/leaflet.css';
```

### 4. Update Navigation

Add links to the Moon Atlas in your navigation:
- Under OBSERVE submenu: "Lunar Atlas" → `/observe/moon`
- Under DATA submenu: "Moon" → `/data/moon`

## Tile Source

The prototype uses NASA Trek tiles:
```
https://trek.nasa.gov/tiles/Moon/EQ/LRO_WAC_Mosaic_Global_303ppd_v02/1.0.0/default/default028mm/{z}/{y}/{x}.png
```

**Alternatives:**
- Host tiles locally for better performance
- Use ASU LROC WMS: `http://wms.lroc.asu.edu/lroc/...`
- Create your own tile cache

## Extending the Prototype

### Adding More Layers

1. Create a GeoJSON file in `public/data/moon/`
2. Add the layer to `lib/moon/layers.ts`
3. Add the source mapping in `LunarAtlas.tsx`:
```tsx
const layerSources: Record<string, string> = {
  'maria': '/data/moon/maria.geojson',
  'craters': '/data/moon/craters.geojson',
  'apollo-sites': '/data/moon/apollo-sites.geojson',
  'your-new-layer': '/data/moon/your-new-layer.geojson', // Add here
};
```

### Adding EVA Traverses

The Apollo EVA routes would be LineString geometries:
```json
{
  "type": "Feature",
  "properties": {
    "name": "Apollo 15 EVA 1",
    "mission": "Apollo 15",
    "distance": "10.3 km"
  },
  "geometry": {
    "type": "LineString",
    "coordinates": [
      [3.6339, 26.1322],
      [3.6500, 26.1400],
      ...
    ]
  }
}
```

### Building "The Moon Tonight" (Globe Mode)

For the 3D globe view (`/observe/moon/globe`), you would:
1. Create a new page component
2. Use Three.js with a sphere geometry
3. Apply lunar texture
4. Calculate current sun position for lighting
5. Show terminator line

### Building "Surface Detail" (Deep Zoom)

For the high-resolution detail view (`/observe/moon/surface`):
1. Use OpenSeadragon or similar deep-zoom library
2. Obtain LRO NAC imagery tiles for specific areas
3. Create hotspots for interesting locations (Apollo sites, etc.)

## Data Sources

| Layer | Source | License |
|-------|--------|---------|
| Base tiles | NASA/GSFC/ASU LRO WAC | Public domain |
| Maria data | IAU Nomenclature | CC BY |
| Crater data | USGS, IAU | Public domain |
| Apollo data | NASA Apollo Surface Journal | Public domain |

## Known Issues

1. **Tile loading**: NASA Trek tiles can be slow. Consider caching.
2. **Coordinate system**: Leaflet uses lat/lng, lunar data uses lng/lat. Swapping is handled in the component.
3. **Mobile**: Info panel positioning may need adjustment on very small screens.

## Next Steps

1. Add Soviet Luna missions layer
2. Add modern missions (Chang'e, Chandrayaan, etc.)
3. Add Apollo EVA traverses for each mission
4. Add sample collection points
5. Calculate and display current terminator
6. Build globe and deep-zoom views
7. Add search functionality
8. Add keyboard navigation

---

*Prototype v1.0 — December 2025*
