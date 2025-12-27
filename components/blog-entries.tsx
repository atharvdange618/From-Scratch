"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Code, Rocket, BookOpen, Lightbulb, Loader2, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { formatDate } from "@/lib/dateandnumbers";
import { calculateReadingTime } from "@/lib/reading-time";

interface BlogPost {
  _id: string;
  title: string;
  slug: string;
  summary: string;
  content: string;
  tags: string[];
  category: string;
  isPublished: boolean;
  publishedDate: string;
  linkedProject?: {
    _id: string;
    name: string;
    slug: string;
  };
}

const getPostIcon = (tags: string[], category: string) => {
  const tagStr = tags.join(" ").toLowerCase();
  const catStr = category.toLowerCase();

  if (tagStr.includes("reiatsu") || tagStr.includes("framework")) {
    return { icon: <Code className="h-full w-full" />, bg: "#AFDDFF" };
  }
  if (tagStr.includes("telemetry") || tagStr.includes("analytics")) {
    return { icon: <Rocket className="h-full w-full" />, bg: "#FFECDB" };
  }
  if (tagStr.includes("archive") || tagStr.includes("mobile")) {
    return { icon: <Lightbulb className="h-full w-full" />, bg: "#E0FFF1" };
  }
  if (tagStr.includes("journey") || catStr.includes("update")) {
    return { icon: <BookOpen className="h-full w-full" />, bg: "#AFDDFF" };
  }

  return { icon: <Code className="h-full w-full" />, bg: "#AFDDFF" };
};

export function BlogEntries() {
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchPosts() {
      try {
        const response = await fetch("/api/posts?isPublished=true&limit=4");
        if (!response.ok) {
          throw new Error("Failed to fetch posts");
        }
        const data = await response.json();
        setBlogPosts(data.posts || []);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load posts");
      } finally {
        setLoading(false);
      }
    }

    fetchPosts();
  }, []);

  if (loading) {
    return (
      <section className="mb-16" id="recent-posts">
        <h2 className="mb-8 font-sans text-3xl font-bold">Recent Posts</h2>
        <div className="flex items-center justify-center rounded-none border-4 border-black bg-[#AFDDFF] p-16">
          <Loader2 className="h-12 w-12 animate-spin" />
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="mb-16" id="recent-posts">
        <h2 className="mb-8 font-sans text-3xl font-bold">Recent Posts</h2>
        <div className="flex flex-col items-center justify-center rounded-none border-4 border-black bg-[#FFECDB] p-16">
          <p className="text-xl font-bold">Error loading posts: {error}</p>
        </div>
      </section>
    );
  }

  return (
    <section className="mb-12 md:mb-16" id="recent-posts">
      <div className="mb-6 md:mb-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <h2 className="font-sans text-2xl md:text-3xl font-bold">
          Recent Posts
        </h2>
        <Link href="/blogs">
          <Button className="rounded-none border-4 border-black bg-white px-4 md:px-6 py-2 text-sm md:text-base font-bold shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all hover:translate-x-1 hover:translate-y-1 hover:bg-[#AFDDFF] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
            View All Posts
          </Button>
        </Link>
      </div>

      <div className="grid gap-5 md:gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        {blogPosts.map((post) => {
          const { icon, bg } = getPostIcon(post.tags, post.category);

          return (
            <Link key={post._id} href={`/posts/${post.slug}`}>
              <Card className="group flex flex-col overflow-hidden rounded-none border-4 border-black bg-white shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] md:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] transition-all hover:translate-x-1 hover:translate-y-1 hover:shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] md:hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                <CardHeader className="border-b-4 border-black bg-white p-3 md:p-4">
                  <div className="mb-2 flex items-center gap-2">
                    <div
                      className="h-10 w-10 rounded-full border-2 border-black p-2"
                      style={{ backgroundColor: bg }}
                    >
                      {icon}
                    </div>
                    <div className="flex-1">
                      <span className="text-sm font-bold">
                        {formatDate(post.publishedDate)}
                      </span>
                      <div className="mt-1">
                        <span className="inline-block rounded-lg border-2 border-black bg-[#FFECDB] px-2 py-0.5 text-xs font-bold">
                          {post.category}
                        </span>
                      </div>
                    </div>
                  </div>
                  <CardTitle className="text-xl font-bold leading-tight">
                    {post.title}
                  </CardTitle>
                </CardHeader>
                <CardContent className="flex-1 px-4 pt-4 pb-0">
                  <p className="mb-3 font-serif text-sm leading-relaxed">
                    {post.summary}
                  </p>
                  <div className="mb-3">
                    <span className="inline-flex items-center gap-1.5 rounded-lg border-2 border-black bg-white px-2 py-1 text-xs font-bold">
                      <Clock className="h-3 w-3" />
                      {calculateReadingTime(post.content)}
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-2 pb-4">
                    {post.tags.map((tag) => (
                      <span
                        key={tag}
                        className="inline-block rounded-lg border-2 border-black bg-[#AFDDFF] px-2 py-1 text-xs font-bold"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </CardContent>
                <CardFooter className="mt-auto border-t-4 border-black bg-[#AFDDFF] p-4">
                  <Button className="w-full rounded-none border-4 border-black bg-black px-6 py-3 font-bold text-white shadow-[4px_4px_0px_0px_rgba(255,145,73,1)] transition-all hover:translate-x-1 hover:translate-y-1 hover:shadow-[2px_2px_0px_0px_rgba(255,145,73,1)]">
                    Read More
                  </Button>
                </CardFooter>
              </Card>
            </Link>
          );
        })}
      </div>

      {blogPosts.length === 0 && (
        <div className="flex flex-col items-center justify-center rounded-none border-4 border-dashed border-black bg-[#AFDDFF] p-16">
          <svg
            className="mb-6 h-48 w-48"
            viewBox="0 0 200 200"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <rect
              x="40"
              y="60"
              width="120"
              height="100"
              fill="#60B5FF"
              stroke="#000"
              strokeWidth="4"
            />
            <rect x="60" y="80" width="80" height="8" fill="#000" />
            <rect x="60" y="100" width="60" height="8" fill="#000" />
            <rect x="60" y="120" width="70" height="8" fill="#000" />
            <circle
              cx="100"
              cy="40"
              r="20"
              fill="#FF9149"
              stroke="#000"
              strokeWidth="4"
            />
            <path
              d="M90 35 L95 40 L110 25"
              stroke="#000"
              strokeWidth="4"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          <h3 className="mb-2 text-2xl font-bold">No Posts Yet</h3>
        </div>
      )}
    </section>
  );
}
