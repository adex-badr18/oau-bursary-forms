import { useState } from 'react';
import { useNavigate, Link } from 'react-router';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../../components/ui/card';
import { Button } from '../../../components/ui/button';
import { Input } from '../../../components/ui/input';
import { Label } from '../../../components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../../components/ui/select';
import { Checkbox } from '../../../components/ui/checkbox';
import { useAuth } from '../../../contexts/AuthContext';
import { ArrowLeft, Plus, X } from 'lucide-react';

interface ImprestTransaction {
  voucherNo: string;
  bankCode: string;
  chequeNumber: string;
  transactionType: 'Receipt' | 'Payment';
  transactionDate: string;
  fundCode: string;
  costCentreCode: string;
  expenseCode: string;
  amountNaira: string;
  amountKobo: string;
  drCrIndicator: 'Dr' | 'Cr';
  batchNumber: string;
  sectionNumber: string;
  clerkNumber: string;
}

export default function ImprestHolderForm() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    period: '',
    facultyDeptService: user?.department || '',
    amountOfImprest: '',
    previousBalance: '',
    totalExpenditure: '',
    balanceInHand: '',
    imprestHolderSignature: '',
    receivedAttachedKobo: false,
  });

  const [transactions, setTransactions] = useState<ImprestTransaction[]>([
    { 
      voucherNo: '', 
      bankCode: '', 
      chequeNumber: '', 
      transactionType: 'Payment',
      transactionDate: '', 
      fundCode: '', 
      costCentreCode: '', 
      expenseCode: '', 
      amountNaira: '', 
      amountKobo: '', 
      drCrIndicator: 'Dr',
      batchNumber: '', 
      sectionNumber: '', 
      clerkNumber: '' 
    }
  ]);

  const handleChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  // Transaction handlers
  const addTransaction = () => {
    setTransactions([...transactions, { 
      voucherNo: '', 
      bankCode: '', 
      chequeNumber: '', 
      transactionType: 'Payment',
      transactionDate: '', 
      fundCode: '', 
      costCentreCode: '', 
      expenseCode: '', 
      amountNaira: '', 
      amountKobo: '', 
      drCrIndicator: 'Dr',
      batchNumber: '', 
      sectionNumber: '', 
      clerkNumber: '' 
    }]);
  };

  const removeTransaction = (index: number) => {
    if (transactions.length > 1) {
      setTransactions(transactions.filter((_, i) => i !== index));
    }
  };

  const updateTransaction = (index: number, field: keyof ImprestTransaction, value: any) => {
    const updated = [...transactions];
    updated[index][field] = value;
    setTransactions(updated);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    navigate('/department/submission-success', { 
      state: { 
        formType: 'imprest-holder', 
        formData: {
          ...formData,
          transactions
        }
      } 
    });
  };

  return (
    <div className="max-w-7xl mx-auto">
      <Link to="/department/dashboard" className="inline-flex items-center text-sm text-gray-600 hover:text-gray-900 mb-4">
        <ArrowLeft className="w-4 h-4 mr-1" />
        Back to Available Forms
      </Link>

      <Card>
        <CardHeader>
          <CardTitle>Imprest Holder's Receipts & Payments Summary</CardTitle>
          <CardDescription>
            Summary and reconciliation of imprest funds
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Basic Information */}
            <div className="space-y-4">
              <h3 className="font-semibold text-lg border-b pb-2">Imprest Account Details</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="period">Imprest Account for Period *</Label>
                  <Input
                    id="period"
                    value={formData.period}
                    onChange={(e) => handleChange('period', e.target.value)}
                    placeholder="e.g., Jan 2025 – Mar 2025"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="facultyDeptService">Faculty/Dept/Service/Activity *</Label>
                  <Input
                    id="facultyDeptService"
                    value={formData.facultyDeptService}
                    onChange={(e) => handleChange('facultyDeptService', e.target.value)}
                    placeholder="Dept of History"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="amountOfImprest">Amount of Imprest (₦) *</Label>
                  <Input
                    id="amountOfImprest"
                    type="number"
                    step="0.01"
                    value={formData.amountOfImprest}
                    onChange={(e) => handleChange('amountOfImprest', e.target.value)}
                    placeholder="300000.00"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="previousBalance">Balance in Hand Last Summary + Reimbursement (₦)</Label>
                  <Input
                    id="previousBalance"
                    type="number"
                    step="0.01"
                    value={formData.previousBalance}
                    onChange={(e) => handleChange('previousBalance', e.target.value)}
                    placeholder="0.00"
                  />
                </div>
              </div>
            </div>

            {/* Receipts & Payments Entries */}
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="font-semibold text-lg border-b pb-2">Receipts & Payments Entries</h3>
                <Button type="button" variant="outline" size="sm" onClick={addTransaction}>
                  <Plus className="w-4 h-4 mr-1" />
                  Add Transaction
                </Button>
              </div>

              <div className="overflow-x-auto">
                <div className="space-y-3">
                  {transactions.map((transaction, index) => (
                    <div key={index} className="p-4 border rounded-lg bg-gray-50">
                      <div className="flex justify-between items-center mb-3">
                        <span className="font-medium text-sm">Transaction #{index + 1}</span>
                        {transactions.length > 1 && (
                          <Button 
                            type="button" 
                            variant="ghost" 
                            size="sm"
                            onClick={() => removeTransaction(index)}
                          >
                            <X className="w-4 h-4" />
                          </Button>
                        )}
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-3">
                        <div className="space-y-1">
                          <Label htmlFor={`voucher-${index}`} className="text-sm">Voucher Number</Label>
                          <Input
                            id={`voucher-${index}`}
                            value={transaction.voucherNo}
                            onChange={(e) => updateTransaction(index, 'voucherNo', e.target.value)}
                            placeholder="V001"
                          />
                        </div>

                        <div className="space-y-1">
                          <Label htmlFor={`bank-${index}`} className="text-sm">Bank Code</Label>
                          <Input
                            id={`bank-${index}`}
                            value={transaction.bankCode}
                            onChange={(e) => updateTransaction(index, 'bankCode', e.target.value)}
                            placeholder="001"
                          />
                        </div>

                        <div className="space-y-1">
                          <Label htmlFor={`cheque-${index}`} className="text-sm">Cheque Number</Label>
                          <Input
                            id={`cheque-${index}`}
                            value={transaction.chequeNumber}
                            onChange={(e) => updateTransaction(index, 'chequeNumber', e.target.value)}
                            placeholder="CHQ001"
                          />
                        </div>

                        <div className="space-y-1">
                          <Label htmlFor={`type-${index}`} className="text-sm">Type</Label>
                          <Select 
                            value={transaction.transactionType} 
                            onValueChange={(value: 'Receipt' | 'Payment') => updateTransaction(index, 'transactionType', value)}
                          >
                            <SelectTrigger id={`type-${index}`}>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="Receipt">Receipt</SelectItem>
                              <SelectItem value="Payment">Payment</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        <div className="space-y-1">
                          <Label htmlFor={`date-${index}`} className="text-sm">Date</Label>
                          <Input
                            id={`date-${index}`}
                            type="date"
                            value={transaction.transactionDate}
                            onChange={(e) => updateTransaction(index, 'transactionDate', e.target.value)}
                          />
                        </div>

                        <div className="space-y-1">
                          <Label htmlFor={`fund-${index}`} className="text-sm">Fund Code</Label>
                          <Input
                            id={`fund-${index}`}
                            value={transaction.fundCode}
                            onChange={(e) => updateTransaction(index, 'fundCode', e.target.value)}
                            placeholder="001"
                          />
                        </div>

                        <div className="space-y-1">
                          <Label htmlFor={`cost-${index}`} className="text-sm">Cost Centre</Label>
                          <Input
                            id={`cost-${index}`}
                            value={transaction.costCentreCode}
                            onChange={(e) => updateTransaction(index, 'costCentreCode', e.target.value)}
                            placeholder="1234"
                          />
                        </div>

                        <div className="space-y-1">
                          <Label htmlFor={`expense-${index}`} className="text-sm">Expense Code</Label>
                          <Input
                            id={`expense-${index}`}
                            value={transaction.expenseCode}
                            onChange={(e) => updateTransaction(index, 'expenseCode', e.target.value)}
                            placeholder="5600"
                          />
                        </div>

                        <div className="space-y-1">
                          <Label htmlFor={`naira-${index}`} className="text-sm">Amount (N)</Label>
                          <Input
                            id={`naira-${index}`}
                            type="number"
                            value={transaction.amountNaira}
                            onChange={(e) => updateTransaction(index, 'amountNaira', e.target.value)}
                            placeholder="0"
                          />
                        </div>

                        <div className="space-y-1">
                          <Label htmlFor={`kobo-${index}`} className="text-sm">Amount (Kobo)</Label>
                          <Input
                            id={`kobo-${index}`}
                            type="number"
                            value={transaction.amountKobo}
                            onChange={(e) => updateTransaction(index, 'amountKobo', e.target.value)}
                            placeholder="00"
                            max="99"
                          />
                        </div>

                        <div className="space-y-1">
                          <Label htmlFor={`drcr-${index}`} className="text-sm">Dr/Cr</Label>
                          <Select 
                            value={transaction.drCrIndicator} 
                            onValueChange={(value: 'Dr' | 'Cr') => updateTransaction(index, 'drCrIndicator', value)}
                          >
                            <SelectTrigger id={`drcr-${index}`}>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="Dr">Dr</SelectItem>
                              <SelectItem value="Cr">Cr</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        <div className="space-y-1">
                          <Label htmlFor={`batch-${index}`} className="text-sm">Batch Number</Label>
                          <Input
                            id={`batch-${index}`}
                            value={transaction.batchNumber}
                            onChange={(e) => updateTransaction(index, 'batchNumber', e.target.value)}
                            placeholder="B001"
                          />
                        </div>

                        <div className="space-y-1">
                          <Label htmlFor={`section-${index}`} className="text-sm">Section Number</Label>
                          <Input
                            id={`section-${index}`}
                            value={transaction.sectionNumber}
                            onChange={(e) => updateTransaction(index, 'sectionNumber', e.target.value)}
                            placeholder="S001"
                          />
                        </div>

                        <div className="space-y-1">
                          <Label htmlFor={`clerk-${index}`} className="text-sm">Clerk Number</Label>
                          <Input
                            id={`clerk-${index}`}
                            value={transaction.clerkNumber}
                            onChange={(e) => updateTransaction(index, 'clerkNumber', e.target.value)}
                            placeholder="C001"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Summary Calculations */}
            <div className="space-y-4">
              <h3 className="font-semibold text-lg border-b pb-2">Financial Summary</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="totalExpenditure">Less Total Expenditure (₦)</Label>
                  <Input
                    id="totalExpenditure"
                    type="number"
                    step="0.01"
                    value={formData.totalExpenditure}
                    onChange={(e) => handleChange('totalExpenditure', e.target.value)}
                    placeholder="0.00"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="balanceInHand">Balance in Hand (₦)</Label>
                  <Input
                    id="balanceInHand"
                    type="number"
                    step="0.01"
                    value={formData.balanceInHand}
                    onChange={(e) => handleChange('balanceInHand', e.target.value)}
                    placeholder="0.00"
                  />
                </div>
              </div>
            </div>

            {/* Signatures */}
            <div className="space-y-4">
              <h3 className="font-semibold text-lg border-b pb-2">Signatures & Certification</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="imprestHolderSignature">Imprest Holder Signature *</Label>
                  <Input
                    id="imprestHolderSignature"
                    value={formData.imprestHolderSignature}
                    onChange={(e) => handleChange('imprestHolderSignature', e.target.value)}
                    placeholder="Type your full name as signature"
                    required
                  />
                  <p className="text-xs text-gray-500">Type your full name to serve as your digital signature</p>
                </div>
              </div>

              <div className="flex items-center space-x-2 p-4 bg-blue-50 rounded-lg">
                <Checkbox
                  id="receivedAttachedKobo"
                  checked={formData.receivedAttachedKobo}
                  onCheckedChange={(checked) => handleChange('receivedAttachedKobo', checked)}
                />
                <Label htmlFor="receivedAttachedKobo" className="cursor-pointer">
                  K Received Attached
                </Label>
              </div>

              <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg">
                <p className="text-sm text-amber-800">
                  <strong>Note:</strong> The following will be completed by the Bursary office during processing:
                </p>
                <ul className="text-sm text-amber-700 mt-2 ml-4 list-disc">
                  <li>Head of Department/Service Signature</li>
                  <li>Checked By (Bursary)</li>
                  <li>Passed for Payment (Cash Section)</li>
                  <li>Cheque No. Issued</li>
                  <li>Cash Section Signature</li>
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