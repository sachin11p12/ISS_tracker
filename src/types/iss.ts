export type UnitSystem = 'metric' | 'imperial';

export type MapLayerType = 'dark' | 'satellite' | 'streets' | 'night';

export interface ISSTelemetry {
  name: string;
  id: number;
  latitude: number;
  longitude: number;
  altitude: number; // km by default from API
  velocity: number; // km/h by default from API
  visibility: 'daylight' | 'eclipsed';
  footprint: number; // km
  timestamp: number;
  daynum: number;
  solar_lat: number;
  solar_lon: number;
  units: string;
}

export interface ISSTrailPoint {
  lat: number;
  lng: number;
  timestamp: number;
  altitude?: number;
  velocity?: number;
}

export interface GeocodedLocation {
  country?: string;
  countryCode?: string;
  timezone?: string;
  region?: string;
  isOverWater: boolean;
  waterBodyName?: string;
}

export interface ISSStatePayload {
  telemetry: ISSTelemetry;
  locationDetails?: GeocodedLocation;
  lastUpdated: string;
}

export interface Astronaut {
  id: string;
  name: string;
  craft: string;
  agency?: string;
  role?: string;
  nationality?: string;
  flag?: string;
  daysInSpace?: number;
  launchDate?: string;
  bio?: string;
}

export interface AstronautsData {
  count: number;
  craftBreakdown: Record<string, number>;
  people: Astronaut[];
  lastUpdated: string;
}

export interface ISSPassPrediction {
  risetime: number;
  duration: number;
  formattedRiseTime: string;
}
