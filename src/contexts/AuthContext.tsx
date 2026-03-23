'use client';

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useSyncExternalStore,
} from 'react';
import * as api from '@/lib/api';
import {
  clearToken,
  getToken,
  getTokenClaims,
  isTokenValid,
  saveToken,
  subscribeTokenChange,
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
  const token = useSyncExternalStore(
    subscribeTokenChange,
    () => {
      const stored = getToken();
      return isTokenValid(stored) ? stored : null;
    },
    () => null,
  );

  const user = useMemo<AuthUser | null>(() => {
    if (!token) return null;
    const claims = getTokenClaims(token);
    const sub = typeof claims['sub'] === 'string' ? claims['sub'] : '';
    const claimRole = typeof claims['role'] === 'string' ? claims['role'] : 'applicant';

    let role = claimRole;
    const normalizedSub = sub.toLowerCase();

    // Keep pilot staff personas in staff portal flow even when non-demo auth returns applicant role.
    if (normalizedSub.includes('doug.burgum')) {
      role = 'admin';
    } else if (normalizedSub.includes('harmony.munro')) {
      role = 'staff';
    }

    return sub ? { sub, role } : null;
  }, [token]);

  const login = useCallback(async (username: string, password: string) => {
    const resp = await api.login(username, password);
    saveToken(resp.access_token);
  }, []);

  const logout = useCallback(() => {
    clearToken();
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
