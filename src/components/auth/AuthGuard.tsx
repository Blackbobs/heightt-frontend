"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAuthStore } from "@/store/auth-store";
import { Loader2 } from "lucide-react";

// Routes that don't require authentication
const PUBLIC_ROUTES = [
  "/",
  "/signin",
  "/signup",
  "/forgot-password",
  "/reset-password",
  "/about",
  "/pricing",
  "/contact",
  "/verify-email",
  "/verify-email-sent",
  "/verify-email-link", // Add this if you have a separate link verification page
  "/payment/callback",
  "/payment/success",
  "/payment/cancelled",
];

// Routes that require authentication
const PROTECTED_ROUTES = [
  "/dashboard",
  "/profile",
  "/settings",
  "/wallet",
  "/organizations",
];

// Routes that require onboarding completion
const ONBOARDING_REQUIRED_ROUTES = [
  "/dashboard",
  "/profile",
  "/settings",
  "/wallet",
  "/organizations",
];

interface AuthGuardProps {
  children: React.ReactNode;
}

export function AuthGuard({ children }: AuthGuardProps) {
  const router = useRouter();
  const pathname = usePathname();
  const { isAuthenticated, isLoading, user, checkOnboardingStatus } =
    useAuthStore();
  const [isChecking, setIsChecking] = useState(true);
  const [shouldRender, setShouldRender] = useState(false);
  const checkedUserRef = useRef<string | null>(null);

  useEffect(() => {
    const checkAuth = async () => {
      // Guard against redundant re-runs for the same user.
      // Without this, any change to the user object reference
      // (e.g. from fetchCurrentUser or checkOnboardingStatus)
      // re-triggers this effect and re-calls the onboarding API.
      const userKey = `${user?.id || "anonymous"}:${pathname}`;
      if (checkedUserRef.current === userKey) {
        setIsChecking(false);
        setShouldRender(true);
        return;
      }
      checkedUserRef.current = userKey;
      const isPublicRoute = PUBLIC_ROUTES.includes(pathname);
      const isProtectedRoute = PROTECTED_ROUTES.some((route) =>
        pathname.startsWith(route),
      );
      const isOnboardingRoute = pathname === "/onboarding";

      // If it's a public route (including verification pages), render immediately
      if (isPublicRoute) {
        setIsChecking(false);
        setShouldRender(true);
        return;
      }

      // If not authenticated and trying to access protected route
      if (!isAuthenticated && !user && isProtectedRoute) {
        const queryString =
          typeof window !== "undefined" ? window.location.search.slice(1) : "";
        const returnTo = `${pathname}${queryString ? `?${queryString}` : ""}`;
        router.replace(`/signin?returnTo=${encodeURIComponent(returnTo)}`);
        setIsChecking(false);
        setShouldRender(false);
        return;
      }

      // If authenticated, check onboarding status
      if (isAuthenticated && user) {
        try {
          const onboardingStatus = await checkOnboardingStatus();

          // If on onboarding route and onboarding is completed, redirect to dashboard
          if (isOnboardingRoute && onboardingStatus.onboardingCompleted) {
            router.replace("/dashboard");
            setIsChecking(false);
            setShouldRender(false);
            return;
          }

          // If on protected route that requires onboarding and onboarding not completed
          const requiresOnboarding = ONBOARDING_REQUIRED_ROUTES.some((route) =>
            pathname.startsWith(route),
          );

          if (requiresOnboarding && onboardingStatus.needsOnboarding) {
            router.replace("/onboarding");
            setIsChecking(false);
            setShouldRender(false);
            return;
          }

          // If on onboarding route and onboarding not completed, render it
          if (isOnboardingRoute && onboardingStatus.needsOnboarding) {
            setIsChecking(false);
            setShouldRender(true);
            return;
          }

          // All checks passed, render the protected route
          setIsChecking(false);
          setShouldRender(true);
          return;
        } catch (error) {
          console.error("Error checking onboarding:", error);
          // On error, still render the route but maybe with a warning
          setIsChecking(false);
          setShouldRender(true);
          return;
        }
      }

      // If not authenticated and not a protected route, render
      setIsChecking(false);
      setShouldRender(true);
    };

    checkAuth();
  }, [isAuthenticated, user, pathname, router, checkOnboardingStatus]);

  // Show loading state only while checking protected routes
  if (isChecking) {
    const isProtectedRoute = PROTECTED_ROUTES.some((route) =>
      pathname.startsWith(route),
    );
    if (isProtectedRoute || pathname === "/onboarding") {
      return (
        <div className="min-h-screen flex items-center justify-center bg-[#f8faff]">
          <div className="flex flex-col items-center gap-3">
            <Loader2 className="w-8 h-8 text-[#1a5cff] animate-spin" />
            <span className="text-sm text-[#5b6d89] font-medium">
              Loading...
            </span>
          </div>
        </div>
      );
    }
    // For public routes, don't show loading
    setIsChecking(false);
    setShouldRender(true);
    return <>{children}</>;
  }

  // If not authenticated and trying to access protected route, don't render
  const isProtectedRoute = PROTECTED_ROUTES.some((route) =>
    pathname.startsWith(route),
  );
  if (!isAuthenticated && !user && isProtectedRoute) {
    return null;
  }

  // If authentication check failed, render children anyway (fallback)
  if (!shouldRender) {
    return null;
  }

  return <>{children}</>;
}
