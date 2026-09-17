import { Astronaut, AstronautsData } from '@/types/iss';

function getFlagEmoji(countryCode?: string): string {
  if (!countryCode || countryCode.length !== 2) return '🌍';
  const codePoints = countryCode
    .toUpperCase()
    .split('')
    .map((char) => 127397 + char.charCodeAt(0));
  return String.fromCodePoint(...codePoints);
}

export const VERIFIED_ASTRONAUTS: Astronaut[] = [
  {
    id: 'astro-1-jessica-meir',
    name: 'Jessica Meir',
    station: 'ISS',
    craft: 'ISS',
    spacecraft: 'Crew-12 Dragon',
    agency: 'NASA',
    role: 'Flight Engineer',
    nationality: 'United States',
    flag: '🇺🇸',
    daysInSpace: 204,
    launched: 1770974155,
    launchDate: 'Feb 13, 2026',
    image: 'https://upload.wikimedia.org/wikipedia/commons/4/44/Jessica_Meir_official_portrait_in_an_EMU.jpg',
    url: 'https://en.wikipedia.org/wiki/Jessica_Meir',
    instagram: 'https://www.instagram.com/astro_jessica',
    twitter: 'https://x.com/Astro_Jessica',
    bio: 'Currently serving aboard ISS (Crew-12 Dragon). Has logged 204 total days in space conducting microgravity scientific experiments and space station operations.',
  },
  {
    id: 'astro-2-jack-hathaway',
    name: 'Jack Hathaway',
    station: 'ISS',
    craft: 'ISS',
    spacecraft: 'Crew-12 Dragon',
    agency: 'NASA',
    role: 'Flight Engineer',
    nationality: 'United States',
    flag: '🇺🇸',
    daysInSpace: 0,
    launched: 1770974155,
    launchDate: 'Feb 13, 2026',
    image: '/images/astronauts/jack-hathaway.svg',
    url: 'https://en.wikipedia.org/wiki/Jack_Hathaway',
    instagram: 'https://www.instagram.com/astro_hathaway',
    twitter: 'https://x.com/astro_hathaway',
    bio: 'Currently serving aboard ISS (Crew-12 Dragon). Flight engineer conducting mission operations.',
  },
  {
    id: 'astro-3-sophie-adenot',
    name: 'Sophie Adenot',
    station: 'ISS',
    craft: 'ISS',
    spacecraft: 'Crew-12 Dragon',
    agency: 'ESA',
    role: 'Flight Engineer',
    nationality: 'France',
    flag: '🇫🇷',
    daysInSpace: 0,
    launched: 1770974155,
    launchDate: 'Feb 13, 2026',
    image: '/images/astronauts/sophie-adenot.svg',
    url: 'https://en.wikipedia.org/wiki/Sophie_Adenot',
    instagram: 'https://www.instagram.com/soph_astro',
    twitter: 'https://x.com/Soph_astro',
    bio: 'Currently serving aboard ISS (Crew-12 Dragon). ESA astronaut conducting European Columbus laboratory research.',
  },
  {
    id: 'astro-4-andrey-fedyaev',
    name: 'Andrey Fedyaev',
    station: 'ISS',
    craft: 'ISS',
    spacecraft: 'Crew-12 Dragon',
    agency: 'Roscosmos',
    role: 'Flight Engineer',
    nationality: 'Russia',
    flag: '🇷🇺',
    daysInSpace: 0,
    launched: 1770974155,
    launchDate: 'Feb 13, 2026',
    image: '/images/astronauts/andrey-fedyaev.svg',
    url: 'https://en.wikipedia.org/wiki/Andrey_Fedyaev',
    bio: 'Currently serving aboard ISS (Crew-12 Dragon). Roscosmos cosmonaut managing Russian orbital segment systems.',
  },
  {
    id: 'astro-5-zhu-yangzhu',
    name: 'Zhu Yangzhu',
    station: 'Tiangong',
    craft: 'Tiangong',
    spacecraft: 'Shenzhou 23',
    agency: 'CMSA',
    role: 'Commander',
    nationality: 'China',
    flag: '🇨🇳',
    daysInSpace: 150,
    launched: 1779628116,
    launchDate: 'May 23, 2026',
    image: '/images/astronauts/zhu-yangzhu.svg',
    url: 'https://en.wikipedia.org/wiki/Zhu_Yangzhu',
    bio: 'Currently serving aboard Tiangong (Shenzhou 23). Has logged 150 total days in space as station commander.',
  },
  {
    id: 'astro-6-zhang-zhiyuan',
    name: 'Zhang Zhiyuan',
    station: 'Tiangong',
    craft: 'Tiangong',
    spacecraft: 'Shenzhou 23',
    agency: 'CMSA',
    role: 'Pilot',
    nationality: 'China',
    flag: '🇨🇳',
    daysInSpace: 0,
    launched: 1779628116,
    launchDate: 'May 23, 2026',
    image: '/images/astronauts/zhang-zhiyuan.svg',
    url: 'https://en.wikipedia.org/wiki/Zhang_Zhiyuan_(astronaut)',
    bio: 'Currently serving aboard Tiangong (Shenzhou 23) as spacecraft pilot.',
  },
  {
    id: 'astro-7-lai-ka-ying',
    name: 'Lai Ka-ying',
    station: 'Tiangong',
    craft: 'Tiangong',
    spacecraft: 'Shenzhou 23',
    agency: 'CMSA',
    role: 'Payload Specialist',
    nationality: 'China',
    flag: '🇨🇳',
    daysInSpace: 0,
    launched: 1779628116,
    launchDate: 'May 23, 2026',
    image: '/images/astronauts/lai-ka-ying.svg',
    url: 'https://en.wikipedia.org/wiki/Lai_Ka-ying',
    bio: 'Currently serving aboard Tiangong (Shenzhou 23) as payload and science specialist.',
  },
  {
    id: 'astro-8-pyotr-dubrov',
    name: 'Pyotr Dubrov',
    station: 'ISS',
    craft: 'ISS',
    spacecraft: 'Soyuz MS-29',
    agency: 'Roscosmos',
    role: 'Commander',
    nationality: 'Russia',
    flag: '🇷🇺',
    daysInSpace: 355,
    launched: 1784040463,
    launchDate: 'Jul 14, 2026',
    image: 'https://upload.wikimedia.org/wikipedia/commons/d/d9/Pyotr_Dubrov_in_2021.jpg',
    url: 'https://en.wikipedia.org/wiki/Pyotr_Dubrov',
    bio: 'Currently serving aboard ISS (Soyuz MS-29). Has logged 355 total days in space.',
  },
  {
    id: 'astro-9-anna-kikina',
    name: 'Anna Kikina',
    station: 'ISS',
    craft: 'ISS',
    spacecraft: 'Soyuz MS-29',
    agency: 'Roscosmos',
    role: 'Flight Engineer',
    nationality: 'Russia',
    flag: '🇷🇺',
    daysInSpace: 157,
    launched: 1784040463,
    launchDate: 'Jul 14, 2026',
    image: 'https://upload.wikimedia.org/wikipedia/commons/1/13/Anna_Kikina_Official_Portrait.jpg',
    url: 'https://en.wikipedia.org/wiki/Anna_Kikina',
    bio: 'Currently serving aboard ISS (Soyuz MS-29). Has logged 157 total days in space.',
  },
  {
    id: 'astro-10-anil-menon',
    name: 'Anil Menon',
    station: 'ISS',
    craft: 'ISS',
    spacecraft: 'Soyuz MS-29',
    agency: 'NASA',
    role: 'Flight Engineer',
    nationality: 'United States',
    flag: '🇺🇸',
    daysInSpace: 0,
    launched: 1784040463,
    launchDate: 'Jul 14, 2026',
    image: '/images/astronauts/anil-menon.svg',
    url: 'https://en.wikipedia.org/wiki/Anil_Menon',
    instagram: 'https://www.instagram.com/astro_anil/',
    twitter: 'https://x.com/astro_anil',
    bio: 'Currently serving aboard ISS (Soyuz MS-29) as flight engineer and physician.',
  },
];

export async function getAstronautsData(): Promise<AstronautsData> {
  let people: Astronaut[] = [];
  let issExpedition: number | undefined = 75;

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 4000);

    const res = await fetch('https://corquaid.github.io/international-space-station-APIs/JSON/people-in-space.json', {
      signal: controller.signal,
      headers: { 'Accept': 'application/json' },
      cache: 'no-store',
    });

    clearTimeout(timeoutId);

    if (res.ok) {
      const data = await res.json();
      issExpedition = data.iss_expedition || 75;

      if (Array.isArray(data.people) && data.people.length > 0) {
        people = data.people.map((p: any, idx: number) => {
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
            image: p.image || VERIFIED_ASTRONAUTS.find(v => v.name.toLowerCase() === p.name.toLowerCase())?.image || `/images/astronauts/${p.name.toLowerCase().replace(/[^a-z0-9]+/g, '-')}.svg`,
            url: p.url,
            instagram: p.instagram,
            twitter: p.twitter,
            facebook: p.facebook,
            bio: p.days_in_space !== undefined
              ? `Currently serving aboard ${station} (${p.spacecraft || station}). Has logged ${p.days_in_space} total days in space conducting microgravity scientific experiments and orbital station operations.`
              : `Active mission crew specialist aboard the ${station}.`,
          };
        });
      }
    }
  } catch (err) {
    console.warn('Live people-in-space fetch notice:', err);
  }

  if (people.length === 0) {
    people = VERIFIED_ASTRONAUTS;
  }

  const craftBreakdown: Record<string, number> = {};
  for (const p of people) {
    const key = p.station || p.craft;
    craftBreakdown[key] = (craftBreakdown[key] || 0) + 1;
  }

  return {
    count: people.length,
    issExpedition,
    craftBreakdown,
    people,
    lastUpdated: new Date().toISOString(),
  };
}
