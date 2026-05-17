"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { useRouter } from "next/navigation";
import { trackEvent } from "@/lib/analytics";
import { useSearchQuery } from "@/lib/hooks/use-search";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Search, Clock, Loader2, ArrowUpDown } from "lucide-react";
import { MarkdownRenderer } from "./markdown-renderer";
import { SearchResult } from "@/app/api/search/route";

interface Post {
  _id: string;
  title: string;
  slug: string;
  summary: string;
  tags: string[];
  category: string;
}

interface Project {
  _id: string;
  name: string;
  slug: string;
  description: string;
  techStack: string[];
}

interface GlobalSearchProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const RECENT_SEARCHES_KEY = "recentSearches";
const MAX_RECENT_SEARCHES = 5;

export function GlobalSearch({ open, onOpenChange }: GlobalSearchProps) {
  const [query, setQuery] = useState("");
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  const handleOpenChange = useCallback(
    (nextOpen: boolean) => {
      if (!nextOpen) {
        setQuery("");
        setSelectedIndex(0);
      }
      onOpenChange(nextOpen);
    },
    [onOpenChange],
  );

  const {
    data: results = [],
    isLoading: isSearching,
    isFetching,
  } = useSearchQuery(query);

  const validSelectedIndex = Math.min(
    selectedIndex,
    Math.max(0, results.length - 1),
  );

  useEffect(() => {
    const stored = localStorage.getItem(RECENT_SEARCHES_KEY);
    if (stored) {
      try {
        setRecentSearches(JSON.parse(stored));
      } catch {
        setRecentSearches([]);
      }
    }
  }, []);

  useEffect(() => {
    if (query.trim().length >= 2 && results.length > 0) {
      trackEvent("search_query", {
        query: query.trim(),
        resultsCount: results.length,
      });
    }
  }, [results.length, query]);

  const saveRecentSearch = useCallback((searchQuery: string) => {
    const trimmed = searchQuery.trim();
    if (!trimmed) return;

    setRecentSearches((prev) => {
      const filtered = prev.filter((s) => s !== trimmed);
      const updated = [trimmed, ...filtered].slice(0, MAX_RECENT_SEARCHES);
      localStorage.setItem(RECENT_SEARCHES_KEY, JSON.stringify(updated));
      return updated;
    });
  }, []);

  const handleSelect = useCallback(
    (result: SearchResult) => {
      saveRecentSearch(query);

      trackEvent("search_result_click", {
        query: query.trim(),
        resultType: result.type,
        resultTitle:
          result.type === "post"
            ? (result.item as Post).title
            : (result.item as Project).name,
        resultSlug: result.item.slug,
      });

      onOpenChange(false);
      setQuery("");

      if (result.type === "post") {
        router.push(`/posts/${result.item.slug}`);
      } else {
        router.push(`/projects/${result.item.slug}`);
      }
    },
    [query, onOpenChange, router, saveRecentSearch],
  );

  const handleRecentSearchClick = useCallback((searchQuery: string) => {
    setQuery(searchQuery);
  }, []);

  const clearRecentSearches = useCallback(() => {
    setRecentSearches([]);
    localStorage.removeItem(RECENT_SEARCHES_KEY);
  }, []);

  useEffect(() => {
    if (!open) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowDown") {
        e.preventDefault();
        setSelectedIndex((prev) =>
          prev < results.length - 1 ? prev + 1 : prev,
        );
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setSelectedIndex((prev) => (prev > 0 ? prev - 1 : prev));
      } else if (e.key === "Enter" && results[validSelectedIndex]) {
        e.preventDefault();
        handleSelect(results[validSelectedIndex]);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [open, results, validSelectedIndex, handleSelect]);

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent
        className="max-w-xl border-2 border-black bg-background p-0 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] sm:rounded-none dark:border-gray-500 dark:bg-neutral-900 dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,0.08)] [&>button]:top-8 [&>button]:right-4"
        onOpenAutoFocus={(e) => {
          e.preventDefault();
          inputRef.current?.focus();
        }}
      >
        <DialogHeader className="border-b-2 border-black p-4 dark:border-gray-500">
          <DialogTitle className="sr-only">Search</DialogTitle>
          <DialogDescription className="sr-only">
            Search through blog posts and projects. Use arrow keys to navigate
            results and press Enter to select.
          </DialogDescription>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400 dark:text-gray-500" />
            <Input
              ref={inputRef}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search posts and projects..."
              className="h-12 rounded-none border-none bg-transparent pl-12 pr-4 text-lg font-medium text-black placeholder:text-gray-400 focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-offset-0 dark:text-white dark:placeholder:text-gray-500"
              aria-label="Search posts and projects"
            />
            {isSearching && (
              <Loader2 className="absolute right-3 top-1/2 h-5 w-5 -translate-y-1/2 animate-spin text-gray-400" />
            )}
          </div>
        </DialogHeader>

        <div className="max-h-[60vh] overflow-y-auto">
          {isFetching || isSearching ? (
            <div className="flex items-center justify-center gap-2 p-8 text-sm text-gray-500 dark:text-gray-400">
              <Loader2 className="h-4 w-4 animate-spin" />
              Searching...
            </div>
          ) : query.trim() ? (
            results.length > 0 ? (
              <div className="p-3">
                <p
                  role="status"
                  aria-live="polite"
                  aria-atomic="true"
                  className="mb-2 px-2 text-xs font-semibold text-gray-500 dark:text-gray-400"
                >
                  {results.length} result{results.length !== 1 ? "s" : ""}
                </p>
                <div className="space-y-2">
                  {results.map((result, index) => {
                    const isPost = result.type === "post";
                    const item = result.item;
                    const title = isPost
                      ? (item as Post).title
                      : (item as Project).name;
                    const description = isPost
                      ? (item as Post).summary
                      : (item as Project).description;

                    return (
                      <button
                        key={`${result.type}-${item._id}`}
                        onClick={() => handleSelect(result)}
                        className={`w-full border-2 p-4 text-left transition-all ${
                          index === validSelectedIndex
                            ? "border-black bg-[#60B5FF] shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] dark:border-gray-600 dark:bg-primary dark:shadow-[2px_2px_0px_0px_rgba(255,255,255,0.08)]"
                            : "border-transparent bg-gray-50 hover:border-gray-200 hover:bg-background hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,0.04)] dark:bg-neutral-800 dark:hover:border-gray-600 dark:hover:bg-neutral-800 dark:hover:shadow-[2px_2px_0px_0px_rgba(255,255,255,0.04)]"
                        }`}
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div className="min-w-0 flex-1">
                            <h3 className="truncate font-semibold text-black dark:text-white">
                              {title}
                            </h3>
                            <MarkdownRenderer
                              content={description}
                              className="mt-0.5 font-serif text-sm text-gray-600 dark:text-gray-400 prose-p:mb-0 prose-p:leading-relaxed"
                              truncate={120}
                            />
                          </div>
                          <span
                            className={`shrink-0 border-2 px-2 py-0.5 text-xs font-semibold ${
                              isPost
                                ? "border-amber-300 bg-amber-50 text-amber-700 dark:border-amber-700 dark:bg-amber-950 dark:text-amber-300"
                                : "border-emerald-300 bg-emerald-50 text-emerald-700 dark:border-emerald-700 dark:bg-emerald-950 dark:text-emerald-300"
                            }`}
                          >
                            {isPost ? "Post" : "Project"}
                          </span>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center px-8 py-16 text-center">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full border-2 border-gray-200 bg-gray-50 dark:border-gray-500 dark:bg-neutral-800">
                  <Search className="h-5 w-5 text-gray-400" />
                </div>
                <p className="font-semibold text-black dark:text-white">
                  No results for &ldquo;{query}&rdquo;
                </p>
                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                  Try a different search term or check your spelling
                </p>
              </div>
            )
          ) : (
            <div className="p-4">
              {recentSearches.length > 0 ? (
                <div>
                  <div className="mb-3 flex items-center justify-between">
                    <h3 className="text-xs font-semibold text-gray-500 dark:text-gray-400">
                      Recent searches
                    </h3>
                    <button
                      onClick={clearRecentSearches}
                      className="text-xs text-gray-400 transition-colors hover:text-black dark:hover:text-white"
                    >
                      Clear
                    </button>
                  </div>
                  <div className="space-y-1.5">
                    {recentSearches.map((search) => (
                      <button
                        key={search}
                        onClick={() => handleRecentSearchClick(search)}
                        className="flex w-full items-center gap-3 rounded-none border-2 border-transparent bg-gray-50 p-3 text-left text-sm font-medium text-gray-700 transition-all hover:border-gray-200 hover:bg-background hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,0.04)] dark:bg-neutral-800 dark:text-gray-300 dark:hover:border-gray-600 dark:hover:bg-neutral-800 dark:hover:shadow-[2px_2px_0px_0px_rgba(255,255,255,0.04)]"
                      >
                        <Clock className="h-4 w-4 shrink-0 text-gray-400" />
                        <span className="truncate">{search}</span>
                      </button>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center px-8 py-16 text-center">
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full border-2 border-gray-200 bg-gray-50 dark:border-gray-500 dark:bg-neutral-800">
                    <Search className="h-5 w-5 text-gray-400" />
                  </div>
                  <p className="font-semibold text-black dark:text-white">
                    Start typing to search
                  </p>
                  <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                    Search across posts and projects
                  </p>
                  <div className="mt-4 flex items-center gap-2 text-xs text-gray-400">
                    <kbd className="rounded border border-gray-300 bg-background px-1.5 py-0.5 font-mono text-gray-600 dark:border-gray-600 dark:bg-neutral-800 dark:text-gray-400">
                      Ctrl+K
                    </kbd>
                    <span>to open anytime</span>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        <div className="border-t-2 border-black bg-gray-50 px-4 py-2.5 dark:border-gray-500 dark:bg-neutral-800">
          <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-gray-500 dark:text-gray-400">
            <span className="flex items-center gap-1">
              <ArrowUpDown className="h-3 w-3" />
              Navigate
            </span>
            <span className="flex items-center gap-1">
              <kbd className="rounded border border-gray-300 bg-background px-1 font-mono dark:border-gray-600 dark:bg-neutral-900">
                ↵
              </kbd>
              Select
            </span>
            <span className="flex items-center gap-1">
              <kbd className="rounded border border-gray-300 bg-background px-1 font-mono dark:border-gray-600 dark:bg-neutral-900">
                Esc
              </kbd>
              Close
            </span>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
