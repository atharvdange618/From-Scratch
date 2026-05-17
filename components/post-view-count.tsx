"use client";

import { Eye } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useQuery } from "@tanstack/react-query";

async function fetchPostViewCount(
  slug: string,
): Promise<{ slug: string; views: number; totalViews: number }> {
  const response = await fetch(
    `/api/analytics/post-views?slug=${slug}&days=30`,
  );
  if (!response.ok) throw new Error("Failed to fetch view count");
  return response.json();
}

export function PostViewCount({ slug }: { slug: string }) {
  const { data, isLoading } = useQuery({
    queryKey: ["post-view-count", slug],
    queryFn: () => fetchPostViewCount(slug),
    staleTime: 5 * 60 * 1000,
  });

  const views = data?.views || 0;

  if (isLoading) {
    return (
      <Badge
        variant="outline"
        className="inline-flex items-center gap-1.5 rounded-none border-2 border-black dark:border-gray-500 bg-background dark:bg-neutral-900 dark:text-white px-3 py-1 font-serif text-sm"
      >
        <Eye className="h-4 w-4" />
        <span className="animate-pulse">...</span>
      </Badge>
    );
  }

  return (
    <Badge
      variant="outline"
      className="inline-flex items-center gap-1.5 rounded-none border-2 border-black dark:border-gray-500 bg-background dark:bg-neutral-900 dark:text-white px-3 py-1 font-serif text-sm"
    >
      <Eye className="h-4 w-4" />
      {views.toLocaleString()} views
    </Badge>
  );
}
