const AUTH_KEY = 'scotland_trip_auth';

export function checkAuth(): boolean {
  if (typeof window === 'undefined') return false;
  return localStorage.getItem(AUTH_KEY) === 'authenticated';
}

export function setAuth(): void {
  localStorage.setItem(AUTH_KEY, 'authenticated');
}

export function clearAuth(): void {
  localStorage.removeItem(AUTH_KEY);
}

export function validatePassword(input: string): boolean {
  const password = process.env.NEXT_PUBLIC_APP_PASSWORD;
  if (!password) return false;
  return input === password;
}
