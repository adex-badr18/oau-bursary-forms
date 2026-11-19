import type { FormSubmission, PaginatedResponse, SubmissionStatus } from '@/types';
import type { ISubmissionRepository, ListSubmissionParams } from '../interfaces';
import { mockDb } from '../mock/store';

export class MockSubmissionRepository implements ISubmissionRepository {
  async listPaginated(params: ListSubmissionParams): Promise<PaginatedResponse<FormSubmission>> {
    let list = [...mockDb.get().submissions];

    if (params.search) {
      const q = params.search.toLowerCase();
      list = list.filter(s =>
        s.referenceNumber.toLowerCase().includes(q) ||
        (s.submittedByName || s.applicantName || '').toLowerCase().includes(q) ||
        s.department.toLowerCase().includes(q)
      );
    }
    if (params.status) list = list.filter(s => s.status === params.status);
    if (params.formType) list = list.filter(s => s.formType === params.formType);
    if (params.staffId) list = list.filter(s => s.submittedByStaffId === params.staffId);
    if (params.departmentId) list = list.filter(s => s.departmentId === params.departmentId);
    if (params.dateFrom) list = list.filter(s => s.submittedDate >= params.dateFrom!);
    if (params.dateTo) list = list.filter(s => s.submittedDate <= params.dateTo!);

    const sortBy = params.sortBy ?? 'submittedDate';
    const sortOrder = params.sortOrder ?? 'desc';
    list.sort((a, b) => {
      const av = String((a as unknown as Record<string, unknown>)[sortBy] ?? '');
      const bv = String((b as unknown as Record<string, unknown>)[sortBy] ?? '');
      return sortOrder === 'asc' ? av.localeCompare(bv) : bv.localeCompare(av);
    });

    const total = list.length;
    const page = Math.max(1, params.page ?? 1);
    const limit = Math.min(100, Math.max(1, params.limit ?? 20));
    const totalPages = Math.ceil(total / limit);
    const data = list.slice((page - 1) * limit, page * limit);

    return { data, total, page, limit, totalPages };
  }

  async findById(id: string): Promise<FormSubmission | null> {
    return mockDb.get().submissions.find(s => s.id === id) ?? null;
  }

  async create(data: Omit<FormSubmission, 'id'>): Promise<FormSubmission> {
    const db = mockDb.get();
    const record: FormSubmission = { ...data, id: mockDb.generateId() };
    db.submissions.unshift(record); // newest first
    mockDb.persist();
    return record;
  }

  async updateStatus(id: string, status: SubmissionStatus): Promise<FormSubmission | null> {
    const db = mockDb.get();
    const idx = db.submissions.findIndex(s => s.id === id);
    if (idx === -1) return null;
    db.submissions[idx] = { ...db.submissions[idx], status };
    mockDb.persist();
    return db.submissions[idx];
  }

  async approve(id: string, decision: NonNullable<FormSubmission['bursaryDecision']>): Promise<FormSubmission | null> {
    const db = mockDb.get();
    const idx = db.submissions.findIndex(s => s.id === id);
    if (idx === -1) return null;
    db.submissions[idx] = {
      ...db.submissions[idx],
      status: 'Approved',
      bursaryDecision: decision,
      processedDate: mockDb.now(),
    };
    mockDb.persist();
    return db.submissions[idx];
  }

  async reject(id: string, decision: NonNullable<FormSubmission['bursaryDecision']>): Promise<FormSubmission | null> {
    const db = mockDb.get();
    const idx = db.submissions.findIndex(s => s.id === id);
    if (idx === -1) return null;
    db.submissions[idx] = {
      ...db.submissions[idx],
      status: 'Rejected',
      bursaryDecision: decision,
      processedDate: mockDb.now(),
    };
    mockDb.persist();
    return db.submissions[idx];
  }
}

export const submissionRepository = new MockSubmissionRepository();
