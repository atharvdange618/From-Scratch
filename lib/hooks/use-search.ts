import { useQuery } from "@tanstack/react-query";
import { useState, useEffect } from "react";

export const searchKeys = {
  all: ["search"] as const,
  query: (query: string) => [...searchKeys.all, query] as const,
};

// Types
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

export interface SearchResult {
  type: "post" | "project";
  item: Post | Project;
  score: number;
}

interface SearchResponse {
  results: SearchResult[];
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
export function useSearchQuery(query: string, debounceMs: number = 300) {
  const debouncedQuery = useDebounce(query, debounceMs);

  return useQuery({
    queryKey: searchKeys.query(debouncedQuery),
    queryFn: async (): Promise<SearchResult[]> => {
      const response = await fetch(
        `/api/search?q=${encodeURIComponent(debouncedQuery)}`,
      );
      if (!response.ok) {
        throw new Error("Failed to search");
      }
      const data: SearchResponse = await response.json();
      return data.results || [];
    },
    enabled: debouncedQuery.length >= 2,
    staleTime: 1000 * 60 * 2,
  });
}
