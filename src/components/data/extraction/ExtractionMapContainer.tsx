'use client';

import { useState, useEffect, useRef, useCallback, useMemo, forwardRef, useImperativeHandle } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { MAP_STYLES, MapStyleKey } from '@/lib/maps/mapStyles';
import { MATERIALS, getMaterialById, type ExtractedMaterial, type MaterialCategory } from '@/lib/data/extractionMaterials';
import { SITES, SITE_STATS, type ExtractionSite } from '@/lib/data/extractionSites';

// Category filter options
const CATEGORY_FILTERS: { id: MaterialCategory | 'all'; label: string }[] = [
  { id: 'all', label: 'All' },
  { id: 'metal', label: 'Metals' },
  { id: 'gem', label: 'Gems' },
  { id: 'industrial', label: 'Industrial' },
  { id: 'energy', label: 'Energy' },
];

export interface ExtractionMapHandle {
  flyTo: (lat: number, lng: number, zoom?: number) => void;
  selectMaterial: (materialId: string | null) => void;
  getSelectedMaterial: () => string | null;
}

interface ExtractionMapContainerProps {
  accessToken: string;
  onMaterialChange?: (materialId: string | null) => void;
}

const ExtractionMapContainer = forwardRef<ExtractionMapHandle, ExtractionMapContainerProps>(
  function ExtractionMapContainer({ accessToken, onMaterialChange }, ref) {
    const mapContainer = useRef<HTMLDivElement>(null);
    const map = useRef<mapboxgl.Map | null>(null);
    const markersRef = useRef<mapboxgl.Marker[]>([]);

    const [isLoaded, setIsLoaded] = useState(false);
    const [mapStyle, setMapStyle] = useState<MapStyleKey>('blueprint');
    const [selectedMaterial, setSelectedMaterial] = useState<string | null>(null);
    const [selectedCategory, setSelectedCategory] = useState<MaterialCategory | 'all'>('all');
    const [selectedSite, setSelectedSite] = useState<ExtractionSite | null>(null);
    const [isGlobe, setIsGlobe] = useState(false);

    const currentStyle = MAP_STYLES[mapStyle];
    const isDark = mapStyle === 'dark' || mapStyle === 'satellite' || mapStyle === 'blueprint';

    // Expose methods to parent
    useImperativeHandle(ref, () => ({
      flyTo: (lat: number, lng: number, zoom: number = 8) => {
        if (map.current) {
          map.current.flyTo({
            center: [lng, lat],
            zoom,
            duration: 2000,
            essential: true,
          });
        }
      },
      selectMaterial: (materialId: string | null) => {
        setSelectedMaterial(materialId);
        if (materialId) {
          setSelectedCategory('all');
        }
      },
      getSelectedMaterial: () => selectedMaterial,
    }));

    // Notify parent of material changes
    useEffect(() => {
      onMaterialChange?.(selectedMaterial);
    }, [selectedMaterial, onMaterialChange]);

    // Filter sites
    const filteredSites = useMemo(() => {
      let filtered = SITES;

      if (selectedCategory !== 'all') {
        filtered = filtered.filter(site => {
          const primaryMat = getMaterialById(site.primaryMaterial);
          return primaryMat?.category === selectedCategory;
        });
      }

      if (selectedMaterial) {
        filtered = filtered.filter(s =>
          s.primaryMaterial === selectedMaterial ||
          s.materials.includes(selectedMaterial)
        );
      }

      return filtered;
    }, [selectedMaterial, selectedCategory]);

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
            <div class="marker-glow" style="
              position: absolute;
              inset: -8px;
              border-radius: 50%;
              background: radial-gradient(circle, ${glow} 0%, transparent 70%);
              opacity: ${currentStyle.markerStyle.glow ? '0.8' : '0'};
              animation: pulse 3s ease-in-out infinite;
              animation-delay: ${i * 100}ms;
            "></div>
            <div class="marker-main" style="
              position: absolute;
              inset: 0;
              border-radius: 50%;
              background: ${color};
              border: 2px solid ${currentStyle.markerStyle.border};
              box-shadow: 0 2px 8px ${currentStyle.markerStyle.shadow};
              transform: scale(0);
              animation: appear 0.5s ease-out forwards;
              animation-delay: ${Math.min(i * 30, 800)}ms;
              transition: transform 0.2s ease, box-shadow 0.2s ease;
            "></div>
          </div>
          <style>
            @keyframes appear { to { transform: scale(1); opacity: 1; } }
            @keyframes pulse { 0%, 100% { transform: scale(1); opacity: 0.8; } 50% { transform: scale(1.3); opacity: 0.4; } }
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

    // Featured materials for pills
    const featuredMaterials = useMemo(() => {
      const picks = ['lithium', 'cobalt', 'copper', 'gold', 'iron', 'rare-earths', 'uranium', 'diamond'];
      return picks.map(id => getMaterialById(id)).filter(Boolean) as ExtractedMaterial[];
    }, []);

    return (
      <div className="relative w-full h-[70vh] md:h-[80vh] overflow-hidden rounded-xl" style={{ background: currentStyle.ui.bg }}>
        {/* Header Controls */}
        <div
          className="absolute top-4 left-4 right-4 z-30 rounded-xl backdrop-blur-xl border"
          style={{ background: currentStyle.ui.bg, borderColor: currentStyle.ui.border }}
        >
          <div className="px-4 py-3">
            <div className="flex items-center justify-between flex-wrap gap-3">
              <div>
                <h1 className="text-xl md:text-2xl font-light" style={{ color: currentStyle.ui.text }}>
                  Where We Extract
                </h1>
                <p className="text-xs" style={{ color: currentStyle.ui.textMuted }}>
                  {filteredSites.length} sites · {new Set(filteredSites.map(s => s.country)).size} countries
                </p>
              </div>

              {/* Category Pills */}
              <div className="hidden md:flex items-center gap-1 p-1 rounded-lg" style={{ background: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.03)' }}>
                {CATEGORY_FILTERS.map(cat => (
                  <button
                    key={cat.id}
                    onClick={() => {
                      setSelectedCategory(cat.id);
                      setSelectedMaterial(null);
                    }}
                    className={`px-3 py-1 rounded-md text-sm font-medium transition-all ${
                      selectedCategory === cat.id ? 'bg-black text-white' : ''
                    }`}
                    style={selectedCategory === cat.id ? {} : { color: currentStyle.ui.textMuted }}
                  >
                    {cat.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Material Pills */}
            <div className="hidden md:flex items-center gap-1 mt-2 p-1 rounded-lg" style={{ background: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.03)' }}>
              <button
                onClick={() => setSelectedMaterial(null)}
                className={`px-3 py-1 rounded-md text-sm font-medium transition-all ${!selectedMaterial ? 'bg-black text-white' : ''}`}
                style={!selectedMaterial ? {} : { color: currentStyle.ui.textMuted }}
              >
                All
              </button>
              {featuredMaterials.map(mat => (
                <button
                  key={mat.id}
                  onClick={() => setSelectedMaterial(selectedMaterial === mat.id ? null : mat.id)}
                  className={`flex items-center gap-1 px-2 py-1 rounded-md text-sm font-medium transition-all ${
                    selectedMaterial === mat.id ? 'shadow' : ''
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

            {/* Style and Globe Controls */}
            <div className="flex items-center gap-3 mt-2">
              <div className="flex flex-wrap gap-1">
                {Object.entries(MAP_STYLES).map(([key, style]) => (
                  <button
                    key={key}
                    onClick={() => setMapStyle(key as MapStyleKey)}
                    className={`px-2 py-1 rounded-full text-xs transition-colors ${
                      mapStyle === key
                        ? 'bg-white text-black'
                        : isDark ? 'bg-white/20 text-white hover:bg-white/30' : 'bg-black/10 text-black/70 hover:bg-black/20'
                    }`}
                  >
                    {style.name}
                  </button>
                ))}
              </div>

              <div className="flex items-center gap-2">
                <span className="text-xs" style={{ color: currentStyle.ui.textMuted }}>Globe</span>
                <button
                  onClick={() => {
                    setIsGlobe(!isGlobe);
                    if (map.current) {
                      map.current.setProjection(isGlobe ? 'mercator' : 'globe');
                    }
                  }}
                  className="w-8 h-5 rounded-full transition-all"
                  style={{ background: isGlobe ? '#22c55e' : isDark ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.1)' }}
                >
                  <div
                    className="w-3 h-3 rounded-full bg-white shadow-md transition-transform mx-1"
                    style={{ transform: isGlobe ? 'translateX(12px)' : 'translateX(0)' }}
                  />
                </button>
              </div>

              {(selectedMaterial || selectedCategory !== 'all') && (
                <button
                  onClick={() => {
                    setSelectedMaterial(null);
                    setSelectedCategory('all');
                  }}
                  className="text-xs px-2 py-1 rounded transition-colors"
                  style={{ background: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)', color: currentStyle.ui.textMuted }}
                >
                  Clear ×
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Map */}
        <div ref={mapContainer} className="absolute inset-0 w-full h-full" />

        {/* Site Panel */}
        {selectedSite && (
          <SitePanel
            site={selectedSite}
            style={currentStyle}
            getColor={getColor}
            onClose={() => setSelectedSite(null)}
          />
        )}
      </div>
    );
  }
);

export default ExtractionMapContainer;

// Site Panel Component
function SitePanel({
  site,
  style,
  getColor,
  onClose,
}: {
  site: ExtractionSite;
  style: typeof MAP_STYLES[MapStyleKey];
  getColor: (id: string) => string;
  onClose: () => void;
}) {
  const color = getColor(site.primaryMaterial);
  const primaryMat = getMaterialById(site.primaryMaterial);

  return (
    <div
      className="absolute bottom-4 right-4 z-40 w-80 rounded-xl overflow-hidden backdrop-blur-xl border shadow-2xl"
      style={{ background: style.ui.panel, borderColor: style.ui.border }}
    >
      <div className="p-4 relative" style={{ background: `linear-gradient(135deg, ${color}30 0%, transparent 100%)` }}>
        <button
          onClick={onClose}
          className="absolute top-2 right-2 p-1 rounded hover:bg-black/20 transition-colors"
          style={{ color: style.ui.textMuted }}
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M12 4L4 12M4 4L12 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
          </svg>
        </button>

        <h3 className="text-lg font-medium pr-6" style={{ color: style.ui.text }}>{site.name}</h3>
        <p className="text-sm" style={{ color: style.ui.textMuted }}>
          {site.country} {site.region && `· ${site.region}`}
        </p>
      </div>

      <div className="p-4 space-y-3">
        {primaryMat && (
          <div className="flex items-center gap-3 p-3 rounded-lg" style={{ background: `${color}15` }}>
            <div
              className="w-10 h-10 rounded-lg flex items-center justify-center font-mono font-bold text-white"
              style={{ background: color }}
            >
              {primaryMat.symbol || primaryMat.id.slice(0, 2).toUpperCase()}
            </div>
            <div>
              <div className="font-medium" style={{ color: style.ui.text }}>{primaryMat.name}</div>
              {site.production && (
                <div className="font-mono text-xs" style={{ color: style.ui.textMuted }}>{site.production}</div>
              )}
            </div>
          </div>
        )}

        <p className="text-sm" style={{ color: style.ui.text }}>{site.description}</p>

        <div className="pt-2 flex items-center justify-between text-xs" style={{ borderTop: `1px solid ${style.ui.border}` }}>
          <span className="font-mono" style={{ color: style.ui.textMuted }}>
            {site.lat.toFixed(3)}°, {site.lng.toFixed(3)}°
          </span>
          <a
            href={`https://www.google.com/maps?q=${site.lat},${site.lng}`}
            target="_blank"
            rel="noopener noreferrer"
            className="font-medium"
            style={{ color }}
          >
            Open in Maps →
          </a>
        </div>
      </div>
    </div>
  );
}
