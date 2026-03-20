'use client';

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import * as api from '@/lib/api';
import {
  clearToken,
  getToken,
  getTokenClaims,
  isTokenValid,
  saveToken,
} from '@/lib/auth';

export interface AuthUser {
  sub: string;
  role: string;
}

interface AuthContextValue {
  user: AuthUser | null;
  token: string | null;
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue>({
  user: null,
  token: null,
  login: async () => {},
  logout: () => {},
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [token, setToken] = useState<string | null>(() => {
    const stored = getToken();
    return isTokenValid(stored) ? stored : null;
  });

  // Sync token from another tab
  useEffect(() => {
    const handleStorage = (e: StorageEvent) => {
      if (e.key !== 'permit_gov_token') return;
      const val = e.newValue;
      setToken(isTokenValid(val) ? val : null);
    };
    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, []);

  const user = useMemo<AuthUser | null>(() => {
    if (!token) return null;
    const claims = getTokenClaims(token);
    const sub = typeof claims['sub'] === 'string' ? claims['sub'] : '';
    const role = typeof claims['role'] === 'string' ? claims['role'] : 'applicant';
    return sub ? { sub, role } : null;
  }, [token]);

  const login = useCallback(async (username: string, password: string) => {
    const resp = await api.login(username, password);
    saveToken(resp.access_token);
    setToken(resp.access_token);
  }, []);

  const logout = useCallback(() => {
    clearToken();
    setToken(null);
  }, []);

  const value = useMemo(
    () => ({ user, token, login, logout }),
    [user, token, login, logout],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  return useContext(AuthContext);
}
