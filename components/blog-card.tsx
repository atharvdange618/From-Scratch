"use client";

import { useRouter } from "next/navigation";
import {
  Calendar,
  Tag,
  Clock,
  Link as LinkIcon,
  Linkedin,
  Share2,
} from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";
import { getCategoryColor } from "@/lib/categories";
import { formatDate } from "@/lib/dateandnumbers";
import { handlePostHover } from "@/lib/prefetch";
import { trackEvent } from "@/lib/analytics";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useToast } from "./ui/use-toast";
import { ToastAction } from "./ui/toast";
import { handleLinkedInShare, handleXShare } from "@/lib/share";

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
            : "Try copying manually with Cmd+C or Ctrl+C",
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

  const categoryColor = getCategoryColor(post.category);

  return (
    <Card
      className="group flex h-full flex-col overflow-hidden rounded-none border-2 border-black bg-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] dark:border-gray-700 dark:bg-gray-800 dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,0.08)] dark:hover:shadow-[2px_2px_0px_0px_rgba(255,255,255,0.08)]"
      onMouseEnter={handleHover}
    >
      <CardHeader className="border-b-2 border-black bg-white p-4 dark:border-gray-700 dark:bg-gray-800">
        <div className="mb-2 flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <div
              className="flex h-9 w-9 items-center justify-center rounded-full border-2 border-black p-1.5 dark:text-black"
              style={{
                backgroundColor: categoryColor,
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

          <Popover>
            <PopoverTrigger asChild>
              <button
                className="rounded-none border-2 border-black bg-gray-200 p-1.5 text-black transition-all hover:translate-x-0.5 hover:translate-y-0.5 hover:bg-[#FF9149] hover:text-white hover:shadow-[1.5px_1.5px_0px_0px_rgba(0,0,0,1)] dark:border-gray-700 dark:bg-gray-700 dark:text-white dark:hover:shadow-[1.5px_1.5px_0px_0px_rgba(255,255,255,0.1)]"
                aria-label="Share this post"
              >
                <Share2 className="h-4 w-4" />
              </button>
            </PopoverTrigger>
            <PopoverContent
              align="end"
              sideOffset={8}
              className="w-auto rounded-none border-2 border-black bg-white p-2 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] dark:border-gray-700 dark:bg-gray-800 dark:shadow-[3px_3px_0px_0px_rgba(255,255,255,0.08)]"
            >
              <div className="flex flex-col gap-1.5">
                <button
                  onClick={() =>
                    handleXShare({
                      title: post.title,
                      url: postUrl,
                      description: post.summary,
                    })
                  }
                  className="flex items-center gap-2 rounded-none border-2 border-black bg-black px-3 py-2 text-xs font-bold text-white transition-all hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-[1.5px_1.5px_0px_0px_rgba(0,0,0,1)] dark:border-gray-700 dark:bg-gray-700 dark:hover:shadow-[1.5px_1.5px_0px_0px_rgba(255,255,255,0.1)]"
                  aria-label="Share on X"
                >
                  <svg
                    className="h-3.5 w-3.5"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                  </svg>
                  Share on X
                </button>
                <button
                  onClick={() =>
                    handleLinkedInShare({ title: post.title, url: postUrl })
                  }
                  className="flex items-center gap-2 rounded-none border-2 border-black bg-[#0A66C2] px-3 py-2 text-xs font-bold text-white transition-all hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-[1.5px_1.5px_0px_0px_rgba(0,0,0,1)] dark:border-gray-700 dark:hover:shadow-[1.5px_1.5px_0px_0px_rgba(255,255,255,0.1)]"
                  aria-label="Share on LinkedIn"
                >
                  <Linkedin className="h-3.5 w-3.5" />
                  Share on LinkedIn
                </button>
                <button
                  onClick={() => handleCopyLink({ title: post.title })}
                  className="flex items-center gap-2 rounded-none border-2 border-black bg-gray-200 px-3 py-2 text-xs font-bold text-black transition-all hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-[1.5px_1.5px_0px_0px_rgba(0,0,0,1)] dark:border-gray-700 dark:bg-gray-700 dark:text-white dark:hover:shadow-[1.5px_1.5px_0px_0px_rgba(255,255,255,0.1)]"
                  aria-label="Copy link"
                >
                  <LinkIcon className="h-3.5 w-3.5" />
                  Copy Link
                </button>
              </div>
            </PopoverContent>
          </Popover>
        </div>
        <CardTitle className="text-xl font-bold leading-tight">
          {post.title}
        </CardTitle>
      </CardHeader>
      <CardContent className="flex flex-1 flex-col p-4">
        <p className="mb-4 line-clamp-3 font-serif dark:text-gray-300">
          {post.summary}
        </p>

        <div className="mb-3 flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
          <Clock className="h-4 w-4" />
          <span className="font-medium tabular-nums">
            {post.readingTime || "Quick read"}
          </span>
        </div>

        <div className="mb-3">
          <span
            className="inline-flex items-center gap-1.5 border-2 border-black px-2 py-0.5 text-xs font-semibold dark:border-gray-700"
            style={{ backgroundColor: categoryColor }}
          >
            <span
              className="h-1.5 w-1.5 rounded-full bg-black"
              style={{ backgroundColor: "rgba(0,0,0,0.4)" }}
            />
            {post.category}
          </span>
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
                className="inline-flex items-center gap-1 rounded-none border-2 border-gray-300 bg-[#AFDDFF] px-2 py-0.5 text-xs font-bold transition-all hover:translate-x-0.5 hover:translate-y-0.5 hover:bg-[#60B5FF] hover:shadow-[1.5px_1.5px_0px_0px_rgba(0,0,0,1)] dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:hover:bg-gray-600 dark:hover:shadow-[1.5px_1.5px_0px_0px_rgba(255,255,255,0.08)]"
                aria-label={`Filter by ${tag}`}
              >
                <Tag className="h-3 w-3" />
                {tag}
              </button>
            ) : (
              <span
                key={tag}
                className="inline-flex items-center gap-1 rounded-none border-2 border-gray-300 bg-[#AFDDFF] px-2 py-0.5 text-xs font-bold dark:border-gray-600 dark:bg-gray-700 dark:text-white"
              >
                <Tag className="h-3 w-3" />
                {tag}
              </span>
            ),
          )}
          {post.tags && post.tags.length > 3 && (
            <span
              className="inline-flex items-center rounded-none border-2 border-gray-300 bg-gray-200 px-2 py-0.5 text-xs font-bold dark:border-gray-600 dark:bg-gray-700 dark:text-white"
              title={post.tags.slice(3).join(", ")}
            >
              +{post.tags.length - 3}
            </span>
          )}
        </div>

        <div className="mt-auto flex items-center gap-2 pt-4">
          <div className="flex h-7 w-7 items-center justify-center rounded-full border-2 border-black bg-[#FF9149] dark:border-gray-700">
            <span className="text-[10px] font-bold text-black">AD</span>
          </div>
          <span className="font-sans text-base font-semibold dark:text-gray-300">
            Atharv Dange
          </span>
        </div>
      </CardContent>
      <CardFooter className="border-t-2 border-black bg-white p-4 dark:border-gray-700 dark:bg-gray-800">
        <button
          onClick={() => router.push(`/posts/${post.slug}`)}
          className="w-full rounded-none border-2 border-black bg-black px-4 py-2 font-bold text-white shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] transition-all hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-[1.5px_1.5px_0px_0px_rgba(0,0,0,1)] dark:border-white dark:shadow-[3px_3px_0px_0px_rgba(255,255,255,0.15)] dark:hover:shadow-[1.5px_1.5px_0px_0px_rgba(255,255,255,0.15)]"
        >
          Read Post
          <span className="ml-1 inline-block">&rarr;</span>
        </button>
      </CardFooter>
    </Card>
  );
}
