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
      className="fixed bottom-8 right-8 z-50 h-12 w-12 rounded-full border-4 border-black bg-[#60B5FF] p-0 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] transition-all hover:translate-x-1 hover:translate-y-1 hover:bg-[#60B5FF]/80 hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
      aria-label="Back to top"
    >
      <ArrowUp className="h-6 w-6 text-white" />
    </Button>
  );
}
