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
import { FileSpreadsheet, Plus, Upload, Download, Search, Loader2, CheckCircle2, ChevronLeft, ChevronRight } from 'lucide-react';
import type { ExpenseCode } from '@/types';

export default function AdminExpenseCodesPage() {
  const [codes, setCodes] = useState<ExpenseCode[]>([]);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [isLoading, setIsLoading] = useState(true);

  // Single Modal
  const [isSingleOpen, setIsSingleOpen] = useState(false);
  const [singleLoading, setSingleLoading] = useState(false);
  const [singleError, setSingleError] = useState('');
  const [formCode, setFormCode] = useState({
    code: '',
    description: '',
    category: 'Travel & Logistics',
  });

  // Bulk Modal
  const [isBulkOpen, setIsBulkOpen] = useState(false);
  const [bulkRows, setBulkRows] = useState<any[]>([]);
  const [bulkLoading, setBulkLoading] = useState(false);
  const [bulkResult, setBulkResult] = useState<{ inserted: number; skipped: number } | null>(null);

  const fetchCodes = async (page = 1) => {
    setIsLoading(true);
    try {
      const q = new URLSearchParams({
        page: String(page),
        limit: '15',
      });
      if (searchTerm) q.set('search', searchTerm);
      if (categoryFilter !== 'all') q.set('category', categoryFilter);

      const res = await fetch(`/api/expense-codes?${q.toString()}`);
      const json = await res.json();
      if (json.success && json.data) {
        setCodes(json.data.data);
        setTotal(json.data.total);
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
    fetchCodes(1);
  }, [searchTerm, categoryFilter]);

  const handleCreateSingle = async (e: React.FormEvent) => {
    e.preventDefault();
    setSingleError('');
    setSingleLoading(true);

    try {
      const res = await fetch('/api/expense-codes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formCode,
          code: formCode.code.trim(),
          description: formCode.description.trim(),
        }),
      });
      const json = await res.json();
      if (res.ok && json.success) {
        setIsSingleOpen(false);
        setFormCode({ code: '', description: '', category: 'Travel & Logistics' });
        fetchCodes(1);
      } else {
        setSingleError(json.error || 'Failed to create expense code');
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
          code: String(r['Code'] || r['code'] || '').trim(),
          description: String(r['Description'] || r['description'] || '').trim(),
          category: String(r['Category'] || r['category'] || 'Administrative').trim(),
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
      const res = await fetch('/api/expense-codes/bulk-upload', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ records: bulkRows }),
      });
      const json = await res.json();
      if (json.success) {
        setBulkResult(json.data);
        fetchCodes(1);
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
      { Code: '210401', Description: 'Staff Commuter Allowance', Category: 'Travel & Logistics' },
      { Code: '220601', Description: 'Software Licenses & Subscriptions', Category: 'Supplies & Consumables' },
      { Code: '230601', Description: 'Servicing of Sub-stations & Transformers', Category: 'Repairs & Maintenance' },
    ];
    const ws = XLSX.utils.json_to_sheet(sample);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'ExpenseCodes');
    XLSX.writeFile(wb, 'OAU_Expense_Codes_Template.xlsx');
  };

  const categories = [
    'Travel & Logistics',
    'Supplies & Consumables',
    'Repairs & Maintenance',
    'Research & Academic',
    'Capital Equipment',
    'Capital Project',
    'Utilities',
    'Human Resources',
    'Administrative',
    'Events & Ceremonies',
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Standard Expense Codes Catalog</h1>
          <p className="text-sm text-slate-500">
            Accounting vote codes ({total.toLocaleString()} classifications) required across form line items
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={downloadTemplate} className="text-xs">
            <Download className="w-4 h-4 mr-1.5" /> Template
          </Button>

          {/* Bulk Modal */}
          <Dialog open={isBulkOpen} onOpenChange={setIsBulkOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm" className="border-blue-300 text-blue-700 hover:bg-blue-50 text-xs">
                <Upload className="w-4 h-4 mr-1.5" /> Bulk Excel Import
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-xl">
              <DialogHeader>
                <DialogTitle>Bulk Upload Expense Codes</DialogTitle>
                <DialogDescription>
                  Upload an Excel sheet with Code, Description, and Category columns.
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-4 py-3">
                <input
                  type="file"
                  accept=".xlsx,.xls,.csv"
                  onChange={handleBulkFile}
                  className="block w-full text-xs text-slate-500 file:mr-2 file:py-1.5 file:px-3 file:rounded file:border-0 file:text-xs file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 cursor-pointer"
                />

                {bulkRows.length > 0 && (
                  <p className="text-xs text-slate-600">
                    Found <strong>{bulkRows.length}</strong> codes ready for insertion.
                  </p>
                )}

                {bulkResult && (
                  <Alert className="bg-blue-50 border-blue-200">
                    <CheckCircle2 className="h-4 w-4 text-blue-600" />
                    <AlertDescription className="text-xs text-blue-800">
                      Successfully imported {bulkResult.inserted} codes ({bulkResult.skipped} duplicates skipped).
                    </AlertDescription>
                  </Alert>
                )}
              </div>

              <DialogFooter>
                <Button variant="outline" onClick={() => setIsBulkOpen(false)}>Close</Button>
                {bulkRows.length > 0 && !bulkResult && (
                  <Button onClick={handleCommitBulk} disabled={bulkLoading} className="bg-blue-600 hover:bg-blue-700">
                    {bulkLoading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : `Import ${bulkRows.length} Codes`}
                  </Button>
                )}
              </DialogFooter>
            </DialogContent>
          </Dialog>

          {/* Single Modal */}
          <Dialog open={isSingleOpen} onOpenChange={setIsSingleOpen}>
            <DialogTrigger asChild>
              <Button size="sm" className="bg-blue-600 hover:bg-blue-700 text-xs">
                <Plus className="w-4 h-4 mr-1.5" /> New Expense Code
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add Expense Code</DialogTitle>
                <DialogDescription>
                  Register a standardized accounting line code for digital expenditure forms.
                </DialogDescription>
              </DialogHeader>

              {singleError && (
                <Alert variant="destructive">
                  <AlertDescription>{singleError}</AlertDescription>
                </Alert>
              )}

              <form onSubmit={handleCreateSingle} className="space-y-3 py-2">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label htmlFor="code" className="text-xs">Expense Code (e.g. 210101) *</Label>
                    <Input id="code" placeholder="210101" value={formCode.code} onChange={(e) => setFormCode({ ...formCode, code: e.target.value })} required />
                  </div>
                  <div>
                    <Label htmlFor="category" className="text-xs">Category *</Label>
                    <Select value={formCode.category} onValueChange={(v) => setFormCode({ ...formCode, category: v })}>
                      <SelectTrigger id="category"><SelectValue /></SelectTrigger>
                      <SelectContent>
                        {categories.map((c) => (
                          <SelectItem key={c} value={c}>{c}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div>
                  <Label htmlFor="desc" className="text-xs">Formal Accounting Description *</Label>
                  <Input id="desc" placeholder="Local Transport & Travels - Others" value={formCode.description} onChange={(e) => setFormCode({ ...formCode, description: e.target.value })} required />
                </div>

                <DialogFooter className="pt-3">
                  <Button variant="outline" type="button" onClick={() => setIsSingleOpen(false)}>Cancel</Button>
                  <Button type="submit" disabled={singleLoading} className="bg-blue-600 hover:bg-blue-700">
                    {singleLoading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : 'Save Code'}
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Filter Bar */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
              <Input
                placeholder="Search by code (e.g. 210101) or description..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9"
              />
            </div>
            <div className="w-full sm:w-56">
              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="All Categories" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  {categories.map((c) => (
                    <SelectItem key={c} value={c}>{c}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Codes Table */}
      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead className="bg-slate-50 text-slate-700 border-b border-slate-200">
                <tr>
                  <th className="px-4 py-3 font-semibold">Code</th>
                  <th className="px-4 py-3 font-semibold">Accounting Description</th>
                  <th className="px-4 py-3 font-semibold">Classification Category</th>
                  <th className="px-4 py-3 font-semibold">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {isLoading ? (
                  <tr>
                    <td colSpan={4} className="text-center py-8 text-slate-400">
                      <Loader2 className="w-5 h-5 mx-auto animate-spin mb-1 text-blue-600" />
                      Loading expense codes...
                    </td>
                  </tr>
                ) : codes.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="text-center py-8 text-slate-400">
                      No expense codes found.
                    </td>
                  </tr>
                ) : (
                  codes.map((item) => (
                    <tr key={item.id} className="hover:bg-slate-50/70 transition-colors">
                      <td className="px-4 py-3 font-mono font-bold text-blue-700">{item.code}</td>
                      <td className="px-4 py-3 font-medium text-slate-900">{item.description}</td>
                      <td className="px-4 py-3">
                        <span className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 text-[11px]">
                          {item.category}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <Badge variant="outline" className="text-[10px] bg-emerald-50 text-emerald-700 border-emerald-200">
                          {item.status}
                        </Badge>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="flex items-center justify-between px-4 py-3 border-t border-slate-200 text-xs text-slate-500">
            <div>
              Showing page <strong>{currentPage}</strong> of <strong>{totalPages}</strong> ({total} codes)
            </div>
            <div className="flex items-center gap-1">
              <Button
                variant="outline"
                size="sm"
                onClick={() => fetchCodes(currentPage - 1)}
                disabled={currentPage <= 1 || isLoading}
                className="h-8 px-2 text-xs"
              >
                <ChevronLeft className="w-4 h-4 mr-1" /> Prev
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => fetchCodes(currentPage + 1)}
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
