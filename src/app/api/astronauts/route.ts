import { NextResponse } from 'next/server';
import { getAstronautsData } from '@/lib/astronautsData';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const payload = await getAstronautsData();
    return NextResponse.json(payload, {
      status: 200,
      headers: {
        'Cache-Control': 'no-store, max-age=0',
      },
    });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Failed to retrieve astronauts';
    return NextResponse.json({ message: msg }, { status: 500 });
  }
}
