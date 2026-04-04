import { useQuery } from "@tanstack/react-query";

export const analyticsKeys = {
  all: ["analytics"] as const,
  stats: () => [...analyticsKeys.all, "stats"] as const,
  events: () => [...analyticsKeys.all, "events"] as const,
};

interface AnalyticsStats {
  totalEvents: number;
  uniqueSessions: number;
  uniqueVisitors: number;
  totalPageViews: number;
  avgSessionDuration: number;
  eventTypeDistribution: Array<{ _id: string; count: number }>;
  topPages: Array<{ _id: string; count: number }>;
  topCountries: Array<{ _id: string; count: number }>;
  topCities: Array<{ _id: string; count: number }>;
  deviceBreakdown: Array<{ _id: string; count: number }>;
  browserBreakdown: Array<{ _id: string; count: number }>;
  osBreakdown: Array<{ _id: string; count: number }>;
  dailyEvents: Array<{ _id: string; count: number }>;
  dailyUniqueVisitors: Array<{ _id: string; uniqueVisitors: number }>;
  scrollInsights: {
    averageDepth: number;
    engagementRate: number;
    completionRate: number;
    deepReadRate: number;
  };
  retentionData: {
    oldestEvent: string | null;
    newestEvent: string | null;
    totalDays: number;
    daysUntilDeletion: number;
  };
}

/**
 * Fetch analytics stats for dashboard
 */
export function useAnalyticsStatsQuery() {
  return useQuery({
    queryKey: analyticsKeys.stats(),
    queryFn: async (): Promise<AnalyticsStats> => {
      const response = await fetch("/api/analytics/stats");
      if (!response.ok) {
        throw new Error("Failed to fetch analytics stats");
      }
      const data = await response.json();
      return data.stats;
    },
    staleTime: 1000 * 60 * 10,
    refetchInterval: 1000 * 60 * 5,
  });
}
