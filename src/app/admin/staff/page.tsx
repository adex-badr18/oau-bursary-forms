'use client';

import { useState, useEffect, useMemo, useRef } from 'react';
import * as XLSX from 'xlsx';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import {
  Users,
  Upload,
  UserPlus,
  Download,
  Search,
  CheckCircle2,
  AlertTriangle,
  Loader2,
  ChevronLeft,
  ChevronRight,
  FileSpreadsheet,
} from 'lucide-react';
import type { StaffProfile, OrgUnit, StaffTitle, SalaryType, UserRole, BursaryUnit, PaginatedResponse } from '@/types';

export default function AdminStaffPage() {
  const [staffList, setStaffList] = useState<Omit<StaffProfile, 'passwordHash'>[]>([]);
  const [totalStaff, setTotalStaff] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [orgUnits, setOrgUnits] = useState<OrgUnit[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Single Register Modal State
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);
  const [registerLoading, setRegisterLoading] = useState(false);
  const [registerError, setRegisterError] = useState('');
  const [formStaff, setFormStaff] = useState({
    title: 'Mr.' as StaffTitle,
    firstName: '',
    middleName: '',
    lastName: '',
    staffId: '',
    email: '',
    phone: '',
    designation: '',
    nin: '',
    salaryType: 'CONTISS' as SalaryType,
    salaryGrade: 'CONTISS 08',
    salaryLevel: '08',
    salaryStep: '01',
    orgUnitId: '',
    role: 'staff' as UserRole,
    bursaryUnit: undefined as BursaryUnit | undefined,
  });

  // Bulk Ingestion State
  const [isBulkOpen, setIsBulkOpen] = useState(false);
  const [bulkFile, setBulkFile] = useState<File | null>(null);
  const [parsedRows, setParsedRows] = useState<any[]>([]);
  const [validationReport, setValidationReport] = useState<{
    total: number;
    valid: number;
    invalid: number;
    results: any[];
  } | null>(null);
  const [isValidating, setIsValidating] = useState(false);
  const [isIngesting, setIsIngesting] = useState(false);
  const [ingestProgress, setIngestProgress] = useState(0);
  const [ingestStatusText, setIngestStatusText] = useState('');
  const [ingestSummary, setIngestSummary] = useState<{ inserted: number; skipped: number; errors: any[] } | null>(null);
  const cancelIngestRef = useRef(false);

  // Load Org Units for dropdowns
  useEffect(() => {
    fetch('/api/org-units')
      .then((r) => r.json())
      .then((d) => {
        if (d.success && Array.isArray(d.data)) {
          setOrgUnits(d.data);
          if (d.data.length > 0 && !formStaff.orgUnitId) {
            setFormStaff((prev) => ({ ...prev, orgUnitId: d.data[0].id }));
          }
        }
      });
  }, []);

  // Fetch Staff Paginated
  const fetchStaff = async (page = 1, search = searchTerm, status = statusFilter) => {
    setIsLoading(true);
    try {
      const q = new URLSearchParams({
        page: String(page),
        limit: '10',
      });
      if (search) q.set('search', search);
      if (status && status !== 'all') q.set('status', status);

      const res = await fetch(`/api/staff?${q.toString()}`);
      const json = await res.json();
      if (json.success && json.data) {
        setStaffList(json.data.data);
        setTotalStaff(json.data.total);
        setTotalPages(json.data.totalPages);
        setCurrentPage(json.data.page);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchStaff(1, searchTerm, statusFilter);
  }, [searchTerm, statusFilter]);

  // Handle Single Register Submit
  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setRegisterError('');
    setRegisterLoading(true);

    try {
      const res = await fetch('/api/staff', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formStaff),
      });
      const json = await res.json();
      if (res.ok && json.success) {
        setIsRegisterOpen(false);
        setFormStaff({
          title: 'Mr.',
          firstName: '',
          middleName: '',
          lastName: '',
          staffId: '',
          email: '',
          phone: '',
          designation: '',
          nin: '',
          salaryType: 'CONTISS',
          salaryGrade: 'CONTISS 08',
          salaryLevel: '08',
          salaryStep: '01',
          orgUnitId: orgUnits[0]?.id || '',
          role: 'staff',
          bursaryUnit: undefined,
        });
        fetchStaff(1);
      } else {
        setRegisterError(json.error || 'Failed to create staff record');
      }
    } catch {
      setRegisterError('Network error while creating staff record');
    } finally {
      setRegisterLoading(false);
    }
  };

  // Bulk Upload File Parse
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setBulkFile(file);
    setValidationReport(null);
    setIngestSummary(null);

    const reader = new FileReader();
    reader.onload = (evt) => {
      try {
        const bstr = evt.target?.result;
        const wb = XLSX.read(bstr, { type: 'binary' });
        const wsname = wb.SheetNames[0];
        const ws = wb.Sheets[wsname];
        const data = XLSX.utils.sheet_to_json(ws) as any[];

        // Normalize headers
        const normalized = data.map((row) => ({
          title: row['Title'] || row['title'] || 'Mr.',
          firstName: row['FirstName'] || row['firstName'] || row['First Name'] || '',
          middleName: row['MiddleName'] || row['middleName'] || row['Middle Name'] || '',
          lastName: row['LastName'] || row['lastName'] || row['Last Name'] || '',
          staffId: String(row['StaffID'] || row['staffId'] || row['Staff ID'] || '').trim(),
          email: String(row['Email'] || row['email'] || '').trim().toLowerCase(),
          phone: String(row['Phone'] || row['phone'] || '').trim(),
          designation: row['Designation'] || row['designation'] || '',
          nin: String(row['NIN'] || row['nin'] || '').trim(),
          salaryType: row['SalaryType'] || row['salaryType'] || 'CONTISS',
          salaryGrade: row['SalaryGrade'] || row['salaryGrade'] || 'CONTISS 08',
          salaryLevel: String(row['SalaryLevel'] || row['salaryLevel'] || '08'),
          salaryStep: String(row['SalaryStep'] || row['salaryStep'] || '01'),
          orgUnitId: row['OrgUnitId'] || row['orgUnitId'] || orgUnits[0]?.id || '',
        }));

        setParsedRows(normalized);
      } catch (err) {
        alert('Failed to parse Excel file. Please ensure it is a valid .xlsx or .csv.');
      }
    };
    reader.readAsBinaryString(file);
  };

  // Dry-run validate against DB
  const handleValidateBulk = async () => {
    if (parsedRows.length === 0) return;
    setIsValidating(true);
    try {
      const res = await fetch('/api/staff/bulk-upload/validate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ records: parsedRows }),
      });
      const json = await res.json();
      if (json.success) {
        setValidationReport(json.data);
      } else {
        alert(json.error || 'Validation failed');
      }
    } catch {
      alert('Error connecting to validation service');
    } finally {
      setIsValidating(false);
    }
  };

  // Chunked batch ingestion (250 rows per batch)
  const handleStartIngestion = async () => {
    if (!validationReport) return;
    const validRecords = validationReport.results.filter((r) => r.valid).map((r) => r.data);
    if (validRecords.length === 0) {
      alert('No valid records to ingest');
      return;
    }

    setIsIngesting(true);
    cancelIngestRef.current = false;
    const CHUNK_SIZE = 250;
    const totalBatches = Math.ceil(validRecords.length / CHUNK_SIZE);
    let totalInserted = 0;
    let totalSkipped = 0;
    const allErrors: any[] = [];

    for (let i = 0; i < totalBatches; i++) {
      if (cancelIngestRef.current) {
        setIngestStatusText('Ingestion cancelled by user.');
        break;
      }

      const chunk = validRecords.slice(i * CHUNK_SIZE, (i + 1) * CHUNK_SIZE);
      const batchNumber = i + 1;
      const progressPercent = Math.round((batchNumber / totalBatches) * 100);
      setIngestProgress(progressPercent);
      setIngestStatusText(`Importing batch ${batchNumber} of ${totalBatches} (${chunk.length} records)...`);

      try {
        const res = await fetch('/api/staff/bulk-upload/batch', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            records: chunk,
            batchNumber,
            totalBatches,
          }),
        });
        const json = await res.json();
        if (json.success && json.data) {
          totalInserted += json.data.inserted;
          totalSkipped += json.data.skipped;
          if (json.data.errors) allErrors.push(...json.data.errors);
        }
      } catch (err) {
        console.error(`Batch ${batchNumber} failed`, err);
      }
    }

    setIsIngesting(false);
    setIngestStatusText('Completed');
    setIngestSummary({
      inserted: totalInserted,
      skipped: totalSkipped,
      errors: allErrors,
    });
    fetchStaff(1);
  };

  // Download Sample Template
  const handleDownloadTemplate = () => {
    const sample = [
      {
        Title: 'Dr.',
        FirstName: 'Oluwaseun',
        MiddleName: 'Ade',
        LastName: 'Adeyemi',
        StaffID: 'P.18901',
        Email: 'oluwaseun.adeyemi@oauife.edu.ng',
        Phone: '08031234567',
        Designation: 'Senior Lecturer',
        NIN: '12345678901',
        SalaryType: 'CONUASS',
        SalaryGrade: 'CONUASS 05',
        SalaryLevel: '05',
        SalaryStep: '03',
        OrgUnitId: orgUnits[0]?.id || 'org-csc-dept',
      },
      {
        Title: 'Mr.',
        FirstName: 'Babatunde',
        MiddleName: '',
        LastName: 'Ojo',
        StaffID: 'P.18902',
        Email: 'babatunde.ojo@oauife.edu.ng',
        Phone: '08039876543',
        Designation: 'Senior Executive Officer',
        NIN: '98765432101',
        SalaryType: 'CONTISS',
        SalaryGrade: 'CONTISS 09',
        SalaryLevel: '09',
        SalaryStep: '04',
        OrgUnitId: orgUnits[1]?.id || 'org-phy-dept',
      },
    ];

    const ws = XLSX.utils.json_to_sheet(sample);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Staff_Template');
    XLSX.writeFile(wb, 'OAU_Staff_Directory_Template.xlsx');
  };

  // Download Discrepancy Error Excel
  const handleDownloadErrors = () => {
    if (!validationReport) return;
    const invalidRows = validationReport.results.filter((r) => !r.valid);
    const exportData = invalidRows.map((r) => ({
      Row: r.row,
      Errors: Array.isArray(r.errors) ? r.errors.join('; ') : JSON.stringify(r.errors),
    }));

    const ws = XLSX.utils.json_to_sheet(exportData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Discrepancies');
    XLSX.writeFile(wb, 'OAU_Staff_Import_Errors.xlsx');
  };

  const getUnitName = (id: string) => {
    return orgUnits.find((u) => u.id === id)?.name || id;
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">University Staff Directory</h1>
          <p className="text-sm text-slate-500">
            Total Workforce: <strong>{totalStaff.toLocaleString()}</strong> registered staff across all university units
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* Download Sample */}
          <Button variant="outline" size="sm" onClick={handleDownloadTemplate} className="text-xs">
            <Download className="w-4 h-4 mr-1.5" /> Template
          </Button>

          {/* Bulk Ingest Modal */}
          <Dialog open={isBulkOpen} onOpenChange={setIsBulkOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm" className="border-indigo-300 text-indigo-700 hover:bg-indigo-50 text-xs">
                <Upload className="w-4 h-4 mr-1.5" /> Excel Bulk Import
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <FileSpreadsheet className="w-5 h-5 text-indigo-600" />
                  High-Capacity Staff Bulk Ingestion (~4,000 Capacity)
                </DialogTitle>
                <DialogDescription>
                  Upload an Excel (.xlsx / .csv) roster. The client pre-validates rows and streams sequential chunks of 250 records to prevent UI locking and timeouts.
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-4 py-3">
                {/* File picker */}
                <div className="border-2 border-dashed border-slate-200 rounded-lg p-6 text-center hover:border-indigo-400 transition-colors">
                  <Upload className="w-8 h-8 mx-auto text-slate-400 mb-2" />
                  <p className="text-sm font-medium text-slate-700 mb-1">
                    {bulkFile ? bulkFile.name : 'Click to select or drag and drop staff workbook'}
                  </p>
                  <p className="text-xs text-slate-400 mb-3">Accepts .xlsx or .csv containing university workforce rows</p>
                  <input
                    type="file"
                    accept=".xlsx,.xls,.csv"
                    onChange={handleFileChange}
                    className="block mx-auto text-xs text-slate-500 file:mr-2 file:py-1.5 file:px-3 file:rounded file:border-0 file:text-xs file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100 cursor-pointer"
                  />
                </div>

                {/* Validation Summary Card */}
                {parsedRows.length > 0 && !validationReport && (
                  <div className="flex items-center justify-between p-3 bg-slate-50 rounded border text-xs">
                    <span>
                      Detected <strong>{parsedRows.length.toLocaleString()}</strong> rows in workbook.
                    </span>
                    <Button size="sm" onClick={handleValidateBulk} disabled={isValidating} className="bg-indigo-600 hover:bg-indigo-700 text-xs">
                      {isValidating ? <><Loader2 className="w-3.5 h-3.5 mr-1.5 animate-spin" /> Checking...</> : 'Run Dry-Run Pre-Validation'}
                    </Button>
                  </div>
                )}

                {validationReport && (
                  <div className="space-y-3">
                    <div className="grid grid-cols-3 gap-3 text-center">
                      <div className="p-3 bg-slate-50 rounded border">
                        <div className="text-xs text-slate-500">Total Rows</div>
                        <div className="text-lg font-bold text-slate-900">{validationReport.total.toLocaleString()}</div>
                      </div>
                      <div className="p-3 bg-emerald-50 rounded border border-emerald-100">
                        <div className="text-xs text-emerald-700">Ready to Ingest</div>
                        <div className="text-lg font-bold text-emerald-800">{validationReport.valid.toLocaleString()}</div>
                      </div>
                      <div className="p-3 bg-red-50 rounded border border-red-100">
                        <div className="text-xs text-red-700">Errors / Duplicates</div>
                        <div className="text-lg font-bold text-red-800">{validationReport.invalid.toLocaleString()}</div>
                      </div>
                    </div>

                    {validationReport.invalid > 0 && (
                      <div className="flex items-center justify-between p-3 bg-amber-50 border border-amber-200 rounded text-xs text-amber-800">
                        <div className="flex items-center gap-2">
                          <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
                          <span>{validationReport.invalid} row(s) failed institutional email or database collision checks.</span>
                        </div>
                        <Button variant="outline" size="sm" onClick={handleDownloadErrors} className="text-xs border-amber-300">
                          <Download className="w-3.5 h-3.5 mr-1" /> Export Errors (.xlsx)
                        </Button>
                      </div>
                    )}

                    {/* Ingestion Progress */}
                    {isIngesting && (
                      <div className="space-y-2 p-4 bg-indigo-50 border border-indigo-100 rounded-lg">
                        <div className="flex justify-between text-xs font-medium text-indigo-950">
                          <span>{ingestStatusText}</span>
                          <span>{ingestProgress}%</span>
                        </div>
                        <Progress value={ingestProgress} className="h-2" />
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            cancelIngestRef.current = true;
                          }}
                          className="text-xs text-red-600 hover:text-red-700 hover:bg-red-50"
                        >
                          Cancel Ingestion
                        </Button>
                      </div>
                    )}

                    {/* Final Result */}
                    {ingestSummary && (
                      <Alert className="bg-emerald-50 border-emerald-200">
                        <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                        <AlertTitle className="text-emerald-900 font-semibold">Bulk Ingestion Finished</AlertTitle>
                        <AlertDescription className="text-emerald-800 text-xs">
                          Successfully onboarded <strong>{ingestSummary.inserted.toLocaleString()}</strong> staff members into the central directory. ({ingestSummary.skipped} skipped).
                        </AlertDescription>
                      </Alert>
                    )}
                  </div>
                )}
              </div>

              <DialogFooter>
                <Button variant="outline" onClick={() => setIsBulkOpen(false)} disabled={isIngesting}>
                  Close
                </Button>
                {validationReport && validationReport.valid > 0 && !ingestSummary && (
                  <Button onClick={handleStartIngestion} disabled={isIngesting} className="bg-indigo-600 hover:bg-indigo-700">
                    {isIngesting ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Ingesting Batches...</> : `Commit Import (${validationReport.valid} Records)`}
                  </Button>
                )}
              </DialogFooter>
            </DialogContent>
          </Dialog>

          {/* Single Register Modal */}
          <Dialog open={isRegisterOpen} onOpenChange={setIsRegisterOpen}>
            <DialogTrigger asChild>
              <Button size="sm" className="bg-indigo-600 hover:bg-indigo-700 text-xs">
                <UserPlus className="w-4 h-4 mr-1.5" /> Register Staff
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Register University Staff Member</DialogTitle>
                <DialogDescription>
                  Add a verified staff record. Their institutional credentials will instantly auto-fill on all digital forms.
                </DialogDescription>
              </DialogHeader>

              {registerError && (
                <Alert variant="destructive">
                  <AlertTriangle className="h-4 w-4" />
                  <AlertDescription>{registerError}</AlertDescription>
                </Alert>
              )}

              <form onSubmit={handleRegisterSubmit} className="space-y-4 py-2">
                <div className="grid grid-cols-4 gap-3">
                  <div>
                    <Label htmlFor="title" className="text-xs">Title</Label>
                    <Select value={formStaff.title} onValueChange={(v) => setFormStaff({ ...formStaff, title: v as StaffTitle })}>
                      <SelectTrigger id="title">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {['Prof.', 'Dr.', 'Mr.', 'Mrs.', 'Ms.', 'Engr.', 'Pharm.', 'Arch.'].map((t) => (
                          <SelectItem key={t} value={t}>{t}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="firstName" className="text-xs">First Name *</Label>
                    <Input id="firstName" value={formStaff.firstName} onChange={(e) => setFormStaff({ ...formStaff, firstName: e.target.value })} required />
                  </div>
                  <div>
                    <Label htmlFor="middleName" className="text-xs">Middle Name</Label>
                    <Input id="middleName" value={formStaff.middleName} onChange={(e) => setFormStaff({ ...formStaff, middleName: e.target.value })} />
                  </div>
                  <div>
                    <Label htmlFor="lastName" className="text-xs">Last Name *</Label>
                    <Input id="lastName" value={formStaff.lastName} onChange={(e) => setFormStaff({ ...formStaff, lastName: e.target.value })} required />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label htmlFor="staffId" className="text-xs">Staff ID / Payroll No. *</Label>
                    <Input id="staffId" placeholder="e.g. P.14205" value={formStaff.staffId} onChange={(e) => setFormStaff({ ...formStaff, staffId: e.target.value })} required />
                  </div>
                  <div>
                    <Label htmlFor="email" className="text-xs">Institutional Email (@oauife.edu.ng) *</Label>
                    <Input id="email" type="email" placeholder="username@oauife.edu.ng" value={formStaff.email} onChange={(e) => setFormStaff({ ...formStaff, email: e.target.value })} required />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <Label htmlFor="phone" className="text-xs">Phone Number *</Label>
                    <Input id="phone" placeholder="0803..." value={formStaff.phone} onChange={(e) => setFormStaff({ ...formStaff, phone: e.target.value })} required />
                  </div>
                  <div>
                    <Label htmlFor="nin" className="text-xs">NIN (11 Digits) *</Label>
                    <Input id="nin" maxLength={11} placeholder="12345678901" value={formStaff.nin} onChange={(e) => setFormStaff({ ...formStaff, nin: e.target.value })} required />
                  </div>
                  <div>
                    <Label htmlFor="designation" className="text-xs">Designation / Post *</Label>
                    <Input id="designation" placeholder="e.g. Senior Lecturer" value={formStaff.designation} onChange={(e) => setFormStaff({ ...formStaff, designation: e.target.value })} required />
                  </div>
                </div>

                <div className="grid grid-cols-4 gap-3">
                  <div>
                    <Label htmlFor="salaryType" className="text-xs">Salary Type</Label>
                    <Select value={formStaff.salaryType} onValueChange={(v) => setFormStaff({ ...formStaff, salaryType: v as SalaryType })}>
                      <SelectTrigger id="salaryType"><SelectValue /></SelectTrigger>
                      <SelectContent>
                        {['CONTISS', 'CONUASS', 'CONMESS', 'CONPASS', 'CONTOPS', 'CONRAISS'].map((s) => (
                          <SelectItem key={s} value={s}>{s}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="salaryGrade" className="text-xs">Salary Grade</Label>
                    <Input id="salaryGrade" value={formStaff.salaryGrade} onChange={(e) => setFormStaff({ ...formStaff, salaryGrade: e.target.value })} required />
                  </div>
                  <div>
                    <Label htmlFor="salaryLevel" className="text-xs">Level</Label>
                    <Input id="salaryLevel" value={formStaff.salaryLevel} onChange={(e) => setFormStaff({ ...formStaff, salaryLevel: e.target.value })} required />
                  </div>
                  <div>
                    <Label htmlFor="salaryStep" className="text-xs">Step</Label>
                    <Input id="salaryStep" value={formStaff.salaryStep} onChange={(e) => setFormStaff({ ...formStaff, salaryStep: e.target.value })} required />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label htmlFor="orgUnit" className="text-xs">Affiliated Organizational Unit *</Label>
                    <Select value={formStaff.orgUnitId} onValueChange={(v) => setFormStaff({ ...formStaff, orgUnitId: v })}>
                      <SelectTrigger id="orgUnit"><SelectValue placeholder="Select unit" /></SelectTrigger>
                      <SelectContent>
                        {orgUnits.map((u) => (
                          <SelectItem key={u.id} value={u.id}>
                            {u.name} ({u.centreCode})
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="role" className="text-xs">Portal Access Role</Label>
                    <Select value={formStaff.role} onValueChange={(v) => setFormStaff({ ...formStaff, role: v as UserRole })}>
                      <SelectTrigger id="role"><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="staff">Staff (Standard)</SelectItem>
                        <SelectItem value="bursary">Bursary Officer</SelectItem>
                        <SelectItem value="superadmin">Superadmin</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {formStaff.role === 'bursary' && (
                  <div>
                    <Label htmlFor="bursaryUnit" className="text-xs">Bursary Processing Unit</Label>
                    <Select value={formStaff.bursaryUnit} onValueChange={(v) => setFormStaff({ ...formStaff, bursaryUnit: v as BursaryUnit })}>
                      <SelectTrigger id="bursaryUnit"><SelectValue placeholder="Select processing desk" /></SelectTrigger>
                      <SelectContent>
                        {['Audit', 'Expenditure', 'Treasury', 'Advances', 'Final Accounts'].map((b) => (
                          <SelectItem key={b} value={b}>{b}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}

                <DialogFooter className="pt-3">
                  <Button variant="outline" type="button" onClick={() => setIsRegisterOpen(false)}>Cancel</Button>
                  <Button type="submit" disabled={registerLoading} className="bg-indigo-600 hover:bg-indigo-700">
                    {registerLoading ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Registering...</> : 'Save Staff Record'}
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
              <Input
                placeholder="Search staff by name, staff ID, email or designation..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9"
              />
            </div>
            <div className="w-full sm:w-48">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Filter status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Staff Table */}
      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead className="bg-slate-50 text-slate-700 border-b border-slate-200">
                <tr>
                  <th className="px-4 py-3 font-semibold">Staff Particulars</th>
                  <th className="px-4 py-3 font-semibold">Staff ID</th>
                  <th className="px-4 py-3 font-semibold">Designation</th>
                  <th className="px-4 py-3 font-semibold">Department / Unit</th>
                  <th className="px-4 py-3 font-semibold">Salary Grade</th>
                  <th className="px-4 py-3 font-semibold">Role</th>
                  <th className="px-4 py-3 font-semibold">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {isLoading ? (
                  <tr>
                    <td colSpan={7} className="text-center py-8 text-slate-400">
                      <Loader2 className="w-5 h-5 mx-auto animate-spin mb-1 text-indigo-600" />
                      Loading staff records...
                    </td>
                  </tr>
                ) : staffList.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="text-center py-8 text-slate-400">
                      No staff records found.
                    </td>
                  </tr>
                ) : (
                  staffList.map((staff) => (
                    <tr key={staff.id} className="hover:bg-slate-50/70 transition-colors">
                      <td className="px-4 py-3">
                        <div className="font-semibold text-slate-900">{staff.fullName}</div>
                        <div className="text-slate-500 font-mono text-[11px]">{staff.email}</div>
                      </td>
                      <td className="px-4 py-3 font-mono font-medium text-slate-800">{staff.staffId}</td>
                      <td className="px-4 py-3 text-slate-700">{staff.designation}</td>
                      <td className="px-4 py-3 text-slate-600">{getUnitName(staff.orgUnitId)}</td>
                      <td className="px-4 py-3 text-slate-600">
                        {staff.salaryGrade} (St. {staff.salaryStep})
                      </td>
                      <td className="px-4 py-3">
                        <Badge variant="outline" className="capitalize text-[10px]">
                          {staff.role}
                        </Badge>
                      </td>
                      <td className="px-4 py-3">
                        <Badge
                          variant={staff.status === 'active' ? 'default' : 'secondary'}
                          className={`text-[10px] ${
                            staff.status === 'active' ? 'bg-emerald-100 text-emerald-800 border-emerald-200' : ''
                          }`}
                        >
                          {staff.status}
                        </Badge>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination Footer */}
          <div className="flex items-center justify-between px-4 py-3 border-t border-slate-200 text-xs text-slate-500">
            <div>
              Showing page <strong>{currentPage}</strong> of <strong>{totalPages}</strong> ({totalStaff} records)
            </div>
            <div className="flex items-center gap-1">
              <Button
                variant="outline"
                size="sm"
                onClick={() => fetchStaff(currentPage - 1)}
                disabled={currentPage <= 1 || isLoading}
                className="h-8 px-2 text-xs"
              >
                <ChevronLeft className="w-4 h-4 mr-1" /> Prev
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => fetchStaff(currentPage + 1)}
                disabled={currentPage >= totalPages || isLoading}
                className="h-8 px-2 text-xs"
              >
                Next <ChevronRight className="w-4 h-4 ml-1" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
