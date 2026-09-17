"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useAuthStore } from "@/store/auth-store";
import {
  AcademicLevel,
  Department,
  Faculty,
  Institution,
  institutionsApi,
} from "@/lib/api/institutions";
import {
  SearchableSelect,
  SelectOption,
} from "@/components/ui/SearchableSelect";
import { queryKeys } from "@/lib/api/keys";
import { axiosConfig } from "@/utils/axios-config";
import {
  AlertCircle,
  ArrowLeft,
  ArrowRight,
  Check,
  GraduationCap,
  Info,
  Loader2,
  Rocket,
  ShieldCheck,
  Ticket,
} from "lucide-react";
import { cn } from "@/lib/utils";

const STEP_LABELS = [
  "Welcome",
  "Your name",
  "Institution",
  "Academic details",
  "Finish",
];

function retryTransientRequest(failureCount: number, error: unknown) {
  const status = (error as { response?: { status?: number } })?.response
    ?.status;
  return (
    failureCount < 5 &&
    (!status || status >= 500 || status === 408 || status === 429)
  );
}

const retryDelay = (attempt: number) => Math.min(1_000 * 2 ** attempt, 8_000);

function asList<T>(value: unknown): T[] {
  if (Array.isArray(value)) return value as T[];
  if (value && typeof value === "object") {
    const record = value as { data?: unknown; academicLevels?: unknown };
    if (Array.isArray(record.data)) return record.data as T[];
    if (Array.isArray(record.academicLevels))
      return record.academicLevels as T[];
  }
  return [];
}

function useInstitutions() {
  return useQuery({
    queryKey: queryKeys.institutions.all({ status: "ACTIVE", limit: 100 }),
    queryFn: () =>
      institutionsApi.getInstitutions({ status: "ACTIVE", limit: 100 }),
    retry: retryTransientRequest,
    retryDelay,
    staleTime: 10 * 60 * 1000,
  });
}

function useFaculties(institutionId: string) {
  return useQuery({
    queryKey: queryKeys.institutions.faculties(institutionId),
    queryFn: () => institutionsApi.getFacultiesByInstitution(institutionId),
    enabled: Boolean(institutionId),
    retry: retryTransientRequest,
    retryDelay,
    staleTime: 10 * 60 * 1000,
  });
}

function useDepartments(facultyId: string) {
  return useQuery({
    queryKey: queryKeys.institutions.departments(facultyId),
    queryFn: () => institutionsApi.getDepartmentsByFaculty(facultyId),
    enabled: Boolean(facultyId),
    retry: retryTransientRequest,
    retryDelay,
    staleTime: 10 * 60 * 1000,
  });
}

function useAcademicLevels(department: Department | null) {
  return useQuery({
    queryKey: [
      "institutions",
      "departments",
      department?.id,
      "academic-levels",
    ],
    queryFn: async () => {
      if (!department) return [];
      if (department.academicLevels?.length) return department.academicLevels;
      return asList<AcademicLevel>(
        await institutionsApi.getAcademicLevelsByDepartment(department.id),
      );
    },
    enabled: Boolean(department?.id),
    retry: retryTransientRequest,
    retryDelay,
    staleTime: 10 * 60 * 1000,
  });
}

export function OnboardingFlow() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { user, updateUserOnboardingStatus } = useAuthStore();
  const [currentStep, setCurrentStep] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [matricNumber, setMatricNumber] = useState("");
  const [isFresher, setIsFresher] = useState<"true" | "false" | "">("");
  const [selectedInstitutionId, setSelectedInstitutionId] = useState("");
  const [selectedFacultyId, setSelectedFacultyId] = useState("");
  const [selectedDepartmentId, setSelectedDepartmentId] = useState("");
  const [selectedAcademicLevelId, setSelectedAcademicLevelId] = useState("");
  const [selectedInstitution, setSelectedInstitution] =
    useState<Institution | null>(null);
  const [selectedFaculty, setSelectedFaculty] = useState<Faculty | null>(null);
  const [selectedDepartment, setSelectedDepartment] =
    useState<Department | null>(null);
  const [error, setError] = useState("");

  const institutionsQuery = useInstitutions();
  const facultiesQuery = useFaculties(selectedInstitutionId);
  const departmentsQuery = useDepartments(selectedFacultyId);
  const levelsQuery = useAcademicLevels(selectedDepartment);
  const institutions = asList<Institution>(institutionsQuery.data);
  const faculties = asList<Faculty>(facultiesQuery.data);
  const departments = asList<Department>(departmentsQuery.data);
  const levels = (levelsQuery.data ?? [])
    .slice()
    .sort((a, b) => (a.order ?? 0) - (b.order ?? 0));

  const completeOnboardingMutation = useMutation({
    mutationFn: async () => {
      await axiosConfig.patch("/onboarding/personal-info", {
        firstName: firstName.trim(),
        lastName: lastName.trim(),
      });
      return axiosConfig.patch("/onboarding/institution", {
        institutionId: selectedInstitutionId,
        facultyId: selectedFacultyId,
        departmentId: selectedDepartmentId,
        levelId: selectedAcademicLevelId,
        matricNumber: matricNumber.trim(),
        isFresher: isFresher === "true",
      });
    },
    onSuccess: () => {
      updateUserOnboardingStatus(true, "COMPLETED");
      void queryClient.invalidateQueries({ queryKey: queryKeys.user.current });
      void queryClient.invalidateQueries({
        queryKey: queryKeys.onboarding.status(user?.id ?? ""),
      });
      router.replace("/dashboard");
    },
    onError: (requestError: unknown) => {
      console.error("Failed to complete onboarding:", requestError);
      setIsSubmitting(false);
      setSubmitError(
        "Failed to complete onboarding. Please check your details and try again.",
      );
    },
  });

  const goToStep = (step: number) => {
    if (step >= 0 && step < STEP_LABELS.length) setCurrentStep(step);
  };
  const validateName = () => {
    if (!firstName.trim() || !lastName.trim())
      return setError("First name and last name are required.");
    setError("");
    goToStep(2);
  };
  const validateInstitution = () => {
    if (!selectedInstitutionId)
      return setError("Please select your institution.");
    setError("");
    goToStep(3);
  };
  const selectedLevel = levels.find(
    (level) => level.id === selectedAcademicLevelId,
  );
  const numericLevel =
    selectedLevel?.numericLevel ??
    Number.parseInt(selectedLevel?.name ?? "", 10);
  const validateAcademicDetails = () => {
    if (
      !selectedFacultyId ||
      !selectedDepartmentId ||
      !selectedAcademicLevelId ||
      !matricNumber.trim() ||
      !isFresher
    )
      return setError(
        "Faculty, department, academic level, matric number, and student category are required.",
      );
    if (
      (isFresher === "true" && numericLevel !== 100) ||
      (isFresher === "false" && numericLevel < 200)
    )
      return setError(
        isFresher === "true"
          ? "Fresher students must select 100 Level."
          : "Staylite students must select 200 Level or higher.",
      );
    setError("");
    goToStep(4);
  };
  const finishOnboarding = () => {
    setSubmitError(null);
    setIsSubmitting(true);
    completeOnboardingMutation.mutate();
  };

  const institutionOptions: SelectOption[] = institutions.map(
    (institution) => ({
      ...institution,
      id: institution.id,
      value: institution.id,
      label: `${institution.name} (${institution.shortName || institution.code})`,
    }),
  );
  const facultyOptions: SelectOption[] = faculties.map((faculty) => ({
    ...faculty,
    id: faculty.id,
    value: faculty.id,
    label: faculty.name,
  }));
  const departmentOptions: SelectOption[] = departments.map((department) => ({
    ...department,
    id: department.id,
    value: department.id,
    label: department.name,
  }));
  const progressPercent = (currentStep / (STEP_LABELS.length - 1)) * 100;

  return (
    <div className="onboarding-flow min-h-[100dvh] w-full overflow-hidden bg-white sm:min-h-0 sm:max-w-[640px] sm:rounded-3xl sm:border sm:border-slate-200/80 sm:shadow-[0_24px_70px_rgba(15,42,100,0.10)]">
      <div className="px-5 pb-2 pt-5 sm:px-8 sm:pt-7">
        <div className="h-1.5 w-full overflow-hidden rounded-full bg-slate-100">
          <div
            className="h-full rounded-full bg-[#2563EB] transition-all duration-500"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
        <div className="mt-3 flex justify-between gap-2 text-[10px] font-medium text-slate-400">
          {STEP_LABELS.map((label, index) => (
            <span
              key={label}
              className={cn(
                "min-w-0 flex-1 truncate text-center",
                index === currentStep && "font-semibold text-[#2563EB]",
                index < currentStep && "text-[#0f7b4a]",
              )}
            >
              {label}
            </span>
          ))}
        </div>
      </div>
      <div className="px-5 pb-[max(1.5rem,env(safe-area-inset-bottom))] pt-3 sm:px-8 sm:pb-8 sm:pt-4">
        <div className="mb-5 flex items-center justify-between border-b border-slate-100 pb-4">
          <div className="flex items-center gap-3">
            <span className="flex size-8 items-center justify-center rounded-lg bg-[#2563EB] font-mono text-xs font-bold text-white">
              {currentStep + 1}
            </span>
            <span className="text-lg font-semibold text-[#0B1020]">
              {STEP_LABELS[currentStep]}
            </span>
          </div>
          <span className="rounded-full bg-slate-100 px-2.5 py-1 font-mono text-[9px] font-semibold text-slate-400">
            {currentStep + 1} of {STEP_LABELS.length}
          </span>
        </div>
        {currentStep === 0 && (
          <div className="animate-in fade-in space-y-6 py-4 text-center">
            <div className="mx-auto flex size-16 items-center justify-center rounded-2xl border border-[#2563EB]/15 bg-[#2563EB]/8 text-[#2563EB]">
              <GraduationCap className="size-9" />
            </div>
            <div>
              <h2 className="mb-2 text-2xl font-extrabold text-[#0B1020]">
                Welcome to Heightt
              </h2>
              <p className="mx-auto max-w-sm text-sm leading-relaxed text-[#64748B]">
                Set up your student profile with the academic details your
                institution uses.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-3 text-left">
              <div className="flex items-center gap-2.5 rounded-xl border border-slate-100 bg-[#F8FAFC] p-3 text-xs font-semibold text-[#0B1020]">
                <Ticket className="size-4 text-[#2563EB]" /> Campus dues
              </div>
              <div className="flex items-center gap-2.5 rounded-xl border border-slate-100 bg-[#F8FAFC] p-3 text-xs font-semibold text-[#0B1020]">
                <ShieldCheck className="size-4 text-[#2563EB]" /> Verified
                profile
              </div>
            </div>
            <button
              type="button"
              onClick={() => goToStep(1)}
              className="flex w-full items-center justify-center gap-2 rounded-2xl bg-[#2563EB] px-6 py-3.5 text-sm font-semibold text-white"
            >
              <span>Get Started</span>
              <ArrowRight className="size-4" />
            </button>
          </div>
        )}
        {currentStep === 1 && (
          <div className="animate-in fade-in space-y-4">
            <p className="text-sm leading-relaxed text-[#64748B]">
              Use your name as it should appear on your student profile.
            </p>
            <label className="block text-xs font-semibold uppercase tracking-wider text-[#1f2a44]">
              First Name <span className="text-red-500">*</span>
              <input
                value={firstName}
                onChange={(event) => setFirstName(event.target.value)}
                className="mt-1.5 w-full rounded-xl border-[1.5px] border-slate-200 bg-[#F8FAFC] px-4 py-3 text-sm font-medium outline-none focus:border-[#2563EB]"
                placeholder="e.g. Ada"
              />
            </label>
            <label className="block text-xs font-semibold uppercase tracking-wider text-[#1f2a44]">
              Last Name <span className="text-red-500">*</span>
              <input
                value={lastName}
                onChange={(event) => setLastName(event.target.value)}
                className="mt-1.5 w-full rounded-xl border-[1.5px] border-slate-200 bg-[#F8FAFC] px-4 py-3 text-sm font-medium outline-none focus:border-[#2563EB]"
                placeholder="e.g. Lovelace"
              />
            </label>
            {error && <p className="text-xs text-red-600">{error}</p>}
            <Navigation onBack={() => goToStep(0)} onNext={validateName} />
          </div>
        )}
        {currentStep === 2 && (
          <div className="animate-in fade-in space-y-4">
            <p className="text-sm leading-relaxed text-[#64748B]">
              Select the institution where you study.
            </p>
            <SearchableSelect
              options={institutionOptions}
              value={selectedInstitutionId}
              onChange={(id, option) => {
                setSelectedInstitutionId(id);
                setSelectedInstitution(
                  (option as unknown as Institution) || null,
                );
                setSelectedFacultyId("");
                setSelectedFaculty(null);
                setSelectedDepartmentId("");
                setSelectedDepartment(null);
                setSelectedAcademicLevelId("");
              }}
              label="Institution"
              required
              isLoading={institutionsQuery.isLoading}
              error={error}
              placeholder="Search and select your institution..."
              searchPlaceholder="Search institutions..."
              noOptionsMessage="No institutions found."
            />
            {selectedInstitution && (
              <p className="rounded-xl border border-[#2563EB]/20 bg-[#EFF6FF] p-3 text-sm text-[#2563EB]">
                Selected: <strong>{selectedInstitution.name}</strong>
              </p>
            )}
            <Navigation
              onBack={() => goToStep(1)}
              onNext={validateInstitution}
            />
          </div>
        )}
        {currentStep === 3 && (
          <div className="animate-in fade-in space-y-4">
            <p className="text-sm leading-relaxed text-[#64748B]">
              Choose the academic details that match your student record.
            </p>
            <SearchableSelect
              options={facultyOptions}
              value={selectedFacultyId}
              onChange={(id, option) => {
                setSelectedFacultyId(id);
                setSelectedFaculty((option as unknown as Faculty) || null);
                setSelectedDepartmentId("");
                setSelectedDepartment(null);
                setSelectedAcademicLevelId("");
              }}
              label="Faculty"
              required
              isLoading={facultiesQuery.isLoading}
              disabled={!selectedInstitutionId}
              placeholder="Select your faculty..."
              searchPlaceholder="Search faculties..."
              noOptionsMessage="No faculties found."
            />
            <SearchableSelect
              options={departmentOptions}
              value={selectedDepartmentId}
              onChange={(id, option) => {
                setSelectedDepartmentId(id);
                setSelectedDepartment(
                  (option as unknown as Department) || null,
                );
                setSelectedAcademicLevelId("");
              }}
              label="Department"
              required
              isLoading={departmentsQuery.isLoading}
              disabled={!selectedFacultyId}
              placeholder="Select your department..."
              searchPlaceholder="Search departments..."
              noOptionsMessage="No departments found."
            />
            <label className="block text-xs font-semibold uppercase tracking-wider text-[#1f2a44]">
              Academic Level <span className="text-red-500">*</span>
              <select
                value={selectedAcademicLevelId}
                onChange={(event) =>
                  setSelectedAcademicLevelId(event.target.value)
                }
                disabled={!selectedDepartmentId || levelsQuery.isLoading}
                className="mt-1.5 w-full rounded-xl border-[1.5px] border-slate-200 bg-[#F8FAFC] px-4 py-3 text-sm font-medium outline-none focus:border-[#2563EB]"
              >
                <option value="">
                  {levelsQuery.isLoading
                    ? "Loading levels..."
                    : "Select your academic level"}
                </option>
                {levels.map((level) => (
                  <option key={level.id} value={level.id}>
                    {level.name}
                  </option>
                ))}
              </select>
            </label>
            <label className="block text-xs font-semibold uppercase tracking-wider text-[#1f2a44]">
              Matric Number <span className="text-red-500">*</span>
              <input
                value={matricNumber}
                onChange={(event) => setMatricNumber(event.target.value)}
                className="mt-1.5 w-full rounded-xl border-[1.5px] border-slate-200 bg-[#F8FAFC] px-4 py-3 text-sm font-medium outline-none focus:border-[#2563EB]"
                placeholder="e.g. MAT/2024/001"
              />
            </label>
            <fieldset>
              <legend className="text-xs font-semibold uppercase tracking-wider text-[#1f2a44]">
                Student Category <span className="text-red-500">*</span>
              </legend>
              <div className="mt-1.5 grid grid-cols-2 gap-3">
                {[
                  { label: "Fresher", value: "true", description: "100 Level" },
                  {
                    label: "Staylite",
                    value: "false",
                    description: "200 Level and above",
                  },
                ].map((option) => (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() =>
                      setIsFresher(option.value as "true" | "false")
                    }
                    className={cn(
                      "rounded-xl border p-3 text-left",
                      isFresher === option.value
                        ? "border-[#2563EB] bg-[#EFF6FF]"
                        : "border-slate-200 bg-[#F8FAFC]",
                    )}
                  >
                    <span className="block text-sm font-semibold text-[#0B1020]">
                      {option.label}
                    </span>
                    <span className="text-xs text-slate-500">
                      {option.description}
                    </span>
                  </button>
                ))}
              </div>
            </fieldset>
            {error && <p className="text-xs text-red-600">{error}</p>}
            <Navigation
              onBack={() => goToStep(2)}
              onNext={validateAcademicDetails}
            />
          </div>
        )}
        {currentStep === 4 && (
          <div className="animate-in fade-in space-y-5 py-4">
            <div className="text-center">
              <div className="mx-auto mb-4 flex size-20 items-center justify-center rounded-2xl border border-emerald-200 bg-emerald-50 text-emerald-600">
                <Check className="size-10" />
              </div>
              <h2 className="mb-2 text-2xl font-extrabold text-[#0B1020]">
                You&apos;re all set
              </h2>
              <p className="text-sm leading-relaxed text-[#64748B]">
                Your name and academic profile are ready to be connected to
                Heightt.
              </p>
            </div>
            <div className="flex items-start gap-2 rounded-xl border border-blue-200 bg-blue-50 p-3 text-xs text-blue-700">
              <Info className="mt-0.5 size-4 shrink-0 text-blue-500" />
              <p>
                We&apos;ll add you to the matching campus communities
                automatically.
              </p>
            </div>
            {submitError && (
              <div className="flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
                <AlertCircle className="mt-0.5 size-5 shrink-0 text-red-500" />
                <p>{submitError}</p>
              </div>
            )}
            <button
              type="button"
              onClick={finishOnboarding}
              disabled={isSubmitting}
              className="flex w-full items-center justify-center gap-2 rounded-2xl bg-[#2563EB] px-6 py-3.5 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:bg-slate-200 disabled:text-slate-400"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="size-4 animate-spin" /> Completing...
                </>
              ) : (
                <>
                  <Rocket className="size-4" /> Go to Dashboard
                </>
              )}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

function Navigation({
  onBack,
  onNext,
}: {
  onBack: () => void;
  onNext: () => void;
}) {
  return (
    <div className="flex gap-3 border-t border-slate-100 pt-4">
      <button
        type="button"
        onClick={onBack}
        className="flex items-center justify-center gap-1.5 rounded-xl border-2 border-slate-200 px-5 py-3 text-sm font-semibold text-slate-600"
      >
        <ArrowLeft className="size-4" />
        <span>Back</span>
      </button>
      <button
        type="button"
        onClick={onNext}
        className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-[#2563EB] px-6 py-3 text-sm font-semibold text-white"
      >
        <span>Continue</span>
        <ArrowRight className="size-4" />
      </button>
    </div>
  );
}
