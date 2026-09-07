import { useQuery } from "@tanstack/react-query";
import { useDebouncedValue } from "@/hooks/useDebouncedValue";
import {
  normalizeUsername,
  USERNAME_PATTERN,
  usersApi,
} from "@/lib/api/users";

export function useUsernameAvailability(
  username: string,
  options?: { enabled?: boolean },
) {
  const normalized = normalizeUsername(username);
  const debouncedUsername = useDebouncedValue(normalized, 450);
  const isValid = USERNAME_PATTERN.test(normalized);
  const isDebouncing = isValid && debouncedUsername !== normalized;

  const query = useQuery({
    queryKey: ["username-availability", debouncedUsername],
    queryFn: ({ signal }) =>
      usersApi.checkUsername(debouncedUsername, signal),
    enabled:
      (options?.enabled ?? true) &&
      USERNAME_PATTERN.test(debouncedUsername) &&
      !isDebouncing,
    staleTime: 0,
    retry: 1,
  });

  return {
    ...query,
    normalized,
    isValid,
    isChecking: isDebouncing || query.isFetching,
  };
}
