import { Department, User, FormSubmission, FormType, SubmissionStatus } from '@/types';

export const departments: Department[] = [
  { id: 'dept-1', name: 'Accounting Department', code: 'ACCT' },
  { id: 'dept-2', name: 'Registry Department', code: 'REG' },
  { id: 'dept-3', name: 'Physics Department', code: 'PHYS' },
  { id: 'dept-4', name: 'Computer Science Department', code: 'CS' },
  { id: 'dept-5', name: 'Human Resources', code: 'HR' },
  { id: 'dept-6', name: 'Library Services', code: 'LIB' },
  { id: 'dept-7', name: 'Chemistry Department', code: 'CHEM' },
  { id: 'dept-8', name: 'Biology Department', code: 'BIO' },
];

export const users: User[] = [
  {
    id: 'user-1',
    name: 'Dr. Sarah Johnson',
    email: 'sarah.johnson@university.edu',
    role: 'department',
    department: 'Accounting Department',
  },
  {
    id: 'user-2',
    name: 'Prof. Michael Chen',
    email: 'michael.chen@university.edu',
    role: 'department',
    department: 'Physics Department',
  },
  {
    id: 'user-3',
    name: 'David Martinez',
    email: 'david.martinez@university.edu',
    role: 'bursary',
  },
  {
    id: 'user-4',
    name: 'Emily Thompson',
    email: 'emily.thompson@university.edu',
    role: 'bursary',
  },
];

// Generate realistic dummy submissions
const generateReferenceNumber = (formType: FormType, index: number): string => {
  const typePrefix: Record<FormType, string> = {
    'cash-advance': 'CA',
    'dlpo': 'DLPO',
    'expenditure-authorization': 'EA',
    'duty-mileage': 'DM',
    'imprest-holder': 'IH',
  };
  
  return `${typePrefix[formType]}-2026-${String(index).padStart(4, '0')}`;
};

const applicantNames = [
  'Dr. Sarah Johnson',
  'Prof. Michael Chen',
  'Dr. Rebecca Williams',
  'Mr. James Anderson',
  'Dr. Patricia Moore',
  'Prof. Robert Taylor',
  'Ms. Jennifer Davis',
  'Dr. Christopher Wilson',
  'Prof. Linda Martinez',
  'Mr. Daniel Brown',
];

const statuses: SubmissionStatus[] = ['Submitted', 'In Review', 'Processed', 'Rejected'];

// Sample form data for each type
const sampleCashAdvanceData = {
  applicantName: 'Dr. Sarah Johnson',
  staffNumber: 'STAFF-001234',
  department: 'Accounting Department',
  email: 'sarah.johnson@university.edu',
  phone: '+1-555-0123',
  purpose: 'Conference attendance and research materials',
  amount: 5000,
  currency: 'USD',
  dateRequired: '2026-03-15',
  accountNumber: '1234567890',
  bankName: 'First National Bank',
  justification: 'Attending the International Accounting Conference to present research findings and network with peers.',
  headOfDepartmentApproval: true,
};

const sampleDLPOData = {
  requisitionNumber: 'REQ-2026-0045',
  department: 'Computer Science Department',
  supplier: 'Tech Supplies Inc.',
  supplierContact: 'contact@techsupplies.com',
  itemsDescription: 'Dell Workstation Computers (Spec: Intel i7, 32GB RAM, 1TB SSD)',
  quantity: 10,
  unitPrice: 1500,
  totalAmount: 15000,
  deliveryDate: '2026-04-01',
  deliveryLocation: 'Computer Science Lab, Building C, Room 301',
  budgetCode: 'CS-2026-LAB-001',
  requisitionerName: 'Prof. Michael Chen',
  requisitionerSignature: 'M. Chen',
};

const sampleExpenditureData = {
  projectName: 'Renewable Energy Research Initiative',
  projectCode: 'RERI-2026-001',
  department: 'Physics Department',
  expenditureType: 'Research Equipment',
  description: 'Purchase of solar panel testing equipment and data acquisition systems',
  estimatedAmount: 25000,
  actualAmount: 24500,
  budgetLine: 'Research & Development - Equipment',
  authorizerName: 'Prof. Robert Taylor',
  authorizerTitle: 'Department Head - Physics',
  dateAuthorized: '2026-02-15',
  supportingDocuments: ['Quote_Solar_Equipment.pdf', 'Budget_Approval_Form.pdf'],
};

const sampleDutyMileageData = {
  employeeName: 'Dr. Patricia Moore',
  employeeNumber: 'EMP-5678',
  department: 'Human Resources',
  travelDate: '2026-02-18',
  destination: 'Regional HR Conference, Capital City',
  purpose: 'Attend HR management workshop and recruitment strategies seminar',
  distanceTraveled: 350,
  ratePerKm: 0.58,
  subsistenceAmount: 150,
  accommodationCost: 200,
  mealsCost: 80,
  totalClaim: 633,
  vehicleRegistration: 'ABC-1234',
  hodApproval: true,
};

const sampleImprestData = {
  holderName: 'Ms. Jennifer Davis',
  staffNumber: 'STAFF-9012',
  department: 'Library Services',
  imprestAmount: 2000,
  dateIssued: '2026-01-15',
  purpose: 'Purchase of library supplies and minor repairs',
  expenditures: [
    { date: '2026-01-16', description: 'Book repair materials', amount: 450, receiptNumber: 'REC-001' },
    { date: '2026-01-20', description: 'Office supplies', amount: 320, receiptNumber: 'REC-002' },
    { date: '2026-01-25', description: 'Printer maintenance', amount: 580, receiptNumber: 'REC-003' },
    { date: '2026-02-01', description: 'Library signage', amount: 400, receiptNumber: 'REC-004' },
  ],
  totalExpenditure: 1750,
  balanceReturned: 250,
  surrenderDate: '2026-02-10',
  certificateOfCompletion: true,
};

export const submissions: FormSubmission[] = [
  // Cash Advance submissions
  {
    id: 'sub-1',
    referenceNumber: generateReferenceNumber('cash-advance', 1),
    formType: 'cash-advance',
    applicantName: 'Dr. Sarah Johnson',
    department: 'Accounting Department',
    departmentId: 'dept-1',
    submittedDate: '2026-02-20T09:30:00',
    status: 'In Review',
    formData: sampleCashAdvanceData,
    bursaryNotes: 'Pending HOD final approval signature',
  },
  {
    id: 'sub-2',
    referenceNumber: generateReferenceNumber('cash-advance', 2),
    formType: 'cash-advance',
    applicantName: 'Prof. Robert Taylor',
    department: 'Physics Department',
    departmentId: 'dept-3',
    submittedDate: '2026-02-18T14:20:00',
    status: 'Processed',
    formData: { ...sampleCashAdvanceData, applicantName: 'Prof. Robert Taylor', amount: 3500 },
    voucherNumber: 'VCH-2026-0089',
    processedDate: '2026-02-19T16:00:00',
    processedBy: 'David Martinez',
    bursaryNotes: 'Approved and disbursed',
  },
  {
    id: 'sub-3',
    referenceNumber: generateReferenceNumber('cash-advance', 3),
    formType: 'cash-advance',
    applicantName: 'Dr. Rebecca Williams',
    department: 'Chemistry Department',
    departmentId: 'dept-7',
    submittedDate: '2026-02-15T10:15:00',
    status: 'Rejected',
    formData: { ...sampleCashAdvanceData, applicantName: 'Dr. Rebecca Williams', amount: 8000 },
    bursaryNotes: 'Exceeds departmental budget allocation for Q1. Please resubmit with adjusted amount.',
  },
  
  // DLPO submissions
  {
    id: 'sub-4',
    referenceNumber: generateReferenceNumber('dlpo', 1),
    formType: 'dlpo',
    applicantName: 'Prof. Michael Chen',
    department: 'Computer Science Department',
    departmentId: 'dept-4',
    submittedDate: '2026-02-22T11:00:00',
    status: 'Submitted',
    formData: sampleDLPOData,
  },
  {
    id: 'sub-5',
    referenceNumber: generateReferenceNumber('dlpo', 2),
    formType: 'dlpo',
    applicantName: 'Mr. James Anderson',
    department: 'Registry Department',
    departmentId: 'dept-2',
    submittedDate: '2026-02-19T15:45:00',
    status: 'Processed',
    formData: { ...sampleDLPOData, department: 'Registry Department', totalAmount: 8500 },
    voucherNumber: 'VCH-2026-0090',
    processedDate: '2026-02-21T10:30:00',
    processedBy: 'Emily Thompson',
  },
  
  // Expenditure Authorization submissions
  {
    id: 'sub-6',
    referenceNumber: generateReferenceNumber('expenditure-authorization', 1),
    formType: 'expenditure-authorization',
    applicantName: 'Prof. Robert Taylor',
    department: 'Physics Department',
    departmentId: 'dept-3',
    submittedDate: '2026-02-21T13:20:00',
    status: 'In Review',
    formData: sampleExpenditureData,
    bursaryNotes: 'Awaiting budget committee review',
  },
  {
    id: 'sub-7',
    referenceNumber: generateReferenceNumber('expenditure-authorization', 2),
    formType: 'expenditure-authorization',
    applicantName: 'Dr. Christopher Wilson',
    department: 'Biology Department',
    departmentId: 'dept-8',
    submittedDate: '2026-02-17T09:00:00',
    status: 'Processed',
    formData: { ...sampleExpenditureData, projectName: 'Marine Biology Study', actualAmount: 18000 },
    voucherNumber: 'VCH-2026-0087',
    processedDate: '2026-02-19T14:00:00',
    processedBy: 'David Martinez',
  },
  
  // Duty Mileage submissions
  {
    id: 'sub-8',
    referenceNumber: generateReferenceNumber('duty-mileage', 1),
    formType: 'duty-mileage',
    applicantName: 'Dr. Patricia Moore',
    department: 'Human Resources',
    departmentId: 'dept-5',
    submittedDate: '2026-02-20T16:30:00',
    status: 'Submitted',
    formData: sampleDutyMileageData,
  },
  {
    id: 'sub-9',
    referenceNumber: generateReferenceNumber('duty-mileage', 2),
    formType: 'duty-mileage',
    applicantName: 'Prof. Linda Martinez',
    department: 'Library Services',
    departmentId: 'dept-6',
    submittedDate: '2026-02-16T12:00:00',
    status: 'Processed',
    formData: { ...sampleDutyMileageData, employeeName: 'Prof. Linda Martinez', totalClaim: 450 },
    voucherNumber: 'VCH-2026-0086',
    processedDate: '2026-02-18T11:00:00',
    processedBy: 'Emily Thompson',
  },
  
  // Imprest Holder submissions
  {
    id: 'sub-10',
    referenceNumber: generateReferenceNumber('imprest-holder', 1),
    formType: 'imprest-holder',
    applicantName: 'Ms. Jennifer Davis',
    department: 'Library Services',
    departmentId: 'dept-6',
    submittedDate: '2026-02-19T10:45:00',
    status: 'In Review',
    formData: sampleImprestData,
    bursaryNotes: 'Verifying receipts and expenditure documentation',
  },
  {
    id: 'sub-11',
    referenceNumber: generateReferenceNumber('imprest-holder', 2),
    formType: 'imprest-holder',
    applicantName: 'Mr. Daniel Brown',
    department: 'Accounting Department',
    departmentId: 'dept-1',
    submittedDate: '2026-02-14T14:30:00',
    status: 'Processed',
    formData: { ...sampleImprestData, holderName: 'Mr. Daniel Brown', totalExpenditure: 1900 },
    voucherNumber: 'VCH-2026-0085',
    processedDate: '2026-02-16T15:30:00',
    processedBy: 'David Martinez',
  },
  
  // Additional submissions for pagination
  {
    id: 'sub-12',
    referenceNumber: generateReferenceNumber('cash-advance', 4),
    formType: 'cash-advance',
    applicantName: 'Mr. James Anderson',
    department: 'Registry Department',
    departmentId: 'dept-2',
    submittedDate: '2026-02-12T10:00:00',
    status: 'Processed',
    formData: { ...sampleCashAdvanceData, applicantName: 'Mr. James Anderson', amount: 2800 },
    voucherNumber: 'VCH-2026-0083',
    processedDate: '2026-02-14T09:00:00',
    processedBy: 'Emily Thompson',
  },
  {
    id: 'sub-13',
    referenceNumber: generateReferenceNumber('dlpo', 3),
    formType: 'dlpo',
    applicantName: 'Dr. Christopher Wilson',
    department: 'Biology Department',
    departmentId: 'dept-8',
    submittedDate: '2026-02-10T11:30:00',
    status: 'Processed',
    formData: { ...sampleDLPOData, department: 'Biology Department', totalAmount: 12000 },
    voucherNumber: 'VCH-2026-0081',
    processedDate: '2026-02-12T13:00:00',
    processedBy: 'David Martinez',
  },
  {
    id: 'sub-14',
    referenceNumber: generateReferenceNumber('expenditure-authorization', 3),
    formType: 'expenditure-authorization',
    applicantName: 'Prof. Linda Martinez',
    department: 'Library Services',
    departmentId: 'dept-6',
    submittedDate: '2026-02-08T15:00:00',
    status: 'Processed',
    formData: { ...sampleExpenditureData, projectName: 'Digital Archive Project', actualAmount: 15000 },
    voucherNumber: 'VCH-2026-0079',
    processedDate: '2026-02-10T16:00:00',
    processedBy: 'Emily Thompson',
  },
  {
    id: 'sub-15',
    referenceNumber: generateReferenceNumber('duty-mileage', 3),
    formType: 'duty-mileage',
    applicantName: 'Dr. Rebecca Williams',
    department: 'Chemistry Department',
    departmentId: 'dept-7',
    submittedDate: '2026-02-05T09:30:00',
    status: 'Processed',
    formData: { ...sampleDutyMileageData, employeeName: 'Dr. Rebecca Williams', totalClaim: 520 },
    voucherNumber: 'VCH-2026-0076',
    processedDate: '2026-02-07T10:00:00',
    processedBy: 'David Martinez',
  },
];

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
