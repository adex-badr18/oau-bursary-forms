import { cookies } from 'next/headers';
import type { AuthSession, UserRole } from '@/types';

const SESSION_COOKIE = 'oau_session';
const OAU_EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@oauife\.edu\.ng$/;

export function isOauEmail(email: string): boolean {
  return OAU_EMAIL_REGEX.test(email);
}

export async function getSession(): Promise<AuthSession | null> {
  try {
    const cookieStore = await cookies();
    const cookie = cookieStore.get(SESSION_COOKIE);
    if (!cookie?.value) return null;
    return JSON.parse(Buffer.from(cookie.value, 'base64').toString('utf-8')) as AuthSession;
  } catch {
    return null;
  }
}

export async function setSession(session: AuthSession): Promise<void> {
  const cookieStore = await cookies();
  const encoded = Buffer.from(JSON.stringify(session)).toString('base64');
  cookieStore.set(SESSION_COOKIE, encoded, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 * 8, // 8 hours
    path: '/',
  });
}

export async function clearSession(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(SESSION_COOKIE);
}

export class AuthError extends Error {
  constructor(message: string, public statusCode: number = 401) {
    super(message);
    this.name = 'AuthError';
  }
}

export async function requireRole(...roles: UserRole[]): Promise<AuthSession> {
  const session = await getSession();
  if (!session) {
    throw new AuthError('Unauthorized: Not authenticated', 401);
  }
  if (roles.length > 0 && !roles.includes(session.role)) {
    throw new AuthError(`Forbidden: Requires role ${roles.join(' or ')}`, 403);
  }
  return session;
}

export function apiError(message: string, status: number, details?: unknown) {
  return Response.json({ success: false, error: message, details }, { status });
}

export function apiSuccess(data: unknown, status = 200) {
  return Response.json({ success: true, data }, { status });
}
