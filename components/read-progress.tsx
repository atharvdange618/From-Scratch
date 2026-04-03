"use client";

import { useEffect, useRef, useState } from "react";

export function ReadProgress() {
  const [progress, setProgress] = useState(0);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    const updateProgress = () => {
      if (rafRef.current !== null) return;
      rafRef.current = requestAnimationFrame(() => {
        const scrollTop = window.scrollY;
        const docHeight =
          document.documentElement.scrollHeight - window.innerHeight;
        const scrollPercent = (scrollTop / docHeight) * 100;
        setProgress(Math.min(scrollPercent, 100));
        rafRef.current = null;
      });
    };

    window.addEventListener("scroll", updateProgress, { passive: true });
    updateProgress();

    return () => {
      window.removeEventListener("scroll", updateProgress);
      if (rafRef.current !== null) {
        cancelAnimationFrame(rafRef.current);
        rafRef.current = null;
      }
    };
  }, []);

  return (
    <div className="fixed top-0 left-0 right-0 z-50 h-1.5 bg-gray-200 dark:bg-gray-800">
      <div
        className="h-full bg-gradient-to-r from-[#60B5FF] via-[#FF9149] to-[#60B5FF] transition-all duration-150 ease-out shadow-[0_0_8px_rgba(74,144,204,0.5)] dark:shadow-[0_0_8px_rgba(74,144,204,0.8)]"
        style={{ width: `${progress}%` }}
      />
    </div>
  );
}
