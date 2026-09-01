// src/components/auth/SignupCard.tsx

"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Eye, EyeOff, Check, Sparkles } from "lucide-react";
import { Logo } from "@/components/ui/Logo";
import { cn } from "@/lib/utils";
import { useAuthStore } from "@/store/auth-store";

const signupSchema = z.object({
  email: z
    .string()
    .min(1, "Email is required")
    .email("Enter a valid email address"),
  username: z
    .string()
    .min(3, "Username must be at least 3 characters")
    .max(30, "Username must be at most 30 characters")
    .regex(
      /^[a-zA-Z0-9_.-]+$/,
      "Username can only contain letters, numbers, underscores, dots, and hyphens",
    ),
  password: z
    .string()
    .min(8, "Must be at least 8 characters")
    .regex(/[A-Z]/, "Must include an uppercase letter")
    .regex(/\d/, "Must include a number"),
});

type SignupFormData = z.infer<typeof signupSchema>;

interface SignupCardProps {
  borderless?: boolean;
  className?: string;
}

export function SignupCard({ borderless = false, className }: SignupCardProps) {
  const router = useRouter();
  const { register: registerUser, isLoading } = useAuthStore();
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignupFormData>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      email: "",
      username: "",
      password: "",
    },
  });

  const onSubmit = async (data: SignupFormData) => {
    setError(null);
    try {
      const result = await registerUser({
        email: data.email,
        username: data.username,
        password: data.password,
      });

      setIsSubmitted(true);
      setTimeout(() => {
        router.push(
          `/verify-email-sent?email=${encodeURIComponent(data.email)}`,
        );
      }, 1200);
    } catch {
      setError('Registration failed. Please try again.');
    }
  };

  return (
    <div
      className={cn(
        "w-full max-w-[520px] transition-all duration-200",
        borderless
          ? "bg-white sm:bg-transparent p-6 sm:p-0 rounded-3xl sm:rounded-none border border-slate-200/90 sm:border-none shadow-xl shadow-slate-900/5 sm:shadow-none"
          : "bg-white p-6 sm:p-9 md:p-10 rounded-[28px] sm:rounded-[32px] shadow-[0_20px_60px_rgba(0,20,40,0.08),0_8px_24px_rgba(0,0,0,0.02)] border border-slate-200/80",
        className,
      )}
      role="main"
      aria-labelledby="auth-heading"
    >
      {/* Logo - Hidden on mobile if header already has it */}
      <div className="hidden sm:block mb-6">
        <Logo />
      </div>

      <h1
        id="auth-heading"
        className="text-2xl sm:text-[1.6rem] font-bold text-[#0b1a33] tracking-tight mb-1.5"
      >
        Create your heightt account
      </h1>
      <p className="text-[0.92rem] text-[#5b6d89] mb-6 font-normal leading-snug">
        Sign up with your email, username, and password.
      </p>

      {error && (
        <div className="mb-4 p-3 rounded-xl bg-red-50 border border-red-200 text-red-600 text-sm">
          ❌ {error}
        </div>
      )}

      {isSubmitted && (
        <div className="mb-4 p-3 rounded-xl bg-green-50 border border-green-200 text-green-600 text-sm">
          ✅ Account created! Redirecting...
        </div>
      )}

      <form id="signupForm" onSubmit={handleSubmit(onSubmit)} noValidate>
        <div className="flex flex-col gap-4">
          {/* Email */}
          <div className="flex flex-col gap-1.5">
            <label
              htmlFor="signupEmail"
              className="text-[0.75rem] font-bold text-[#1f2a44] tracking-wide uppercase opacity-80"
            >
              Email
            </label>
            <input
              {...register("email")}
              type="email"
              id="signupEmail"
              placeholder="e.g. name@example.com"
              autoComplete="email"
              className={cn(
                "bg-white sm:bg-[#f8faff] border-[1.5px] border-[#cbd5e1] rounded-[14px] px-3.5 py-3 text-[0.95rem] font-medium text-[#0b1a33] transition-all duration-150 w-full placeholder:text-[#9aabbf] focus:outline-none focus:border-[#1a5cff] focus:bg-white focus:ring-4 focus:ring-[#1a5cff]/10 shadow-xs",
                errors.email && "border-[#e53e3e] bg-[#fff8f8]",
              )}
            />
            {errors.email && (
              <span className="text-[0.7rem] text-[#e53e3e] pl-1 min-h-[16px]">
                {errors.email.message}
              </span>
            )}
          </div>

          {/* Username */}
          <div className="flex flex-col gap-1.5">
            <label
              htmlFor="signupUsername"
              className="text-[0.75rem] font-bold text-[#1f2a44] tracking-wide uppercase opacity-80"
            >
              Username
            </label>
            <input
              {...register("username")}
              type="text"
              id="signupUsername"
              placeholder="Choose a username"
              autoComplete="username"
              className={cn(
                "bg-white sm:bg-[#f8faff] border-[1.5px] border-[#cbd5e1] rounded-[14px] px-3.5 py-3 text-[0.95rem] font-medium text-[#0b1a33] transition-all duration-150 w-full placeholder:text-[#9aabbf] focus:outline-none focus:border-[#1a5cff] focus:bg-white focus:ring-4 focus:ring-[#1a5cff]/10 shadow-xs",
                errors.username && "border-[#e53e3e] bg-[#fff8f8]",
              )}
            />
            {errors.username && (
              <span className="text-[0.7rem] text-[#e53e3e] pl-1 min-h-[16px]">
                {errors.username.message}
              </span>
            )}
          </div>

          {/* Password */}
          <div className="flex flex-col gap-1.5 relative">
            <label
              htmlFor="signupPassword"
              className="text-[0.75rem] font-bold text-[#1f2a44] tracking-wide uppercase opacity-80"
            >
              Password
            </label>
            <div className="relative w-full">
              <input
                {...register("password")}
                type={showPassword ? "text" : "password"}
                id="signupPassword"
                placeholder="••••••••"
                autoComplete="new-password"
                className={cn(
                  "bg-white sm:bg-[#f8faff] border-[1.5px] border-[#cbd5e1] rounded-[14px] pl-3.5 pr-10 py-3 text-[0.95rem] font-medium text-[#0b1a33] transition-all duration-150 w-full placeholder:text-[#9aabbf] focus:outline-none focus:border-[#1a5cff] focus:bg-white focus:ring-4 focus:ring-[#1a5cff]/10 shadow-xs",
                  errors.password && "border-[#e53e3e] bg-[#fff8f8]",
                )}
              />
              <button
                type="button"
                onClick={() => setShowPassword((p) => !p)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 focus:outline-none p-1"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? (
                  <EyeOff className="w-4 h-4" />
                ) : (
                  <Eye className="w-4 h-4" />
                )}
              </button>
            </div>
            {errors.password && (
              <span className="text-[0.7rem] text-[#e53e3e] pl-1 min-h-[16px]">
                {errors.password.message}
              </span>
            )}
          </div>

          {/* Submit button */}
          <button
            type="submit"
            id="signupSubmit"
            disabled={isLoading}
            className={cn(
              "border-none rounded-[40px] px-5 py-3.5 sm:py-4 text-base font-semibold text-white w-full cursor-pointer transition-all duration-200 mt-2 tracking-tight shadow-[0_8px_24px_rgba(26,92,255,0.25)] flex items-center justify-center gap-2 active:scale-[0.98]",
              isSubmitted
                ? "bg-[#0f7b4a] shadow-[0_8px_24px_rgba(15,123,74,0.25)]"
                : "bg-[#1a5cff] hover:bg-[#0f4ad0] hover:shadow-[0_12px_28px_rgba(26,92,255,0.3)]",
              isLoading && "opacity-70 cursor-not-allowed",
            )}
          >
            {isLoading ? (
              <>
                <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>Creating account...</span>
              </>
            ) : isSubmitted ? (
              <>
                <Check className="w-5 h-5 text-white animate-bounce" />
                <span>✓ Account Created!</span>
              </>
            ) : (
              "Sign Up"
            )}
          </button>

          {/* Signin link */}
          <div className="text-center mt-3 sm:mt-4 text-[0.92rem] text-[#3d4f6b]">
            Already have an account?{" "}
            <Link
              href="/signin"
              className="text-[#1a5cff] font-semibold hover:underline transition-all"
            >
              Sign In
            </Link>
          </div>
        </div>
      </form>

      {/* Subtle hint */}
      <div className="mt-5 text-[0.72rem] text-[#7a8ba3] text-center border-t border-[#edf2f7] pt-4 flex items-center justify-center gap-1.5">
        <Sparkles className="w-3.5 h-3.5 text-amber-500" />
        <span>Join student organizations on Heightt</span>
      </div>
    </div>
  );
}
