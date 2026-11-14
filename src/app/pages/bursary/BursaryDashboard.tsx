import { Link } from 'react-router';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { submissions, formTypeLabels } from '../../lib/data';
import { FormType } from '../../types';
import { DollarSign, ShoppingCart, Receipt, Car, Wallet, TrendingUp, Clock, CheckCircle2, XCircle } from 'lucide-react';

export default function BursaryDashboard() {
  const formTypes: FormType[] = ['cash-advance', 'dlpo', 'expenditure-authorization', 'duty-mileage', 'imprest-holder'];
  
  const stats = {
    total: submissions.length,
    submitted: submissions.filter(s => s.status === 'Submitted').length,
    inReview: submissions.filter(s => s.status === 'In Review').length,
    processed: submissions.filter(s => s.status === 'Processed').length,
    rejected: submissions.filter(s => s.status === 'Rejected').length,
  };

  const formTypeIcons: Record<FormType, any> = {
    'cash-advance': DollarSign,
    'dlpo': ShoppingCart,
    'expenditure-authorization': Receipt,
    'duty-mileage': Car,
    'imprest-holder': Wallet,
  };

  const formTypeRoutes: Record<FormType, string> = {
    'cash-advance': '/bursary/cash-advance',
    'dlpo': '/bursary/dlpo',
    'expenditure-authorization': '/bursary/expenditure',
    'duty-mileage': '/bursary/duty-mileage',
    'imprest-holder': '/bursary/imprest',
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-gray-900">Dashboard</h2>
        <p className="text-gray-600 mt-1">Overview of all form submissions</p>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Total Submissions</CardTitle>
            <TrendingUp className="w-4 h-4 text-gray-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Submitted</CardTitle>
            <Clock className="w-4 h-4 text-blue-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{stats.submitted}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">In Review</CardTitle>
            <Clock className="w-4 h-4 text-yellow-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">{stats.inReview}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Processed</CardTitle>
            <CheckCircle2 className="w-4 h-4 text-green-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{stats.processed}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Rejected</CardTitle>
            <XCircle className="w-4 h-4 text-red-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{stats.rejected}</div>
          </CardContent>
        </Card>
      </div>

      {/* Form Categories */}
      <div>
        <h3 className="text-lg font-semibold mb-4">Form Categories</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {formTypes.map((formType) => {
            const Icon = formTypeIcons[formType];
            const count = submissions.filter(s => s.formType === formType).length;
            const pending = submissions.filter(s => s.formType === formType && (s.status === 'Submitted' || s.status === 'In Review')).length;
            
            return (
              <Link key={formType} to={formTypeRoutes[formType]}>
                <Card className="hover:shadow-md transition-shadow cursor-pointer">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                        <Icon className="w-6 h-6 text-blue-600" />
                      </div>
                      {pending > 0 && (
                        <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
                          {pending} pending
                        </Badge>
                      )}
                    </div>
                    <CardTitle className="mt-4">{formTypeLabels[formType]}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-2xl font-bold text-gray-900">{count}</p>
                    <p className="text-sm text-gray-500">Total submissions</p>
                  </CardContent>
                </Card>
              </Link>
            );
          })}
        </div>
      </div>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Submissions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {submissions.slice(0, 5).map((submission) => {
              const statusColors = {
                'Submitted': 'bg-blue-100 text-blue-800',
                'In Review': 'bg-yellow-100 text-yellow-800',
                'Processed': 'bg-green-100 text-green-800',
                'Rejected': 'bg-red-100 text-red-800',
              };

              return (
                <div key={submission.id} className="flex items-center justify-between py-3 border-b last:border-0">
                  <div className="flex-1">
                    <p className="font-medium">{submission.referenceNumber}</p>
                    <p className="text-sm text-gray-500">
                      {formTypeLabels[submission.formType]} • {submission.department}
                    </p>
                  </div>
                  <Badge className={statusColors[submission.status]} variant="secondary">
                    {submission.status}
                  </Badge>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
