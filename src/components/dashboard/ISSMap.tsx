'use client';

import React, { useEffect, useRef, useState, useMemo } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { useISSStore } from '@/store/issStore';
import { MAP_LAYERS } from '@/constants/config';
import { MapLayerType } from '@/types/iss';
import { formatCoordinates, formatSpeed, formatAltitude } from '@/lib/utils';
import { Layers, Crosshair, Eye, EyeOff, Navigation, Route, Maximize2, Minimize2 } from 'lucide-react';

// Custom SVG ISS Satellite Icon (Glowing Cyan Satellite)
const createISSIcon = () => {
  const iconHtml = `
    <div class="relative flex items-center justify-center">
      <!-- Pulsing radar rings -->
      <div class="absolute -inset-3 rounded-full bg-cyan-500/30 animate-ping" style="animation-duration: 2.5s;"></div>
      <div class="absolute -inset-2 rounded-full border border-cyan-500/60 bg-cyan-100/60"></div>
      
      <!-- Custom SVG Space Station Graphic -->
      <div class="relative z-10 flex h-10 w-10 items-center justify-center rounded-full bg-slate-900 border-2 border-cyan-400 shadow-[0_0_15px_rgba(14,165,233,0.9)]">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="#38bdf8" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
          <line x1="2" y1="12" x2="6" y2="12"></line>
          <line x1="18" y1="12" x2="22" y2="12"></line>
          <rect x="2" y="9" width="4" height="6" rx="1" fill="#0284c7" stroke="#38bdf8"></rect>
          <rect x="18" y="9" width="4" height="6" rx="1" fill="#0284c7" stroke="#38bdf8"></rect>
          <line x1="6" y1="12" x2="18" y2="12" stroke="#bae6fd" stroke-width="2.5"></line>
          <rect x="9" y="8" width="6" height="8" rx="2" fill="#0f172a" stroke="#38bdf8"></rect>
          <circle cx="12" cy="12" r="1.5" fill="#38bdf8"></circle>
          <line x1="10" y1="5" x2="14" y2="5" stroke="#38bdf8"></line>
          <line x1="10" y1="19" x2="14" y2="19" stroke="#38bdf8"></line>
          <line x1="12" y1="5" x2="12" y2="8" stroke="#38bdf8"></line>
          <line x1="12" y1="16" x2="12" y2="19" stroke="#38bdf8"></line>
        </svg>
      </div>
    </div>
  `;

  return L.divIcon({
    html: iconHtml,
    className: 'iss-custom-marker',
    iconSize: [40, 40],
    iconAnchor: [20, 20],
    popupAnchor: [0, -22],
  });
};

// Generate multi-orbit ground tracks (sine wave curves at 51.64° inclination across Earth)
function calculateOrbitSegments(currentLat: number, currentLng: number, orbitOffset = 0): [number, number][][] {
  const inclination = 51.64; // degrees
  const driftPerOrbit = 23.17; // Earth rotation drift in degrees per 92.68 min orbit
  const segments: [number, number][][] = [];
  let currentSegment: [number, number][] = [];

  // Approximate current orbital phase theta from latitude
  const clampedRatio = Math.max(-1, Math.min(1, currentLat / inclination));
  const currentTheta = Math.asin(clampedRatio); // in radians

  // Node origin shift for this orbit pass
  const baseLng = currentLng - (currentTheta * (180 / Math.PI)) + (orbitOffset * driftPerOrbit);

  for (let deg = -180; deg <= 360; deg += 1.5) {
    const rad = deg * (Math.PI / 180);
    const lat = inclination * Math.sin(rad);

    // Longitude calculation with Earth rotation correction during pass
    let lng = baseLng + deg - (deg / 360) * driftPerOrbit;

    // Normalize to [-180, 180]
    lng = (((lng + 180) % 360) + 360) % 360 - 180;

    if (currentSegment.length > 0) {
      const prevLng = currentSegment[currentSegment.length - 1][1];
      // If crossing antimeridian (-180 / +180), split into new segment
      if (Math.abs(lng - prevLng) > 180) {
        if (currentSegment.length > 1) {
          segments.push(currentSegment);
        }
        currentSegment = [];
      }
    }

    currentSegment.push([lat, lng]);
  }

  if (currentSegment.length > 1) {
    segments.push(currentSegment);
  }

  return segments;
}

export default function ISSMap() {
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markerRef = useRef<L.Marker | null>(null);
  const footprintRef = useRef<L.Circle | null>(null);
  const trailPolylineRef = useRef<L.Polyline | null>(null);
  const multiOrbitGroupRef = useRef<L.FeatureGroup | null>(null);
  const tileLayerRef = useRef<L.TileLayer | null>(null);

  const [isLayerMenuOpen, setIsLayerMenuOpen] = useState(false);

  const {
    telemetry,
    trail,
    mapLayer,
    setMapLayer,
    isAutoCenter,
    setIsAutoCenter,
    showFootprint,
    setShowFootprint,
    showOrbitTrail,
    setShowOrbitTrail,
    showWholeRoute,
    setShowWholeRoute,
    isMapExpanded,
    toggleMapExpanded,
    unitSystem,
  } = useISSStore();

  // Initialize Map
  useEffect(() => {
    if (!mapContainerRef.current || mapInstanceRef.current) return;

    const initialLat = telemetry?.latitude ?? 20.0;
    const initialLng = telemetry?.longitude ?? 0.0;

    const map = L.map(mapContainerRef.current, {
      center: [initialLat, initialLng],
      zoom: 3,
      minZoom: 2,
      maxZoom: 18,
      worldCopyJump: true,
      zoomControl: false,
    });

    L.control.zoom({ position: 'bottomright' }).addTo(map);

    const layerCfg = MAP_LAYERS[mapLayer] || MAP_LAYERS.light;
    const tileLayer = L.tileLayer(layerCfg.url, {
      attribution: layerCfg.attribution,
      maxZoom: layerCfg.maxZoom,
      subdomains: layerCfg.subdomains || 'abc',
    }).addTo(map);

    const orbitGroup = L.featureGroup().addTo(map);
    multiOrbitGroupRef.current = orbitGroup;

    tileLayerRef.current = tileLayer;
    mapInstanceRef.current = map;

    return () => {
      map.remove();
      mapInstanceRef.current = null;
    };
  }, []); // Run once on mount

  // Resize map smoothly on expand/compact toggle
  useEffect(() => {
    const timer = setTimeout(() => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.invalidateSize({ animate: true });
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [isMapExpanded]);

  // Update Base Map Layer
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    const layerCfg = MAP_LAYERS[mapLayer] || MAP_LAYERS.light;
    if (tileLayerRef.current) {
      map.removeLayer(tileLayerRef.current);
    }

    const newTileLayer = L.tileLayer(layerCfg.url, {
      attribution: layerCfg.attribution,
      maxZoom: layerCfg.maxZoom,
      subdomains: layerCfg.subdomains || 'abc',
    }).addTo(map);

    tileLayerRef.current = newTileLayer;
  }, [mapLayer]);

  // Update Marker, Footprint, Orbit Trail & Whole Multi-Orbit Groundtracks
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map || !telemetry) return;

    const latLng: [number, number] = [telemetry.latitude, telemetry.longitude];

    // Marker update or creation
    if (!markerRef.current) {
      const marker = L.marker(latLng, { icon: createISSIcon() }).addTo(map);
      markerRef.current = marker;
    } else {
      markerRef.current.setIcon(createISSIcon());
      markerRef.current.setLatLng(latLng);
    }

    // Popup content update
    const popupContent = `
      <div class="p-2 font-sans text-slate-900 min-w-[200px]">
        <div class="flex items-center justify-between border-b border-slate-200 pb-1.5 mb-2">
          <span class="font-bold text-xs uppercase tracking-wider text-cyan-800">ISS Telemetry</span>
          <span class="rounded bg-cyan-100 text-cyan-800 px-1.5 py-0.5 text-[10px] font-mono font-bold">ZARYA</span>
        </div>
        <div class="space-y-1 text-xs">
          <div class="flex justify-between">
            <span class="text-slate-500">Position:</span>
            <span class="font-mono font-semibold">${formatCoordinates(telemetry.latitude, telemetry.longitude)}</span>
          </div>
          <div class="flex justify-between">
            <span class="text-slate-500">Speed:</span>
            <span class="font-mono font-semibold">${formatSpeed(telemetry.velocity, unitSystem)}</span>
          </div>
          <div class="flex justify-between">
            <span class="text-slate-500">Altitude:</span>
            <span class="font-mono font-semibold">${formatAltitude(telemetry.altitude, unitSystem)}</span>
          </div>
          <div class="flex justify-between">
            <span class="text-slate-500">Lighting:</span>
            <span class="capitalize font-bold ${telemetry.visibility === 'daylight' ? 'text-amber-600' : 'text-indigo-600'}">${telemetry.visibility}</span>
          </div>
        </div>
      </div>
    `;
    markerRef.current.bindPopup(popupContent);

    // Footprint Circle (radio horizon radius)
    const radiusMeters = (telemetry.footprint * 1000) / 2;

    if (showFootprint) {
      if (!footprintRef.current) {
        footprintRef.current = L.circle(latLng, {
          radius: radiusMeters,
          color: '#0284c7',
          fillColor: '#0284c7',
          fillOpacity: 0.12,
          weight: 1.8,
          dashArray: '4, 4',
        }).addTo(map);
      } else {
        footprintRef.current.setLatLng(latLng);
        footprintRef.current.setRadius(radiusMeters);
        footprintRef.current.setStyle({
          color: '#0284c7',
          fillColor: '#0284c7',
        });
      }
    } else if (footprintRef.current) {
      map.removeLayer(footprintRef.current);
      footprintRef.current = null;
    }

    // Historical Trail Polyline
    if (showOrbitTrail && trail.length > 1) {
      const latLngs: L.LatLngTuple[] = trail.map((p) => [p.lat, p.lng]);

      if (!trailPolylineRef.current) {
        trailPolylineRef.current = L.polyline(latLngs, {
          color: '#0369a1',
          weight: 3,
          opacity: 0.85,
          dashArray: '4, 4',
          lineCap: 'round',
        }).addTo(map);
      } else {
        trailPolylineRef.current.setLatLngs(latLngs);
      }
    } else if (trailPolylineRef.current) {
      map.removeLayer(trailPolylineRef.current);
      trailPolylineRef.current = null;
    }

    // Whole Route / Multi-Orbit Ground Tracks (Sine Waves matching reference image)
    if (multiOrbitGroupRef.current) {
      multiOrbitGroupRef.current.clearLayers();

      if (showWholeRoute) {
        // Draw Past & Future Orbit Passes (-2, -1, 0, +1, +2)
        const passes = [-2, -1, 0, 1, 2];

        passes.forEach((offset) => {
          const isCurrent = offset === 0;
          const segments = calculateOrbitSegments(telemetry.latitude, telemetry.longitude, offset);

          segments.forEach((seg) => {
            // Current pass: vibrant glowing cyan dashed line
            // Future/past passes: subtle translucent orbital curves
            const poly = L.polyline(seg, {
              color: isCurrent ? '#06b6d4' : '#64748b',
              weight: isCurrent ? 2.5 : 1.2,
              opacity: isCurrent ? 0.95 : 0.45,
              dashArray: isCurrent ? '8, 6' : '4, 6',
            });

            if (multiOrbitGroupRef.current) {
              multiOrbitGroupRef.current.addLayer(poly);
            }
          });
        });
      }
    }

    // Auto-center pan
    if (isAutoCenter) {
      map.panTo(latLng, { animate: true, duration: 1.2 });
    }
  }, [telemetry, trail, showFootprint, showOrbitTrail, showWholeRoute, isAutoCenter, unitSystem]);

  // Center manual button trigger
  const handleRecenter = () => {
    if (mapInstanceRef.current && telemetry) {
      mapInstanceRef.current.flyTo([telemetry.latitude, telemetry.longitude], 4, {
        animate: true,
        duration: 1.5,
      });
    }
  };

  return (
    <div
      className={`relative w-full overflow-hidden rounded-3xl border border-slate-200 bg-slate-100 shadow-md transition-all duration-500 ease-in-out ${
        isMapExpanded
          ? 'h-[580px] sm:h-[640px] lg:h-[720px]'
          : 'h-[380px] sm:h-[420px] md:h-[460px]'
      }`}
    >
      {/* Map DOM Element */}
      <div ref={mapContainerRef} className="h-full w-full bg-slate-100 z-0" />

      {/* Floating Map Controls overlay (Top Left) */}
      <div className="absolute top-3.5 left-3.5 z-10 flex flex-wrap items-center gap-2">
        {/* Layer Selector */}
        <div className="relative">
          <button
            onClick={() => setIsLayerMenuOpen(!isLayerMenuOpen)}
            className="flex items-center gap-2 rounded-2xl border border-slate-300 bg-white/95 px-3 py-1.5 text-xs font-mono font-semibold text-slate-800 shadow-md backdrop-blur-md hover:bg-slate-50 transition-all cursor-pointer"
          >
            <Layers className="h-3.5 w-3.5 text-cyan-600" />
            <span className="hidden sm:inline">Theme:</span>
            <span className="text-cyan-700 font-bold">{MAP_LAYERS[mapLayer]?.name.split(' ')[0] || 'Map'}</span>
          </button>

          {isLayerMenuOpen && (
            <div className="absolute top-full left-0 mt-2 w-56 rounded-2xl border border-slate-200 bg-white/95 p-1.5 shadow-2xl backdrop-blur-xl z-20">
              {(Object.keys(MAP_LAYERS) as MapLayerType[]).map((layerKey) => {
                const layer = MAP_LAYERS[layerKey];
                const isSelected = mapLayer === layerKey;
                return (
                  <button
                    key={layerKey}
                    onClick={() => {
                      setMapLayer(layerKey);
                      setIsLayerMenuOpen(false);
                    }}
                    className={`flex w-full items-center justify-between rounded-xl px-3 py-2 text-xs font-mono transition-colors cursor-pointer ${
                      isSelected
                        ? 'bg-cyan-50 text-cyan-800 font-bold border border-cyan-300'
                        : 'text-slate-700 hover:bg-slate-100 hover:text-slate-900'
                    }`}
                  >
                    <span>{layer.name}</span>
                    {isSelected && <span className="h-1.5 w-1.5 rounded-full bg-cyan-600" />}
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Auto-Follow Toggle */}
        <button
          onClick={() => setIsAutoCenter(!isAutoCenter)}
          className={`flex items-center gap-1.5 rounded-2xl border px-3 py-1.5 text-xs font-mono font-semibold shadow-md backdrop-blur-md transition-all cursor-pointer ${
            isAutoCenter
              ? 'border-cyan-400 bg-cyan-50 text-cyan-800'
              : 'border-slate-300 bg-white/95 text-slate-600 hover:bg-slate-50'
          }`}
        >
          <Crosshair className={`h-3.5 w-3.5 ${isAutoCenter ? 'text-cyan-600 animate-spin' : ''}`} style={{ animationDuration: '8s' }} />
          <span className="hidden sm:inline">Auto-Follow:</span>
          <span>{isAutoCenter ? 'ON' : 'OFF'}</span>
        </button>

        {/* Re-center ISS immediately */}
        <button
          onClick={handleRecenter}
          title="Center map on ISS"
          className="flex items-center gap-1.5 rounded-2xl border border-slate-300 bg-white/95 px-3 py-1.5 text-xs font-mono font-semibold text-slate-800 shadow-md backdrop-blur-md hover:bg-slate-50 hover:border-cyan-400 transition-all cursor-pointer"
        >
          <Navigation className="h-3.5 w-3.5 text-cyan-600" />
          <span className="hidden md:inline">Center ISS</span>
        </button>
      </div>

      {/* Top Right: Expand/Compact Size Toggle & Coordinates */}
      <div className="absolute top-3.5 right-3.5 z-10 flex items-center gap-2">
        {/* Whole Route Toggle Button */}
        <button
          onClick={() => setShowWholeRoute(!showWholeRoute)}
          title="Toggle Full Multi-Orbit Ground Tracks"
          className={`flex items-center gap-1.5 rounded-2xl border px-3 py-1.5 text-xs font-mono font-bold shadow-md backdrop-blur-md transition-all cursor-pointer ${
            showWholeRoute
              ? 'border-cyan-400 bg-cyan-50 text-cyan-800 shadow-cyan-500/10'
              : 'border-slate-300 bg-white/95 text-slate-600 hover:bg-slate-50'
          }`}
        >
          <Route className="h-3.5 w-3.5 text-cyan-600" />
          <span>Whole Route: {showWholeRoute ? 'ON' : 'OFF'}</span>
        </button>

        {/* Expand / Wide Size Toggle Button */}
        <button
          onClick={toggleMapExpanded}
          title={isMapExpanded ? 'Compress Map Height' : 'Expand Map to Wide View'}
          className="flex items-center gap-1.5 rounded-2xl border border-slate-300 bg-white/95 px-3 py-1.5 text-xs font-mono font-bold text-slate-800 shadow-md backdrop-blur-md hover:bg-slate-50 hover:border-cyan-400 transition-all cursor-pointer"
        >
          {isMapExpanded ? (
            <>
              <Minimize2 className="h-3.5 w-3.5 text-cyan-600" />
              <span className="hidden sm:inline">Compact</span>
            </>
          ) : (
            <>
              <Maximize2 className="h-3.5 w-3.5 text-cyan-600" />
              <span className="hidden sm:inline">Wide View</span>
            </>
          )}
        </button>
      </div>

      {/* Orbit Trail & Footprint visibility Toggles (Bottom Left) */}
      <div className="absolute bottom-3.5 left-3.5 z-10 flex items-center gap-2">
        <button
          onClick={() => setShowOrbitTrail(!showOrbitTrail)}
          className={`flex items-center gap-1.5 rounded-2xl border px-3 py-1.5 text-xs font-mono font-semibold shadow-sm backdrop-blur-md transition-all cursor-pointer ${
            showOrbitTrail
              ? 'border-cyan-300 bg-cyan-50 text-cyan-800'
              : 'border-slate-300 bg-white/90 text-slate-500'
          }`}
        >
          {showOrbitTrail ? <Eye className="h-3.5 w-3.5 text-cyan-600" /> : <EyeOff className="h-3.5 w-3.5" />}
          <span>Trail</span>
        </button>

        <button
          onClick={() => setShowFootprint(!showFootprint)}
          className={`flex items-center gap-1.5 rounded-2xl border px-3 py-1.5 text-xs font-mono font-semibold shadow-sm backdrop-blur-md transition-all cursor-pointer ${
            showFootprint
              ? 'border-cyan-300 bg-cyan-50 text-cyan-800'
              : 'border-slate-300 bg-white/90 text-slate-500'
          }`}
        >
          {showFootprint ? <Eye className="h-3.5 w-3.5 text-cyan-600" /> : <EyeOff className="h-3.5 w-3.5" />}
          <span>Footprint Area</span>
        </button>
      </div>
    </div>
  );
}
