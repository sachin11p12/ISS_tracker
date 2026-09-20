'use client';

import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { useISSStore } from '@/store/issStore';
import { MAP_LAYERS } from '@/constants/config';
import { MapLayerType } from '@/types/iss';
import { formatCoordinates, formatSpeed, formatAltitude } from '@/lib/utils';
import { Layers, Crosshair, Eye, EyeOff, Navigation } from 'lucide-react';

// Custom SVG ISS Satellite Icon
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

export default function ISSMap() {
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markerRef = useRef<L.Marker | null>(null);
  const footprintRef = useRef<L.Circle | null>(null);
  const trailPolylineRef = useRef<L.Polyline | null>(null);
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

    tileLayerRef.current = tileLayer;
    mapInstanceRef.current = map;

    return () => {
      map.remove();
      mapInstanceRef.current = null;
    };
  }, []); // Run once on mount

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

  // Update Marker, Footprint & Orbit Trail
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

    // Orbit Trail Polyline
    if (showOrbitTrail && trail.length > 1) {
      const latLngs: L.LatLngTuple[] = trail.map((p) => [p.lat, p.lng]);

      if (!trailPolylineRef.current) {
        trailPolylineRef.current = L.polyline(latLngs, {
          color: '#0369a1',
          weight: 3,
          opacity: 0.8,
          dashArray: '6, 6',
          lineCap: 'round',
        }).addTo(map);
      } else {
        trailPolylineRef.current.setLatLngs(latLngs);
        trailPolylineRef.current.setStyle({
          color: '#0369a1',
        });
      }
    } else if (trailPolylineRef.current) {
      map.removeLayer(trailPolylineRef.current);
      trailPolylineRef.current = null;
    }

    // Auto-center pan
    if (isAutoCenter) {
      map.panTo(latLng, { animate: true, duration: 1.2 });
    }
  }, [telemetry, trail, showFootprint, showOrbitTrail, isAutoCenter, unitSystem]);

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
    <div className="relative h-[480px] w-full overflow-hidden rounded-2xl border border-slate-200 bg-slate-100 shadow-md md:h-[580px] lg:h-[640px]">
      {/* Map DOM Element */}
      <div ref={mapContainerRef} className="h-full w-full bg-slate-100 z-0" />

      {/* Floating Map Controls overlay */}
      <div className="absolute top-4 left-4 z-10 flex flex-wrap items-center gap-2">
        {/* Layer Selector */}
        <div className="relative">
          <button
            onClick={() => setIsLayerMenuOpen(!isLayerMenuOpen)}
            className="flex items-center gap-2 rounded-xl border border-slate-300 bg-white/95 px-3.5 py-2 text-xs font-mono font-semibold text-slate-800 shadow-md backdrop-blur-md hover:bg-slate-50 transition-all cursor-pointer"
          >
            <Layers className="h-4 w-4 text-cyan-600" />
            <span className="hidden sm:inline">Theme:</span>
            <span className="text-cyan-700 font-bold">{MAP_LAYERS[mapLayer]?.name.split(' ')[0] || 'Map'}</span>
          </button>

          {isLayerMenuOpen && (
            <div className="absolute top-full left-0 mt-2 w-56 rounded-xl border border-slate-200 bg-white/95 p-1.5 shadow-2xl backdrop-blur-xl z-20">
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
                    className={`flex w-full items-center justify-between rounded-lg px-3 py-2 text-xs font-mono transition-colors cursor-pointer ${
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
          className={`flex items-center gap-2 rounded-xl border px-3.5 py-2 text-xs font-mono font-semibold shadow-md backdrop-blur-md transition-all cursor-pointer ${
            isAutoCenter
              ? 'border-cyan-400 bg-cyan-50 text-cyan-800'
              : 'border-slate-300 bg-white/95 text-slate-600 hover:bg-slate-50'
          }`}
        >
          <Crosshair className={`h-4 w-4 ${isAutoCenter ? 'text-cyan-600 animate-spin' : ''}`} style={{ animationDuration: '8s' }} />
          <span className="hidden sm:inline">Auto-Follow:</span>
          <span>{isAutoCenter ? 'ON' : 'OFF'}</span>
        </button>

        {/* Re-center ISS immediately */}
        <button
          onClick={handleRecenter}
          title="Center map on ISS"
          className="flex items-center gap-1.5 rounded-xl border border-slate-300 bg-white/95 px-3 py-2 text-xs font-mono font-semibold text-slate-800 shadow-md backdrop-blur-md hover:bg-slate-50 hover:border-cyan-400 transition-all cursor-pointer"
        >
          <Navigation className="h-4 w-4 text-cyan-600" />
          <span className="hidden md:inline">Center ISS</span>
        </button>
      </div>

      {/* Orbit Trail & Footprint visibility Toggles */}
      <div className="absolute bottom-4 left-4 z-10 flex items-center gap-2">
        <button
          onClick={() => setShowOrbitTrail(!showOrbitTrail)}
          className={`flex items-center gap-1.5 rounded-xl border px-3 py-1.5 text-xs font-mono font-semibold shadow-sm backdrop-blur-md transition-all cursor-pointer ${
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
          className={`flex items-center gap-1.5 rounded-xl border px-3 py-1.5 text-xs font-mono font-semibold shadow-sm backdrop-blur-md transition-all cursor-pointer ${
            showFootprint
              ? 'border-cyan-300 bg-cyan-50 text-cyan-800'
              : 'border-slate-300 bg-white/90 text-slate-500'
          }`}
        >
          {showFootprint ? <Eye className="h-3.5 w-3.5 text-cyan-600" /> : <EyeOff className="h-3.5 w-3.5" />}
          <span>Footprint Area</span>
        </button>
      </div>

      {/* Live coordinates overlay pill */}
      {telemetry && (
        <div className="absolute top-4 right-4 z-10 hidden sm:flex items-center gap-3 rounded-xl border border-slate-300 bg-white/95 px-4 py-2 text-xs font-mono text-slate-800 shadow-md backdrop-blur-md">
          <div className="flex items-center gap-1.5">
            <span className="text-slate-500">LAT:</span>
            <span className="font-bold text-emerald-600">{telemetry.latitude.toFixed(4)}°</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="text-slate-500">LON:</span>
            <span className="font-bold text-emerald-600">{telemetry.longitude.toFixed(4)}°</span>
          </div>
        </div>
      )}
    </div>
  );
}
