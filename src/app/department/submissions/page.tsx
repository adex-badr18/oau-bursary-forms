'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useAuth } from '@/context/AuthContext';
import { submissions, formTypeLabels } from '@/lib/data';
import { SubmissionStatus } from '@/types';
import { Eye, Search } from 'lucide-react';
import { format } from 'date-fns';

const statusColors: Record<SubmissionStatus, string> = {
  Submitted: 'bg-blue-100 text-blue-800',
  'In Review': 'bg-yellow-100 text-yellow-800',
  Processed: 'bg-green-100 text-green-800',
  Rejected: 'bg-red-100 text-red-800',
};

export default function MySubmissionsPage() {
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  // Filter submissions for current department
  const departmentSubmissions = submissions.filter(
    (sub) => !user?.department || sub.department === user?.department
  );

  // Apply filters
  const filteredSubmissions = useMemo(() => {
    return departmentSubmissions.filter((sub) => {
      const matchesSearch =
        sub.referenceNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
        sub.applicantName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        formTypeLabels[sub.formType].toLowerCase().includes(searchTerm.toLowerCase());

      const matchesStatus = statusFilter === 'all' || sub.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [departmentSubmissions, searchTerm, statusFilter]);

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-2xl font-semibold text-gray-900">My Submissions</h2>
        <p className="text-gray-600 mt-1">Track the status of your submitted forms</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Form Submissions</CardTitle>
          <div className="flex flex-col sm:flex-row gap-4 mt-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                placeholder="Search by reference number, applicant, or form type..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full sm:w-48">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="Submitted">Submitted</SelectItem>
                <SelectItem value="In Review">In Review</SelectItem>
                <SelectItem value="Processed">Processed</SelectItem>
                <SelectItem value="Rejected">Rejected</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent>
          {filteredSubmissions.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500">No submissions found</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Reference</TableHead>
                    <TableHead>Form Type</TableHead>
                    <TableHead>Applicant</TableHead>
                    <TableHead>Submitted Date</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredSubmissions.map((submission) => (
                    <TableRow key={submission.id}>
                      <TableCell className="font-medium">{submission.referenceNumber}</TableCell>
                      <TableCell>{formTypeLabels[submission.formType]}</TableCell>
                      <TableCell>{submission.applicantName}</TableCell>
                      <TableCell>
                        {format(new Date(submission.submittedDate), 'MMM dd, yyyy')}
                      </TableCell>
                      <TableCell>
                        <Badge className={statusColors[submission.status]} variant="secondary">
                          {submission.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Link href={`/department/submission/${submission.id}`}>
                          <Button variant="ghost" size="sm">
                            <Eye className="w-4 h-4 mr-2" />
                            View
                          </Button>
                        </Link>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
