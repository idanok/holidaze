const API_BASE = 'https://v2.api.noroff.dev';
const API_KEY = import.meta.env.VITE_API_KEY;

export interface VenueFormData {
  name: string;
  description: string;
  price: number;
  maxGuests: number;
  media?: { url: string; alt: string }[];
  meta?: {
    wifi: boolean;
    parking: boolean;
    breakfast: boolean;
    pets: boolean;
  };
  location?: {
    address: string;
    city: string;
    country: string;
  };
}

export const getVenues = async () => {
  const res = await fetch(`${API_BASE}/holidaze/venues`, {
    headers: { 'X-Noroff-API-Key': API_KEY },
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.errors?.[0]?.message || 'Failed to fetch venues');
  return data.data;
};

export const getVenueById = async (id: string) => {
  const res = await fetch(`${API_BASE}/holidaze/venues/${id}?_owner=true&_bookings=true`, {
    headers: { 'X-Noroff-API-Key': API_KEY },
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.errors?.[0]?.message || 'Failed to fetch venue');
  return data.data;
};

export const searchVenues = async (query: string) => {
  const res = await fetch(`${API_BASE}/holidaze/venues/search?q=${encodeURIComponent(query)}`, {
    headers: { 'X-Noroff-API-Key': API_KEY },
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.errors?.[0]?.message || 'Search failed');
  return data.data;
};

export const createVenue = async (data: VenueFormData, token: string) => {
  console.log('Creating venue with token:', token);
  console.log('API KEY:', API_KEY);
  const res = await fetch(`${API_BASE}/holidaze/venues`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
      'X-Noroff-API-Key': API_KEY,
    },
    body: JSON.stringify(data),
  });
  const resData = await res.json();
  console.log('Create venue response:', resData);
  if (!res.ok) throw new Error(resData.errors?.[0]?.message || 'Failed to create venue');
  return resData.data;
};

export const updateVenue = async (id: string, data: VenueFormData, token: string) => {
  const res = await fetch(`${API_BASE}/holidaze/venues/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
      'X-Noroff-API-Key': API_KEY,
    },
    body: JSON.stringify(data),
  });
  const resData = await res.json();
  if (!res.ok) throw new Error(resData.errors?.[0]?.message || 'Failed to update venue');
  return resData.data;
};

export const deleteVenue = async (id: string, token: string) => {
  const res = await fetch(`${API_BASE}/holidaze/venues/${id}`, {
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${token}`,
      'X-Noroff-API-Key': API_KEY,
    },
  });
  if (!res.ok) {
    const data = await res.json();
    throw new Error(data.errors?.[0]?.message || 'Failed to delete venue');
  }
};