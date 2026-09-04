// src/components/onboarding/OnboardingFlow.tsx

"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuthStore } from "@/store/auth-store";
import {
  institutionsApi,
  Institution,
  Faculty,
  Department,
} from "@/lib/api/institutions";
import {
  SearchableSelect,
  SelectOption,
} from "@/components/ui/SearchableSelect";
import { queryKeys } from "@/lib/api/keys";
import { axiosConfig } from "@/utils/axios-config";
import {
  GraduationCap,
  Ticket,
  ShieldCheck,
  ArrowRight,
  ArrowLeft,
  Check,
  Rocket,
  Info,
  Loader2,
  User,
  Globe,
  AlertCircle,
} from "lucide-react";
import { cn } from "@/lib/utils";

const STEP_LABELS = [
  "Welcome",
  "Personal Info",
  "Institution",
  "Department",
  "Finish",
];

// Types
interface AcademicSession {
  id: string;
  name: string;
  startDate: string;
  endDate: string;
  status: string;
  isCurrent: boolean;
  scope: "INSTITUTION" | "FACULTY" | "DEPARTMENT" | "LEVEL";
}

type Gender = "MALE" | "FEMALE" | "OTHER" | "PREFER_NOT_TO_SAY";

interface OnboardingPersonalInfo {
  firstName: string;
  lastName: string;
  middleName?: string;
  gender: Gender;
  country?: string;
}

interface CompleteOnboardingPayload {
  firstName?: string;
  lastName?: string;
  studentId?: string;
  gender?: Gender;
  country?: string;
  institution?: string;
  faculty?: string;
  department?: string;
  academicLevelId?: string;
  sessionId?: string;
}

function retryTransientRequest(failureCount: number, error: unknown) {
  const status = (error as { response?: { status?: number } })?.response?.status;
  return failureCount < 5 && (!status || status >= 500 || status === 408 || status === 429);
}

const retryDelay = (attempt: number) => Math.min(1_000 * 2 ** attempt, 8_000);

// Query hooks
function useInstitutions(search?: string) {
  return useQuery({
    queryKey: queryKeys.institutions.all({
      search,
      status: "ACTIVE",
      limit: 100,
    }),
    queryFn: () =>
      institutionsApi.getInstitutions({ search, status: "ACTIVE", limit: 100 }),
    retry: retryTransientRequest,
    retryDelay,
    refetchOnReconnect: true,
    refetchOnWindowFocus: true,
    staleTime: 10 * 60 * 1000,
  });
}

function useFaculties(institutionId: string) {
  return useQuery({
    queryKey: queryKeys.institutions.faculties(institutionId),
    queryFn: () => institutionsApi.getFacultiesByInstitution(institutionId),
    enabled: !!institutionId,
    retry: retryTransientRequest,
    retryDelay,
    refetchOnReconnect: true,
    refetchOnWindowFocus: true,
    staleTime: 10 * 60 * 1000,
  });
}

function useDepartments(facultyId: string) {
  return useQuery({
    queryKey: queryKeys.institutions.departments(facultyId),
    queryFn: () => institutionsApi.getDepartmentsByFaculty(facultyId),
    enabled: !!facultyId,
    retry: retryTransientRequest,
    retryDelay,
    refetchOnReconnect: true,
    refetchOnWindowFocus: true,
    staleTime: 10 * 60 * 1000,
  });
}

function useAcademicSessions(institutionId: string) {
  return useQuery({
    queryKey: ["academic-sessions", institutionId],
    queryFn: async () => {
      if (!institutionId) return [];
      const response = await axiosConfig.get(
        `/institutions/${institutionId}/academic-sessions`
      );
      const sessions = response.data || [];
      return sessions.filter(
        (session: AcademicSession) =>
          session.scope === "INSTITUTION" &&
          (session.status === "ACTIVE" || session.status === "UPCOMING"),
      );
    },
    enabled: !!institutionId,
    retry: retryTransientRequest,
    retryDelay,
    refetchOnReconnect: true,
    refetchOnWindowFocus: true,
    staleTime: 5 * 60 * 1000,
  });
}

export function OnboardingFlow() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { user, updateUserOnboardingStatus } = useAuthStore();

  const [currentStep, setCurrentStep] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  // ============================================
  // STEP 1: PERSONAL INFO
  // ============================================
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [middleName, setMiddleName] = useState("");
  const [studentId, setStudentId] = useState("");
  const [gender, setGender] = useState("");
  const [country, setCountry] = useState("");

  // ============================================
  // STEP 2 & 3: INSTITUTION
  // ============================================
  const [selectedInstitutionId, setSelectedInstitutionId] = useState("");
  const [selectedFacultyId, setSelectedFacultyId] = useState("");
  const [selectedDepartmentId, setSelectedDepartmentId] = useState("");
  const [selectedAcademicLevelId, setSelectedAcademicLevelId] = useState("");
  const [selectedSessionId, setSelectedSessionId] = useState("");

  const [selectedInstitution, setSelectedInstitution] =
    useState<Institution | null>(null);
  const [selectedFaculty, setSelectedFaculty] = useState<Faculty | null>(null);
  const [selectedDepartment, setSelectedDepartment] =
    useState<Department | null>(null);

  // ============================================
  // ERROR STATES
  // ============================================
  const [firstNameError, setFirstNameError] = useState("");
  const [lastNameError, setLastNameError] = useState("");
  const [genderError, setGenderError] = useState("");
  const [instError, setInstError] = useState("");
  const [deptError, setDeptError] = useState("");
  const [levelError, setLevelError] = useState("");
  const [sessionError, setSessionError] = useState("");

  // ============================================
  // QUERIES
  // ============================================
  const { data: institutionsData, isLoading: isLoadingInstitutions } =
    useInstitutions();
  const { data: facultiesData, isLoading: isLoadingFaculties } = useFaculties(
    selectedInstitutionId,
  );
  const { data: departmentsData, isLoading: isLoadingDepartments } =
    useDepartments(selectedFacultyId);
  const { data: sessionsData, isLoading: isLoadingSessions } = useAcademicSessions(
    selectedInstitutionId,
  );

  const totalSteps = 5;

  // ============================================
  // MUTATIONS
  // ============================================
  const completeOnboardingMutation = useMutation({
    mutationFn: async ({
      personalInfo,
      completion,
    }: {
      personalInfo: OnboardingPersonalInfo;
      completion: CompleteOnboardingPayload;
    }) => {
      await axiosConfig.patch("/onboarding/personal-info", personalInfo);
      return axiosConfig.post("/onboarding/complete", completion);
    },
    onSuccess: () => {
      updateUserOnboardingStatus(true, "COMPLETED");
      queryClient.invalidateQueries({ queryKey: queryKeys.user.current });
      queryClient.invalidateQueries({
        queryKey: queryKeys.onboarding.status(user?.id ?? ""),
      });
      setIsSubmitting(false);
      setSubmitError(null);
      router.replace("/dashboard");
    },
    onError: (error: unknown) => {
      console.error("Failed to complete onboarding:", error);
      setIsSubmitting(false);
      setSubmitError('Failed to complete onboarding. Please try again.');
    },
  });

  // ============================================
  // NAVIGATION
  // ============================================
  const goToStep = (step: number) => {
    if (step >= 0 && step < totalSteps) {
      setCurrentStep(step);
    }
  };

  const nextStep = () => goToStep(currentStep + 1);
  const prevStep = () => goToStep(currentStep - 1);

  // ============================================
  // VALIDATION
  // ============================================
  const validateStep1 = () => {
    let valid = true;

    if (!firstName.trim()) {
      setFirstNameError("First name is required");
      valid = false;
    } else {
      setFirstNameError("");
    }

    if (!lastName.trim()) {
      setLastNameError("Last name is required");
      valid = false;
    } else {
      setLastNameError("");
    }

    if (!gender) {
      setGenderError("Please select your gender");
      valid = false;
    } else {
      setGenderError("");
    }

    if (valid) nextStep();
  };

  const validateStep2 = () => {
    if (!selectedInstitutionId) {
      setInstError("Please select your institution");
    } else {
      setInstError("");
      nextStep();
    }
  };

  const validateStep3 = () => {
    let valid = true;

    if (!selectedDepartmentId) {
      setDeptError("Please select your department");
      valid = false;
    } else {
      setDeptError("");
    }

    if (!selectedAcademicLevelId) {
      setLevelError("Please select your academic level");
      valid = false;
    } else {
      setLevelError("");
    }

    if (!selectedSessionId) {
      setSessionError("Please select your academic session");
      valid = false;
    } else {
      setSessionError("");
    }

    if (valid) nextStep();
  };

  // ============================================
  // FINISH ONBOARDING
  // ============================================
  const finishOnboarding = () => {
    setSubmitError(null);
    setIsSubmitting(true);

    const selectedInstitutionObj = institutionsData?.data?.find(
      (inst: Institution) => inst.id === selectedInstitutionId,
    );
    const selectedFacultyObj = facultiesData?.find(
      (fac: Faculty) => fac.id === selectedFacultyId,
    );
    const selectedDepartmentObj = departmentsData?.find(
      (dept: Department) => dept.id === selectedDepartmentId,
    );

    const personalInfo: OnboardingPersonalInfo = {
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      ...(middleName.trim() ? { middleName: middleName.trim() } : {}),
      gender: gender as Gender,
      ...(country.trim() ? { country: country.trim() } : {}),
    };
    const completion: CompleteOnboardingPayload = {
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      ...(studentId.trim() ? { studentId: studentId.trim() } : {}),
      gender: gender as Gender,
      ...(country.trim() ? { country: country.trim() } : {}),
      institution: selectedInstitutionObj?.name || "",
      faculty: selectedFacultyObj?.name || "",
      department: selectedDepartmentObj?.name || "",
      academicLevelId: selectedAcademicLevelId,
      sessionId: selectedSessionId,
    };

    completeOnboardingMutation.mutate({ personalInfo, completion });
  };

  // ============================================
  // HELPERS
  // ============================================
  const progressPercent = (currentStep / (totalSteps - 1)) * 100;

  const institutionOptions: SelectOption[] = (institutionsData?.data || []).map(
    (inst: Institution) => ({
      ...inst,
      id: inst.id,
      label: `${inst.name} (${inst.shortName || inst.code})`,
      value: inst.id,
    }),
  );

  const facultyOptions: SelectOption[] = (facultiesData || []).map(
    (fac: Faculty) => ({
      ...fac,
      id: fac.id,
      label: fac.name,
      value: fac.id,
    }),
  );

  const departmentOptions: SelectOption[] = (departmentsData || []).map(
    (dept: Department) => ({
      ...dept,
      id: dept.id,
      label: dept.name,
      value: dept.id,
    }),
  );

  // ============================================
  // RENDER
  // ============================================
  return (
    <div className="onboarding-flow min-h-[100dvh] w-full overflow-hidden bg-white transition-all sm:min-h-0 sm:max-w-[640px] sm:rounded-3xl sm:border sm:border-slate-200/80 sm:shadow-[0_24px_70px_rgba(15,42,100,0.10)]">
      {/* Progress Bar */}
      <div className="px-5 pb-2 pt-5 sm:px-8 sm:pt-7">
        <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
          <div
            className="h-full rounded-full bg-[#2563EB] transition-all duration-500 ease-out"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
        <div className="mt-3 flex justify-between gap-2 text-[10px] font-medium text-slate-400">
          {STEP_LABELS.map((label, idx) => (
            <span
              key={idx}
              className={cn(
                "min-w-0 flex-1 truncate text-center transition-colors first:text-left last:text-right",
                idx === currentStep && "text-[#2563EB] font-semibold",
                idx < currentStep && "text-[#0f7b4a] font-medium",
              )}
            >
              {label}
            </span>
          ))}
        </div>
      </div>

      {/* Content Area */}
      <div className="px-5 pb-[max(1.5rem,env(safe-area-inset-bottom))] pt-3 sm:px-8 sm:pb-8 sm:pt-4">
        {/* Step Header */}
        <div className="mb-5 flex items-center justify-between border-b border-slate-100 pb-4">
          <div className="flex items-center gap-3">
            <span className="flex size-8 items-center justify-center rounded-lg bg-[#2563EB] font-mono text-xs font-bold text-white shadow-sm">
              {currentStep + 1}
            </span>
            <span className="text-lg font-semibold tracking-[-0.025em] text-[#0B1020]">
              {STEP_LABELS[currentStep]}
            </span>
          </div>
          <span className="rounded-full bg-slate-100 px-2.5 py-1 font-mono text-[9px] font-semibold uppercase tracking-[0.08em] text-slate-400">
            {currentStep + 1} of {totalSteps}
          </span>
        </div>

        {/* STEP 0: WELCOME */}
        {currentStep === 0 && (
          <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
            <div className="text-center py-4">
              <div className="mx-auto mb-5 flex size-16 items-center justify-center rounded-2xl border border-[#2563EB]/15 bg-[#2563EB]/8 text-[#2563EB]">
                <GraduationCap className="w-9 h-9" />
              </div>
              <h2 className="text-2xl font-extrabold text-[#0B1020] mb-2 tracking-tight">
                Welcome to Heightt
              </h2>
              <p className="text-sm text-[#64748B] leading-relaxed max-w-sm mx-auto mb-6">
                Your financial companion for campus life. Let&apos;s get you set up
                in just a few minutes.
              </p>

              <div className="grid grid-cols-2 gap-3 text-left mb-6">
                <div className="flex items-center gap-2.5 p-3 rounded-xl bg-[#F8FAFC] border border-slate-100 text-xs font-semibold text-[#0B1020]">
                  <Ticket className="w-4 h-4 text-[#2563EB] shrink-0" />
                  Event Tickets
                </div>
                <div className="flex items-center gap-2.5 p-3 rounded-xl bg-[#F8FAFC] border border-slate-100 text-xs font-semibold text-[#0B1020]">
                  <ShieldCheck className="w-4 h-4 text-[#2563EB] shrink-0" />
                  Refund Protection
                </div>
              </div>
            </div>

            <div className="pt-2">
              <button
                type="button"
                onClick={nextStep}
                className="w-full py-3.5 px-6 rounded-2xl bg-[#2563EB] hover:bg-[#1D4ED8] text-white font-semibold text-sm flex items-center justify-center gap-2 transition-all shadow-[0_8px_24px_rgba(26,92,255,0.25)] active:scale-[0.98]"
              >
                <span>Get Started</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 1: PERSONAL INFORMATION */}
        {currentStep === 1 && (
          <div className="animate-in fade-in slide-in-from-bottom-2 duration-300 space-y-4">
            <p className="text-sm text-[#64748B] leading-relaxed mb-4">
              Enter your personal information to complete your profile.
            </p>

            {/* First Name */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold uppercase text-[#1f2a44] opacity-70 tracking-wider">
                First Name <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  value={firstName}
                  onChange={(e) => {
                    setFirstName(e.target.value);
                    setFirstNameError("");
                  }}
                  placeholder="e.g. John"
                  className={cn(
                    "w-full pl-10 pr-4 py-3 rounded-xl border-[1.5px] border-slate-200 text-sm font-medium text-[#0B1020] bg-[#F8FAFC] outline-none transition-all focus:border-[#2563EB] focus:bg-white focus:ring-4 focus:ring-[#2563EB]/10",
                    firstNameError && "border-red-500 bg-red-50/30",
                  )}
                  required
                />
              </div>
              {firstNameError && (
                <p className="text-xs text-red-500 pl-1">{firstNameError}</p>
              )}
            </div>

            {/* Last Name */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold uppercase text-[#1f2a44] opacity-70 tracking-wider">
                Last Name <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  value={lastName}
                  onChange={(e) => {
                    setLastName(e.target.value);
                    setLastNameError("");
                  }}
                  placeholder="e.g. Doe"
                  className={cn(
                    "w-full pl-10 pr-4 py-3 rounded-xl border-[1.5px] border-slate-200 text-sm font-medium text-[#0B1020] bg-[#F8FAFC] outline-none transition-all focus:border-[#2563EB] focus:bg-white focus:ring-4 focus:ring-[#2563EB]/10",
                    lastNameError && "border-red-500 bg-red-50/30",
                  )}
                  required
                />
              </div>
              {lastNameError && (
                <p className="text-xs text-red-500 pl-1">{lastNameError}</p>
              )}
            </div>

            {/* Middle Name */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold uppercase text-[#1f2a44] opacity-70 tracking-wider">
                Middle Name (Optional)
              </label>
              <div className="relative">
                <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  value={middleName}
                  onChange={(e) => setMiddleName(e.target.value)}
                  placeholder="e.g. Chidi"
                  className="w-full pl-10 pr-4 py-3 rounded-xl border-[1.5px] border-slate-200 text-sm font-medium text-[#0B1020] bg-[#F8FAFC] outline-none transition-all focus:border-[#2563EB] focus:bg-white focus:ring-4 focus:ring-[#2563EB]/10"
                />
              </div>
            </div>

            {/* Gender */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold uppercase text-[#1f2a44] opacity-70 tracking-wider">
                Gender <span className="text-red-500">*</span>
              </label>
              <select
                value={gender}
                onChange={(e) => {
                  setGender(e.target.value);
                  setGenderError("");
                }}
                className={cn(
                  "w-full px-4 py-3 rounded-xl border-[1.5px] border-slate-200 text-sm font-medium text-[#0B1020] bg-[#F8FAFC] outline-none transition-all focus:border-[#2563EB] focus:bg-white focus:ring-4 focus:ring-[#2563EB]/10",
                  genderError && "border-red-500 bg-red-50/30",
                )}
                required
              >
                <option value="">Select your gender</option>
                <option value="MALE">Male</option>
                <option value="FEMALE">Female</option>
                <option value="OTHER">Other</option>
                <option value="PREFER_NOT_TO_SAY">Prefer not to say</option>
              </select>
              {genderError && (
                <p className="text-xs text-red-500 pl-1">{genderError}</p>
              )}
            </div>

            {/* Country */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold uppercase text-[#1f2a44] opacity-70 tracking-wider">
                Country
              </label>
              <div className="relative">
                <Globe className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <select
                  value={country}
                  onChange={(e) => setCountry(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 rounded-xl border-[1.5px] border-slate-200 text-sm font-medium text-[#0B1020] bg-[#F8FAFC] outline-none transition-all focus:border-[#2563EB] focus:bg-white focus:ring-4 focus:ring-[#2563EB]/10"
                >
                  <option value="">Select country (optional)</option>
                  <option value="Nigeria">Nigeria</option>
                  <option value="Ghana">Ghana</option>
                  <option value="Kenya">Kenya</option>
                  <option value="South Africa">South Africa</option>
                  <option value="Other">Other</option>
                </select>
              </div>
            </div>

            {/* Student ID (Optional) */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold uppercase text-[#1f2a44] opacity-70 tracking-wider">
                Student ID (Optional)
              </label>
              <input
                type="text"
                value={studentId}
                onChange={(e) => setStudentId(e.target.value)}
                placeholder="e.g. 2024/12345"
                className="w-full px-4 py-3 rounded-xl border-[1.5px] border-slate-200 text-sm font-medium text-[#0B1020] bg-[#F8FAFC] outline-none transition-all focus:border-[#2563EB] focus:bg-white focus:ring-4 focus:ring-[#2563EB]/10"
              />
            </div>

            <div className="flex gap-3 pt-4 border-t border-slate-100 mt-6">
              <button
                type="button"
                onClick={prevStep}
                className="px-5 py-3 rounded-xl border-2 border-slate-200 hover:border-[#2563EB] text-slate-600 hover:text-[#2563EB] font-semibold text-sm flex items-center justify-center gap-1.5 transition-all"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back</span>
              </button>
              <button
                type="button"
                onClick={validateStep1}
                className="flex-1 py-3 px-6 rounded-xl bg-[#2563EB] hover:bg-[#1D4ED8] text-white font-semibold text-sm flex items-center justify-center gap-2 transition-all shadow-[0_8px_24px_rgba(26,92,255,0.25)] active:scale-[0.98]"
              >
                <span>Continue</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 2: INSTITUTION */}
        {currentStep === 2 && (
          <div className="animate-in fade-in slide-in-from-bottom-2 duration-300 space-y-4">
            <p className="text-sm text-[#64748B] leading-relaxed mb-4">
              Select your institution from the list below.
            </p>

            <SearchableSelect
              options={institutionOptions}
              value={selectedInstitutionId}
              onChange={(id, option) => {
                setSelectedInstitutionId(id);
                setSelectedInstitution(
                  (option as unknown as Institution) || null,
                );
                setInstError("");
                // Reset dependent fields when institution changes
                setSelectedFacultyId("");
                setSelectedFaculty(null);
                setSelectedDepartmentId("");
                setSelectedDepartment(null);
                setSelectedAcademicLevelId("");
                setSelectedSessionId("");
              }}
              label="Institution"
              required
              error={instError}
              isLoading={isLoadingInstitutions}
              placeholder="Search and select your institution..."
              searchPlaceholder="Search institutions..."
              noOptionsMessage="No institutions found. Please try a different search."
            />
            {selectedInstitution && (
              <div className="p-3 rounded-xl bg-[#EFF6FF] border border-[#2563EB]/20 text-sm text-[#2563EB]">
                Selected: <strong>{selectedInstitution.name}</strong>
                {selectedInstitution.shortName &&
                  ` (${selectedInstitution.shortName})`}
              </div>
            )}

            <div className="flex gap-3 pt-4 border-t border-slate-100 mt-6">
              <button
                type="button"
                onClick={prevStep}
                className="px-5 py-3 rounded-xl border-2 border-slate-200 hover:border-[#2563EB] text-slate-600 hover:text-[#2563EB] font-semibold text-sm flex items-center justify-center gap-1.5 transition-all"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back</span>
              </button>
              <button
                type="button"
                onClick={validateStep2}
                className="flex-1 py-3 px-6 rounded-xl bg-[#2563EB] hover:bg-[#1D4ED8] text-white font-semibold text-sm flex items-center justify-center gap-2 transition-all shadow-[0_8px_24px_rgba(26,92,255,0.25)] active:scale-[0.98]"
              >
                <span>Continue</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 3: FACULTY, DEPARTMENT, LEVEL & SESSION */}
        {currentStep === 3 && (
          <div className="animate-in fade-in slide-in-from-bottom-2 duration-300 space-y-4">
            <p className="text-sm text-[#64748B] leading-relaxed mb-4">
              Tell us your faculty and department so we can connect you with the
              right community.
            </p>

            <SearchableSelect
              options={facultyOptions}
              value={selectedFacultyId}
              onChange={(id, option) => {
                setSelectedFacultyId(id);
                setSelectedFaculty(
                  (option as unknown as Faculty) || null,
                );
                // Reset department when faculty changes
                setSelectedDepartmentId("");
                setSelectedDepartment(null);
              }}
              label="Faculty"
              required
              placeholder="Select your faculty..."
              searchPlaceholder="Search faculties..."
              noOptionsMessage="No faculties found for this institution"
              isLoading={isLoadingFaculties}
              disabled={!selectedInstitutionId}
            />
            {selectedFaculty && (
              <div className="p-3 rounded-xl bg-[#EFF6FF] border border-[#2563EB]/20 text-sm text-[#2563EB]">
                Selected Faculty: <strong>{selectedFaculty.name}</strong>
              </div>
            )}

            <SearchableSelect
              options={departmentOptions}
              value={selectedDepartmentId}
              onChange={(id, option) => {
                setSelectedDepartmentId(id);
                setSelectedDepartment(
                  (option as unknown as Department) || null,
                );
                setDeptError("");
              }}
              label="Department"
              required
              error={deptError}
              placeholder="Select your department..."
              searchPlaceholder="Search departments..."
              noOptionsMessage="No departments found for this faculty"
              isLoading={isLoadingDepartments}
              disabled={!selectedFacultyId}
            />
            {selectedDepartment && (
              <div className="p-3 rounded-xl bg-[#EFF6FF] border border-[#2563EB]/20 text-sm text-[#2563EB]">
                Selected Department: <strong>{selectedDepartment.name}</strong>
              </div>
            )}

            {/* Academic Level */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold uppercase text-[#1f2a44] opacity-70 tracking-wider">
                Academic Level <span className="text-red-500">*</span>
              </label>
              <select
                value={selectedAcademicLevelId}
                onChange={(e) => {
                  setSelectedAcademicLevelId(e.target.value);
                  setLevelError("");
                }}
                className={cn(
                  "w-full px-4 py-3 rounded-xl border-[1.5px] border-slate-200 text-sm font-medium text-[#0B1020] bg-[#F8FAFC] outline-none transition-all focus:border-[#2563EB] focus:bg-white focus:ring-4 focus:ring-[#2563EB]/10",
                  levelError && "border-red-500 bg-red-50/30",
                )}
                required
              >
                <option value="">Select your academic level</option>
                <option value="100">100 Level</option>
                <option value="200">200 Level</option>
                <option value="300">300 Level</option>
                <option value="400">400 Level</option>
                <option value="500">500 Level</option>
                <option value="600">600 Level</option>
              </select>
              {levelError && (
                <p className="text-xs text-red-500 pl-1">{levelError}</p>
              )}
            </div>

            {/* Academic Session */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold uppercase text-[#1f2a44] opacity-70 tracking-wider">
                Academic Session <span className="text-red-500">*</span>
              </label>
              <select
                value={selectedSessionId}
                onChange={(e) => {
                  setSelectedSessionId(e.target.value);
                  setSessionError("");
                }}
                className={cn(
                  "w-full px-4 py-3 rounded-xl border-[1.5px] border-slate-200 text-sm font-medium text-[#0B1020] bg-[#F8FAFC] outline-none transition-all focus:border-[#2563EB] focus:bg-white focus:ring-4 focus:ring-[#2563EB]/10",
                  sessionError && "border-red-500 bg-red-50/30",
                  !selectedInstitutionId && "opacity-50 cursor-not-allowed",
                )}
                required
                disabled={!selectedInstitutionId || isLoadingSessions}
              >
                <option value="">
                  {!selectedInstitutionId
                    ? "Please select an institution first"
                    : isLoadingSessions
                      ? "Loading sessions..."
                      : "Select your academic session"}
                </option>
                {(sessionsData || []).map((session: AcademicSession) => (
                  <option key={session.id} value={session.id}>
                    {session.name} {session.isCurrent ? "(Current)" : ""}
                  </option>
                ))}
              </select>
              {sessionError && (
                <p className="text-xs text-red-500 pl-1">{sessionError}</p>
              )}
              {sessionsData?.length === 0 &&
                selectedInstitutionId &&
                !isLoadingSessions &&
                (
                  <p className="text-xs text-amber-500 pl-1">
                    No active sessions found for this institution. Please
                    contact your administrator.
                  </p>
                )}
            </div>

            <div className="flex gap-3 pt-4 border-t border-slate-100 mt-6">
              <button
                type="button"
                onClick={prevStep}
                className="px-5 py-3 rounded-xl border-2 border-slate-200 hover:border-[#2563EB] text-slate-600 hover:text-[#2563EB] font-semibold text-sm flex items-center justify-center gap-1.5 transition-all"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back</span>
              </button>
              <button
                type="button"
                onClick={validateStep3}
                className="flex-1 py-3 px-6 rounded-xl bg-[#2563EB] hover:bg-[#1D4ED8] text-white font-semibold text-sm flex items-center justify-center gap-2 transition-all shadow-[0_8px_24px_rgba(26,92,255,0.25)] active:scale-[0.98]"
              >
                <span>Continue</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 4: FINISH */}
        {currentStep === 4 && (
          <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
            <div className="text-center py-4">
              <div className="mx-auto mb-4 flex size-20 items-center justify-center rounded-2xl border border-emerald-200 bg-emerald-50 text-emerald-600">
                <Check className="w-10 h-10" />
              </div>
              <h2 className="text-2xl font-extrabold text-[#0B1020] mb-2 tracking-tight">
                You&apos;re all set!
              </h2>
              <p className="text-sm text-[#64748B] leading-relaxed max-w-sm mx-auto mb-6">
                Your account is ready. Here&apos;s what you can do next:
              </p>

              <div className="space-y-3 text-left bg-[#F8FAFC] p-4 rounded-2xl border border-slate-100 mb-6">
                <div className="flex items-center gap-3 text-xs font-semibold text-[#0B1020]">
                  <span className="w-6 h-6 rounded-full bg-white text-[#2563EB] font-bold flex items-center justify-center shrink-0 border border-slate-200">
                    1
                  </span>
                  <span>Check out your organization&apos;s dues and events</span>
                </div>
              </div>

              <div className="flex items-start gap-2 p-3 bg-blue-50 rounded-xl border border-blue-200 text-xs text-blue-700">
                <Info className="w-4 h-4 text-blue-500 shrink-0 mt-0.5" />
                <p>
                  You can join organizations and connect with your campus
                  community from your dashboard after onboarding.
                </p>
              </div>
            </div>

            {/* Error Message */}
            {submitError && (
              <div className="mt-4 p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold">Something went wrong</p>
                  <p className="text-red-600">{submitError}</p>
                  <button
                    onClick={() => setSubmitError(null)}
                    className="mt-2 text-sm font-semibold text-red-600 hover:text-red-800 underline"
                  >
                    Dismiss
                  </button>
                </div>
              </div>
            )}

            <div className="pt-4">
              <button
                type="button"
                onClick={finishOnboarding}
                disabled={isSubmitting}
                className={cn(
                  "w-full py-3.5 px-6 rounded-2xl font-semibold text-sm flex items-center justify-center gap-2 transition-all shadow-[0_8px_24px_rgba(26,92,255,0.25)] active:scale-[0.98]",
                  isSubmitting
                    ? "bg-slate-200 text-slate-400 cursor-not-allowed"
                    : "bg-[#2563EB] hover:bg-[#1D4ED8] text-white",
                )}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Completing...</span>
                  </>
                ) : (
                  <>
                    <Rocket className="w-4 h-4" />
                    <span>Go to Dashboard</span>
                  </>
                )}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
