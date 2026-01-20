import { NextRequest, NextResponse } from "next/server";
import { checkAdminAccess } from "@/lib/auth";
import connectDB from "@/lib/mongodb";
import AnalyticsEvent from "@/lib/models/AnalyticsEvent";

let statsCache: {
  data: any;
  timestamp: number;
  params: string;
} | null = null;

const CACHE_TTL = 5 * 60 * 1000;

/**
 * GET /api/analytics/stats
 * Get aggregated analytics statistics (admin only)
 */
export async function GET(request: NextRequest) {
  try {
    const adminCheck = await checkAdminAccess();
    if (!adminCheck.authorized) {
      return adminCheck.response;
    }

    await connectDB();

    const { searchParams } = new URL(request.url);
    const startDate = searchParams.get("startDate");
    const endDate = searchParams.get("endDate");
    const cacheKey = `${startDate || ""}-${endDate || ""}`;

    if (
      statsCache &&
      statsCache.params === cacheKey &&
      Date.now() - statsCache.timestamp < CACHE_TTL
    ) {
      return NextResponse.json({
        success: true,
        stats: statsCache.data,
        cached: true,
      });
    }

    const dateFilter: any = {};
    if (startDate || endDate) {
      dateFilter.timestamp = {};
      if (startDate) {
        dateFilter.timestamp.$gte = new Date(startDate);
      }
      if (endDate) {
        dateFilter.timestamp.$lte = new Date(endDate);
      }
    }

    const [
      totalEvents,
      uniqueSessions,
      uniqueVisitors,
      eventTypeDistribution,
      topPages,
      topCountries,
      topCities,
      deviceBreakdown,
      browserBreakdown,
      osBreakdown,
      dailyEvents,
      oldestEvent,
    ] = await Promise.all([
      AnalyticsEvent.countDocuments(dateFilter),

      AnalyticsEvent.distinct("sessionId", dateFilter).then(
        (sessions) => sessions.length,
      ),

      AnalyticsEvent.distinct("ipAddress", {
        ...dateFilter,
        ipAddress: { $exists: true, $ne: null },
      }).then((ips) => ips.length),

      AnalyticsEvent.aggregate([
        { $match: dateFilter },
        {
          $group: {
            _id: "$eventType",
            count: { $sum: 1 },
          },
        },
        { $sort: { count: -1 } },
      ]),

      AnalyticsEvent.aggregate([
        {
          $match: {
            ...dateFilter,
            "eventData.path": { $exists: true, $nin: [null, ""] },
          },
        },
        {
          $group: {
            _id: "$eventData.path",
            count: { $sum: 1 },
          },
        },
        { $sort: { count: -1 } },
        { $limit: 10 },
        {
          $project: {
            _id: 1,
            count: 1,
          },
        },
      ]),

      AnalyticsEvent.aggregate([
        {
          $match: {
            ...dateFilter,
            country: { $exists: true, $ne: null },
          },
        },
        {
          $group: {
            _id: "$country",
            count: { $sum: 1 },
          },
        },
        { $sort: { count: -1 } },
        { $limit: 5 },
      ]),

      AnalyticsEvent.aggregate([
        {
          $match: {
            ...dateFilter,
            city: { $exists: true, $ne: null },
          },
        },
        {
          $group: {
            _id: "$city",
            count: { $sum: 1 },
          },
        },
        { $sort: { count: -1 } },
        { $limit: 10 },
      ]),

      AnalyticsEvent.aggregate([
        {
          $match: {
            ...dateFilter,
            device: { $exists: true, $ne: null },
          },
        },
        {
          $group: {
            _id: "$device",
            count: { $sum: 1 },
          },
        },
        { $sort: { count: -1 } },
      ]),

      AnalyticsEvent.aggregate([
        {
          $match: {
            ...dateFilter,
            browser: { $exists: true, $ne: null },
          },
        },
        {
          $group: {
            _id: "$browser",
            count: { $sum: 1 },
          },
        },
        { $sort: { count: -1 } },
      ]),

      AnalyticsEvent.aggregate([
        {
          $match: {
            ...dateFilter,
            os: { $exists: true, $ne: null },
          },
        },
        {
          $group: {
            _id: "$os",
            count: { $sum: 1 },
          },
        },
        { $sort: { count: -1 } },
      ]),

      AnalyticsEvent.aggregate([
        {
          $match: {
            timestamp: {
              $gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
            },
          },
        },
        {
          $group: {
            _id: {
              $dateToString: { format: "%Y-%m-%d", date: "$timestamp" },
            },
            count: { $sum: 1 },
          },
        },
        { $sort: { _id: 1 } },
      ]),

      AnalyticsEvent.findOne({}, { timestamp: 1 })
        .sort({ timestamp: 1 })
        .lean(),
    ]);

    const scrollDepthEvents = await AnalyticsEvent.find({
      ...dateFilter,
      eventType: "scroll_depth",
      "eventData.scrollPercentage": { $exists: true },
    }).lean();

    const scrollInsights = {
      averageDepth: 0,
      engagementRate: 0,
      completionRate: 0,
      deepReadRate: 0,
    };

    if (scrollDepthEvents.length > 0) {
      const depths = scrollDepthEvents.map(
        (e: any) => parseInt(e.eventData.scrollPercentage) || 0,
      );
      scrollInsights.averageDepth = Math.round(
        depths.reduce((a, b) => a + b, 0) / depths.length,
      );
      scrollInsights.engagementRate = Math.round(
        (depths.filter((d) => d >= 50).length / depths.length) * 100,
      );
      scrollInsights.completionRate = Math.round(
        (depths.filter((d) => d >= 90).length / depths.length) * 100,
      );
      scrollInsights.deepReadRate = Math.round(
        (depths.filter((d) => d >= 75).length / depths.length) * 100,
      );
    }

    const sessionTimes = await AnalyticsEvent.aggregate([
      { $match: dateFilter },
      {
        $group: {
          _id: "$sessionId",
          firstEvent: { $min: "$timestamp" },
          lastEvent: { $max: "$timestamp" },
        },
      },
      {
        $project: {
          duration: {
            $subtract: ["$lastEvent", "$firstEvent"],
          },
        },
      },
    ]);

    const avgSessionDuration =
      sessionTimes.length > 0
        ? Math.round(
            sessionTimes.reduce((sum, s) => sum + s.duration, 0) /
              sessionTimes.length /
              1000,
          )
        : 0;

    const dailyUniqueVisitors = await AnalyticsEvent.aggregate([
      {
        $match: {
          timestamp: {
            $gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
          },
          ipAddress: { $exists: true, $ne: null },
        },
      },
      {
        $group: {
          _id: {
            date: {
              $dateToString: { format: "%Y-%m-%d", date: "$timestamp" },
            },
            ip: "$ipAddress",
          },
        },
      },
      {
        $group: {
          _id: "$_id.date",
          uniqueVisitors: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    let daysUntilDeletion = 90;
    let oldestEventDate = null;
    if (oldestEvent) {
      oldestEventDate = oldestEvent.timestamp;
      const daysSinceOldest = Math.floor(
        (Date.now() - new Date(oldestEvent.timestamp).getTime()) /
          (1000 * 60 * 60 * 24),
      );
      daysUntilDeletion = Math.max(0, 90 - daysSinceOldest);
    }

    const stats = {
      totalEvents,
      uniqueSessions,
      uniqueVisitors,
      avgSessionDuration,
      eventTypeDistribution,
      topPages,
      topCountries,
      topCities,
      deviceBreakdown,
      browserBreakdown,
      osBreakdown,
      dailyEvents,
      dailyUniqueVisitors,
      scrollInsights,
      retentionData: {
        oldestEvent: oldestEventDate,
        newestEvent: new Date().toISOString(),
        totalDays: oldestEventDate
          ? Math.floor(
              (Date.now() - new Date(oldestEventDate).getTime()) /
                (1000 * 60 * 60 * 24),
            )
          : 0,
        daysUntilDeletion: daysUntilDeletion || 90,
      },
    };

    statsCache = {
      data: stats,
      timestamp: Date.now(),
      params: cacheKey,
    };

    return NextResponse.json({
      success: true,
      stats,
      cached: false,
    });
  } catch (error: any) {
    console.error("[Analytics] Error fetching stats:", error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || "Internal server error",
      },
      { status: 500 },
    );
  }
}
