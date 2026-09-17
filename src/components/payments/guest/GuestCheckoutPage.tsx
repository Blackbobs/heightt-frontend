"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useQuery, UseQueryResult } from "@tanstack/react-query";
import {
  ArrowLeft,
  ArrowRight,
  Building2,
  CreditCard,
  GraduationCap,
  Layers,
  Loader2,
  Lock,
  Mail,
  Phone,
  School,
  ShieldCheck,
  User,
  Users,
  AlertCircle,
  CheckCircle2,
  FileText,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { HeighttLoader } from "@/components/ui/HeighttLoader";
import {
  getGuestInstitutions,
  getGuestFaculties,
  getGuestDepartments,
  getGuestDues,
  getGuestAcademicLevels,
  initiateGuestCheckout,
  getGuestPaymentError,
  storeGuestAccessToken,
  storeGuestPendingPaymentId,
} from "@/lib/api/guest-payments";

const STEP_LABELS = [
  "Institution",
  "Level",
  "Faculty",
  "Department",
  "Due",
  "Your details",
];
type StepIndex = 0 | 1 | 2 | 3 | 4 | 5;
type PayeeLevel = "institution" | "faculty" | "department" | "association";

const PAYEE_LEVELS: {
  id: PayeeLevel;
  label: string;
  description: string;
  icon: React.ReactNode;
}[] = [
  {
    id: "institution",
    label: "Institution",
    description: "University or school-wide dues",
    icon: <School className="h-4 w-4" />,
  },
  {
    id: "faculty",
    label: "Faculty / College",
    description: "Faculty or college level dues",
    icon: <GraduationCap className="h-4 w-4" />,
  },
  {
    id: "department",
    label: "Department",
    description: "Department level dues",
    icon: <Building2 className="h-4 w-4" />,
  },
  {
    id: "association",
    label: "Association",
    description: "Student association dues",
    icon: <Users className="h-4 w-4" />,
  },
];

function formatNaira(kobo: number) {
  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    minimumFractionDigits: 2,
  }).format(kobo / 100);
}

export function GuestCheckoutPage() {
  const [step, setStep] = useState<StepIndex>(0);
  const [selectedInstitutionId, setSelectedInstitutionId] = useState("");
  const [selectedInstitutionName, setSelectedInstitutionName] = useState("");
  const [selectedFacultyId, setSelectedFacultyId] = useState("");
  const [selectedDepartmentId, setSelectedDepartmentId] = useState("");
  const [selectedDueId, setSelectedDueId] = useState("");
  const [selectedLevel, setSelectedLevel] = useState<PayeeLevel | "">("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [matricNumber, setMatricNumber] = useState("");
  const [academicLevelId, setAcademicLevelId] = useState("");
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  const institutionsQuery = useQuery({
    queryKey: ["guest-payments", "options", "institutions"],
    queryFn: () => getGuestInstitutions(),
    staleTime: 10 * 60 * 1000,
    retry: 1,
  });

  const facultiesQuery = useQuery({
    queryKey: ["guest-payments", "options", "faculties", selectedInstitutionId],
    queryFn: () => getGuestFaculties(selectedInstitutionId),
    enabled: !!selectedInstitutionId,
    staleTime: 5 * 60 * 1000,
    retry: 1,
  });

  const departmentsQuery = useQuery({
    queryKey: ["guest-payments", "options", "departments", selectedFacultyId],
    queryFn: () => getGuestDepartments(selectedFacultyId),
    enabled: !!selectedFacultyId,
    staleTime: 5 * 60 * 1000,
    retry: 1,
  });

  const academicLevelsQuery = useQuery({
    queryKey: [
      "guest-payments",
      "options",
      "academic-levels",
      selectedInstitutionId,
      selectedFacultyId,
      selectedDepartmentId,
    ],
    queryFn: () =>
      getGuestAcademicLevels({
        institutionId: selectedInstitutionId,
        facultyId: selectedFacultyId || undefined,
        departmentId: selectedDepartmentId || undefined,
      }),
    enabled: !!selectedInstitutionId,
    staleTime: 5 * 60 * 1000,
    retry: 1,
  });
  const academicLevels = academicLevelsQuery.data ?? [];

  const duesQuery = useQuery({
    queryKey: [
      "guest-payments",
      "options",
      "dues",
      selectedInstitutionId,
      selectedFacultyId,
      selectedDepartmentId,
      academicLevelId,
    ],
    queryFn: () =>
      getGuestDues({
        institutionId: selectedInstitutionId,
        facultyId: selectedFacultyId || undefined,
        departmentId: selectedDepartmentId || undefined,
        academicLevelId,
      }),
    enabled: !!selectedInstitutionId && !!academicLevelId,
    staleTime: 2 * 60 * 1000,
    retry: 1,
  });

  const dues = useMemo(
    () => (duesQuery.data ?? []).slice().sort((a, b) => a.amount - b.amount),
    [duesQuery.data],
  );
  const selectedDue = useMemo(
    () => dues.find((d) => d.id === selectedDueId) ?? null,
    [dues, selectedDueId],
  );
  const faculties = facultiesQuery.data ?? [];
  const facultiesLoaded = facultiesQuery.isSuccess;
  const facultiesUnavailable = facultiesLoaded && faculties.length === 0;
  const departments = departmentsQuery.data ?? [];
  const departmentsLoaded = departmentsQuery.isSuccess;

  const queries = {
    institutions: institutionsQuery,
    faculties: facultiesQuery,
    departments: departmentsQuery,
    academicLevels: academicLevelsQuery,
    dues: duesQuery,
  } as unknown as Record<string, UseQueryResult<unknown, unknown>>;

  function selectInstitution(id: string, name: string) {
    setSelectedInstitutionId(id);
    setSelectedInstitutionName(name);
    setSelectedLevel("");
    setSelectedFacultyId("");
    setSelectedDepartmentId("");
    setAcademicLevelId("");
    setSelectedDueId("");
    setError("");
  }

  function goNext() {
    setError("");
    if (step === 0) {
      if (!selectedInstitutionId) {
        setError("Select your institution to continue.");
        return;
      }
      setSelectedLevel("");
      setSelectedFacultyId("");
      setSelectedDepartmentId("");
      setAcademicLevelId("");
      setSelectedDueId("");
      setStep(1);
      return;
    }
    if (step === 1) {
      if (!selectedLevel) {
        setError("Select what you want to pay for to continue.");
        return;
      }
      setSelectedDueId("");
      if (
        selectedLevel === "institution" ||
        selectedLevel === "association"
      ) {
        setSelectedFacultyId("");
        setSelectedDepartmentId("");
        setAcademicLevelId("");
        setStep(4);
      } else {
        setSelectedDepartmentId("");
        setAcademicLevelId("");
        setStep(2);
      }
      return;
    }
    if (step === 2) {
      if (!selectedFacultyId) {
        setError("Select a faculty to continue.");
        return;
      }
      if (selectedLevel === "department") {
        setStep(departmentsLoaded && departments.length === 0 ? 4 : 3);
      } else {
        setSelectedDepartmentId("");
        setAcademicLevelId("");
        setSelectedDueId("");
        setStep(4);
      }
      return;
    }
    if (step === 3) {
      if (!selectedDepartmentId) setSelectedDepartmentId("");
      setStep(4);
      return;
    }
    if (step === 4) {
      if (!academicLevelId) {
        setError("Select your academic level to view available dues.");
        return;
      }
      if (!selectedDueId) {
        setError("Select the due you want to pay.");
        return;
      }
      setStep(5);
    }
  }

  function goBack() {
    setError("");
    if (step === 1) setStep(0);
    else if (step === 2) setStep(1);
    else if (step === 3) setStep(2);
    else if (step === 4) {
      if (selectedLevel === "department") setStep(3);
      else if (selectedLevel === "faculty") setStep(2);
      else setStep(1);
    } else if (step === 5) setStep(4);
  }

  function validateIdentity(): boolean {
    const errors: Record<string, string> = {};
    if (!firstName.trim()) errors.firstName = "Enter your first name.";
    if (!lastName.trim()) errors.lastName = "Enter your last name.";
    if (!email.trim()) errors.email = "Enter your email address.";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim()))
      errors.email = "Enter a valid email address.";
    if (!phone.trim()) errors.phone = "Enter your phone number.";
    else if (phone.replace(/\D/g, "").length < 7)
      errors.phone = "Enter a valid phone number.";
    if (!matricNumber.trim())
      errors.matricNumber = "Enter your matriculation number.";
    if (!academicLevelsQuery.isSuccess || !academicLevels.some((level) => level.id === academicLevelId))
      errors.academicLevelId = "Select your academic level.";
    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  }

  async function handleSubmit() {
    setError("");
    if (!validateIdentity()) return;
    if (!selectedDue || !selectedInstitutionId) return;

    setSubmitting(true);
    try {
      const origin = window.location.origin;
      const result = await initiateGuestCheckout({
        email: email.trim().toLowerCase(),
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        phone: phone.trim(),
        matricNumber: matricNumber.trim(),
        institutionId: selectedInstitutionId,
        facultyId: selectedFacultyId || undefined,
        departmentId: selectedDepartmentId || undefined,
        academicLevelId,
        dueId: selectedDue.id,
        paymentMethod: "CARD",
        successUrl: `${origin}/payments/guest/callback`,
        cancelUrl: `${origin}/payments/guest/cancelled`,
      });

      // Token lives in sessionStorage only (never the URL, logs, or analytics).
      storeGuestAccessToken(result.pendingPaymentId, result.accessToken);
      storeGuestPendingPaymentId(result.pendingPaymentId);
      window.location.assign(result.checkoutUrl);
    } catch (err) {
      setError(
        getGuestPaymentError(err, "We could not start your payment. Please try again."),
      );
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="mx-auto w-full max-w-3xl px-5 py-10 sm:py-14">
      <div className="mb-8 text-center">
        <span className="inline-flex items-center gap-1.5 rounded-full border border-[#2563EB]/20 bg-blue-50 px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-[#2563EB] dark:bg-blue-950/40">
          <ShieldCheck className="h-3.5 w-3.5" /> No account needed
        </span>
        <h1 className="mt-4 text-3xl font-extrabold tracking-tight text-[#0B1020] dark:text-white sm:text-4xl">
          Pay your dues as a guest
        </h1>
        <p className="mx-auto mt-3 max-w-xl text-sm leading-6 text-slate-500 dark:text-slate-400 sm:text-base">
          Find your institution and pay an active due without registering. Use
          the same email when you create an account later so your payment and
          receipt can be claimed.
        </p>
      </div>

      {step > 0 && (
        <div className="mb-8 flex flex-wrap items-center gap-2">
          {STEP_LABELS.map((label, index) => {
            const isActive = index === step;
            const isDone = index < step;
            return (
              <span
                key={label}
                className={cn(
                  "rounded-full border px-3 py-1 text-[11px] font-semibold sm:text-xs",
                  isActive
                    ? "border-[#2563EB] bg-[#2563EB] text-white"
                    : isDone
                      ? "border-[#2563EB]/40 bg-blue-50 text-[#2563EB] dark:bg-blue-950/30"
                      : "border-slate-200 text-slate-400 dark:border-slate-700 dark:text-slate-500",
                )}
              >
                {isDone ? "✓ " : ""}
                {label}
              </span>
            );
          })}
        </div>
      )}

      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-[0_10px_30px_rgba(15,23,42,0.05)] dark:border-slate-800 dark:bg-slate-900 sm:p-7">
        {error && (
          <div
            role="alert"
            className="mb-5 flex items-start gap-2 rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700 dark:border-red-900 dark:bg-red-950/40 dark:text-red-300"
          >
            <AlertCircle className="mt-0.5 h-4 w-4 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

{step === 0 && (
          <section>
            <StepTitle
              icon={<School className="h-4.5 w-4.5" />}
              title="Which institution do you belong to?"
              description="We will show only active dues in active organizations."
            />
            {institutionsQuery.isLoading ? (
              <div className="flex min-h-40 items-center justify-center">
                <HeighttLoader label="Loading institutions" />
              </div>
            ) : institutionsQuery.isError || !institutionsQuery.data ? (
              <StepError
                title="Could not load institutions."
                message={getGuestPaymentError(
                  institutionsQuery.error,
                  "Please try again in a moment.",
                )}
              />
            ) : institutionsQuery.data.length ? (
              <div className="grid max-h-[360px] gap-2.5 overflow-y-auto pr-1 sm:grid-cols-2">
                {institutionsQuery.data.map((institution) => (
                  <OptionCard
                    key={institution.id}
                    title={institution.name}
                    subtitle={institution.code || institution.shortName || "Institution"}
                    selected={selectedInstitutionId === institution.id}
                    onClick={() => selectInstitution(institution.id, institution.name)}
                  />
                ))}
              </div>
            ) : (
              <StepEmpty message="No institutions are available right now. Please check back later." />
            )}
          </section>
        )}
        {step === 1 && (
          <section>
            <StepTitle
              icon={<Layers className="h-4.5 w-4.5" />}
              title="What are you paying for?"
              description="Choose the organisation level of the due you are paying. Only the selection steps needed for that level will appear."
            />
            <div className="grid max-h-[340px] gap-2.5 overflow-y-auto pr-1 sm:grid-cols-2">
              {PAYEE_LEVELS.map((level) => {
                const levelDisabled =
                  (level.id === "faculty" || level.id === "department") &&
                  facultiesUnavailable;
                return (
                  <OptionCard
                    key={level.id}
                    title={level.label}
                    subtitle={
                      levelDisabled
                        ? "Not available for this institution"
                        : level.description
                    }
                    selected={selectedLevel === level.id}
                    onClick={() => setSelectedLevel(level.id)}
                    icon={level.icon}
                    disabled={levelDisabled}
                  />
                );
              })}
            </div>
          </section>
        )}
        {step === 2 && (
          <section>
            <StepTitle
              icon={<GraduationCap className="h-4.5 w-4.5" />}
              title="Select your faculty"
              description="Only if it applies to your institution."
            />
            {facultiesQuery.isLoading ? (
              <div className="flex min-h-32 items-center justify-center">
                <HeighttLoader label="Loading faculties" />
              </div>
            ) : facultiesQuery.isError ? (
              <StepError
                title="Could not load faculties."
                message={getGuestPaymentError(
                  facultiesQuery.error,
                  "Please try again in a moment.",
                )}
              />
            ) : faculties.length ? (
              <div className="grid max-h-[340px] gap-2.5 overflow-y-auto pr-1 sm:grid-cols-2">
                {faculties.map((faculty) => (
                  <OptionCard
                    key={faculty.id}
                    title={faculty.name}
                    subtitle={faculty.code || selectedInstitutionName}
                    selected={selectedFacultyId === faculty.id}
                    onClick={() => {
                      setSelectedFacultyId(faculty.id);
                      setSelectedDepartmentId("");
                      setAcademicLevelId("");
                      setSelectedDueId("");
                      setError("");
                    }}
                  />
                ))}
              </div>
            ) : (
              <StepEmpty message="No faculties are listed for this institution." />
            )}
          </section>
        )}

{step === 3 && (
          <section>
            <StepTitle
              icon={<Building2 className="h-4.5 w-4.5" />}
              title="Select your department"
              description="Only if it applies to your faculty."
            />
            {departmentsQuery.isLoading ? (
              <div className="flex min-h-32 items-center justify-center">
                <HeighttLoader label="Loading departments" />
              </div>
            ) : departmentsQuery.isError ? (
              <StepError
                title="Could not load departments."
                message={getGuestPaymentError(
                  departmentsQuery.error,
                  "Please try again in a moment.",
                )}
              />
            ) : departments.length ? (
              <div className="grid max-h-[340px] gap-2.5 overflow-y-auto pr-1 sm:grid-cols-2">
                {departments.map((department) => (
                  <OptionCard
                    key={department.id}
                    title={department.name}
                    subtitle={department.code || "Department"}
                    selected={selectedDepartmentId === department.id}
                    onClick={() => {
                      setSelectedDepartmentId(department.id);
                      setAcademicLevelId("");
                      setSelectedDueId("");
                      setError("");
                    }}
                  />
                ))}
              </div>
            ) : (
              <StepEmpty message="No departments are listed for this faculty." />
            )}
          </section>
        )}
        {step === 4 && (
          <section>
            <StepTitle
              icon={<FileText className="h-4.5 w-4.5" />}
              title="Which due do you want to pay?"
              description="Choose your academic level, then pick an available due."
            />
            <div className="mb-5 space-y-1.5">
              <label
                htmlFor="guest-academic-level"
                className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400"
              >
                Academic level
              </label>
              <select
                id="guest-academic-level"
                value={
                  academicLevels.some((level) => level.id === academicLevelId)
                    ? academicLevelId
                    : ""
                }
                onChange={(event) => {
                  setAcademicLevelId(event.target.value);
                  setSelectedDueId("");
                  setError("");
                  setFieldErrors({ ...fieldErrors, academicLevelId: "" });
                }}
                disabled={
                  !academicLevelsQuery.isSuccess || !academicLevels.length
                }
                aria-invalid={!!fieldErrors.academicLevelId}
                className={cn(
                  "w-full rounded-xl border-[1.5px] border-slate-200 bg-[#F8FAFC] px-4 py-3 text-sm font-medium text-[#0B1020] outline-none focus:border-[#2563EB] disabled:opacity-50 dark:border-slate-700 dark:bg-slate-800 dark:text-white",
                  fieldErrors.academicLevelId && "border-red-500",
                )}
              >
                <option value="">
                  {academicLevelsQuery.isLoading
                    ? "Loading academic levels…"
                    : "Select your academic level"}
                </option>
                {academicLevels.map((level) => (
                  <option key={level.id} value={level.id}>
                    {level.name}
                    {!selectedDepartmentId
                      ? ` — ${level.department.name}`
                      : ""}
                  </option>
                ))}
              </select>
              {academicLevelsQuery.isError && (
                <p className="text-xs text-red-500">
                  Could not load academic levels.{" "}
                  <button
                    type="button"
                    className="underline"
                    onClick={() => void academicLevelsQuery.refetch()}
                  >
                    Retry
                  </button>
                </p>
              )}
              {academicLevelsQuery.isSuccess && !academicLevels.length && (
                <p className="text-xs text-slate-500">
                  No academic levels are available for this selection.
                </p>
              )}
            </div>

            {!academicLevelId ? (
              <StepEmpty message="Select your academic level to see the dues available to you." />
            ) : duesQuery.isLoading ? (
              <div className="flex min-h-32 items-center justify-center">
                <HeighttLoader label="Loading available dues" />
              </div>
            ) : duesQuery.isError ? (
              <StepError
                title="Could not load available dues."
                message={getGuestPaymentError(
                  duesQuery.error,
                  "Please try a different selection or try again.",
                )}
              />
            ) : dues.length ? (
              <div className="grid max-h-[340px] gap-2.5 overflow-y-auto pr-1">
                {dues.map((due) => (
                  <OptionCard
                    key={due.id}
                    title={due.name}
                    subtitle={
                      [
                        due.organization?.name,
                        due.session?.name || due.sessionName,
                        due.isFresher
                          ? "100 level students"
                          : "200 level and above",
                        formatNaira(due.amount),
                      ]
                        .filter(Boolean)
                        .join(" · ") || undefined
                    }
                    selected={selectedDueId === due.id}
                    onClick={() => {
                      setSelectedDueId(due.id);
                      setError("");
                    }}
                  />
                ))}
              </div>
            ) : (
              <StepEmpty message="No dues are available for this academic level. You can adjust your level or academic scope." />
            )}
          </section>
        )}
{step === 5 && selectedDue && (
          <section>
            <StepTitle
              icon={<User className="h-4.5 w-4.5" />}
              title="Your details and payment"
              description="Use the email you will register with so you can claim this payment later."
            />
            <div className="mb-5 rounded-xl border border-blue-100 bg-blue-50/60 p-4 dark:border-blue-900/50 dark:bg-blue-950/30">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                    {selectedDue.organization?.name || selectedInstitutionName}
                  </p>
                  <p className="mt-0.5 text-sm font-bold text-[#0B1020] dark:text-white">
                    {selectedDue.name}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold text-[#2563EB]">
                    {formatNaira(selectedDue.amount)}
                  </p>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">
                    {selectedDue.session?.name || selectedDue.sessionName || "Current session"}
                  </p>
                </div>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <TextField
                label="First name"
                icon={<User className="h-4 w-4" />}
                value={firstName}
                onChange={(v) => { setFirstName(v); setFieldErrors({ ...fieldErrors, firstName: "" }); }}
                error={fieldErrors.firstName}
                autoComplete="given-name"
                placeholder="Ada"
              />
              <TextField
                label="Last name"
                icon={<User className="h-4 w-4" />}
                value={lastName}
                onChange={(v) => { setLastName(v); setFieldErrors({ ...fieldErrors, lastName: "" }); }}
                error={fieldErrors.lastName}
                autoComplete="family-name"
                placeholder="Okafor"
              />
              <TextField
                label="Email address"
                type="email"
                icon={<Mail className="h-4 w-4" />}
                value={email}
                onChange={(v) => { setEmail(v); setFieldErrors({ ...fieldErrors, email: "" }); }}
                error={fieldErrors.email}
                autoComplete="email"
                placeholder="student@example.com"
              />
              <TextField
                label="Phone number"
                type="tel"
                icon={<Phone className="h-4 w-4" />}
                value={phone}
                onChange={(v) => { setPhone(v); setFieldErrors({ ...fieldErrors, phone: "" }); }}
                error={fieldErrors.phone}
                autoComplete="tel"
                placeholder="+2348000000000"
              />
              <TextField
                label="Matriculation number"
                icon={<FileText className="h-4 w-4" />}
                value={matricNumber}
                onChange={(v) => {
                  setMatricNumber(v);
                  setFieldErrors({ ...fieldErrors, matricNumber: "" });
                }}
                error={fieldErrors.matricNumber}
                autoComplete="off"
                placeholder="ENG/2026/001"
              />
            </div>

            <div className="mt-5 space-y-1.5">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                Payment method
              </span>
              <div className="flex items-center gap-3 rounded-xl border border-[#2563EB]/30 bg-blue-50/60 p-3.5 dark:bg-blue-950/30">
                <CreditCard className="h-5 w-5 flex-shrink-0 text-[#2563EB]" />
                <div>
                  <p className="text-sm font-semibold text-[#0B1020] dark:text-white">
                    Card
                  </p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Pay securely with your debit or credit card.
                  </p>
                </div>
                <span className="ml-auto inline-flex items-center gap-1 rounded-full border border-emerald-200 bg-emerald-50 px-2 py-0.5 text-[10px] font-bold uppercase text-emerald-700 dark:border-emerald-900 dark:bg-emerald-950/40 dark:text-emerald-300">
                  <Lock className="h-3 w-3" /> Secure
                </span>
              </div>
            </div>
          </section>
        )}
        {/* Navigation */}
        <div
          className={cn(
            "mt-7 flex flex-col-reverse gap-3 border-t border-slate-100 pt-5 dark:border-slate-800 sm:flex-row sm:items-center sm:justify-between",
            step === 0 && "sm:justify-end",
          )}
        >
          {step > 0 ? (
            <button
              type="button"
              onClick={goBack}
              disabled={submitting}
              className="inline-flex items-center justify-center gap-1.5 rounded-xl border border-slate-200 px-5 py-3 text-sm font-semibold text-slate-700 transition-colors hover:bg-slate-50 disabled:opacity-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
            >
              <ArrowLeft className="h-4 w-4" /> Back
            </button>
          ) : (
            <Link
              href="/"
              className="inline-flex items-center justify-center gap-1.5 rounded-xl border border-slate-200 px-5 py-3 text-sm font-semibold text-slate-700 transition-colors hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
            >
              <ArrowLeft className="h-4 w-4" /> Home
            </Link>
          )}

          {step < 5 ? (
            <button
              type="button"
              onClick={goNext}
              disabled={isStepBusy(step, queries)}
              className="inline-flex items-center justify-center gap-1.5 rounded-xl bg-[#2563EB] px-8 py-3 text-sm font-bold text-white shadow-lg shadow-blue-500/20 transition-all hover:-translate-y-0.5 hover:bg-[#1D4ED8] disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:translate-y-0"
            >
              {isStepBusy(step, queries) ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" /> Loading…
                </>
              ) : (
                <>
                  Continue <ArrowRight className="h-4 w-4" />
                </>
              )}
            </button>
          ) : (
            <button
              type="button"
              onClick={handleSubmit}
              disabled={submitting}
              className="inline-flex min-w-40 items-center justify-center gap-2 rounded-xl bg-[#2563EB] px-8 py-3 text-sm font-bold text-white shadow-lg shadow-blue-500/20 transition-all hover:-translate-y-0.5 hover:bg-[#1D4ED8] disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:translate-y-0"
            >
              {submitting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Starting secure payment…
                </>
              ) : (
                <>
                  <Lock className="h-4 w-4" />
                  Pay {formatNaira(selectedDue?.amount ?? 0)}
                </>
              )}
            </button>
          )}
        </div>
      </div>

      <p className="mx-auto mt-6 flex max-w-xl items-center justify-center gap-2 text-center text-xs leading-5 text-slate-400 dark:text-slate-500">
        <ShieldCheck className="h-4 w-4 flex-shrink-0 text-emerald-500" />
        You will get a receipt instantly. Register later with the same email to claim your payment history.
      </p>
    </div>
  );
}
/* ============================================================
 * Building blocks
 * ==========================================================*/

function isStepBusy(
  step: StepIndex,
  queries: Record<string, UseQueryResult<unknown, unknown>>,
): boolean {
  if (step === 0) return queries.institutions?.isLoading === true;
  if (step === 2) return queries.faculties?.isLoading === true;
  if (step === 3) return queries.departments?.isLoading === true;
  if (step === 4)
    return (
      queries.academicLevels?.isLoading === true ||
      queries.dues?.isLoading === true
    );
  return false;
}

function StepTitle({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="mb-5 flex items-center gap-2.5">
      <span className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-xl bg-blue-50 text-[#2563EB] dark:bg-blue-950/50">
        {icon}
      </span>
      <div>
        <h2 className="text-base font-bold text-[#0B1020] dark:text-white">
          {title}
        </h2>
        <p className="text-xs text-slate-500 dark:text-slate-400">
          {description}
        </p>
      </div>
    </div>
  );
}

function StepError({ title, message }: { title: string; message: string }) {
  return (
    <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700 dark:border-red-900 dark:bg-red-950/40 dark:text-red-300">
      <p className="font-semibold">{title}</p>
      <p className="mt-1">{message}</p>
    </div>
  );
}

function StepEmpty({ message }: { message: string }) {
  return (
    <div className="rounded-xl border border-slate-200 p-6 text-center text-sm text-slate-500 dark:border-slate-700 dark:text-slate-400">
      {message}
    </div>
  );
}

function OptionCard({
  title,
  subtitle,
  selected,
  onClick,
  icon,
  disabled,
}: {
  title: string;
  subtitle?: string;
  selected: boolean;
  onClick: () => void;
  icon?: React.ReactNode;
  disabled?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={cn(
        "w-full rounded-xl border px-4 py-3.5 text-left flex items-start gap-3 transition-all cursor-pointer",
        selected
          ? "border-[#2563EB] bg-blue-50/70 ring-2 ring-[#2563EB]/20 dark:bg-blue-950/30"
          : "border-slate-200 bg-white hover:border-[#2563EB]/50 hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-900 dark:hover:bg-slate-800/70",
        disabled && "cursor-not-allowed opacity-60",
      )}
    >
      {icon ? (
        <span className="mt-0.5 flex h-6 w-6 flex-shrink-0 items-center justify-center text-slate-400">
          {icon}
        </span>
      ) : (
        <span
          className={cn(
            "mt-0.5 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full border-2 transition-colors",
            selected
              ? "border-[#2563EB] bg-[#2563EB]"
              : "border-slate-300 dark:border-slate-600",
          )}
        >
          {selected && <CheckCircle2 className="h-3.5 w-3.5 text-white" />}
        </span>
      )}
      <span className="min-w-0">
        <span className="block text-sm font-semibold text-[#0B1020] dark:text-white">
          {title}
        </span>
        {subtitle && (
          <span className="mt-0.5 block text-xs text-slate-500 dark:text-slate-400">
            {subtitle}
          </span>
        )}
      </span>
    </button>
  );
}

function TextField({
  label,
  value,
  onChange,
  error,
  icon,
  type = "text",
  placeholder,
  autoComplete,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  error?: string;
  icon?: React.ReactNode;
  type?: string;
  placeholder?: string;
  autoComplete?: string;
}) {
  return (
    <div className="space-y-1.5">
      <label className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
        {label}
      </label>
      <div className="relative">
        {icon && (
          <span className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400">
            {icon}
          </span>
        )}
        <input
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          autoComplete={autoComplete}
          placeholder={placeholder}
          className={cn(
            "w-full rounded-xl border-[1.5px] border-slate-200 bg-[#F8FAFC] py-3 text-sm font-medium text-[#0B1020] outline-none transition-all focus:border-[#2563EB] focus:bg-white focus:ring-4 focus:ring-[#2563EB]/10 dark:border-slate-700 dark:bg-slate-800 dark:text-white",
            icon ? "pl-10" : undefined,
            error ? "border-red-500 bg-red-50/30" : undefined,
          )}
        />
      </div>
      {error && <p className="pl-1 text-xs text-red-500">{error}</p>}
    </div>
  );
}
