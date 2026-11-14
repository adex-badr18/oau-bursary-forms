import { z } from 'zod';

export const spendingProfileItemSchema = z.object({
  itemDescription: z.string().min(1, 'Item description is required'),
  itemAmount: z.string().refine((val) => !isNaN(Number(val)) && Number(val) > 0, {
    message: 'Amount must be greater than 0',
  }),
});

export const cashAdvanceSchema = z.object({
  fullName: z.string().min(2, 'Full name is required'),
  post: z.string().min(2, 'Designation / Post is required'),
  department: z.string().min(2, 'Department is required'),
  bankName: z.string().min(2, 'Bank name is required'),
  bankBranch: z.string().min(2, 'Bank branch is required'),
  accountNumber: z.string().regex(/^\d{10}$/, 'Account number must be 10 digits'),
  email: z.string().email('Please enter a valid email address'),
  purpose: z.string().min(10, 'Purpose must be at least 10 characters'),
  accountToClear: z.string().min(2, 'Account to be cleared is required'),
  amountFigure: z.string().refine((val) => !isNaN(Number(val)) && Number(val) > 0, {
    message: 'Amount must be greater than 0',
  }),
  amountWords: z.string().min(5, 'Amount in words is required'),
  applicantSignature: z.string().min(2, 'Signature is required'),
  applicantDate: z.string().min(1, 'Date is required'),
  spendingProfile: z.array(spendingProfileItemSchema).min(1, 'At least one spending item is required'),
});

export type CashAdvanceFormValues = z.infer<typeof cashAdvanceSchema>;
