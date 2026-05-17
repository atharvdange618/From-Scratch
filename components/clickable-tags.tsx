"use client";

import Link from "next/link";
import { Tag } from "@deemlol/next-icons";
import { Badge } from "@/components/ui/badge";
import { trackEvent } from "@/lib/analytics";

interface ClickableTagsProps {
  tags: string[];
  postTitle: string;
}

export function ClickableTags({ tags, postTitle }: ClickableTagsProps) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <Tag className="h-4 w-4 text-gray-600 dark:text-gray-400" />
      {tags.map((tag) => (
        <Link
          key={tag}
          href={`/blogs?tag=${encodeURIComponent(tag)}`}
          onClick={() => {
            trackEvent("tag_click", {
              tag,
              source: "post_detail",
              postTitle,
            });
          }}
        >
          <Badge
            variant="outline"
            className="cursor-pointer rounded-none border-2 border-black dark:border-gray-700 bg-white dark:bg-gray-900 dark:text-white px-3 py-1 font-serif transition-all hover:bg-gray-100 dark:hover:bg-gray-800"
          >
            {tag}
          </Badge>
        </Link>
      ))}
    </div>
  );
}
