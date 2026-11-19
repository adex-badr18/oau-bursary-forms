import type { OrgUnit } from '@/types';
import type { IOrgUnitRepository } from '../interfaces';
import { mockDb } from '../mock/store';

export class MockOrgUnitRepository implements IOrgUnitRepository {
  async list(params?: { type?: string; status?: string; search?: string }): Promise<OrgUnit[]> {
    let list = [...mockDb.get().orgUnits];
    if (params?.type) list = list.filter(u => u.type === params.type);
    if (params?.status) list = list.filter(u => u.status === params.status);
    if (params?.search) {
      const q = params.search.toLowerCase();
      list = list.filter(u => u.name.toLowerCase().includes(q) || u.code.toLowerCase().includes(q));
    }
    return list.sort((a, b) => a.name.localeCompare(b.name));
  }

  async findById(id: string): Promise<OrgUnit | null> {
    return mockDb.get().orgUnits.find(u => u.id === id) ?? null;
  }

  async findByCode(code: string): Promise<OrgUnit | null> {
    return mockDb.get().orgUnits.find(u => u.code.toUpperCase() === code.toUpperCase()) ?? null;
  }

  async create(data: Omit<OrgUnit, 'id' | 'createdAt' | 'updatedAt'>): Promise<OrgUnit> {
    const db = mockDb.get();
    const record: OrgUnit = {
      ...data,
      id: mockDb.generateId(),
      createdAt: mockDb.now(),
      updatedAt: mockDb.now(),
    };
    db.orgUnits.push(record);
    mockDb.persist();
    return record;
  }

  async update(id: string, data: Partial<OrgUnit>): Promise<OrgUnit | null> {
    const db = mockDb.get();
    const idx = db.orgUnits.findIndex(u => u.id === id);
    if (idx === -1) return null;
    db.orgUnits[idx] = { ...db.orgUnits[idx], ...data, id, updatedAt: mockDb.now() };
    mockDb.persist();
    return db.orgUnits[idx];
  }

  async bulkCreate(records: Omit<OrgUnit, 'id' | 'createdAt' | 'updatedAt'>[]): Promise<{ inserted: number; skipped: number }> {
    const db = mockDb.get();
    const existingCodes = new Set(db.orgUnits.map(u => u.code.toUpperCase()));
    let inserted = 0;
    let skipped = 0;

    for (const rec of records) {
      if (existingCodes.has(rec.code.toUpperCase())) {
        skipped++;
        continue;
      }
      db.orgUnits.push({
        ...rec,
        id: mockDb.generateId(),
        createdAt: mockDb.now(),
        updatedAt: mockDb.now(),
      });
      existingCodes.add(rec.code.toUpperCase());
      inserted++;
    }
    if (inserted > 0) mockDb.persist();
    return { inserted, skipped };
  }
}

export const orgUnitRepository = new MockOrgUnitRepository();
