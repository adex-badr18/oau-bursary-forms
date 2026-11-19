import { NextRequest } from 'next/server';
import { z } from 'zod';
import { getSession, apiSuccess, apiError } from '@/lib/server/auth';
import { submissionRepository, staffRepository, orgUnitRepository, auditLogRepository } from '@/lib/server/db';
import type { StaffSnapshot } from '@/types';

const createSubmissionSchema = z.object({
  formType: z.enum(['cash-advance', 'dlpo', 'expenditure-authorization', 'duty-mileage', 'imprest-holder']),
  submittedByEmail: z.string().email(),
  fundCode: z.string().min(1),
  formData: z.record(z.unknown()),
  supportingDocuments: z.array(z.object({
    id: z.string(),
    fileName: z.string(),
    fileSize: z.number(),
    fileType: z.string(),
    fileUrl: z.string(),
    uploadedAt: z.string(),
  })).default([]),
});

const PREFIX: Record<string, string> = {
  'cash-advance': 'CA',
  'dlpo': 'DLPO',
  'expenditure-authorization': 'EA',
  'duty-mileage': 'DM',
  'imprest-holder': 'IH',
};

function generateRefNumber(formType: string): string {
  const prefix = PREFIX[formType] ?? 'REF';
  const year = new Date().getFullYear();
  const seq = String(Math.floor(Math.random() * 9000) + 1000);
  return `${prefix}-${year}-${seq}`;
}

export async function GET(request: NextRequest) {
  const session = await getSession();
  if (!session) return apiError('Not authenticated', 401);

  const { searchParams } = new URL(request.url);
  const params: Parameters<typeof submissionRepository.listPaginated>[0] = {
    page: Number(searchParams.get('page') || 1),
    limit: Number(searchParams.get('limit') || 10),
    search: searchParams.get('search') || undefined,
    status: (searchParams.get('status') as never) || undefined,
    formType: (searchParams.get('formType') as never) || undefined,
    sortBy: searchParams.get('sortBy') || undefined,
    sortOrder: (searchParams.get('sortOrder') as 'asc' | 'desc') || undefined,
    dateFrom: searchParams.get('dateFrom') || undefined,
    dateTo: searchParams.get('dateTo') || undefined,
  };

  // Staff can only see their own submissions
  if (session.role === 'staff') {
    params.staffId = session.staffId;
  }
  // Bursary or superadmin can filter by department
  if (searchParams.get('departmentId')) {
    params.departmentId = searchParams.get('departmentId') || undefined;
  }

  const result = await submissionRepository.listPaginated(params);
  return apiSuccess(result);
}

export async function POST(request: NextRequest) {
  const session = await getSession();
  if (!session) return apiError('Not authenticated', 401);

  const body = await request.json();
  const parsed = createSubmissionSchema.safeParse(body);
  if (!parsed.success) return apiError('Validation failed', 400, parsed.error.flatten());

  const { formType, submittedByEmail, fundCode, formData, supportingDocuments } = parsed.data;

  const staff = await staffRepository.findByEmail(submittedByEmail);
  if (!staff) return apiError('Staff member not found for submitted email', 404);

  const orgUnit = await orgUnitRepository.findById(staff.orgUnitId);
  if (!orgUnit) return apiError('Organizational unit not found', 404);

  const snapshot: StaffSnapshot = {
    staffId: staff.staffId,
    title: staff.title,
    fullName: staff.fullName,
    designation: staff.designation,
    nin: staff.nin,
    phone: staff.phone,
    email: staff.email,
    salaryType: staff.salaryType,
    salaryGrade: staff.salaryGrade,
    salaryLevel: staff.salaryLevel,
    salaryStep: staff.salaryStep,
    department: orgUnit.name,
    departmentId: orgUnit.id,
    centreCode: orgUnit.centreCode,
  };

  const submission = await submissionRepository.create({
    referenceNumber: generateRefNumber(formType),
    formType,
    submittedByStaffId: staff.staffId,
    submittedByName: staff.fullName,
    submittedByEmail: staff.email,
    department: orgUnit.name,
    departmentId: orgUnit.id,
    fundCode,
    centreCode: orgUnit.centreCode,
    formattedFundCentreCode: `${fundCode}-${orgUnit.centreCode}`,
    staffSnapshot: snapshot,
    formData,
    supportingDocuments,
    status: 'Submitted',
    submittedDate: new Date().toISOString(),
  });

  await auditLogRepository.create({
    actorId: session.id,
    actorName: session.fullName,
    actorEmail: session.email,
    actorRole: session.role,
    action: 'FORM_SUBMITTED',
    entityType: 'submission',
    entityId: submission.id,
    details: `${staff.fullName} submitted ${formType} form (${submission.referenceNumber})`,
    ipAddress: request.headers.get('x-forwarded-for') ?? '127.0.0.1',
  });

  return apiSuccess(submission, 201);
}
