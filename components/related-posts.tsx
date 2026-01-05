"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Clock, Calendar } from "lucide-react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatDate } from "@/lib/dateandnumbers";
import { calculateReadingTime } from "@/lib/reading-time";

interface Post {
  _id: string;
  title: string;
  slug: string;
  summary: string;
  content: string;
  category: string;
  tags: string[];
  publishedDate: string;
  linkedProject?: {
    _id: string;
    name: string;
  };
}

interface RelatedPostsProps {
  currentPostId: string;
  currentCategory: string;
  currentTags: string[];
  linkedProjectId?: string;
}

interface ScoredPost extends Post {
  score: number;
}

export function RelatedPosts({
  currentPostId,
  currentCategory,
  currentTags,
  linkedProjectId,
}: RelatedPostsProps) {
  const [relatedPosts, setRelatedPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchAndScorePosts() {
      try {
        const response = await fetch("/api/posts?isPublished=true");
        if (!response.ok) return;

        const data = await response.json();
        const allPosts: Post[] = data.posts || [];

        // Filter out current post
        const otherPosts = allPosts.filter((p) => p._id !== currentPostId);

        // Calculate similarity scores
        const scoredPosts: ScoredPost[] = otherPosts.map((post) => {
          let score = 0;

          // Same category: +3 points
          if (post.category === currentCategory) {
            score += 3;
          }

          // Each shared tag: +2 points
          const sharedTags = post.tags.filter((tag) =>
            currentTags.includes(tag)
          );
          score += sharedTags.length * 2;

          // Same linked project: +2 points
          if (linkedProjectId && post.linkedProject?._id === linkedProjectId) {
            score += 2;
          }

          // Published within 60 days: +1 point (recency bonus)
          const daysDiff =
            (new Date().getTime() - new Date(post.publishedDate).getTime()) /
            (1000 * 60 * 60 * 24);
          if (daysDiff <= 60) {
            score += 1;
          }

          return { ...post, score };
        });

        // Sort by score (highest first) and take top 3-4
        const topPosts = scoredPosts
          .sort((a, b) => b.score - a.score)
          .filter((p) => p.score >= 2) // Minimum score threshold
          .slice(0, 4);

        // If no related posts with good scores, show 3 random recent posts
        if (topPosts.length === 0) {
          const recentPosts = otherPosts
            .sort(
              (a, b) =>
                new Date(b.publishedDate).getTime() -
                new Date(a.publishedDate).getTime()
            )
            .slice(0, 3);
          setRelatedPosts(recentPosts);
        } else {
          setRelatedPosts(topPosts);
        }
      } catch (error) {
        console.error("Failed to fetch related posts:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchAndScorePosts();
  }, [currentPostId, currentCategory, currentTags, linkedProjectId]);

  if (loading || relatedPosts.length === 0) {
    return null;
  }

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "Active Projects":
        return "#60B5FF";
      case "Completed Projects":
        return "#FF9149";
      case "Learning Notes":
        return "#AFDDFF";
      default:
        return "#E0FFF1";
    }
  };

  return (
    <section className="my-16">
      <div className="mb-8 rounded-none border-4 border-black bg-[#FFECDB] p-6 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
        <h2 className="font-sans text-2xl font-bold md:text-3xl">
          You Might Also Like
        </h2>
        <p className="mt-2 font-serif text-gray-700">
          Related posts based on tags, category, and projects
        </p>
      </div>

      <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        {relatedPosts.map((post) => (
          <Link key={post._id} href={`/posts/${post.slug}`}>
            <Card className="group h-full overflow-hidden rounded-none border-4 border-black bg-white shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] transition-all hover:translate-x-1 hover:translate-y-1 hover:shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]">
              <CardHeader
                className="border-b-4 border-black p-4"
                style={{ backgroundColor: getCategoryColor(post.category) }}
              >
                <div className="mb-2 flex items-center justify-between gap-2">
                  <Badge className="rounded-lg border-2 border-black bg-white px-2 py-1 text-xs font-bold text-black hover:bg-white">
                    {post.category}
                  </Badge>
                </div>
                <CardTitle className="text-lg font-bold leading-tight">
                  {post.title}
                </CardTitle>
              </CardHeader>

              <CardContent className="p-4">
                <p className="mb-4 line-clamp-2 font-serif text-sm text-gray-700">
                  {post.summary}
                </p>

                <div className="mb-3 flex flex-wrap gap-2">
                  <span className="inline-flex items-center gap-1 rounded-lg border-2 border-black bg-white px-2 py-1 text-xs font-bold">
                    <Calendar className="h-3 w-3" />
                    {formatDate(post.publishedDate)}
                  </span>
                  <span className="inline-flex items-center gap-1 rounded-lg border-2 border-black bg-white px-2 py-1 text-xs font-bold">
                    <Clock className="h-3 w-3" />
                    {calculateReadingTime(post.content)}
                  </span>
                </div>

                <div className="mt-3 flex flex-wrap gap-2">
                  {post.tags.slice(0, 2).map((tag) => (
                    <span
                      key={tag}
                      className="inline-block rounded-lg border-2 border-black bg-[#AFDDFF] px-2 py-0.5 text-xs font-bold"
                    >
                      {tag}
                    </span>
                  ))}
                  {post.tags.length > 2 && (
                    <span className="inline-block rounded-lg border-2 border-black bg-gray-200 px-2 py-0.5 text-xs font-bold">
                      +{post.tags.length - 2}
                    </span>
                  )}
                </div>
              </CardContent>

              <CardFooter className="border-t-4 border-black bg-white p-4">
                <Button className="w-full rounded-none border-4 border-black bg-black px-4 py-2 font-bold text-white shadow-[4px_4px_0px_0px_rgba(255,145,73,1)] transition-all group-hover:translate-x-1 group-hover:translate-y-1 group-hover:shadow-[2px_2px_0px_0px_rgba(255,145,73,1)]">
                  Read More
                </Button>
              </CardFooter>
            </Card>
          </Link>
        ))}
      </div>
    </section>
  );
}
