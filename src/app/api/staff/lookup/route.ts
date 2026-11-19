import { NextRequest } from 'next/server';
import { getSession, apiSuccess, apiError } from '@/lib/server/auth';
import { staffRepository, orgUnitRepository } from '@/lib/server/db';

export async function GET(request: NextRequest) {
  const session = await getSession();
  if (!session) return apiError('Not authenticated', 401);

  const { searchParams } = new URL(request.url);
  const email = searchParams.get('email');
  if (!email) return apiError('email query parameter is required', 400);

  const staff = await staffRepository.findByEmail(email);
  if (!staff) return apiError('Staff member not found', 404);

  const orgUnit = await orgUnitRepository.findById(staff.orgUnitId);

  const { passwordHash: _, ...safeStaff } = staff;
  return apiSuccess({ staff: safeStaff, orgUnit });
}
