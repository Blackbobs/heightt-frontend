import type { Metadata } from "next";
import Link from "next/link";
import { Clock3, ShieldCheck } from "lucide-react";
import { Logo } from "@/components/ui/Logo";

export const metadata: Metadata = {
  title: "Guest Payment Cancelled — Heightt",
  description: "Your guest payment was cancelled.",
  robots: { index: false, follow: false, noarchive: true },
};

export default function GuestPaymentCancelledPage() {
  return (
    <div className="flex min-h-screen flex-col justify-between bg-[#F8FAFC]">
      <header className="mx-auto flex w-full max-w-5xl items-center justify-between px-6 py-6">
        <Logo className="[&_img]:h-12 sm:[&_img]:h-14" />
      </header>

      <main className="flex flex-1 items-center justify-center px-4 py-6">
        <div className="w-full max-w-md rounded-3xl border border-slate-200 bg-white p-6 text-center shadow-xl sm:p-8">
          <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-amber-50">
            <Clock3 className="h-8 w-8 text-amber-500" />
          </div>
          <h1 className="text-xl font-bold text-[#0B1020]">
            Checkout cancelled
          </h1>
          <p className="mt-2 text-sm leading-6 text-slate-500">
            No payment was taken. You can safely start a new attempt whenever
            you are ready.
          </p>
          <div className="mt-6 flex flex-col gap-3">
            <Link
              href="/payments/guest"
              className="rounded-2xl bg-[#2563EB] px-5 py-3 text-sm font-semibold text-white no-underline shadow-lg shadow-blue-500/20 transition-colors hover:bg-[#1D4ED8]"
            >
              Back to guest checkout
            </Link>
            <Link
              href="/"
              className="rounded-2xl border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-700 no-underline transition-colors hover:bg-slate-50"
            >
              Go to homepage
            </Link>
          </div>
        </div>
      </main>

      <footer className="w-full py-6 text-center text-xs text-slate-400">
        <p className="flex items-center justify-center gap-1.5">
          <ShieldCheck className="h-3.5 w-3.5 text-emerald-500" />
          © {new Date().getFullYear()} Heightt. Secured Student Payment System.
        </p>
      </footer>
    </div>
  );
}