import { NextRequest, NextResponse } from 'next/server';
import { saveItinerary } from '@/lib/github';
import type { Itinerary } from '@/lib/types';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json() as { itinerary: Itinerary };
    if (!body.itinerary) {
      return NextResponse.json({ error: 'Missing itinerary' }, { status: 400 });
    }
    await saveItinerary(body.itinerary);
    return NextResponse.json({ ok: true });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
