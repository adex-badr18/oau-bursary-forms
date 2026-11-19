'use client';

import { useState, useEffect } from 'react';
import * as XLSX from 'xlsx';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Building2, Plus, Upload, Download, Search, Loader2, CheckCircle2 } from 'lucide-react';
import type { OrgUnit, UnitType } from '@/types';

export default function AdminOrgUnitsPage() {
  const [units, setUnits] = useState<OrgUnit[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [isLoading, setIsLoading] = useState(true);

  // Single Modal
  const [isSingleOpen, setIsSingleOpen] = useState(false);
  const [singleLoading, setSingleLoading] = useState(false);
  const [singleError, setSingleError] = useState('');
  const [formUnit, setFormUnit] = useState({
    name: '',
    code: '',
    type: 'department' as UnitType,
    parentUnitId: '',
    centreCode: '',
  });

  // Bulk Modal
  const [isBulkOpen, setIsBulkOpen] = useState(false);
  const [bulkRows, setBulkRows] = useState<any[]>([]);
  const [bulkLoading, setBulkLoading] = useState(false);
  const [bulkResult, setBulkResult] = useState<{ inserted: number; skipped: number } | null>(null);

  const loadUnits = async () => {
    setIsLoading(true);
    try {
      const q = new URLSearchParams();
      if (searchTerm) q.set('search', searchTerm);
      if (typeFilter !== 'all') q.set('type', typeFilter);

      const res = await fetch(`/api/org-units?${q.toString()}`);
      const json = await res.json();
      if (json.success && Array.isArray(json.data)) {
        setUnits(json.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadUnits();
  }, [searchTerm, typeFilter]);

  const handleCreateSingle = async (e: React.FormEvent) => {
    e.preventDefault();
    setSingleError('');
    setSingleLoading(true);

    try {
      const res = await fetch('/api/org-units', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formUnit,
          code: formUnit.code.toUpperCase().trim(),
          centreCode: formUnit.centreCode.trim(),
          parentUnitId: formUnit.parentUnitId || undefined,
        }),
      });
      const json = await res.json();
      if (res.ok && json.success) {
        setIsSingleOpen(false);
        setFormUnit({
          name: '',
          code: '',
          type: 'department',
          parentUnitId: '',
          centreCode: '',
        });
        loadUnits();
      } else {
        setSingleError(json.error || 'Failed to create organizational unit');
      }
    } catch {
      setSingleError('Network error');
    } finally {
      setSingleLoading(false);
    }
  };

  const handleBulkFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (evt) => {
      try {
        const bstr = evt.target?.result;
        const wb = XLSX.read(bstr, { type: 'binary' });
        const wsname = wb.SheetNames[0];
        const data = XLSX.utils.sheet_to_json(wb.Sheets[wsname]) as any[];

        const mapped = data.map((r) => ({
          name: r['Name'] || r['name'] || '',
          code: String(r['Code'] || r['code'] || '').toUpperCase().trim(),
          type: (r['Type'] || r['type'] || 'department').toLowerCase() as UnitType,
          centreCode: String(r['CentreCode'] || r['centreCode'] || r['Centre Code'] || '').trim(),
          status: 'active' as const,
        }));
        setBulkRows(mapped);
      } catch {
        alert('Invalid Excel file format');
      }
    };
    reader.readAsBinaryString(file);
  };

  const handleCommitBulk = async () => {
    if (bulkRows.length === 0) return;
    setBulkLoading(true);
    try {
      const res = await fetch('/api/org-units/bulk-upload', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ records: bulkRows }),
      });
      const json = await res.json();
      if (json.success) {
        setBulkResult(json.data);
        loadUnits();
      } else {
        alert(json.error || 'Bulk upload failed');
      }
    } catch {
      alert('Network error during bulk upload');
    } finally {
      setBulkLoading(false);
    }
  };

  const downloadTemplate = () => {
    const sample = [
      { Name: 'Department of Biochemistry', Code: 'BCH', Type: 'department', CentreCode: '225' },
      { Name: 'Faculty of Pharmacy', Code: 'PHARM', Type: 'faculty', CentreCode: '600' },
      { Name: 'Health Centre Directorate', Code: 'HEALTH', Type: 'directorate', CentreCode: '170' },
    ];
    const ws = XLSX.utils.json_to_sheet(sample);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'OrgUnits');
    XLSX.writeFile(wb, 'OAU_Org_Units_Template.xlsx');
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Organizational Units & Centre Codes</h1>
          <p className="text-sm text-slate-500">
            Faculties, Departments, Directorates and their intrinsic 3-digit institutional Centre Codes (e.g. <strong>694</strong> for CSC)
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={downloadTemplate} className="text-xs">
            <Download className="w-4 h-4 mr-1.5" /> Template
          </Button>

          {/* Bulk Upload Modal */}
          <Dialog open={isBulkOpen} onOpenChange={setIsBulkOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm" className="border-emerald-300 text-emerald-700 hover:bg-emerald-50 text-xs">
                <Upload className="w-4 h-4 mr-1.5" /> Bulk Excel Upload
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-xl">
              <DialogHeader>
                <DialogTitle>Bulk Upload Organizational Units</DialogTitle>
                <DialogDescription>
                  Upload an Excel file with Name, Code, Type, and CentreCode columns.
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-4 py-3">
                <input
                  type="file"
                  accept=".xlsx,.xls,.csv"
                  onChange={handleBulkFile}
                  className="block w-full text-xs text-slate-500 file:mr-2 file:py-1.5 file:px-3 file:rounded file:border-0 file:text-xs file:font-semibold file:bg-emerald-50 file:text-emerald-700 hover:file:bg-emerald-100 cursor-pointer"
                />

                {bulkRows.length > 0 && (
                  <p className="text-xs text-slate-600">
                    Found <strong>{bulkRows.length}</strong> valid unit rows ready for import.
                  </p>
                )}

                {bulkResult && (
                  <Alert className="bg-emerald-50 border-emerald-200">
                    <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                    <AlertDescription className="text-xs text-emerald-800">
                      Successfully imported {bulkResult.inserted} units ({bulkResult.skipped} duplicates skipped).
                    </AlertDescription>
                  </Alert>
                )}
              </div>

              <DialogFooter>
                <Button variant="outline" onClick={() => setIsBulkOpen(false)}>Close</Button>
                {bulkRows.length > 0 && !bulkResult && (
                  <Button onClick={handleCommitBulk} disabled={bulkLoading} className="bg-emerald-600 hover:bg-emerald-700">
                    {bulkLoading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : `Import ${bulkRows.length} Units`}
                  </Button>
                )}
              </DialogFooter>
            </DialogContent>
          </Dialog>

          {/* Single Create Modal */}
          <Dialog open={isSingleOpen} onOpenChange={setIsSingleOpen}>
            <DialogTrigger asChild>
              <Button size="sm" className="bg-emerald-600 hover:bg-emerald-700 text-xs">
                <Plus className="w-4 h-4 mr-1.5" /> New Org Unit
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add Organizational Unit</DialogTitle>
                <DialogDescription>
                  Create a department, faculty or directorate with its university Centre Code.
                </DialogDescription>
              </DialogHeader>

              {singleError && (
                <Alert variant="destructive">
                  <AlertDescription>{singleError}</AlertDescription>
                </Alert>
              )}

              <form onSubmit={handleCreateSingle} className="space-y-3 py-2">
                <div>
                  <Label htmlFor="name" className="text-xs">Full Unit Name *</Label>
                  <Input id="name" placeholder="Department of Computer Science & Engineering" value={formUnit.name} onChange={(e) => setFormUnit({ ...formUnit, name: e.target.value })} required />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label htmlFor="code" className="text-xs">Short Code *</Label>
                    <Input id="code" placeholder="CSC" value={formUnit.code} onChange={(e) => setFormUnit({ ...formUnit, code: e.target.value })} required />
                  </div>
                  <div>
                    <Label htmlFor="centreCode" className="text-xs">Centre Code (e.g. 694) *</Label>
                    <Input id="centreCode" placeholder="694" value={formUnit.centreCode} onChange={(e) => setFormUnit({ ...formUnit, centreCode: e.target.value })} required />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label htmlFor="type" className="text-xs">Unit Type *</Label>
                    <Select value={formUnit.type} onValueChange={(v) => setFormUnit({ ...formUnit, type: v as UnitType })}>
                      <SelectTrigger id="type"><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="faculty">Faculty</SelectItem>
                        <SelectItem value="department">Department</SelectItem>
                        <SelectItem value="directorate">Directorate</SelectItem>
                        <SelectItem value="division">Division</SelectItem>
                        <SelectItem value="unit">Unit</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="parent" className="text-xs">Parent Unit (Optional)</Label>
                    <Select value={formUnit.parentUnitId} onValueChange={(v) => setFormUnit({ ...formUnit, parentUnitId: v })}>
                      <SelectTrigger id="parent"><SelectValue placeholder="None" /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="none">None (Top-Level)</SelectItem>
                        {units.filter((u) => u.type === 'faculty' || u.type === 'directorate').map((u) => (
                          <SelectItem key={u.id} value={u.id}>{u.name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <DialogFooter className="pt-3">
                  <Button variant="outline" type="button" onClick={() => setIsSingleOpen(false)}>Cancel</Button>
                  <Button type="submit" disabled={singleLoading} className="bg-emerald-600 hover:bg-emerald-700">
                    {singleLoading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : 'Save Unit'}
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
              <Input
                placeholder="Search unit by name or code..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9"
              />
            </div>
            <div className="w-full sm:w-48">
              <Select value={typeFilter} onValueChange={setTypeFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Filter type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="faculty">Faculties</SelectItem>
                  <SelectItem value="department">Departments</SelectItem>
                  <SelectItem value="directorate">Directorates</SelectItem>
                  <SelectItem value="division">Divisions</SelectItem>
                  <SelectItem value="unit">Units</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Units Table */}
      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead className="bg-slate-50 text-slate-700 border-b border-slate-200">
                <tr>
                  <th className="px-4 py-3 font-semibold">Unit Name</th>
                  <th className="px-4 py-3 font-semibold">Short Code</th>
                  <th className="px-4 py-3 font-semibold">Unit Type</th>
                  <th className="px-4 py-3 font-semibold">Centre Code</th>
                  <th className="px-4 py-3 font-semibold">Fund-Centre Example</th>
                  <th className="px-4 py-3 font-semibold">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {isLoading ? (
                  <tr>
                    <td colSpan={6} className="text-center py-8 text-slate-400">
                      <Loader2 className="w-5 h-5 mx-auto animate-spin mb-1 text-emerald-600" />
                      Loading organizational units...
                    </td>
                  </tr>
                ) : units.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="text-center py-8 text-slate-400">
                      No organizational units found.
                    </td>
                  </tr>
                ) : (
                  units.map((unit) => (
                    <tr key={unit.id} className="hover:bg-slate-50/70 transition-colors">
                      <td className="px-4 py-3 font-medium text-slate-900">{unit.name}</td>
                      <td className="px-4 py-3 font-mono font-semibold text-slate-700">{unit.code}</td>
                      <td className="px-4 py-3 capitalize text-slate-600">{unit.type}</td>
                      <td className="px-4 py-3 font-mono font-bold text-emerald-700">{unit.centreCode}</td>
                      <td className="px-4 py-3 font-mono text-[11px] text-slate-500">01-{unit.centreCode}</td>
                      <td className="px-4 py-3">
                        <Badge variant="outline" className="text-[10px] bg-emerald-50 text-emerald-700 border-emerald-200">
                          {unit.status}
                        </Badge>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
