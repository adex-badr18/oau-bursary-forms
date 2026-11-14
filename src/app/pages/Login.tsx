import { Link } from 'react-router';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Building2, Wallet } from 'lucide-react';

export default function Login() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="w-full max-w-4xl">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Bursary Digital Form System</h1>
          <p className="text-gray-600">Select your login type to continue</p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Department Login */}
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader className="text-center">
              <div className="mx-auto w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                <Building2 className="w-8 h-8 text-blue-600" />
              </div>
              <CardTitle>Department Login</CardTitle>
              <CardDescription>
                For department staff to submit and track forms
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Link to="/department-login">
                <Button className="w-full" size="lg">
                  Login as Department User
                </Button>
              </Link>
            </CardContent>
          </Card>

          {/* Bursary Login */}
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader className="text-center">
              <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
                <Wallet className="w-8 h-8 text-green-600" />
              </div>
              <CardTitle>Bursary Login</CardTitle>
              <CardDescription>
                For bursary staff to process and manage submissions
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Link to="/bursary-login">
                <Button className="w-full" size="lg" variant="outline">
                  Login as Bursary User
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
