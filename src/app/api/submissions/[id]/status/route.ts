import { NextRequest } from 'next/server';
import { z } from 'zod';
import { getSession, apiSuccess, apiError } from '@/lib/server/auth';
import { submissionRepository, auditLogRepository } from '@/lib/server/db';

const schema = z.object({
  status: z.enum(['In Review']),
});

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await getSession();
  if (!session || (session.role !== 'bursary' && session.role !== 'superadmin')) {
    return apiError('Forbidden', 403);
  }

  const { id } = await params;
  const submission = await submissionRepository.findById(id);
  if (!submission) return apiError('Submission not found', 404);

  const body = await request.json();
  const parsed = schema.safeParse(body);
  if (!parsed.success) return apiError('Validation failed', 400, parsed.error.flatten());

  const updated = await submissionRepository.updateStatus(id, parsed.data.status);

  await auditLogRepository.create({
    actorId: session.id,
    actorName: session.fullName,
    actorEmail: session.email,
    actorRole: session.role,
    action: 'FORM_STATUS_UPDATED',
    entityType: 'submission',
    entityId: id,
    details: `${session.fullName} set submission ${submission.referenceNumber} to "${parsed.data.status}"`,
    ipAddress: request.headers.get('x-forwarded-for') ?? '127.0.0.1',
  });

  return apiSuccess(updated);
}
