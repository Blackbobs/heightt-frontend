// src/lib/api/keys.ts

export const queryKeys = {
  user: {
    current: ["user", "current"],
    profile: (userId?: string) => ["user", "profile", userId],
    organizations: (userId?: string) => ["user", "organizations", userId],
  },
  finance: {
    dues: ["finance", "dues"],
    myDues: ["finance", "dues", "my"],
    transactions: (params?: any) => ["finance", "transactions", params],
    paymentHistory: (params?: any) => ["finance", "payments", "history", params],
    receipts: (params?: any) => ["finance", "receipts", params],
    receipt: (id: string) => ["finance", "receipts", id],
  },
  institutions: {
    all: (params?: any) => ["institutions", params],
    one: (id: string) => ["institutions", id],
    faculties: (institutionId: string) => [
      "institutions",
      institutionId,
      "faculties",
    ],
    departments: (facultyId: string) => [
      "institutions",
      "faculties",
      facultyId,
      "departments",
    ],
  },
  organizations: {
    all: (params?: any) => ["organizations", params],
    one: (id: string) => ["organizations", id],
    members: (id: string) => ["organizations", id, "members"],
  },
  onboarding: {
    status: (userId: string) => ["onboarding", "status", userId],
  },
  dashboard: {
    all: ["dashboard", "all"],
  },
};
