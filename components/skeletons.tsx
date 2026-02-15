import { Skeleton } from "@/components/ui/skeleton";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";

export function BlogCardSkeleton() {
  return (
    <Card className="overflow-hidden rounded-none border-4 border-black dark:border-gray-700 bg-white dark:bg-gray-800 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] dark:shadow-[8px_8px_0px_0px_rgba(255,255,255,0.1)]">
      <CardHeader className="border-b-4 border-black dark:border-gray-700 bg-white dark:bg-gray-800 p-4">
        <div className="mb-2 flex items-center gap-2">
          <Skeleton className="h-10 w-10 rounded-full border-2 border-black dark:border-gray-700 bg-[#AFDDFF] dark:bg-gray-700" />
          <Skeleton className="h-4 w-24 border-2 border-black dark:border-gray-700 bg-[#E0FFF1] dark:bg-gray-700" />
        </div>
        <Skeleton className="h-6 w-3/4 border-2 border-black dark:border-gray-700 bg-[#60B5FF] dark:bg-gray-600 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] dark:shadow-[2px_2px_0px_0px_rgba(255,255,255,0.1)]" />
      </CardHeader>
      <CardContent className="p-4">
        <div className="mb-4 space-y-2">
          <Skeleton className="h-4 w-full border-2 border-black dark:border-gray-700 bg-[#FFECDB] dark:bg-gray-700" />
          <Skeleton className="h-4 w-5/6 border-2 border-black dark:border-gray-700 bg-[#FFECDB] dark:bg-gray-700" />
          <Skeleton className="h-4 w-4/6 border-2 border-black dark:border-gray-700 bg-[#FFECDB] dark:bg-gray-700" />
        </div>
        <div className="mb-3 flex items-center gap-2">
          <Skeleton className="h-4 w-4 rounded-full border-2 border-black dark:border-gray-700 bg-[#FF9149] dark:bg-gray-600" />
          <Skeleton className="h-4 w-20 border-2 border-black dark:border-gray-700 bg-[#E0FFF1] dark:bg-gray-700" />
        </div>
        <div className="mb-3">
          <Skeleton className="h-6 w-24 rounded-lg border-2 border-black dark:border-gray-700 bg-[#60B5FF] dark:bg-gray-600" />
        </div>
        <div className="flex gap-2">
          <Skeleton className="h-6 w-16 rounded-lg border-2 border-black dark:border-gray-700 bg-[#AFDDFF] dark:bg-gray-700" />
          <Skeleton className="h-6 w-20 rounded-lg border-2 border-black dark:border-gray-700 bg-[#E0FFF1] dark:bg-gray-700" />
          <Skeleton className="h-6 w-16 rounded-lg border-2 border-black dark:border-gray-700 bg-[#FFECDB] dark:bg-gray-700" />
        </div>
      </CardContent>
      <CardFooter className="border-t-4 border-black dark:border-gray-700 bg-white dark:bg-gray-800 p-4">
        <Skeleton className="h-10 w-full border-4 border-black dark:border-gray-700 bg-[#FF9149] dark:bg-gray-600 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,0.1)]" />
      </CardFooter>
    </Card>
  );
}

export function ProjectCardSkeleton() {
  return (
    <Card className="flex flex-col overflow-hidden rounded-none border-4 border-black dark:border-gray-700 bg-white dark:bg-gray-800 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] dark:shadow-[6px_6px_0px_0px_rgba(255,255,255,0.1)] md:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] dark:md:shadow-[8px_8px_0px_0px_rgba(255,255,255,0.1)]">
      <CardHeader className="border-b-4 border-black dark:border-gray-700 bg-[#AFDDFF] dark:bg-gray-700 p-4 md:p-6">
        <div className="mb-3 flex items-start justify-between">
          <Skeleton className="h-8 w-3/4 border-2 border-black dark:border-gray-600 bg-[#60B5FF] dark:bg-gray-600 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] dark:shadow-[2px_2px_0px_0px_rgba(255,255,255,0.1)]" />
          <Skeleton className="h-6 w-6 rounded-full border-2 border-black dark:border-gray-600 bg-[#FF9149] dark:bg-gray-600" />
        </div>
        <Skeleton className="h-7 w-24 rounded-lg border-2 border-black dark:border-gray-600 bg-[#E0FFF1] dark:bg-gray-600" />
      </CardHeader>
      <CardContent className="flex-1 p-6">
        <div className="mb-4 space-y-2">
          <Skeleton className="h-4 w-full border-2 border-black dark:border-gray-700 bg-[#FFECDB] dark:bg-gray-700" />
          <Skeleton className="h-4 w-full border-2 border-black dark:border-gray-700 bg-[#FFECDB] dark:bg-gray-700" />
          <Skeleton className="h-4 w-4/5 border-2 border-black dark:border-gray-700 bg-[#FFECDB] dark:bg-gray-700" />
        </div>
        <div className="mb-4">
          <Skeleton className="mb-2 h-4 w-24 border-2 border-black dark:border-gray-700 bg-[#E0FFF1] dark:bg-gray-700" />
          <div className="flex flex-wrap gap-2">
            <Skeleton className="h-6 w-16 rounded-lg border-2 border-black dark:border-gray-700 bg-[#60B5FF] dark:bg-gray-600" />
            <Skeleton className="h-6 w-20 rounded-lg border-2 border-black dark:border-gray-700 bg-[#AFDDFF] dark:bg-gray-700" />
            <Skeleton className="h-6 w-24 rounded-lg border-2 border-black dark:border-gray-700 bg-[#E0FFF1] dark:bg-gray-700" />
            <Skeleton className="h-6 w-16 rounded-lg border-2 border-black dark:border-gray-700 bg-[#FFECDB] dark:bg-gray-700" />
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex flex-col gap-3 border-t-4 border-black dark:border-gray-700 bg-[#FFECDB] dark:bg-gray-800 p-6">
        <Skeleton className="h-11 w-full border-4 border-black dark:border-gray-700 bg-[#FF9149] dark:bg-gray-600 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,0.1)]" />
        <div className="flex gap-2">
          <Skeleton className="h-10 flex-1 border-4 border-black dark:border-gray-700 bg-[#60B5FF] dark:bg-gray-600 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] dark:shadow-[2px_2px_0px_0px_rgba(255,255,255,0.1)]" />
          <Skeleton className="h-10 flex-1 border-4 border-black dark:border-gray-700 bg-[#AFDDFF] dark:bg-gray-700 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] dark:shadow-[2px_2px_0px_0px_rgba(255,255,255,0.1)]" />
        </div>
      </CardFooter>
    </Card>
  );
}
