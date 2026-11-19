import fs from 'fs';
import path from 'path';
import type { StaffProfile, OrgUnit, FundCode, ExpenseCode, FormSubmission, AuditLog } from '@/types';

export interface MockDbSnapshot {
  staff: StaffProfile[];
  orgUnits: OrgUnit[];
  fundCodes: FundCode[];
  expenseCodes: ExpenseCode[];
  submissions: FormSubmission[];
  auditLogs: AuditLog[];
}

const DATA_DIR = path.join(process.cwd(), '.data');
const SNAPSHOT_PATH = path.join(DATA_DIR, 'mock-db.json');

function ensureDataDir() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
}

// Simple mock password hash (NOT for production use)
export function hashPassword(password: string): string {
  return `hash:${password}`;
}

export function verifyPassword(password: string, hash: string): boolean {
  return hash === `hash:${password}`;
}

function generateId(): string {
  return crypto.randomUUID();
}

function now(): string {
  return new Date().toISOString();
}

// --- Seed Data ---
const SEED_ORG_UNITS: OrgUnit[] = [
  { id: 'org-tech-fac', name: 'Faculty of Technology', code: 'TECH', type: 'faculty', centreCode: '100', status: 'active', createdAt: now(), updatedAt: now() },
  { id: 'org-sci-fac', name: 'Faculty of Science', code: 'SCI', type: 'faculty', centreCode: '200', status: 'active', createdAt: now(), updatedAt: now() },
  { id: 'org-arts-fac', name: 'Faculty of Arts', code: 'ARTS', type: 'faculty', centreCode: '300', status: 'active', createdAt: now(), updatedAt: now() },
  { id: 'org-soc-fac', name: 'Faculty of Social Sciences', code: 'SOC', type: 'faculty', centreCode: '400', status: 'active', createdAt: now(), updatedAt: now() },
  { id: 'org-agric-fac', name: 'Faculty of Agriculture', code: 'AGRIC', type: 'faculty', centreCode: '500', status: 'active', createdAt: now(), updatedAt: now() },
  { id: 'org-csc-dept', name: 'Department of Computer Science & Engineering', code: 'CSC', type: 'department', parentUnitId: 'org-tech-fac', centreCode: '694', status: 'active', createdAt: now(), updatedAt: now() },
  { id: 'org-phy-dept', name: 'Department of Physics', code: 'PHY', type: 'department', parentUnitId: 'org-sci-fac', centreCode: '210', status: 'active', createdAt: now(), updatedAt: now() },
  { id: 'org-chem-dept', name: 'Department of Chemistry', code: 'CHEM', type: 'department', parentUnitId: 'org-sci-fac', centreCode: '215', status: 'active', createdAt: now(), updatedAt: now() },
  { id: 'org-bio-dept', name: 'Department of Zoology', code: 'ZOO', type: 'department', parentUnitId: 'org-sci-fac', centreCode: '220', status: 'active', createdAt: now(), updatedAt: now() },
  { id: 'org-acct-dept', name: 'Department of Accounting', code: 'ACCT', type: 'department', parentUnitId: 'org-soc-fac', centreCode: '450', status: 'active', createdAt: now(), updatedAt: now() },
  { id: 'org-econ-dept', name: 'Department of Economics', code: 'ECON', type: 'department', parentUnitId: 'org-soc-fac', centreCode: '455', status: 'active', createdAt: now(), updatedAt: now() },
  { id: 'org-mech-dept', name: 'Department of Mechanical Engineering', code: 'MECH', type: 'department', parentUnitId: 'org-tech-fac', centreCode: '110', status: 'active', createdAt: now(), updatedAt: now() },
  { id: 'org-civil-dept', name: 'Department of Civil Engineering', code: 'CIVIL', type: 'department', parentUnitId: 'org-tech-fac', centreCode: '115', status: 'active', createdAt: now(), updatedAt: now() },
  { id: 'org-elec-dept', name: 'Department of Electrical Engineering', code: 'ELEC', type: 'department', parentUnitId: 'org-tech-fac', centreCode: '120', status: 'active', createdAt: now(), updatedAt: now() },
  { id: 'org-agron-dept', name: 'Department of Agronomy', code: 'AGRON', type: 'department', parentUnitId: 'org-agric-fac', centreCode: '510', status: 'active', createdAt: now(), updatedAt: now() },
  { id: 'org-hist-dept', name: 'Department of History', code: 'HIST', type: 'department', parentUnitId: 'org-arts-fac', centreCode: '310', status: 'active', createdAt: now(), updatedAt: now() },
  { id: 'org-engl-dept', name: 'Department of English', code: 'ENGL', type: 'department', parentUnitId: 'org-arts-fac', centreCode: '315', status: 'active', createdAt: now(), updatedAt: now() },
  { id: 'org-reg-dir', name: 'Registry Directorate', code: 'REG', type: 'directorate', centreCode: '105', status: 'active', createdAt: now(), updatedAt: now() },
  { id: 'org-lib-dir', name: 'University Library', code: 'LIB', type: 'directorate', centreCode: '130', status: 'active', createdAt: now(), updatedAt: now() },
  { id: 'org-ict-dir', name: 'ICT Directorate', code: 'ICT', type: 'directorate', centreCode: '135', status: 'active', createdAt: now(), updatedAt: now() },
  { id: 'org-works-div', name: 'Works & Maintenance Division', code: 'WORKS', type: 'division', centreCode: '140', status: 'active', createdAt: now(), updatedAt: now() },
  { id: 'org-sport-div', name: 'Sports Division', code: 'SPORT', type: 'division', centreCode: '145', status: 'active', createdAt: now(), updatedAt: now() },
  { id: 'org-hr-unit', name: 'Human Resources Unit', code: 'HR', type: 'unit', centreCode: '150', status: 'active', createdAt: now(), updatedAt: now() },
  { id: 'org-audit-unit', name: 'Internal Audit Unit', code: 'AUDIT', type: 'unit', centreCode: '155', status: 'active', createdAt: now(), updatedAt: now() },
  { id: 'org-bursary-dir', name: 'Bursary Directorate', code: 'BURSARY', type: 'directorate', centreCode: '160', status: 'active', createdAt: now(), updatedAt: now() },
];

const SEED_FUND_CODES: FundCode[] = [
  { id: 'fc-01', code: '01', name: 'Recurrent Expenditure Vote', description: 'Standard recurrent operational expenditure', isDefault: true, status: 'active' },
  { id: 'fc-02', code: '02', name: 'Capital Development Fund', description: 'Capital project and infrastructure expenditure', isDefault: false, status: 'active' },
  { id: 'fc-04', code: '04', name: 'TETFund / Research Grants', description: 'TETFund and externally-funded research grants', isDefault: false, status: 'active' },
  { id: 'fc-05', code: '05', name: 'Internally Generated Revenue (IGR)', description: 'Revenue generated by the university internally', isDefault: false, status: 'active' },
  { id: 'fc-08', code: '08', name: 'Special Grants & Intervention Funds', description: 'Government and institutional special intervention', isDefault: false, status: 'active' },
];

const SEED_EXPENSE_CODES: ExpenseCode[] = [
  { id: 'ec-210101', code: '210101', description: 'Local Transport & Travels - Others', category: 'Travel & Logistics', status: 'active', createdAt: now(), updatedAt: now() },
  { id: 'ec-210201', code: '210201', description: 'International Travel & Subsistence Allowances', category: 'Travel & Logistics', status: 'active', createdAt: now(), updatedAt: now() },
  { id: 'ec-210301', code: '210301', description: 'Duty Tour Allowance', category: 'Travel & Logistics', status: 'active', createdAt: now(), updatedAt: now() },
  { id: 'ec-220101', code: '220101', description: 'Office Stationeries & Computer Supplies', category: 'Supplies & Consumables', status: 'active', createdAt: now(), updatedAt: now() },
  { id: 'ec-220201', code: '220201', description: 'Books & Publications', category: 'Supplies & Consumables', status: 'active', createdAt: now(), updatedAt: now() },
  { id: 'ec-220301', code: '220301', description: 'Laboratory Chemicals & Supplies', category: 'Supplies & Consumables', status: 'active', createdAt: now(), updatedAt: now() },
  { id: 'ec-220401', code: '220401', description: 'Medical Supplies & Drugs', category: 'Supplies & Consumables', status: 'active', createdAt: now(), updatedAt: now() },
  { id: 'ec-220501', code: '220501', description: 'Agricultural & Veterinary Supplies', category: 'Supplies & Consumables', status: 'active', createdAt: now(), updatedAt: now() },
  { id: 'ec-230101', code: '230101', description: 'Maintenance of Motor Vehicles', category: 'Repairs & Maintenance', status: 'active', createdAt: now(), updatedAt: now() },
  { id: 'ec-230201', code: '230201', description: 'Maintenance of Office Building', category: 'Repairs & Maintenance', status: 'active', createdAt: now(), updatedAt: now() },
  { id: 'ec-230301', code: '230301', description: 'Maintenance of Office Equipment', category: 'Repairs & Maintenance', status: 'active', createdAt: now(), updatedAt: now() },
  { id: 'ec-230401', code: '230401', description: 'Maintenance of Laboratory Equipment', category: 'Repairs & Maintenance', status: 'active', createdAt: now(), updatedAt: now() },
  { id: 'ec-230501', code: '230501', description: 'Maintenance of Electrical & Mechanical Equipment', category: 'Repairs & Maintenance', status: 'active', createdAt: now(), updatedAt: now() },
  { id: 'ec-240101', code: '240101', description: 'Research Grants & Field Work', category: 'Research & Academic', status: 'active', createdAt: now(), updatedAt: now() },
  { id: 'ec-240201', code: '240201', description: 'Academic Conference & Workshops', category: 'Research & Academic', status: 'active', createdAt: now(), updatedAt: now() },
  { id: 'ec-240301', code: '240301', description: 'Consultancy & Professional Services', category: 'Research & Academic', status: 'active', createdAt: now(), updatedAt: now() },
  { id: 'ec-250101', code: '250101', description: 'Procurement of Computer Equipment', category: 'Capital Equipment', status: 'active', createdAt: now(), updatedAt: now() },
  { id: 'ec-250201', code: '250201', description: 'Procurement of Laboratory Instruments', category: 'Capital Equipment', status: 'active', createdAt: now(), updatedAt: now() },
  { id: 'ec-250301', code: '250301', description: 'Procurement of Office Furniture', category: 'Capital Equipment', status: 'active', createdAt: now(), updatedAt: now() },
  { id: 'ec-250401', code: '250401', description: 'Procurement of Generator & Power Equipment', category: 'Capital Equipment', status: 'active', createdAt: now(), updatedAt: now() },
  { id: 'ec-260101', code: '260101', description: 'Electricity & Power Bills', category: 'Utilities', status: 'active', createdAt: now(), updatedAt: now() },
  { id: 'ec-260201', code: '260201', description: 'Water & Sanitation Charges', category: 'Utilities', status: 'active', createdAt: now(), updatedAt: now() },
  { id: 'ec-260301', code: '260301', description: 'Telecommunications & Internet Services', category: 'Utilities', status: 'active', createdAt: now(), updatedAt: now() },
  { id: 'ec-270101', code: '270101', description: 'Staff Training & Development', category: 'Human Resources', status: 'active', createdAt: now(), updatedAt: now() },
  { id: 'ec-270201', code: '270201', description: 'Staff Welfare & Medical', category: 'Human Resources', status: 'active', createdAt: now(), updatedAt: now() },
  { id: 'ec-270301', code: '270301', description: 'Recruitment & Advertising', category: 'Human Resources', status: 'active', createdAt: now(), updatedAt: now() },
  { id: 'ec-280101', code: '280101', description: 'Printing & Publication Services', category: 'Administrative', status: 'active', createdAt: now(), updatedAt: now() },
  { id: 'ec-280201', code: '280201', description: 'Security Services', category: 'Administrative', status: 'active', createdAt: now(), updatedAt: now() },
  { id: 'ec-280301', code: '280301', description: 'Cleaning & Janitorial Services', category: 'Administrative', status: 'active', createdAt: now(), updatedAt: now() },
  { id: 'ec-280401', code: '280401', description: 'Insurance Premiums', category: 'Administrative', status: 'active', createdAt: now(), updatedAt: now() },
  { id: 'ec-290101', code: '290101', description: 'Convocation & Ceremonial Expenses', category: 'Events & Ceremonies', status: 'active', createdAt: now(), updatedAt: now() },
  { id: 'ec-290201', code: '290201', description: 'Hospitality & Entertainment', category: 'Events & Ceremonies', status: 'active', createdAt: now(), updatedAt: now() },
  { id: 'ec-300101', code: '300101', description: 'Civil Works & Building Construction', category: 'Capital Project', status: 'active', createdAt: now(), updatedAt: now() },
  { id: 'ec-300201', code: '300201', description: 'Roads & Infrastructure Development', category: 'Capital Project', status: 'active', createdAt: now(), updatedAt: now() },
  { id: 'ec-300301', code: '300301', description: 'Landscaping & Beautification', category: 'Capital Project', status: 'active', createdAt: now(), updatedAt: now() },
];

function buildSeedStaff(): StaffProfile[] {
  const ts = now();
  return [
    // Superadmin
    {
      id: 'staff-superadmin', title: 'Dr.', firstName: 'Adewale', lastName: 'Okonkwo',
      fullName: 'Dr. Adewale Okonkwo', staffId: 'P.00001', email: 'admin@oauife.edu.ng',
      phone: '08031000001', designation: 'Systems Administrator', nin: '12345678901',
      salaryType: 'CONTISS', salaryGrade: 'CONTISS 15', salaryLevel: '15', salaryStep: '05',
      orgUnitId: 'org-ict-dir', role: 'superadmin', status: 'active',
      mustChangePassword: false, passwordHash: hashPassword('Admin@1234'), createdAt: ts, updatedAt: ts,
    },
    // Bursary Officers
    {
      id: 'staff-bursary-01', title: 'Mr.', firstName: 'Emeka', lastName: 'Obi',
      fullName: 'Mr. Emeka Obi', staffId: 'P.02001', email: 'emeka.obi@oauife.edu.ng',
      phone: '08031000002', designation: 'Senior Executive Officer (Bursary)', nin: '23456789012',
      salaryType: 'CONTISS', salaryGrade: 'CONTISS 09', salaryLevel: '09', salaryStep: '04',
      orgUnitId: 'org-bursary-dir', role: 'bursary', bursaryUnit: 'Expenditure', status: 'active',
      mustChangePassword: false, passwordHash: hashPassword('Bursary@1234'), createdAt: ts, updatedAt: ts,
    },
    {
      id: 'staff-bursary-02', title: 'Mrs.', firstName: 'Funmilayo', lastName: 'Adeyemi',
      fullName: 'Mrs. Funmilayo Adeyemi', staffId: 'P.02002', email: 'funmilayo.adeyemi@oauife.edu.ng',
      phone: '08031000003', designation: 'Principal Executive Officer (Bursary)', nin: '34567890123',
      salaryType: 'CONTISS', salaryGrade: 'CONTISS 11', salaryLevel: '11', salaryStep: '03',
      orgUnitId: 'org-bursary-dir', role: 'bursary', bursaryUnit: 'Audit', status: 'active',
      mustChangePassword: false, passwordHash: hashPassword('Bursary@1234'), createdAt: ts, updatedAt: ts,
    },
    {
      id: 'staff-bursary-03', title: 'Mr.', firstName: 'Taiwo', lastName: 'Olawale',
      fullName: 'Mr. Taiwo Olawale', staffId: 'P.02003', email: 'taiwo.olawale@oauife.edu.ng',
      phone: '08031000004', designation: 'Executive Officer (Bursary)', nin: '45678901234',
      salaryType: 'CONTISS', salaryGrade: 'CONTISS 07', salaryLevel: '07', salaryStep: '06',
      orgUnitId: 'org-bursary-dir', role: 'bursary', bursaryUnit: 'Advances', status: 'active',
      mustChangePassword: false, passwordHash: hashPassword('Bursary@1234'), createdAt: ts, updatedAt: ts,
    },
    {
      id: 'staff-bursary-04', title: 'Ms.', firstName: 'Ngozi', lastName: 'Chukwu',
      fullName: 'Ms. Ngozi Chukwu', staffId: 'P.02004', email: 'ngozi.chukwu@oauife.edu.ng',
      phone: '08031000005', designation: 'Senior Executive Officer (Bursary)', nin: '56789012345',
      salaryType: 'CONTISS', salaryGrade: 'CONTISS 09', salaryLevel: '09', salaryStep: '02',
      orgUnitId: 'org-bursary-dir', role: 'bursary', bursaryUnit: 'Treasury', status: 'active',
      mustChangePassword: false, passwordHash: hashPassword('Bursary@1234'), createdAt: ts, updatedAt: ts,
    },
    {
      id: 'staff-bursary-05', title: 'Mr.', firstName: 'Olumide', lastName: 'Fashola',
      fullName: 'Mr. Olumide Fashola', staffId: 'P.02005', email: 'olumide.fashola@oauife.edu.ng',
      phone: '08031000006', designation: 'Assistant Chief Executive Officer (Bursary)', nin: '67890123456',
      salaryType: 'CONTISS', salaryGrade: 'CONTISS 12', salaryLevel: '12', salaryStep: '04',
      orgUnitId: 'org-bursary-dir', role: 'bursary', bursaryUnit: 'Final Accounts', status: 'active',
      mustChangePassword: false, passwordHash: hashPassword('Bursary@1234'), createdAt: ts, updatedAt: ts,
    },
    {
      id: 'staff-bursary-06', title: 'Mrs.', firstName: 'Abimbola', lastName: 'Soyinka',
      fullName: 'Mrs. Abimbola Soyinka', staffId: 'P.02006', email: 'abimbola.soyinka@oauife.edu.ng',
      phone: '08031000007', designation: 'Chief Executive Officer (Bursary)', nin: '78901234567',
      salaryType: 'CONTISS', salaryGrade: 'CONTISS 13', salaryLevel: '13', salaryStep: '05',
      orgUnitId: 'org-bursary-dir', role: 'bursary', bursaryUnit: 'Expenditure', status: 'active',
      mustChangePassword: false, passwordHash: hashPassword('Bursary@1234'), createdAt: ts, updatedAt: ts,
    },
    // University Staff
    {
      id: 'staff-csc-01', title: 'Prof.', firstName: 'Adeyemi', lastName: 'Babatunde',
      fullName: 'Prof. Adeyemi Babatunde', staffId: 'P.14201', email: 'adeyemi.babatunde@oauife.edu.ng',
      phone: '08031001001', designation: 'Professor of Computer Science', nin: '11111111101',
      salaryType: 'CONUASS', salaryGrade: 'CONUASS 07', salaryLevel: '07', salaryStep: '05',
      orgUnitId: 'org-csc-dept', role: 'staff', status: 'active',
      mustChangePassword: true, passwordHash: hashPassword('Staff@1234'), createdAt: ts, updatedAt: ts,
    },
    {
      id: 'staff-csc-02', title: 'Dr.', firstName: 'Oluwafemi', lastName: 'Oladele',
      fullName: 'Dr. Oluwafemi Oladele', staffId: 'P.14202', email: 'oluwafemi.oladele@oauife.edu.ng',
      phone: '08031001002', designation: 'Senior Lecturer', nin: '11111111102',
      salaryType: 'CONUASS', salaryGrade: 'CONUASS 05', salaryLevel: '05', salaryStep: '04',
      orgUnitId: 'org-csc-dept', role: 'staff', status: 'active',
      mustChangePassword: true, passwordHash: hashPassword('Staff@1234'), createdAt: ts, updatedAt: ts,
    },
    {
      id: 'staff-csc-03', title: 'Mr.', firstName: 'Kayode', lastName: 'Adesanya',
      fullName: 'Mr. Kayode Adesanya', staffId: 'P.14203', email: 'kayode.adesanya@oauife.edu.ng',
      phone: '08031001003', designation: 'Senior Technical Officer', nin: '11111111103',
      salaryType: 'CONTISS', salaryGrade: 'CONTISS 08', salaryLevel: '08', salaryStep: '03',
      orgUnitId: 'org-csc-dept', role: 'staff', status: 'active',
      mustChangePassword: true, passwordHash: hashPassword('Staff@1234'), createdAt: ts, updatedAt: ts,
    },
    {
      id: 'staff-phy-01', title: 'Prof.', firstName: 'Olabisi', lastName: 'Adewumi',
      fullName: 'Prof. Olabisi Adewumi', staffId: 'P.21001', email: 'olabisi.adewumi@oauife.edu.ng',
      phone: '08031002001', designation: 'Professor of Physics', nin: '22222222101',
      salaryType: 'CONUASS', salaryGrade: 'CONUASS 07', salaryLevel: '07', salaryStep: '06',
      orgUnitId: 'org-phy-dept', role: 'staff', status: 'active',
      mustChangePassword: true, passwordHash: hashPassword('Staff@1234'), createdAt: ts, updatedAt: ts,
    },
    {
      id: 'staff-phy-02', title: 'Dr.', firstName: 'Segun', lastName: 'Makinde',
      fullName: 'Dr. Segun Makinde', staffId: 'P.21002', email: 'segun.makinde@oauife.edu.ng',
      phone: '08031002002', designation: 'Lecturer I', nin: '22222222102',
      salaryType: 'CONUASS', salaryGrade: 'CONUASS 04', salaryLevel: '04', salaryStep: '05',
      orgUnitId: 'org-phy-dept', role: 'staff', status: 'active',
      mustChangePassword: true, passwordHash: hashPassword('Staff@1234'), createdAt: ts, updatedAt: ts,
    },
    {
      id: 'staff-chem-01', title: 'Prof.', firstName: 'Yetunde', lastName: 'Ogunleye',
      fullName: 'Prof. Yetunde Ogunleye', staffId: 'P.21501', email: 'yetunde.ogunleye@oauife.edu.ng',
      phone: '08031003001', designation: 'Professor of Chemistry', nin: '33333333101',
      salaryType: 'CONUASS', salaryGrade: 'CONUASS 07', salaryLevel: '07', salaryStep: '04',
      orgUnitId: 'org-chem-dept', role: 'staff', status: 'active',
      mustChangePassword: true, passwordHash: hashPassword('Staff@1234'), createdAt: ts, updatedAt: ts,
    },
    {
      id: 'staff-chem-02', title: 'Dr.', firstName: 'Rotimi', lastName: 'Adekunle',
      fullName: 'Dr. Rotimi Adekunle', staffId: 'P.21502', email: 'rotimi.adekunle@oauife.edu.ng',
      phone: '08031003002', designation: 'Senior Lecturer', nin: '33333333102',
      salaryType: 'CONUASS', salaryGrade: 'CONUASS 05', salaryLevel: '05', salaryStep: '03',
      orgUnitId: 'org-chem-dept', role: 'staff', status: 'active',
      mustChangePassword: true, passwordHash: hashPassword('Staff@1234'), createdAt: ts, updatedAt: ts,
    },
    {
      id: 'staff-bio-01', title: 'Prof.', firstName: 'Folake', lastName: 'Bankole',
      fullName: 'Prof. Folake Bankole', staffId: 'P.22001', email: 'folake.bankole@oauife.edu.ng',
      phone: '08031004001', designation: 'Professor of Zoology', nin: '44444444101',
      salaryType: 'CONUASS', salaryGrade: 'CONUASS 07', salaryLevel: '07', salaryStep: '03',
      orgUnitId: 'org-bio-dept', role: 'staff', status: 'active',
      mustChangePassword: true, passwordHash: hashPassword('Staff@1234'), createdAt: ts, updatedAt: ts,
    },
    {
      id: 'staff-acct-01', title: 'Dr.', firstName: 'Toyin', lastName: 'Fawehinmi',
      fullName: 'Dr. Toyin Fawehinmi', staffId: 'P.45001', email: 'toyin.fawehinmi@oauife.edu.ng',
      phone: '08031005001', designation: 'Senior Lecturer', nin: '55555555101',
      salaryType: 'CONUASS', salaryGrade: 'CONUASS 05', salaryLevel: '05', salaryStep: '06',
      orgUnitId: 'org-acct-dept', role: 'staff', status: 'active',
      mustChangePassword: true, passwordHash: hashPassword('Staff@1234'), createdAt: ts, updatedAt: ts,
    },
    {
      id: 'staff-acct-02', title: 'Mr.', firstName: 'Biodun', lastName: 'Olowole',
      fullName: 'Mr. Biodun Olowole', staffId: 'P.45002', email: 'biodun.olowole@oauife.edu.ng',
      phone: '08031005002', designation: 'Principal Executive Officer', nin: '55555555102',
      salaryType: 'CONTISS', salaryGrade: 'CONTISS 11', salaryLevel: '11', salaryStep: '04',
      orgUnitId: 'org-acct-dept', role: 'staff', status: 'active',
      mustChangePassword: true, passwordHash: hashPassword('Staff@1234'), createdAt: ts, updatedAt: ts,
    },
    {
      id: 'staff-econ-01', title: 'Prof.', firstName: 'Ibukun', lastName: 'Oyewole',
      fullName: 'Prof. Ibukun Oyewole', staffId: 'P.45501', email: 'ibukun.oyewole@oauife.edu.ng',
      phone: '08031006001', designation: 'Professor of Economics', nin: '66666666101',
      salaryType: 'CONUASS', salaryGrade: 'CONUASS 07', salaryLevel: '07', salaryStep: '05',
      orgUnitId: 'org-econ-dept', role: 'staff', status: 'active',
      mustChangePassword: true, passwordHash: hashPassword('Staff@1234'), createdAt: ts, updatedAt: ts,
    },
    {
      id: 'staff-mech-01', title: 'Prof.', firstName: 'Niyi', lastName: 'Sobowale',
      fullName: 'Prof. Niyi Sobowale', staffId: 'P.11001', email: 'niyi.sobowale@oauife.edu.ng',
      phone: '08031007001', designation: 'Professor of Mechanical Engineering', nin: '77777777101',
      salaryType: 'CONUASS', salaryGrade: 'CONUASS 07', salaryLevel: '07', salaryStep: '06',
      orgUnitId: 'org-mech-dept', role: 'staff', status: 'active',
      mustChangePassword: true, passwordHash: hashPassword('Staff@1234'), createdAt: ts, updatedAt: ts,
    },
    {
      id: 'staff-civil-01', title: 'Engr.', firstName: 'Tunde', lastName: 'Alabi',
      fullName: 'Engr. Tunde Alabi', staffId: 'P.11501', email: 'tunde.alabi@oauife.edu.ng',
      phone: '08031008001', designation: 'Senior Lecturer (Civil Engineering)', nin: '88888888101',
      salaryType: 'CONUASS', salaryGrade: 'CONUASS 05', salaryLevel: '05', salaryStep: '05',
      orgUnitId: 'org-civil-dept', role: 'staff', status: 'active',
      mustChangePassword: true, passwordHash: hashPassword('Staff@1234'), createdAt: ts, updatedAt: ts,
    },
    {
      id: 'staff-elec-01', title: 'Engr.', firstName: 'Femi', lastName: 'Oduya',
      fullName: 'Engr. Femi Oduya', staffId: 'P.12001', email: 'femi.oduya@oauife.edu.ng',
      phone: '08031009001', designation: 'Lecturer I (Electrical Engineering)', nin: '99999999101',
      salaryType: 'CONUASS', salaryGrade: 'CONUASS 04', salaryLevel: '04', salaryStep: '03',
      orgUnitId: 'org-elec-dept', role: 'staff', status: 'active',
      mustChangePassword: true, passwordHash: hashPassword('Staff@1234'), createdAt: ts, updatedAt: ts,
    },
    {
      id: 'staff-reg-01', title: 'Mr.', firstName: 'Dare', lastName: 'Awojobi',
      fullName: 'Mr. Dare Awojobi', staffId: 'P.10501', email: 'dare.awojobi@oauife.edu.ng',
      phone: '08031010001', designation: 'Deputy Registrar', nin: '10101010101',
      salaryType: 'CONTISS', salaryGrade: 'CONTISS 14', salaryLevel: '14', salaryStep: '04',
      orgUnitId: 'org-reg-dir', role: 'staff', status: 'active',
      mustChangePassword: true, passwordHash: hashPassword('Staff@1234'), createdAt: ts, updatedAt: ts,
    },
    {
      id: 'staff-lib-01', title: 'Mrs.', firstName: 'Adeola', lastName: 'Coker',
      fullName: 'Mrs. Adeola Coker', staffId: 'P.13001', email: 'adeola.coker@oauife.edu.ng',
      phone: '08031011001', designation: 'Senior Librarian', nin: '10202020202',
      salaryType: 'CONTISS', salaryGrade: 'CONTISS 10', salaryLevel: '10', salaryStep: '05',
      orgUnitId: 'org-lib-dir', role: 'staff', status: 'active',
      mustChangePassword: true, passwordHash: hashPassword('Staff@1234'), createdAt: ts, updatedAt: ts,
    },
    {
      id: 'staff-ict-01', title: 'Mr.', firstName: 'Lanre', lastName: 'Bello',
      fullName: 'Mr. Lanre Bello', staffId: 'P.13501', email: 'lanre.bello@oauife.edu.ng',
      phone: '08031012001', designation: 'Senior Systems Analyst', nin: '10303030303',
      salaryType: 'CONTISS', salaryGrade: 'CONTISS 09', salaryLevel: '09', salaryStep: '03',
      orgUnitId: 'org-ict-dir', role: 'staff', status: 'active',
      mustChangePassword: true, passwordHash: hashPassword('Staff@1234'), createdAt: ts, updatedAt: ts,
    },
    {
      id: 'staff-hr-01', title: 'Mrs.', firstName: 'Bimpe', lastName: 'Oluwaseun',
      fullName: 'Mrs. Bimpe Oluwaseun', staffId: 'P.15001', email: 'bimpe.oluwaseun@oauife.edu.ng',
      phone: '08031013001', designation: 'Senior Human Resources Officer', nin: '10404040404',
      salaryType: 'CONTISS', salaryGrade: 'CONTISS 09', salaryLevel: '09', salaryStep: '06',
      orgUnitId: 'org-hr-unit', role: 'staff', status: 'active',
      mustChangePassword: true, passwordHash: hashPassword('Staff@1234'), createdAt: ts, updatedAt: ts,
    },
    {
      id: 'staff-works-01', title: 'Engr.', firstName: 'Sunday', lastName: 'Oluwasegun',
      fullName: 'Engr. Sunday Oluwasegun', staffId: 'P.14001', email: 'sunday.oluwasegun@oauife.edu.ng',
      phone: '08031014001', designation: 'Chief Technical Officer (Works)', nin: '10505050505',
      salaryType: 'CONTISS', salaryGrade: 'CONTISS 13', salaryLevel: '13', salaryStep: '04',
      orgUnitId: 'org-works-div', role: 'staff', status: 'active',
      mustChangePassword: true, passwordHash: hashPassword('Staff@1234'), createdAt: ts, updatedAt: ts,
    },
    {
      id: 'staff-hist-01', title: 'Dr.', firstName: 'Akin', lastName: 'Olukoya',
      fullName: 'Dr. Akin Olukoya', staffId: 'P.31001', email: 'akin.olukoya@oauife.edu.ng',
      phone: '08031015001', designation: 'Lecturer I (History)', nin: '10606060606',
      salaryType: 'CONUASS', salaryGrade: 'CONUASS 04', salaryLevel: '04', salaryStep: '04',
      orgUnitId: 'org-hist-dept', role: 'staff', status: 'active',
      mustChangePassword: true, passwordHash: hashPassword('Staff@1234'), createdAt: ts, updatedAt: ts,
    },
    {
      id: 'staff-engl-01', title: 'Prof.', firstName: 'Wole', lastName: 'Adebayo',
      fullName: 'Prof. Wole Adebayo', staffId: 'P.31501', email: 'wole.adebayo@oauife.edu.ng',
      phone: '08031016001', designation: 'Professor of English Literature', nin: '10707070707',
      salaryType: 'CONUASS', salaryGrade: 'CONUASS 07', salaryLevel: '07', salaryStep: '05',
      orgUnitId: 'org-engl-dept', role: 'staff', status: 'active',
      mustChangePassword: true, passwordHash: hashPassword('Staff@1234'), createdAt: ts, updatedAt: ts,
    },
    {
      id: 'staff-agron-01', title: 'Prof.', firstName: 'Sola', lastName: 'Odumosu',
      fullName: 'Prof. Sola Odumosu', staffId: 'P.51001', email: 'sola.odumosu@oauife.edu.ng',
      phone: '08031017001', designation: 'Professor of Agronomy', nin: '10808080808',
      salaryType: 'CONUASS', salaryGrade: 'CONUASS 07', salaryLevel: '07', salaryStep: '04',
      orgUnitId: 'org-agron-dept', role: 'staff', status: 'active',
      mustChangePassword: true, passwordHash: hashPassword('Staff@1234'), createdAt: ts, updatedAt: ts,
    },
    {
      id: 'staff-csc-04', title: 'Dr.', firstName: 'Lola', lastName: 'Adeyinka',
      fullName: 'Dr. Lola Adeyinka', staffId: 'P.14205', email: 'lola.adeyinka@oauife.edu.ng',
      phone: '08031001005', designation: 'Lecturer II', nin: '11111111105',
      salaryType: 'CONUASS', salaryGrade: 'CONUASS 03', salaryLevel: '03', salaryStep: '05',
      orgUnitId: 'org-csc-dept', role: 'staff', status: 'active',
      mustChangePassword: true, passwordHash: hashPassword('Staff@1234'), createdAt: ts, updatedAt: ts,
    },
    {
      id: 'staff-phy-03', title: 'Mrs.', firstName: 'Yemi', lastName: 'Olawuyi',
      fullName: 'Mrs. Yemi Olawuyi', staffId: 'P.21003', email: 'yemi.olawuyi@oauife.edu.ng',
      phone: '08031002003', designation: 'Executive Officer (Physics Lab)', nin: '22222222103',
      salaryType: 'CONTISS', salaryGrade: 'CONTISS 07', salaryLevel: '07', salaryStep: '05',
      orgUnitId: 'org-phy-dept', role: 'staff', status: 'active',
      mustChangePassword: true, passwordHash: hashPassword('Staff@1234'), createdAt: ts, updatedAt: ts,
    },
    {
      id: 'staff-reg-02', title: 'Ms.', firstName: 'Titi', lastName: 'Olawale',
      fullName: 'Ms. Titi Olawale', staffId: 'P.10502', email: 'titi.olawale@oauife.edu.ng',
      phone: '08031010002', designation: 'Senior Assistant Registrar', nin: '10101010102',
      salaryType: 'CONTISS', salaryGrade: 'CONTISS 10', salaryLevel: '10', salaryStep: '03',
      orgUnitId: 'org-reg-dir', role: 'staff', status: 'active',
      mustChangePassword: true, passwordHash: hashPassword('Staff@1234'), createdAt: ts, updatedAt: ts,
    },
    {
      id: 'staff-ict-02', title: 'Mr.', firstName: 'Olu', lastName: 'Adewole',
      fullName: 'Mr. Olu Adewole', staffId: 'P.13502', email: 'olu.adewole@oauife.edu.ng',
      phone: '08031012002', designation: 'Network Administrator', nin: '10303030304',
      salaryType: 'CONTISS', salaryGrade: 'CONTISS 08', salaryLevel: '08', salaryStep: '04',
      orgUnitId: 'org-ict-dir', role: 'staff', status: 'active',
      mustChangePassword: true, passwordHash: hashPassword('Staff@1234'), createdAt: ts, updatedAt: ts,
    },
    {
      id: 'staff-audit-01', title: 'Mr.', firstName: 'Gboyega', lastName: 'Olaniyi',
      fullName: 'Mr. Gboyega Olaniyi', staffId: 'P.15501', email: 'gboyega.olaniyi@oauife.edu.ng',
      phone: '08031018001', designation: 'Internal Auditor', nin: '10909090909',
      salaryType: 'CONTISS', salaryGrade: 'CONTISS 09', salaryLevel: '09', salaryStep: '05',
      orgUnitId: 'org-audit-unit', role: 'staff', status: 'active',
      mustChangePassword: true, passwordHash: hashPassword('Staff@1234'), createdAt: ts, updatedAt: ts,
    },
  ];
}

function buildSeedSubmissions(staff: StaffProfile[], orgUnits: OrgUnit[], fundCodes: FundCode[]): FormSubmission[] {
  const cscStaff = staff.find(s => s.staffId === 'P.14201')!;
  const cscUnit = orgUnits.find(u => u.id === 'org-csc-dept')!;
  const phyStaff = staff.find(s => s.staffId === 'P.21001')!;
  const phyUnit = orgUnits.find(u => u.id === 'org-phy-dept')!;
  const chemStaff = staff.find(s => s.staffId === 'P.21501')!;
  const chemUnit = orgUnits.find(u => u.id === 'org-chem-dept')!;
  const regStaff = staff.find(s => s.staffId === 'P.10501')!;
  const regUnit = orgUnits.find(u => u.id === 'org-reg-dir')!;
  const libStaff = staff.find(s => s.staffId === 'P.13001')!;
  const libUnit = orgUnits.find(u => u.id === 'org-lib-dir')!;
  const fundCode01 = fundCodes.find(f => f.code === '01')!;
  const fundCode02 = fundCodes.find(f => f.code === '02')!;
  const fundCode04 = fundCodes.find(f => f.code === '04')!;

  function snap(s: StaffProfile, unit: OrgUnit): FormSubmission['staffSnapshot'] {
    return {
      staffId: s.staffId, title: s.title, fullName: s.fullName, designation: s.designation,
      nin: s.nin, phone: s.phone, email: s.email, salaryType: s.salaryType,
      salaryGrade: s.salaryGrade, salaryLevel: s.salaryLevel, salaryStep: s.salaryStep,
      department: unit.name, departmentId: unit.id, centreCode: unit.centreCode,
    };
  }

  return [
    {
      id: 'sub-001', referenceNumber: 'CA-2026-0001', formType: 'cash-advance',
      submittedByStaffId: cscStaff.staffId, submittedByName: cscStaff.fullName, submittedByEmail: cscStaff.email,
      department: cscUnit.name, departmentId: cscUnit.id, fundCode: fundCode01.code,
      centreCode: cscUnit.centreCode, formattedFundCentreCode: `${fundCode01.code}-${cscUnit.centreCode}`,
      staffSnapshot: snap(cscStaff, cscUnit),
      formData: {
        purpose: 'Conference attendance at UNILAG - International Computing Symposium 2026',
        items: [
          { description: 'Transport allowance', amount: 25000 },
          { description: 'Registration fee', amount: 50000 },
          { description: 'Accommodation (3 nights)', amount: 75000 },
        ],
        totalAmount: 150000, expenseCode: '210101', expenseDescription: 'Local Transport & Travels - Others',
      },
      supportingDocuments: [], status: 'Submitted', submittedDate: '2026-11-01T09:30:00.000Z',
    },
    {
      id: 'sub-002', referenceNumber: 'CA-2026-0002', formType: 'cash-advance',
      submittedByStaffId: phyStaff.staffId, submittedByName: phyStaff.fullName, submittedByEmail: phyStaff.email,
      department: phyUnit.name, departmentId: phyUnit.id, fundCode: fundCode01.code,
      centreCode: phyUnit.centreCode, formattedFundCentreCode: `${fundCode01.code}-${phyUnit.centreCode}`,
      staffSnapshot: snap(phyStaff, phyUnit),
      formData: {
        purpose: 'Research fieldwork - Solar energy monitoring stations',
        items: [
          { description: 'Field transport', amount: 40000 },
          { description: 'Per diem allowance (5 days)', amount: 60000 },
        ],
        totalAmount: 100000, expenseCode: '240101', expenseDescription: 'Research Grants & Field Work',
      },
      supportingDocuments: [], status: 'In Review', submittedDate: '2026-10-28T14:20:00.000Z',
    },
    {
      id: 'sub-003', referenceNumber: 'EA-2026-0001', formType: 'expenditure-authorization',
      submittedByStaffId: chemStaff.staffId, submittedByName: chemStaff.fullName, submittedByEmail: chemStaff.email,
      department: chemUnit.name, departmentId: chemUnit.id, fundCode: fundCode02.code,
      centreCode: chemUnit.centreCode, formattedFundCentreCode: `${fundCode02.code}-${chemUnit.centreCode}`,
      staffSnapshot: snap(chemStaff, chemUnit),
      formData: {
        projectName: 'Organic Synthesis Research Lab Upgrade',
        purpose: 'Procurement of HPLC equipment and chemical reagents',
        items: [
          { description: 'HPLC System (Shimadzu Prominence)', amount: 2800000 },
          { description: 'Chemical Reagents (Grade A)', amount: 350000 },
          { description: 'Glassware & Consumables', amount: 150000 },
        ],
        totalAmount: 3300000, expenseCode: '250201', expenseDescription: 'Procurement of Laboratory Instruments',
      },
      supportingDocuments: [], status: 'Approved',
      bursaryDecision: {
        decision: 'Approved', officerName: 'Mr. Emeka Obi', officerEmail: 'emeka.obi@oauife.edu.ng',
        officerUnit: 'Expenditure', note: 'All documents verified. Funds available in capital budget.',
        voucherNumber: 'VCH-2026-0045', decidedAt: '2026-10-20T10:00:00.000Z',
      },
      submittedDate: '2026-10-15T11:00:00.000Z', processedDate: '2026-10-20T10:00:00.000Z',
    },
    {
      id: 'sub-004', referenceNumber: 'DM-2026-0001', formType: 'duty-mileage',
      submittedByStaffId: regStaff.staffId, submittedByName: regStaff.fullName, submittedByEmail: regStaff.email,
      department: regUnit.name, departmentId: regUnit.id, fundCode: fundCode01.code,
      centreCode: regUnit.centreCode, formattedFundCentreCode: `${fundCode01.code}-${regUnit.centreCode}`,
      staffSnapshot: snap(regStaff, regUnit),
      formData: {
        purpose: 'Official duty visit to NUC office, Abuja',
        journeys: [
          { from: 'Ile-Ife', to: 'Abuja', date: '2026-10-10', km: 648, ratePerKm: 100 },
          { from: 'Abuja', to: 'Ile-Ife', date: '2026-10-12', km: 648, ratePerKm: 100 },
        ],
        subsistence: [{ day: '2026-10-10', amount: 15000 }, { day: '2026-10-11', amount: 15000 }, { day: '2026-10-12', amount: 15000 }],
        totalMileage: 1296, totalSubsistence: 45000, totalAmount: 174600,
        expenseCode: '210101', expenseDescription: 'Local Transport & Travels - Others',
      },
      supportingDocuments: [], status: 'Rejected',
      bursaryDecision: {
        decision: 'Rejected', officerName: 'Mrs. Funmilayo Adeyemi', officerEmail: 'funmilayo.adeyemi@oauife.edu.ng',
        officerUnit: 'Audit', note: 'Mileage claim rate exceeds approved NUC rate of ₦80/km. Please resubmit with correct rates.',
        decidedAt: '2026-10-18T14:30:00.000Z',
      },
      submittedDate: '2026-10-14T09:00:00.000Z', processedDate: '2026-10-18T14:30:00.000Z',
    },
    {
      id: 'sub-005', referenceNumber: 'IH-2026-0001', formType: 'imprest-holder',
      submittedByStaffId: libStaff.staffId, submittedByName: libStaff.fullName, submittedByEmail: libStaff.email,
      department: libUnit.name, departmentId: libUnit.id, fundCode: fundCode01.code,
      centreCode: libUnit.centreCode, formattedFundCentreCode: `${fundCode01.code}-${libUnit.centreCode}`,
      staffSnapshot: snap(libStaff, libUnit),
      formData: {
        imprestAmount: 50000,
        dateIssued: '2026-10-01',
        purpose: 'Library operations and procurement of periodicals',
        expenditures: [
          { date: '2026-10-02', description: 'Journal subscriptions renewal', amount: 18000, receipt: 'REC-LIB-001' },
          { date: '2026-10-05', description: 'Office supplies (stationery)', amount: 7500, receipt: 'REC-LIB-002' },
          { date: '2026-10-10', description: 'Book binding and repair', amount: 12000, receipt: 'REC-LIB-003' },
          { date: '2026-10-15', description: 'Printing & photocopying', amount: 5500, receipt: 'REC-LIB-004' },
        ],
        totalExpenditure: 43000, balanceReturned: 7000,
        expenseCode: '220201', expenseDescription: 'Books & Publications',
      },
      supportingDocuments: [], status: 'In Review', submittedDate: '2026-10-20T10:30:00.000Z',
    },
    {
      id: 'sub-006', referenceNumber: 'DLPO-2026-0001', formType: 'dlpo',
      submittedByStaffId: cscStaff.staffId, submittedByName: cscStaff.fullName, submittedByEmail: cscStaff.email,
      department: cscUnit.name, departmentId: cscUnit.id, fundCode: fundCode04.code,
      centreCode: cscUnit.centreCode, formattedFundCentreCode: `${fundCode04.code}-${cscUnit.centreCode}`,
      staffSnapshot: snap(cscStaff, cscUnit),
      formData: {
        supplier: 'Spectranet Communications Ltd.',
        supplierAddress: '14 Awolowo Road, Ikoyi, Lagos',
        items: [
          { description: 'High-performance workstations (Dell Precision 5570)', quantity: 5, unitPrice: 850000, total: 4250000 },
          { description: 'UPS units (APC 2000VA)', quantity: 5, unitPrice: 120000, total: 600000 },
        ],
        totalAmount: 4850000, deliveryDate: '2026-11-15',
        expenseCode: '250101', expenseDescription: 'Procurement of Computer Equipment',
      },
      supportingDocuments: [], status: 'Submitted', submittedDate: '2026-11-05T13:45:00.000Z',
    },
  ];
}

// --- Singleton In-Memory Store ---
class MockDbStore {
  private db: MockDbSnapshot;
  private initialized = false;

  constructor() {
    this.db = { staff: [], orgUnits: [], fundCodes: [], expenseCodes: [], submissions: [], auditLogs: [] };
  }

  private load() {
    if (this.initialized) return;
    this.initialized = true;

    try {
      ensureDataDir();
      if (fs.existsSync(SNAPSHOT_PATH)) {
        const raw = fs.readFileSync(SNAPSHOT_PATH, 'utf-8');
        this.db = JSON.parse(raw) as MockDbSnapshot;
        return;
      }
    } catch {
      // Fall through to seed
    }

    // Seed
    const orgUnits = SEED_ORG_UNITS;
    const fundCodes = SEED_FUND_CODES;
    const expenseCodes = SEED_EXPENSE_CODES;
    const staff = buildSeedStaff();
    const submissions = buildSeedSubmissions(staff, orgUnits, fundCodes);

    this.db = { staff, orgUnits, fundCodes, expenseCodes, submissions, auditLogs: [] };
    this.persist();
  }

  persist() {
    try {
      ensureDataDir();
      fs.writeFileSync(SNAPSHOT_PATH, JSON.stringify(this.db, null, 2), 'utf-8');
    } catch {
      // Non-fatal
    }
  }

  get(): MockDbSnapshot {
    this.load();
    return this.db;
  }

  generateId(): string {
    return generateId();
  }

  now(): string {
    return now();
  }
}

// Global singleton (survives hot-module-reload in dev via globalThis)
const globalStore = globalThis as typeof globalThis & { __mockDb?: MockDbStore };
if (!globalStore.__mockDb) {
  globalStore.__mockDb = new MockDbStore();
}
export const mockDb = globalStore.__mockDb;
