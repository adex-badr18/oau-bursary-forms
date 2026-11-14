import { z } from 'zod';

export const dlpoItemSchema = z.object({
  itemDescription: z.string().min(1, 'Item description is required'),
  quantity: z.string().refine((val) => !isNaN(Number(val)) && Number(val) > 0, {
    message: 'Quantity must be at least 1',
  }),
  rate: z.string().refine((val) => !isNaN(Number(val)) && Number(val) > 0, {
    message: 'Rate must be greater than 0',
  }),
  amount: z.string().optional(),
});

export const dlpoSchema = z.object({
  department: z.string().min(2, 'Department is required'),
  supplierName: z.string().min(2, 'Supplier name is required'),
  supplierAddress: z.string().min(5, 'Supplier address is required'),
  supplierPhone: z.string().min(7, 'Supplier phone is required'),
  date: z.string().min(1, 'Date is required'),
  deliveryAddress: z.string().min(5, 'Delivery address is required'),
  departmentalVote: z.string().min(2, 'Departmental Vote is required'),
  hodName: z.string().min(2, 'Head of Department name is required'),
  hodSignature: z.string().min(2, 'Head of Department signature is required'),
  items: z.array(dlpoItemSchema).min(1, 'At least one item is required'),
});

export type DLPOFormValues = z.infer<typeof dlpoSchema>;
