import { NextResponse } from 'next/server';
import { Astronaut, AstronautsData } from '@/types/iss';

export const dynamic = 'force-dynamic';

const VERIFIED_EXPEDITION_CREW: Array<{ name: string; craft: string }> = [
  { name: 'Sunita Williams', craft: 'ISS' },
  { name: 'Butch Wilmore', craft: 'ISS' },
  { name: 'Don Pettit', craft: 'ISS' },
  { name: 'Nick Hague', craft: 'ISS' },
  { name: 'Alexey Ovchinin', craft: 'ISS' },
  { name: 'Ivan Vagner', craft: 'ISS' },
  { name: 'Aleksandr Gorbunov', craft: 'ISS' },
  { name: 'Cai Xuzhe', craft: 'Tiangong' },
  { name: 'Song Lingdong', craft: 'Tiangong' },
  { name: 'Wang Haoze', craft: 'Tiangong' },
];

const ASTRONAUT_METADATA_MAP: Record<string, Partial<Astronaut>> = {
  'Oleg Kononenko': { agency: 'Roscosmos', role: 'Commander', nationality: 'Russian', flag: '🇷🇺' },
  'Nikolai Chub': { agency: 'Roscosmos', role: 'Flight Engineer', nationality: 'Russian', flag: '🇷🇺' },
  'Tracy Caldwell Dyson': { agency: 'NASA', role: 'Flight Engineer', nationality: 'American', flag: '🇺🇸' },
  'Matthew Dominick': { agency: 'NASA', role: 'Commander (Crew-8)', nationality: 'American', flag: '🇺🇸' },
  'Michael Barratt': { agency: 'NASA', role: 'Pilot (Crew-8)', nationality: 'American', flag: '🇺🇸' },
  'Jeanette Epps': { agency: 'NASA', role: 'Mission Specialist', nationality: 'American', flag: '🇺🇸' },
  'Alexander Grebenkin': { agency: 'Roscosmos', role: 'Mission Specialist', nationality: 'Russian', flag: '🇷🇺' },
  'Sunita Williams': { agency: 'NASA', role: 'Commander / Test Pilot', nationality: 'American', flag: '🇺🇸' },
  'Butch Wilmore': { agency: 'NASA', role: 'Pilot / Flight Engineer', nationality: 'American', flag: '🇺🇸' },
  'Don Pettit': { agency: 'NASA', role: 'Flight Engineer', nationality: 'American', flag: '🇺🇸' },
  'Alexey Ovchinin': { agency: 'Roscosmos', role: 'Commander', nationality: 'Russian', flag: '🇷🇺' },
  'Ivan Vagner': { agency: 'Roscosmos', role: 'Flight Engineer', nationality: 'Russian', flag: '🇷🇺' },
  'Nick Hague': { agency: 'NASA', role: 'Commander (Crew-9)', nationality: 'American', flag: '🇺🇸' },
  'Aleksandr Gorbunov': { agency: 'Roscosmos', role: 'Mission Specialist', nationality: 'Russian', flag: '🇷🇺' },
  'Li Guangsu': { agency: 'CMSA', role: 'Astronaut', nationality: 'Chinese', flag: '🇨🇳' },
  'Li Cong': { agency: 'CMSA', role: 'Astronaut', nationality: 'Chinese', flag: '🇨🇳' },
  'Ye Guangfu': { agency: 'CMSA', role: 'Commander (Shenzhou 18)', nationality: 'Chinese', flag: '🇨🇳' },
  'Cai Xuzhe': { agency: 'CMSA', role: 'Commander (Shenzhou 19)', nationality: 'Chinese', flag: '🇨🇳' },
  'Song Lingdong': { agency: 'CMSA', role: 'Flight Engineer', nationality: 'Chinese', flag: '🇨🇳' },
  'Wang Haoze': { agency: 'CMSA', role: 'Payload Specialist', nationality: 'Chinese', flag: '🇨🇳' },
};

function enrichAstronaut(raw: { name: string; craft: string }, index: number): Astronaut {
  const meta = ASTRONAUT_METADATA_MAP[raw.name] || {};
  let defaultAgency = 'International Partner';
  let defaultFlag = '🌍';
  let defaultRole = 'Flight Engineer';

  if (raw.craft.toLowerCase().includes('tiangong') || raw.craft.toLowerCase().includes('shenzhou')) {
    defaultAgency = 'CMSA (China)';
    defaultFlag = '🇨🇳';
    defaultRole = 'Taikonaut';
  } else if (raw.craft.toLowerCase().includes('iss')) {
    defaultAgency = 'NASA / Roscosmos';
  }

  return {
    id: `astro-${index + 1}-${raw.name.toLowerCase().replace(/\s+/g, '-')}`,
    name: raw.name,
    craft: raw.craft,
    agency: meta.agency || defaultAgency,
    role: meta.role || defaultRole,
    nationality: meta.nationality || (raw.craft === 'Tiangong' ? 'Chinese' : 'International'),
    flag: meta.flag || defaultFlag,
    bio: `Active mission specialist aboard the ${raw.craft} conducting microgravity scientific experiments and orbital station maintenance.`,
  };
}

export async function GET() {
  let peopleRaw: Array<{ name: string; craft: string }> = [];

  // Try fetching live data with safe 3s timeout
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 3000);

    const res = await fetch('https://corquaid.github.io/international-space-station-APIs/JSON/people-in-space.json', {
      signal: controller.signal,
      headers: { 'Accept': 'application/json' },
      cache: 'no-store',
    });

    clearTimeout(timeoutId);

    if (res.ok) {
      const json = await res.json();
      if (Array.isArray(json.people) && json.people.length > 0) {
        peopleRaw = json.people;
      }
    }
  } catch {
    // Network timeout or external API offline; safe fallback used below
  }

  // If external fetch failed or was empty, use verified active roster
  if (!peopleRaw || peopleRaw.length === 0) {
    peopleRaw = VERIFIED_EXPEDITION_CREW;
  }

  const people = peopleRaw.map((p, idx) => enrichAstronaut(p, idx));

  const craftBreakdown: Record<string, number> = {};
  for (const p of people) {
    craftBreakdown[p.craft] = (craftBreakdown[p.craft] || 0) + 1;
  }

  const data: AstronautsData = {
    count: people.length,
    craftBreakdown,
    people,
    lastUpdated: new Date().toISOString(),
  };

  return NextResponse.json(data, {
    status: 200,
    headers: {
      'Cache-Control': 'no-store, max-age=0',
    },
  });
}
