// src/lib/api/guest-payments.ts
//
// Public "guest" dues payments plus the post-registration claim flow.
// Guest mutations reuse the same browser CSRF protection and secure cookies
// as the rest of the API (handled automatically by axiosConfig).

import { AxiosResponse } from "axios";
import { axiosConfig } from "@/utils/axios-config";

/* ============================================================
 * Types
 * ==========================================================*/

export interface GuestInstitution {
  id: string;
  name: string;
  code?: string;
  shortName?: string;
}

export interface GuestFaculty {
  id: string;
  name: string;
  code?: string;
  institutionId?: string;
}

export interface GuestDepartment {
  id: string;
  name: string;
  code?: string;
  facultyId?: string;
}

export interface GuestAcademicLevel {
  id: string;
  name: string;
  department: { id: string; name: string };
}

export interface GuestDue {
  id: string;
  name: string;
  amount: number; // Kobo
  description?: string | null;
  dueDate?: string | null;
  isRequired?: boolean;
  isFresher: boolean;
  organization?: {
    id: string;
    name: string;
    slug?: string;
  };
  organizationId?: string;
  session?: {
    id: string;
    name: string;
  } | null;
  sessionName?: string;
}

export interface GuestCheckoutPayload {
  email: string;
  firstName: string;
  lastName: string;
  phone: string;
  matricNumber: string;
  institutionId: string;
  /** Optional – the backend accepts dues without a faculty. */
  facultyId?: string;
  /** Optional – the backend accepts dues without a department. */
  departmentId?: string;
  /** Academic level record ID (UUID/Cuid), not a numeric level label. */
  academicLevelId?: string;
  dueId: string;
  paymentMethod: "CARD";
  successUrl: string;
  cancelUrl: string;
}

export interface GuestCheckoutResult {
  checkoutUrl: string;
  pendingPaymentId: string;
  guestPayerId?: string;
  accessToken: string;
}

export type GuestPaymentStatus =
  | "PENDING"
  | "PROCESSING"
  | "COMPLETED"
  | "FAILED"
  | "EXPIRED"
  | "CANCELLED";

export interface GuestPaymentStatusResult {
  status: GuestPaymentStatus;
  paymentId?: string;
  receiptId?: string;
  receiptNumber?: string;
  reference?: string;
  amount?: number;
  failureReason?: string;
  message?: string;
}

export interface GuestClaimResult {
  claimedGuestRecords: number;
  claimedPayments: number;
  message?: string;
}

/* ============================================================
 * Session storage for the one-time guest access token.
 * The token is shown only once by the initiate response and is never
 * written to the URL, logs, or analytics.
 * ==========================================================*/

export const GUEST_PAYMENT_STORAGE_PREFIX = "guest-payment:";
export const GUEST_PENDING_PAYMENT_KEY = "heightt.guestPendingPayment";

function safeSessionStorage(): Storage | null {
  if (typeof window === "undefined") return null;
  try {
    return window.sessionStorage;
  } catch {
    return null;
  }
}

export function storeGuestAccessToken(
  pendingPaymentId: string,
  accessToken: string,
): void {
  safeSessionStorage()?.setItem(
    `${GUEST_PAYMENT_STORAGE_PREFIX}${pendingPaymentId}`,
    accessToken,
  );
}

export function getGuestAccessToken(pendingPaymentId: string): string | null {
  return (
    safeSessionStorage()?.getItem(
      `${GUEST_PAYMENT_STORAGE_PREFIX}${pendingPaymentId}`,
    ) ?? null
  );
}

export function storeGuestPendingPaymentId(pendingPaymentId: string): void {
  safeSessionStorage()?.setItem(
    GUEST_PENDING_PAYMENT_KEY,
    JSON.stringify({ pendingPaymentId, startedAt: Date.now() }),
  );
}

export function getGuestPendingPaymentId(): string | null {
  const stored = safeSessionStorage()?.getItem(GUEST_PENDING_PAYMENT_KEY);
  if (!stored) return null;
  try {
    return JSON.parse(stored).pendingPaymentId ?? null;
  } catch {
    return null;
  }
}

/** Clears both the token and the pending-payment marker for a checkout. */
export function clearGuestPaymentStorage(pendingPaymentId: string): void {
  const storage = safeSessionStorage();
  if (!storage) return;
  storage.removeItem(`${GUEST_PAYMENT_STORAGE_PREFIX}${pendingPaymentId}`);
  storage.removeItem(GUEST_PENDING_PAYMENT_KEY);
}

/* ============================================================
 * Response unwrapping helpers
 * ==========================================================*/

function unwrapList<T>(response: AxiosResponse<unknown>): T[] {
  const body = response.data as { data?: unknown; results?: unknown } | unknown[];
  if (Array.isArray(body)) return body as T[];
  const data = (body as { data?: unknown; results?: unknown })?.data
    ?? (body as { results?: unknown })?.results;
  return Array.isArray(data) ? (data as T[]) : [];
}

function unwrapData<T>(response: AxiosResponse<unknown>): T {
  const body = response.data as { data?: T };
  return (body?.data ?? (response.data as T)) as T;
}

/* ============================================================
 * Error handling
 * ==========================================================*/

export function getGuestPaymentError(error: unknown, fallback: string): string {
  const response = (error as {
    response?: {
      status?: number;
      data?: { message?: string | string[]; errors?: string[] };
    };
    message?: string;
  })?.response;
  const body = response?.data;

  if (Array.isArray(body?.errors)) return body.errors.join(" ");
  if (Array.isArray(body?.message)) return body.message.join(" ");
  if (body?.message) return body.message;

  const statusMessages: Record<number, string> = {
    400: "Please check the details you entered and try again.",
    401: "Please sign in to your account and try again.",
    403: "Please verify your email address before claiming guest payments.",
    404: "This payment is no longer available or the due has been deactivated.",
    429: "You are trying again too soon. Please wait a minute and retry.",
  };

  if (response?.status && statusMessages[response.status]) {
    return statusMessages[response.status];
  }

  return (error as { message?: string })?.message || fallback;
}

/* ============================================================
 * Public guest endpoints
 * ==========================================================*/

export async function getGuestInstitutions(): Promise<GuestInstitution[]> {
  const response = await axiosConfig.get("/guest-payments/options/institutions");
  return unwrapList<GuestInstitution>(response);
}

export async function getGuestFaculties(
  institutionId: string,
): Promise<GuestFaculty[]> {
  const response = await axiosConfig.get("/guest-payments/options/faculties", {
    params: { institutionId },
  });
  return unwrapList<GuestFaculty>(response);
}

export async function getGuestDepartments(
  facultyId: string,
): Promise<GuestDepartment[]> {
  const response = await axiosConfig.get("/guest-payments/options/departments", {
    params: { facultyId },
  });
  return unwrapList<GuestDepartment>(response);
}

export async function getGuestAcademicLevels(params: {
  institutionId: string;
  facultyId?: string;
  departmentId?: string;
}): Promise<GuestAcademicLevel[]> {
  const response = await axiosConfig.get("/guest-payments/options/academic-levels", {
    params,
  });
  return unwrapList<GuestAcademicLevel>(response);
}

export async function getGuestDues(params: {
  institutionId: string;
  facultyId?: string;
  departmentId?: string;
  academicLevelId: string;
}): Promise<GuestDue[]> {
  const response = await axiosConfig.get("/guest-payments/options/dues", {
    params: {
      institutionId: params.institutionId,
      ...(params.facultyId ? { facultyId: params.facultyId } : {}),
      ...(params.departmentId ? { departmentId: params.departmentId } : {}),
      academicLevelId: params.academicLevelId,
    },
  });
  return unwrapList<GuestDue>(response);
}

export async function initiateGuestCheckout(
  payload: GuestCheckoutPayload,
): Promise<GuestCheckoutResult> {
  const response = await axiosConfig.post("/guest-payments/initiate", payload);
  return unwrapData<GuestCheckoutResult>(response);
}

/**
 * Reconciles a payment after the provider redirects back.
 * Poll while the status is PENDING or PROCESSING.
 */
export async function getGuestPendingStatus(
  pendingPaymentId: string,
  accessToken: string,
): Promise<GuestPaymentStatusResult> {
  const response = await axiosConfig.post(
    `/guest-payments/pending/${encodeURIComponent(pendingPaymentId)}/status`,
    { accessToken },
    { headers: { "Cache-Control": "no-store" } },
  );
  return unwrapData<GuestPaymentStatusResult>(response);
}

/* ============================================================
 * Authenticated claim endpoints
 * ==========================================================*/

/**
 * Requests the six-digit claim code. Sent to the authenticated account email.
 * The response is intentionally neutral.
 */
export async function requestGuestClaimCode(): Promise<{
  message?: string;
  [key: string]: unknown;
}> {
  const response = await axiosConfig.post("/guest-payments/claim/request");
  return unwrapData<{ message?: string; [key: string]: unknown }>(response);
}

/** Verifies the six-digit code and claims all matching guest records. */
export async function verifyGuestClaimCode(
  code: string,
): Promise<GuestClaimResult> {
  const response = await axiosConfig.post("/guest-payments/claim/verify", {
    code,
  });
  return unwrapData<GuestClaimResult>(response);
}
