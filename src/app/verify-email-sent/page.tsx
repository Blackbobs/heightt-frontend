import type { Metadata } from 'next';
import { AuthPageLayout } from '@/components/auth/AuthPageLayout';
import { VerificationSentCard } from '@/components/auth/VerificationSentCard';

export const metadata: Metadata = {
  title: 'Verification Email Sent — Heightt',
  description:
    'Check your email to verify your Heightt account and start managing your finances.',
};

export default function VerificationSentPage() {
  return (
    <AuthPageLayout>
      <VerificationSentCard borderless />
    </AuthPageLayout>
  );
}