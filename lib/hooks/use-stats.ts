import { useQuery } from "@tanstack/react-query";

// Query Keys
export const statsKeys = {
  all: ["stats"] as const,
};

// Types
interface StatsData {
  posts: number;
  projects: number;
  categories: number;
}

/**
 * Fetch all stats
 */
export function useStatsQuery() {
  return useQuery<StatsData>({
    queryKey: statsKeys.all,
    queryFn: async () => {
      const response = await fetch("/api/stats");
      if (!response.ok) {
        throw new Error("Failed to fetch stats");
      }
      const data = await response.json();
      return data;
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}
