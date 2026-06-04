import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET() {
  const token = process.env.GITHUB_TOKEN;
  const owner = process.env.GITHUB_REPO_OWNER;
  const repo = process.env.GITHUB_REPO_NAME;

  if (!token || !owner || !repo) {
    return NextResponse.json({ error: 'GitHub env vars not configured' }, { status: 500 });
  }

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

  if (!res.ok) {
    return NextResponse.json({ error: 'Failed to fetch itinerary' }, { status: 500 });
  }

  const data = await res.json();
  return NextResponse.json(data);
}
