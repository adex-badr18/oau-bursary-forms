import SubmissionsTable from '../../components/SubmissionsTable';
import { submissions } from '../../lib/data';

export default function ImprestSubmissions() {
  return (
    <SubmissionsTable
      submissions={submissions}
      formType="imprest-holder"
      title="Imprest Holder Submissions"
    />
  );
}
