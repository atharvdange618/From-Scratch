"use client";

import { useState } from "react";
import { Copy, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { ToastAction } from "@/components/ui/toast";
import { trackEvent } from "@/lib/analytics";
import { handleLinkedInShare, handleXShare } from "@/lib/share";

interface SocialShareProps {
  title: string;
  url: string;
  description?: string;
}

export function SocialShare({ title, url, description }: SocialShareProps) {
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);

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
            : "Try copying manually with Cmd+C or Ctrl+C, or use a different browser.",
        action: (
          <ToastAction
            altText="Retry copying"
            onClick={handleCopyLink}
            className="rounded-none border-2 border-black bg-background px-3 py-1 font-bold hover:bg-[#FF9149]"
          >
            Retry
          </ToastAction>
        ),
      });
    }
  };

  return (
    <div className="flex flex-col gap-3 md:items-end">
      <p className="text-xs text-zinc-400 dark:text-zinc-500 font-medium tracking-wide">
        Share this post
      </p>
      <div className="flex items-center gap-1.5">
        <Button
          variant="outline"
          size="icon"
          onClick={() => handleXShare({ title, url, description })}
          className="rounded-full border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-400 hover:text-[#1DA1F2] dark:hover:text-[#1DA1F2] hover:border-[#1DA1F2] dark:hover:border-[#1DA1F2] hover:-translate-y-0.5 transition-all"
        >
          <span className="sr-only">Share on X</span>
          <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
            <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
          </svg>
        </Button>

        <Button
          variant="outline"
          size="icon"
          onClick={() => handleLinkedInShare({ title, url })}
          className="rounded-full border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-400 hover:text-[#0A66C2] dark:hover:text-[#0A66C2] hover:border-[#0A66C2] dark:hover:border-[#0A66C2] hover:-translate-y-0.5 transition-all"
        >
          <span className="sr-only">Share on LinkedIn</span>
          <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
            <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
          </svg>
        </Button>

        <div className="w-px h-6 bg-zinc-200 dark:bg-zinc-800 mx-1" />

        <Button
          variant="outline"
          size="icon"
          onClick={handleCopyLink}
          className="rounded-full border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 hover:border-zinc-300 dark:hover:border-zinc-700 hover:-translate-y-0.5 transition-all"
        >
          <span className="sr-only">{copied ? "Copied" : "Copy link"}</span>
          {copied ? (
            <Check className="h-4 w-4 text-green-600 dark:text-green-500" />
          ) : (
            <Copy className="h-4 w-4" />
          )}
        </Button>
      </div>
    </div>
  );
}
