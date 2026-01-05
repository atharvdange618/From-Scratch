import { Skeleton } from "@/components/ui/skeleton";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";

export function BlogCardSkeleton() {
  return (
    <Card className="overflow-hidden rounded-none border-4 border-black bg-white shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
      <CardHeader className="border-b-4 border-black bg-white p-4">
        <div className="mb-2 flex items-center gap-2">
          <Skeleton className="h-10 w-10 rounded-full" />
          <Skeleton className="h-4 w-24" />
        </div>
        <Skeleton className="h-6 w-3/4" />
      </CardHeader>
      <CardContent className="p-4">
        <div className="mb-4 space-y-2">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-5/6" />
          <Skeleton className="h-4 w-4/6" />
        </div>
        <div className="mb-3 flex items-center gap-2">
          <Skeleton className="h-4 w-4" />
          <Skeleton className="h-4 w-20" />
        </div>
        <div className="mb-3">
          <Skeleton className="h-6 w-24 rounded-lg" />
        </div>
        <div className="flex gap-2">
          <Skeleton className="h-6 w-16 rounded-lg" />
          <Skeleton className="h-6 w-20 rounded-lg" />
          <Skeleton className="h-6 w-16 rounded-lg" />
        </div>
      </CardContent>
      <CardFooter className="border-t-4 border-black bg-white p-4">
        <Skeleton className="h-10 w-full" />
      </CardFooter>
    </Card>
  );
}

export function ProjectCardSkeleton() {
  return (
    <Card className="flex flex-col overflow-hidden rounded-none border-4 border-black bg-white shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] md:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
      <CardHeader className="border-b-4 border-black bg-[#AFDDFF] p-4 md:p-6">
        <div className="mb-3 flex items-start justify-between">
          <Skeleton className="h-8 w-3/4" />
          <Skeleton className="h-6 w-6" />
        </div>
        <Skeleton className="h-7 w-24 rounded-lg" />
      </CardHeader>
      <CardContent className="flex-1 p-6">
        <div className="mb-4 space-y-2">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-4/5" />
        </div>
        <div className="mb-4">
          <Skeleton className="mb-2 h-4 w-24" />
          <div className="flex flex-wrap gap-2">
            <Skeleton className="h-6 w-16 rounded-lg" />
            <Skeleton className="h-6 w-20 rounded-lg" />
            <Skeleton className="h-6 w-24 rounded-lg" />
            <Skeleton className="h-6 w-16 rounded-lg" />
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex flex-col gap-3 border-t-4 border-black bg-[#FFECDB] p-6">
        <Skeleton className="h-11 w-full" />
        <div className="flex gap-2">
          <Skeleton className="h-10 flex-1" />
          <Skeleton className="h-10 flex-1" />
        </div>
      </CardFooter>
    </Card>
  );
}
