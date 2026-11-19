import type { FundCode } from '@/types';
import type { IFundCodeRepository } from '../interfaces';
import { mockDb } from '../mock/store';

export class MockFundCodeRepository implements IFundCodeRepository {
  async list(): Promise<FundCode[]> {
    return [...mockDb.get().fundCodes].filter(f => f.status === 'active').sort((a, b) => a.code.localeCompare(b.code));
  }

  async findByCode(code: string): Promise<FundCode | null> {
    return mockDb.get().fundCodes.find(f => f.code === code) ?? null;
  }
}

export const fundCodeRepository = new MockFundCodeRepository();
