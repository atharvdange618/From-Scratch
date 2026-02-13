"use client";

import { QueryClientProvider } from "@tanstack/react-query";
import { getQueryClient } from "@/lib/query-client";

interface QueryProviderProps {
  children: React.ReactNode;
}

/**
 * QueryProvider wraps the app with QueryClientProvider for TanStack Query
 */
export function QueryProvider({ children }: QueryProviderProps) {
  const queryClient = getQueryClient();

  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
}
