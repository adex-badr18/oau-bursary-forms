'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/context/AuthContext';
import { ArrowLeft, Plus, X } from 'lucide-react';

interface JourneyEntry {
  journeyDate: string;
  journeyDetails: string;
  journeyReason: string;
  nightCount: string;
}

interface SubsistenceCategory {
  category: string;
  allowanceRate: string;
  nightsCount: string;
}

export default function DutyMileageForm() {
  const { user } = useAuth();
  const router = useRouter();

  const [formData, setFormData] = useState({
    vehicleNumber: '',
    officerGradeLevel: '',
    bankName: '',
    accountNumber: '',
    totalMileageDistance: '',
    totalMileageAmount: '',
    hotelIncidentalMax: '',
    claimantName: user?.name || '',
    claimantSignature: '',
  });

  const [journeyEntries, setJourneyEntries] = useState<JourneyEntry[]>([
    { journeyDate: '', journeyDetails: '', journeyReason: '', nightCount: '' }
  ]);

  const [subsistenceAllowance, setSubsistenceAllowance] = useState<SubsistenceCategory[]>([
    { category: '', allowanceRate: '', nightsCount: '' }
  ]);

  const handleChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  // Journey Entries handlers
  const addJourneyEntry = () => {
    setJourneyEntries([...journeyEntries, { journeyDate: '', journeyDetails: '', journeyReason: '', nightCount: '' }]);
  };

  const removeJourneyEntry = (index: number) => {
    if (journeyEntries.length > 1) {
      setJourneyEntries(journeyEntries.filter((_, i) => i !== index));
    }
  };

  const updateJourneyEntry = (index: number, field: keyof JourneyEntry, value: string) => {
    const updated = [...journeyEntries];
    updated[index][field] = value;
    setJourneyEntries(updated);
  };

  // Subsistence Allowance handlers
  const addSubsistenceCategory = () => {
    setSubsistenceAllowance([...subsistenceAllowance, { category: '', allowanceRate: '', nightsCount: '' }]);
  };

  const removeSubsistenceCategory = (index: number) => {
    if (subsistenceAllowance.length > 1) {
      setSubsistenceAllowance(subsistenceAllowance.filter((_, i) => i !== index));
    }
  };

  const updateSubsistenceCategory = (index: number, field: keyof SubsistenceCategory, value: string) => {
    const updated = [...subsistenceAllowance];
    updated[index][field] = value;
    setSubsistenceAllowance(updated);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const ref = `DM-2026-${String(Math.floor(Math.random() * 9999)).padStart(4, '0')}`;
    router.push(`/department/submission-success?formType=duty-mileage&ref=${ref}`);
  };

  return (
    <div className="max-w-6xl mx-auto">
      <Link href="/department/dashboard" className="inline-flex items-center text-sm text-gray-600 hover:text-gray-900 mb-4">
        <ArrowLeft className="w-4 h-4 mr-1" />
        Back to Available Forms
      </Link>

      <Card>
        <CardHeader>
          <CardTitle>Duty Mileage & Subsistence Allowance Claim Form</CardTitle>
          <CardDescription>
            Claim reimbursement for official travel and subsistence
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Basic Information */}
            <div className="space-y-4">
              <h3 className="font-semibold text-lg border-b pb-2">Claimant Information</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="vehicleNumber">Vehicle Number *</Label>
                  <Input
                    id="vehicleNumber"
                    value={formData.vehicleNumber}
                    onChange={(e) => handleChange('vehicleNumber', e.target.value)}
                    placeholder="ABC 123 XYZ"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="officerGradeLevel">Officer's Grade Level *</Label>
                  <Input
                    id="officerGradeLevel"
                    value={formData.officerGradeLevel}
                    onChange={(e) => handleChange('officerGradeLevel', e.target.value)}
                    placeholder="e.g., CONUASS 6"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="bankName">Bank Name *</Label>
                  <Input
                    id="bankName"
                    value={formData.bankName}
                    onChange={(e) => handleChange('bankName', e.target.value)}
                    placeholder="Bank Name"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="accountNumber">Account Number *</Label>
                  <Input
                    id="accountNumber"
                    value={formData.accountNumber}
                    onChange={(e) => handleChange('accountNumber', e.target.value)}
                    placeholder="0123456789"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Journey Entries */}
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="font-semibold text-lg border-b pb-2">Journey Entries</h3>
                <Button type="button" variant="outline" size="sm" onClick={addJourneyEntry}>
                  <Plus className="w-4 h-4 mr-1" />
                  Add Journey
                </Button>
              </div>

              <div className="space-y-3">
                {journeyEntries.map((entry, index) => (
                  <div key={index} className="p-4 border rounded-lg bg-gray-50">
                    <div className="flex justify-between items-center mb-3">
                      <span className="font-medium text-sm">Journey #{index + 1}</span>
                      {journeyEntries.length > 1 && (
                        <Button 
                          type="button" 
                          variant="ghost" 
                          size="sm"
                          onClick={() => removeJourneyEntry(index)}
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      )}
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                      <div className="space-y-1">
                        <Label htmlFor={`journey-date-${index}`} className="text-sm">Date *</Label>
                        <Input
                          id={`journey-date-${index}`}
                          type="date"
                          value={entry.journeyDate}
                          onChange={(e) => updateJourneyEntry(index, 'journeyDate', e.target.value)}
                          required
                        />
                      </div>
                      <div className="space-y-1 md:col-span-2">
                        <Label htmlFor={`journey-details-${index}`} className="text-sm">Journey *</Label>
                        <Input
                          id={`journey-details-${index}`}
                          value={entry.journeyDetails}
                          onChange={(e) => updateJourneyEntry(index, 'journeyDetails', e.target.value)}
                          placeholder="e.g., Lagos to Abuja"
                          required
                        />
                      </div>
                      <div className="space-y-1">
                        <Label htmlFor={`journey-night-${index}`} className="text-sm">Night (Number)</Label>
                        <Input
                          id={`journey-night-${index}`}
                          type="number"
                          value={entry.nightCount}
                          onChange={(e) => updateJourneyEntry(index, 'nightCount', e.target.value)}
                          placeholder="0"
                        />
                      </div>
                      <div className="space-y-1 md:col-span-4">
                        <Label htmlFor={`journey-reason-${index}`} className="text-sm">Reason *</Label>
                        <Input
                          id={`journey-reason-${index}`}
                          value={entry.journeyReason}
                          onChange={(e) => updateJourneyEntry(index, 'journeyReason', e.target.value)}
                          placeholder="Purpose of journey"
                          required
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Subsistence Allowance Categories */}
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="font-semibold text-lg border-b pb-2">Subsistence Allowance Categories</h3>
                <Button type="button" variant="outline" size="sm" onClick={addSubsistenceCategory}>
                  <Plus className="w-4 h-4 mr-1" />
                  Add Category
                </Button>
              </div>

              <div className="space-y-3">
                {subsistenceAllowance.map((category, index) => (
                  <div key={index} className="flex gap-2 items-start p-3 border rounded-lg bg-gray-50">
                    <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-3">
                      <div className="space-y-1">
                        <Label htmlFor={`cat-name-${index}`} className="text-sm">Category (e.g., CONTISS 1–3)</Label>
                        <Input
                          id={`cat-name-${index}`}
                          value={category.category}
                          onChange={(e) => updateSubsistenceCategory(index, 'category', e.target.value)}
                          placeholder="CONTISS 1–3"
                        />
                      </div>
                      <div className="space-y-1">
                        <Label htmlFor={`cat-rate-${index}`} className="text-sm">Allowance (per night, ₦)</Label>
                        <Input
                          id={`cat-rate-${index}`}
                          type="number"
                          step="0.01"
                          value={category.allowanceRate}
                          onChange={(e) => updateSubsistenceCategory(index, 'allowanceRate', e.target.value)}
                          placeholder="0.00"
                        />
                      </div>
                      <div className="space-y-1">
                        <Label htmlFor={`cat-nights-${index}`} className="text-sm">No. of Nights</Label>
                        <Input
                          id={`cat-nights-${index}`}
                          type="number"
                          value={category.nightsCount}
                          onChange={(e) => updateSubsistenceCategory(index, 'nightsCount', e.target.value)}
                          placeholder="0"
                        />
                      </div>
                    </div>
                    {subsistenceAllowance.length > 1 && (
                      <Button 
                        type="button" 
                        variant="ghost" 
                        size="sm"
                        onClick={() => removeSubsistenceCategory(index)}
                        className="mt-6"
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Mileage & Hotel Summary */}
            <div className="space-y-4">
              <h3 className="font-semibold text-lg border-b pb-2">Mileage & Allowance Summary</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="totalMileageDistance">Total Distance (km)</Label>
                  <Input
                    id="totalMileageDistance"
                    type="number"
                    step="0.1"
                    value={formData.totalMileageDistance}
                    onChange={(e) => handleChange('totalMileageDistance', e.target.value)}
                    placeholder="0.0"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="totalMileageAmount">Total Mileage Allowance (₦)</Label>
                  <Input
                    id="totalMileageAmount"
                    type="number"
                    step="0.01"
                    value={formData.totalMileageAmount}
                    onChange={(e) => handleChange('totalMileageAmount', e.target.value)}
                    placeholder="0.00"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="hotelIncidentalMax">Hotel/Incidental Max (₦)</Label>
                  <Input
                    id="hotelIncidentalMax"
                    type="number"
                    step="0.01"
                    value={formData.hotelIncidentalMax}
                    onChange={(e) => handleChange('hotelIncidentalMax', e.target.value)}
                    placeholder="0.00"
                  />
                </div>
              </div>
            </div>

            {/* Claimant Signature */}
            <div className="space-y-4">
              <h3 className="font-semibold text-lg border-b pb-2">Claimant Declaration</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="claimantName">Name of Claimant *</Label>
                  <Input
                    id="claimantName"
                    value={formData.claimantName}
                    onChange={(e) => handleChange('claimantName', e.target.value)}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="claimantSignature">Signature of Claimant *</Label>
                  <Input
                    id="claimantSignature"
                    value={formData.claimantSignature}
                    onChange={(e) => handleChange('claimantSignature', e.target.value)}
                    placeholder="Type your full name as signature"
                    required
                  />
                  <p className="text-xs text-gray-500">Type your full name to serve as your digital signature</p>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex justify-end gap-4 pt-4">
              <Link href="/department/dashboard">
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