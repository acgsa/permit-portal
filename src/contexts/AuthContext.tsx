'use client';

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
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

export interface UserProfile {
  username: string;
  email: string | null;
  firstName: string | null;
  lastName: string | null;
  phone: string | null;
  addressStreet: string | null;
  addressCity: string | null;
  addressState: string | null;
  addressZip: string | null;
  entityType: string | null;
  organization: string | null;
  needsProfileCompletion: boolean;
}

export interface AuthUser {
  sub: string;
  role: string;
  profile: UserProfile | null;
}

interface AuthContextValue {
  user: AuthUser | null;
  token: string | null;
  login: (username: string, password: string) => Promise<void>;
  loginWithLoginGov: () => void;
  logout: () => void;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue>({
  user: null,
  token: null,
  login: async () => {},
  loginWithLoginGov: () => {},
  logout: () => {},
  refreshProfile: async () => {},
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

  const [profile, setProfile] = useState<UserProfile | null>(null);

  const baseUser = useMemo(() => {
    if (!token) return null;
    const claims = getTokenClaims(token);
    const sub = typeof claims['sub'] === 'string' ? claims['sub'] : '';
    const claimRole = typeof claims['role'] === 'string' ? claims['role'] : 'applicant';

    let role = claimRole;
    const normalizedSub = sub.toLowerCase();

    // Keep pilot staff personas in staff portal flow even when non-demo auth returns applicant role.
    if (normalizedSub.includes('doug.smith')) {
      role = 'admin';
    } else if (normalizedSub.includes('sarah.chen')) {
      role = 'staff';
    }

    return sub ? { sub, role } : null;
  }, [token]);

  const user = useMemo<AuthUser | null>(() => {
    if (!baseUser) return null;
    return { ...baseUser, profile };
  }, [baseUser, profile]);

  // Fetch profile when token changes
  const refreshProfile = useCallback(async () => {
    if (!token) {
      setProfile(null);
      return;
    }
    try {
      const p = await api.fetchProfile(token);
      setProfile(p);
    } catch {
      setProfile(null);
    }
  }, [token]);

  useEffect(() => {
    if (token) {
      refreshProfile();
    } else {
      setProfile(null);
    }
  }, [token, refreshProfile]);

  const login = useCallback(async (username: string, password: string) => {
    const resp = await api.login(username, password);
    saveToken(resp.access_token);
  }, []);

  const loginWithLoginGov = useCallback(() => {
    api.redirectToLoginGov();
  }, []);

  const logout = useCallback(() => {
    setProfile(null);
    clearToken();
  }, []);

  const value = useMemo(
    () => ({ user, token, login, loginWithLoginGov, logout, refreshProfile }),
    [user, token, login, loginWithLoginGov, logout, refreshProfile],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  return useContext(AuthContext);
}
