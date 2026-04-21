const BASE_URL = 'https://v2.api.noroff.dev';

export async function getVenues() {
  const response = await fetch(`${BASE_URL}/holidaze/venues?limit=100&sort=created&sortOrder=desc`);
  const data = await response.json();
  if (!response.ok) throw new Error(data.errors?.[0]?.message || 'Failed to fetch venues');
  return data.data;
}

export async function searchVenues(query: string) {
  const response = await fetch(`${BASE_URL}/holidaze/venues/search?q=${query}`);
  const data = await response.json();
  if (!response.ok) throw new Error(data.errors?.[0]?.message || 'Search failed');
  return data.data;
}