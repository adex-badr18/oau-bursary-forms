import type { AuditLog, PaginatedResponse } from '@/types';
import type { IAuditLogRepository, ListAuditParams } from '../interfaces';
import { mockDb } from '../mock/store';

export class MockAuditLogRepository implements IAuditLogRepository {
  async create(data: Omit<AuditLog, 'id' | 'timestamp'>): Promise<AuditLog> {
    const db = mockDb.get();
    const record: AuditLog = {
      ...data,
      id: mockDb.generateId(),
      timestamp: mockDb.now(),
    };
    db.auditLogs.unshift(record);
    mockDb.persist();
    return record;
  }

  async listPaginated(params: ListAuditParams): Promise<PaginatedResponse<AuditLog>> {
    let list = [...mockDb.get().auditLogs];

    if (params.search) {
      const q = params.search.toLowerCase();
      list = list.filter(
        l =>
          l.actorName.toLowerCase().includes(q) ||
          l.actorEmail.toLowerCase().includes(q) ||
          l.details.toLowerCase().includes(q) ||
          l.action.toLowerCase().includes(q)
      );
    }
    if (params.action) list = list.filter(l => l.action === params.action);
    if (params.actorId) list = list.filter(l => l.actorId === params.actorId);
    if (params.entityType) list = list.filter(l => l.entityType === params.entityType);
    if (params.dateFrom) list = list.filter(l => l.timestamp >= params.dateFrom!);
    if (params.dateTo) list = list.filter(l => l.timestamp <= params.dateTo!);

    // Newest first by default
    list.sort((a, b) => b.timestamp.localeCompare(a.timestamp));

    const total = list.length;
    const page = Math.max(1, params.page ?? 1);
    const limit = Math.min(100, Math.max(1, params.limit ?? 20));
    const totalPages = Math.ceil(total / limit);
    const data = list.slice((page - 1) * limit, page * limit);

    return { data, total, page, limit, totalPages };
  }
}

export const auditLogRepository = new MockAuditLogRepository();
