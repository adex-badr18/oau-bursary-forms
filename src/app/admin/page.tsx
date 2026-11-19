'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Users, Building2, FileSpreadsheet, History, ArrowRight, UserPlus, Upload, Shield } from 'lucide-react';
import type { AuditLog } from '@/types';

interface DashboardStats {
  staffTotal: number;
  orgUnitsTotal: number;
  expenseCodesTotal: number;
  submissionsTotal: number;
}

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<DashboardStats>({
    staffTotal: 0,
    orgUnitsTotal: 0,
    expenseCodesTotal: 0,
    submissionsTotal: 0,
  });
  const [recentLogs, setRecentLogs] = useState<AuditLog[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const [staffRes, orgRes, expRes, subRes, logsRes] = await Promise.all([
          fetch('/api/staff?limit=1'),
          fetch('/api/org-units'),
          fetch('/api/expense-codes?limit=1'),
          fetch('/api/submissions?limit=1'),
          fetch('/api/audit-logs?limit=5'),
        ]);

        const [staffData, orgData, expData, subData, logsData] = await Promise.all([
          staffRes.json(),
          orgRes.json(),
          expRes.json(),
          subRes.json(),
          logsRes.json(),
        ]);

        setStats({
          staffTotal: staffData.data?.total ?? 0,
          orgUnitsTotal: Array.isArray(orgData.data) ? orgData.data.length : 0,
          expenseCodesTotal: expData.data?.total ?? 0,
          submissionsTotal: subData.data?.total ?? 0,
        });

        if (logsData.success && logsData.data?.data) {
          setRecentLogs(logsData.data.data);
        }
      } catch (err) {
        console.error('Failed to load admin stats', err);
      } finally {
        setIsLoading(false);
      }
    }

    loadData();
  }, []);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">System Governance Dashboard</h1>
        <p className="text-sm text-slate-500 mt-1">
          Manage the central University Staff Directory, Organizational Units, Centre Codes, and Audit Trails.
        </p>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="border-slate-200">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-slate-600">University Staff</CardTitle>
            <Users className="w-5 h-5 text-indigo-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-900">
              {isLoading ? '...' : stats.staffTotal.toLocaleString()}
            </div>
            <p className="text-xs text-slate-500 mt-1">Ingestion ready (~4,000 capacity)</p>
          </CardContent>
        </Card>

        <Card className="border-slate-200">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-slate-600">Org Units (Centres)</CardTitle>
            <Building2 className="w-5 h-5 text-emerald-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-900">
              {isLoading ? '...' : stats.orgUnitsTotal.toLocaleString()}
            </div>
            <p className="text-xs text-slate-500 mt-1">Faculties, Depts & Directorates</p>
          </CardContent>
        </Card>

        <Card className="border-slate-200">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-slate-600">Expense Codes</CardTitle>
            <FileSpreadsheet className="w-5 h-5 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-900">
              {isLoading ? '...' : stats.expenseCodesTotal.toLocaleString()}
            </div>
            <p className="text-xs text-slate-500 mt-1">Accounting budget lines</p>
          </CardContent>
        </Card>

        <Card className="border-slate-200">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-slate-600">Digital Submissions</CardTitle>
            <Shield className="w-5 h-5 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-900">
              {isLoading ? '...' : stats.submissionsTotal.toLocaleString()}
            </div>
            <p className="text-xs text-slate-500 mt-1">University-wide submissions</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Action Modules */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="border-indigo-100 hover:border-indigo-300 transition-colors">
          <CardHeader>
            <div className="w-10 h-10 rounded-lg bg-indigo-50 text-indigo-700 flex items-center justify-center mb-2">
              <Users className="w-5 h-5" />
            </div>
            <CardTitle className="text-base">Staff Directory Management</CardTitle>
            <CardDescription className="text-xs">
              Onboard staff individually or use high-performance chunked Excel import for ~4,000 records.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <Link href="/admin/staff" className="block">
              <Button className="w-full bg-indigo-700 hover:bg-indigo-800 text-xs">
                Open Directory Manager <ArrowRight className="w-4 h-4 ml-1" />
              </Button>
            </Link>
          </CardContent>
        </Card>

        <Card className="border-emerald-100 hover:border-emerald-300 transition-colors">
          <CardHeader>
            <div className="w-10 h-10 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center mb-2">
              <Building2 className="w-5 h-5" />
            </div>
            <CardTitle className="text-base">Organizational Units & Centres</CardTitle>
            <CardDescription className="text-xs">
              Configure faculties, departments, and intrinsic 3-digit Centre Codes (e.g. 694 for CSC).
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <Link href="/admin/org-units" className="block">
              <Button variant="outline" className="w-full border-emerald-300 text-emerald-800 hover:bg-emerald-50 text-xs">
                Manage Org Units <ArrowRight className="w-4 h-4 ml-1" />
              </Button>
            </Link>
          </CardContent>
        </Card>

        <Card className="border-blue-100 hover:border-blue-300 transition-colors">
          <CardHeader>
            <div className="w-10 h-10 rounded-lg bg-blue-50 text-blue-700 flex items-center justify-center mb-2">
              <FileSpreadsheet className="w-5 h-5" />
            </div>
            <CardTitle className="text-base">Expense Codes Catalog</CardTitle>
            <CardDescription className="text-xs">
              Maintain institutional vote codes, travel lines, and procurement classifications.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <Link href="/admin/expense-codes" className="block">
              <Button variant="outline" className="w-full border-blue-300 text-blue-800 hover:bg-blue-50 text-xs">
                Manage Expense Codes <ArrowRight className="w-4 h-4 ml-1" />
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>

      {/* Recent Audit Activity */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="text-base">Recent Site-Wide Audit Events</CardTitle>
            <CardDescription className="text-xs">Immutable log of security and administrative operations</CardDescription>
          </div>
          <Link href="/admin/audit-logs">
            <Button variant="ghost" size="sm" className="text-xs text-indigo-700 hover:text-indigo-900">
              View All Logs <ArrowRight className="w-3.5 h-3.5 ml-1" />
            </Button>
          </Link>
        </CardHeader>
        <CardContent>
          {recentLogs.length === 0 ? (
            <p className="text-sm text-slate-500 py-4 text-center">No audit logs recorded yet.</p>
          ) : (
            <div className="divide-y divide-slate-100">
              {recentLogs.map((log) => (
                <div key={log.id} className="py-3 flex flex-col sm:flex-row sm:items-center justify-between text-xs gap-2">
                  <div className="flex items-center gap-2">
                    <span className="font-mono px-2 py-0.5 rounded bg-slate-100 text-slate-700 font-semibold">
                      {log.action}
                    </span>
                    <span className="text-slate-800 font-medium">{log.details}</span>
                  </div>
                  <div className="text-slate-400 whitespace-nowrap">
                    {new Date(log.timestamp).toLocaleString()} • {log.actorName}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
