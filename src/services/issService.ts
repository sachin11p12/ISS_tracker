import { ISSStatePayload, AstronautsData } from '@/types/iss';

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
  const res = await fetch('/api/astronauts', {
    next: { revalidate: 300 },
    headers: { 'Accept': 'application/json' },
  });

  if (!res.ok) {
    throw new Error(`Failed to fetch astronauts data: HTTP ${res.status}`);
  }

  return res.json();
}
