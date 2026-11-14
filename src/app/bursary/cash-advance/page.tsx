import SubmissionsTable from '@/components/shared/SubmissionsTable';
import { submissions } from '@/lib/data';

export const metadata = {
  title: 'Cash Advance Submissions | Bursary Portal',
  description: 'Manage and review Cash Advance Submissions',
};

export default function CashAdvanceSubmissionsPage() {
  return (
    <SubmissionsTable
      submissions={submissions}
      formType="cash-advance"
      title="Cash Advance Submissions"
    />
  );
}
