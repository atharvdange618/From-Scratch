"use client";

import { useEffect, useRef } from "react";
import { trackScrollDepth } from "@/lib/analytics";

interface ScrollTrackerProps {
  postTitle: string;
  category: string;
  readingTime: string;
  children: React.ReactNode;
}

/**
 * Scroll Tracker component that tracks milestone-based scroll depth
 * Tracks at 25%, 50%, 75%, and 100% scroll milestones
 */
export default function ScrollTracker({
  postTitle,
  category,
  readingTime,
  children,
}: ScrollTrackerProps) {
  const trackedMilestonesRef = useRef<Set<number>>(new Set());

  useEffect(() => {
    const handleScroll = () => {
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;
      const scrollTop = window.scrollY;

      const scrollPercentage = Math.round(
        ((scrollTop + windowHeight) / documentHeight) * 100
      );

      const milestones = [25, 50, 75, 100];

      milestones.forEach((milestone) => {
        if (
          scrollPercentage >= milestone &&
          !trackedMilestonesRef.current.has(milestone)
        ) {
          trackScrollDepth(milestone, {
            postTitle,
            category,
            readingTime,
            scrollPercentage,
          });

          trackedMilestonesRef.current.add(milestone);
        }
      });
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [postTitle, category, readingTime]);

  return <>{children}</>;
}
