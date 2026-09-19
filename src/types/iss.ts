export type UnitSystem = 'metric' | 'imperial';

export type ThemeMode = 'light' | 'dark';

export type ViewMode = 'map' | 'globe';

export type MapLayerType = 'light' | 'dark' | 'satellite' | 'streets' | 'night';

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

export interface EducationEntry {
  degree: string;
  field: string;
  institution: string;
  year?: string;
}

export interface ResearchPaper {
  title: string;
  journal?: string;
  year?: string;
  url: string;
  description?: string;
  doi?: string;
}

export interface SpacewalkStats {
  count: number;
  durationHours?: number;
  highlights?: string;
}

export interface Astronaut {
  id: string;
  name: string;
  craft: string;
  station: string; // 'ISS' | 'Tiangong'
  spacecraft?: string;
  agency?: string;
  role?: string;
  nationality?: string;
  flag?: string;
  daysInSpace?: number;
  launched?: number;
  launchDate?: string;
  birthDate?: string;
  birthPlace?: string;
  education?: EducationEntry[];
  qualifications?: string[];
  achievements?: string[];
  previousMissions?: string[];
  spacewalks?: SpacewalkStats;
  researchPapers?: ResearchPaper[];
  bio?: string;
  image?: string;
  url?: string;
  instagram?: string;
  twitter?: string;
  facebook?: string;
}

export interface AstronautsData {
  count: number;
  issExpedition?: number;
  craftBreakdown: Record<string, number>;
  people: Astronaut[];
  lastUpdated: string;
}

export interface ISSPassPrediction {
  risetime: number;
  duration: number;
  formattedRiseTime: string;
}
