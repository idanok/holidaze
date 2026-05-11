const BASE_URL = 'https://v2.api.noroff.dev';

export async function loginUser(email: string, password: string) {
  const response = await fetch(`${BASE_URL}/auth/login?_holidaze=true`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Noroff-API-Key': import.meta.env.VITE_API_KEY,
    },
    body: JSON.stringify({ email, password }),
  });

  const data = await response.json();
  console.log('Login response:', data);
  if (!response.ok) {
    const messages = data.errors?.map((e: { message: string }) => e.message).join(', ');
    throw new Error(messages || 'Login failed');
  }

  return data.data;
}

export async function registerUser(
  name: string,
  email: string,
  password: string,
  venueManager: boolean
) {
  const response = await fetch(`${BASE_URL}/auth/register`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Noroff-API-Key': import.meta.env.VITE_API_KEY,
    },
    body: JSON.stringify({ name, email, password, venueManager }),
  });

  const data = await response.json();
  if (!response.ok) {
    const messages = data.errors?.map((e: { message: string }) => e.message).join(', ');
    throw new Error(messages || 'Registration failed');
  }

  return data.data;
}