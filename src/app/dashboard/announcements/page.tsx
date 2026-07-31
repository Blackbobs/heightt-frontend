import type { Metadata } from 'next';
import { Sidebar } from '@/components/dashboard/Sidebar';
import { BottomNav } from '@/components/dashboard/BottomNav';
import { DashboardHeader } from '@/components/dashboard/DashboardHeader';
import { AnnouncementsPage } from '@/components/dashboard/pages/AnnouncementsPage';

export const metadata: Metadata = {
  title: 'Announcements · CampusPay — Heightt',
  description: 'Stay updated with announcements from your department, faculty, and student union.',
};

export default function Announcements() {
  return (
    <div className="flex h-screen bg-[#f0f2f5] overflow-hidden">
      <Sidebar />
      <div className="flex flex-col flex-1 min-w-0 h-full">
        <DashboardHeader pageTitle="Announcements" />
        <main className="flex-1 overflow-y-auto">
          <div className="max-w-2xl mx-auto px-5 lg:px-7 py-5">
            <AnnouncementsPage />
          </div>
        </main>
        <BottomNav />
      </div>
    </div>
  );
}
