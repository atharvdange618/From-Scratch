import { NextRequest, NextResponse } from "next/server";
import { checkAdminAccess } from "@/lib/auth";
import connectDB from "@/lib/mongodb";
import AnalyticsEvent from "@/lib/models/AnalyticsEvent";

/**
 * GET /api/analytics/events
 * Fetch analytics events with filtering and cursor-based pagination (admin only)
 */
export async function GET(request: NextRequest) {
  try {
    const adminCheck = await checkAdminAccess();
    if (!adminCheck.authorized) {
      return adminCheck.response;
    }

    await connectDB();

    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get("limit") || "100");
    const cursor = searchParams.get("cursor");
    const eventType = searchParams.get("eventType");
    const startDate = searchParams.get("startDate");
    const endDate = searchParams.get("endDate");
    const sessionId = searchParams.get("sessionId");

    const query: any = {};

    if (eventType) {
      query.eventType = eventType;
    }

    if (sessionId) {
      query.sessionId = sessionId;
    }

    if (startDate || endDate) {
      query.timestamp = {};
      if (startDate) {
        query.timestamp.$gte = new Date(startDate);
      }
      if (endDate) {
        query.timestamp.$lte = new Date(endDate);
      }
    }

    if (cursor) {
      query._id = { $lt: cursor };
    }

    const events = await AnalyticsEvent.find(query)
      .sort({ _id: -1 })
      .limit(limit + 1)
      .lean();

    const hasMore = events.length > limit;

    const resultEvents = hasMore ? events.slice(0, limit) : events;

    const nextCursor =
      resultEvents.length > 0
        ? resultEvents[resultEvents.length - 1]._id.toString()
        : null;

    return NextResponse.json({
      success: true,
      events: resultEvents,
      nextCursor: hasMore ? nextCursor : null,
      hasMore,
      limit,
    });
  } catch (error: any) {
    console.error("[Analytics] Error fetching events:", error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || "Internal server error",
      },
      { status: 500 },
    );
  }
}
