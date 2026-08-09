'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  GraduationCap,
  Wallet,
  Target,
  Ticket,
  ShieldCheck,
  ArrowRight,
  ArrowLeft,
  Search,
  Users,
  Lightbulb,
  Trophy,
  BookOpen,
  X,
  Check,
  Rocket,
  Info,
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface Organization {
  id: string;
  name: string;
  desc: string;
  category: string;
  icon: React.ReactNode;
}

const MOCK_ORGS: Organization[] = [
  {
    id: 'cs-society',
    name: 'Computer Science Society',
    desc: 'Faculty of Science • 234 members',
    category: 'Departmental',
    icon: <Users className="w-5 h-5 text-[#1a5cff]" />,
  },
  {
    id: 'tech-hub',
    name: 'Tech Hub',
    desc: 'Innovation Club • 156 members',
    category: 'Club',
    icon: <Lightbulb className="w-5 h-5 text-[#1a5cff]" />,
  },
  {
    id: 'sports-assoc',
    name: 'Sports Association',
    desc: 'Athletics • 89 members',
    category: 'Sports',
    icon: <Trophy className="w-5 h-5 text-[#1a5cff]" />,
  },
  {
    id: 'lit-debate',
    name: 'Literary & Debating Society',
    desc: 'Arts & Humanities • 67 members',
    category: 'Society',
    icon: <BookOpen className="w-5 h-5 text-[#1a5cff]" />,
  },
];

const STEP_TITLES = [
  'Welcome',
  'Contact Information',
  'Institution',
  'Faculty & Department',
  'Find Organizations',
  'Finish',
];

const STEP_LABELS = ['Welcome', 'Contact', 'Institution', 'Department', 'Organizations', 'Finish'];

export function OnboardingFlow() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(0);

  // Form states (Name and Level removed as they were collected in Create Account)
  const [studentId, setStudentId] = useState('');
  const [phone, setPhone] = useState('');
  const [institution, setInstitution] = useState('');
  const [faculty, setFaculty] = useState('');
  const [department, setDepartment] = useState('');
  const [orgSearch, setOrgSearch] = useState('');
  const [selectedOrg, setSelectedOrg] = useState<Organization | null>(null);

  // Error states
  const [phoneError, setPhoneError] = useState('');
  const [instError, setInstError] = useState('');
  const [deptError, setDeptError] = useState('');
  const [orgWarn, setOrgWarn] = useState(false);

  const totalSteps = STEP_TITLES.length;

  const goToStep = (step: number) => {
    if (step >= 0 && step < totalSteps) {
      setCurrentStep(step);
    }
  };

  const nextStep = () => goToStep(currentStep + 1);
  const prevStep = () => goToStep(currentStep - 1);

  // Validation functions
  const validateStep1 = () => {
    let valid = true;
    if (!phone.trim() || phone.trim().length < 10) {
      setPhoneError('Please enter a valid phone number');
      valid = false;
    } else {
      setPhoneError('');
    }

    if (valid) nextStep();
  };

  const validateStep2 = () => {
    if (!institution) {
      setInstError('Please select your institution');
    } else {
      setInstError('');
      nextStep();
    }
  };

  const validateStep3 = () => {
    if (!department) {
      setDeptError('Please select your department');
    } else {
      setDeptError('');
      nextStep();
    }
  };

  const validateStep4 = () => {
    if (selectedOrg) {
      nextStep();
    } else {
      setOrgWarn(true);
      setTimeout(() => setOrgWarn(false), 3000);
    }
  };

  const finishOnboarding = () => {
    router.push('/dashboard');
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Enter') {
        if (currentStep === 0) nextStep();
        else if (currentStep === 1) validateStep1();
        else if (currentStep === 2) validateStep2();
        else if (currentStep === 3) validateStep3();
        else if (currentStep === 4) validateStep4();
        else if (currentStep === 5) finishOnboarding();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentStep, phone, institution, department, selectedOrg]);

  const filteredOrgs = MOCK_ORGS.filter(
    (org) =>
      org.name.toLowerCase().includes(orgSearch.toLowerCase()) ||
      org.desc.toLowerCase().includes(orgSearch.toLowerCase())
  );

  const progressPercent = (currentStep / (totalSteps - 1)) * 100;

  return (
    <div className="w-full max-w-[560px] bg-white rounded-3xl border border-slate-200/80 shadow-[0_20px_60px_rgba(0,20,40,0.08)] overflow-hidden transition-all">
      {/* ===== PROGRESS BAR ===== */}
      <div className="px-6 sm:px-8 pt-7 pb-2">
        <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-[#1a5cff] to-[#60a5fa] rounded-full transition-all duration-500 ease-out"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
        <div className="flex justify-between mt-2.5 text-[11px] font-medium text-slate-400 overflow-x-auto pb-1 gap-1">
          {STEP_LABELS.map((label, idx) => (
            <span
              key={idx}
              className={cn(
                'whitespace-nowrap transition-colors',
                idx === currentStep && 'text-[#1a5cff] font-semibold',
                idx < currentStep && 'text-[#0f7b4a] font-medium'
              )}
            >
              {label}
            </span>
          ))}
        </div>
      </div>

      {/* ===== CONTENT AREA ===== */}
      <div className="px-6 sm:px-8 pt-4 pb-8">
        {/* Step Header */}
        <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <span className="w-8 h-8 rounded-full bg-[#1a5cff] text-white flex items-center justify-center font-bold text-sm shadow-sm">
              {currentStep + 1}
            </span>
            <span className="text-lg font-bold text-[#0b1a33]">{STEP_TITLES[currentStep]}</span>
          </div>
          <span className="text-xs font-semibold text-slate-400 bg-slate-100 px-2.5 py-1 rounded-full">
            {currentStep + 1} of {totalSteps}
          </span>
        </div>

        {/* ===== STEP 0: WELCOME ===== */}
        {currentStep === 0 && (
          <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
            <div className="text-center py-4">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#eef4ff] to-[#dbeafe] text-[#1a5cff] flex items-center justify-center mx-auto mb-5 shadow-sm">
                <GraduationCap className="w-9 h-9" />
              </div>
              <h2 className="text-2xl font-extrabold text-[#0b1a33] mb-2 tracking-tight">
                Welcome to Heightt
              </h2>
              <p className="text-sm text-[#5b6d89] leading-relaxed max-w-sm mx-auto mb-6">
                Your financial companion for campus life. Let&apos;s get you set up in just a few minutes.
              </p>

              <div className="grid grid-cols-2 gap-3 text-left mb-6">
                <div className="flex items-center gap-2.5 p-3 rounded-xl bg-[#f8faff] border border-slate-100 text-xs font-semibold text-[#0b1a33]">
                  <Wallet className="w-4 h-4 text-[#1a5cff] shrink-0" />
                  Smart Wallet
                </div>
                <div className="flex items-center gap-2.5 p-3 rounded-xl bg-[#f8faff] border border-slate-100 text-xs font-semibold text-[#0b1a33]">
                  <Target className="w-4 h-4 text-[#1a5cff] shrink-0" />
                  Goal Savings
                </div>
                <div className="flex items-center gap-2.5 p-3 rounded-xl bg-[#f8faff] border border-slate-100 text-xs font-semibold text-[#0b1a33]">
                  <Ticket className="w-4 h-4 text-[#1a5cff] shrink-0" />
                  Event Tickets
                </div>
                <div className="flex items-center gap-2.5 p-3 rounded-xl bg-[#f8faff] border border-slate-100 text-xs font-semibold text-[#0b1a33]">
                  <ShieldCheck className="w-4 h-4 text-[#1a5cff] shrink-0" />
                  Refund Protection
                </div>
              </div>
            </div>

            <div className="pt-2">
              <button
                type="button"
                onClick={nextStep}
                className="w-full py-3.5 px-6 rounded-2xl bg-[#1a5cff] hover:bg-[#0f4ad0] text-white font-semibold text-sm flex items-center justify-center gap-2 transition-all shadow-[0_8px_24px_rgba(26,92,255,0.25)] active:scale-[0.98]"
              >
                <span>Get Started</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* ===== STEP 1: CONTACT INFORMATION ===== */}
        {currentStep === 1 && (
          <div className="animate-in fade-in slide-in-from-bottom-2 duration-300 space-y-4">
            <p className="text-sm text-[#5b6d89] leading-relaxed mb-4">
              Enter your contact information to finish personalizing your account.
            </p>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold uppercase text-[#1f2a44] opacity-70 tracking-wider">
                Phone Number <span className="text-red-500">*</span>
              </label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => {
                  setPhone(e.target.value);
                  setPhoneError('');
                }}
                placeholder="e.g. 080 1234 5678"
                className={cn(
                  'w-full px-4 py-3 rounded-xl border-[1.5px] border-slate-200 text-sm font-medium text-[#0b1a33] bg-[#f8faff] outline-none transition-all focus:border-[#1a5cff] focus:bg-white focus:ring-4 focus:ring-[#1a5cff]/10',
                  phoneError && 'border-red-500 bg-red-50/30'
                )}
              />
              {phoneError && <p className="text-xs text-red-500 pl-1">{phoneError}</p>}
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold uppercase text-[#1f2a44] opacity-70 tracking-wider">
                Student ID (Optional)
              </label>
              <input
                type="text"
                value={studentId}
                onChange={(e) => setStudentId(e.target.value)}
                placeholder="e.g. 2024/12345"
                className="w-full px-4 py-3 rounded-xl border-[1.5px] border-slate-200 text-sm font-medium text-[#0b1a33] bg-[#f8faff] outline-none transition-all focus:border-[#1a5cff] focus:bg-white focus:ring-4 focus:ring-[#1a5cff]/10"
              />
              <p className="text-[0.72rem] text-slate-400 pl-1">This helps verify your student status</p>
            </div>

            <div className="flex gap-3 pt-4 border-t border-slate-100 mt-6">
              <button
                type="button"
                onClick={prevStep}
                className="px-5 py-3 rounded-xl border-2 border-slate-200 hover:border-[#1a5cff] text-slate-600 hover:text-[#1a5cff] font-semibold text-sm flex items-center justify-center gap-1.5 transition-all"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back</span>
              </button>
              <button
                type="button"
                onClick={validateStep1}
                className="flex-1 py-3 px-6 rounded-xl bg-[#1a5cff] hover:bg-[#0f4ad0] text-white font-semibold text-sm flex items-center justify-center gap-2 transition-all shadow-[0_8px_24px_rgba(26,92,255,0.25)] active:scale-[0.98]"
              >
                <span>Continue</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* ===== STEP 2: INSTITUTION ===== */}
        {currentStep === 2 && (
          <div className="animate-in fade-in slide-in-from-bottom-2 duration-300 space-y-4">
            <p className="text-sm text-[#5b6d89] leading-relaxed mb-4">
              Select your institution. If you don&apos;t see it, you can request to add it.
            </p>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold uppercase text-[#1f2a44] opacity-70 tracking-wider">
                Institution <span className="text-red-500">*</span>
              </label>
              <select
                value={institution}
                onChange={(e) => {
                  setInstitution(e.target.value);
                  setInstError('');
                }}
                className={cn(
                  'w-full px-4 py-3 rounded-xl border-[1.5px] border-slate-200 text-sm font-medium text-[#0b1a33] bg-[#f8faff] outline-none transition-all focus:border-[#1a5cff] focus:bg-white focus:ring-4 focus:ring-[#1a5cff]/10',
                  instError && 'border-red-500 bg-red-50/30'
                )}
              >
                <option value="">Select your institution</option>
                <option value="unilag">University of Lagos</option>
                <option value="knust">Kwame Nkrumah University of Science and Technology</option>
                <option value="uniben">University of Benin</option>
                <option value="ui">University of Ibadan</option>
                <option value="covenant">Covenant University</option>
                <option value="futa">Federal University of Technology, Akure</option>
                <option value="unimaid">University of Maiduguri</option>
                <option value="abu">Ahmadu Bello University</option>
                <option value="other">Other (Request to add)</option>
              </select>
              {instError && <p className="text-xs text-red-500 pl-1">{instError}</p>}
            </div>

            <div className="flex gap-3 pt-4 border-t border-slate-100 mt-6">
              <button
                type="button"
                onClick={prevStep}
                className="px-5 py-3 rounded-xl border-2 border-slate-200 hover:border-[#1a5cff] text-slate-600 hover:text-[#1a5cff] font-semibold text-sm flex items-center justify-center gap-1.5 transition-all"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back</span>
              </button>
              <button
                type="button"
                onClick={validateStep2}
                className="flex-1 py-3 px-6 rounded-xl bg-[#1a5cff] hover:bg-[#0f4ad0] text-white font-semibold text-sm flex items-center justify-center gap-2 transition-all shadow-[0_8px_24px_rgba(26,92,255,0.25)] active:scale-[0.98]"
              >
                <span>Continue</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* ===== STEP 3: FACULTY & DEPARTMENT ===== */}
        {currentStep === 3 && (
          <div className="animate-in fade-in slide-in-from-bottom-2 duration-300 space-y-4">
            <p className="text-sm text-[#5b6d89] leading-relaxed mb-4">
              Tell us your faculty and department so we can connect you with the right community.
            </p>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold uppercase text-[#1f2a44] opacity-70 tracking-wider">
                Faculty <span className="text-red-500">*</span>
              </label>
              <select
                value={faculty}
                onChange={(e) => setFaculty(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border-[1.5px] border-slate-200 text-sm font-medium text-[#0b1a33] bg-[#f8faff] outline-none transition-all focus:border-[#1a5cff] focus:bg-white focus:ring-4 focus:ring-[#1a5cff]/10"
              >
                <option value="">Select your faculty</option>
                <option value="engineering">Engineering</option>
                <option value="science">Science</option>
                <option value="arts">Arts & Humanities</option>
                <option value="social-sciences">Social Sciences</option>
                <option value="medicine">Medicine & Health Sciences</option>
                <option value="law">Law</option>
                <option value="education">Education</option>
                <option value="management">Management Sciences</option>
                <option value="agriculture">Agriculture</option>
                <option value="other">Other</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold uppercase text-[#1f2a44] opacity-70 tracking-wider">
                Department <span className="text-red-500">*</span>
              </label>
              <select
                value={department}
                onChange={(e) => {
                  setDepartment(e.target.value);
                  setDeptError('');
                }}
                className={cn(
                  'w-full px-4 py-3 rounded-xl border-[1.5px] border-slate-200 text-sm font-medium text-[#0b1a33] bg-[#f8faff] outline-none transition-all focus:border-[#1a5cff] focus:bg-white focus:ring-4 focus:ring-[#1a5cff]/10',
                  deptError && 'border-red-500 bg-red-50/30'
                )}
              >
                <option value="">Select your department</option>
                <option value="computer-science">Computer Science</option>
                <option value="electrical-eng">Electrical Engineering</option>
                <option value="mechanical-eng">Mechanical Engineering</option>
                <option value="civil-eng">Civil Engineering</option>
                <option value="biochemistry">Biochemistry</option>
                <option value="chemistry">Chemistry</option>
                <option value="physics">Physics</option>
                <option value="mathematics">Mathematics</option>
                <option value="economics">Economics</option>
                <option value="psychology">Psychology</option>
                <option value="law">Law</option>
                <option value="accounting">Accounting</option>
                <option value="business-admin">Business Administration</option>
                <option value="other">Other</option>
              </select>
              {deptError && <p className="text-xs text-red-500 pl-1">{deptError}</p>}
            </div>

            <div className="flex gap-3 pt-4 border-t border-slate-100 mt-6">
              <button
                type="button"
                onClick={prevStep}
                className="px-5 py-3 rounded-xl border-2 border-slate-200 hover:border-[#1a5cff] text-slate-600 hover:text-[#1a5cff] font-semibold text-sm flex items-center justify-center gap-1.5 transition-all"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back</span>
              </button>
              <button
                type="button"
                onClick={validateStep3}
                className="flex-1 py-3 px-6 rounded-xl bg-[#1a5cff] hover:bg-[#0f4ad0] text-white font-semibold text-sm flex items-center justify-center gap-2 transition-all shadow-[0_8px_24px_rgba(26,92,255,0.25)] active:scale-[0.98]"
              >
                <span>Continue</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* ===== STEP 4: FIND ORGANIZATIONS ===== */}
        {currentStep === 4 && (
          <div className="animate-in fade-in slide-in-from-bottom-2 duration-300 space-y-4">
            <p className="text-sm text-[#5b6d89] leading-relaxed mb-3">
              Search and join organizations on your campus. This is where you&apos;ll pay dues and stay connected.
            </p>

            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                value={orgSearch}
                onChange={(e) => setOrgSearch(e.target.value)}
                placeholder={orgWarn ? 'Please select an organization to continue' : 'Search by name...'}
                className={cn(
                  'w-full pl-11 pr-4 py-3 rounded-xl border-[1.5px] border-slate-200 text-sm font-medium text-[#0b1a33] bg-[#f8faff] outline-none transition-all focus:border-[#1a5cff] focus:bg-white focus:ring-4 focus:ring-[#1a5cff]/10',
                  orgWarn && 'border-red-500 placeholder:text-red-500'
                )}
              />
            </div>

            {/* Selected Organization Card */}
            {selectedOrg ? (
              <div className="flex items-center gap-3 p-4 rounded-xl bg-[#eef4ff] border border-[#1a5cff]/30 text-left my-3">
                <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center shrink-0 shadow-sm">
                  {selectedOrg.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-bold text-[#0b1a33] truncate">{selectedOrg.name}</div>
                  <div className="text-xs text-[#5b6d89] truncate">{selectedOrg.desc}</div>
                </div>
                <button
                  type="button"
                  onClick={() => setSelectedOrg(null)}
                  className="p-1 text-slate-400 hover:text-red-500 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            ) : (
              <div className="space-y-2 max-h-[220px] overflow-y-auto pr-1">
                {filteredOrgs.map((org) => (
                  <div
                    key={org.id}
                    onClick={() => setSelectedOrg(org)}
                    className="flex items-center gap-3 p-3 rounded-xl bg-[#f8faff] hover:bg-[#eef4ff] border border-slate-200/60 cursor-pointer transition-all hover:border-[#1a5cff]/40 group"
                  >
                    <div className="w-9 h-9 rounded-lg bg-white flex items-center justify-center shrink-0 shadow-sm">
                      {org.icon}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-semibold text-[#0b1a33] group-hover:text-[#1a5cff] transition-colors">
                        {org.name}
                      </div>
                      <div className="text-xs text-slate-400 truncate">{org.desc}</div>
                    </div>
                    <span className="text-xs font-bold text-[#1a5cff] bg-white px-3 py-1 rounded-lg border border-[#1a5cff]/20">
                      Join
                    </span>
                  </div>
                ))}
              </div>
            )}

            <div className="flex items-center gap-2 text-xs text-slate-400 pt-1">
              <Info className="w-3.5 h-3.5 text-[#1a5cff]" />
              <span>You can join multiple organizations later from your dashboard.</span>
            </div>

            <div className="flex gap-3 pt-4 border-t border-slate-100 mt-6">
              <button
                type="button"
                onClick={prevStep}
                className="px-5 py-3 rounded-xl border-2 border-slate-200 hover:border-[#1a5cff] text-slate-600 hover:text-[#1a5cff] font-semibold text-sm flex items-center justify-center gap-1.5 transition-all"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back</span>
              </button>
              <button
                type="button"
                onClick={validateStep4}
                className="flex-1 py-3 px-6 rounded-xl bg-[#1a5cff] hover:bg-[#0f4ad0] text-white font-semibold text-sm flex items-center justify-center gap-2 transition-all shadow-[0_8px_24px_rgba(26,92,255,0.25)] active:scale-[0.98]"
              >
                <span>Continue</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* ===== STEP 5: FINISH ===== */}
        {currentStep === 5 && (
          <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
            <div className="text-center py-4">
              <div className="w-20 h-20 rounded-full bg-[#dcfce7] text-[#0f7b4a] flex items-center justify-center mx-auto mb-4 animate-bounce">
                <Check className="w-10 h-10" />
              </div>
              <h2 className="text-2xl font-extrabold text-[#0b1a33] mb-2 tracking-tight">
                You&apos;re all set!
              </h2>
              <p className="text-sm text-[#5b6d89] leading-relaxed max-w-sm mx-auto mb-6">
                Your account is ready. Here&apos;s what you can do next:
              </p>

              <div className="space-y-3 text-left bg-[#f8faff] p-4 rounded-2xl border border-slate-100 mb-6">
                <div className="flex items-center gap-3 text-xs font-semibold text-[#0b1a33]">
                  <span className="w-6 h-6 rounded-full bg-white text-[#1a5cff] font-bold flex items-center justify-center shrink-0 border border-slate-200">
                    1
                  </span>
                  <span>Fund your wallet to start paying dues</span>
                </div>
                <div className="flex items-center gap-3 text-xs font-semibold text-[#0b1a33]">
                  <span className="w-6 h-6 rounded-full bg-white text-[#1a5cff] font-bold flex items-center justify-center shrink-0 border border-slate-200">
                    2
                  </span>
                  <span>Check out your organization&apos;s dues and events</span>
                </div>
                <div className="flex items-center gap-3 text-xs font-semibold text-[#0b1a33]">
                  <span className="w-6 h-6 rounded-full bg-white text-[#1a5cff] font-bold flex items-center justify-center shrink-0 border border-slate-200">
                    3
                  </span>
                  <span>Set up a savings goal for upcoming expenses</span>
                </div>
              </div>
            </div>

            <div className="pt-2">
              <button
                type="button"
                onClick={finishOnboarding}
                className="w-full py-3.5 px-6 rounded-2xl bg-[#1a5cff] hover:bg-[#1a5cff] text-white font-semibold text-sm flex items-center justify-center gap-2 transition-all shadow-[0_8px_24px_rgba(15,123,74,0.25)] active:scale-[0.98]"
              >
                <Rocket className="w-4 h-4" />
                <span>Go to Dashboard</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
