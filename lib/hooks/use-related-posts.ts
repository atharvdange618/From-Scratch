import { useQuery } from "@tanstack/react-query";
import { postKeys } from "./use-posts";

// Types
interface RelatedPost {
  _id: string;
  slug: string;
  title: string;
  description: string;
  category: string;
  tags: string[];
  bannerImage?: string;
  publishedDate?: string;
  readingTime?: number;
}

/**
 * Fetch related posts for a given post slug
 * Related posts are cached per slug
 */
export function useRelatedPostsQuery(slug: string, limit: number = 3) {
  return useQuery({
    queryKey: postKeys.related(slug),
    queryFn: async (): Promise<RelatedPost[]> => {
      const response = await fetch(`/api/posts/${slug}/related?limit=${limit}`);
      if (!response.ok) {
        throw new Error("Failed to fetch related posts");
      }
      return response.json();
    },
    enabled: !!slug,
    staleTime: 1000 * 60 * 10, // 10 minutes - related posts don't change often
  });
}
