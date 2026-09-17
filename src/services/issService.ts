import { ISSStatePayload, AstronautsData } from '@/types/iss';
import { VERIFIED_ASTRONAUTS } from '@/lib/astronautsData';

export async function fetchISSTelemetry(): Promise<ISSStatePayload> {
  const res = await fetch('/api/iss', {
    cache: 'no-store',
    headers: { 'Accept': 'application/json' },
  });

  if (!res.ok) {
    throw new Error(`Failed to fetch ISS telemetry: HTTP ${res.status}`);
  }

  return res.json();
}

export async function fetchAstronauts(): Promise<AstronautsData> {
  try {
    const res = await fetch('/api/astronauts', {
      cache: 'no-store',
      headers: { 'Accept': 'application/json' },
    });

    if (res.ok) {
      return await res.json();
    }
  } catch (err) {
    console.warn('Direct fetch to /api/astronauts failed, using client fallback:', err);
  }

  const craftBreakdown: Record<string, number> = {};
  for (const p of VERIFIED_ASTRONAUTS) {
    const key = p.station || p.craft;
    craftBreakdown[key] = (craftBreakdown[key] || 0) + 1;
  }

  return {
    count: VERIFIED_ASTRONAUTS.length,
    issExpedition: 75,
    craftBreakdown,
    people: VERIFIED_ASTRONAUTS,
    lastUpdated: new Date().toISOString(),
  };
}
