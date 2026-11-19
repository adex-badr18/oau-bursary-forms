'use client';

import { useEffect, useState, useRef } from 'react';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { UserRole } from '@/types';

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRole?: UserRole;
  allowedRoles?: UserRole[];
}

export function ProtectedRoute({ children, allowedRole, allowedRoles }: ProtectedRouteProps) {
  const { user, isAuthenticated, isLoading } = useAuth();
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);
  const redirectedRef = useRef(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const roles = allowedRoles ?? (allowedRole ? [allowedRole] : []);

  const isRoleAllowed = (role?: UserRole): boolean => {
    if (roles.length === 0) return true;
    if (!role) return false;
    if (roles.includes(role)) return true;
    // Bursary routes also permit superadmin
    if (roles.includes('bursary') && role === 'superadmin') return true;
    // Department routes permit staff
    if (roles.includes('department') && role === 'staff') return true;
    if (roles.includes('staff') && role === 'department') return true;
    return false;
  };

  const getLoginRedirect = (): string => {
    if (pathname.startsWith('/admin')) return '/admin-login';
    if (pathname.startsWith('/bursary')) return '/bursary-login';
    if (pathname.startsWith('/department')) return '/department-login';
    return '/';
  };

  useEffect(() => {
    if (!mounted || isLoading) return;

    if (!isAuthenticated) {
      if (!redirectedRef.current) {
        redirectedRef.current = true;
        const target = getLoginRedirect();
        if (typeof window !== 'undefined') {
          window.location.replace(target);
        }
      }
      return;
    }

    if (roles.length > 0 && !isRoleAllowed(user?.role)) {
      if (!redirectedRef.current) {
        redirectedRef.current = true;
        if (typeof window !== 'undefined') {
          window.location.replace('/');
        }
      }
    }
  }, [mounted, isLoading, isAuthenticated, user, pathname]);

  if (!mounted || isLoading || !isAuthenticated || (roles.length > 0 && !isRoleAllowed(user?.role))) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 gap-3">
        <div className="animate-spin rounded-full h-8 w-8 border-2 border-indigo-600 border-t-transparent" />
        <p className="text-xs text-slate-500 font-medium">
          {isLoading ? 'Verifying session...' : 'Redirecting...'}
        </p>
      </div>
    );
  }

  return <>{children}</>;
}
