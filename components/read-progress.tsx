"use client";

import { useEffect, useState } from "react";

export function ReadProgress() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const updateProgress = () => {
      const scrollTop = window.scrollY;
      const docHeight =
        document.documentElement.scrollHeight - window.innerHeight;
      const scrollPercent = (scrollTop / docHeight) * 100;
      setProgress(Math.min(scrollPercent, 100));
    };

    window.addEventListener("scroll", updateProgress, { passive: true });
    updateProgress();

    return () => window.removeEventListener("scroll", updateProgress);
  }, []);

  return (
    <div className="fixed top-0 left-0 right-0 z-50 h-1.5 bg-gray-200">
      <div
        className="h-full bg-gradient-to-r from-[#60B5FF] via-[#FF9149] to-[#60B5FF] transition-all duration-150 ease-out shadow-[0_0_8px_rgba(96,181,255,0.5)]"
        style={{ width: `${progress}%` }}
      />
    </div>
  );
}
