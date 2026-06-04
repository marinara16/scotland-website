import { NextResponse } from 'next/server';
import { saveItinerary } from '@/lib/github';
import type { Itinerary, Stop } from '@/lib/types';

export const dynamic = 'force-dynamic';

async function geocode(address: string, token: string): Promise<{ lat: number; lng: number } | null> {
  if (!address.trim()) return null;
  try {
    const res = await fetch(
      `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(address)}.json?access_token=${token}&country=gb&limit=1`,
      { cache: 'no-store' }
    );
    const json = await res.json();
    const feature = json.features?.[0];
    if (!feature) return null;
    const [lng, lat] = feature.center;
    return { lat, lng };
  } catch {
    return null;
  }
}

export async function POST() {
  const mapboxToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;
  const githubToken = process.env.GITHUB_TOKEN;
  const owner = process.env.GITHUB_REPO_OWNER;
  const repo = process.env.GITHUB_REPO_NAME;

  if (!mapboxToken || !githubToken || !owner || !repo) {
    return NextResponse.json({ error: 'Missing env vars' }, { status: 500 });
  }

  // Fetch current itinerary from GitHub
  const res = await fetch(
    `https://api.github.com/repos/${owner}/${repo}/contents/data/itinerary.json`,
    {
      headers: {
        Authorization: `Bearer ${githubToken}`,
        Accept: 'application/vnd.github.raw+json',
      },
      cache: 'no-store',
    }
  );

  if (!res.ok) return NextResponse.json({ error: 'Failed to fetch itinerary' }, { status: 500 });

  const itinerary: Itinerary = await res.json();
  let updated = 0;
  let failed = 0;

  for (const day of itinerary.days) {
    for (const stop of day.stops) {
      // Skip if coordinates already set
      if (stop.lat != null && stop.lng != null) continue;
      // Skip if no address to geocode
      if (!stop.address?.trim()) { failed++; continue; }

      const coords = await geocode(stop.address, mapboxToken);
      if (coords) {
        stop.lat = coords.lat;
        stop.lng = coords.lng;
        updated++;
      } else {
        failed++;
      }

      // Small delay to avoid hitting rate limits
      await new Promise((r) => setTimeout(r, 150));
    }
  }

  // Save back to GitHub
  await saveItinerary(itinerary);

  return NextResponse.json({ ok: true, updated, failed });
}
