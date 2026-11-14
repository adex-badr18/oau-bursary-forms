import SubmissionsTable from '@/components/shared/SubmissionsTable';
import { submissions } from '@/lib/data';

export const metadata = {
  title: 'Imprest Submissions | Bursary Portal',
  description: 'Manage and review Imprest Holder Submissions',
};

export default function ImprestSubmissionsPage() {
  return (
    <SubmissionsTable
      submissions={submissions}
      formType="imprest-holder"
      title="Imprest Holder's Summary Submissions"
    />
  );
}
