import { NextRequest } from 'next/server';
import { clearSession, getSession, apiSuccess } from '@/lib/server/auth';
import { auditLogRepository } from '@/lib/server/db';

export async function POST(request: NextRequest) {
  const session = await getSession();
  if (session) {
    await auditLogRepository.create({
      actorId: session.id,
      actorName: session.fullName,
      actorEmail: session.email,
      actorRole: session.role,
      action: 'USER_LOGOUT',
      entityType: 'auth',
      entityId: session.id,
      details: `${session.fullName} logged out`,
      ipAddress: request.headers.get('x-forwarded-for') ?? request.headers.get('x-real-ip') ?? '127.0.0.1',
    });
  }
  await clearSession();
  return apiSuccess({ message: 'Logged out successfully' });
}
