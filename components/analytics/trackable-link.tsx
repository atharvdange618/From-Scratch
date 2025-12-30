"use client";

import React from "react";
import { trackEvent } from "@/lib/analytics";

interface TrackableLinkProps extends React.ComponentProps<"a"> {
  trackingData?: {
    eventType: string;
    eventData?: Record<string, any>;
  };
}

/**
 * Trackable Link component that tracks clicks before navigation
 * Extends standard anchor tag with optional tracking functionality
 */
export default function TrackableLink({
  trackingData,
  onClick,
  children,
  ...props
}: TrackableLinkProps) {
  const handleClick = async (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (trackingData) {
      try {
        await trackEvent(trackingData.eventType, trackingData.eventData);
      } catch (error) {
        console.error("[TrackableLink] Tracking error:", error);
      }
    }

    if (onClick) {
      onClick(e);
    }
  };

  return (
    <a onClick={handleClick} {...props}>
      {children}
    </a>
  );
}
