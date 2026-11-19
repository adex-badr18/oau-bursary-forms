import { NextRequest } from 'next/server';
import { z } from 'zod';
import { getSession, apiSuccess, apiError } from '@/lib/server/auth';
import { submissionRepository, staffRepository, auditLogRepository } from '@/lib/server/db';

const schema = z.object({
  note: z.string().min(10, 'Rejection reason must be at least 10 characters and clearly explain the issue'),
});

export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await getSession();
  if (!session || (session.role !== 'bursary' && session.role !== 'superadmin')) {
    return apiError('Forbidden', 403);
  }

  const { id } = await params;
  const submission = await submissionRepository.findById(id);
  if (!submission) return apiError('Submission not found', 404);
  if (submission.status === 'Approved' || submission.status === 'Rejected') {
    return apiError(`Submission already ${submission.status.toLowerCase()}`, 409);
  }

  const body = await request.json();
  const parsed = schema.safeParse(body);
  if (!parsed.success) return apiError('Validation failed', 400, parsed.error.flatten());

  const officer = await staffRepository.findById(session.id);

  const updated = await submissionRepository.reject(id, {
    decision: 'Rejected',
    officerName: session.fullName,
    officerEmail: session.email,
    officerUnit: officer?.bursaryUnit ?? 'Bursary',
    note: parsed.data.note,
    decidedAt: new Date().toISOString(),
  });

  await auditLogRepository.create({
    actorId: session.id,
    actorName: session.fullName,
    actorEmail: session.email,
    actorRole: session.role,
    action: 'FORM_REJECTED',
    entityType: 'submission',
    entityId: id,
    details: `${session.fullName} rejected submission ${submission.referenceNumber}. Reason: ${parsed.data.note}`,
    ipAddress: request.headers.get('x-forwarded-for') ?? '127.0.0.1',
  });

  return apiSuccess(updated);
}
