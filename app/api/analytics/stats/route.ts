import { NextRequest, NextResponse } from "next/server";
import { checkAdminAccess } from "@/lib/auth";
import connectDB from "@/lib/mongodb";
import AnalyticsEvent from "@/lib/models/AnalyticsEvent";

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
      deviceBreakdown,
      browserBreakdown,
      osBreakdown,
      dailyEvents,
      oldestEvent,
    ] = await Promise.all([
      AnalyticsEvent.countDocuments(dateFilter),

      AnalyticsEvent.distinct("sessionId", dateFilter).then(
        (sessions) => sessions.length
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
            $or: [
              { eventType: "page_view" },
              { "eventData.path": { $exists: true, $nin: [null, ""] } },
              { "eventData.page": { $exists: true, $nin: [null, ""] } },
              { "eventData.pathname": { $exists: true, $nin: [null, ""] } },
              { "eventData.url": { $exists: true, $nin: [null, ""] } },
            ],
          },
        },
        {
          $addFields: {
            pagePath: {
              $cond: {
                if: { $ne: ["$eventData.path", null] },
                then: "$eventData.path",
                else: {
                  $cond: {
                    if: { $ne: ["$eventData.page", null] },
                    then: "$eventData.page",
                    else: {
                      $cond: {
                        if: { $ne: ["$eventData.pathname", null] },
                        then: "$eventData.pathname",
                        else: "$eventData.url",
                      },
                    },
                  },
                },
              },
            },
          },
        },
        {
          $match: {
            pagePath: {
              $exists: true,
              $ne: null,
              $nin: ["", null],
            },
          },
        },
        {
          $group: {
            _id: "$pagePath",
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

    let daysUntilDeletion = 90;
    let oldestEventDate = null;
    if (oldestEvent) {
      oldestEventDate = oldestEvent.timestamp;
      const daysSinceOldest = Math.floor(
        (Date.now() - new Date(oldestEvent.timestamp).getTime()) /
          (1000 * 60 * 60 * 24)
      );
      daysUntilDeletion = Math.max(0, 90 - daysSinceOldest);
    }

    return NextResponse.json({
      success: true,
      stats: {
        totalEvents,
        uniqueSessions,
        uniqueVisitors,
        eventTypeDistribution,
        topPages,
        topCountries,
        deviceBreakdown,
        browserBreakdown,
        osBreakdown,
        dailyEvents,
        retentionData: {
          oldestEvent: oldestEventDate,
          newestEvent: new Date().toISOString(),
          totalDays: oldestEventDate
            ? Math.floor(
                (Date.now() - new Date(oldestEventDate).getTime()) /
                  (1000 * 60 * 60 * 24)
              )
            : 0,
          daysUntilDeletion: daysUntilDeletion || 90,
        },
      },
    });
  } catch (error: any) {
    console.error("[Analytics] Error fetching stats:", error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || "Internal server error",
      },
      { status: 500 }
    );
  }
}
