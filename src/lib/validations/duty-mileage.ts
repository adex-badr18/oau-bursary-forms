import { z } from 'zod';

export const journeyEntrySchema = z.object({
  date: z.string().min(1, 'Date is required'),
  from: z.string().min(1, 'Departure location is required'),
  to: z.string().min(1, 'Destination is required'),
  purpose: z.string().min(1, 'Purpose is required'),
  distanceKm: z.string().refine((val) => !isNaN(Number(val)) && Number(val) > 0, {
    message: 'Distance must be greater than 0',
  }),
  ratePerKm: z.string().refine((val) => !isNaN(Number(val)) && Number(val) > 0, {
    message: 'Rate must be greater than 0',
  }),
});

export const dutyMileageSchema = z.object({
  claimantName: z.string().min(2, 'Claimant name is required'),
  staffNumber: z.string().min(2, 'Staff number is required'),
  post: z.string().min(2, 'Designation / Post is required'),
  department: z.string().min(2, 'Department is required'),
  vehicleMake: z.string().min(2, 'Vehicle make/model is required'),
  vehicleRegistrationNumber: z.string().min(3, 'Registration number is required'),
  vehicleEngineCapacity: z.string().min(2, 'Engine capacity is required'),
  journeys: z.array(journeyEntrySchema).min(1, 'At least one journey entry is required'),
  claimantSignature: z.string().min(2, 'Signature is required'),
  claimDate: z.string().min(1, 'Date is required'),
});

export type DutyMileageFormValues = z.infer<typeof dutyMileageSchema>;
