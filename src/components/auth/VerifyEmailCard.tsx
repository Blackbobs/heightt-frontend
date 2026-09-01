"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Mail,
  RotateCcw,
  ArrowRight,
  CheckCircle2,
  Sparkles,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuthStore } from "@/store/auth-store";
import { HeighttLoader } from "@/components/ui/HeighttLoader";

const OTP_LENGTH = 6;
const RESEND_COOLDOWN = 30;

export function VerifyEmailCard() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get("email") ?? "your email";
  const { verifyEmail, resendVerification, isLoading } = useAuthStore();

  const [digits, setDigits] = useState<string[]>(Array(OTP_LENGTH).fill(""));
  const [error, setError] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  const [countdown, setCountdown] = useState(RESEND_COOLDOWN);
  const [canResend, setCanResend] = useState(false);
  const [verificationToken, setVerificationToken] = useState<string | null>(
    null,
  );

  const inputRefs = React.useRef<(HTMLInputElement | null)[]>([]);

  // Get token from URL on component mount
  useEffect(() => {
    const token = searchParams.get("token");
    if (token) {
      setVerificationToken(token);
      // Auto-verify if token is present
      handleTokenVerification(token);
    }
  }, [searchParams]);

  const handleTokenVerification = async (token: string) => {
    setIsVerifying(true);
    try {
      await verifyEmail(token);
      setIsVerified(true);
      setTimeout(() => router.push("/onboarding"), 1800);
    } catch {
      setError('Verification failed. Please try again.');
    } finally {
      setIsVerifying(false);
    }
  };

  /* ── Countdown timer ─────────────────────────────────────────── */
  useEffect(() => {
    if (countdown <= 0) {
      setCanResend(true);
      return;
    }
    const timer = setTimeout(() => setCountdown((c) => c - 1), 1000);
    return () => clearTimeout(timer);
  }, [countdown]);

  /* ── OTP helpers ─────────────────────────────────────────────── */
  const focusInput = (index: number) => {
    inputRefs.current[index]?.focus();
  };

  const handleChange = (index: number, value: string) => {
    const char = value.replace(/\D/g, "").slice(-1);
    const next = [...digits];
    next[index] = char;
    setDigits(next);
    setError("");

    if (char && index < OTP_LENGTH - 1) {
      focusInput(index + 1);
    }
  };

  const handleKeyDown = (
    index: number,
    e: React.KeyboardEvent<HTMLInputElement>,
  ) => {
    if (e.key === "Backspace") {
      if (digits[index]) {
        const next = [...digits];
        next[index] = "";
        setDigits(next);
      } else if (index > 0) {
        focusInput(index - 1);
      }
    } else if (e.key === "ArrowLeft" && index > 0) {
      focusInput(index - 1);
    } else if (e.key === "ArrowRight" && index < OTP_LENGTH - 1) {
      focusInput(index + 1);
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pasted = e.clipboardData
      .getData("text")
      .replace(/\D/g, "")
      .slice(0, OTP_LENGTH);
    const next = [...digits];
    for (let i = 0; i < pasted.length; i++) next[i] = pasted[i];
    setDigits(next);
    focusInput(Math.min(pasted.length, OTP_LENGTH - 1));
  };

  /* ── Submit OTP ────────────────────────────────────────────────── */
  const handleVerifyOTP = async () => {
    const code = digits.join("");
    if (code.length < OTP_LENGTH) {
      setError("Please enter all 6 digits.");
      return;
    }
    setIsVerifying(true);
    setError("");

    try {
      // Construct a fake token from OTP for demo
      const fakeToken = `otp_${code}_${Date.now()}`;
      await verifyEmail(fakeToken);
      setIsVerified(true);
      setTimeout(() => router.push("/onboarding"), 1800);
    } catch {
      setError('Invalid verification code. Please try again.');
    } finally {
      setIsVerifying(false);
    }
  };

  /* ── Auto-submit when all filled ─────────────────────────────── */
  useEffect(() => {
    if (
      digits.every((d) => d !== "") &&
      !isVerified &&
      !isVerifying &&
      !verificationToken
    ) {
      handleVerifyOTP();
    }
  }, [digits]);

  /* ── Resend ──────────────────────────────────────────────────── */
  const handleResend = async () => {
    if (!canResend) return;
    setCountdown(RESEND_COOLDOWN);
    setCanResend(false);
    setDigits(Array(OTP_LENGTH).fill(""));
    setError("");
    focusInput(0);

    try {
      await resendVerification(email);
    } catch {
      setError('Failed to resend verification email. Please try again.');
    }
  };

  /* ── Render ──────────────────────────────────────────────────── */
  return (
    <div
      className="w-full max-w-[520px]"
      role="main"
      aria-labelledby="verify-heading"
    >
      {/* Icon badge */}
      <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#eef4ff] to-[#dbeafe] flex items-center justify-center mb-6 shadow-[0_4px_16px_rgba(26,92,255,0.12)]">
        {isVerified ? (
          <CheckCircle2 className="w-8 h-8 text-[#0f7b4a] animate-bounce" />
        ) : (
          <Mail className="w-8 h-8 text-[#1a5cff]" />
        )}
      </div>

      <h1
        id="verify-heading"
        className="text-2xl sm:text-[1.6rem] font-bold text-[#0b1a33] tracking-tight mb-1.5"
      >
        {isVerified ? "Email verified!" : "Check your inbox"}
      </h1>
      <p className="text-[0.95rem] text-[#5b6d89] mb-7 font-normal leading-snug">
        {isVerified ? (
          "Taking you to your dashboard…"
        ) : (
          <>
            We sent a verification link to&nbsp;
            <strong className="text-[#1a5cff] font-semibold">{email}</strong>.
          </>
        )}
      </p>

      {/* Error */}
      {error && (
        <p className="text-[0.75rem] text-[#e53e3e] mb-4 pl-1" role="alert">
          {error}
        </p>
      )}

      {/* OTP inputs (only shown if no token in URL) */}
      {!isVerified && !verificationToken && (
        <>
          <div
            className="flex gap-2.5 sm:gap-3 mb-2"
            role="group"
            aria-label="6-digit verification code"
            onPaste={handlePaste}
          >
            {digits.map((digit, i) => (
              <input
                key={i}
                ref={(el) => {
                  inputRefs.current[i] = el;
                }}
                id={`otp-${i}`}
                type="text"
                inputMode="numeric"
                pattern="[0-9]*"
                maxLength={1}
                value={digit}
                autoFocus={i === 0}
                autoComplete="one-time-code"
                aria-label={`Digit ${i + 1}`}
                onChange={(e) => handleChange(i, e.target.value)}
                onKeyDown={(e) => handleKeyDown(i, e)}
                className={cn(
                  "flex-1 min-w-0 w-0 h-14 sm:h-16 rounded-[14px] border-[1.5px] text-center text-xl font-bold text-[#0b1a33] bg-[#f8faff] transition-all duration-150",
                  "focus:outline-none focus:border-[#1a5cff] focus:ring-4 focus:ring-[#1a5cff]/10 focus:bg-white",
                  "placeholder:text-[#c8d6e8]",
                  error
                    ? "border-[#e53e3e] bg-[#fff8f8]"
                    : digit
                      ? "border-[#1a5cff] bg-[#eef4ff]"
                      : "border-[#e2e8f0]",
                )}
              />
            ))}
          </div>

          {/* Verify button */}
          <button
            id="verifyBtn"
            type="button"
            onClick={handleVerifyOTP}
            disabled={isVerifying || digits.some((d) => !d)}
            className={cn(
              "w-full mt-4 rounded-[40px] px-5 py-4 text-base font-semibold text-white flex items-center justify-center gap-2",
              "transition-all duration-200 shadow-[0_8px_24px_rgba(26,92,255,0.25)] active:scale-[0.98]",
              isVerifying || digits.some((d) => !d)
                ? "bg-[#93b4ff] cursor-not-allowed shadow-none"
                : "bg-[#1a5cff] hover:bg-[#0f4ad0] hover:shadow-[0_12px_28px_rgba(26,92,255,0.3)] cursor-pointer",
            )}
          >
            {isVerifying ? (
              <>
                <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>Verifying…</span>
              </>
            ) : (
              <>
                <span>Verify email</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>

          {/* Resend */}
          <div className="mt-6 text-center text-[0.88rem] text-[#5b6d89]">
            {canResend ? (
              <button
                type="button"
                onClick={handleResend}
                className="inline-flex items-center gap-1.5 text-[#1a5cff] font-semibold hover:opacity-80 transition-opacity cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                Resend code
              </button>
            ) : (
              <span>
                Resend code in{" "}
                <strong className="text-[#1a5cff] tabular-nums">
                  {countdown}s
                </strong>
              </span>
            )}
          </div>

          {/* Wrong email */}
          <div className="mt-4 text-center text-[0.83rem] text-[#7a8ba3]">
            Wrong email?{" "}
            <Link
              href="/signup"
              className="text-[#1a5cff] font-semibold hover:border-b hover:border-[#1a5cff] transition-all"
            >
              Go back
            </Link>
          </div>

          {/* Demo hint */}
          <div className="mt-8 text-[0.7rem] text-[#7a8ba3] text-center border-t border-[#edf2f7] pt-4 flex items-center justify-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            <span>Demo mode · any 6-digit code is accepted</span>
          </div>
        </>
      )}

      {/* Verifying with token */}
      {isVerifying && verificationToken && (
        <div className="flex flex-col items-center justify-center py-8">
          <HeighttLoader className="mb-4" label="Verifying your email" />
          <p className="text-[#5b6d89]">Verifying your email...</p>
        </div>
      )}
    </div>
  );
}
