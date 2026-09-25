import { useQuery } from "@tanstack/react-query";
import {
  Department,
  Faculty,
  Institution,
  institutionsApi,
} from "@/lib/api/institutions";
import { queryKeys } from "@/lib/api/keys";

function asList<T>(value: unknown): T[] {
  if (Array.isArray(value)) return value as T[];
  if (value && typeof value === "object") {
    const data = (value as { data?: unknown }).data;
    if (Array.isArray(data)) return data as T[];
  }
  return [];
}

export function useOrganizationRequestData(
  institutionId: string,
  facultyId: string,
) {
  const institutionsQuery = useQuery({
    queryKey: queryKeys.institutions.all({ status: "ACTIVE", limit: 100 }),
    queryFn: () =>
      institutionsApi.getInstitutions({ status: "ACTIVE", limit: 100 }),
    staleTime: 10 * 60 * 1000,
  });

  const facultiesQuery = useQuery({
    queryKey: queryKeys.institutions.faculties(institutionId),
    queryFn: () => institutionsApi.getFacultiesByInstitution(institutionId),
    enabled: Boolean(institutionId),
    staleTime: 10 * 60 * 1000,
  });

  const departmentsQuery = useQuery({
    queryKey: queryKeys.institutions.departments(facultyId),
    queryFn: () => institutionsApi.getDepartmentsByFaculty(facultyId),
    enabled: Boolean(facultyId),
    staleTime: 10 * 60 * 1000,
  });

  return {
    institutions: asList<Institution>(institutionsQuery.data),
    faculties: asList<Faculty>(facultiesQuery.data),
    departments: asList<Department>(departmentsQuery.data),
    institutionsQuery,
    facultiesQuery,
    departmentsQuery,
  };
}
