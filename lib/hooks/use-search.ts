import { useQuery } from "@tanstack/react-query";
import { useState, useEffect } from "react";

// Query Keys
export const searchKeys = {
  all: ["search"] as const,
  query: (query: string) => [...searchKeys.all, query] as const,
};

// Types
interface SearchResult {
  posts: Array<{
    _id: string;
    slug: string;
    title: string;
    description: string;
    category: string;
    tags: string[];
    publishedDate?: string;
  }>;
  projects: Array<{
    _id: string;
    slug: string;
    title: string;
    description: string;
    tags: string[];
  }>;
}

/**
 * Custom hook for debounced value
 */
function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}

/**
 * Search posts and projects with debouncing
 * @param query - Search query string
 * @param debounceMs - Debounce delay in milliseconds (default: 500ms)
 */
export function useSearchQuery(query: string, debounceMs: number = 500) {
  const debouncedQuery = useDebounce(query, debounceMs);

  return useQuery({
    queryKey: searchKeys.query(debouncedQuery),
    queryFn: async (): Promise<SearchResult> => {
      const response = await fetch(
        `/api/search?q=${encodeURIComponent(debouncedQuery)}`
      );
      if (!response.ok) {
        throw new Error("Failed to search");
      }
      return response.json();
    },
    enabled: debouncedQuery.length > 0, // Only search if query is not empty
    staleTime: 1000 * 60 * 2, // 2 minutes - search results can be cached shorter
  });
}
