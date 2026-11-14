import { Link } from 'react-router';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { FileText, ArrowRight } from 'lucide-react';
import { formTypeLabels, formTypeDescriptions } from '../../lib/data';
import { FormType } from '../../types';

const formTypes: FormType[] = [
  'cash-advance',
  'dlpo',
  'expenditure-authorization',
  'duty-mileage',
  'imprest-holder',
];

export default function AvailableForms() {
  return (
    <div>
      <div className="mb-6">
        <h2 className="text-2xl font-semibold text-gray-900">Available Forms</h2>
        <p className="text-gray-600 mt-1">Select a form to begin submission</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {formTypes.map((formType) => (
          <Card key={formType} className="hover:shadow-md transition-shadow">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <FileText className="w-5 h-5 text-blue-600" />
                </div>
              </div>
              <CardTitle className="mt-4">{formTypeLabels[formType]}</CardTitle>
              <CardDescription className="line-clamp-2">
                {formTypeDescriptions[formType]}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Link to={`/department/forms/${formType}`}>
                <Button className="w-full">
                  Fill Form
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
