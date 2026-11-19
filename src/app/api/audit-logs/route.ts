import { NextRequest } from 'next/server';
import { getSession, apiSuccess, apiError } from '@/lib/server/auth';
import { auditLogRepository } from '@/lib/server/db';

export async function GET(request: NextRequest) {
  const session = await getSession();
  if (!session || session.role !== 'superadmin') return apiError('Forbidden', 403);

  const { searchParams } = new URL(request.url);
  const result = await auditLogRepository.listPaginated({
    page: Number(searchParams.get('page') || 1),
    limit: Number(searchParams.get('limit') || 20),
    search: searchParams.get('search') || undefined,
    action: searchParams.get('action') || undefined,
    actorId: searchParams.get('actorId') || undefined,
    entityType: searchParams.get('entityType') || undefined,
    dateFrom: searchParams.get('dateFrom') || undefined,
    dateTo: searchParams.get('dateTo') || undefined,
  });

  return apiSuccess(result);
}
