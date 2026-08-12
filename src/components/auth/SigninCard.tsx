'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { GraduationCap, Building2, ShieldCheck, Eye, EyeOff, Check, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuthStore } from '@/store/auth-store';

/* ─── Zod Schema ─────────────────────────────────────────────── */
const signinSchema = z.object({
  identifier: z
    .string()
    .min(1, 'Email or username is required'),
  password: z.string().min(1, 'Password is required'),
  rememberMe: z.boolean().optional(),
});

type SigninFormData = z.infer<typeof signinSchema>;

/* ─── Demo credentials ───────────────────────────────────────── */
type DemoRole = 'student' | 'org' | 'admin';

const DEMO_CREDENTIALS: Record<DemoRole, Pick<SigninFormData, 'identifier' | 'password'>> = {
  student: { identifier: 'aisha.oladele@university.edu', password: 'StudentPass123!' },
  org:     { identifier: 'admin.nacos@university.edu',   password: 'OrgPass123!' },
  admin:   { identifier: 'superadmin@heightt.edu',        password: 'AdminPass123!' },
};

/* ─── Component ──────────────────────────────────────────────── */
interface SigninCardProps {
  borderless?: boolean;
  className?: string;
}

export function SigninCard({ borderless = false, className }: SigninCardProps) {
  const router = useRouter();
  const { login, isLoading } = useAuthStore();
  const [activeDemo, setActiveDemo] = useState<DemoRole | null>('student');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<SigninFormData>({
    resolver: zodResolver(signinSchema),
    defaultValues: {
      ...DEMO_CREDENTIALS.student,
      rememberMe: true,
    },
  });

  const handleDemoSelect = (role: DemoRole) => {
    setActiveDemo(role);
    reset({ ...DEMO_CREDENTIALS[role], rememberMe: true });
    setError(null);
  };

  const onSubmit = async (data: SigninFormData) => {
    setError(null);
    try {
      const result = await login(data.identifier, data.password);
      setIsSubmitted(true);
      setTimeout(() => {
        router.push('/dashboard');
      }, 1200);
    } catch (err: any) {
      setError(err.message || 'Invalid credentials. Please try again.');
    }
  };

  return (
    <div
      className={cn(
        'w-full max-w-[520px] transition-shadow duration-200',
        borderless
          ? 'bg-transparent p-0 border-none shadow-none'
          : 'bg-white p-7 sm:p-9 md:p-10 rounded-[28px] sm:rounded-[32px] shadow-[0_20px_60px_rgba(0,20,40,0.08),0_8px_24px_rgba(0,0,0,0.02)] border border-slate-100',
        className
      )}
      role="main"
      aria-labelledby="signin-heading"
    >
      <h1
        id="signin-heading"
        className="text-2xl sm:text-[1.6rem] font-bold text-[#0b1a33] tracking-tight mb-1.5"
      >
        Welcome back
      </h1>
      <p className="text-[0.95rem] text-[#5b6d89] mb-6 font-normal leading-snug">
        Sign in to continue managing your campus finances.
      </p>

      {/* Error Message */}
      {error && (
        <div className="mb-4 p-3 rounded-xl bg-red-50 border border-red-200 text-red-600 text-sm">
          ❌ {error}
        </div>
      )}

      {/* Quick Demo Fill Buttons */}
      <div className="mb-6 flex flex-col gap-2">
        <label className="text-[0.7rem] font-semibold text-[#1f2a44] tracking-wider uppercase opacity-60">
          Quick Demo Login
        </label>
        <div className="grid grid-cols-3 gap-2">
          <button
            type="button"
            id="demoStudent"
            onClick={() => handleDemoSelect('student')}
            className={cn(
              'px-2.5 py-2.5 rounded-xl border text-xs font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer',
              activeDemo === 'student'
                ? 'bg-[#eef4ff] border-[#1a5cff] text-[#1a5cff] shadow-sm'
                : 'bg-[#f8faff] border-[#e2e8f0] text-[#3d4f6b] hover:bg-[#f0f4fc]'
            )}
          >
            <GraduationCap className="w-3.5 h-3.5 shrink-0" />
            <span className="truncate">Student</span>
          </button>

          <button
            type="button"
            id="demoOrg"
            onClick={() => handleDemoSelect('org')}
            className={cn(
              'px-2.5 py-2.5 rounded-xl border text-xs font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer',
              activeDemo === 'org'
                ? 'bg-[#eef4ff] border-[#1a5cff] text-[#1a5cff] shadow-sm'
                : 'bg-[#f8faff] border-[#e2e8f0] text-[#3d4f6b] hover:bg-[#f0f4fc]'
            )}
          >
            <Building2 className="w-3.5 h-3.5 shrink-0" />
            <span className="truncate">Org</span>
          </button>

          <button
            type="button"
            id="demoAdmin"
            onClick={() => handleDemoSelect('admin')}
            className={cn(
              'px-2.5 py-2.5 rounded-xl border text-xs font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer',
              activeDemo === 'admin'
                ? 'bg-[#eef4ff] border-[#1a5cff] text-[#1a5cff] shadow-sm'
                : 'bg-[#f8faff] border-[#e2e8f0] text-[#3d4f6b] hover:bg-[#f0f4fc]'
            )}
          >
            <ShieldCheck className="w-3.5 h-3.5 shrink-0" />
            <span className="truncate">Platform Admin</span>
          </button>
        </div>
      </div>

      {/* Signin Form */}
      <form id="signinForm" onSubmit={handleSubmit(onSubmit)} noValidate>
        <div className="flex flex-col gap-4">
          {/* Email or Username */}
          <div className="flex flex-col gap-1">
            <label
              htmlFor="signinIdentifier"
              className="text-[0.75rem] font-semibold text-[#1f2a44] tracking-wide uppercase opacity-70"
            >
              Email or Username
            </label>
            <input
              {...register('identifier')}
              type="text"
              id="signinIdentifier"
              placeholder="Email or username"
              autoComplete="username"
              className={cn(
                'bg-[#f8faff] border-[1.5px] border-[#e2e8f0] rounded-[14px] px-3.5 py-3 text-[0.95rem] font-medium text-[#0b1a33] transition-all duration-150 w-full placeholder:text-[#9aabbf] focus:outline-none focus:border-[#1a5cff] focus:bg-white focus:ring-4 focus:ring-[#1a5cff]/10',
                errors.identifier && 'border-[#e53e3e] bg-[#fff8f8]'
              )}
            />
            {errors.identifier && (
              <span className="text-[0.7rem] text-[#e53e3e] pl-1 min-h-[16px]">
                {errors.identifier.message}
              </span>
            )}
          </div>

          {/* Password */}
          <div className="flex flex-col gap-1 relative">
            <label
              htmlFor="signinPassword"
              className="text-[0.75rem] font-semibold text-[#1f2a44] tracking-wide uppercase opacity-70"
            >
              Password
            </label>
            <div className="relative w-full">
              <input
                {...register('password')}
                type={showPassword ? 'text' : 'password'}
                id="signinPassword"
                placeholder="••••••••"
                autoComplete="current-password"
                className={cn(
                  'bg-[#f8faff] border-[1.5px] border-[#e2e8f0] rounded-[14px] pl-3.5 pr-10 py-3 text-[0.95rem] font-medium text-[#0b1a33] transition-all duration-150 w-full placeholder:text-[#9aabbf] focus:outline-none focus:border-[#1a5cff] focus:bg-white focus:ring-4 focus:ring-[#1a5cff]/10',
                  errors.password && 'border-[#e53e3e] bg-[#fff8f8]'
                )}
              />
              <button
                type="button"
                onClick={() => setShowPassword((p) => !p)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 focus:outline-none"
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            {errors.password && (
              <span className="text-[0.7rem] text-[#e53e3e] pl-1 min-h-[16px]">
                {errors.password.message}
              </span>
            )}
          </div>

          {/* Remember me & Forgot Password */}
          <div className="flex items-center justify-between my-1">
            <label className="flex items-center gap-2 text-[0.88rem] text-[#1f2a44] cursor-pointer select-none">
              <input
                {...register('rememberMe')}
                type="checkbox"
                id="rememberMe"
                className="w-4 h-4 accent-[#1a5cff] rounded border border-[#cbd5e1] focus:ring-2 focus:ring-[#1a5cff]/20 cursor-pointer"
              />
              Remember me
            </label>

            <a
              href="#"
              className="text-[0.88rem] text-[#1a5cff] font-semibold hover:border-b hover:border-[#1a5cff] transition-all"
            >
              Forgot password?
            </a>
          </div>

          {/* Submit button */}
          <button
            type="submit"
            id="signinSubmit"
            disabled={isLoading}
            className={cn(
              'border-none rounded-[40px] px-5 py-4 text-base font-semibold text-white w-full cursor-pointer transition-all duration-200 mt-2 tracking-tight shadow-[0_8px_24px_rgba(26,92,255,0.25)] flex items-center justify-center gap-2 active:scale-[0.98]',
              isSubmitted
                ? 'bg-[#0f7b4a] shadow-[0_8px_24px_rgba(15,123,74,0.25)]'
                : 'bg-[#1a5cff] hover:bg-[#0f4ad0] hover:shadow-[0_12px_28px_rgba(26,92,255,0.3)]',
              isLoading && 'opacity-70 cursor-not-allowed'
            )}
          >
            {isLoading ? (
              <>
                <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>Signing in...</span>
              </>
            ) : isSubmitted ? (
              <>
                <Check className="w-5 h-5 text-white animate-bounce" />
                <span>✓ Signed in!</span>
              </>
            ) : (
              'Sign in'
            )}
          </button>

          {/* Signup link */}
          <div className="text-center mt-4 text-[0.92rem] text-[#3d4f6b]">
            Don&apos;t have an account?{' '}
            <Link
              href="/signup"
              className="text-[#1a5cff] font-semibold hover:border-b hover:border-[#1a5cff] transition-all"
            >
              Create one
            </Link>
          </div>
        </div>
      </form>

      {/* Subtle demo hint */}
      <div className="mt-5 text-[0.7rem] text-[#7a8ba3] text-center border-t border-[#edf2f7] pt-4 flex items-center justify-center gap-1.5">
        <Sparkles className="w-3.5 h-3.5 text-amber-500" />
        <span>Pre-filled with demo credentials · click any role to switch</span>
      </div>
    </div>
  );
}