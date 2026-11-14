'use client';

import Link from 'next/link';
import { useParams } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { submissions, formTypeLabels } from '@/lib/data';
import { SubmissionStatus } from '@/types';
import { ArrowLeft, Calendar, User, Building2, FileText } from 'lucide-react';
import { format } from 'date-fns';

const statusColors: Record<SubmissionStatus, string> = {
  Submitted: 'bg-blue-100 text-blue-800',
  'In Review': 'bg-yellow-100 text-yellow-800',
  Processed: 'bg-green-100 text-green-800',
  Rejected: 'bg-red-100 text-red-800',
};

export default function DepartmentSubmissionDetailPage() {
  const params = useParams();
  const id = params?.id as string;
  const submission = submissions.find((s) => s.id === id);

  if (!submission) {
    return (
      <div className="max-w-4xl mx-auto">
        <Card>
          <CardContent className="text-center py-12">
            <p className="text-gray-500">Submission not found</p>
            <Link href="/department/submissions">
              <Button className="mt-4">Back to Submissions</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <Link
        href="/department/submissions"
        className="inline-flex items-center text-sm text-gray-600 hover:text-gray-900 mb-4"
      >
        <ArrowLeft className="w-4 h-4 mr-1" />
        Back to My Submissions
      </Link>

      <div className="space-y-6">
        {/* Header Card */}
        <Card>
          <CardHeader>
            <div className="flex items-start justify-between">
              <div>
                <CardTitle className="text-2xl">{formTypeLabels[submission.formType]}</CardTitle>
                <p className="text-sm text-gray-500 mt-1">Reference: {submission.referenceNumber}</p>
              </div>
              <Badge className={statusColors[submission.status]} variant="secondary">
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
                  <p className="font-medium">{submission.applicantName}</p>
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
                  <p className="text-xs text-gray-500">Submitted</p>
                  <p className="font-medium">{format(new Date(submission.submittedDate), 'MMM dd, yyyy')}</p>
                </div>
              </div>

              {submission.voucherNumber && (
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                    <FileText className="w-5 h-5 text-orange-600" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Voucher #</p>
                    <p className="font-medium">{submission.voucherNumber}</p>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Form Data Card */}
        <Card>
          <CardHeader>
            <CardTitle>Form Details</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
              {Object.entries(submission.formData).map(([key, value]) => {
                if (typeof value === 'object' && value !== null) {
                  return null;
                }

                const label = key
                  .replace(/([A-Z])/g, ' $1')
                  .replace(/^./, (str) => str.toUpperCase())
                  .trim();

                return (
                  <div key={key} className="space-y-1">
                    <p className="text-sm text-gray-500">{label}</p>
                    <p className="font-medium">
                      {typeof value === 'boolean'
                        ? value
                          ? 'Yes'
                          : 'No'
                        : value?.toString() || 'N/A'}
                    </p>
                  </div>
                );
              })}
            </div>

            {/* Show expenditures if it's an imprest holder form */}
            {submission.formData.expenditures && Array.isArray(submission.formData.expenditures) && (
              <div className="mt-6 border-t pt-6">
                <h4 className="font-semibold mb-4">Expenditure Breakdown</h4>
                <div className="space-y-2">
                  {submission.formData.expenditures.map((exp: any, index: number) => (
                    <div key={index} className="flex justify-between items-center p-3 bg-gray-50 rounded">
                      <div className="flex-1">
                        <p className="font-medium">{exp.description}</p>
                        <p className="text-sm text-gray-500">
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

        {/* Bursary Notes (if any) */}
        {submission.bursaryNotes && (
          <Card>
            <CardHeader>
              <CardTitle>Bursary Notes</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700">{submission.bursaryNotes}</p>
              {submission.processedBy && (
                <p className="text-sm text-gray-500 mt-2">
                  Processed by: {submission.processedBy} on{' '}
                  {format(new Date(submission.processedDate!), 'MMM dd, yyyy')}
                </p>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
