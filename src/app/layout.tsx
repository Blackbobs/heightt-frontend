import type { Metadata } from "next";
import { AppLayout } from "@/components/layout/AppLayout";
import { AuthGuard } from "@/components/auth/AuthGuard";
import { AuthInitializer } from "@/components/auth/AuthInitializer";
import "./globals.css";
import { QueryProvider } from "@/providers/QueryProvider";

export const metadata: Metadata = {
  title: "Heightt — Student Finance Platform",
  description:
    "Student Finance Made Simple. Save towards your dues, pay securely, buy event tickets, and stay connected with your student community — all in one place.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen flex flex-col">
        <QueryProvider>
          <AppLayout>
            <AuthInitializer>
            <AuthGuard>
            {children}
            </AuthGuard>
            </AuthInitializer>
          </AppLayout>
        </QueryProvider>
      </body>
    </html>
  );
}
