import SubmissionsTable from '@/components/shared/SubmissionsTable';
import { submissions } from '@/lib/data';

export const metadata = {
  title: 'Duty Mileage Submissions | Bursary Portal',
  description: 'Manage and review Duty Mileage Submissions',
};

export default function DutyMileageSubmissionsPage() {
  return (
    <SubmissionsTable
      submissions={submissions}
      formType="duty-mileage"
      title="Duty Mileage & Subsistence Allowance Submissions"
    />
  );
}
