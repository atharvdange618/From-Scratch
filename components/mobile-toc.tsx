"use client";

import { useState } from "react";
import { ChevronDown, List, Link as LinkIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { TocItem } from "@/lib/toc-generator";

interface MobileTOCProps {
  headings: TocItem[];
}

export function MobileTOC({ headings }: MobileTOCProps) {
  const [isOpen, setIsOpen] = useState(false);

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault();
    const element = document.getElementById(id);
    if (element) {
      const yOffset = -80;
      const y = element.getBoundingClientRect().top + window.scrollY + yOffset;
      window.scrollTo({ top: y, behavior: "smooth" });
      window.history.pushState(null, "", `#${id}`);
      setIsOpen(false);
    }
  };

  const handleCopyLink = async (id: string) => {
    const url = `${window.location.origin}${window.location.pathname}#${id}`;
    await navigator.clipboard.writeText(url);
  };

  return (
    <div className="lg:hidden mb-6">
      <Button
        onClick={() => setIsOpen(!isOpen)}
        variant="outline"
        className="w-full justify-between rounded-none border-4 border-black dark:border-gray-700 bg-white dark:bg-gray-800 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,0.1)] hover:bg-[#AFDDFF] dark:hover:bg-gray-700 font-bold"
      >
        <span className="flex items-center gap-2">
          <List className="h-4 w-4" />
          Table of Contents ({headings.length} sections)
        </span>
        <ChevronDown
          className={`h-4 w-4 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
        />
      </Button>

      {isOpen && (
        <div className="mt-2 rounded-none border-4 border-black dark:border-gray-700 bg-white dark:bg-gray-900 p-4 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,0.1)]">
          <ul className="space-y-1 text-sm">
            {headings.map(({ id, text, level }) => (
              <li
                key={id}
                style={{ paddingLeft: `${(level - 2) * 0.75}rem` }}
                className="group"
              >
                <a
                  href={`#${id}`}
                  onClick={(e) => handleClick(e, id)}
                  className="flex items-center justify-between text-left w-full py-2 px-3 rounded-sm transition-all hover:bg-[#AFDDFF] dark:hover:bg-gray-700 border-l-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 font-medium"
                >
                  <span className="flex-1">{text}</span>
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      handleCopyLink(id);
                    }}
                    className="opacity-0 group-hover:opacity-100 transition-opacity ml-2 p-1 hover:bg-white/50 dark:hover:bg-gray-900/50 rounded"
                    aria-label="Copy link to section"
                    title="Copy link to section"
                  >
                    <LinkIcon className="h-3 w-3" />
                  </button>
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
