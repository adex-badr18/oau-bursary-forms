import { NextRequest } from 'next/server';
import { getSession, apiSuccess, apiError } from '@/lib/server/auth';
import { orgUnitRepository, auditLogRepository } from '@/lib/server/db';
import type { OrgUnit } from '@/types';

export async function POST(request: NextRequest) {
  const session = await getSession();
  if (!session || session.role !== 'superadmin') return apiError('Forbidden', 403);

  const body = await request.json();
  const { records } = body as { records: Omit<OrgUnit, 'id' | 'createdAt' | 'updatedAt'>[] };
  if (!Array.isArray(records)) return apiError('records must be an array', 400);

  const result = await orgUnitRepository.bulkCreate(records);

  await auditLogRepository.create({
    actorId: session.id,
    actorName: session.fullName,
    actorEmail: session.email,
    actorRole: session.role,
    action: 'ORG_UNIT_BULK_UPLOADED',
    entityType: 'org_unit',
    entityId: 'batch',
    details: `Bulk imported ${result.inserted} org units (${result.skipped} skipped)`,
    ipAddress: request.headers.get('x-forwarded-for') ?? '127.0.0.1',
  });

  return apiSuccess(result);
}
