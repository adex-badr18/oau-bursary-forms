import SubmissionsTable from '../../components/SubmissionsTable';
import { submissions } from '../../lib/data';

export default function CashAdvanceSubmissions() {
  return (
    <SubmissionsTable
      submissions={submissions}
      formType="cash-advance"
      title="Cash Advance Submissions"
    />
  );
}
