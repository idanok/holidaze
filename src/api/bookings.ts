const BASE_URL = 'https://v2.api.noroff.dev';

export async function createBooking(
  token: string,
  venueId: string,
  dateFrom: string,
  dateTo: string,
  guests: number
) {
  const response = await fetch(`${BASE_URL}/holidaze/bookings`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ venueId, dateFrom, dateTo, guests }),
  });

  const data = await response.json();
  if (!response.ok) throw new Error(data.errors?.[0]?.message || 'Booking failed');
  return data.data;
}