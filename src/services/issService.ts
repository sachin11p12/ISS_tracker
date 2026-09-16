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

  return {
    count: 10,
    issExpedition: 75,
    craftBreakdown: { ISS: 7, Tiangong: 3 },
    people: [
      {
        id: 'astro-1',
        name: 'Jessica Meir',
        station: 'ISS',
        craft: 'ISS',
        spacecraft: 'Crew-12 Dragon',
        agency: 'NASA',
        role: 'Flight Engineer',
        nationality: 'United States',
        flag: '🇺🇸',
        daysInSpace: 204,
        bio: 'Currently serving aboard ISS (Crew-12 Dragon). Has logged 204 days in space.',
      },
      {
        id: 'astro-2',
        name: 'Jack Hathaway',
        station: 'ISS',
        craft: 'ISS',
        spacecraft: 'Crew-12 Dragon',
        agency: 'NASA',
        role: 'Flight Engineer',
        nationality: 'United States',
        flag: '🇺🇸',
        daysInSpace: 0,
        bio: 'Currently serving aboard ISS (Crew-12 Dragon).',
      },
      {
        id: 'astro-3',
        name: 'Sophie Adenot',
        station: 'ISS',
        craft: 'ISS',
        spacecraft: 'Crew-12 Dragon',
        agency: 'ESA',
        role: 'Flight Engineer',
        nationality: 'France',
        flag: '🇫🇷',
        daysInSpace: 0,
        bio: 'Currently serving aboard ISS (Crew-12 Dragon).',
      },
      {
        id: 'astro-4',
        name: 'Andrey Fedyaev',
        station: 'ISS',
        craft: 'ISS',
        spacecraft: 'Crew-12 Dragon',
        agency: 'Roscosmos',
        role: 'Flight Engineer',
        nationality: 'Russia',
        flag: '🇷🇺',
        daysInSpace: 0,
        bio: 'Currently serving aboard ISS (Crew-12 Dragon).',
      },
      {
        id: 'astro-5',
        name: 'Zhu Yangzhu',
        station: 'Tiangong',
        craft: 'Tiangong',
        spacecraft: 'Shenzhou 23',
        agency: 'CMSA',
        role: 'Commander',
        nationality: 'China',
        flag: '🇨🇳',
        daysInSpace: 150,
        bio: 'Currently serving aboard Tiangong (Shenzhou 23). Has logged 150 days in space.',
      },
      {
        id: 'astro-6',
        name: 'Zhang Zhiyuan',
        station: 'Tiangong',
        craft: 'Tiangong',
        spacecraft: 'Shenzhou 23',
        agency: 'CMSA',
        role: 'Pilot',
        nationality: 'China',
        flag: '🇨🇳',
        daysInSpace: 0,
        bio: 'Currently serving aboard Tiangong (Shenzhou 23).',
      },
      {
        id: 'astro-7',
        name: 'Lai Ka-ying',
        station: 'Tiangong',
        craft: 'Tiangong',
        spacecraft: 'Shenzhou 23',
        agency: 'CMSA',
        role: 'Payload Specialist',
        nationality: 'China',
        flag: '🇨🇳',
        daysInSpace: 0,
        bio: 'Currently serving aboard Tiangong (Shenzhou 23).',
      },
      {
        id: 'astro-8',
        name: 'Pyotr Dubrov',
        station: 'ISS',
        craft: 'ISS',
        spacecraft: 'Soyuz MS-29',
        agency: 'Roscosmos',
        role: 'Commander',
        nationality: 'Russia',
        flag: '🇷🇺',
        daysInSpace: 355,
        bio: 'Currently serving aboard ISS (Soyuz MS-29). Has logged 355 days in space.',
      },
      {
        id: 'astro-9',
        name: 'Anna Kikina',
        station: 'ISS',
        craft: 'ISS',
        spacecraft: 'Soyuz MS-29',
        agency: 'Roscosmos',
        role: 'Flight Engineer',
        nationality: 'Russia',
        flag: '🇷🇺',
        daysInSpace: 157,
        bio: 'Currently serving aboard ISS (Soyuz MS-29). Has logged 157 days in space.',
      },
      {
        id: 'astro-10',
        name: 'Anil Menon',
        station: 'ISS',
        craft: 'ISS',
        spacecraft: 'Soyuz MS-29',
        agency: 'NASA',
        role: 'Flight Engineer',
        nationality: 'United States',
        flag: '🇺🇸',
        daysInSpace: 0,
        bio: 'Currently serving aboard ISS (Soyuz MS-29).',
      },
    ],
    lastUpdated: new Date().toISOString(),
  };
}
