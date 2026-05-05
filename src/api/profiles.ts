const BASE_URL = 'https://v2.api.noroff.dev';

export async function getProfileBookings(name: string, token: string) {
  const response = await fetch(
    `${BASE_URL}/holidaze/profiles/${name}/bookings?_venue=true`,
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );
  const data = await response.json();
  if (!response.ok) throw new Error(data.errors?.[0]?.message || 'Failed to fetch bookings');
  return data.data;
}

export async function getProfileVenues(name: string, token: string) {
  const response = await fetch(
    `${BASE_URL}/holidaze/profiles/${name}/venues?_bookings=true`,
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );
  const data = await response.json();
  if (!response.ok) throw new Error(data.errors?.[0]?.message || 'Failed to fetch venues');
  return data.data;
}

export async function updateAvatar(name: string, token: string, url: string) {
  const response = await fetch(`${BASE_URL}/holidaze/profiles/${name}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ avatar: { url, alt: name } }),
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data.errors?.[0]?.message || 'Failed to update avatar');
  return data.data;
}

export async function deleteVenue(id: string, token: string) {
  const response = await fetch(`https://v2.api.noroff.dev/holidaze/venues/${id}`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!response.ok) throw new Error('Failed to delete venue');
}