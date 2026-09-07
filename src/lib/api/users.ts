// src/lib/api/users.ts

import { axiosConfig } from "@/utils/axios-config";

export interface UserProfile {
  firstName: string;
  lastName: string;
  middleName?: string | null;
  avatar?: string | null;
  gender?: "MALE" | "FEMALE" | "OTHER" | "PREFER_NOT_TO_SAY" | null;
  country?: string | null;
  onboardingStep: "PERSONAL_INFO" | "INSTITUTION" | "COMPLETED";
  onboardingCompleted: boolean;
  onboardingCompletedAt?: string | null;
  verificationStatus: string;
  verifiedAt?: string | null;
}

export interface StudentProfile {
  institutionId: string;
  facultyId: string;
  departmentId: string;
  currentAcademicLevelId?: string;
  currentAcademicLevel?: { id: string; name: string } | null;
  matricNumber?: string;
  academicStatus: string;
  onboardingCompleted: boolean;
  verificationStatus: string;
}

export interface User {
  id: string;
  email: string;
  username: string;
  emailVerified: boolean;
  status: string;
  lastLoginAt?: string;
  createdAt: string;
  updatedAt: string;
  profile: UserProfile;
  studentProfile?: StudentProfile;
}

export interface OrganizationMembership {
  id: string;
  organizationId: string;
  userId: string;
  membershipType: string;
  status: string;
  isPrimary: boolean;
  joinedAt: string;
  leftAt?: string;
  organization: {
    id: string;
    name: string;
    slug: string;
    description?: string;
    type: string;
    scope: string;
    status: string;
  };
}

export interface UpdateProfilePayload {
  username?: string;
  email?: string;
  firstName?: string;
  lastName?: string;
  avatar?: string;
  gender?: "MALE" | "FEMALE" | "OTHER" | "PREFER_NOT_TO_SAY";
  country?: string;
}

export const USERNAME_PATTERN = /^[a-zA-Z0-9_]{3,30}$/;

export interface UsernameAvailability {
  available: boolean;
  username?: string;
  message: string;
  suggestions: string[];
}

export function normalizeUsername(username: string): string {
  return username.trim().toLowerCase();
}

export const usersApi = {
  checkUsername: async (
    rawUsername: string,
    signal?: AbortSignal,
  ): Promise<UsernameAvailability> => {
    const username = normalizeUsername(rawUsername);
    const query = new URLSearchParams({ username });
    const response = await axiosConfig.get<UsernameAvailability>(
      `/users/check-username?${query.toString()}`,
      { signal },
    );
    return {
      ...response.data,
      suggestions: response.data.suggestions ?? [],
    };
  },

  // Get current user profile
  getCurrentUser: async (): Promise<User> => {
    try {
      const response = await axiosConfig.get("/auth/me");
      console.log("getCurrentUser response:", response.data);
      return response.data;
    } catch (error) {
      console.error("Error in getCurrentUser:", error);
      throw error;
    }
  },

  // Get user organizations
  getUserOrganizations: async (): Promise<OrganizationMembership[]> => {
    const response = await axiosConfig.get("/users/me/organizations");
    return response.data || [];
  },

  updateProfile: async (data: UpdateProfilePayload): Promise<User> => {
    const response = await axiosConfig.patch("/users/profile", data);
    return response.data;
  },
};
