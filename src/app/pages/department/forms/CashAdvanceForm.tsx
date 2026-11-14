import { useState } from 'react';
import { useNavigate } from 'react-router';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../../components/ui/card';
import { Button } from '../../../components/ui/button';
import { Input } from '../../../components/ui/input';
import { Label } from '../../../components/ui/label';
import { Textarea } from '../../../components/ui/textarea';
import { useAuth } from '../../../contexts/AuthContext';
import { ArrowLeft, Plus, X } from 'lucide-react';
import { Link } from 'react-router';

interface SpendingProfileItem {
  itemDescription: string;
  itemAmount: string;
}

export default function CashAdvanceForm() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    fullName: user?.name?.toUpperCase() || '',
    post: '',
    department: user?.department || '',
    bankName: '',
    bankBranch: '',
    accountNumber: '',
    email: user?.email || '',
    purpose: '',
    accountToClear: '',
    amountFigure: '',
    amountWords: '',
    applicantSignature: '',
    applicantDate: '',
  });

  const [spendingProfile, setSpendingProfile] = useState<SpendingProfileItem[]>([
    { itemDescription: '', itemAmount: '' }
  ]);

  const handleChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const addSpendingItem = () => {
    setSpendingProfile([...spendingProfile, { itemDescription: '', itemAmount: '' }]);
  };

  const removeSpendingItem = (index: number) => {
    if (spendingProfile.length > 1) {
      setSpendingProfile(spendingProfile.filter((_, i) => i !== index));
    }
  };

  const updateSpendingItem = (index: number, field: keyof SpendingProfileItem, value: string) => {
    const updated = [...spendingProfile];
    updated[index][field] = value;
    setSpendingProfile(updated);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    if (!formData.amountFigure || parseFloat(formData.amountFigure) <= 0) {
      alert('Please enter a valid amount');
      return;
    }

    if (formData.accountNumber.length !== 10) {
      alert('Account number must be exactly 10 digits');
      return;
    }

    // Navigate to confirmation
    navigate('/department/submission-success', { 
      state: { 
        formType: 'cash-advance',
        formData: { ...formData, spendingProfile }
      } 
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
          <CardTitle>Cash Advance Form</CardTitle>
          <CardDescription>
            Request advance payment for official university activities
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Applicant Information */}
            <div className="space-y-4">
              <h3 className="font-semibold text-lg border-b pb-2">Applicant Information</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="fullName">Full Name (Surname in capital) *</Label>
                  <Input
                    id="fullName"
                    value={formData.fullName}
                    onChange={(e) => handleChange('fullName', e.target.value.toUpperCase())}
                    placeholder="SURNAME FirstName"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="post">Post (as on payroll) *</Label>
                  <Input
                    id="post"
                    value={formData.post}
                    onChange={(e) => handleChange('post', e.target.value)}
                    placeholder="e.g., Lecturer II"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="department">Department *</Label>
                  <Input
                    id="department"
                    value={formData.department}
                    onChange={(e) => handleChange('department', e.target.value)}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">E-mail Address *</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleChange('email', e.target.value)}
                    required
                  />
                </div>
              </div>
            </div>

            {/* Banking Information */}
            <div className="space-y-4">
              <h3 className="font-semibold text-lg border-b pb-2">Banking Information</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="bankName">Bank Name *</Label>
                  <Input
                    id="bankName"
                    value={formData.bankName}
                    onChange={(e) => handleChange('bankName', e.target.value)}
                    placeholder="e.g., First Bank"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="bankBranch">Bank Branch *</Label>
                  <Input
                    id="bankBranch"
                    value={formData.bankBranch}
                    onChange={(e) => handleChange('bankBranch', e.target.value)}
                    placeholder="e.g., Main Branch"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="accountNumber">Account Number (10 digits) *</Label>
                  <Input
                    id="accountNumber"
                    value={formData.accountNumber}
                    onChange={(e) => handleChange('accountNumber', e.target.value)}
                    placeholder="0123456789"
                    maxLength={10}
                    pattern="[0-9]{10}"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Cash Advance Details */}
            <div className="space-y-4">
              <h3 className="font-semibold text-lg border-b pb-2">Cash Advance Details</h3>
              
              <div className="space-y-2">
                <Label htmlFor="purpose">Purpose of the Cash Advance *</Label>
                <Textarea
                  id="purpose"
                  value={formData.purpose}
                  onChange={(e) => handleChange('purpose', e.target.value)}
                  placeholder="Describe the purpose of this cash advance..."
                  rows={3}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="accountToClear">Account into Which Expenditure is to be Cleared *</Label>
                <Input
                  id="accountToClear"
                  value={formData.accountToClear}
                  onChange={(e) => handleChange('accountToClear', e.target.value)}
                  placeholder="e.g., Account code or reference"
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="amountFigure">Amount Required (Figure) ₦ *</Label>
                  <Input
                    id="amountFigure"
                    type="number"
                    step="0.01"
                    value={formData.amountFigure}
                    onChange={(e) => handleChange('amountFigure', e.target.value)}
                    placeholder="500000.00"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="amountWords">Amount Required (Words) *</Label>
                  <Input
                    id="amountWords"
                    value={formData.amountWords}
                    onChange={(e) => handleChange('amountWords', e.target.value)}
                    placeholder="Five Hundred Thousand Naira"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Spending Profile */}
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="font-semibold text-lg border-b pb-2">Spending Profile</h3>
                <Button type="button" variant="outline" size="sm" onClick={addSpendingItem}>
                  <Plus className="w-4 h-4 mr-1" />
                  Add Item
                </Button>
              </div>

              <div className="space-y-3">
                {spendingProfile.map((item, index) => (
                  <div key={index} className="flex gap-2 items-start p-3 border rounded-lg bg-gray-50">
                    <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-3">
                      <div className="space-y-1">
                        <Label htmlFor={`item-desc-${index}`} className="text-sm">Description *</Label>
                        <Input
                          id={`item-desc-${index}`}
                          value={item.itemDescription}
                          onChange={(e) => updateSpendingItem(index, 'itemDescription', e.target.value)}
                          placeholder="Item description"
                          required
                        />
                      </div>
                      <div className="space-y-1">
                        <Label htmlFor={`item-amount-${index}`} className="text-sm">Amount (₦) *</Label>
                        <Input
                          id={`item-amount-${index}`}
                          type="number"
                          step="0.01"
                          value={item.itemAmount}
                          onChange={(e) => updateSpendingItem(index, 'itemAmount', e.target.value)}
                          placeholder="0.00"
                          required
                        />
                      </div>
                    </div>
                    {spendingProfile.length > 1 && (
                      <Button 
                        type="button" 
                        variant="ghost" 
                        size="sm"
                        onClick={() => removeSpendingItem(index)}
                        className="mt-6"
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Applicant Signature */}
            <div className="space-y-4">
              <h3 className="font-semibold text-lg border-b pb-2">Applicant Signature</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="applicantSignature">Signature of Applicant *</Label>
                  <Input
                    id="applicantSignature"
                    value={formData.applicantSignature}
                    onChange={(e) => handleChange('applicantSignature', e.target.value)}
                    placeholder="Type your full name as signature"
                    required
                  />
                  <p className="text-xs text-gray-500">Type your full name to serve as your digital signature</p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="applicantDate">Date *</Label>
                  <Input
                    id="applicantDate"
                    type="date"
                    value={formData.applicantDate}
                    onChange={(e) => handleChange('applicantDate', e.target.value)}
                    required
                  />
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex justify-end gap-4 pt-4">
              <Link to="/department/dashboard">
                <Button type="button" variant="outline">
                  Cancel
                </Button>
              </Link>
              <Button type="submit">
                Submit Form
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}