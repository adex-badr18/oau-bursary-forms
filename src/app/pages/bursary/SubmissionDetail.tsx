import { useState } from 'react';
import { Link, useParams } from 'react-router';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Textarea } from '../../components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
import { submissions, formTypeLabels } from '../../lib/data';
import { SubmissionStatus } from '../../types';
import { ArrowLeft, Calendar, User, Building2, FileText, Printer, Save } from 'lucide-react';
import { format } from 'date-fns';
import { useAuth } from '../../contexts/AuthContext';
import { toast } from 'sonner';

const statusColors: Record<SubmissionStatus, string> = {
  'Submitted': 'bg-blue-100 text-blue-800',
  'In Review': 'bg-yellow-100 text-yellow-800',
  'Processed': 'bg-green-100 text-green-800',
  'Rejected': 'bg-red-100 text-red-800',
};

export default function BursarySubmissionDetail() {
  const { id } = useParams();
  const { user } = useAuth();
  const submission = submissions.find(s => s.id === id);

  const [status, setStatus] = useState<SubmissionStatus>(submission?.status || 'Submitted');
  const [bursaryNotes, setBursaryNotes] = useState(submission?.bursaryNotes || '');
  const [voucherNumber, setVoucherNumber] = useState(submission?.voucherNumber || '');

  if (!submission) {
    return (
      <div className="max-w-4xl mx-auto">
        <Card>
          <CardContent className="text-center py-12">
            <p className="text-gray-500">Submission not found</p>
            <Link to="/bursary/dashboard">
              <Button className="mt-4">Back to Dashboard</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  const handleSave = () => {
    toast.success('Changes saved successfully');
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="max-w-6xl mx-auto">
      <div className="no-print mb-4">
        <Link to="/bursary/dashboard" className="inline-flex items-center text-sm text-gray-600 hover:text-gray-900">
          <ArrowLeft className="w-4 h-4 mr-1" />
          Back to Dashboard
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
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
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                  // Skip complex objects and arrays for display
                  if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
                    return null;
                  }

                  // Skip expenditures array here, will show separately
                  if (key === 'expenditures') {
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
                          ? (value ? 'Yes' : 'No')
                          : Array.isArray(value)
                          ? value.join(', ')
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
                        <p className="font-semibold">${exp.amount}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Processing Panel */}
        <div className="space-y-6 no-print">
          <Card>
            <CardHeader>
              <CardTitle>Processing</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <Select value={status} onValueChange={(value) => setStatus(value as SubmissionStatus)}>
                  <SelectTrigger id="status">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Submitted">Submitted</SelectItem>
                    <SelectItem value="In Review">In Review</SelectItem>
                    <SelectItem value="Processed">Processed</SelectItem>
                    <SelectItem value="Rejected">Rejected</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="voucherNumber">Voucher Number</Label>
                <Input
                  id="voucherNumber"
                  value={voucherNumber}
                  onChange={(e) => setVoucherNumber(e.target.value)}
                  placeholder="VCH-2026-0001"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="bursaryNotes">Internal Notes</Label>
                <Textarea
                  id="bursaryNotes"
                  value={bursaryNotes}
                  onChange={(e) => setBursaryNotes(e.target.value)}
                  placeholder="Add processing notes..."
                  rows={6}
                />
              </div>

              <div className="space-y-2">
                <Label className="text-sm text-gray-500">Processed By</Label>
                <p className="font-medium">{user?.name}</p>
                <p className="text-sm text-gray-500">{format(new Date(), 'MMM dd, yyyy')}</p>
              </div>

              <Button onClick={handleSave} className="w-full">
                <Save className="w-4 h-4 mr-2" />
                Save Changes
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button onClick={handlePrint} variant="outline" className="w-full">
                <Printer className="w-4 h-4 mr-2" />
                Print / Export PDF
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}