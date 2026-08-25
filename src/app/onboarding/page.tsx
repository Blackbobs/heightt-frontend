'use client'
// import type { Metadata } from 'next';
import { OnboardingFlow } from '@/components/onboarding/OnboardingFlow';
import { useAuthStore } from '@/store/auth-store';
import { useRouter } from 'next/navigation';
import { useEffect, useRef } from 'react';

// export const metadata: Metadata = {
//   title: 'Onboarding — Height',
//   description: 'Complete your profile and set up your student preferences on Heightt.',
// };

export default function OnboardingPage() {
   const { user, isAuthenticated, checkOnboardingStatus } = useAuthStore();
  const router = useRouter();
  const checkedUserRef = useRef<string | null>(null);

  useEffect(() => {
    const checkOnboarding = async () => {
      if (!isAuthenticated || !user) {
        router.replace("/signin");
        return;
      }

      // Guard against redundant re-runs for the same user.
      // Prevents the onboarding status API from being called
      // repeatedly when the user object reference changes.
      if (checkedUserRef.current === user.id) {
        return;
      }
      checkedUserRef.current = user.id;

      try {
        const status = await checkOnboardingStatus();
        if (status.onboardingCompleted) {
          router.replace("/dashboard");
        }
      } catch (error) {
        console.error("Error checking onboarding:", error);
      }
    };

    checkOnboarding();
  }, [isAuthenticated, user, router, checkOnboardingStatus]);

  if (!isAuthenticated || !user) {
    return null;
  }
  return (
    <div className="min-h-screen bg-['f8faff'] flex items-center justify-center p-4 sm:p-6">
      <OnboardingFlow />
    </div>
  );
}
