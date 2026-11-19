// --- Enums & Primitives ---

export type UserRole = 'superadmin' | 'staff' | 'bursary' | 'department';

export type UnitType = 'faculty' | 'department' | 'directorate' | 'division' | 'unit';

export type SalaryType = 'CONTISS' | 'CONUASS' | 'CONMESS' | 'CONPASS' | 'CONTOPS' | 'CONRAISS';

export type StaffTitle = 'Prof.' | 'Dr.' | 'Mr.' | 'Mrs.' | 'Ms.' | 'Engr.' | 'Pharm.' | 'Arch.';

export type FormType =
  | 'cash-advance'
  | 'dlpo'
  | 'expenditure-authorization'
  | 'duty-mileage'
  | 'imprest-holder';

export type SubmissionStatus = 'Submitted' | 'In Review' | 'Approved' | 'Rejected' | 'Processed';

export type BursaryUnit = 'Audit' | 'Expenditure' | 'Treasury' | 'Advances' | 'Final Accounts';

export type AuditAction =
  | 'STAFF_REGISTERED'
  | 'STAFF_BULK_UPLOADED'
  | 'STAFF_UPDATED'
  | 'STAFF_PASSWORD_RESET'
  | 'ORG_UNIT_CREATED'
  | 'ORG_UNIT_BULK_UPLOADED'
  | 'ORG_UNIT_UPDATED'
  | 'EXPENSE_CODE_CREATED'
  | 'EXPENSE_CODE_BULK_UPLOADED'
  | 'EXPENSE_CODE_UPDATED'
  | 'FORM_SUBMITTED'
  | 'FORM_PDF_PRINTED'
  | 'FORM_STATUS_UPDATED'
  | 'FORM_APPROVED'
  | 'FORM_REJECTED'
  | 'USER_LOGIN'
  | 'USER_LOGOUT'
  | 'USER_PASSWORD_CHANGED';

export type AuditEntityType = 'staff' | 'org_unit' | 'expense_code' | 'fund_code' | 'submission' | 'auth';

// --- Legacy Compatibility Types ---

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  department?: string;
  staffId?: string;
  orgUnitId?: string;
  bursaryUnit?: BursaryUnit;
}

export interface Department {
  id: string;
  name: string;
  code: string;
}

// --- Core Entities ---

export interface StaffProfile {
  id: string;
  title: StaffTitle;
  firstName: string;
  lastName: string;
  middleName?: string;
  fullName: string; // computed: `${title} ${firstName} ${middleName ? middleName + ' ' : ''}${lastName}`
  staffId: string; // e.g. P.14205
  email: string; // institutional @oauife.edu.ng
  phone: string;
  designation: string; // e.g. Senior Lecturer
  nin: string; // 11 digits
  salaryType: SalaryType;
  salaryGrade: string; // e.g. CONTISS 08
  salaryLevel: string; // e.g. 08
  salaryStep: string; // e.g. 05
  orgUnitId: string;
  role: UserRole;
  bursaryUnit?: BursaryUnit;
  status: 'active' | 'inactive';
  mustChangePassword: boolean;
  passwordHash: string;
  createdAt: string;
  updatedAt: string;
}

export interface OrgUnit {
  id: string;
  name: string;
  code: string; // e.g. CSC
  type: UnitType;
  parentUnitId?: string;
  centreCode: string; // 3-digit e.g. "694"
  status: 'active' | 'inactive';
  createdAt: string;
  updatedAt: string;
}

export interface FundCode {
  id: string;
  code: string; // e.g. "01"
  name: string;
  description?: string;
  isDefault: boolean;
  status: 'active' | 'inactive';
}

export interface ExpenseCode {
  id: string;
  code: string; // e.g. "210101"
  description: string;
  category: string;
  status: 'active' | 'inactive';
  createdAt: string;
  updatedAt: string;
}

export interface StaffSnapshot {
  staffId: string;
  title: StaffTitle;
  fullName: string;
  designation: string;
  nin: string;
  phone: string;
  email: string;
  salaryType: SalaryType;
  salaryGrade: string;
  salaryLevel: string;
  salaryStep: string;
  department: string;
  departmentId: string;
  centreCode: string;
}

export interface SupportingDocument {
  id: string;
  fileName: string;
  fileSize: number;
  fileType: string;
  fileUrl: string;
  uploadedAt: string;
}

export interface BursaryDecision {
  decision: 'Approved' | 'Rejected';
  officerName: string;
  officerEmail: string;
  officerUnit: string;
  note: string;
  voucherNumber?: string;
  decidedAt: string;
}

export interface FormSubmission {
  id: string;
  referenceNumber: string;
  formType: FormType;
  submittedByStaffId?: string;
  submittedByName?: string;
  submittedByEmail?: string;
  department: string;
  departmentId?: string;
  fundCode?: string;
  centreCode?: string;
  formattedFundCentreCode?: string; // e.g. "01-694"
  staffSnapshot?: StaffSnapshot;
  formData: Record<string, any>;
  supportingDocuments?: SupportingDocument[];
  pdfUrl?: string;
  status: SubmissionStatus;
  bursaryDecision?: BursaryDecision;
  submittedDate: string;
  processedDate?: string;
  // Legacy / convenience compatibility properties
  applicantName?: string;
  bursaryNotes?: string;
  voucherNumber?: string;
  processedBy?: string;
}

export interface AuditLog {
  id: string;
  actorId: string;
  actorName: string;
  actorEmail: string;
  actorRole: UserRole;
  action: AuditAction;
  entityType: AuditEntityType;
  entityId: string;
  details: string;
  ipAddress: string;
  timestamp: string;
}

// --- Auth Session (returned to client, no passwordHash) ---
export interface AuthSession {
  id: string;
  staffId: string;
  email: string;
  fullName: string;
  role: UserRole;
  orgUnitId: string;
  bursaryUnit?: BursaryUnit;
  mustChangePassword: boolean;
}

// --- Paginated Response ---
export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

// --- Form Labels (keep for UI) ---
export const formTypeLabels: Record<FormType, string> = {
  'cash-advance': 'Cash Advance',
  'dlpo': 'Departmental Local Purchase Order (DLPO)',
  'expenditure-authorization': 'Expenditure Authorization',
  'duty-mileage': 'Duty Mileage & Subsistence Claim',
  'imprest-holder': 'Imprest Holder Summary',
};

export const formTypeDescriptions: Record<FormType, string> = {
  'cash-advance': 'Request advance payment for official university activities',
  'dlpo': 'Submit purchase orders for departmental procurement',
  'expenditure-authorization': 'Authorize project expenditure and budget allocation',
  'duty-mileage': 'Claim reimbursement for official travel and subsistence',
  'imprest-holder': 'Summary and reconciliation of imprest funds',
};
