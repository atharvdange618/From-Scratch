"use client";

export function ScrollToTop() {
  return (
    <button
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      className="group inline-flex items-center gap-1.5 rounded-none border-2 border-black dark:border-gray-700 bg-black dark:bg-neutral-800 px-3 py-1.5 text-xs font-bold text-white shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] dark:shadow-[2px_2px_0px_0px_rgba(107,114,128,0.3)] transition-all hover:-translate-y-0.5 hover:shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] dark:hover:shadow-[3px_3px_0px_0px_rgba(107,114,128,0.3)]"
    >
      &uarr; Back to top
    </button>
  );
}
