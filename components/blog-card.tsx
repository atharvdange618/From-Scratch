"use client";

import { useRouter } from "next/navigation";
import {
  Calendar,
  Tag,
  Clock,
  Link as LinkIcon,
  Linkedin,
  Facebook,
} from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";
import { getCategoryColor } from "@/lib/categories";
import { formatDate } from "@/lib/dateandnumbers";
import { handlePostHover } from "@/lib/prefetch";
import { trackEvent } from "@/lib/analytics";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "./ui/use-toast";
import { ToastAction } from "./ui/toast";
import {
  handleFacebookShare,
  handleLinkedInShare,
  handleXShare,
} from "@/lib/share";

interface BlogPost {
  _id: string;
  slug: string;
  title: string;
  summary: string;
  category: string;
  publishedDate?: string | Date;
  createdAt?: string | Date;
  readingTime?: string;
  tags?: string[];
}

interface BlogCardProps {
  post: BlogPost;
  onTagClick?: (tag: string) => void;
  enableTagFiltering?: boolean;
}

export function BlogCard({
  post,
  onTagClick,
  enableTagFiltering = false,
}: BlogCardProps) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const baseUrl = typeof window !== "undefined" ? window.location.origin : "";
  const postUrl = `${baseUrl}/posts/${post.slug}`;

  const handleHover = () => {
    router.prefetch(`/posts/${post.slug}`);
    handlePostHover(queryClient, post.slug);
  };

  const handleCopyLink = async ({ title }: { title: string }) => {
    try {
      await navigator.clipboard.writeText(postUrl);

      toast({
        title: "Link copied!",
        description: `"${title}" URL is ready to share`,
      });

      trackEvent("share_post", {
        method: "copy",
        postTitle: title,
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Clipboard access denied",
        description:
          error instanceof Error
            ? error.message
            : "Unable to copy. Try selecting the URL manually.",
        action: (
          <ToastAction
            altText="Retry copying"
            onClick={() => handleCopyLink({ title })}
            className="rounded-none border-2 border-black bg-white px-3 py-1 font-bold hover:bg-[#FF9149]"
          >
            Retry
          </ToastAction>
        ),
      });
    }
  };

  return (
    <Card
      className="group cursor-pointer overflow-hidden rounded-none border-4 border-black dark:border-gray-700 bg-white dark:bg-gray-800 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] dark:shadow-[8px_8px_0px_0px_rgba(255,255,255,0.1)] transition-all hover:translate-x-1 hover:translate-y-1 hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:hover:shadow-[4px_4px_0px_0px_rgba(255,255,255,0.1)] h-full flex flex-col"
      onClick={() => router.push(`/posts/${post.slug}`)}
      onMouseEnter={handleHover}
    >
      <CardHeader className="border-b-4 border-black dark:border-gray-700 bg-white dark:bg-gray-800 p-4">
        <div className="mb-2 flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <div
              className="h-10 w-10 rounded-full border-2 border-black p-2 dark:text-black"
              style={{
                backgroundColor: getCategoryColor(post.category),
              }}
            >
              <Calendar className="h-full w-full" />
            </div>
            <span className="text-sm font-bold">
              {formatDate(
                post.publishedDate instanceof Date
                  ? post.publishedDate.toISOString()
                  : post.publishedDate ||
                      (post.createdAt instanceof Date
                        ? post.createdAt.toISOString()
                        : post.createdAt) ||
                      new Date().toISOString(),
              )}
            </span>
          </div>

          <div
            className="flex items-center gap-1"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() =>
                handleXShare({
                  title: post.title,
                  url: postUrl,
                  description: post.summary,
                })
              }
              className="rounded-none border-2 border-black dark:border-gray-700 bg-black dark:bg-gray-700 p-1.5 text-white transition-all hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
              aria-label="Share on X"
            >
              <svg className="h-3 w-3" fill="currentColor" viewBox="0 0 24 24">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
              </svg>
            </button>
            <button
              onClick={() =>
                handleLinkedInShare({ title: post.title, url: postUrl })
              }
              className="rounded-none border-2 border-black dark:border-gray-700 bg-[#0A66C2] p-1.5 text-white transition-all hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
              aria-label="Share on LinkedIn"
            >
              <Linkedin className="h-3 w-3" />
            </button>
            <button
              onClick={() =>
                handleFacebookShare({ title: post.title, url: postUrl })
              }
              className="rounded-none border-2 border-black dark:border-gray-700 bg-[#1877F2] p-1.5 text-white transition-all hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
              aria-label="Share on Facebook"
            >
              <Facebook className="h-3 w-3" />
            </button>
            <button
              onClick={() => handleCopyLink({ title: post.title })}
              className="rounded-none border-2 border-black dark:border-gray-700 bg-gray-200 dark:bg-gray-700 p-1.5 text-black dark:text-white transition-all hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
              aria-label="Copy link"
            >
              <LinkIcon className="h-3 w-3" />
            </button>
          </div>
        </div>
        <CardTitle className="text-xl font-bold leading-tight">
          {post.title}
        </CardTitle>
      </CardHeader>
      <CardContent className="p-4 flex-1">
        <p className="mb-4 line-clamp-3 font-serif dark:text-gray-300">
          {post.summary}
        </p>

        <div className="mb-3 flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
          <Clock className="h-4 w-4" />
          <span className="font-medium">
            {post.readingTime || "5 min read"}
          </span>
        </div>

        <div className="mb-3">
          <Badge
            className="rounded-lg border-2 border-black font-bold"
            style={{
              backgroundColor: getCategoryColor(post.category),
            }}
          >
            {post.category}
          </Badge>
        </div>

        <div className="flex flex-wrap gap-2">
          {post.tags?.slice(0, 3).map((tag) =>
            enableTagFiltering ? (
              <button
                key={tag}
                onClick={(e) => {
                  e.stopPropagation();
                  onTagClick?.(tag);
                  trackEvent("blog_tag_click", { tag });
                }}
                className="inline-block rounded-lg border-2 border-black dark:border-gray-700 bg-[#AFDDFF] dark:bg-gray-700 dark:text-white px-2 py-1 text-xs font-bold transition-all hover:translate-x-0.5 hover:translate-y-0.5 hover:bg-[#60B5FF] dark:hover:bg-gray-600 hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] dark:hover:shadow-[2px_2px_0px_0px_rgba(255,255,255,0.1)]"
                aria-label={`Filter by ${tag}`}
              >
                <Tag className="mr-1 inline h-3 w-3" />
                {tag}
              </button>
            ) : (
              <span
                key={tag}
                className="inline-block rounded-lg border-2 border-black dark:border-gray-700 bg-[#AFDDFF] dark:bg-gray-700 dark:text-white px-2 py-1 text-xs font-bold"
              >
                <Tag className="mr-1 inline h-3 w-3" />
                {tag}
              </span>
            ),
          )}
          {post.tags && post.tags.length > 3 && (
            <span className="inline-block rounded-lg border-2 border-black dark:border-gray-700 bg-gray-200 dark:bg-gray-700 dark:text-white px-2 py-1 text-xs font-bold">
              +{post.tags.length - 3}
            </span>
          )}
        </div>
      </CardContent>
      <CardFooter className="border-t-4 border-black dark:border-gray-700 bg-white dark:bg-gray-800 p-4">
        <Button
          onClick={() => router.push(`/posts/${post.slug}`)}
          className="w-full rounded-none border-4 border-black dark:border-gray-700 bg-[#FF9149] px-4 py-2 font-bold text-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,0.1)] transition-all group-hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] dark:group-hover:shadow-[2px_2px_0px_0px_rgba(255,255,255,0.1)]"
        >
          Read More
        </Button>
      </CardFooter>
    </Card>
  );
}
