"use client";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="en" data-scroll-behavior="smooth">
      <body className="dark:bg-background dark:text-foreground">
        <div
          className="flex min-h-screen flex-col items-center justify-center gap-4 p-5 text-center"
          style={{ fontFamily: "system-ui, sans-serif" }}
        >
          <h1 className="m-0 text-6xl">⚠️</h1>
          <h2 className="mb-4 text-3xl font-bold dark:text-white">
            Critical Error
          </h2>
          <p className="mb-8 text-gray-600 dark:text-gray-400">
            {error.message || "Something went wrong"}
          </p>
          <button
            onClick={reset}
            className="rounded-none border-4 border-black bg-background px-6 py-3 text-base font-bold shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all hover:translate-x-1 hover:translate-y-1 hover:bg-primary hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] dark:border-gray-500 dark:bg-neutral-800 dark:text-white dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,0.08)] dark:hover:bg-neutral-700 dark:hover:shadow-[2px_2px_0px_0px_rgba(255,255,255,0.08)]"
          >
            Try Again
          </button>
        </div>
      </body>
    </html>
  );
}