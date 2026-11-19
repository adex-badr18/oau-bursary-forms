import { NextRequest } from 'next/server';
import { z } from 'zod';
import { getSession, apiSuccess, apiError } from '@/lib/server/auth';
import { orgUnitRepository, auditLogRepository } from '@/lib/server/db';

const createSchema = z.object({
  name: z.string().min(1),
  code: z.string().min(1).toUpperCase(),
  type: z.enum(['faculty', 'department', 'directorate', 'division', 'unit']),
  parentUnitId: z.string().optional(),
  centreCode: z.string().min(1).max(5),
  status: z.enum(['active', 'inactive']).default('active'),
});

export async function GET(request: NextRequest) {
  const session = await getSession();
  if (!session) return apiError('Not authenticated', 401);

  const { searchParams } = new URL(request.url);
  const units = await orgUnitRepository.list({
    type: searchParams.get('type') || undefined,
    status: searchParams.get('status') || undefined,
    search: searchParams.get('search') || undefined,
  });

  return apiSuccess(units);
}

export async function POST(request: NextRequest) {
  const session = await getSession();
  if (!session || session.role !== 'superadmin') return apiError('Forbidden', 403);

  const body = await request.json();
  const parsed = createSchema.safeParse(body);
  if (!parsed.success) return apiError('Validation failed', 400, parsed.error.flatten());

  const existing = await orgUnitRepository.findByCode(parsed.data.code);
  if (existing) return apiError(`Unit code ${parsed.data.code} already exists`, 409);

  const unit = await orgUnitRepository.create(parsed.data);

  await auditLogRepository.create({
    actorId: session.id,
    actorName: session.fullName,
    actorEmail: session.email,
    actorRole: session.role,
    action: 'ORG_UNIT_CREATED',
    entityType: 'org_unit',
    entityId: unit.id,
    details: `Created org unit: ${unit.name} (${unit.code})`,
    ipAddress: request.headers.get('x-forwarded-for') ?? '127.0.0.1',
  });

  return apiSuccess(unit, 201);
}
