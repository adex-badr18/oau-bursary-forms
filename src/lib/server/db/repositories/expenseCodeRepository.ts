import type { ExpenseCode, PaginatedResponse } from '@/types';
import type { IExpenseCodeRepository, ListExpenseParams } from '../interfaces';
import { mockDb } from '../mock/store';

export class MockExpenseCodeRepository implements IExpenseCodeRepository {
  async list(params?: ListExpenseParams): Promise<PaginatedResponse<ExpenseCode>> {
    let list = [...mockDb.get().expenseCodes];

    if (params?.search) {
      const q = params.search.toLowerCase();
      list = list.filter(e => e.code.includes(q) || e.description.toLowerCase().includes(q));
    }
    if (params?.category) {
      list = list.filter(e => e.category === params.category);
    }
    if (params?.status) {
      list = list.filter(e => e.status === params.status);
    }

    list.sort((a, b) => a.code.localeCompare(b.code));
    const total = list.length;
    const page = Math.max(1, params?.page ?? 1);
    const limit = Math.min(100, Math.max(1, params?.limit ?? 50));
    const totalPages = Math.ceil(total / limit);
    const data = list.slice((page - 1) * limit, page * limit);

    return { data, total, page, limit, totalPages };
  }

  async findById(id: string): Promise<ExpenseCode | null> {
    return mockDb.get().expenseCodes.find(e => e.id === id) ?? null;
  }

  async findByCode(code: string): Promise<ExpenseCode | null> {
    return mockDb.get().expenseCodes.find(e => e.code === code) ?? null;
  }

  async search(query: string, limit = 10): Promise<ExpenseCode[]> {
    const q = query.toLowerCase();
    return mockDb.get().expenseCodes
      .filter(e => e.status === 'active' && (e.code.includes(q) || e.description.toLowerCase().includes(q)))
      .slice(0, limit);
  }

  async create(data: Omit<ExpenseCode, 'id' | 'createdAt' | 'updatedAt'>): Promise<ExpenseCode> {
    const db = mockDb.get();
    const record: ExpenseCode = {
      ...data,
      id: mockDb.generateId(),
      createdAt: mockDb.now(),
      updatedAt: mockDb.now(),
    };
    db.expenseCodes.push(record);
    mockDb.persist();
    return record;
  }

  async update(id: string, data: Partial<ExpenseCode>): Promise<ExpenseCode | null> {
    const db = mockDb.get();
    const idx = db.expenseCodes.findIndex(e => e.id === id);
    if (idx === -1) return null;
    db.expenseCodes[idx] = { ...db.expenseCodes[idx], ...data, id, updatedAt: mockDb.now() };
    mockDb.persist();
    return db.expenseCodes[idx];
  }

  async bulkCreate(records: Omit<ExpenseCode, 'id' | 'createdAt' | 'updatedAt'>[]): Promise<{ inserted: number; skipped: number }> {
    const db = mockDb.get();
    const existingCodes = new Set(db.expenseCodes.map(e => e.code));
    let inserted = 0;
    let skipped = 0;

    for (const rec of records) {
      if (existingCodes.has(rec.code)) { skipped++; continue; }
      db.expenseCodes.push({ ...rec, id: mockDb.generateId(), createdAt: mockDb.now(), updatedAt: mockDb.now() });
      existingCodes.add(rec.code);
      inserted++;
    }
    if (inserted > 0) mockDb.persist();
    return { inserted, skipped };
  }
}

export const expenseCodeRepository = new MockExpenseCodeRepository();
