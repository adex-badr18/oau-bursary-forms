'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useAuth } from '@/context/AuthContext';
import { ArrowLeft, Loader2, AlertCircle, ShieldCheck } from 'lucide-react';

export default function AdminLoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    const result = await login(email, password);
    setIsLoading(false);

    if (result.success) {
      window.location.href = '/admin';
    } else {
      setError(result.error || 'Login failed');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 to-indigo-950 p-4">
      <Card className="w-full max-w-md bg-white/95 backdrop-blur shadow-2xl border-indigo-200">
        <CardHeader className="text-center">
          <Link href="/" className="inline-flex items-center text-sm text-gray-500 hover:text-gray-900 mb-2">
            <ArrowLeft className="w-4 h-4 mr-1" />
            Back to portal selection
          </Link>
          <div className="mx-auto w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center mb-2">
            <ShieldCheck className="w-6 h-6 text-indigo-700" />
          </div>
          <CardTitle className="text-2xl font-bold text-gray-900">Superadmin Portal</CardTitle>
          <CardDescription>
            Institutional directory management, organizational units & audit controls.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {error && (
            <Alert variant="destructive" className="mb-4">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Admin Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="admin@oauife.edu.ng"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="Enter password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <Button type="submit" className="w-full bg-indigo-700 hover:bg-indigo-800" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" /> Authenticating...
                </>
              ) : (
                'Sign In as Superadmin'
              )}
            </Button>
          </form>
          <div className="mt-4 p-3 bg-indigo-50 rounded-md border border-indigo-100 text-xs text-indigo-950">
            <p className="font-semibold mb-1">Superadmin Credentials:</p>
            <p>Email: <span className="font-mono">admin@oauife.edu.ng</span></p>
            <p>Password: <span className="font-mono">Admin@1234</span></p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
