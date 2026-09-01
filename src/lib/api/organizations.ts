// src/lib/api/organizations.ts

import { axiosConfig } from "@/utils/axios-config";

export interface Organization {
  id: string;
  name: string;
  slug: string;
  description?: string;
  type: string;
  scope?: string;
  status: string;
  institutionId: string;
  facultyId?: string;
  departmentId?: string;
  academicLevelId?: string;
  academicSessionId?: string; // NEW
}

export interface OrganizationMembership {
  id: string;
  organizationId: string;
  userId: string;
  membershipType: string;
  status: string;
  joinedAt: string;
  organization?: Organization;
  sessionId?: string; // NEW
}

export const organizationsApi = {
  getOrganizations: async (params: {
    institutionId?: string;
    departmentId?: string;
    facultyId?: string;
    status?: string;
    type?: string;
    search?: string;
    limit?: number;
    page?: number;
    academicSessionId?: string; // NEW
  }) => {
    const response = await axiosConfig.get("/organizations", { params });
    return response.data;
  },

  getOrganization: async (id: string) => {
    const response = await axiosConfig.get(`/organizations/${id}`);
    return response.data;
  },

  requestJoin: async (
    organizationId: string,
    membershipType: string = "STUDENT",
  ) => {
    const response = await axiosConfig.post(
      `/organizations/${organizationId}/members`,
      {
        membershipType,
        status: "PENDING",
      },
    );
    return response.data;
  },

  joinOrganization: async (
    organizationId: string,
    membershipType: string = "STUDENT",
    sessionId?: string, // NEW
  ) => {
    try {
      console.log(`Joining organization: ${organizationId}`);
      const response = await axiosConfig.post(
        `/organizations/${organizationId}/join`,
        {
          membershipType,
          sessionId, // NEW
        },
      );
      console.log("Join response:", response.data);
      return response.data;
    } catch (error) {
      console.error("Failed to join organization:", error);
      throw error;
    }
  },

  getUserOrganizations: async () => {
    console.log("Fetching user organizations...");
    const response = await axiosConfig.get("/users/me/organizations");
    console.log("User organizations response:", response.data);
    return response.data || [];
  },
};
