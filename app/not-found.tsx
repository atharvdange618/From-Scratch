import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-white dark:bg-neutral-900 px-4">
      <div className="max-w-lg text-center">
        <div className="mb-8 inline-block rounded-none border-4 border-black dark:border-gray-700 bg-[#AFDDFF] dark:bg-gray-800 p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] dark:shadow-[8px_8px_0px_0px_rgba(74,144,204,0.3)]">
          <div className="text-8xl md:text-9xl font-black font-sans leading-none dark:text-white">
            404
          </div>
        </div>

        <div className="mb-8 rounded-none border-4 border-black dark:border-gray-700 bg-[#FFECDB] dark:bg-gray-800 p-6 md:p-8 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] dark:shadow-[8px_8px_0px_0px_rgba(74,144,204,0.3)]">
          <h1 className="mb-3 font-sans text-2xl md:text-3xl font-bold dark:text-white">
            Page Not Found
          </h1>
          <p className="font-serif text-sm md:text-base text-gray-700 dark:text-gray-300">
            Looks like this page doesn't exist or maybe it was moved, deleted,
            or never built from scratch in the first place.
          </p>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
          <Link href="/">
            <Button className="rounded-none border-4 border-black dark:border-gray-700 bg-[#FF9149] px-6 py-3 text-base font-bold shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] dark:shadow-[6px_6px_0px_0px_rgba(74,144,204,0.3)] transition-all hover:translate-x-1 hover:translate-y-1 hover:shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] dark:hover:shadow-[3px_3px_0px_0px_rgba(74,144,204,0.3)]">
              Go Home
            </Button>
          </Link>
          <Link href="/blogs">
            <Button
              variant="outline"
              className="rounded-none border-4 border-black dark:border-gray-700 bg-white dark:bg-gray-900 dark:text-white px-6 py-3 text-base font-bold shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] dark:shadow-[6px_6px_0px_0px_rgba(74,144,204,0.3)] transition-all hover:translate-x-1 hover:translate-y-1 hover:bg-[#AFDDFF] dark:hover:bg-gray-800 hover:shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] dark:hover:shadow-[3px_3px_0px_0px_rgba(74,144,204,0.3)]"
            >
              Read the Blog
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
