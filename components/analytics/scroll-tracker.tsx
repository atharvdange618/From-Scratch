"use client";

import { useEffect, useState } from "react";
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
  const [trackedMilestones, setTrackedMilestones] = useState<Set<number>>(
    new Set()
  );

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
          !trackedMilestones.has(milestone)
        ) {
          trackScrollDepth(milestone, {
            postTitle,
            category,
            readingTime,
            scrollPercentage,
          });

          setTrackedMilestones((prev) => new Set([...prev, milestone]));
        }
      });
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [postTitle, category, readingTime, trackedMilestones]);

  return <>{children}</>;
}
