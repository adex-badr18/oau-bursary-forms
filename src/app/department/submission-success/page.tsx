'use client';

import { Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle2, FileText, List, Printer, ArrowRight, Building2, Stamp } from 'lucide-react';
import { formTypeLabels } from '@/types';
import { FormType } from '@/types';

function SubmissionSuccessContent() {
  const searchParams = useSearchParams();
  const formType = (searchParams.get('formType') || 'cash-advance') as FormType;
  const refParam = searchParams.get('ref');
  const subId = searchParams.get('id');

  const referenceNumber = refParam || 'CA-2026-0001';

  const handlePrint = () => {
    if (typeof window !== 'undefined') {
      window.print();
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <Card className="border-slate-200 shadow-sm">
        <CardHeader className="text-center pb-4">
          <div className="mx-auto w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mb-3">
            <CheckCircle2 className="w-10 h-10 text-emerald-600" />
          </div>
          <CardTitle className="text-2xl font-bold text-slate-900">Digital Submission Complete!</CardTitle>
          <CardDescription>
            Your {formTypeLabels[formType] || 'form'} has been logged into the University Bursary system.
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          <div className="p-4 bg-blue-50 border border-blue-100 rounded-xl text-center space-y-1">
            <p className="text-xs font-semibold text-blue-700 uppercase tracking-wide">University Reference Tracking Number</p>
            <p className="text-3xl font-extrabold text-blue-900 font-mono tracking-tight">{referenceNumber}</p>
            <p className="text-xs text-blue-600">Generated on {new Date().toLocaleDateString()}</p>
          </div>

          {/* Action CTAs: Immediate Print */}
          <div className="p-4 bg-amber-50/70 border border-amber-200 rounded-xl space-y-3">
            <div className="flex items-start gap-3">
              <Printer className="w-5 h-5 text-amber-700 mt-0.5 shrink-0" />
              <div>
                <h4 className="text-sm font-bold text-amber-950">Physical Endorsement Required</h4>
                <p className="text-xs text-amber-900 mt-0.5">
                  University Bursary regulations mandate physical delivery of the signed and stamped hard copy to begin processing.
                </p>
              </div>
            </div>

            <Button onClick={handlePrint} className="w-full bg-indigo-700 hover:bg-indigo-800 text-xs font-semibold">
              <Printer className="w-4 h-4 mr-2" /> Print Official Form for Physical Endorsement
            </Button>
          </div>

          {/* 3-Step Physical-to-Digital Flow */}
          <div className="border-t border-slate-100 pt-5 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Next Steps for Formal Processing:
            </h4>
            <ol className="space-y-2 text-xs text-slate-700">
              <li className="flex items-start gap-2.5">
                <span className="w-5 h-5 rounded-full bg-slate-200 font-bold flex items-center justify-center text-slate-800 shrink-0 text-[11px]">
                  1
                </span>
                <span>
                  <strong>Print this form:</strong> Use the button above to print the official university stationery layout.
                </span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="w-5 h-5 rounded-full bg-slate-200 font-bold flex items-center justify-center text-slate-800 shrink-0 text-[11px]">
                  2
                </span>
                <span>
                  <strong>Sign & Obtain HOD Stamp:</strong> Sign as applicant, and have your Head of Unit or Dean append their signature and official rubber stamp in Section C.
                </span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="w-5 h-5 rounded-full bg-slate-200 font-bold flex items-center justify-center text-slate-800 shrink-0 text-[11px]">
                  3
                </span>
                <span>
                  <strong>Deliver to Bursary:</strong> Submit the physical hard copy to the Bursary processing desk. Once received, the officer will cross-check and move status from <em>Submitted</em> to <em>In Review</em>.
                </span>
              </li>
            </ol>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            {subId && (
              <Link href={`/department/submission/${subId}`} className="flex-1">
                <Button variant="outline" className="w-full text-xs">
                  View Submission Details
                </Button>
              </Link>
            )}
            <Link href="/department/submissions" className="flex-1">
              <Button variant="outline" className="w-full text-xs">
                <List className="w-3.5 h-3.5 mr-1.5" /> Track in My Submissions
              </Button>
            </Link>
            <Link href="/department/dashboard" className="flex-1">
              <Button className="w-full text-xs bg-slate-900 hover:bg-slate-800">
                <FileText className="w-3.5 h-3.5 mr-1.5" /> Submit Another Form
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default function SubmissionSuccessPage() {
  return (
    <Suspense fallback={<div className="text-center py-12 text-sm text-slate-500">Loading submission summary...</div>}>
      <SubmissionSuccessContent />
    </Suspense>
  );
}
