'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/context/AuthContext';
import { ProtectedRoute } from '@/components/shared/ProtectedRoute';
import {
  LayoutDashboard,
  Users,
  Building2,
  FileSpreadsheet,
  History,
  LogOut,
  User,
  ChevronLeft,
  ChevronRight,
  Menu,
} from 'lucide-react';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { session, logout } = useAuth();
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = async () => {
    await logout('/');
  };

  const navItems = [
    { path: '/admin', label: 'Dashboard', icon: LayoutDashboard },
    { path: '/admin/staff', label: 'Staff Directory', icon: Users },
    { path: '/admin/org-units', label: 'Organizational Units', icon: Building2 },
    { path: '/admin/expense-codes', label: 'Expense Codes', icon: FileSpreadsheet },
    { path: '/admin/audit-logs', label: 'Site Audit Logs', icon: History },
  ];

  const sidebarContent = (
    <div className="flex flex-col h-full bg-slate-900 text-slate-100">
      <div className="p-4 border-b border-slate-800 flex items-center justify-between">
        {!collapsed && (
          <div>
            <h1 className="text-base font-bold tracking-tight text-white">OAU Superadmin</h1>
            <p className="text-xs text-slate-400">Directory & Control Plane</p>
          </div>
        )}
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setCollapsed(!collapsed)}
          className="hidden md:flex text-slate-400 hover:text-white hover:bg-slate-800"
          title={collapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
        >
          {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
        </Button>
      </div>

      <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.path || (item.path !== '/admin' && pathname.startsWith(item.path));
          return (
            <Link
              key={item.path}
              href={item.path}
              onClick={() => setMobileOpen(false)}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                isActive
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-300 hover:bg-slate-800 hover:text-white'
              } ${collapsed ? 'justify-center px-2' : ''}`}
              title={collapsed ? item.label : undefined}
            >
              <Icon className="w-5 h-5 shrink-0" />
              {!collapsed && <span>{item.label}</span>}
            </Link>
          );
        })}
      </nav>

      <div className="p-3 border-t border-slate-800">
        <div className={`flex items-center gap-3 px-2 py-2 mb-2 ${collapsed ? 'justify-center' : ''}`}>
          <div className="w-8 h-8 rounded-full bg-indigo-500/20 text-indigo-400 flex items-center justify-center shrink-0">
            <User className="w-4 h-4" />
          </div>
          {!collapsed && (
            <div className="min-w-0 flex-1">
              <p className="text-xs font-semibold text-white truncate">{session?.fullName || 'Superadmin'}</p>
              <p className="text-[11px] text-slate-400 truncate">{session?.email}</p>
            </div>
          )}
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={handleLogout}
          className={`w-full border-slate-700 bg-slate-800/50 hover:bg-red-950/50 hover:text-red-300 hover:border-red-900 text-slate-300 ${
            collapsed ? 'px-0 justify-center' : ''
          }`}
          title="Logout"
        >
          <LogOut className="w-4 h-4" />
          {!collapsed && <span className="ml-2">Sign Out</span>}
        </Button>
      </div>
    </div>
  );

  return (
    <ProtectedRoute allowedRoles={['superadmin']}>
      <div className="min-h-screen bg-slate-50 flex">
        {/* Desktop Sidebar */}
        <aside
          className={`hidden md:flex flex-col shrink-0 border-r border-slate-200 transition-all duration-300 ${
            collapsed ? 'w-16' : 'w-64'
          }`}
        >
          {sidebarContent}
        </aside>

        {/* Mobile Header & Content */}
        <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
          <header className="md:hidden bg-slate-900 text-white p-4 flex items-center justify-between border-b border-slate-800">
            <div className="flex items-center gap-3">
              <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="icon" className="text-white hover:bg-slate-800">
                    <Menu className="w-5 h-5" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="left" className="p-0 w-72 bg-slate-900 border-slate-800">
                  {sidebarContent}
                </SheetContent>
              </Sheet>
              <span className="font-semibold text-sm">OAU Superadmin</span>
            </div>
            <Button variant="ghost" size="sm" onClick={handleLogout} className="text-xs text-slate-400 hover:text-white">
              <LogOut className="w-4 h-4" />
            </Button>
          </header>

          <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
            <div className="max-w-7xl mx-auto">{children}</div>
          </main>
        </div>
      </div>
    </ProtectedRoute>
  );
}
