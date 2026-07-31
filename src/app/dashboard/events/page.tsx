import type { Metadata } from 'next';
import { Sidebar } from '@/components/dashboard/Sidebar';
import { BottomNav } from '@/components/dashboard/BottomNav';
import { DashboardHeader } from '@/components/dashboard/DashboardHeader';
import { EventsPage } from '@/components/dashboard/pages/EventsPage';

export const metadata: Metadata = {
  title: 'Events · CampusPay — Heightt',
  description: 'Discover, buy tickets and manage campus events with CampusPay.',
};

export default function Events() {
  return (
    <div className="flex h-screen bg-[#f0f2f5] overflow-hidden">
      <Sidebar />
      <div className="flex flex-col flex-1 min-w-0 h-full">
        <DashboardHeader pageTitle="Events" />
        <main className="flex-1 overflow-y-auto">
          <div className="max-w-2xl mx-auto px-5 lg:px-7 py-5">
            <EventsPage />
          </div>
        </main>
        <BottomNav />
      </div>
    </div>
  );
}
