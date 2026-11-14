import { z } from 'zod';

export const expenditureItemSchema = z.object({
  description: z.string().min(1, 'Description is required'),
  estimatedCost: z.string().refine((val) => !isNaN(Number(val)) && Number(val) > 0, {
    message: 'Estimated cost must be greater than 0',
  }),
});

export const expenditureSchema = z.object({
  department: z.string().min(2, 'Department is required'),
  voteToBeCharged: z.string().min(2, 'Vote to be charged is required'),
  reasonForExpenditure: z.string().min(10, 'Reason must be at least 10 characters'),
  totalEstimatedCost: z.string().refine((val) => !isNaN(Number(val)) && Number(val) > 0, {
    message: 'Total estimated cost must be greater than 0',
  }),
  requestedBy: z.string().min(2, 'Requester name is required'),
  designation: z.string().min(2, 'Designation is required'),
  date: z.string().min(1, 'Date is required'),
  items: z.array(expenditureItemSchema).min(1, 'At least one item is required'),
});

export type ExpenditureFormValues = z.infer<typeof expenditureSchema>;
