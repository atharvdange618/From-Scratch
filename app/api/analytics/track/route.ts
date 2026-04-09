import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import connectDB from "@/lib/mongodb";
import AnalyticsEvent from "@/lib/models/AnalyticsEvent";
import RateLimit from "@/lib/models/RateLimit";
import { parseUserAgent } from "@/lib/analytics-server";
import { trackEventSchema } from "@/lib/validations/api-schemas";
import { logger } from "@/lib/logger";
import { env } from "@/lib/env";

const RATE_LIMIT_MAX = 100;
const RATE_LIMIT_WINDOW = 60 * 60 * 1000;

const geoCache = new Map<
  string,
  {
    data: {
      country?: string;
      city?: string;
      region?: string;
      timezone?: string;
    };
    timestamp: number;
  }
>();
const GEO_CACHE_TTL = 24 * 60 * 60 * 1000;

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
  const cached = geoCache.get(ip);
  if (cached && Date.now() - cached.timestamp < GEO_CACHE_TTL) {
    logger.info("[Analytics] Using cached geolocation", { ip });
    return cached.data;
  }

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000);

    const response = await fetch(
      `https://ip-api.com/json/${ip}?fields=status,country,city,regionName,timezone`,
      {
        signal: controller.signal,
      },
    );
    clearTimeout(timeoutId);

    const data: IpApiResponse = await response.json();

    if (data.status === "success") {
      const geoData = {
        country: data.country,
        city: data.city,
        region: data.regionName,
        timezone: data.timezone,
      };

      geoCache.set(ip, { data: geoData, timestamp: Date.now() });

      logger.info("[Analytics] IP geolocation success", {
        ip,
        country: data.country,
        city: data.city,
      });
      return geoData;
    } else {
      logger.warn("[Analytics] IP geolocation API returned failure status", {
        ip,
        status: data.status,
      });
    }
  } catch (error) {
    logger.error("[Analytics] IP geolocation failed", error, {
      ip,
      errorType: error instanceof Error ? error.name : typeof error,
      message: error instanceof Error ? error.message : String(error),
    });
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
    logger.error("[Analytics] Rate limit check error", error);
    return true;
  }
}

/**
 * POST /api/analytics/track
 * Track analytics events with rate limiting and IP geolocation
 */
export async function POST(request: NextRequest) {
  try {
    if (env.NODE_ENV !== "production") {
      return NextResponse.json(
        { success: false, error: "Tracking disabled in development" },
        { status: 400 },
      );
    }

    const { userId } = await auth();
    const adminUserId = env.ADMIN_USER_ID;

    if (adminUserId && userId === adminUserId) {
      return NextResponse.json(
        { success: false, error: "Admin users are not tracked" },
        { status: 403 },
      );
    }

    const body = await request.json();

    const validatedData = trackEventSchema.parse(body);
    const { eventType, eventData, sessionId } = validatedData;

    await connectDB();

    const withinLimit = await checkRateLimit(sessionId);
    if (!withinLimit) {
      return NextResponse.json(
        {
          success: false,
          error:
            "Rate limit exceeded. Maximum 100 events per session per hour.",
        },
        { status: 429 },
      );
    }

    const forwardedFor = request.headers.get("x-forwarded-for");
    const realIp = request.headers.get("x-real-ip");
    const ipAddress = forwardedFor
      ? forwardedFor.split(",")[0].trim()
      : realIp || "unknown";

    logger.info("[Analytics] Processing event", {
      eventType,
      sessionId,
      ipAddress,
      forwardedFor,
      realIp,
    });

    const geoData =
      ipAddress !== "unknown" ? await getIpGeolocation(ipAddress) : {};

    logger.info("[Analytics] Geolocation result", {
      ipAddress,
      hasCountry: !!geoData.country,
      hasCity: !!geoData.city,
      country: geoData.country,
      city: geoData.city,
    });

    const userAgent = request.headers.get("user-agent") || "";
    const { device, browser, os } = parseUserAgent(userAgent);

    const normalizedEventData = eventData ? { ...eventData } : {};
    if (!normalizedEventData.path) {
      normalizedEventData.path =
        normalizedEventData.page ||
        normalizedEventData.pathname ||
        (normalizedEventData.url
          ? new URL(normalizedEventData.url).pathname
          : undefined);
    }
    delete normalizedEventData.page;
    delete normalizedEventData.pathname;

    const event = await AnalyticsEvent.create({
      eventType,
      eventData: normalizedEventData,
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
      { status: 201 },
    );
  } catch (error: any) {
    if (error.name === "ZodError") {
      return NextResponse.json(
        {
          success: false,
          error: "Validation failed",
          details: error.errors,
        },
        { status: 400 },
      );
    }

    logger.error("[Analytics] Tracking error", error, {
      context: "API /analytics/track POST",
    });
    return NextResponse.json(
      {
        success: false,
        error: error.message || "Internal server error",
      },
      { status: 500 },
    );
  }
}
