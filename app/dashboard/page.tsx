"use client";

import { useEffect, useState } from "react";
import { useUser } from "@clerk/nextjs";
import { RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import StatsCards from "./components/StatsCards";
import EventsOverTimeChart from "./components/EventsOverTimeChart";
import EventTypeChart from "./components/EventTypeChart";
import TopPagesChart from "./components/TopPagesChart";
import DeviceChart from "./components/DeviceChart";
import TopCountriesChart from "./components/TopCountriesChart";
import RetentionIndicator from "./components/RetentionIndicator";
import RecentEventsTable from "./components/RecentEventsTable";

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

export default function DashboardPage() {
  const { user, isLoaded } = useUser();
  const [isAdmin, setIsAdmin] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [stats, setStats] = useState<AnalyticsStats | null>(null);
  const [recentEvents, setRecentEvents] = useState<AnalyticsEvent[]>([]);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    const checkAdmin = async () => {
      if (!isLoaded) return;

      if (!user) {
        setIsLoading(false);
        return;
      }

      try {
        const response = await fetch("/api/auth/check-admin");
        const data = await response.json();
        setIsAdmin(data.isAdmin);
      } catch (error) {
        console.error("Error checking admin status:", error);
        setIsAdmin(false);
      } finally {
        setIsLoading(false);
      }
    };

    checkAdmin();
  }, [user, isLoaded]);

  const fetchAnalytics = async () => {
    try {
      setRefreshing(true);
      const [statsRes, eventsRes] = await Promise.all([
        fetch("/api/analytics/stats"),
        fetch("/api/analytics/events?limit=10"),
      ]);

      if (statsRes.ok) {
        const statsData = await statsRes.json();
        setStats(statsData.stats);
      }

      if (eventsRes.ok) {
        const eventsData = await eventsRes.json();
        setRecentEvents(eventsData.events);
      }
    } catch (error) {
      console.error("Error fetching analytics:", error);
    } finally {
      setRefreshing(false);
    }
  };

  useEffect(() => {
    if (isAdmin) {
      fetchAnalytics();
    }
  }, [isAdmin]);

  if (!isLoaded || isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-gray-300 border-t-blue-600"></div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold">Authentication Required</h1>
          <p className="mt-2 text-gray-600">
            Please sign in to access this page.
          </p>
        </div>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold">Access Denied</h1>
          <p className="mt-2 text-gray-600">
            You don't have permission to view this page.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Analytics Dashboard</h1>
          <p className="mt-2 text-gray-600">
            Real-time insights into your blog's performance
          </p>
        </div>
        <Button
          onClick={fetchAnalytics}
          disabled={refreshing}
          variant="outline"
          className="gap-2"
        >
          <RefreshCw
            className={`h-4 w-4 ${refreshing ? "animate-spin" : ""}`}
          />
          Refresh
        </Button>
      </div>

      {stats && (
        <>
          {/* Retention Indicator */}
          <RetentionIndicator retentionData={stats.retentionData} />

          {/* Stats Cards */}
          <StatsCards
            totalEvents={stats.totalEvents}
            uniqueSessions={stats.uniqueSessions}
            uniqueVisitors={stats.uniqueVisitors}
          />

          {/* Charts Grid */}
          <div className="mt-8 grid gap-6 lg:grid-cols-2">
            <EventsOverTimeChart dailyEvents={stats.dailyEvents} />
            <EventTypeChart
              eventTypeDistribution={stats.eventTypeDistribution}
            />
            <TopPagesChart topPages={stats.topPages} />
            <DeviceChart deviceBreakdown={stats.deviceBreakdown} />
            <TopCountriesChart topCountries={stats.topCountries} />
          </div>

          {/* Recent Events Table */}
          <div className="mt-8">
            <RecentEventsTable events={recentEvents} />
          </div>
        </>
      )}
    </div>
  );
}
