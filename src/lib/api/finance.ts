// src/lib/api/finance.ts

import { axiosConfig } from "@/utils/axios-config";

export interface DueItem {
  id: string;
  name: string;
  description?: string;
  amount: number;
  dueDate: string;
  status: "ACTIVE" | "INACTIVE" | "COMPLETED" | "CANCELLED";
  organizationId: string;
  organization?: {
    id: string;
    name: string;
    slug: string;
  };
  sessionId?: string;
  lateFee?: number;
  isRequired?: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface DueAssignment {
  id: string;
  dueId: string;
  studentId: string;
  amount: number;
  isPaid: boolean;
  paidAt?: string;
  createdAt: string;
  updatedAt: string;
  due: DueItem;
  isAutoAssigned: boolean; // Add this property
}

export interface Transaction {
  id: string;
  walletId: string;
  type: "CREDIT" | "DEBIT" | "TRANSFER" | "FEE" | "REFUND" | "REVERSAL";
  amount: number;
  fee: number;
  netAmount: number;
  status: "PENDING" | "PROCESSING" | "COMPLETED" | "FAILED" | "CANCELLED";
  reference: string;
  description?: string;
  metadata?: any;
  completedAt?: string;
  failedAt?: string;
  failureReason?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Receipt {
  id: string;
  receiptNumber: string;
  reference: string;
  amount: number;
  serviceFee: number;
  totalAmount: number;
  currency: string;
  payerName: string;
  payerEmail: string;
  payerPhone?: string;
  paymentMethod: "CARD" | "BANK_TRANSFER" | "USSD" | "QR_CODE" | "WALLET";
  paymentDate: string;
  description?: string;
  organizationName?: string;
  organizationSlug?: string;
  status: "ISSUED" | "VOIDED" | "CANCELLED";
  downloadCount: number;
  lastDownloaded?: string;
  viewedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface PaymentRequest {
  /** Payment amount in Kobo. */
  amount: number;
  organizationId: string;
  paymentMethod: "CARD" | "BANK_TRANSFER" | "USSD" | "QR_CODE" | "WALLET";
  dueAssignmentId?: string;
  dueId?: string;
  description?: string;
  successUrl: string;
  cancelUrl: string;
}

export interface InitiatePaymentResponse {
  success: true;
  message: string;
  data: {
    checkoutId: string;
    checkoutUrl: string;
    pendingPaymentId: string;
    baseAmount: number;
    platformFee: number;
    totalBeforeGatewayFee: number;
  };
}

export interface PaymentConflict {
  statusCode: 409;
  code: "PAYMENT_ALREADY_IN_PROGRESS" | "PAYMENT_STATUS_UNAVAILABLE";
  message: string;
  pendingPaymentId?: string;
  checkoutId?: string;
  statusUrl?: string;
}

export function normalisePaymentConflict(error: unknown): PaymentConflict | null {
  const response = (error as { response?: { status?: number; data?: unknown } })?.response;
  if (response?.status !== 409 || !response.data || typeof response.data !== "object") return null;

  const outer = response.data as Record<string, unknown>;
  const nested = outer.message && typeof outer.message === "object"
    ? outer.message as Record<string, unknown>
    : {};
  const data = outer.data && typeof outer.data === "object"
    ? outer.data as Record<string, unknown>
    : {};
  const payload = { ...outer, ...data, ...nested };
  const code = payload.code;
  if (code !== "PAYMENT_ALREADY_IN_PROGRESS" && code !== "PAYMENT_STATUS_UNAVAILABLE") return null;

  return {
    statusCode: 409,
    code,
    message: typeof payload.message === "string" ? payload.message : "A payment attempt is already in progress.",
    pendingPaymentId: typeof payload.pendingPaymentId === "string" ? payload.pendingPaymentId : undefined,
    checkoutId: typeof payload.checkoutId === "string" ? payload.checkoutId : undefined,
    statusUrl: typeof payload.statusUrl === "string" ? payload.statusUrl : undefined,
  };
}

export type PaymentStatus =
  | "PENDING"
  | "PROCESSING"
  | "COMPLETED"
  | "FAILED"
  | "CANCELLED"
  | "EXPIRED";

export interface PaymentStatusResult {
  id: string;
  status: PaymentStatus;
  amount: number;
  reference: string;
  checkoutId: string | null;
  paymentId: string | null;
  receiptId: string | null;
  receiptNumber: string | null;
  retryable: boolean;
  nextAction:
    | "SHOW_SUCCESS"
    | "RETRY_PAYMENT"
    | "RETRY_CHECKOUT_CREATION"
    | "WAIT_FOR_CONFIRMATION";
  failureReason: string | null;
  completedAt: string | null;
  createdAt: string;
}

export interface PaymentHistoryRecord {
  id: string;
  status: PaymentStatus | "PENDING";
  amount: number;
  reference?: string;
  paymentMethod?: string;
  createdAt: string;
  completedAt?: string | null;
  transaction?: Transaction | null;
  organization?: DueItem["organization"] | null;
  payer?: {
    id: string;
    email?: string;
    username?: string;
    firstName?: string;
    lastName?: string;
  } | null;
  duePayment?: {
    assignment?: {
      id?: string;
      due?: DueItem | null;
    } | null;
  } | null;
  receipt?: Receipt | null;
}

export interface PaymentHistoryParams {
  page?: number;
  limit?: number;
  status?: string;
  organizationId?: string;
}

export interface IdempotencyKeyResponse {
  idempotencyKey: string;
  expiresIn?: number;
  message?: string;
}

export const financeApi = {
  // Get dues for the authenticated user - updated to use the correct endpoint
  getMyDues: async (): Promise<DueAssignment[]> => {
    try {
      // Use the correct endpoint that fetches all dues across all organizations
      const response = await axiosConfig.get("/finance/dues/student");
      return response.data || [];
    } catch (error) {
      console.error("Failed to fetch dues:", error);
      return [];
    }
  },

  // Get all dues with filters
  getDues: async (params?: {
    organizationId?: string;
    page?: number;
    limit?: number;
  }): Promise<PaginatedResponse<DueItem>> => {
    try {
      const response = await axiosConfig.get("/finance/dues", { params });
      return (
        response.data || {
          data: [],
          meta: { page: 1, limit: 10, total: 0, totalPages: 0 },
        }
      );
    } catch (error) {
      console.error("Failed to fetch dues:", error);
      return {
        data: [],
        meta: { page: 1, limit: 10, total: 0, totalPages: 0 },
      };
    }
  },

  // Get transaction history
  getTransactions: async (params?: {
    page?: number;
    limit?: number;
    type?: string;
    status?: string;
    startDate?: string;
    endDate?: string;
  }): Promise<PaginatedResponse<Transaction>> => {
    try {
      const response = await axiosConfig.get("/finance/transactions", {
        params,
      });
      return (
        response.data || {
          data: [],
          meta: { page: 1, limit: 10, total: 0, totalPages: 0 },
        }
      );
    } catch (error) {
      console.error("Failed to fetch transactions:", error);
      return {
        data: [],
        meta: { page: 1, limit: 10, total: 0, totalPages: 0 },
      };
    }
  },

  getPaymentHistory: async (
    params?: PaymentHistoryParams,
  ): Promise<PaginatedResponse<PaymentHistoryRecord>> => {
    const response = await axiosConfig.get("/finance/payments/history", {
      params,
    });
    const payload = response.data?.data ?? response.data;

    if (Array.isArray(payload)) {
      return {
        data: payload,
        meta: response.data?.meta ?? {
          page: params?.page ?? 1,
          limit: params?.limit ?? payload.length,
          total: payload.length,
          totalPages: 1,
        },
      };
    }

    return {
      data: payload?.data ?? [],
      meta: payload?.meta ?? response.data?.meta ?? {
        page: params?.page ?? 1,
        limit: params?.limit ?? 10,
        total: 0,
        totalPages: 0,
      },
    };
  },

  // Get user receipts
  getReceipts: async (params?: {
    page?: number;
    limit?: number;
    startDate?: string;
    endDate?: string;
    organizationId?: string;
  }): Promise<PaginatedResponse<Receipt>> => {
    try {
      const response = await axiosConfig.get("/finance/receipts", {
        params,
      });
      return (
        response.data || {
          data: [],
          meta: { page: 1, limit: 10, total: 0, totalPages: 0 },
        }
      );
    } catch (error) {
      console.error("Failed to fetch receipts:", error);
      return {
        data: [],
        meta: { page: 1, limit: 10, total: 0, totalPages: 0 },
      };
    }
  },

  // Get a specific receipt
  getReceipt: async (id: string): Promise<Receipt | null> => {
    try {
      const response = await axiosConfig.get(`/finance/receipts/${id}`);
      return response.data;
    } catch (error) {
      console.error("Failed to fetch receipt:", error);
      return null;
    }
  },

  // Download receipt PDF
  downloadReceipt: async (id: string): Promise<Blob | null> => {
    try {
      const response = await axiosConfig.get(
        `/finance/receipts/${id}/download`,
        {
          responseType: "blob",
        },
      );
      return response.data;
    } catch (error) {
      console.error("Failed to download receipt:", error);
      return null;
    }
  },

  generateIdempotencyKey: async (): Promise<IdempotencyKeyResponse> => {
    const response = await axiosConfig.post("/finance/idempotency-key");
    return response.data;
  },

  makePayment: async (
    data: PaymentRequest,
    idempotencyKey: string,
  ): Promise<InitiatePaymentResponse> => {
    // Due assignment amounts already come from the API in Kobo, which is
    // also the unit expected by the payment endpoint.
    const response = await axiosConfig.post("/finance/payments", data, {
      headers: { "Idempotency-Key": idempotencyKey },
    });
    return response.data;
  },

  getPendingPaymentStatus: async (
    pendingPaymentId: string,
  ): Promise<PaymentStatusResult> => {
    const response = await axiosConfig.get(
      `/finance/payments/pending/${encodeURIComponent(pendingPaymentId)}/status`,
      { headers: { "Cache-Control": "no-store" } },
    );
    return response.data?.data || response.data;
  },
};
