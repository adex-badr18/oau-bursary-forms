'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useAuth } from '@/context/AuthContext';
import { formTypeLabels } from '@/types';
import type { FormSubmission, SubmissionStatus } from '@/types';
import { Eye, Search, Loader2, ChevronLeft, ChevronRight, Clock, CheckCircle2, XCircle } from 'lucide-react';
import { format } from 'date-fns';
import { submissions as fallbackSubmissions } from '@/lib/data';

const statusColors: Record<string, string> = {
  Submitted: 'bg-blue-100 text-blue-800 border-blue-200',
  'In Review': 'bg-amber-100 text-amber-800 border-amber-200',
  Approved: 'bg-green-100 text-green-800 border-green-200',
  Processed: 'bg-green-100 text-green-800 border-green-200',
  Rejected: 'bg-red-100 text-red-800 border-red-200',
};

export default function MySubmissionsPage() {
  const { session, user } = useAuth();
  const [submissionsList, setSubmissionsList] = useState<FormSubmission[]>([]);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [isLoading, setIsLoading] = useState(true);

  const fetchSubmissions = async (page = 1) => {
    setIsLoading(true);
    try {
      const q = new URLSearchParams({
        page: String(page),
        limit: '10',
      });
      if (searchTerm) q.set('search', searchTerm);
      if (statusFilter !== 'all') q.set('status', statusFilter);

      const res = await fetch(`/api/submissions?${q.toString()}`);
      const json = await res.json();
      if (json.success && json.data) {
        setSubmissionsList(json.data.data);
        setTotal(json.data.total);
        setTotalPages(json.data.totalPages);
        setCurrentPage(json.data.page);
        setIsLoading(false);
        return;
      }
    } catch {
      // Fallback
    }

    // Fallback to static dummy data
    const filtered = fallbackSubmissions.filter((sub) => {
      const matchesSearch =
        sub.referenceNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (sub.applicantName || sub.submittedByName || '').toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = statusFilter === 'all' || sub.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
    setSubmissionsList(filtered);
    setTotal(filtered.length);
    setTotalPages(1);
    setIsLoading(false);
  };

  useEffect(() => {
    fetchSubmissions(1);
  }, [searchTerm, statusFilter]);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight text-slate-900">My Form Submissions</h2>
        <p className="text-sm text-slate-500 mt-1">
          Track the status of your digital forms as they are processed by the University Bursary
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base font-semibold">Submitted Forms History</CardTitle>
          <div className="flex flex-col sm:flex-row gap-4 mt-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                placeholder="Search by reference number or keyword..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 text-xs"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full sm:w-48 text-xs">
                <SelectValue placeholder="All Statuses" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="Submitted">Submitted</SelectItem>
                <SelectItem value="In Review">In Review</SelectItem>
                <SelectItem value="Approved">Approved</SelectItem>
                <SelectItem value="Rejected">Rejected</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader className="bg-slate-50">
                <TableRow>
                  <TableHead className="text-xs font-semibold">Reference</TableHead>
                  <TableHead className="text-xs font-semibold">Form Type</TableHead>
                  <TableHead className="text-xs font-semibold">Fund-Centre</TableHead>
                  <TableHead className="text-xs font-semibold">Date Submitted</TableHead>
                  <TableHead className="text-xs font-semibold">Status</TableHead>
                  <TableHead className="text-xs font-semibold text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-10 text-slate-400 text-xs">
                      <Loader2 className="w-5 h-5 mx-auto animate-spin mb-1 text-blue-600" />
                      Loading submissions...
                    </TableCell>
                  </TableRow>
                ) : submissionsList.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-10 text-slate-500 text-xs">
                      No submissions found.
                    </TableCell>
                  </TableRow>
                ) : (
                  submissionsList.map((sub) => {
                    const fundCentre = sub.formattedFundCentreCode || (sub.fundCode && sub.centreCode ? `${sub.fundCode}-${sub.centreCode}` : '01-694');
                    return (
                      <TableRow key={sub.id} className="text-xs hover:bg-slate-50/70">
                        <TableCell className="font-mono font-bold text-blue-700">
                          {sub.referenceNumber}
                        </TableCell>
                        <TableCell className="font-medium text-slate-900">
                          {formTypeLabels[sub.formType] || sub.formType}
                        </TableCell>
                        <TableCell className="font-mono text-indigo-700 font-semibold">
                          {fundCentre}
                        </TableCell>
                        <TableCell className="text-slate-500 whitespace-nowrap">
                          {new Date(sub.submittedDate).toLocaleDateString()}
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline" className={`text-[10px] ${statusColors[sub.status] || ''}`}>
                            {sub.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <Link href={`/department/submission/${sub.id}`}>
                            <Button size="sm" variant="ghost" className="h-7 text-xs text-blue-700 hover:text-blue-900">
                              <Eye className="w-3.5 h-3.5 mr-1" /> View
                            </Button>
                          </Link>
                        </TableCell>
                      </TableRow>
                    );
                  })
                )}
              </TableBody>
            </Table>
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
