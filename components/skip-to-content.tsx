"use client";

/**
 * Skip to Content Link
 * Accessible navigation link that appears on keyboard focus
 * Allows screen reader and keyboard users to bypass header navigation
 */
export function SkipToContent() {
  return (
    <a
      href="#main-content"
      className="sr-only rounded-none border-4 border-black bg-[#60B5FF] px-6 py-3 font-bold text-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:transition-all focus:hover:translate-x-1 focus:hover:translate-y-1 focus:hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
    >
      Skip to main content
    </a>
  );
}
