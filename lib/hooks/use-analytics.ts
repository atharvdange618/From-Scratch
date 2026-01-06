import { useQuery } from "@tanstack/react-query";

// Query Keys
export const analyticsKeys = {
  all: ["analytics"] as const,
  stats: () => [...analyticsKeys.all, "stats"] as const,
  events: () => [...analyticsKeys.all, "events"] as const,
};

// Types
interface AnalyticsStats {
  totalEvents: number;
  uniqueSessions: number;
  uniqueVisitors: number;
  eventTypeDistribution: Array<{ _id: string; count: number }>;
  topPages: Array<{ _id: string; count: number }>;
  topCountries: Array<{ _id: string; count: number }>;
  deviceBreakdown: Array<{ _id: string; count: number }>;
  browserBreakdown: Array<{ _id: string; count: number }>;
  osBreakdown: Array<{ _id: string; count: number }>;
  dailyEvents: Array<{ _id: string; count: number }>;
  retentionData: {
    oldestEvent: string | null;
    newestEvent: string | null;
    totalDays: number;
    daysUntilDeletion: number;
  };
}

interface AnalyticsEvent {
  _id: string;
  eventType: string;
  eventData: Record<string, any>;
  sessionId: string;
  timestamp: string;
  ipAddress: string;
  country: string;
  city: string;
  device: string;
  browser: string;
  os: string;
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
    staleTime: 1000 * 60 * 10, // 10 minutes - stats don't need to be super fresh
    refetchInterval: 1000 * 60 * 5, // Refetch every 5 minutes in background
  });
}

/**
 * Fetch recent analytics events
 */
export function useAnalyticsEventsQuery(limit: number = 50) {
  return useQuery({
    queryKey: [...analyticsKeys.events(), limit],
    queryFn: async (): Promise<AnalyticsEvent[]> => {
      const response = await fetch(`/api/analytics/events?limit=${limit}`);
      if (!response.ok) {
        throw new Error("Failed to fetch analytics events");
      }
      const data = await response.json();
      return data.events || [];
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
    refetchInterval: 1000 * 30, // Refetch every 30 seconds for live updates
  });
}
