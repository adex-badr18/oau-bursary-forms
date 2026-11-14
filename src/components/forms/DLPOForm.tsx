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

interface OrderItem {
  itemNo: string;
  qty: string;
  description: string;
  rate: string;
  amount: string;
  remarks: string;
}

interface DeliveryRecord {
  deliveryDate: string;
  itemNo: string;
  qtyDelivered: string;
  signature: string;
}

interface OutstandingCommitment {
  itemNo: string;
  value: string;
  termOrMonth: string;
}

export default function DLPOForm() {
  const { user } = useAuth();
  const router = useRouter();

  const [formData, setFormData] = useState({
    dlpoNumber: '',
    supplyTo: '',
    facility: '',
    department: user?.department || '',
    campus: '',
    deliveryDateRequired: '',
    quotationDate: '',
    totalAmount: '',
    headSignature: '',
    headDate: '',
  });

  const [orderItems, setOrderItems] = useState<OrderItem[]>([
    { itemNo: '', qty: '', description: '', rate: '', amount: '', remarks: '' }
  ]);

  const [deliveryRecords, setDeliveryRecords] = useState<DeliveryRecord[]>([
    { deliveryDate: '', itemNo: '', qtyDelivered: '', signature: '' }
  ]);

  const [outstandingCommitments, setOutstandingCommitments] = useState<OutstandingCommitment[]>([
    { itemNo: '', value: '', termOrMonth: '' }
  ]);

  const handleChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  // Order Items handlers
  const addOrderItem = () => {
    setOrderItems([...orderItems, { itemNo: '', qty: '', description: '', rate: '', amount: '', remarks: '' }]);
  };

  const removeOrderItem = (index: number) => {
    if (orderItems.length > 1) {
      setOrderItems(orderItems.filter((_, i) => i !== index));
      calculateTotal();
    }
  };

  const updateOrderItem = (index: number, field: keyof OrderItem, value: string) => {
    const updated = [...orderItems];
    updated[index][field] = value;
    
    // Auto-calculate amount when qty or rate changes
    if (field === 'qty' || field === 'rate') {
      const qty = parseFloat(field === 'qty' ? value : updated[index].qty) || 0;
      const rate = parseFloat(field === 'rate' ? value : updated[index].rate) || 0;
      updated[index].amount = (qty * rate).toFixed(2);
    }
    
    setOrderItems(updated);
    calculateTotal();
  };

  const calculateTotal = () => {
    const total = orderItems.reduce((sum, item) => sum + (parseFloat(item.amount) || 0), 0);
    setFormData(prev => ({ ...prev, totalAmount: total.toFixed(2) }));
  };

  // Delivery Records handlers
  const addDeliveryRecord = () => {
    setDeliveryRecords([...deliveryRecords, { deliveryDate: '', itemNo: '', qtyDelivered: '', signature: '' }]);
  };

  const removeDeliveryRecord = (index: number) => {
    if (deliveryRecords.length > 1) {
      setDeliveryRecords(deliveryRecords.filter((_, i) => i !== index));
    }
  };

  const updateDeliveryRecord = (index: number, field: keyof DeliveryRecord, value: string) => {
    const updated = [...deliveryRecords];
    updated[index][field] = value;
    setDeliveryRecords(updated);
  };

  // Outstanding Commitments handlers
  const addOutstandingCommitment = () => {
    setOutstandingCommitments([...outstandingCommitments, { itemNo: '', value: '', termOrMonth: '' }]);
  };

  const removeOutstandingCommitment = (index: number) => {
    if (outstandingCommitments.length > 1) {
      setOutstandingCommitments(outstandingCommitments.filter((_, i) => i !== index));
    }
  };

  const updateOutstandingCommitment = (index: number, field: keyof OutstandingCommitment, value: string) => {
    const updated = [...outstandingCommitments];
    updated[index][field] = value;
    setOutstandingCommitments(updated);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const ref = `DLPO-2026-${String(Math.floor(Math.random() * 9999)).padStart(4, '0')}`;
    router.push(`/department/submission-success?formType=dlpo&ref=${ref}`);
  };

  return (
    <div className="max-w-6xl mx-auto">
      <Link href="/department/dashboard" className="inline-flex items-center text-sm text-gray-600 hover:text-gray-900 mb-4">
        <ArrowLeft className="w-4 h-4 mr-1" />
        Back to Available Forms
      </Link>

      <Card>
        <CardHeader>
          <CardTitle>Departmental Local Purchase Order (DLPO)</CardTitle>
          <CardDescription>
            Submit purchase orders for departmental procurement
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Basic Information */}
            <div className="space-y-4">
              <h3 className="font-semibold text-lg border-b pb-2">Purchase Order Information</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="dlpoNumber">DLPO No *</Label>
                  <Input
                    id="dlpoNumber"
                    value={formData.dlpoNumber}
                    onChange={(e) => handleChange('dlpoNumber', e.target.value)}
                    placeholder="52080"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="supplyTo">Supply to *</Label>
                  <Input
                    id="supplyTo"
                    value={formData.supplyTo}
                    onChange={(e) => handleChange('supplyTo', e.target.value)}
                    placeholder="Department of Physics"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="facility">Facility *</Label>
                  <Input
                    id="facility"
                    value={formData.facility}
                    onChange={(e) => handleChange('facility', e.target.value)}
                    placeholder="Main Store"
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
                  <Label htmlFor="campus">Campus *</Label>
                  <Input
                    id="campus"
                    value={formData.campus}
                    onChange={(e) => handleChange('campus', e.target.value)}
                    placeholder="Main"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="deliveryDateRequired">Delivery Date Required *</Label>
                  <Input
                    id="deliveryDateRequired"
                    type="date"
                    value={formData.deliveryDateRequired}
                    onChange={(e) => handleChange('deliveryDateRequired', e.target.value)}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="quotationDate">Quotation Date *</Label>
                  <Input
                    id="quotationDate"
                    type="date"
                    value={formData.quotationDate}
                    onChange={(e) => handleChange('quotationDate', e.target.value)}
                    required
                  />
                </div>
              </div>
            </div>

            {/* Order Items */}
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="font-semibold text-lg border-b pb-2">Order Items</h3>
                <Button type="button" variant="outline" size="sm" onClick={addOrderItem}>
                  <Plus className="w-4 h-4 mr-1" />
                  Add Item
                </Button>
              </div>

              <div className="space-y-3">
                {orderItems.map((item, index) => (
                  <div key={index} className="p-4 border rounded-lg bg-gray-50">
                    <div className="flex justify-between items-center mb-3">
                      <span className="font-medium text-sm">Item #{index + 1}</span>
                      {orderItems.length > 1 && (
                        <Button 
                          type="button" 
                          variant="ghost" 
                          size="sm"
                          onClick={() => removeOrderItem(index)}
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      )}
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-6 gap-3">
                      <div className="space-y-1">
                        <Label htmlFor={`item-no-${index}`} className="text-sm">Item No *</Label>
                        <Input
                          id={`item-no-${index}`}
                          value={item.itemNo}
                          onChange={(e) => updateOrderItem(index, 'itemNo', e.target.value)}
                          placeholder="1"
                          required
                        />
                      </div>
                      <div className="space-y-1">
                        <Label htmlFor={`qty-${index}`} className="text-sm">Quantity *</Label>
                        <Input
                          id={`qty-${index}`}
                          type="number"
                          value={item.qty}
                          onChange={(e) => updateOrderItem(index, 'qty', e.target.value)}
                          placeholder="10"
                          required
                        />
                      </div>
                      <div className="space-y-1 md:col-span-2">
                        <Label htmlFor={`desc-${index}`} className="text-sm">Description *</Label>
                        <Input
                          id={`desc-${index}`}
                          value={item.description}
                          onChange={(e) => updateOrderItem(index, 'description', e.target.value)}
                          placeholder="Item description"
                          required
                        />
                      </div>
                      <div className="space-y-1">
                        <Label htmlFor={`rate-${index}`} className="text-sm">Rate (₦) *</Label>
                        <Input
                          id={`rate-${index}`}
                          type="number"
                          step="0.01"
                          value={item.rate}
                          onChange={(e) => updateOrderItem(index, 'rate', e.target.value)}
                          placeholder="0.00"
                          required
                        />
                      </div>
                      <div className="space-y-1">
                        <Label htmlFor={`amount-${index}`} className="text-sm">Amount (₦)</Label>
                        <Input
                          id={`amount-${index}`}
                          value={item.amount}
                          readOnly
                          className="bg-gray-100"
                        />
                      </div>
                      <div className="space-y-1 md:col-span-6">
                        <Label htmlFor={`remarks-${index}`} className="text-sm">Remarks</Label>
                        <Input
                          id={`remarks-${index}`}
                          value={item.remarks}
                          onChange={(e) => updateOrderItem(index, 'remarks', e.target.value)}
                          placeholder="Additional notes"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex justify-end">
                <div className="w-64 p-3 bg-blue-50 rounded-lg">
                  <div className="flex justify-between items-center">
                    <span className="font-semibold">Total Amount:</span>
                    <span className="text-lg font-bold">₦ {formData.totalAmount || '0.00'}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Delivery Records */}
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="font-semibold text-lg border-b pb-2">Delivery Records</h3>
                <Button type="button" variant="outline" size="sm" onClick={addDeliveryRecord}>
                  <Plus className="w-4 h-4 mr-1" />
                  Add Record
                </Button>
              </div>

              <div className="space-y-3">
                {deliveryRecords.map((record, index) => (
                  <div key={index} className="flex gap-2 items-start p-3 border rounded-lg bg-gray-50">
                    <div className="flex-1 grid grid-cols-1 md:grid-cols-4 gap-3">
                      <div className="space-y-1">
                        <Label htmlFor={`del-date-${index}`} className="text-sm">Date</Label>
                        <Input
                          id={`del-date-${index}`}
                          type="date"
                          value={record.deliveryDate}
                          onChange={(e) => updateDeliveryRecord(index, 'deliveryDate', e.target.value)}
                        />
                      </div>
                      <div className="space-y-1">
                        <Label htmlFor={`del-item-${index}`} className="text-sm">Item No</Label>
                        <Input
                          id={`del-item-${index}`}
                          value={record.itemNo}
                          onChange={(e) => updateDeliveryRecord(index, 'itemNo', e.target.value)}
                          placeholder="1"
                        />
                      </div>
                      <div className="space-y-1">
                        <Label htmlFor={`del-qty-${index}`} className="text-sm">Quantity Delivered</Label>
                        <Input
                          id={`del-qty-${index}`}
                          type="number"
                          value={record.qtyDelivered}
                          onChange={(e) => updateDeliveryRecord(index, 'qtyDelivered', e.target.value)}
                          placeholder="0"
                        />
                      </div>
                      <div className="space-y-1">
                        <Label htmlFor={`del-sig-${index}`} className="text-sm">Signature</Label>
                        <Input
                          id={`del-sig-${index}`}
                          value={record.signature}
                          onChange={(e) => updateDeliveryRecord(index, 'signature', e.target.value)}
                          placeholder="Full name"
                        />
                      </div>
                    </div>
                    {deliveryRecords.length > 1 && (
                      <Button 
                        type="button" 
                        variant="ghost" 
                        size="sm"
                        onClick={() => removeDeliveryRecord(index)}
                        className="mt-6"
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Outstanding Commitments */}
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="font-semibold text-lg border-b pb-2">Outstanding Commitments</h3>
                <Button type="button" variant="outline" size="sm" onClick={addOutstandingCommitment}>
                  <Plus className="w-4 h-4 mr-1" />
                  Add Commitment
                </Button>
              </div>

              <div className="space-y-3">
                {outstandingCommitments.map((commitment, index) => (
                  <div key={index} className="flex gap-2 items-start p-3 border rounded-lg bg-gray-50">
                    <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-3">
                      <div className="space-y-1">
                        <Label htmlFor={`comm-item-${index}`} className="text-sm">Item No</Label>
                        <Input
                          id={`comm-item-${index}`}
                          value={commitment.itemNo}
                          onChange={(e) => updateOutstandingCommitment(index, 'itemNo', e.target.value)}
                          placeholder="1"
                        />
                      </div>
                      <div className="space-y-1">
                        <Label htmlFor={`comm-value-${index}`} className="text-sm">Value (₦)</Label>
                        <Input
                          id={`comm-value-${index}`}
                          type="number"
                          step="0.01"
                          value={commitment.value}
                          onChange={(e) => updateOutstandingCommitment(index, 'value', e.target.value)}
                          placeholder="0.00"
                        />
                      </div>
                      <div className="space-y-1">
                        <Label htmlFor={`comm-term-${index}`} className="text-sm">Term/Month</Label>
                        <Input
                          id={`comm-term-${index}`}
                          value={commitment.termOrMonth}
                          onChange={(e) => updateOutstandingCommitment(index, 'termOrMonth', e.target.value)}
                          placeholder="e.g., Jan 2025"
                        />
                      </div>
                    </div>
                    {outstandingCommitments.length > 1 && (
                      <Button 
                        type="button" 
                        variant="ghost" 
                        size="sm"
                        onClick={() => removeOutstandingCommitment(index)}
                        className="mt-6"
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Authorization */}
            <div className="space-y-4">
              <h3 className="font-semibold text-lg border-b pb-2">Authorization</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="headSignature">Head of Dept/Service Signature *</Label>
                  <Input
                    id="headSignature"
                    value={formData.headSignature}
                    onChange={(e) => handleChange('headSignature', e.target.value)}
                    placeholder="Type your full name as signature"
                    required
                  />
                  <p className="text-xs text-gray-500">Type your full name to serve as your digital signature</p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="headDate">Date *</Label>
                  <Input
                    id="headDate"
                    type="date"
                    value={formData.headDate}
                    onChange={(e) => handleChange('headDate', e.target.value)}
                    required
                  />
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