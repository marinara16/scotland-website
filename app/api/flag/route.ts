import { NextRequest, NextResponse } from 'next/server';
import { saveItinerary } from '@/lib/github';
import type { Itinerary } from '@/lib/types';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  const { stopId, note, unflag } = await req.json() as {
    stopId: string;
    note?: string;
    unflag?: boolean;
  };

  const token = process.env.GITHUB_TOKEN;
  const owner = process.env.GITHUB_REPO_OWNER;
  const repo = process.env.GITHUB_REPO_NAME;

  if (!token || !owner || !repo) {
    return NextResponse.json({ error: 'Missing env vars' }, { status: 500 });
  }

  // Fetch current itinerary
  const res = await fetch(
    `https://api.github.com/repos/${owner}/${repo}/contents/data/itinerary.json`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: 'application/vnd.github.raw+json',
      },
      cache: 'no-store',
    }
  );

  if (!res.ok) return NextResponse.json({ error: 'Failed to fetch itinerary' }, { status: 500 });

  const itinerary: Itinerary = await res.json();

  // Find and update the stop
  let found = false;
  for (const day of itinerary.days) {
    for (const stop of day.stops) {
      if (stop.id === stopId) {
        if (unflag) {
          delete stop.flag;
        } else {
          stop.flag = { note: note ?? '', flaggedAt: new Date().toISOString() };
        }
        found = true;
        break;
      }
    }
    if (found) break;
  }

  if (!found) return NextResponse.json({ error: 'Stop not found' }, { status: 404 });

  await saveItinerary(itinerary);
  return NextResponse.json({ ok: true });
}
