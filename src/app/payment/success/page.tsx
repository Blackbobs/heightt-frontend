import { Suspense } from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { Building2 } from "lucide-react";
import { PaymentSuccessView } from "@/components/payments/PaymentSuccessView";
import { HeighttLoader } from "@/components/ui/HeighttLoader";

export const metadata: Metadata = {
  title: "Payment Successful — Heightt",
  description: "Your payment was successfully processed and confirmed.",
};

function SuccessFallback() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[50vh] gap-3">
      <HeighttLoader label="Loading payment confirmation" />
      <span className="text-sm font-medium text-slate-500">
        Loading payment confirmation...
      </span>
    </div>
  );
}

export default function StandalonePaymentSuccessPage() {
  return (
    <div className="min-h-screen bg-[#f8f9fc] flex flex-col justify-between">
      {/* Brand Header */}
      <header className="w-full max-w-5xl mx-auto px-6 py-6 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2.5 font-bold text-2xl text-[#1a1a2e] no-underline">
          <Building2 className="w-7 h-7 text-[#1a5cff]" strokeWidth={1.8} />
          <span>Heightt</span>
        </Link>
        <Link
          href="/dashboard"
          className="text-xs font-semibold text-[#1a5cff] bg-blue-50 hover:bg-blue-100 px-4 py-2 rounded-xl transition-colors no-underline"
        >
          Go to Dashboard
        </Link>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex items-center justify-center px-4 py-6">
        <Suspense fallback={<SuccessFallback />}>
          <PaymentSuccessView isEmbeddedInDashboard={false} />
        </Suspense>
      </main>

      {/* Footer */}
      <footer className="w-full text-center py-6 text-xs text-slate-400 border-t border-slate-200/60">
        <p>© {new Date().getFullYear()} Heightt. Secured Student Payment System.</p>
      </footer>
    </div>
  );
}
