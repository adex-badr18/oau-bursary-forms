import SubmissionsTable from '../../components/SubmissionsTable';
import { submissions } from '../../lib/data';

export default function DLPOSubmissions() {
  return (
    <SubmissionsTable
      submissions={submissions}
      formType="dlpo"
      title="DLPO Submissions"
    />
  );
}
