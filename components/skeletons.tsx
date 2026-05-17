import { Skeleton } from "@/components/ui/skeleton";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";

export function BlogCardSkeleton() {
  return (
    <Card className="overflow-hidden rounded-none border-2 border-black bg-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:border-gray-700 dark:bg-gray-800 dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,0.08)]">
      <CardHeader className="border-b-2 border-black bg-white p-4 dark:border-gray-700 dark:bg-gray-800">
        <div className="mb-2 flex items-center gap-2">
          <Skeleton className="h-9 w-9 rounded-full border-2 border-black bg-[#AFDDFF] dark:border-gray-700 dark:bg-gray-700" />
          <Skeleton className="h-4 w-24 border-2 border-black bg-[#E0FFF1] dark:border-gray-700 dark:bg-gray-700" />
        </div>
        <Skeleton className="h-6 w-3/4 border-2 border-black bg-[#60B5FF] dark:border-gray-700 dark:bg-gray-600" />
      </CardHeader>
      <CardContent className="p-4">
        <div className="mb-4 space-y-2">
          <Skeleton className="h-4 w-full border-2 border-black bg-[#FFECDB] dark:border-gray-700 dark:bg-gray-700" />
          <Skeleton className="h-4 w-5/6 border-2 border-black bg-[#FFECDB] dark:border-gray-700 dark:bg-gray-700" />
          <Skeleton className="h-4 w-4/6 border-2 border-black bg-[#FFECDB] dark:border-gray-700 dark:bg-gray-700" />
        </div>
        <div className="mb-3 flex items-center gap-2">
          <Skeleton className="h-4 w-4 rounded-full border-2 border-black bg-[#FF9149] dark:border-gray-700 dark:bg-gray-600" />
          <Skeleton className="h-4 w-20 border-2 border-black bg-[#E0FFF1] dark:border-gray-700 dark:bg-gray-700" />
        </div>
        <div className="mb-3">
          <Skeleton className="h-6 w-24 rounded-none border-2 border-black bg-[#60B5FF] dark:border-gray-700 dark:bg-gray-600" />
        </div>
        <div className="flex gap-2">
          <Skeleton className="h-6 w-16 rounded-none border-2 border-gray-300 bg-[#AFDDFF] dark:border-gray-700 dark:bg-gray-700" />
          <Skeleton className="h-6 w-20 rounded-none border-2 border-gray-300 bg-[#E0FFF1] dark:border-gray-700 dark:bg-gray-700" />
          <Skeleton className="h-6 w-16 rounded-none border-2 border-gray-300 bg-[#FFECDB] dark:border-gray-700 dark:bg-gray-700" />
        </div>
      </CardContent>
      <CardFooter className="border-t-2 border-black bg-white p-4 dark:border-gray-700 dark:bg-gray-800">
        <Skeleton className="h-10 w-full border-2 border-black bg-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] dark:shadow-[3px_3px_0px_0px_rgba(255,255,255,0.15)]" />
      </CardFooter>
    </Card>
  );
}

export function ProjectCardSkeleton() {
  return (
    <div className="animate-pulse">
      <div className="mb-2 h-3 w-16 rounded bg-gray-200 dark:bg-neutral-700" />
      <div className="mb-3 h-7 w-3/4 rounded bg-gray-200 dark:bg-neutral-700" />
      <div className="mb-4 space-y-2">
        <div className="h-4 w-full rounded bg-gray-200 dark:bg-neutral-700" />
        <div className="h-4 w-5/6 rounded bg-gray-200 dark:bg-neutral-700" />
        <div className="h-4 w-4/6 rounded bg-gray-200 dark:bg-neutral-700" />
      </div>
      <div className="mb-5 h-4 w-1/3 rounded bg-gray-200 dark:bg-neutral-700" />
      <div className="h-4 w-24 rounded bg-gray-200 dark:bg-neutral-700" />
    </div>
  );
}
