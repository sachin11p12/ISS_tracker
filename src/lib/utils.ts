import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { UnitSystem } from '@/types/iss';

export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}

export function formatLatitude(lat: number): string {
  const dir = lat >= 0 ? 'N' : 'S';
  return `${Math.abs(lat).toFixed(4)}° ${dir}`;
}

export function formatLongitude(lng: number): string {
  const dir = lng >= 0 ? 'E' : 'W';
  return `${Math.abs(lng).toFixed(4)}° ${dir}`;
}

export function formatCoordinates(lat: number, lng: number): string {
  return `${formatLatitude(lat)}, ${formatLongitude(lng)}`;
}

export function kmhToMph(kmh: number): number {
  return kmh * 0.621371;
}

export function kmToMiles(km: number): number {
  return km * 0.621371;
}

export function formatSpeed(velocityKmh: number, unit: UnitSystem = 'metric'): string {
  if (unit === 'imperial') {
    const mph = kmhToMph(velocityKmh);
    return `${Math.round(mph).toLocaleString()} mph`;
  }
  return `${Math.round(velocityKmh).toLocaleString()} km/h`;
}

export function formatAltitude(altitudeKm: number, unit: UnitSystem = 'metric'): string {
  if (unit === 'imperial') {
    const miles = kmToMiles(altitudeKm);
    return `${miles.toFixed(1)} mi`;
  }
  return `${altitudeKm.toFixed(1)} km`;
}

export function formatFootprint(footprintKm: number, unit: UnitSystem = 'metric'): string {
  if (unit === 'imperial') {
    return `${Math.round(kmToMiles(footprintKm)).toLocaleString()} mi`;
  }
  return `${Math.round(footprintKm).toLocaleString()} km`;
}

export function formatTimestampUTC(timestampSeconds: number): string {
  const date = new Date(timestampSeconds * 1000);
  return date.toUTCString().replace('GMT', 'UTC');
}

export function formatTimeOnlyUTC(date: Date = new Date()): string {
  const pad = (n: number) => n.toString().padStart(2, '0');
  const h = pad(date.getUTCHours());
  const m = pad(date.getUTCMinutes());
  const s = pad(date.getUTCSeconds());
  return `${h}:${m}:${s} UTC`;
}

export function calculateBearing(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const toRad = (deg: number) => (deg * Math.PI) / 180;
  const toDeg = (rad: number) => (rad * 180) / Math.PI;

  const φ1 = toRad(lat1);
  const φ2 = toRad(lat2);
  const Δλ = toRad(lon2 - lon1);

  const y = Math.sin(Δλ) * Math.cos(φ2);
  const x = Math.cos(φ1) * Math.sin(φ2) - Math.sin(φ1) * Math.cos(φ2) * Math.cos(Δλ);
  const θ = Math.atan2(y, x);

  return (toDeg(θ) + 360) % 360;
}

export function getWaterBodyName(lat: number, lng: number): string {
  // Approximate major oceans and seas for realistic telemetry when over water
  if (lat > 60) return 'Arctic Ocean';
  if (lat < -60) return 'Southern Ocean';

  if (lng >= -80 && lng <= 20) {
    return lat >= 0 ? 'North Atlantic Ocean' : 'South Atlantic Ocean';
  }
  if (lng >= 20 && lng <= 100) {
    return 'Indian Ocean';
  }
  if (lng > 100 || lng < -80) {
    return lat >= 0 ? 'North Pacific Ocean' : 'South Pacific Ocean';
  }
  return 'International Waters';
}
