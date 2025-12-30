import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import connectDB from "@/lib/mongodb";
import AnalyticsEvent from "@/lib/models/AnalyticsEvent";
import RateLimit from "@/lib/models/RateLimit";
import { parseUserAgent } from "@/lib/analytics-server";

const RATE_LIMIT_MAX = 100;
const RATE_LIMIT_WINDOW = 60 * 60 * 1000;

interface IpApiResponse {
  status: string;
  country?: string;
  countryCode?: string;
  region?: string;
  regionName?: string;
  city?: string;
  zip?: string;
  lat?: number;
  lon?: number;
  timezone?: string;
  isp?: string;
  org?: string;
  as?: string;
  query?: string;
}

/**
 * Get IP geolocation data from ip-api.com
 */
async function getIpGeolocation(ip: string): Promise<{
  country?: string;
  city?: string;
  region?: string;
  timezone?: string;
}> {
  try {
    const response = await fetch(`http://ip-api.com/json/${ip}`);
    const data: IpApiResponse = await response.json();

    if (data.status === "success") {
      return {
        country: data.country,
        city: data.city,
        region: data.regionName,
        timezone: data.timezone,
      };
    }
  } catch (error) {
    console.error("[Analytics] IP geolocation error:", error);
  }

  return {};
}

/**
 * Check and update rate limit for a session
 */
async function checkRateLimit(sessionId: string): Promise<boolean> {
  const now = new Date();

  try {
    let rateLimit = await RateLimit.findOne({ sessionId });

    if (!rateLimit) {
      await RateLimit.create({
        sessionId,
        eventCount: 1,
        windowStart: now,
      });
      return true;
    }

    const timeSinceWindowStart =
      now.getTime() - rateLimit.windowStart.getTime();

    if (timeSinceWindowStart > RATE_LIMIT_WINDOW) {
      rateLimit.eventCount = 1;
      rateLimit.windowStart = now;
      await rateLimit.save();
      return true;
    }

    if (rateLimit.eventCount >= RATE_LIMIT_MAX) {
      return false;
    }

    rateLimit.eventCount += 1;
    await rateLimit.save();
    return true;
  } catch (error) {
    console.error("[Analytics] Rate limit check error:", error);
    return true;
  }
}

/**
 * POST /api/analytics/track
 * Track analytics events with rate limiting and IP geolocation
 */
export async function POST(request: NextRequest) {
  try {
    if (process.env.NODE_ENV !== "production") {
      return NextResponse.json(
        { success: false, error: "Tracking disabled in development" },
        { status: 400 }
      );
    }

    const { userId } = await auth();
    const adminUserId = process.env.ADMIN_USER_ID;

    if (adminUserId && userId === adminUserId) {
      return NextResponse.json(
        { success: false, error: "Admin users are not tracked" },
        { status: 403 }
      );
    }

    const body = await request.json();
    const { eventType, eventData, sessionId } = body;

    if (!eventType || !sessionId) {
      return NextResponse.json(
        {
          success: false,
          error: "Missing required fields: eventType, sessionId",
        },
        { status: 400 }
      );
    }

    await connectDB();

    const withinLimit = await checkRateLimit(sessionId);
    if (!withinLimit) {
      return NextResponse.json(
        {
          success: false,
          error:
            "Rate limit exceeded. Maximum 100 events per session per hour.",
        },
        { status: 429 }
      );
    }

    const forwardedFor = request.headers.get("x-forwarded-for");
    const realIp = request.headers.get("x-real-ip");
    const ipAddress = forwardedFor
      ? forwardedFor.split(",")[0].trim()
      : realIp || "unknown";

    const geoData =
      ipAddress !== "unknown" ? await getIpGeolocation(ipAddress) : {};

    // Parse user agent
    const userAgent = request.headers.get("user-agent") || "";
    const { device, browser, os } = parseUserAgent(userAgent);

    // Create analytics event
    const event = await AnalyticsEvent.create({
      eventType,
      eventData: eventData || {},
      userId: userId || undefined,
      sessionId,
      timestamp: new Date(),
      ipAddress: ipAddress !== "unknown" ? ipAddress : undefined,
      country: geoData.country,
      city: geoData.city,
      region: geoData.region,
      timezone: geoData.timezone,
      device,
      browser,
      os,
    });

    return NextResponse.json(
      {
        success: true,
        eventId: event._id,
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("[Analytics] Tracking error:", error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || "Internal server error",
      },
      { status: 500 }
    );
  }
}
