"use client";

import { useSyncExternalStore } from "react";
import { ArrowUp } from "lucide-react";
import { Button } from "@/components/ui/button";

function subscribe(callback: () => void) {
  window.addEventListener("scroll", callback, { passive: true });
  return () => window.removeEventListener("scroll", callback);
}

function getSnapshot() {
  return window.scrollY > 300;
}

function getServerSnapshot() {
  return false;
}

export function BackToTop() {
  const isVisible = useSyncExternalStore(
    subscribe,
    getSnapshot,
    getServerSnapshot,
  );

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  if (!isVisible) {
    return null;
  }

  return (
    <Button
      onClick={scrollToTop}
      className="fixed bottom-8 right-8 z-50 h-12 w-12 rounded-full border-2 border-black bg-[#60B5FF] p-0 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all hover:translate-x-0.5 hover:translate-y-0.5 hover:bg-[#60B5FF]/80 hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] dark:border-gray-500 dark:bg-primary dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,0.08)] dark:hover:bg-primary/80 dark:hover:shadow-[2px_2px_0px_0px_rgba(255,255,255,0.08)]"
      aria-label="Back to top"
    >
      <ArrowUp className="h-6 w-6 text-white dark:text-black" />
    </Button>
  );
}