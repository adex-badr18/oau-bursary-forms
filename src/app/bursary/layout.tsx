'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/context/AuthContext';
import { ProtectedRoute } from '@/components/shared/ProtectedRoute';
import {
  LayoutDashboard,
  List,
  DollarSign,
  ShoppingCart,
  Receipt,
  Car,
  Wallet,
  LogOut,
  User,
} from 'lucide-react';

export default function BursaryDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, logout } = useAuth();
  const pathname = usePathname();

  const handleLogout = async () => {
    await logout('/');
  };

  const navItems = [
    { path: '/bursary/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { path: '/bursary/submissions', label: 'All Submissions', icon: List },
    { path: '/bursary/cash-advance', label: 'Cash Advance', icon: DollarSign },
    { path: '/bursary/dlpo', label: 'DLPO', icon: ShoppingCart },
    { path: '/bursary/expenditure', label: 'Expenditure Auth', icon: Receipt },
    { path: '/bursary/duty-mileage', label: 'Duty Mileage', icon: Car },
    { path: '/bursary/imprest', label: 'Imprest Holder', icon: Wallet },
  ];

  return (
    <ProtectedRoute allowedRole="bursary">
      <div className="min-h-screen bg-gray-50 flex">
        {/* Sidebar */}
        <aside className="w-64 bg-white border-r border-gray-200 flex flex-col shrink-0 min-h-screen">
          <div className="p-6 border-b border-gray-200">
            <h1 className="text-xl font-bold text-gray-900">Bursary Portal</h1>
            <p className="text-sm text-gray-500 mt-1">Form Processing</p>
          </div>

          <nav className="flex-1 p-4">
            <div className="space-y-1">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.path;
                return (
                  <Link
                    key={item.path}
                    href={item.path}
                    className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                      isActive
                        ? 'bg-blue-50 text-blue-700 font-medium'
                        : 'text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    {item.label}
                  </Link>
                );
              })}
            </div>
          </nav>

          <div className="p-4 border-t border-gray-200">
            <div className="flex items-center gap-3 px-4 py-3 mb-2">
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                <User className="w-4 h-4 text-blue-600" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">{user?.name || 'Staff'}</p>
                <p className="text-xs text-gray-500 truncate">{user?.email || 'staff@university.edu'}</p>
              </div>
            </div>
            <Button variant="outline" size="sm" onClick={handleLogout} className="w-full">
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </Button>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 overflow-auto">
          <div className="max-w-7xl mx-auto px-6 py-8">
            {children}
          </div>
        </main>
      </div>
    </ProtectedRoute>
  );
}
