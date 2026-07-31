'use client';

import React, { useState, useRef } from 'react';
import Link from 'next/link';
import { GraduationCap, Building2, Eye, EyeOff, Check, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';

type Role = 'student' | 'admin';

interface FormState {
  firstName: string;
  lastName: string;
  email: string;
  matric: string;
  level: string;
  password: string;
  terms: boolean;
}

interface FormErrors {
  firstName?: string;
  lastName?: string;
  email?: string;
  matric?: string;
  level?: string;
  password?: string;
  terms?: string;
}

interface SignupCardProps {
  borderless?: boolean;
  className?: string;
}

export function SignupCard({ borderless = false, className }: SignupCardProps) {
  const [role, setRole] = useState<Role>('student');
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [formData, setFormData] = useState<FormState>({
    firstName: 'Aisha',
    lastName: 'Oladele',
    email: 'aisha.oladele@university.edu',
    matric: 'U20CS1234',
    level: '100',
    password: 'SecurePass123',
    terms: true,
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const formRef = useRef<HTMLFormElement>(null);
  const firstNameRef = useRef<HTMLInputElement>(null);
  const lastNameRef = useRef<HTMLInputElement>(null);
  const emailRef = useRef<HTMLInputElement>(null);
  const matricRef = useRef<HTMLInputElement>(null);
  const levelRef = useRef<HTMLSelectElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);
  const termsRef = useRef<HTMLInputElement>(null);

  const handleInputChange = (
    field: keyof FormState,
    value: string | boolean
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const newErrors: FormErrors = {};
    if (!formData.firstName.trim()) newErrors.firstName = 'First name is required';
    if (!formData.lastName.trim()) newErrors.lastName = 'Last name is required';
    if (!formData.email.trim()) newErrors.email = 'School email is required';
    if (!formData.matric.trim()) newErrors.matric = role === 'student' ? 'Matric number is required' : 'Staff ID / Code is required';
    if (!formData.level && role === 'student') newErrors.level = 'Level is required';
    if (!formData.password) newErrors.password = 'Password is required';
    if (!formData.terms) newErrors.terms = 'You must agree to the terms';

    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) {
      if (newErrors.firstName) firstNameRef.current?.focus();
      else if (newErrors.lastName) lastNameRef.current?.focus();
      else if (newErrors.email) emailRef.current?.focus();
      else if (newErrors.matric) matricRef.current?.focus();
      else if (newErrors.level) levelRef.current?.focus();
      else if (newErrors.password) passwordRef.current?.focus();
      else if (newErrors.terms) termsRef.current?.focus();
      return;
    }

    setIsSubmitted(true);
    setTimeout(() => {
      setIsSubmitted(false);
    }, 2500);
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
      aria-labelledby="auth-heading"
    >
      <h1
        id="auth-heading"
        className="text-2xl sm:text-[1.6rem] font-bold text-[#0b1a33] tracking-tight mb-1.5"
      >
        Create your heightt account
      </h1>
      <p className="text-[0.95rem] text-[#5b6d89] mb-7 font-normal leading-snug">
        Pick the experience that fits you.
      </p>

      {/* Role Toggle Cards */}
      <div
        className="grid grid-cols-2 gap-3 mb-7"
        role="radiogroup"
        aria-label="Account type"
      >
        <button
          type="button"
          onClick={() => setRole('student')}
          aria-checked={role === 'student'}
          role="radio"
          className={cn(
            'bg-[#f0f3f8] rounded-[18px] p-4 text-center cursor-pointer border-2 border-transparent transition-all duration-200 text-sm text-[#1f2a44] flex flex-col items-center gap-1 font-medium',
            role === 'student' &&
              'bg-[#eef4ff] border-[#1a5cff] shadow-[0_4px_12px_rgba(26,92,255,0.08)]'
          )}
        >
          <span className="flex items-center gap-2 font-semibold text-[0.95rem]">
            <GraduationCap
              className={cn(
                'w-4 h-4 shrink-0 opacity-60 text-current transition-opacity',
                role === 'student' && 'opacity-100 text-[#1a5cff]'
              )}
            />
            I'm a Student
          </span>
          <span
            className={cn(
              'text-[0.7rem] font-normal text-[#5b6d89] leading-tight',
              role === 'student' && 'text-[#1f3a6b]'
            )}
          >
            Pay dues, save, attend events.
          </span>
        </button>

        <button
          type="button"
          onClick={() => setRole('admin')}
          aria-checked={role === 'admin'}
          role="radio"
          className={cn(
            'bg-[#f0f3f8] rounded-[18px] p-4 text-center cursor-pointer border-2 border-transparent transition-all duration-200 text-sm text-[#1f2a44] flex flex-col items-center gap-1 font-medium',
            role === 'admin' &&
              'bg-[#eef4ff] border-[#1a5cff] shadow-[0_4px_12px_rgba(26,92,255,0.08)]'
          )}
        >
          <span className="flex items-center gap-2 font-semibold text-[0.95rem]">
            <Building2
              className={cn(
                'w-4 h-4 shrink-0 opacity-60 text-current transition-opacity',
                role === 'admin' && 'opacity-100 text-[#1a5cff]'
              )}
            />
            Organization Admin
          </span>
          <span
            className={cn(
              'text-[0.7rem] font-normal text-[#5b6d89] leading-tight',
              role === 'admin' && 'text-[#1f3a6b]'
            )}
          >
            Run a department, faculty or club.
          </span>
        </button>
      </div>

      {/* Signup Form */}
      <form id="signupForm" ref={formRef} onSubmit={handleSubmit} noValidate>
        <div className="flex flex-col gap-4 mt-1">
          {/* First + Last name */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div className="flex flex-col gap-1">
              <label
                htmlFor="firstName"
                className="text-[0.75rem] font-semibold text-[#1f2a44] tracking-wide uppercase opacity-70"
              >
                First name
              </label>
              <input
                ref={firstNameRef}
                type="text"
                id="firstName"
                placeholder="e.g. Aisha"
                value={formData.firstName}
                onChange={(e) => handleInputChange('firstName', e.target.value)}
                className={cn(
                  'bg-[#f8faff] border-[1.5px] border-[#e2e8f0] rounded-[14px] px-3.5 py-3 text-[0.95rem] font-medium text-[#0b1a33] transition-all duration-150 w-full placeholder:text-[#9aabbf] focus:outline-none focus:border-[#1a5cff] focus:bg-white focus:ring-4 focus:ring-[#1a5cff]/10',
                  errors.firstName && 'border-[#e53e3e] bg-[#fff8f8]'
                )}
                required
              />
              {errors.firstName && (
                <span className="text-[0.7rem] text-[#e53e3e] pl-1 min-h-[16px]">
                  {errors.firstName}
                </span>
              )}
            </div>

            <div className="flex flex-col gap-1">
              <label
                htmlFor="lastName"
                className="text-[0.75rem] font-semibold text-[#1f2a44] tracking-wide uppercase opacity-70"
              >
                Last name
              </label>
              <input
                ref={lastNameRef}
                type="text"
                id="lastName"
                placeholder="e.g. Oladele"
                value={formData.lastName}
                onChange={(e) => handleInputChange('lastName', e.target.value)}
                className={cn(
                  'bg-[#f8faff] border-[1.5px] border-[#e2e8f0] rounded-[14px] px-3.5 py-3 text-[0.95rem] font-medium text-[#0b1a33] transition-all duration-150 w-full placeholder:text-[#9aabbf] focus:outline-none focus:border-[#1a5cff] focus:bg-white focus:ring-4 focus:ring-[#1a5cff]/10',
                  errors.lastName && 'border-[#e53e3e] bg-[#fff8f8]'
                )}
                required
              />
              {errors.lastName && (
                <span className="text-[0.7rem] text-[#e53e3e] pl-1 min-h-[16px]">
                  {errors.lastName}
                </span>
              )}
            </div>
          </div>

          {/* School email */}
          <div className="flex flex-col gap-1">
            <label
              htmlFor="email"
              className="text-[0.75rem] font-semibold text-[#1f2a44] tracking-wide uppercase opacity-70"
            >
              School email
            </label>
            <input
              ref={emailRef}
              type="email"
              id="email"
              placeholder="aisha.oladele@university.edu"
              value={formData.email}
              onChange={(e) => handleInputChange('email', e.target.value)}
              className={cn(
                'bg-[#f8faff] border-[1.5px] border-[#e2e8f0] rounded-[14px] px-3.5 py-3 text-[0.95rem] font-medium text-[#0b1a33] transition-all duration-150 w-full placeholder:text-[#9aabbf] focus:outline-none focus:border-[#1a5cff] focus:bg-white focus:ring-4 focus:ring-[#1a5cff]/10',
                errors.email && 'border-[#e53e3e] bg-[#fff8f8]'
              )}
              required
            />
            {errors.email && (
              <span className="text-[0.7rem] text-[#e53e3e] pl-1 min-h-[16px]">
                {errors.email}
              </span>
            )}
          </div>

          {/* Matric number / Staff ID */}
          <div className="flex flex-col gap-1">
            <label
              htmlFor="matric"
              className="text-[0.75rem] font-semibold text-[#1f2a44] tracking-wide uppercase opacity-70"
            >
              {role === 'student' ? 'Matric number' : 'Staff / Admin ID'}
            </label>
            <input
              ref={matricRef}
              type="text"
              id="matric"
              placeholder={role === 'student' ? 'e.g. U20CS1234' : 'e.g. ADM-9082'}
              value={formData.matric}
              onChange={(e) => handleInputChange('matric', e.target.value)}
              className={cn(
                'bg-[#f8faff] border-[1.5px] border-[#e2e8f0] rounded-[14px] px-3.5 py-3 text-[0.95rem] font-medium text-[#0b1a33] transition-all duration-150 w-full placeholder:text-[#9aabbf] focus:outline-none focus:border-[#1a5cff] focus:bg-white focus:ring-4 focus:ring-[#1a5cff]/10',
                errors.matric && 'border-[#e53e3e] bg-[#fff8f8]'
              )}
              required
            />
            {errors.matric && (
              <span className="text-[0.7rem] text-[#e53e3e] pl-1 min-h-[16px]">
                {errors.matric}
              </span>
            )}
          </div>

          {/* Level + Password Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            {role === 'student' ? (
              <div className="flex flex-col gap-1">
                <label
                  htmlFor="level"
                  className="text-[0.75rem] font-semibold text-[#1f2a44] tracking-wide uppercase opacity-70"
                >
                  Level
                </label>
                <select
                  ref={levelRef}
                  id="level"
                  value={formData.level}
                  onChange={(e) => handleInputChange('level', e.target.value)}
                  className={cn(
                    'bg-[#f8faff] border-[1.5px] border-[#e2e8f0] rounded-[14px] px-3.5 py-3 text-[0.95rem] font-medium text-[#0b1a33] transition-all duration-150 w-full appearance-none focus:outline-none focus:border-[#1a5cff] focus:bg-white focus:ring-4 focus:ring-[#1a5cff]/10 pr-10',
                    'bg-[url("data:image/svg+xml,%3Csvg_xmlns=\'http://www.w3.org/2000/svg\'_width=\'12\'_height=\'8\'_viewBox=\'0_0_12_8\'%3E%3Cpath_d=\'M1_1.5l5_5_5-5\'_stroke=\'%235b6d89\'_stroke-width=\'1.5\'_fill=\'none\'_stroke-linecap=\'round\'/%3E%3C/svg%3E")] bg-no-repeat bg-[right_14px_center]',
                    errors.level && 'border-[#e53e3e] bg-[#fff8f8]'
                  )}
                  required
                >
                  <option value="">Select</option>
                  <option value="100">100</option>
                  <option value="200">200</option>
                  <option value="300">300</option>
                  <option value="400">400</option>
                  <option value="500">500</option>
                  <option value="postgrad">Postgraduate</option>
                </select>
                {errors.level && (
                  <span className="text-[0.7rem] text-[#e53e3e] pl-1 min-h-[16px]">
                    {errors.level}
                  </span>
                )}
              </div>
            ) : (
              <div className="flex flex-col gap-1">
                <label
                  htmlFor="orgType"
                  className="text-[0.75rem] font-semibold text-[#1f2a44] tracking-wide uppercase opacity-70"
                >
                  Org Category
                </label>
                <select
                  id="orgType"
                  defaultValue="department"
                  className="bg-[#f8faff] border-[1.5px] border-[#e2e8f0] rounded-[14px] px-3.5 py-3 text-[0.95rem] font-medium text-[#0b1a33] transition-all duration-150 w-full appearance-none focus:outline-none focus:border-[#1a5cff] focus:bg-white focus:ring-4 focus:ring-[#1a5cff]/10 pr-10 bg-[url('data:image/svg+xml,%3Csvg_xmlns=\'http://www.w3.org/2000/svg\'_width=\'12\'_height=\'8\'_viewBox=\'0_0_12_8\'%3E%3Cpath_d=\'M1_1.5l5_5_5-5\'_stroke=\'%235b6d89\'_stroke-width=\'1.5\'_fill=\'none\'_stroke-linecap=\'round\'/%3E%3C/svg%3E')] bg-no-repeat bg-[right_14px_center]"
                >
                  <option value="department">Department</option>
                  <option value="faculty">Faculty</option>
                  <option value="association">Student Club / Society</option>
                  <option value="hall">Residence Hall</option>
                </select>
              </div>
            )}

            <div className="flex flex-col gap-1 relative">
              <label
                htmlFor="password"
                className="text-[0.75rem] font-semibold text-[#1f2a44] tracking-wide uppercase opacity-70"
              >
                Password
              </label>
              <div className="relative w-full">
                <input
                  ref={passwordRef}
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={(e) => handleInputChange('password', e.target.value)}
                  className={cn(
                    'bg-[#f8faff] border-[1.5px] border-[#e2e8f0] rounded-[14px] pl-3.5 pr-10 py-3 text-[0.95rem] font-medium text-[#0b1a33] transition-all duration-150 w-full placeholder:text-[#9aabbf] focus:outline-none focus:border-[#1a5cff] focus:bg-white focus:ring-4 focus:ring-[#1a5cff]/10',
                    errors.password && 'border-[#e53e3e] bg-[#fff8f8]'
                  )}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 focus:outline-none"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
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
                  {errors.password}
                </span>
              )}
            </div>
          </div>

          {/* Terms checkbox */}
          <div className="flex items-start gap-3 my-2">
            <input
              ref={termsRef}
              type="checkbox"
              id="termsCheck"
              checked={formData.terms}
              onChange={(e) => handleInputChange('terms', e.target.checked)}
              className={cn(
                'w-[18px] h-[18px] mt-0.5 accent-[#1a5cff] shrink-0 rounded border border-[#cbd5e1] cursor-pointer focus:ring-2 focus:ring-[#1a5cff]/20',
                errors.terms && 'outline-2 outline-[#e53e3e] outline-offset-2'
              )}
              required
            />
            <label
              htmlFor="termsCheck"
              className="text-[0.88rem] text-[#1f2a44] leading-relaxed select-none"
            >
              I agree to the{' '}
              <a
                href="#"
                className="text-[#1a5cff] font-semibold hover:border-b hover:border-[#1a5cff] transition-all"
              >
                Terms
              </a>{' '}
              and{' '}
              <a
                href="#"
                className="text-[#1a5cff] font-semibold hover:border-b hover:border-[#1a5cff] transition-all"
              >
                Privacy Policy
              </a>
              .
            </label>
          </div>

          {/* Submit button */}
          <button
            type="submit"
            className={cn(
              'border-none rounded-[40px] px-5 py-4 text-base font-semibold text-white w-full cursor-pointer transition-all duration-200 mt-2 tracking-tight shadow-[0_8px_24px_rgba(26,92,255,0.25)] flex items-center justify-center gap-2 active:scale-[0.98]',
              isSubmitted
                ? 'bg-[#0f7b4a] shadow-[0_8px_24px_rgba(15,123,74,0.25)]'
                : 'bg-[#1a5cff] hover:bg-[#0f4ad0] hover:shadow-[0_12px_28px_rgba(26,92,255,0.3)]'
            )}
          >
            {isSubmitted ? (
              <>
                <Check className="w-5 h-5 text-white animate-bounce" />
                <span>✓ Account created!</span>
              </>
            ) : (
              'Create account'
            )}
          </button>

          {/* Signin link */}
          <div className="text-center mt-4 text-[0.92rem] text-[#3d4f6b]">
            Already have an account?{' '}
            <Link
              href="/signin"
              className="text-[#1a5cff] font-semibold hover:border-b hover:border-[#1a5cff] transition-all"
            >
              Sign in
            </Link>
          </div>
        </div>
      </form>

      {/* Subtle demo hint */}
      <div className="mt-5 text-[0.7rem] text-[#7a8ba3] text-center border-t border-[#edf2f7] pt-4 flex items-center justify-center gap-1.5">
        <Sparkles className="w-3.5 h-3.5 text-amber-500" />
        <span>Pre-filled for demo · all fields required</span>
      </div>
    </div>
  );
}
