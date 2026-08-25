import type { Metadata } from 'next';
import { AuthPageLayout } from '@/components/auth/AuthPageLayout';
import { SignupCard } from '@/components/auth/SignupCard';


export const metadata: Metadata = {
  title: 'Create your account — Heightt',
  description:
    'Create your Heightt account to manage payments, save, and access student services.',
};

export default function SignupPage() {
  return (
    <AuthPageLayout>
      <SignupCard borderless />
    </AuthPageLayout>
  );
}
