import SubmissionsTable from '../../components/SubmissionsTable';
import { submissions } from '../../lib/data';

export default function ExpenditureSubmissions() {
  return (
    <SubmissionsTable
      submissions={submissions}
      formType="expenditure-authorization"
      title="Expenditure Authorization Submissions"
    />
  );
}
