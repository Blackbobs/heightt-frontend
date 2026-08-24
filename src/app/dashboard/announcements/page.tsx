import type { Metadata } from 'next';
import { DashboardPageShell } from '@/components/dashboard/DashboardPageShell';
import { AnnouncementsPage } from '@/components/dashboard/pages/AnnouncementsPage';

export const metadata: Metadata = {
  title: 'Announcements — Heightt',
  description: 'Stay updated with announcements on Heightt.',
};

export default function Announcements() {
  return (
    <DashboardPageShell pageTitle="Announcements">
      <AnnouncementsPage />
    </DashboardPageShell>
  );
}