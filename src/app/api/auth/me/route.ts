import { getSession, apiSuccess, apiError } from '@/lib/server/auth';

export async function GET() {
  const session = await getSession();
  if (!session) return apiError('Not authenticated', 401);
  return apiSuccess({ session });
}
