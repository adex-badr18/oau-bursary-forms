import { useState } from 'react';
import { useNavigate, Link } from 'react-router';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../../components/ui/card';
import { Button } from '../../../components/ui/button';
import { Input } from '../../../components/ui/input';
import { Label } from '../../../components/ui/label';
import { Textarea } from '../../../components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../../components/ui/select';
import { useAuth } from '../../../contexts/AuthContext';
import { ArrowLeft } from 'lucide-react';

export default function ExpenditureAuthorizationForm() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    from: user?.department || '',
    sumToPayOrRecover: '',
    toFromName: '',
    toFromOffice: '',
    attachedReference: '',
    reason: '',
    fundCode: '',
    costCentreCode: '',
    expenseCode: '',
    drCrIndicator: 'Dr' as 'Dr' | 'Cr',
    authorizedBy: user?.name || '',
    authorizedDate: '',
    approvedBy: '',
    approvedDate: '',
    voucherNumber: '',
  });

  const handleChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    navigate('/department/submission-success', { 
      state: { formType: 'expenditure-authorization', formData } 
    });
  };

  return (
    <div className="max-w-4xl mx-auto">
      <Link to="/department/dashboard" className="inline-flex items-center text-sm text-gray-600 hover:text-gray-900 mb-4">
        <ArrowLeft className="w-4 h-4 mr-1" />
        Back to Available Forms
      </Link>

      <Card>
        <CardHeader>
          <CardTitle>Expenditure Authorization and Approval Form</CardTitle>
          <CardDescription>
            Authorize expenditure and account recovery
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Basic Information */}
            <div className="space-y-4">
              <h3 className="font-semibold text-lg border-b pb-2">Request Information</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="from">From *</Label>
                  <Input
                    id="from"
                    value={formData.from}
                    onChange={(e) => handleChange('from', e.target.value)}
                    placeholder="Department or Office"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="sumToPayOrRecover">Sum to Pay/Recover (₦) *</Label>
                  <Input
                    id="sumToPayOrRecover"
                    type="number"
                    step="0.01"
                    value={formData.sumToPayOrRecover}
                    onChange={(e) => handleChange('sumToPayOrRecover', e.target.value)}
                    placeholder="120000.00"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="toFromName">To/From (Name) *</Label>
                  <Input
                    id="toFromName"
                    value={formData.toFromName}
                    onChange={(e) => handleChange('toFromName', e.target.value)}
                    placeholder="John Doe"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="toFromOffice">To/From (Office) *</Label>
                  <Input
                    id="toFromOffice"
                    value={formData.toFromOffice}
                    onChange={(e) => handleChange('toFromOffice', e.target.value)}
                    placeholder="Finance Office"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="attachedReference">Attached Document Reference *</Label>
                  <Input
                    id="attachedReference"
                    value={formData.attachedReference}
                    onChange={(e) => handleChange('attachedReference', e.target.value)}
                    placeholder="Invoice #1001"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="reason">Reason/Description *</Label>
                <Textarea
                  id="reason"
                  value={formData.reason}
                  onChange={(e) => handleChange('reason', e.target.value)}
                  placeholder="Detailed reason for expenditure or recovery..."
                  rows={4}
                  required
                />
              </div>
            </div>

            {/* Account Number Segments */}
            <div className="space-y-4">
              <h3 className="font-semibold text-lg border-b pb-2">Debit/Credit Account Number</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="fundCode">Fund Code *</Label>
                  <Input
                    id="fundCode"
                    value={formData.fundCode}
                    onChange={(e) => handleChange('fundCode', e.target.value)}
                    placeholder="e.g., 001"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="costCentreCode">Cost Centre Code *</Label>
                  <Input
                    id="costCentreCode"
                    value={formData.costCentreCode}
                    onChange={(e) => handleChange('costCentreCode', e.target.value)}
                    placeholder="e.g., 1234"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="expenseCode">Expense Code *</Label>
                  <Input
                    id="expenseCode"
                    value={formData.expenseCode}
                    onChange={(e) => handleChange('expenseCode', e.target.value)}
                    placeholder="e.g., 5600"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="drCrIndicator">Dr/Cr Indicator *</Label>
                  <Select 
                    value={formData.drCrIndicator} 
                    onValueChange={(value: 'Dr' | 'Cr') => handleChange('drCrIndicator', value)}
                  >
                    <SelectTrigger id="drCrIndicator">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Dr">Dr (Debit)</SelectItem>
                      <SelectItem value="Cr">Cr (Credit)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="p-3 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-700">
                  <span className="font-semibold">Full Account Number: </span>
                  {formData.fundCode && formData.costCentreCode && formData.expenseCode 
                    ? `${formData.fundCode}-${formData.costCentreCode}-${formData.expenseCode} (${formData.drCrIndicator})`
                    : 'Fill in all account segments to see the full account number'}
                </p>
              </div>
            </div>

            {/* Authorization & Approval */}
            <div className="space-y-4">
              <h3 className="font-semibold text-lg border-b pb-2">Authorization & Approval</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="authorizedBy">Authorized By *</Label>
                  <Input
                    id="authorizedBy"
                    value={formData.authorizedBy}
                    onChange={(e) => handleChange('authorizedBy', e.target.value)}
                    placeholder="Type your full name"
                    required
                  />
                  <p className="text-xs text-gray-500">Type your full name to serve as your digital signature</p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="authorizedDate">Date (Authorized) *</Label>
                  <Input
                    id="authorizedDate"
                    type="date"
                    value={formData.authorizedDate}
                    onChange={(e) => handleChange('authorizedDate', e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg">
                <p className="text-sm text-amber-800">
                  <strong>Note:</strong> The following fields will be completed by the Bursar's office during processing:
                </p>
                <ul className="text-sm text-amber-700 mt-2 ml-4 list-disc">
                  <li>Approved By (Bursar)</li>
                  <li>Approval Date</li>
                  <li>Voucher Number</li>
                </ul>
              </div>
            </div>

            {/* Actions */}
            <div className="flex justify-end gap-4 pt-4">
              <Link to="/department/dashboard">
                <Button type="button" variant="outline">Cancel</Button>
              </Link>
              <Button type="submit">Submit Form</Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}