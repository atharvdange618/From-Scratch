import { QueryClient } from "@tanstack/react-query";

let browserQueryClient: QueryClient | undefined = undefined;

/**
 * Create a new QueryClient instance with default configuration
 *
 * Default settings:
 * - staleTime: 5 minutes
 * - gcTime: 10 minutes
 * - retry: 3 attempts
 * - refetchOnWindowFocus: true
 * - refetchOnReconnect: true
 */
function makeQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 1000 * 60 * 5,
        gcTime: 1000 * 60 * 10,
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
}

/**
 * Get QueryClient instance
 */
export function getQueryClient() {
  if (typeof window === "undefined") {
    return makeQueryClient();
  } else {
    if (!browserQueryClient) {
      browserQueryClient = makeQueryClient();
    }
    return browserQueryClient;
  }
}
