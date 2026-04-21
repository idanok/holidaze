const BASE_URL = 'https://v2.api.noroff.dev';

export async function loginUser(email: string, password: string) {
  const response = await fetch(`${BASE_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });

  const data = await response.json();

  if (!response.ok) {
    console.error('Login error:', data);
    throw new Error(data.errors?.[0]?.message || 'Login failed');
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
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, email, password, venueManager }),
  });

  const data = await response.json();

  if (!response.ok) {
    console.error('Register error:', data);
    const messages = data.errors?.map((e: { message: string }) => e.message).join(', ');
    throw new Error(messages || 'Registration failed');
  }

  return data.data;
}