import { NextRequest } from 'next/server';
import { z } from 'zod';
import { getSession, apiSuccess, apiError } from '@/lib/server/auth';
import { staffRepository, hashPassword, auditLogRepository } from '@/lib/server/db';

const schema = z.object({
  staffId: z.string().min(1),
  newPassword: z.string().min(8),
});

export async function POST(request: NextRequest) {
  const session = await getSession();
  if (!session || session.role !== 'superadmin') return apiError('Forbidden', 403);

  const body = await request.json();
  const parsed = schema.safeParse(body);
  if (!parsed.success) return apiError('Invalid request', 400, parsed.error.flatten());

  const { staffId, newPassword } = parsed.data;
  const staff = await staffRepository.findById(staffId);
  if (!staff) return apiError('Staff member not found', 404);

  await staffRepository.update(staffId, {
    passwordHash: hashPassword(newPassword),
    mustChangePassword: true,
  });

  await auditLogRepository.create({
    actorId: session.id,
    actorName: session.fullName,
    actorEmail: session.email,
    actorRole: session.role,
    action: 'STAFF_PASSWORD_RESET',
    entityType: 'staff',
    entityId: staffId,
    details: `Superadmin ${session.fullName} reset password for ${staff.fullName}`,
    ipAddress: request.headers.get('x-forwarded-for') ?? '127.0.0.1',
  });

  return apiSuccess({ message: 'Password reset successfully. Staff must change password on next login.' });
}
