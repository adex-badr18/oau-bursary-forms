import SubmissionsTable from '@/components/shared/SubmissionsTable';
import { submissions } from '@/lib/data';

export const metadata = {
  title: 'DLPO Submissions | Bursary Portal',
  description: 'Manage and review Departmental Local Purchase Order Submissions',
};

export default function DLPOSubmissionsPage() {
  return (
    <SubmissionsTable
      submissions={submissions}
      formType="dlpo"
      title="Departmental Local Purchase Order (DLPO) Submissions"
    />
  );
}
