"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Application error:", error);
  }, [error]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background dark:bg-neutral-900 px-4">
      <div className="max-w-md text-center">
        <div className="mb-8 rounded-none border-4 border-black dark:border-gray-700 bg-secondary p-8 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] dark:shadow-[8px_8px_0px_0px_rgba(107,114,128,0.3)]">
          <div className="mb-4 text-6xl">⚠️</div>
          <h2 className="mb-2 text-2xl font-bold dark:text-black">
            Oops! Something went wrong
          </h2>
          <p className="text-sm text-gray-700 dark:text-gray-900">
            {error.message || "An unexpected error occurred"}
          </p>
          {error.digest && (
            <p className="mt-2 text-xs text-gray-600 dark:text-gray-800">
              Error ID: {error.digest}
            </p>
          )}
        </div>

        <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
          <Button
            onClick={reset}
            className="rounded-none border-4 border-black dark:border-gray-700 bg-background dark:bg-neutral-900 px-6 py-2 font-bold shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_rgba(107,114,128,0.3)] transition-all hover:translate-x-1 hover:translate-y-1 hover:bg-primary dark:hover:bg-neutral-800 hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
          >
            Try Again
          </Button>

          <Link href="/">
            <Button
              variant="outline"
              className="rounded-none border-4 border-black dark:border-gray-700 bg-background dark:bg-neutral-900 px-6 py-2 font-bold shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_rgba(107,114,128,0.3)] transition-all hover:translate-x-1 hover:translate-y-1 hover:bg-[#AFDDFF] dark:hover:bg-neutral-800 hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
            >
              Go Home
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
