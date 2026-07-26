import { createContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import { login as loginRequest, fetchProfile } from '../services/authService';
import type { AuthContextData, AuthResponse, LoginRequest, UserSession } from '../types';

const STORAGE_TOKEN = '@prive.token';
const STORAGE_USER = '@prive.user';

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthContext = createContext<AuthContextData>({} as AuthContextData);

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<UserSession | null>(() => {
    const storedUser = localStorage.getItem(STORAGE_USER);
    if (!storedUser) return null;

    try {
      return JSON.parse(storedUser) as UserSession;
    } catch {
      localStorage.removeItem(STORAGE_USER);
      return null;
    }
  });

  useEffect(() => {
    const token = localStorage.getItem(STORAGE_TOKEN);
    if (!token) return;
    if (user) return;

    fetchProfile()
      .then((profile) => {
        setUser(profile.user);
        localStorage.setItem(STORAGE_USER, JSON.stringify(profile.user));
      })
      .catch(() => {
        localStorage.removeItem(STORAGE_TOKEN);
        localStorage.removeItem(STORAGE_USER);
        setUser(null);
      });
  }, [user]);

  const login = async ({ email, password }: LoginRequest) => {
    const auth = await loginRequest({ email, password });
    localStorage.setItem(STORAGE_TOKEN, auth.token);
    localStorage.setItem(STORAGE_USER, JSON.stringify(auth.user));
    setUser(auth.user);
  };

  const logout = () => {
    localStorage.removeItem(STORAGE_TOKEN);
    localStorage.removeItem(STORAGE_USER);
    setUser(null);
  };

  const value = useMemo(
    () => ({
      user,
      isAuthenticated: Boolean(user),
      login,
      logout,
    }),
    [user],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
