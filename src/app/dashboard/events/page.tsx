import type { Metadata } from 'next';
import { DashboardPageShell } from '@/components/dashboard/DashboardPageShell';
import { EventsPage } from '@/components/dashboard/pages/EventsPage';

export const metadata: Metadata = {
  title: 'Events | Heightt',
  description: 'See what is coming next for campus events on Heightt.',
};

export default function Events() {
  return (
    <DashboardPageShell pageTitle="Events">
      <EventsPage />
    </DashboardPageShell>
  );
}
