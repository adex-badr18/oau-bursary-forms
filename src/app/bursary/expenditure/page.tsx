import SubmissionsTable from '@/components/shared/SubmissionsTable';
import { submissions } from '@/lib/data';

export const metadata = {
  title: 'Expenditure Submissions | Bursary Portal',
  description: 'Manage and review Expenditure Authorization Submissions',
};

export default function ExpenditureSubmissionsPage() {
  return (
    <SubmissionsTable
      submissions={submissions}
      formType="expenditure-authorization"
      title="Expenditure Authorization Submissions"
    />
  );
}
