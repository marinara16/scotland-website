import type { Itinerary } from './types';

const API_BASE = 'https://api.github.com';

function getConfig() {
  return {
    token: process.env.GITHUB_TOKEN!,
    owner: process.env.GITHUB_REPO_OWNER!,
    repo: process.env.GITHUB_REPO_NAME!,
    path: 'data/itinerary.json',
  };
}

async function getFileSHA(): Promise<string> {
  const { token, owner, repo, path } = getConfig();
  const res = await fetch(`${API_BASE}/repos/${owner}/${repo}/contents/${path}`, {
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: 'application/vnd.github+json',
    },
  });
  if (!res.ok) throw new Error(`Failed to fetch file metadata: ${res.status}`);
  const data = await res.json();
  return data.sha;
}

export async function saveItinerary(itinerary: Itinerary): Promise<void> {
  const { token, owner, repo, path } = getConfig();
  const sha = await getFileSHA();
  const content = btoa(unescape(encodeURIComponent(JSON.stringify(itinerary, null, 2))));

  const res = await fetch(`${API_BASE}/repos/${owner}/${repo}/contents/${path}`, {
    method: 'PUT',
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: 'application/vnd.github+json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      message: 'Update itinerary via admin panel',
      content,
      sha,
    }),
  });

  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.message || 'Failed to save to GitHub');
  }
}
