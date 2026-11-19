import type {
  StaffProfile, OrgUnit, FundCode, ExpenseCode,
  FormSubmission, AuditLog, PaginatedResponse,
  SubmissionStatus, FormType
} from '@/types';

export interface ListStaffParams {
  page?: number;
  limit?: number;
  search?: string;
  status?: 'active' | 'inactive';
  sortBy?: keyof StaffProfile;
  sortOrder?: 'asc' | 'desc';
}

export interface IStaffRepository {
  listPaginated(params: ListStaffParams): Promise<PaginatedResponse<Omit<StaffProfile, 'passwordHash'>>>;
  findById(id: string): Promise<StaffProfile | null>;
  findByEmail(email: string): Promise<StaffProfile | null>;
  findByStaffId(staffId: string): Promise<StaffProfile | null>;
  create(data: Omit<StaffProfile, 'id' | 'createdAt' | 'updatedAt'>): Promise<StaffProfile>;
  update(id: string, data: Partial<StaffProfile>): Promise<StaffProfile | null>;
  bulkCreateBatch(records: Omit<StaffProfile, 'id' | 'createdAt' | 'updatedAt'>[]): Promise<{
    inserted: number;
    skipped: number;
    errors: Array<{ row: number; reason: string; data: Record<string, unknown> }>;
  }>;
  existingSetsForBulk(): Promise<{ emailSet: Set<string>; staffIdSet: Set<string> }>;
}

export interface IOrgUnitRepository {
  list(params?: { type?: string; status?: string; search?: string }): Promise<OrgUnit[]>;
  findById(id: string): Promise<OrgUnit | null>;
  findByCode(code: string): Promise<OrgUnit | null>;
  create(data: Omit<OrgUnit, 'id' | 'createdAt' | 'updatedAt'>): Promise<OrgUnit>;
  update(id: string, data: Partial<OrgUnit>): Promise<OrgUnit | null>;
  bulkCreate(records: Omit<OrgUnit, 'id' | 'createdAt' | 'updatedAt'>[]): Promise<{ inserted: number; skipped: number }>;
}

export interface IFundCodeRepository {
  list(): Promise<FundCode[]>;
  findByCode(code: string): Promise<FundCode | null>;
}

export interface ListExpenseParams {
  search?: string;
  category?: string;
  status?: 'active' | 'inactive';
  page?: number;
  limit?: number;
}

export interface IExpenseCodeRepository {
  list(params?: ListExpenseParams): Promise<PaginatedResponse<ExpenseCode>>;
  findById(id: string): Promise<ExpenseCode | null>;
  findByCode(code: string): Promise<ExpenseCode | null>;
  search(query: string, limit?: number): Promise<ExpenseCode[]>;
  create(data: Omit<ExpenseCode, 'id' | 'createdAt' | 'updatedAt'>): Promise<ExpenseCode>;
  update(id: string, data: Partial<ExpenseCode>): Promise<ExpenseCode | null>;
  bulkCreate(records: Omit<ExpenseCode, 'id' | 'createdAt' | 'updatedAt'>[]): Promise<{ inserted: number; skipped: number }>;
}

export interface ListSubmissionParams {
  page?: number;
  limit?: number;
  search?: string;
  status?: SubmissionStatus | '';
  formType?: FormType | '';
  staffId?: string; // filter by submitting staff (for department portal)
  departmentId?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  dateFrom?: string;
  dateTo?: string;
}

export interface ISubmissionRepository {
  listPaginated(params: ListSubmissionParams): Promise<PaginatedResponse<FormSubmission>>;
  findById(id: string): Promise<FormSubmission | null>;
  create(data: Omit<FormSubmission, 'id'>): Promise<FormSubmission>;
  updateStatus(id: string, status: SubmissionStatus): Promise<FormSubmission | null>;
  approve(id: string, decision: NonNullable<FormSubmission['bursaryDecision']>): Promise<FormSubmission | null>;
  reject(id: string, decision: NonNullable<FormSubmission['bursaryDecision']>): Promise<FormSubmission | null>;
}

export interface ListAuditParams {
  page?: number;
  limit?: number;
  search?: string;
  action?: string;
  actorId?: string;
  entityType?: string;
  dateFrom?: string;
  dateTo?: string;
}

export interface IAuditLogRepository {
  create(data: Omit<AuditLog, 'id' | 'timestamp'>): Promise<AuditLog>;
  listPaginated(params: ListAuditParams): Promise<PaginatedResponse<AuditLog>>;
}
