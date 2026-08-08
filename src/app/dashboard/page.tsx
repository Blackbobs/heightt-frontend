import type { Metadata } from 'next';
import { Sidebar } from '@/components/dashboard/Sidebar';
import { BottomNav } from '@/components/dashboard/BottomNav';
import { DashboardHeader } from '@/components/dashboard/DashboardHeader';
import { MainDashboardView } from '@/components/dashboard/MainDashboardView';

export const metadata: Metadata = {
  title: 'Dashboard — Heightt',
  description: 'Manage your finances — pay dues, track savings, buy event tickets and more on Heightt.',
};

export default function DashboardPage() {
  return (
    <div className="flex h-screen bg-[#f0f2f5] overflow-hidden">
      {/* Desktop Sidebar */}
      <Sidebar />

      {/* Main column */}
      <div className="flex flex-col flex-1 min-w-0 h-full">
        <DashboardHeader pageTitle="Dashboard" />

        {/* Scrollable body */}
        <main className="flex-1 overflow-y-auto pb-20 lg:pb-0">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <MainDashboardView />

            {/* Safe-area bottom padding for mobile */}
            <div className="h-6 lg:h-0" />
          </div>
        </main>

        {/* Mobile bottom nav */}
        <BottomNav />
      </div>
    </div>
  );
}
