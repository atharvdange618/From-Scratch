"use client";

import { useState, useEffect, useCallback, useRef, useMemo } from "react";
import { useRouter } from "next/navigation";
import Fuse from "fuse.js";
import { trackEvent } from "@/lib/analytics";
import { usePostsQuery } from "@/lib/hooks/use-posts";
import { useProjectsQuery } from "@/lib/hooks/use-projects";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Search, Clock } from "@deemlol/next-icons";
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
  score?: number;
}

interface GlobalSearchProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const RECENT_SEARCHES_KEY = "recentSearches";
const MAX_RECENT_SEARCHES = 5;

export function GlobalSearch({ open, onOpenChange }: GlobalSearchProps) {
  const [query, setQuery] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const router = useRouter();
  const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const { data: posts = [], isLoading: isLoadingPosts } = usePostsQuery();
  const { data: projects = [], isLoading: isLoadingProjects } =
    useProjectsQuery();

  const loading = isLoadingPosts || isLoadingProjects;

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

  const results = useMemo(() => {
    if (!query.trim()) {
      return [];
    }

    const postsFuse = new Fuse(posts, {
      keys: [
        { name: "title", weight: 2 },
        { name: "summary", weight: 1 },
        { name: "tags", weight: 1.5 },
        { name: "category", weight: 1 },
      ],
      threshold: 0.4,
      includeScore: true,
    });

    const projectsFuse = new Fuse(projects, {
      keys: [
        { name: "name", weight: 2 },
        { name: "description", weight: 1 },
        { name: "techStack", weight: 1.5 },
      ],
      threshold: 0.4,
      includeScore: true,
    });

    const postResults = postsFuse.search(query).map((result) => ({
      type: "post" as const,
      item: result.item,
      score: result.score,
    }));

    const projectResults = projectsFuse.search(query).map((result) => ({
      type: "project" as const,
      item: result.item,
      score: result.score,
    }));

    return [...postResults, ...projectResults]
      .sort((a, b) => (a.score || 0) - (b.score || 0))
      .slice(0, 10);
  }, [query, posts, projects]);

  useEffect(() => {
    if (!query.trim()) {
      setSelectedIndex(0);
      return;
    }

    setSelectedIndex(0);

    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    if (query.trim().length >= 2) {
      searchTimeoutRef.current = setTimeout(() => {
        trackEvent("search_query", {
          query: query.trim(),
          resultsCount: results.length,
        });
      }, 300);
    }
  }, [query, results.length]);

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
    [query, onOpenChange, router, saveRecentSearch]
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
          prev < results.length - 1 ? prev + 1 : prev
        );
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setSelectedIndex((prev) => (prev > 0 ? prev - 1 : prev));
      } else if (e.key === "Enter" && results[selectedIndex]) {
        e.preventDefault();
        handleSelect(results[selectedIndex]);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [open, results, selectedIndex, handleSelect]);

  useEffect(() => {
    if (!open) {
      setQuery("");
      setSelectedIndex(0);
    }
  }, [open]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl border-4 border-black bg-white p-0 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] sm:rounded-none">
        <DialogHeader className="border-b-4 border-black p-4">
          <DialogTitle className="sr-only">Search</DialogTitle>
          <div className="relative">
            <Search
              className={`absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 transition-colors ${
                loading ? "animate-pulse text-gray-400" : ""
              }`}
            />
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search posts and projects..."
              className="h-12 rounded-none border-none bg-transparent pl-12 pr-4 text-lg font-medium focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-offset-0"
              autoFocus
              aria-label="Search posts and projects"
            />
            {loading && query.trim() && (
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-gray-500">
                Searching...
              </span>
            )}
          </div>
        </DialogHeader>

        <div className="max-h-[60vh] overflow-y-auto">
          {loading ? (
            <div className="flex items-center justify-center p-8 text-gray-500">
              Loading...
            </div>
          ) : query.trim() ? (
            results.length > 0 ? (
              <div className="p-2">
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
                      className={`w-full rounded-none border-4 border-black p-4 text-left transition-all ${
                        index === selectedIndex
                          ? "bg-[#60B5FF] shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
                          : "bg-white hover:bg-[#AFDDFF]"
                      } ${index > 0 ? "mt-2" : ""}`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="min-w-0 flex-1">
                          <h3 className="truncate font-bold">{title}</h3>
                          <MarkdownRenderer
                            content={description}
                            className="mb-4 font-serif text-gray-700 prose-p:leading-relaxed prose-p:mb-0"
                            truncate={100}
                          />
                        </div>
                        <span
                          className={`shrink-0 rounded-none border-2 border-black px-2 py-1 text-xs font-bold ${
                            isPost
                              ? "bg-[#FF9149] text-white"
                              : "bg-[#E0FFF1] text-black"
                          }`}
                        >
                          {isPost ? "POST" : "PROJECT"}
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center p-12 text-gray-500">
                <div className="mb-4 rounded-full border-4 border-black bg-[#AFDDFF] p-4">
                  <Search className="h-12 w-12" />
                </div>
                <p className="mb-1 text-lg font-bold text-black">
                  No results found
                </p>
                <p className="text-sm">
                  Try a different search term or check your spelling
                </p>
                {query.length < 2 && (
                  <p className="mt-2 text-xs font-medium text-gray-600">
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
                    <h3 className="text-sm font-bold text-gray-600">
                      Recent Searches
                    </h3>
                    <button
                      onClick={clearRecentSearches}
                      className="text-xs font-medium text-gray-500 hover:text-black"
                    >
                      Clear all
                    </button>
                  </div>
                  <div className="space-y-2">
                    {recentSearches.map((search, index) => (
                      <button
                        key={index}
                        onClick={() => handleRecentSearchClick(search)}
                        className="flex w-full items-center gap-3 rounded-none border-2 border-black bg-white p-3 text-left font-medium transition-all hover:bg-[#AFDDFF] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
                      >
                        <Clock className="h-4 w-4 shrink-0" />
                        <span className="truncate">{search}</span>
                      </button>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-12 text-gray-500">
                  <div className="mb-4 rounded-full border-4 border-black bg-[#E0FFF1] p-4">
                    <Search className="h-12 w-12" />
                  </div>
                  <p className="mb-1 text-lg font-bold text-black">
                    Start typing to search
                  </p>
                  <p className="text-sm">
                    Search across all posts and projects
                  </p>
                  <div className="mt-4 flex gap-2 text-xs">
                    <kbd className="rounded border-2 border-black bg-white px-2 py-1 font-bold">
                      Ctrl
                    </kbd>
                    <span className="font-bold">+</span>
                    <kbd className="rounded border-2 border-black bg-white px-2 py-1 font-bold">
                      K
                    </kbd>
                    <span className="text-gray-600">to open anytime</span>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        <div className="border-t-4 border-black bg-[#FFECDB] p-3">
          <div className="flex flex-wrap gap-4 text-xs font-medium text-gray-600">
            <div className="flex items-center gap-1">
              <kbd className="rounded-none border-2 border-black bg-white px-2 py-1 font-bold">
                ↑↓
              </kbd>
              <span>Navigate</span>
            </div>
            <div className="flex items-center gap-1">
              <kbd className="rounded-none border-2 border-black bg-white px-2 py-1 font-bold">
                Enter
              </kbd>
              <span>Select</span>
            </div>
            <div className="flex items-center gap-1">
              <kbd className="rounded-none border-2 border-black bg-white px-2 py-1 font-bold">
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
