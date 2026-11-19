import { NextRequest } from 'next/server';
import { z } from 'zod';
import { getSession, apiSuccess, apiError } from '@/lib/server/auth';
import { staffRepository, hashPassword, verifyPassword, auditLogRepository } from '@/lib/server/db';

const schema = z.object({
  currentPassword: z.string().min(1),
  newPassword: z.string().min(8, 'Password must be at least 8 characters'),
});

export async function POST(request: NextRequest) {
  const session = await getSession();
  if (!session) return apiError('Not authenticated', 401);

  const body = await request.json();
  const parsed = schema.safeParse(body);
  if (!parsed.success) return apiError('Invalid request', 400, parsed.error.flatten());

  const { currentPassword, newPassword } = parsed.data;
  const staff = await staffRepository.findById(session.id);
  if (!staff) return apiError('Staff not found', 404);

  if (!verifyPassword(currentPassword, staff.passwordHash)) {
    return apiError('Current password is incorrect', 400);
  }

  await staffRepository.update(session.id, {
    passwordHash: hashPassword(newPassword),
    mustChangePassword: false,
  });

  await auditLogRepository.create({
    actorId: session.id,
    actorName: session.fullName,
    actorEmail: session.email,
    actorRole: session.role,
    action: 'USER_PASSWORD_CHANGED',
    entityType: 'auth',
    entityId: session.id,
    details: `${session.fullName} changed their password`,
    ipAddress: request.headers.get('x-forwarded-for') ?? '127.0.0.1',
  });

  return apiSuccess({ message: 'Password changed successfully' });
}
