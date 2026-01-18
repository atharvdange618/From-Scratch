import { ArrowLeft } from "@deemlol/next-icons";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <article className="container mx-auto px-4 py-8">
      <Button
        variant="outline"
        disabled
        className="mb-8 rounded-none border-4 border-black bg-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to Home
      </Button>

      {/* Breadcrumb skeleton */}
      <div className="mb-8 flex items-center gap-2">
        <Skeleton className="h-5 w-24" />
        <span>/</span>
        <Skeleton className="h-5 w-32" />
      </div>

      <header className="mb-12">
        {/* Badges skeleton */}
        <div className="mb-4 flex flex-wrap items-center gap-3">
          <Skeleton className="h-7 w-32 rounded-none border-2 border-black" />
          <Skeleton className="h-7 w-36 rounded-none border-2 border-black" />
          <Skeleton className="h-7 w-28 rounded-none border-2 border-black" />
        </div>

        {/* Title skeleton */}
        <Skeleton className="mb-4 h-14 w-full max-w-3xl" />
        <Skeleton className="mb-2 h-14 w-2/3" />

        {/* Summary skeleton */}
        <div className="mb-6 space-y-2">
          <Skeleton className="h-6 w-full max-w-2xl" />
          <Skeleton className="h-6 w-3/4" />
        </div>

        {/* Tags skeleton */}
        <div className="flex flex-wrap gap-2">
          <Skeleton className="h-8 w-24 rounded-lg border-2 border-black" />
          <Skeleton className="h-8 w-32 rounded-lg border-2 border-black" />
          <Skeleton className="h-8 w-28 rounded-lg border-2 border-black" />
          <Skeleton className="h-8 w-36 rounded-lg border-2 border-black" />
        </div>
      </header>

      {/* Banner image skeleton */}
      <Skeleton className="mb-12 h-96 w-full rounded-none border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]" />

      <Separator className="my-4 border-2 border-black" />

      {/* Content skeleton */}
      <div className="mb-8 rounded-none bg-white p-6 sm:p-8">
        <div className="prose-lg max-w-none space-y-4">
          <Skeleton className="h-8 w-1/2" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-5/6" />
          <div className="py-4">
            <Skeleton className="h-6 w-1/3" />
          </div>
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-4/5" />
          <div className="py-4">
            <Skeleton className="h-64 w-full rounded-none border-4 border-black" />
          </div>
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-3/4" />
        </div>
      </div>

      {/* Social share skeleton */}
      <div className="mb-12 flex gap-3">
        <Skeleton className="h-12 w-12 rounded-none border-4 border-black" />
        <Skeleton className="h-12 w-12 rounded-none border-4 border-black" />
        <Skeleton className="h-12 w-12 rounded-none border-4 border-black" />
        <Skeleton className="h-12 w-12 rounded-none border-4 border-black" />
      </div>

      {/* Related posts skeleton */}
      <div className="mb-12">
        <Skeleton className="mb-6 h-10 w-48" />
        <div className="grid gap-5 md:gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <Card
              key={i}
              className="rounded-none border-4 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]"
            >
              <CardContent className="p-6">
                <Skeleton className="mb-3 h-6 w-32" />
                <Skeleton className="mb-2 h-8 w-full" />
                <Skeleton className="mb-4 h-4 w-full" />
                <div className="flex gap-2">
                  <Skeleton className="h-6 w-20" />
                  <Skeleton className="h-6 w-24" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      <Separator className="my-12 border-2 border-black" />

      {/* Comments section skeleton */}
      <div className="mx-auto max-w-4xl">
        <Skeleton className="mb-6 h-10 w-40" />
        <Card className="rounded-none border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
          <CardContent className="p-6">
            <Skeleton className="h-64 w-full" />
          </CardContent>
        </Card>
      </div>
    </article>
  );
}
