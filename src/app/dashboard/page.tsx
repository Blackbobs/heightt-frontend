import type { Metadata } from 'next';
import { Sidebar } from '@/components/dashboard/Sidebar';
import { BottomNav } from '@/components/dashboard/BottomNav';
import { DashboardHeader } from '@/components/dashboard/DashboardHeader';
import { Greeting, BalanceCard } from '@/components/dashboard/BalanceCard';
import { QuickActions } from '@/components/dashboard/QuickActions';
import { UpcomingDues } from '@/components/dashboard/UpcomingDues';
import { RecentTransactions } from '@/components/dashboard/RecentTransactions';
import { SavingsMiniCard, AnnouncementsMiniCard } from '@/components/dashboard/MiniCards';
import { RecommendedEvents } from '@/components/dashboard/RecommendedEvents';

export const metadata: Metadata = {
  title: 'Dashboard · CampusPay — Heightt',
  description: 'Manage your campus finances — pay dues, track savings, buy event tickets and more.',
};

export default function DashboardPage() {
  return (
    <div className="flex h-screen bg-[#f0f2f5] overflow-hidden">
      {/* Desktop Sidebar */}
      <Sidebar />

      {/* Main column */}
      <div className="flex flex-col flex-1 min-w-0 h-full">
        <DashboardHeader />

        {/* Scrollable body */}
        <main className="flex-1 overflow-y-auto">
          <div className="max-w-2xl mx-auto px-5 lg:px-7 py-5">
            <Greeting />
            <BalanceCard />
            <QuickActions />
            <UpcomingDues />

            <div className="h-5" />

            <RecentTransactions />

            <div className="h-5" />

            {/* Bottom 2-column grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 mb-5">
              <SavingsMiniCard />
              <AnnouncementsMiniCard />
            </div>

            <RecommendedEvents />

            {/* Safe-area bottom padding for mobile */}
            <div className="h-4 lg:h-0" />
          </div>
        </main>

        {/* Mobile bottom nav */}
        <BottomNav />
      </div>
    </div>
  );
}
