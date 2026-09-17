import { NextResponse } from 'next/server';
import { Astronaut, AstronautsData } from '@/types/iss';

export const dynamic = 'force-dynamic';

function getFlagEmoji(countryCode?: string): string {
  if (!countryCode || countryCode.length !== 2) return '🌍';
  const codePoints = countryCode
    .toUpperCase()
    .split('')
    .map((char) => 127397 + char.charCodeAt(0));
  return String.fromCodePoint(...codePoints);
}

interface RawPerson {
  id?: number | string;
  name: string;
  country?: string;
  flag_code?: string;
  agency?: string;
  position?: string;
  role?: string;
  spacecraft?: string;
  craft?: string;
  iss?: boolean;
  days_in_space?: number;
  launched?: number;
  url?: string;
  image?: string;
  instagram?: string;
  twitter?: string;
  facebook?: string;
}

export async function GET() {
  let people: Astronaut[] = [];
  let issExpedition: number | undefined = undefined;

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 6000);

    const res = await fetch('https://corquaid.github.io/international-space-station-APIs/JSON/people-in-space.json', {
      signal: controller.signal,
      headers: { 'Accept': 'application/json' },
      cache: 'no-store',
    });

    clearTimeout(timeoutId);

    if (res.ok) {
      const data = await res.json();
      issExpedition = data.iss_expedition;

      if (Array.isArray(data.people) && data.people.length > 0) {
        people = data.people.map((p: RawPerson, idx: number) => {
          const station = p.iss ? 'ISS' : p.country === 'China' || (p.spacecraft && p.spacecraft.includes('Shenzhou')) ? 'Tiangong' : 'ISS';
          const flag = p.flag_code ? getFlagEmoji(p.flag_code) : '🌍';

          return {
            id: `astro-${p.id || idx + 1}-${p.name.toLowerCase().replace(/\s+/g, '-')}`,
            name: p.name,
            station,
            craft: station,
            spacecraft: p.spacecraft || (p.iss ? 'ISS' : 'Tiangong'),
            agency: p.agency || (station === 'Tiangong' ? 'CMSA' : 'International Partner'),
            role: p.position || p.role || 'Flight Engineer',
            nationality: p.country || (station === 'Tiangong' ? 'China' : 'International'),
            flag,
            daysInSpace: p.days_in_space,
            launched: p.launched,
            launchDate: p.launched ? new Date(p.launched * 1000).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : undefined,
            image: p.image,
            url: p.url,
            instagram: p.instagram,
            twitter: p.twitter,
            facebook: p.facebook,
            bio: p.days_in_space !== undefined
              ? `Currently serving aboard ${station} (${p.spacecraft || station}). Has logged ${p.days_in_space} total days in space conducting microgravity scientific experiments and orbital station maintenance.`
              : `Active mission crew specialist aboard the ${station}.`,
          };
        });
      }
    }
  } catch (err) {
    console.warn('Live people-in-space API fetch error:', err);
  }

  // Fallback only if the live API is completely unreachable
  if (people.length === 0) {
    people = [
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
        image: 'https://upload.wikimedia.org/wikipedia/commons/4/44/Jessica_Meir_official_portrait_in_an_EMU.jpg',
        url: 'https://en.wikipedia.org/wiki/Jessica_Meir',
        instagram: 'https://www.instagram.com/astro_jessica',
        twitter: 'https://x.com/Astro_Jessica',
        bio: 'Currently serving aboard ISS (Crew-12 Dragon). Has logged 204 total days in space conducting microgravity scientific experiments.',
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
        image: 'https://upload.wikimedia.org/wikipedia/commons/8/84/Jack_Hathaway_2024.jpg',
        url: 'https://en.wikipedia.org/wiki/Jack_Hathaway',
        instagram: 'https://www.instagram.com/astro_hathaway',
        twitter: 'https://x.com/astro_hathaway',
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
        image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/3b/Official_portrait_of_ESA_astronaut_Sophie_Adenot_%28jsc2025e058846_alt%29.jpg/500px-Official_portrait_of_ESA_astronaut_Sophie_Adenot_%28jsc2025e058846_alt%29.jpg',
        url: 'https://en.wikipedia.org/wiki/Sophie_Adenot',
        instagram: 'https://www.instagram.com/soph_astro',
        twitter: 'https://x.com/Soph_astro',
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
        image: 'https://upload.wikimedia.org/wikipedia/commons/1/1d/SpaceX_crew_6_image_5.png',
        url: 'https://en.wikipedia.org/wiki/Andrey_Fedyaev',
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
        image: 'https://upload.wikimedia.org/wikipedia/commons/9/97/Zhu_Yangzhu_%2820260523%29.jpg',
        url: 'https://en.wikipedia.org/wiki/Zhu_Yangzhu',
        bio: 'Currently serving aboard Tiangong (Shenzhou 23). Has logged 150 total days in space.',
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
        image: 'https://upload.wikimedia.org/wikipedia/commons/6/68/Zhang_Zhiyuan_%2820260523%29.jpg',
        url: 'https://en.wikipedia.org/wiki/Zhang_Zhiyuan_(astronaut)',
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
        image: 'https://upload.wikimedia.org/wikipedia/commons/7/77/Lai_Ka-ying_%2820260523%29.jpg',
        url: 'https://en.wikipedia.org/wiki/Lai_Ka-ying',
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
        image: 'https://upload.wikimedia.org/wikipedia/commons/d/d9/Pyotr_Dubrov_in_2021.jpg',
        url: 'https://en.wikipedia.org/wiki/Pyotr_Dubrov',
        bio: 'Currently serving aboard ISS (Soyuz MS-29). Has logged 355 total days in space.',
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
        image: 'https://upload.wikimedia.org/wikipedia/commons/1/13/Anna_Kikina_Official_Portrait.jpg',
        url: 'https://en.wikipedia.org/wiki/Anna_Kikina',
        bio: 'Currently serving aboard ISS (Soyuz MS-29). Has logged 157 total days in space.',
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
        image: 'https://upload.wikimedia.org/wikipedia/commons/5/59/NASA_Astronaut_Anil_Menon_%28jsc2024e013690_alt%29.jpg',
        url: 'https://en.wikipedia.org/wiki/Anil_Menon',
        instagram: 'https://www.instagram.com/astro_anil/',
        twitter: 'https://x.com/astro_anil',
        bio: 'Currently serving aboard ISS (Soyuz MS-29).',
      },
    ];
  }

  const craftBreakdown: Record<string, number> = {};
  for (const p of people) {
    const key = p.station || p.craft;
    craftBreakdown[key] = (craftBreakdown[key] || 0) + 1;
  }

  const payload: AstronautsData = {
    count: people.length,
    issExpedition,
    craftBreakdown,
    people,
    lastUpdated: new Date().toISOString(),
  };

  return NextResponse.json(payload, {
    status: 200,
    headers: {
      'Cache-Control': 'no-store, max-age=0',
    },
  });
}
