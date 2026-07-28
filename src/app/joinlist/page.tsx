import type { Metadata } from 'next';
import { WaitlistSection } from '@/components/waitlist/WaitlistSection';

export const metadata: Metadata = {
  title: 'Join the Waitlist — Heightt',
  description:
    'Be the first to know when Heightt launches. Join our waitlist for early access and exclusive perks for students.',
};

export default function JoinWaitlistPage() {
  return (
    <main className="min-h-[calc(100vh-80px)] flex flex-col items-center justify-center">
      <WaitlistSection />
    </main>
  );
}
