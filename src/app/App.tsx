import { RouterProvider } from 'react-router';
import { AuthProvider } from './contexts/AuthContext';
import { router } from './routes';
import { Toaster } from './components/ui/sonner';

/**
 * Bursary Digital Form Submission & Processing System
 * 
 * This application provides a comprehensive solution for managing bursary forms with two user roles:
 * 
 * DEPARTMENT USER WORKFLOW:
 * 1. Login via Department Login (select department from dropdown)
 * 2. View Available Forms dashboard
 * 3. Fill and submit forms (Cash Advance, DLPO, Expenditure Auth, Duty Mileage, Imprest Holder)
 * 4. Track submissions in "My Submissions" section
 * 5. View detailed status of each submission
 * 
 * BURSARY USER WORKFLOW:
 * 1. Login via Bursary Login
 * 2. View Dashboard with statistics and form categories
 * 3. Navigate to specific form category submissions
 * 4. Search, filter, and paginate through submissions
 * 5. View detailed submission information
 * 6. Update status, add notes, enter voucher numbers
 * 7. Print/Export submissions to PDF
 * 
 * FEATURES:
 * - Complete authentication system with role-based access
 * - 5 different form types with comprehensive fields
 * - Real-time form validation
 * - Auto-calculation for amounts and totals
 * - Searchable and filterable submission tables
 * - Pagination for large datasets
 * - Status tracking (Submitted, In Review, Processed, Rejected)
 * - Print-friendly submission details
 * - Professional UI with Shadcn/UI components
 * - Responsive design for desktop
 */

export default function App() {
  return (
    <AuthProvider>
      <RouterProvider router={router} />
      <Toaster />
    </AuthProvider>
  );
}