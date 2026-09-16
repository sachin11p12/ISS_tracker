import { MapLayerType } from '@/types/iss';

export const APP_CONFIG = {
  NAME: 'OrbitalEye',
  TITLE: 'ISS Tracker & Orbital Intelligence',
  DESCRIPTION: 'Live real-time telemetry, interactive trajectory tracking, and astronaut roster for the International Space Station.',
  POLLING_INTERVAL_MS: 4000,
  FAST_POLLING_INTERVAL_MS: 2500,
  SLOW_POLLING_INTERVAL_MS: 8000,
  MAX_TRAIL_POINTS: 40,
  API_TIMEOUT_MS: 6000,
};

export const API_ENDPOINTS = {
  WHERETHEISS_BASE: 'https://api.wheretheiss.at/v1/satellites/25544',
  WHERETHEISS_COORDINATES: 'https://api.wheretheiss.at/v1/coordinates',
  ASTROS_API: 'https://corquaid.github.io/international-space-station-APIs/JSON/people-in-space.json',
  ASTROS_FALLBACK: 'https://corquaid.github.io/international-space-station-APIs/JSON/people-in-space.json',
};

export interface TileLayerConfig {
  id: MapLayerType;
  name: string;
  url: string;
  attribution: string;
  maxZoom: number;
  subdomains?: string[];
}

export const MAP_LAYERS: Record<MapLayerType, TileLayerConfig> = {
  light: {
    id: 'light',
    name: 'Clean Light (Carto Positron)',
    url: 'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png',
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
    maxZoom: 19,
    subdomains: ['a', 'b', 'c', 'd'],
  },
  streets: {
    id: 'streets',
    name: 'Topographic (OSM)',
    url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    maxZoom: 19,
  },
  satellite: {
    id: 'satellite',
    name: 'Earth Imagery (Esri)',
    url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
    attribution: 'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community',
    maxZoom: 18,
  },
  dark: {
    id: 'dark',
    name: 'Deep Space (Carto Dark)',
    url: 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png',
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
    maxZoom: 19,
    subdomains: ['a', 'b', 'c', 'd'],
  },
  night: {
    id: 'night',
    name: 'Night Lights (Carto Voyager)',
    url: 'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png',
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
    maxZoom: 19,
    subdomains: ['a', 'b', 'c', 'd'],
  },
};

export const ISS_MISSION_FACTS = {
  launchDate: 'November 20, 1998',
  orbitInclinationDeg: 51.64,
  orbitPeriodMinutes: 92.68,
  averageAltitudeKm: 420,
  averageSpeedKmh: 27600,
  massKg: 440725,
  lengthMeters: 109,
  habitableVolumeM3: 388,
  crewCapacity: 7,
  orbitsPerDay: 15.54,
  solarArraySpanMeters: 73,
};
