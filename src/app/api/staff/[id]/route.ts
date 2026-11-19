import { NextRequest } from 'next/server';
import { z } from 'zod';
import { getSession, apiSuccess, apiError } from '@/lib/server/auth';
import { staffRepository, auditLogRepository } from '@/lib/server/db';

const updateSchema = z.object({
  title: z.enum(['Prof.', 'Dr.', 'Mr.', 'Mrs.', 'Ms.', 'Engr.', 'Pharm.', 'Arch.']).optional(),
  firstName: z.string().optional(),
  lastName: z.string().optional(),
  middleName: z.string().optional(),
  phone: z.string().optional(),
  designation: z.string().optional(),
  salaryType: z.enum(['CONTISS', 'CONUASS', 'CONMESS', 'CONPASS', 'CONTOPS', 'CONRAISS']).optional(),
  salaryGrade: z.string().optional(),
  salaryLevel: z.string().optional(),
  salaryStep: z.string().optional(),
  orgUnitId: z.string().optional(),
  status: z.enum(['active', 'inactive']).optional(),
  bursaryUnit: z.enum(['Audit', 'Expenditure', 'Treasury', 'Advances', 'Final Accounts']).optional(),
});

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await getSession();
  if (!session || session.role !== 'superadmin') return apiError('Forbidden', 403);
  const { id } = await params;
  const staff = await staffRepository.findById(id);
  if (!staff) return apiError('Staff not found', 404);
  const { passwordHash: _, ...safe } = staff;
  return apiSuccess(safe);
}

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await getSession();
  if (!session || session.role !== 'superadmin') return apiError('Forbidden', 403);

  const { id } = await params;
  const body = await request.json();
  const parsed = updateSchema.safeParse(body);
  if (!parsed.success) return apiError('Validation failed', 400, parsed.error.flatten());

  const existing = await staffRepository.findById(id);
  if (!existing) return apiError('Staff not found', 404);

  const updateData = { ...parsed.data } as Partial<typeof existing>;
  if (parsed.data.firstName || parsed.data.lastName || parsed.data.title || parsed.data.middleName) {
    const title = parsed.data.title ?? existing.title;
    const firstName = parsed.data.firstName ?? existing.firstName;
    const middleName = parsed.data.middleName ?? existing.middleName;
    const lastName = parsed.data.lastName ?? existing.lastName;
    updateData.fullName = [title, firstName, middleName, lastName].filter(Boolean).join(' ');
  }

  const updated = await staffRepository.update(id, updateData);
  if (!updated) return apiError('Update failed', 500);

  await auditLogRepository.create({
    actorId: session.id,
    actorName: session.fullName,
    actorEmail: session.email,
    actorRole: session.role,
    action: 'STAFF_UPDATED',
    entityType: 'staff',
    entityId: id,
    details: `Updated staff record for ${existing.fullName}`,
    ipAddress: request.headers.get('x-forwarded-for') ?? '127.0.0.1',
  });

  const { passwordHash: _, ...safe } = updated;
  return apiSuccess(safe);
}
