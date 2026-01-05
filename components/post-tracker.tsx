"use client";

import { useEffect } from "react";
import { addToRecentlyViewed } from "@/components/recently-viewed";

interface PostTrackerProps {
  post: {
    _id: string;
    title: string;
    slug: string;
    summary: string;
    category: string;
    publishedDate: string;
  };
}

export function PostTracker({ post }: PostTrackerProps) {
  useEffect(() => {
    addToRecentlyViewed({
      _id: post._id,
      title: post.title,
      slug: post.slug,
      summary: post.summary,
      category: post.category,
      publishedDate: post.publishedDate,
    });
  }, [post]);

  return null;
}
