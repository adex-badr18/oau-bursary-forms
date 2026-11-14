export type UserRole = 'department' | 'bursary';

export type FormType = 
  | 'cash-advance' 
  | 'dlpo' 
  | 'expenditure-authorization' 
  | 'duty-mileage' 
  | 'imprest-holder';

export type SubmissionStatus = 'Submitted' | 'In Review' | 'Processed' | 'Rejected';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  department?: string;
}

export interface Department {
  id: string;
  name: string;
  code: string;
}

export interface FormSubmission {
  id: string;
  referenceNumber: string;
  formType: FormType;
  applicantName: string;
  department: string;
  departmentId: string;
  submittedDate: string;
  status: SubmissionStatus;
  formData: Record<string, any>;
  bursaryNotes?: string;
  voucherNumber?: string;
  processedDate?: string;
  processedBy?: string;
}

export interface CashAdvanceForm {
  applicantName: string;
  staffNumber: string;
  department: string;
  email: string;
  phone: string;
  purpose: string;
  amount: number;
  currency: string;
  dateRequired: string;
  accountNumber: string;
  bankName: string;
  justification: string;
  headOfDepartmentApproval: boolean;
}

export interface DLPOForm {
  requisitionNumber: string;
  department: string;
  supplier: string;
  supplierContact: string;
  itemsDescription: string;
  quantity: number;
  unitPrice: number;
  totalAmount: number;
  deliveryDate: string;
  deliveryLocation: string;
  budgetCode: string;
  requisitionerName: string;
  requisitionerSignature: string;
}

export interface ExpenditureAuthorizationForm {
  projectName: string;
  projectCode: string;
  department: string;
  expenditureType: string;
  description: string;
  estimatedAmount: number;
  actualAmount: number;
  budgetLine: string;
  authorizerName: string;
  authorizerTitle: string;
  dateAuthorized: string;
  supportingDocuments: string[];
}

export interface DutyMileageForm {
  employeeName: string;
  employeeNumber: string;
  department: string;
  travelDate: string;
  destination: string;
  purpose: string;
  distanceTraveled: number;
  ratePerKm: number;
  subsistenceAmount: number;
  accommodationCost: number;
  mealsCost: number;
  totalClaim: number;
  vehicleRegistration: string;
  hodApproval: boolean;
}

export interface ImprestHolderForm {
  holderName: string;
  staffNumber: string;
  department: string;
  imprestAmount: number;
  dateIssued: string;
  purpose: string;
  expenditures: Array<{
    date: string;
    description: string;
    amount: number;
    receiptNumber: string;
  }>;
  totalExpenditure: number;
  balanceReturned: number;
  surrenderDate: string;
  certificateOfCompletion: boolean;
}
