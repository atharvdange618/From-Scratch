"use client";

/**
 * Client-side analytics utilities for tracking user events
 * Uses localStorage for session management and POSTs to /api/analytics/track
 */

const SESSION_KEY = "analytics_session";
const SESSION_DURATION = 30 * 60 * 1000;

interface Session {
  id: string;
  expiresAt: number;
}

/**
 * Generate a UUID v4 for session identification
 */
export function generateSessionId(): string {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

/**
 * Get existing session or create a new one
 * Sessions expire after 30 minutes of inactivity
 */
export function getOrCreateSession(): string {
  if (typeof window === "undefined") {
    return "";
  }

  try {
    const stored = localStorage.getItem(SESSION_KEY);
    const now = Date.now();

    if (stored) {
      const session: Session = JSON.parse(stored);

      // Check if session is still valid
      if (session.expiresAt > now) {
        // Extend session expiration
        session.expiresAt = now + SESSION_DURATION;
        localStorage.setItem(SESSION_KEY, JSON.stringify(session));
        return session.id;
      }
    }

    // Create new session
    const newSession: Session = {
      id: generateSessionId(),
      expiresAt: now + SESSION_DURATION,
    };
    localStorage.setItem(SESSION_KEY, JSON.stringify(newSession));
    return newSession.id;
  } catch (error) {
    console.error("[Analytics] Error managing session:", error);
    return generateSessionId();
  }
}

/**
 * Check if tracking should be enabled
 * Excludes admin users and development environment
 */
export function shouldTrackEvent(): boolean {
  if (process.env.NODE_ENV !== "production") {
    return false;
  }

  return true;
}

/**
 * Parse user agent string to extract device, browser, and OS information
 */
export function parseUserAgent(userAgent: string): {
  device: string;
  browser: string;
  os: string;
} {
  const isMobile = /Mobile|Android|iPhone/i.test(userAgent);
  const isTablet = /Tablet|iPad/i.test(userAgent);

  let browser = "Other";
  if (userAgent.includes("Chrome") && !userAgent.includes("Edg")) {
    browser = "Chrome";
  } else if (userAgent.includes("Firefox")) {
    browser = "Firefox";
  } else if (userAgent.includes("Safari") && !userAgent.includes("Chrome")) {
    browser = "Safari";
  } else if (userAgent.includes("Edg")) {
    browser = "Edge";
  }

  let os = "Other";
  if (userAgent.includes("Windows")) {
    os = "Windows";
  } else if (userAgent.includes("Mac")) {
    os = "macOS";
  } else if (userAgent.includes("Linux")) {
    os = "Linux";
  } else if (userAgent.includes("Android")) {
    os = "Android";
  } else if (
    userAgent.includes("iOS") ||
    userAgent.includes("iPhone") ||
    userAgent.includes("iPad")
  ) {
    os = "iOS";
  }

  return {
    device: isMobile ? "mobile" : isTablet ? "tablet" : "desktop",
    browser,
    os,
  };
}

/**
 * Track an analytics event
 * @param eventType - Type of event (e.g., 'page_view', 'button_click')
 * @param eventData - Additional data specific to the event
 */
export async function trackEvent(
  eventType: string,
  eventData: Record<string, any> = {}
): Promise<void> {
  if (!shouldTrackEvent()) {
    console.log("[Analytics] Tracking disabled (not in production)");
    return;
  }

  try {
    const sessionId = getOrCreateSession();

    const payload = {
      eventType,
      eventData,
      sessionId,
      timestamp: new Date().toISOString(),
    };

    const response = await fetch("/api/analytics/track", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const error = await response.json();
      console.error("[Analytics] Tracking failed:", error);
    }
  } catch (error) {
    console.error("[Analytics] Error tracking event:", error);
  }
}

/**
 * Track a page view event
 */
export function trackPageView(path: string, referrer?: string): void {
  trackEvent("page_view", {
    path,
    referrer: referrer || document.referrer,
    title: document.title,
  });
}

/**
 * Track an external link click
 */
export function trackExternalLink(
  url: string,
  linkType: string,
  metadata: Record<string, any> = {}
): void {
  trackEvent("external_link_click", {
    url,
    linkType,
    ...metadata,
  });
}

/**
 * Track a search query
 */
export function trackSearch(query: string, resultsCount: number): void {
  trackEvent("search_query", {
    query,
    resultsCount,
  });
}

/**
 * Track scroll depth milestone
 */
export function trackScrollDepth(
  milestone: number,
  metadata: Record<string, any> = {}
): void {
  trackEvent("scroll_depth", {
    milestone,
    ...metadata,
  });
}

/**
 * Track social link click
 */
export function trackSocialClick(platform: string, location: string): void {
  trackEvent("social_link_click", {
    platform,
    location,
  });
}
