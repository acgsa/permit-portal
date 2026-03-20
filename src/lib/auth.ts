const TOKEN_KEY = 'permit_gov_token';

export function saveToken(token: string): void {
  localStorage.setItem(TOKEN_KEY, token);
}

export function getToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem(TOKEN_KEY);
}

export function clearToken(): void {
  localStorage.removeItem(TOKEN_KEY);
}

/** Decode the JWT payload (no verification — for UI display only). */
export function getTokenClaims(token: string): Record<string, unknown> {
  try {
    const payload = token.split('.')[1];
    if (!payload) return {};
    const padded = payload.padEnd(payload.length + ((4 - (payload.length % 4)) % 4), '=');
    return JSON.parse(atob(padded)) as Record<string, unknown>;
  } catch {
    return {};
  }
}

/** Return true if a JWT exists and is not yet expired. */
export function isTokenValid(token: string | null): boolean {
  if (!token) return false;
  const claims = getTokenClaims(token);
  const exp = claims['exp'];
  if (typeof exp !== 'number') return true; // no exp claim — treat as valid
  return Date.now() / 1000 < exp;
}
