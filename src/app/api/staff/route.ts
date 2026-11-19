import { NextRequest } from 'next/server';
import { z } from 'zod';
import { getSession, apiSuccess, apiError } from '@/lib/server/auth';
import { staffRepository, hashPassword, auditLogRepository } from '@/lib/server/db';
import type { StaffProfile } from '@/types';

const createStaffSchema = z.object({
  title: z.enum(['Prof.', 'Dr.', 'Mr.', 'Mrs.', 'Ms.', 'Engr.', 'Pharm.', 'Arch.']),
  firstName: z.string().min(1),
  lastName: z.string().min(1),
  middleName: z.string().optional(),
  staffId: z.string().min(1),
  email: z.string().email().regex(/^[a-zA-Z0-9._%+-]+@oauife\.edu\.ng$/, 'Must be an @oauife.edu.ng email'),
  phone: z.string().min(1),
  designation: z.string().min(1),
  nin: z.string().length(11, 'NIN must be exactly 11 digits').regex(/^\d+$/),
  salaryType: z.enum(['CONTISS', 'CONUASS', 'CONMESS', 'CONPASS', 'CONTOPS', 'CONRAISS']),
  salaryGrade: z.string().min(1),
  salaryLevel: z.string().min(1),
  salaryStep: z.string().min(1),
  orgUnitId: z.string().min(1),
  role: z.enum(['superadmin', 'staff', 'bursary']).default('staff'),
  bursaryUnit: z.enum(['Audit', 'Expenditure', 'Treasury', 'Advances', 'Final Accounts']).optional(),
  status: z.enum(['active', 'inactive']).default('active'),
  password: z.string().min(8).default('Staff@1234'),
});

export async function GET(request: NextRequest) {
  const session = await getSession();
  if (!session || session.role !== 'superadmin') return apiError('Forbidden', 403);

  const { searchParams } = new URL(request.url);
  const result = await staffRepository.listPaginated({
    page: Number(searchParams.get('page') || 1),
    limit: Number(searchParams.get('limit') || 10),
    search: searchParams.get('search') || undefined,
    status: (searchParams.get('status') as 'active' | 'inactive') || undefined,
    sortBy: (searchParams.get('sortBy') as keyof StaffProfile) || undefined,
    sortOrder: (searchParams.get('sortOrder') as 'asc' | 'desc') || undefined,
  });

  return apiSuccess(result);
}

export async function POST(request: NextRequest) {
  const session = await getSession();
  if (!session || session.role !== 'superadmin') return apiError('Forbidden', 403);

  const body = await request.json();
  const parsed = createStaffSchema.safeParse(body);
  if (!parsed.success) return apiError('Validation failed', 400, parsed.error.flatten());

  const { password, ...staffData } = parsed.data;

  // Check duplicates
  const existing = await staffRepository.findByEmail(staffData.email);
  if (existing) return apiError(`Email ${staffData.email} already exists`, 409);
  const existingId = await staffRepository.findByStaffId(staffData.staffId);
  if (existingId) return apiError(`Staff ID ${staffData.staffId} already exists`, 409);

  const fullName = [staffData.title, staffData.firstName, staffData.middleName, staffData.lastName].filter(Boolean).join(' ');

  const newStaff = await staffRepository.create({
    ...staffData,
    fullName,
    passwordHash: hashPassword(password),
    mustChangePassword: true,
  });

  await auditLogRepository.create({
    actorId: session.id,
    actorName: session.fullName,
    actorEmail: session.email,
    actorRole: session.role,
    action: 'STAFF_REGISTERED',
    entityType: 'staff',
    entityId: newStaff.id,
    details: `Registered new staff: ${fullName} (${staffData.staffId})`,
    ipAddress: request.headers.get('x-forwarded-for') ?? '127.0.0.1',
  });

  const { passwordHash: _, ...safeStaff } = newStaff;
  return apiSuccess(safeStaff, 201);
}
