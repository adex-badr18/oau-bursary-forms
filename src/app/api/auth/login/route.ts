import { NextRequest } from 'next/server';
import { z } from 'zod';
import { staffRepository, verifyPassword, auditLogRepository } from '@/lib/server/db';
import { setSession, isOauEmail, apiError, apiSuccess, AuthError } from '@/lib/server/auth';
import type { AuthSession } from '@/types';

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const parsed = loginSchema.safeParse(body);
    if (!parsed.success) {
      return apiError('Invalid request body', 400, parsed.error.flatten());
    }

    const { email, password } = parsed.data;

    if (!isOauEmail(email)) {
      return apiError('Only institutional @oauife.edu.ng email addresses are allowed', 400);
    }

    const staff = await staffRepository.findByEmail(email);
    if (!staff) {
      return apiError('Invalid email or password', 401);
    }

    if (!verifyPassword(password, staff.passwordHash)) {
      return apiError('Invalid email or password', 401);
    }

    if (staff.status === 'inactive') {
      return apiError('Your account is inactive. Contact the administrator.', 403);
    }

    const session: AuthSession = {
      id: staff.id,
      staffId: staff.staffId,
      email: staff.email,
      fullName: staff.fullName,
      role: staff.role,
      orgUnitId: staff.orgUnitId,
      bursaryUnit: staff.bursaryUnit,
      mustChangePassword: staff.mustChangePassword,
    };

    await setSession(session);

    // Audit log
    await auditLogRepository.create({
      actorId: staff.id,
      actorName: staff.fullName,
      actorEmail: staff.email,
      actorRole: staff.role,
      action: 'USER_LOGIN',
      entityType: 'auth',
      entityId: staff.id,
      details: `${staff.fullName} logged in`,
      ipAddress: request.headers.get('x-forwarded-for') ?? request.headers.get('x-real-ip') ?? '127.0.0.1',
    });

    return apiSuccess({ session });
  } catch (error) {
    if (error instanceof AuthError) return apiError(error.message, error.statusCode);
    console.error('[POST /api/auth/login]', error);
    return apiError('Internal server error', 500);
  }
}
