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
  amount: number;
  organizationId: string;
  paymentMethod: "CARD" | "BANK_TRANSFER" | "USSD" | "QR_CODE" | "WALLET";
  dueAssignmentId?: string;
  dueId?: string;
  description?: string;
  successUrl: string;
  cancelUrl: string;
}

export interface PaymentResponse {
  checkoutUrl?: string;
  url?: string;
  paymentUrl?: string;
  [key: string]: unknown;
}

export interface IdempotencyKeyResponse {
  idempotencyKey: string;
  expiresIn?: number;
  message?: string;
}

export const financeApi = {
  // Get dues for the authenticated user
  getMyDues: async (): Promise<DueAssignment[]> => {
    try {
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
  ): Promise<PaymentResponse> => {
    const response = await axiosConfig.post("/finance/payments", data, {
      headers: { "Idempotency-Key": idempotencyKey },
    });
    return response.data;
  },
};
