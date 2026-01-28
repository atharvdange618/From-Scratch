"use client";

import { useUser } from "@clerk/nextjs";
import { RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAdminCheckQuery } from "@/lib/hooks/use-admin";
import { useAnalyticsStatsQuery } from "@/lib/hooks/use-analytics";
import StatsCards from "./components/StatsCards";
import EventsOverTimeChart from "./components/EventsOverTimeChart";
import EventTypeChart from "./components/EventTypeChart";
import TopPagesChart from "./components/TopPagesChart";
import DeviceChart from "./components/DeviceChart";
import CountriesChart from "./components/CountriesChart";
import CitiesChart from "./components/CitiesChart";
import ScrollInsights from "./components/ScrollInsights";
import RetentionIndicator from "./components/RetentionIndicator";
import OperatingSystemChart from "./components/OperatingSystemChart";

export default function DashboardPage() {
  const { user, isLoaded } = useUser();

  const { data: isAdmin, isLoading: isCheckingAdmin } = useAdminCheckQuery();

  const {
    data: stats,
    isLoading: isLoadingStats,
    refetch: refetchStats,
    isRefetching,
  } = useAnalyticsStatsQuery();

  if (!isLoaded || isCheckingAdmin) {
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
    <div className="container mx-auto px-4 py-8 min-h-svh">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Analytics Dashboard</h1>
          <p className="mt-2 text-gray-600">
            Real-time insights into your blog's performance
          </p>
        </div>
        <Button
          onClick={() => refetchStats()}
          disabled={isRefetching || isLoadingStats}
          variant="outline"
          className="gap-2"
        >
          <RefreshCw
            className={`h-4 w-4 ${isRefetching ? "animate-spin" : ""}`}
          />
          Refresh
        </Button>
      </div>

      {stats && (
        <>
          <RetentionIndicator retentionData={stats.retentionData} />

          <StatsCards
            totalEvents={stats.totalEvents}
            uniqueSessions={stats.uniqueSessions}
            uniqueVisitors={stats.uniqueVisitors}
            avgSessionDuration={stats.avgSessionDuration}
          />

          <ScrollInsights scrollInsights={stats.scrollInsights} />

          <div className="mt-8 grid gap-6 lg:grid-cols-2">
            <EventsOverTimeChart
              dailyEvents={stats.dailyEvents}
              dailyUniqueVisitors={stats.dailyUniqueVisitors}
            />
            <EventTypeChart
              eventTypeDistribution={stats.eventTypeDistribution}
            />
            <TopPagesChart topPages={stats.topPages} />
            <DeviceChart deviceBreakdown={stats.deviceBreakdown} />
            <OperatingSystemChart osBreakdown={stats.osBreakdown} />
            <CountriesChart countries={stats.topCountries} />
            <CitiesChart cities={stats.topCities} />
          </div>
        </>
      )}
    </div>
  );
}
