import type { StaffProfile, PaginatedResponse } from '@/types';
import type { IStaffRepository, ListStaffParams } from '../interfaces';
import { mockDb } from '../mock/store';

export class MockStaffRepository implements IStaffRepository {
  async listPaginated(params: ListStaffParams): Promise<PaginatedResponse<Omit<StaffProfile, 'passwordHash'>>> {
    const db = mockDb.get();
    let list = [...db.staff];

    // Filters
    if (params.search) {
      const q = params.search.toLowerCase();
      list = list.filter(s =>
        s.fullName.toLowerCase().includes(q) ||
        s.email.toLowerCase().includes(q) ||
        s.staffId.toLowerCase().includes(q) ||
        s.designation.toLowerCase().includes(q)
      );
    }
    if (params.status) {
      list = list.filter(s => s.status === params.status);
    }

    // Sort
    const sortBy = (params.sortBy ?? 'createdAt') as keyof StaffProfile;
    const sortOrder = params.sortOrder ?? 'desc';
    list.sort((a, b) => {
      const av = String(a[sortBy] ?? '');
      const bv = String(b[sortBy] ?? '');
      return sortOrder === 'asc' ? av.localeCompare(bv) : bv.localeCompare(av);
    });

    const total = list.length;
    const page = Math.max(1, params.page ?? 1);
    const limit = Math.min(100, Math.max(1, params.limit ?? 20));
    const totalPages = Math.ceil(total / limit);
    const data = list.slice((page - 1) * limit, page * limit).map(({ passwordHash: _, ...rest }) => rest);

    return { data, total, page, limit, totalPages };
  }

  async findById(id: string): Promise<StaffProfile | null> {
    return mockDb.get().staff.find(s => s.id === id) ?? null;
  }

  async findByEmail(email: string): Promise<StaffProfile | null> {
    return mockDb.get().staff.find(s => s.email.toLowerCase() === email.toLowerCase()) ?? null;
  }

  async findByStaffId(staffId: string): Promise<StaffProfile | null> {
    return mockDb.get().staff.find(s => s.staffId === staffId) ?? null;
  }

  async create(data: Omit<StaffProfile, 'id' | 'createdAt' | 'updatedAt'>): Promise<StaffProfile> {
    const db = mockDb.get();
    const record: StaffProfile = {
      ...data,
      id: mockDb.generateId(),
      createdAt: mockDb.now(),
      updatedAt: mockDb.now(),
    };
    db.staff.push(record);
    mockDb.persist();
    return record;
  }

  async update(id: string, data: Partial<StaffProfile>): Promise<StaffProfile | null> {
    const db = mockDb.get();
    const idx = db.staff.findIndex(s => s.id === id);
    if (idx === -1) return null;
    db.staff[idx] = { ...db.staff[idx], ...data, id, updatedAt: mockDb.now() };
    mockDb.persist();
    return db.staff[idx];
  }

  async bulkCreateBatch(records: Omit<StaffProfile, 'id' | 'createdAt' | 'updatedAt'>[]): Promise<{
    inserted: number;
    skipped: number;
    errors: Array<{ row: number; reason: string; data: Record<string, unknown> }>;
  }> {
    const { emailSet, staffIdSet } = await this.existingSetsForBulk();
    const db = mockDb.get();
    let inserted = 0;
    let skipped = 0;
    const errors: Array<{ row: number; reason: string; data: Record<string, unknown> }> = [];

    records.forEach((rec, i) => {
      if (emailSet.has(rec.email.toLowerCase())) {
        skipped++;
        errors.push({ row: i + 2, reason: `Email already exists: ${rec.email}`, data: rec as Record<string, unknown> });
        return;
      }
      if (staffIdSet.has(rec.staffId)) {
        skipped++;
        errors.push({ row: i + 2, reason: `Staff ID already exists: ${rec.staffId}`, data: rec as Record<string, unknown> });
        return;
      }
      const record: StaffProfile = {
        ...rec,
        id: mockDb.generateId(),
        createdAt: mockDb.now(),
        updatedAt: mockDb.now(),
      };
      db.staff.push(record);
      emailSet.add(rec.email.toLowerCase());
      staffIdSet.add(rec.staffId);
      inserted++;
    });

    if (inserted > 0) mockDb.persist();
    return { inserted, skipped, errors };
  }

  async existingSetsForBulk(): Promise<{ emailSet: Set<string>; staffIdSet: Set<string> }> {
    const db = mockDb.get();
    return {
      emailSet: new Set(db.staff.map(s => s.email.toLowerCase())),
      staffIdSet: new Set(db.staff.map(s => s.staffId)),
    };
  }
}

export const staffRepository = new MockStaffRepository();
