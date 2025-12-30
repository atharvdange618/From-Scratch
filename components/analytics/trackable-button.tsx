"use client";

import React from "react";
import { trackEvent } from "@/lib/analytics";

interface TrackableButtonProps extends React.ComponentProps<"button"> {
  trackingData?: {
    eventType: string;
    eventData?: Record<string, any>;
  };
}

/**
 * Trackable Button component that tracks clicks
 * Extends standard button tag with optional tracking functionality
 */
export default function TrackableButton({
  trackingData,
  onClick,
  children,
  ...props
}: TrackableButtonProps) {
  const handleClick = async (e: React.MouseEvent<HTMLButtonElement>) => {
    if (trackingData) {
      try {
        await trackEvent(trackingData.eventType, trackingData.eventData);
      } catch (error) {
        console.error("[TrackableButton] Tracking error:", error);
      }
    }

    if (onClick) {
      onClick(e);
    }
  };

  return (
    <button onClick={handleClick} {...props}>
      {children}
    </button>
  );
}
