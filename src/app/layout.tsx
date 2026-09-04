import type { Metadata } from "next";
import { AppLayout } from "@/components/layout/AppLayout";
import { AuthGuard } from "@/components/auth/AuthGuard";
import { AuthInitializer } from "@/components/auth/AuthInitializer";
import { PWAInstallPrompt } from "@/components/pwa/PWAInstallPrompt";
import { RegisterSW } from "@/components/pwa/RegisterSW";
import "./globals.css";
import { QueryProvider } from "@/providers/QueryProvider";
import { AcademicNotificationListener } from "@/components/notifications/AcademicNotificationListener";
import { SITE_DESCRIPTION, SITE_NAME, SITE_TITLE, SITE_URL, SOCIAL_IMAGE } from "@/lib/seo";
import { Toaster } from "sonner";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: SITE_TITLE,
    template: `%s | ${SITE_NAME}`,
  },
  description: SITE_DESCRIPTION,
  applicationName: SITE_NAME,
  authors: [{ name: SITE_NAME, url: SITE_URL }],
  creator: SITE_NAME,
  publisher: SITE_NAME,
  category: "financial technology",
  keywords: [
    "student dues payment",
    "student organisation finance",
    "campus payments Africa",
    "student payment management",
    "digital dues collection",
    "student financial records",
  ],
  icons: {
    icon: "/favicon.png",
    apple: "/apple-touch-icon.png",
  },
  openGraph: {
    type: "website",
    siteName: SITE_NAME,
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    locale: "en_NG",
    images: [SOCIAL_IMAGE],
  },
  twitter: {
    card: "summary_large_image",
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    images: [SOCIAL_IMAGE.url],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  verification: {
    google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION,
  },
};

export const viewport = {
  themeColor: "#2563EB",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

import { ThemeProvider } from "@/providers/ThemeProvider";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="min-h-screen flex flex-col bg-[#F8FAFC] dark:bg-[#0B1020] text-[#0B1020] dark:text-[#F8FAFC] antialiased">
        <ThemeProvider>
          <QueryProvider>
            <AcademicNotificationListener />
            <AppLayout>
              <AuthInitializer>
                <AuthGuard>
                  {children}
                </AuthGuard>
              </AuthInitializer>
            </AppLayout>
          </QueryProvider>
        </ThemeProvider>
        <RegisterSW />
        <PWAInstallPrompt />
        <Toaster position="top-center" richColors closeButton />
      </body>
    </html>
  );
}
