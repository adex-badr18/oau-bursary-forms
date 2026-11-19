import { NextRequest } from 'next/server';
import { z } from 'zod';
import { getSession, apiSuccess, apiError } from '@/lib/server/auth';
import { staffRepository } from '@/lib/server/db';

const recordSchema = z.object({
  title: z.string(),
  firstName: z.string().min(1),
  lastName: z.string().min(1),
  middleName: z.string().optional(),
  staffId: z.string().min(1),
  email: z.string().email().regex(/^[a-zA-Z0-9._%+-]+@oauife\.edu\.ng$/, 'Must be an @oauife.edu.ng email'),
  phone: z.string().min(1),
  designation: z.string().min(1),
  nin: z.string().length(11, 'NIN must be 11 digits').regex(/^\d+$/),
  salaryType: z.enum(['CONTISS', 'CONUASS', 'CONMESS', 'CONPASS', 'CONTOPS', 'CONRAISS']),
  salaryGrade: z.string().min(1),
  salaryLevel: z.string().min(1),
  salaryStep: z.string().min(1),
  orgUnitId: z.string().min(1),
});

export async function POST(request: NextRequest) {
  const session = await getSession();
  if (!session || session.role !== 'superadmin') return apiError('Forbidden', 403);

  const body = await request.json();
  const { records } = body as { records: unknown[] };
  if (!Array.isArray(records)) return apiError('records must be an array', 400);

  const { emailSet, staffIdSet } = await staffRepository.existingSetsForBulk();
  const fileEmailSet = new Set<string>();
  const fileStaffIdSet = new Set<string>();

  const results = records.map((record, idx) => {
    const parsed = recordSchema.safeParse(record);
    if (!parsed.success) {
      return { row: idx + 1, valid: false, errors: parsed.error.flatten().fieldErrors };
    }
    const data = parsed.data;
    const errors: string[] = [];
    if (emailSet.has(data.email.toLowerCase())) errors.push(`Email ${data.email} already exists in DB`);
    if (staffIdSet.has(data.staffId)) errors.push(`Staff ID ${data.staffId} already exists in DB`);
    if (fileEmailSet.has(data.email.toLowerCase())) errors.push(`Duplicate email in file: ${data.email}`);
    if (fileStaffIdSet.has(data.staffId)) errors.push(`Duplicate staff ID in file: ${data.staffId}`);
    fileEmailSet.add(data.email.toLowerCase());
    fileStaffIdSet.add(data.staffId);
    if (errors.length > 0) return { row: idx + 1, valid: false, errors };
    return { row: idx + 1, valid: true, data };
  });

  const valid = results.filter(r => r.valid).length;
  const invalid = results.filter(r => !r.valid).length;

  return apiSuccess({ total: records.length, valid, invalid, results });
}
