'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import type { AuthSession, User } from '@/types';

export interface LoginResult {
  success: boolean;
  error?: string;
}

interface AuthContextType {
  session: AuthSession | null;
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (emailOrUser: string | User, password?: string) => Promise<LoginResult>;
  logout: (redirectTo?: string) => Promise<void>;
  refresh: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

function mapSessionToUser(session: AuthSession | null): User | null {
  if (!session) return null;
  return {
    id: session.id,
    name: session.fullName,
    email: session.email,
    role: session.role,
    staffId: session.staffId,
    orgUnitId: session.orgUnitId,
    bursaryUnit: session.bursaryUnit,
  };
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<AuthSession | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const refresh = async () => {
    try {
      const res = await fetch('/api/auth/me');
      if (res.ok) {
        const json = await res.json();
        setSession(json.data?.session ?? null);
      } else {
        // Fallback: check localStorage for legacy session during migration
        const stored = localStorage.getItem('oau_bursary_user');
        if (stored) {
          const u: User = JSON.parse(stored);
          const mapped: AuthSession = {
            id: u.id,
            staffId: u.staffId || 'P.00000',
            email: u.email,
            fullName: u.name,
            role: u.role,
            orgUnitId: u.orgUnitId || 'org-csc-dept',
            mustChangePassword: false,
          };
          setSession(mapped);
        } else {
          setSession(null);
        }
      }
    } catch {
      setSession(null);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    refresh();
  }, []);

  const login = async (emailOrUser: string | User, password?: string): Promise<LoginResult> => {
    // If called with legacy User object
    if (typeof emailOrUser !== 'string') {
      const u = emailOrUser;
      const mapped: AuthSession = {
        id: u.id,
        staffId: u.staffId || 'P.00000',
        email: u.email,
        fullName: u.name,
        role: u.role,
        orgUnitId: u.orgUnitId || 'org-csc-dept',
        mustChangePassword: false,
      };
      setSession(mapped);
      try {
        localStorage.setItem('oau_bursary_user', JSON.stringify(u));
      } catch {
        // Ignore localStorage error
      }
      return { success: true };
    }

    // Called with email and password
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: emailOrUser, password: password ?? '' }),
      });
      const json = await res.json();
      if (res.ok && json.success) {
        const newSession = json.data?.session as AuthSession;
        setSession(newSession);
        try {
          localStorage.setItem('oau_bursary_user', JSON.stringify(mapSessionToUser(newSession)));
        } catch {
          // Ignore localStorage error
        }
        return { success: true };
      }
      return { success: false, error: json.error || 'Login failed' };
    } catch {
      return { success: false, error: 'Network error. Please try again.' };
    }
  };

  const logout = async (redirectTo = '/') => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
    } catch {
      // Continue cleanup on network failure
    } finally {
      try {
        localStorage.removeItem('oau_bursary_user');
      } catch {
        // Ignore
      }
      setSession(null);
      if (typeof window !== 'undefined') {
        window.location.replace(redirectTo);
      }
    }
  };

  const user = mapSessionToUser(session);

  return (
    <AuthContext.Provider
      value={{
        session,
        user,
        isLoading,
        isAuthenticated: !!session,
        login,
        logout,
        refresh,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
