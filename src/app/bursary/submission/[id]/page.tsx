'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '@/components/ui/dialog';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import {
  ArrowLeft,
  Calendar,
  User,
  Building2,
  FileText,
  Printer,
  CheckCircle2,
  XCircle,
  Clock,
  ShieldCheck,
  AlertTriangle,
  Loader2,
  CreditCard,
  Hash,
} from 'lucide-react';
import { format } from 'date-fns';
import { useAuth } from '@/context/AuthContext';
import { toast } from 'sonner';
import type { FormSubmission, SubmissionStatus } from '@/types';
import { formTypeLabels } from '@/types';
import { submissions as fallbackSubmissions } from '@/lib/data';

const statusColors: Record<string, string> = {
  Submitted: 'bg-blue-100 text-blue-800 border-blue-200',
  'In Review': 'bg-amber-100 text-amber-800 border-amber-200',
  Approved: 'bg-green-100 text-green-800 border-green-200',
  Processed: 'bg-green-100 text-green-800 border-green-200',
  Rejected: 'bg-red-100 text-red-800 border-red-200',
};

export default function BursarySubmissionDetailPage() {
  const params = useParams();
  const id = params?.id as string;
  const router = useRouter();
  const { session, user } = useAuth();

  const [submission, setSubmission] = useState<FormSubmission | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Approval Modal State
  const [isApproveOpen, setIsApproveOpen] = useState(false);
  const [approveNote, setApproveNote] = useState('');
  const [voucherNumber, setVoucherNumber] = useState('');
  const [isApproving, setIsApproving] = useState(false);

  // Rejection Modal State
  const [isRejectOpen, setIsRejectOpen] = useState(false);
  const [rejectNote, setRejectNote] = useState('');
  const [isRejecting, setIsRejecting] = useState(false);
  const [rejectError, setRejectError] = useState('');

  // Status update
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);

  const loadSubmission = async () => {
    setIsLoading(true);
    try {
      const res = await fetch(`/api/submissions/${id}`);
      const json = await res.json();
      if (json.success && json.data) {
        setSubmission(json.data);
      } else {
        // Fallback to dummy data
        const fallback = fallbackSubmissions.find((s) => s.id === id);
        if (fallback) setSubmission(fallback);
      }
    } catch {
      const fallback = fallbackSubmissions.find((s) => s.id === id);
      if (fallback) setSubmission(fallback);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (id) loadSubmission();
  }, [id]);

  const handleMarkInReview = async () => {
    setIsUpdatingStatus(true);
    try {
      const res = await fetch(`/api/submissions/${id}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'In Review' }),
      });
      const json = await res.json();
      if (json.success) {
        toast.success('Physical hard copy acknowledged. Submission is now In Review.');
        loadSubmission();
      } else {
        toast.error(json.error || 'Failed to update status');
      }
    } catch {
      toast.error('Network error');
    } finally {
      setIsUpdatingStatus(false);
    }
  };

  const handleApprove = async () => {
    setIsApproving(true);
    try {
      const res = await fetch(`/api/submissions/${id}/approve`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          note: approveNote,
          voucherNumber: voucherNumber || undefined,
        }),
      });
      const json = await res.json();
      if (json.success) {
        toast.success('Submission successfully verified and approved.');
        setIsApproveOpen(false);
        loadSubmission();
      } else {
        toast.error(json.error || 'Approval failed');
      }
    } catch {
      toast.error('Network error during approval');
    } finally {
      setIsApproving(false);
    }
  };

  const handleReject = async () => {
    if (!rejectNote || rejectNote.trim().length < 10) {
      setRejectError('Mandatory rejection reason must be at least 10 characters explaining the issue.');
      return;
    }
    setRejectError('');
    setIsRejecting(true);

    try {
      const res = await fetch(`/api/submissions/${id}/reject`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ note: rejectNote }),
      });
      const json = await res.json();
      if (json.success) {
        toast.success('Submission rejected with reason recorded.');
        setIsRejectOpen(false);
        loadSubmission();
      } else {
        setRejectError(json.error || 'Rejection failed');
      }
    } catch {
      setRejectError('Network error during rejection');
    } finally {
      setIsRejecting(false);
    }
  };

  const handlePrint = () => {
    if (typeof window !== 'undefined') {
      window.print();
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-slate-400">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600 mb-2" />
        <p className="text-sm">Retrieving submission details from Bursary repository...</p>
      </div>
    );
  }

  if (!submission) {
    return (
      <div className="max-w-4xl mx-auto py-12">
        <Card>
          <CardContent className="text-center py-12">
            <p className="text-gray-500 mb-4">Submission not found</p>
            <Link href="/bursary/submissions">
              <Button>Back to All Submissions</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  const snapshot = submission.staffSnapshot;
  const staffName = submission.submittedByName || submission.applicantName || 'Delegated Staff';
  const fundCentreCode = submission.formattedFundCentreCode || (submission.fundCode && submission.centreCode ? `${submission.fundCode}-${submission.centreCode}` : '01-694');

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Top Nav Breadcrumb */}
      <div className="no-print flex items-center justify-between">
        <Link
          href="/bursary/submissions"
          className="inline-flex items-center text-sm font-medium text-slate-600 hover:text-slate-900"
        >
          <ArrowLeft className="w-4 h-4 mr-1.5" />
          Back to All Submissions
        </Link>
        <div className="flex items-center gap-2">
          <Button onClick={handlePrint} variant="outline" size="sm" className="text-xs">
            <Printer className="w-4 h-4 mr-1.5" /> Print / Export Official Copy
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main 2-Column Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Header Card */}
          <Card className="border-slate-200 shadow-sm">
            <CardHeader className="pb-3 border-b border-slate-100">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs px-2 py-0.5 rounded bg-blue-50 text-blue-700 font-semibold border border-blue-100">
                      REF: {submission.referenceNumber}
                    </span>
                    <span className="font-mono text-xs px-2 py-0.5 rounded bg-indigo-50 text-indigo-700 font-bold border border-indigo-100">
                      {fundCentreCode}
                    </span>
                  </div>
                  <CardTitle className="text-xl font-bold mt-2 text-slate-900">
                    {formTypeLabels[submission.formType] || submission.formType}
                  </CardTitle>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Submitted on {new Date(submission.submittedDate).toLocaleString()}
                  </p>
                </div>
                <Badge className={`text-xs px-3 py-1 font-semibold ${statusColors[submission.status] || ''}`}>
                  {submission.status}
                </Badge>
              </div>
            </CardHeader>

            <CardContent className="pt-4 space-y-4">
              {/* Section A: Verified Staff & Accounting Snapshot */}
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3">
                  Section A: Submitting Staff Particulars & Classification
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 p-3 bg-slate-50 rounded-lg border border-slate-100 text-xs">
                  <div>
                    <span className="text-slate-500 block">Full Name & Title:</span>
                    <span className="font-semibold text-slate-900">{snapshot?.fullName || staffName}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block">Payroll Staff ID:</span>
                    <span className="font-mono font-semibold text-slate-900">{snapshot?.staffId || submission.submittedByStaffId || '—'}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block">Institutional Email:</span>
                    <span className="font-mono text-slate-700">{snapshot?.email || submission.submittedByEmail || '—'}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block">Designation / Post:</span>
                    <span className="font-medium text-slate-800">{snapshot?.designation || '—'}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block">National Identity No. (NIN):</span>
                    <span className="font-mono text-slate-800">{snapshot?.nin || '—'}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block">Salary Classification:</span>
                    <span className="font-medium text-slate-800">
                      {snapshot?.salaryType} {snapshot?.salaryGrade} (Level {snapshot?.salaryLevel}, Step {snapshot?.salaryStep})
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-500 block">Affiliated Unit:</span>
                    <span className="font-semibold text-slate-900">{submission.department}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block">Unit Centre Code:</span>
                    <span className="font-mono font-bold text-indigo-700">{submission.centreCode || snapshot?.centreCode || '694'}</span>
                  </div>
                </div>
              </div>

              {/* Section B: Request Details & Accounting Breakdown */}
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3">
                  Section B: Request Breakdown & Expense Code Details
                </h3>
                <div className="space-y-3">
                  {Object.entries(submission.formData || {}).map(([key, value]) => {
                    if (key === 'items' || key === 'expenditures') return null;
                    return (
                      <div key={key} className="flex justify-between py-1.5 border-b border-slate-100 text-xs">
                        <span className="text-slate-500 capitalize">{key.replace(/([A-Z])/g, ' $1')}:</span>
                        <span className="font-semibold text-slate-800 text-right max-w-xs">{String(value)}</span>
                      </div>
                    );
                  })}

                  {/* Itemized Table if cash advance / dlpo / expenditure items exist */}
                  {submission.formData?.items && Array.isArray(submission.formData.items) && (
                    <div className="mt-3">
                      <p className="font-semibold text-xs text-slate-700 mb-2">Itemized Schedule of Expenditure:</p>
                      <table className="w-full text-xs text-left border border-slate-200">
                        <thead className="bg-slate-50">
                          <tr>
                            <th className="p-2 border-b">Description</th>
                            <th className="p-2 border-b">Expense Code</th>
                            <th className="p-2 border-b text-right">Amount (₦)</th>
                          </tr>
                        </thead>
                        <tbody>
                          {submission.formData.items.map((it: any, i: number) => (
                            <tr key={i} className="border-b">
                              <td className="p-2">{it.description}</td>
                              <td className="p-2 font-mono text-slate-600">{it.expenseCode || submission.formData?.expenseCode || '—'}</td>
                              <td className="p-2 text-right font-medium">₦{Number(it.amount || it.totalPrice || 0).toLocaleString()}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              </div>

              {/* Section C: Formal Physical Endorsements & Stamps */}
              <div className="pt-2">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3">
                  Section C: Formal Physical Endorsement Blocks (Print Layout)
                </h3>
                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div className="p-3 border border-dashed border-slate-300 rounded min-h-[90px] flex flex-col justify-between">
                    <span className="text-[11px] text-slate-400 font-semibold uppercase">1. Applicant Signature & Date</span>
                    <div className="border-t border-slate-300 pt-1 text-[11px] text-slate-600">
                      Sign: ___________________ Date: _________
                    </div>
                  </div>
                  <div className="p-3 border border-dashed border-slate-300 rounded min-h-[90px] flex flex-col justify-between">
                    <span className="text-[11px] text-slate-400 font-semibold uppercase">2. Head of Department Stamp</span>
                    <div className="border-t border-slate-300 pt-1 text-[11px] text-slate-600">
                      Sign & Stamp: ___________________ Date: _________
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Decision Record Box if already Approved or Rejected */}
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
                    Official Bursary Decision: {submission.bursaryDecision.decision}
                  </AlertTitle>
                  <AlertDescription className="text-xs space-y-1 text-slate-800">
                    <p>
                      <strong>Officer:</strong> {submission.bursaryDecision.officerName} ({submission.bursaryDecision.officerUnit} Unit)
                    </p>
                    <p>
                      <strong>Timestamp:</strong> {new Date(submission.bursaryDecision.decidedAt).toLocaleString()}
                    </p>
                    {submission.bursaryDecision.voucherNumber && (
                      <p>
                        <strong>Voucher Number:</strong> <span className="font-mono font-bold text-green-900">{submission.bursaryDecision.voucherNumber}</span>
                      </p>
                    )}
                    <p className="mt-2 p-2 rounded bg-white/70 border border-slate-200 italic">
                      &quot;{submission.bursaryDecision.note}&quot;
                    </p>
                  </AlertDescription>
                </div>
              </div>
            </Alert>
          )}
        </div>

        {/* Right Action & Processing Panel */}
        <div className="space-y-6 no-print">
          <Card className="border-slate-200 shadow-sm">
            <CardHeader className="pb-3 border-b border-slate-100">
              <CardTitle className="text-base font-bold text-slate-900">Bursary Cross-Check</CardTitle>
              <CardDescription className="text-xs">
                Verify the delivered physical copy against this digital submission
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-4 space-y-4">
              {/* Step 1: Physical delivery acknowledgement */}
              {submission.status === 'Submitted' && (
                <div className="p-3 bg-blue-50 border border-blue-100 rounded-lg text-xs space-y-2">
                  <p className="text-blue-900 font-medium">Physical Copy Received at Bursary Desk?</p>
                  <p className="text-blue-700">
                    Once the physical endorsement form is delivered to the counter, acknowledge receipt to change status to <strong>In Review</strong>.
                  </p>
                  <Button
                    onClick={handleMarkInReview}
                    disabled={isUpdatingStatus}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-xs"
                  >
                    {isUpdatingStatus ? <Loader2 className="w-3.5 h-3.5 mr-1.5 animate-spin" /> : 'Acknowledge Receipt (In Review)'}
                  </Button>
                </div>
              )}

              {/* Actions for In Review or Submitted */}
              {submission.status !== 'Approved' && submission.status !== 'Rejected' && (
                <div className="space-y-3 pt-2">
                  <p className="text-xs font-semibold text-slate-700">Bursary Processing Decisions:</p>

                  {/* Approve Modal */}
                  <Dialog open={isApproveOpen} onOpenChange={setIsApproveOpen}>
                    <DialogTrigger asChild>
                      <Button className="w-full bg-emerald-600 hover:bg-emerald-700 text-xs">
                        <CheckCircle2 className="w-4 h-4 mr-1.5" /> Approve Submission
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Approve Form Submission</DialogTitle>
                        <DialogDescription>
                          Endorse this submission for disbursement/mandate allocation.
                        </DialogDescription>
                      </DialogHeader>

                      <div className="space-y-3 py-2">
                        <div>
                          <Label htmlFor="vch" className="text-xs">Voucher / Mandate Allocation No. (Optional)</Label>
                          <Input
                            id="vch"
                            placeholder="e.g. VCH-2026-0042"
                            value={voucherNumber}
                            onChange={(e) => setVoucherNumber(e.target.value)}
                          />
                        </div>
                        <div>
                          <Label htmlFor="note" className="text-xs">Bursary Officer Endorsement Note (Optional)</Label>
                          <Textarea
                            id="note"
                            placeholder="Verified against vote allocation..."
                            value={approveNote}
                            onChange={(e) => setApproveNote(e.target.value)}
                            rows={3}
                          />
                        </div>
                      </div>

                      <DialogFooter>
                        <Button variant="outline" onClick={() => setIsApproveOpen(false)}>Cancel</Button>
                        <Button onClick={handleApprove} disabled={isApproving} className="bg-emerald-600 hover:bg-emerald-700">
                          {isApproving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : 'Confirm Approval'}
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>

                  {/* Reject Modal */}
                  <Dialog open={isRejectOpen} onOpenChange={setIsRejectOpen}>
                    <DialogTrigger asChild>
                      <Button variant="outline" className="w-full border-red-300 text-red-700 hover:bg-red-50 text-xs">
                        <XCircle className="w-4 h-4 mr-1.5" /> Reject Submission
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle className="text-red-700 flex items-center gap-2">
                          <AlertTriangle className="w-5 h-5 text-red-600" /> Reject Form Submission
                        </DialogTitle>
                        <DialogDescription>
                          A <strong>mandatory explanatory note</strong> is required so the applicant understands why this submission cannot be processed.
                        </DialogDescription>
                      </DialogHeader>

                      {rejectError && (
                        <Alert variant="destructive">
                          <AlertDescription>{rejectError}</AlertDescription>
                        </Alert>
                      )}

                      <div className="py-2">
                        <Label htmlFor="rejectionReason" className="text-xs">
                          Mandatory Rejection Reason (Minimum 10 characters) *
                        </Label>
                        <Textarea
                          id="rejectionReason"
                          placeholder="e.g. Ineligible expenditure code specified; hotel receipts missing; requires Dean's prior concurrence..."
                          value={rejectNote}
                          onChange={(e) => setRejectNote(e.target.value)}
                          rows={4}
                          className="mt-1"
                          required
                        />
                      </div>

                      <DialogFooter>
                        <Button variant="outline" onClick={() => setIsRejectOpen(false)}>Cancel</Button>
                        <Button onClick={handleReject} disabled={isRejecting} className="bg-red-600 hover:bg-red-700">
                          {isRejecting ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : 'Confirm Rejection'}
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </div>
              )}

              {/* Already Processed Note */}
              {(submission.status === 'Approved' || submission.status === 'Rejected') && (
                <div className="p-3 bg-slate-50 border border-slate-200 rounded text-xs text-slate-600">
                  This submission has been finalized as <strong>{submission.status}</strong>. Decisions cannot be reversed digitally; any alterations require a new submission.
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
