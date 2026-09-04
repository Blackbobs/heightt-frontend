"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Mail,
  CheckCircle2,
  Clock,
  ArrowRight,
  Sparkles,
  RotateCcw,
  AlertCircle,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuthStore } from "@/store/auth-store";

interface VerificationSentCardProps {
  borderless?: boolean;
  className?: string;
}

export function VerificationSentCard({
  borderless = false,
  className,
}: VerificationSentCardProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get("email") ?? "your email";
  const { resendVerification } = useAuthStore();

  const [countdown, setCountdown] = useState(60);
  const [canResend, setCanResend] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [resendMessage, setResendMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  // Countdown timer for resend
  useEffect(() => {
    if (countdown <= 0) {
      setCanResend(true);
      return;
    }
    const timer = setTimeout(() => setCountdown((c) => c - 1), 1000);
    return () => clearTimeout(timer);
  }, [countdown]);

  // Auto-redirect to verification after 10 seconds (for users who have the token)
  useEffect(() => {
    const token = searchParams.get("token");
    if (token) {
      // If token is present, redirect to verification page
      setTimeout(() => {
        router.push(`/verify-email?token=${token}`);
      }, 3000);
    }
  }, [searchParams, router]);

  const handleResend = async () => {
    if (!canResend || isResending) return;

    setIsResending(true);
    setResendMessage(null);

    try {
      await resendVerification(email);
      setResendMessage({
        type: "success",
        text: "✅ Verification email resent successfully!",
      });
      // Reset countdown
      setCountdown(60);
      setCanResend(false);
    } catch (error: any) {
      setResendMessage({
        type: "error",
        text:
          error.message ||
          "Failed to resend verification email. Please try again.",
      });
    } finally {
      setIsResending(false);
    }
  };

  const handleGoToInbox = () => {
    // Open Gmail or default email client
    window.open("https://mail.google.com", "_blank");
  };

  const handleContinueToVerification = () => {
    router.push(`/verify-email?email=${encodeURIComponent(email)}`);
  };

  return (
    <div
      className={cn(
        "w-full max-w-[520px] transition-shadow duration-200",
        borderless
          ? "bg-transparent p-0 border-none shadow-none"
          : "bg-white p-7 sm:p-9 md:p-10 rounded-3xl sm:rounded-3xl shadow-[0_20px_60px_rgba(0,20,40,0.08),0_8px_24px_rgba(0,0,0,0.02)] border border-slate-100",
        className,
      )}
      role="main"
      aria-labelledby="verify-sent-heading"
    >
      {/* Success Icon */}
      <div className="flex justify-center mb-6">
        <div className="w-20 h-20 rounded-full bg-gradient-to-br from-green-50 to-emerald-100 flex items-center justify-center shadow-[0_4px_16px_rgba(16,185,129,0.15)]">
          <Mail className="w-10 h-10 text-emerald-500" />
        </div>
      </div>

      <h1
        id="verify-sent-heading"
        className="text-2xl sm:text-[1.6rem] font-bold text-[#0B1020] tracking-tight text-center mb-2"
      >
        Check your inbox
      </h1>

      <p className="text-[0.95rem] text-[#64748B] text-center mb-2 font-normal leading-snug">
        We've sent a verification email to
      </p>

      <p className="text-[1rem] font-semibold text-[#2563EB] text-center mb-6 break-all">
        {email}
      </p>

      {/* Instructions */}
      <div className="bg-[#F8FAFC] rounded-xl p-5 mb-6 border border-[#e2e8f0]">
        <div className="flex items-start gap-3">
          <div className="w-6 h-6 rounded-full bg-[#2563EB]/10 flex items-center justify-center flex-shrink-0 mt-0.5">
            <Clock className="w-3.5 h-3.5 text-[#2563EB]" />
          </div>
          <div>
            <p className="text-[0.9rem] font-semibold text-[#0B1020]">
              What to do next:
            </p>
            <ol className="mt-1 space-y-1.5 text-[0.85rem] text-[#3d4f6b]">
              <li className="flex items-start gap-2">
                <span className="text-[#2563EB] font-bold">1.</span>
                <span>Open your email inbox</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[#2563EB] font-bold">2.</span>
                <span>
                  Click the <strong>Verify Email</strong> button in the email
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[#2563EB] font-bold">3.</span>
                <span>You'll be redirected to complete your profile</span>
              </li>
            </ol>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="flex flex-col gap-3 mb-6">
        <button
          onClick={handleGoToInbox}
          className="w-full rounded-xl px-5 py-3.5 bg-[#2563EB] text-white font-semibold text-[0.95rem] flex items-center justify-center gap-2 transition-all duration-200 hover:bg-[#1D4ED8] hover:shadow-[0_8px_24px_rgba(26,92,255,0.25)] active:scale-[0.98]"
        >
          <Mail className="w-4 h-4" />
          Open Gmail
          <ArrowRight className="w-4 h-4" />
        </button>

        {/* <button
          onClick={handleContinueToVerification}
          className="w-full rounded-xl px-5 py-3.5 bg-[#f0f4fc] text-[#2563EB] font-semibold text-[0.95rem] flex items-center justify-center gap-2 transition-all duration-200 hover:bg-[#e2eaf6] active:scale-[0.98] border border-[#d6e2f0]"
        >
          <CheckCircle2 className="w-4 h-4" />I already verified
        </button> */}
      </div>

      {/* Resend Section */}
      <div className="text-center border-t border-[#edf2f7] pt-5">
        <p className="text-[0.85rem] text-[#64748B] mb-3">
          Didn't receive the email? Check your spam folder or
        </p>

        {resendMessage && (
          <div
            className={cn(
              "mb-3 p-2.5 rounded-lg text-sm",
              resendMessage.type === "success"
                ? "bg-green-50 text-green-700 border border-green-200"
                : "bg-red-50 text-red-700 border border-red-200",
            )}
          >
            {resendMessage.text}
          </div>
        )}

        <button
          onClick={handleResend}
          disabled={!canResend || isResending}
          className={cn(
            "inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-[0.9rem] transition-all duration-200",
            canResend && !isResending
              ? "bg-[#2563EB] text-white hover:bg-[#1D4ED8] shadow-[0_4px_12px_rgba(26,92,255,0.2)] cursor-pointer"
              : "bg-[#e8edf5] text-[#64748B] cursor-not-allowed",
          )}
        >
          {isResending ? (
            <>
              <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
              Sending...
            </>
          ) : canResend ? (
            <>
              <RotateCcw className="w-4 h-4" />
              Resend verification email
            </>
          ) : (
            <>
              <Clock className="w-4 h-4" />
              Resend in {countdown}s
            </>
          )}
        </button>
      </div>

      {/* Wrong email link */}
      <div className="mt-5 text-center text-[0.83rem] text-[#64748B]">
        Wrong email?{" "}
        <Link
          href="/signup"
          className="text-[#2563EB] font-semibold hover:border-b hover:border-[#2563EB] transition-all"
        >
          Go back and change it
        </Link>
      </div>

      {/* Demo hint */}
      <div className="mt-6 text-[0.7rem] text-[#64748B] text-center border-t border-[#edf2f7] pt-4 flex items-center justify-center gap-1.5">
        <Sparkles className="w-3.5 h-3.5 text-amber-500" />
        <span>Check your spam folder if you don't see the email</span>
      </div>
    </div>
  );
}
