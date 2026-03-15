"use client";

import Link from "next/link";
import { ArrowRight, Eye, TrendingUp } from "lucide-react";
import { usePopularPosts } from "@/lib/hooks/use-popular-posts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { formatDate } from "@/lib/dateandnumbers";

export function PopularPosts() {
  const { data, isLoading, error } = usePopularPosts(7);

  console.log(error);
  console.log(data);

  if (isLoading) {
    return (
      <Card className="rounded-none border-4 border-black dark:border-gray-700 bg-white dark:bg-gray-900 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] dark:shadow-[6px_6px_0px_0px_rgba(96,181,255,0.3)]">
        <CardHeader className="border-b-4 border-black dark:border-gray-700 bg-[#FFECDB] dark:bg-gray-800">
          <CardTitle className="flex items-center gap-2 font-sans text-xl font-bold">
            <TrendingUp className="h-5 w-5" />
            Trending Posts
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex gap-4">
                <Skeleton className="h-4 w-4 rounded-full" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-3 w-1/2" />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  const posts = data?.popularPosts;

  if (!posts || posts.length === 0) {
    return (
      <Card className="rounded-none border-4 border-black dark:border-gray-700 bg-white dark:bg-gray-900 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] dark:shadow-[6px_6px_0px_0px_rgba(96,181,255,0.3)]">
        <CardHeader className="border-b-4 border-black dark:border-gray-700 bg-[#FFECDB] dark:bg-gray-800">
          <CardTitle className="flex items-center gap-2 font-sans text-xl font-bold">
            <TrendingUp className="h-5 w-5" />
            Trending Posts
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          <p className="text-sm text-muted-foreground">
            No trending posts yet. Check back soon!
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="rounded-none border-4 border-black dark:border-gray-700 bg-white dark:bg-gray-900 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] dark:shadow-[6px_6px_0px_0px_rgba(96,181,255,0.3)]">
      <CardHeader className="border-b-4 border-black dark:border-gray-700 bg-[#FFECDB] dark:bg-gray-800">
        <CardTitle className="flex items-center gap-2 font-sans text-xl font-bold">
          <TrendingUp className="h-5 w-5" />
          Trending Posts
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-6">
        <div className="space-y-4">
          {posts.map((post, index) => (
            <Link
              key={post.slug}
              href={`/posts/${post.slug}`}
              className="group flex items-start gap-3"
            >
              <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-black text-white text-sm font-bold dark:bg-white dark:text-black">
                {index + 1}
              </span>
              <div className="flex-1 space-y-1">
                <h4 className="font-sans text-sm font-semibold leading-tight group-hover:text-primary transition-colors line-clamp-2">
                  {post.title}
                </h4>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  {post.publishedDate && (
                    <span>{formatDate(post.publishedDate)}</span>
                  )}
                  <span className="flex items-center gap-1">
                    <Eye className="h-3 w-3" />
                    {post.views.toLocaleString()}
                  </span>
                </div>
              </div>
              <ArrowRight className="h-4 w-4 shrink-0 opacity-0 transition-opacity group-hover:opacity-100" />
            </Link>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
