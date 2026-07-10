const AUTH_TOKEN_KEY = "mel_auth_token";
const AUTH_USER_KEY = "mel_auth_user";

export type StoredAuthUser = {
  id: number;
  name: string;
  email: string;
  role: "USER" | "ADMIN";
};

export function getAuthToken() {
  if (typeof window === "undefined") return null;

  return window.localStorage.getItem(AUTH_TOKEN_KEY);
}

export function saveAuthSession(token: string, user: StoredAuthUser) {
  if (typeof window === "undefined") return;

  window.localStorage.setItem(AUTH_TOKEN_KEY, token);
  window.localStorage.setItem(AUTH_USER_KEY, JSON.stringify(user));
}

export function getStoredAuthUser() {
  if (typeof window === "undefined") return null;

  const rawUser = window.localStorage.getItem(AUTH_USER_KEY);

  if (!rawUser) return null;

  try {
    return JSON.parse(rawUser) as StoredAuthUser;
  } catch {
    return null;
  }
}

export function clearAuthSession() {
  if (typeof window === "undefined") return;

  window.localStorage.removeItem(AUTH_TOKEN_KEY);
  window.localStorage.removeItem(AUTH_USER_KEY);
}