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
      <Tag className="h-4 w-4 text-gray-600" />
      {tags.map((tag, index) => (
        <Link
          key={index}
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
            className="cursor-pointer rounded-none border-2 border-black bg-white px-3 py-1 font-serif transition-all hover:translate-x-0.5 hover:translate-y-0.5 hover:bg-[#AFDDFF] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
          >
            {tag}
          </Badge>
        </Link>
      ))}
    </div>
  );
}
