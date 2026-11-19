import { getSession, apiSuccess, apiError } from '@/lib/server/auth';
import { fundCodeRepository } from '@/lib/server/db';

export async function GET() {
  const session = await getSession();
  if (!session) return apiError('Not authenticated', 401);
  const fundCodes = await fundCodeRepository.list();
  return apiSuccess(fundCodes);
}
