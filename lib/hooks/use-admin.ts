import { useQuery } from "@tanstack/react-query";
import { useUser } from "@clerk/nextjs";

// Query Keys
const adminKeys = {
  all: ["admin"] as const,
  check: () => [...adminKeys.all, "check"] as const,
};

/**
 * Check if current user is an admin
 * Caches the result for the entire session
 */
export function useAdminCheckQuery() {
  const { user, isLoaded } = useUser();

  return useQuery({
    queryKey: adminKeys.check(),
    queryFn: async (): Promise<boolean> => {
      const response = await fetch("/api/auth/check-admin");
      if (!response.ok) {
        return false;
      }
      const data = await response.json();
      return data.isAdmin || false;
    },
    enabled: isLoaded && !!user,
    staleTime: Infinity,
    gcTime: Infinity,
  });
}
