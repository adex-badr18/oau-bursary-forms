'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/context/AuthContext';
import { cashAdvanceSchema } from '@/lib/validations/cash-advance';
import { ArrowLeft, Plus, X, Loader2, CheckCircle2, Building2 } from 'lucide-react';
import type { StaffProfile, OrgUnit } from '@/types';

interface SpendingProfileItem {
  itemDescription: string;
  itemAmount: string;
}

export default function CashAdvanceForm() {
  const { session, user } = useAuth();
  const router = useRouter();

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
    applicantDate: new Date().toISOString().split('T')[0],
  });

  const [spendingProfile, setSpendingProfile] = useState<SpendingProfileItem[]>([
    { itemDescription: '', itemAmount: '' },
  ]);

  const [validationError, setValidationError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [profile, setProfile] = useState<{ staff: StaffProfile; orgUnit: OrgUnit } | null>(null);
  const [isLookingUp, setIsLookingUp] = useState(false);

  // Auto-populate from institutional email
  const lookupStaff = async (email: string) => {
    if (!email || !email.includes('@')) return;
    setIsLookingUp(true);
    try {
      const res = await fetch(`/api/staff/lookup?email=${encodeURIComponent(email)}`);
      const json = await res.json();
      if (json.success && json.data) {
        setProfile(json.data);
        const { staff, orgUnit } = json.data;
        setFormData((prev) => ({
          ...prev,
          fullName: staff.fullName?.toUpperCase() || prev.fullName,
          post: staff.designation || prev.post,
          department: orgUnit?.name || prev.department,
          email: staff.email || prev.email,
        }));
      }
    } catch {
      // Non-fatal
    } finally {
      setIsLookingUp(false);
    }
  };

  useEffect(() => {
    if (user?.email) {
      lookupStaff(user.email);
    }
  }, [user?.email]);

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError(null);

    const validationResult = cashAdvanceSchema.safeParse({
      ...formData,
      spendingProfile,
    });

    if (!validationResult.success) {
      const firstError = validationResult.error.errors[0]?.message || 'Please check form inputs';
      setValidationError(firstError);
      return;
    }

    setIsSubmitting(true);
    try {
      const totalAmount =
        spendingProfile.reduce((acc, item) => acc + (parseFloat(item.itemAmount) || 0), 0) ||
        parseFloat(formData.amountFigure) ||
        0;

      const res = await fetch('/api/submissions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          formType: 'cash-advance',
          submittedByEmail: formData.email,
          fundCode: '01', // Standard Recurrent Expenditure Vote for operational advances
          formData: {
            ...formData,
            spendingProfile,
            totalAmount,
            amount: totalAmount,
          },
          supportingDocuments: [],
        }),
      });

      const json = await res.json();
      if (res.ok && json.success && json.data) {
        router.push(
          `/department/submission-success?formType=cash-advance&ref=${json.data.referenceNumber}&id=${json.data.id}`
        );
      } else {
        setValidationError(json.error || 'Failed to submit form to Bursary backend');
      }
    } catch {
      setValidationError('Network error submitting form. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const centreCode = profile?.orgUnit?.centreCode || '694';
  const concatenatedCode = `01-${centreCode}`;

  return (
    <div className="max-w-4xl mx-auto space-y-4">
      <Link
        href="/department/dashboard"
        className="inline-flex items-center text-sm text-gray-600 hover:text-gray-900"
      >
        <ArrowLeft className="w-4 h-4 mr-1" />
        Back to Available Forms
      </Link>

      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <CardTitle>Cash Advance Form</CardTitle>
              <CardDescription>
                Request advance payment for official university activities
              </CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-500 font-medium">Accounting Vote:</span>
              <Badge variant="outline" className="font-mono text-xs px-2.5 py-1 bg-indigo-50 text-indigo-700 border-indigo-200 font-bold">
                {concatenatedCode}
              </Badge>
            </div>
          </div>
          {validationError && (
            <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-sm rounded-md mt-2">
              {validationError}
            </div>
          )}
        </CardHeader>
        <CardContent>
          {/* Institutional Auto-Population Snapshot Alert */}
          {profile && (
            <div className="mb-6 p-4 bg-emerald-50/70 border border-emerald-200 rounded-lg text-xs space-y-1">
              <div className="flex items-center justify-between font-semibold text-emerald-900">
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  Verified OAU Staff Credentials Auto-Populated
                </span>
                <span className="font-mono font-bold text-emerald-800">
                  Fund Code (01) + Centre Code ({centreCode}) &rarr; {concatenatedCode}
                </span>
              </div>
              <p className="text-emerald-800">
                Staff ID: <strong>{profile.staff.staffId}</strong> | NIN: <strong>{profile.staff.nin}</strong> | Salary: <strong>{profile.staff.salaryGrade} (St. {profile.staff.salaryStep})</strong>
              </p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Applicant Information */}
            <div className="space-y-4">
              <h3 className="font-semibold text-lg border-b pb-2">Applicant Information</h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Institutional Email (@oauife.edu.ng) *</Label>
                  <div className="flex gap-2">
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => handleChange('email', e.target.value)}
                      onBlur={(e) => lookupStaff(e.target.value)}
                      required
                    />
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => lookupStaff(formData.email)}
                      disabled={isLookingUp}
                      className="text-xs shrink-0"
                    >
                      {isLookingUp ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : 'Lookup'}
                    </Button>
                  </div>
                </div>

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
                    placeholder="e.g., Senior Lecturer"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="department">Department / Unit *</Label>
                  <Input
                    id="department"
                    value={formData.department}
                    onChange={(e) => handleChange('department', e.target.value)}
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
                    placeholder="e.g., OAU Campus Branch"
                    required
                  />
                </div>

                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="accountNumber">Account Number *</Label>
                  <Input
                    id="accountNumber"
                    value={formData.accountNumber}
                    onChange={(e) => handleChange('accountNumber', e.target.value)}
                    placeholder="10-digit NUBAN"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Advance Details */}
            <div className="space-y-4">
              <h3 className="font-semibold text-lg border-b pb-2">Advance Details</h3>

              <div className="space-y-2">
                <Label htmlFor="purpose">Purpose for which Advance is required *</Label>
                <Textarea
                  id="purpose"
                  value={formData.purpose}
                  onChange={(e) => handleChange('purpose', e.target.value)}
                  placeholder="Detailed justification of expenditure"
                  rows={3}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="accountToClear">Account to which Advance will be cleared *</Label>
                <Input
                  id="accountToClear"
                  value={formData.accountToClear}
                  onChange={(e) => handleChange('accountToClear', e.target.value)}
                  placeholder="e.g., Departmental Recurrent Vote (01-694)"
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="amountFigure">Amount in Figures (₦) *</Label>
                  <Input
                    id="amountFigure"
                    type="number"
                    value={formData.amountFigure}
                    onChange={(e) => handleChange('amountFigure', e.target.value)}
                    placeholder="150000"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="amountWords">Amount in Words *</Label>
                  <Input
                    id="amountWords"
                    value={formData.amountWords}
                    onChange={(e) => handleChange('amountWords', e.target.value)}
                    placeholder="e.g., One Hundred and Fifty Thousand Naira Only"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Spending Profile */}
            <div className="space-y-4">
              <div className="flex justify-between items-center border-b pb-2">
                <h3 className="font-semibold text-lg">Spending Profile (Itemized Breakdown)</h3>
                <Button type="button" onClick={addSpendingItem} size="sm" variant="outline">
                  <Plus className="w-4 h-4 mr-1" /> Add Line Item
                </Button>
              </div>

              <div className="space-y-3">
                {spendingProfile.map((item, index) => (
                  <div key={index} className="flex gap-4 items-start">
                    <div className="flex-1 space-y-1">
                      <Input
                        placeholder="Item Description (e.g. Conference Registration Fee)"
                        value={item.itemDescription}
                        onChange={(e) => updateSpendingItem(index, 'itemDescription', e.target.value)}
                        required
                      />
                    </div>
                    <div className="w-48 space-y-1">
                      <Input
                        type="number"
                        placeholder="Amount (₦)"
                        value={item.itemAmount}
                        onChange={(e) => updateSpendingItem(index, 'itemAmount', e.target.value)}
                        required
                      />
                    </div>
                    {spendingProfile.length > 1 && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => removeSpendingItem(index)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Endorsement Preview */}
            <div className="space-y-4">
              <h3 className="font-semibold text-lg border-b pb-2">Applicant Endorsement</h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="applicantSignature">Applicant Digital Signature (Full Name) *</Label>
                  <Input
                    id="applicantSignature"
                    value={formData.applicantSignature}
                    onChange={(e) => handleChange('applicantSignature', e.target.value)}
                    placeholder="Type your full legal name"
                    required
                  />
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

            <Button type="submit" disabled={isSubmitting} className="w-full bg-blue-600 hover:bg-blue-700">
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" /> Submitting to Bursary...
                </>
              ) : (
                'Submit Cash Advance Application'
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
