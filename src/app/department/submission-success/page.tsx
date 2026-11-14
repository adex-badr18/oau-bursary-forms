'use client';

import { Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle2, FileText, List } from 'lucide-react';
import { formTypeLabels } from '@/lib/data';
import { FormType } from '@/types';

function SubmissionSuccessContent() {
  const searchParams = useSearchParams();
  const formType = (searchParams.get('formType') || 'cash-advance') as FormType;
  const refParam = searchParams.get('ref');

  const referenceNumber =
    refParam ||
    `${formType.toUpperCase().replace(/-/g, '')}-2026-${String(Math.floor(Math.random() * 9999)).padStart(4, '0')}`;

  return (
    <div className="max-w-2xl mx-auto">
      <Card>
        <CardHeader className="text-center">
          <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
            <CheckCircle2 className="w-10 h-10 text-green-600" />
          </div>
          <CardTitle className="text-2xl">Form Submitted Successfully!</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="text-center space-y-2">
            <p className="text-gray-600">
              Your {formTypeLabels[formType] || 'form'} has been submitted for processing.
            </p>
            <div className="p-4 bg-blue-50 rounded-lg">
              <p className="text-sm text-gray-600 mb-1">Reference Number</p>
              <p className="text-2xl font-bold text-blue-600">{referenceNumber}</p>
            </div>
            <p className="text-sm text-gray-500 mt-4">
              Please save this reference number for future correspondence.
            </p>
          </div>

          <div className="border-t pt-6 space-y-4">
            <h3 className="font-semibold">What happens next?</h3>
            <ul className="space-y-2 text-sm text-gray-600">
              <li className="flex items-start">
                <span className="inline-block w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-semibold mr-3 flex-shrink-0 mt-0.5">
                  1
                </span>
                <span>Your submission will be reviewed by the Bursary department</span>
              </li>
              <li className="flex items-start">
                <span className="inline-block w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-semibold mr-3 flex-shrink-0 mt-0.5">
                  2
                </span>
                <span>You will receive an email notification when the status changes</span>
              </li>
              <li className="flex items-start">
                <span className="inline-block w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-semibold mr-3 flex-shrink-0 mt-0.5">
                  3
                </span>
                <span>Track your submission status in the &quot;My Submissions&quot; section</span>
              </li>
            </ul>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 pt-4">
            <Link href="/department/submissions" className="flex-1">
              <Button className="w-full" variant="outline">
                <List className="w-4 h-4 mr-2" />
                View My Submissions
              </Button>
            </Link>
            <Link href="/department/dashboard" className="flex-1">
              <Button className="w-full">
                <FileText className="w-4 h-4 mr-2" />
                Submit Another Form
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
    <Suspense fallback={<div className="text-center py-12">Loading...</div>}>
      <SubmissionSuccessContent />
    </Suspense>
  );
}
