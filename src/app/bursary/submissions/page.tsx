'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  FileText,
  Search,
  ChevronLeft,
  ChevronRight,
  Eye,
  Loader2,
  Calendar,
  Building2,
  Tag,
  CheckCircle2,
  Clock,
  XCircle,
  FileCheck,
} from 'lucide-react';
import type { FormSubmission, FormType, SubmissionStatus } from '@/types';
import { formTypeLabels } from '@/types';

const statusBadges: Record<string, { label: string; class: string; icon: any }> = {
  Submitted: { label: 'Submitted (Awaiting Hard Copy)', class: 'bg-blue-100 text-blue-800 border-blue-200', icon: Clock },
  'In Review': { label: 'In Review (Hard Copy Verified)', class: 'bg-amber-100 text-amber-800 border-amber-200', icon: Clock },
  Approved: { label: 'Approved', class: 'bg-green-100 text-green-800 border-green-200', icon: CheckCircle2 },
  Processed: { label: 'Approved / Processed', class: 'bg-green-100 text-green-800 border-green-200', icon: CheckCircle2 },
  Rejected: { label: 'Rejected', class: 'bg-red-100 text-red-800 border-red-200', icon: XCircle },
};

export default function BursaryAllSubmissionsPage() {
  const [submissions, setSubmissions] = useState<FormSubmission[]>([]);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusTab, setStatusTab] = useState<string>('all');
  const [formTypeFilter, setFormTypeFilter] = useState<string>('all');
  const [isLoading, setIsLoading] = useState(true);

  const fetchSubmissions = async (page = 1) => {
    setIsLoading(true);
    try {
      const q = new URLSearchParams({
        page: String(page),
        limit: '10',
      });
      if (searchTerm) q.set('search', searchTerm);
      if (statusTab !== 'all') q.set('status', statusTab);
      if (formTypeFilter !== 'all') q.set('formType', formTypeFilter);

      const res = await fetch(`/api/submissions?${q.toString()}`);
      const json = await res.json();
      if (json.success && json.data) {
        setSubmissions(json.data.data);
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
    fetchSubmissions(1);
  }, [searchTerm, statusTab, formTypeFilter]);

  const getAmount = (sub: FormSubmission): string => {
    const fd = sub.formData;
    if (!fd) return '—';
    const amount = fd.totalAmount || fd.amount || fd.totalClaim || fd.imprestAmount;
    if (amount) return `₦${Number(amount).toLocaleString()}`;
    return '—';
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">University Bursary Submissions</h1>
          <p className="text-sm text-slate-500">
            Unified processing queue for cross-checking physical submissions and registering verification decisions ({total.toLocaleString()} total records)
          </p>
        </div>
      </div>

      {/* Status Filter Tabs */}
      <Tabs value={statusTab} onValueChange={setStatusTab} className="w-full">
        <TabsList className="grid grid-cols-2 sm:grid-cols-5 w-full bg-slate-100 p-1">
          <TabsTrigger value="all" className="text-xs">All Submissions</TabsTrigger>
          <TabsTrigger value="Submitted" className="text-xs">1. Submitted</TabsTrigger>
          <TabsTrigger value="In Review" className="text-xs">2. In Review</TabsTrigger>
          <TabsTrigger value="Approved" className="text-xs">3. Approved</TabsTrigger>
          <TabsTrigger value="Rejected" className="text-xs">4. Rejected</TabsTrigger>
        </TabsList>
      </Tabs>

      {/* Search and Form Type Filter */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
              <Input
                placeholder="Search by reference number (e.g. CA-2026-0001), staff name or department..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9"
              />
            </div>
            <div className="w-full sm:w-64">
              <Select value={formTypeFilter} onValueChange={setFormTypeFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="All Form Types" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Form Types</SelectItem>
                  {Object.entries(formTypeLabels).map(([key, label]) => (
                    <SelectItem key={key} value={key}>{label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Submissions Table */}
      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead className="bg-slate-50 text-slate-700 border-b border-slate-200">
                <tr>
                  <th className="px-4 py-3 font-semibold">Reference</th>
                  <th className="px-4 py-3 font-semibold">Submitting Staff</th>
                  <th className="px-4 py-3 font-semibold">Department & Centre Code</th>
                  <th className="px-4 py-3 font-semibold">Form Type</th>
                  <th className="px-4 py-3 font-semibold">Fund-Centre</th>
                  <th className="px-4 py-3 font-semibold">Amount</th>
                  <th className="px-4 py-3 font-semibold">Date Submitted</th>
                  <th className="px-4 py-3 font-semibold">Status</th>
                  <th className="px-4 py-3 font-semibold text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {isLoading ? (
                  <tr>
                    <td colSpan={9} className="text-center py-10 text-slate-400">
                      <Loader2 className="w-5 h-5 mx-auto animate-spin mb-1 text-blue-600" />
                      Loading submissions...
                    </td>
                  </tr>
                ) : submissions.length === 0 ? (
                  <tr>
                    <td colSpan={9} className="text-center py-10 text-slate-400">
                      No submissions found matching criteria.
                    </td>
                  </tr>
                ) : (
                  submissions.map((sub) => {
                    const badge = statusBadges[sub.status] || {
                      label: sub.status,
                      class: 'bg-slate-100 text-slate-800',
                      icon: Clock,
                    };
                    const Icon = badge.icon;
                    const staffName = sub.submittedByName || sub.applicantName || 'Delegated Staff';

                    return (
                      <tr key={sub.id} className="hover:bg-slate-50/70 transition-colors">
                        <td className="px-4 py-3 font-mono font-bold text-blue-700">
                          {sub.referenceNumber}
                        </td>
                        <td className="px-4 py-3">
                          <div className="font-semibold text-slate-900">{staffName}</div>
                          <div className="text-slate-500 font-mono text-[11px]">{sub.submittedByEmail || sub.formData?.email || '—'}</div>
                        </td>
                        <td className="px-4 py-3">
                          <div className="font-medium text-slate-800">{sub.department}</div>
                          <div className="text-slate-400 font-mono text-[10px]">Centre: {sub.centreCode || '—'}</div>
                        </td>
                        <td className="px-4 py-3 text-slate-700">
                          {formTypeLabels[sub.formType] || sub.formType}
                        </td>
                        <td className="px-4 py-3 font-mono font-semibold text-indigo-700">
                          {sub.formattedFundCentreCode || (sub.fundCode && sub.centreCode ? `${sub.fundCode}-${sub.centreCode}` : '01-694')}
                        </td>
                        <td className="px-4 py-3 font-semibold text-slate-900">
                          {getAmount(sub)}
                        </td>
                        <td className="px-4 py-3 text-slate-500 whitespace-nowrap">
                          {new Date(sub.submittedDate).toLocaleDateString()}
                        </td>
                        <td className="px-4 py-3">
                          <Badge variant="outline" className={`text-[10px] flex items-center gap-1 w-fit ${badge.class}`}>
                            <Icon className="w-3 h-3" />
                            {sub.status}
                          </Badge>
                        </td>
                        <td className="px-4 py-3 text-right">
                          <Link href={`/bursary/submission/${sub.id}`}>
                            <Button size="sm" variant="outline" className="h-7 text-xs border-blue-200 text-blue-700 hover:bg-blue-50">
                              <Eye className="w-3.5 h-3.5 mr-1" /> Review
                            </Button>
                          </Link>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="flex items-center justify-between px-4 py-3 border-t border-slate-200 text-xs text-slate-500">
            <div>
              Showing page <strong>{currentPage}</strong> of <strong>{totalPages}</strong> ({total} submissions)
            </div>
            <div className="flex items-center gap-1">
              <Button
                variant="outline"
                size="sm"
                onClick={() => fetchSubmissions(currentPage - 1)}
                disabled={currentPage <= 1 || isLoading}
                className="h-8 px-2 text-xs"
              >
                <ChevronLeft className="w-4 h-4 mr-1" /> Prev
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => fetchSubmissions(currentPage + 1)}
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
