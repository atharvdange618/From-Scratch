"use client";

import { useEffect, useState, useRef } from "react";
import { Link as LinkIcon } from "lucide-react";
import type { TocItem } from "@/lib/toc-generator";

interface TableOfContentsProps {
  headings: TocItem[];
}

export function TableOfContents({ headings }: TableOfContentsProps) {
  const [activeId, setActiveId] = useState<string>("");
  const navRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        });
      },
      {
        rootMargin: "-100px 0px -66% 0px",
        threshold: 1.0,
      },
    );

    headings.forEach(({ id }) => {
      const element = document.getElementById(id);
      if (element) {
        observer.observe(element);
      }
    });

    return () => observer.disconnect();
  }, [headings]);

  useEffect(() => {
    if (activeId && navRef.current) {
      const activeElement = navRef.current.querySelector(
        `a[href="#${activeId}"]`,
      );
      if (activeElement) {
        const navRect = navRef.current.getBoundingClientRect();
        const elementRect = activeElement.getBoundingClientRect();

        const relativeTop = elementRect.top - navRect.top;
        const relativeBottom = elementRect.bottom - navRect.top;

        if (relativeTop < 0 || relativeBottom > navRect.height) {
          const scrollTo =
            navRef.current.scrollTop +
            relativeTop -
            navRect.height / 2 +
            elementRect.height / 2;

          navRef.current.scrollTo({
            top: scrollTo,
            behavior: "smooth",
          });
        }
      }
    }
  }, [activeId]);

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault();
    const element = document.getElementById(id);
    if (element) {
      const yOffset = -80;
      const y = element.getBoundingClientRect().top + window.scrollY + yOffset;
      window.scrollTo({ top: y, behavior: "smooth" });
      window.history.pushState(null, "", `#${id}`);
    }
  };

  const handleCopyLink = async (id: string) => {
    const url = `${window.location.origin}${window.location.pathname}#${id}`;
    await navigator.clipboard.writeText(url);
  };

  return (
    <nav
      ref={navRef}
      className="sticky top-24 max-h-[calc(100vh-8rem)] overflow-y-auto rounded-none border-4 border-black dark:border-gray-700 bg-white dark:bg-gray-800 p-6 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,0.1)]"
      aria-label="Table of contents"
    >
      <h2 className="mb-4 text-lg font-bold border-b-4 border-black dark:border-gray-700 pb-3">
        On This Page
      </h2>
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
              className={`
                flex items-center justify-between text-left w-full py-2 px-3 rounded-sm transition-all
                hover:bg-[#AFDDFF] dark:hover:bg-gray-700
                ${
                  activeId === id
                    ? "bg-[#60B5FF] dark:bg-gray-700 font-bold text-black dark:text-white border-l-4 border-black dark:border-primary"
                    : "border-l-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300"
                }
              `}
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
    </nav>
  );
}
