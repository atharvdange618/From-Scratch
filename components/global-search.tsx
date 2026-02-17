"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { trackEvent } from "@/lib/analytics";
import { useSearchQuery } from "@/lib/hooks/use-search";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Search, Clock, Loader2 } from "lucide-react";
import { MarkdownRenderer } from "./markdown-renderer";

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

interface SearchResult {
  type: "post" | "project";
  item: Post | Project;
  score: number;
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
  const router = useRouter();

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
      } catch (e) {
        console.error("Failed to parse recent searches:", e);
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

  useEffect(() => {
    if (!open) {
      setQuery("");
      setSelectedIndex(0);
    }
  }, [open]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl border-4 border-black dark:border-gray-700 bg-white dark:bg-gray-900 p-0 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] dark:shadow-[8px_8px_0px_0px_rgba(255,255,255,0.1)] sm:rounded-none [&>button]:top-[2.30rem]">
        <DialogHeader className="border-b-4 border-black  dark:border-gray-700 p-4">
          <DialogTitle className="sr-only">Search</DialogTitle>
          <div className="relative">
            <Search
              className={`absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 transition-colors dark:text-gray-400 ${
                isSearching ? "animate-pulse text-gray-400" : ""
              }`}
            />
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search posts and projects..."
              className="h-12 rounded-none border-none bg-transparent dark:text-white pl-12 pr-4 text-lg font-medium focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-offset-0 dark:placeholder:text-gray-500"
              autoFocus
              aria-label="Search posts and projects"
            />
            {isSearching && (
              <Loader2 className="absolute right-3 top-1/2 h-5 w-5 -translate-y-1/2 animate-spin text-gray-500" />
            )}
          </div>
        </DialogHeader>

        <div className="max-h-[60vh] overflow-y-auto">
          {isFetching || isSearching ? (
            <div className="flex items-center justify-center p-8 text-gray-500 dark:text-gray-400">
              <Loader2 className="mr-2 h-5 w-5 animate-spin" />
              Searching...
            </div>
          ) : query.trim() ? (
            results.length > 0 ? (
              <div className="p-2">
                <div className="mb-3 px-2">
                  <p className="text-sm font-bold text-gray-600 dark:text-gray-400">
                    Found {results.length} result
                    {results.length !== 1 ? "s" : ""}
                  </p>
                </div>
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
                      className={`w-full rounded-none border-4 border-black dark:border-gray-700 p-4 text-left transition-all ${
                        index === validSelectedIndex
                          ? "bg-[#60B5FF] shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,0.1)]"
                          : "bg-white dark:bg-gray-800 hover:bg-[#AFDDFF] dark:hover:bg-gray-700"
                      } ${index > 0 ? "mt-2" : ""}`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="min-w-0 flex-1">
                          <h3 className="truncate font-bold">{title}</h3>
                          <MarkdownRenderer
                            content={description}
                            className="mb-4 font-serif text-gray-700 dark:text-gray-300 prose-p:leading-relaxed prose-p:mb-0"
                            truncate={100}
                          />
                        </div>
                        <span
                          className={`shrink-0 rounded-none border-2 border-black dark:border-gray-700 px-2 py-1 text-xs font-bold ${
                            isPost
                              ? "bg-[#FF9149] text-white"
                              : "bg-[#E0FFF1] text-black dark:text-gray-900"
                          }`}
                        >
                          {isPost ? "BLOG" : "PROJECT"}
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center p-12 text-gray-500 dark:text-gray-400">
                <div className="mb-4 rounded-full border-4 border-black dark:border-gray-700 bg-[#AFDDFF] dark:bg-gray-800 p-4">
                  <Search className="h-12 w-12" />
                </div>
                <p className="mb-1 text-lg font-bold text-black dark:text-white">
                  No results found
                </p>
                <p className="text-sm">
                  Try a different search term or check your spelling
                </p>
                <div className="mt-4 rounded-none border-2 border-black dark:border-gray-700 bg-[#E0FFF1] dark:bg-gray-800 p-3">
                  <p className="text-xs font-bold text-gray-800 dark:text-gray-300">
                    💡 Search Tips:
                  </p>
                  <ul className="mt-1 space-y-1 text-xs text-gray-700 dark:text-gray-400">
                    <li>
                      • Try tags like 'react', 'javascript', or 'database'
                    </li>
                    <li>• Search by post titles or project names</li>
                    <li>• Use keywords from summaries</li>
                  </ul>
                </div>
                {query.length < 2 && (
                  <p className="mt-2 text-xs font-medium text-gray-600 dark:text-gray-400">
                    Tip: Type at least 2 characters to search
                  </p>
                )}
              </div>
            )
          ) : (
            <div className="p-4">
              {recentSearches.length > 0 ? (
                <div>
                  <div className="mb-3 flex items-center justify-between">
                    <h3 className="text-sm font-bold text-gray-600 dark:text-gray-400">
                      Recent Searches
                    </h3>
                    <button
                      onClick={clearRecentSearches}
                      className="text-xs font-medium text-gray-500 dark:text-gray-400 hover:text-black dark:hover:text-white"
                    >
                      Clear all
                    </button>
                  </div>
                  <div className="space-y-2">
                    {recentSearches.map((search) => (
                      <button
                        key={search}
                        onClick={() => handleRecentSearchClick(search)}
                        className="flex w-full items-center gap-3 rounded-none border-2 border-black dark:border-gray-700 bg-white dark:bg-gray-800 dark:text-white p-3 text-left font-medium transition-all hover:bg-[#AFDDFF] dark:hover:bg-gray-700 hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] dark:hover:shadow-[2px_2px_0px_0px_rgba(255,255,255,0.1)]"
                      >
                        <Clock className="h-4 w-4 shrink-0" />
                        <span className="truncate">{search}</span>
                      </button>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-12 text-gray-500 dark:text-gray-400">
                  <div className="mb-4 rounded-full border-4 border-black dark:border-gray-700 bg-[#E0FFF1] dark:bg-gray-800 p-4">
                    <Search className="h-12 w-12" />
                  </div>
                  <p className="mb-1 text-lg font-bold text-black dark:text-white">
                    Start typing to search
                  </p>
                  <p className="text-sm">
                    Search across all posts and projects
                  </p>
                  <div className="mt-4 rounded-none border-2 border-black dark:border-gray-700 bg-white dark:bg-gray-900 p-3">
                    <p className="text-xs font-bold text-gray-800 dark:text-gray-300 mb-2">
                      💡 What can you search?
                    </p>
                    <ul className="space-y-1 text-xs text-gray-700 dark:text-gray-400">
                      <li>• Post titles and summaries</li>
                      <li>• Project names and descriptions</li>
                      <li>• Tags: react, javascript, database, etc.</li>
                      <li>• Categories and tech stack</li>
                    </ul>
                  </div>
                  <div className="mt-4 flex items-center gap-2 text-xs">
                    <kbd className="rounded border-2 border-black dark:border-gray-700 bg-white dark:bg-gray-800 dark:text-white px-2 py-1 font-bold">
                      Ctrl
                    </kbd>
                    <span className="font-bold">+</span>
                    <kbd className="rounded border-2 border-black dark:border-gray-700 bg-white dark:bg-gray-800 dark:text-white px-2 py-1 font-bold">
                      K
                    </kbd>
                    <span className="text-gray-600 dark:text-gray-400">
                      to open anytime
                    </span>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        <div className="border-t-4 border-black dark:border-gray-700 bg-[#FFECDB] dark:bg-gray-800 p-3">
          <div className="flex flex-wrap gap-4 text-xs font-medium text-gray-600 dark:text-gray-400">
            <div className="flex items-center gap-1">
              <kbd className="rounded-none border-2 dark:text-black border-black bg-white px-2 py-1 font-bold">
                ↑↓
              </kbd>
              <span>Navigate</span>
            </div>
            <div className="flex items-center gap-1">
              <kbd className="rounded-none border-2 dark:text-black border-black bg-white px-2 py-1 font-bold">
                Enter
              </kbd>
              <span>Select</span>
            </div>
            <div className="flex items-center gap-1">
              <kbd className="rounded-none border-2 dark:text-black border-black bg-white px-2 py-1 font-bold">
                ESC
              </kbd>
              <span>Close</span>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
