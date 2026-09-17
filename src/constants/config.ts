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
    name: 'OpenStreetMap (Clean)',
    url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    maxZoom: 19,
    subdomains: ['a', 'b', 'c'],
  },
  streets: {
    id: 'streets',
    name: 'Esri Street Map',
    url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}',
    attribution: 'Tiles &copy; Esri &mdash; Sources: GEBCO, USGS, NOAA',
    maxZoom: 18,
  },
  satellite: {
    id: 'satellite',
    name: 'Satellite Imagery (Esri)',
    url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
    attribution: 'Tiles &copy; Esri &mdash; Source: Esri, Maxar, Earthstar Geographics',
    maxZoom: 18,
  },
  dark: {
    id: 'dark',
    name: 'Esri Dark Canvas',
    url: 'https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Dark_Gray_Base/MapServer/tile/{z}/{y}/{x}',
    attribution: 'Tiles &copy; Esri &mdash; Esri, DeLorme, NAVTEQ',
    maxZoom: 16,
  },
  night: {
    id: 'night',
    name: 'Esri Topographic',
    url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer/tile/{z}/{y}/{x}',
    attribution: 'Tiles &copy; Esri &mdash; Esri, USGS, FAO',
    maxZoom: 18,
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
  