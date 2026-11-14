import SubmissionsTable from '../../components/SubmissionsTable';
import { submissions } from '../../lib/data';

export default function DutyMileageSubmissions() {
  return (
    <SubmissionsTable
      submissions={submissions}
      formType="duty-mileage"
      title="Duty Mileage & Subsistence Submissions"
    />
  );
}
