import type { Metadata } from 'next';
import { DashboardPageShell } from '@/components/dashboard/DashboardPageShell';
import { EventsPage } from '@/components/dashboard/pages/EventsPage';

export const metadata: Metadata = {
  title: 'Events — Heightt',
  description: 'Discover, buy tickets and manage events with Heightt.',
};

export default function Events() {
  return (
    <DashboardPageShell pageTitle="Events">
      <EventsPage />
    </DashboardPageShell>
  );
}