"use client";

import { FormEvent, useState } from "react";
import { AxiosError } from "axios";
import { CheckCircle2, Loader2 } from "lucide-react";
import { useOrganizationRequestData } from "@/hooks/queries/useOrganizationRequestData";
import {
  CommunityOrganizationScope,
  CommunityOrganizationType,
  CreateOrganizationRequest,
  organizationsApi,
} from "@/lib/api/organizations";

const types: { value: CommunityOrganizationType; label: string }[] = [
  { value: "ASSOCIATION", label: "Association" },
  { value: "CLUB", label: "Club" },
  { value: "RELIGIOUS", label: "Religious organization" },
  { value: "SPORTS", label: "Sports organization" },
  { value: "SPECIAL", label: "Special interest organization" },
];

const scopes: { value: CommunityOrganizationScope; label: string }[] = [
  { value: "CUSTOM", label: "Custom or independent" },
  { value: "CROSS_DEPARTMENT", label: "Across departments" },
  { value: "CROSS_LEVEL", label: "Across academic levels" },
];

const initialForm: CreateOrganizationRequest = {
  name: "",
  description: "",
  logo: "",
  type: "ASSOCIATION",
  scope: "CUSTOM",
};

function errorMessage(error: unknown) {
  const response = (error as AxiosError<{ message?: string | { message?: string } }>).response;
  const message = response?.data?.message;
  if (response?.status === 409) return "An organization with this name already exists.";
  if (typeof message === "string") return message;
  if (message && typeof message.message === "string") return message.message;
  return "We could not submit your request. Please try again.";
}

export function OrganizationRequestForm() {
  const [form, setForm] = useState<CreateOrganizationRequest>(initialForm);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [submittedName, setSubmittedName] = useState("");
  const directory = useOrganizationRequestData(
    form.institutionId ?? "",
    form.facultyId ?? "",
  );

  const update = <K extends keyof CreateOrganizationRequest>(
    key: K,
    value: CreateOrganizationRequest[K],
  ) => setForm((current) => ({ ...current, [key]: value }));

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");
    if (form.name.trim().length < 2) return setError("Organization name must be at least 2 characters.");
    if (form.scope !== "CUSTOM" && !form.institutionId) return setError("Select an institution for this scope.");
    setIsSubmitting(true);
    try {
      await organizationsApi.createOrganizationRequest({
        name: form.name.trim(),
        type: form.type,
        scope: form.scope,
        ...(form.description?.trim() && { description: form.description.trim() }),
        ...(form.logo?.trim() && { logo: form.logo.trim() }),
        ...(form.institutionId && { institutionId: form.institutionId }),
        ...(form.facultyId && { facultyId: form.facultyId }),
        ...(form.departmentId && { departmentId: form.departmentId }),
      });
      setSubmittedName(form.name.trim());
    } catch (requestError) {
      setError(errorMessage(requestError));
    } finally {
      setIsSubmitting(false);
    }
  };

  if (submittedName) {
    return (
      <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-6 text-center dark:border-emerald-900 dark:bg-emerald-950/30">
        <CheckCircle2 className="mx-auto size-10 text-emerald-600" aria-hidden="true" />
        <h2 className="mt-4 text-2xl font-black text-[#0B1020] dark:text-white">Request submitted</h2>
        <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">
          Your request for {submittedName} has been submitted. A Heightt platform administrator will review it. We will email you with the admin dashboard link after approval.
        </p>
      </div>
    );
  }

  const fieldClass = "mt-1.5 w-full rounded-xl border border-slate-200 bg-white px-3.5 py-3 text-sm text-[#0B1020] outline-none focus:border-[#2563EB] dark:border-slate-700 dark:bg-[#131B2E] dark:text-white";
  const labelClass = "block text-xs font-semibold text-slate-700 dark:text-slate-200";

  return (
    <form onSubmit={submit} className="space-y-5 rounded-xl border border-slate-200 bg-white p-5 sm:p-7 dark:border-slate-800 dark:bg-[#131B2E]">
      <label className={labelClass}>Organization name *
        <input className={fieldClass} value={form.name} maxLength={255} required onChange={(event) => update("name", event.target.value)} />
      </label>
      <label className={labelClass}>Description
        <textarea className={`${fieldClass} min-h-24 resize-y`} value={form.description} onChange={(event) => update("description", event.target.value)} />
      </label>
      <div className="grid gap-5 sm:grid-cols-2">
        <label className={labelClass}>Organization type *
          <select className={fieldClass} value={form.type} onChange={(event) => update("type", event.target.value as CommunityOrganizationType)}>
            {types.map((type) => <option key={type.value} value={type.value}>{type.label}</option>)}
          </select>
        </label>
        <label className={labelClass}>Community scope *
          <select className={fieldClass} value={form.scope} onChange={(event) => update("scope", event.target.value as CommunityOrganizationScope)}>
            {scopes.map((scope) => <option key={scope.value} value={scope.value}>{scope.label}</option>)}
          </select>
        </label>
      </div>
      <label className={labelClass}>Institution {form.scope !== "CUSTOM" && "*"}
        <select className={fieldClass} value={form.institutionId ?? ""} required={form.scope !== "CUSTOM"} onChange={(event) => setForm((current) => ({ ...current, institutionId: event.target.value || undefined, facultyId: undefined, departmentId: undefined }))}>
          <option value="">Independent organization</option>
          {directory.institutions.map((item) => <option key={item.id} value={item.id}>{item.name}</option>)}
        </select>
      </label>
      <div className="grid gap-5 sm:grid-cols-2">
        <label className={labelClass}>Faculty
          <select className={fieldClass} disabled={!form.institutionId || directory.facultiesQuery.isLoading} value={form.facultyId ?? ""} onChange={(event) => setForm((current) => ({ ...current, facultyId: event.target.value || undefined, departmentId: undefined }))}>
            <option value="">No faculty selected</option>
            {directory.faculties.map((item) => <option key={item.id} value={item.id}>{item.name}</option>)}
          </select>
        </label>
        <label className={labelClass}>Department
          <select className={fieldClass} disabled={!form.facultyId || directory.departmentsQuery.isLoading} value={form.departmentId ?? ""} onChange={(event) => update("departmentId", event.target.value || undefined)}>
            <option value="">No department selected</option>
            {directory.departments.map((item) => <option key={item.id} value={item.id}>{item.name}</option>)}
          </select>
        </label>
      </div>
      <label className={labelClass}>Logo URL
        <input className={fieldClass} type="url" placeholder="https://example.com/logo.png" value={form.logo} onChange={(event) => update("logo", event.target.value)} />
      </label>
      <p className="text-xs leading-5 text-slate-500">Can’t find an institution or academic unit? Email <a className="font-semibold text-[#2563EB]" href="mailto:heightt.finance@gmail.com">Heightt support</a> to have it added.</p>
      {error && <p role="alert" className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700 dark:border-red-900 dark:bg-red-950/30 dark:text-red-300">{error}</p>}
      <button disabled={isSubmitting} className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[#2563EB] px-5 py-3 text-sm font-semibold text-white hover:bg-[#1D4ED8] disabled:cursor-not-allowed disabled:opacity-60">
        {isSubmitting && <Loader2 className="size-4 animate-spin" aria-hidden="true" />}
        {isSubmitting ? "Submitting request" : "Submit for review"}
      </button>
    </form>
  );
}
