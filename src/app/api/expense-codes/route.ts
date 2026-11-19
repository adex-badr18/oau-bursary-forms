import { NextRequest } from 'next/server';
import { z } from 'zod';
import { getSession, apiSuccess, apiError } from '@/lib/server/auth';
import { expenseCodeRepository, auditLogRepository } from '@/lib/server/db';

const createSchema = z.object({
  code: z.string().min(1),
  description: z.string().min(1),
  category: z.string().min(1),
  status: z.enum(['active', 'inactive']).default('active'),
});

export async function GET(request: NextRequest) {
  const session = await getSession();
  if (!session) return apiError('Not authenticated', 401);

  const { searchParams } = new URL(request.url);
  const search = searchParams.get('search');

  // Autocomplete quick search if search query is provided
  if (search) {
    const results = await expenseCodeRepository.search(search, Number(searchParams.get('limit') || 10));
    return apiSuccess(results);
  }

  const result = await expenseCodeRepository.list({
    page: Number(searchParams.get('page') || 1),
    limit: Number(searchParams.get('limit') || 20),
    category: searchParams.get('category') || undefined,
    status: (searchParams.get('status') as 'active' | 'inactive') || undefined,
  });

  return apiSuccess(result);
}

export async function POST(request: NextRequest) {
  const session = await getSession();
  if (!session || session.role !== 'superadmin') return apiError('Forbidden', 403);

  const body = await request.json();
  const parsed = createSchema.safeParse(body);
  if (!parsed.success) return apiError('Validation failed', 400, parsed.error.flatten());

  const existing = await expenseCodeRepository.findByCode(parsed.data.code);
  if (existing) return apiError(`Expense code ${parsed.data.code} already exists`, 409);

  const code = await expenseCodeRepository.create(parsed.data);

  await auditLogRepository.create({
    actorId: session.id,
    actorName: session.fullName,
    actorEmail: session.email,
    actorRole: session.role,
    action: 'EXPENSE_CODE_CREATED',
    entityType: 'expense_code',
    entityId: code.id,
    details: `Created expense code: ${code.code} - ${code.description}`,
    ipAddress: request.headers.get('x-forwarded-for') ?? '127.0.0.1',
  });

  return apiSuccess(code, 201);
}
