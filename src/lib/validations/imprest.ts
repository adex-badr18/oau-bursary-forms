import { z } from 'zod';

export const imprestDisbursementSchema = z.object({
  date: z.string().min(1, 'Date is required'),
  voucherNo: z.string().min(1, 'Voucher number is required'),
  toWhomPaid: z.string().min(1, 'Payee is required'),
  particulars: z.string().min(1, 'Particulars are required'),
  amount: z.string().refine((val) => !isNaN(Number(val)) && Number(val) > 0, {
    message: 'Amount must be greater than 0',
  }),
});

export const imprestSchema = z.object({
  department: z.string().min(2, 'Department is required'),
  imprestHolderName: z.string().min(2, 'Holder name is required'),
  post: z.string().min(2, 'Post is required'),
  originalAmountApproved: z.string().refine((val) => !isNaN(Number(val)) && Number(val) > 0, {
    message: 'Amount must be greater than 0',
  }),
  periodCoveredFrom: z.string().min(1, 'Start date is required'),
  periodCoveredTo: z.string().min(1, 'End date is required'),
  disbursements: z.array(imprestDisbursementSchema).min(1, 'At least one disbursement is required'),
  cashOnHand: z.string().refine((val) => !isNaN(Number(val)) && Number(val) >= 0, {
    message: 'Cash on hand must be 0 or more',
  }),
  holderSignature: z.string().min(2, 'Signature is required'),
  date: z.string().min(1, 'Date is required'),
});

export type ImprestFormValues = z.infer<typeof imprestSchema>;
