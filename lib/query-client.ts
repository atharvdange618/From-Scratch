import { QueryClient } from "@tanstack/react-query";

/**
 * QueryClient configuration for TanStack Query
 *
 * Default settings:
 * - staleTime: 5 minutes - Data is fresh for 5 minutes before refetching
 * - gcTime: 10 minutes - Cache persists for 10 minutes after last usage
 * - retry: 3 attempts - Retry failed queries up to 3 times
 * - refetchOnWindowFocus: true - Refetch when window regains focus
 * - refetchOnReconnect: true - Refetch when network reconnects
 */
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      gcTime: 1000 * 60 * 10, // 10 minutes (formerly cacheTime)
      retry: 3,
      refetchOnWindowFocus: true,
      refetchOnReconnect: true,
      refetchOnMount: true,
    },
    mutations: {
      retry: 1,
    },
  },
});
