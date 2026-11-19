'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { History, Search, Loader2, ChevronLeft, ChevronRight, ShieldAlert } from 'lucide-react';
import type { AuditLog, AuditAction } from '@/types';

export default function AdminAuditLogsPage() {
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [actionFilter, setActionFilter] = useState<string>('all');
  const [isLoading, setIsLoading] = useState(true);

  const fetchLogs = async (page = 1) => {
    setIsLoading(true);
    try {
      const q = new URLSearchParams({
        page: String(page),
        limit: '20',
      });
      if (searchTerm) q.set('search', searchTerm);
      if (actionFilter !== 'all') q.set('action', actionFilter);

      const res = await fetch(`/api/audit-logs?${q.toString()}`);
      const json = await res.json();
      if (json.success && json.data) {
        setLogs(json.data.data);
        setTotal(json.data.total);
        setTotalPages(json.data.totalPages);
        setCurrentPage(json.data.page);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs(1);
  }, [searchTerm, actionFilter]);

  const actions = [
    'USER_LOGIN',
    'USER_LOGOUT',
    'USER_PASSWORD_CHANGED',
    'STAFF_REGISTERED',
    'STAFF_BULK_UPLOADED',
    'STAFF_UPDATED',
    'STAFF_PASSWORD_RESET',
    'ORG_UNIT_CREATED',
    'ORG_UNIT_BULK_UPLOADED',
    'EXPENSE_CODE_CREATED',
    'EXPENSE_CODE_BULK_UPLOADED',
    'FORM_SUBMITTED',
    'FORM_STATUS_UPDATED',
    'FORM_APPROVED',
    'FORM_REJECTED',
  ];

  const getActionBadgeColor = (action: string) => {
    if (action.includes('REJECTED')) return 'bg-red-100 text-red-800 border-red-200';
    if (action.includes('APPROVED')) return 'bg-green-100 text-green-800 border-green-200';
    if (action.includes('BULK')) return 'bg-purple-100 text-purple-800 border-purple-200';
    if (action.includes('LOGIN') || action.includes('LOGOUT')) return 'bg-blue-100 text-blue-800 border-blue-200';
    return 'bg-slate-100 text-slate-800 border-slate-200';
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">Site-Wide Security & Audit Trail</h1>
        <p className="text-sm text-slate-500">
          Immutable event log of all administrative creations, logins, form submissions, and Bursary review decisions ({total.toLocaleString()} total logged events)
        </p>
      </div>

      {/* Filter Bar */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
              <Input
                placeholder="Search audit trail by actor, email, keyword or details..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9"
              />
            </div>
            <div className="w-full sm:w-64">
              <Select value={actionFilter} onValueChange={setActionFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="All Actions" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Actions</SelectItem>
                  {actions.map((act) => (
                    <SelectItem key={act} value={act}>{act}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Logs Table */}
      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead className="bg-slate-50 text-slate-700 border-b border-slate-200">
                <tr>
                  <th className="px-4 py-3 font-semibold">Timestamp</th>
                  <th className="px-4 py-3 font-semibold">Action Event</th>
                  <th className="px-4 py-3 font-semibold">Actor / Initiator</th>
                  <th className="px-4 py-3 font-semibold">Target Entity</th>
                  <th className="px-4 py-3 font-semibold">Event Details</th>
                  <th className="px-4 py-3 font-semibold">Client IP</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {isLoading ? (
                  <tr>
                    <td colSpan={6} className="text-center py-8 text-slate-400">
                      <Loader2 className="w-5 h-5 mx-auto animate-spin mb-1 text-indigo-600" />
                      Loading audit records...
                    </td>
                  </tr>
                ) : logs.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="text-center py-8 text-slate-400">
                      No audit events recorded for current filters.
                    </td>
                  </tr>
                ) : (
                  logs.map((log) => (
                    <tr key={log.id} className="hover:bg-slate-50/70 transition-colors">
                      <td className="px-4 py-3 font-mono text-[11px] text-slate-500 whitespace-nowrap">
                        {new Date(log.timestamp).toLocaleString()}
                      </td>
                      <td className="px-4 py-3">
                        <Badge variant="outline" className={`font-mono text-[10px] ${getActionBadgeColor(log.action)}`}>
                          {log.action}
                        </Badge>
                      </td>
                      <td className="px-4 py-3">
                        <div className="font-semibold text-slate-900">{log.actorName}</div>
                        <div className="text-slate-500 font-mono text-[10px]">{log.actorEmail} ({log.actorRole})</div>
                      </td>
                      <td className="px-4 py-3 font-mono text-[11px] text-slate-600 capitalize">
                        {log.entityType}
                      </td>
                      <td className="px-4 py-3 font-medium text-slate-800 max-w-md">
                        {log.details}
                      </td>
                      <td className="px-4 py-3 font-mono text-[11px] text-slate-400">
                        {log.ipAddress}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="flex items-center justify-between px-4 py-3 border-t border-slate-200 text-xs text-slate-500">
            <div>
              Showing page <strong>{currentPage}</strong> of <strong>{totalPages}</strong> ({total} audit events)
            </div>
            <div className="flex items-center gap-1">
              <Button
                variant="outline"
                size="sm"
                onClick={() => fetchLogs(currentPage - 1)}
                disabled={currentPage <= 1 || isLoading}
                className="h-8 px-2 text-xs"
              >
                <ChevronLeft className="w-4 h-4 mr-1" /> Prev
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => fetchLogs(currentPage + 1)}
                disabled={currentPage >= totalPages || isLoading}
                className="h-8 px-2 text-xs"
              >
                Next <ChevronRight className="w-4 h-4 ml-1" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
