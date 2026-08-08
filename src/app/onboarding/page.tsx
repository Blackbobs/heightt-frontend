import type { Metadata } from 'next';
import { OnboardingFlow } from '@/components/onboarding/OnboardingFlow';

export const metadata: Metadata = {
  title: 'Onboarding — Height',
  description: 'Complete your profile and set up your student preferences on Heightt.',
};

export default function OnboardingPage() {
  return (
    <div className="min-h-screen bg-['f8faff'] flex items-center justify-center p-4 sm:p-6">
      <OnboardingFlow />
    </div>
  );
}
