import { axiosConfig } from "@/utils/axios-config";

export interface Institution {
  id: string;
  name: string;
  shortName: string;
  code: string;
  logo?: string;
  website?: string;
  email?: string;
  phone?: string;
  address?: string;
  city?: string;
  state?: string;
  country?: string;
  status: string;
}

export interface Faculty {
  id: string;
  name: string;
  code: string;
  institutionId: string;
  status: string;
}

export interface Department {
  id: string;
  name: string;
  code: string;
  facultyId: string;
  status: string;
  academicLevels?: AcademicLevel[];
}

export interface AcademicLevel {
  id: string;
  name: string;
  numericLevel: number;
  order: number;
  departmentId: string;
}

export interface Organization {
  id: string;
  name: string;
  slug: string;
  description?: string;
  type: string;
  scope: string;
  status: string;
  institutionId: string;
}

export const institutionsApi = {
  // Get all institutions
  getInstitutions: async (params?: {
    page?: number;
    limit?: number;
    status?: string;
    search?: string;
  }) => {
    const response = await axiosConfig.get("/institutions", { params });
    return response.data;
  },

  // Get institution by ID
  getInstitution: async (id: string) => {
    const response = await axiosConfig.get(`/institutions/${id}`);
    return response.data;
  },

  // Get faculties by institution
  getFacultiesByInstitution: async (institutionId: string) => {
    const response = await axiosConfig.get(
      `/institutions/${institutionId}/faculties`,
    );
    return response.data;
  },

  // Get departments by faculty
  getDepartmentsByFaculty: async (facultyId: string) => {
    const response = await axiosConfig.get(
      `/institutions/faculties/${facultyId}/departments`,
    );
    return response.data;
  },

  getAcademicLevelsByDepartment: async (departmentId: string) => {
    const response = await axiosConfig.get(
      `/institutions/departments/${departmentId}/academic-levels`,
    );
    return response.data;
  },

  createDepartment: async (payload: {
    name: string;
    code: string;
    facultyId: string;
    promotionType?: "AUTOMATIC" | "MANUAL";
    numberOfLevels: 4 | 5 | 6 | 7;
    customLevelNames?: string[];
  }) => {
    const response = await axiosConfig.post(
      "/institutions/departments",
      payload,
    );
    return response.data;
  },
};

export const organizationsApi = {
  // Get organizations with filters
  getOrganizations: async (params?: {
    page?: number;
    limit?: number;
    institutionId?: string;
    status?: string;
    type?: string;
    scope?: string;
    search?: string;
  }) => {
    const response = await axiosConfig.get("/organizations", { params });
    return response.data;
  },

  // Get organization by ID
  getOrganization: async (id: string) => {
    const response = await axiosConfig.get(`/organizations/${id}`);
    return response.data;
  },

  // Request to join organization
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
};
