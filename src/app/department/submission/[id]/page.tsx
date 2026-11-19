'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { formTypeLabels } from '@/types';
import type { FormSubmission } from '@/types';
import { ArrowLeft, Calendar, User, Building2, FileText, Printer, CheckCircle2, XCircle, Clock, Loader2 } from 'lucide-react';
import { format } from 'date-fns';
import { submissions as fallbackSubmissions } from '@/lib/data';

const statusColors: Record<string, string> = {
  Submitted: 'bg-blue-100 text-blue-800 border-blue-200',
  'In Review': 'bg-amber-100 text-amber-800 border-amber-200',
  Approved: 'bg-green-100 text-green-800 border-green-200',
  Processed: 'bg-green-100 text-green-800 border-green-200',
  Rejected: 'bg-red-100 text-red-800 border-red-200',
};

export default function DepartmentSubmissionDetailPage() {
  const params = useParams();
  const id = params?.id as string;
  const [submission, setSubmission] = useState<FormSubmission | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch(`/api/submissions/${id}`);
        const json = await res.json();
        if (json.success && json.data) {
          setSubmission(json.data);
          return;
        }
      } catch {
        // Fallback
      }
      const fallback = fallbackSubmissions.find((s) => s.id === id);
      if (fallback) setSubmission(fallback);
      setIsLoading(false);
    }
    load();
  }, [id]);

  const handlePrint = () => {
    if (typeof window !== 'undefined') {
      window.print();
    }
  };

  if (isLoading && !submission) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-slate-400">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600 mb-2" />
        <p className="text-sm">Loading submission...</p>
      </div>
    );
  }

  if (!submission) {
    return (
      <div className="max-w-4xl mx-auto py-12">
        <Card>
          <CardContent className="text-center py-12">
            <p className="text-gray-500 mb-4">Submission not found</p>
            <Link href="/department/submissions">
              <Button>Back to My Submissions</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  const snapshot = submission.staffSnapshot;
  const staffName = submission.submittedByName || submission.applicantName || 'Staff';
  const fundCentreCode = submission.formattedFundCentreCode || (submission.fundCode && submission.centreCode ? `${submission.fundCode}-${submission.centreCode}` : '01-694');

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="no-print flex items-center justify-between">
        <Link
          href="/department/submissions"
          className="inline-flex items-center text-sm text-gray-600 hover:text-gray-900"
        >
          <ArrowLeft className="w-4 h-4 mr-1" />
          Back to My Submissions
        </Link>
        <Button onClick={handlePrint} variant="outline" size="sm" className="text-xs">
          <Printer className="w-4 h-4 mr-1.5" /> Print Official Form
        </Button>
      </div>

      <div className="space-y-6">
        {/* Header Card */}
        <Card>
          <CardHeader>
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2">
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs px-2 py-0.5 rounded bg-blue-50 text-blue-700 font-semibold border border-blue-100">
                    {submission.referenceNumber}
                  </span>
                  <span className="font-mono text-xs px-2 py-0.5 rounded bg-indigo-50 text-indigo-700 font-bold border border-indigo-100">
                    {fundCentreCode}
                  </span>
                </div>
                <CardTitle className="text-2xl mt-2">{formTypeLabels[submission.formType] || submission.formType}</CardTitle>
                <p className="text-xs text-gray-500 mt-1">Submitted: {new Date(submission.submittedDate).toLocaleString()}</p>
              </div>
              <Badge className={`text-xs px-3 py-1 ${statusColors[submission.status] || ''}`} variant="secondary">
                {submission.status}
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <User className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-xs text-gray-500">Applicant</p>
                  <p className="font-medium text-sm">{staffName}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                  <Building2 className="w-5 h-5 text-purple-600" />
                </div>
                <div>
                  <p className="text-xs text-gray-500">Department</p>
                  <p className="font-medium text-sm">{submission.department}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                  <Calendar className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <p className="text-xs text-gray-500">Date Submitted</p>
                  <p className="font-medium text-sm">{format(new Date(submission.submittedDate), 'MMM dd, yyyy')}</p>
                </div>
              </div>

              {(submission.voucherNumber || submission.bursaryDecision?.voucherNumber) && (
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center">
                    <FileText className="w-5 h-5 text-emerald-600" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Voucher No.</p>
                    <p className="font-medium text-sm font-mono text-emerald-800">
                      {submission.voucherNumber || submission.bursaryDecision?.voucherNumber}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Official Bursary Decision Box */}
        {submission.bursaryDecision && (
          <Alert className={submission.status === 'Approved' ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}>
            <div className="flex items-start gap-3">
              {submission.status === 'Approved' ? (
                <CheckCircle2 className="h-5 w-5 text-green-700 mt-0.5" />
              ) : (
                <XCircle className="h-5 w-5 text-red-700 mt-0.5" />
              )}
              <div className="space-y-1">
                <AlertTitle className={`font-bold ${submission.status === 'Approved' ? 'text-green-900' : 'text-red-900'}`}>
                  Bursary Decision: {submission.bursaryDecision.decision}
                </AlertTitle>
                <AlertDescription className="text-xs space-y-1 text-slate-800">
                  <p>
                    <strong>Deciding Desk:</strong> {submission.bursaryDecision.officerName} ({submission.bursaryDecision.officerUnit} Unit)
                  </p>
                  <p>
                    <strong>Date:</strong> {new Date(submission.bursaryDecision.decidedAt).toLocaleString()}
                  </p>
                  <p className="mt-2 p-2 rounded bg-white/80 border border-slate-200 italic">
                    &quot;{submission.bursaryDecision.note}&quot;
                  </p>
                </AlertDescription>
              </div>
            </div>
          </Alert>
        )}

        {/* Section A Staff Snapshot */}
        {snapshot && (
          <Card>
            <CardHeader className="pb-3 border-b">
              <CardTitle className="text-base">Section A: Submitting Staff Information</CardTitle>
            </CardHeader>
            <CardContent className="pt-4">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs">
                <div>
                  <span className="text-gray-500 block">Staff ID</span>
                  <span className="font-mono font-semibold">{snapshot.staffId}</span>
                </div>
                <div>
                  <span className="text-gray-500 block">NIN</span>
                  <span className="font-mono">{snapshot.nin}</span>
                </div>
                <div>
                  <span className="text-gray-500 block">Designation</span>
                  <span className="font-medium">{snapshot.designation}</span>
                </div>
                <div>
                  <span className="text-gray-500 block">Salary Grade</span>
                  <span>{snapshot.salaryGrade} (St. {snapshot.salaryStep})</span>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Form Details */}
        <Card>
          <CardHeader>
            <CardTitle>Section B: Request Details & Accounting Breakdown</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {Object.entries(submission.formData || {}).map(([key, value]) => {
                if (key === 'items' || key === 'expenditures') return null;
                return (
                  <div key={key} className="space-y-1 border-b border-gray-100 pb-2">
                    <p className="text-xs text-gray-500 uppercase tracking-wide">
                      {key.replace(/([A-Z])/g, ' $1').trim()}
                    </p>
                    <p className="text-sm font-medium">
                      {typeof value === 'boolean'
                        ? value
                          ? 'Yes'
                          : 'No'
                        : Array.isArray(value)
                        ? value.join(', ')
                        : value?.toString() || 'N/A'}
                    </p>
                  </div>
                );
              })}
            </div>

            {/* Imprest expenditures if any */}
            {submission.formData?.expenditures && Array.isArray(submission.formData.expenditures) && (
              <div className="mt-6 border-t pt-6">
                <h4 className="font-semibold mb-4 text-sm">Expenditure Breakdown</h4>
                <div className="space-y-2">
                  {submission.formData.expenditures.map((exp: any, index: number) => (
                    <div key={index} className="flex justify-between items-center p-3 bg-gray-50 rounded text-xs">
                      <div>
                        <p className="font-medium">{exp.description}</p>
                        <p className="text-gray-500">
                          {exp.date} • Receipt: {exp.receiptNumber}
                        </p>
                      </div>
                      <p className="font-semibold">₦{Number(exp.amount).toLocaleString()}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Section C: Formal Physical Endorsements & Stamps (Print View) */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Section C: Formal Physical Endorsement Blocks</CardTitle>
            <CardDescription className="text-xs">
              Printed on the hard copy submitted to the Bursary processing counter
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div className="p-4 border border-dashed border-slate-300 rounded min-h-[100px] flex flex-col justify-between">
                <span className="text-[11px] font-semibold text-slate-500 uppercase">1. Applicant Signature & Date</span>
                <div className="border-t border-slate-300 pt-1 text-slate-600">
                  Signature: ______________________ Date: _________
                </div>
              </div>
              <div className="p-4 border border-dashed border-slate-300 rounded min-h-[100px] flex flex-col justify-between">
                <span className="text-[11px] font-semibold text-slate-500 uppercase">2. Head of Department Stamp</span>
                <div className="border-t border-slate-300 pt-1 text-slate-600">
                  Signature & Stamp: ______________________ Date: _________
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
