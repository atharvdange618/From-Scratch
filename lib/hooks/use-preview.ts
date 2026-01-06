import { useQuery } from "@tanstack/react-query";

// Query Keys
export const previewKeys = {
  all: ["preview"] as const,
  token: (token: string) => [...previewKeys.all, token] as const,
};

// Types
interface PreviewPost {
  _id: string;
  slug: string;
  title: string;
  description: string;
  content: string;
  category: string;
  tags: string[];
  bannerImage?: string;
  published: boolean;
  createdAt: string;
  updatedAt: string;
  readingTime?: number;
}

/**
 * Fetch preview post by token
 * No caching for preview content to ensure latest changes are visible
 */
export function usePreviewQuery(token: string) {
  return useQuery({
    queryKey: previewKeys.token(token),
    queryFn: async (): Promise<PreviewPost> => {
      const response = await fetch(`/api/preview/${token}`);
      if (!response.ok) {
        throw new Error("Failed to fetch preview");
      }
      return response.json();
    },
    enabled: !!token,
    staleTime: 0, // Always fetch fresh data
    gcTime: 0, // Don't cache previews
  });
}
