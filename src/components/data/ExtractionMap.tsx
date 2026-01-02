'use client';

import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { MATERIALS, getMaterialById, type ExtractedMaterial, type MaterialCategory } from '@/lib/data/extractionMaterials';
import { SITES, SITE_STATS, type ExtractionSite } from '@/lib/data/extractionSites';

// ============================================================================
// CUSTOM MAP STYLE DEFINITIONS
// These create genuinely beautiful, distinctive map aesthetics
// ============================================================================

const CUSTOM_STYLES = {
  // BLUEPRINT: Technical, engineering aesthetic
  blueprint: {
    id: 'blueprint',
    name: 'Blueprint',
    description: 'Technical drawing',
    baseStyle: 'mapbox://styles/mapbox/dark-v11',
    customLayers: {
      background: '#0a1628',
      water: '#0d1a2d',
      land: '#0f1e35',
      admin_boundaries: 'rgba(100,150,200,0.3)',
    },
    markerStyle: {
      border: 'rgba(100,180,255,0.6)',
      shadow: 'rgba(0,100,200,0.3)',
      glow: true,
      glowColor: 'rgba(100,180,255,0.4)',
    },
    ui: {
      bg: 'rgba(10,22,40,0.95)',
      text: '#e0f0ff',
      textMuted: 'rgba(150,180,210,0.7)',
      border: 'rgba(100,150,200,0.2)',
      panel: 'rgba(15,30,53,0.98)',
    },
    preview: 'linear-gradient(135deg, #0a1628 0%, #0f1e35 100%)',
  },

  // TERRAIN: Warm, tactile, like a beautiful physical globe
  terrain: {
    id: 'terrain',
    name: 'Terrain',
    description: 'Physical landscape',
    baseStyle: 'mapbox://styles/mapbox/outdoors-v12',
    customLayers: {
      background: '#e8e4d9',
      water: '#b8c5c9',
      waterway: '#a8b5b9',
      land: '#e8e4d9',
      landuse_park: '#c8d4c0',
      hillshade_highlight: 'rgba(255, 255, 255, 0.5)',
      hillshade_shadow: 'rgba(0, 0, 0, 0.15)',
    },
    markerStyle: {
      border: 'rgba(255,255,255,0.9)',
      shadow: 'rgba(0,0,0,0.3)',
      glow: true,
    },
    ui: {
      bg: 'rgba(255,255,255,0.92)',
      text: '#000000',
      textMuted: 'rgba(0,0,0,0.5)',
      border: 'rgba(0,0,0,0.08)',
      panel: '#ffffff',
    },
    preview: 'linear-gradient(135deg, #d4cfc2 0%, #e8e4d9 50%, #c2cbb8 100%)',
  },

  // POLITICAL: Clean, informative, newspaper-quality cartography
  political: {
    id: 'political',
    name: 'Political',
    description: 'Country boundaries',
    baseStyle: 'mapbox://styles/mapbox/light-v11',
    customLayers: {
      background: '#f5f5f5',
      water: '#d4e4ec',
      land: '#f8f8f8',
      admin_boundaries: 'rgba(0,0,0,0.15)',
    },
    markerStyle: {
      border: 'rgba(255,255,255,0.95)',
      shadow: 'rgba(0,0,0,0.25)',
      glow: true,
    },
    ui: {
      bg: 'rgba(255,255,255,0.95)',
      text: '#1a1a1a',
      textMuted: 'rgba(0,0,0,0.45)',
      border: 'rgba(0,0,0,0.06)',
      panel: '#ffffff',
    },
    preview: 'linear-gradient(135deg, #f0f0f0 0%, #e8e8e8 50%, #f5f5f5 100%)',
  },

  // DARK: Dramatic, cinematic, data glows against darkness
  dark: {
    id: 'dark',
    name: 'Dark',
    description: 'Night view',
    baseStyle: 'mapbox://styles/mapbox/dark-v11',
    customLayers: {
      background: '#08080c',
      water: '#0a0a10',
      land: '#151518',
      admin_boundaries: 'rgba(255,255,255,0.08)',
    },
    markerStyle: {
      border: 'rgba(40,40,45,0.9)',
      shadow: 'rgba(0,0,0,0.5)',
      glow: true,
      glowIntensity: 1.5,
    },
    ui: {
      bg: 'rgba(20,20,24,0.95)',
      text: '#ffffff',
      textMuted: 'rgba(255,255,255,0.5)',
      border: 'rgba(255,255,255,0.08)',
      panel: '#1a1a1e',
    },
    preview: 'linear-gradient(135deg, #1a1a1e 0%, #08080c 100%)',
  },

  // SATELLITE: Real Earth imagery, awe-inspiring
  satellite: {
    id: 'satellite',
    name: 'Satellite',
    description: 'Earth imagery',
    baseStyle: 'mapbox://styles/mapbox/satellite-v9',
    customLayers: {},
    markerStyle: {
      border: 'rgba(255,255,255,0.9)',
      shadow: 'rgba(0,0,0,0.5)',
      glow: true,
    },
    ui: {
      bg: 'rgba(10,10,15,0.9)',
      text: '#ffffff',
      textMuted: 'rgba(255,255,255,0.6)',
      border: 'rgba(255,255,255,0.1)',
      panel: 'rgba(20,20,25,0.95)',
    },
    preview: 'linear-gradient(135deg, #1a3d2e 0%, #0d2818 50%, #1a2d3d 100%)',
  },

  // MINIMAL: Pure, abstract, museum-quality
  minimal: {
    id: 'minimal',
    name: 'Minimal',
    description: 'Abstract view',
    baseStyle: 'mapbox://styles/mapbox/light-v11',
    customLayers: {
      background: '#fafafa',
      water: '#fafafa',
      land: '#eeeeee',
      admin_boundaries: 'rgba(0,0,0,0.12)',
      coastline: '#dddddd',
    },
    markerStyle: {
      border: 'rgba(200,200,200,0.8)',
      shadow: 'rgba(0,0,0,0.15)',
      glow: false,
    },
    ui: {
      bg: 'rgba(250,250,250,0.95)',
      text: '#000000',
      textMuted: 'rgba(0,0,0,0.4)',
      border: 'rgba(0,0,0,0.06)',
      panel: '#ffffff',
    },
    preview: 'linear-gradient(135deg, #fafafa 0%, #f0f0f0 100%)',
  },

};

type MapStyleKey = keyof typeof CUSTOM_STYLES;

// Category filter options
const CATEGORY_FILTERS: { id: MaterialCategory | 'all'; label: string; color: string }[] = [
  { id: 'all', label: 'All', color: '#888888' },
  { id: 'metal', label: 'Metals', color: '#b87333' },
  { id: 'gem', label: 'Gems', color: '#e0115f' },
  { id: 'industrial', label: 'Industrial', color: '#5a5a5a' },
  { id: 'energy', label: 'Energy', color: '#1a1a1a' },
];

// ============================================================================
// "WHAT'S IN YOUR" PRODUCT DATA
// ============================================================================

interface ProductData {
  id: string;
  name: string;
  icon: string;
  tagline: string;
  materials: {
    materialId: string;
    part: string;
    amount?: string;
  }[];
}

const PRODUCTS: ProductData[] = [
  {
    id: 'smartphone',
    name: 'Smartphone',
    icon: '📱',
    tagline: 'Over 30 elements from 6 continents',
    materials: [
      { materialId: 'lithium', part: 'Battery', amount: '3-4g' },
      { materialId: 'cobalt', part: 'Battery', amount: '5-8g' },
      { materialId: 'gold', part: 'Circuits', amount: '0.034g' },
      { materialId: 'copper', part: 'Wiring', amount: '15g' },
      { materialId: 'rare-earths', part: 'Speakers' },
      { materialId: 'tantalum', part: 'Capacitors', amount: '40mg' },
    ],
  },
  {
    id: 'ev',
    name: 'Electric Vehicle',
    icon: '🚗',
    tagline: '200kg of minerals per vehicle',
    materials: [
      { materialId: 'lithium', part: 'Battery', amount: '8-12kg' },
      { materialId: 'cobalt', part: 'Battery', amount: '14kg' },
      { materialId: 'copper', part: 'Motor', amount: '80kg' },
      { materialId: 'rare-earths', part: 'Motor', amount: '2kg' },
      { materialId: 'graphite', part: 'Battery Anode', amount: '50kg' },
      { materialId: 'nickel', part: 'Battery', amount: '40kg' },
      { materialId: 'iron', part: 'Body' },
    ],
  },
  {
    id: 'wind-turbine',
    name: 'Wind Turbine',
    icon: '💨',
    tagline: 'A 3MW turbine: 335kg of rare earths',
    materials: [
      { materialId: 'rare-earths', part: 'Generator', amount: '335kg' },
      { materialId: 'neodymium', part: 'Magnets', amount: '600kg' },
      { materialId: 'copper', part: 'Wiring', amount: '2,000kg' },
      { materialId: 'iron', part: 'Tower' },
    ],
  },
];

// ============================================================================
// MAIN COMPONENT
// ============================================================================

interface ExtractionMapProps {
  accessToken: string;
}

export default function ExtractionMapStunning({ accessToken }: ExtractionMapProps) {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const markersRef = useRef<mapboxgl.Marker[]>([]);

  const [isLoaded, setIsLoaded] = useState(false);
  const [mapStyle, setMapStyle] = useState<MapStyleKey>('blueprint');
  const [selectedMaterial, setSelectedMaterial] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<MaterialCategory | 'all'>('all');
  const [selectedSite, setSelectedSite] = useState<ExtractionSite | null>(null);
  const [showWhatsIn, setShowWhatsIn] = useState(false);
  const [isGlobe, setIsGlobe] = useState(false);

  const currentStyle = CUSTOM_STYLES[mapStyle];
  const isDark = mapStyle === 'dark' || mapStyle === 'satellite' || mapStyle === 'blueprint';

  // Filter sites by material and category
  const filteredSites = useMemo(() => {
    let filtered = SITES;

    // Filter by category first
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(site => {
        const primaryMat = getMaterialById(site.primaryMaterial);
        return primaryMat?.category === selectedCategory;
      });
    }

    // Then filter by specific material if selected
    if (selectedMaterial) {
      filtered = filtered.filter(s =>
        s.primaryMaterial === selectedMaterial ||
        s.materials.includes(selectedMaterial)
      );
    }

    return filtered;
  }, [selectedMaterial, selectedCategory]);

  // Get material color
  const getColor = useCallback((materialId: string) => {
    const mat = getMaterialById(materialId);
    return mat?.color || '#888888';
  }, []);

  const getGlow = useCallback((materialId: string) => {
    const mat = getMaterialById(materialId);
    return mat?.glowColor || 'rgba(136,136,136,0.5)';
  }, []);

  // Initialize map
  useEffect(() => {
    if (!mapContainer.current || map.current) return;

    try {
      mapboxgl.accessToken = accessToken;

      map.current = new mapboxgl.Map({
        container: mapContainer.current,
        style: currentStyle.baseStyle,
        center: [20, 20],
        zoom: 1.5,
        projection: isGlobe ? 'globe' : 'mercator',
      });

      map.current.on('load', () => {
        // Set fog after style is fully loaded
        if (isGlobe && map.current) {
          map.current.setFog({
            color: isDark ? '#08080c' : '#f8f8f8',
            'high-color': isDark ? '#1a1a2e' : '#ffffff',
            'horizon-blend': 0.02,
            'space-color': isDark ? '#000000' : '#f0f0f0',
            'star-intensity': isDark ? 0.6 : 0,
          });
        }
        setIsLoaded(true);
      });

      map.current.on('click', () => setSelectedSite(null));
      map.current.on('error', (e) => console.error('Mapbox error:', e));
    } catch (error) {
      console.error('Failed to initialise Mapbox:', error);
    }

    return () => {
      map.current?.remove();
      map.current = null;
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [accessToken]);

  // Update style
  useEffect(() => {
    if (!map.current || !isLoaded) return;
    map.current.setStyle(currentStyle.baseStyle);

    // Update fog for globe
    map.current.once('style.load', () => {
      if (isGlobe && map.current) {
        map.current.setFog({
          color: isDark ? '#08080c' : '#f8f8f8',
          'high-color': isDark ? '#1a1a2e' : '#ffffff',
          'horizon-blend': 0.02,
          'space-color': isDark ? '#000000' : '#f0f0f0',
          'star-intensity': isDark ? 0.6 : 0,
        });
      }
    });
  }, [mapStyle, isLoaded, currentStyle.baseStyle, isDark, isGlobe]);

  // Create markers
  useEffect(() => {
    if (!map.current || !isLoaded) return;

    markersRef.current.forEach(m => m.remove());
    markersRef.current = [];

    filteredSites.forEach((site, i) => {
      const color = getColor(site.primaryMaterial);
      const glow = getGlow(site.primaryMaterial);
      const size = site.scale === 'mega' ? 20 : site.scale === 'large' ? 16 : 12;

      const el = document.createElement('div');
      el.innerHTML = `
        <div class="marker-container" style="
          position: relative;
          width: ${size}px;
          height: ${size}px;
          cursor: pointer;
        ">
          <!-- Glow layer -->
          <div class="marker-glow" style="
            position: absolute;
            inset: -8px;
            border-radius: 50%;
            background: radial-gradient(circle, ${glow} 0%, transparent 70%);
            opacity: ${currentStyle.markerStyle.glow ? '0.8' : '0'};
            animation: pulse 3s ease-in-out infinite;
            animation-delay: ${i * 100}ms;
          "></div>

          <!-- Main marker -->
          <div class="marker-main" style="
            position: absolute;
            inset: 0;
            border-radius: 50%;
            background: ${color};
            border: 2px solid ${currentStyle.markerStyle.border};
            box-shadow:
              0 2px 8px ${currentStyle.markerStyle.shadow},
              0 0 0 0 ${color};
            transform: scale(0);
            animation: appear 0.5s ease-out forwards;
            animation-delay: ${Math.min(i * 30, 800)}ms;
            transition: transform 0.2s ease, box-shadow 0.2s ease;
          "></div>

          <!-- Inner shine -->
          <div style="
            position: absolute;
            top: 2px;
            left: 2px;
            right: 50%;
            bottom: 50%;
            border-radius: 50% 50% 0 0;
            background: linear-gradient(180deg, rgba(255,255,255,0.4) 0%, transparent 100%);
            opacity: 0;
            animation: appear 0.5s ease-out forwards;
            animation-delay: ${Math.min(i * 30, 800) + 200}ms;
          "></div>
        </div>

        <style>
          @keyframes appear {
            to { transform: scale(1); opacity: 1; }
          }
          @keyframes pulse {
            0%, 100% { transform: scale(1); opacity: 0.8; }
            50% { transform: scale(1.3); opacity: 0.4; }
          }
        </style>
      `;

      const mainMarker = el.querySelector('.marker-main') as HTMLElement;
      const container = el.querySelector('.marker-container') as HTMLElement;

      container.addEventListener('mouseenter', () => {
        mainMarker.style.transform = 'scale(1.5)';
        mainMarker.style.boxShadow = `0 4px 20px ${currentStyle.markerStyle.shadow}, 0 0 30px ${glow}`;
      });

      container.addEventListener('mouseleave', () => {
        mainMarker.style.transform = 'scale(1)';
        mainMarker.style.boxShadow = `0 2px 8px ${currentStyle.markerStyle.shadow}`;
      });

      container.addEventListener('click', (e) => {
        e.stopPropagation();
        setSelectedSite(site);
        map.current?.flyTo({
          center: [site.lng, site.lat],
          zoom: 6,
          duration: 2000,
          essential: true,
        });
      });

      const marker = new mapboxgl.Marker({ element: el })
        .setLngLat([site.lng, site.lat])
        .addTo(map.current!);

      markersRef.current.push(marker);
    });
  }, [filteredSites, isLoaded, currentStyle, getColor, getGlow]);

  const selectedMaterialData = selectedMaterial
    ? getMaterialById(selectedMaterial)
    : null;

  // Get featured materials for element pills (one from each category)
  const featuredMaterials = useMemo(() => {
    const featured: ExtractedMaterial[] = [];
    const byCategory: Record<string, ExtractedMaterial[]> = {};

    MATERIALS.forEach(m => {
      if (!byCategory[m.category]) byCategory[m.category] = [];
      byCategory[m.category].push(m);
    });

    // Pick most recognizable from each
    const picks = ['lithium', 'cobalt', 'copper', 'gold', 'iron', 'rare-earths', 'uranium', 'diamond'];
    picks.forEach(id => {
      const mat = getMaterialById(id);
      if (mat) featured.push(mat);
    });

    return featured.slice(0, 8);
  }, []);

  return (
    <div className="relative w-full min-h-screen overflow-hidden" style={{ background: currentStyle.ui.bg }}>
      {/* Floating Header */}
      <div
        className="absolute top-4 left-4 right-4 z-30 rounded-2xl backdrop-blur-xl border"
        style={{
          background: currentStyle.ui.bg,
          borderColor: currentStyle.ui.border,
        }}
      >
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            {/* Title */}
            <div>
              <h1
                className="text-2xl md:text-3xl font-extralight tracking-tight"
                style={{ color: currentStyle.ui.text }}
              >
                Where We Extract
              </h1>
              <p
                className="text-sm mt-0.5"
                style={{ color: currentStyle.ui.textMuted }}
              >
                {SITE_STATS.total} sites · {SITE_STATS.countries} countries · {MATERIALS.length} materials
              </p>
            </div>

            {/* Controls */}
            <div className="flex items-center gap-3">
              {/* Category Filter Pills */}
              <div className="hidden lg:flex items-center gap-1.5 p-1.5 rounded-xl" style={{ background: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.03)' }}>
                {CATEGORY_FILTERS.map(cat => (
                  <button
                    key={cat.id}
                    onClick={() => {
                      setSelectedCategory(cat.id);
                      setSelectedMaterial(null);
                    }}
                    className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                      selectedCategory === cat.id
                        ? 'bg-black text-white shadow-lg'
                        : ''
                    }`}
                    style={selectedCategory === cat.id ? {} : { color: currentStyle.ui.textMuted }}
                  >
                    {cat.label}
                  </button>
                ))}
              </div>

              {/* What's In Your Button */}
              <button
                onClick={() => setShowWhatsIn(true)}
                className="px-5 py-2.5 rounded-xl text-sm font-semibold transition-all hover:scale-105 active:scale-95"
                style={{
                  background: 'linear-gradient(135deg, #e6007e 0%, #ff4d94 100%)',
                  color: '#fff',
                  boxShadow: '0 4px 15px rgba(230,0,126,0.3)',
                }}
              >
                What's In Your...
              </button>
            </div>
          </div>

          {/* Material Pills Row */}
          <div className="hidden md:flex items-center gap-1.5 mt-3 p-1.5 rounded-xl" style={{ background: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.03)' }}>
            <button
              onClick={() => setSelectedMaterial(null)}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                !selectedMaterial
                  ? 'bg-black text-white shadow-lg'
                  : ''
              }`}
              style={!selectedMaterial ? {} : { color: currentStyle.ui.textMuted }}
            >
              All
            </button>
            {featuredMaterials.map(mat => (
              <button
                key={mat.id}
                onClick={() => setSelectedMaterial(selectedMaterial === mat.id ? null : mat.id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                  selectedMaterial === mat.id ? 'shadow-lg' : ''
                }`}
                style={{
                  background: selectedMaterial === mat.id ? mat.color : 'transparent',
                  color: selectedMaterial === mat.id ? '#fff' : currentStyle.ui.textMuted,
                }}
              >
                <span className="font-mono text-xs">{mat.symbol || mat.id.slice(0, 2).toUpperCase()}</span>
              </button>
            ))}
          </div>

          {/* Style Switcher */}
          <div className="flex items-center gap-3 mt-4">
            <span
              className="text-xs uppercase tracking-widest"
              style={{ color: currentStyle.ui.textMuted }}
            >
              Style
            </span>
            <div className="flex flex-wrap gap-1.5">
              {Object.entries(CUSTOM_STYLES).map(([key, style]) => (
                <button
                  key={key}
                  onClick={() => setMapStyle(key as MapStyleKey)}
                  className={`px-3 py-1.5 rounded-full text-xs whitespace-nowrap transition-colors ${
                    mapStyle === key
                      ? 'bg-white text-black shadow-sm'
                      : isDark ? 'bg-white/20 text-white hover:bg-white/30' : 'bg-black/10 text-black/70 hover:bg-black/20'
                  }`}
                >
                  {style.name}
                </button>
              ))}
            </div>

            {/* Globe toggle */}
            <div className="ml-4 flex items-center gap-2">
              <span className="text-xs" style={{ color: currentStyle.ui.textMuted }}>Globe</span>
              <button
                onClick={() => {
                  setIsGlobe(!isGlobe);
                  if (map.current) {
                    map.current.setProjection(isGlobe ? 'mercator' : 'globe');
                  }
                }}
                className={`w-10 h-6 rounded-full transition-all ${isGlobe ? 'bg-green-500' : ''}`}
                style={{ background: isGlobe ? '#22c55e' : isDark ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.1)' }}
              >
                <div
                  className="w-4 h-4 rounded-full bg-white shadow-md transition-transform mx-1"
                  style={{ transform: isGlobe ? 'translateX(16px)' : 'translateX(0)' }}
                />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Map Container */}
      <div ref={mapContainer} className="absolute inset-0 w-full h-full" style={{ minHeight: '100vh' }} />

      {/* Stats Bar */}
      <div
        className="absolute bottom-4 left-4 right-4 z-30 rounded-2xl backdrop-blur-xl border"
        style={{
          background: currentStyle.ui.bg,
          borderColor: currentStyle.ui.border,
        }}
      >
        <div className="px-6 py-3 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <div>
              <span className="text-xs uppercase tracking-wider" style={{ color: currentStyle.ui.textMuted }}>Sites</span>
              <div className="font-mono text-2xl font-bold" style={{ color: currentStyle.ui.text }}>
                {filteredSites.length}
              </div>
            </div>
            <div>
              <span className="text-xs uppercase tracking-wider" style={{ color: currentStyle.ui.textMuted }}>Countries</span>
              <div className="font-mono text-2xl font-bold" style={{ color: currentStyle.ui.text }}>
                {new Set(filteredSites.map(s => s.country)).size}
              </div>
            </div>
            <div>
              <span className="text-xs uppercase tracking-wider" style={{ color: currentStyle.ui.textMuted }}>Category</span>
              <div className="font-mono text-lg font-bold capitalize" style={{ color: currentStyle.ui.text }}>
                {selectedCategory === 'all' ? 'All' : selectedCategory}
              </div>
            </div>
          </div>

          {(selectedMaterial || selectedCategory !== 'all') && (
            <button
              onClick={() => {
                setSelectedMaterial(null);
                setSelectedCategory('all');
              }}
              className="text-sm px-4 py-2 rounded-lg transition-colors"
              style={{
                background: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)',
                color: currentStyle.ui.textMuted,
              }}
            >
              Clear filters ×
            </button>
          )}
        </div>
      </div>

      {/* Material Panel */}
      {selectedMaterialData && (
        <MaterialPanel
          material={selectedMaterialData}
          style={currentStyle}
          onClose={() => setSelectedMaterial(null)}
        />
      )}

      {/* Site Panel */}
      {selectedSite && (
        <SitePanel
          site={selectedSite}
          style={currentStyle}
          getColor={getColor}
          onClose={() => setSelectedSite(null)}
        />
      )}

      {/* What's In Modal */}
      {showWhatsIn && (
        <WhatsInModal
          onClose={() => setShowWhatsIn(false)}
          onSelectMaterial={(id) => {
            setSelectedMaterial(id);
            setShowWhatsIn(false);
          }}
        />
      )}
    </div>
  );
}

// ============================================================================
// MATERIAL PANEL
// ============================================================================

function MaterialPanel({
  material,
  style,
  onClose
}: {
  material: ExtractedMaterial;
  style: typeof CUSTOM_STYLES[MapStyleKey];
  onClose: () => void;
}) {
  return (
    <div
      className="absolute top-28 left-4 z-40 w-80 rounded-2xl overflow-hidden backdrop-blur-xl border shadow-2xl animate-slideIn"
      style={{
        background: style.ui.panel,
        borderColor: style.ui.border,
      }}
    >
      {/* Header */}
      <div
        className="p-5 relative overflow-hidden"
        style={{ background: `linear-gradient(135deg, ${material.color}20 0%, transparent 100%)` }}
      >
        <div className="flex items-start justify-between relative z-10">
          <div className="flex items-center gap-4">
            <div
              className="w-16 h-16 rounded-2xl flex items-center justify-center font-mono text-2xl font-bold text-white shadow-lg"
              style={{
                background: `linear-gradient(135deg, ${material.color} 0%, ${material.color}cc 100%)`,
                boxShadow: `0 8px 32px ${material.glowColor}`,
              }}
            >
              {material.symbol || material.id.slice(0, 2).toUpperCase()}
            </div>
            <div>
              <h2 className="text-xl font-semibold" style={{ color: style.ui.text }}>
                {material.name}
              </h2>
              <p className="text-sm capitalize" style={{ color: style.ui.textMuted }}>
                {material.category} · {material.subcategory.replace('-', ' ')}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg transition-colors hover:bg-black/10"
            style={{ color: style.ui.textMuted }}
          >
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path d="M15 5L5 15M5 5L15 15" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="p-5 space-y-5">
        <p className="text-sm leading-relaxed" style={{ color: style.ui.text }}>
          {material.description}
        </p>

        {/* Top Producers */}
        <div>
          <h3 className="text-xs uppercase tracking-widest mb-3" style={{ color: style.ui.textMuted }}>
            Top Producers
          </h3>
          <div className="space-y-3">
            {material.topProducers.map((p, i) => (
              <div key={p.country} className="flex items-center gap-3">
                <span
                  className="w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold"
                  style={{
                    background: material.color,
                    color: '#fff',
                  }}
                >
                  {i + 1}
                </span>
                <div className="flex-1">
                  <div className="h-2 rounded-full overflow-hidden" style={{ background: style.ui.border }}>
                    <div
                      className="h-full rounded-full transition-all duration-1000"
                      style={{
                        width: `${p.percent}%`,
                        background: `linear-gradient(90deg, ${material.color} 0%, ${material.color}88 100%)`,
                      }}
                    />
                  </div>
                </div>
                <span className="text-sm w-20" style={{ color: style.ui.text }}>{p.country}</span>
                <span className="font-mono text-sm w-12 text-right" style={{ color: style.ui.textMuted }}>
                  {p.percent}%
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Fun Fact */}
        {material.funFact && (
          <div
            className="p-4 rounded-xl"
            style={{ background: `${material.color}15` }}
          >
            <p className="text-sm italic" style={{ color: style.ui.text }}>
              💡 {material.funFact}
            </p>
          </div>
        )}

        {/* Applications */}
        <div>
          <h3 className="text-xs uppercase tracking-widest mb-2" style={{ color: style.ui.textMuted }}>
            Applications
          </h3>
          <div className="flex flex-wrap gap-1.5">
            {material.applications.slice(0, 5).map(app => (
              <span
                key={app}
                className="px-2 py-1 text-xs rounded-md"
                style={{ background: `${material.color}20`, color: style.ui.text }}
              >
                {app}
              </span>
            ))}
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-4 pt-4" style={{ borderTop: `1px solid ${style.ui.border}` }}>
          <div>
            <div className="text-xs" style={{ color: style.ui.textMuted }}>Annual Production</div>
            <div className="font-mono text-sm" style={{ color: style.ui.text }}>
              {material.annualProduction || 'N/A'}
            </div>
          </div>
          {material.criticalityRating && (
            <div>
              <div className="text-xs" style={{ color: style.ui.textMuted }}>Supply Risk</div>
              <div className="flex gap-0.5">
                {[1, 2, 3, 4, 5].map(n => (
                  <div
                    key={n}
                    className="w-3 h-3 rounded-sm"
                    style={{
                      background: n <= material.criticalityRating! ? material.color : style.ui.border
                    }}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      <style jsx>{`
        @keyframes slideIn {
          from { opacity: 0; transform: translateX(-20px); }
          to { opacity: 1; transform: translateX(0); }
        }
        .animate-slideIn { animation: slideIn 0.3s ease-out; }
      `}</style>
    </div>
  );
}

// ============================================================================
// SITE PANEL
// ============================================================================

function SitePanel({
  site,
  style,
  getColor,
  onClose
}: {
  site: ExtractionSite;
  style: typeof CUSTOM_STYLES[MapStyleKey];
  getColor: (id: string) => string;
  onClose: () => void;
}) {
  const color = getColor(site.primaryMaterial);
  const primaryMat = getMaterialById(site.primaryMaterial);
  const secondaryMats = site.materials
    .filter(id => id !== site.primaryMaterial)
    .map(id => getMaterialById(id))
    .filter(Boolean) as ExtractedMaterial[];

  return (
    <div
      className="absolute top-28 right-4 z-40 w-96 rounded-2xl overflow-hidden backdrop-blur-xl border shadow-2xl animate-slideIn"
      style={{
        background: style.ui.panel,
        borderColor: style.ui.border,
      }}
    >
      {/* Header with site image placeholder */}
      <div
        className="h-32 relative"
        style={{
          background: `linear-gradient(135deg, ${color}40 0%, ${color}10 100%)`,
        }}
      >
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-6xl opacity-30">⛏️</span>
        </div>
        <div className="absolute bottom-0 left-0 right-0 p-5 bg-gradient-to-t from-black/50 to-transparent">
          <div className="flex items-center gap-2">
            <div
              className="w-3 h-3 rounded-full"
              style={{
                background: site.status === 'active' ? '#22c55e' : site.status === 'planned' ? '#3b82f6' : '#f59e0b',
                boxShadow: site.status === 'active' ? '0 0 10px #22c55e' : undefined,
              }}
            />
            <span className="text-xs uppercase tracking-wider text-white/80">{site.status}</span>
            {site.scale === 'mega' && (
              <span className="px-2 py-0.5 rounded text-xs bg-white/20 text-white ml-auto">
                MEGA SITE
              </span>
            )}
          </div>
        </div>
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-lg bg-black/30 hover:bg-black/50 transition-colors text-white"
        >
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <path d="M15 5L5 15M5 5L15 15" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
          </svg>
        </button>
      </div>

      {/* Content */}
      <div className="p-5 space-y-5">
        <div>
          <h2 className="text-2xl font-semibold" style={{ color: style.ui.text }}>
            {site.name}
          </h2>
          <p className="text-sm" style={{ color: style.ui.textMuted }}>
            {site.country} {site.region && `· ${site.region}`}
          </p>
        </div>

        {/* Primary Material */}
        {primaryMat && (
          <div className="flex items-center gap-4 p-4 rounded-xl" style={{ background: `${color}15` }}>
            <div
              className="w-12 h-12 rounded-xl flex items-center justify-center font-mono text-lg font-bold text-white"
              style={{ background: color }}
            >
              {primaryMat.symbol || primaryMat.id.slice(0, 2).toUpperCase()}
            </div>
            <div className="flex-1">
              <div className="font-medium" style={{ color: style.ui.text }}>{primaryMat.name}</div>
              {site.production && (
                <div className="font-mono text-sm" style={{ color: style.ui.textMuted }}>
                  {site.production}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Secondary Materials */}
        {secondaryMats.length > 0 && (
          <div className="flex gap-2 flex-wrap">
            {secondaryMats.slice(0, 4).map(mat => (
              <span
                key={mat.id}
                className="px-2 py-1 text-xs rounded-md flex items-center gap-1"
                style={{ background: `${mat.color}20`, color: style.ui.text }}
              >
                <span
                  className="w-2 h-2 rounded-full"
                  style={{ background: mat.color }}
                />
                {mat.name}
              </span>
            ))}
          </div>
        )}

        {/* Description */}
        <p className="text-sm leading-relaxed" style={{ color: style.ui.text }}>
          {site.description}
        </p>

        {/* Significance */}
        {site.significance && (
          <div
            className="p-4 rounded-xl border-l-4"
            style={{
              background: `${color}10`,
              borderColor: color,
            }}
          >
            <p className="text-sm italic" style={{ color: style.ui.text }}>
              "{site.significance}"
            </p>
          </div>
        )}

        {/* Metadata */}
        <div className="grid grid-cols-3 gap-4">
          <div>
            <div className="text-xs" style={{ color: style.ui.textMuted }}>Type</div>
            <div className="text-sm capitalize" style={{ color: style.ui.text }}>
              {site.type.replace('-', ' ')}
            </div>
          </div>
          {site.operator && (
            <div>
              <div className="text-xs" style={{ color: style.ui.textMuted }}>Operator</div>
              <div className="text-sm" style={{ color: style.ui.text }}>{site.operator}</div>
            </div>
          )}
          {site.startYear && (
            <div>
              <div className="text-xs" style={{ color: style.ui.textMuted }}>Since</div>
              <div className="font-mono text-sm" style={{ color: style.ui.text }}>{site.startYear}</div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="pt-4 flex items-center justify-between" style={{ borderTop: `1px solid ${style.ui.border}` }}>
          <span className="font-mono text-xs" style={{ color: style.ui.textMuted }}>
            {site.lat.toFixed(4)}°, {site.lng.toFixed(4)}°
          </span>
          <a
            href={`https://www.google.com/maps?q=${site.lat},${site.lng}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm font-medium transition-colors"
            style={{ color }}
          >
            Open in Maps →
          </a>
        </div>
      </div>

      <style jsx>{`
        @keyframes slideIn {
          from { opacity: 0; transform: translateX(20px); }
          to { opacity: 1; transform: translateX(0); }
        }
        .animate-slideIn { animation: slideIn 0.3s ease-out; }
      `}</style>
    </div>
  );
}

// ============================================================================
// WHAT'S IN YOUR MODAL
// ============================================================================

function WhatsInModal({
  onClose,
  onSelectMaterial,
}: {
  onClose: () => void;
  onSelectMaterial: (id: string) => void;
}) {
  const [selected, setSelected] = useState<string | null>(null);
  const product = PRODUCTS.find(p => p.id === selected);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/80 backdrop-blur-md animate-fadeIn" onClick={onClose} />

      <div className="relative bg-[#0a0a0f] rounded-3xl max-w-3xl w-full max-h-[85vh] overflow-hidden border border-white/10 shadow-2xl animate-scaleIn">
        {/* Header */}
        <div className="p-8 pb-6 border-b border-white/10">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-3xl font-extralight text-white">What's In Your...</h2>
              <p className="text-white/50 mt-1">
                Every object connects to the Earth
              </p>
            </div>
            <button
              onClick={onClose}
              className="p-3 rounded-xl hover:bg-white/10 transition-colors text-white/50 hover:text-white"
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
              </svg>
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-8 overflow-y-auto" style={{ maxHeight: 'calc(85vh - 120px)' }}>
          {!selected ? (
            <div className="grid grid-cols-3 gap-6">
              {PRODUCTS.map((p, i) => (
                <button
                  key={p.id}
                  onClick={() => setSelected(p.id)}
                  className="group flex flex-col items-center gap-4 p-8 rounded-2xl border border-white/10 hover:border-white/30 hover:bg-white/5 transition-all animate-fadeInUp"
                  style={{ animationDelay: `${i * 100}ms` }}
                >
                  <span className="text-6xl group-hover:scale-125 transition-transform duration-300">
                    {p.icon}
                  </span>
                  <div className="text-center">
                    <div className="text-lg font-medium text-white">{p.name}</div>
                    <div className="text-xs text-white/40 mt-1">{p.tagline}</div>
                  </div>
                </button>
              ))}
            </div>
          ) : (
            <div className="animate-fadeIn">
              <button
                onClick={() => setSelected(null)}
                className="text-white/50 hover:text-white transition-colors mb-6 flex items-center gap-2"
              >
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path d="M10 12L6 8l4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                </svg>
                Back
              </button>

              <div className="flex items-start gap-6 mb-8">
                <span className="text-7xl">{product!.icon}</span>
                <div>
                  <h3 className="text-3xl font-light text-white">{product!.name}</h3>
                  <p className="text-white/50 mt-2">{product!.tagline}</p>
                </div>
              </div>

              <div className="space-y-4">
                {product!.materials.map((item, i) => {
                  const materialData = getMaterialById(item.materialId);
                  if (!materialData) return null;

                  return (
                    <button
                      key={item.materialId}
                      onClick={() => onSelectMaterial(item.materialId)}
                      className="w-full flex items-center gap-4 p-5 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 transition-all text-left group animate-fadeInUp"
                      style={{ animationDelay: `${i * 50}ms` }}
                    >
                      <div
                        className="w-14 h-14 rounded-xl flex items-center justify-center font-mono text-xl font-bold text-white shadow-lg"
                        style={{
                          background: materialData.color,
                          boxShadow: `0 4px 20px ${materialData.glowColor}`,
                        }}
                      >
                        {materialData.symbol || materialData.id.slice(0, 2).toUpperCase()}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-3">
                          <span className="text-white font-medium">{materialData.name}</span>
                          <span className="text-white/30">→</span>
                          <span className="text-white/50">{item.part}</span>
                        </div>
                        <div className="flex items-center gap-2 mt-1">
                          {materialData.topProducers.slice(0, 3).map(p => (
                            <span key={p.country} className="text-sm text-white/40">
                              {p.country}{p.percent ? ` (${p.percent}%)` : ''}
                            </span>
                          ))}
                        </div>
                      </div>
                      {item.amount && (
                        <span className="font-mono text-sm text-white/30">{item.amount}</span>
                      )}
                      <svg className="w-5 h-5 text-white/30 group-hover:text-white group-hover:translate-x-1 transition-all" viewBox="0 0 20 20" fill="none">
                        <path d="M8 4l6 6-6 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                      </svg>
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes scaleIn { from { opacity: 0; transform: scale(0.95); } to { opacity: 1; transform: scale(1); } }
        @keyframes fadeInUp { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
        .animate-fadeIn { animation: fadeIn 0.2s ease-out; }
        .animate-scaleIn { animation: scaleIn 0.3s ease-out; }
        .animate-fadeInUp { animation: fadeInUp 0.4s ease-out both; }
      `}</style>
    </div>
  );
}
