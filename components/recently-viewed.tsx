"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Clock, Calendar } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatDate } from "@/lib/dateandnumbers";

interface RecentPost {
  _id: string;
  title: string;
  slug: string;
  summary: string;
  category: string;
  publishedDate: string;
  viewedAt: number;
}

const RECENT_POSTS_KEY = "recentlyViewedPosts";
const MAX_RECENT_POSTS = 5;

export function addToRecentlyViewed(post: Omit<RecentPost, "viewedAt">) {
  if (typeof window === "undefined") return;

  const existing = getRecentlyViewed();
  const filtered = existing.filter((p) => p._id !== post._id);
  const updated = [{ ...post, viewedAt: Date.now() }, ...filtered].slice(
    0,
    MAX_RECENT_POSTS
  );

  localStorage.setItem(RECENT_POSTS_KEY, JSON.stringify(updated));
}

export function getRecentlyViewed(): RecentPost[] {
  if (typeof window === "undefined") return [];

  try {
    const stored = localStorage.getItem(RECENT_POSTS_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
}

function getCategoryColor(category: string): string {
  switch (category) {
    case "Active Projects":
      return "#60B5FF";
    case "Completed Projects":
      return "#FF9149";
    case "Learning Notes":
      return "#AFDDFF";
    case "Updates":
      return "#E0FFF1";
    default:
      return "#FFECDB";
  }
}

export function RecentlyViewed() {
  const [recentPosts, setRecentPosts] = useState<RecentPost[]>([]);

  useEffect(() => {
    setRecentPosts(getRecentlyViewed());
  }, []);

  if (recentPosts.length === 0) {
    return null;
  }

  return (
    <div className="mb-12">
      <h2 className="mb-6 font-sans text-2xl font-bold flex items-center gap-2">
        <Clock className="h-6 w-6" />
        Recently Viewed
      </h2>

      <div className="space-y-4">
        {recentPosts.map((post) => (
          <Link key={post._id} href={`/posts/${post.slug}`}>
            <Card className="group m-4 cursor-pointer overflow-hidden rounded-none border-4 border-black bg-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all hover:translate-x-1 hover:translate-y-1 hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
              <CardContent className="p-4">
                <div className="flex items-start gap-4">
                  <div
                    className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border-4 border-black"
                    style={{ backgroundColor: getCategoryColor(post.category) }}
                  >
                    <Calendar className="h-5 w-5" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <h3 className="mb-1 font-bold line-clamp-1 group-hover:underline">
                      {post.title}
                    </h3>
                    <p className="mb-2 text-sm text-gray-600 line-clamp-2 font-serif">
                      {post.summary}
                    </p>
                    <div className="flex items-center gap-2">
                      <Badge
                        className="rounded-lg border-2 border-black text-xs font-bold"
                        style={{
                          backgroundColor: getCategoryColor(post.category),
                        }}
                      >
                        {post.category}
                      </Badge>
                      <span className="text-xs text-gray-500">
                        {formatDate(post.publishedDate)}
                      </span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
