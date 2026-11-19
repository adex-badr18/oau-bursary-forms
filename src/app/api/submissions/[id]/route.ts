import { NextRequest } from 'next/server';
import { getSession, apiSuccess, apiError } from '@/lib/server/auth';
import { submissionRepository } from '@/lib/server/db';

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await getSession();
  if (!session) return apiError('Not authenticated', 401);

  const { id } = await params;
  const submission = await submissionRepository.findById(id);
  if (!submission) return apiError('Submission not found', 404);

  // Staff can only view their own submissions
  if (session.role === 'staff' && submission.submittedByStaffId !== session.staffId) {
    return apiError('Forbidden', 403);
  }

  return apiSuccess(submission);
}
