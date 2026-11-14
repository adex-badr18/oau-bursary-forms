import { z } from 'zod';

export const departmentLoginSchema = z.object({
  departmentId: z.string().min(1, 'Please select a department'),
  staffId: z.string().min(3, 'Staff ID must be at least 3 characters'),
  pin: z.string().min(4, 'PIN must be at least 4 digits'),
});

export type DepartmentLoginFormValues = z.infer<typeof departmentLoginSchema>;

export const bursaryLoginSchema = z.object({
  email: z.string().email('Please enter a valid university email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

export type BursaryLoginFormValues = z.infer<typeof bursaryLoginSchema>;
