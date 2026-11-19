import { NextRequest } from 'next/server';
import { getSession, apiSuccess, apiError } from '@/lib/server/auth';
import { staffRepository, hashPassword, auditLogRepository } from '@/lib/server/db';
import type { StaffProfile } from '@/types';

export async function POST(request: NextRequest) {
  const session = await getSession();
  if (!session || session.role !== 'superadmin') return apiError('Forbidden', 403);

  const body = await request.json();
  const { records, batchNumber, totalBatches } = body as {
    records: Omit<StaffProfile, 'id' | 'createdAt' | 'updatedAt' | 'passwordHash' | 'mustChangePassword' | 'fullName'>[];
    batchNumber: number;
    totalBatches: number;
  };

  if (!Array.isArray(records)) return apiError('records must be an array', 400);

  const enriched = records.map(r => ({
    ...r,
    fullName: [r.title, r.firstName, r.middleName, r.lastName].filter(Boolean).join(' '),
    passwordHash: hashPassword('Staff@1234'),
    mustChangePassword: true,
  }));

  const result = await staffRepository.bulkCreateBatch(enriched);

  await auditLogRepository.create({
    actorId: session.id,
    actorName: session.fullName,
    actorEmail: session.email,
    actorRole: session.role,
    action: 'STAFF_BULK_UPLOADED',
    entityType: 'staff',
    entityId: 'batch',
    details: `Bulk import batch ${batchNumber}/${totalBatches}: ${result.inserted} inserted, ${result.skipped} skipped`,
    ipAddress: request.headers.get('x-forwarded-for') ?? '127.0.0.1',
  });

  return apiSuccess(result);
}
